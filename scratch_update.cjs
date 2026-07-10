const fs = require('fs');
let code = fs.readFileSync('src/data/mentorship.js', 'utf8');

// Add foundation to MENTOR_LINKS
code = code.replace(
  '{ slug: "neet",     label: "NEET",     to: "/mentorship/neet",     price: 2499, tag: "Medical Aspirants" },',
  '{ slug: "neet",     label: "NEET",     to: "/mentorship/neet",     price: 2499, tag: "Medical Aspirants" },\n  { slug: "foundation", label: "Foundation", to: "/mentorship/foundation", price: 2499, tag: "Class 9 & 10" },'
);

// We need to add the foundation config to MENTORSHIP
const foundationConfig = `
  /* ─────────────────────────── Foundation ─────────────────── */
  "foundation": {
    slug: "foundation",
    eyebrow: "Foundation Mentorship",
    tagline: "Start Right. Build Deep.",
    badge: "🚀 Class 9 & 10 Aspirants",
    title: ["Start Early.", "Stay Ahead.", ""],
    subtitle: "CollegeParichay Foundation program builds deep concepts and logical reasoning for Class 9 and 10 students. No burnout, just a rock-solid base for future competitive exams.",
    videoNote: "Watch how early preparation changes the game",
    heroImage: "/images/jee_2028_hero.png",
    analyticsImage: "/images/jee_2028_analytics.png",
    roadmapImage: "/images/jee_2028_roadmap.png",
    stats: [
      { val: "Pre-JEE", lbl: "Foundation focus" },
      { val: "1-on-1", lbl: "Personal mentor" },
      { val: "Weekly", lbl: "Checkpoints" },
      { val: "No burnout", lbl: "Paced learning" },
    ],
    metrics: {
      student: { name: "Rahul", klass: "Class 10", mentor: "Vikram (IIT KGP)", line: "Rahul · Class 10", exam: "Foundation" },
      growth: {
        label: "Concept mastery over 8 weeks", hint: "You vs batch average",
        you:   [40, 48, 55, 62, 70, 78, 85, 90],
        batch: [35, 40, 45, 50, 55, 60, 65, 70],
      },
      subjects: [
        { name: "Science",   Before: 45, After: 85 },
        { name: "Maths",     Before: 50, After: 90 },
        { name: "MAT",       Before: 30, After: 75 },
      ],
      outcomes: [
        { v: "+40%",    l: "Concept mastery gain", c: "#FF693D" },
        { v: "88%",     l: "Average accuracy",     c: "#22c55e" },
        { v: "Strong",  l: "Olympiad readiness",   c: "#6366f1" },
        { v: "15 days", l: "Avg study streak",     c: "#ef4444" },
      ],
      weekHours: [2, 3, 2.5, 3.5, 2, 4, 1.5],
      goalPct: 80,
      liveTiles: [
        { icon: "clock",    c: "#FF693D", v: "2h 15m",  l: "Today" },
        { icon: "activity", c: "#6366f1", v: "15h",     l: "This week" },
        { icon: "flame",    c: "#ef4444", v: "15 days", l: "Streak" },
        { icon: "check",    c: "#22c55e", v: "10 / 12", l: "Tasks done" },
      ],
      test: {
        week: "Week 6", gain: "+25 marks", trend: [40, 48, 52, 60, 68, 75],
        weak: ["Geometry", "Light", "Number Systems"],
        fix:  ["Revise Geometry proofs", "Daily 5 Light numericals"],
      },
      parent: {
        week: "Week 6",
        issue: "VOL 12 · SUN 12 NOV",
        headline: "Rahul is developing strong logical reasoning.",
        body: "Rahul has significantly improved his geometry problem-solving speed. We are slowly integrating higher-order thinking skills (HOTS).",
        rows: [
          { l: "Study hours",     v: "15 / 14 hrs" },
          { l: "Concept mastery", v: "85%" },
          { l: "Checkpoints",     v: "Done" },
          { l: "Weak areas",      v: "Light" },
          { l: "Mentor note",     v: "Great focus" },
        ],
        remark: "Rahul is doing well. Next week we focus on Light.",
      },
    },
    forYou: [
      "You're unsure when to start JEE/NEET prep",
      "School exams clash with competitive prep",
      "You lack clarity on career options",
      "Your basics aren't strong enough",
      "You want to crack NTSE or Olympiads",
    ],
    qualifierHurdles: [
      { title: "You're unsure when to start JEE/NEET prep", desc: "Starting too early causes burnout, starting too late adds pressure. We'll find the perfect pace for Class 9/10." },
      { title: "School exams clash with competitive prep", desc: "Balancing board exams and Olympiads/foundation is tough. We'll create a schedule that manages both." },
      { title: "You lack clarity on career options", desc: "Engineering or Medical? We'll help you explore your interests and make an informed decision early on." },
      { title: "Your basics aren't strong enough", desc: "Advanced concepts require a solid foundation. We focus on building deep conceptual clarity from the ground up." },
      { title: "You want to crack NTSE or Olympiads", desc: "These exams require a different approach than school tests. Our experts will guide you through the specific patterns." }
    ],
    qualifierMentors: [
      {
        name: "Ankit Yadav",
        role: "Founder, IIT Roorkee",
        img: "/assets/team/ankit2.PNG",
        thought: "Starting early is an advantage only if the direction is right. For Foundation students, we focus on building a resilient mindset and an unbreakable conceptual base that makes clearing future competitive exams a natural outcome."
      },
      {
        name: "Ankit Kumar",
        role: "Co-Founder, IIT Roorkee",
        img: "/assets/team/ankit.png?v=2",
        thought: "We don't want Class 9 and 10 students to burn out. Our Foundation mentorship is designed to spark curiosity, build logical reasoning, and slowly ramp up the intensity without compromising their school life."
      }
    ],
    howWeGuide: [
      { tag: "FOUNDATION", title: "Concept-First Capsules", desc: "Daily capsules that build deep understanding from the ground up.",
        tasks: ["Concepts built from first principles", "Mapped to Class 9 & 10", "No rote learning"],
        chips: ["Concept-first", "Daily capsules"] },
      { tag: "BALANCE", title: "School + Olympiad Prep", desc: "We manage both school boards and competitive exams smoothly.",
        tasks: ["Balanced timetable", "Board-focused revision", "Olympiad HOTS"],
        chips: ["Timetable", "HOTS"] },
    ],
    journey: [
      { title: "Intake call with your mentor", desc: "A 45-min call to map your current level and interests." },
      { title: "Personalised study roadmap", desc: "A plan that balances school and foundation without stress." },
      { title: "Daily targets via gamified system", desc: "Micro-capsules + streaks keep you moving." },
      { title: "Weekly test analysis", desc: "Review tests with your mentor." },
    ],
    testimonials: [
      { name: "Rahul S.",  batch: "Foundation", improvement: "NTSE Stage 1 Cleared", quote: "Mentorship helped me balance school and NTSE perfectly." },
    ],
    faqs: [
      { q: "Is Class 9 too early?", a: "It's the perfect time to build concepts without the pressure of boards." },
    ],
    tracks: [
      { plan: "mentor-foundation",  exam: "Foundation",  accent: "#FF693D", line: "IITian mentors · Class 9 & 10" },
    ],
  },
`;

code = code.replace(/};\s*$/, foundationConfig + '\n};\n');

// Also add qualifierHurdles and qualifierMentors to jee-2027
const jee2027Hurdles = `qualifierHurdles: [
      { title: "You have backlogs and no idea where to start", desc: "The pile of untouched chapters is growing every week. We'll give you a structured recovery plan to catch up without burning out." },
      { title: "You go to coaching but your retention is zero", desc: "You understand concepts in class, but blank out during tests. Our active recall strategies ensure knowledge actually sticks." },
      { title: "You're consistent for 2 days then disappear for 10", desc: "Motivation comes in bursts, but discipline is missing. We build an accountability system that keeps you on track daily." },
      { title: "You want IIT but fear you're not smart enough", desc: "Self-doubt creeps in when you see toppers solving questions faster. We show you how consistent smart work beats raw talent." },
      { title: "You study hard but your test scores never move", desc: "You're putting in 10-hour days but still scoring the same. We analyze your test attempts to fix the hidden gaps in your strategy." }
    ],
    qualifierMentors: [
      {
        name: "Ankit Yadav",
        role: "Founder, IIT Roorkee",
        img: "/assets/team/ankit2.PNG",
        thought: "Mentorship isn't about giving you more material; it's about giving you the exact right direction so your hard work actually translates into rank. We've built this system from our own experiences of cracking IIT, focusing purely on high-yield output rather than just mindless hard work."
      },
      {
        name: "Ankit Kumar",
        role: "Co-Founder, IIT Roorkee (AIR 3846 CRL, 938 OBC)",
        img: "/assets/team/ankit.png?v=2",
        thought: "Every aspirant hits a wall where effort stops working. Our goal is to break that wall by showing you the strategic blindspots you can't see yourself. Having navigated this journey to secure AIR 3846, I know exactly where students lose their confidence and how to rebuild it."
      }
    ],`;

code = code.replace("forYou: [\n      \"You have backlogs", jee2027Hurdles + '\n    forYou: [\n      "You have backlogs');

// Add qualifierHurdles and qualifierMentors to jee-2028
const jee2028Hurdles = `qualifierHurdles: [
      { title: "You want to start early but lack a plan", desc: "Starting in Class 11 is great, but only if you have a structured 2-year roadmap to follow." },
      { title: "You want deep concepts, not just formulas", desc: "JEE Advanced requires first-principles thinking. We ensure you truly understand the concepts, not just memorize them." },
      { title: "You're afraid of wasting Class 11", desc: "Most students waste their first year and become droppers. We install habits early so you stay on track." },
      { title: "You don't know how to balance school and JEE", desc: "We provide a balanced timetable so your school grades don't suffer while you prepare for IIT." },
      { title: "You need a mentor to guide you throughout", desc: "Having the same IITian mentor for two full years means they know your strengths and weaknesses inside out." }
    ],
    qualifierMentors: [
      {
        name: "Ankit Yadav",
        role: "Founder, IIT Roorkee",
        img: "/assets/team/ankit2.PNG",
        thought: "A 2-year head start is your biggest unfair advantage, provided you don't waste it. We built this mentorship to ensure Class 11 students build deep concepts early, avoiding the panic most aspirants face in Class 12."
      },
      {
        name: "Ankit Kumar",
        role: "Co-Founder, IIT Roorkee",
        img: "/assets/team/ankit.png?v=2",
        thought: "We don't want you to become a dropper. By starting early and having a mentor guide you every step of the way, you can secure your IIT seat without the unnecessary stress."
      }
    ],`;

code = code.replace("forYou: [\n      \"You're in Class 11", jee2028Hurdles + '\n    forYou: [\n      "You\'re in Class 11');

// Add qualifierHurdles and qualifierMentors to neet
const neetHurdles = `qualifierHurdles: [
      { title: "Biology takes up all your time", desc: "You're memorizing NCERT but neglecting Physics and Chemistry. We'll help you balance all three subjects perfectly." },
      { title: "Physics numericals feel impossible", desc: "You know the formulas but can't apply them. Our mentors will teach you the exact approach to tackle NEET Physics." },
      { title: "You're stuck at 400-500 marks", desc: "You've hit a plateau and can't seem to push past it. We'll identify your weak areas and give you a targeted improvement plan." },
      { title: "Mock tests give you severe anxiety", desc: "You panic during tests and make silly mistakes. We'll build your temperament to perform under pressure." },
      { title: "You're confused about revision strategy", desc: "With so much syllabus, revising feels overwhelming. We provide an optimized spaced repetition schedule." }
    ],
    qualifierMentors: [
      {
        name: "Ankit Yadav",
        role: "Founder, IIT Roorkee",
        img: "/assets/team/ankit2.PNG",
        thought: "In NEET, knowing the answer isn't enough; speed and accuracy are everything. Our mentorship ensures you don't just read NCERT, but you master the art of applying it flawlessly under time pressure."
      },
      {
        name: "Ankit Kumar",
        role: "Co-Founder, IIT Roorkee",
        img: "/assets/team/ankit.png?v=2",
        thought: "Medical aspirants often get trapped in reading endless theory. We shift your focus to active recall, pattern recognition, and strict accountability, which are the true differentiators for a top medical college seat."
      }
    ],`;

code = code.replace(/forYou: \[\s*"Your biology is strong/g, neetHurdles + '\n    forYou: [\n      "Your biology is strong');

fs.writeFileSync('src/data/mentorship.js', code);
