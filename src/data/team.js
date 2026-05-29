/* ============================================================
   team.js — Collegeparichay developer profiles + portfolio data.
   ============================================================ */

const LK = "https://www.linkedin.com/in/ankityadavpm/";
const IG = "https://www.instagram.com/ankits_yadavv?igsh=aTF0NnU5bDJxN2F5&utm_source=qr";
const WA = "https://chat.whatsapp.com/EKezcNXEw9iKRdo7Wrjzzx?mode=gi_t";

export const TEAM = [
  {
    id: "team-head",
    initials: "AY",
    photo: "/assets/team/ankit2.png",
    name: "Ankit Yadav",
    role: "Founder & CEO",
    accent: "#F47B20",
    tagline: "Building products that make engineering admissions simpler.",
    location: "IIT Roorkee, Uttarakhand",
    college: "IIT Roorkee",
    branch: "B.Tech Electrical Engineering",
    jeeRank: "AIR 4846",
    exam: "JEE Advanced",
    email: "collegeparichay@gmail.com",
    phone: "8118826194",
    bio: `Hi, I'm Ankit Yadav, an IIT Roorkee graduate and the founder of College Parichay — a platform built to make college guidance simpler, clearer, and more accessible for students across India. During my own journey, I saw how confusing the college and career decision process can be for students. That experience inspired me to create College Parichay with one simple belief: "Students need clarity, not confusion." Through authentic insights, relatable experiences, and a community-driven approach, we aim to help students make informed decisions with confidence.`,
    skills: [
      "Product Strategy", "React", "Node.js", "MongoDB", "Express",
      "System Design", "Data Modelling", "Vite", "REST APIs", "UX Design",
    ],
    projects: [
      {
        name: "Collegeparichay Portal",
        desc: "End-to-end JEE college discovery platform covering 850+ institutes — IITs, NITs, IIITs, GFTIs and private — with filters, maps and comparisons.",
        tag: "Founder",
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
      linkedin: LK,
      instagram: IG,
      whatsapp: WA,
      website: "https://collegeparichay.in",
    },
  },
  {
    id: "developer-1",
    initials: "AK",
    photo: "/assets/team/ankit.jpeg",
    name: "Ankit Kumar",
    role: "Co-Founder & CTO",
    accent: "#F47B20",
    tagline: "Building performant, reliable tools that students can trust.",
    location: "IIT Roorkee, Uttarakhand",
    email: "collegeparichay@gmail.com",
    bio: `Hi, I'm Ankit Kumar, Co-Founder & CTO of College Parichay and an IIT Roorkee engineer. I lead all technical development on the platform — from the React frontend and data pipelines to backend APIs and deployment. Like every student who has used this platform, I experienced firsthand how overwhelming the college admission process can be. Building College Parichay is my way of putting engineering skills to work for something that truly matters. One mission: helping every student make confident, data-driven decisions.`,
    skills: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS", "Python", "REST APIs", "Vite"],
    projects: [
      { name: "Full-Stack Platform", desc: "React frontend + Node.js backend powering all tools on College Parichay.", tag: "Full-Stack" },
      { name: "College Explorer UI", desc: "Filterable, searchable college directory with detail tabs and comparison.", tag: "UI" },
      { name: "Data Pipelines", desc: "Structured 7 years of JoSAA cutoff data across 800+ colleges.", tag: "Backend" },
    ],
    socials: {
      linkedin: LK,
      instagram: IG,
      whatsapp: WA,
      website: "https://collegeparichay.in",
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
    email: "collegeparichay@gmail.com",
    bio: "Builds and maintains the college, exam and cutoff datasets and the search index. Focused on data quality, ranking algorithms and making search feel instant.",
    skills: ["JavaScript", "Data Pipelines", "Search/Ranking", "Python", "APIs", "Algorithms"],
    projects: [
      { name: "Smart Search", desc: "Natural-language, on-device search across all colleges & exams.", tag: "Search" },
      { name: "College Dataset", desc: "Structured profiles for all IITs, NITs & IIITs.", tag: "Data" },
      { name: "College Predictor", desc: "Rank → eligible-college matching engine.", tag: "Backend" },
    ],
    socials: {
      linkedin: LK,
      instagram: IG,
      website: "https://collegeparichay.in",
    },
  },
  {
    id: "founder",
    initials: "FO",
    name: "Founder",
    role: "Co-Founder",
    accent: "#F4A261",
    tagline: "Building the platform every JEE aspirant deserves.",
    location: "India",
    email: "collegeparichay@gmail.com",
    bio: "Shaped Collegeparichay's vision and identity — from the product strategy and user experience to the brand's voice and positioning. Believes a well-designed product quietly removes friction for students navigating one of the toughest admission systems in the world.",
    skills: ["Product Strategy", "Figma", "Design Systems", "Branding", "User Research", "Prototyping"],
    projects: [
      { name: "Collegeparichay Brand", desc: "Logo, palette and typography system.", tag: "Branding" },
      { name: "Product Vision", desc: "Roadmap, feature prioritisation and student-first UX decisions.", tag: "Strategy" },
      { name: "User Flows", desc: "Predictor and discovery journeys.", tag: "UX" },
    ],
    socials: {
      linkedin: LK,
      instagram: IG,
      website: "https://collegeparichay.in",
    },
  },
];

export const TEAM_BY_ID = Object.fromEntries(TEAM.map((t) => [t.id, t]));
