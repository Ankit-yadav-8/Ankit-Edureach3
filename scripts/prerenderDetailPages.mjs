/* ============================================================
   prerenderDetailPages.mjs — ultrafast static HTML generation
   for dynamic detail pages (/colleges/:slug, /neet-colleges/:slug,
   /branches/:slug).

   Runs in ~1-2 seconds directly on Node without Puppeteer/Chrome,
   ensuring that 100% of college and branch pages have:
     1. Unique Title & Description
     2. Self-referential Canonical URL (prevents GSC de-indexing)
     3. Schema.org JSON-LD Structured Data
     4. Real crawlable HTML DOM (H1, location, seats, stats, tables)
     5. Instant FCP for users before React hydration
   ============================================================ */

import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { COLLEGES } from "../src/data/colleges.js";
import { NEET_COLLEGES } from "../src/data/neetColleges.js";
import { BRANCHES } from "../src/data/branches.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const SITE = "https://campuspoint.in";

const escapeHtml = (str) =>
  String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const fmtINR = (n) => {
  if (n == null || isNaN(n)) return "-";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} LPA`;
  return `₹${n.toLocaleString("en-IN")}`;
};

function replaceMeta(html, { title, description, canonical, jsonLd, bodyContent }) {
  let res = html;

  // Replace Title
  res = res.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // Replace or inject Canonical
  if (/<link rel="canonical"/i.test(res)) {
    res = res.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
  } else {
    res = res.replace(/<\/head>/i, `  <link rel="canonical" href="${canonical}" />\n</head>`);
  }

  // Replace or inject Description
  if (/<meta name="description"/i.test(res)) {
    res = res.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  }

  // Replace OpenGraph meta
  res = res.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  res = res.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  res = res.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`);

  // Replace Twitter meta
  res = res.replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  res = res.replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);

  // Inject JSON-LD right before </head>
  if (jsonLd) {
    const jsonLdScript = `\n  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>\n`;
    res = res.replace(/<\/head>/i, `${jsonLdScript}</head>`);
  }

  // Inject semantic initial HTML into <div id="root">...</div>
  if (bodyContent) {
    res = res.replace(
      /<div id="root">[\s\S]*?<\/body>/i,
      `<div id="root">\n${bodyContent}\n  </div>\n</body>`
    );
  }

  return res;
}

async function writePage(subPath, content) {
  const targetDir = join(DIST, subPath);
  await mkdir(targetDir, { recursive: true });
  await writeFile(join(targetDir, "index.html"), content, "utf8");
}

async function main() {
  const indexHtmlPath = join(DIST, "index.html");
  if (!existsSync(indexHtmlPath)) {
    console.error("dist/index.html not found! Run `vite build` first.");
    process.exit(1);
  }

  const baseHtml = await readFile(indexHtmlPath, "utf8");
  console.log("Generating static detail pages for SEO & Google Search Console indexing...");

  let neetCount = 0;
  let collegeCount = 0;
  let branchCount = 0;

  // 1. NEET Medical Colleges
  for (const c of NEET_COLLEGES) {
    const slug = c.slug;
    const place = [c.district, c.state].filter(Boolean).join(", ");
    const mgmt = c.govt ? "Government" : c.management;
    const title = `${c.name} - MBBS Seats, NEET Cutoff, Fees & Admission 2026 | CampusPoint`;
    const description = `${c.name} (${place}) - ${mgmt} MBBS medical college with ${c.seats || "-"} approved MBBS seats${c.university ? `, affiliated to ${c.university}` : ""}. NEET UG admission, cutoffs, fee structure & review on CampusPoint.`;
    const canonical = `${SITE}/neet-colleges/${slug}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollegeOrUniversity",
          "@id": `${canonical}#college`,
          name: c.name,
          url: canonical,
          description: description,
          ...(c.year ? { foundingDate: String(c.year) } : {}),
          address: {
            "@type": "PostalAddress",
            addressLocality: c.district || c.state,
            addressRegion: c.state,
            addressCountry: "IN",
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "NEET Medical Colleges", item: `${SITE}/neet-colleges` },
            { "@type": "ListItem", position: 3, name: c.name, item: canonical },
          ],
        },
      ],
    };

    const bodyContent = `
    <header style="background: linear-gradient(135deg,#0d2a20,#0d0d1f); color:#fff; padding:60px 20px 40px; font-family:sans-serif;">
      <div style="max-width:1100px; margin:0 auto;">
        <nav style="font-size:13px; color:rgba(255,255,255,0.7); margin-bottom:16px;">
          <a href="/" style="color:#fff; text-decoration:none;">Home</a> &rsaquo;
          <a href="/neet-colleges" style="color:#fff; text-decoration:none;">NEET Colleges</a> &rsaquo;
          <span>${escapeHtml(c.name)}</span>
        </nav>
        <div style="display:inline-block; background:rgba(21,160,110,0.2); border:1px solid rgba(21,160,110,0.5); color:#34d399; font-weight:700; font-size:12px; padding:4px 12px; border-radius:999px; margin-bottom:12px;">
          ${escapeHtml(mgmt)} MBBS Institute &bull; ${escapeHtml(c.state)}
        </div>
        <h1 style="font-size:2rem; font-weight:800; margin:0 0 12px; line-height:1.2;">${escapeHtml(c.name)}</h1>
        <p style="font-size:1rem; color:rgba(255,255,255,0.85); margin:0 0 24px; max-width:800px; line-height:1.6;">
          ${escapeHtml(description)}
        </p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-top:24px;">
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">MBBS Seats</div>
            <div style="font-size:1.6rem; font-weight:800; color:#34d399;">${c.seats || "-"}</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">Management</div>
            <div style="font-size:1.4rem; font-weight:700; color:#fff;">${escapeHtml(mgmt)}</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">Established</div>
            <div style="font-size:1.4rem; font-weight:700; color:#fb923c;">${c.year || "-"}</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">State / Location</div>
            <div style="font-size:1.2rem; font-weight:700; color:#fff;">${escapeHtml(place)}</div>
          </div>
        </div>
      </div>
    </header>
    <main style="max-width:1100px; margin:40px auto; padding:0 20px; font-family:sans-serif; color:#1f2937;">
      <section style="background:#fff; border-radius:16px; border:1px solid #e5e7eb; padding:28px; box-shadow:0 4px 20px rgba(0,0,0,0.04); margin-bottom:32px;">
        <h2 style="font-size:1.4rem; font-weight:700; margin-top:0;">About ${escapeHtml(c.name)}</h2>
        <p style="font-size:1rem; line-height:1.7; color:#4b5563;">
          ${escapeHtml(c.name)} is ${c.govt ? "a premier government" : `a recognized ${mgmt.toLowerCase()}`} medical college situated in ${escapeHtml(place)}.
          It operates with an approved annual intake of <strong>${c.seats || "NMC-approved"} MBBS seats</strong>.
          ${c.university ? `The college is affiliated to ${escapeHtml(c.university)}.` : ""}
          Admission to the MBBS programme is strictly conducted based on candidates' NEET UG rank through MCC (All India 15% Quota) and State Quota (85%) counselling sessions.
        </p>
      </section>
    </main>`;

    const html = replaceMeta(baseHtml, {
      title,
      description,
      canonical,
      jsonLd,
      bodyContent,
    });

    await writePage(`neet-colleges/${slug}`, html);
    neetCount++;
  }

  // 2. Engineering Colleges (/colleges/:slug)
  for (const c of COLLEGES) {
    const slug = c.slug;
    const loc = c.location || `${c.city || ""}, ${c.state || ""}`;
    const title = `${c.name} - Cutoffs, Placements, Fees & Reviews | CampusPoint`;
    const description = `Explore ${c.name} (${loc}). Check JoSAA opening and closing ranks, average package (${fmtINR(c.placements?.avg)}), top recruiters, fees and student reviews on CampusPoint.`;
    const canonical = `${SITE}/colleges/${slug}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollegeOrUniversity",
          "@id": `${canonical}#college`,
          name: c.name,
          url: canonical,
          description: c.about || description,
          address: {
            "@type": "PostalAddress",
            addressLocality: c.city || c.location,
            addressRegion: c.state,
            addressCountry: "IN",
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Engineering Colleges", item: `${SITE}/colleges` },
            { "@type": "ListItem", position: 3, name: c.name, item: canonical },
          ],
        },
      ],
    };

    const feeTotal = c.fees ? Object.values(c.fees).reduce((a, b) => a + b, 0) : null;

    const bodyContent = `
    <header style="background: linear-gradient(135deg,#1e1b4b,#0f172a); color:#fff; padding:60px 20px 40px; font-family:sans-serif;">
      <div style="max-width:1100px; margin:0 auto;">
        <nav style="font-size:13px; color:rgba(255,255,255,0.7); margin-bottom:16px;">
          <a href="/" style="color:#fff; text-decoration:none;">Home</a> &rsaquo;
          <a href="/colleges" style="color:#fff; text-decoration:none;">Colleges</a> &rsaquo;
          <span>${escapeHtml(c.name)}</span>
        </nav>
        <div style="display:inline-block; background:rgba(249,115,22,0.2); border:1px solid rgba(249,115,22,0.5); color:#fb923c; font-weight:700; font-size:12px; padding:4px 12px; border-radius:999px; margin-bottom:12px;">
          ${escapeHtml(c.type)} &bull; NIRF #${c.nirf || "-"} &bull; ${escapeHtml(loc)}
        </div>
        <h1 style="font-size:2rem; font-weight:800; margin:0 0 12px; line-height:1.2;">${escapeHtml(c.name)}</h1>
        <p style="font-size:1rem; color:rgba(255,255,255,0.85); margin:0 0 24px; max-width:800px; line-height:1.6;">
          ${escapeHtml(c.about || description)}
        </p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-top:24px;">
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">Average Package</div>
            <div style="font-size:1.6rem; font-weight:800; color:#34d399;">${fmtINR(c.placements?.avg)}</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">Highest Package</div>
            <div style="font-size:1.4rem; font-weight:700; color:#fff;">${fmtINR(c.placements?.highest)}</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">Placement %</div>
            <div style="font-size:1.4rem; font-weight:700; color:#fb923c;">${c.placements?.placedPct ? `${c.placements.placedPct}%` : "-"}</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">Annual Fees (Approx)</div>
            <div style="font-size:1.2rem; font-weight:700; color:#fff;">${feeTotal ? fmtINR(feeTotal) : "-"}</div>
          </div>
        </div>
      </div>
    </header>
    <main style="max-width:1100px; margin:40px auto; padding:0 20px; font-family:sans-serif; color:#1f2937;">
      <section style="background:#fff; border-radius:16px; border:1px solid #e5e7eb; padding:28px; box-shadow:0 4px 20px rgba(0,0,0,0.04); margin-bottom:32px;">
        <h2 style="font-size:1.4rem; font-weight:700; margin-top:0;">Admission & Placements at ${escapeHtml(c.name)}</h2>
        <p style="font-size:1rem; line-height:1.7; color:#4b5563;">
          ${escapeHtml(c.name)} is one of India's premier engineering institutions located in ${escapeHtml(loc)}.
          Admission is processed through <strong>${escapeHtml(c.counsellingExam || "JoSAA / CSAB Counselling")}</strong> based on JEE ranks.
          With a high placement rate of ${c.placements?.placedPct || 90}% and average compensation of ${fmtINR(c.placements?.avg)}, top recruiters include ${escapeHtml(c.placements?.recruiters?.slice(0, 5).join(", ") || "leading global tech companies")}.
        </p>
      </section>
    </main>`;

    const html = replaceMeta(baseHtml, {
      title,
      description,
      canonical,
      jsonLd,
      bodyContent,
    });

    await writePage(`colleges/${slug}`, html);
    collegeCount++;
  }

  // 3. Engineering Branches (/branches/:slug)
  for (const b of BRANCHES) {
    const slug = b.slug;
    const title = `${b.name} - Engineering Scope, Average Packages & Top Colleges | CampusPoint`;
    const description = `Explore ${b.name} branch guide. Check average packages (${b.stats?.medianSalary || "-"}), career scope, core vs software opportunities and top IIT/NIT colleges offering ${b.name} on CampusPoint.`;
    const canonical = `${SITE}/branches/${slug}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Course",
          "@id": `${canonical}#branch`,
          name: b.name,
          description: b.desc || description,
          url: canonical,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Branches", item: `${SITE}/branches` },
            { "@type": "ListItem", position: 3, name: b.name, item: canonical },
          ],
        },
      ],
    };

    const bodyContent = `
    <header style="background: linear-gradient(135deg,#0c4a6e,#0f172a); color:#fff; padding:60px 20px 40px; font-family:sans-serif;">
      <div style="max-width:1100px; margin:0 auto;">
        <nav style="font-size:13px; color:rgba(255,255,255,0.7); margin-bottom:16px;">
          <a href="/" style="color:#fff; text-decoration:none;">Home</a> &rsaquo;
          <a href="/branches" style="color:#fff; text-decoration:none;">Branches</a> &rsaquo;
          <span>${escapeHtml(b.name)}</span>
        </nav>
        <div style="display:inline-block; background:rgba(14,165,233,0.2); border:1px solid rgba(14,165,233,0.5); color:#38bdf8; font-weight:700; font-size:12px; padding:4px 12px; border-radius:999px; margin-bottom:12px;">
          Engineering Branch Guide &bull; ${escapeHtml(b.category || "Technology")}
        </div>
        <h1 style="font-size:2rem; font-weight:800; margin:0 0 12px; line-height:1.2;">${escapeHtml(b.name)}</h1>
        <p style="font-size:1rem; color:rgba(255,255,255,0.85); margin:0 0 24px; max-width:800px; line-height:1.6;">
          ${escapeHtml(b.desc || description)}
        </p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-top:24px;">
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">Median Salary</div>
            <div style="font-size:1.6rem; font-weight:800; color:#38bdf8;">${b.stats?.medianSalary || "-"}</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">Job Growth</div>
            <div style="font-size:1.4rem; font-weight:700; color:#fff;">${b.stats?.jobGrowth || "-"}</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase;">Colleges Offering</div>
            <div style="font-size:1.4rem; font-weight:700; color:#fb923c;">${b.branchCount || "10+"} Institutes</div>
          </div>
        </div>
      </div>
    </header>
    <main style="max-width:1100px; margin:40px auto; padding:0 20px; font-family:sans-serif; color:#1f2937;">
      <section style="background:#fff; border-radius:16px; border:1px solid #e5e7eb; padding:28px; box-shadow:0 4px 20px rgba(0,0,0,0.04); margin-bottom:32px;">
        <h2 style="font-size:1.4rem; font-weight:700; margin-top:0;">Career Scope & Curriculum for ${escapeHtml(b.name)}</h2>
        <p style="font-size:1rem; line-height:1.7; color:#4b5563;">
          ${escapeHtml(b.academics?.summary || b.desc)}
        </p>
      </section>
    </main>`;

    const html = replaceMeta(baseHtml, {
      title,
      description,
      canonical,
      jsonLd,
      bodyContent,
    });

    await writePage(`branches/${slug}`, html);
    branchCount++;
  }

  console.log(`Prerender complete: ${neetCount} NEET colleges, ${collegeCount} engineering colleges, ${branchCount} branches written to dist/!`);
}

main().catch((err) => {
  console.error("Prerender detail pages error:", err);
  process.exit(1);
});
