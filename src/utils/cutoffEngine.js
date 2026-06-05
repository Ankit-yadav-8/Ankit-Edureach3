/* ============================================================
   cutoffEngine.js — REAL JoSAA cutoffs (2025) with modelled fallback
   ------------------------------------------------------------
   expandRounds / cutoffHistory / forecastClosing return REAL
   JoSAA data from realCutoffEngine.js.  When a branch has no real
   row (rare new programs) they fall back to the modelled curve so
   the UI never breaks.

   Default predictor year  = 2025.
   General pool quota      = AI (all-India) — standard for 2024/2025 JoSAA.
   seatMatrix()            uses the real SEAT_MATRIX (unchanged).
   ============================================================ */

import { SEAT_MATRIX } from "../data/seatMatrix.js";
import { BRANCHES }    from "../data/colleges.js";
import {
  loadCutoffDB,
  isDBReady,
  isPredictorReady,   // ← added: gates expandRounds on 2025-only fast load
  REAL_YEARS,
  getRealRounds,
  getRealPrograms,
} from "./realCutoffEngine.js";

// NOTE: loadCutoffDB() is NOT called here at module level.
// The predictor worker only needs 2025 data via loadPredictorDB().
// CollegeDetail and CutoffSection call loadCutoffDB() directly.

const DEFAULT_YEAR    = "2025";
const ALLINDIA_QUOTAS = ["AI", "OS"]; // AI for 2024+; OS for older NIT years

// ── Real-data plumbing ────────────────────────────────────────────────────────

const _progListCache = new Map();
function programsFor(college) {
  if (_progListCache.has(college.slug)) return _progListCache.get(college.slug);
  const list = getRealPrograms(college);
  if (isDBReady() || isPredictorReady()) _progListCache.set(college.slug, list);
  return list;
}

// Guard: confirm the matched program actually belongs to the requested branch
// so we never show (e.g.) a CSE cutoff under a "Mechanical" label.
const VERIFY_KW = {
  cse:    ["computer science"],
  it:     ["information technology"],
  ece:    ["electronics and comm", "electronics & comm"],
  ee:     ["electrical"],
  eee:    ["electrical"],
  me:     ["mechanical"],
  ce:     ["civil"],
  che:    ["chemical"],
  ch:     ["chemical"],
  mme:    ["metallurg", "material"],
  meta:   ["metallurg", "material"],
  ai:     ["artificial intelligence", "data science"],
  aero:   ["aerospace", "aeronaut"],
  arch:   ["architecture"],
  bio:    ["biotech"],
  maths:  ["mathematic"],
  physics:["physics"],
  prod:   ["production", "industrial"],
  mine:   ["mining"],
  instr:  ["instrumentation"],
};

function programForBranch(college, branchCode) {
  const progs = programsFor(college);
  if (!progs.length) return null;
  const kws = VERIFY_KW[branchCode];

  // 1) keyword-verified match
  if (kws) {
    const hit = progs.find((p) => {
      const l = p.toLowerCase();
      return kws.some((k) => l.includes(k));
    });
    return hit ?? null; // known branch but no matching program → use modelled
  }

  // 2) unknown branch code: loose contains on the code itself
  return progs.find((p) => p.toLowerCase().includes(branchCode.toLowerCase())) ?? null;
}

function realRounds(college, branchCode, cat, year, gender = "GN") {
  // accept either the full 8-year DB or the 2025-only predictor DB
  if (!isDBReady() && !isPredictorReady()) return null;
  const program = programForBranch(college, branchCode);
  if (!program) return null;
  for (const q of ALLINDIA_QUOTAS) {
    const rounds = getRealRounds(college, program, q, cat, year, gender);
    if (rounds.length) return rounds;
  }
  return null;
}

// Multi-year history that handles the NIT quota-code switch
// (older years use OS, 2024+ use AI) by trying both per year.
// NOTE: this still gates on isDBReady() (full 8-year DB) — intentional.
function realHistoryMerged(college, branchCode, cat) {
  if (!isDBReady()) return [];
  const program = programForBranch(college, branchCode);
  if (!program) return [];
  const out = [];
  for (const yr of REAL_YEARS) {
    for (const q of ALLINDIA_QUOTAS) {
      const rnds = getRealRounds(college, program, q, cat, yr, "GN");
      if (rnds.length) {
        const rf = rnds[rnds.length - 1];
        out.push({ year: Number(yr), opening: rnds[0].opening, closing: rf.closing });
        break;
      }
    }
  }
  return out;
}

// ── Modelled fallback — used only when no real row exists ─────────────────────
function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function noise(salt, spread) {
  const s = hashSeed(salt);
  return (s % (spread * 2 + 1)) - spread;
}

const JOSAA_CLOSE_MUL = [1.000, 1.075, 1.130, 1.185, 1.240, 1.300];
const JOSAA_OPEN_MUL  = [1.000, 1.010, 1.065, 1.115, 1.170, 1.225];
const CSAB_CLOSE_MUL  = [1.370, 1.450];
const CSAB_OPEN_MUL   = [1.310, 1.385];

function modelledRounds(college, branch, cat) {
  const base = college?.baseCutoff?.[branch]?.[cat];
  if (!base) return [];
  const [baseOpen, baseClose] = base;
  const isIIT  = college.type === "IIT";
  const spread = Math.max(8, Math.round(baseClose * 0.013));
  const rounds = [];
  for (let i = 0; i < 6; i++) {
    const n = noise(`${college.slug}-${branch}-${cat}-jr${i}`, spread);
    rounds.push({
      round:   `JR ${i + 1}`,
      stage:   "JoSAA",
      opening: Math.max(1, Math.round(baseOpen  * JOSAA_OPEN_MUL[i]  + n * 0.35)),
      closing: Math.max(1, Math.round(baseClose * JOSAA_CLOSE_MUL[i] + n)),
    });
  }
  if (!isIIT) {
    for (let i = 0; i < 2; i++) {
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

const HISTORY_YEARS   = [2021, 2022, 2023, 2024, 2025];
const YEAR_CLOSE_MUL  = [1.22, 1.15, 1.08, 1.03, 1.00];
const YEAR_OPEN_MUL   = [1.20, 1.13, 1.07, 1.02, 1.00];

function modelledHistory(college, branch, cat) {
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

function modelledForecast(college, branch, cat) {
  const history = modelledHistory(college, branch, cat);
  if (history.length < 3) return null;
  const n  = history.length;
  const xs = history.map((h) => h.year);
  const ys = history.map((h) => h.closing);
  const xM = xs.reduce((a, b) => a + b, 0) / n;
  const yM = ys.reduce((a, b) => a + b, 0) / n;
  const num = xs.reduce((a, x, i) => a + (x - xM) * (ys[i] - yM), 0);
  const den = xs.reduce((a, x) => a + (x - xM) ** 2, 0);
  if (den === 0) return null;
  const slope = num / den, intercept = yM - slope * xM;
  const f = Math.round(slope * 2026 + intercept);
  return f > 0 ? { closing: f } : null;
}

// ── collegeBranches ───────────────────────────────────────────────────────────
export function collegeBranches(college) {
  if (!college?.baseCutoff) return [];
  return Object.keys(college.baseCutoff).map((code) => {
    const found = BRANCHES.find((b) => b.code === code);
    return found ?? { code, name: code.toUpperCase() };
  });
}

// ── expandRounds — real 2025 data, modelled fallback ─────────────────────────
// realOnly=true: skip the modelled fallback; used by predictor to avoid fake results.
// gender: "GN" (default) or "FO" (female-only supernumerary seats).
export function expandRounds(college, branch, cat, year = DEFAULT_YEAR, realOnly = false, gender = "GN") {
  const real = realRounds(college, branch, cat, year, gender);
  if (real && real.length) return real;
  if (realOnly) return [];
  return modelledRounds(college, branch, cat);
}

// ── cutoffHistory — real multi-year, modelled fallback ────────────────────────
// Uses full 8-year DB (isDBReady) — unchanged, intentional.
export function cutoffHistory(college, branch, cat) {
  const real = realHistoryMerged(college, branch, cat);
  if (real.length) return real;
  return modelledHistory(college, branch, cat);
}

// ── forecastClosing — real trend, modelled fallback ───────────────────────────
// Uses full 8-year DB (isDBReady) — unchanged, intentional.
export function forecastClosing(college, branch, cat) {
  const real = realHistoryMerged(college, branch, cat);
  const pts  = real.filter((h) => h.closing > 0).map((h) => [h.year, h.closing]);
  if (pts.length >= 2) {
    const n   = pts.length;
    const sx  = pts.reduce((a, p) => a + p[0], 0);
    const sy  = pts.reduce((a, p) => a + p[1], 0);
    const sxy = pts.reduce((a, p) => a + p[0] * p[1], 0);
    const sxx = pts.reduce((a, p) => a + p[0] * p[0], 0);
    const denom = n * sxx - sx * sx;
    if (denom) {
      const slope     = (n * sxy - sx * sy) / denom;
      const intercept = (sy - slope * sx) / n;
      const f = Math.round(slope * 2026 + intercept);
      if (f > 0) return { closing: f };
    }
  }
  return modelledForecast(college, branch, cat);
}

// ── seatMatrix — real SEAT_MATRIX, modelled fallback ─────────────────────────
export function seatMatrix(college) {
  const data = SEAT_MATRIX[college?.slug];
  if (data?.programs?.length) {
    return data.programs.map((prog) => ({
      code:  prog.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32),
      name:  prog.name,
      total: prog.seats ?? 0,
      byCat: {
        OPEN:      prog.OPEN        ?? 0,
        "OBC-NCL": prog["OBC-NCL"] ?? 0,
        EWS:       prog.EWS         ?? 0,
        SC:        prog.SC          ?? 0,
        ST:        prog.ST          ?? 0,
      },
    }));
  }
  if (!college?.baseCutoff) return [];
  return Object.keys(college.baseCutoff).map((code) => {
    const branch = BRANCHES.find((b) => b.code === code);
    const total  = college.type === "IIT" ? 60 : college.type === "NIT" ? 120 : 90;
    return {
      code, name: branch?.name ?? code.toUpperCase(), total,
      byCat: {
        OPEN:      Math.round(total * 0.407),
        "OBC-NCL": Math.round(total * 0.270),
        EWS:       Math.round(total * 0.100),
        SC:        Math.round(total * 0.150),
        ST:        Math.round(total * 0.075),
      },
    };
  });
}

export const finalClosing = forecastClosing;