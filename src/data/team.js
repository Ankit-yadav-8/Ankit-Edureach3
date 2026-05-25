/* ============================================================
   team.js — EduReach developer profiles + DEMO portfolio data.
   👉 Replace names, bios, skills, projects and links with the
      real team's details. Each person gets an in-app portfolio
      page at /team/:id (see pages/Developer.jsx).
   ============================================================ */

export const TEAM = [
  {
    id: "team-head",
    initials: "TH",
    name: "Team Head",
    role: "Project Lead & Full-Stack Developer",
    accent: "#F97316",
    tagline: "Building products that make engineering admissions simpler.",
    location: "India",
    email: "lead@edureachportal.in",
    bio: "Led the architecture and delivery of EduReach — from the rank/college predictors to the data layer. Passionate about clean UX, performance and turning messy admission data into something students can actually use.",
    skills: ["React", "Node.js", "System Design", "UI/UX", "Data Modelling", "Vite"],
    projects: [
      { name: "EduReach Portal", desc: "JEE & college discovery platform with predictors and smart search.", tag: "Lead" },
      { name: "Cutoff Engine", desc: "Round-wise JoSAA/CSAB cutoff modelling library.", tag: "Architecture" },
      { name: "Rank Predictor", desc: "Marks → rank/percentile estimation model.", tag: "Algorithm" },
    ],
    socials: { github: "https://github.com", linkedin: "https://www.linkedin.com", website: "https://your-portfolio-link.com" },
  },
  {
    id: "developer-1",
    initials: "D1",
    name: "Developer 1",
    role: "Frontend Developer",
    accent: "#2EC4B6",
    tagline: "I craft fast, accessible, delightful interfaces.",
    location: "India",
    email: "frontend@edureachportal.in",
    bio: "Owns the EduReach front-end — the component system, animations, charts and responsive layouts. Loves design systems and pixel-perfect, smooth interactions.",
    skills: ["React", "Framer Motion", "Recharts", "CSS", "Accessibility", "Figma"],
    projects: [
      { name: "Component Library", desc: "Reusable cards, charts and predictors used across the site.", tag: "Frontend" },
      { name: "College Explorer UI", desc: "Filterable, searchable college directory with detail tabs.", tag: "UI" },
      { name: "Animations", desc: "Scroll reveals, particle hero and micro-interactions.", tag: "Motion" },
    ],
    socials: { github: "https://github.com", linkedin: "https://www.linkedin.com", website: "https://your-portfolio-link.com" },
  },
  {
    id: "developer-2",
    initials: "D2",
    name: "Developer 2",
    role: "Data & Backend Developer",
    accent: "#0EA5A4",
    tagline: "Turning raw admission data into structured insight.",
    location: "India",
    email: "data@edureachportal.in",
    bio: "Builds and maintains the college, exam and cutoff datasets and the search index. Focused on data quality, ranking algorithms and making search feel instant.",
    skills: ["JavaScript", "Data Pipelines", "Search/Ranking", "Python", "APIs", "Algorithms"],
    projects: [
      { name: "Smart Search", desc: "Natural-language, on-device search across all colleges & exams.", tag: "Search" },
      { name: "College Dataset", desc: "Structured profiles for all IITs, NITs & IIITs.", tag: "Data" },
      { name: "College Predictor", desc: "Rank → eligible-college matching engine.", tag: "Backend" },
    ],
    socials: { github: "https://github.com", linkedin: "https://www.linkedin.com", website: "https://your-portfolio-link.com" },
  },
  {
    id: "designer",
    initials: "DS",
    name: "Designer",
    role: "UI/UX Designer",
    accent: "#F4A261",
    tagline: "Designing calm, confident experiences for stressed students.",
    location: "India",
    email: "design@edureachportal.in",
    bio: "Shaped EduReach's visual identity — colour system, typography, iconography and the overall feel. Believes good design quietly removes friction.",
    skills: ["Figma", "Design Systems", "Branding", "Prototyping", "Illustration", "User Research"],
    projects: [
      { name: "EduReach Brand", desc: "Logo, palette and typography system.", tag: "Branding" },
      { name: "Design System", desc: "Tokens, components and layout grid.", tag: "System" },
      { name: "User Flows", desc: "Predictor and discovery journeys.", tag: "UX" },
    ],
    socials: { dribbble: "https://dribbble.com", linkedin: "https://www.linkedin.com", website: "https://your-portfolio-link.com" },
  },
];

export const TEAM_BY_ID = Object.fromEntries(TEAM.map((t) => [t.id, t]));
