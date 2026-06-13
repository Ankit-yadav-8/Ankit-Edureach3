/* ============================================================
   genSitemap.mjs — builds public/sitemap.xml from site data.

   Run:  npm run sitemap     (also runs automatically on build)

   Add new static routes to STATIC_ROUTES below. College / exam /
   news pages are generated automatically from the data files, so
   new colleges show up in the sitemap with no extra work.
   ============================================================ */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { COLLEGES } from "../src/data/colleges.js";
import { EXAMS } from "../src/data/exams.js";
import { NEWS } from "../src/data/news.js";

const SITE = "https://collegeparichay.in";
const today = new Date().toISOString().slice(0, 10);

// [path, priority, changefreq]
const STATIC_ROUTES = [
  ["/", "1.0", "daily"],
  ["/colleges", "0.9", "daily"],
  ["/jee-main", "0.9", "weekly"],
  ["/jee-advanced", "0.9", "weekly"],
  ["/for-you", "0.9", "weekly"],
  ["/shortlist", "0.7", "weekly"],
  ["/compare", "0.7", "weekly"],
  ["/cutoffs", "0.8", "weekly"],
  ["/exams", "0.8", "weekly"],
  ["/compare-exams", "0.6", "monthly"],
  ["/josaa-2026", "0.8", "daily"],
  ["/planner", "0.6", "weekly"],
  ["/map", "0.6", "monthly"],
  ["/scholarships", "0.6", "monthly"],
  ["/jee-resources", "0.6", "weekly"],
  ["/neet", "0.7", "weekly"],
  ["/mentorship", "0.7", "weekly"],
  ["/how-to-use", "0.4", "monthly"],
  ["/about", "0.5", "monthly"],
];

const urls = [];

const add = (loc, priority, changefreq, lastmod = today) =>
  urls.push({ loc: SITE + loc, priority, changefreq, lastmod });

// Static pages
for (const [path, priority, changefreq] of STATIC_ROUTES) {
  add(path, priority, changefreq);
}

// College detail pages — the long-tail that ranks for "<college> cutoff/review"
for (const c of COLLEGES) {
  if (c?.slug) add(`/colleges/${c.slug}`, "0.8", "weekly");
}

// Exam pages
for (const e of EXAMS) {
  if (e?.slug) add(`/exams/${e.slug}`, "0.7", "weekly");
}

// News / updates pages
for (const n of NEWS) {
  if (n?.slug) add(`/news/${n.slug}`, "0.6", "weekly");
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${u.loc}</loc>\n` +
        `    <lastmod>${u.lastmod}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`
    )
    .join("\n") +
  `\n</urlset>\n`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(out, xml, "utf8");

console.log(`sitemap.xml written with ${urls.length} URLs -> ${out}`);
