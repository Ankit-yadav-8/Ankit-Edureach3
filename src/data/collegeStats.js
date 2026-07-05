/* ============================================================
   collegeStats.js — REAL, verified fees & placement figures,
   keyed by college slug. These OVERRIDE the illustrative values
   in colleges.js on the college detail page (/colleges/:slug).

   HOW TO USE
   ----------
   • Fill ONE college at a time from OFFICIAL sources — the
     institute's own placement report + fee structure. Prefer the
     institute domain (e.g. placement.iitm.ac.in, nitt.edu).
   • Omit any field you don't have yet — the page automatically
     falls back to the existing value for just that field, so a
     half-filled entry is safe.
   • Set `verified: true` ONLY after every number in the entry has
     been checked against the primary source. Until then the page
     still shows the numbers but you know they're pending a check.
   • Colleges NOT listed here keep their current values unchanged.

   SHAPE (mirrors colleges.js so values drop straight in)
   ------------------------------------------------------
     "<slug>": {
       year: 2024,                 // placement / fee academic year
       source: "https://…",        // primary source URL (institute)
       verified: false,            // flip true after cross-checking
       fees: {                     // ₹ per YEAR, absolute rupees
         tuition, hostel, mess, other,
       },
       placements: {               // absolute rupees, not lakhs
         avg, median, highest,     // ₹ (e.g. ₹23.29 L → 2329000)
         placedPct,                // number, e.g. 80
         recruiters: [ "…" ],      // real names
         byBranch: { cse: <avg₹>, … },  // optional, per-branch avg
       },
     }

   ⚠️ The two worked examples below use figures compiled from
   third-party placement aggregators. They are a STARTING POINT —
   cross-check each number against the official report and then set
   verified: true. Do not treat them as confirmed until you do.
   ============================================================ */

export const COLLEGE_STATS = {
  // ── IIT Madras — B.Tech placements 2024 (VERIFY vs official report) ──
  "iit-madras": {
    year: 2024,
    source: "https://placement.iitm.ac.in/",
    verified: false,
    placements: {
      avg: 2329000,       // ₹23.29 L (B.Tech 2024)
      median: 1913000,    // ₹19.13 L
      highest: 43000000,  // ₹4.3 Cr (B.Tech)
      placedPct: 80,      // ~80% B.Tech / Dual Degree by Apr 2024
      recruiters: ["Google", "Microsoft", "Qualcomm", "Texas Instruments", "Goldman Sachs", "Apple"],
    },
    // fees: fill from the official IIT Madras fee structure
  },

  // ── NIT Trichy — B.Tech placements 2024 (VERIFY vs official report) ──
  "nit-trichy": {
    year: 2024,
    source: "https://www.nitt.edu/",
    verified: false,
    placements: {
      highest: 5289000,   // ₹52.89 L (2024)
      placedPct: 89,      // 88.9% B.Tech overall
      recruiters: ["Amazon", "Google", "Microsoft", "Bosch", "Samsung", "Morgan Stanley"],
      // avg / median: fill the OVERALL B.Tech figures from the official report
      // (CSE alone averaged ₹27.27 L in 2024 — not the overall number)
    },
  },
};

/** Real, verified stats for a college slug, or null if none entered yet. */
export const getCollegeStats = (slug) => COLLEGE_STATS[slug] || null;
