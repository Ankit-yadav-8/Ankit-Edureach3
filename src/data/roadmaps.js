/* ============================================================
   roadmaps.js — study roadmaps + complete book lists.
   Moved out of the JEE Main / JEE Advanced / NEET exam pages so
   they can live in the Strategy pages. Text/colours kept verbatim.
   Consumed by components/StudyRoadmap.jsx.
   ============================================================ */

/* ── JEE Main ── */
export const JEE_MAIN_ROADMAP = {
  eyebrow: "Study Roadmap",
  title: "JEE Main Preparation Roadmap",
  sub: "Step-by-step plan with specific tasks, books and daily targets — from foundation through both sessions.",
  gradient: "linear-gradient(180deg,#FF693D,#0EA5A4,#7C3AED,#EC4899,#EAB308,#6366F1,#15A06E)",
  steps: [
    {
      month: "Apr–May", label: "Foundation Build — NCERT First", color: "#FF693D", icon: "📚",
      tip: "JEE Main is NCERT-heavy, especially Chemistry (Inorganic). Master all NCERT concepts before going to reference books. Class 11 syllabus should be your starting priority.",
      tasks: [
        "NCERT Physics 11 — Mechanics, Thermodynamics, Waves",
        "NCERT Chemistry 11 — Mole concept, Bonding, Organic basics",
        "NCERT Maths 11 — Sets, Sequences, Trigonometry, Permutations",
        "Make chapter-wise short notes as you study",
        "Target: complete Class 11 NCERT by end of May",
      ],
      resources: ["NCERT 11 (all 3 subjects)", "DC Pandey Mechanics", "RD Sharma Class 11"],
    },
    {
      month: "Jun–Aug", label: "Concept Depth — Reference Books", color: "#0EA5A4", icon: "🔬",
      tip: "Once NCERT is done, deepen with reference books. HC Verma selected chapters for Physics, OP Tandon for Organic. Start solving chapter-end exercises from NCERT regularly.",
      tasks: [
        "HC Verma selected chapters — Optics, Modern Physics",
        "OP Tandon Organic — reactions, mechanisms, named reactions",
        "Coordinate Geometry — straight lines, circles, conics",
        "Electrochemistry, Thermodynamics (Physical Chem)",
        "Weekly: solve 100 MCQs across all 3 subjects",
      ],
      resources: ["HC Verma (selected)", "OP Tandon Organic", "Cengage Coordinate Geometry"],
    },
    {
      month: "Sep–Oct", label: "Class 12 Topics — Full Coverage", color: "#7C3AED", icon: "📐",
      tip: "Electromagnetic Induction, p-block elements, Integration and 3D Geometry are high-weight JEE Main topics. Do not skip. Solve NCERT exemplar problems for Maths and Chemistry.",
      tasks: [
        "Electromagnetic Induction, Alternating Current (Physics)",
        "p-block, d-block elements — memorise properties",
        "Definite Integration, 3D Geometry, Vectors (Maths)",
        "Biomolecules, Polymers, Chemistry in Everyday Life (NCERT)",
        "NCERT Exemplar Maths & Chemistry — all chapters",
      ],
      resources: ["NCERT 12 (all 3)", "NCERT Exemplar", "DC Pandey EMI & Optics"],
    },
    {
      month: "Nov–Dec", label: "Mock Tests + Session 1 Prep", color: "#EC4899", icon: "📝",
      tip: "Start NTA mock tests on the official portal (free). Attempt 1 full mock per week in exam-time conditions. Analyse wrong answers — pattern recognition is key for JEE Main.",
      tasks: [
        "Attempt NTA free mocks on jeemain.nta.ac.in",
        "Time each section: 40 min/subject is a good benchmark",
        "Build error log — note every wrong answer with reason",
        "Focus on Numerical Value questions (no negative marking)",
        "Revise weak topics identified from mocks",
      ],
      resources: ["NTA Official Mocks (free)", "Allen/Resonance test series", "Arihant 40 Days Crash"],
    },
    {
      month: "Jan (S1)", label: "JEE Main Session 1 Exam", color: "#EAB308", icon: "✏️",
      tip: "Do NOT wait for results after Session 1. Continue preparation immediately. Best of 2 sessions counts — if Session 1 goes well, Session 2 is your backup to improve further.",
      tasks: [
        "Reach exam centre 60 mins early (biometric takes time)",
        "Chemistry first — fastest and most scoring",
        "Numerical section: attempt all (no negative marking)",
        "Flag uncertain MCQs and return after attempting rest",
        "Post-exam: note topic areas that felt weak → revise before S2",
      ],
      resources: ["Admit card", "Aadhaar / School ID", "NTA guidelines document"],
    },
    {
      month: "Feb–Mar", label: "Bridge Gap — S1 to S2 Improvement", color: "#6366F1", icon: "🔁",
      tip: "Between sessions, focus only on weak areas from Session 1. Don't restart everything — targeted improvement gets the most percentile gain. Revise high-weight chapters daily.",
      tasks: [
        "Identify all wrong answers from S1 (use memory/analysis)",
        "Targeted revision: top 3 weak chapters per subject",
        "Solve 5 years' past Session 2 papers",
        "Practice speed: 75 questions in 3 hours consistently",
        "Revise all formulas daily in final 2 weeks",
      ],
      resources: ["Past Session 2 PYQs", "Disha JEE Main 10 Years Papers", "Self revision notes"],
    },
    {
      month: "Apr (S2)", label: "JEE Main Session 2 — Best Score Counts", color: "#15A06E", icon: "🎯",
      tip: "Total 75 questions, 300 marks, 3 hours. Your best of 2 session percentiles is used for JoSAA. If targeting JEE Advanced, top ~2.5 lakh rank in JEE Main is required — confirm eligibility at jeeadv.ac.in.",
      tasks: [
        "Same strategy as Session 1 but with more confidence",
        "Attempt full paper — do not leave anything blank (Numerical: no penalty)",
        "Manage time: max 3 min per MCQ, 4 min per Numerical",
        "After exam: check JoSAA opening date for counselling",
        "If JEE Advanced eligible: immediately shift preparation",
      ],
      resources: ["Admit card", "josaa.nic.in (counselling)", "jeeadv.ac.in (if eligible)"],
    },
  ],
  bookTitle: "📚 Complete Book List — JEE Main",
  bookWrap: { background: "linear-gradient(135deg,#ffffff,#ffffff)", border: "1px solid rgba(255, 105, 61,.2)" },
  books: [
    { subj: "Physics", books: ["NCERT 11 & 12 (mandatory)", "DC Pandey (full series)", "HC Verma (select chapters)", "Arihant JEE Main Past Years"], color: "#FF693D" },
    { subj: "Chemistry", books: ["NCERT 11 & 12 (inorganic = enough)", "OP Tandon Organic Chemistry", "Narendra Awasthi Physical Chem", "VK Jaiswal Inorganic (optional)"], color: "#0ea5a4" },
    { subj: "Maths", books: ["RD Sharma (Class 11 & 12)", "Cengage Series (topic-wise)", "Arihant 40 Days JEE Main Maths", "NTA Mock Papers (official free)"], color: "#8b5cf6" },
  ],
};

/* ── JEE Advanced ── */
export const JEE_ADV_ROADMAP = {
  eyebrow: "Study Roadmap",
  title: "12-Month JEE Advanced Preparation Roadmap",
  sub: "Step-by-step plan with specific tasks, books and daily targets — from foundation through exam day.",
  gradient: "linear-gradient(180deg,#FF693D,#0EA5A4,#7C3AED,#EC4899,#EAB308,#15A06E)",
  steps: [
    {
      month: "Jun–Aug", label: "Foundation & NCERT Mastery", color: "#FF693D", icon: "📚",
      tip: "Complete NCERT Physics & Chemistry thoroughly. Solve H.C. Verma Part 1 (Chapters 1–15). Build concept clarity over speed — JEE Advanced tests deep understanding, not shortcuts.",
      tasks: [
        "NCERT Physics Class 11 — all chapters with derivations",
        "NCERT Chemistry Class 11 — mole concept, thermodynamics",
        "H.C. Verma Vol 1: Mechanics & Fluid Mechanics",
        "RD Sharma / SL Loney Trigonometry basics",
        "Target: 6–8 hrs/day structured study",
      ],
      resources: ["H.C. Verma Vol 1", "NCERT 11 Physics & Chemistry", "SL Loney Trigonometry"],
    },
    {
      month: "Sep–Nov", label: "Core Concepts & Problem Solving", color: "#0EA5A4", icon: "🔬",
      tip: "Dive into Irodov for Physics. Master all Organic reaction mechanisms chapter by chapter. Start Coordinate Geometry. Take weekly chapter tests to gauge retention.",
      tasks: [
        "Irodov Problems in General Physics (selected)",
        "Organic Chemistry — Morrison & Boyd reaction mechanisms",
        "Inorganic Chemistry — JD Lee (d-block, coordination)",
        "Coordinate Geometry — Circles, Parabola, Ellipse",
        "Physical Chemistry — Electrochemistry, Solutions",
      ],
      resources: ["Irodov", "Morrison & Boyd", "JD Lee Inorganic", "Arihant Algebra"],
    },
    {
      month: "Dec–Feb", label: "Advanced Topics & Integration", color: "#7C3AED", icon: "📐",
      tip: "Cover Class 12 Physics (Electrostatics to Modern Physics), 3D Geometry, Vectors, Differential Equations. Start solving previous year JEE Advanced papers from 2015 onwards.",
      tasks: [
        "Electrostatics, Current Electricity, Magnetism (full)",
        "Wave Optics — Interference, Diffraction, Polarisation",
        "3D Geometry, Vectors, Definite Integration",
        "Differential Equations & Probability",
        "Solve JEE Advanced PYQs (2015–2020)",
      ],
      resources: ["DC Pandey Electricity", "ML Khanna Maths", "FIITJEE Study Material"],
    },
    {
      month: "Mar–Apr", label: "Full Mock Tests & Weak Area Fix", color: "#EC4899", icon: "📝",
      tip: "Attempt full Paper 1 + Paper 2 mocks every weekend (3-hour blocks each). Analyse errors subject-wise. Avoid starting new topics — deepen existing ones. Maintain accuracy over speed.",
      tasks: [
        "2 full mocks per week (Paper 1 + Paper 2 format)",
        "Error log: note every mistake with reason",
        "Revise Physical Chemistry (most scoring for rank)",
        "Speed drills on Maths numerical answer questions",
        "Past 5 years JEE Advanced papers under exam conditions",
      ],
      resources: ["Allen/Resonance test series", "JEE Advanced PYQ 2020–2024", "Disha 41 Years PYQ"],
    },
    {
      month: "May", label: "Revision Sprint & Formula Lock", color: "#EAB308", icon: "⚡",
      tip: "No new topics. Revise all named reactions, important formulas, and theorems. Solve 1 mock per day. Focus on sections where you drop marks — negative marking in JEE Advanced is heavy.",
      tasks: [
        "Formula sheets for all 3 subjects — daily revision",
        "Named Reactions list: Aldol, Cannizzaro, Grignard, etc.",
        "Important theorems: Gauss, Biot-Savart, Rolle's",
        "Solve 1 full mock daily in exam-day conditions",
        "Sleep 7–8 hrs — exam is a 2-paper marathon",
      ],
      resources: ["Self-made formula sheets", "Resonance/Allen rapid revision booklets"],
    },
    {
      month: "Exam Day", label: "JEE Advanced — Paper 1 & Paper 2", color: "#15A06E", icon: "🎯",
      tip: "Paper 1: 9:00 AM – 12:00 PM. Paper 2: 2:30 PM – 5:30 PM. Eat light between papers. Attempt your strongest subject first within each paper. Never leave numerical questions blank — no negative marking.",
      tasks: [
        "Reach exam centre 45 mins early",
        "Attempt Chemistry first (quickest, boosts confidence)",
        "Skip and return to uncertain MCQs — time management",
        "Numerical answer type: attempt all (no negative marks)",
        "Between papers: rest, light food, no discussing answers",
      ],
      resources: ["Admit card", "Valid photo ID", "Stationery as per JEE guidelines"],
    },
  ],
  bookTitle: "📚 Complete Book List — JEE Advanced",
  bookWrap: { background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "1px solid rgba(124,58,237,.2)" },
  books: [
    { subj: "Physics", books: ["H.C. Verma Vol 1 & 2 (must)", "Irodov Problems in General Physics", "DC Pandey (Series)", "FIITJEE Physics Study Material"], color: "#FF693D" },
    { subj: "Chemistry", books: ["NCERT 11 & 12 (mandatory base)", "JD Lee Inorganic Chemistry", "Morrison & Boyd Organic", "Narendra Awasthi Physical Chem"], color: "#0EA5A4" },
    { subj: "Maths", books: ["RD Sharma / SL Loney Trigonometry", "ML Khanna IIT Mathematics", "FIITJEE Maths Study Material", "Arihant 41 Years PYQ"], color: "#7C3AED" },
  ],
};

/* ── NEET UG ── */
export const NEET_ROADMAP = {
  eyebrow: "Study Roadmap",
  title: "12-Month NEET Preparation Roadmap",
  sub: "An NCERT-first, Biology-heavy plan with tasks, books and daily targets — from foundation through exam day.",
  gradient: "linear-gradient(180deg,#15a06e,#0EA5A4,#FF693D,#EC4899,#EAB308,#15a06e)",
  steps: [
    {
      month: "Jun–Aug", label: "NCERT Foundation (Biology First)", color: "#15a06e", icon: "🌿",
      tip: "NEET is won on NCERT — especially Biology. Read NCERT Biology line by line and start Class 11 Physics & Chemistry fundamentals.",
      tasks: ["NCERT Biology Class 11 — every line, twice", "NCERT Chemistry 11 — mole concept, bonding, GOC", "NCERT Physics 11 — mechanics fundamentals", "Build a Biology one-liner / diagram notebook"],
      resources: ["NCERT Biology 11", "NCERT Physics & Chemistry 11", "Truemans Biology"],
    },
    {
      month: "Sep–Nov", label: "Concept Building & Problem Solving", color: "#0EA5A4", icon: "🔬",
      tip: "Layer problem-solving onto NCERT. Practice Physics numericals daily, master Organic mechanisms, revise Biology weekly.",
      tasks: ["Physics: HC Verma + DC Pandey (NEET-level)", "Organic Chemistry — reaction mechanisms", "NCERT Biology 12 — Genetics & Reproduction", "Weekly Biology + assertion-reason practice"],
      resources: ["HC Verma", "MS Chouhan Organic", "NCERT Biology 12"],
    },
    {
      month: "Dec–Feb", label: "Class 12 Depth & PYQs", color: "#FF693D", icon: "📐",
      tip: "Finish Class 12 Physics & Chemistry, complete Human Physiology & Ecology, and solve 10 years of NEET PYQs subject-wise.",
      tasks: ["Electrostatics → Modern Physics (full)", "Inorganic & Coordination Chemistry", "Human Physiology, Ecology & Biotech", "NEET PYQs (2015–2024) chapter-wise"],
      resources: ["NCERT 12 (all)", "MTG 33 Years NEET PYQ", "Allen modules"],
    },
    {
      month: "Mar–Apr", label: "Full Mocks & Weak-Area Fix", color: "#EC4899", icon: "📝",
      tip: "Attempt full 720-mark mocks (3h 20m) twice a week. Prioritise Biology accuracy — it carries half the paper.",
      tasks: ["2 full mocks/week (200 Q · attempt 180)", "Subject-wise error log with NCERT refs", "Re-revise Biology weekly", "Speed + accuracy drills for Physics"],
      resources: ["Allen / Aakash test series", "NEET PYQ 2020–2025", "MTG NCERT Fingertips"],
    },
    {
      month: "May", label: "Revision Sprint & NCERT Lock", color: "#EAB308", icon: "⚡",
      tip: "No new topics. Revise NCERT Biology & Inorganic cover to cover, lock formulas, and solve one full mock daily.",
      tasks: ["NCERT Biology + Inorganic full revision", "Formula sheets — Physics & Physical Chem", "1 full mock daily, exam-day timing", "Revise NCERT diagrams & exceptions"],
      resources: ["NCERT (Biology + Chemistry)", "Self-made formula sheets"],
    },
    {
      month: "Exam Day", label: "NEET UG — 3h 20m, 720 marks", color: "#15a06e", icon: "🎯",
      tip: "Start with Biology to bank marks fast, then Chemistry, then Physics. Fill the OMR carefully — no negative for unattempted.",
      tasks: ["Reach centre early; carry admit card + ID", "Attempt Biology first (scoring, fast)", "Then Chemistry, then Physics numericals", "Mark OMR in batches; double-check bubbling"],
      resources: ["Admit card", "Valid photo ID", "Stationery per NTA guidelines"],
    },
  ],
  bookTitle: "📚 Complete Book List — NEET UG",
  bookWrap: { background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: "1px solid #15a06e33" },
  books: [
    { subj: "Physics", books: ["NCERT 11 & 12 (base)", "HC Verma Vol 1 & 2", "DC Pandey NEET series", "Errorless / MTG PYQ"], color: "#FF693D" },
    { subj: "Chemistry", books: ["NCERT 11 & 12 (esp. Inorganic)", "MS Chouhan Organic", "N. Awasthi Physical", "MTG NCERT Fingertips"], color: "#0EA5A4" },
    { subj: "Biology", books: ["NCERT 11 & 12 (the bible)", "Trueman's Biology Vol 1 & 2", "MTG NCERT Fingertips", "33 Years NEET PYQ"], color: "#15a06e" },
  ],
};
