/* ============================================================
   rankPredictor.js  —  marks → rank, for JEE Main & Advanced
   ------------------------------------------------------------
   JEE Main:     interpolation from historical marks-vs-rank table
   JEE Advanced: band-based on 2025 actual data + 2026 projections
                 Calibration: 146 marks OBC → CRL ~4,846 | OBC ~938
   ============================================================ */

// ── JEE Main ──────────────────────────────────────────────────
const MAIN_TABLE = [
  [300, 1], [290, 15], [281, 40], [271, 110], [261, 300], [250, 700],
  [241, 1400], [231, 2700], [220, 5000], [210, 7800], [200, 11000],
  [190, 15500], [180, 21000], [170, 28000], [160, 36000], [150, 46000],
  [140, 58000], [130, 73000], [120, 92000], [110, 116000], [100, 145000],
  [90, 180000], [80, 225000], [70, 285000], [60, 360000], [50, 460000],
  [40, 590000], [30, 750000], [20, 920000], [10, 1080000], [0, 1250000],
];

// ── JEE Advanced 2026 bands ───────────────────────────────────
// [marksHi, marksLo, ref25Lo, ref25Hi, proj26Lo, proj26Hi]
// Primary: 2025 actual marks vs AIR
// Secondary: 2026 projections (cross-check)
const ADV_BANDS = [
  [360, 278,  1,      101,    1,      80],
  [278, 262,  101,    200,    80,     200],
  [262, 234,  201,    500,    180,    480],
  [234, 208,  501,    1000,   480,    950],
  [208, 193,  1001,   1500,   950,    1450],
  [193, 181,  1501,   2000,   1450,   1950],
  [181, 172,  2001,   2500,   1950,   2450],
  [172, 165,  2501,   3000,   2450,   2950],
  [165, 154,  3001,   4000,   2950,   3900],
  [154, 149,  4001,   4500,   3900,   4400],
  [149, 145,  4501,   5000,   4400,   4900],
  [145, 135,  5001,   6701,   4900,   6600],
  [135, 120,  6801,   9901,   6700,   9800],
  [120, 110,  10001,  13001,  9900,   12900],
  [110, 105,  13101,  14901,  13000,  14800],
  [105, 100,  15001,  17001,  14900,  16900],
  [100, 94,   17101,  19901,  17000,  20000],
  [94,  74,   20000,  23000,  20000,  23000],
];

// ── Category minimum aggregate cutoffs ───────────────────────
const CAT_AGG_CUTOFF = {
  General: 90, EWS: 90, "OBC-NCL": 81, SC: 45, ST: 45, PwD: 45,
};
// Approximate per-subject minimum (each subject must meet this)
const CAT_SUB_CUTOFF = {
  General: 10, EWS: 10, "OBC-NCL": 9, SC: 5, ST: 5, PwD: 5,
};

// ── Category rank divisors ────────────────────────────────────
// CRL ÷ divisor = category rank
// Calibrated: 4,846 CRL ÷ 5.17 = 938 OBC rank ✓
const CATEGORY_DIVISOR = {
  General: 1, EWS: 1.11, "OBC-NCL": 5.17, SC: 2.0, ST: 1.33, PwD: 1.05,
};

// Legacy factor for JEE Main (CRL × factor = category rank)
const CATEGORY_FACTOR = {
  General: 1, "OBC-NCL": 0.42, EWS: 0.78, SC: 0.16, ST: 0.085, PwD: 0.05,
};

// ── IIT branch possibilities by effective rank ────────────────
// [effRankLo, effRankHi, likelyBranches[], stretchOption]
const BRANCH_TABLE = [
  [1,     50,
    ["IIT Bombay CSE", "IIT Delhi CSE", "IIT Madras CSE", "IIT Kanpur CSE", "IIT Kharagpur CSE"],
    "IIT Bombay CSE (closing rank ≤65)"],
  [51,    200,
    ["IIT Delhi CSE", "IIT Madras CSE", "IIT Kanpur CSE", "IIT Bombay Electrical", "IIT Kharagpur CSE"],
    "IIT Bombay CSE (rank ≤65)"],
  [201,   500,
    ["IIT Kharagpur CSE", "IIT Roorkee CSE", "IIT Guwahati CSE", "IIT Hyderabad CSE", "IIT Bombay/Delhi Electrical"],
    "IIT Madras/Delhi CSE (rank ≤200)"],
  [501,   1000,
    ["IIT Hyderabad CSE", "IIT BHU Varanasi CSE", "IIT Roorkee Electrical", "IIT Guwahati ECE/Electrical", "IIT Dhanbad CSE"],
    "IIT Kanpur/Kharagpur CSE (rank ≤500)"],
  [1001,  2000,
    ["IIT ISM Dhanbad CSE", "Older IITs Electrical & Mechanical (Roorkee, BHU, Guwahati)", "Newer IITs CSE (Indore, Hyderabad, Gandhinagar)", "IIT BHU/Roorkee Civil & Chemical", "IIT Kharagpur/Guwahati Mathematics & Computing"],
    "Older IIT Electrical/ECE (rank ≤1000)"],
  [2001,  3500,
    ["Newer IITs CSE (Jodhpur, Indore, Ropar, Gandhinagar)", "Older IITs core branches (Mechanical, Civil, Chemical)", "IIT BHU/Dhanbad Electrical & ECE", "IIT Patna/Guwahati Mathematics & Computing", "Older IIT Metallurgy & Engineering Physics"],
    "Older IIT Electrical/Mechanical (rank ≤2000)"],
  [3501,  5500,
    ["Newer IITs CSE (Bhilai, Goa, Jammu, Dharwad, Tirupati)", "IIT Mandi/Palakkad/Patna CSE", "Older IITs non-core (Civil, Chemical, Metallurgy)", "Newer IITs Electrical & ECE", "IIT BHU/Dhanbad Mining & Pharmaceutical"],
    "Newer IIT CSE (rank ≤3500)"],
  [5501,  9000,
    ["Newer IITs core branches (Mechanical, Civil, Chemical)", "IIT Bhilai/Palakkad/Goa Electrical & ECE", "Newer IITs Metallurgy & Materials", "IIT Dharwad/Jammu Mechanical & Civil", "Older IIT interdisciplinary / dual-degree seats"],
    "Mid-tier IIT core branch (rank ≤5500)"],
  [9001,  15000,
    ["Newer IITs non-core branches (Civil, Chemical, Metallurgy)", "IIT Bhilai/Goa/Jammu remaining branches", "Newer IITs — limited seats, difficult for General", "IIT Dharwad/Tirupati Engineering Science & interdisciplinary", "Strong NIT options via JEE Main as backup"],
    "Newer IIT non-core branch (rank ≤9000)"],
  [15001, 23000,
    ["IIT seat very unlikely (General/EWS) — only last-round vacancies", "Top NITs via JEE Main — Trichy, Warangal, Surathkal", "IIIT Hyderabad / Allahabad via JEE Main", "Newer NITs CSE & core branches", "GFTIs and state colleges as backup"],
    "Unlikely for IIT — NIT+ via JEE Main is the realistic path"],
];

function getBranches(effRank) {
  for (const [lo, hi, opts, stretch] of BRANCH_TABLE) {
    if (effRank >= lo && effRank <= hi) return { options: opts, stretch };
  }
  return { options: ["Not in IIT rank list"], stretch: "—" };
}

function getAdviceAdv(effRank) {
  if (effRank <= 200)   return "Excellent — all top IIT CS/EE seats at Bombay, Delhi, Madras are within reach.";
  if (effRank <= 500)   return "Strong rank — top-5 IIT CS/EE/EP seats are realistic targets.";
  if (effRank <= 1000)  return "Good rank — IIT Kanpur, Kharagpur, Roorkee CS/EE are achievable.";
  if (effRank <= 2000)  return "Solid — older IIT core branches (EE, Mech) are likely; aim for Roorkee/Hyderabad.";
  if (effRank <= 3500)  return "Moderate — newer IIT CSE is possible; explore older IIT non-core via careful JoSAA strategy.";
  if (effRank <= 5500)  return "Below top-tier IIT cutoffs — mid/newer IIT non-core branches; NIT Trichy/Warangal are strong alternatives.";
  if (effRank <= 9000)  return "Tight for any IIT — newer IIT limited branches only; JEE Main NIT options are strong alternatives.";
  if (effRank <= 15000) return "Very limited IIT chances — focus on NIT Trichy, Warangal, Surathkal via your JEE Main rank.";
  return "IIT seat is extremely unlikely at this rank — strong NIT/IIIT options via JEE Main are the realistic path.";
}

// ── Helpers ───────────────────────────────────────────────────
const MAIN_CANDIDATES = 1100000;
const ADV_CANDIDATES  = 180000;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function interp(table, marks) {
  const m = clamp(marks, 0, table[0][0]);
  for (let i = 0; i < table.length - 1; i++) {
    const [hiM, hiR] = table[i];
    const [loM, loR] = table[i + 1];
    if (m <= hiM && m >= loM) {
      const t = (hiM - m) / (hiM - loM || 1);
      return Math.round(hiR + t * (loR - hiR));
    }
  }
  return table[table.length - 1][1];
}

function interpAdvBand(marks) {
  for (const [hi, lo, r25lo, r25hi, r26lo, r26hi] of ADV_BANDS) {
    if (marks <= hi && marks >= lo) {
      const frac = (hi - marks) / Math.max(hi - lo, 1);
      return {
        ref25Lo: r25lo, ref25Hi: r25hi,
        ref25Mid: Math.round(r25lo + frac * (r25hi - r25lo)),
        est26Lo: r26lo, est26Hi: r26hi,
        est26Mid: Math.round(r26lo + frac * (r26hi - r26lo)),
      };
    }
  }
  return null;
}

export const maxPerSubject = (advanced) => (advanced ? 120 : 100);
export const maxTotal      = (advanced) => (advanced ? 360 : 300);

/**
 * Unified predictor for JEE Main and JEE Advanced.
 *
 * Advanced-only extra fields returned when advanced=true:
 *   ranked, crlLo, crlHi, catRankLo, catRankHi,
 *   effRank, effRankLo, effRankHi,
 *   ref25Lo, ref25Hi,
 *   branches[], stretch, advice,
 *   cutoffNeeded, subCutoffNeeded  (when ranked=false)
 */
export function predictRank({ physics, chemistry, maths, category = "General", advanced = false }) {
  const cap = maxPerSubject(advanced);
  const p   = clamp(Number(physics)   || 0, 0, cap);
  const c   = clamp(Number(chemistry) || 0, 0, cap);
  const mth = clamp(Number(maths)     || 0, 0, cap);
  const total = p + c + mth;

  // ── JEE Advanced path ─────────────────────────────────────
  if (advanced) {
    const aggCutoff = CAT_AGG_CUTOFF[category] ?? 90;
    const subCutoff = CAT_SUB_CUTOFF[category] ?? 10;
    const belowCutoff = total < aggCutoff || p < subCutoff || c < subCutoff || mth < subCutoff;

    if (belowCutoff) {
      return {
        total, advanced: true, category, isGeneral: category === "General",
        ranked: false, cutoffNeeded: aggCutoff, subCutoffNeeded: subCutoff,
        crl: null, categoryRank: null, rank: null, low: null, high: null, percentile: null,
      };
    }

    const band = interpAdvBand(total);
    if (!band) {
      return {
        total, advanced: true, category, isGeneral: category === "General",
        ranked: false, cutoffNeeded: aggCutoff, subCutoffNeeded: subCutoff,
        crl: null, categoryRank: null, rank: null, low: null, high: null, percentile: null,
      };
    }

    const isGeneral = category === "General";
    const divisor   = CATEGORY_DIVISOR[category] ?? 1;

    const crl    = band.est26Mid;
    const crlLo  = band.est26Lo;
    const crlHi  = band.est26Hi;

    const catRank   = isGeneral ? null : Math.max(1, Math.round(crl   / divisor));
    const catRankLo = isGeneral ? null : Math.max(1, Math.round(crlLo / divisor));
    const catRankHi = isGeneral ? null : Math.max(1, Math.round(crlHi / divisor));

    const effRank   = isGeneral ? crl   : catRank;
    const effRankLo = isGeneral ? crlLo : catRankLo;
    const effRankHi = isGeneral ? crlHi : catRankHi;

    // Percentile = (1 - CRL / 1,80,000) × 100
    const percentile = Number(Math.max(0, (1 - crl / ADV_CANDIDATES) * 100).toFixed(2));

    const { options: branches, stretch } = getBranches(effRank);
    const advice = getAdviceAdv(effRank);

    return {
      total, advanced: true, category, isGeneral, ranked: true,
      crl, crlLo, crlHi,
      catRank, catRankLo, catRankHi,
      effRank, effRankLo, effRankHi,
      ref25Lo: band.ref25Lo, ref25Hi: band.ref25Hi,
      percentile,
      branches, stretch, advice,
      // Legacy aliases so existing display code keeps working
      categoryRank: catRank,
      rank: effRank, low: effRankLo, high: effRankHi,
    };
  }

  // ── JEE Main path ─────────────────────────────────────────
  const crl = Math.max(1, interp(MAIN_TABLE, total));
  const isGeneral    = category === "General";
  const categoryRank = isGeneral ? crl : Math.max(1, Math.round(crl * (CATEGORY_FACTOR[category] ?? 1)));
  const rank         = isGeneral ? crl : categoryRank;
  const spread       = total >= 240 ? 0.08 : total >= 165 ? 0.12 : 0.16;
  const percentile   = Number(clamp(100 * (1 - (crl - 1) / MAIN_CANDIDATES), 0, 99.999).toFixed(3));

  return {
    total, advanced: false, category, isGeneral, ranked: true,
    crl, categoryRank, rank,
    low:  Math.max(1, Math.round(rank * (1 - spread))),
    high: Math.round(rank * (1 + spread)),
    percentile,
  };
}
