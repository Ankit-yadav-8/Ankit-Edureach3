/* ============================================================
   prerender.mjs — build-time static prerender.

   Serves the built dist/ and drives headless Chrome over every
   route from routes.mjs, then writes the fully-rendered HTML to
   dist/<route>/index.html. Search engines get real content
   (title, meta, JSON-LD, headings, text, links) without having
   to execute the SPA's JavaScript. The app still boots on load,
   so the pages remain fully interactive.

   Run:  node scripts/prerender.mjs        (needs dist/ from vite build)

   Env:
     PUPPETEER_EXECUTABLE_PATH  use a specific Chrome (local dev)
     PRERENDER_CONCURRENCY      parallel pages (default 6)
     PRERENDER_LIMIT            cap route count (for testing)
   ============================================================ */

import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { allPaths, SITE, STATIC_ROUTES } from "./routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const PORT = Number(process.env.PRERENDER_PORT || 4599);
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY || 6);
const LIMIT = process.env.PRERENDER_LIMIT ? Number(process.env.PRERENDER_LIMIT) : Infinity;

/* Launch Chrome. On Vercel/AWS Lambda the build container lacks the system
   shared libraries the bundled Chrome needs (libnspr4.so, …), so there we use
   @sparticuz/chromium's self-contained binary via puppeteer-core. Locally we
   use the bundled `puppeteer` so `node scripts/prerender.mjs` needs no setup. */
async function launchBrowser() {
  const baseArgs = [
    "--no-sandbox", "--disable-setuid-sandbox",
    "--disable-dev-shm-usage", "--disable-gpu",
  ];
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless && !process.env.PUPPETEER_EXECUTABLE_PATH) {
    const [{ default: chromium }, { default: puppeteer }] = await Promise.all([
      import("@sparticuz/chromium"),
      import("puppeteer-core"),
    ]);
    return puppeteer.launch({
      headless: true,
      executablePath: await chromium.executablePath(),
      args: [...chromium.args, ...baseArgs],
      defaultViewport: chromium.defaultViewport,
    });
  }

  const { default: puppeteer } = await import("puppeteer");
  return puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: baseArgs,
  });
}

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2",
  ".ttf": "font/ttf", ".map": "application/json", ".xml": "application/xml",
  ".txt": "text/plain", ".webmanifest": "application/manifest+json", ".avif": "image/avif",
};

/* Static file server with SPA fallback: real files for asset paths,
   the SPA shell (index.html) for any extension-less route. */
function startServer() {
  const indexHtml = resolve(DIST, "index.html");
  return new Promise((res) => {
    const srv = createServer(async (req, resp) => {
      try {
        const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        const ext = extname(urlPath);
        if (ext) {
          const f = join(DIST, urlPath);
          if (existsSync(f)) {
            resp.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
            return resp.end(await readFile(f));
          }
          resp.writeHead(404);
          return resp.end("not found");
        }
        resp.writeHead(200, { "Content-Type": "text/html" });
        resp.end(await readFile(indexHtml));
      } catch (e) {
        resp.writeHead(500);
        resp.end(String(e));
      }
    });
    srv.listen(PORT, () => res(srv));
  });
}

/* Third-party hosts we don't need while capturing HTML — blocking them
   speeds up prerender and avoids hangs waiting on external beacons. */
const BLOCK = ["googletagmanager.com", "google-analytics.com", "analytics", "razorpay.com", "doubleclick.net"];

const IMG_FONT_MEDIA = new Set(["image", "media", "font"]);

/* Create a page and boot the SPA once (on "/"). Subsequent routes reuse it
   via client-side navigation, so the 1.9 MB bundle only parses once per worker. */
async function newBootedPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setRequestInterception(true);
  page.on("request", (r) => {
    const url = r.url();
    if (BLOCK.some((h) => url.includes(h))) return r.abort();
    if (IMG_FONT_MEDIA.has(r.resourceType())) return r.abort(); // DOM text unaffected; big speedup
    r.continue();
  });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector("#root > *", { timeout: 15000 }).catch(() => {});
  return page;
}

async function writeRoute(route, html) {
  const rel = route === "/" ? "index.html" : join(route.replace(/^\//, ""), "index.html");
  const outFile = join(DIST, rel);
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, html, "utf8");
}

/* One worker: boots a page, then walks its shard via SPA navigation. The
   per-route canonical <link> (set by the Seo component) is the "route rendered"
   signal. Recycles the page every RECYCLE routes to keep memory flat. */
async function processShard(browser, routes, onDone) {
  const RECYCLE = Number(process.env.PRERENDER_RECYCLE || 200);
  let page = await newBootedPage(browser);
  let n = 0;
  for (const route of routes) {
    try {
      const expected = SITE + (route === "/" ? "/" : route);
      await page.evaluate((r) => {
        window.history.pushState({}, "", r);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }, route);
      // wait until the Seo effect has swapped the canonical to this route's URL
      await page
        .waitForFunction(
          (url) => {
            const c = document.querySelector('link[rel="canonical"]');
            return c && c.href === url;
          },
          { timeout: 12000 },
          expected
        )
        .catch(() => {});
      await new Promise((r) => setTimeout(r, 60)); // settle JSON-LD injection
      await writeRoute(route, await page.content());
      onDone(route, true);
    } catch (e) {
      onDone(route, false, e.message);
    }
    if (++n % RECYCLE === 0) {
      await page.close().catch(() => {});
      page = await newBootedPage(browser);
    }
  }
  await page.close().catch(() => {});
}

async function main() {
  if (!existsSync(resolve(DIST, "index.html"))) {
    console.error("dist/index.html not found — run `vite build` first.");
    process.exit(1);
  }

  let routes = [...new Set(["/", ...STATIC_ROUTES.map(r => r[0])])]
    .filter((r) => !/^\/(admin|dashboard|search)(\/|$)/.test(r))
    .slice(0, LIMIT);

  const server = await startServer();
  const browser = await launchBrowser();

  console.log(`Prerendering ${routes.length} routes @ concurrency ${CONCURRENCY}…`);
  let done = 0, failed = 0;
  const failures = [];
  const onDone = (route, ok, err) => {
    done++;
    if (!ok) { failed++; failures.push(`${route} — ${err}`); }
    if (done % 50 === 0 || done === routes.length) console.log(`  ${done}/${routes.length} (${failed} failed)`);
  };

  // round-robin routes into CONCURRENCY shards; each worker boots the app once
  const shards = Array.from({ length: CONCURRENCY }, () => []);
  routes.forEach((r, i) => shards[i % CONCURRENCY].push(r));
  await Promise.all(shards.map((shard) => processShard(browser, shard, onDone)));

  await browser.close();
  server.close();

  console.log(`\nPrerender complete: ${routes.length - failed}/${routes.length} pages written to dist/.`);
  if (failures.length) {
    console.log(`${failed} routes fell back to the SPA shell (still work client-side):`);
    failures.slice(0, 20).forEach((f) => console.log(`  ✗ ${f}`));
  }
}

main();
