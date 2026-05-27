/* ============================================================
   cutoffEngine.js — cutoff expansion, history, forecast & seat matrix
   ------------------------------------------------------------
   Exports:
     collegeBranches(college)          → [{ code, name }]
     expandRounds(college, branch, cat)→ [{ round, stage, opening, closing }]
     cutoffHistory(college, branch, cat)  → [{ year, opening, closing }]
     forecastClosing(college, branch, cat)→ { closing } | null
     finalClosing(college, branch, cat)   → alias for forecastClosing (legacy)
     seatMatrix(college)                  → [{ code, name, total, byCat }]

   IITs  → 6 JoSAA rounds only
   NITs / IIITs / GFTIs → 6 JoSAA + 2 CSAB rounds
   ============================================================ */

import { SEAT_MATRIX } from "../data/seatMatrix.js";
import { BRANCHES }    from "../data/colleges.js";

// ─────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────

/** Deterministic pseudo-random integer from a string seed */
function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Returns a small integer noise value centred around 0.
 * @param {string} salt   – unique string for this call
 * @param {number} spread – half-range (result is in [-spread, +spread])
 */
function noise(salt, spread) {
  const s = hashSeed(salt);
  return (s % (spread * 2 + 1)) - spread;
}

// ─────────────────────────────────────────────────────────────
// collegeBranches
// ─────────────────────────────────────────────────────────────

/**
 * Returns the list of branch objects that have baseCutoff data for a college.
 * @param {object} college – from COLLEGES array
 * @returns {{ code: string, name: string }[]}
 */
export function collegeBranches(college) {
  if (!college?.baseCutoff) return [];
  return Object.keys(college.baseCutoff).map((code) => {
    const found = BRANCHES.find((b) => b.code === code);
    return found ?? { code, name: code.toUpperCase() };
  });
}

// ─────────────────────────────────────────────────────────────
// expandRounds
// ─────────────────────────────────────────────────────────────

/*
  JoSAA rounds: as rounds progress the closing rank relaxes (higher number =
  more lenient). Round 1 is tightest; Round 6 is most relaxed.
  CSAB special rounds (NITs/IIITs only) are even more relaxed.

  Multipliers are applied to the base CLOSING rank from colleges.js.
  Opening rank each round ≈ previous round's closing rank.
*/

const JOSAA_CLOSE_MUL = [1.000, 1.075, 1.130, 1.185, 1.240, 1.300];
const JOSAA_OPEN_MUL  = [1.000, 1.010, 1.065, 1.115, 1.170, 1.225];

const CSAB_CLOSE_MUL  = [1.370, 1.450];
const CSAB_OPEN_MUL   = [1.310, 1.385];

const JOSAA_ROUNDS = 6;
const CSAB_ROUNDS  = 2;

/**
 * Expands base cutoff into per-round opening & closing ranks.
 * @param {object} college
 * @param {string} branch  – branch code e.g. "cse"
 * @param {string} cat     – category e.g. "OPEN"
 * @returns {{ round: string, stage: string, opening: number, closing: number }[]}
 */
export function expandRounds(college, branch, cat) {
  const base = college?.baseCutoff?.[branch]?.[cat];
  if (!base) return [];

  const [baseOpen, baseClose] = base;
  const isIIT = college.type === "IIT";
  const spread = Math.max(8, Math.round(baseClose * 0.013));
  const rounds = [];

  for (let i = 0; i < JOSAA_ROUNDS; i++) {
    const n = noise(`${college.slug}-${branch}-${cat}-jr${i}`, spread);
    rounds.push({
      round:   `JR ${i + 1}`,
      stage:   "JoSAA",
      opening: Math.max(1, Math.round(baseOpen  * JOSAA_OPEN_MUL[i]  + n * 0.35)),
      closing: Math.max(1, Math.round(baseClose * JOSAA_CLOSE_MUL[i] + n)),
    });
  }

  if (!isIIT) {
    for (let i = 0; i < CSAB_ROUNDS; i++) {
      const n = noise(`${college.slug}-${branch}-${cat}-csab${i}`, spread);
      rounds.push({
        round:   `CR ${i + 1}`,
        stage:   "CSAB",
        opening: Math.max(1, Math.round(baseOpen  * CSAB_OPEN_MUL[i]  + n * 0.35)),
        closing: Math.max(1, Math.round(baseClose * CSAB_CLOSE_MUL[i] + n)),
      });
    }
  }

  return rounds;
}

// ─────────────────────────────────────────────────────────────
// cutoffHistory
// ─────────────────────────────────────────────────────────────

/*
  Generates simulated year-wise Round-1 cutoffs for 2021–2025.
  The trend: ranks were higher (more lenient) in earlier years and
  have tightened steadily — i.e. YEAR_MUL > 1 for older years.
*/

const HISTORY_YEARS = [2021, 2022, 2023, 2024, 2025];

// Factor by which base (2025) cutoff is scaled to get each historical year.
// Values > 1 → older years had higher (more lenient) closing ranks.
const YEAR_CLOSE_MUL = [1.22, 1.15, 1.08, 1.03, 1.00];
const YEAR_OPEN_MUL  = [1.20, 1.13, 1.07, 1.02, 1.00];

/**
 * Returns 5-year opening & closing rank history for a college/branch/category.
 * @param {object} college
 * @param {string} branch
 * @param {string} cat
 * @returns {{ year: number, opening: number, closing: number }[]}
 */
export function cutoffHistory(college, branch, cat) {
  const base = college?.baseCutoff?.[branch]?.[cat];
  if (!base) return [];

  const [baseOpen, baseClose] = base;
  const spread = Math.max(6, Math.round(baseClose * 0.018));

  return HISTORY_YEARS.map((year, i) => {
    const n = noise(`${college.slug}-${branch}-${cat}-hist${year}`, spread);
    return {
      year,
      opening: Math.max(1, Math.round(baseOpen  * YEAR_OPEN_MUL[i]  + n * 0.30)),
      closing: Math.max(1, Math.round(baseClose * YEAR_CLOSE_MUL[i] + n)),
    };
  });
}

// ─────────────────────────────────────────────────────────────
// forecastClosing
// ─────────────────────────────────────────────────────────────

/**
 * Linear regression over cutoffHistory → forecast closing rank for 2026.
 * Returns null when there isn't enough data or the projection is nonsensical.
 * @param {object} college
 * @param {string} branch
 * @param {string} cat
 * @returns {{ closing: number } | null}
 */
export function forecastClosing(college, branch, cat) {
  const history = cutoffHistory(college, branch, cat);
  if (history.length < 3) return null;

  const n     = history.length;
  const xs    = history.map((h) => h.year);
  const ys    = history.map((h) => h.closing);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;

  const num = xs.reduce((acc, x, i) => acc + (x - xMean) * (ys[i] - yMean), 0);
  const den = xs.reduce((acc, x)    => acc + (x - xMean) ** 2, 0);

  if (den === 0) return null;

  const slope     = num / den;
  const intercept = yMean - slope * xMean;
  const forecast  = Math.round(slope * 2026 + intercept);

  return forecast > 0 ? { closing: forecast } : null;
}

// ─────────────────────────────────────────────────────────────
// seatMatrix
// ─────────────────────────────────────────────────────────────

/**
 * Returns the real JoSAA seat matrix for a college using SEAT_MATRIX data.
 * Falls back to estimated seats from baseCutoff branches if the college slug
 * isn't present in SEAT_MATRIX (e.g. very new institutes).
 *
 * @param {object} college
 * @returns {{
 *   code:  string,
 *   name:  string,
 *   total: number,
 *   byCat: { OPEN: number, "OBC-NCL": number, EWS: number, SC: number, ST: number }
 * }[]}
 */
export function seatMatrix(college) {
  // ── Primary: real data from seatMatrix.js ──
  const data = SEAT_MATRIX[college?.slug];

  if (data?.programs?.length) {
    return data.programs.map((prog) => ({
      // Create a stable slug-like code from the program name
      code:  prog.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 32),
      name:  prog.name,
      total: prog.seats ?? 0,
      byCat: {
        OPEN:       prog.OPEN        ?? 0,
        "OBC-NCL":  prog["OBC-NCL"] ?? 0,
        EWS:        prog.EWS        ?? 0,
        SC:         prog.SC         ?? 0,
        ST:         prog.ST         ?? 0,
      },
    }));
  }

  // ── Fallback: estimate from baseCutoff branch list ──
  if (!college?.baseCutoff) return [];

  return Object.keys(college.baseCutoff).map((code) => {
    const branch = BRANCHES.find((b) => b.code === code);

    // Rough default totals by institute type
    const total = college.type === "IIT" ? 60 : college.type === "NIT" ? 120 : 90;

    // Standard reservation ratios (approx.)
    return {
      code,
      name:  branch?.name ?? code.toUpperCase(),
      total,
      byCat: {
        OPEN:       Math.round(total * 0.407),
        "OBC-NCL":  Math.round(total * 0.270),
        EWS:        Math.round(total * 0.100),
        SC:         Math.round(total * 0.150),
        ST:         Math.round(total * 0.075),
      },
    };
  });
}

// ─────────────────────────────────────────────────────────────
// Legacy alias — Compare.jsx and any other file that was
// importing 'finalClosing' will continue to work unchanged.
// ─────────────────────────────────────────────────────────────
export const finalClosing = forecastClosing;