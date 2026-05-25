/* ============================================================
   rankPredictor.js  —  marks → rank, for JEE Main & Advanced
   ------------------------------------------------------------
   Two calibrated lookup tables (approx. 2024 trends):
     • JEE Main:     total /300  → CRL (Common Rank List / AIR)
     • JEE Advanced: total /360  → AIR
   Category rank ≈ CRL scaled by a category factor.
   Replace the tables with the latest official marks-vs-rank
   data each year for best accuracy.
   ============================================================ */

// JEE Main — [total marks /300, CRL]
const MAIN_TABLE = [
  [300, 1], [290, 15], [281, 40], [271, 110], [261, 300], [250, 700],
  [241, 1400], [231, 2700], [220, 5000], [210, 7800], [200, 11000],
  [190, 15500], [180, 21000], [170, 28000], [160, 36000], [150, 46000],
  [140, 58000], [130, 73000], [120, 92000], [110, 116000], [100, 145000],
  [90, 180000], [80, 225000], [70, 285000], [60, 360000], [50, 460000],
  [40, 590000], [30, 750000], [20, 920000], [10, 1080000], [0, 1250000],
];

// JEE Advanced — [total marks /360, AIR]
const ADV_TABLE = [
  [360, 1], [330, 8], [310, 25], [290, 60], [270, 130], [250, 260],
  [230, 470], [210, 800], [190, 1300], [170, 2100], [150, 3300],
  [135, 4800], [120, 6800], [110, 8500], [100, 10800], [90, 13800],
  [80, 17500], [70, 22500], [60, 29000], [50, 38000], [40, 55000],
  [30, 80000], [20, 120000], [10, 160000], [0, 200000],
];

// Category rank ≈ CRL × factor (your position within your own category list)
const CATEGORY_FACTOR = {
  General: 1, "OBC-NCL": 0.42, EWS: 0.78, SC: 0.16, ST: 0.085, PwD: 0.05,
};

const MAIN_CANDIDATES = 1100000; // ≈ appeared, for percentile estimate
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

export const maxPerSubject = (advanced) => (advanced ? 120 : 100);
export const maxTotal = (advanced) => (advanced ? 360 : 300);

/**
 * @returns {{
 *   total, advanced, category, isGeneral,
 *   crl, categoryRank, rank, low, high, percentile
 * }}
 */
export function predictRank({ physics, chemistry, maths, category = "General", advanced = false }) {
  const cap = maxPerSubject(advanced);
  const p = clamp(Number(physics) || 0, 0, cap);
  const c = clamp(Number(chemistry) || 0, 0, cap);
  const mth = clamp(Number(maths) || 0, 0, cap);
  const total = p + c + mth;

  const crl = Math.max(1, interp(advanced ? ADV_TABLE : MAIN_TABLE, total));
  const isGeneral = category === "General";
  const categoryRank = isGeneral ? crl : Math.max(1, Math.round(crl * (CATEGORY_FACTOR[category] ?? 1)));

  // headline = CRL for General, category rank otherwise
  const rank = isGeneral ? crl : categoryRank;
  const spread = total >= maxTotal(advanced) * 0.8 ? 0.08 : total >= maxTotal(advanced) * 0.55 ? 0.12 : 0.16;

  // percentile is meaningful for JEE Main only
  const percentile = advanced
    ? null
    : Number(clamp(100 * (1 - (crl - 1) / MAIN_CANDIDATES), 0, 99.999).toFixed(3));

  return {
    total, advanced, category, isGeneral,
    crl, categoryRank, rank,
    low: Math.max(1, Math.round(rank * (1 - spread))),
    high: Math.round(rank * (1 + spread)),
    percentile,
  };
}
