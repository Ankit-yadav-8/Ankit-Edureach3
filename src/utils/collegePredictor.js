/* ============================================================
   collegePredictor.js — Real-data College Predictor (v5)
   ------------------------------------------------------------
   • Cutoffs sourced EXCLUSIVELY from josaa_2024.csv.
     Modelled/illustrative fallback is disabled in the predictor
     so fake programs (e.g. AI at NITs that don't offer it) are
     never shown.
   • Female candidates use FO (female-only) seat cutoffs when
     available; falls back to GN + multiplier when not.
   • Home-state quota: multiplier applied to AI-quota cutoffs
     (direct HS-quota data requires future enhancement).
   • Results prioritised: NIRF rank → branch value → closing rank.
   ============================================================ */

import { COLLEGES, BRANCHES }   from "../data/colleges.js";
import { SEAT_MATRIX }          from "../data/seatMatrix.js";
import {
  getRealPrograms,
  getRealRounds,
  getProgramShortName,
  isPredictorReady,
  isDBReady,
} from "./realCutoffEngine.js";
import { forecastClosing } from "./cutoffEngine.js";

export const TIER_COLOR = {
  Safe:     "var(--green)",
  Good:     "var(--teal)",
  Moderate: "var(--orange)",
  Reach:    "var(--violet)",
  Stretch:  "var(--coral)",
};
export const TIER_BG = {
  Safe:     "rgba(46,196,182,.15)",
  Good:     "rgba(14,165,164,.15)",
  Moderate: "rgba(249,115,22,.13)",
  Reach:    "rgba(139,92,246,.13)",
  Stretch:  "rgba(239,68,68,.13)",
};
export const TIER_DESC = {
  Safe:     "Your rank is above the opening rank — admission almost certain in Round 1.",
  Good:     "Your rank is comfortably within the Round-1 closing — high probability.",
  Moderate: "Your rank is within the final closing but may need later rounds.",
  Reach:    "Close to the final closing — possible in the last rounds.",
  Stretch:  "Slightly beyond the last closing — very low chance; keep as backup only.",
};
export function rankGapLabel(rankGap) {
  if (rankGap >= 0) return `${rankGap.toLocaleString()} ranks inside`;
  return `${Math.abs(rankGap).toLocaleString()} ranks outside`;
}

const TYPE_LABEL   = { IIT: "IIT", NIT: "NIT", IIIT: "IIIT", GFTI: "GFTI" };
const FEMALE_RELAX = { IIT: 1.35, NIT: 1.20, IIIT: 1.20, GFTI: 1.15 };
const HOME_STATE_RELAX = 1.25;

const BRANCH_VALUE = {
  cse: 100, ai: 95, it: 90, ece: 82, eee: 70, ee: 68,
  che: 60, me: 64, ce: 48, mme: 42,
};
const branchValue = (code) => BRANCH_VALUE[code] ?? 40;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// ── Map a CSV program name → internal branch code ─────────────────────────────
// Checked in order; first match wins. More-specific patterns come first.
const PROG_BRANCH_MAP = [
  // CSE with specialisation — map to "cse" so they appear under CSE row
  [["computer science and engineering (artificial", "computer science and engineering ( artificial",
    "cse ( data science", "computer science and engineering (data",
    "computer science and engineering with major in artificial",
    "computer science engineering (artificial", "computer science.*specialization",
    "b.tech in computer science and engineering"], "cse"],
  // Pure AI / Data Science programs
  [["artificial intelligence and machine learning", "artificial intelligence & machine learning",
    "artificial intelligence and data science", "artificial intelligence & data science",
    "data science and artificial intelligence", "artificial intelligence"], "ai"],
  [["data science and engineering", "data science & engineering"], "ai"],
  // Core CSE
  [["computer science and engineering", "computer science & engineering", "computer engineering",
    "computer science (hons", "b.tech. in computer"], "cse"],
  [["information technology"], "it"],
  // Electronics / ECE
  [["electronics and communication engineering", "electronics & communication engineering",
    "electronics and communication (", "electronics & communication (",
    "b.tech. in electronics and communication"], "ece"],
  [["electrical and electronics engineering", "electrical and electronics ("], "eee"],
  [["electrical engineering"], "ee"],
  // Mechanical / Robotics
  [["robotics and automation", "robotics & automation",
    "mechanical engineering", "engineering and computational mechanics",
    "b.tech / b. tech (hons.) mechanical"], "me"],
  // Civil
  [["civil engineering", "civil and environmental engineering"], "ce"],
  [["chemical engineering"], "che"],
  // Materials / Metallurgy
  [["metallurgical and materials engineering", "metallurgical engineering",
    "materials science", "materials engineering"], "mme"],
  // Bio / Pharma
  [["biotechnology", "bio-technology", "bio technology", "biochemical engineering",
    "pharmaceutical"], "bio"],
  // Aerospace
  [["aerospace engineering", "aeronautical engineering"], "aero"],
  // Architecture / Planning
  [["architecture", "b.arch", "planning"], "arch"],
  // Engineering Physics
  [["engineering physics"], "physics"],
  // Mathematics
  [["mathematics and computing", "mathematics & computing",
    "b.tech in mathematics", "mathematics and data science",
    "mathematics and statistics", "applied mathematics"], "maths"],
  // Production / Manufacturing
  [["production and industrial engineering", "production engineering",
    "industrial engineering", "manufacturing engineering"], "prod"],
  // Mining
  [["mining engineering"], "mine"],
  // Instrumentation
  [["instrumentation and control engineering", "instrumentation engineering",
    "electronics and instrumentation"], "instr"],
  // Ocean / Naval
  [["ocean engineering", "naval architecture"], "ocean"],
  // Agriculture
  [["agricultural engineering", "agriculture engineering"], "agri"],
  // Textile / Rubber
  [["textile technology", "textile engineering", "rubber technology", "polymer science"], "textile"],
  // General data science catch-all
  [["data science"], "ai"],
];

function progToBranchCode(progName) {
  const lower = progName.toLowerCase();
  for (const [keywords, code] of PROG_BRANCH_MAP) {
    if (keywords.some(kw => lower.includes(kw))) return code;
  }
  return null;
}

// ── Seat-matrix helper ────────────────────────────────────────────────────────
function getSeatData(college, branchCode, category) {
  const matrix = SEAT_MATRIX[college.slug];
  if (!matrix?.programs?.length) {
    return { programName: null, totalSeats: null, seatsInCategory: null };
  }
  const BRANCH_KEYWORDS = {
    cse: ["computer science", "cse", "computing"],
    ece: ["electronics and communication", "ece", "electronics & communication"],
    ee:  ["electrical engineering", "electrical and electronics", "eee"],
    me:  ["mechanical engineering"],
    ce:  ["civil engineering"],
    che: ["chemical engineering"],
    mme: ["metallurgical", "materials engineering", "materials science"],
    ai:  ["artificial intelligence", "data science"],
    it:  ["information technology"],
  };
  const keywords = BRANCH_KEYWORDS[branchCode] ?? [branchCode];
  const prog = matrix.programs.find((p) =>
    keywords.some((kw) => p.name.toLowerCase().includes(kw))
  );
  if (!prog) return { programName: null, totalSeats: null, seatsInCategory: null };
  return {
    programName:      prog.name,
    totalSeats:       prog.seats ?? null,
    seatsInCategory:  prog[category] ?? prog["OPEN"] ?? null,
  };
}

// ── Round helpers ─────────────────────────────────────────────────────────────
const ALLINDIA_QUOTAS = ["AI", "OS"];

function fetchRealRounds(college, progName, category, gender) {
  for (const q of ALLINDIA_QUOTAS) {
    const rounds = getRealRounds(college, progName, q, category, "2024", gender);
    if (rounds.length) return rounds;
  }
  return [];
}

function estimateAdmitRound(rounds, candidateRank, relaxedClosing) {
  for (const rd of rounds) if (candidateRank <= Math.round(rd.closing)) return rd.round;
  if (candidateRank <= relaxedClosing) return rounds[rounds.length - 1]?.round ?? null;
  return null;
}

/**
 * Returns a flat sorted array of college-branch matches for a given rank.
 * Uses ONLY josaa_2024.csv data — no modelled/illustrative fallback.
 *
 * @param {Object}   opts
 * @param {number}   opts.rank       JEE Adv rank (IITs) or JEE Main CRL/category rank
 * @param {string}   opts.category   "OPEN" | "OBC-NCL" | "EWS" | "SC" | "ST"
 * @param {string}  [opts.state]     Home state name
 * @param {string}  [opts.branch]    Restrict to one branch code
 * @param {string[]}[opts.types]     Institute types to include
 * @param {boolean} [opts.female]    Show female supernumerary seat cutoffs
 * @param {boolean} [opts.homeState] Apply home-state quota relaxation
 */
export function predictColleges({
  rank,
  category   = "OPEN",
  state      = "",
  branch     = "",
  types      = ["IIT", "NIT", "IIIT", "GFTI"],
  female     = false,
  homeState  = false,
} = {}) {
  const userRank = Number(rank) || 0;
  if (userRank <= 0) return [];

  // Wait for DB; if neither ready, return empty (worker always awaits load first)
  if (!isDBReady() && !isPredictorReady()) return [];

  const out = [];

  COLLEGES.forEach((college) => {
    if (!types.includes(college.type)) return;

    const isHome      = homeState && state && college.state === state && college.type !== "IIT";
    const homeRelax   = isHome ? HOME_STATE_RELAX : 1;
    const femaleRelax = female ? (FEMALE_RELAX[college.type] ?? 1.15) : 1;

    // ── Get real programs from the CSV for this college ──────────────────────
    const realProgs = getRealPrograms(college);
    if (!realProgs.length) return; // college not in JoSAA 2024 CSV — skip

    // Map each program to a branch code; deduplicate per college per code
    const seenCodes  = new Set();
    const progList   = [];

    for (const progName of realProgs) {
      const code = progToBranchCode(progName);
      if (!code) continue;                   // unknown program type — skip

      // ── Branch filter (user picked a specific branch) ────────────────────
      if (branch && code !== branch) continue;

      if (seenCodes.has(code)) continue;     // keep first (usually base) program per code
      seenCodes.add(code);

      const branchMeta = BRANCHES.find((b) => b.code === code)
        ?? { code, name: getProgramShortName(progName) };
      progList.push({ code, name: branchMeta.name, fullName: progName });
    }

    // ── Evaluate each program ────────────────────────────────────────────────
    progList.forEach(({ code: bCode, name: bName, fullName: progName }) => {

      // 1. Try female-only (FO) rows first when female=true
      let rounds        = [];
      let totalRelax    = homeRelax;
      let usedFemale    = false;

      if (female) {
        rounds = fetchRealRounds(college, progName, category, "FO");
        if (rounds.length) {
          usedFemale = true;
          totalRelax = homeRelax; // FO cutoffs are already relaxed — no extra multiplier
        }
      }

      // 2. Fall back to GN rows (+ female multiplier if applicable)
      if (!rounds.length) {
        rounds = fetchRealRounds(college, progName, category, "GN");
        if (rounds.length) {
          totalRelax = femaleRelax * homeRelax;
        }
      }

      if (!rounds.length) return; // no CSV data for this college+program+category — skip

      const r1Opening      = rounds[0].opening  ?? rounds[0].closing;
      const r1Closing      = rounds[0].closing;
      const rawClosing     = rounds[rounds.length - 1].closing;

      const effOpening      = Math.round(r1Opening);
      const effR1Closing    = Math.round(r1Closing  * totalRelax);
      const effFinalClosing = Math.round(rawClosing  * totalRelax);

      // ── Strict eligibility: user's rank must be ≤ final closing ─────────
      if (userRank > effFinalClosing) return;

      // ── 4-tier classification ────────────────────────────────────────────
      let tier;
      if      (userRank <= effOpening)             tier = "Safe";
      else if (userRank <= effR1Closing)           tier = "Good";
      else if (userRank <= effFinalClosing * 0.88) tier = "Moderate";
      else                                          tier = "Reach";

      // ── Fit score 5–100 ──────────────────────────────────────────────────
      let score;
      if (userRank <= effOpening) {
        score = 100;
      } else if (userRank <= effR1Closing) {
        score = Math.round(90 - ((userRank - effOpening) / Math.max(1, effR1Closing - effOpening)) * 25);
      } else if (userRank <= effFinalClosing * 0.88) {
        score = Math.round(65 - ((userRank - effR1Closing) / Math.max(1, effFinalClosing * 0.88 - effR1Closing)) * 20);
      } else {
        score = Math.round(45 - ((userRank - effFinalClosing * 0.88) / Math.max(1, effFinalClosing * 0.12)) * 20);
      }

      const relaxedRounds = rounds.map((rd) => ({
        ...rd,
        closing: Math.round(rd.closing * totalRelax),
      }));
      const admitRound = estimateAdmitRound(relaxedRounds, userRank, effFinalClosing);
      const rankGap    = effFinalClosing - userRank;

      const forecast2026 = forecastClosing(college, bCode, category);
      const { programName, totalSeats, seatsInCategory } =
        getSeatData(college, bCode, category);

      out.push({
        slug:              college.slug,
        college:           college.name,
        short:             college.short,
        type:              TYPE_LABEL[college.type] || college.type,
        nirf:              college.nirf,
        state:             college.state,
        isHomeState:       isHome,
        branchCode:        bCode,
        branch:            bName,
        programName:       programName ?? bName,
        branchValue:       branchValue(bCode),
        category,
        opening:           effOpening,
        r1Closing:         effR1Closing,
        closing:           effFinalClosing,
        rawClosing,
        forecastClose2026: forecast2026 ? Math.round(forecast2026.closing * totalRelax) : null,
        totalSeats,
        seatsInCategory,
        score:             clamp(score, 5, 100),
        tier,
        rankGap,
        admitRound,
        totalRounds:       rounds.length,
        femaleQuota:       usedFemale,
        homeStateQuota:    isHome,
        relaxMultiplier:   totalRelax,
        avgPackage:        college.placements?.byBranch?.[bCode] ?? college.placements?.avg ?? null,
        _statePref:        state && college.state === state ? 1 : 0,
      });
    });
  });

  // ── Sort: home-state pref → NIRF rank → branch value → closing rank ──────
  out.sort((a, b) =>
    b._statePref  - a._statePref  ||
    a.nirf        - b.nirf        ||
    b.branchValue - a.branchValue ||
    a.closing     - b.closing
  );

  return out.map(({ _statePref, ...rest }) => rest);
}

/**
 * Same as predictColleges but returns results grouped by institute type.
 * Shape: { IIT: [...], NIT: [...], IIIT: [...], GFTI: [...] }
 * Each group is capped at 9 entries (one best branch per college).
 */
export function predictCollegesGrouped({
  rank,
  category   = "OPEN",
  state      = "",
  branch     = "",
  types      = ["IIT", "NIT", "IIIT", "GFTI"],
  female     = false,
  homeState  = false,
} = {}) {
  const all = predictColleges({ rank, category, state, branch, types, female, homeState });

  const groups = { IIT: [], NIT: [], IIIT: [], GFTI: [] };

  for (const key of Object.keys(groups)) {
    const seen = new Set();
    for (const m of all) {
      if (m.type !== key)   continue;
      if (seen.has(m.slug)) continue;
      seen.add(m.slug);
      groups[key].push(m);
      if (groups[key].length >= 9) break;
    }
  }

  return groups;
}
