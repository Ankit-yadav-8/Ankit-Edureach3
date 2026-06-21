/* ============================================================
   collegeFlexibility.js — academic-flexibility metadata
   ------------------------------------------------------------
   Which institutes are known to offer branch change, integrated
   dual degrees (B.Tech + M.Tech), and minor / second-major
   programs. Compiled from institute brochures & JoSAA notes.
   IIITs generally do NOT permit free branch change.

   Keys are the college `slug`s used in data/colleges.js.
   Treat these as indicative — always confirm on the official
   institute brochure before relying on them.
   ============================================================ */

// ── Branch change allowed (after 1st year, merit/CGPA based) ──
export const BRANCH_CHANGE = new Set([
  // IITs
  "iit-delhi", "iit-kanpur", "iit-roorkee", "iit-jodhpur", "iit-indore",
  "iit-ropar", "iit-bhubaneswar", "iit-ism-dhanbad", "iit-tirupati",
  "iit-dharwad", "iit-bhu", "iit-gandhinagar", "iit-goa", "iit-palakkad",
  "iit-bhilai", "iit-madras", "iit-bombay", "iit-kharagpur",
  // NITs
  "nit-trichy", "nit-warangal", "nit-surathkal", "nit-rourkela", "nit-calicut",
  "nit-kurukshetra", "nit-jalandhar", "nit-durgapur", "nit-silchar",
  "nit-hamirpur", "mnit-jaipur", "nit-nagpur", "manit-bhopal", "svnit-surat",
  "nit-raipur", "nit-patna", "nit-jamshedpur", "nit-agartala", "nit-goa",
  "nit-meghalaya",
  // IIITs — none (no free branch change)
]);

// ── Integrated dual degree (B.Tech + M.Tech, 5-year) offered ──
export const DUAL_DEGREE = new Set([
  // IITs
  "iit-bombay", "iit-delhi", "iit-kharagpur", "iit-kanpur", "iit-madras",
  "iit-roorkee", "iit-guwahati", "iit-bhu", "iit-hyderabad", "iit-ropar",
  // NITs
  "nit-warangal", "nit-hamirpur", "nit-durgapur", "nit-agartala",
  "nit-manipur", "nit-patna",
  // IIITs
  "iiitm-gwalior", "iiitdm-jabalpur",
]);

// ── Minor degree / second-major programs offered ──
export const MINOR_DEGREE = new Set([
  // IITs
  "iit-delhi", "iit-jodhpur", "iit-dharwad", "iit-guwahati", "iit-bhu",
  // NITs
  "nit-warangal", "nit-trichy", "nit-rourkela", "nit-jalandhar",
  // IIITs
  "iiit-hyderabad", "iiit-dharwad", "iiit-allahabad",
]);

// ── Open electives / interdisciplinary credits (broadly available
//    at older IITs & top NITs) ──
export const OPEN_ELECTIVES = new Set([
  "iit-madras", "iit-delhi", "iit-bombay", "iit-kanpur", "iit-kharagpur",
  "iit-roorkee", "iit-guwahati", "iit-bhu", "iit-hyderabad", "iit-indore",
  "iit-gandhinagar", "iit-ropar", "iit-jodhpur",
  "nit-trichy", "nit-warangal", "nit-surathkal", "nit-rourkela", "nit-calicut",
  "iiit-hyderabad", "iiit-allahabad", "iiit-bangalore",
]);

export const FLEX_FLAGS = {
  branchChange:  BRANCH_CHANGE,
  dualDegree:    DUAL_DEGREE,
  minorDegree:   MINOR_DEGREE,
  openElectives: OPEN_ELECTIVES,
};

/* ── Branch buckets — group fine-grained branch codes into the
   broad checkbox categories shown in the filter sidebar. ── */
export const BRANCH_BUCKETS = [
  { id: "cs",      label: "CS & IT",                 codes: ["cse", "it"] },
  { id: "ai",      label: "AI & Data Science",       codes: ["ai"] },
  { id: "ece",     label: "Electronics & Electrical", codes: ["ece", "ee", "eee", "instr"] },
  { id: "mech",    label: "Mechanical & Robotics",   codes: ["me", "prod", "aero"] },
  { id: "maths",   label: "Mathematics & Computing", codes: ["maths", "econ"] },
  { id: "civil",   label: "Civil, Design & Architecture", codes: ["ce", "arch", "env"] },
  { id: "mat",     label: "Materials & Mining",      codes: ["mme", "mine", "petro", "geology", "geophysics"] },
  { id: "chem",    label: "Chemical Engineering",    codes: ["che", "chemsci"] },
  { id: "bio",     label: "Bio-Tech & Bio-Sciences", codes: ["bio", "agri"] },
  { id: "sci",     label: "Sciences & Applied",      codes: ["physics", "physci", "chemistry", "ocean", "energy", "textile", "geology"] },
];

// Reverse lookup: branch code → bucket id
export const CODE_TO_BUCKET = BRANCH_BUCKETS.reduce((acc, b) => {
  b.codes.forEach((c) => { acc[c] = b.id; });
  return acc;
}, {});

/* ── Degree classification from a JoSAA program name ── */
export function degreeOf(programName = "") {
  const p = programName.toLowerCase();
  if (/dual|b\.?\s*tech.*m\.?\s*tech|integrated|5\s*year|5-year|m\.?\s*tech/.test(p)) return "dual";
  if (/b\.?\s*arch|architecture|planning/.test(p)) return "barch";
  if (/b\.?\s*plan/.test(p)) return "barch";
  if (/b\.?\s*s\.?\b|bs in|b\.?\s*sc/.test(p)) return "bsc";
  return "btech";
}

/* ── Official IIT emblem files (public/Album_18885/*) keyed by slug.
   Filenames keep the album's original spellings. ── */
const A = "/Album_18885";
export const IIT_LOGOS = {
  "iit-madras":      `${A}/IIT MADRAS.jpg`,
  "iit-delhi":       `${A}/IIT DEHLI.jpg`,
  "iit-bombay":      `${A}/IIT BOMBAY.jpg`,
  "iit-kanpur":      `${A}/IIT KANPUR.jpg`,
  "iit-kharagpur":   `${A}/IIT KHARAGPUR.jpg`,
  "iit-roorkee":     `${A}/IIT ROORKEE.jpg`,
  "iit-guwahati":    `${A}/IIT GHUWATI.jpg`,
  "iit-hyderabad":   `${A}/IIT HYDRABAD.jpg`,
  "iit-bhu":         `${A}/IIT BHU.jpg`,
  "iit-ism-dhanbad": `${A}/IIT DHANBAD.jpg`,
  "iit-indore":      `${A}/IIT INDORE.jpg`,
  "iit-gandhinagar": `${A}/IIT GANDHINAGAR.jpg`,
  "iit-ropar":       `${A}/IIT ROPAR.jpg`,
  "iit-patna":       `${A}/IIT PATNA.jpg`,
  "iit-mandi":       `${A}/IIT MANDI.jpg`,
  "iit-jodhpur":     `${A}/IIT JODHPUR.jpg`,
  "iit-jammu":       `${A}/IIT JAMMU.jpg`,
  "iit-bhubaneswar": `${A}/IIT BHUBANESWAR.jpg`,
  "iit-tirupati":    `${A}/IIT TIRUPATI.jpg`,
  "iit-palakkad":    `${A}/IIT PALAKAD.jpg`,
  "iit-dharwad":     `${A}/IIT DHARWAD.jpg`,
  "iit-bhilai":      `${A}/IIT BHILAI.jpg`,
  "iit-goa":         `${A}/IIT GOA.jpg`,
};

/* Strip a website URL down to its bare hostname (no protocol / www). */
export function domainOf(url) {
  if (!url) return null;
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return String(url).replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || null; }
}

/* One source of truth for a college's logo, used everywhere emblems show.
   IITs use their official local emblem (high-res); every other institute
   (NITs · IIITs · GFTIs · private) resolves to its own site favicon from the
   official website domain — so NIT/IIIT logos appear just like the IITs. */
export function collegeLogo(college) {
  if (!college) return null;
  if (IIT_LOGOS[college.slug]) return IIT_LOGOS[college.slug];
  const d = college.website ? domainOf(college.website) : null;
  return d ? `https://www.google.com/s2/favicons?domain=${d}&sz=128` : null;
}

export const DEGREE_OPTIONS = [
  { value: "",      label: "All Degrees" },
  { value: "btech", label: "B.Tech (4-year)" },
  { value: "dual",  label: "B.Tech + M.Tech (Dual)" },
  { value: "barch", label: "B.Arch / B.Planning" },
  { value: "bsc",   label: "BS / B.Sc (4-year)" },
];
