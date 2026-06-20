/* ════════════════════════════════════════════════════════════════
   MENTORSHIP — plan catalogue + page configs
   JEEsociety-style premium 1-on-1 mentorship for JEE & NEET.

   Plan keys MUST stay in sync with:
     • src/components/EnrolModal.jsx   (PLAN_META)
     • server/routes/payment.js        (PLANS)
     • server/models/Enrollment.js     (plan enum)
   ════════════════════════════════════════════════════════════════ */

/* Total mentorship seats per batch — drives the urgency messaging. */
export const SEATS_LIMIT = 120;
export const SEATS_LEFT = 37; // shown as "X of 120 seats left"

/* Pricing (server is the source of truth — these are display only).
   `drops` is the cascading price-drop shown on the cards: every value
   except the last is struck through, the last is the final price.
   All mentorship plans are now a flat ₹1 (cascade shown for marketing). */
export const MENTOR_PLANS = {
  "mentor-jee-2027":  { amount: 1, old: 7999, drops: [7999, 3999, 1], exam: "JEE",        year: 2027 },
  "mentor-neet-2027": { amount: 1, old: 7999, drops: [7999, 3999, 1], exam: "NEET",       year: 2027 },
  "mentor-jee-2028":  { amount: 1, old: 7999, drops: [7999, 3999, 1], exam: "JEE",        year: 2028 },
  "mentor-neet-2028": { amount: 1, old: 7999, drops: [7999, 3999, 1], exam: "NEET",       year: 2028 },
  "mentor-foundation":{ amount: 1, old: 5999, drops: [5999, 1],       exam: "Foundation", year: null },
};

/* ── Quick summary used by navbar + hero card ───────────────────── */
export const MENTOR_LINKS = [
  { slug: "jee-2027",   label: "JEE & NEET 2027", to: "/mentorship/jee-2027",   price: 1, tag: "Class 12 / Droppers" },
  { slug: "jee-2028",   label: "JEE & NEET 2028", to: "/mentorship/jee-2028",   price: 1, tag: "Class 11 · 2-Year Plan" },
  { slug: "foundation", label: "Foundation 9–10", to: "/mentorship/foundation", price: 1, tag: "Class 9 & 10" },
];

/* ════════════════════════════════════════════════════════════════
   PER-PAGE CONFIGS
   ════════════════════════════════════════════════════════════════ */
export const MENTORSHIP = {
  /* ─────────────────────────── JEE / NEET 2027 ─────────────────── */
  "jee-2027": {
    slug: "jee-2027",
    eyebrow: "JEE & NEET 2027 Mentorship",
    tagline: "Know Your Path. Own Your Future.",
    badge: "🔥 Limited spots · Serious aspirants only",
    title: ["Right Guidance.", "Real Results.", ""],
    subtitle: "CollegeParichay helps serious JEE & NEET 2027 aspirants cut through the confusion — with a personal IITian / doctor mentor, daily accountability and a plan that actually works. No noise, just the path to your highest potential.",
    videoNote: "Watch how the CollegeParichay mentorship system works",
    stats: [
      { val: "1000+", lbl: "Students mentored" },
      { val: "1-on-1", lbl: "Personal mentor" },
      { val: "Daily", lbl: "Targets & check-ins" },
      { val: "Weekly", lbl: "Test analysis" },
    ],
    metrics: {
      student: { name: "Aarav", klass: "Class 12 · Dropper", mentor: "Aman (IIT Delhi)", line: "Aarav Gupta · Class 12", exam: "JEE 2027" },
      growth: {
        label: "Marks growth over 8 weeks", hint: "You vs batch average — out of 300",
        you:   [84, 98, 92, 126, 150, 178, 196, 214],
        batch: [72, 78, 80, 88, 96, 104, 110, 118],
      },
      subjects: [
        { name: "Physics",   Before: 42, After: 78 },
        { name: "Chemistry", Before: 55, After: 84 },
        { name: "Maths",     Before: 38, After: 81 },
      ],
      outcomes: [
        { v: "+130",      l: "Marks gained in 8 weeks", c: "#F47E20" },
        { v: "86%",       l: "Average accuracy",        c: "#22c55e" },
        { v: "88 → 99.2", l: "Percentile jump",         c: "#6366f1" },
        { v: "23 days",   l: "Avg study streak",        c: "#ef4444" },
      ],
      weekHours: [4.5, 6, 5, 7, 6, 8, 2.5],
      goalPct: 86,
      liveTiles: [
        { icon: "clock",    c: "#F47E20", v: "6h 12m",  l: "Today" },
        { icon: "activity", c: "#6366f1", v: "39h",     l: "This week" },
        { icon: "flame",    c: "#ef4444", v: "23 days", l: "Streak" },
        { icon: "check",    c: "#22c55e", v: "18 / 21", l: "Tasks done" },
      ],
      test: {
        week: "Week 6", gain: "+47 marks", trend: [34, 41, 38, 56, 68, 81],
        weak: ["Rotational Motion", "Thermodynamics", "p-Block", "Probability"],
        fix:  ["Re-do Rotational Motion PYQs (2 hrs)", "Revise Thermo formula sheet daily", "10 timed p-Block questions"],
      },
      parent: {
        week: "Week 6",
        rows: [
          { icon: "clock",    c: "#F47E20", l: "Study hours this week", v: "39 hrs",  note: "+5h vs last week" },
          { icon: "file",     c: "#6366f1", l: "Tests attempted",       v: "2 tests", note: "Both fully analysed" },
          { icon: "trend",    c: "#22c55e", l: "Score improvement",     v: "+18%",    note: "126 → 178 / 300" },
          { icon: "check",    c: "#0ea5a4", l: "Tasks completed",       v: "18 / 21", note: "86% consistency" },
          { icon: "activity", c: "#ef4444", l: "Attendance",           v: "96%",     note: "Active 6 of 7 days" },
        ],
        remark: "Aarav's consistency really jumped this week. Next week we focus on Rotational Motion and timed mocks.",
      },
    },

    forYou: [
      "You have backlogs and no idea where to start",
      "You go to coaching but your retention is zero",
      "You're consistent for 2 days then disappear for 10",
      "You want IIT / AIIMS but fear you're not smart enough",
      "You study hard but your test scores never move",
    ],

    howWeGuide: [
      { title: "Daily Micro-Capsules", desc: "Bite-sized daily targets pushed on WhatsApp so you always know the single most important thing to do today." },
      { title: "Personal IITian / Doctor Mentor", desc: "A real topper assigned to you 1-on-1 — not a 500-student group. They know your name, your backlog, your goal." },
      { title: "Weekly Test Analysis", desc: "Every test is dissected — silly mistakes, weak chapters, time management — into a one-page action plan." },
      { title: "Gamified Accountability", desc: "Streaks, ranks and rewards keep you consistent even on the days you don't feel like studying." },
      { title: "Backlog Clearing Sprints", desc: "A structured catch-up system that clears months of pending chapters without burning you out." },
      { title: "Rank-Push Strategy", desc: "In the final months we switch to mock tests, revision loops and exam-temperament training." },
    ],

    journey: [
      { title: "Intake call with your mentor", desc: "A 45-min 1-on-1 call to map your current level, backlog and target rank." },
      { title: "Personalised study roadmap", desc: "A week-by-week plan built around YOUR syllabus gaps — not a generic timetable." },
      { title: "Daily targets via gamified system", desc: "Micro-capsules + streaks keep you moving every single day." },
      { title: "Weekly test analysis", desc: "Tests reviewed with your mentor; mistakes turned into a fix-list." },
      { title: "Backlog clearing sprint", desc: "Dedicated sprints to wipe out pending chapters before the final phase." },
      { title: "Final rank push", desc: "Mock-test marathons, revision and strategy for the real exam." },
    ],

    testimonials: [
      { name: "Aarav Gupta",  batch: "2025 Batch", improvement: "118 → 241 marks", quote: "I had a 4-month backlog. My mentor broke it into daily capsules and I finally stopped feeling lost." },
      { name: "Ishita Verma", batch: "2025 Batch", improvement: "AIR 21,400 → 3,180", quote: "Weekly test analysis was the game changer. I knew exactly what to fix every week." },
      { name: "Rohan Iyer",   batch: "2025 Batch", improvement: "NEET 412 → 638", quote: "The accountability system kept me consistent for the first time in my life." },
      { name: "Sneha Kapoor", batch: "2025 Batch", improvement: "Dropper → NIT CSE", quote: "Having one person who actually knew my name and my goal changed everything." },
    ],

    faqs: [
      { q: "I already have coaching. How will I manage mentorship?", a: "Mentorship sits on top of your coaching — it doesn't replace it. We make your existing classes actually count by fixing retention, backlog and consistency. Most students spend just 10–15 extra minutes a day on the system." },
      { q: "I have a lot of backlog. Is this for me?", a: "Absolutely — backlog students are exactly who this is built for. Your mentor designs backlog-clearing sprints so you catch up in a structured, stress-free way instead of panicking." },
      { q: "I struggle with consistency.", a: "That's the #1 problem we solve. Daily micro-capsules, streaks and a real human checking on you make consistency almost automatic." },
      { q: "Is this for both JEE and NEET aspirants?", a: "Yes. We run separate JEE and NEET tracks with subject-matched mentors (IITians for JEE, doctors/NEET toppers for NEET)." },
      { q: "Can I get a discount?", a: "No. The price is already a fraction of what 1-on-1 mentorship costs — and serious aspirants don't negotiate their future." },
    ],

    tracks: [
      { plan: "mentor-jee-2027",  exam: "JEE 2027",  accent: "#F47E20", line: "IITian mentors · backlog + rank push" },
      { plan: "mentor-neet-2027", exam: "NEET 2027", accent: "#22c55e", line: "Doctor / NEET-topper mentors · biology-first" },
    ],
  },

  /* ─────────────────────────── JEE / NEET 2028 ─────────────────── */
  "jee-2028": {
    slug: "jee-2028",
    eyebrow: "JEE & NEET 2028 Mentorship",
    tagline: "Know Your Path. Own Your Future.",
    badge: "🐦 Early Bird Batch — Limited Seats",
    title: ["You're Early.", "That's Your Edge.", ""],
    subtitle: "CollegeParichay mentors JEE & NEET 2028 aspirants from day one — a 2-year plan that builds deep concepts, daily discipline and an unbeatable head start. Start now, finish two full years ahead of everyone else.",
    videoNote: "See how a 2-year head start builds an unbeatable lead",
    stats: [
      { val: "2 Years", lbl: "Of mentorship" },
      { val: "1-on-1", lbl: "Same mentor" },
      { val: "4-Phase", lbl: "Roadmap" },
      { val: "Quarterly", lbl: "Checkpoints" },
    ],
    metrics: {
      student: { name: "Ishita", klass: "Class 11", mentor: "Sneha (IIT Bombay)", line: "Ishita Verma · Class 11", exam: "JEE 2028" },
      growth: {
        label: "Concept mastery over 8 weeks", hint: "You vs batch average — concept mastery %",
        you:   [38, 46, 52, 58, 66, 74, 82, 88],
        batch: [30, 36, 40, 46, 50, 56, 60, 64],
      },
      subjects: [
        { name: "Physics",   Before: 30, After: 64 },
        { name: "Chemistry", Before: 44, After: 76 },
        { name: "Maths",     Before: 28, After: 70 },
      ],
      outcomes: [
        { v: "+50%",    l: "Concept mastery gain", c: "#F47E20" },
        { v: "82%",     l: "Average accuracy",     c: "#22c55e" },
        { v: "2-yr",    l: "Head start built",     c: "#6366f1" },
        { v: "19 days", l: "Avg study streak",     c: "#ef4444" },
      ],
      weekHours: [3, 4, 3.5, 5, 4.5, 6, 2],
      goalPct: 78,
      liveTiles: [
        { icon: "clock",    c: "#F47E20", v: "4h 20m",  l: "Today" },
        { icon: "activity", c: "#6366f1", v: "28h",     l: "This week" },
        { icon: "flame",    c: "#ef4444", v: "19 days", l: "Streak" },
        { icon: "check",    c: "#22c55e", v: "16 / 20", l: "Tasks done" },
      ],
      test: {
        week: "Week 6", gain: "+39 marks", trend: [28, 35, 40, 48, 58, 67],
        weak: ["Vectors", "Mole Concept", "Kinematics", "Trigonometry"],
        fix:  ["Revise Vectors from basics (1.5 hrs)", "20 Mole Concept numericals", "Daily 5 Trigonometry problems"],
      },
      parent: {
        week: "Week 6",
        rows: [
          { icon: "clock",    c: "#F47E20", l: "Study hours this week", v: "28 hrs",  note: "+4h vs last week" },
          { icon: "file",     c: "#6366f1", l: "Tests attempted",       v: "1 test",  note: "Concept checkpoint" },
          { icon: "trend",    c: "#22c55e", l: "Mastery improvement",   v: "+22%",    note: "66% → 88% concepts" },
          { icon: "check",    c: "#0ea5a4", l: "Tasks completed",       v: "16 / 20", note: "80% consistency" },
          { icon: "activity", c: "#ef4444", l: "Attendance",           v: "92%",     note: "Active 5 of 7 days" },
        ],
        remark: "Ishita is building concepts beautifully. Next week we strengthen Kinematics and Mole Concept.",
      },
    },

    forYou: [
      "You're in Class 11 and want to start the right way",
      "You don't want to repeat the mistakes droppers make",
      "You want concepts built deep, not just memorised",
      "You want IIT / AIIMS but don't know the 2-year path",
      "You want a mentor before the pressure hits",
    ],

    howWeGuide: [
      { title: "Concept-First Capsules", desc: "Daily capsules that build deep understanding from the ground up — the foundation toppers are made of." },
      { title: "Personal Mentor for 2 Years", desc: "The same IITian / doctor mentor walks with you across both years, so nothing is ever restarted." },
      { title: "Formula & Theory Mastery", desc: "Structured formula sheets and theory checkpoints so revision in year two is effortless." },
      { title: "Habit & Consistency Engine", desc: "We install study habits early — by year two, consistency is who you are, not what you force." },
      { title: "Progressive Test Practice", desc: "Tests scale in difficulty across two years so you peak exactly at exam time." },
      { title: "Long-Game Rank Strategy", desc: "A 2-year rank roadmap with checkpoints every quarter so you always know if you're on track." },
    ],

    journey: [
      { title: "Intake call with your mentor", desc: "Map your starting point and design the 2-year vision." },
      { title: "Concept-building foundation", desc: "Deep fundamentals in PCM / PCB built the right way from day one." },
      { title: "Formula & theory mastery", desc: "Lock in formulas and theory so year-two revision flies." },
      { title: "Progressive test practice", desc: "Scaling test series that grows with you across two years." },
      { title: "Revision loops", desc: "Spaced revision so nothing learned in year one is ever forgotten." },
      { title: "Final rank push", desc: "The last-mile mock + strategy phase before the 2028 exam." },
    ],

    twoYearPlan: [
      { phase: "Phase 1", when: "Now – Dec 2026", title: "Foundation + Habit Building", desc: "Deep concept building in PCM/PCB and installing daily study habits." },
      { phase: "Phase 2", when: "Jan – Jun 2027", title: "Chapter Mastery", desc: "Chapter-by-chapter mastery with formula sheets and checkpoint tests." },
      { phase: "Phase 3", when: "Jul – Dec 2027", title: "Test Series + Revision", desc: "Full-syllabus test series and structured spaced revision loops." },
      { phase: "Phase 4", when: "Jan – Apr 2028", title: "Final Push + Strategy", desc: "Mock marathons, exam temperament and the final rank-push strategy." },
    ],

    testimonials: [
      { name: "Kabir Sethi",  batch: "Early Batch", improvement: "Started Class 11 → JEE 99.2%ile", quote: "Starting two years early with a mentor meant I was never in panic mode." },
      { name: "Ananya Rao",   batch: "Early Batch", improvement: "Class 11 → NEET 660+", quote: "The 2-year plan made biology feel effortless by the time the exam came." },
      { name: "Dev Malhotra", batch: "Early Batch", improvement: "Weak base → NIT", quote: "My concepts were rock solid because we built them slowly and properly." },
    ],

    faqs: [
      { q: "Isn't Class 11 too early to start mentorship?", a: "No — it's the perfect time. The students who finish two years ahead are the ones who started right. Early mentorship prevents the backlog and panic droppers face." },
      { q: "Will this clash with my school and coaching?", a: "No. The 2-year system is light daily — 10–15 minutes — and is designed to make your school and coaching far more effective, not add load." },
      { q: "Is this for both JEE and NEET 2028?", a: "Yes. Separate JEE and NEET tracks with the right mentors for each, both running the same 2-year framework." },
      { q: "Why is the 2-year plan more than the 2027 plan?", a: "Because you get two full years of 1-on-1 mentorship instead of one — far more mentor time, more sprints and a longer roadmap. It's the highest-value plan we offer." },
      { q: "Can I get a discount?", a: "No. Early-bird pricing is already the lowest this plan will ever be." },
    ],

    tracks: [
      { plan: "mentor-jee-2028",  exam: "JEE 2028",  accent: "#F47E20", line: "2-year IITian mentorship · concept-first" },
      { plan: "mentor-neet-2028", exam: "NEET 2028", accent: "#22c55e", line: "2-year doctor mentorship · biology-first" },
    ],
  },

  /* ─────────────────────────── FOUNDATION 9–10 ─────────────────── */
  "foundation": {
    slug: "foundation",
    eyebrow: "Foundation Mentorship · Class 9 & 10",
    tagline: "Know Your Path. Own Your Future.",
    badge: "🌱 Build the base before it's too late",
    title: ["Build the Base.", "Win the Battle Early.", ""],
    subtitle: "CollegeParichay guides Class 9 & 10 students toward JEE & NEET with a personal mentor — clearing confusion early and building the rock-solid foundation toppers are made of. The earlier you start, the higher you rank.",
    videoNote: "Why Class 9–10 is where toppers actually win",
    stats: [
      { val: "Class 9–10", lbl: "Right age to start" },
      { val: "1-on-1", lbl: "Personal mentor" },
      { val: "NCERT", lbl: "Mastery first" },
      { val: "Board+", lbl: "Olympiad edge" },
    ],
    metrics: {
      student: { name: "Riya", klass: "Class 10", mentor: "Dev (IIT Kanpur)", line: "Riya Singh · Class 10", exam: "Foundation" },
      growth: {
        label: "Foundation score over 8 weeks", hint: "You vs batch average — foundation test %",
        you:   [52, 58, 56, 64, 72, 80, 86, 90],
        batch: [44, 48, 50, 54, 58, 62, 66, 70],
      },
      subjects: [
        { name: "Maths",        Before: 48, After: 82 },
        { name: "Science",      Before: 52, After: 85 },
        { name: "Mental Abil.", Before: 45, After: 79 },
      ],
      outcomes: [
        { v: "+38%",    l: "Foundation score gain", c: "#F47E20" },
        { v: "88%",     l: "Average accuracy",      c: "#22c55e" },
        { v: "NTSE",    l: "Olympiad-ready",        c: "#6366f1" },
        { v: "17 days", l: "Avg study streak",      c: "#ef4444" },
      ],
      weekHours: [2, 3, 2.5, 3.5, 3, 4, 1.5],
      goalPct: 84,
      liveTiles: [
        { icon: "clock",    c: "#F47E20", v: "3h 05m",  l: "Today" },
        { icon: "activity", c: "#6366f1", v: "21h",     l: "This week" },
        { icon: "flame",    c: "#ef4444", v: "17 days", l: "Streak" },
        { icon: "check",    c: "#22c55e", v: "14 / 18", l: "Tasks done" },
      ],
      test: {
        week: "Week 6", gain: "+44 marks", trend: [40, 48, 52, 60, 70, 84],
        weak: ["Linear Equations", "Light & Reflection", "Surface Area", "Atoms & Molecules"],
        fix:  ["Re-do Linear Equations (NCERT)", "Practice ray diagrams daily", "10 mensuration sums"],
      },
      parent: {
        week: "Week 6",
        rows: [
          { icon: "clock",    c: "#F47E20", l: "Study hours this week", v: "21 hrs",  note: "+3h vs last week" },
          { icon: "file",     c: "#6366f1", l: "Tests attempted",       v: "1 test",  note: "Foundation + board" },
          { icon: "trend",    c: "#22c55e", l: "Score improvement",     v: "+20%",    note: "70% → 90% test" },
          { icon: "check",    c: "#0ea5a4", l: "Tasks completed",       v: "14 / 18", note: "78% consistency" },
          { icon: "activity", c: "#ef4444", l: "Attendance",           v: "94%",     note: "Active 6 of 7 days" },
        ],
        remark: "Riya is balancing boards and foundation well. Next week we focus on Light and Linear Equations.",
      },
    },

    forYou: [
      "Class 9 students who want a genuine head start",
      "Class 10 students preparing for boards + JEE/NEET together",
      "Students whose coaching gives zero personal attention",
      "Parents who want their child mentored, not just taught",
      "Students who want IIT / AIIMS as a real, planned goal",
    ],

    whyFoundation: [
      "80% of JEE & NEET toppers say Class 9–10 is where they won the battle",
      "Maths & Science fundamentals decide your JEE / NEET ceiling",
      "Start now — your batchmates haven't",
    ],

    howWeGuide: [
      { title: "NCERT Mastery", desc: "Complete command over Class 9 & 10 NCERT — the bedrock of every JEE & NEET question." },
      { title: "IIT-Level Concept Intro", desc: "Gentle early exposure to higher concepts so the jump in Class 11 feels natural." },
      { title: "Weekly Targets + Accountability", desc: "Clear weekly goals with a mentor checking in — habits that last a lifetime." },
      { title: "Early Exam Pattern Exposure", desc: "First taste of JEE / NEET style questions, the right way, at the right age." },
      { title: "1-on-1 Mentor", desc: "A personal IITian / doctor mentor who guides your child individually." },
      { title: "Board + Olympiad Edge", desc: "Stronger boards and a real shot at NTSE / Olympiads alongside foundation building." },
    ],

    journey: [
      { title: "NCERT mastery + habit building", desc: "Lock in fundamentals and install daily study habits." },
      { title: "Advanced concept introduction", desc: "Gentle early exposure to higher Maths & Science thinking." },
      { title: "JEE / NEET-level problem exposure", desc: "First structured taste of competitive problem solving." },
    ],

    testimonials: [
      { name: "Aditya Jain", batch: "Foundation Alumni", improvement: "Class 9 → School topper", quote: "I understood concepts so early that Class 11 felt easy." },
      { name: "Riya Singh",  batch: "Foundation Alumni", improvement: "Class 10 → NTSE Scholar", quote: "My mentor made boards and foundation work together perfectly." },
      { name: "Manav Shah",  batch: "Foundation Alumni", improvement: "Weak Maths → Olympiad", quote: "The weekly accountability turned me into a consistent student." },
    ],

    faqs: [
      { q: "My child is in Class 9. Is it too early?", a: "No. It's the perfect time. Class 9–10 is exactly where future toppers build the base that makes JEE & NEET feel easy later." },
      { q: "Will this clash with school?", a: "No — it strengthens school. We build NCERT mastery and study habits that directly improve board performance while laying the JEE/NEET base." },
      { q: "How is this different from tuition?", a: "Tuition teaches a topic and moves on. Mentorship gives your child a personal IITian/doctor guide, weekly targets, accountability and a long-term plan toward IIT/AIIMS." },
      { q: "Is it for JEE or NEET?", a: "Both. The Class 9–10 foundation in Maths & Science is shared — your child chooses the JEE or NEET track later with the base already built." },
      { q: "Can I get a discount?", a: "No. Foundation is already the most affordable, highest-leverage stage to invest in." },
    ],

    tracks: [
      { plan: "mentor-foundation", exam: "Foundation 9–10", accent: "#6366f1", line: "Shared JEE + NEET base · 1-on-1 mentor" },
    ],
  },
};
