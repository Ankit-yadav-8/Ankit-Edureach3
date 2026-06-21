/* Shared constants + helpers for campus reviews. The reviews themselves now
   live server-side (see server/routes/reviews.js and src/auth/api.js) so they
   are shared across all visitors; this module only holds the pick-list tags
   and small display helpers used by the review UI. */

export const HOSTEL_TAGS = [
  "Clean rooms", "Good Wi-Fi", "Spacious", "AC rooms", "Safe & secure",
  "Friendly warden", "Great common areas", "Poor maintenance", "Water issues",
];
export const MESS_TAGS = [
  "Tasty food", "Hygienic", "Good variety", "Veg + Non-veg", "Affordable",
  "Repetitive menu", "Limited timings", "Needs improvement", "Special meals",
];

/* Overall stars for a review — explicit `overall`, else the average of the
   hostel + mess ratings that were given. */
export function reviewOverall(r) {
  if (r?.overall) return r.overall;
  const xs = [r?.hostel?.rating, r?.mess?.rating].filter((n) => Number(n) > 0);
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

export const avg = (nums) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0);
