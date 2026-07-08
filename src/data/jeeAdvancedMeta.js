/* JEE Advanced — supplementary reference data pulled from the Deep Analysis
   sheet: per-subject study-time split, Class 11 vs 12 weightage split, and the
   official-style marking scheme. Directional estimates, not official stats. */

/* study-hour + score-share split by subject and priority tier (of a 200-hour plan) */
export const SUBJECT_SUMMARY = [
  {
    subject: "Physics", chapters: 28, weightage: "89%", hours: 59,
    tiers: [
      { priority: "Must-Do", chapters: 7,  share: "13.9%", hours: 28 },
      { priority: "High",     chapters: 11, share: "11.6%", hours: 23 },
      { priority: "Standard", chapters: 10, share: "4.1%",  hours: 8  },
    ],
  },
  {
    subject: "Chemistry", chapters: 26, weightage: "83%", hours: 60,
    tiers: [
      { priority: "Must-Do", chapters: 7,  share: "15.6%", hours: 31 },
      { priority: "High",     chapters: 12, share: "12.1%", hours: 24 },
      { priority: "Standard", chapters: 7,  share: "2.3%",  hours: 5  },
    ],
  },
  {
    subject: "Maths", chapters: 26, weightage: "94.5%", hours: 81,
    tiers: [
      { priority: "Must-Do", chapters: 14, share: "31.5%", hours: 63 },
      { priority: "High",     chapters: 7,  share: "8.0%",  hours: 16 },
      { priority: "Standard", chapters: 5,  share: "0.9%",  hours: 2  },
    ],
  },
];

/* Class 11 vs Class 12 contribution per subject */
export const CLASS_SPLIT = [
  { subject: "Physics",   c11: "45.5%", c12: "43.5%", total: "89.0%" },
  { subject: "Chemistry", c11: "39.0%", c12: "44.0%", total: "83.0%" },
  { subject: "Maths",     c11: "47.5%", c12: "47.0%", total: "94.5%" },
];

/* two-paper marking scheme */
export const MARKING_SCHEME = [
  { type: "Single Correct MCQ",      correct: "+3",             negative: "−1",             partial: "No" },
  { type: "Multiple Correct MCQ",    correct: "+4 (all right)", negative: "−2 (typical)",   partial: "Yes — partial sets" },
  { type: "Numerical Value Answer",  correct: "+3 / +4",        negative: "None (usually)", partial: "No" },
  { type: "Match / Paragraph",       correct: "Varies",         negative: "Varies",         partial: "Sometimes" },
];
