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
   JEE/NEET 2027 → ₹1999 · JEE/NEET 2028 → ₹3999 · Foundation → ₹2999 */
export const MENTOR_PLANS = {
  "mentor-jee-2027":  { amount: 1999, old: 7999, drops: [7999, 3999, 1999], exam: "JEE",        year: 2027 },
  "mentor-neet-2027": { amount: 1999, old: 7999, drops: [7999, 3999, 1999], exam: "NEET",       year: 2027 },
  "mentor-jee-2028":  { amount: 3999, old: 7999, drops: [7999, 3999],       exam: "JEE",        year: 2028 },
  "mentor-neet-2028": { amount: 3999, old: 7999, drops: [7999, 3999],       exam: "NEET",       year: 2028 },
  "mentor-foundation":{ amount: 2999, old: 5999, drops: [5999, 2999],       exam: "Foundation", year: null },
};

/* ── Quick summary used by navbar + hero card ───────────────────── */
export const MENTOR_LINKS = [
  { slug: "jee-2027",   label: "JEE & NEET 2027", to: "/mentorship/jee-2027",   price: 1999, tag: "Class 12 / Droppers" },
  { slug: "jee-2028",   label: "JEE & NEET 2028", to: "/mentorship/jee-2028",   price: 3999, tag: "Class 11 · 2-Year Plan" },
  { slug: "foundation", label: "Foundation 9–10", to: "/mentorship/foundation", price: 2999, tag: "Class 9 & 10" },
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
      { plan: "mentor-jee-2027",  exam: "JEE 2027",  accent: "#f5a623", line: "IITian mentors · backlog + rank push" },
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
      { plan: "mentor-jee-2028",  exam: "JEE 2028",  accent: "#f5a623", line: "2-year IITian mentorship · concept-first" },
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
