/**
 * realCutoffEngine.js  (v3 — full rewrite)
 * ─────────────────────────────────────────────────────────────────────────────
 * Loads JoSAA cutoff CSV files for 2018–2025 from /public/data/.
 * CSV expected columns (JoSAA official export):
 *   Institute | Academic Program Name | Quota | Seat Type | Gender |
 *   Opening Rank | Closing Rank | Round
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const REAL_YEARS = ["2018","2019","2020","2021","2022","2023","2024","2025"];

// In-memory store keyed by year
const DB  = new Map();   // Map<year, Row[]>
let _loadPromise = null;
let _loaded      = false;

// ── CSV parser (handles quoted fields) ──────────────────────────────────────
function parseLine(line) {
  const out = [];
  let cur = "", inQ = false;
  for (const ch of line) {
    if (ch === '"')       { inQ = !inQ; continue; }
    if (ch === ',' && !inQ) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

const COL_ALIASES = {
  "institute":                "institute",
  "institute (program)":      "institute",
  "college":                  "institute",
  "academic program name":    "program",
  "program name":             "program",
  "branch":                   "program",
  "program":                  "program",
  "quota":                    "quota",
  "seat type":                "seatType",
  "category":                 "seatType",
  "gender":                   "gender",
  "gender pool":              "gender",
  "opening rank":             "opening",
  "opening":                  "opening",
  "closing rank":             "closing",
  "closing":                  "closing",
  "round":                    "round",
  "round no":                 "round",
  "round number":             "round",
};

function normHeaders(headers) {
  return headers.map(h => COL_ALIASES[h.toLowerCase().trim()] ?? h.toLowerCase().trim());
}

function normGender(g) {
  const s = (g ?? "").toLowerCase();
  return (s.includes("female") || s === "fo" || s.includes("girl")) ? "FO" : "GN";
}

function parseCSV(text, year) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
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
    const opening = parseInt(o.opening, 10);
    const roundRaw = String(o.round ?? "1").replace(/\D/g, "") || "1";
    rows.push({
      institute: (o.institute ?? "").trim(),
      program:   (o.program   ?? "").trim(),
      quota:     (o.quota     ?? "AI").trim().toUpperCase(),
      seatType:  (o.seatType  ?? "OPEN").trim().toUpperCase(),
      gender:    normGender(o.gender),
      opening:   isNaN(opening) ? closing : opening,
      closing,
      round:     roundRaw,
      year,
    });
  }
  return rows;
}

async function fetchYear(year) {
  try {
    const res = await fetch(`/data/josaa_${year}.csv`);
    if (!res.ok) return [];
    return parseCSV(await res.text(), year);
  } catch { return []; }
}

async function fetchLegacyJSON() {
  try {
    const res = await fetch("/data/josaa_cutoffs.json");
    if (!res.ok) return [];
    const json = await res.json();
    const raw = Array.isArray(json) ? json : Object.values(json).flat();
    return raw.map(r => ({
      institute: String(r.institute ?? r.college ?? "").trim(),
      program:   String(r.program ?? r.academic_program_name ?? r.branch ?? "").trim(),
      quota:     String(r.quota ?? "AI").toUpperCase(),
      seatType:  String(r.seat_type ?? r.seatType ?? r.category ?? "OPEN").toUpperCase(),
      gender:    normGender(r.gender),
      opening:   parseInt(r.opening_rank ?? r.opening ?? 0, 10),
      closing:   parseInt(r.closing_rank ?? r.closing ?? 0, 10),
      round:     String(r.round ?? "1").replace(/\D/g, "") || "1",
      year:      String(r.year ?? "2023"),
    })).filter(r => r.closing > 0);
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
  })();
  return _loadPromise;
}

export const isDBReady = () => _loaded;

// ── Institute matching ────────────────────────────────────────────────────────
const INSTITUTE_ALIASES = {
  // IITs
  "iit-bombay":      ["Indian Institute of Technology Bombay","IIT Bombay"],
  "iit-delhi":       ["Indian Institute of Technology Delhi","IIT Delhi"],
  "iit-madras":      ["Indian Institute of Technology Madras","IIT Madras"],
  "iit-kanpur":      ["Indian Institute of Technology Kanpur","IIT Kanpur"],
  "iit-kharagpur":   ["Indian Institute of Technology Kharagpur","IIT Kharagpur"],
  "iit-roorkee":     ["Indian Institute of Technology Roorkee","IIT Roorkee"],
  "iit-guwahati":    ["Indian Institute of Technology Guwahati","IIT Guwahati"],
  "iit-hyderabad":   ["Indian Institute of Technology Hyderabad","IIT Hyderabad"],
  "iit-indore":      ["Indian Institute of Technology Indore","IIT Indore"],
  "iit-bhu":         ["Indian Institute of Technology (BHU) Varanasi","IIT BHU","IIT (BHU)"],
  "iit-jodhpur":     ["Indian Institute of Technology Jodhpur","IIT Jodhpur"],
  "iit-gandhinagar": ["Indian Institute of Technology Gandhinagar","IIT Gandhinagar"],
  "iit-mandi":       ["Indian Institute of Technology Mandi","IIT Mandi"],
  "iit-patna":       ["Indian Institute of Technology Patna","IIT Patna"],
  "iit-ropar":       ["Indian Institute of Technology Ropar","IIT Ropar"],
  "iit-bhubaneswar": ["Indian Institute of Technology Bhubaneswar","IIT Bhubaneswar"],
  "iit-tirupati":    ["Indian Institute of Technology Tirupati","IIT Tirupati"],
  "iit-palakkad":    ["Indian Institute of Technology Palakkad","IIT Palakkad"],
  "iit-jammu":       ["Indian Institute of Technology Jammu","IIT Jammu"],
  "iit-dharwad":     ["Indian Institute of Technology Dharwad","IIT Dharwad"],
  "iit-bhilai":      ["Indian Institute of Technology Bhilai","IIT Bhilai"],
  "iit-goa":         ["Indian Institute of Technology Goa","IIT Goa"],
  // NITs
  "nit-trichy":      ["National Institute of Technology, Tiruchirappalli","NIT Tiruchirappalli","NIT Trichy"],
  "nit-warangal":    ["National Institute of Technology Warangal","NIT Warangal"],
  "nit-surathkal":   ["National Institute of Technology Karnataka","NIT Karnataka","NIT Surathkal"],
  "nit-calicut":     ["National Institute of Technology Calicut","NIT Calicut"],
  "nit-allahabad":   ["Motilal Nehru National Institute of Technology Allahabad","MNNIT Allahabad","NIT Allahabad"],
  "nit-rourkela":    ["National Institute of Technology Rourkela","NIT Rourkela"],
  "nit-kurukshetra": ["National Institute of Technology, Kurukshetra","NIT Kurukshetra"],
  "nit-bhopal":      ["Maulana Azad National Institute of Technology Bhopal","MANIT Bhopal","NIT Bhopal"],
  "nit-jamshedpur":  ["National Institute of Technology Jamshedpur","NIT Jamshedpur"],
  "nit-durgapur":    ["National Institute of Technology, Durgapur","NIT Durgapur"],
  "nit-surat":       ["Sardar Vallabhbhai National Institute of Technology","NIT Surat","SVNIT Surat"],
  "nit-silchar":     ["National Institute of Technology Silchar","NIT Silchar"],
  "nit-hamirpur":    ["National Institute of Technology Hamirpur","NIT Hamirpur"],
  "nit-jalandhar":   ["Dr. B R Ambedkar National Institute of Technology Jalandhar","NIT Jalandhar"],
  "nit-nagpur":      ["Visvesvaraya National Institute of Technology","VNIT Nagpur","NIT Nagpur"],
  "nit-patna":       ["National Institute of Technology Patna","NIT Patna"],
  "nit-raipur":      ["National Institute of Technology Raipur","NIT Raipur"],
  "nit-srinagar":    ["National Institute of Technology Srinagar","NIT Srinagar"],
  "nit-agartala":    ["National Institute of Technology Agartala","NIT Agartala"],
  "nit-manipur":     ["National Institute of Technology Manipur","NIT Manipur"],
  "nit-meghalaya":   ["National Institute of Technology Meghalaya","NIT Meghalaya"],
  "nit-mizoram":     ["National Institute of Technology Mizoram","NIT Mizoram"],
  "nit-arunachal":   ["National Institute of Technology Arunachal Pradesh","NIT Arunachal Pradesh"],
  "nit-goa":         ["National Institute of Technology Goa","NIT Goa"],
  "nit-puducherry":  ["National Institute of Technology Puducherry","NIT Puducherry"],
  "nit-uttarakhand": ["National Institute of Technology Uttarakhand","NIT Uttarakhand"],
  "nit-delhi":       ["National Institute of Technology Delhi","NIT Delhi"],
  "nit-andhra":      ["National Institute of Technology Andhra Pradesh","NIT Andhra Pradesh"],
  "nit-sikkim":      ["National Institute of Technology Sikkim","NIT Sikkim"],
};

function matchInstitute(row, college) {
  const inst = row.institute.toLowerCase();
  const aliases = INSTITUTE_ALIASES[college.slug] ?? [];
  if (aliases.some(a => inst.includes(a.toLowerCase()))) return true;
  if (college.name  && inst.includes(college.name.toLowerCase()))  return true;
  if (college.short && inst.includes(college.short.toLowerCase())) return true;
  return false;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getRealPrograms(college) {
  const seen = new Set();
  for (const [, rows] of DB)
    for (const r of rows)
      if (matchInstitute(r, college)) seen.add(r.program);

  return [...seen].sort((a, b) => {
    // CSE first, then IT, then ECE, then rest alphabetically
    const order = (s) => {
      const l = s.toLowerCase();
      if (l.includes("computer science")) return 0;
      if (l.includes("information technology")) return 1;
      if (l.includes("electronics and comm")) return 2;
      if (l.includes("electrical")) return 3;
      if (l.includes("mechanical")) return 4;
      if (l.includes("civil")) return 5;
      if (l.includes("chemical")) return 6;
      return 10;
    };
    const d = order(a) - order(b);
    return d !== 0 ? d : a.localeCompare(b);
  });
}

export function getAvailableYears(college) {
  return REAL_YEARS.filter(yr => (DB.get(yr) ?? []).some(r => matchInstitute(r, college)));
}

export function getRealRounds(college, program, quota, seatType, year, gender = "GN") {
  const rows = (DB.get(year) ?? []).filter(r =>
    matchInstitute(r, college) &&
    fuzzyProgram(r.program, program) &&
    r.quota    === quota &&
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
    .filter(r => r.closing !== null);
}

export function getRealHistory(college, program, quota, seatType, gender = "GN") {
  return REAL_YEARS.flatMap(yr => {
    const rnds = getRealRounds(college, program, quota, seatType, yr, gender);
    if (!rnds.length) return [];
    const r1 = rnds[0], rf = rnds[rnds.length - 1];
    return [{ year: yr, opening: r1.opening, closing: r1.closing, r6Close: rf.closing }];
  });
}

export function getRealForecast(college, program, quota, seatType, gender = "GN") {
  const history = getRealHistory(college, program, quota, seatType, gender);
  const pts = history.filter(h => h.r6Close).map(h => [Number(h.year), h.r6Close]);
  if (pts.length < 2) return null;
  const n = pts.length;
  const sx  = pts.reduce((a,p) => a+p[0], 0);
  const sy  = pts.reduce((a,p) => a+p[1], 0);
  const sxy = pts.reduce((a,p) => a+p[0]*p[1], 0);
  const sxx = pts.reduce((a,p) => a+p[0]*p[0], 0);
  const denom = n*sxx - sx*sx;
  if (!denom) return null;
  const slope = (n*sxy - sx*sy) / denom;
  const intercept = (sy - slope*sx) / n;
  const nextYear = pts[pts.length-1][0] + 1;
  return {
    year:    nextYear,
    closing: Math.round(slope*nextYear + intercept),
    trend:   slope < 0 ? "tightening" : "relaxing",
    slope:   Math.round(slope),
    points:  n,
  };
}

export function getDefaultQuota(college) {
  return college?.type === "IIT" ? "AI" : "OS";
}

const QUOTA_LABELS = {
  AI: "AI — All India",  OS: "OS — Other State",
  HS: "HS — Home State", GO: "GO — Goa",
  LA: "LA — Ladakh",     JK: "JK — J&K",
  AP: "AP — Andhra Pradesh", TL: "TL — Telangana",
};

export function getAvailableQuotas(college) {
  const seen = new Set();
  for (const [, rows] of DB)
    for (const r of rows)
      if (matchInstitute(r, college)) seen.add(r.quota);
  const all = [...seen].sort();
  return all.length
    ? all.map(q => ({ value: q, label: QUOTA_LABELS[q] ?? q }))
    : [{ value: getDefaultQuota(college), label: QUOTA_LABELS[getDefaultQuota(college)] ?? getDefaultQuota(college) }];
}

// ── Program name normaliser ───────────────────────────────────────────────────
function normProg(p) {
  return p.toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, " ")   // strip (4 Years, B.Tech) etc.
    .replace(/b\.?tech\.?|b\.?e\.?/gi, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, " ").trim();
}

function fuzzyProgram(candidate, target) {
  const c = normProg(candidate), t = normProg(target);
  if (c === t) return true;
  if (c.length > 4 && t.includes(c)) return true;
  if (t.length > 4 && c.includes(t)) return true;
  return false;
}

// ── getProgramShortName ───────────────────────────────────────────────────────
// Returns a clean display label for any JoSAA program string:
//   "Computer Science and Engineering (4 Years, B.Tech)" → "Computer Science & Engg."
const SHORT_OVERRIDES = [
  [/computer science and engineering/i,               "CSE"],
  [/computer science & engineering/i,                  "CSE"],
  [/electronics and communication engineering/i,       "ECE"],
  [/electronics & communication engineering/i,         "ECE"],
  [/electrical engineering/i,                          "EE"],
  [/electrical and electronics engineering/i,          "EEE"],
  [/mechanical engineering/i,                          "ME"],
  [/civil engineering/i,                               "CE"],
  [/chemical engineering/i,                            "ChE"],
  [/metallurgical.*engineering/i,                      "Meta."],
  [/materials.*engineering/i,                          "Materials"],
  [/information technology/i,                          "IT"],
  [/computer.*science.*information/i,                  "CS & IT"],
  [/artificial intelligence.*machine learning/i,       "AI & ML"],
  [/artificial intelligence.*data science/i,           "AI & DS"],
  [/artificial intelligence/i,                         "AI"],
  [/data science.*engineering/i,                       "DS & Engg."],
  [/data science/i,                                    "Data Science"],
  [/engineering physics/i,                             "Engg. Physics"],
  [/mathematics.*computing/i,                          "Math & Computing"],
  [/mathematics/i,                                     "Mathematics"],
  [/production.*industrial/i,                          "Prod. & Ind."],
  [/industrial.*production/i,                          "Ind. & Prod."],
  [/production engineering/i,                          "Production Engg."],
  [/industrial engineering/i,                          "Industrial Engg."],
  [/manufacturing engineering/i,                       "Manufacturing"],
  [/aerospace engineering/i,                           "Aerospace"],
  [/aeronautical engineering/i,                        "Aeronautical"],
  [/biotechnology/i,                                   "BioTech"],
  [/biochemical engineering/i,                         "Biochem. Engg."],
  [/mining engineering/i,                              "Mining"],
  [/architecture/i,                                    "Architecture"],
  [/ocean engineering/i,                               "Ocean Engg."],
  [/naval architecture/i,                              "Naval Arch."],
  [/environmental engineering/i,                       "Env. Engg."],
  [/geology/i,                                         "Geology"],
  [/geophysics/i,                                      "Geophysics"],
  [/textile technology/i,                              "Textile Tech."],
  [/textile engineering/i,                             "Textile Engg."],
  [/pharmaceutical/i,                                  "Pharma."],
  [/rubber technology/i,                               "Rubber Tech."],
  [/polymer science/i,                                 "Polymer Sci."],
  [/instrumentation/i,                                 "Instrumentation"],
  [/electronics.*instrumentation/i,                    "E & I"],
];

export function getProgramShortName(fullName) {
  for (const [re, short] of SHORT_OVERRIDES) {
    if (re.test(fullName)) return short;
  }
  // fallback: strip degree suffix and truncate
  return fullName
    .replace(/\s*\([^)]*\)\s*/g, "")
    .replace(/\s*(B\.Tech|B\.E\.|Bachelor.*)\s*$/i, "")
    .replace(/Engineering$/i, "Engg.")
    .trim()
    .slice(0, 22);
}

// ── Branch code → JoSAA keyword map ──────────────────────────────────────────
// Each entry: branch code → ordered list of substrings to search in program name
// More specific keywords first so "cse" doesn't accidentally match "CSE + AI"
const BRANCH_KW = {
  // Core engineering
  cse:       ["computer science and engineering","computer science & engineering","computer science"],
  it:        ["information technology"],
  ece:       ["electronics and communication engineering","electronics & communication","electronics and communication"],
  ee:        ["electrical engineering (","electrical engineering","electrical and electronics"],
  eee:       ["electrical and electronics"],
  me:        ["mechanical engineering"],
  ce:        ["civil engineering"],
  ch:        ["chemical engineering"],
  // Specialised / newer
  ai:        ["artificial intelligence and machine learning","artificial intelligence & machine learning",
               "artificial intelligence and data","artificial intelligence"],
  aiml:      ["artificial intelligence and machine learning","artificial intelligence & machine learning"],
  aids:      ["artificial intelligence and data science","artificial intelligence & data science"],
  ds:        ["data science and engineering","data science"],
  cseai:     ["computer science and engineering (artificial intelligence","computer science.*artificial intelligence"],
  cseds:     ["computer science.*data science"],
  csecyber:  ["computer science.*cyber","cybersecurity","cyber security"],
  iot:       ["internet of things","iot"],
  // Materials / Mining
  meta:      ["metallurgical and materials","metallurgical engineering","materials science"],
  mine:      ["mining engineering"],
  // Aero / Ocean / Arch
  aero:      ["aerospace engineering","aeronautical engineering"],
  arch:      ["architecture","planning"],
  ocean:     ["ocean engineering","naval architecture"],
  // Bio / Pharma / Rubber
  bio:       ["biotechnology","bio-technology"],
  biochem:   ["biochemical engineering"],
  pharma:    ["pharmaceutical engineering","pharmaceutical technology"],
  rubber:    ["rubber technology","polymer science and technology"],
  textile:   ["textile technology","textile engineering"],
  // Physics / Maths
  physics:   ["engineering physics"],
  maths:     ["mathematics and computing","mathematics"],
  // Production / Industrial / Manufacturing
  prod:      ["production and industrial engineering","production engineering"],
  ind:       ["industrial engineering"],
  mfg:       ["manufacturing engineering"],
  // Instrumentation
  instr:     ["instrumentation and control","instrumentation engineering","electronics and instrumentation"],
  // Env / Geo
  env:       ["environmental engineering"],
  geo:       ["geology","geophysics","earth sciences"],
};

/**
 * Given a branch code, branch name, or any fragment,
 * return the best-matching real JoSAA program string for this college.
 * Returns null only if programs list is empty.
 */
export function findProgramByBranch(college, branchInput) {
  if (!branchInput) return null;
  const progs = getRealPrograms(college);
  if (!progs.length) return null;

  const key = branchInput.toLowerCase().trim();

  // 1. Exact normalised match
  const exact = progs.find(p => normProg(p) === normProg(key));
  if (exact) return exact;

  // 2. Keyword map — try code first, then treat input as keyword list
  const kwList = BRANCH_KW[key] ?? [key];
  for (const kw of kwList) {
    // try exact substring
    const m = progs.find(p => p.toLowerCase().includes(kw));
    if (m) return m;
  }

  // 3. Direct substring of the input in program name (handles full branch names
  //    like "Computer Science Engineering" passed from the Courses card)
  const words = key.split(/\s+/).filter(w => w.length > 3);
  if (words.length) {
    let bestProg = null, bestScore = 0;
    for (const p of progs) {
      const pl = p.toLowerCase();
      const score = words.filter(w => pl.includes(w)).length;
      if (score > bestScore) { bestScore = score; bestProg = p; }
    }
    if (bestScore > 0) return bestProg;
  }

  // 4. Fallback: first program
  return progs[0];
}

/**
 * Group all programs for a college into discipline buckets
 * for the branch quick-selector UI.
 * Returns: [{ short, fullName }]
 */
export function getProgramList(college) {
  return getRealPrograms(college).map(p => ({
    short:    getProgramShortName(p),
    fullName: p,
  }));
}

export function fmtR(v) {
  if (!v) return "—";
  return v.toLocaleString("en-IN");
}