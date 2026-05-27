/* ============================================================
   collegePredictor.js  — Enhanced College Predictor
   ------------------------------------------------------------
   Given a predicted rank + category + optional filters, returns
   ALL eligible college/branch combinations with rich metadata.

   Improvements over v1:
   ✔ Uses SEAT_MATRIX for real program names & category-wise seat counts
   ✔ Real cutoff values from baseCutoff via expandRounds
   ✔ 5-tier confidence system (Safe → Stretch)
   ✔ admitRound: which JoSAA/CSAB round the candidate likely gets in
   ✔ rankGap: how far inside/outside the closing rank
   ✔ forecastClose2026: AI-trend forecast cutoff for next cycle
   ✔ Accurate female supernumerary quota relaxation (IIT: 1.35×, NIT: 1.20×)
   ✔ Accurate home-state NIT/IIIT quota relaxation (1.25×)
   ✔ programName from real SEAT_MATRIX when available
   ✔ seatsInCategory & totalSeats from SEAT_MATRIX
   ✔ Placement data per branch
   ============================================================ */

import { COLLEGES }    from "../data/colleges.js";
import { SEAT_MATRIX } from "../data/seatMatrix.js";
import {
  expandRounds,
  collegeBranches,
  forecastClosing,
} from "./cutoffEngine.js";

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const TYPE_LABEL = { IIT: "IIT", NIT: "NIT", IIIT: "IIIT", GFTI: "GFTI" };

/**
 * Female supernumerary quota relaxation by institute type.
 * IITs create extra seats (≈1.35×), NITs/IIITs use existing seats (≈1.20×).
 */
const FEMALE_RELAX = { IIT: 1.35, NIT: 1.20, IIIT: 1.20, GFTI: 1.15 };

/**
 * Home-state (HS) quota at NITs/IIITs relaxes cutoff by ≈25%.
 * IITs have no state quota.
 */
const HOME_STATE_RELAX = 1.25;

/**
 * Stretch buffer: candidates ranked up to 3% beyond closing rank
 * are shown as "Stretch" — they may get in if seats remain in later rounds.
 */
const STRETCH_BUFFER = 1.03;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Clamps a value between min and max.
 */
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/**
 * Given the full rounds array and a candidate rank, returns the label of the
 * FIRST round where the candidate's rank falls within that round's closing.
 * Returns null if the rank doesn't qualify even in the final round.
 */
function estimateAdmitRound(rounds, candidateRank, relaxedClosing) {
  for (const r of rounds) {
    if (candidateRank <= Math.round(r.closing)) return r.round;
  }
  // Falls outside normal rounds but within stretch buffer
  if (candidateRank <= relaxedClosing) return rounds[rounds.length - 1]?.round ?? null;
  return null;
}

/**
 * Looks up real program data from SEAT_MATRIX for a college+branch pair.
 * Matches on program name containing the branch name keywords.
 * Returns { programName, totalSeats, seatsInCategory } or defaults.
 */
function getSeatData(college, branchCode, category) {
  const matrix = SEAT_MATRIX[college.slug];
  if (!matrix?.programs?.length) {
    return { programName: null, totalSeats: null, seatsInCategory: null };
  }

  // Map branch codes to keywords to search in program names
  const BRANCH_KEYWORDS = {
    cse:  ["computer science", "cse", "computing"],
    ece:  ["electronics and communication", "ece", "electronics & communication"],
    ee:   ["electrical engineering", "electrical and electronics", "eee", "electrical engineering"],
    me:   ["mechanical engineering"],
    ce:   ["civil engineering"],
    che:  ["chemical engineering"],
    mme:  ["metallurgical", "materials engineering", "materials science"],
    ai:   ["artificial intelligence", "ai and", "ai &", "data science and ai"],
  };

  const keywords = BRANCH_KEYWORDS[branchCode] ?? [branchCode];
  const prog = matrix.programs.find((p) =>
    keywords.some((kw) => p.name.toLowerCase().includes(kw))
  );

  if (!prog) return { programName: null, totalSeats: null, seatsInCategory: null };

  return {
    programName:      prog.name,
    totalSeats:       prog.seats        ?? null,
    seatsInCategory:  prog[category]    ?? prog["OPEN"] ?? null,
  };
}

// ─────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────

/**
 * @param {Object}   opts
 * @param {number}   opts.rank           Predicted category rank (JEE Adv or JEE Main CRL)
 * @param {string}   opts.category       "OPEN" | "OBC-NCL" | "EWS" | "SC" | "ST"
 * @param {string}   [opts.state]        Preferred state for display ordering
 * @param {string}   [opts.branch]       Filter to a specific branch code (e.g. "cse")
 * @param {string[]} [opts.types]        Institute types to include
 * @param {boolean}  [opts.female]       Female supernumerary quota
 * @param {boolean}  [opts.homeState]    Home-state quota (NITs/IIITs only)
 * @returns {PredictorResult[]}          Sorted array of eligible combinations
 */
export function predictColleges({
  rank,
  category    = "OPEN",
  state       = "",
  branch      = "",
  types       = ["IIT", "NIT", "IIIT", "GFTI"],
  female      = false,
  homeState   = false,
} = {}) {
  const r   = Number(rank) || 0;
  if (r <= 0) return [];

  const out = [];

  COLLEGES.forEach((college) => {
    if (!types.includes(college.type)) return;

    // ── Quota relaxation multipliers ──────────────────────────
    const femaleRelax    = female    ? (FEMALE_RELAX[college.type] ?? 1.15) : 1;
    const isHome         = homeState && state
                           && college.state === state
                           && college.type  !== "IIT";
    const homeRelax      = isHome ? HOME_STATE_RELAX : 1;
    const totalRelax     = femaleRelax * homeRelax;

    collegeBranches(college).forEach((b) => {
      if (branch && b.code !== branch) return;

      const rounds = expandRounds(college, b.code, category);
      if (!rounds.length) return;

      // ── Core cutoff values ────────────────────────────────
      const r1Opening  = rounds[0].opening;
      const r1Closing  = rounds[0].closing;                            // JoSAA Round 1
      const finalRound = rounds[rounds.length - 1];                    // last round
      const rawClosing = finalRound.closing;                           // last round raw

      // Apply quota relaxation to get effective cutoffs
      const effR1Closing   = Math.round(r1Closing   * totalRelax);
      const effFinalClosing = Math.round(rawClosing  * totalRelax);
      const effOpening     = Math.round(r1Opening);   // opening not relaxed (same seat)

      // ── Eligibility check ─────────────────────────────────
      // Allow up to STRETCH_BUFFER beyond the effective final closing
      if (r > effFinalClosing * STRETCH_BUFFER) return;

      // ── Forecast 2026 closing rank ────────────────────────
      const forecast2026 = forecastClosing(college, b.code, category);

      // ── Seat data from SEAT_MATRIX ────────────────────────
      const { programName, totalSeats, seatsInCategory } =
        getSeatData(college, b.code, category);

      // ── Rank gap (negative = you exceed cutoff, positive = safely inside) ──
      const rankGap = effFinalClosing - r;   // +ve good, -ve means stretch zone

      // ── Match score (0–100) ───────────────────────────────
      // Zone 1: rank <= opening                  → 90–100 (sure-shot)
      // Zone 2: opening < rank <= r1Closing      → 65–90  (safe)
      // Zone 3: r1Closing < rank <= 85% final    → 45–65  (moderate)
      // Zone 4: 85% final < rank <= final        → 25–45  (reach)
      // Zone 5: final < rank <= final × buffer   → 10–25  (stretch)
      let score;
      if (r <= effOpening) {
        score = 100;
      } else if (r <= effR1Closing) {
        const pct = (r - effOpening) / Math.max(1, effR1Closing - effOpening);
        score = Math.round(90 - pct * 25);          // 90 → 65
      } else if (r <= effFinalClosing * 0.88) {
        const pct = (r - effR1Closing) / Math.max(1, effFinalClosing * 0.88 - effR1Closing);
        score = Math.round(65 - pct * 20);          // 65 → 45
      } else if (r <= effFinalClosing) {
        const pct = (r - effFinalClosing * 0.88) / Math.max(1, effFinalClosing * 0.12);
        score = Math.round(45 - pct * 20);          // 45 → 25
      } else {
        // Stretch zone
        const pct = (r - effFinalClosing) / Math.max(1, effFinalClosing * (STRETCH_BUFFER - 1));
        score = Math.round(25 - pct * 15);          // 25 → 10
      }

      // ── 5-tier confidence ─────────────────────────────────
      let tier;
      if      (r <= effOpening)               tier = "Safe";
      else if (r <= effR1Closing)             tier = "Good";
      else if (r <= effFinalClosing * 0.88)   tier = "Moderate";
      else if (r <= effFinalClosing)          tier = "Reach";
      else                                    tier = "Stretch";

      // ── Predicted admission round ────────────────────────
      // Build relaxed rounds array for round estimation
      const relaxedRounds = rounds.map((rd) => ({
        ...rd,
        closing: Math.round(rd.closing * totalRelax),
      }));
      const admitRound = estimateAdmitRound(relaxedRounds, r, effFinalClosing);

      // ── Sorting helpers ───────────────────────────────────
      const statePref = state && college.state === state ? 1 : 0;

      out.push({
        // ── Identity ──
        slug:             college.slug,
        college:          college.name,
        short:            college.short,
        type:             TYPE_LABEL[college.type] || college.type,
        nirf:             college.nirf,
        state:            college.state,
        isHomeState:      isHome,

        // ── Branch / Program ──
        branchCode:       b.code,
        branch:           b.name,
        programName:      programName ?? b.name,   // real name from SEAT_MATRIX if found

        // ── Cutoffs ──
        category,
        opening:          effOpening,              // Round 1 opening (effective)
        r1Closing:        effR1Closing,            // Round 1 closing (effective)
        closing:          effFinalClosing,         // Final round closing (effective)
        rawClosing,                                // Unrelaxed final closing (for display info)

        // ── Forecast ──
        forecastClose2026: forecast2026
          ? Math.round(forecast2026.closing * totalRelax)
          : null,

        // ── Seat data ──
        totalSeats,
        seatsInCategory,

        // ── Prediction quality ──
        score:            clamp(score, 5, 100),
        tier,
        rankGap,                                   // + means inside, - means outside closing
        admitRound,                                // e.g. "JR 3" or "CR 1"
        totalRounds:      rounds.length,

        // ── Quota context ──
        femaleQuota:      female,
        homeStateQuota:   isHome,
        relaxMultiplier:  totalRelax,

        // ── Placements ──
        avgPackage:       college.placements?.byBranch?.[b.code]
                          ?? college.placements?.avg
                          ?? null,

        // ── Internal sort key ──
        _statePref:       statePref,
      });
    });
  });

  // ── Sort: home/state pref → score desc → closing asc → nirf asc ──
  out.sort(
    (a, b) =>
      b._statePref - a._statePref ||
      b.score      - a.score      ||
      a.closing    - b.closing    ||
      a.nirf       - b.nirf
  );

  // Clean up internal sort key before returning
  return out.map(({ _statePref, ...rest }) => rest);
}

// ─────────────────────────────────────────────────────────────
// UI helpers  (import these in your component)
// ─────────────────────────────────────────────────────────────

/** Colour token for each tier — use in JSX style props */
export const TIER_COLOR = {
  Safe:     "var(--green)",
  Good:     "var(--teal)",
  Moderate: "var(--orange)",
  Reach:    "var(--violet)",
  Stretch:  "var(--coral)",
};

/** Background token for each tier — for badge backgrounds */
export const TIER_BG = {
  Safe:     "rgba(46,196,182,.15)",
  Good:     "rgba(14,165,164,.15)",
  Moderate: "rgba(249,115,22,.13)",
  Reach:    "rgba(139,92,246,.13)",
  Stretch:  "rgba(239,68,68,.13)",
};

/**
 * Human-readable description for each tier shown in tooltips.
 */
export const TIER_DESC = {
  Safe:     "Your rank is above the opening rank — admission almost certain in Round 1.",
  Good:     "Your rank is comfortably within the Round-1 closing — high probability.",
  Moderate: "Your rank is within the final closing but may need later rounds.",
  Reach:    "Close to the final closing — possible in CSAB/last rounds.",
  Stretch:  "Slightly beyond the last closing — very low chance; keep as backup only.",
};

/**
 * Returns a short rank-gap label for display.
 * @param {number} rankGap   closing - candidateRank
 * @returns {string}
 */
export function rankGapLabel(rankGap) {
  if (rankGap >= 0) return `${rankGap.toLocaleString()} ranks inside`;
  return `${Math.abs(rankGap).toLocaleString()} ranks outside`;
}