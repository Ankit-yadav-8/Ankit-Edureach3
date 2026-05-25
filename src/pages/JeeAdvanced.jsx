import { useState } from "react";
import { EXAM_BY_SLUG } from "../data/exams.js";
import RankPredictorTool from "../components/predictor/RankPredictorTool.jsx";
import CollegePredictorTool from "../components/predictor/CollegePredictorTool.jsx";
import { EligibilityCards, RankingsTable } from "../components/predictor/AnalysisSections.jsx";
import { Bars, Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import { Info, BookOpen, Map, TrendingUp, ChevronDown, FlaskConical, Atom, Calculator, FileText, CheckCircle2, ArrowRight, Zap } from "lucide-react";

/* ── Inline difficulty data (Paper 1 & Paper 2, 2021–2025) ── */
const DIFFICULTY_YEARS = [2021, 2022, 2023, 2024, 2025];

const DIFFICULTY_DATA = {
  2021: { p1: { phy: 68, chem: 62, math: 78 }, p2: { phy: 64, chem: 66, math: 72 } },
  2022: { p1: { phy: 74, chem: 58, math: 82 }, p2: { phy: 70, chem: 64, math: 76 } },
  2023: { p1: { phy: 71, chem: 65, math: 85 }, p2: { phy: 67, chem: 70, math: 80 } },
  2024: { p1: { phy: 76, chem: 60, math: 80 }, p2: { phy: 72, chem: 68, math: 77 } },
  2025: { p1: { phy: 73, chem: 63, math: 83 }, p2: { phy: 69, chem: 67, math: 79 } },
};

/* 5-year trend chart data (difficulty index 0–100) */
const TREND_PHYSICS   = DIFFICULTY_YEARS.map((y) => ({ year: y, Paper1: DIFFICULTY_DATA[y].p1.phy, Paper2: DIFFICULTY_DATA[y].p2.phy }));
const TREND_CHEMISTRY = DIFFICULTY_YEARS.map((y) => ({ year: y, Paper1: DIFFICULTY_DATA[y].p1.chem, Paper2: DIFFICULTY_DATA[y].p2.chem }));
const TREND_MATHS     = DIFFICULTY_YEARS.map((y) => ({ year: y, Paper1: DIFFICULTY_DATA[y].p1.math, Paper2: DIFFICULTY_DATA[y].p2.math }));

/* Qualifying marks trend */
const QUALIFYING_TREND = [
  { year: 2021, open: 87,  obc: 68, sc: 44, st: 34 },
  { year: 2022, open: 88,  obc: 78, sc: 48, st: 40 },
  { year: 2023, open: 90,  obc: 79, sc: 44, st: 40 },
  { year: 2024, open: 93,  obc: 83, sc: 52, st: 44 },
  { year: 2025, open: 95,  obc: 85, sc: 54, st: 46 },
];

/* Syllabus data */
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

/* Roadmap steps */
const ROADMAP = [
  { month: "Jun–Aug", label: "Foundation", color: "#F97316", tip: "Complete NCERT Physics & Chemistry. Solve H.C. Verma Part 1.", icon: "📚" },
  { month: "Sep–Nov", label: "Core Concepts", color: "#0EA5A4", tip: "Irodov problems for Physics. Organic reactions & mechanisms.", icon: "🔬" },
  { month: "Dec–Feb", label: "Advanced Topics", color: "#7C3AED", tip: "Coordinate Geometry, 3D Maths. JD Lee Inorganic Chemistry.", icon: "📐" },
  { month: "Mar–Apr", label: "Mock Tests", color: "#EC4899", tip: "Attempt full JEE Advanced mocks weekly. Analyse Paper 1 & 2.", icon: "📝" },
  { month: "May", label: "Revision Sprint", color: "#EAB308", tip: "Revise formulas, named reactions, and important theorems.", icon: "⚡" },
  { month: "Exam Day", label: "JEE Advanced", color: "#15A06E", tip: "Paper 1: 9 AM – 12 PM  |  Paper 2: 2:30 PM – 5:30 PM", icon: "🎯" },
];

/* ── Reusable section block ── */
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

/* ── Difficulty label helper ── */
function diffLabel(val) {
  if (val >= 80) return { label: "Very Hard", color: "#EF4444" };
  if (val >= 70) return { label: "Hard",      color: "#F97316" };
  if (val >= 60) return { label: "Medium",    color: "#EAB308" };
  return              { label: "Easy",        color: "#15A06E" };
}

/* ══════════════════════════════════════════════════════════════
   Main Page
══════════════════════════════════════════════════════════════ */
export default function JeeAdvanced() {
  const exam = EXAM_BY_SLUG["jee-advanced"];
  const [selectedYear, setSelectedYear] = useState(2025);
  const d = DIFFICULTY_DATA[selectedYear];

  /* Bar chart data for selected year */
  const subjectBars = [
    { name: "Physics",   Paper1: d.p1.phy,  Paper2: d.p2.phy  },
    { name: "Chemistry", Paper1: d.p1.chem, Paper2: d.p2.chem },
    { name: "Maths",     Paper1: d.p1.math, Paper2: d.p2.math },
  ];

  return (
    <div className="page">

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(135deg,#1c1c28 0%,#2d1654 60%,#1c1c28 100%)",
        color: "#fff", padding: "56px 0 48px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "radial-gradient(circle at 20% 50%, #F97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7C3AED 0%, transparent 50%)",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge violet" style={{ marginBottom: 14, display: "inline-block" }}>JEE Advanced 2026</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.8rem)", margin: "0 0 10px", lineHeight: 1.2 }}>
            JEE Advanced — IIT Rank &amp; Seat Predictor
          </h1>
          <p style={{ color: "rgba(255,255,255,.75)", maxWidth: 620, marginBottom: 28 }}>
            Estimate your IIT rank, find which IIT branches you qualify for, analyse Paper 1 &amp; 2 difficulty subject-wise, and explore the complete syllabus &amp; study roadmap.
          </p>
          {/* Quick nav pills */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[["#rank","Rank Predictor"],["#college","College Predictor"],["#difficulty","Difficulty Analysis"],["#syllabus","Syllabus"],["#roadmap","Roadmap"],["#trend","Cutoff Trends"]].map(([href, label]) => (
              <a key={href} href={href} style={{
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.25)", color: "#fff",
                padding: "8px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.target.style.background = "rgba(249,115,22,0.7)"}
              onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.12)"}
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

          {/* Year selector */}
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

          {/* Difficulty score cards */}
          <div className="grid-3" style={{ gap: 16, marginBottom: 28 }}>
            {[
              { subj: "Physics",   icon: Atom,       p1: d.p1.phy,  p2: d.p2.phy,  color: "#F97316" },
              { subj: "Chemistry", icon: FlaskConical,p1: d.p1.chem, p2: d.p2.chem, color: "#0EA5A4" },
              { subj: "Maths",     icon: Calculator,  p1: d.p1.math, p2: d.p2.math, color: "#7C3AED" },
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

          {/* Side-by-side bar chart */}
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

      {/* ══ QUALIFYING MARKS TREND ══ */}
      <section id="trend" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Cutoff Trends</span>
            <h2 className="section-title">5-Year Qualifying Marks Trend</h2>
            <p className="section-sub">Category-wise qualifying marks out of 360 (2021–2025). Higher = tougher cutoff.</p>
          </div>
          <div className="card">
            <Trend
              data={QUALIFYING_TREND}
              lines={[
                { key: "open", label: "General",  color: "#1c1c28" },
                { key: "obc",  label: "OBC-NCL",  color: "#F4A261" },
                { key: "sc",   label: "SC",        color: "#2EC4B6" },
                { key: "st",   label: "ST",        color: "#F97316" },
              ]}
              height={320}
            />
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
            {Object.entries(SYLLABUS).map(([subj, { color, icon: Icon, topics }]) => (
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
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    marginTop: 16, fontSize: 13, fontWeight: 600, color,
                  }}
                >
                  <FileText size={14} /> Official Syllabus PDF <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>

          {/* Paper type note */}
          <div className="grid-2" style={{ gap: 20, marginTop: 24 }}>
            {[
              {
                title: "Paper 1 — Question Types",
                color: "#F97316",
                types: ["MCQ — Single Correct (3 marks, −1 penalty)", "MCQ — Multiple Correct (4 marks, partial)", "Numerical Answer Type (4 marks, no penalty)"],
              },
              {
                title: "Paper 2 — Question Types",
                color: "#7C3AED",
                types: ["MCQ — Single Correct (3 marks, −1 penalty)", "MCQ — Multiple Correct (4 marks, partial)", "Match the Column (3–4 marks, partial)", "Paragraph / Comprehension based"],
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

      {/* ══ ROADMAP ══ */}
      <section id="roadmap" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Study Roadmap</span>
            <h2 className="section-title">12-Month JEE Advanced Preparation Roadmap</h2>
            <p className="section-sub">A structured month-by-month plan from foundation to exam day.</p>
          </div>

          {/* Timeline */}
          <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0,
              width: 3, background: "linear-gradient(180deg,#F97316,#7C3AED,#0EA5A4)",
              transform: "translateX(-50%)", borderRadius: 4,
            }} />

            {ROADMAP.map((step, i) => (
              <div key={step.month} style={{
                display: "flex",
                justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: 32,
                position: "relative",
              }}>
                {/* Dot on timeline */}
                <div style={{
                  position: "absolute", left: "50%", top: 24,
                  transform: "translateX(-50%)",
                  width: 18, height: 18, borderRadius: "50%",
                  background: step.color, border: "3px solid #fff",
                  boxShadow: `0 0 0 3px ${step.color}44`,
                  zIndex: 1,
                }} />

                {/* Card */}
                <div className="card" style={{
                  width: "44%", borderTop: `4px solid ${step.color}`,
                  marginLeft: i % 2 === 0 ? 0 : "auto",
                  marginRight: i % 2 === 0 ? "auto" : 0,
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{step.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: step.color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{step.month}</div>
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 6 }}>{step.label}</h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{step.tip}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Resource links */}
          <div className="card" style={{ marginTop: 16, background: "linear-gradient(135deg,#1c1c28,#2d1654)", color: "#fff" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 16, color: "#fff" }}>📚 Recommended Resources</h4>
            <div className="grid-3" style={{ gap: 14 }}>
              {[
                { subj: "Physics",    books: ["H.C. Verma Vol 1 & 2", "Irodov Problems", "DC Pandey"],                  color: "#F97316" },
                { subj: "Chemistry",  books: ["NCERT (must)", "JD Lee Inorganic", "Morrison & Boyd Organic"],            color: "#0EA5A4" },
                { subj: "Maths",      books: ["RD Sharma / SL Loney", "ML Khanna", "FIITJEE Study Material"],           color: "#7C3AED" },
              ].map(({ subj, books, color }) => (
                <div key={subj} style={{ background: "rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${color}` }}>
                  <div style={{ fontWeight: 700, color, marginBottom: 8, fontSize: 14 }}>{subj}</div>
                  {books.map((b) => (
                    <div key={b} style={{ fontSize: 13, color: "rgba(255,255,255,.75)", marginBottom: 4 }}>• {b}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Eligibility ── */}
      <div style={{ background: "var(--sky)" }}>
        <Block id="eligibility" eyebrow="Eligibility" title="Who can appear for JEE Advanced?"
          sub="Key eligibility criteria at a glance." bg="transparent">
          <EligibilityCards exam={exam} />
        </Block>
      </div>

      {/* ── IIT Rankings ── */}
      <Block id="iit-rankings" eyebrow="NIRF Rankings" title="Top IITs by Ranking &amp; Placements"
        sub="Sort by NIRF rank, average package or placement percentage.">
        <RankingsTable type="IIT" />
      </Block>
    </div>
  );
}