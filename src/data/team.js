/* ============================================================
   team.js — CampusPath developer profiles + portfolio data.
   ============================================================ */

const LK = "https://www.linkedin.com/in/ankityadavpm/";
const IG = "https://www.instagram.com/ankits_yadavv?igsh=aTF0NnU5bDJxN2F5&utm_source=qr";
const WA = "https://chat.whatsapp.com/EKezcNXEw9iKRdo7Wrjzzx?mode=gi_t";

export const TEAM = [
  {
    id: "team-head",
    initials: "AK",
    photo: "/assets/team/ankit.webp",
    name: "Ankit Kumar",
    role: "Founder & CEO",
    accent: "#FF693D",
    tagline: "Great engineering isn't about complexity. It's about making hard things feel simple for students.",
    college: "IIT Roorkee",
    location: "IIT Roorkee, Uttarakhand",
    branch: "B.Tech Electrical Engineering",
    jeeRank: "AIR 3846",
    exam: "JEE Advanced",
    email: "collegeparichay@gmail.com",
    bio: `Hi, I'm Ankit Kumar — IIT Roorkee engineer, and the Founder & CEO of Campus Path.
         I don't just build the platform. I am the kind of student it was built for.
        Like thousands of students who use Campus Path today, I once sat staring at rank lists, cutoffs, and counselling rounds — unsure what any of it meant for my future. That experience never left me. It drives every line of code I write.
        At Campus Path, I lead everything technical — from the React frontend and data pipelines to backend APIs and cloud deployment — with one goal in mind: make the technology invisible, so students only see clarity.

        "Great engineering isn't about complexity. It's about making hard things feel simple."

        Because behind every feature we ship is a real student trying to make one of the biggest decisions of their life — and they deserve tools that actually work for them.`,
    skills: ["Tech Head", "Management", "Full Stack Developer", "Node.js", "MongoDB", "Express", "Tailwind CSS", "Python", "REST APIs", "Vite"],
    projects: [
      {
        name: "CampusPath Portal",
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
      { name: "Full-Stack Platform", desc: "React frontend + Node.js backend powering all tools on Campus Path.", tag: "Full-Stack" },
      { name: "College Explorer UI", desc: "Filterable, searchable college directory with detail tabs and comparison.", tag: "UI" },
      { name: "Data Pipelines", desc: "Structured 7 years of JoSAA cutoff data across 800+ colleges.", tag: "Backend" },
    ],
    socials: {
      linkedin: "https://www.linkedin.com/in/ankit-kumar-1b9a64387",
      instagram:"https://www.instagram.com/ankit_1_7_/",
      whatsapp: WA,
      website: "https://collegeparichay.in",
      github:"https://github.com/Ankit-yadav-8/Ankit-7"
    },
  },
  {
    id: "developer-1",
    initials: "MS",
    photo: "/assets/team/mayank.jpg",
    name: "Mayank Singh",
    role: "Co-Founder & Marketing Head",
    accent: "#0EA5A4",
    tagline: "Growth and guidance go hand-in-hand.",
    college: "IIT Roorkee",
    location: "IIT Roorkee, Uttarakhand",
    branch: "B.Tech Mechanical Engineering",
    exam: "JEE Advanced",
    email: "collegeparichay@gmail.com",
    bio: `Hi, I am Mayank Singh. Started my own jee journey from middle of 11th, had backlogs, lost faith, lack of time management, so many ups and downs but it created such a man that could tackle anything. Now at Campus Path, I lead growth and marketing to ensure that every student gets the right guidance and resources.`,
    skills: ["Marketing", "Growth Strategy", "Community Building"],
    projects: [
      {
        name: "CampusPath Portal",
        desc: "End-to-end JEE college discovery platform covering 850+ institutes — IITs, NITs, IIITs, GFTIs and private — with filters, maps and comparisons.",
        tag: "Marketing",
      },
    ],
    socials: {
      linkedin: "#",
      instagram: "#",
      whatsapp: WA,
      website: "https://collegeparichay.in",
    },
  },
  {
    id: "developer-2",
    initials: "SK",
    photo: "/assets/team/saket.jpg",
    name: "Saket Kumar",
    role: "Co-Founder & Operations Head",
    accent: "#7C3AED",
    tagline: "Strategy and execution turn confusion into clarity.",
    college: "IIT Roorkee",
    location: "IIT Roorkee, Uttarakhand",
    branch: "B.Tech",
    exam: "JEE Advanced",
    email: "collegeparichay@gmail.com",
    bio: `Hi, I'm Saket Kumar, a B.Tech student at IIT Roorkee. Despite scoring a very low percentile in JEE Main, I stayed consistent, changed my strategy, and cracked JEE Advanced to earn my place here. As the Operations Head, I ensure the smooth execution of our platform and mentorship programs to help students overcome challenges.`,
    skills: ["Operations", "Strategy", "Execution"],
    projects: [
      {
        name: "CampusPath Portal",
        desc: "End-to-end JEE college discovery platform covering 850+ institutes — IITs, NITs, IIITs, GFTIs and private — with filters, maps and comparisons.",
        tag: "Operations",
      },
    ],
    socials: {
      linkedin: "#",
      instagram: "#",
      whatsapp: WA,
      website: "https://collegeparichay.in",
    },
  },
];

export const TEAM_BY_ID = Object.fromEntries(TEAM.map((t) => [t.id, t]));
