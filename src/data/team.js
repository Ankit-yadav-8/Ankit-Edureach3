/* ============================================================
   team.js — Collegeparichay developer profiles + DEMO portfolio data.
   👉 Replace names, bios, skills, projects and links with the
      real team's details. Each person gets an in-app portfolio
      page at /team/:id (see pages/Developer.jsx).
   ============================================================ */

export const TEAM = [
  {
    id: "team-head",
    initials: "AY",
    photo: "/assets/team/ankit.jpeg",   // 👈 place the image at public/assets/team/ankit.jpeg
    name: "Ankit Yadav",
    role: "Project Lead & Full-Stack Developer",
    accent: "#F97316",
    tagline: "Building products that make engineering admissions simpler.",
    location: "IIT Roorkee, Uttarakhand",
    college: "IIT Roorkee",
    branch: "B.Tech Electrical Engineering",
    jeeRank: "AIR 4846",
    exam: "JEE Advanced",
    email: "ankityadav08022008@gmail.com",
    phone: "8118826194",
    bio: `Ankit Yadav is a B.Tech Electrical Engineering student at IIT Roorkee — one of India's
most prestigious technical institutes — who secured AIR 4846 in JEE Advanced. Having
personally lived through the gruelling JEE preparation cycle and the uncertainty of JoSAA
counselling rounds, he understood firsthand how scattered and stressful the whole process
feels for most students. That frustration became the seed of Collegeparichay. Ankit leads the
full-stack development of the platform, handling everything from the React frontend and
component architecture to backend APIs, database modelling, and deployment pipelines.
Every feature — the rank predictor, college explorer, cutoff engine, counselling planner —
is built with one goal: give every JEE aspirant the clarity and confidence that data
can provide. Beyond code, Ankit actively mentors junior aspirants, sharing the real
strategies that helped him crack one of the toughest exams in the country. When he isn't
shipping new features, you'll find him deep in competitive programming or mapping out the
next big tool for the Collegeparichay roadmap.`,
    skills: [
      "React", "Node.js", "MongoDB", "Express",
      "Tailwind CSS", "Python", "System Design",
      "Data Modelling", "Vite", "REST APIs",
    ],
    projects: [
      {
        name: "Collegeparichay Portal",
        desc: "End-to-end JEE college discovery platform covering 850+ institutes — IITs, NITs, IIITs, GFTIs and private — with filters, maps and comparisons.",
        tag: "Lead",
      },
      {
        name: "JEE Rank Predictor",
        desc: "ML-backed predictor using 8+ years of JoSAA cutoff data to forecast college and branch chances from raw marks or percentile.",
        tag: "Algorithm",
      },
      {
        name: "JoSAA Counselling Planner 2026",
        desc: "Step-by-step counselling guide with choice-filling strategy, lock/float decisions, document checklist and round timelines.",
        tag: "Counselling",
      },
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://www.linkedin.com/in/ankit-kumar-1b9a64387",
      website: "https://collegeparichay.in",
    },
  },
  {
    id: "developer-1",
    initials: "D1",
    name: "Developer 1",
    role: "Frontend Developer",
    accent: "#2EC4B6",
    tagline: "I craft fast, accessible, delightful interfaces.",
    location: "India",
    email: "frontend@collegeparichay.in",
    bio: "Owns the Collegeparichay front-end — the component system, animations, charts and responsive layouts. Loves design systems and pixel-perfect, smooth interactions.",
    skills: ["React", "Framer Motion", "Recharts", "CSS", "Accessibility", "Figma"],
    projects: [
      { name: "Component Library", desc: "Reusable cards, charts and predictors used across the site.", tag: "Frontend" },
      { name: "College Explorer UI", desc: "Filterable, searchable college directory with detail tabs.", tag: "UI" },
      { name: "Animations", desc: "Scroll reveals, particle hero and micro-interactions.", tag: "Motion" },
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://www.linkedin.com/in/ankit-kumar-1b9a64387",
      website: "https://your-portfolio-link.com",
    },
  },
  {
    id: "developer-2",
    initials: "D2",
    name: "Developer 2",
    role: "Data & Backend Developer",
    accent: "#0EA5A4",
    tagline: "Turning raw admission data into structured insight.",
    location: "India",
    email: "data@collegeparichay.in",
    bio: "Builds and maintains the college, exam and cutoff datasets and the search index. Focused on data quality, ranking algorithms and making search feel instant.",
    skills: ["JavaScript", "Data Pipelines", "Search/Ranking", "Python", "APIs", "Algorithms"],
    projects: [
      { name: "Smart Search", desc: "Natural-language, on-device search across all colleges & exams.", tag: "Search" },
      { name: "College Dataset", desc: "Structured profiles for all IITs, NITs & IIITs.", tag: "Data" },
      { name: "College Predictor", desc: "Rank → eligible-college matching engine.", tag: "Backend" },
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://www.linkedin.com",
      website: "https://your-portfolio-link.com",
    },
  },
  {
    id: "designer",
    initials: "DS",
    name: "Designer",
    role: "UI/UX Designer",
    accent: "#F4A261",
    tagline: "Designing calm, confident experiences for stressed students.",
    location: "India",
    email: "design@collegeparichay.in",
    bio: "Shaped Collegeparichay's visual identity — colour system, typography, iconography and the overall feel. Believes good design quietly removes friction.",
    skills: ["Figma", "Design Systems", "Branding", "Prototyping", "Illustration", "User Research"],
    projects: [
      { name: "Collegeparichay Brand", desc: "Logo, palette and typography system.", tag: "Branding" },
      { name: "Design System", desc: "Tokens, components and layout grid.", tag: "System" },
      { name: "User Flows", desc: "Predictor and discovery journeys.", tag: "UX" },
    ],
    socials: {
      dribbble: "https://dribbble.com",
      linkedin: "https://www.linkedin.com",
      website: "https://your-portfolio-link.com",
    },
  },
];

export const TEAM_BY_ID = Object.fromEntries(TEAM.map((t) => [t.id, t]));