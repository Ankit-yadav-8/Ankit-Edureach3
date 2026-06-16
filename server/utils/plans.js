// Shared plan helpers used by the community + enrolment endpoints.
// (Kept separate from payment.js's PLANS catalogue so both can evolve without
//  importing Razorpay-specific code.)

export const PLAN_LABELS = {
  "josaa": "JoSAA + CSAB 2026 Counselling",
  "all-colleges": "All Colleges Counselling (Any Rank)",
  "mentor-jee-2027": "JEE 2027 Mentorship Program",
  "mentor-neet-2027": "NEET 2027 Mentorship Program",
  "mentor-jee-2028": "JEE 2028 Mentorship Program (2-Year)",
  "mentor-neet-2028": "NEET 2028 Mentorship Program (2-Year)",
  "mentor-foundation": "Foundation Mentorship (Class 9–10)",
};

const BATCH_LABELS = {
  "mentor-jee-2027": "JEE 2027 Batch",
  "mentor-neet-2027": "NEET 2027 Batch",
  "mentor-jee-2028": "JEE 2028 Batch",
  "mentor-neet-2028": "NEET 2028 Batch",
  "mentor-foundation": "Foundation Batch",
};

export const planLabel = (plan) => PLAN_LABELS[plan] || plan;
export const batchLabelFor = (plan) => BATCH_LABELS[plan] || planLabel(plan);

// 2-year tracks (…-2028) stay valid for 24 months, everything else for 12.
export const monthsFor = (plan) => (/2028/.test(String(plan)) ? 24 : 12);

export const validUntilFor = (plan, from) => {
  const d = new Date(from || Date.now());
  d.setMonth(d.getMonth() + monthsFor(plan));
  return d;
};

// Which exam track a plan belongs to — drives the subject chips in the composer.
export const examFor = (plan) => {
  const p = String(plan || "").toLowerCase();
  if (p.includes("neet")) return "NEET";
  if (p.includes("foundation")) return "Foundation";
  return "JEE";
};
