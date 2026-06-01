import { useState } from "react";
import { EXAM_BY_SLUG } from "../data/exams.js";
import RankPredictorTool from "../components/predictor/RankPredictorTool.jsx";
import CollegePredictorTool from "../components/predictor/CollegePredictorTool.jsx";
import CounsellingCard from "../components/predictor/CounsellingCard.jsx";
import { EligibilityCards, RankingsTable } from "../components/predictor/AnalysisSections.jsx";
import { Bars, Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  Info, Atom, FlaskConical, Calculator, FileText,
  CheckCircle2, ArrowRight, Zap, MapPin, Globe,
  Star, Target, TrendingUp, TrendingDown, Building2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   DIFFICULTY DATA  (2021–2025)
   Paper 1 & Paper 2 difficulty indices (0 = easiest, 100 = hardest).
   Mathematics is the toughest subject every year.
═══════════════════════════════════════════════════════════ */
const DIFFICULTY_YEARS = [2021, 2022, 2023, 2024, 2025];

const DIFFICULTY_DATA = {
  2021: {
    p1: { phy: 72, chem: 52, math: 80 },
    p2: { phy: 78, chem: 62, math: 88 },
    p1Label: "Moderate-Hard",
    p2Label: "Hard",
    toughest: "Mathematics",
    keyTrend:
      "Mathematics in Paper 2 was extremely lengthy with complex integrals and coordinate geometry. Chemistry was the most approachable subject. Physics had conceptual questions on Optics and Mechanics, with Paper 2 the tougher half overall.",
    tags: ["Paper 2 tougher", "Maths very lengthy", "Chemistry approachable"],
  },
  2022: {
    p1: { phy: 76, chem: 45, math: 84 },
    p2: { phy: 85, chem: 58, math: 92 },
    p1Label: "Hard",
    p2Label: "Very Hard",
    toughest: "Mathematics",
    keyTrend:
      "One of the toughest years overall — Paper 2 Mathematics had multi-correct questions requiring deep calculus. Chemistry was the easiest subject. Physics had tricky Electrostatics and Modern Physics problems that hit hardest in Paper 2.",
    tags: ["Paper 2 tougher", "Maths multi-correct hard", "Chemistry easiest"],
  },
  2023: {
    p1: { phy: 74, chem: 62, math: 86 },
    p2: { phy: 80, chem: 72, math: 95 },
    p1Label: "Hard",
    p2Label: "Very Hard",
    toughest: "Mathematics",
    keyTrend:
      "Mathematics hit a 5-year difficulty high in Paper 2 with unconventional problem types. Chemistry became harder across both papers. Physics was balanced, but Paper 2 was the more demanding sitting.",
    tags: ["Paper 2 tougher", "Maths 5-year high", "Chemistry harder"],
  },
  2024: {
    p1: { phy: 82, chem: 52, math: 88 },
    p2: { phy: 88, chem: 62, math: 90 },
    p1Label: "Hard",
    p2Label: "Very Hard",
    toughest: "Mathematics",
    keyTrend:
      "Physics was the hardest in years — Modern Physics and Electromagnetic Induction dominated Paper 2. Maths remained very tough across both papers. Chemistry was the most scoring subject, and Paper 2 was clearly the harder half.",
    tags: ["Paper 2 tougher", "Physics hardest in years", "Maths very hard"],
  },
  2025: {
    p1: { phy: 78, chem: 58, math: 85 },
    p2: { phy: 83, chem: 65, math: 93 },
    p1Label: "Hard",
    p2Label: "Very Hard",
    toughest: "Mathematics",
    keyTrend:
      "Mathematics was exceptionally tough in Paper 2 with unconventional question types. Physics was application-based and lengthier in the second sitting. Chemistry remained the most scoring subject, but Paper 2 stayed the harder paper overall.",
    tags: ["Paper 2 tougher", "Maths unconventional", "Physics application-based"],
  },
};

/* ═══════════════════════════════════════════════════════════
   ORGANISING IIT — which IIT designed & conducted the paper.
   JEE Advanced rotates between 7 zonal IITs under the Joint
   Admission Board (JAB). History verified against jeeadv.ac.in
   & Wikipedia. Each setter IIT lends the paper its own flavour.
═══════════════════════════════════════════════════════════ */
const ORGANISING_IITS = {
  2018: { iit: "IIT Kanpur",    short: "IITK",   city: "Kanpur, UP",      color: "#0EA5A4", setterNote: "Concept-first paper with a fair Chemistry section." },
  2019: { iit: "IIT Roorkee",   short: "IITR",   city: "Roorkee, UK",     color: "#2563EB", setterNote: "Balanced across subjects; Maths on the lengthier side." },
  2020: { iit: "IIT Delhi",     short: "IITD",   city: "New Delhi",       color: "#DC2626", setterNote: "COVID-year paper; moderate overall with tricky Physics." },
  2021: { iit: "IIT Kharagpur", short: "IITKgp", city: "Kharagpur, WB",   color: "#7C3AED", setterNote: "Pushed more non-negative numerical-answer questions; Maths very lengthy." },
  2022: { iit: "IIT Bombay",    short: "IITB",   city: "Mumbai, MH",      color: "#0891B2", setterNote: "Set a brutal multi-correct Maths section — one of the toughest years." },
  2023: { iit: "IIT Guwahati",  short: "IITG",   city: "Guwahati, AS",    color: "#16A34A", setterNote: "Unconventional Maths problem types drove difficulty to a multi-year high." },
  2024: { iit: "IIT Madras",    short: "IITM",   city: "Chennai, TN",     color: "#EA580C", setterNote: "Physics turned unusually demanding; rich application-based framing." },
  2025: { iit: "IIT Kanpur",    short: "IITK",   city: "Kanpur, UP",      color: "#0EA5A4", setterNote: "Lengthy, unconventional Maths peaking in Paper 2; Chemistry stayed the scoring section." },
  2026: { iit: "IIT Roorkee",   short: "IITR",   city: "Roorkee, UK",     color: "#2563EB", setterNote: "Conducting JEE Advanced 2026 — expected to keep the 3-subject, dual-paper format." },
};

/* ═══════════════════════════════════════════════════════════
   PAPER CHARACTER — how Paper 1 vs Paper 2 differ in nature,
   question types and the strategy each demands. Independent of
   the year-wise difficulty index above.
═══════════════════════════════════════════════════════════ */
const PAPER_CHARACTER = [
  {
    paper: "Paper 1",
    time: "9:00 AM – 12:00 PM",
    rating: "Moderate → Difficult",
    color: "#F97316",
    bg: "#fff3e8",
    summary:
      "Generally rated Moderate to Difficult. It usually features a balanced mix of conceptual problems, with a higher tendency for non-negative numerical / integer-type questions where there is no negative marking.",
    points: [
      "Balanced mix of conceptual & application problems",
      "More non-negative numerical / integer-type questions",
      "Reward for accuracy — attempt every numerical (no negative marking on those)",
      "A good Paper 1 score builds the cushion before the tougher Paper 2",
    ],
  },
  {
    paper: "Paper 2",
    time: "2:30 PM – 5:30 PM",
    rating: "Consistently Difficult",
    color: "#7C3AED",
    bg: "#f3e8ff",
    summary:
      "Consistently rated Difficult. It heavily features multi-correct MCQs, paragraph-type questions and significantly lengthier calculations — designed to test stamina and time management in the second half of a long exam day.",
    points: [
      "Heavy on multi-correct MCQs — partial & negative marking traps",
      "Paragraph / comprehension-linked question sets",
      "Significantly lengthier, calculation-heavy problems",
      "A true test of stamina & time management — pace yourself",
    ],
  },
];

const TREND_PHYSICS   = DIFFICULTY_YEARS.map((y) => ({ year: y, Paper1: DIFFICULTY_DATA[y].p1.phy,  Paper2: DIFFICULTY_DATA[y].p2.phy  }));
const TREND_CHEMISTRY = DIFFICULTY_YEARS.map((y) => ({ year: y, Paper1: DIFFICULTY_DATA[y].p1.chem, Paper2: DIFFICULTY_DATA[y].p2.chem }));
const TREND_MATHS     = DIFFICULTY_YEARS.map((y) => ({ year: y, Paper1: DIFFICULTY_DATA[y].p1.math, Paper2: DIFFICULTY_DATA[y].p2.math }));

/* ═══════════════════════════════════════════════════════════
   JEE ADVANCED QUALIFYING CUTOFF MARKS (out of 360)
   Minimum aggregate marks to appear in the merit list.
   Source: jeeadv.ac.in official cutoff notifications 2021–2025.
   NOT the JEE Main percentile cutoff.
═══════════════════════════════════════════════════════════ */
const QUALIFYING_TREND = [
  { year: 2021, crl: 75,  obc_ews: 68, sc_st_pwd: 38 },
  { year: 2022, crl: 55,  obc_ews: 50, sc_st_pwd: 28 },
  { year: 2023, crl: 86,  obc_ews: 77, sc_st_pwd: 43 },
  { year: 2024, crl: 109, obc_ews: 98, sc_st_pwd: 54 },
  { year: 2025, crl: 74,  obc_ews: 66, sc_st_pwd: 37 },
];

/* Top IIT closing ranks (JoSAA 2025 Round 6) */
const COLLEGE_CUTOFFS = [
  { name: "IIT Bombay CSE",      crl: 63,   obc: 198,  sc: 341  },
  { name: "IIT Delhi CSE",       crl: 89,   obc: 274,  sc: 498  },
  { name: "IIT Madras CSE",      crl: 119,  obc: 356,  sc: 610  },
  { name: "IIT Kanpur CSE",      crl: 142,  obc: 412,  sc: 724  },
  { name: "IIT Kharagpur CSE",   crl: 225,  obc: 689,  sc: 1082 },
  { name: "IIT Roorkee CSE",     crl: 271,  obc: 847,  sc: 1396 },
];

/* Syllabus */
const SYLLABUS = {
  Physics: {
    color: "#F97316", icon: Atom,
    topics: [
      "Mechanics — Kinematics, Laws of Motion, Work & Energy",
      "Rotational Motion — Moment of Inertia, Angular Momentum",
      "Gravitation — Kepler's Laws, Orbital Velocity",
      "Fluid Mechanics & Thermal Physics",
      "Waves & Optics — Diffraction, Interference, Polarisation",
      "Electricity & Magnetism — Gauss Law, Biot-Savart",
      "Modern Physics — Photoelectric Effect, Nuclear Physics",
      "Electronics — Logic Gates, Semiconductors",
    ],
  },
  Chemistry: {
    color: "#0EA5A4", icon: FlaskConical,
    topics: [
      "Physical Chemistry — Thermodynamics, Equilibrium, Kinetics",
      "Atomic Structure & Chemical Bonding",
      "States of Matter — Solid, Liquid, Gas",
      "Electrochemistry & Solutions",
      "Organic Chemistry — IUPAC, Isomerism, Reaction Mechanisms",
      "Named Reactions — Aldol, Cannizzaro, Grignard",
      "Inorganic Chemistry — d-block, Coordination Compounds",
      "Biomolecules — Carbohydrates, Proteins, Polymers",
    ],
  },
  Mathematics: {
    color: "#7C3AED", icon: Calculator,
    topics: [
      "Algebra — Complex Numbers, Matrices, Determinants",
      "Sequences & Series — AP, GP, Binomial Theorem",
      "Trigonometry — Multiple Angles, Inverse Functions",
      "Coordinate Geometry — Circles, Conics, 3D",
      "Calculus — Limits, Derivatives, Definite Integrals",
      "Differential Equations — Variable Separable, Linear",
      "Vectors & 3D Geometry",
      "Probability & Statistics",
    ],
  },
};

/* Roadmap */
const ROADMAP = [
  {
    month: "Jun–Aug", label: "Foundation & NCERT Mastery", color: "#F97316", icon: "📚",
    tip: "Complete NCERT Physics & Chemistry thoroughly. Solve H.C. Verma Part 1 (Chapters 1–15). Build concept clarity over speed — JEE Advanced tests deep understanding, not shortcuts.",
    tasks: [
      "NCERT Physics Class 11 — all chapters with derivations",
      "NCERT Chemistry Class 11 — mole concept, thermodynamics",
      "H.C. Verma Vol 1: Mechanics & Fluid Mechanics",
      "RD Sharma / SL Loney Trigonometry basics",
      "Target: 6–8 hrs/day structured study",
    ],
    resources: ["H.C. Verma Vol 1", "NCERT 11 Physics & Chemistry", "SL Loney Trigonometry"],
  },
  {
    month: "Sep–Nov", label: "Core Concepts & Problem Solving", color: "#0EA5A4", icon: "🔬",
    tip: "Dive into Irodov for Physics. Master all Organic reaction mechanisms chapter by chapter. Start Coordinate Geometry. Take weekly chapter tests to gauge retention.",
    tasks: [
      "Irodov Problems in General Physics (selected)",
      "Organic Chemistry — Morrison & Boyd reaction mechanisms",
      "Inorganic Chemistry — JD Lee (d-block, coordination)",
      "Coordinate Geometry — Circles, Parabola, Ellipse",
      "Physical Chemistry — Electrochemistry, Solutions",
    ],
    resources: ["Irodov", "Morrison & Boyd", "JD Lee Inorganic", "Arihant Algebra"],
  },
  {
    month: "Dec–Feb", label: "Advanced Topics & Integration", color: "#7C3AED", icon: "📐",
    tip: "Cover Class 12 Physics (Electrostatics to Modern Physics), 3D Geometry, Vectors, Differential Equations. Start solving previous year JEE Advanced papers from 2015 onwards.",
    tasks: [
      "Electrostatics, Current Electricity, Magnetism (full)",
      "Wave Optics — Interference, Diffraction, Polarisation",
      "3D Geometry, Vectors, Definite Integration",
      "Differential Equations & Probability",
      "Solve JEE Advanced PYQs (2015–2020)",
    ],
    resources: ["DC Pandey Electricity", "ML Khanna Maths", "FIITJEE Study Material"],
  },
  {
    month: "Mar–Apr", label: "Full Mock Tests & Weak Area Fix", color: "#EC4899", icon: "📝",
    tip: "Attempt full Paper 1 + Paper 2 mocks every weekend (3-hour blocks each). Analyse errors subject-wise. Avoid starting new topics — deepen existing ones. Maintain accuracy over speed.",
    tasks: [
      "2 full mocks per week (Paper 1 + Paper 2 format)",
      "Error log: note every mistake with reason",
      "Revise Physical Chemistry (most scoring for rank)",
      "Speed drills on Maths numerical answer questions",
      "Past 5 years JEE Advanced papers under exam conditions",
    ],
    resources: ["Allen/Resonance test series", "JEE Advanced PYQ 2020–2024", "Disha 41 Years PYQ"],
  },
  {
    month: "May", label: "Revision Sprint & Formula Lock", color: "#EAB308", icon: "⚡",
    tip: "No new topics. Revise all named reactions, important formulas, and theorems. Solve 1 mock per day. Focus on sections where you drop marks — negative marking in JEE Advanced is heavy.",
    tasks: [
      "Formula sheets for all 3 subjects — daily revision",
      "Named Reactions list: Aldol, Cannizzaro, Grignard, etc.",
      "Important theorems: Gauss, Biot-Savart, Rolle's",
      "Solve 1 full mock daily in exam-day conditions",
      "Sleep 7–8 hrs — exam is a 2-paper marathon",
    ],
    resources: ["Self-made formula sheets", "Resonance/Allen rapid revision booklets"],
  },
  {
    month: "Exam Day", label: "JEE Advanced — Paper 1 & Paper 2", color: "#15A06E", icon: "🎯",
    tip: "Paper 1: 9:00 AM – 12:00 PM. Paper 2: 2:30 PM – 5:30 PM. Eat light between papers. Attempt your strongest subject first within each paper. Never leave numerical questions blank — no negative marking.",
    tasks: [
      "Reach exam centre 45 mins early",
      "Attempt Chemistry first (quickest, boosts confidence)",
      "Skip and return to uncertain MCQs — time management",
      "Numerical answer type: attempt all (no negative marks)",
      "Between papers: rest, light food, no discussing answers",
    ],
    resources: ["Admit card", "Valid photo ID", "Stationery as per JEE guidelines"],
  },
];

/* Coaching institutes */
const COACHING = [
  {
    name: "Allen Career Institute", city: "Kota, Rajasthan", color: "#F97316", badge: "🏆 #1 Results",
    highlights: [
      "Largest coaching institute for IIT-JEE in India",
      "Classroom + Distance learning (DLPD) programs",
      "JEE Advanced selections: 3000+ per year",
      "Dropper batch, 2-year integrated available",
    ],
    website: "https://www.allen.ac.in", fee: "₹1.5L – ₹2.8L/year", mode: "Offline / Online",
  },
  {
    name: "Resonance", city: "Kota, Rajasthan", color: "#7C3AED", badge: "⭐ Top IIT Results",
    highlights: [
      "Known for strongest Physics & Maths faculty",
      "ResoFAST scholarship exam for fee waiver",
      "Online e-Resonance platform with live classes",
      "All-India test series widely used by self-studiers",
    ],
    website: "https://www.resonance.ac.in", fee: "₹1.2L – ₹2.5L/year", mode: "Offline / Online",
  },
  {
    name: "FIITJEE", city: "Delhi (30+ centres)", color: "#0EA5A4", badge: "🎓 Legacy Brand",
    highlights: [
      "Pioneer in IIT-JEE coaching since 1992",
      "FTRE scholarship exam for admission",
      "Integrated school programs (Class 8–12)",
      "Strong focus on conceptual depth over shortcuts",
    ],
    website: "https://www.fiitjee.com", fee: "₹1.8L – ₹3.2L/year", mode: "Offline / Online",
  },
  {
    name: "Narayana", city: "Hyderabad + Pan India", color: "#EC4899", badge: "📍 Pan-India Network",
    highlights: [
      "500+ centres across India",
      "Strong in South India — excellent SC/ST results",
      "Integrated school + coaching model",
      "Affordable fee structure with scholarships",
    ],
    website: "https://www.narayanaiit.com", fee: "₹80K – ₹1.8L/year", mode: "Offline",
  },
  {
    name: "Vedantu / Unacademy", city: "Online (Pan India)", color: "#15A06E", badge: "💻 Best Online",
    highlights: [
      "Live interactive classes with top IIT alumni faculty",
      "Affordable vs offline Kota coaching",
      "Recorded lectures, doubt sessions, test series",
      "Unacademy ICONIC / Vedantu VSAT for top batches",
    ],
    website: "https://www.vedantu.com", fee: "₹40K – ₹1.2L/year", mode: "Online",
  },
  {
    name: "Sri Chaitanya", city: "Hyderabad + AP/Telangana", color: "#EAB308", badge: "🌟 Residential Option",
    highlights: [
      "Best residential/hostel JEE coaching in South India",
      "Pinnacle & Super 30 batches for top rankers",
      "Strong Chemistry faculty — best for Organic",
      "Scholarship-based admission for merit students",
    ],
    website: "https://srichaitanya.net", fee: "₹1L – ₹2.2L/year", mode: "Offline / Residential",
  },
];

/* ── Helpers ── */
function diffIndex(val) {
  if (val >= 80) return { label: "Very Hard", color: "#EF4444", bg: "#fee2e2" };
  if (val >= 70) return { label: "Hard",      color: "#F97316", bg: "#fff3e8" };
  if (val >= 60) return { label: "Medium",    color: "#EAB308", bg: "#fefce8" };
  return               { label: "Easy",      color: "#15A06E", bg: "#d1fae5" };
}
function labelMeta(label) {
  if (label === "Very Hard")      return { color: "#EF4444", bg: "#fee2e2" };
  if (label.includes("Hard"))    return { color: "#F97316", bg: "#fff3e8" };
  return                                { color: "#15A06E", bg: "#d1fae5" };
}

/* ── Shared section wrapper ── */
function Block({ id, eyebrow, title, sub, children, bg }) {
  return (
    <section id={id} className="section" style={{ scrollMarginTop: 90, background: bg || "transparent" }}>
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title">{title}</h2>
          {sub && <p className="section-sub">{sub}</p>}
        </div>
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}

/* ── Animated bar chart for Paper 1 / Paper 2 ── */
function SubjectBar({ label, p1, p2, animate }) {
  const maxVal = 100;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: "var(--navy)" }}>{label}</span>
        <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--muted)" }}>
          <span style={{ color: "#F97316", fontWeight: 700 }}>P1: {p1}</span>
          <span style={{ color: "#7C3AED", fontWeight: 700 }}>P2: {p2}</span>
        </div>
      </div>
      <div style={{ marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--muted)", minWidth: 60 }}>Paper 1</span>
          <div style={{ flex: 1, height: 10, borderRadius: 6, background: "#f0f0f5", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: animate ? `${(p1 / maxVal) * 100}%` : "0%",
              background: "linear-gradient(90deg, #F97316, #fb923c)",
              borderRadius: 6,
              transition: "width 0.9s cubic-bezier(.4,0,.2,1)",
            }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, minWidth: 50, textAlign: "right", color: diffIndex(p1).color }}>
            {diffIndex(p1).label}
          </span>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--muted)", minWidth: 60 }}>Paper 2</span>
          <div style={{ flex: 1, height: 10, borderRadius: 6, background: "#f0f0f5", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: animate ? `${(p2 / maxVal) * 100}%` : "0%",
              background: "linear-gradient(90deg, #7C3AED, #a855f7)",
              borderRadius: 6,
              transition: "width 0.9s cubic-bezier(.4,0,.2,1) 0.15s",
            }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, minWidth: 50, textAlign: "right", color: diffIndex(p2).color }}>
            {diffIndex(p2).label}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Animated "Organising IIT" banner — shows which IIT designed
      and conducted the paper for the selected year. ── */
function OrganiserBanner({ year }) {
  const org = ORGANISING_IITS[year];
  if (!org) return null;
  return (
    <div
      key={`org-${year}`}
      className="org-banner"
      style={{
        background: `linear-gradient(135deg, ${org.color} 0%, ${org.color}cc 60%, ${org.color}99 100%)`,
        borderRadius: 18,
        padding: "22px 26px",
        marginBottom: 22,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 14px 40px ${org.color}33`,
      }}
    >
      {/* decorative animated glow */}
      <div className="org-glow" style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,.28) 0%, transparent 55%)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        {/* IIT seal / crest */}
        <div className="org-seal" style={{
          width: 64, height: 64, borderRadius: 16, flexShrink: 0,
          display: "grid", placeItems: "center",
          background: "rgba(255,255,255,.18)", border: "2px solid rgba(255,255,255,.4)",
          backdropFilter: "blur(4px)",
        }}>
          <span style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 18, color: "#fff", letterSpacing: ".5px" }}>
            {org.short}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>
              <Building2 size={13} style={{ display: "inline", marginRight: 5, marginBottom: -2 }} />
              Paper set &amp; conducted by
            </span>
          </div>
          <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: "#fff", lineHeight: 1.1 }}>
            {org.iit}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 13, color: "rgba(255,255,255,.9)" }}>
            <MapPin size={13} /> {org.city} &nbsp;·&nbsp; JEE Advanced {year}
          </div>
        </div>

        <div style={{
          flexShrink: 0, maxWidth: 320, fontSize: 12.5, lineHeight: 1.55,
          color: "rgba(255,255,255,.95)", borderLeft: "2px solid rgba(255,255,255,.35)",
          paddingLeft: 14, fontStyle: "italic",
        }}>
          "{org.setterNote}"
        </div>
      </div>
    </div>
  );
}

/* ── Qualifying marks mini-bar ── */
function MarksBar({ label, value, color, maxValue = 120 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: "var(--muted)", minWidth: 90, fontWeight: 600 }}>{label}</span>
      <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#f0f0f5", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${(value / maxValue) * 100}%`,
          background: color,
          borderRadius: 4,
          transition: "width 0.8s ease",
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color, minWidth: 56, textAlign: "right", fontFamily: "Sora" }}>{value} marks</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Main Page Component
════════════════════════════════════════════════════════════ */
export default function JeeAdvanced() {
  const exam = EXAM_BY_SLUG["jee-advanced"];
  const [selectedYear, setSelectedYear] = useState(2025);
  const [animateBars, setAnimateBars] = useState(true);
  const d = DIFFICULTY_DATA[selectedYear];

  const subjectBars = [
    { name: "Physics",   Paper1: d.p1.phy,  Paper2: d.p2.phy  },
    { name: "Chemistry", Paper1: d.p1.chem, Paper2: d.p2.chem },
    { name: "Maths",     Paper1: d.p1.math, Paper2: d.p2.math },
  ];

  function handleYearChange(y) {
    setAnimateBars(false);
    setTimeout(() => {
      setSelectedYear(y);
      setAnimateBars(true);
    }, 60);
  }

  return (
    <div className="page">

      {/* ── Global Styles ── */}
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.95)}      to{opacity:1;transform:scale(1)}      }
        @keyframes pulseRingAdv {
          0%   { box-shadow: 0 0 0 0 rgba(124,58,237,.4); }
          70%  { box-shadow: 0 0 0 10px rgba(124,58,237,0); }
          100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); }
        }
        .fade-up   { animation: fadeUp  .44s cubic-bezier(.4,0,.2,1) both; }
        .scale-in  { animation: scaleIn .36s cubic-bezier(.4,0,.2,1) both; }
        .d1 { animation-delay: .04s }
        .d2 { animation-delay: .10s }
        .year-active-adv { animation: pulseRingAdv 1.2s ease; }

        /* Organising-IIT banner */
        @keyframes orgIn   { from{opacity:0;transform:translateY(14px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes orgGlow { 0%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} 100%{opacity:.5;transform:scale(1)} }
        @keyframes sealPop { from{transform:scale(.6) rotate(-8deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        .org-banner { animation: orgIn .5s cubic-bezier(.34,1.56,.64,1) both; }
        .org-glow   { position:absolute; inset:0; animation: orgGlow 4s ease-in-out infinite; pointer-events:none; }
        .org-seal   { animation: sealPop .55s cubic-bezier(.34,1.56,.64,1) .08s both; }
        @media (max-width: 640px) {
          .org-banner [style*="border-left"] { border-left:none !important; padding-left:0 !important; }
        }

        /* Paper-setting IIT timeline strip */
        .org-pill {
          flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 10px 14px; border-radius: 14px; cursor: pointer;
          border: 1.5px solid var(--line); background: #fff;
          transition: transform .18s, box-shadow .18s, border-color .18s;
          min-width: 92px;
        }
        .org-pill:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,.1); }
        .org-pill.is-active { color: #fff; border-color: transparent; box-shadow: 0 8px 22px rgba(0,0,0,.18); }

        .card-hover { transition: transform .2s, box-shadow .2s; cursor: default; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,.09); }

        .diff-tag-adv {
          display: inline-block;
          font-size: 11px; font-weight: 700;
          padding: 4px 11px; border-radius: 50px;
          background: rgba(124,58,237,.10); color: #5b21b6;
          border: 1px solid rgba(124,58,237,.22);
          margin: 3px 3px 3px 0; letter-spacing: .2px;
        }

        .marks-card {
          background: var(--sky);
          border-radius: 14px;
          padding: 16px 20px;
          border: 1px solid var(--line);
          transition: transform .2s, box-shadow .2s;
        }
        .marks-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.06); }

        .yr-row-adv:hover td { background: #f5f3ff !important; }
        .qty-row-adv:hover td { background: #f0f9ff !important; }

        .nav-pill-adv {
          background: rgba(124,58,237,.11); border: 1px solid rgba(124,58,237,.3);
          color: #5b21b6; padding: 8px 16px; border-radius: 50px;
          font-size: 13px; font-weight: 600; text-decoration: none;
          transition: all 0.18s;
        }
        .nav-pill-adv:hover { background: #7C3AED; color: #fff; border-color: #7C3AED; }

        .section-divider-adv {
          height: 3px;
          background: linear-gradient(90deg, #F97316 0%, #7C3AED 40%, #0EA5A4 70%, #EC4899 100%);
          border-radius: 2px; margin: 0;
        }
        @media (max-width: 720px) {
          .paper-char-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="warm-page-header" style={{ padding: "56px 0 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 20%, rgba(124,58,237,.18) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 50% at 0% 90%, rgba(167,139,250,.14) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow" style={{ marginBottom: 14, display: "inline-flex" }}>JEE Advanced 2026</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.8rem)", margin: "0 0 10px", lineHeight: 1.2, color: "#1c1c28" }}>
            JEE Advanced — IIT Rank &amp; Seat Predictor Hub
          </h1>
          <p style={{ color: "rgba(28,28,40,.62)", maxWidth: 620, marginBottom: 28 }}>
            Estimate your IIT rank, find which IIT branches you qualify for, analyse Paper 1 &amp; 2 difficulty subject-wise, and explore the complete syllabus, study roadmap &amp; top coaching options.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              ["#rank","Rank Predictor"],["#college","College Predictor"],["#cutoffs","IIT Cutoffs"],
              ["#difficulty","Difficulty"],["#syllabus","Syllabus"],["#roadmap","Roadmap"],
              ["#coaching","Coaching"],["#trend","Cutoff Trends"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="nav-pill-adv">{label}</a>
            ))}
          </div>
        </div>
      </section>
      <div className="section-divider-adv" />

      {/* ── IIT Closing Rank Quick-Stats ── */}
      <section id="cutoffs" style={{ background: "var(--sky)", padding: "32px 0", scrollMarginTop: 90 }}>
        <div className="container">
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 18, marginBottom: 2 }}>📊 Top IIT Closing Ranks</h3>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>JoSAA 2025 Round 6 — verify on josaa.nic.in</span>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table" style={{ minWidth: 560 }}>
              <thead>
                <tr>
                  <th>College &amp; Branch</th>
                  <th style={{ textAlign: "center" }}>CRL (General)</th>
                  <th style={{ textAlign: "center" }}>OBC-NCL</th>
                  <th style={{ textAlign: "center" }}>SC</th>
                </tr>
              </thead>
              <tbody>
                {COLLEGE_CUTOFFS.map((c) => (
                  <tr key={c.name} className="yr-row-adv">
                    <td><strong style={{ color: "var(--navy)" }}>{c.name}</strong></td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "Sora", fontWeight: 800, color: "#7C3AED", fontSize: 14 }}>AIR {c.crl}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "Sora", fontWeight: 800, color: "#F97316", fontSize: 14 }}>AIR {c.obc}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "Sora", fontWeight: 800, color: "#0EA5A4", fontSize: 14 }}>AIR {c.sc}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <div className="container" style={{ marginTop: 18 }}>
        <div className="info-banner">
          <Info size={18} />
          Illustrative 2026 data modelled on historical trends — verify at jeeadv.ac.in and josaa.nic.in.
          <strong style={{ marginLeft: "auto", color: "#5b21b6" }}>JEE Advanced: Paper 1 (9 AM) &amp; Paper 2 (2:30 PM) on the same day</strong>
        </div>
      </div>

      {/* ── Rank Predictor ── */}
      <Block id="rank" eyebrow="Tool 1" title="JEE Advanced Rank Predictor"
        sub="Enter your expected marks for Paper 1 and Paper 2 to estimate your All India Rank.">
        <RankPredictorTool accent="#7C3AED" advanced />
      </Block>

      {/* ── College Predictor ── */}
      <div style={{ background: "var(--sky)" }}>
        <Block id="college" eyebrow="Tool 2" title="IIT College &amp; Branch Predictor"
          sub="See which IIT branches you can secure across all 6 JoSAA rounds. IITs do not participate in CSAB." bg="transparent">
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#fff8ed", border: "1px solid #f97316",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            fontSize: 13, color: "#92400e",
          }}>
            <span style={{ fontSize: 18 }}>⏳</span>
            <span>
              <strong>Please wait 1–2 minutes</strong> while colleges load. If your browser shows a "Page Unresponsive" pop-up, click <strong>"Wait"</strong> — do <em>not</em> click "Exit Page".
            </span>
          </div>
          <div className="predictor-layout" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <CollegePredictorTool basePath="/jee-advanced" />
            </div>
            <CounsellingCard exam="advanced" />
          </div>
        </Block>
      </div>

      {/* ════════════════════════════════════════════════════════
          DIFFICULTY ANALYSIS
      ════════════════════════════════════════════════════════ */}
      <section id="difficulty" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">

          <div className="title-bar">
            <span className="eyebrow">Paper Analysis · 2021–2025</span>
            <h2 className="section-title">Paper-wise Difficulty &amp; the IIT Behind Each Year</h2>
            <p className="section-sub">
              Select a year to see <strong>which IIT set the paper</strong> and compare Physics, Chemistry &amp;
              Maths difficulty across both papers. Qualitative labels from official post-exam analysis.
              Index: 0 = easiest · 100 = hardest.
            </p>
          </div>

          {/* ── Paper 1 vs Paper 2 — Character & Strategy ── */}
          <div className="paper-char-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 34 }}>
            {PAPER_CHARACTER.map((p) => (
              <div key={p.paper}
                className="card card-hover fade-up"
                style={{ borderTop: `4px solid ${p.color}`, padding: "20px 22px" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 11,
                      background: `${p.color}18`, color: p.color, flexShrink: 0,
                    }}>
                      <FileText size={20} />
                    </span>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, color: "var(--navy)" }}>{p.paper}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{p.time}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 800, padding: "5px 13px", borderRadius: 50,
                    background: p.bg, color: p.color, whiteSpace: "nowrap",
                  }}>
                    {p.rating}
                  </span>
                </div>

                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, marginBottom: 14 }}>{p.summary}</p>

                <div style={{ fontSize: 11, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>
                  What to expect
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {p.points.map((pt) => (
                    <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "var(--navy)", lineHeight: 1.5 }}>
                      <CheckCircle2 size={15} color={p.color} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Year Selector ── */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-flex", gap: 6,
              background: "var(--sky)", padding: 6, borderRadius: 50,
              border: "1px solid var(--line)",
              boxShadow: "0 2px 12px rgba(0,0,0,.05)",
            }}>
              {DIFFICULTY_YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => handleYearChange(y)}
                  className={selectedYear === y ? "year-active-adv" : ""}
                  style={{
                    padding: "9px 24px", borderRadius: 50, fontWeight: 700, fontSize: 14,
                    border: "none", cursor: "pointer", fontFamily: "Sora",
                    background: selectedYear === y ? "linear-gradient(135deg,#7C3AED,#a855f7)" : "transparent",
                    color: selectedYear === y ? "#fff" : "var(--navy)",
                    boxShadow: selectedYear === y ? "0 4px 16px rgba(124,58,237,.35)" : "none",
                    transition: "all 0.22s",
                  }}
                >{y}</button>
              ))}
            </div>
          </div>

          {/* ── Organising IIT Banner (which IIT set the paper) ── */}
          <OrganiserBanner year={selectedYear} />

          {/* ── Paper Overall Badges ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            {[
              { paper: "Paper 1", label: d.p1Label, vals: d.p1, delay: "d1" },
              { paper: "Paper 2", label: d.p2Label, vals: d.p2, delay: "d2" },
            ].map(({ paper, label, vals, delay }) => {
              const meta = labelMeta(label);
              const avg  = Math.round((vals.phy + vals.chem + vals.math) / 3);
              return (
                <div key={paper}
                  className={`card card-hover scale-in ${delay}`}
                  style={{ borderTop: `4px solid ${meta.color}`, padding: "22px 26px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                        {paper} Overall · JEE Advanced {selectedYear}
                      </div>
                      <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: "clamp(1.3rem,2.5vw,1.8rem)", color: meta.color, lineHeight: 1.1 }}>
                        {label}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 28, color: meta.color }}>{avg}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>Avg Index</div>
                    </div>
                  </div>
                  <div style={{ height: 10, borderRadius: 6, background: "#e5e7eb", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 6,
                      background: `linear-gradient(90deg,${meta.color}88,${meta.color})`,
                      width: animateBars ? `${avg}%` : "0%",
                      transition: "width 1s cubic-bezier(.4,0,.2,1)",
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                    Average difficulty index across Physics, Chemistry &amp; Maths
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Subject Cards with inline animated bars ── */}
          <div className="card" style={{ padding: "26px 28px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, marginBottom: 3 }}>
                  Subject Difficulty Breakdown · {selectedYear}
                </h4>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>
                  Higher index = more difficult &nbsp;·&nbsp; Toughest: <strong style={{ color: "#7C3AED" }}>{d.toughest}</strong> every year
                </p>
              </div>
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#F97316", display: "inline-block" }} />Paper 1
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#7C3AED", display: "inline-block" }} />Paper 2
                </span>
              </div>
            </div>
            <SubjectBar label="⚛ Physics"   p1={d.p1.phy}  p2={d.p2.phy}  animate={animateBars} />
            <SubjectBar label="⚗ Chemistry" p1={d.p1.chem} p2={d.p2.chem} animate={animateBars} />
            <SubjectBar label="∑ Maths"     p1={d.p1.math} p2={d.p2.math} animate={animateBars} />
          </div>

          {/* ── Grouped Bar Chart ── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <h4 style={{ fontFamily: "Sora", fontWeight: 700 }}>
                Paper 1 vs Paper 2 — All Subjects · {selectedYear}
              </h4>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Higher bar = more difficult</span>
            </div>
            <Bars
              key={`bars-${selectedYear}`}
              data={subjectBars}
              bars={[
                { key: "Paper1", label: "Paper 1", color: "#F97316" },
                { key: "Paper2", label: "Paper 2", color: "#7C3AED" },
              ]}
              height={280}
            />
          </div>

          {/* ── Key Trends Card ── */}
          <div className="card fade-up" style={{ borderLeft: "4px solid #7C3AED", padding: "20px 24px", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>💡</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
                  Key Trends — JEE Advanced {selectedYear}
                </h4>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 12 }}>{d.keyTrend}</p>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 11, color: "#7C3AED", marginRight: 6, textTransform: "uppercase", letterSpacing: .5 }}>
                    <TrendingUp size={12} style={{ display: "inline", marginRight: 4 }} />Highlights:
                  </span>
                  {d.tags.map((tag) => (
                    <span key={tag} className="diff-tag-adv">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Year-wise Summary Table ── */}
          <div>
            <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, marginBottom: 14 }}>📋 Year-wise Difficulty Summary (2021–2025)</h4>
            <div className="card" style={{ overflowX: "auto" }}>
              <table className="data-table" style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Organising IIT</th>
                    <th>Paper 1 Difficulty</th>
                    <th>Paper 2 Difficulty</th>
                    <th>Toughest Subject</th>
                    <th>Key Trends</th>
                  </tr>
                </thead>
                <tbody>
                  {DIFFICULTY_YEARS.map((y) => {
                    const row = DIFFICULTY_DATA[y];
                    const m1  = labelMeta(row.p1Label);
                    const m2  = labelMeta(row.p2Label);
                    const org = ORGANISING_IITS[y];
                    return (
                      <tr key={y} className="yr-row-adv">
                        <td>
                          <strong style={{ fontFamily: "Sora", fontSize: 15, color: selectedYear === y ? "#7C3AED" : "var(--navy)" }}>
                            {y}{selectedYear === y ? " ◀" : ""}
                          </strong>
                        </td>
                        <td>
                          {org && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                              <span style={{
                                width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                                display: "grid", placeItems: "center",
                                background: `${org.color}18`, color: org.color,
                                fontFamily: "Sora", fontWeight: 800, fontSize: 9,
                              }}>{org.short}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>{org.iit}</span>
                            </span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 11px", borderRadius: 50, background: m1.bg, color: m1.color }}>
                            {row.p1Label}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 11px", borderRadius: 50, background: m2.bg, color: m2.color }}>
                            {row.p2Label}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: "#7C3AED", fontSize: 13 }}>{row.toughest}</span>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, maxWidth: 300 }}>{row.keyTrend}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Paper-setting IITs Over the Years (clickable timeline) ── */}
          <div style={{ marginTop: 30 }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, marginBottom: 4 }}>
              🏛️ Which IIT Sets the Paper — Rotation Timeline
            </h4>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
              JEE Advanced rotates between the 7 zonal IITs under the Joint Admission Board.
              Tap a year with analysis data to load its breakdown above.
            </p>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
              {Object.keys(ORGANISING_IITS).map((yr) => {
                const y = Number(yr);
                const org = ORGANISING_IITS[y];
                const hasData = DIFFICULTY_YEARS.includes(y);
                const active = selectedYear === y;
                return (
                  <button
                    key={y}
                    onClick={() => hasData && handleYearChange(y)}
                    className={`org-pill${active ? " is-active" : ""}`}
                    style={{
                      background: active ? `linear-gradient(135deg,${org.color},${org.color}bb)` : "#fff",
                      borderColor: active ? "transparent" : "var(--line)",
                      cursor: hasData ? "pointer" : "default",
                      opacity: hasData ? 1 : 0.62,
                    }}
                    title={hasData ? `View ${y} analysis` : `${org.iit} — ${y}`}
                  >
                    <span style={{
                      width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center",
                      background: active ? "rgba(255,255,255,.22)" : `${org.color}18`,
                      color: active ? "#fff" : org.color,
                      fontFamily: "Sora", fontWeight: 900, fontSize: 11,
                    }}>{org.short}</span>
                    <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, color: active ? "#fff" : "var(--navy)" }}>{y}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: active ? "rgba(255,255,255,.9)" : "var(--muted)", whiteSpace: "nowrap" }}>
                      {org.iit.replace("IIT ", "")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5-YEAR DIFFICULTY TREND
      ════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">5-Year Trend</span>
            <h2 className="section-title">Subject Difficulty Trend (2021–2025)</h2>
            <p className="section-sub">
              How Paper 1 &amp; Paper 2 difficulty has shifted per subject over 5 years.
              Mathematics toughest every year; Chemistry consistently most scoring.
            </p>
          </div>

          <div className="grid-3" style={{ gap: 22, marginBottom: 22 }}>
            {[
              { label: "Physics",   data: TREND_PHYSICS,   c1: "#F97316", c2: "#fdba74", note: "Rising steadily — application-based Modern Physics and EMI problems increasing" },
              { label: "Chemistry", data: TREND_CHEMISTRY, c1: "#0EA5A4", c2: "#5eead4", note: "Most scoring subject consistently — Named reactions and Physical Chemistry key" },
              { label: "Maths",     data: TREND_MATHS,     c1: "#7C3AED", c2: "#c084fc", note: "Toughest every year — multi-correct calculus and 3D Geometry dominate" },
            ].map(({ label, data, c1, c2, note }) => (
              <div key={label} className="card card-hover">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, color: c1 }}>{label}</h4>
                  <div style={{ display: "flex", gap: 10, fontSize: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c1, display: "inline-block" }} />P1
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c2, display: "inline-block" }} />P2
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 }}>{note}</p>
                <Trend
                  data={data}
                  lines={[
                    { key: "Paper1", label: "Paper 1", color: c1 },
                    { key: "Paper2", label: "Paper 2", color: c2 },
                  ]}
                  height={200}
                />
              </div>
            ))}
          </div>

          {/* Trend insight mini cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[
              { icon: "⚛", color: "#F97316", title: "Physics",   stat: "↑ +10 pts", sub: "Index rose from ~78 (2021) to ~83 (2025 P2) — Modern Physics and EMI harder each year, peaking in Paper 2" },
              { icon: "⚗", color: "#0EA5A4", title: "Chemistry", stat: "↑ +8 pts",  sub: "Mild increase overall — still the most scoring; focus on Named Reactions and Physical Chem" },
              { icon: "∑",  color: "#7C3AED", title: "Maths",    stat: "↑ +5 pts",  sub: "Consistently toughest — multi-correct calculus and 3D geometry questions are critical" },
            ].map(({ icon, color, title, stat, sub }) => (
              <div key={title} className="card" style={{ borderLeft: `4px solid ${color}`, padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13 }}>{title}</div>
                    <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 18, color }}>{stat}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          QUALIFYING MARKS TREND  (out of 360)
      ════════════════════════════════════════════════════════ */}
      <section id="trend" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Cutoff Trends · 2021–2025</span>
            <h2 className="section-title">JEE Advanced — 5-Year Aggregate Qualifying Cutoff</h2>
            <p className="section-sub">
              Official minimum aggregate marks (out of 360, Paper 1 + Paper 2 combined) required to secure a rank in the JEE Advanced merit list.
              <strong> Source: jeeadv.ac.in official cutoff notifications.</strong>
            </p>
          </div>

          {/* Latest year quick visual */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { cat: "CRL (General)", key: "crl",       color: "#7C3AED" },
              { cat: "OBC-NCL & EWS", key: "obc_ews",   color: "#F97316" },
              { cat: "SC / ST / PwD", key: "sc_st_pwd", color: "#0EA5A4" },
            ].map(({ cat, key, color }) => {
              const latest = QUALIFYING_TREND[QUALIFYING_TREND.length - 1];
              const prev   = QUALIFYING_TREND[QUALIFYING_TREND.length - 2];
              const val    = latest[key];
              const diff   = val - prev[key];
              const isUp   = diff >= 0;
              return (
                <div key={cat} className="marks-card fade-up" style={{ borderTop: `4px solid ${color}` }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>{cat}</div>
                  <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 26, color, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 8 }}>marks (2025) / 360</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: isUp ? "#EF4444" : "#15A06E" }}>
                    {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {isUp ? "+" : ""}{diff} vs 2024
                  </div>
                  <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: "#e5e7eb", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(val / 180) * 100}%`, background: color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card">
            {/* Data table */}
            <div style={{ overflowX: "auto", marginBottom: 24 }}>
              <table className="data-table" style={{ minWidth: 520, fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th style={{ textAlign: "center" }}>CRL (General)</th>
                    <th style={{ textAlign: "center" }}>OBC-NCL &amp; GEN-EWS</th>
                    <th style={{ textAlign: "center" }}>SC, ST &amp; PwD</th>
                  </tr>
                </thead>
                <tbody>
                  {QUALIFYING_TREND.map((row) => (
                    <tr key={row.year} className="qty-row-adv">
                      <td><strong style={{ fontFamily: "Sora", fontSize: 14 }}>{row.year}</strong></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 800, color: "#7C3AED" }}>{row.crl} marks</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#F97316" }}>{row.obc_ews} marks</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#0EA5A4" }}>{row.sc_st_pwd} marks</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Per-category mini bars for latest year */}
            <div style={{ marginBottom: 20, padding: "16px 20px", background: "var(--sky)", borderRadius: 12, border: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, marginBottom: 14, color: "var(--navy)" }}>
                📊 2025 Qualifying Marks — Category Visual (out of 360)
              </div>
              <MarksBar label="CRL (General)"  value={74} color="#7C3AED" maxValue={180} />
              <MarksBar label="OBC-NCL / EWS"  value={66} color="#F97316" maxValue={180} />
              <MarksBar label="SC / ST / PwD"  value={37} color="#0EA5A4" maxValue={180} />
            </div>

            <Trend
              data={QUALIFYING_TREND}
              lines={[
                { key: "crl",       label: "CRL (General)",     color: "#7C3AED" },
                { key: "obc_ews",   label: "OBC-NCL & GEN-EWS", color: "#F97316" },
                { key: "sc_st_pwd", label: "SC, ST & PwD",      color: "#0EA5A4" },
              ]}
              height={320}
            />

            {/* Key insights */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
              <div style={{ padding: "12px 16px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fca5a5" }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#EF4444", marginBottom: 4 }}>📈 2024 peak cutoff</div>
                <div style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.5 }}>
                  CRL cutoff reached 109 marks in 2024 — the highest in 5 years, reflecting an easier paper that year.
                </div>
              </div>
              <div style={{ padding: "12px 16px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #86efac" }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#15A06E", marginBottom: 4 }}>📉 2025 sharp drop</div>
                <div style={{ fontSize: 12, color: "#14532d", lineHeight: 1.5 }}>
                  2025 saw a significant dip to 74 marks (CRL) — a ~32% drop from 2024 due to markedly harder papers.
                </div>
              </div>
            </div>

            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14, textAlign: "center" }}>
              * Official cutoff marks from jeeadv.ac.in. Total marks out of 360 (Paper 1 + Paper 2). Verify latest at{" "}
              <a href="https://jeeadv.ac.in" target="_blank" rel="noreferrer" style={{ color: "#7C3AED", fontWeight: 600 }}>
                jeeadv.ac.in
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SYLLABUS
      ════════════════════════════════════════════════════════ */}
      <section id="syllabus" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Syllabus</span>
            <h2 className="section-title">Complete JEE Advanced Syllabus</h2>
            <p className="section-sub">Both papers test the same syllabus with different question types — multi-correct MCQs, numerical answer, match-the-column &amp; paragraph questions.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Total Papers", value: "2",       sub: "Paper 1 + Paper 2",  color: "#7C3AED" },
              { label: "Total Marks",  value: "360",     sub: "180 per paper",      color: "#F97316" },
              { label: "Duration",     value: "3 hrs",   sub: "per paper (6 hrs total)", color: "#0EA5A4" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="card" style={{ textAlign: "center", borderTop: `4px solid ${color}`, padding: "20px 12px" }}>
                <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 32, color }}>{value}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</div>
              </div>
            ))}
          </div>

          <div className="grid-3" style={{ gap: 22, marginBottom: 24 }}>
            {Object.entries(SYLLABUS).map(([subj, { color, icon: Icon, topics }]) => (
              <div key={subj} className="card card-hover" style={{ borderTop: `4px solid ${color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "grid", placeItems: "center" }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17 }}>{subj}</h3>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{topics.length} major topic areas</div>
                  </div>
                </div>
                {topics.map((t) => (
                  <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, marginBottom: 8 }}>
                    <CheckCircle2 size={15} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
                <a href="https://jeeadv.ac.in/brochure.html" target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 13, fontWeight: 600, color }}>
                  <FileText size={14} /> Official Syllabus <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            {[
              {
                title: "Paper 1 — Question Types",
                color: "#F97316",
                types: [
                  "MCQ — Single Correct (3 marks, −1 penalty)",
                  "MCQ — Multiple Correct (4 marks, partial credit)",
                  "Numerical Answer Type (4 marks, no negative marking)",
                ],
              },
              {
                title: "Paper 2 — Question Types",
                color: "#7C3AED",
                types: [
                  "MCQ — Single Correct (3 marks, −1 penalty)",
                  "MCQ — Multiple Correct (4 marks, partial credit)",
                  "Match the Column (3–4 marks, partial marking)",
                  "Paragraph / Comprehension based questions",
                ],
              },
            ].map(({ title, color, types }) => (
              <div key={title} className="card" style={{ borderLeft: `4px solid ${color}` }}>
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, color, marginBottom: 12 }}>{title}</h4>
                {types.map((t) => (
                  <div key={t} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13 }}>
                    <Zap size={14} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "var(--navy)" }}>{t}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STUDY ROADMAP
      ════════════════════════════════════════════════════════ */}
      <section id="roadmap" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Study Roadmap</span>
            <h2 className="section-title">12-Month JEE Advanced Preparation Roadmap</h2>
            <p className="section-sub">Step-by-step plan with specific tasks, books and daily targets — from foundation through exam day.</p>
          </div>

          <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0, width: 3,
              background: "linear-gradient(180deg,#F97316,#0EA5A4,#7C3AED,#EC4899,#EAB308,#15A06E)",
              transform: "translateX(-50%)", borderRadius: 4,
            }} />
            {ROADMAP.map((step, i) => (
              <div key={step.month} style={{ display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end", marginBottom: 36, position: "relative" }}>
                <div style={{
                  position: "absolute", left: "50%", top: 28, transform: "translateX(-50%)",
                  width: 22, height: 22, borderRadius: "50%",
                  background: step.color, border: "3px solid #fff",
                  boxShadow: `0 0 0 4px ${step.color}44`, zIndex: 1,
                }} />
                <div className="card card-hover" style={{
                  width: "44%", borderTop: `4px solid ${step.color}`, padding: "20px 22px",
                  marginLeft: i % 2 === 0 ? 0 : "auto",
                  marginRight: i % 2 === 0 ? "auto" : 0,
                }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{step.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: step.color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{step.month}</div>
                  <h4 style={{ fontFamily: "Sora", fontWeight: 800, marginBottom: 8, fontSize: 15 }}>{step.label}</h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, marginBottom: 12 }}>{step.tip}</p>
                  <div style={{ borderTop: `1px solid ${step.color}22`, paddingTop: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>
                      <Target size={11} style={{ display: "inline", marginRight: 4 }} />Key Tasks
                    </div>
                    {step.tasks.map((task) => (
                      <div key={task} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12, marginBottom: 5 }}>
                        <CheckCircle2 size={13} color={step.color} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{task}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {step.resources.map((r) => (
                      <span key={r} style={{
                        fontSize: 11, padding: "3px 9px", borderRadius: 50,
                        background: `${step.color}14`, color: step.color, fontWeight: 600,
                        border: `1px solid ${step.color}33`,
                      }}>{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Book list */}
          <div className="card" style={{ marginTop: 16, background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "1px solid rgba(124,58,237,.2)" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 800, marginBottom: 16, color: "#1a1a2e" }}>📚 Complete Book List — JEE Advanced</h4>
            <div className="grid-3" style={{ gap: 14 }}>
              {[
                { subj: "Physics",   books: ["H.C. Verma Vol 1 & 2 (must)", "Irodov Problems in General Physics", "DC Pandey (Series)", "FIITJEE Physics Study Material"], color: "#F97316" },
                { subj: "Chemistry", books: ["NCERT 11 & 12 (mandatory base)", "JD Lee Inorganic Chemistry", "Morrison & Boyd Organic", "Narendra Awasthi Physical Chem"], color: "#0EA5A4" },
                { subj: "Maths",     books: ["RD Sharma / SL Loney Trigonometry", "ML Khanna IIT Mathematics", "FIITJEE Maths Study Material", "Arihant 41 Years PYQ"], color: "#7C3AED" },
              ].map(({ subj, books, color }) => (
                <div key={subj} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${color}`, boxShadow: "0 1px 8px rgba(0,0,0,.05)" }}>
                  <div style={{ fontWeight: 800, color, marginBottom: 8, fontSize: 14 }}>{subj}</div>
                  {books.map((b) => (
                    <div key={b} style={{ fontSize: 12, color: "#374151", marginBottom: 5 }}>• {b}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          COACHING INSTITUTES
      ════════════════════════════════════════════════════════ */}
      <section id="coaching" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Top Coaching</span>
            <h2 className="section-title">Best Coaching Institutes for JEE Advanced</h2>
            <p className="section-sub">India's top coaching options — offline Kota institutes, pan-India centres &amp; online platforms. Choose based on your city, budget &amp; learning style.</p>
          </div>
          <div className="grid-3" style={{ gap: 22 }}>
            {COACHING.map((c) => (
              <div key={c.name} className="card card-hover" style={{ borderTop: `4px solid ${c.color}`, padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, marginBottom: 3 }}>{c.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)" }}>
                      <MapPin size={12} /> {c.city}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50, background: `${c.color}18`, color: c.color, whiteSpace: "nowrap" }}>
                    {c.badge}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 50, background: "#f3f4f6", color: "var(--navy)", fontWeight: 600 }}>💰 {c.fee}</span>
                  <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 50, background: "#f3f4f6", color: "var(--navy)", fontWeight: 600 }}>🖥 {c.mode}</span>
                </div>
                {c.highlights.map((h) => (
                  <div key={h} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12, marginBottom: 6 }}>
                    <CheckCircle2 size={13} color={c.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{h}</span>
                  </div>
                ))}
                <a href={c.website} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 13, fontWeight: 600, color: c.color }}>
                  <Globe size={13} /> Visit Website <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 20, borderLeft: "4px solid #7C3AED", padding: "16px 20px" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 800, marginBottom: 10, fontSize: 15 }}>💡 How to Choose the Right Coaching for JEE Advanced</h4>
            <div className="grid-2" style={{ gap: 12 }}>
              {[
                { title: "For Kota (Offline)",       tip: "Allen or Resonance if you can relocate. Best peer environment, highly structured. Go for dropper batch after Class 12 if needed." },
                { title: "For Home City (Offline)",  tip: "FIITJEE, Narayana, Sri Chaitanya have centres in most metros. Choose based on batch size — smaller = more attention." },
                { title: "For Online (Budget)",      tip: "Vedantu / Unacademy offer top faculty at a fraction of cost. Requires strong self-discipline. Best combined with test series." },
                { title: "Self Study + Test Series", tip: "Viable for disciplined students. Use Allen/Resonance test series (₹8K–15K) + YouTube (Etoos, PW) + PYQ books." },
              ].map(({ title, tip }) => (
                <div key={title} style={{ display: "flex", gap: 10 }}>
                  <Star size={15} color="#7C3AED" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Eligibility ── */}
      <div style={{ background: "transparent" }}>
        <Block id="eligibility" eyebrow="Eligibility" title="Who can appear for JEE Advanced?"
          sub="Key eligibility criteria at a glance.">
          <EligibilityCards exam={exam} />
        </Block>
      </div>

      {/* ── IIT Rankings ── */}
      <div style={{ background: "var(--sky)" }}>
        <Block id="iit-rankings" eyebrow="NIRF Rankings" title="Top IITs by Ranking &amp; Placements"
          sub="Sort by NIRF rank, average package or placement percentage." bg="transparent">
          <RankingsTable type="IIT" />
        </Block>
      </div>
    </div>
  );
}
