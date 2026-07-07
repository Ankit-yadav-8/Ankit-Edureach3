/* examCalendar — the engineering-entrance directory behind the home
   AdmissionTimeline. EXAM_DETAILS holds per-exam facts (level, conducting
   body, mode, duration, eligibility, accepted-by) so a student can tap any
   exam and explore it fully; EXAM_GROUPS is the National / State / Private
   grouping used for the collapsible chip list. Compiled from the official
   2025–26 admission-cycle calendar. */

export const EXAM_DETAILS = {
  /* ── National ── */
  "JEE Main": {
    level: "National", body: "NTA (National Testing Agency)", mode: "Computer-based (CBT)",
    duration: "3 hours", eligibility: "Class 12 with PCM", courses: "B.E./B.Tech, B.Arch, B.Plan",
    acceptedBy: "NITs, IIITs & GFTIs — also the qualifier for JEE Advanced",
  },
  "JEE Advanced": {
    level: "National", body: "The IITs (rotating)", mode: "Computer-based (CBT)",
    duration: "Paper 1 + Paper 2 (both compulsory)", eligibility: "Top ~2.5L JEE Main qualifiers",
    acceptedBy: "23 IITs",
  },
  "BITSAT": {
    level: "Private", body: "BITS Pilani", mode: "Computer-based (CBT)", duration: "3 hours",
    eligibility: "Class 12 PCM — includes English proficiency & logical reasoning",
    acceptedBy: "BITS Pilani, Goa & Hyderabad campuses",
  },
  "CUET UG (Engineering)": {
    level: "National", body: "NTA", mode: "Computer-based (CBT)",
    acceptedBy: "Central universities offering B.Tech programmes",
  },
  "AEEE": {
    level: "Private", body: "Amrita Vishwa Vidyapeetham", mode: "CBT (remote / centre)",
    acceptedBy: "Amrita University campuses",
  },
  "AMUEEE": {
    level: "National", body: "Aligarh Muslim University", mode: "Pen & paper",
    acceptedBy: "AMU engineering programmes",
  },
  "KIITEE": {
    level: "Private", body: "KIIT University", mode: "Online remote proctored",
    acceptedBy: "KIIT University, Bhubaneswar",
  },
  "COMEDK UGET": {
    level: "State / Private", body: "COMEDK", mode: "Computer-based (CBT)",
    acceptedBy: "190+ private engineering colleges in Karnataka",
  },
  "IMU CET": {
    level: "National", body: "Indian Maritime University",
    acceptedBy: "IMU campuses — Marine Engineering & Naval Architecture",
  },
  "CIPET JEE": {
    level: "National", body: "CIPET",
    acceptedBy: "CIPET institutes — plastics & polymer engineering",
  },

  /* ── State ── */
  "MHT CET": {
    level: "State", body: "Maharashtra CET Cell", mode: "Computer-based (CBT)",
    eligibility: "Class 12 PCM group", acceptedBy: "Maharashtra engineering colleges",
  },
  "KCET": {
    level: "State", body: "Karnataka Examinations Authority", mode: "Pen & paper",
    acceptedBy: "Karnataka government & private colleges",
  },
  "KEAM": {
    level: "State", body: "CEE Kerala", acceptedBy: "Kerala engineering colleges",
  },
  "WBJEE": {
    level: "State", body: "WBJEE Board", mode: "Pen & paper (OMR)",
    acceptedBy: "West Bengal engineering colleges",
  },
  "AP EAPCET": {
    level: "State", body: "JNTU Kakinada / APSCHE", mode: "Computer-based (CBT)",
    acceptedBy: "Andhra Pradesh engineering colleges", note: "Formerly AP EAMCET",
  },
  "TS EAMCET": {
    level: "State", body: "JNTU Hyderabad / TSCHE", mode: "Computer-based (CBT)",
    acceptedBy: "Telangana engineering colleges",
  },
  "GUJCET": {
    level: "State", body: "Gujarat Secondary Education Board",
    acceptedBy: "Gujarat engineering colleges",
  },
  "OJEE": {
    level: "State", body: "OJEE Board", acceptedBy: "Odisha engineering colleges",
  },
  "HPCET": {
    level: "State", body: "Himachal Pradesh Technical University",
    acceptedBy: "HPTU-affiliated colleges",
  },
  "CG PET": {
    level: "State", body: "CG Vyapam", acceptedBy: "Chhattisgarh engineering colleges",
  },
  "BCECE": {
    level: "State", body: "Bihar Combined Entrance Competitive Exam Board",
    acceptedBy: "Bihar engineering colleges",
  },
  "REAP (Rajasthan)": {
    level: "State", body: "BTU Rajasthan", acceptedBy: "Rajasthan engineering colleges",
    note: "JEE Main score-based counselling",
  },
  "UPTAC (JEE Main-based)": {
    level: "State", body: "AKTU Uttar Pradesh", acceptedBy: "UP engineering colleges",
    note: "Formerly UPSEE — now JEE Main-based",
  },
  "JAC Delhi (JEE Main-based)": {
    level: "State", body: "Joint Admission Counselling Delhi",
    acceptedBy: "DTU, NSUT, IIIT-Delhi, IGDTUW", note: "JEE Main-based",
  },
  "HSTES Haryana": {
    level: "State", body: "Haryana State Technical Education Society",
    acceptedBy: "Haryana engineering colleges", note: "JEE Main-based",
  },
  "MP DTE Counselling": {
    level: "State", body: "Directorate of Technical Education, MP",
    acceptedBy: "Madhya Pradesh engineering colleges", note: "JEE Main-based",
  },
  "TNEA (Tamil Nadu)": {
    level: "State", body: "Anna University / DoTE", mode: "No exam — Class 12 marks based",
    acceptedBy: "Tamil Nadu engineering colleges",
  },

  /* ── Private universities ── */
  "VITEEE": {
    level: "Private", body: "VIT University", mode: "Computer-based (CBT)", duration: "2 hr 30 min",
    note: "125 MCQs · PCM/B + English + Aptitude", acceptedBy: "VIT Vellore, Chennai, AP & Bhopal",
  },
  "SRMJEEE": {
    level: "Private", body: "SRMIST", mode: "Online remote proctored", duration: "2 hr 30 min",
    acceptedBy: "SRM Chennai, AP, NCR & Haryana",
  },
  "MET (Manipal)": {
    level: "Private", body: "Manipal Academy of Higher Education", mode: "Computer-based (CBT)",
    duration: "2 hours", acceptedBy: "MIT Manipal, Bengaluru, Jaipur & Sikkim",
  },
  "BVP CET": {
    level: "Private", body: "Bharati Vidyapeeth", acceptedBy: "Bharati Vidyapeeth engineering colleges",
  },
  "UPESAT": {
    level: "Private", body: "UPES Dehradun", acceptedBy: "UPES Dehradun",
  },
  "SAAT": {
    level: "Private", body: "Siksha 'O' Anusandhan", acceptedBy: "SOA University, Bhubaneswar",
  },
  "LPU NEST": {
    level: "Private", body: "Lovely Professional University", acceptedBy: "LPU, Punjab",
  },
  "GEEE (Galgotias)": {
    level: "Private", body: "Galgotias University", acceptedBy: "Galgotias University",
  },
  "JET (Jain University)": {
    level: "Private", body: "Jain University", acceptedBy: "Jain (Deemed-to-be) University",
  },
  "SITEEE": {
    level: "Private", body: "Symbiosis Institute of Technology", acceptedBy: "SIT, Pune",
  },
};

export const EXAM_GROUPS = [
  { title: "National-level", tone: "#FF693D", exams: ["JEE Main", "JEE Advanced", "BITSAT", "CUET UG (Engineering)", "AEEE", "AMUEEE", "KIITEE", "COMEDK UGET", "IMU CET", "CIPET JEE"] },
  { title: "State-level", tone: "#E29A2E", exams: ["MHT CET", "KCET", "KEAM", "WBJEE", "AP EAPCET", "TS EAMCET", "GUJCET", "OJEE", "HPCET", "CG PET", "BCECE", "REAP (Rajasthan)", "UPTAC (JEE Main-based)", "JAC Delhi (JEE Main-based)", "HSTES Haryana", "MP DTE Counselling", "TNEA (Tamil Nadu)"] },
  { title: "Private universities", tone: "#14B8A6", exams: ["VITEEE", "SRMJEEE", "MET (Manipal)", "BVP CET", "UPESAT", "SAAT", "LPU NEST", "GEEE (Galgotias)", "JET (Jain University)", "SITEEE"] },
];

/* accent colour for a given exam level */
export function levelTone(level = "") {
  if (/private/i.test(level)) return "#14B8A6";
  if (/state/i.test(level))   return "#E29A2E";
  return "#FF693D"; // national
}
