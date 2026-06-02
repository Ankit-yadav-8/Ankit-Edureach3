/**
 * realCutoffEngine.js  (v4 — real JoSAA data, verified institute map)
 * Loads JoSAA cutoff CSVs (2018–2025) from /public/data/ and answers queries.
 * CSV columns: Institute | Academic Program Name | Quota | Seat Type | Gender |
 *              Opening Rank | Closing Rank | Round | Year
 */

import { COLLEGES } from "../data/colleges.js";

export const REAL_YEARS = ["2018","2019","2020","2021","2022","2023","2024","2025"];

const DB  = new Map();   // Map<year, Row[]>
let _loadPromise = null;
let _loaded      = false;
// ── Predictor-only 2024 fast loader state ────────────────────────────────────
let _predictorPromise = null;
let _predictorReady   = false;

// ── Caches (filled once DB is ready) ───────────────────────────────────────
const _progCache = new Map(); // slug → string[]
// Row index: college slug → rows belonging to that institute. Built once after
// the DB is ready so per-query helpers scan a few hundred rows for one college
// instead of re-matching all ~57k rows (with a regex) on every program/quota
// lookup. Without this, the Counselling Planner froze the page for 7–10s.
let _byCollege = null;
function invalidateCaches() {
  _progCache.clear();
  _byCollege = null;
}
function getCollegeRows(college) {
  if (!_byCollege) {
    if (!_loaded && !_predictorReady) return [];
    _byCollege = new Map();
    for (const [, rows] of DB) {
      for (const r of rows) {
        for (const c of COLLEGES) {
          if (matchInstitute(r, c)) {
            let bucket = _byCollege.get(c.slug);
            if (!bucket) { bucket = []; _byCollege.set(c.slug, bucket); }
            bucket.push(r);
          }
        }
      }
    }
  }
  return _byCollege.get(college.slug) ?? [];
}

// ── CSV parsing ─────────────────────────────────────────────────────────────
function parseLine(line) {
  const out = []; let cur = "", inQ = false;
  for (const ch of line) {
    if (ch === '"')         { inQ = !inQ; continue; }
    if (ch === "," && !inQ) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

const COL_ALIASES = {
  "institute":               "institute",
  "institute (program)":     "institute",
  "college":                 "institute",
  "academic program name":   "program",
  "program name":            "program",
  "branch":                  "program",
  "program":                 "program",
  "quota":                   "quota",
  "seat type":               "seatType",
  "category":                "seatType",
  "gender":                  "gender",
  "gender pool":             "gender",
  "opening rank":            "opening",
  "opening":                 "opening",
  "closing rank":            "closing",
  "closing":                 "closing",
  "round":                   "round",
  "round no":                "round",
  "round number":            "round",
};
const normHeaders = (h) => h.map((x) => COL_ALIASES[x.toLowerCase().trim()] ?? x.toLowerCase().trim());
const normGender  = (g) => {
  const s = (g ?? "").toLowerCase();
  return (s.includes("female") || s === "fo" || s.includes("girl")) ? "FO" : "GN";
};

function parseCSV(text, year) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = normHeaders(parseLine(lines[0]));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    if (vals.length < 5) continue;
    const o = {};
    headers.forEach((h, idx) => { o[h] = vals[idx] ?? ""; });
    const closing = parseInt(o.closing, 10);
    if (isNaN(closing) || closing <= 0) continue;
    const opening   = parseInt(o.opening, 10);
    const roundRaw  = String(o.round ?? "1").replace(/\D/g, "") || "1";
    rows.push({
      institute: (o.institute ?? "").trim(),
      program:   (o.program   ?? "").trim(),
      quota:     (o.quota     ?? "AI").trim().toUpperCase(),
      seatType:  (o.seatType  ?? "OPEN").trim().toUpperCase(),
      gender:    normGender(o.gender),
      opening:   isNaN(opening) ? closing : opening,
      closing,
      round: roundRaw,
      year,
    });
  }
  return rows;
}

async function fetchYear(year) {
  try {
    const r = await fetch(`/data/josaa_${year}.csv`);
    if (!r.ok) return [];
    return parseCSV(await r.text(), year);
  } catch { return []; }
}

async function fetchLegacyJSON() {
  try {
    const r = await fetch("/data/josaa_cutoffs.json");
    if (!r.ok) return [];
    const j   = await r.json();
    const raw = Array.isArray(j) ? j : Object.values(j).flat();
    return raw.map((x) => ({
      institute: String(x.institute ?? x.college ?? "").trim(),
      program:   String(x.program ?? x.academic_program_name ?? x.branch ?? "").trim(),
      quota:     String(x.quota ?? "AI").toUpperCase(),
      seatType:  String(x.seat_type ?? x.seatType ?? x.category ?? "OPEN").toUpperCase(),
      gender:    normGender(x.gender),
      opening:   parseInt(x.opening_rank ?? x.opening ?? 0, 10),
      closing:   parseInt(x.closing_rank ?? x.closing ?? 0, 10),
      round:     String(x.round ?? "1").replace(/\D/g, "") || "1",
      year:      String(x.year ?? "2023"),
    })).filter((r) => r.closing > 0);
  } catch { return []; }
}

export function loadCutoffDB() {
  if (_loadPromise) return _loadPromise;
  _loadPromise = (async () => {
    const [legacy, ...yearRows] = await Promise.all([
      fetchLegacyJSON(),
      ...REAL_YEARS.map(fetchYear),
    ]);
    for (const row of [...legacy, ...yearRows.flat()]) {
      if (!DB.has(row.year)) DB.set(row.year, []);
      DB.get(row.year).push(row);
    }
    _loaded = true;
    invalidateCaches();
  })();
  return _loadPromise;
}

export const isDBReady = () => _loaded;

// ── Predictor-only 2024 fast loader ─────────────────────────────────────────
// Fetches ONLY josaa_2024.csv. Used by the college predictor worker so it
// doesn't wait for all 8 years. Reuses the same DB map — if loadCutoffDB()
// already ran, rows are already there and this resolves instantly.
export function loadPredictorDB() {
  if (_predictorPromise) return _predictorPromise;
  _predictorPromise = fetchYear("2024")
    .then((rows) => {
      if (!DB.has("2024")) {
        // Full DB hasn't loaded yet — insert 2024 rows now
        for (const row of rows) {
          if (!DB.has(row.year)) DB.set(row.year, []);
          DB.get(row.year).push(row);
        }
      }
      // If full DB already loaded, 2024 rows are already present — skip insert
      _predictorReady = true;
      invalidateCaches();
    })
    .catch((err) => {
      console.error("[realCutoffEngine] 2024 fast load failed:", err);
      _predictorPromise = null; // allow retry on next call
    });
  return _predictorPromise;
}

export const isPredictorReady = () => _predictorReady;

/** Node/smoke-test hook: inject rows directly without fetch. */
export function _injectRows(rows) {
  for (const r of rows) {
    if (!DB.has(r.year)) DB.set(r.year, []);
    DB.get(r.year).push(r);
  }
  _loaded = true;
  invalidateCaches();
}

// ── Institute matching (slug → CSV-name substrings) ──────────────────────────
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();

const INSTITUTE_ALIASES = {
  // IIT aliases use full name prefix to prevent false matches with NIT/IIIT entries
  // e.g. "technology patna" would match NIT Patna; "technology guwahati" matches IIIT Guwahati
  "iit-madras":          ["indian institute of technology madras"],
  "iit-delhi":           ["indian institute of technology delhi"],
  "iit-bombay":          ["indian institute of technology bombay"],
  "iit-kanpur":          ["indian institute of technology kanpur"],
  "iit-kharagpur":       ["indian institute of technology kharagpur"],
  "iit-roorkee":         ["indian institute of technology roorkee"],
  "iit-guwahati":        ["indian institute of technology guwahati"],
  "iit-hyderabad":       ["indian institute of technology hyderabad"],
  "iit-bhu":             ["technology (bhu) varanasi"],
  "iit-ism-dhanbad":     ["technology (ism) dhanbad"],
  "iit-indore":          ["indian institute of technology indore"],
  "iit-gandhinagar":     ["indian institute of technology gandhinagar"],
  "iit-ropar":           ["indian institute of technology ropar"],
  "iit-patna":           ["indian institute of technology patna"],
  "iit-mandi":           ["indian institute of technology mandi"],
  "iit-jodhpur":         ["indian institute of technology jodhpur"],
  "iit-bhubaneswar":     ["indian institute of technology bhubaneswar"],
  "iit-tirupati":        ["indian institute of technology tirupati"],
  "iit-palakkad":        ["indian institute of technology palakkad"],
  "iit-jammu":           ["indian institute of technology jammu"],
  "iit-dharwad":         ["indian institute of technology dharwad"],
  "iit-bhilai":          ["indian institute of technology bhilai"],
  "iit-goa":             ["indian institute of technology goa"],
  "nit-trichy":          ["national institute of technology, tiruchirappalli"],
  "nit-rourkela":        ["national institute of technology, rourkela"],
  "nit-surathkal":       ["national institute of technology karnataka, surathkal"],
  "nit-warangal":        ["national institute of technology, warangal"],
  "nit-calicut":         ["national institute of technology calicut"],
  "nit-nagpur":          ["visvesvaraya national institute of technology, nagpur"],
  "mnit-jaipur":         ["malaviya national institute of technology jaipur"],
  "mnnit-allahabad":     ["motilal nehru national institute of technology allahabad"],
  "nit-kurukshetra":     ["national institute of technology, kurukshetra"],
  "svnit-surat":         ["sardar vallabhbhai national institute of technology, surat"],
  "nit-durgapur":        ["national institute of technology durgapur"],
  "manit-bhopal":        ["maulana azad national institute of technology bhopal"],
  "nit-silchar":         ["national institute of technology, silchar"],
  "nit-jalandhar":       ["ambedkar national institute of technology, jalandhar"],
  "nit-jamshedpur":      ["national institute of technology, jamshedpur"],
  "nit-hamirpur":        ["national institute of technology hamirpur"],
  "nit-raipur":          ["national institute of technology raipur"],
  "nit-patna":           ["national institute of technology patna"],
  "nit-ap":              ["national institute of technology, andhra pradesh"],
  "nit-agartala":        ["national institute of technology agartala"],
  "nit-srinagar":        ["national institute of technology, srinagar"],
  "nit-goa":             ["national institute of technology goa"],
  "nit-delhi":           ["national institute of technology delhi"],
  "nit-ap-puducherry":   ["national institute of technology puducherry"],
  "nit-meghalaya":       ["national institute of technology meghalaya"],
  "nit-arunachal":       ["national institute of technology arunachal pradesh"],
  "nit-manipur":         ["national institute of technology, manipur"],
  "nit-mizoram":         ["national institute of technology, mizoram"],
  "nit-nagaland":        ["national institute of technology nagaland"],
  "nit-sikkim":          ["national institute of technology sikkim"],
  "nit-uttarakhand":     ["national institute of technology, uttarakhand"],
  "iiit-allahabad":      ["information technology, allahabad"],
  "iiitm-gwalior":       ["atal bihari vajpayee indian institute of information technology"],
  "iiitdm-jabalpur":     ["design & manufacture jabalpur"],
  "iiitdm-kancheepuram": ["design & manufacturing, kancheepuram"],
  "iiit-bhubaneswar":    ["international institute of information technology, bhubaneswar"],
  "iiit-lucknow":        ["information technology lucknow"],
  "iiit-nagpur":         ["information technology (iiit) nagpur"],
  "iiit-pune":           ["information technology (iiit) pune"],
  "iiit-vadodara":       ["(iiit), vadodara, gujrat"],
  "iiit-kota":           ["(iiit)kota, rajasthan"],
  "iiit-guwahati":       ["information technology guwahati"],
  "iiit-kalyani":        ["(iiit) kalyani, west bengal"],
  "iiit-una":            ["(iiit) una, himachal"],
  "iiit-sonepat":        ["kilohrad, sonepat, haryana"],
  "iiit-sricity":        ["(iiit), sri city, chittoor"],
  "iiit-kottayam":       ["(iiit) kottayam"],
  "iiit-dharwad":        ["(iiit) dharwad"],
  "iiit-ranchi":         ["information technology (iiit) ranchi"],
  "iiit-surat":          ["information technology surat"],
  "iiit-bhagalpur":      ["information technology bhagalpur"],
  "iiit-trichy":         ["information technology tiruchirappalli", "srirangam, tiruchirappalli"],
};

function matchInstitute(row, college) {
  // Cache the normalized institute name on the row — matchInstitute is called
  // millions of times while building the index, once per (row × college).
  const inst    = row._inst ?? (row._inst = norm(row.institute));
  const aliases = INSTITUTE_ALIASES[college.slug];
  if (aliases) return aliases.some((a) => inst.includes(a));
  if (college.name && inst.includes(norm(college.name))) return true;
  return false;
}

// ── Program-name helpers ─────────────────────────────────────────────────────
function normProg(p) {
  return p.toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/b\.?tech\.?|b\.?e\.?/gi, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, " ").trim();
}
// Exact program match (whitespace/case-normalized on the FULL CSV program name).
// Used by getRealRounds so a base branch (e.g. "Computer Science and Engineering")
// never absorbs the rows of its specialisation variants ("…with Specialization in
// Cyber Security", "…(Data Science)", dual-degree, MBA combos). Those have much
// higher closing ranks, and getRealRounds aggregates with Math.max — so fuzzy
// matching was inflating cutoffs (e.g. IIT Patna CSE showed ~16444 instead of
// the real 3144). Every caller passes a verbatim CSV program string sourced from
// getRealPrograms()/findProgramByBranch(), so exact matching always resolves.
const _progKey = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();
function sameProgram(candidate, target) {
  return _progKey(candidate) === _progKey(target);
}

// ── Public API ────────────────────────────────────────────────────────────────
export function getRealPrograms(college) {
  if (_progCache.has(college.slug)) return _progCache.get(college.slug);
  const seen = new Set();
  for (const r of getCollegeRows(college)) seen.add(r.program);
  const list = [...seen].sort((a, b) => {
    const order = (s) => {
      const l = s.toLowerCase();
      if (l.includes("computer science"))        return 0;
      if (l.includes("information technology"))  return 1;
      if (l.includes("electronics and comm"))    return 2;
      if (l.includes("electrical"))              return 3;
      if (l.includes("mechanical"))              return 4;
      if (l.includes("civil"))                   return 5;
      if (l.includes("chemical"))                return 6;
      return 10;
    };
    // Deprioritise integrated / dual-degree / joint-MBA programs so the
    // standalone 4-year B.Tech wins the per-branch dedup in the predictor.
    // e.g. IIT Patna's "B.Tech (CSE) - MBA (IIM Bodh Gaya)" (flat closing 3427)
    // must NOT shadow the regular "Computer Science and Engineering" (≈3074).
    const joint = (s) =>
      /\bm\.?\s*tech\b|\bmba\b|\biim\b|dual degree|integrated/i.test(s) ? 1 : 0;
    const d = order(a) - order(b);
    if (d !== 0) return d;
    const j = joint(a) - joint(b);
    if (j !== 0) return j;
    return a.localeCompare(b);
  });
  if (_loaded || _predictorReady) _progCache.set(college.slug, list);
  return list;
}

export function getAvailableYears(college) {
  const rows = getCollegeRows(college);
  return REAL_YEARS.filter((yr) => rows.some((r) => r.year === yr));
}

// The all-India general pool is labelled "AI" in 2024 JoSAA data but "OS"
// (Other State — nationwide competition) in every other year for NITs/IIITs.
// The two never coexist for one institute in a single year, so they are
// treated as one logical pool: requesting either matches both. Without this,
// querying "AI" returns rows ONLY for 2024 and all other years appear empty.
const QUOTA_EQUIV = {
  AI: ["AI", "OS"],
  OS: ["AI", "OS"],
};
function quotaMatches(rowQuota, requested) {
  const eq = QUOTA_EQUIV[requested];
  return eq ? eq.includes(rowQuota) : rowQuota === requested;
}

export function getRealRounds(college, program, quota, seatType, year, gender = "GN") {
  const rows = getCollegeRows(college).filter((r) =>
    r.year === year &&
    sameProgram(r.program, program) &&
    quotaMatches(r.quota, quota) &&
    r.seatType === seatType &&
    r.gender   === gender
  );
  const byRound = new Map();
  for (const r of rows) {
    if (!byRound.has(r.round)) byRound.set(r.round, { opening: Infinity, closing: -Infinity });
    const e = byRound.get(r.round);
    e.opening = Math.min(e.opening, r.opening);
    e.closing = Math.max(e.closing, r.closing);
  }
  return [...byRound.entries()]
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([rnd, v]) => ({
      round:   `JR ${rnd}`,
      stage:   Number(rnd) > 6 ? "CSAB" : "JOSAA",
      opening: v.opening === Infinity  ? null : v.opening,
      closing: v.closing === -Infinity ? null : v.closing,
    }))
    .filter((r) => r.closing !== null);
}

export function getRealHistory(college, program, quota, seatType, gender = "GN") {
  return REAL_YEARS.flatMap((yr) => {
    const rnds = getRealRounds(college, program, quota, seatType, yr, gender);
    if (!rnds.length) return [];
    const r1 = rnds[0], rf = rnds[rnds.length - 1];
    return [{ year: yr, opening: r1.opening, closing: r1.closing, r6Close: rf.closing }];
  });
}

export function getRealForecast(college, program, quota, seatType, gender = "GN") {
  const history = getRealHistory(college, program, quota, seatType, gender);
  const pts = history.filter((h) => h.r6Close).map((h) => [Number(h.year), h.r6Close]);
  if (pts.length < 2) return null;
  const n   = pts.length;
  const sx  = pts.reduce((a, p) => a + p[0], 0);
  const sy  = pts.reduce((a, p) => a + p[1], 0);
  const sxy = pts.reduce((a, p) => a + p[0] * p[1], 0);
  const sxx = pts.reduce((a, p) => a + p[0] * p[0], 0);
  const denom = n * sxx - sx * sx;
  if (!denom) return null;
  const slope     = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  const nextYear  = pts[pts.length - 1][0] + 1;
  return {
    year:  nextYear,
    closing: Math.round(slope * nextYear + intercept),
    trend: slope < 0 ? "tightening" : "relaxing",
    slope: Math.round(slope),
    points: n,
  };
}

// General (non-home-state) pool quota for 2024+ JoSAA data is "AI" for all types.
export function getDefaultQuota() { return "AI"; }

const QUOTA_LABELS = {
  AI: "AI — All India",
  OS: "OS — Other State",
  HS: "HS — Home State",
  GO: "GO — Goa",
  LA: "LA — Ladakh",
  JK: "JK — J&K",
  AP: "AP — Andhra Pradesh",
  TL: "TL — Telangana",
};

export function getAvailableQuotas(college) {
  const seen = new Set();
  for (const r of getCollegeRows(college)) seen.add(r.quota);
  const out = [];
  // Collapse AI + OS into a single all-India general-pool option. They are
  // the same pool under different year-wise labels (AI in 2024, OS elsewhere),
  // and getRealRounds treats them as equivalent — so one option covers all years.
  if (seen.has("AI") || seen.has("OS")) {
    out.push({ value: "AI", label: "AI/OS — All India (General)" });
  }
  // Remaining quotas (HS, GO, JK, …) kept as distinct options.
  for (const q of [...seen].filter((q) => q && q !== "AI" && q !== "OS").sort()) {
    out.push({ value: q, label: QUOTA_LABELS[q] ?? q });
  }
  return out.length ? out : [{ value: "AI", label: QUOTA_LABELS.AI }];
}

const SHORT_OVERRIDES = [
  [/computer science and engineering/i,           "CSE"],
  [/computer science & engineering/i,             "CSE"],
  [/electronics and communication engineering/i,  "ECE"],
  [/electronics & communication engineering/i,    "ECE"],
  [/electrical and electronics engineering/i,     "EEE"],
  [/electrical engineering/i,                     "EE"],
  [/mechanical engineering/i,                     "ME"],
  [/civil engineering/i,                          "CE"],
  [/chemical engineering/i,                       "ChE"],
  [/metallurgical.*engineering/i,                 "Meta."],
  [/materials.*engineering/i,                     "Materials"],
  [/computer.*science.*information/i,             "CS & IT"],
  [/information technology/i,                     "IT"],
  [/artificial intelligence.*machine learning/i,  "AI & ML"],
  [/artificial intelligence.*data science/i,      "AI & DS"],
  [/artificial intelligence/i,                    "AI"],
  [/data science.*engineering/i,                  "DS & Engg."],
  [/data science/i,                               "Data Science"],
  [/engineering physics/i,                        "Engg. Physics"],
  [/mathematics.*computing/i,                     "Math & Computing"],
  [/mathematics/i,                                "Mathematics"],
  [/production.*industrial/i,                     "Prod. & Ind."],
  [/industrial.*production/i,                     "Ind. & Prod."],
  [/production engineering/i,                     "Production Engg."],
  [/industrial engineering/i,                     "Industrial Engg."],
  [/manufacturing engineering/i,                  "Manufacturing"],
  [/aerospace engineering/i,                      "Aerospace"],
  [/aeronautical engineering/i,                   "Aeronautical"],
  [/biotechnology/i,                              "BioTech"],
  [/biochemical engineering/i,                    "Biochem. Engg."],
  [/mining engineering/i,                         "Mining"],
  [/architecture/i,                               "Architecture"],
  [/ocean engineering/i,                          "Ocean Engg."],
  [/naval architecture/i,                         "Naval Arch."],
  [/environmental engineering/i,                  "Env. Engg."],
  [/geology/i,                                    "Geology"],
  [/geophysics/i,                                 "Geophysics"],
  [/textile technology/i,                         "Textile Tech."],
  [/textile engineering/i,                        "Textile Engg."],
  [/pharmaceutical/i,                             "Pharma."],
  [/rubber technology/i,                          "Rubber Tech."],
  [/polymer science/i,                            "Polymer Sci."],
  [/electronics.*instrumentation/i,               "E & I"],
  [/instrumentation/i,                            "Instrumentation"],
];

export function getProgramShortName(fullName) {
  for (const [re, short] of SHORT_OVERRIDES) if (re.test(fullName)) return short;
  return fullName
    .replace(/\s*\([^)]*\)\s*/g, "")
    .replace(/\s*(B\.Tech|B\.E\.|Bachelor.*)\s*$/i, "")
    .replace(/Engineering$/i, "Engg.")
    .trim()
    .slice(0, 24);
}

const BRANCH_KW = {
  cse:      ["computer science and engineering", "computer science & engineering", "computer science"],
  it:       ["information technology"],
  ece:      ["electronics and communication engineering", "electronics & communication", "electronics and communication"],
  ee:       ["electrical engineering (", "electrical engineering", "electrical and electronics"],
  eee:      ["electrical and electronics"],
  me:       ["mechanical engineering"],
  ce:       ["civil engineering"],
  ch:       ["chemical engineering"],
  che:      ["chemical engineering"],
  ai:       ["artificial intelligence and machine learning", "artificial intelligence & machine learning", "artificial intelligence and data", "artificial intelligence"],
  aiml:     ["artificial intelligence and machine learning", "artificial intelligence & machine learning"],
  aids:     ["artificial intelligence and data science", "artificial intelligence & data science"],
  ds:       ["data science and engineering", "data science"],
  cseai:    ["computer science and engineering (artificial intelligence", "computer science.*artificial intelligence"],
  cseds:    ["computer science.*data science"],
  csecyber: ["computer science.*cyber", "cybersecurity", "cyber security"],
  iot:      ["internet of things", "iot"],
  meta:     ["metallurgical and materials", "metallurgical engineering", "materials science"],
  mme:      ["metallurgical and materials", "metallurgical engineering", "materials science"],
  mine:     ["mining engineering"],
  aero:     ["aerospace engineering", "aeronautical engineering"],
  arch:     ["architecture", "planning"],
  ocean:    ["ocean engineering", "naval architecture"],
  bio:      ["biotechnology", "bio-technology"],
  biochem:  ["biochemical engineering"],
  pharma:   ["pharmaceutical engineering", "pharmaceutical technology"],
  rubber:   ["rubber technology", "polymer science and technology"],
  textile:  ["textile technology", "textile engineering"],
  physics:  ["engineering physics"],
  maths:    ["mathematics and computing", "mathematics"],
  prod:     ["production and industrial engineering", "production engineering"],
  ind:      ["industrial engineering"],
  mfg:      ["manufacturing engineering"],
  instr:    ["instrumentation and control", "instrumentation engineering", "electronics and instrumentation"],
  env:      ["environmental engineering"],
  geo:      ["geology", "geophysics", "earth sciences"],
};

export function findProgramByBranch(college, branchInput) {
  if (!branchInput) return null;
  const progs = getRealPrograms(college);
  if (!progs.length) return null;
  const key   = String(branchInput).toLowerCase().trim();
  const exact = progs.find((p) => normProg(p) === normProg(key));
  if (exact) return exact;
  const kwList = BRANCH_KW[key] ?? [key];
  for (const kw of kwList) {
    const m = progs.find((p) => p.toLowerCase().includes(kw));
    if (m) return m;
  }
  const words = key.split(/\s+/).filter((w) => w.length > 3);
  if (words.length) {
    let bp = null, bs = 0;
    for (const p of progs) {
      const pl = p.toLowerCase();
      const sc = words.filter((w) => pl.includes(w)).length;
      if (sc > bs) { bs = sc; bp = p; }
    }
    if (bs > 0) return bp;
  }
  return progs[0];
}

export function getProgramList(college) {
  return getRealPrograms(college).map((p) => ({ short: getProgramShortName(p), fullName: p }));
}

export function fmtR(v) { return v ? v.toLocaleString("en-IN") : "—"; }