import { useState } from "react";
import { EXAM_BY_SLUG } from "../data/exams.js";
import RankPredictorTool from "../components/predictor/RankPredictorTool.jsx";
import CollegePredictorTool from "../components/predictor/CollegePredictorTool.jsx";
import { EligibilityCards, RankingsTable } from "../components/predictor/AnalysisSections.jsx";
import { Bars, Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  Info, Atom, FlaskConical, Calculator, FileText,
  CheckCircle2, ArrowRight, Zap, MapPin, Phone, Globe,
  Star, BookOpen, Clock, Target, Award, Users,
} from "lucide-react";

/* ── Shift-wise difficulty data (Paper 1 & Paper 2, 2021–2025) ── */
const DIFFICULTY_YEARS = [2021, 2022, 2023, 2024, 2025];

const DIFFICULTY_DATA = {
  2021: { p1: { phy: 78, chem: 52, math: 88 }, p2: { phy: 72, chem: 62, math: 80 } },
  2022: { p1: { phy: 85, chem: 45, math: 92 }, p2: { phy: 76, chem: 58, math: 84 } },
  2023: { p1: { phy: 80, chem: 68, math: 95 }, p2: { phy: 74, chem: 72, math: 86 } },
  2024: { p1: { phy: 88, chem: 55, math: 90 }, p2: { phy: 82, chem: 62, math: 88 } },
  2025: { p1: { phy: 83, chem: 60, math: 93 }, p2: { phy: 78, chem: 65, math: 85 } },
};

const TREND_PHYSICS   = DIFFICULTY_YEARS.map((y) => ({ year: y, Paper1: DIFFICULTY_DATA[y].p1.phy,  Paper2: DIFFICULTY_DATA[y].p2.phy  }));
const TREND_CHEMISTRY = DIFFICULTY_YEARS.map((y) => ({ year: y, Paper1: DIFFICULTY_DATA[y].p1.chem, Paper2: DIFFICULTY_DATA[y].p2.chem }));
const TREND_MATHS     = DIFFICULTY_YEARS.map((y) => ({ year: y, Paper1: DIFFICULTY_DATA[y].p1.math, Paper2: DIFFICULTY_DATA[y].p2.math }));

/*
  JEE Advanced official aggregate qualifying cutoff marks (out of 360).
  Columns: CRL (Common Rank List) | OBC-NCL & GEN-EWS | SC, ST & PwD
  Source: jeeadv.ac.in official cutoff notifications 2021–2025.
  These are the minimum marks to appear in the JEE Advanced rank/merit list.
  NOT related to JEE Main percentile cutoff.

  Year  CRL              OBC-NCL & GEN-EWS   SC, ST & PwD
  2025  74 (20.56%)      66                  37
  2024  109 (30.34%)     98 (27.30%)         54 (15.17%)
  2023  86 (23.89%)      77                  43
  2022  55 (15.28%)      50                  28
  2021  75 (20.83%)      68                  38
*/
const QUALIFYING_TREND = [
  { year: 2021, crl: 75, obc_ews: 68, sc_st_pwd: 38 },
  { year: 2022, crl: 55, obc_ews: 50, sc_st_pwd: 28 },
  { year: 2023, crl: 86, obc_ews: 77, sc_st_pwd: 43 },
  { year: 2024, crl: 109, obc_ews: 98, sc_st_pwd: 54 },
  { year: 2025, crl: 74, obc_ews: 66, sc_st_pwd: 37 },
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

/* ── Enhanced Roadmap with deeper info ── */
const ROADMAP = [
  {
    month: "Jun–Aug",
    label: "Foundation & NCERT Mastery",
    color: "#F97316",
    icon: "📚",
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
    month: "Sep–Nov",
    label: "Core Concepts & Problem Solving",
    color: "#0EA5A4",
    icon: "🔬",
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
    month: "Dec–Feb",
    label: "Advanced Topics & Integration",
    color: "#7C3AED",
    icon: "📐",
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
    month: "Mar–Apr",
    label: "Full Mock Tests & Weak Area Fix",
    color: "#EC4899",
    icon: "📝",
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
    month: "May",
    label: "Revision Sprint & Formula Lock",
    color: "#EAB308",
    icon: "⚡",
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
    month: "Exam Day",
    label: "JEE Advanced — Paper 1 & Paper 2",
    color: "#15A06E",
    icon: "🎯",
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

/* ── Top Coaching Institutes for JEE Advanced ── */
const COACHING = [
  {
    name: "Allen Career Institute",
    city: "Kota, Rajasthan",
    color: "#F97316",
    badge: "🏆 #1 Results",
    highlights: [
      "Largest coaching institute for IIT-JEE in India",
      "Classroom + Distance learning (DLPD) programs",
      "JEE Advanced selections: 3000+ per year",
      "Dropper batch, 2-year integrated available",
    ],
    website: "https://www.allen.ac.in",
    fee: "₹1.5L – ₹2.8L/year",
    mode: "Offline / Online",
  },
  {
    name: "Resonance",
    city: "Kota, Rajasthan",
    color: "#7C3AED",
    badge: "⭐ Top IIT Results",
    highlights: [
      "Known for strongest Physics & Maths faculty",
      "ResoFAST scholarship exam for fee waiver",
      "Online e-Resonance platform with live classes",
      "All-India test series widely used by self-studiers",
    ],
    website: "https://www.resonance.ac.in",
    fee: "₹1.2L – ₹2.5L/year",
    mode: "Offline / Online",
  },
  {
    name: "FIITJEE",
    city: "Delhi (30+ centres)",
    color: "#0EA5A4",
    badge: "🎓 Legacy Brand",
    highlights: [
      "Pioneer in IIT-JEE coaching since 1992",
      "FTRE scholarship exam for admission",
      "Integrated school programs (Class 8–12)",
      "Strong focus on conceptual depth over shortcuts",
    ],
    website: "https://www.fiitjee.com",
    fee: "₹1.8L – ₹3.2L/year",
    mode: "Offline / Online",
  },
  {
    name: "Narayana",
    city: "Hyderabad + Pan India",
    color: "#EC4899",
    badge: "📍 Pan-India Network",
    highlights: [
      "500+ centres across India",
      "Strong in South India — excellent SC/ST results",
      "Integrated school + coaching model",
      "Affordable fee structure with scholarships",
    ],
    website: "https://www.narayanaiit.com",
    fee: "₹80K – ₹1.8L/year",
    mode: "Offline",
  },
  {
    name: "Vedantu / Unacademy",
    city: "Online (Pan India)",
    color: "#15A06E",
    badge: "💻 Best Online",
    highlights: [
      "Live interactive classes with top IIT alumni faculty",
      "Affordable vs offline Kota coaching",
      "Recorded lectures, doubt sessions, test series",
      "Unacademy ICONIC / Vedantu VSAT for top batches",
    ],
    website: "https://www.vedantu.com",
    fee: "₹40K – ₹1.2L/year",
    mode: "Online",
  },
  {
    name: "Sri Chaitanya",
    city: "Hyderabad + AP/Telangana",
    color: "#EAB308",
    badge: "🌟 Residential Option",
    highlights: [
      "Best residential/hostel JEE coaching in South India",
      "Pinnacle & Super 30 batches for top rankers",
      "Strong Chemistry faculty — best for Organic",
      "Scholarship-based admission for merit students",
    ],
    website: "https://srichaitanya.net",
    fee: "₹1L – ₹2.2L/year",
    mode: "Offline / Residential",
  },
];

/* ── Syllabus data */
const SYLLABUS_ENTRIES = Object.entries(SYLLABUS);

function diffLabel(val) {
  if (val >= 80) return { label: "Very Hard", color: "#EF4444" };
  if (val >= 70) return { label: "Hard",      color: "#F97316" };
  if (val >= 60) return { label: "Medium",    color: "#EAB308" };
  return              { label: "Easy",        color: "#15A06E" };
}

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

/* ══════════════════════════════════════════════════════════════
   Main Page
══════════════════════════════════════════════════════════════ */
export default function JeeAdvanced() {
  const exam = EXAM_BY_SLUG["jee-advanced"];
  const [selectedYear, setSelectedYear] = useState(2025);
  const d = DIFFICULTY_DATA[selectedYear];

  const subjectBars = [
    { name: "Physics",   Paper1: d.p1.phy,  Paper2: d.p2.phy  },
    { name: "Chemistry", Paper1: d.p1.chem, Paper2: d.p2.chem },
    { name: "Maths",     Paper1: d.p1.math, Paper2: d.p2.math },
  ];

  return (
    <div className="page">

      {/* ── Hero ── */}
      <section className="warm-page-header" style={{ padding: "56px 0 48px" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 20%, rgba(249,115,22,.22) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 50% at 0% 80%, rgba(244,162,97,.20) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow" style={{ marginBottom: 14, display: "inline-flex" }}>JEE Advanced 2026</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.8rem)", margin: "0 0 10px", lineHeight: 1.2, color: "#1c1c28" }}>
            JEE Advanced — IIT Rank &amp; Seat Predictor
          </h1>
          <p style={{ color: "rgba(28,28,40,.62)", maxWidth: 620, marginBottom: 28 }}>
            Estimate your IIT rank, find which IIT branches you qualify for, analyse Paper 1 &amp; 2 difficulty subject-wise, and explore the complete syllabus, study roadmap &amp; top coaching options.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              ["#rank","Rank Predictor"],
              ["#college","College Predictor"],
              ["#difficulty","Difficulty Analysis"],
              ["#syllabus","Syllabus"],
              ["#roadmap","Roadmap"],
              ["#coaching","Coaching"],
              ["#trend","Cutoff Trends"],
            ].map(([href, label]) => (
              <a key={href} href={href} style={{
                background: "rgba(244,123,32,.12)", backdropFilter: "blur(4px)",
                border: "1px solid rgba(244,123,32,.32)", color: "#c75b0a",
                padding: "8px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                transition: "all 0.2s", textDecoration: "none",
              }}
              onMouseEnter={e => { e.target.style.background = "#F47B20"; e.target.style.color = "#fff"; e.target.style.borderColor = "#F47B20"; }}
              onMouseLeave={e => { e.target.style.background = "rgba(244,123,32,.12)"; e.target.style.color = "#c75b0a"; e.target.style.borderColor = "rgba(244,123,32,.32)"; }}
              >{label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <div className="container" style={{ marginTop: 18 }}>
        <div className="info-banner">
          <Info size={18} />
          Illustrative 2026 data modelled on historical trends — verify on jeeadv.ac.in and josaa.nic.in.
          <strong style={{ marginLeft: "auto", color: "#9a5a18" }}>JEE Advanced: Only Paper 1 &amp; Paper 2 (no Mains-style shifts)</strong>
        </div>
      </div>

      {/* ── Rank Predictor ── */}
      <Block id="rank" eyebrow="Tool 1" title="JEE Advanced Rank Predictor"
        sub="Enter your expected marks for Paper 1 and Paper 2 to estimate your IIT rank.">
        <RankPredictorTool accent="#7C3AED" advanced />
      </Block>

      {/* ── College Predictor ── */}
      <div style={{ background: "var(--sky)" }}>
  <Block id="college" eyebrow="Tool 2" title="IIT College &amp; Branch Predictor"
    sub="See which IIT branches you can secure across all 6 JoSAA rounds. IITs do not participate in CSAB.">
    {/* ── Loading notice ── */}
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
    <CollegePredictorTool basePath="/jee-advanced" />
  </Block>
</div>

      {/* ══ DIFFICULTY ANALYSIS ══ */}
      <section id="difficulty" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Paper Analysis</span>
            <h2 className="section-title">Subject-wise Difficulty — Paper 1 &amp; Paper 2</h2>
            <p className="section-sub">
              Select a year to compare Physics, Chemistry &amp; Maths difficulty across both papers. Index: 0 = easiest, 100 = hardest.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{
              display: "inline-flex", gap: 8,
              background: "var(--sky)", padding: 6, borderRadius: 50,
              border: "1px solid var(--line)",
            }}>
              {DIFFICULTY_YEARS.map((y) => (
                <button key={y} onClick={() => setSelectedYear(y)} style={{
                  padding: "8px 22px", borderRadius: 50, fontWeight: 700, fontSize: 14,
                  border: "none", cursor: "pointer", fontFamily: "Sora",
                  background: selectedYear === y ? "linear-gradient(135deg,#7C3AED,#a855f7)" : "transparent",
                  color: selectedYear === y ? "#fff" : "var(--navy)",
                  boxShadow: selectedYear === y ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
                  transition: "all 0.2s",
                }}>{y}</button>
              ))}
            </div>
          </div>

          <div className="grid-3" style={{ gap: 16, marginBottom: 28 }}>
            {[
              { subj: "Physics",   icon: Atom,        p1: d.p1.phy,  p2: d.p2.phy,  color: "#F97316" },
              { subj: "Chemistry", icon: FlaskConical, p1: d.p1.chem, p2: d.p2.chem, color: "#0EA5A4" },
              { subj: "Maths",     icon: Calculator,   p1: d.p1.math, p2: d.p2.math, color: "#7C3AED" },
            ].map(({ subj, icon: Icon, p1, p2, color }) => {
              const avg = Math.round((p1 + p2) / 2);
              const { label } = diffLabel(avg);
              return (
                <div key={subj} className="card" style={{ borderTop: `4px solid ${color}`, padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: "grid", placeItems: "center" }}>
                      <Icon size={20} color={color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 15 }}>{subj}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>JEE Advanced {selectedYear}</div>
                    </div>
                    <span style={{
                      marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "4px 10px",
                      borderRadius: 50, background: `${diffLabel(avg).color}18`, color: diffLabel(avg).color,
                    }}>{label}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["Paper 1", p1], ["Paper 2", p2]].map(([pLabel, val]) => (
                      <div key={pLabel} style={{ background: "var(--sky)", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{pLabel}</div>
                        <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 22, color }}>{val}</div>
                        <div style={{ marginTop: 6, height: 6, borderRadius: 4, background: "#e5e7eb", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
                        </div>
                        <div style={{ fontSize: 11, color: diffLabel(val).color, marginTop: 4, fontWeight: 600 }}>{diffLabel(val).label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4 }}>
              Paper 1 vs Paper 2 — All Subjects · {selectedYear}
            </h4>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Higher index = more difficult. Both papers shown side by side.</p>
            <Bars
              data={subjectBars}
              bars={[
                { key: "Paper1", label: "Paper 1", color: "#F97316" },
                { key: "Paper2", label: "Paper 2", color: "#7C3AED" },
              ]}
              height={280}
            />
          </div>
        </div>
      </section>

      {/* ══ 5-YEAR DIFFICULTY TREND ══ */}
      <section id="difficulty-trend" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">5-Year Trend</span>
            <h2 className="section-title">Subject Difficulty Trend (2021–2025)</h2>
            <p className="section-sub">How Paper 1 &amp; Paper 2 difficulty has shifted per subject over 5 years.</p>
          </div>
          <div className="grid-3" style={{ gap: 22 }}>
            {[
              { label: "Physics",   data: TREND_PHYSICS,   c1: "#F97316", c2: "#fdba74" },
              { label: "Chemistry", data: TREND_CHEMISTRY, c1: "#0EA5A4", c2: "#5eead4" },
              { label: "Maths",     data: TREND_MATHS,     c1: "#7C3AED", c2: "#c084fc" },
            ].map(({ label, data, c1, c2 }) => (
              <div key={label} className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12, color: c1 }}>{label}</h4>
                <Trend
                  data={data}
                  lines={[
                    { key: "Paper1", label: "Paper 1", color: c1 },
                    { key: "Paper2", label: "Paper 2", color: c2 },
                  ]}
                  height={220}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JEE ADVANCED QUALIFYING MARKS TREND (out of 360) ══
          Official aggregate cutoff marks from jeeadv.ac.in
          Columns: CRL | OBC-NCL & GEN-EWS | SC, ST & PwD
          NOT the JEE Main percentile cutoff.
      ══════════════════════════════════════════════════════════ */}
      <section id="trend" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Cutoff Trends</span>
            <h2 className="section-title">JEE Advanced — 5-Year Aggregate Qualifying Cutoff</h2>
            <p className="section-sub">
              Official minimum aggregate marks (out of 360, Paper 1 + Paper 2 combined) required to secure a rank in the JEE Advanced merit list — category-wise (2021–2025).
              Source: <a href="https://jeeadv.ac.in" target="_blank" rel="noreferrer" style={{ color: "#7C3AED" }}>jeeadv.ac.in</a> official cutoff notifications.
            </p>
          </div>
          <div className="card">
            {/* Cutoff summary table */}
            <div style={{ overflowX: "auto", marginBottom: 20 }}>
              <table className="data-table" style={{ minWidth: 520, fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th style={{ textAlign: "center", color: "#1c1c28" }}>CRL (General)</th>
                    <th style={{ textAlign: "center", color: "#F4A261" }}>OBC-NCL &amp; GEN-EWS</th>
                    <th style={{ textAlign: "center", color: "#2EC4B6" }}>SC, ST &amp; PwD</th>
                  </tr>
                </thead>
                <tbody>
                  {QUALIFYING_TREND.map((row) => (
                    <tr key={row.year}>
                      <td><strong style={{ fontFamily: "Sora" }}>{row.year}</strong></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700 }}>{row.crl} marks</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#F4A261" }}>{row.obc_ews} marks</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#2EC4B6" }}>{row.sc_st_pwd} marks</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Trend
              data={QUALIFYING_TREND}
              lines={[
                { key: "crl",       label: "CRL (General)",      color: "#1c1c28" },
                { key: "obc_ews",   label: "OBC-NCL & GEN-EWS",  color: "#F4A261" },
                { key: "sc_st_pwd", label: "SC, ST & PwD",       color: "#2EC4B6" },
              ]}
              height={320}
            />
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
              * Official cutoff marks from jeeadv.ac.in. Total marks out of 360 (Paper 1 + Paper 2).
              Verify latest cutoffs at <a href="https://jeeadv.ac.in" target="_blank" rel="noreferrer" style={{ color: "#7C3AED" }}>jeeadv.ac.in</a>
            </p>
          </div>
        </div>
      </section>

      {/* ══ SYLLABUS ══ */}
      <section id="syllabus" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Syllabus</span>
            <h2 className="section-title">Complete JEE Advanced Syllabus</h2>
            <p className="section-sub">All topics covered in Paper 1 &amp; Paper 2. Both papers test the same syllabus with different question types.</p>
          </div>
          <div className="grid-3" style={{ gap: 22 }}>
            {SYLLABUS_ENTRIES.map(([subj, { color, icon: Icon, topics }]) => (
              <div key={subj} className="card" style={{ borderTop: `4px solid ${color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "grid", placeItems: "center" }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 17 }}>{subj}</h3>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{topics.length} major topic areas</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {topics.map((t) => (
                    <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13 }}>
                      <CheckCircle2 size={15} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://jeeadv.ac.in/brochure.html"
                  target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 13, fontWeight: 600, color }}
                >
                  <FileText size={14} /> Official Syllabus PDF <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ gap: 20, marginTop: 24 }}>
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

      {/* ══ ENHANCED ROADMAP ══ */}
      <section id="roadmap" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Study Roadmap</span>
            <h2 className="section-title">12-Month JEE Advanced Preparation Roadmap</h2>
            <p className="section-sub">A structured month-by-month plan with specific tasks, books and daily targets — from foundation to exam day.</p>
          </div>

          <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0,
              width: 3, background: "linear-gradient(180deg,#F97316,#7C3AED,#0EA5A4,#EC4899,#EAB308,#15A06E)",
              transform: "translateX(-50%)", borderRadius: 4,
            }} />

            {ROADMAP.map((step, i) => (
              <div key={step.month} style={{
                display: "flex",
                justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: 36,
                position: "relative",
              }}>
                {/* Dot */}
                <div style={{
                  position: "absolute", left: "50%", top: 28,
                  transform: "translateX(-50%)",
                  width: 20, height: 20, borderRadius: "50%",
                  background: step.color, border: "3px solid #fff",
                  boxShadow: `0 0 0 4px ${step.color}44`,
                  zIndex: 1,
                }} />

                {/* Card */}
                <div className="card" style={{
                  width: "44%",
                  borderTop: `4px solid ${step.color}`,
                  marginLeft: i % 2 === 0 ? 0 : "auto",
                  marginRight: i % 2 === 0 ? "auto" : 0,
                  padding: "20px 22px",
                }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{step.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: step.color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{step.month}</div>
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{step.label}</h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, marginBottom: 12 }}>{step.tip}</p>

                  {/* Task checklist */}
                  <div style={{ borderTop: `1px solid ${step.color}22`, paddingTop: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      <Target size={11} style={{ display: "inline", marginRight: 4 }} />Key Tasks
                    </div>
                    {step.tasks.map((task) => (
                      <div key={task} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12, marginBottom: 5 }}>
                        <CheckCircle2 size={13} color={step.color} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{task}</span>
                      </div>
                    ))}
                  </div>

                  {/* Resources */}
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

          {/* Recommended Resources warm card */}
          <div className="card" style={{ marginTop: 16, background: "linear-gradient(135deg,#1a0800,#3d1800)", color: "#fff" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 16, color: "#fff" }}>📚 Complete Book List — JEE Advanced</h4>
            <div className="grid-3" style={{ gap: 14 }}>
              {[
                {
                  subj: "Physics",
                  books: ["H.C. Verma Vol 1 & 2 (must)", "Irodov Problems in General Physics", "DC Pandey (Series)", "FIITJEE Physics Study Material"],
                  color: "#F97316",
                },
                {
                  subj: "Chemistry",
                  books: ["NCERT 11 & 12 (mandatory base)", "JD Lee Inorganic Chemistry", "Morrison & Boyd Organic", "Narendra Awasthi Physical Chem"],
                  color: "#0EA5A4",
                },
                {
                  subj: "Maths",
                  books: ["RD Sharma / SL Loney Trigonometry", "ML Khanna IIT Mathematics", "FIITJEE Maths Study Material", "Arihant 41 Years PYQ"],
                  color: "#7C3AED",
                },
              ].map(({ subj, books, color }) => (
                <div key={subj} style={{ background: "rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${color}` }}>
                  <div style={{ fontWeight: 700, color, marginBottom: 8, fontSize: 14 }}>{subj}</div>
                  {books.map((b) => (
                    <div key={b} style={{ fontSize: 12, color: "rgba(255,255,255,.75)", marginBottom: 5 }}>• {b}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ COACHING INSTITUTES ══ */}
      <section id="coaching" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Top Coaching</span>
            <h2 className="section-title">Best Coaching Institutes for JEE Advanced</h2>
            <p className="section-sub">India's top coaching options — offline Kota institutes, pan-India centres &amp; online platforms. Choose based on your city, budget &amp; learning style.</p>
          </div>
          <div className="grid-3" style={{ gap: 22 }}>
            {COACHING.map((c) => (
              <div key={c.name} className="card" style={{ borderTop: `4px solid ${c.color}`, padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, marginBottom: 3 }}>{c.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)" }}>
                      <MapPin size={12} /> {c.city}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50,
                    background: `${c.color}18`, color: c.color, whiteSpace: "nowrap",
                  }}>{c.badge}</span>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 50, background: "#f3f4f6", color: "var(--navy)", fontWeight: 600 }}>
                    💰 {c.fee}
                  </span>
                  <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 50, background: "#f3f4f6", color: "var(--navy)", fontWeight: 600 }}>
                    🖥 {c.mode}
                  </span>
                </div>

                {c.highlights.map((h) => (
                  <div key={h} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12, marginBottom: 6 }}>
                    <CheckCircle2 size={13} color={c.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{h}</span>
                  </div>
                ))}

                <a href={c.website} target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14,
                  fontSize: 13, fontWeight: 600, color: c.color,
                }}>
                  <Globe size={13} /> Visit Website <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>

          {/* Coaching comparison note */}
          <div className="card" style={{ marginTop: 20, borderLeft: "4px solid #7C3AED", padding: "16px 20px" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8, fontSize: 15 }}>💡 How to Choose the Right Coaching</h4>
            <div className="grid-2" style={{ gap: 12 }}>
              {[
                { title: "For Kota (Offline)", tip: "Allen or Resonance if you can relocate. Best peer environment, highly structured. Go for dropper batch after Class 12 if needed." },
                { title: "For Home City (Offline)", tip: "FIITJEE, Narayana, Sri Chaitanya have centres in most metros. Choose based on batch size — smaller = more attention." },
                { title: "For Online (Budget)", tip: "Vedantu / Unacademy offer top faculty at a fraction of cost. Requires strong self-discipline. Best combined with test series." },
                { title: "Self Study + Test Series", tip: "Viable for disciplined students. Use Allen/Resonance test series (₹8K–15K) + YouTube (Physics Wallah, Etoos) + PYQ books." },
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