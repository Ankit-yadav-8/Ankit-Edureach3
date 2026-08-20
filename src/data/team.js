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
    photo: "/assets/team/ankit2.webp",
    name: "Ankit Yadav",
    role: "Co-Founder",
    accent: "#FF693D",
    tagline: "Students need clarity, not confusion. Building products to make college guidance accessible for everyone.",
    location: "IIT Roorkee, Uttarakhand",
    college: "IIT Roorkee",
    exam: "JEE Advanced",
    email: "collegeparichay@gmail.com",
    phone: "8118826194",
    bio: `Hi, I'm Ankit Yadav, an IIT Roorkee graduate and the co-founder of College Parichay — a platform built to make college guidance simpler, clearer, and more accessible for students across India. During my own journey, I saw how confusing the college and career decision process can be for students. That experience inspired me to create College Parichay with one simple belief: "Students need clarity, not confusion." Through authentic insights, relatable experiences, and a community-driven approach, we aim to help students make informed decisions with confidence.`,
    skills: [
      "Product Strategy", "React", "Node.js", "MongoDB", "Express",
      "System Design", "Data Modelling", "Vite", "REST APIs", "UX Design",
    ],
    projects: [
      {
        name: "Collegeparichay Portal",
        desc: "End-to-end JEE college discovery platform covering 850+ institutes — IITs, NITs, IIITs, GFTIs and private — with filters, maps and comparisons.",
        tag: "Co-Founder",
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
    photo: "/assets/team/ankit.webp",
    name: "Ankit Kumar",
    role: "Co-Founder & CTO",
    accent: "#FF693D",
    tagline: "Great engineering isn't about complexity. It's about making hard things feel simple for students.",
    college: "IIT Roorkee",
    location: "IIT Roorkee, Uttarakhand",
     branch: "B.Tech Electrical Engineering",
    jeeRank: "AIR 3846",
    exam: "JEE Advanced",
    email: "collegeparichay@gmail.com",
    bio: `Hi, I'm Ankit Kumar — IIT Roorkee engineer, and the Co-Founder & CTO of College Parichay.
         I don't just build the platform. I am the kind of student it was built for.
        Like thousands of students who use College Parichay today, I once sat staring at rank lists, cutoffs, and counselling rounds — unsure what any of it meant for my future. That experience never left me. It drives every line of code I write.
        At College Parichay, I lead everything technical — from the React frontend and data pipelines to backend APIs and cloud deployment — with one goal in mind: make the technology invisible, so students only see clarity.

        "Great engineering isn't about complexity. It's about making hard things feel simple."

        Because behind every feature we ship is a real student trying to make one of the biggest decisions of their life — and they deserve tools that actually work for them.`,
    skills: ["Tech Head ", "Management","Full Stack Developer","Node.js", "MongoDB", "Express", "Tailwind CSS", "Python", "REST APIs", "Vite"],
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

      { name: "Full-Stack Platform", desc: "React frontend + Node.js backend powering all tools on College Parichay.", tag: "Full-Stack" },
      { name: "College Explorer UI", desc: "Filterable, searchable college directory with detail tabs and comparison.", tag: "UI" },
      { name: "Data Pipelines", desc: "Structured 7 years of JoSAA cutoff data across 800+ colleges.", tag: "Backend" },
    ],
    socials: {
      linkedin: "https://www.linkedin.com/in/ankit-kumar-1b9a64387?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      instagram:"https://www.instagram.com/ankit_1_7_/",
      whatsapp: WA,
      website: "https://collegeparichay.in",
      github:"https://github.com/Ankit-yadav-8/Ankit-7"
    },
  },
];

export const TEAM_BY_ID = Object.fromEntries(TEAM.map((t) => [t.id, t]));
