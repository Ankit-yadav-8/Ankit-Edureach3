/* counsellingTimeline — data behind the /exam-buzz counselling hub.
   Week-by-week engineering counselling calendar for the 2026 admission
   cycle, a counselling-window table by exam, and the overall month map.
   Weeks carry {y, m (0-based month), w (week-of-month, 0 = whole month)}
   so the page can auto-mark the current week as it passes. */

export const COUNSELLING_WEEKS = [
  { y: 2026, m: 4, w: 4, label: "May 2026 · Last Week", events: [
    "JEE Advanced Result", "JoSAA Registration Opens", "Choice Filling Begins",
    "IIT · NIT · IIIT & GFTI counselling starts",
  ] },
  { y: 2026, m: 5, w: 1, label: "June 2026 · Week 1", events: [
    "JoSAA Round 1", "BITSAT Preference Form", "VITEEE Counselling Phase 1",
    "SRMJEEE Phase 1 Counselling", "MET Counselling Round 1", "COMEDK Choice Filling Begins",
  ] },
  { y: 2026, m: 5, w: 2, label: "June 2026 · Week 2", events: [
    "JoSAA Round 2", "BITSAT Iteration 1", "COMEDK Mock Allotment",
    "MHT CET Registration for CAP", "WBJEE Choice Filling", "AP EAPCET Web Options",
  ] },
  { y: 2026, m: 5, w: 3, label: "June 2026 · Week 3", events: [
    "JoSAA Round 3", "VITEEE Phase 2 Counselling", "SRMJEEE Phase 2 Counselling",
    "KEAM Rank List & Option Entry", "KCET Document Verification",
  ] },
  { y: 2026, m: 5, w: 4, label: "June 2026 · Week 4", events: [
    "JoSAA Round 4", "MET Round 2", "COMEDK Round 1 Seat Allotment",
    "OJEE Counselling Registration", "TS EAMCET Certificate Verification",
  ] },
  { y: 2026, m: 6, w: 1, label: "July 2026 · Week 1", events: [
    "JoSAA Round 5", "BITSAT Iteration 2", "KCET Option Entry",
    "MHT CET CAP Round 1 Registration", "WBJEE Round 1 Seat Allotment",
  ] },
  { y: 2026, m: 6, w: 2, label: "July 2026 · Week 2", events: [
    "Final JoSAA Round", "IIT · NIT · IIIT Reporting", "CSAB Registration Opens",
    "AP EAPCET Phase 1 Seat Allotment",
  ] },
  { y: 2026, m: 6, w: 3, label: "July 2026 · Week 3", events: [
    "CSAB Special Round Registration", "COMEDK Round 2", "MET Round 3",
    "KEAM Round 1", "TS EAMCET Phase 1 Seat Allotment",
  ] },
  { y: 2026, m: 6, w: 4, label: "July 2026 · Week 4", events: [
    "CSAB Round 1", "MHT CET CAP Round 1 Allotment", "WBJEE Round 2",
    "OJEE Round 1", "KCET Round 1 Allotment",
  ] },
  { y: 2026, m: 7, w: 1, label: "August 2026 · Week 1", events: [
    "CSAB Round 2", "BITSAT Final Iteration", "COMEDK Round 3",
    "MHT CET CAP Round 2", "AP EAPCET Final Phase",
  ] },
  { y: 2026, m: 7, w: 2, label: "August 2026 · Week 2", events: [
    "Spot Rounds Begin", "KCET Round 2", "KEAM Round 2",
    "WBJEE Mop-Up", "TS EAMCET Final Phase",
  ] },
  { y: 2026, m: 7, w: 3, label: "August 2026 · Week 3", events: [
    "Institute-Level Counselling", "Internal Sliding", "Vacant Seat Admissions",
  ] },
  { y: 2026, m: 7, w: 4, label: "August 2026 · Week 4", events: [
    "Last Reporting Dates", "Final Admissions in Most Institutes",
  ] },
  { y: 2026, m: 8, w: 0, label: "September 2026", events: [
    "Spot Admissions", "Institute-Level Vacant Seat Counselling", "Admission Closure",
  ] },
];

export const COUNSELLING_BY_EXAM = [
  { exam: "JoSAA (IIT / NIT / IIIT / GFTI)", start: "Late May / Early June", end: "Mid July", tone: "#FF693D" },
  { exam: "CSAB Special Rounds",             start: "Mid July",             end: "Early August", tone: "#FF693D" },
  { exam: "BITSAT",                          start: "Early June",           end: "Early August", tone: "#14B8A6" },
  { exam: "VITEEE",                          start: "Early June",           end: "July",         tone: "#14B8A6" },
  { exam: "SRMJEEE",                         start: "Early June",           end: "July",         tone: "#14B8A6" },
  { exam: "MET (Manipal)",                   start: "June",                 end: "July",         tone: "#14B8A6" },
  { exam: "COMEDK UGET",                     start: "June",                 end: "August",       tone: "#E29A2E" },
  { exam: "MHT CET CAP",                     start: "July",                 end: "August",       tone: "#E29A2E" },
  { exam: "KCET",                            start: "June (Verification)",  end: "August",       tone: "#E29A2E" },
  { exam: "KEAM",                            start: "June",                 end: "August",       tone: "#E29A2E" },
  { exam: "WBJEE",                           start: "June",                 end: "August",       tone: "#E29A2E" },
  { exam: "AP EAPCET",                       start: "June",                 end: "August",       tone: "#E29A2E" },
  { exam: "TS EAMCET",                       start: "June",                 end: "August",       tone: "#E29A2E" },
  { exam: "OJEE",                            start: "June",                 end: "August",       tone: "#E29A2E" },
  { exam: "HPCET",                           start: "June",                 end: "July",         tone: "#E29A2E" },
  { exam: "AMUEEE",                          start: "June",                 end: "July",         tone: "#FF693D" },
  { exam: "KIITEE",                          start: "April (Rolling)",      end: "July",         tone: "#14B8A6" },
  { exam: "LPUNEST",                         start: "April (Rolling)",      end: "August",       tone: "#14B8A6" },
  { exam: "SAAT",                            start: "April (Rolling)",      end: "August",       tone: "#14B8A6" },
];

export const OVERALL_TIMELINE = [
  { month: "Jan – Apr", activity: "Registration & Entrance Exams" },
  { month: "May",       activity: "Final Exams & JEE Advanced" },
  { month: "June",      activity: "Results + Counselling Starts" },
  { month: "July",      activity: "Major Seat Allotment Rounds" },
  { month: "August",    activity: "Special, Mop-up & Spot Rounds" },
  { month: "September",  activity: "Final Admissions & Reporting" },
];

/* chronological ordinal so the page can find "this week" */
export function weekOrdinal(y, m, w) { return y * 48 + m * 4 + (w ? w - 1 : 0); }

export function nowOrdinal(d = new Date()) {
  return weekOrdinal(d.getFullYear(), d.getMonth(), Math.min(4, Math.ceil(d.getDate() / 7)));
}
