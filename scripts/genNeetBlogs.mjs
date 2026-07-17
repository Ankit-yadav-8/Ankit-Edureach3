/* ============================================================
   genNeetBlogs.mjs — build src/data/neetBlogs.js from the
   markdown cluster in content/neet-blogs/.

   Run:  node scripts/genNeetBlogs.mjs

   Parses each post's YAML frontmatter + markdown body into a
   rich block array ({ type: h2|h3|p|ul, ... } with inline spans
   for text / bold / italic / links). Internal links are remapped
   to the site's real routes:
     · sibling blog slugs  ->  /blog/<slug>
     · /neet-college-predictor -> /neet
     · /neet-counseling        -> /mentorship
   ============================================================ */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolve(__dirname, "../content/neet-blogs");
const OUT = resolve(__dirname, "../src/data/neetBlogs.js");
const PUBLISH_DATE = "2026-07-01";
/* The NEET-2026 result cluster is tied to the 16 July result — it must not
   inherit the evergreen cluster's July-1 date. */
const RESULT_CLUSTER_DATE = "2026-07-17";

/* Per-slug card presentation (icon + accent must exist in the blog ICONS/ACCENTS maps) */
const META = {
  "neet-marks-vs-college":          { icon: "Gauge",             accent: "coral",  badge: "GUIDE",     tag: "NEET 2026" },
  "neet-counseling-process":        { icon: "ListChecks",        accent: "blue",   badge: "EXPLAINER", tag: "Counseling" },
  "govt-vs-private-medical-college": { icon: "GitCompareArrows", accent: "green",  badge: "COMPARE",   tag: "MBBS" },
  "drop-year-for-neet":             { icon: "Brain",             accent: "violet", badge: "DECISION",  tag: "Drop Year" },
  "neet-category-cutoffs":          { icon: "Layers",            accent: "amber",  badge: "EXPLAINER", tag: "Cutoffs" },
  "low-neet-score-options":         { icon: "TrendingUp",        accent: "green",  badge: "OPTIONS",   tag: "Low Score" },
  "neet-counseling-mistakes":       { icon: "ShieldCheck",       accent: "coral",  badge: "GUIDE",     tag: "Mistakes" },
  "first-year-mbbs":                { icon: "BookOpen",          accent: "blue",   badge: "STORY",     tag: "MBBS Life" },
  "cheapest-mbbs-colleges":         { icon: "Building2",         accent: "amber",  badge: "BUDGET",    tag: "Fees" },
  "neet-rank-predictor-guide":      { icon: "Gauge",             accent: "violet", badge: "TOOL",      tag: "Predictor" },

  /* ── NEET 2026 result cluster (16 July result) ── */
  "neet-ug-result-2026":                                  { icon: "Trophy",     accent: "coral",  badge: "RESULT OUT", tag: "NEET 2026",      date: RESULT_CLUSTER_DATE },
  "what-to-do-after-neet-result-2026":                    { icon: "ListChecks", accent: "blue",   badge: "ROADMAP",    tag: "NEET 2026",      date: RESULT_CLUSTER_DATE },
  "expected-neet-cutoff-2026-government-medical-colleges": { icon: "Gauge",     accent: "amber",  badge: "CUTOFFS",    tag: "Cutoffs",        date: RESULT_CLUSTER_DATE },
  "top-government-medical-colleges-neet-2026":            { icon: "Building2",  accent: "green",  badge: "COMPARE",    tag: "MBBS Colleges",  date: RESULT_CLUSTER_DATE },
  "neet-counselling-2026-guide":                          { icon: "Layers",     accent: "violet", badge: "GUIDE",      tag: "Counselling",    date: RESULT_CLUSTER_DATE },
};

const BLOG_SLUGS = new Set(Object.keys(META));

/* Remap an internal href to the site's real routes. */
function rewriteHref(href) {
  if (!href.startsWith("/")) return href; // external / anchor
  const slug = href.replace(/^\//, "").replace(/[#?].*$/, "");
  if (BLOG_SLUGS.has(slug)) return "/blog/" + slug;
  if (slug === "neet-college-predictor" || slug === "neet-rank-predictor") return "/neet";
  if (slug === "neet-counseling") return "/mentorship";
  return href;
}

/* ---- YAML-ish frontmatter parser (flat keys + one [array] field) ---- */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let [, key, val] = kv;
    val = val.trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      fm[key] = val.slice(1, -1).split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else {
      fm[key] = val.replace(/^["']|["']$/g, "");
    }
  }
  return { fm, body: m[2] };
}

/* ---- inline markdown -> spans ({t}|{b}|{i}|{l,h}) ---- */
function parseInline(str) {
  const spans = [];
  const re = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) spans.push({ t: str.slice(last, m.index) });
    if (m[1]) spans.push({ b: m[2] });
    else if (m[3]) spans.push({ l: m[4], h: rewriteHref(m[5]) });
    else if (m[6]) spans.push({ i: m[7] });
    else if (m[8]) spans.push({ b: m[9] });
    last = re.lastIndex;
  }
  if (last < str.length) spans.push({ t: str.slice(last) });
  return spans.length ? spans : [{ t: str }];
}

/* Strip markdown to plain text (headings). */
function plain(str) {
  return str
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

/* Split a markdown table row into trimmed cells. */
function splitRow(line) {
  return line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
}
const isTableSep = (line) => /^\s*\|?[\s:-]*-[-\s:|]*\|?\s*$/.test(line) && line.includes("-");

/* ---- markdown body -> block array ---- */
function parseBody(md) {
  const lines = md.split("\n");
  const blocks = [];
  let para = [];      // buffered paragraph lines
  let list = null;    // buffered list items
  let table = null;   // buffered table rows
  let note = null;    // buffered blockquote lines

  const flushPara = () => {
    if (para.length) { blocks.push({ type: "p", s: parseInline(para.join(" ").trim()) }); para = []; }
  };
  const flushList = () => {
    if (list && list.length) { blocks.push({ type: "ul", items: list.map((li) => parseInline(li)) }); }
    list = null;
  };
  /* A table needs a header + at least one body row; the |---| separator is dropped. */
  const flushTable = () => {
    if (table && table.length >= 2) {
      const [head, ...rest] = table.filter((r) => !isTableSep(r.join("|")));
      if (rest.length) {
        blocks.push({
          type: "table",
          head: head.map((c) => parseInline(c)),
          rows: rest.map((r) => r.map((c) => parseInline(c))),
        });
      }
    }
    table = null;
  };
  const flushNote = () => {
    if (note && note.length) { blocks.push({ type: "note", s: parseInline(note.join(" ").trim()) }); }
    note = null;
  };
  const flushAll = () => { flushPara(); flushList(); flushTable(); flushNote(); };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) { flushAll(); continue; }

    if (/^#\s+/.test(line)) { flushAll(); continue; }       // H1 = title, skip
    if (/^###\s+/.test(line)) { flushAll(); blocks.push({ type: "h3", t: plain(line.replace(/^###\s+/, "")) }); continue; }
    if (/^##\s+/.test(line))  { flushAll(); blocks.push({ type: "h2", t: plain(line.replace(/^##\s+/, "")) }); continue; }

    /* Table row — buffer until a blank line or another block type ends it. */
    if (/^\s*\|/.test(line)) { flushPara(); flushList(); flushNote(); (table ||= []).push(splitRow(line)); continue; }

    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) { flushPara(); flushTable(); flushNote(); (list ||= []).push(li[1].trim()); continue; }

    // ordered list item -> treat as list too
    const oli = line.match(/^\s*\d+\.\s+(.*)$/);
    if (oli) { flushPara(); flushTable(); flushNote(); (list ||= []).push(oli[1].trim()); continue; }

    /* Blockquote -> callout note. */
    if (/^>\s?/.test(line)) { flushPara(); flushList(); flushTable(); (note ||= []).push(line.replace(/^>\s?/, "")); continue; }

    flushList(); flushTable(); flushNote();
    para.push(line.trim());
  }
  flushAll();
  return blocks;
}

/* ---- build all posts ---- */
const files = readdirSync(SRC_DIR).filter((f) => /^\d\d-.*\.md$/.test(f)).sort();
const posts = [];

for (const file of files) {
  const raw = readFileSync(resolve(SRC_DIR, file), "utf8");
  const { fm, body } = parseFrontmatter(raw);
  const slug = fm.slug;
  const meta = META[slug];
  if (!meta) { console.warn(`! no META for ${slug} (${file}) — skipping`); continue; }

  posts.push({
    slug,
    title: fm.title,
    snippet: fm.meta_description,
    metaDescription: fm.meta_description,
    focusKeyword: fm.focus_keyword,
    secondaryKeywords: fm.secondary_keywords || [],
    category: "NEET",
    categoryLabel: fm.category || "NEET Counseling",
    author: fm.author || "College Parichay Counselling Desk",
    date: meta.date || PUBLISH_DATE,
    read: fm.read_time ? `${fm.read_time} read` : "8 min read",
    iconName: meta.icon,
    accent: meta.accent,
    badge: meta.badge,
    tag: meta.tag,
    body: parseBody(body),
  });
}

/* Newest first, so the result cluster leads the NEET section on /blog.
   Array#sort is stable, so same-date posts keep their filename order. */
posts.sort((a, b) => b.date.localeCompare(a.date));

const banner =
  `/* neetBlogs.js — AUTO-GENERATED by scripts/genNeetBlogs.mjs from\n` +
  `   content/neet-blogs/*.md. Do not edit by hand; edit the markdown and\n` +
  `   re-run the generator. Each post carries SEO fields (metaDescription,\n` +
  `   focusKeyword, secondaryKeywords) plus a rich \`body\` block array. */\n\n`;

writeFileSync(OUT, banner + `export const NEET_BLOG_POSTS = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
console.log(`neetBlogs.js written with ${posts.length} posts -> ${OUT}`);
