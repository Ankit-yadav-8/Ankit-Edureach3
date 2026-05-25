/* ============================================================
   searchIndex.js — a powerful, "AI-style" on-device search.
   ------------------------------------------------------------
   • Indexes EVERY college (IIT/NIT/IIIT), private university,
     exam, news item and tool — with rich, deep keywords
     (placements, packages, branches, recruiters, location…).
   • Understands natural-language queries like:
       "top iits with package above 20 lakh"
       "cse colleges in tamil nadu"
       "cheapest nits for electronics"
       "best private university for placements"
   • Ranks results with field-weighting + prefix + fuzzy matching.
   • Produces a Gemini-style one-paragraph answer summary.

   NOTE: This runs fully in the browser — no API key, works
   offline, instant. To wire a remote LLM later, call your API
   inside `answerFor()` and keep this as the retrieval layer.
   ============================================================ */

import { COLLEGES, BRANCHES } from "../data/colleges.js";
import { EXAMS } from "../data/exams.js";
import { NEWS } from "../data/news.js";
import { PRIVATE_UNIS } from "../data/counselling.js";
import { collegeBranches } from "./cutoffEngine.js";
import { fmtINR } from "./format.js";

/* ---------- small helpers ---------- */
const norm = (s) => (s || "").toString().toLowerCase();
const tokenize = (s) => norm(s).split(/[^a-z0-9]+/).filter((t) => t.length > 1);

// branch synonyms → canonical branch name fragments
const BRANCH_SYNONYMS = {
  cse: "computer", cs: "computer", computers: "computer", coding: "computer", software: "computer",
  it: "information technology",
  ece: "electronics", ec: "electronics", electronic: "electronics",
  ee: "electrical", eee: "electrical",
  me: "mechanical", mech: "mechanical",
  ce: "civil",
  che: "chemical", chem: "chemical",
  ai: "artificial intelligence", ml: "machine learning",
  bio: "biotech", biotech: "biotechnology",
};

const STATE_WORDS = [...new Set(COLLEGES.map((c) => norm(c.state)))];

const PKG_WORDS = ["package", "salary", "lpa", "ctc", "pay", "placement", "placements", "highest"];
const TOP_WORDS = ["top", "best", "premier", "leading", "good"];
const CHEAP_WORDS = ["cheap", "cheapest", "affordable", "budget"];

/* ---------- parse a natural-language query into filters ---------- */
function parseQuery(raw) {
  const q = norm(raw);
  const out = { type: null, branch: null, state: null, sort: null, minPkg: null, maxFees: null, cheap: false };

  if (/\biit/.test(q) && !/\biiit/.test(q)) out.type = "IIT";
  if (/\biiit/.test(q)) out.type = "IIIT";
  if (/\bnit/.test(q)) out.type = "NIT";
  if (/private|deemed|vit|bits|manipal|srm|amity|thapar/.test(q)) out.type = "Private";

  for (const [syn, canon] of Object.entries(BRANCH_SYNONYMS)) {
    if (new RegExp(`\\b${syn}\\b`).test(q)) { out.branch = canon; break; }
  }
  if (!out.branch) {
    const b = BRANCHES.find((br) =>
      q.includes(norm(br.name)) || new RegExp(`\\b${norm(br.code)}\\b`).test(q)
    );
    if (b) out.branch = norm(b.name);
  }

  const st = STATE_WORDS.find((s) => q.includes(s));
  if (st) out.state = st;

  const pkg = q.match(/(?:above|over|more than|min|atleast|at least|>)\s*₹?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|lpa|l|cr|crore)?/);
  if (pkg) {
    const v = parseFloat(pkg[1]);
    out.minPkg = /cr|crore/.test(pkg[2] || "") ? v * 1e7 : v * 1e5;
  }
  const fee = q.match(/(?:under|below|less than|max|<)\s*₹?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|l|cr|crore)?/);
  if (fee && /fee|fees|cost|cheap/.test(q)) {
    const v = parseFloat(fee[1]);
    out.maxFees = /cr|crore/.test(fee[2] || "") ? v * 1e7 : v * 1e5;
  }

  if (PKG_WORDS.some((w) => q.includes(w))) out.sort = "package";
  if (TOP_WORDS.some((w) => q.includes(w)) && !out.sort) out.sort = "nirf";
  if (CHEAP_WORDS.some((w) => q.includes(w))) { out.cheap = true; out.sort = "fees"; }

  return out;
}

/* ---------- build the index ---------- */
function feeTotal(c) {
  const f = c.fees || {};
  return (f.tuition || 0) + (f.hostel || 0) + (f.mess || 0) + (f.other || 0);
}

function buildIndex() {
  const idx = [];

  COLLEGES.forEach((c) => {
    const branches = collegeBranches(c).map((b) => `${b.name} ${b.code}`).join(" ");
    const recruiters = (c.placements?.recruiters || []).join(" ");
    const kw = [
      c.name, c.short, c.type, c.state, c.location, `nirf ${c.nirf}`,
      branches, recruiters, "engineering college btech",
      `package ${Math.round((c.placements?.avg || 0) / 1e5)} lakh`,
    ].join(" ");
    idx.push({
      kind: "College", type: c.type,
      title: c.name,
      sub: `${c.type} · NIRF #${c.nirf} · ${c.location}`,
      to: `/colleges/${c.slug}`,
      keywords: norm(kw),
      meta: {
        nirf: c.nirf, type: c.type, state: c.state, location: c.location,
        avg: c.placements?.avg, highest: c.placements?.highest,
        placed: c.placements?.placedPct, fees: feeTotal(c),
        recruiters: (c.placements?.recruiters || []).slice(0, 4),
      },
    });
  });

  PRIVATE_UNIS.forEach((u) => {
    idx.push({
      kind: "Private", type: "Private",
      title: u.name,
      sub: `Private University · ${u.state} · via ${u.exam}`,
      to: `/private/${u.slug}`,
      keywords: norm(`${u.name} ${u.short} ${u.state} ${u.exam} private deemed university ${(u.courses || []).join(" ")} package`),
      meta: {
        type: "Private", state: u.state,
        avg: u.placements?.avg, highest: u.placements?.highest, placed: u.placements?.placedPct,
        feesLabel: u.fees,
      },
    });
  });

  EXAMS.forEach((e) =>
    idx.push({
      kind: "Exam", type: null,
      title: e.name,
      sub: `${e.level} exam · ${e.body}`,
      to: `/exams/${e.slug}`,
      keywords: norm(`${e.name} ${e.full} ${e.body} ${e.level} entrance exam ${e.accepts || ""}`),
      meta: {},
    })
  );

  NEWS.forEach((n) =>
    idx.push({
      kind: "News", type: null,
      title: n.title,
      sub: `${n.date} · ${(n.tags || []).join(", ")}`,
      to: `/news/${n.slug}`,
      keywords: norm(`${n.title} ${(n.tags || []).join(" ")} ${n.excerpt}`),
      meta: {},
    })
  );

  [
    { title: "JEE Main Rank Predictor", sub: "Marks → predicted rank", to: "/jee-main#rank" },
    { title: "JEE Main College Predictor", sub: "Rank → eligible colleges", to: "/jee-main#college" },
    { title: "JEE Advanced Rank Predictor", sub: "Marks → IIT rank", to: "/jee-advanced#rank" },
    { title: "JEE Advanced College Predictor", sub: "Rank → IIT branches", to: "/jee-advanced#college" },
    { title: "College Explorer", sub: "Browse every IIT, NIT & IIIT", to: "/colleges" },
  ].forEach((t) =>
    idx.push({ ...t, kind: "Tool", type: null, keywords: norm(`${t.title} ${t.sub} predictor tool calculator`), meta: {} })
  );

  return idx;
}

let _cache = null;
const index = () => (_cache || (_cache = buildIndex()));

/* ---------- the search ---------- */
export function search(query, limit = 30) {
  const raw = (query || "").trim();
  if (!raw) return [];
  const q = norm(raw);
  const terms = tokenize(raw);
  const f = parseQuery(raw);

  const scored = index().map((item) => {
    const hay = item.keywords;
    let score = 0;

    if (hay.includes(q)) score += 8;
    if (norm(item.title) === q) score += 20;
    if (norm(item.title).startsWith(q)) score += 10;

    terms.forEach((t) => {
      if (norm(item.title).startsWith(t)) score += 5;
      if (norm(item.title).includes(t)) score += 4;
      if (hay.includes(t)) score += 2;
      else if (t.length >= 4 && hay.includes(t.slice(0, t.length - 1))) score += 1;
    });

    const m = item.meta || {};
    if (f.type && (item.kind === "College" || item.kind === "Private")) {
      if (item.type === f.type) score += 6; else score -= 4;
    }
    if (f.state && m.state && norm(m.state) === f.state) score += 5;
    if (f.branch && item.kind === "College" && item.keywords.includes(f.branch)) score += 5;
    if (f.minPkg && m.avg != null) { if (m.avg >= f.minPkg) score += 4; else score -= 6; }
    if (f.maxFees && m.fees != null) { if (m.fees <= f.maxFees) score += 4; else score -= 4; }

    return { item, score };
  }).filter((r) => r.score > 0);

  scored.sort((a, b) => {
    // when a specific type is requested, matching that type wins first
    if (f.type) {
      const am = (a.item.type === f.type) ? 1 : 0;
      const bm = (b.item.type === f.type) ? 1 : 0;
      if (am !== bm) return bm - am;
    }
    if (f.sort === "package") {
      const av = a.item.meta?.avg || 0, bv = b.item.meta?.avg || 0;
      if (bv !== av) return bv - av;
    } else if (f.sort === "nirf") {
      const an = a.item.meta?.nirf ?? 999, bn = b.item.meta?.nirf ?? 999;
      if (an !== bn && (a.item.meta?.nirf || b.item.meta?.nirf)) return an - bn;
    } else if (f.sort === "fees") {
      const af = a.item.meta?.fees ?? Infinity, bf = b.item.meta?.fees ?? Infinity;
      if (af !== bf) return af - bf;
    }
    return b.score - a.score;
  });

  return scored.slice(0, limit).map((r) => r.item);
}

/* ---------- Gemini-style answer summary ---------- */
export function answerFor(query, results) {
  const raw = (query || "").trim();
  if (!raw || !results.length) return null;
  const f = parseQuery(raw);
  const colleges = results.filter((r) => r.kind === "College" || r.kind === "Private");
  const bits = [];
  const typeLabel = f.type ? (f.type === "Private" ? "private universities" : `${f.type}s`) : "colleges";

  if (colleges.length) {
    let lead = `Found ${colleges.length} ${typeLabel}`;
    if (f.branch) lead += ` offering ${f.branch}`;
    if (f.state) lead += ` in ${f.state.replace(/\b\w/g, (ch) => ch.toUpperCase())}`;
    if (f.minPkg) lead += ` with average package above ${fmtINR(f.minPkg)}`;
    if (f.cheap) lead += `, sorted by lowest fees`;
    else if (f.sort === "package") lead += `, ranked by average package`;
    else if (f.sort === "nirf") lead += `, ranked by NIRF`;
    bits.push(lead + ".");

    const top = colleges[0];
    if (top?.meta) {
      const m = top.meta, parts = [];
      if (m.nirf) parts.push(`NIRF #${m.nirf}`);
      if (m.avg) parts.push(`avg package ${fmtINR(m.avg)}`);
      if (m.placed) parts.push(`${m.placed}% placed`);
      if (parts.length) bits.push(`Top match: ${top.title} — ${parts.join(", ")}.`);
    }
  } else {
    bits.push(`Showing ${results.length} result${results.length > 1 ? "s" : ""} for "${raw}".`);
  }
  bits.push("Tip: try “top NITs with package above 15 lakh” or “CSE colleges in Tamil Nadu”.");
  return bits.join(" ");
}

export { buildIndex };
