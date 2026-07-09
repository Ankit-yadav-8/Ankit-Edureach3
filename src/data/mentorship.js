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
  { slug: "jee-2027", label: "JEE 2027", to: "/mentorship/jee-2027", price: 1, tag: "Class 12 / Droppers" },
  { slug: "jee-2028", label: "JEE 2028", to: "/mentorship/jee-2028", price: 1, tag: "Class 11 · 2-Year Plan" },
  { slug: "neet",     label: "NEET",     to: "/mentorship/neet",     price: 1, tag: "Medical Aspirants" },
];

/* ════════════════════════════════════════════════════════════════
   PER-PAGE CONFIGS
   ════════════════════════════════════════════════════════════════ */
export const MENTORSHIP = {
  /* ─────────────────────────── JEE 2027 ─────────────────── */
  "jee-2027": {
    slug: "jee-2027",
    eyebrow: "JEE 2027 Mentorship",
    tagline: "Know Your Path. Own Your Future.",
    badge: "🔥 Limited spots · Serious aspirants only",
    title: ["Right Guidance.", "Real Results.", ""],
    subtitle: "CollegeParichay helps serious JEE 2027 aspirants cut through the confusion — with a personal IITian mentor, daily accountability and a plan that actually works. No noise, just the path to your highest potential.",
    videoNote: "Watch how the CollegeParichay mentorship system works",
    heroImage: "/images/jee_2027_hero.png",
    analyticsImage: "/images/jee_2027_analytics.png",
    roadmapImage: "/images/jee_2027_roadmap.png",
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
        { v: "+130",      l: "Marks gained in 8 weeks", c: "#FF693D" },
        { v: "86%",       l: "Average accuracy",        c: "#22c55e" },
        { v: "88 → 99.2", l: "Percentile jump",         c: "#6366f1" },
        { v: "23 days",   l: "Avg study streak",        c: "#ef4444" },
      ],
      weekHours: [4.5, 6, 5, 7, 6, 8, 2.5],
      goalPct: 86,
      liveTiles: [
        { icon: "clock",    c: "#FF693D", v: "6h 12m",  l: "Today" },
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
        issue: "VOL 14 · SUN 12 NOV",
        headline: "Aarav closed his weakest chapter — Rotational Motion.",
        body: "After three focused sessions and a repeat mock, accuracy on Rotation jumped from 44% to 78%. Next week's plan pivots to Aldehydes and Modern Physics.",
        rows: [
          { l: "Study hours",   v: "45 / 42 hrs" },
          { l: "Mock score",    v: "218 / 300" },
          { l: "Rank estimate", v: "~ 12,400" },
          { l: "Weak areas",    v: "Rotation · Aldehydes" },
          { l: "Mentor note",   v: "Consistent, needs revision push" },
        ],
        remark: "Aarav's consistency really jumped this week. Next week we focus on Rotational Motion and timed mocks.",
      },
    },

    forYou: [
      "You have backlogs and no idea where to start",
      "You go to coaching but your retention is zero",
      "You're consistent for 2 days then disappear for 10",
      "You want IIT but fear you're not smart enough",
      "You study hard but your test scores never move",
    ],

    howWeGuide: [
      { title: "Daily Micro-Capsules", desc: "Bite-sized daily targets pushed on WhatsApp so you always know the single most important thing to do today." },
      { title: "Personal IITian Mentor", desc: "A real topper assigned to you 1-on-1 — not a 500-student group. They know your name, your backlog, your goal." },
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
      { name: "Rohan Iyer",   batch: "2025 Batch", improvement: "Mains 90%ile → 99.1%ile", quote: "The accountability system kept me consistent for the first time in my life." },
      { name: "Sneha Kapoor", batch: "2025 Batch", improvement: "Dropper → NIT CSE", quote: "Having one person who actually knew my name and my goal changed everything." },
    ],

    faqs: [
      { q: "I already have coaching. How will I manage mentorship?", a: "Mentorship sits on top of your coaching — it doesn't replace it. We make your existing classes actually count by fixing retention, backlog and consistency. Most students spend just 10–15 extra minutes a day on the system." },
      { q: "I have a lot of backlog. Is this for me?", a: "Absolutely — backlog students are exactly who this is built for. Your mentor designs backlog-clearing sprints so you catch up in a structured, stress-free way instead of panicking." },
      { q: "I struggle with consistency.", a: "That's the #1 problem we solve. Daily micro-capsules, streaks and a real human checking on you make consistency almost automatic." },
      { q: "Can I get a discount?", a: "No. The price is already a fraction of what 1-on-1 mentorship costs — and serious aspirants don't negotiate their future." },
    ],

    tracks: [
      { plan: "mentor-jee-2027",  exam: "JEE 2027",  accent: "#FF693D", line: "IITian mentors · backlog + rank push" },
    ],
  },

  /* ─────────────────────────── JEE 2028 ─────────────────── */
  "jee-2028": {
    slug: "jee-2028",
    eyebrow: "JEE 2028 Mentorship",
    tagline: "Know Your Path. Own Your Future.",
    badge: "🐦 Early Bird Batch — Limited Seats",
    title: ["You're Early.", "That's Your Edge.", ""],
    subtitle: "CollegeParichay mentors JEE 2028 aspirants from day one — a 2-year plan that builds deep concepts, daily discipline and an unbeatable head start. Start now, finish two full years ahead of everyone else.",
    videoNote: "See how a 2-year head start builds an unbeatable lead",
    heroImage: "/images/jee_2028_hero.png",
    analyticsImage: "/images/jee_2028_analytics.png",
    roadmapImage: "/images/jee_2028_roadmap.png",
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
        { v: "+50%",    l: "Concept mastery gain", c: "#FF693D" },
        { v: "82%",     l: "Average accuracy",     c: "#22c55e" },
        { v: "2-yr",    l: "Head start built",     c: "#6366f1" },
        { v: "19 days", l: "Avg study streak",     c: "#ef4444" },
      ],
      weekHours: [3, 4, 3.5, 5, 4.5, 6, 2],
      goalPct: 78,
      liveTiles: [
        { icon: "clock",    c: "#FF693D", v: "4h 20m",  l: "Today" },
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
        issue: "VOL 14 · SUN 12 NOV",
        headline: "Ishita locked in her concept base — Kinematics.",
        body: "Two years out and already steady. Concept mastery on Kinematics moved from 66% to 88% this week; next week we begin the Mole Concept and graph-based problems.",
        rows: [
          { l: "Study hours",     v: "28 / 26 hrs" },
          { l: "Concept mastery", v: "88%" },
          { l: "Checkpoints",     v: "1 / 1 done" },
          { l: "Weak areas",      v: "Kinematics · Moles" },
          { l: "Mentor note",     v: "Strong base, keep the pace" },
        ],
        remark: "Ishita is building concepts beautifully. Next week we strengthen Kinematics and Mole Concept.",
      },
    },

    forYou: [
      "You're in Class 11 and want to start the right way",
      "You don't want to repeat the mistakes droppers make",
      "You want concepts built deep, not just memorised",
      "You want IIT / NIT but don't know the 2-year path",
      "You want a mentor before the pressure hits",
    ],

    howWeGuide: [
      { title: "Concept-First Capsules", desc: "Daily capsules that build deep understanding from the ground up — the foundation toppers are made of." },
      { title: "Personal Mentor for 2 Years", desc: "The same IITian mentor walks with you across both years, so nothing is ever restarted." },
      { title: "Formula & Theory Mastery", desc: "Structured formula sheets and theory checkpoints so revision in year two is effortless." },
      { title: "Habit & Consistency Engine", desc: "We install study habits early — by year two, consistency is who you are, not what you force." },
      { title: "Progressive Test Practice", desc: "Tests scale in difficulty across two years so you peak exactly at exam time." },
      { title: "Long-Game Rank Strategy", desc: "A 2-year rank roadmap with checkpoints every quarter so you always know if you're on track." },
    ],

    journey: [
      { title: "Intake call with your mentor", desc: "Map your starting point and design the 2-year vision." },
      { title: "Concept-building foundation", desc: "Deep fundamentals in PCM built the right way from day one." },
      { title: "Formula & theory mastery", desc: "Lock in formulas and theory so year-two revision flies." },
      { title: "Progressive test practice", desc: "Scaling test series that grows with you across two years." },
      { title: "Revision loops", desc: "Spaced revision so nothing learned in year one is ever forgotten." },
      { title: "Final rank push", desc: "The last-mile mock + strategy phase before the 2028 exam." },
    ],

    twoYearPlan: [
      { phase: "Phase 1", when: "Now – Dec 2026", title: "Foundation + Habit Building", desc: "Deep concept building in PCM and installing daily study habits." },
      { phase: "Phase 2", when: "Jan – Jun 2027", title: "Chapter Mastery", desc: "Chapter-by-chapter mastery with formula sheets and checkpoint tests." },
      { phase: "Phase 3", when: "Jul – Dec 2027", title: "Test Series + Revision", desc: "Full-syllabus test series and structured spaced revision loops." },
      { phase: "Phase 4", when: "Jan – Apr 2028", title: "Final Push + Strategy", desc: "Mock marathons, exam temperament and the final rank-push strategy." },
    ],

    testimonials: [
      { name: "Kabir Sethi",  batch: "Early Batch", improvement: "Started Class 11 → JEE 99.2%ile", quote: "Starting two years early with a mentor meant I was never in panic mode." },
      { name: "Ananya Rao",   batch: "Early Batch", improvement: "Class 11 → NIT Trichy", quote: "The 2-year plan made PCM feel effortless by the time the exam came." },
      { name: "Dev Malhotra", batch: "Early Batch", improvement: "Weak base → IIT BHU", quote: "My concepts were rock solid because we built them slowly and properly." },
    ],

    faqs: [
      { q: "Isn't Class 11 too early to start mentorship?", a: "No — it's the perfect time. The students who finish two years ahead are the ones who started right. Early mentorship prevents the backlog and panic droppers face." },
      { q: "Will this clash with my school and coaching?", a: "No. The 2-year system is light daily — 10–15 minutes — and is designed to make your school and coaching far more effective, not add load." },
      { q: "Why is the 2-year plan better?", a: "Because you get two full years of 1-on-1 mentorship instead of one — far more mentor time, more sprints and a longer roadmap. It's the highest-value plan we offer." },
      { q: "Can I get a discount?", a: "No. Early-bird pricing is already the lowest this plan will ever be." },
    ],

    tracks: [
      { plan: "mentor-jee-2028",  exam: "JEE 2028",  accent: "#FF693D", line: "2-year IITian mentorship · concept-first" },
    ],
  },

  /* ─────────────────────────── NEET ─────────────────── */
  "neet": {
    slug: "neet",
    eyebrow: "NEET Mentorship (2027 & 2028)",
    tagline: "Know Your Path. Own Your Future.",
    badge: "⚕️ Doctor Mentors · Limited Seats",
    title: ["Biology First.", "Rank Guaranteed.", ""],
    subtitle: "CollegeParichay helps serious NEET aspirants cut through the confusion — with a personal Doctor / NEET topper mentor, daily accountability and a biology-first plan that actually works. Available for both 2027 and 2028.",
    videoNote: "Watch how the NEET mentorship system works",
    heroImage: "/images/neet_hero.png",
    analyticsImage: "/images/neet_analytics.png",
    roadmapImage: "/images/neet_roadmap.png",
    stats: [
      { val: "1000+", lbl: "Future Doctors" },
      { val: "1-on-1", lbl: "Medical mentor" },
      { val: "Daily", lbl: "NCERT targets" },
      { val: "Weekly", lbl: "Test analysis" },
    ],
    metrics: {
      student: { name: "Anjali", klass: "NEET Aspirant", mentor: "Dr. Rohan (AIIMS)", line: "Anjali Nair · NEET Prep", exam: "NEET" },
      growth: {
        label: "Marks growth over 8 weeks", hint: "You vs batch average — out of 720",
        you:   [240, 310, 390, 480, 520, 580, 610, 650],
        batch: [210, 240, 290, 330, 380, 420, 460, 490],
      },
      subjects: [
        { name: "Biology",   Before: 180, After: 340 },
        { name: "Chemistry", Before: 60, After: 150 },
        { name: "Physics",   Before: 40, After: 120 },
      ],
      outcomes: [
        { v: "+410",      l: "Marks gained in 8 weeks", c: "#FF693D" },
        { v: "92%",       l: "Average accuracy",        c: "#22c55e" },
        { v: "650+",      l: "Consistent mock score",   c: "#6366f1" },
        { v: "25 days",   l: "Avg study streak",        c: "#ef4444" },
      ],
      weekHours: [6, 7, 5.5, 8, 7.5, 9, 3],
      goalPct: 91,
      liveTiles: [
        { icon: "clock",    c: "#FF693D", v: "8h 15m",  l: "Today" },
        { icon: "activity", c: "#6366f1", v: "46h",     l: "This week" },
        { icon: "flame",    c: "#ef4444", v: "25 days", l: "Streak" },
        { icon: "check",    c: "#22c55e", v: "22 / 24", l: "Tasks done" },
      ],
      test: {
        week: "Week 6", gain: "+40 marks", trend: [390, 440, 480, 530, 580, 610],
        weak: ["Genetics", "Organic Chemistry", "Optics"],
        fix:  ["NCERT Genetics line-by-line reading (3 hrs)", "Revise Name Reactions", "20 Optics numericals"],
      },
      parent: {
        week: "Week 6",
        issue: "VOL 14 · SUN 12 NOV",
        headline: "Anjali's Biology retention is carrying the score.",
        body: "Biology accuracy held at 92% while the total climbed to 610/720. Next week we put extra focus on Physics numerical speed and timed sectionals.",
        rows: [
          { l: "Study hours",   v: "46 / 40 hrs" },
          { l: "Mock score",    v: "610 / 720" },
          { l: "Rank estimate", v: "~ 4,800" },
          { l: "Weak areas",    v: "Physics numericals" },
          { l: "Mentor note",   v: "Speed drills next week" },
        ],
        remark: "Anjali's biology retention is excellent. Next week we put extra focus on Physics numerical speed.",
      },
    },

    forYou: [
      "You struggle with Physics numericals",
      "You forget Biology NCERT lines constantly",
      "You're stuck at 400-500 marks in mocks",
      "You want a Govt Medical College but feel lost",
      "You study hard but lack a proper revision strategy",
    ],

    howWeGuide: [
      { title: "NCERT Line-by-Line Mastery", desc: "Daily targets focused strictly on NCERT for Biology and Chemistry to guarantee 500+ marks." },
      { title: "Personal Doctor / NEET Mentor", desc: "A real medical student/doctor assigned to you 1-on-1. They know what it takes to clear NEET." },
      { title: "Weekly Test Analysis", desc: "Every mock is dissected — silly mistakes, weak chapters, time management — into an action plan." },
      { title: "Physics Demystification", desc: "Special approach to conquer Physics fear with formula sheets and high-yield numerical practice." },
      { title: "Spaced Repetition Engine", desc: "A structured revision system so you never forget what you studied 3 months ago." },
      { title: "Final Rank Push Strategy", desc: "In the final months we switch to mock tests and exam-temperament training." },
    ],

    journey: [
      { title: "Intake call with your mentor", desc: "A 45-min 1-on-1 call to map your current level and target Govt College." },
      { title: "Personalised study roadmap", desc: "A week-by-week plan built around YOUR syllabus gaps — biology first." },
      { title: "Daily targets via gamified system", desc: "Micro-capsules + streaks keep you moving every single day." },
      { title: "Weekly test analysis", desc: "Tests reviewed with your mentor; mistakes turned into a fix-list." },
      { title: "Physics/Chemistry backlog sprint", desc: "Dedicated sprints to wipe out pending tricky chapters." },
      { title: "Final rank push", desc: "Mock-test marathons, NCERT rapid revision and strategy for NEET." },
    ],

    testimonials: [
      { name: "Kavya Menon",  batch: "2025 Batch", improvement: "380 → 645 marks", quote: "My mentor taught me HOW to read NCERT. That alone changed my entire score." },
      { name: "Arjun Singh",  batch: "2025 Batch", improvement: "Dropper → GMC", quote: "Weekly test analysis helped me identify exactly why my Physics score was stuck." },
      { name: "Neha Sharma",  batch: "Early Batch", improvement: "Class 11 → AIIMS Delhi", quote: "Starting the 2-year plan early gave me the time to master Physics without panicking." },
    ],

    faqs: [
      { q: "I have joined a famous offline coaching. Why need this?", a: "Offline coaching teaches 500 students at once. We tell YOU exactly what to do when you go home. Mentorship fixes retention and consistency." },
      { q: "Is Physics covered properly?", a: "Yes. Physics is the rank decider in NEET. Your mentor will provide specific strategies, formula sheets, and targeted practice for Physics." },
      { q: "I have a huge backlog in Class 11. Can I still clear NEET?", a: "Yes. Your mentor will design a specific backlog-clearing sprint alongside your current syllabus so you catch up." },
      { q: "Can I choose between 2027 and 2028 plans?", a: "Yes. You can select either the NEET 2027 or NEET 2028 plan from the tracks below." },
    ],

    tracks: [
      { plan: "mentor-neet-2027", exam: "NEET 2027", accent: "#22c55e", line: "1-year Doctor mentorship · score push" },
      { plan: "mentor-neet-2028", exam: "NEET 2028", accent: "#0ea5a4", line: "2-year Doctor mentorship · concept-first" },
    ],
  },
};
