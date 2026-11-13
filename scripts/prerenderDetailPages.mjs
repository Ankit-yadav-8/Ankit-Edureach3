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

  // 4. Mentorship Core Pages (Pillar & Topical Cluster)
  let mentorshipCount = 0;
  const MENTORSHIP_STATIC_PAGES = [
    {
      subPath: "jee-mentorship",
      title: "Best JEE Mentorship Program 2026–2027 | 1-on-1 Guidance by IITians - CampusPoint",
      description: "Get 1-on-1 JEE Mentorship by verified IIT Roorkee rankers. Daily personalized study plans, question-level mock test error autopsy, 70-30 backlog formula & 24/7 WhatsApp guidance. Enroll at ₹3,499.",
      canonical: `${SITE}/jee-mentorship`,
      h1: "Personalized 1-on-1 JEE Mentorship Program by Verified IITians",
      sub: "Stop getting lost in giant batches. Get paired 1-on-1 with an IIT Roorkee mentor who designs your daily study schedule, analyzes every mock test error, clears backlogs, and guides your step-by-step strategy for JEE Main & JEE Advanced."
    },
    {
      subPath: "jee-mentorship/1-to-1",
      title: "1-on-1 JEE Mentorship by Verified IITians | Personal Mentoring – CampusPoint",
      description: "Experience genuine 1-on-1 JEE mentorship by top IITians. Private weekly video calls, customized daily study plans, 24/7 WhatsApp guidance, and individual error reviews.",
      canonical: `${SITE}/jee-mentorship/1-to-1`,
      h1: "Private 1-on-1 JEE Mentorship by Verified IITians",
      sub: "Get an individual IITian mentor who works with you personally every single week. No generic batch advice."
    },
    {
      subPath: "jee-mentorship/iitian-mentor",
      title: "JEE Mentorship by IITians | Top Rankers from IIT Roorkee – CampusPoint",
      description: "Learn directly from verified IITians. 1-to-1 JEE mentorship by top rankers from IIT Roorkee and premier IITs. Authentic preparation strategies, daily tracking, and exam hacks.",
      canonical: `${SITE}/jee-mentorship/iitian-mentor`,
      h1: "Genuine JEE Mentorship by IITians & Top Rankers",
      sub: "Work directly with engineering mentors from IIT Roorkee and IIT Bombay who cleared JEE Advanced with top AIR ranks."
    },
    {
      subPath: "jee-mentorship/jee-main",
      title: "JEE Main Mentorship Program | 99+ Percentile Strategy – CampusPoint",
      description: "Target 99+ percentile in JEE Main with 1-on-1 IITian mentorship. Speed hacks, chapter weightage triage, computer-based mock test error autopsy, and daily timetable.",
      canonical: `${SITE}/jee-mentorship/jee-main`,
      h1: "Target 99+ Percentile with Dedicated JEE Main Mentorship",
      sub: "Optimize your exam speed, question selection, and negative-marking reduction with verified IITian rankers."
    },
    {
      subPath: "jee-mentorship/jee-advanced",
      title: "JEE Advanced Mentorship Program | Top 1000 AIR Strategy – CampusPoint",
      description: "Crack JEE Advanced with 1-on-1 IITian mentorship. Multi-concept problem derivation, deep analytical temperament, and previous year question mastery.",
      canonical: `${SITE}/jee-mentorship/jee-advanced`,
      h1: "Dominate JEE Advanced with 1-on-1 IITian Mentorship",
      sub: "Transition from basic formulas to multi-concept Advanced questions with weekly guidance from IIT rankers."
    },
    {
      subPath: "jee-mentorship/test-analysis",
      title: "Mock Test Mistake Autopsy & Error Analysis | JEE Mentorship – CampusPoint",
      description: "Stop repeating the same test mistakes. Question-by-question mock test autopsy analyzing silly slips, conceptual gaps, time allocation, and remedial problem sets.",
      canonical: `${SITE}/jee-mentorship/test-analysis`,
      h1: "Question-Level Mock Test Error Autopsy for JEE",
      sub: "Convert every negative mark into a score improvement plan with diagnostic mistake spreadsheets and mentor audits."
    },
    {
      subPath: "jee-mentorship/droppers",
      title: "JEE Droppers Mentorship Program | Repeater Recovery Strategy – CampusPoint",
      description: "Dedicated 1-on-1 JEE mentorship for droppers and repeaters. Eliminate past exam trauma, high-yield 8-month syllabus completion, and daily accountability.",
      canonical: `${SITE}/jee-mentorship/droppers`,
      h1: "Dedicated 1-on-1 JEE Mentorship for Droppers & Repeaters",
      sub: "Turn your drop year into a top IIT rank with a realistic 8-month master schedule and personal mentor check-ins."
    },
    {
      subPath: "jee-mentorship/class-11",
      title: "Class 11 JEE Mentorship | Foundation & Slump Prevention – CampusPoint",
      description: "Master Class 11 with 1-to-1 JEE mentorship by top IITians. Overcome the 10th-to-11th transition, prevent backlogs, balance school, and build a rock-solid foundation.",
      canonical: `${SITE}/jee-mentorship/class-11`,
      h1: "Personalized Class 11 JEE Mentorship & Foundation",
      sub: "Never let backlogs pile up in Class 11. Protect your mechanics and bonding fundamentals with a verified IITian mentor."
    },
    {
      subPath: "jee-mentorship/class-12",
      title: "Class 12 JEE Mentorship | Boards + JEE Main & Advanced – CampusPoint",
      description: "Balance Class 12 CBSE boards and JEE Advanced preparation with 1-on-1 IITian mentorship. Syllabus finish by October, test series strategy, and revision.",
      canonical: `${SITE}/jee-mentorship/class-12`,
      h1: "Personalized Class 12 JEE Mentorship & Strategy",
      sub: "Finish your Class 12 syllabus by October while maintaining 85%+ in school boards and sharp problem-solving for JEE."
    }
  ];

  for (const page of MENTORSHIP_STATIC_PAGES) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          name: "CampusPoint 1-on-1 JEE Mentorship Program",
          image: "https://campuspoint.in/icons/icon-512x512.png",
          description: page.description,
          brand: {
            "@type": "Brand",
            name: "CampusPoint"
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            bestRating: "5",
            ratingCount: "264",
            reviewCount: "182"
          },
          offers: {
            "@type": "Offer",
            price: "3499",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: page.canonical
          }
        },
        {
          "@type": "EducationalOccupationalProgram",
          name: page.h1,
          description: page.description,
          provider: {
            "@type": "EducationalOrganization",
            name: "CampusPoint",
            url: "https://campuspoint.in"
          },
          educationalProgramMode: "Online",
          offers: {
            "@type": "Offer",
            price: "3499",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: page.canonical
          }
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is the CampusPoint JEE Mentorship Program?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The CampusPoint JEE Mentorship Program provides dedicated 1-to-1 personal guidance by top IITians (from IIT Roorkee and premier IITs) for students preparing for JEE Main and JEE Advanced. Includes daily customized study plans, question-level test error autopsy, weekly strategy reviews, backlog recovery, and 24/7 WhatsApp doubt guidance."
              }
            },
            {
              "@type": "Question",
              name: "Which is the best mentorship program for JEE Main & Advanced?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "CampusPoint is rated the #1 JEE Mentorship program (4.9/5 from 260+ enrolled aspirants) because mentors are verified IIT Roorkee and top IIT rankers who cleared JEE under recent NTA patterns. Rather than generic topper advice, students get individualized question-level test diagnostics, daily schedule tracking, and direct WhatsApp access to their mentor."
              }
            },
            {
              "@type": "Question",
              name: "How does a 1-to-1 JEE mentor help increase mock test scores by 40–70 marks?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Most students study 8–10 hours daily but stay stuck at score plateaus due to negative marking slips and untested silly mistakes. An IITian mentor analyzes your test question-by-question, classifies every mark lost into conceptual vs execution error, and assigns targeted 30-problem fix decks."
              }
            },
            {
              "@type": "Question",
              name: "What is the cost of the CampusPoint JEE Mentorship Program?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our comprehensive JEE Mentorship program is priced transparently at ₹3,499 valid till JEE Mains (or 6 months of daily intensive 1-on-1 guidance), with zero hidden renewal fees."
              }
            }
          ]
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "JEE Mentorship", item: `${SITE}/jee-mentorship` },
            ...(page.subPath !== "jee-mentorship" ? [{ "@type": "ListItem", position: 3, name: page.h1, item: page.canonical }] : [])
          ]
        }
      ]
    };

    const bodyContent = `
    <!-- Announcement TopBar -->
    <div style="background:#FF693D; color:#fff; font-size:12px; font-weight:700; padding:8px 16px; text-align:center; letter-spacing:0.04em; font-family:sans-serif;">
      Built by IITians &bull; Trusted by Aspirants
    </div>

    <!-- Main Navbar -->
    <header style="background:#FFFFFF; border-bottom:1px solid #E4DED2; padding:12px 24px; font-family:sans-serif;">
      <div style="max-width:1160px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:32px; height:32px; border-radius:8px; background:#FF693D; display:grid; place-items:center; color:#fff; font-weight:800; font-size:12px;">CP</div>
          <span style="font-weight:800; font-size:17px; color:#1C1C28;">Campus Point</span>
        </div>
        <nav style="display:flex; gap:18px; font-size:13.5px; font-weight:600; color:#4B5563;">
          <a href="/jee-main" style="color:inherit; text-decoration:none;">JEE</a>
          <a href="/neet" style="color:inherit; text-decoration:none;">NEET</a>
          <a href="/jee-mentorship" style="color:#FF693D; text-decoration:none; font-weight:700;">Mentorship</a>
          <a href="/colleges" style="color:inherit; text-decoration:none;">Colleges</a>
          <a href="/tools" style="color:inherit; text-decoration:none;">Tools</a>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section style="background: #FCFBF9; border-bottom: 1px solid #E4DED2; padding: 72px 20px 56px; font-family: sans-serif; text-align: center;">
      <div style="max-width: 920px; margin: 0 auto;">
        <nav style="font-size: 13px; color: #64748B; margin-bottom: 20px;">
          <a href="/" style="color: #64748B; text-decoration: none;">Home</a> &rsaquo;
          <a href="/jee-mentorship" style="color: #64748B; text-decoration: none;">JEE Mentorship</a>
          ${page.subPath !== "jee-mentorship" ? `&rsaquo; <span style="color: #111827;">${escapeHtml(page.h1)}</span>` : ""}
        </nav>
        <h1 style="font-size: clamp(2.2rem, 5vw, 3.2rem); font-weight: 800; color: #111827; margin: 0 auto 20px; line-height: 1.15; letter-spacing: -0.02em;">
          ${escapeHtml(page.h1)}
        </h1>
        <p style="font-size: 1.1rem; color: #4B5563; margin: 0 auto 32px; max-width: 760px; line-height: 1.6;">
          ${escapeHtml(page.sub)}
        </p>
        <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
          <a href="/jee-mentorship" style="background: #FF693D; color: #fff; padding: 14px 30px; border-radius: 50px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 10px 24px -8px rgba(255,105,61,0.5);">
            Enroll in JEE Mentorship &bull; ₹3,499 &rarr;
          </a>
          <a href="https://wa.me/918118826194?text=Hi%20CampusPoint,%20I%20want%20to%20know%20more%20about%20JEE%20Mentorship" target="_blank" rel="noopener noreferrer" style="background: #FFFFFF; color: #1F2937; border: 1px solid #E5E7EB; padding: 14px 26px; border-radius: 50px; font-weight: 600; font-size: 15px; text-decoration: none;">
            Talk to Mentor on WhatsApp
          </a>
        </div>
      </div>
    </section>

    <main style="max-width: 1100px; margin: 40px auto; padding: 0 20px; font-family: sans-serif; color: #1F2937;">
      <!-- 6 Core Pillars -->
      <section style="background: #FFFFFF; border-radius: 18px; border: 1px solid #E5E7EB; padding: 32px 28px; margin-bottom: 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #111827; margin-top: 0; margin-bottom: 20px;">
          6 Core Pillars of CampusPoint 1-on-1 JEE Mentorship
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div style="background: #F8FAFC; padding: 20px; border-radius: 14px; border: 1px solid #E2E8F0;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; color: #D8512A;">1. Dedicated Personal IITian Mentor</h3>
            <p style="font-size: 0.92rem; color: #475569; line-height: 1.5; margin: 0;">
              Paired 1-on-1 with an IIT Roorkee or top IIT ranker who cleared JEE Advanced under recent NTA patterns. Weekly private 1-on-1 video calls & daily WhatsApp guidance.
            </p>
          </div>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 14px; border: 1px solid #E2E8F0;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; color: #0EA5E9;">2. Customized Daily Study Timetables</h3>
            <p style="font-size: 0.92rem; color: #475569; line-height: 1.5; margin: 0;">
              Realistic daily problem-solving targets balancing Physics, Chemistry, and Mathematics based on your school and coaching hours.
            </p>
          </div>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 14px; border: 1px solid #E2E8F0;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; color: #10B981;">3. Question-Level Mock Test Error Autopsy</h3>
            <p style="font-size: 0.92rem; color: #475569; line-height: 1.5; margin: 0;">
              Evaluates every negative mark, time spent per question, and conceptual traps to convert test mistakes into an actionable weekly remedy checklist.
            </p>
          </div>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 14px; border: 1px solid #E2E8F0;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; color: #8B5CF6;">4. Proven 70-30 Backlog Eradication</h3>
            <p style="font-size: 0.92rem; color: #475569; line-height: 1.5; margin: 0;">
              70% study time stays dedicated to ongoing class topics, while 30% systematically eliminates high-yield pending chapters without panic.
            </p>
          </div>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 14px; border: 1px solid #E2E8F0;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; color: #F59E0B;">5. Exam Temperament & 3-Pass Strategy</h3>
            <p style="font-size: 0.92rem; color: #475569; line-height: 1.5; margin: 0;">
              Master time management, trap question skipping, and multi-pass paper solving to maximize score under intense examination pressure.
            </p>
          </div>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 14px; border: 1px solid #E2E8F0;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; color: #EC4899;">6. Verified Founders from IIT Roorkee</h3>
            <p style="font-size: 0.92rem; color: #475569; line-height: 1.5; margin: 0;">
              Founded and guided by Ankit Kumar (AIR 3846 CRL), Saket Kumar, and Mayank Singh from IIT Roorkee. Over 260+ serious aspirants guided nationwide.
            </p>
          </div>
        </div>
      </section>

      <!-- Head to Head Table -->
      <section style="background: #FFFFFF; border-radius: 18px; border: 1px solid #E5E7EB; padding: 32px 28px; margin-bottom: 32px;">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #111827; margin-top: 0; margin-bottom: 16px;">
          Traditional Coaching Batches vs CampusPoint 1-on-1 Mentorship
        </h2>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background: #F8FAFC; border-bottom: 2px solid #E2E8F0; text-align: left;">
                <th style="padding: 12px 14px; color: #1E293B;">Feature</th>
                <th style="padding: 12px 14px; color: #64748B;">Traditional Coaching</th>
                <th style="padding: 12px 14px; color: #FF693D;">CampusPoint 1-on-1 Mentorship</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 12px 14px; font-weight: 700;">Student-to-Mentor Ratio</td>
                <td style="padding: 12px 14px; color: #64748B;">1 teacher for 150–300 students</td>
                <td style="padding: 12px 14px; font-weight: 700; color: #D8512A;">1 dedicated IITian mentor for 1 student</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 12px 14px; font-weight: 700;">Study Timetable</td>
                <td style="padding: 12px 14px; color: #64748B;">Generic batch timeline</td>
                <td style="padding: 12px 14px; color: #1E293B;">Personalized daily schedule customized to student pace</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 12px 14px; font-weight: 700;">Mock Test Feedback</td>
                <td style="padding: 12px 14px; color: #64748B;">Score & rank only</td>
                <td style="padding: 12px 14px; color: #1E293B;">Question-level autopsy: silly slips vs concept gaps</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 12px 14px; font-weight: 700;">Backlog Clearance</td>
                <td style="padding: 12px 14px; color: #64748B;">Student left to figure out alone</td>
                <td style="padding: 12px 14px; color: #1E293B;">Systematic 70-30 recovery roadmap with weekend sprints</td>
              </tr>
              <tr>
                <td style="padding: 12px 14px; font-weight: 700;">Fee</td>
                <td style="padding: 12px 14px; color: #64748B;">₹1,50,000 – ₹3,00,000 / year</td>
                <td style="padding: 12px 14px; font-weight: 800; color: #16A34A;">₹3,499 one-time till JEE Mains</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Topic Cluster Links -->
      <section style="background: #F8FAFC; border-radius: 18px; border: 1px solid #E2E8F0; padding: 28px; margin-bottom: 32px;">
        <h2 style="font-size: 1.3rem; font-weight: 800; color: #111827; margin-top: 0; margin-bottom: 16px;">
          Specialized JEE Mentorship Guides
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
          <a href="/jee-mentorship/jee-main" style="background:#fff; border:1px solid #E2E8F0; padding:12px 16px; border-radius:10px; color:#1E293B; text-decoration:none; font-weight:600; font-size:14px; display:block;">&bull; JEE Main Mentorship (99%ile)</a>
          <a href="/jee-mentorship/jee-advanced" style="background:#fff; border:1px solid #E2E8F0; padding:12px 16px; border-radius:10px; color:#1E293B; text-decoration:none; font-weight:600; font-size:14px; display:block;">&bull; JEE Advanced IIT Strategy</a>
          <a href="/jee-mentorship/1-to-1" style="background:#fff; border:1px solid #E2E8F0; padding:12px 16px; border-radius:10px; color:#1E293B; text-decoration:none; font-weight:600; font-size:14px; display:block;">&bull; Private 1-on-1 Mentorship</a>
          <a href="/jee-mentorship/iitian-mentor" style="background:#fff; border:1px solid #E2E8F0; padding:12px 16px; border-radius:10px; color:#1E293B; text-decoration:none; font-weight:600; font-size:14px; display:block;">&bull; Mentorship by IITians</a>
          <a href="/jee-mentorship/droppers" style="background:#fff; border:1px solid #E2E8F0; padding:12px 16px; border-radius:10px; color:#1E293B; text-decoration:none; font-weight:600; font-size:14px; display:block;">&bull; Droppers & Repeaters Strategy</a>
          <a href="/jee-mentorship/test-analysis" style="background:#fff; border:1px solid #E2E8F0; padding:12px 16px; border-radius:10px; color:#1E293B; text-decoration:none; font-weight:600; font-size:14px; display:block;">&bull; Mock Test Mistake Autopsy</a>
          <a href="/jee-mentorship/class-11" style="background:#fff; border:1px solid #E2E8F0; padding:12px 16px; border-radius:10px; color:#1E293B; text-decoration:none; font-weight:600; font-size:14px; display:block;">&bull; Class 11 Foundation</a>
          <a href="/jee-mentorship/class-12" style="background:#fff; border:1px solid #E2E8F0; padding:12px 16px; border-radius:10px; color:#1E293B; text-decoration:none; font-weight:600; font-size:14px; display:block;">&bull; Class 12 Boards + JEE Prep</a>
        </div>
      </section>
    </main>`;

    const html = replaceMeta(baseHtml, {
      title: page.title,
      description: page.description,
      canonical: page.canonical,
      jsonLd,
      bodyContent
    });

    await writePage(page.subPath, html);
    mentorshipCount++;
  }

  console.log(`Prerender complete: ${neetCount} NEET colleges, ${collegeCount} engineering colleges, ${branchCount} branches, ${mentorshipCount} mentorship pages written to dist/!`);
}

main().catch((err) => {
  console.error("Prerender detail pages error:", err);
  process.exit(1);
});
