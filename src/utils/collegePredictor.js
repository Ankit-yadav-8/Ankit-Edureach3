/* ============================================================
   collegePredictor.js — Real-data College Predictor
   ------------------------------------------------------------
   • Cutoffs from REAL JoSAA 2024 data (cutoffEngine →
     realCutoffEngine → /public/data/josaa_2024.csv).
   • Results prioritised: NIRF rank → branch value → closing rank.
   • Stretch tier REMOVED — eligible check is strict (rank ≤ closing).
   • predictCollegesGrouped() buckets results by IIT/NIT/IIIT/GFTI.
   ============================================================ */

import { COLLEGES }    from "../data/colleges.js";
import { SEAT_MATRIX } from "../data/seatMatrix.js";
import {
  expandRounds,
  collegeBranches,
  forecastClosing,
} from "./cutoffEngine.js";

const TYPE_LABEL   = { IIT: "IIT", NIT: "NIT", IIIT: "IIIT", GFTI: "GFTI" };
const FEMALE_RELAX = { IIT: 1.35, NIT: 1.20, IIIT: 1.20, GFTI: 1.15 };
const HOME_STATE_RELAX = 1.25;

/* Branch desirability weight (placement + demand). Higher = more valuable. */
const BRANCH_VALUE = {
  cse: 100, ai: 95, it: 90, ece: 82, eee: 70, ee: 68,
  che: 60, me: 64, ce: 48, mme: 42,
};
const branchValue = (code) => BRANCH_VALUE[code] ?? 40;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function estimateAdmitRound(rounds, candidateRank, relaxedClosing) {
  for (const rd of rounds) if (candidateRank <= Math.round(rd.closing)) return rd.round;
  if (candidateRank <= relaxedClosing) return rounds[rounds.length - 1]?.round ?? null;
  return null;
}

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

/**
 * Returns a flat sorted array of college-branch matches for a given rank.
 *
 * @param {Object}   opts
 * @param {number}   opts.rank       JEE Adv rank (IITs) / JEE Main CRL (others)
 * @param {string}   opts.category   "OPEN" | "OBC-NCL" | "EWS" | "SC" | "ST"
 * @param {string}  [opts.state]     Home state code
 * @param {string}  [opts.branch]    Restrict to one branch code
 * @param {string[]}[opts.types]     Institute types to include
 * @param {boolean} [opts.female]    Apply female-pool relaxation
 * @param {boolean} [opts.homeState] Apply home-state relaxation
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
  const r = Number(rank) || 0;
  if (r <= 0) return [];

  const out = [];

  COLLEGES.forEach((college) => {
    if (!types.includes(college.type)) return;

    const femaleRelax     = female    ? (FEMALE_RELAX[college.type] ?? 1.15) : 1;
    const isHome          = homeState && state && college.state === state && college.type !== "IIT";
    const homeRelax       = isHome    ? HOME_STATE_RELAX : 1;
    const totalRelax      = femaleRelax * homeRelax;

    collegeBranches(college).forEach((b) => {
      if (branch && b.code !== branch) return;

      const rounds = expandRounds(college, b.code, category); // real 2024 data
      if (!rounds.length) return;

      const r1Opening      = rounds[0].opening;
      const r1Closing      = rounds[0].closing;
      const rawClosing     = rounds[rounds.length - 1].closing;

      const effOpening      = Math.round(r1Opening);
      const effR1Closing    = Math.round(r1Closing  * totalRelax);
      const effFinalClosing = Math.round(rawClosing  * totalRelax);

      // ── Strict eligibility (no stretch buffer) ──────────────
      if (r > effFinalClosing) return;

      const forecast2026 = forecastClosing(college, b.code, category);
      const { programName, totalSeats, seatsInCategory } =
        getSeatData(college, b.code, category);
      const rankGap = effFinalClosing - r;

      // ── 4-tier classification (Stretch removed) ─────────────
      let tier;
      if      (r <= effOpening)              tier = "Safe";
      else if (r <= effR1Closing)            tier = "Good";
      else if (r <= effFinalClosing * 0.88)  tier = "Moderate";
      else                                   tier = "Reach";

      // ── Fit score 5–100 ─────────────────────────────────────
      let score;
      if (r <= effOpening) {
        score = 100;
      } else if (r <= effR1Closing) {
        score = Math.round(
          90 - ((r - effOpening) / Math.max(1, effR1Closing - effOpening)) * 25
        );
      } else if (r <= effFinalClosing * 0.88) {
        score = Math.round(
          65 - ((r - effR1Closing) / Math.max(1, effFinalClosing * 0.88 - effR1Closing)) * 20
        );
      } else {
        score = Math.round(
          45 - ((r - effFinalClosing * 0.88) / Math.max(1, effFinalClosing * 0.12)) * 20
        );
      }

      const relaxedRounds = rounds.map((rd) => ({
        ...rd,
        closing: Math.round(rd.closing * totalRelax),
      }));
      const admitRound = estimateAdmitRound(relaxedRounds, r, effFinalClosing);

      out.push({
        slug:            college.slug,
        college:         college.name,
        short:           college.short,
        type:            TYPE_LABEL[college.type] || college.type,
        nirf:            college.nirf,
        state:           college.state,
        isHomeState:     isHome,
        branchCode:      b.code,
        branch:          b.name,
        programName:     programName ?? b.name,
        branchValue:     branchValue(b.code),
        category,
        opening:         effOpening,
        r1Closing:       effR1Closing,
        closing:         effFinalClosing,
        rawClosing,
        forecastClose2026: forecast2026 ? Math.round(forecast2026.closing * totalRelax) : null,
        totalSeats,
        seatsInCategory,
        score:           clamp(score, 5, 100),
        tier,
        rankGap,
        admitRound,
        totalRounds:     rounds.length,
        femaleQuota:     female,
        homeStateQuota:  isHome,
        relaxMultiplier: totalRelax,
        avgPackage:      college.placements?.byBranch?.[b.code] ?? college.placements?.avg ?? null,
        _statePref:      state && college.state === state ? 1 : 0,
      });
    });
  });

  // ── Sort: home-state pref → NIRF rank → branch value → closing rank ──
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
 *
 * @param {Object} opts — same options as predictColleges
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
      if (m.type !== key)   continue; // wrong group
      if (seen.has(m.slug)) continue; // already have best branch for this college
      seen.add(m.slug);
      groups[key].push(m);
      if (groups[key].length >= 9) break;
    }
  }

  return groups;
}

// ─── UI helpers ──────────────────────────────────────────────
// Stretch entries kept in maps for any legacy UI references,
// but predictColleges no longer generates Stretch-tier results.
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