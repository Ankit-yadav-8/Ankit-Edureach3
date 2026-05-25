import { useState } from "react";
import { EXAM_BY_SLUG } from "../data/exams.js";
import RankPredictorTool from "../components/predictor/RankPredictorTool.jsx";
import CollegePredictorTool from "../components/predictor/CollegePredictorTool.jsx";
import { EligibilityCards, RankingsTable } from "../components/predictor/AnalysisSections.jsx";
import { Bars, Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import { Info, BookOpen, Atom, FlaskConical, Calculator, FileText, CheckCircle2, ArrowRight, Zap, TrendingUp } from "lucide-react";

/* ── Shift-wise difficulty data (Session 1 & 2, 2021–2025) ── */
const DIFFICULTY_YEARS = [2021, 2022, 2023, 2024, 2025];

const DIFFICULTY_DATA = {
  2021: { s1: { phy: 62, chem: 58, math: 70 }, s2: { phy: 66, chem: 62, math: 74 } },
  2022: { s1: { phy: 65, chem: 55, math: 72 }, s2: { phy: 68, chem: 60, math: 76 } },
  2023: { s1: { phy: 67, chem: 60, math: 75 }, s2: { phy: 64, chem: 58, math: 72 } },
  2024: { s1: { phy: 70, chem: 57, math: 74 }, s2: { phy: 72, chem: 62, math: 78 } },
  2025: { s1: { phy: 68, chem: 59, math: 76 }, s2: { phy: 70, chem: 63, math: 73 } },
};

const TREND_PHYSICS   = DIFFICULTY_YEARS.map((y) => ({ year: y, Session1: DIFFICULTY_DATA[y].s1.phy, Session2: DIFFICULTY_DATA[y].s2.phy }));
const TREND_CHEMISTRY = DIFFICULTY_YEARS.map((y) => ({ year: y, Session1: DIFFICULTY_DATA[y].s1.chem, Session2: DIFFICULTY_DATA[y].s2.chem }));
const TREND_MATHS     = DIFFICULTY_YEARS.map((y) => ({ year: y, Session1: DIFFICULTY_DATA[y].s1.math, Session2: DIFFICULTY_DATA[y].s2.math }));

/* Qualifying percentile trend */
const QUALIFYING_TREND = [
  { year: 2021, open: 87.9, obc: 68.0, sc: 46.9, st: 34.7 },
  { year: 2022, open: 88.4, obc: 67.7, sc: 46.8, st: 34.6 },
  { year: 2023, open: 90.0, obc: 75.6, sc: 54.4, st: 44.2 },
  { year: 2024, open: 89.7, obc: 73.6, sc: 52.8, st: 42.0 },
  { year: 2025, open: 91.0, obc: 76.0, sc: 55.0, st: 45.0 },
];

/* Cutoff percentile by top colleges */
const COLLEGE_CUTOFFS = [
  { name: "NIT Trichy CSE",  open: 99.1, obc: 98.4, sc: 95.2 },
  { name: "NIT Warangal CSE",open: 98.9, obc: 97.8, sc: 94.8 },
  { name: "NIT Surathkal CSE",open:98.5, obc: 97.2, sc: 94.1 },
  { name: "IIIT Hyderabad",  open: 99.4, obc: 98.7, sc: 96.0 },
  { name: "IIIT Bangalore",  open: 98.2, obc: 96.9, sc: 93.5 },
  { name: "NIT Calicut CSE", open: 98.0, obc: 96.5, sc: 92.8 },
];

/* Syllabus */
const SYLLABUS = {
  Physics: {
    color: "#F97316", icon: Atom,
    topics: [
      "Mechanics — Kinematics, Newton's Laws, Friction",
      "Work, Energy & Power",
      "Gravitation & Simple Harmonic Motion",
      "Thermodynamics — Laws, Heat Transfer",
      "Waves & Sound — Doppler Effect",
      "Optics — Ray & Wave Optics, Lenses",
      "Electricity — Ohm's Law, Kirchhoff's Laws",
      "Magnetism & Electromagnetic Induction",
      "Modern Physics — Photoelectric, Radioactivity",
    ],
  },
  Chemistry: {
    color: "#0EA5A4", icon: FlaskConical,
    topics: [
      "Physical Chemistry — Mole Concept, Stoichiometry",
      "Thermodynamics & Chemical Equilibrium",
      "Electrochemistry & Redox Reactions",
      "Atomic Structure & Periodic Table",
      "Chemical Bonding & Molecular Structure",
      "Organic Chemistry — Hydrocarbons, Functional Groups",
      "Reaction Mechanisms — SN1/SN2, Elimination",
      "Inorganic Chemistry — s, p, d Block Elements",
      "Biomolecules & Polymers",
    ],
  },
  Mathematics: {
    color: "#F97316", icon: Calculator,
    topics: [
      "Sets, Relations & Functions",
      "Complex Numbers & Quadratic Equations",
      "Permutation, Combination & Binomial Theorem",
      "Sequences & Series — AP, GP",
      "Trigonometry — Ratios, Equations, Inverse",
      "Coordinate Geometry — Straight Lines, Circles, Conics",
      "Calculus — Limits, Derivatives, Integrals",
      "3D Geometry & Vectors",
      "Statistics & Probability",
    ],
  },
};

/* Roadmap */
const ROADMAP = [
  { month: "Apr–May",  label: "Foundation Build",      color: "#F97316", tip: "Master NCERT for all 3 subjects. Focus on Class 11 syllabus first.", icon: "📚" },
  { month: "Jun–Aug",  label: "Concept Depth",         color: "#0EA5A4", tip: "HC Verma for Physics, Organic reactions for Chem, Trigonometry & Algebra.", icon: "🔬" },
  { month: "Sep–Oct",  label: "Class 12 Topics",       color: "#7C3AED", tip: "Electromagnetic Induction, p-block, Integration, 3D Geometry.", icon: "📐" },
  { month: "Nov–Dec",  label: "Revision + JM Mocks",   color: "#EC4899", tip: "Attempt NTA mock tests regularly. Analyse shift-wise weak areas.", icon: "📝" },
  { month: "Jan (S1)", label: "Session 1 Exam",        color: "#EAB308", tip: "Don't wait for results — continue preparation immediately after.", icon: "✏️" },
  { month: "Apr (S2)", label: "Session 2 + Best Score",color: "#15A06E", tip: "Best of 2 sessions counts. Total 75 questions, 300 marks.", icon: "🎯" },
];

/* Helper */
function diffLabel(val) {
  if (val >= 75) return { label: "Hard",   color: "#EF4444" };
  if (val >= 65) return { label: "Medium", color: "#F97316" };
  return               { label: "Easy",   color: "#15A06E" };
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
export default function JeeMain() {
  const exam = EXAM_BY_SLUG["jee-main"];
  const [selectedYear, setSelectedYear] = useState(2025);
  const d = DIFFICULTY_DATA[selectedYear];

  const subjectBars = [
    { name: "Physics",   Session1: d.s1.phy,  Session2: d.s2.phy  },
    { name: "Chemistry", Session1: d.s1.chem, Session2: d.s2.chem },
    { name: "Maths",     Session1: d.s1.math, Session2: d.s2.math },
  ];

  return (
    <div className="page">

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(135deg,#FF6B35 0%,#f97316 40%,#ea580c 100%)",
        color: "#fff", padding: "56px 0 48px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.08,
          backgroundImage: "radial-gradient(circle at 10% 80%, #fff 0%, transparent 50%), radial-gradient(circle at 90% 10%, #fbbf24 0%, transparent 50%)",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge orange" style={{
            marginBottom: 14, display: "inline-block",
            background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)",
          }}>JEE Main 2026</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.8rem)", margin: "0 0 10px", lineHeight: 1.2 }}>
            JEE Main — Rank &amp; College Predictor Hub
          </h1>
          <p style={{ color: "rgba(255,255,255,.85)", maxWidth: 620, marginBottom: 28 }}>
            Predict your rank, find every NIT/IIIT/GFTI you can get into, analyse session-wise difficulty, and follow the complete syllabus &amp; study roadmap.
          </p>
          {/* Quick nav */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[["#rank","Rank Predictor"],["#college","College Predictor"],["#cutoffs","Top Cutoffs"],["#difficulty","Difficulty Analysis"],["#syllabus","Syllabus"],["#roadmap","Roadmap"]].map(([href, label]) => (
              <a key={href} href={href} style={{
                background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.4)", color: "#fff",
                padding: "8px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.target.style.background = "rgba(0,0,0,0.2)"}
              onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.2)"}
              >{label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cutoff quick-stats header ── */}
      <section id="cutoffs" style={{ background: "var(--sky)", padding: "28px 0", scrollMarginTop: 90 }}>
        <div className="container">
          <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 17 }}>📊 Top College Closing Percentiles (JoSAA 2025)</h3>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Round 6 closing percentiles — verify on josaa.nic.in</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table" style={{ minWidth: 560 }}>
              <thead>
                <tr>
                  <th>College &amp; Branch</th>
                  <th style={{ textAlign: "center" }}>General</th>
                  <th style={{ textAlign: "center" }}>OBC-NCL</th>
                  <th style={{ textAlign: "center" }}>SC</th>
                </tr>
              </thead>
              <tbody>
                {COLLEGE_CUTOFFS.map((c) => (
                  <tr key={c.name}>
                    <td><strong style={{ color: "var(--navy)" }}>{c.name}</strong></td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "Sora", fontWeight: 700, color: "#7C3AED" }}>{c.open}%ile</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "Sora", fontWeight: 700, color: "#F97316" }}>{c.obc}%ile</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "Sora", fontWeight: 700, color: "#0EA5A4" }}>{c.sc}%ile</span>
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
          Data shown is illustrative for 2026 and modelled on past trends. Always cross-check with official sources (jeemain.nta.ac.in, josaa.nic.in, csab.nic.in).
        </div>
      </div>

      {/* ── Rank Predictor ── */}
      <Block id="rank" eyebrow="Tool 1" title="JEE Main Rank Predictor"
        sub="Convert your expected marks into an All-India rank, percentile and category rank.">
        <RankPredictorTool accent="#F97316" />
      </Block>

      {/* ── College Predictor ── */}
      <div style={{ background: "var(--sky)" }}>
        <Block id="college" eyebrow="Tool 2" title="JEE Main College Predictor"
          sub="Enter your rank to see every eligible NIT, IIIT & GFTI with JoSAA and CSAB round cutoffs." bg="transparent">
          <CollegePredictorTool basePath="/jee-main" />
        </Block>
      </div>

      {/* ══ DIFFICULTY ANALYSIS ══ */}
      <section id="difficulty" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Session Analysis</span>
            <h2 className="section-title">Session-wise Difficulty — Subject Analysis</h2>
            <p className="section-sub">
              Select a year to compare Physics, Chemistry &amp; Maths difficulty across Session 1 &amp; Session 2. Index: 0 = easiest, 100 = hardest.
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
                  background: selectedYear === y ? "linear-gradient(135deg,#F97316,#fb923c)" : "transparent",
                  color: selectedYear === y ? "#fff" : "var(--navy)",
                  boxShadow: selectedYear === y ? "0 4px 14px rgba(249,115,22,0.35)" : "none",
                  transition: "all 0.2s",
                }}>{y}</button>
              ))}
            </div>
          </div>

          {/* Score cards */}
          <div className="grid-3" style={{ gap: 16, marginBottom: 28 }}>
            {[
              { subj: "Physics",   icon: Atom,        s1: d.s1.phy,  s2: d.s2.phy,  color: "#F97316" },
              { subj: "Chemistry", icon: FlaskConical, s1: d.s1.chem, s2: d.s2.chem, color: "#0EA5A4" },
              { subj: "Maths",     icon: Calculator,   s1: d.s1.math, s2: d.s2.math, color: "#7C3AED" },
            ].map(({ subj, icon: Icon, s1, s2, color }) => {
              const avg = Math.round((s1 + s2) / 2);
              return (
                <div key={subj} className="card" style={{ borderTop: `4px solid ${color}`, padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: "grid", placeItems: "center" }}>
                      <Icon size={20} color={color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 15 }}>{subj}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>JEE Main {selectedYear}</div>
                    </div>
                    <span style={{
                      marginLeft: "auto", fontSize: 11, fontWeight: 700,
                      padding: "4px 10px", borderRadius: 50,
                      background: `${diffLabel(avg).color}18`, color: diffLabel(avg).color,
                    }}>{diffLabel(avg).label}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["Session 1", s1], ["Session 2", s2]].map(([label, val]) => (
                      <div key={label} style={{ background: "var(--sky)", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{label}</div>
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
              Session 1 vs Session 2 — All Subjects · {selectedYear}
            </h4>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Higher index = more difficult.</p>
            <Bars
              data={subjectBars}
              bars={[
                { key: "Session1", label: "Session 1", color: "#F97316" },
                { key: "Session2", label: "Session 2", color: "#7C3AED" },
              ]}
              height={280}
            />
          </div>
        </div>
      </section>

      {/* ══ 5-YEAR DIFFICULTY TREND ══ */}
      <section className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">5-Year Trend</span>
            <h2 className="section-title">Subject Difficulty Trend (2021–2025)</h2>
            <p className="section-sub">How Session 1 &amp; Session 2 difficulty has shifted per subject over 5 years.</p>
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
                    { key: "Session1", label: "Session 1", color: c1 },
                    { key: "Session2", label: "Session 2", color: c2 },
                  ]}
                  height={220}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Qualifying Percentile Trend ── */}
      <Block id="trend" eyebrow="Cutoff Trends" title="5-Year Qualifying Percentile Trend"
        sub="How the JEE Main qualifying cutoff has moved across categories (2021–2025).">
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
      </Block>

      {/* ══ SYLLABUS ══ */}
      <section id="syllabus" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Syllabus</span>
            <h2 className="section-title">Complete JEE Main Syllabus</h2>
            <p className="section-sub">75 questions · 300 marks · 3 hours. 25 questions per subject (20 MCQ + 5 Numerical).</p>
          </div>

          {/* Exam pattern banner */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28,
          }}>
            {[
              { label: "Total Questions", value: "75", sub: "25 per subject", color: "#F97316" },
              { label: "Total Marks",     value: "300", sub: "4 marks each",  color: "#0EA5A4" },
              { label: "Duration",        value: "3 hrs", sub: "180 minutes", color: "#7C3AED" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="card" style={{ textAlign: "center", borderTop: `4px solid ${color}`, padding: "18px 12px" }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 28, color }}>{value}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</div>
              </div>
            ))}
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
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{topics.length} major topics</div>
                  </div>
                </div>
                {topics.map((t) => (
                  <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, marginBottom: 8 }}>
                    <CheckCircle2 size={15} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
                <a href="https://jeemain.nta.ac.in" target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 13, fontWeight: 600, color }}>
                  <FileText size={14} /> Official Syllabus <ArrowRight size={12} />
                </a>
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
            <h2 className="section-title">JEE Main Preparation Roadmap</h2>
            <p className="section-sub">A structured step-by-step plan from foundation to Session 2 exam day.</p>
          </div>

          <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0,
              width: 3, background: "linear-gradient(180deg,#F97316,#0EA5A4,#7C3AED)",
              transform: "translateX(-50%)", borderRadius: 4,
            }} />
            {ROADMAP.map((step, i) => (
              <div key={step.month} style={{
                display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: 32, position: "relative",
              }}>
                <div style={{
                  position: "absolute", left: "50%", top: 24,
                  transform: "translateX(-50%)",
                  width: 18, height: 18, borderRadius: "50%",
                  background: step.color, border: "3px solid #fff",
                  boxShadow: `0 0 0 3px ${step.color}44`, zIndex: 1,
                }} />
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

          {/* Resources */}
          <div className="card" style={{ marginTop: 16, background: "linear-gradient(135deg,#1c1c28,#ea580c)", color: "#fff" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 16, color: "#fff" }}>📚 Recommended Resources</h4>
            <div className="grid-3" style={{ gap: 14 }}>
              {[
                { subj: "Physics",    books: ["NCERT 11 & 12 (must)", "DC Pandey", "HC Verma selected chapters"],       color: "#F97316" },
                { subj: "Chemistry",  books: ["NCERT (enough for Inorganic)", "OP Tandon Organic", "Narendra Awasthi"], color: "#5eead4" },
                { subj: "Maths",      books: ["RD Sharma", "Cengage Series", "Arihant Past Year Papers"],              color: "#c084fc" },
              ].map(({ subj, books, color }) => (
                <div key={subj} style={{ background: "rgba(255,255,255,.1)", borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${color}` }}>
                  <div style={{ fontWeight: 700, color, marginBottom: 8, fontSize: 14 }}>{subj}</div>
                  {books.map((b) => <div key={b} style={{ fontSize: 13, color: "rgba(255,255,255,.78)", marginBottom: 4 }}>• {b}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Eligibility ── */}
      <div style={{ background: "var(--sky)" }}>
        <Block id="eligibility" eyebrow="Eligibility" title="Who can appear for JEE Main?" sub="Key eligibility criteria at a glance." bg="transparent">
          <EligibilityCards exam={exam} />
        </Block>
      </div>

      {/* ── NIT Rankings ── */}
      <Block id="nit-rankings" eyebrow="NIRF Rankings" title="Top NITs by Ranking &amp; Placements"
        sub="Sort by NIRF rank, average package or placement percentage.">
        <RankingsTable type="NIT" />
      </Block>
    </div>
  );
}