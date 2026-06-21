/* Shared campus-review store (localStorage) used by both the 2-minute
   ReviewPopup and the home College Reviews section, so a review given in
   one place shows up everywhere. Reviews live on the visitor's device.
   `addReview` fires a window event so open views update live. */

export const REVIEWS_KEY = "cp:reviews";
export const REVIEWS_EVENT = "cp:reviews-updated";

export const HOSTEL_TAGS = [
  "Clean rooms", "Good Wi-Fi", "Spacious", "AC rooms", "Safe & secure",
  "Friendly warden", "Great common areas", "Poor maintenance", "Water issues",
];
export const MESS_TAGS = [
  "Tasty food", "Hygienic", "Good variety", "Veg + Non-veg", "Affordable",
  "Repetitive menu", "Limited timings", "Needs improvement", "Special meals",
];

export function loadReviews() {
  if (typeof localStorage === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

export function addReview(review) {
  const all = loadReviews();
  all.push(review);
  try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(all)); } catch { /* ignore */ }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(REVIEWS_EVENT));
  return all;
}

/* Overall stars for a review — explicit `overall`, else the average of the
   hostel + mess ratings that were given. */
export function reviewOverall(r) {
  if (r?.overall) return r.overall;
  const xs = [r?.hostel?.rating, r?.mess?.rating].filter((n) => Number(n) > 0);
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

/* Map of "College name" → [reviews], newest first. */
export function groupByCollege(reviews) {
  const map = new Map();
  reviews.forEach((r) => {
    const k = (r.college || "Unknown").trim();
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  });
  for (const list of map.values()) list.sort((a, b) => String(b.at).localeCompare(String(a.at)));
  return map;
}

export const avg = (nums) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0);
