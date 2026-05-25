/* ============================================================
   collegePredictor.js
   Given a predicted rank + category (+ optional filters), returns
   ALL eligible college/branch combinations with a match score.
   Considers every branch and uses the FINAL (CSAB-2) closing rank
   so it captures realistic admit chances across all rounds.
   ============================================================ */

import { COLLEGES } from "../data/colleges.js";
import { expandRounds, collegeBranches } from "./cutoffEngine.js";

const TYPE_LABEL = { IIT: "IIT", NIT: "NIT", IIIT: "IIIT", GFTI: "GFTI" };

/**
 * @param {Object} opts
 * @param {number} opts.rank           predicted category rank
 * @param {string} opts.category       OPEN | OBC-NCL | EWS | SC | ST
 * @param {string} [opts.state]        "" or a state to prefer
 * @param {string} [opts.branch]       "" or a branch code to filter
 * @param {string[]} [opts.types]      ["IIT","NIT","IIIT"] to include
 * @returns {Array} sorted matches
 */
export function predictColleges({
  rank,
  category = "OPEN",
  state = "",
  branch = "",
  types = ["IIT", "NIT", "IIIT"],
  female = false,
  homeState = false,
}) {
  const r = Number(rank) || 0;
  const out = [];

  COLLEGES.forEach((college) => {
    if (!types.includes(college.type)) return;

    // Quota relaxations on the closing rank (illustrative):
    // • Female supernumerary seats loosen the cutoff (all IIT/NIT/IIIT).
    // • Home-state quota (NIT/IIIT only) loosens it for in-state candidates.
    const isHome = homeState && state && college.state === state && college.type !== "IIT";
    const relax = (female ? 1.25 : 1) * (isHome ? 1.3 : 1);

    collegeBranches(college).forEach((b) => {
      if (branch && b.code !== branch) return;
      const rounds = expandRounds(college, b.code, category);
      if (!rounds.length) return;

      const opening = rounds[0].opening;
      const closing = Math.round(rounds[rounds.length - 1].closing * relax); // final reach (CSAB 2)
      const r1Closing = Math.round((rounds[5]?.closing ?? closing) * relax); // JoSAA R6

      // Eligible if rank within final closing (some buffer for "stretch")
      const eligible = r <= closing * 1.02;
      if (!eligible) return;

      // Match score: how comfortably you clear it
      let score;
      if (r <= opening) score = 100;
      else if (r >= closing) score = 25;
      else score = Math.round(100 - ((r - opening) / (closing - opening)) * 70);

      // Confidence tier
      let tier = "Stretch";
      if (r <= r1Closing * 0.75) tier = "Safe";
      else if (r <= r1Closing) tier = "Moderate";

      // State preference bonus (sorting only)
      const statePref = state && college.state === state ? 1 : 0;

      out.push({
        slug: college.slug,
        college: college.name,
        short: college.short,
        type: TYPE_LABEL[college.type] || college.type,
        nirf: college.nirf,
        state: college.state,
        branchCode: b.code,
        branch: b.name,
        category,
        opening,
        closing,
        round: rounds.length, // total rounds shown
        score: Math.max(20, Math.min(100, score)),
        tier,
        statePref,
        avgPackage: college.placements?.byBranch?.[b.code] || college.placements?.avg || null,
      });
    });
  });

  // Sort: state preference first, then match score desc, then closing rank
  out.sort(
    (a, b) =>
      b.statePref - a.statePref ||
      b.score - a.score ||
      a.closing - b.closing
  );

  return out;
}

export const TIER_COLOR = {
  Safe: "var(--green)",
  Moderate: "var(--orange)",
  Stretch: "var(--coral)",
};
