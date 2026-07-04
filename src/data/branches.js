/* branches.js — engineering branch families ("paths") for the Branch Explorer.
   Each family powers a catalog card + a full /branches/:slug detail page with
   Academics, Advanced Insights (gauge + 5-year salary arc), Colleges & Branches
   and Common Myths tabs. Numbers are indicative India-market estimates, not
   official figures. Icon names map to lucide-react in the UI layer. */

export const BRANCHES = [
  {
    slug: "cs-it",
    name: "Computer Science & Information Technology",
    icon: "Monitor",
    color: "#3A86FF",
    desc: "The study of computational systems, discrete mathematics, and software design.",
    tags: ["Coding-dominated", "Math-heavy", "Full Tech Access"],
    branchCount: 32,
    stats: { jobGrowth: "Most Placements", medianSalary: "₹18 LPA", aiRisk: 63 },
    aiRiskLabel: "MODERATE RISK",
    academics: {
      summary:
        "A CSE degree is roughly 25% coding — the rest is computer theory, discrete mathematics, operating systems, networks and algorithms. You learn how machines think, not just how to write apps.",
      coreSubjects: ["Data Structures & Algorithms", "Operating Systems", "DBMS", "Computer Networks", "Theory of Computation", "Discrete Mathematics"],
      outcomes: ["Software Engineer", "Backend / Full-stack Dev", "Data Engineer", "Product Engineer", "Research / Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 25, selfLearning: 75 },
      tierMatters: 45,
      research: [{ label: "Academic Pubs", value: 95 }, { label: "Industry R&D", value: 80 }, { label: "Lab Funding", value: 70 }],
      researchNote:
        "Active ecosystem with top industrial labs like Microsoft Research India and Google Research India. Government funding is driven by MeitY initiatives (IndiaAI Mission) and DST-SERB grants.",
      salaryArc: {
        median: { entry: 19, y3: 27, y5: 37 },
        top:    { entry: 44, y3: 62, y5: 82 },
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
    name: "Artificial Intelligence & Data Science",
    icon: "Brain",
    color: "#7B5EA7",
    desc: "Statistical modelling, big-data architectures, and machine-learning systems.",
    tags: ["Math-heavy", "High Tech Access", "New-age pivot"],
    branchCount: 18,
    stats: { jobGrowth: "High Job Growth", medianSalary: "₹19 LPA", aiRisk: 43 },
    aiRiskLabel: "LOW–MODERATE RISK",
    academics: {
      summary:
        "AI & DS sits on top of strong linear algebra, probability and optimisation. You build models, but more importantly you learn to frame problems, clean data and reason about uncertainty.",
      coreSubjects: ["Linear Algebra & Probability", "Machine Learning", "Deep Learning", "Big Data Systems", "Optimization", "Statistical Inference"],
      outcomes: ["ML Engineer", "Data Scientist", "AI Researcher", "MLOps Engineer", "Quant / Applied Scientist"],
    },
    insights: {
      skills: { coursework: 30, selfLearning: 70 },
      tierMatters: 55,
      research: [{ label: "Academic Pubs", value: 92 }, { label: "Industry R&D", value: 88 }, { label: "Lab Funding", value: 78 }],
      researchNote:
        "One of the fastest-funded areas in India — IndiaAI Mission, corporate AI labs and global remote roles make this a high-mobility field for strong builders.",
      salaryArc: {
        median: { entry: 20, y3: 31, y5: 43 },
        top:    { entry: 46, y3: 67, y5: 92 },
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
    name: "Electrical & Electronics Engineering",
    icon: "CircuitBoard",
    color: "#FF693D",
    desc: "Power systems, microelectronics, VLSI design, and signal processing.",
    tags: ["Math-heavy", "Core & Tech options", "Hardware focus"],
    branchCount: 26,
    stats: { jobGrowth: "Strong Demand", medianSalary: "₹15 LPA", aiRisk: 41 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "ECE/EE blends physics and math: circuits, signals, electromagnetics and control. It keeps both doors open — core electronics/VLSI roles and software/embedded roles.",
      coreSubjects: ["Signals & Systems", "Digital Electronics", "Microprocessors", "VLSI Design", "Control Systems", "Electromagnetics"],
      outcomes: ["VLSI / Chip Design Engineer", "Embedded Systems Engineer", "Power Engineer", "Hardware Engineer", "Software (tech pivot)"],
    },
    insights: {
      skills: { coursework: 50, selfLearning: 50 },
      tierMatters: 50,
      research: [{ label: "Academic Pubs", value: 80 }, { label: "Industry R&D", value: 85 }, { label: "Lab Funding", value: 82 }],
      researchNote:
        "India's semiconductor push (ISM, design-linked incentives) is reviving VLSI hiring. Strong core ecosystems exist around Bengaluru and Hyderabad.",
      salaryArc: {
        median: { entry: 16, y3: 23, y5: 31 },
        top:    { entry: 32, y3: 48, y5: 64 },
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
    name: "Mechanical Engineering",
    icon: "Cog",
    color: "#E29A2E",
    desc: "Thermodynamics, design, manufacturing, and intelligent automation.",
    tags: ["Core-heavy", "Design-focused", "Robotics pivot"],
    branchCount: 22,
    stats: { jobGrowth: "Stable Demand", medianSalary: "₹12 LPA", aiRisk: 33 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "The broadest engineering branch — thermodynamics, mechanics, manufacturing and design. Modern Mech increasingly overlaps with robotics, mechatronics and EV systems.",
      coreSubjects: ["Thermodynamics", "Strength of Materials", "Fluid Mechanics", "Machine Design", "Manufacturing", "Robotics & Control", "Kinematics", "Finite Element Analysis", "Heat Transfer"],
      outcomes: ["Design Engineer", "Robotics Engineer", "Manufacturing / Production", "Automotive / EV Engineer", "Higher studies (MS)", "Aerospace Engineer", "Systems Engineer", "HVAC Engineer"],
    },
    insights: {
      skills: { coursework: 65, selfLearning: 35 },
      tierMatters: 48,
      research: [{ label: "Academic Pubs", value: 78 }, { label: "Industry R&D", value: 72 }, { label: "Lab Funding", value: 68 }],
      researchNote:
        "EV manufacturing, thermal systems, and automation (PLI schemes) are reshaping demand. Robotics and mechatronics labs are rapidly growing across IITs and NITs.",
      salaryArc: {
        median: { entry: 13, y3: 19, y5: 27 },
        top:    { entry: 28, y3: 42, y5: 57 },
      },
    },
    branchesList: ["Mechanical Engineering", "Robotics & Automation", "Mechatronics", "Production & Industrial", "Automobile Engineering"],
    colleges: [
      { name: "IIT Madras", tag: "NIRF #1", chance: "high" },
      { name: "IIT Bombay", tag: "NIRF #3", chance: "high" },
      { name: "NIT Trichy", tag: "NIRF #9", chance: "high" },
      { name: "IIT BHU", tag: "Strong core", chance: "medium" },
      { name: "IIT Delhi", tag: "NIRF #2", chance: "high" },
      { name: "IIT Kanpur", tag: "NIRF #5", chance: "high" },
      { name: "IIT Kharagpur", tag: "NIRF #6", chance: "medium" },
    ],
    myths: [
      { myth: "Mechanical has no future.", reality: "EVs, robotics and automation have created entirely new high-growth Mech roles." },
      { myth: "You can't switch to software from Mech.", reality: "Many Mech grads transition with strong DSA prep and projects." },
      { myth: "It's only factory jobs.", reality: "Design, simulation, R&D and product roles dominate top-college placements." },
      { myth: "It only involves greasy machinery.", reality: "Modern mechanical engineering is highly reliant on software like CAD, CAM, and simulation tools." },
      { myth: "There is no scope for higher studies.", reality: "There is huge demand for advanced research in materials, aerodynamics, and robotics." },
      { myth: "Mechanical engineers cannot work in IT.", reality: "Many mechanical engineers transition to IT, especially in roles requiring strong analytical skills." },
    ],
  },
  {
    slug: "civil-architecture",
    name: "Civil Engineering & Architecture",
    icon: "Building2",
    color: "#0FAE6E",
    desc: "Structures, geotechnics, urban design, and sustainable infrastructure.",
    tags: ["Core-heavy", "Design-focused", "Infra growth"],
    branchCount: 16,
    stats: { jobGrowth: "Infra Boom", medianSalary: "₹10 LPA", aiRisk: 31 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Civil shapes the physical world — structures, transportation, water and the environment. India's infrastructure spend keeps demand steady, with growth in smart-city and green-building work.",
      coreSubjects: ["Structural Analysis", "Geotechnical Engg", "Transportation Engg", "Fluid Mechanics", "Environmental Engg", "Construction Management"],
      outcomes: ["Structural Engineer", "Site / Project Engineer", "Urban Planner", "Construction Manager", "Govt / PSU roles"],
    },
    insights: {
      skills: { coursework: 60, selfLearning: 40 },
      tierMatters: 42,
      research: [{ label: "Academic Pubs", value: 70 }, { label: "Industry R&D", value: 60 }, { label: "Lab Funding", value: 64 }],
      researchNote:
        "Government infrastructure outlays (NIP, smart cities) sustain hiring. PSU and government routes via GATE add strong stability for civil graduates.",
      salaryArc: {
        median: { entry: 11, y3: 16, y5: 23 },
        top:    { entry: 24, y3: 36, y5: 48 },
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
    stats: { jobGrowth: "Steady", medianSalary: "₹12 LPA", aiRisk: 33 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Chemical engineers turn raw materials into useful products at scale — fuels, polymers, pharma and food. Strong process, transport and thermodynamics fundamentals open energy and analytics careers too.",
      coreSubjects: ["Transport Phenomena", "Thermodynamics", "Reaction Engineering", "Process Control", "Mass Transfer", "Plant Design"],
      outcomes: ["Process Engineer", "Energy / Oil & Gas", "Pharma / FMCG", "Data / Analytics pivot", "Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 67, selfLearning: 33 },
      tierMatters: 46,
      research: [{ label: "Academic Pubs", value: 76 }, { label: "Industry R&D", value: 70 }, { label: "Lab Funding", value: 66 }],
      researchNote:
        "Energy transition, green hydrogen and specialty chemicals are reshaping demand. Strong analytics crossover keeps options open beyond core.",
      salaryArc: {
        median: { entry: 13, y3: 19, y5: 26 },
        top:    { entry: 28, y3: 40, y5: 54 },
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
    name: "Materials Science & Metallurgical Engineering",
    icon: "Layers",
    color: "#E29A2E",
    desc: "Metallurgy, nanomaterials, mining systems, and earth-resource engineering.",
    tags: ["Core-heavy", "PSU-friendly", "Research depth"],
    branchCount: 14,
    stats: { jobGrowth: "Niche", medianSalary: "₹11 LPA", aiRisk: 29 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Materials & mining engineers design and extract the substances everything else is built from — alloys, semiconductors, batteries and minerals. Deep research scope with strong PSU routes.",
      coreSubjects: ["Physical Metallurgy", "Materials Characterization", "Mineral Processing", "Mining Methods", "Nanomaterials", "Phase Transformations"],
      outcomes: ["Metallurgist", "Mining Engineer", "Materials Researcher", "PSU (SAIL, Coal India)", "Battery / Semiconductor R&D"],
    },
    insights: {
      skills: { coursework: 69, selfLearning: 31 },
      tierMatters: 44,
      research: [{ label: "Academic Pubs", value: 82 }, { label: "Industry R&D", value: 66 }, { label: "Lab Funding", value: 72 }],
      researchNote:
        "Battery materials and semiconductor substrates are reviving interest. Strong route into PSUs and research labs (DRDO, BARC) for high performers.",
      salaryArc: {
        median: { entry: 12, y3: 17, y5: 24 },
        top:    { entry: 26, y3: 36, y5: 48 },
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
    name: "Biotechnology & Bio-Sciences",
    icon: "Dna",
    color: "#0FAE6E",
    desc: "Bioprocessing, genomics, bioinformatics, and health-tech engineering.",
    tags: ["Bio + Math", "Research-led", "Health-tech"],
    branchCount: 13,
    stats: { jobGrowth: "Emerging", medianSalary: "₹10 LPA", aiRisk: 35 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Biotech engineering applies engineering rigor to biology — bioprocessing, genomics and bioinformatics. The computational/bioinformatics crossover opens strong analytics careers.",
      coreSubjects: ["Biochemistry", "Bioprocess Engineering", "Genetic Engineering", "Bioinformatics", "Cell Biology", "Immunology"],
      outcomes: ["Bioprocess Engineer", "Bioinformatics Analyst", "Pharma / R&D", "Health-tech Engineer", "Higher studies (MS/PhD)"],
    },
    insights: {
      skills: { coursework: 63, selfLearning: 37 },
      tierMatters: 52,
      research: [{ label: "Academic Pubs", value: 88 }, { label: "Industry R&D", value: 64 }, { label: "Lab Funding", value: 70 }],
      researchNote:
        "Strong research funding (DBT, BIRAC) and a booming bioinformatics/health-tech sector. Best outcomes pair biology depth with computational skills.",
      salaryArc: {
        median: { entry: 11, y3: 16, y5: 23 },
        top:    { entry: 24, y3: 35, y5: 47 },
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
    name: "Mathematics & Scientific Computing",
    icon: "Sigma",
    color: "#7B5EA7",
    desc: "Pure & applied math, quantitative finance, and computational modelling.",
    tags: ["Math-heavy", "Quant / Fintech", "Full Tech Access"],
    branchCount: 11,
    stats: { jobGrowth: "High-paying", medianSalary: "₹22 LPA", aiRisk: 43 },
    aiRiskLabel: "LOW–MODERATE RISK",
    academics: {
      summary:
        "M&C combines deep mathematics with computer science — the standard gateway into quant finance, research and high-end software. Among the highest-paying branches at top IITs.",
      coreSubjects: ["Real & Complex Analysis", "Probability & Stochastics", "Numerical Methods", "Algorithms", "Optimization", "Mathematical Finance"],
      outcomes: ["Quant Analyst / Trader", "Software / ML Engineer", "Data Scientist", "Actuary", "Research / Academia"],
    },
    insights: {
      skills: { coursework: 40, selfLearning: 60 },
      tierMatters: 58,
      research: [{ label: "Academic Pubs", value: 90 }, { label: "Industry R&D", value: 78 }, { label: "Lab Funding", value: 72 }],
      researchNote:
        "Quant trading firms and global tech recruit heavily from top M&C cohorts. Among the highest median packages of any engineering branch.",
      salaryArc: {
        median: { entry: 23, y3: 35, y5: 49 },
        top:    { entry: 57, y3: 82, y5: 112 },
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
    name: "Applied Sciences & Engineering Physics",
    icon: "Atom",
    color: "#FF693D",
    desc: "Engineering physics, chemistry, and interdisciplinary applied sciences.",
    tags: ["Research-led", "Flexible exits", "Higher-studies"],
    branchCount: 15,
    stats: { jobGrowth: "Research", medianSalary: "₹13 LPA", aiRisk: 37 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Applied-science branches (Engineering Physics, Engineering Chemistry, Earth Sciences) build deep fundamentals with engineering exposure — ideal launchpads for research, quantum/semiconductor work and tech pivots.",
      coreSubjects: ["Quantum Mechanics", "Electromagnetism", "Solid State Physics", "Applied Chemistry", "Computational Methods", "Photonics / Optics"],
      outcomes: ["Research Scientist", "Semiconductor / Photonics", "Software / Data pivot", "Higher studies (MS/PhD)", "Deep-tech startups"],
    },
    insights: {
      skills: { coursework: 55, selfLearning: 45 },
      tierMatters: 56,
      research: [{ label: "Academic Pubs", value: 93 }, { label: "Industry R&D", value: 70 }, { label: "Lab Funding", value: 80 }],
      researchNote:
        "Quantum tech, photonics and semiconductors are national priorities (National Quantum Mission). Strongest fit for research-minded students who keep a tech option open.",
      salaryArc: {
        median: { entry: 14, y3: 21, y5: 29 },
        top:    { entry: 32, y3: 48, y5: 66 },
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
    name: "Aerospace Engineering & Avionics",
    icon: "Rocket",
    color: "#3A86FF",
    desc: "Aerodynamics, propulsion, flight mechanics, and spacecraft systems.",
    tags: ["Math-heavy", "Core-heavy", "Defence / Space"],
    branchCount: 9,
    stats: { jobGrowth: "Space Boom", medianSalary: "₹13 LPA", aiRisk: 33 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Aerospace engineers design and analyse aircraft, rockets and satellites — combining fluid dynamics, structures, propulsion and control. India's private-space surge (ISRO + NewSpace startups) has revived demand sharply.",
      coreSubjects: ["Aerodynamics", "Propulsion", "Flight Mechanics", "Aerospace Structures", "Orbital Mechanics", "Control Systems"],
      outcomes: ["Aerospace / Avionics Engineer", "Propulsion Engineer", "ISRO / DRDO / HAL", "Space-tech Startups", "Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 65, selfLearning: 35 },
      tierMatters: 54,
      research: [{ label: "Academic Pubs", value: 84 }, { label: "Industry R&D", value: 76 }, { label: "Lab Funding", value: 80 }],
      researchNote:
        "ISRO's commercialisation and NewSpace startups (Skyroot, Agnikul) plus DRDO/HAL programmes are expanding aerospace hiring well beyond the public sector.",
      salaryArc: {
        median: { entry: 14, y3: 20, y5: 28 },
        top:    { entry: 30, y3: 44, y5: 60 },
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
    name: "Mining Machinery & Engineering",
    icon: "Mountain",
    color: "#E29A2E",
    desc: "Mine planning, rock mechanics, and safe, sustainable resource extraction.",
    tags: ["Core-heavy", "PSU-friendly", "Field work"],
    branchCount: 7,
    stats: { jobGrowth: "PSU Demand", medianSalary: "₹12 LPA", aiRisk: 27 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Mining engineers plan and run safe, efficient extraction of coal, metals and minerals. The field offers strong PSU pay (Coal India, NMDC), early site responsibility and a growing automation/safety-tech angle.",
      coreSubjects: ["Mine Planning & Design", "Rock Mechanics", "Mine Ventilation", "Surveying", "Mineral Economics", "Mine Safety Engg"],
      outcomes: ["Mining Engineer", "Mine Planner", "PSU (Coal India, NMDC)", "Mining-tech / Drones", "Higher studies / Civil services"],
    },
    insights: {
      skills: { coursework: 71, selfLearning: 29 },
      tierMatters: 40,
      research: [{ label: "Academic Pubs", value: 70 }, { label: "Industry R&D", value: 60 }, { label: "Lab Funding", value: 64 }],
      researchNote:
        "Among the highest PSU starting pay of all branches. Automation, drone-survey and mine-safety analytics are adding modern tech roles to a traditional field.",
      salaryArc: {
        median: { entry: 13, y3: 18, y5: 25 },
        top:    { entry: 26, y3: 36, y5: 48 },
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
    name: "Petroleum & Energy Studies",
    icon: "Fuel",
    color: "#0FAE6E",
    desc: "Reservoir engineering, drilling, and the clean-energy transition.",
    tags: ["Core-heavy", "Energy sector", "High pay"],
    branchCount: 8,
    stats: { jobGrowth: "Energy Shift", medianSalary: "₹14 LPA", aiRisk: 35 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Petroleum & energy engineers handle exploration, drilling and reservoir management — and increasingly the transition to clean energy (hydrogen, CCUS, geothermal). Strong pay in oil & gas, with a widening green-energy door.",
      coreSubjects: ["Reservoir Engineering", "Drilling Technology", "Petroleum Geology", "Production Engineering", "Energy Systems", "Process Safety"],
      outcomes: ["Reservoir / Drilling Engineer", "Energy Analyst", "Oil & Gas (ONGC, Shell)", "Renewables / Hydrogen", "Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 67, selfLearning: 33 },
      tierMatters: 50,
      research: [{ label: "Academic Pubs", value: 74 }, { label: "Industry R&D", value: 78 }, { label: "Lab Funding", value: 70 }],
      researchNote:
        "Oil & gas still pays among the highest core packages, while the clean-energy transition (green hydrogen, CCUS, geothermal) is opening a fast-growing second career track.",
      salaryArc: {
        median: { entry: 15, y3: 22, y5: 31 },
        top:    { entry: 32, y3: 48, y5: 66 },
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
    name: "Production & Industrial Engineering",
    icon: "Factory",
    color: "#7B5EA7",
    desc: "Manufacturing systems, operations research, and supply-chain optimisation.",
    tags: ["Core + Ops", "Management pivot", "Analytics"],
    branchCount: 9,
    stats: { jobGrowth: "Ops Demand", medianSalary: "₹13 LPA", aiRisk: 39 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Production & industrial engineering blends manufacturing with operations research, quality and supply-chain optimisation. It's a natural launchpad into operations, consulting, analytics and management roles.",
      coreSubjects: ["Operations Research", "Manufacturing Processes", "Quality Engineering", "Supply Chain & Logistics", "Industrial Automation", "Ergonomics"],
      outcomes: ["Operations / Supply-chain Engineer", "Industrial Engineer", "Consulting / Analytics", "Manufacturing (PLI sector)", "MBA pivot"],
    },
    insights: {
      skills: { coursework: 61, selfLearning: 39 },
      tierMatters: 50,
      research: [{ label: "Academic Pubs", value: 72 }, { label: "Industry R&D", value: 70 }, { label: "Lab Funding", value: 62 }],
      researchNote:
        "India's manufacturing push (PLI, 'Make in India') plus e-commerce supply chains have made operations and industrial-engineering skills highly employable across sectors.",
      salaryArc: {
        median: { entry: 14, y3: 21, y5: 29 },
        top:    { entry: 29, y3: 43, y5: 58 },
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
    name: "Naval Architecture & Ocean Engineering",
    icon: "Anchor",
    color: "#FF693D",
    desc: "Ship design, marine structures, and ocean & offshore engineering.",
    tags: ["Core-heavy", "Niche", "Defence / Marine"],
    branchCount: 6,
    stats: { jobGrowth: "Niche", medianSalary: "₹12 LPA", aiRisk: 31 },
    aiRiskLabel: "LOW RISK",
    academics: {
      summary:
        "Naval architecture and ocean engineering design ships, submarines, offshore platforms and marine structures. A small, specialised field with strong defence-shipbuilding and offshore-energy demand.",
      coreSubjects: ["Ship Hydrodynamics", "Marine Structures", "Ship Design", "Offshore Engineering", "Marine Propulsion", "Coastal Engineering"],
      outcomes: ["Naval Architect", "Marine / Offshore Engineer", "Shipyards (Cochin, MDL)", "Classification societies", "Higher studies (MS)"],
    },
    insights: {
      skills: { coursework: 69, selfLearning: 31 },
      tierMatters: 52,
      research: [{ label: "Academic Pubs", value: 76 }, { label: "Industry R&D", value: 64 }, { label: "Lab Funding", value: 70 }],
      researchNote:
        "India's shipbuilding and naval-modernisation push, plus offshore wind and oil platforms, sustains demand for a small but well-paid pool of specialists.",
      salaryArc: {
        median: { entry: 13, y3: 19, y5: 26 },
        top:    { entry: 28, y3: 40, y5: 54 },
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

/* ── Deep "rich-page" data, keyed by slug ──────────────────────────────
   Powers the upgraded BranchDetail layout: study-intensity meters, the
   where-graduates-land donut, tech-placement access, the 4-year curriculum
   journey, typical career roles (direct vs needs-prep) and top recruiters.
   Levels: HEAVY · MODERATE · LIGHT · MINIMAL. Numbers are indicative. ── */
export const BRANCH_DEEP = {
  "cs-it": {
    studyMeters: [{ label: "Coding", level: "HEAVY" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "HEAVY" }, { label: "Lab Work", level: "MINIMAL" }],
    outcomeSplit: [{ label: "IT / Software", pct: 72 }, { label: "Core roles", pct: 14 }, { label: "Higher studies", pct: 9 }, { label: "Other paths", pct: 5 }],
    placement: { headline: "Most tech roles open", note: "Standard tech recruitment targets CS/IT batches first. Zero barriers to entry." },
    careerRoles: [
      { role: "Software Development Engineer (SDE)", direct: true }, { role: "Frontend Engineer", direct: true },
      { role: "Backend Engineer", direct: true }, { role: "Full Stack Developer", direct: true },
      { role: "DevOps Engineer", direct: true }, { role: "Site Reliability Engineer", direct: true },
      { role: "Security Analyst", direct: true }, { role: "System Architect", direct: false },
      { role: "Database Administrator", direct: false }, { role: "Systems Researcher", direct: false },
    ],
    recruiters: ["Google", "Microsoft", "Amazon", "Adobe", "Flipkart"],
  },
  "ai-data-science": {
    studyMeters: [{ label: "Coding", level: "HEAVY" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "HEAVY" }, { label: "Lab Work", level: "LIGHT" }],
    outcomeSplit: [{ label: "AI / ML roles", pct: 62 }, { label: "Software", pct: 19 }, { label: "Higher studies", pct: 14 }, { label: "Other paths", pct: 5 }],
    placement: { headline: "Strong AI/ML demand", note: "Top labs and product teams recruit data-science cohorts early — strong project portfolios win." },
    careerRoles: [
      { role: "AI Engineer", direct: true }, { role: "ML Engineer", direct: true },
      { role: "Data Scientist", direct: true }, { role: "Data Analyst", direct: true },
      { role: "MLOps Engineer", direct: true }, { role: "NLP Engineer", direct: true },
      { role: "Computer Vision Engineer", direct: true }, { role: "Research Engineer", direct: false },
      { role: "Applied Scientist", direct: false }, { role: "Quant Researcher", direct: false },
    ],
    recruiters: ["Google", "Microsoft", "NVIDIA", "OpenAI", "Amazon"],
  },
  "electronics-electrical": {
    studyMeters: [{ label: "Coding", level: "MODERATE" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "HEAVY" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "Core electronics", pct: 47 }, { label: "Software", pct: 29 }, { label: "Higher studies", pct: 14 }, { label: "Other paths", pct: 10 }],
    placement: { headline: "Core + tech both open", note: "VLSI / embedded core roles plus a strong software pivot keep both doors open." },
    careerRoles: [
      { role: "VLSI Engineer", direct: true }, { role: "Embedded Engineer", direct: true },
      { role: "Hardware Engineer", direct: true }, { role: "Firmware Engineer", direct: true },
      { role: "Power Engineer", direct: true }, { role: "Software Engineer", direct: true },
      { role: "Chip Design Engineer", direct: false }, { role: "RF Engineer", direct: false },
      { role: "Verification Engineer", direct: false }, { role: "Control Systems Engineer", direct: false },
    ],
    recruiters: ["Intel", "Qualcomm", "Texas Instruments", "Samsung", "NVIDIA"],
  },
  "mechanical-robotics": {
    studyMeters: [{ label: "Coding", level: "LIGHT" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "MODERATE" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "Core / Manufacturing", pct: 52 }, { label: "Software / Analytics", pct: 19 }, { label: "Higher studies", pct: 19 }, { label: "Other paths", pct: 10 }],
    placement: { headline: "Broad core hiring", note: "Auto, EV, robotics and PSU recruiters hire widely; an analytics pivot is common." },
    careerRoles: [
      { role: "Design Engineer", direct: true }, { role: "Manufacturing Engineer", direct: true },
      { role: "Automotive Engineer", direct: true }, { role: "CAD / CAE Engineer", direct: true },
      { role: "Production Engineer", direct: true }, { role: "Quality Engineer", direct: true },
      { role: "Robotics Engineer", direct: false }, { role: "Mechatronics Engineer", direct: false },
      { role: "R&D Engineer", direct: false }, { role: "Project Engineer", direct: true },
      { role: "Automation Engineer", direct: true }, { role: "Thermal Engineer", direct: false }, { role: "Systems Analyst", direct: false },
    ],
    recruiters: ["Tata Motors", "Mahindra", "L&T", "Bosch", "Ola Electric", "Reliance Industries", "Maruti Suzuki", "Honda"],
  },
  "civil-architecture": {
    studyMeters: [{ label: "Coding", level: "MINIMAL" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "MODERATE" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "Core / Construction", pct: 57 }, { label: "Govt / PSU", pct: 19 }, { label: "Higher studies", pct: 14 }, { label: "Other paths", pct: 10 }],
    placement: { headline: "Infra + PSU stability", note: "Construction majors, design consultancies and PSUs (via GATE) hire steadily." },
    careerRoles: [
      { role: "Structural Engineer", direct: true }, { role: "Site Engineer", direct: true },
      { role: "Geotechnical Engineer", direct: true }, { role: "Transportation Engineer", direct: true },
      { role: "BIM Engineer", direct: true }, { role: "Surveyor", direct: true },
      { role: "Project Manager", direct: false }, { role: "Urban Planner", direct: false },
      { role: "Construction Manager", direct: false }, { role: "Govt / PSU Engineer", direct: false },
    ],
    recruiters: ["L&T", "AECOM", "Tata Projects", "Jacobs", "Afcons"],
  },
  "chemical": {
    studyMeters: [{ label: "Coding", level: "LIGHT" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "MODERATE" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "Process / Core", pct: 52 }, { label: "Analytics / Software", pct: 19 }, { label: "Higher studies", pct: 19 }, { label: "Other paths", pct: 10 }],
    placement: { headline: "Energy + pharma hiring", note: "Refineries, FMCG and pharma recruit core; analytics roles add a strong pivot." },
    careerRoles: [
      { role: "Process Engineer", direct: true }, { role: "Production Engineer", direct: true },
      { role: "Refinery Engineer", direct: true }, { role: "Pharma Engineer", direct: true },
      { role: "Quality Engineer", direct: true }, { role: "Process Safety Engineer", direct: false },
      { role: "Plant Design Engineer", direct: false }, { role: "Energy Analyst", direct: false },
      { role: "R&D Engineer", direct: false }, { role: "Data Analyst", direct: false },
    ],
    recruiters: ["Reliance", "IOCL", "Pfizer", "Asian Paints", "Unilever"],
  },
  "materials-mining": {
    studyMeters: [{ label: "Coding", level: "LIGHT" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "MODERATE" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "Core / Metallurgy", pct: 47 }, { label: "PSU", pct: 24 }, { label: "Higher studies", pct: 19 }, { label: "Other paths", pct: 10 }],
    placement: { headline: "PSU + R&D routes", note: "Steel, battery and semiconductor-materials firms plus PSUs absorb most graduates." },
    careerRoles: [
      { role: "Metallurgist", direct: true }, { role: "Materials Engineer", direct: true },
      { role: "Quality / Failure Engineer", direct: true }, { role: "Process Engineer", direct: true },
      { role: "Welding Engineer", direct: true }, { role: "NDT Engineer", direct: true },
      { role: "Battery / Semiconductor R&D", direct: false }, { role: "PSU Engineer", direct: false },
      { role: "R&D Scientist", direct: false }, { role: "Researcher", direct: false },
    ],
    recruiters: ["Tata Steel", "JSW", "SAIL", "Vedanta", "Hindalco"],
  },
  "biotech-biosciences": {
    studyMeters: [{ label: "Coding", level: "LIGHT" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "LIGHT" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "Pharma / R&D", pct: 42 }, { label: "Bioinformatics / SW", pct: 24 }, { label: "Higher studies", pct: 24 }, { label: "Other paths", pct: 10 }],
    placement: { headline: "Research-led + health-tech", note: "Pharma R&D, bioinformatics and health-tech roles; best outcomes pair biology with coding." },
    careerRoles: [
      { role: "Bioinformatics Engineer", direct: true }, { role: "Biomedical Engineer", direct: true },
      { role: "Bioprocess Engineer", direct: true }, { role: "Lab / QC Analyst", direct: true },
      { role: "Clinical Research Associate", direct: true }, { role: "Research Scientist", direct: false },
      { role: "Genomics Analyst", direct: false }, { role: "Data Analyst", direct: false },
      { role: "R&D Scientist", direct: false }, { role: "Regulatory Affairs", direct: false },
    ],
    recruiters: ["Biocon", "Dr. Reddy's", "Syngene", "Novartis", "GE Healthcare"],
  },
  "mathematics-computing": {
    studyMeters: [{ label: "Coding", level: "HEAVY" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "HEAVY" }, { label: "Lab Work", level: "MINIMAL" }],
    outcomeSplit: [{ label: "Software / ML", pct: 42 }, { label: "Quant / Finance", pct: 34 }, { label: "Higher studies", pct: 19 }, { label: "Other paths", pct: 5 }],
    placement: { headline: "Highest-paying roles", note: "Quant firms and global tech recruit top M&C cohorts at premium packages." },
    careerRoles: [
      { role: "Quant Developer", direct: true }, { role: "Software Engineer", direct: true },
      { role: "Data Scientist", direct: true }, { role: "ML Engineer", direct: true },
      { role: "Risk Analyst", direct: true }, { role: "Quant Analyst", direct: false },
      { role: "Quant Trader", direct: false }, { role: "Quant Researcher", direct: false },
      { role: "Actuary", direct: false }, { role: "Research Scientist", direct: false },
    ],
    recruiters: ["Tower Research", "Jane Street", "Goldman Sachs", "Optiver", "Google"],
  },
  "sciences-applied": {
    studyMeters: [{ label: "Coding", level: "MODERATE" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "HEAVY" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "Research / Core", pct: 42 }, { label: "Software / Data", pct: 29 }, { label: "Higher studies", pct: 24 }, { label: "Other paths", pct: 5 }],
    placement: { headline: "Deep-tech + software", note: "Engineering-physics cohorts place strongly in software, deep-tech and core R&D." },
    careerRoles: [
      { role: "Data Analyst", direct: true }, { role: "Software Engineer", direct: true },
      { role: "ML Engineer", direct: true }, { role: "Research Engineer", direct: false },
      { role: "Scientist", direct: false }, { role: "Semiconductor Engineer", direct: false },
      { role: "Photonics Engineer", direct: false }, { role: "R&D Engineer", direct: false },
      { role: "Quant / Analyst", direct: false }, { role: "Deep-tech Founder", direct: false },
    ],
    recruiters: ["ISRO", "BARC", "Intel", "Applied Materials", "TCS Research"],
  },
  "aerospace-avionics": {
    studyMeters: [{ label: "Coding", level: "MODERATE" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "HEAVY" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "Aerospace / Core", pct: 47 }, { label: "Software / CFD", pct: 24 }, { label: "Higher studies", pct: 24 }, { label: "Other paths", pct: 5 }],
    placement: { headline: "Space-sector growth", note: "ISRO, DRDO/HAL, NewSpace startups and CFD / auto-aero roles recruit widely." },
    careerRoles: [
      { role: "Aerospace Engineer", direct: true }, { role: "CFD Engineer", direct: true },
      { role: "Avionics Engineer", direct: true }, { role: "Structures Engineer", direct: true },
      { role: "Drone Engineer", direct: true }, { role: "Aircraft Design Engineer", direct: false },
      { role: "Propulsion Engineer", direct: false }, { role: "Space Systems Engineer", direct: false },
      { role: "GNC Engineer", direct: false }, { role: "Researcher", direct: false },
    ],
    recruiters: ["ISRO", "HAL", "DRDO", "Boeing", "Airbus"],
  },
  "mining-earth": {
    studyMeters: [{ label: "Coding", level: "MINIMAL" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "MODERATE" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "PSU / Mining", pct: 57 }, { label: "Mining-tech", pct: 14 }, { label: "Higher studies", pct: 19 }, { label: "Other paths", pct: 10 }],
    placement: { headline: "Top PSU packages", note: "Coal India, NMDC and metals majors offer among the highest core PSU pay." },
    careerRoles: [
      { role: "Mining Engineer", direct: true }, { role: "Mine Planner", direct: true },
      { role: "Safety Engineer", direct: true }, { role: "Operations Engineer", direct: true },
      { role: "Mineral Processing Engineer", direct: true }, { role: "Blasting Engineer", direct: true },
      { role: "Drone-Survey Engineer", direct: false }, { role: "Geotechnical Engineer", direct: false },
      { role: "PSU Engineer", direct: false }, { role: "Researcher", direct: false },
    ],
    recruiters: ["Coal India", "NMDC", "Vedanta", "Tata Steel", "Hindustan Zinc"],
  },
  "petroleum-energy": {
    studyMeters: [{ label: "Coding", level: "LIGHT" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "MODERATE" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "Oil & Gas", pct: 52 }, { label: "Renewables", pct: 14 }, { label: "Higher studies", pct: 24 }, { label: "Other paths", pct: 10 }],
    placement: { headline: "High-paying core", note: "Oil & gas majors pay top core packages; clean-energy adds a fast-growing track." },
    careerRoles: [
      { role: "Drilling Engineer", direct: true }, { role: "Production Engineer", direct: true },
      { role: "Energy Analyst", direct: true }, { role: "Renewables Engineer", direct: true },
      { role: "Field Engineer", direct: true }, { role: "Pipeline Engineer", direct: true },
      { role: "Reservoir Engineer", direct: false }, { role: "Petroleum Geologist", direct: false },
      { role: "Process Safety Engineer", direct: false }, { role: "Researcher", direct: false },
    ],
    recruiters: ["ONGC", "Shell", "Schlumberger", "Reliance", "IOCL"],
  },
  "production-industrial": {
    studyMeters: [{ label: "Coding", level: "LIGHT" }, { label: "Theory", level: "MODERATE" }, { label: "Math", level: "MODERATE" }, { label: "Lab Work", level: "MODERATE" }],
    outcomeSplit: [{ label: "Operations / Core", pct: 47 }, { label: "Analytics / Consulting", pct: 24 }, { label: "Higher studies / MBA", pct: 19 }, { label: "Other paths", pct: 10 }],
    placement: { headline: "Ops + analytics demand", note: "Manufacturing, e-commerce ops and consulting hire industrial engineers widely." },
    careerRoles: [
      { role: "Operations Engineer", direct: true }, { role: "Supply-chain Engineer", direct: true },
      { role: "Industrial Engineer", direct: true }, { role: "Quality Engineer", direct: true },
      { role: "Manufacturing Engineer", direct: true }, { role: "Planning Engineer", direct: true },
      { role: "Process Improvement Engineer", direct: true }, { role: "Analytics / Consulting", direct: false },
      { role: "Project Manager", direct: false }, { role: "MBA Pivot", direct: false },
    ],
    recruiters: ["Amazon", "Flipkart", "Tata Steel", "Maruti Suzuki", "Delhivery"],
  },
  "naval-ocean": {
    studyMeters: [{ label: "Coding", level: "LIGHT" }, { label: "Theory", level: "HEAVY" }, { label: "Math", level: "HEAVY" }, { label: "Lab Work", level: "HEAVY" }],
    outcomeSplit: [{ label: "Shipbuilding / Core", pct: 52 }, { label: "Offshore / Energy", pct: 19 }, { label: "Higher studies", pct: 24 }, { label: "Other paths", pct: 5 }],
    placement: { headline: "Shipbuilding + offshore", note: "Shipyards, classification societies and offshore energy hire a small, well-paid pool." },
    careerRoles: [
      { role: "Naval Architect", direct: true }, { role: "Marine Engineer", direct: true },
      { role: "Structural Engineer", direct: true }, { role: "CFD Engineer", direct: true },
      { role: "Offshore Engineer", direct: false }, { role: "Ship Design Engineer", direct: false },
      { role: "Classification Surveyor", direct: false }, { role: "Coastal Engineer", direct: false },
      { role: "R&D Engineer", direct: false }, { role: "Researcher", direct: false },
    ],
    recruiters: ["Cochin Shipyard", "Mazagon Dock", "L&T Shipbuilding", "ABS", "DNV"],
  },
};

/* ── Per-branch 4-year curriculum journey ──────────────────────────────
   Each branch has its OWN year-by-year progression (title · phase tag ·
   representative subjects), so the "4-year journey" reads correctly for
   every path instead of a generic template. ── */
export const BRANCH_JOURNEY = {
  "cs-it": [
    { title: "Common courses, settling in", tag: "FOUNDATION", subjects: ["Calculus & Linear Algebra", "Intro to Programming (C/Python)", "Basic Electronics", "Engineering Graphics", "Communication Skills"] },
    { title: "Core CS kicks in", tag: "CORE LOAD", subjects: ["Data Structures & Algorithms", "Discrete Mathematics", "Object-Oriented Programming", "Digital Logic Design", "Computer Organisation"] },
    { title: "Internship pressure + projects", tag: "PEAK PRESSURE", subjects: ["Theory of Computation", "Computer Networks", "Compiler Design", "Software Engineering", "DBMS", "Artificial Intelligence"] },
    { title: "Electives, placements, thesis", tag: "EXIT YEAR", subjects: ["Machine Learning", "Distributed Systems", "Cloud Computing", "Cyber Security", "Major Project / Thesis"] },
  ],
  "ai-data-science": [
    { title: "Maths & coding foundations", tag: "FOUNDATION", subjects: ["Calculus & Linear Algebra", "Probability & Statistics", "Intro to Programming", "Data Handling Basics", "Communication Skills"] },
    { title: "Algorithms + statistics core", tag: "CORE LOAD", subjects: ["Data Structures & Algorithms", "Statistical Inference", "Database Systems", "Optimization", "Python for Data Science"] },
    { title: "Modelling + internships", tag: "PEAK PRESSURE", subjects: ["Machine Learning", "Deep Learning", "Big Data Systems", "Data Visualisation", "Internships / Projects"] },
    { title: "Specialise, deploy, thesis", tag: "EXIT YEAR", subjects: ["Natural Language Processing", "Computer Vision", "MLOps & Deployment", "Reinforcement Learning", "Capstone / Thesis"] },
  ],
  "electronics-electrical": [
    { title: "Circuits & maths basics", tag: "FOUNDATION", subjects: ["Calculus & Differential Equations", "Basic Electrical Engineering", "Intro to Programming", "Engineering Physics", "Network Theory"] },
    { title: "Signals & devices core", tag: "CORE LOAD", subjects: ["Signals & Systems", "Analog Circuits", "Digital Electronics", "Electromagnetics", "Electrical Machines"] },
    { title: "Systems + internships", tag: "PEAK PRESSURE", subjects: ["Microprocessors", "Control Systems", "Communication Systems", "VLSI Design", "Internships / Projects"] },
    { title: "Electives, placements, thesis", tag: "EXIT YEAR", subjects: ["Embedded Systems", "Power Electronics", "Digital Signal Processing", "Electives", "Major Project / Thesis"] },
  ],
  "mechanical-robotics": [
    { title: "Mechanics & graphics basics", tag: "FOUNDATION", subjects: ["Engineering Mechanics", "Calculus", "Engineering Graphics / CAD", "Intro to Programming", "Workshop Practice"] },
    { title: "Thermal & solid core", tag: "CORE LOAD", subjects: ["Thermodynamics", "Strength of Materials", "Fluid Mechanics", "Kinematics of Machines", "Manufacturing Processes"] },
    { title: "Design + internships", tag: "PEAK PRESSURE", subjects: ["Heat Transfer", "Machine Design", "Dynamics of Machinery", "Robotics & Control", "Internships / Projects"] },
    { title: "Electives, placements, thesis", tag: "EXIT YEAR", subjects: ["Mechatronics", "CAD/CAM", "Industrial Automation", "Electives", "Major Project / Thesis"] },
  ],
  "civil-architecture": [
    { title: "Mechanics & materials basics", tag: "FOUNDATION", subjects: ["Engineering Mechanics", "Calculus", "Engineering Graphics", "Surveying Basics", "Building Materials"] },
    { title: "Structures & fluids core", tag: "CORE LOAD", subjects: ["Strength of Materials", "Fluid Mechanics", "Structural Analysis I", "Surveying", "Concrete Technology"] },
    { title: "Field work + internships", tag: "PEAK PRESSURE", subjects: ["Structural Analysis II", "Geotechnical Engineering", "Transportation Engineering", "Environmental Engineering", "Internships / Projects"] },
    { title: "Design, estimation, thesis", tag: "EXIT YEAR", subjects: ["Design of RCC & Steel Structures", "Construction Management", "Estimation & Costing", "Electives", "Major Project / Thesis"] },
  ],
  "chemical": [
    { title: "Balances & chemistry basics", tag: "FOUNDATION", subjects: ["Calculus", "Engineering Chemistry", "Intro to Programming", "Material & Energy Balances", "Engineering Graphics"] },
    { title: "Transport & thermo core", tag: "CORE LOAD", subjects: ["Fluid Mechanics", "Thermodynamics", "Heat Transfer", "Chemical Process Calculations", "Physical Chemistry"] },
    { title: "Reactions + internships", tag: "PEAK PRESSURE", subjects: ["Mass Transfer", "Reaction Engineering", "Process Control", "Transport Phenomena", "Internships / Projects"] },
    { title: "Plant design, safety, thesis", tag: "EXIT YEAR", subjects: ["Plant Design & Economics", "Process Safety", "Petrochemicals / Polymers", "Electives", "Major Project / Thesis"] },
  ],
  "materials-mining": [
    { title: "Science & maths basics", tag: "FOUNDATION", subjects: ["Calculus", "Engineering Chemistry", "Intro to Programming", "Materials Science Basics", "Crystallography"] },
    { title: "Metallurgy core", tag: "CORE LOAD", subjects: ["Physical Metallurgy", "Thermodynamics of Materials", "Mechanical Behaviour of Materials", "Mineral Processing", "Phase Diagrams"] },
    { title: "Processing + internships", tag: "PEAK PRESSURE", subjects: ["Phase Transformations", "Materials Characterization", "Extractive Metallurgy", "Mining Methods", "Internships / Projects"] },
    { title: "Advanced materials, thesis", tag: "EXIT YEAR", subjects: ["Nanomaterials", "Corrosion & Failure Analysis", "Welding Metallurgy", "Electives", "Major Project / Thesis"] },
  ],
  "biotech-biosciences": [
    { title: "Biology & maths basics", tag: "FOUNDATION", subjects: ["Biology Fundamentals", "Calculus & Statistics", "Intro to Programming", "General Chemistry", "Cell Biology"] },
    { title: "Biochemistry core", tag: "CORE LOAD", subjects: ["Biochemistry", "Microbiology", "Genetics", "Molecular Biology", "Bioprocess Principles"] },
    { title: "Engineering + internships", tag: "PEAK PRESSURE", subjects: ["Genetic Engineering", "Bioprocess Engineering", "Bioinformatics", "Immunology", "Internships / Projects"] },
    { title: "Genomics, scale-up, thesis", tag: "EXIT YEAR", subjects: ["Genomics & Proteomics", "Biomedical Engineering", "Bioprocess Scale-up", "Electives", "Major Project / Thesis"] },
  ],
  "mathematics-computing": [
    { title: "Analysis & coding basics", tag: "FOUNDATION", subjects: ["Real Analysis I", "Linear Algebra", "Intro to Programming", "Calculus", "Discrete Mathematics"] },
    { title: "Probability & algorithms core", tag: "CORE LOAD", subjects: ["Probability Theory", "Data Structures & Algorithms", "Real & Complex Analysis", "Abstract Algebra", "Numerical Methods"] },
    { title: "Quant + internships", tag: "PEAK PRESSURE", subjects: ["Stochastic Processes", "Optimization", "Mathematical Finance", "Statistical Inference", "Internships / Projects"] },
    { title: "Finance, ML, thesis", tag: "EXIT YEAR", subjects: ["Machine Learning", "Quantitative Finance", "Computational Methods", "Electives", "Major Project / Thesis"] },
  ],
  "sciences-applied": [
    { title: "Physics & maths basics", tag: "FOUNDATION", subjects: ["Calculus", "Classical Mechanics", "Intro to Programming", "Engineering Chemistry", "Mathematical Methods"] },
    { title: "Quantum & EM core", tag: "CORE LOAD", subjects: ["Quantum Mechanics", "Electromagnetism", "Thermodynamics & Stat Mech", "Mathematical Physics", "Electronics"] },
    { title: "Applied physics + internships", tag: "PEAK PRESSURE", subjects: ["Solid State Physics", "Computational Methods", "Photonics / Optics", "Atomic & Molecular Physics", "Internships / Projects"] },
    { title: "Deep-tech electives, thesis", tag: "EXIT YEAR", subjects: ["Semiconductor Physics", "Quantum Technologies", "Lasers & Photonics", "Electives", "Major Project / Thesis"] },
  ],
  "aerospace-avionics": [
    { title: "Mechanics & maths basics", tag: "FOUNDATION", subjects: ["Calculus & Differential Equations", "Engineering Mechanics", "Intro to Programming", "Engineering Graphics", "Thermodynamics Basics"] },
    { title: "Aerodynamics core", tag: "CORE LOAD", subjects: ["Fluid Mechanics", "Aerodynamics I", "Aerospace Structures", "Solid Mechanics", "Materials Science"] },
    { title: "Propulsion + internships", tag: "PEAK PRESSURE", subjects: ["Propulsion", "Flight Mechanics", "Aerodynamics II", "Control Systems", "Internships / Projects"] },
    { title: "Space systems, thesis", tag: "EXIT YEAR", subjects: ["Orbital Mechanics", "Avionics", "Spacecraft / Aircraft Design", "Electives", "Major Project / Thesis"] },
  ],
  "mining-earth": [
    { title: "Geology & mechanics basics", tag: "FOUNDATION", subjects: ["Calculus", "Engineering Mechanics", "Intro to Programming", "Geology Basics", "Engineering Graphics"] },
    { title: "Rock & survey core", tag: "CORE LOAD", subjects: ["Rock Mechanics", "Mine Surveying", "Mineral Processing", "Geotechnics", "Fluid Mechanics"] },
    { title: "Mine ops + internships", tag: "PEAK PRESSURE", subjects: ["Mine Planning & Design", "Mine Ventilation", "Drilling & Blasting", "Mine Safety Engineering", "Internships / Projects"] },
    { title: "Machinery, economics, thesis", tag: "EXIT YEAR", subjects: ["Mine Machinery", "Mineral Economics", "Mine Automation", "Electives", "Major Project / Thesis"] },
  ],
  "petroleum-energy": [
    { title: "Geology & balances basics", tag: "FOUNDATION", subjects: ["Calculus", "Engineering Chemistry", "Intro to Programming", "Geology Basics", "Material & Energy Balances"] },
    { title: "Reservoir & thermo core", tag: "CORE LOAD", subjects: ["Fluid Mechanics", "Thermodynamics", "Petroleum Geology", "Heat & Mass Transfer", "Reservoir Rock Properties"] },
    { title: "Drilling + internships", tag: "PEAK PRESSURE", subjects: ["Reservoir Engineering", "Drilling Technology", "Production Engineering", "Process Safety", "Internships / Projects"] },
    { title: "EOR, clean energy, thesis", tag: "EXIT YEAR", subjects: ["Enhanced Oil Recovery", "Energy Systems", "Renewables & Hydrogen", "Electives", "Major Project / Thesis"] },
  ],
  "production-industrial": [
    { title: "Mechanics & shop basics", tag: "FOUNDATION", subjects: ["Calculus", "Engineering Mechanics", "Intro to Programming", "Engineering Graphics", "Workshop Practice"] },
    { title: "Manufacturing & OR core", tag: "CORE LOAD", subjects: ["Manufacturing Processes", "Thermodynamics", "Strength of Materials", "Operations Research I", "Materials Science"] },
    { title: "Operations + internships", tag: "PEAK PRESSURE", subjects: ["Operations Research II", "Quality Engineering", "Supply Chain & Logistics", "Industrial Automation", "Internships / Projects"] },
    { title: "Planning, lean, thesis", tag: "EXIT YEAR", subjects: ["Production Planning & Control", "Ergonomics", "Lean & Six Sigma", "Electives", "Major Project / Thesis"] },
  ],
  "naval-ocean": [
    { title: "Mechanics & fluids basics", tag: "FOUNDATION", subjects: ["Calculus", "Engineering Mechanics", "Intro to Programming", "Engineering Graphics", "Fluid Mechanics Basics"] },
    { title: "Hydrostatics core", tag: "CORE LOAD", subjects: ["Ship Hydrostatics", "Strength of Materials", "Marine Hydrodynamics", "Thermodynamics", "Materials & Welding"] },
    { title: "Ship design + internships", tag: "PEAK PRESSURE", subjects: ["Ship Structures", "Ship Design", "Marine Propulsion", "Seakeeping & Maneuvering", "Internships / Projects"] },
    { title: "Offshore, production, thesis", tag: "EXIT YEAR", subjects: ["Offshore Engineering", "Ship Production Technology", "Coastal Engineering", "Electives", "Major Project / Thesis"] },
  ],
};

export const TOTAL_BRANCHES = BRANCHES.reduce((s, b) => s + (b.branchCount || 0), 0);

export function getBranch(slug) {
  const base = BRANCHES.find((b) => b.slug === slug);
  if (!base) return null;
  return { ...base, ...(BRANCH_DEEP[slug] || {}), journey: BRANCH_JOURNEY[slug] || null };
}
