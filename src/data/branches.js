/* branches.js — engineering branch families ("paths") for the Branch Explorer.
   Each family powers a catalog card + a full /branches/:slug detail page with
   Academics, Advanced Insights (gauge + 5-year salary arc), Colleges & Branches
   and Common Myths tabs. Numbers are indicative India-market estimates, not
   official figures. Icon names map to lucide-react in the UI layer. */

export const BRANCHES = [
  {
    slug: "cs-it",
    name: "CS & IT",
    icon: "Monitor",
    color: "#3A86FF",
    desc: "The study of computational systems, discrete mathematics, and software design.",
    tags: ["Coding-dominated", "Math-heavy", "Full Tech Access"],
    branchCount: 32,
    stats: { jobGrowth: "Most Placements", medianSalary: "₹18 LPA", aiRisk: 65 },
    aiRiskLabel: "MODERATE RISK",
    academics: {
      summary:
        "A CSE degree is roughly 25% coding — the rest is computer theory, discrete mathematics, operating systems, networks and algorithms. You learn how machines think, not just how to write apps.",
      coreSubjects: ["Data Structures & Algorithms", "Operating Systems", "DBMS", "Computer Networks", "Theory of Computation", "Discrete Mathematics"],
      outcomes: ["Software Engineer", "Backend / Full-stack Dev", "Data Engineer", "Product Engineer", "Research / Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 20, selfLearning: 80 },
      tierMatters: 45,
      research: [{ label: "Academic Pubs", value: 95 }, { label: "Industry R&D", value: 80 }, { label: "Lab Funding", value: 70 }],
      researchNote:
        "Active ecosystem with top industrial labs like Microsoft Research India and Google Research India. Government funding is driven by MeitY initiatives (IndiaAI Mission) and DST-SERB grants.",
      salaryArc: {
        median: { entry: 18, y3: 26, y5: 36 },
        top:    { entry: 42, y3: 60, y5: 80 },
      },
    },
    branchesList: ["Computer Science & Engineering", "Information Technology", "CSE (Cyber Security)", "CSE (AI/ML)", "Software Engineering"],
    colleges: [
      { name: "IIT Bombay", tag: "NIRF #3", chance: "high" },
      { name: "IIT Delhi", tag: "NIRF #2", chance: "high" },
      { name: "IIIT Hyderabad", tag: "Top IIIT", chance: "medium" },
      { name: "NIT Trichy", tag: "NIRF #9", chance: "high" },
    ],
    myths: [
      { myth: "CS is all about writing code.", reality: "Coding is only ~25% of the degree; the rest is computer theory, discrete mathematics, and algorithms." },
      { myth: "You need to be a coding genius beforehand.", reality: "Most IITians start coding from scratch in their first year; the curriculum assumes no prior programming knowledge." },
      { myth: "Only top-tier colleges get placements.", reality: "Skill and projects matter more than brand for software roles — strong portfolios win across tiers." },
    ],
  },
  {
    slug: "ai-data-science",
    name: "AI & Data Science",
    icon: "Brain",
    color: "#7B5EA7",
    desc: "Statistical modelling, big-data architectures, and machine-learning systems.",
    tags: ["Math-heavy", "High Tech Access", "New-age pivot"],
    branchCount: 18,
    stats: { jobGrowth: "High Job Growth", medianSalary: "₹19 LPA", aiRisk: 45 },
    aiRiskLabel: "LOW–MODERATE RISK",
    academics: {
      summary:
        "AI & DS sits on top of strong linear algebra, probability and optimisation. You build models, but more importantly you learn to frame problems, clean data and reason about uncertainty.",
      coreSubjects: ["Linear Algebra & Probability", "Machine Learning", "Deep Learning", "Big Data Systems", "Optimization", "Statistical Inference"],
      outcomes: ["ML Engineer", "Data Scientist", "AI Researcher", "MLOps Engineer", "Quant / Applied Scientist"],
    },
    insights: {
      skills: { coursework: 35, selfLearning: 65 },
      tierMatters: 55,
      research: [{ label: "Academic Pubs", value: 92 }, { label: "Industry R&D", value: 88 }, { label: "Lab Funding", value: 78 }],
      researchNote:
        "One of the fastest-funded areas in India — IndiaAI Mission, corporate AI labs and global remote roles make this a high-mobility field for strong builders.",
      salaryArc: {
        median: { entry: 19, y3: 30, y5: 42 },
        top:    { entry: 44, y3: 65, y5: 90 },
      },
    },
    branchesList: ["Artificial Intelligence", "Data Science & Engineering", "AI & ML", "Computer Science (Data Science)", "Mathematics & Computing"],
    colleges: [
      { name: "IIT Madras", tag: "NIRF #1", chance: "high" },
      { name: "IIT Hyderabad", tag: "AI pioneer", chance: "medium" },
      { name: "IIIT Bangalore", tag: "Top IIIT", chance: "medium" },
      { name: "NIT Surathkal", tag: "NIRF #17", chance: "high" },
    ],
    myths: [
      { myth: "You must do a PhD to work in AI.", reality: "Most applied ML roles need strong projects and math intuition, not a doctorate." },
      { myth: "AI will replace AI engineers.", reality: "Tooling automates the boring parts; framing, data and judgement remain human-led." },
      { myth: "It's just CS with a fancy name.", reality: "The statistics, optimisation and experimentation discipline make it a distinct skill set." },
    ],
  },
  {
    slug: "electronics-electrical",
    name: "Electronics & Electrical",
    icon: "CircuitBoard",
    color: "#FF693D",
    desc: "Power systems, microelectronics, VLSI design, and signal processing.",
    tags: ["Math-heavy", "Core & Tech options", "Hardware focus"],
    branchCount: 26,
    stats: { jobGrowth: "Strong Demand", medianSalary: "₹15 LPA", aiRisk: 38 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "ECE/EE blends physics and math: circuits, signals, electromagnetics and control. It keeps both doors open — core electronics/VLSI roles and software/embedded roles.",
      coreSubjects: ["Signals & Systems", "Digital Electronics", "Microprocessors", "VLSI Design", "Control Systems", "Electromagnetics"],
      outcomes: ["VLSI / Chip Design Engineer", "Embedded Systems Engineer", "Power Engineer", "Hardware Engineer", "Software (tech pivot)"],
    },
    insights: {
      skills: { coursework: 55, selfLearning: 45 },
      tierMatters: 50,
      research: [{ label: "Academic Pubs", value: 80 }, { label: "Industry R&D", value: 85 }, { label: "Lab Funding", value: 82 }],
      researchNote:
        "India's semiconductor push (ISM, design-linked incentives) is reviving VLSI hiring. Strong core ecosystems exist around Bengaluru and Hyderabad.",
      salaryArc: {
        median: { entry: 15, y3: 22, y5: 30 },
        top:    { entry: 30, y3: 46, y5: 62 },
      },
    },
    branchesList: ["Electronics & Communication", "Electrical Engineering", "Electronics & VLSI", "Instrumentation & Control", "Electrical & Electronics"],
    colleges: [
      { name: "IIT Kanpur", tag: "NIRF #5", chance: "high" },
      { name: "IIT Roorkee", tag: "NIRF #6", chance: "high" },
      { name: "NIT Warangal", tag: "NIRF #26", chance: "high" },
      { name: "IIIT Allahabad", tag: "ECE strong", chance: "medium" },
    ],
    myths: [
      { myth: "ECE means no software jobs.", reality: "A large share of ECE grads move into software and embedded roles with strong fundamentals." },
      { myth: "Core electronics has no scope in India.", reality: "The semiconductor mission is actively expanding VLSI and chip-design hiring." },
      { myth: "EE is only about power and wiring.", reality: "Modern EE spans control, robotics, signal processing and renewable systems." },
    ],
  },
  {
    slug: "mechanical-robotics",
    name: "Mechanical & Robotics",
    icon: "Cog",
    color: "#E29A2E",
    desc: "Thermodynamics, design, manufacturing, and intelligent automation.",
    tags: ["Core-heavy", "Design-focused", "Robotics pivot"],
    branchCount: 22,
    stats: { jobGrowth: "Stable Demand", medianSalary: "₹12 LPA", aiRisk: 35 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "The broadest engineering branch — thermodynamics, mechanics, manufacturing and design. Modern Mech increasingly overlaps with robotics, mechatronics and EV systems.",
      coreSubjects: ["Thermodynamics", "Strength of Materials", "Fluid Mechanics", "Machine Design", "Manufacturing", "Robotics & Control"],
      outcomes: ["Design Engineer", "Robotics Engineer", "Manufacturing / Production", "Automotive / EV Engineer", "Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 60, selfLearning: 40 },
      tierMatters: 48,
      research: [{ label: "Academic Pubs", value: 78 }, { label: "Industry R&D", value: 72 }, { label: "Lab Funding", value: 68 }],
      researchNote:
        "EV manufacturing and automation (PLI schemes) are reshaping demand. Robotics and mechatronics labs are growing across IITs and NITs.",
      salaryArc: {
        median: { entry: 12, y3: 18, y5: 26 },
        top:    { entry: 26, y3: 40, y5: 55 },
      },
    },
    branchesList: ["Mechanical Engineering", "Robotics & Automation", "Mechatronics", "Production & Industrial", "Automobile Engineering"],
    colleges: [
      { name: "IIT Madras", tag: "NIRF #1", chance: "high" },
      { name: "IIT Bombay", tag: "NIRF #3", chance: "high" },
      { name: "NIT Trichy", tag: "NIRF #9", chance: "high" },
      { name: "IIT BHU", tag: "Strong core", chance: "medium" },
    ],
    myths: [
      { myth: "Mechanical has no future.", reality: "EVs, robotics and automation have created entirely new high-growth Mech roles." },
      { myth: "You can't switch to software from Mech.", reality: "Many Mech grads transition with strong DSA prep and projects." },
      { myth: "It's only factory jobs.", reality: "Design, simulation, R&D and product roles dominate top-college placements." },
    ],
  },
  {
    slug: "civil-architecture",
    name: "Civil & Architecture",
    icon: "Building2",
    color: "#0FAE6E",
    desc: "Structures, geotechnics, urban design, and sustainable infrastructure.",
    tags: ["Core-heavy", "Design-focused", "Infra growth"],
    branchCount: 16,
    stats: { jobGrowth: "Infra Boom", medianSalary: "₹10 LPA", aiRisk: 28 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Civil shapes the physical world — structures, transportation, water and the environment. India's infrastructure spend keeps demand steady, with growth in smart-city and green-building work.",
      coreSubjects: ["Structural Analysis", "Geotechnical Engg", "Transportation Engg", "Fluid Mechanics", "Environmental Engg", "Construction Management"],
      outcomes: ["Structural Engineer", "Site / Project Engineer", "Urban Planner", "Construction Manager", "Govt / PSU roles"],
    },
    insights: {
      skills: { coursework: 65, selfLearning: 35 },
      tierMatters: 42,
      research: [{ label: "Academic Pubs", value: 70 }, { label: "Industry R&D", value: 60 }, { label: "Lab Funding", value: 64 }],
      researchNote:
        "Government infrastructure outlays (NIP, smart cities) sustain hiring. PSU and government routes via GATE add strong stability for civil graduates.",
      salaryArc: {
        median: { entry: 10, y3: 15, y5: 22 },
        top:    { entry: 22, y3: 34, y5: 46 },
      },
    },
    branchesList: ["Civil Engineering", "Architecture (B.Arch)", "Planning", "Construction Technology", "Environmental Engineering"],
    colleges: [
      { name: "IIT Roorkee", tag: "Civil #1", chance: "high" },
      { name: "IIT Madras", tag: "NIRF #1", chance: "medium" },
      { name: "NIT Trichy", tag: "NIRF #9", chance: "high" },
      { name: "SPA Delhi", tag: "Arch leader", chance: "medium" },
    ],
    myths: [
      { myth: "Civil pays the least, always.", reality: "Top-college structural and PMC roles are well-paid; PSU stability is a strong upside." },
      { myth: "It's a dying branch.", reality: "Infrastructure and green-building demand keep it steady and government-backed." },
      { myth: "No tech scope.", reality: "BIM, GIS and structural simulation make modern civil increasingly software-driven." },
    ],
  },
  {
    slug: "chemical",
    name: "Chemical Engineering",
    icon: "FlaskConical",
    color: "#3A86FF",
    desc: "Process design, reaction engineering, and energy & materials transformation.",
    tags: ["Math + Chem", "Core-heavy", "Energy / Pharma"],
    branchCount: 12,
    stats: { jobGrowth: "Steady", medianSalary: "₹12 LPA", aiRisk: 30 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Chemical engineers turn raw materials into useful products at scale — fuels, polymers, pharma and food. Strong process, transport and thermodynamics fundamentals open energy and analytics careers too.",
      coreSubjects: ["Transport Phenomena", "Thermodynamics", "Reaction Engineering", "Process Control", "Mass Transfer", "Plant Design"],
      outcomes: ["Process Engineer", "Energy / Oil & Gas", "Pharma / FMCG", "Data / Analytics pivot", "Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 62, selfLearning: 38 },
      tierMatters: 46,
      research: [{ label: "Academic Pubs", value: 76 }, { label: "Industry R&D", value: 70 }, { label: "Lab Funding", value: 66 }],
      researchNote:
        "Energy transition, green hydrogen and specialty chemicals are reshaping demand. Strong analytics crossover keeps options open beyond core.",
      salaryArc: {
        median: { entry: 12, y3: 18, y5: 25 },
        top:    { entry: 26, y3: 38, y5: 52 },
      },
    },
    branchesList: ["Chemical Engineering", "Petroleum Engineering", "Polymer Science", "Process Engineering", "Energy Engineering"],
    colleges: [
      { name: "IIT Bombay", tag: "Chem #1", chance: "high" },
      { name: "IIT Madras", tag: "NIRF #1", chance: "medium" },
      { name: "ICT Mumbai", tag: "Specialist", chance: "medium" },
      { name: "NIT Trichy", tag: "NIRF #9", chance: "high" },
    ],
    myths: [
      { myth: "Chemical = only oil refineries.", reality: "Pharma, FMCG, specialty chemicals and analytics absorb large numbers of grads." },
      { myth: "No software pivot possible.", reality: "Process-analytics and data roles are a common, well-paid transition." },
      { myth: "It's the same as a chemistry degree.", reality: "It's design and scale engineering — very different from lab chemistry." },
    ],
  },
  {
    slug: "materials-mining",
    name: "Materials & Mining",
    icon: "Layers",
    color: "#E29A2E",
    desc: "Metallurgy, nanomaterials, mining systems, and earth-resource engineering.",
    tags: ["Core-heavy", "PSU-friendly", "Research depth"],
    branchCount: 14,
    stats: { jobGrowth: "Niche", medianSalary: "₹11 LPA", aiRisk: 26 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Materials & mining engineers design and extract the substances everything else is built from — alloys, semiconductors, batteries and minerals. Deep research scope with strong PSU routes.",
      coreSubjects: ["Physical Metallurgy", "Materials Characterization", "Mineral Processing", "Mining Methods", "Nanomaterials", "Phase Transformations"],
      outcomes: ["Metallurgist", "Mining Engineer", "Materials Researcher", "PSU (SAIL, Coal India)", "Battery / Semiconductor R&D"],
    },
    insights: {
      skills: { coursework: 64, selfLearning: 36 },
      tierMatters: 44,
      research: [{ label: "Academic Pubs", value: 82 }, { label: "Industry R&D", value: 66 }, { label: "Lab Funding", value: 72 }],
      researchNote:
        "Battery materials and semiconductor substrates are reviving interest. Strong route into PSUs and research labs (DRDO, BARC) for high performers.",
      salaryArc: {
        median: { entry: 11, y3: 16, y5: 23 },
        top:    { entry: 24, y3: 34, y5: 46 },
      },
    },
    branchesList: ["Metallurgical Engineering", "Materials Science", "Mining Engineering", "Mineral Engineering", "Nanotechnology"],
    colleges: [
      { name: "IIT BHU", tag: "Metallurgy", chance: "high" },
      { name: "IIT Kharagpur", tag: "Mining strong", chance: "medium" },
      { name: "ISM Dhanbad", tag: "Mining #1", chance: "high" },
      { name: "NIT Trichy", tag: "Metallurgy", chance: "high" },
    ],
    myths: [
      { myth: "No jobs outside steel plants.", reality: "Batteries, semiconductors and aerospace materials are growing employers." },
      { myth: "It's purely theoretical.", reality: "Characterization, processing and quality engineering are very hands-on." },
      { myth: "PSU is the only path.", reality: "Strong R&D, higher-studies and materials-tech startup paths exist." },
    ],
  },
  {
    slug: "biotech-biosciences",
    name: "Bio-Tech & Bio-Sciences",
    icon: "Dna",
    color: "#0FAE6E",
    desc: "Bioprocessing, genomics, bioinformatics, and health-tech engineering.",
    tags: ["Bio + Math", "Research-led", "Health-tech"],
    branchCount: 13,
    stats: { jobGrowth: "Emerging", medianSalary: "₹10 LPA", aiRisk: 32 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Biotech engineering applies engineering rigor to biology — bioprocessing, genomics and bioinformatics. The computational/bioinformatics crossover opens strong analytics careers.",
      coreSubjects: ["Biochemistry", "Bioprocess Engineering", "Genetic Engineering", "Bioinformatics", "Cell Biology", "Immunology"],
      outcomes: ["Bioprocess Engineer", "Bioinformatics Analyst", "Pharma / R&D", "Health-tech Engineer", "Higher studies (MS/PhD)"],
    },
    insights: {
      skills: { coursework: 58, selfLearning: 42 },
      tierMatters: 52,
      research: [{ label: "Academic Pubs", value: 88 }, { label: "Industry R&D", value: 64 }, { label: "Lab Funding", value: 70 }],
      researchNote:
        "Strong research funding (DBT, BIRAC) and a booming bioinformatics/health-tech sector. Best outcomes pair biology depth with computational skills.",
      salaryArc: {
        median: { entry: 10, y3: 15, y5: 22 },
        top:    { entry: 22, y3: 33, y5: 45 },
      },
    },
    branchesList: ["Biotechnology", "Biomedical Engineering", "Bioinformatics", "Bioengineering", "Biological Sciences"],
    colleges: [
      { name: "IIT Madras", tag: "Bio-Engg", chance: "high" },
      { name: "IIT Kharagpur", tag: "Biotech", chance: "medium" },
      { name: "IIIT Hyderabad", tag: "CompBio", chance: "medium" },
      { name: "NIT Warangal", tag: "Biotech", chance: "high" },
    ],
    myths: [
      { myth: "Biotech has no jobs in India.", reality: "Bioinformatics, pharma R&D and health-tech are creating new roles steadily." },
      { myth: "You must go abroad.", reality: "Domestic research funding and biotech startups are expanding rapidly." },
      { myth: "It's just biology.", reality: "Engineering, data and process skills make it a hybrid, high-leverage field." },
    ],
  },
  {
    slug: "mathematics-computing",
    name: "Mathematics & Computing",
    icon: "Sigma",
    color: "#7B5EA7",
    desc: "Pure & applied math, quantitative finance, and computational modelling.",
    tags: ["Math-heavy", "Quant / Fintech", "Full Tech Access"],
    branchCount: 11,
    stats: { jobGrowth: "High-paying", medianSalary: "₹22 LPA", aiRisk: 40 },
    aiRiskLabel: "LOW–MODERATE RISK",
    academics: {
      summary:
        "M&C combines deep mathematics with computer science — the standard gateway into quant finance, research and high-end software. Among the highest-paying branches at top IITs.",
      coreSubjects: ["Real & Complex Analysis", "Probability & Stochastics", "Numerical Methods", "Algorithms", "Optimization", "Mathematical Finance"],
      outcomes: ["Quant Analyst / Trader", "Software / ML Engineer", "Data Scientist", "Actuary", "Research / Academia"],
    },
    insights: {
      skills: { coursework: 45, selfLearning: 55 },
      tierMatters: 58,
      research: [{ label: "Academic Pubs", value: 90 }, { label: "Industry R&D", value: 78 }, { label: "Lab Funding", value: 72 }],
      researchNote:
        "Quant trading firms and global tech recruit heavily from top M&C cohorts. Among the highest median packages of any engineering branch.",
      salaryArc: {
        median: { entry: 22, y3: 34, y5: 48 },
        top:    { entry: 55, y3: 80, y5: 110 },
      },
    },
    branchesList: ["Mathematics & Computing", "Computational Mathematics", "Statistics & Data Science", "Mathematics & Scientific Computing", "Applied Mathematics"],
    colleges: [
      { name: "IIT Delhi", tag: "M&C top", chance: "high" },
      { name: "IIT Kanpur", tag: "NIRF #5", chance: "medium" },
      { name: "IIT Kharagpur", tag: "M&C", chance: "medium" },
      { name: "IIT Guwahati", tag: "M&C", chance: "high" },
    ],
    myths: [
      { myth: "Math branches have weak placements.", reality: "Quant and tech roles make M&C one of the highest-paid branches at top IITs." },
      { myth: "You become a teacher only.", reality: "Trading, ML, actuarial and software are the dominant outcomes." },
      { myth: "It's harder than CSE for no reason.", reality: "The extra math directly unlocks quant and research roles CSE doesn't." },
    ],
  },
  {
    slug: "sciences-applied",
    name: "Sciences & Applied",
    icon: "Atom",
    color: "#FF693D",
    desc: "Engineering physics, chemistry, and interdisciplinary applied sciences.",
    tags: ["Research-led", "Flexible exits", "Higher-studies"],
    branchCount: 15,
    stats: { jobGrowth: "Research", medianSalary: "₹13 LPA", aiRisk: 34 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Applied-science branches (Engineering Physics, Engineering Chemistry, Earth Sciences) build deep fundamentals with engineering exposure — ideal launchpads for research, quantum/semiconductor work and tech pivots.",
      coreSubjects: ["Quantum Mechanics", "Electromagnetism", "Solid State Physics", "Applied Chemistry", "Computational Methods", "Photonics / Optics"],
      outcomes: ["Research Scientist", "Semiconductor / Photonics", "Software / Data pivot", "Higher studies (MS/PhD)", "Deep-tech startups"],
    },
    insights: {
      skills: { coursework: 50, selfLearning: 50 },
      tierMatters: 56,
      research: [{ label: "Academic Pubs", value: 93 }, { label: "Industry R&D", value: 70 }, { label: "Lab Funding", value: 80 }],
      researchNote:
        "Quantum tech, photonics and semiconductors are national priorities (National Quantum Mission). Strongest fit for research-minded students who keep a tech option open.",
      salaryArc: {
        median: { entry: 13, y3: 20, y5: 28 },
        top:    { entry: 30, y3: 46, y5: 64 },
      },
    },
    branchesList: ["Engineering Physics", "Engineering Chemistry", "Earth Sciences", "Applied Geology", "Exploration Geophysics"],
    colleges: [
      { name: "IIT Delhi", tag: "Eng Physics", chance: "high" },
      { name: "IIT Bombay", tag: "Eng Physics", chance: "medium" },
      { name: "IIT Kanpur", tag: "NIRF #5", chance: "high" },
      { name: "IIT Roorkee", tag: "Geo strong", chance: "high" },
    ],
    myths: [
      { myth: "Applied science = no placements.", reality: "Engineering Physics cohorts place strongly in software, deep-tech and core R&D." },
      { myth: "Only useful for academics.", reality: "Semiconductor and quantum-tech industries actively recruit these grads." },
      { myth: "You can't switch to CS.", reality: "Strong math/physics base makes a software/ML pivot very achievable." },
    ],
  },
  {
    slug: "aerospace-avionics",
    name: "Aerospace & Avionics",
    icon: "Rocket",
    color: "#3A86FF",
    desc: "Aerodynamics, propulsion, flight mechanics, and spacecraft systems.",
    tags: ["Math-heavy", "Core-heavy", "Defence / Space"],
    branchCount: 9,
    stats: { jobGrowth: "Space Boom", medianSalary: "₹13 LPA", aiRisk: 30 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Aerospace engineers design and analyse aircraft, rockets and satellites — combining fluid dynamics, structures, propulsion and control. India's private-space surge (ISRO + NewSpace startups) has revived demand sharply.",
      coreSubjects: ["Aerodynamics", "Propulsion", "Flight Mechanics", "Aerospace Structures", "Orbital Mechanics", "Control Systems"],
      outcomes: ["Aerospace / Avionics Engineer", "Propulsion Engineer", "ISRO / DRDO / HAL", "Space-tech Startups", "Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 60, selfLearning: 40 },
      tierMatters: 54,
      research: [{ label: "Academic Pubs", value: 84 }, { label: "Industry R&D", value: 76 }, { label: "Lab Funding", value: 80 }],
      researchNote:
        "ISRO's commercialisation and NewSpace startups (Skyroot, Agnikul) plus DRDO/HAL programmes are expanding aerospace hiring well beyond the public sector.",
      salaryArc: {
        median: { entry: 13, y3: 19, y5: 27 },
        top:    { entry: 28, y3: 42, y5: 58 },
      },
    },
    branchesList: ["Aerospace Engineering", "Aeronautical Engineering", "Avionics", "Space Technology", "Aerospace & Mechanical"],
    colleges: [
      { name: "IIT Bombay", tag: "Aero strong", chance: "high" },
      { name: "IIT Madras", tag: "NIRF #1", chance: "medium" },
      { name: "IIT Kanpur", tag: "Flight lab", chance: "high" },
      { name: "MIT Manipal", tag: "Aero", chance: "high" },
    ],
    myths: [
      { myth: "Only ISRO hires aerospace grads.", reality: "Private space, drones, defence and even auto-aero CFD roles now recruit widely." },
      { myth: "You must clear NDA / be a pilot.", reality: "Aerospace is design and analysis engineering — entirely separate from flying." },
      { myth: "No scope in India.", reality: "NewSpace startups and ISRO commercialisation have made it one of the fastest-rising core fields." },
    ],
  },
  {
    slug: "mining-earth",
    name: "Mining Engineering",
    icon: "Mountain",
    color: "#E29A2E",
    desc: "Mine planning, rock mechanics, and safe, sustainable resource extraction.",
    tags: ["Core-heavy", "PSU-friendly", "Field work"],
    branchCount: 7,
    stats: { jobGrowth: "PSU Demand", medianSalary: "₹12 LPA", aiRisk: 24 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Mining engineers plan and run safe, efficient extraction of coal, metals and minerals. The field offers strong PSU pay (Coal India, NMDC), early site responsibility and a growing automation/safety-tech angle.",
      coreSubjects: ["Mine Planning & Design", "Rock Mechanics", "Mine Ventilation", "Surveying", "Mineral Economics", "Mine Safety Engg"],
      outcomes: ["Mining Engineer", "Mine Planner", "PSU (Coal India, NMDC)", "Mining-tech / Drones", "Higher studies / Civil services"],
    },
    insights: {
      skills: { coursework: 66, selfLearning: 34 },
      tierMatters: 40,
      research: [{ label: "Academic Pubs", value: 70 }, { label: "Industry R&D", value: 60 }, { label: "Lab Funding", value: 64 }],
      researchNote:
        "Among the highest PSU starting pay of all branches. Automation, drone-survey and mine-safety analytics are adding modern tech roles to a traditional field.",
      salaryArc: {
        median: { entry: 12, y3: 17, y5: 24 },
        top:    { entry: 24, y3: 34, y5: 46 },
      },
    },
    branchesList: ["Mining Engineering", "Mining Machinery", "Mineral Engineering", "Petroleum & Mining", "Geological Technology"],
    colleges: [
      { name: "ISM Dhanbad", tag: "Mining #1", chance: "high" },
      { name: "IIT Kharagpur", tag: "Mining", chance: "medium" },
      { name: "IIT BHU", tag: "Mining", chance: "high" },
      { name: "NIT Rourkela", tag: "Mining", chance: "high" },
    ],
    myths: [
      { myth: "Mining means a dangerous life underground.", reality: "Modern mining is heavily mechanised and safety-regulated; many roles are planning and supervisory." },
      { myth: "Lowest-paying branch.", reality: "PSU mining pay is among the highest starting packages of any core branch." },
      { myth: "No tech future.", reality: "Drone surveys, automation and mine-safety analytics are reshaping the field." },
    ],
  },
  {
    slug: "petroleum-energy",
    name: "Petroleum & Energy",
    icon: "Fuel",
    color: "#0FAE6E",
    desc: "Reservoir engineering, drilling, and the clean-energy transition.",
    tags: ["Core-heavy", "Energy sector", "High pay"],
    branchCount: 8,
    stats: { jobGrowth: "Energy Shift", medianSalary: "₹14 LPA", aiRisk: 32 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Petroleum & energy engineers handle exploration, drilling and reservoir management — and increasingly the transition to clean energy (hydrogen, CCUS, geothermal). Strong pay in oil & gas, with a widening green-energy door.",
      coreSubjects: ["Reservoir Engineering", "Drilling Technology", "Petroleum Geology", "Production Engineering", "Energy Systems", "Process Safety"],
      outcomes: ["Reservoir / Drilling Engineer", "Energy Analyst", "Oil & Gas (ONGC, Shell)", "Renewables / Hydrogen", "Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 62, selfLearning: 38 },
      tierMatters: 50,
      research: [{ label: "Academic Pubs", value: 74 }, { label: "Industry R&D", value: 78 }, { label: "Lab Funding", value: 70 }],
      researchNote:
        "Oil & gas still pays among the highest core packages, while the clean-energy transition (green hydrogen, CCUS, geothermal) is opening a fast-growing second career track.",
      salaryArc: {
        median: { entry: 14, y3: 21, y5: 30 },
        top:    { entry: 30, y3: 46, y5: 64 },
      },
    },
    branchesList: ["Petroleum Engineering", "Energy Engineering", "Petroleum & Gas", "Renewable Energy", "Energy Science & Engg"],
    colleges: [
      { name: "IIT Madras", tag: "Energy", chance: "high" },
      { name: "ISM Dhanbad", tag: "Petroleum #1", chance: "high" },
      { name: "IIT Bombay", tag: "Energy Sci", chance: "medium" },
      { name: "PDEU Gandhinagar", tag: "Petroleum", chance: "high" },
    ],
    myths: [
      { myth: "Petroleum is a dying field.", reality: "Oil & gas demand persists for decades and clean-energy skills extend the career further." },
      { myth: "Only Gulf jobs pay well.", reality: "Indian PSUs and global energy majors offer strong packages domestically too." },
      { myth: "No link to renewables.", reality: "Reservoir and process skills transfer directly to hydrogen, CCUS and geothermal." },
    ],
  },
  {
    slug: "production-industrial",
    name: "Production & Industrial",
    icon: "Factory",
    color: "#7B5EA7",
    desc: "Manufacturing systems, operations research, and supply-chain optimisation.",
    tags: ["Core + Ops", "Management pivot", "Analytics"],
    branchCount: 9,
    stats: { jobGrowth: "Ops Demand", medianSalary: "₹13 LPA", aiRisk: 36 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Production & industrial engineering blends manufacturing with operations research, quality and supply-chain optimisation. It's a natural launchpad into operations, consulting, analytics and management roles.",
      coreSubjects: ["Operations Research", "Manufacturing Processes", "Quality Engineering", "Supply Chain & Logistics", "Industrial Automation", "Ergonomics"],
      outcomes: ["Operations / Supply-chain Engineer", "Industrial Engineer", "Consulting / Analytics", "Manufacturing (PLI sector)", "MBA pivot"],
    },
    insights: {
      skills: { coursework: 56, selfLearning: 44 },
      tierMatters: 50,
      research: [{ label: "Academic Pubs", value: 72 }, { label: "Industry R&D", value: 70 }, { label: "Lab Funding", value: 62 }],
      researchNote:
        "India's manufacturing push (PLI, 'Make in India') plus e-commerce supply chains have made operations and industrial-engineering skills highly employable across sectors.",
      salaryArc: {
        median: { entry: 13, y3: 20, y5: 28 },
        top:    { entry: 27, y3: 41, y5: 56 },
      },
    },
    branchesList: ["Production Engineering", "Industrial Engineering", "Manufacturing Engineering", "Industrial & Production", "Smart Manufacturing"],
    colleges: [
      { name: "IIT Delhi", tag: "Prod & Ind", chance: "high" },
      { name: "NIT Trichy", tag: "Prod #1", chance: "high" },
      { name: "IIT Kharagpur", tag: "Ind Engg", chance: "medium" },
      { name: "NIT Calicut", tag: "Production", chance: "high" },
    ],
    myths: [
      { myth: "It's just shop-floor work.", reality: "Operations research, analytics and consulting are common, well-paid exits." },
      { myth: "Weaker than Mechanical.", reality: "The ops + analytics edge often opens management and consulting roles faster." },
      { myth: "No software relevance.", reality: "Supply-chain analytics and process optimisation are increasingly data-driven." },
    ],
  },
  {
    slug: "naval-ocean",
    name: "Naval & Ocean",
    icon: "Anchor",
    color: "#FF693D",
    desc: "Ship design, marine structures, and ocean & offshore engineering.",
    tags: ["Core-heavy", "Niche", "Defence / Marine"],
    branchCount: 6,
    stats: { jobGrowth: "Niche", medianSalary: "₹12 LPA", aiRisk: 28 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Naval architecture and ocean engineering design ships, submarines, offshore platforms and marine structures. A small, specialised field with strong defence-shipbuilding and offshore-energy demand.",
      coreSubjects: ["Ship Hydrodynamics", "Marine Structures", "Ship Design", "Offshore Engineering", "Marine Propulsion", "Coastal Engineering"],
      outcomes: ["Naval Architect", "Marine / Offshore Engineer", "Shipyards (Cochin, MDL)", "Classification societies", "Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 64, selfLearning: 36 },
      tierMatters: 52,
      research: [{ label: "Academic Pubs", value: 76 }, { label: "Industry R&D", value: 64 }, { label: "Lab Funding", value: 70 }],
      researchNote:
        "India's shipbuilding and naval-modernisation push, plus offshore wind and oil platforms, sustains demand for a small but well-paid pool of specialists.",
      salaryArc: {
        median: { entry: 12, y3: 18, y5: 25 },
        top:    { entry: 26, y3: 38, y5: 52 },
      },
    },
    branchesList: ["Naval Architecture & Ocean Engg", "Ocean Engineering", "Marine Engineering", "Ship Technology", "Offshore Engineering"],
    colleges: [
      { name: "IIT Madras", tag: "Ocean #1", chance: "high" },
      { name: "IIT Kharagpur", tag: "Naval Arch", chance: "high" },
      { name: "IMU Chennai", tag: "Marine", chance: "high" },
      { name: "AMET University", tag: "Marine", chance: "medium" },
    ],
    myths: [
      { myth: "Only useful for the Navy.", reality: "Shipyards, offshore energy and classification societies hire naval architects widely." },
      { myth: "No jobs in India.", reality: "Indigenous shipbuilding and offshore projects keep this niche field employed." },
      { myth: "Same as a sailor's career.", reality: "Naval architecture is design engineering on land, distinct from sailing roles." },
    ],
  },
];

export const TOTAL_BRANCHES = BRANCHES.reduce((s, b) => s + (b.branchCount || 0), 0);

export function getBranch(slug) {
  return BRANCHES.find((b) => b.slug === slug) || null;
}
