/* ============================================================
   seoKeywordMap.js — Route-by-Route SEO Keyword Mapping
   Guarantees unique metadata, search-intent alignment, and
   distinct keyword targeting across the entire CampusPoint site.
   ============================================================ */

export const SEO_KEYWORD_MAP = {
  // ── 1. Pillar: Main JEE Mentorship Page ─────────────────────
  "/jee-mentorship": {
    path: "/jee-mentorship",
    h1: "Personalized 1-on-1 JEE Mentorship Program by Verified IITians",
    title: "Best JEE Mentorship Program 2026–2027 | 1-on-1 Guidance by IITians - CampusPoint",
    description: "Get 1-on-1 JEE Mentorship by verified IIT Roorkee rankers. Daily personalized study plans, question-level mock test error autopsy, 70-30 backlog formula & 24/7 WhatsApp guidance. Enroll at ₹3,499.",
    searchIntent: "Commercial / Investigative",
    primaryKeyword: "JEE mentorship",
    targetKeywords: [
      "JEE mentorship",
      "JEE mentor",
      "JEE mentorship program",
      "JEE preparation mentorship",
      "JEE preparation mentor",
      "online JEE mentorship",
      "personalized JEE mentorship",
      "JEE guidance",
      "JEE coaching mentor",
      "JEE study mentor",
      "JEE personal mentor",
      "JEE mentor for students",
      "JEE mentoring platform",
      "JEE academic mentor",
      "JEE strategy mentor"
    ],
    schemas: ["EducationalOccupationalProgram", "BreadcrumbList", "FAQPage", "Organization"]
  },

  // ── 2. JEE Main Mentorship ──────────────────────────────────
  "/jee-mentorship/jee-main": {
    path: "/jee-mentorship/jee-main",
    h1: "Dedicated JEE Main Mentorship & 1-on-1 Guidance",
    title: "JEE Main Mentorship Program | 1-to-1 Mentorship for JEE Main",
    description: "Master JEE Main with 1-to-1 IITian mentorship. Get personalized study plans, speed & accuracy drills, test analysis, PYQ roadmaps, and 99 percentile strategies.",
    searchIntent: "Commercial / Solution-seeking",
    primaryKeyword: "JEE Main mentorship",
    targetKeywords: [
      "JEE Main mentorship",
      "JEE Main mentor",
      "JEE Main preparation mentor",
      "JEE Main preparation guidance",
      "JEE Main study plan",
      "JEE Main strategy",
      "JEE Main test analysis",
      "JEE Main personalized preparation",
      "JEE Main mentorship program",
      "JEE Main online mentorship",
      "JEE Main personal mentor",
      "JEE Main performance analysis",
      "JEE Main preparation strategy",
      "JEE Main personalized study plan",
      "JEE Main 2027 mentorship",
      "JEE Main 2028 mentorship",
      "how to score 99 percentile in JEE Main"
    ],
    schemas: ["Course", "BreadcrumbList", "FAQPage", "Article"]
  },

  // ── 3. JEE Advanced Mentorship ──────────────────────────────
  "/jee-mentorship/jee-advanced": {
    path: "/jee-mentorship/jee-advanced",
    h1: "Elite JEE Advanced Mentorship by Top IITians",
    title: "JEE Advanced Mentorship Program | IIT JEE Mentorship by IITians",
    description: "Crack IIT JEE with 1-to-1 JEE Advanced mentorship by top IITians. Master multi-concept problems, partial marking tactics, Paper 1 & 2 stamina, and topper roadmaps.",
    searchIntent: "Commercial / Elite Aspirants",
    primaryKeyword: "JEE Advanced mentorship",
    targetKeywords: [
      "JEE Advanced mentorship",
      "JEE Advanced mentor",
      "JEE Advanced preparation mentor",
      "JEE Advanced guidance",
      "JEE Advanced study plan",
      "JEE Advanced strategy",
      "JEE Advanced test analysis",
      "JEE Advanced mentorship program",
      "JEE Advanced online mentorship",
      "JEE Advanced personal mentor",
      "IIT JEE Advanced mentorship",
      "JEE Advanced preparation strategy",
      "JEE Advanced performance analysis",
      "JEE Advanced mentor online",
      "how to crack JEE Advanced"
    ],
    schemas: ["Course", "BreadcrumbList", "FAQPage", "Article"]
  },

  // ── 4. 1-to-1 Personal JEE Mentorship ───────────────────────
  "/jee-mentorship/1-to-1": {
    path: "/jee-mentorship/1-to-1",
    h1: "Private 1-on-1 JEE Mentorship by Verified IITians",
    title: "1-on-1 JEE Mentorship | Personal JEE Mentor & Daily Guidance",
    description: "Experience genuine 1-on-1 JEE mentorship by top IITians. Private weekly video calls, customized daily study plans, 24/7 WhatsApp guidance, and individual error reviews.",
    searchIntent: "High-Intent Commercial",
    primaryKeyword: "1 to 1 JEE mentorship",
    targetKeywords: [
      "1 to 1 JEE mentorship",
      "1-to-1 JEE mentorship",
      "one to one JEE mentor",
      "personal JEE mentor",
      "personalized JEE preparation",
      "personal JEE guidance for JEE",
      "individual JEE mentorship",
      "JEE mentor online",
      "private JEE mentor",
      "individual JEE mentor",
      "JEE one to one guidance",
      "JEE personal guidance",
      "one on one JEE mentor",
      "1 on 1 JEE mentor",
      "personal JEE guidance",
      "JEE mentor one on one"
    ],
    schemas: ["EducationalOccupationalProgram", "BreadcrumbList", "FAQPage", "Organization"]
  },

  // ── 5. IITian Mentors for JEE ───────────────────────────────
  "/jee-mentorship/iitian-mentor": {
    path: "/jee-mentorship/iitian-mentor",
    h1: "Genuine JEE Mentorship by IITians & Top Rankers",
    title: "JEE Mentorship by IITians | IIT Roorkee & Top IIT Rankers",
    description: "Learn directly from verified IITians. 1-to-1 JEE mentorship by top rankers from IIT Roorkee and premier IITs. Authentic preparation strategies, daily tracking, and exam hacks.",
    searchIntent: "Authority / Brand Differentiation",
    primaryKeyword: "IITian JEE mentor",
    targetKeywords: [
      "IITian JEE mentor",
      "IITian mentor for JEE",
      "JEE mentor from IIT",
      "JEE mentorship by IITians",
      "JEE mentorship from IITians",
      "IIT student JEE mentor",
      "IIT student mentor for JEE",
      "IITian guidance for JEE",
      "IITian JEE guidance",
      "JEE preparation by IITians",
      "JEE guidance by IITians",
      "IIT mentor for JEE preparation",
      "JEE mentor IIT Roorkee",
      "IIT Roorkee JEE mentor",
      "JEE mentorship IIT Roorkee"
    ],
    schemas: ["EducationalOccupationalProgram", "BreadcrumbList", "FAQPage", "Organization"]
  },

  // ── 6. Class 11 JEE Mentorship ──────────────────────────────
  "/jee-mentorship/class-11": {
    path: "/jee-mentorship/class-11",
    h1: "Personalized Class 11 JEE Mentorship & Foundation",
    title: "JEE Mentorship for Class 11 | Foundation to Advanced Strategy",
    description: "Master Class 11 with 1-to-1 JEE mentorship by top IITians. Overcome the 10th-to-11th transition, prevent backlogs, balance school, and build a rock-solid foundation.",
    searchIntent: "Informational / Foundation Guidance",
    primaryKeyword: "JEE mentorship for class 11",
    targetKeywords: [
      "JEE mentorship for class 11",
      "JEE mentor for class 11",
      "class 11 JEE preparation",
      "JEE preparation class 11",
      "JEE preparation guidance class 11",
      "class 11 JEE mentor",
      "class 11 JEE mentorship program",
      "JEE study plan class 11",
      "JEE timetable class 11",
      "JEE strategy class 11",
      "JEE preparation strategy class 11",
      "class 11 IIT JEE preparation",
      "class 11 JEE backlog",
      "class 11 JEE revision plan"
    ],
    schemas: ["Course", "BreadcrumbList", "FAQPage", "Article"]
  },

  // ── 7. Class 12 JEE Mentorship ──────────────────────────────
  "/jee-mentorship/class-12": {
    path: "/jee-mentorship/class-12",
    h1: "Personalized Class 12 JEE Mentorship & Strategy",
    title: "JEE Mentorship for Class 12 | Boards + JEE Main & Advanced",
    description: "Ace Class 12 boards and JEE Main/Advanced together. 1-to-1 IITian mentorship, October syllabus finish, dual-track Class 11 revision, and pre-board management.",
    searchIntent: "Urgent Commercial / Strategic",
    primaryKeyword: "JEE mentorship for class 12",
    targetKeywords: [
      "JEE mentorship for class 12",
      "JEE mentor for class 12",
      "class 12 JEE preparation",
      "class 12 JEE mentorship",
      "class 12 JEE mentor",
      "JEE preparation class 12",
      "class 12 JEE study plan",
      "class 12 JEE strategy",
      "JEE preparation guidance class 12",
      "class 12 JEE backlog",
      "class 12 JEE revision",
      "JEE board and JEE preparation",
      "JEE Main class 12 preparation",
      "JEE Advanced class 12 preparation"
    ],
    schemas: ["Course", "BreadcrumbList", "FAQPage", "Article"]
  },

  // ── 8. Droppers & Repeaters Mentorship ───────────────────────
  "/jee-mentorship/droppers": {
    path: "/jee-mentorship/droppers",
    h1: "Specialized JEE Droppers Mentorship & Repeaters Plan",
    title: "JEE Dropper Mentorship Program | Repeaters Strategy & Study Plan",
    description: "Comprehensive JEE dropper mentorship for serious repeaters. Get personal IITian guidance, 8-month intensive timetable, mistake audit, and daily accountability.",
    searchIntent: "High Intent / High Urgency",
    primaryKeyword: "JEE dropper mentorship",
    targetKeywords: [
      "JEE dropper mentorship",
      "JEE dropper mentor",
      "JEE preparation for droppers",
      "JEE dropper mentorship program",
      "JEE dropper preparation",
      "JEE dropper strategy",
      "JEE dropper study plan",
      "JEE dropper timetable",
      "JEE dropper guidance",
      "JEE dropper online mentorship",
      "JEE dropper personal mentor",
      "JEE repeaters mentorship",
      "JEE repeater mentor",
      "JEE repeater preparation strategy",
      "JEE second attempt strategy",
      "JEE drop year strategy"
    ],
    schemas: ["Course", "BreadcrumbList", "FAQPage", "Article"]
  },

  // ── 9. Mock Test Analysis & Diagnostics ─────────────────────
  "/jee-mentorship/test-analysis": {
    path: "/jee-mentorship/test-analysis",
    h1: "Precision JEE Test Analysis & Mistake Tracking",
    title: "JEE Test Analysis & Mock Test Mentorship | Error Tracking System",
    description: "Master JEE mock test analysis with our 8-step question-level error tracking system. Eliminate negative marks, analyze time-spent bottlenecks, and improve by 40+ marks.",
    searchIntent: "High Utility / Analytical",
    primaryKeyword: "JEE test analysis",
    targetKeywords: [
      "JEE test analysis",
      "JEE mock test analysis",
      "JEE weak topic analysis",
      "JEE preparation mistakes",
      "how to improve JEE score",
      "how to improve JEE rank",
      "JEE test performance analysis",
      "JEE test analysis report",
      "JEE performance analysis",
      "JEE test score analysis",
      "JEE mistake analysis",
      "JEE question analysis",
      "JEE weak chapter analysis",
      "JEE accuracy analysis",
      "JEE time management analysis",
      "JEE test strategy",
      "JEE paper analysis"
    ],
    schemas: ["Course", "BreadcrumbList", "FAQPage", "Article"]
  },

  // ── 10. JEE Study Plan & Timetable ──────────────────────────
  "/jee-preparation/study-plan": {
    path: "/jee-preparation/study-plan",
    h1: "Personalized JEE Study Plan & Daily Timetable",
    title: "JEE Study Plan & Timetable | Daily, Weekly & Monthly Schedules",
    description: "Master your JEE preparation with a personalized study plan and timetable. Daily routines, weekly progress reviews, spaced repetition revision, and mentor accountability.",
    searchIntent: "Informational / Action-Oriented",
    primaryKeyword: "JEE study plan",
    targetKeywords: [
      "JEE study plan",
      "JEE timetable",
      "JEE revision plan",
      "how to prepare for JEE",
      "how to improve JEE score",
      "JEE preparation plan",
      "JEE study schedule",
      "JEE preparation timetable",
      "JEE daily schedule",
      "JEE weekly study plan",
      "JEE monthly study plan",
      "personalized JEE study plan",
      "personalized JEE timetable",
      "JEE study plan with mentor",
      "JEE preparation schedule",
      "JEE chapter wise study plan"
    ],
    schemas: ["Article", "BreadcrumbList", "FAQPage", "Organization"]
  },

  // ── 11. JEE Backlog Management ──────────────────────────────
  "/jee-preparation/backlog": {
    path: "/jee-preparation/backlog",
    h1: "How to Clear JEE Backlogs Without Panic",
    title: "How to Clear JEE Backlogs | Backlog Management Strategy & Recovery Plan",
    description: "Learn how to clear JEE backlogs without destroying your current preparation. The proven 70-30 backlog rule, priority chapter triage matrix, and mentor recovery plans.",
    searchIntent: "Pain-Point Solution / Informational",
    primaryKeyword: "JEE backlog strategy",
    targetKeywords: [
      "JEE backlog strategy",
      "JEE backlog",
      "how to complete JEE backlog",
      "how to clear JEE backlog",
      "JEE backlog management",
      "JEE backlog study plan",
      "JEE backlog recovery",
      "JEE backlog preparation",
      "JEE backlog mentor",
      "JEE backlog mentorship",
      "how to manage JEE backlog",
      "JEE syllabus backlog",
      "physics backlog JEE",
      "chemistry backlog JEE",
      "maths backlog JEE",
      "JEE backlog timetable"
    ],
    schemas: ["Article", "BreadcrumbList", "FAQPage", "Organization"]
  },

  // ── 12. JEE Preparation Strategy & Roadmap ──────────────────
  "/jee-preparation/strategy": {
    path: "/jee-preparation/strategy",
    h1: "Comprehensive JEE Preparation Strategy & Master Guide",
    title: "JEE Preparation Strategy & Roadmap | Main & Advanced Master Guide",
    description: "Master the proven JEE preparation strategy used by top IITians. Subject-wise tactical playbooks for Physics, Chemistry & Maths, PYQ analysis, and topper frameworks.",
    searchIntent: "Master Guide / Informational",
    primaryKeyword: "JEE preparation strategy",
    targetKeywords: [
      "JEE preparation strategy",
      "how to prepare for JEE",
      "how to improve JEE score",
      "how to improve JEE rank",
      "JEE strategy",
      "how to crack JEE",
      "JEE Main and Advanced strategy",
      "subject wise JEE strategy",
      "time management for JEE",
      "topper strategy for JEE",
      "JEE roadmap",
      "JEE preparation mistakes",
      "JEE 3 pass technique"
    ],
    schemas: ["Article", "BreadcrumbList", "FAQPage", "Organization"]
  },

  // ── 13. JEE Preparation Hub ─────────────────────────────────
  "/jee-preparation": {
    path: "/jee-preparation",
    h1: "Master Your JEE Preparation with Proven Frameworks",
    title: "JEE Preparation Hub | Study Plans, Backlogs & Strategy Guides",
    description: "The ultimate JEE preparation hub. Access proven daily study plans, scientific backlog recovery systems, subject tactical guides, and 1-to-1 IITian mentorship.",
    searchIntent: "Topic Pillar / Navigation",
    primaryKeyword: "JEE preparation",
    targetKeywords: [
      "JEE preparation",
      "how to prepare for JEE",
      "how to improve JEE score",
      "how to improve JEE rank",
      "JEE study plan",
      "JEE preparation plan",
      "JEE preparation strategy",
      "JEE backlog",
      "JEE timetable",
      "JEE revision plan",
      "JEE preparation mistakes",
      "JEE preparation guide"
    ],
    schemas: ["WebPage", "BreadcrumbList", "FAQPage", "Organization"]
  },

  // ── 14. Homepage ────────────────────────────────────────────
  "/": {
    path: "/",
    h1: "Know your rank. Find your dream college.",
    title: "CampusPoint – JEE Mentorship by IITians, Rank Predictor & College Cutoffs",
    description: "Get personalized 1-on-1 JEE mentorship by top IITians (₹3,499 till JEE Mains). Custom daily study plans, question-level test analysis, backlog eradication, JEE rank predictors, and JoSAA cutoffs.",
    searchIntent: "Brand / Commercial Platform",
    primaryKeyword: "JEE mentorship",
    targetKeywords: [
      "JEE mentorship",
      "JEE mentorship program",
      "1 on 1 JEE mentor",
      "IITian JEE mentor",
      "personalized JEE mentorship",
      "JEE preparation mentorship",
      "online JEE mentorship",
      "JEE rank predictor",
      "JoSAA cutoffs",
      "IIT Roorkee mentorship",
      "college predictor"
    ],
    schemas: ["WebSite", "EducationalOrganization", "BreadcrumbList", "FAQPage", "ItemList"]
  }
};

/**
 * Retrieve the unique keyword and metadata configuration for a given pathname.
 */
export function getKeywordMeta(path) {
  const cleanPath = path ? path.replace(/\/+$/, "") || "/" : "/";
  return SEO_KEYWORD_MAP[cleanPath] || null;
}

