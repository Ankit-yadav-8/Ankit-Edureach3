/* ============================================================
   genSitemap.mjs — builds a sitemap index + per-type child
   sitemaps in public/ from the shared route list.

   Run:  npm run sitemap     (also runs automatically on build)

   Output:
     public/sitemap.xml          ← sitemap index (points to the rest)
     public/sitemap-static.xml
     public/sitemap-colleges.xml
     public/sitemap-neet.xml
     public/sitemap-branches.xml
     public/sitemap-exams.xml
     public/sitemap-news.xml
     public/sitemap-blog.xml

   Add static routes / data-driven routes in scripts/routes.mjs —
   both the sitemap and the prerenderer read from there.
   ============================================================ */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { SITE, routeGroups } from "./routes.mjs";

const today = new Date().toISOString().slice(0, 10);
const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = (f) => resolve(__dirname, "../public", f);

const urlXml = ([loc, priority, changefreq]) =>
  `  <url>\n` +
  `    <loc>${SITE}${loc}</loc>\n` +
  `    <lastmod>${today}</lastmod>\n` +
  `    <changefreq>${changefreq}</changefreq>\n` +
  `    <priority>${priority}</priority>\n` +
  `  </url>`;

const urlsetXml = (urls) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(urlXml).join("\n") +
  `\n</urlset>\n`;

const groups = routeGroups().filter((g) => g.urls.length);
let total = 0;

// child sitemaps
for (const g of groups) {
  writeFileSync(pub(`sitemap-${g.name}.xml`), urlsetXml(g.urls), "utf8");
  total += g.urls.length;
}

// sitemap index
const index =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  groups
    .map(
      (g) =>
        `  <sitemap>\n` +
        `    <loc>${SITE}/sitemap-${g.name}.xml</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `  </sitemap>`
    )
    .join("\n") +
  `\n</sitemapindex>\n`;
writeFileSync(pub("sitemap.xml"), index, "utf8");

console.log(
  `sitemap index + ${groups.length} child sitemaps written (${total} URLs) -> public/`
);
