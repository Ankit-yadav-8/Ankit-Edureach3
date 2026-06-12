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
    photo: "/assets/team/ankit2.PNG",
    name: "Ankit Yadav",
    role: "Founder & CEO",
    accent: "#F47B20",
    tagline: "Building products that make engineering admissions simpler.",
    location: "IIT Roorkee, Uttarakhand",
    college: "IIT Roorkee",
    exam: "JEE Advanced",
    email: "hello@collegeparichay.in",
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
    photo: "/assets/team/ankit.png?v=2",
    name: "Ankit Kumar",
    role: "Co-Founder & CTO",
    accent: "#F47B20",
    tagline: "Building performant, reliable tools that students can trust.",
    college: "IIT Roorkee",
    location: "IIT Roorkee, Uttarakhand",
     branch: "B.Tech Electrical Engineering",
    jeeRank: "AIR 3846",
    exam: "JEE Advanced",
    email: "hello@collegeparichay.in",
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
  {
    id: "operations-head",
    initials: "KG",
    photo: "/assets/team/K.Gopal.jpeg",
    name: "K. Gopal",
    role: "COO & Operations Head",
    accent: "#F47B20",
    tagline: "Keeping the platform running smoothly so students always come first.",
    college: "IIT Roorkee",
    location: "IIT Roorkee, Uttarakhand",
    exam: "JEE Advanced",
    email: "hello@collegeparichay.in",
    bio: `Hi, I'm K. Gopal, Operations Head at College Parichay and an IIT Roorkee student. I oversee all operational aspects of the platform — ensuring seamless day-to-day functioning, team coordination, and execution across departments. Like every student who has used this platform, I experienced firsthand how overwhelming the college admission process can be. Being part of College Parichay is my way of channelling that experience into something that truly matters. One mission: helping every student make confident, data-driven decisions.`,
    skills: ["Operations", "Team Coordination", "Execution", "Strategy", "Communication", "Management"],
    projects: [
      { name: "Operations & Coordination", desc: "Day-to-day functioning of the platform and smooth coordination across the team.", tag: "Operations" },
      { name: "Cross-Department Execution", desc: "Aligning product, content and outreach so initiatives ship on time.", tag: "Execution" },
      { name: "Student Support", desc: "Ensuring students get timely, reliable help through every counselling season.", tag: "Support" },
    ],
    socials: {
      instagram: "https://www.instagram.com/_mr_gopal.___0?utm_source=qr&igsh=M3V5eXRzcGExeTR2",
      whatsapp: WA,
      website: "https://collegeparichay.in",
    },
  },
];

export const TEAM_BY_ID = Object.fromEntries(TEAM.map((t) => [t.id, t]));
