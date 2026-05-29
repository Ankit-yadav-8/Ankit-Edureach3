import { useState } from "react";
import { EXAM_BY_SLUG } from "../data/exams.js";
import RankPredictorTool from "../components/predictor/RankPredictorTool.jsx";
import CollegePredictorTool from "../components/predictor/CollegePredictorTool.jsx";
import { EligibilityCards, RankingsTable } from "../components/predictor/AnalysisSections.jsx";
import { Bars, Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  Info, Atom, FlaskConical, Calculator, FileText,
  CheckCircle2, ArrowRight, Zap, MapPin, Globe,
  Star, Target, Award, TrendingUp,
} from "lucide-react";

/* ── Shift-wise difficulty data (Session 1 & 2, 2021–2025) ── */
const DIFFICULTY_YEARS = [2021, 2022, 2023, 2024, 2025];

const DIFFICULTY_DATA = {
  2021: { s1: { phy: 62, chem: 58, math: 70 }, s2: { phy: 66, chem: 62, math: 74 } },
  2022: { s1: { phy: 65, chem: 55, math: 72 }, s2: { phy: 68, chem: 60, math: 76 } },
  2023: { s1: { phy: 67, chem: 60, math: 75 }, s2: { phy: 64, chem: 58, math: 72 } },
  2024: { s1: { phy: 70, chem: 57, math: 74 }, s2: { phy: 72, chem: 62, math: 78 } },
  2025: { s1: { phy: 68, chem: 59, math: 76 }, s2: { phy: 70, chem: 63, math: 73 } },
};

const TREND_PHYSICS   = DIFFICULTY_YEARS.map((y) => ({ year: y, Session1: DIFFICULTY_DATA[y].s1.phy,  Session2: DIFFICULTY_DATA[y].s2.phy  }));
const TREND_CHEMISTRY = DIFFICULTY_YEARS.map((y) => ({ year: y, Session1: DIFFICULTY_DATA[y].s1.chem, Session2: DIFFICULTY_DATA[y].s2.chem }));
const TREND_MATHS     = DIFFICULTY_YEARS.map((y) => ({ year: y, Session1: DIFFICULTY_DATA[y].s1.math, Session2: DIFFICULTY_DATA[y].s2.math }));

/*
  JEE Main NTA qualifying percentile trend (2021–2025).
  This is the minimum percentile required to qualify JEE Main
  (i.e., to be eligible for NIT/IIIT/GFTI admission via JoSAA).
  NOTE: This is NOT the JEE Advanced eligibility cutoff.
  The JEE Advanced cutoff is a separate top-2.5 lakh rank cutoff —
  visit jeeadv.ac.in for those figures.
  Source: jeemain.nta.ac.in official result archives 2021–2025.
*/
const QUALIFYING_TREND = [
  { year: 2021, open: 87.9, obc: 68.0, sc: 46.9, st: 34.7 },
  { year: 2022, open: 88.4, obc: 67.7, sc: 46.8, st: 34.6 },
  { year: 2023, open: 90.0, obc: 75.6, sc: 54.4, st: 44.2 },
  { year: 2024, open: 89.7, obc: 73.6, sc: 52.8, st: 42.0 },
  { year: 2025, open: 91.0, obc: 76.0, sc: 55.0, st: 45.0 },
];

/* Cutoff percentile by top colleges */
const COLLEGE_CUTOFFS = [
  { name: "NIT Trichy CSE",      open: 99.1, obc: 98.4, sc: 95.2 },
  { name: "NIT Warangal CSE",    open: 98.9, obc: 97.8, sc: 94.8 },
  { name: "NIT Surathkal CSE",   open: 98.5, obc: 97.2, sc: 94.1 },
  { name: "IIIT Hyderabad",      open: 99.4, obc: 98.7, sc: 96.0 },
  { name: "IIIT Bangalore",      open: 98.2, obc: 96.9, sc: 93.5 },
  { name: "NIT Calicut CSE",     open: 98.0, obc: 96.5, sc: 92.8 },
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
    color: "#7C3AED", icon: Calculator,
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

/* ── Enhanced Roadmap with tasks & books ── */
const ROADMAP = [
  {
    month: "Apr–May",
    label: "Foundation Build — NCERT First",
    color: "#F97316",
    icon: "📚",
    tip: "JEE Main is NCERT-heavy, especially Chemistry (Inorganic). Master all NCERT concepts before going to reference books. Class 11 syllabus should be your starting priority.",
    tasks: [
      "NCERT Physics 11 — Mechanics, Thermodynamics, Waves",
      "NCERT Chemistry 11 — Mole concept, Bonding, Organic basics",
      "NCERT Maths 11 — Sets, Sequences, Trigonometry, Permutations",
      "Make chapter-wise short notes as you study",
      "Target: complete Class 11 NCERT by end of May",
    ],
    resources: ["NCERT 11 (all 3 subjects)", "DC Pandey Mechanics", "RD Sharma Class 11"],
  },
  {
    month: "Jun–Aug",
    label: "Concept Depth — Reference Books",
    color: "#0EA5A4",
    icon: "🔬",
    tip: "Once NCERT is done, deepen with reference books. HC Verma selected chapters for Physics, OP Tandon for Organic. Start solving chapter-end exercises from NCERT regularly.",
    tasks: [
      "HC Verma selected chapters — Optics, Modern Physics",
      "OP Tandon Organic — reactions, mechanisms, named reactions",
      "Coordinate Geometry — straight lines, circles, conics",
      "Electrochemistry, Thermodynamics (Physical Chem)",
      "Weekly: solve 100 MCQs across all 3 subjects",
    ],
    resources: ["HC Verma (selected)", "OP Tandon Organic", "Cengage Coordinate Geometry"],
  },
  {
    month: "Sep–Oct",
    label: "Class 12 Topics — Full Coverage",
    color: "#7C3AED",
    icon: "📐",
    tip: "Electromagnetic Induction, p-block elements, Integration and 3D Geometry are high-weight JEE Main topics. Do not skip. Solve NCERT exemplar problems for Maths and Chemistry.",
    tasks: [
      "Electromagnetic Induction, Alternating Current (Physics)",
      "p-block, d-block elements — memorise properties",
      "Definite Integration, 3D Geometry, Vectors (Maths)",
      "Biomolecules, Polymers, Chemistry in Everyday Life (NCERT)",
      "NCERT Exemplar Maths & Chemistry — all chapters",
    ],
    resources: ["NCERT 12 (all 3)", "NCERT Exemplar", "DC Pandey EMI & Optics"],
  },
  {
    month: "Nov–Dec",
    label: "Mock Tests + Session 1 Prep",
    color: "#EC4899",
    icon: "📝",
    tip: "Start NTA mock tests on the official portal (free). Attempt 1 full mock per week in exam-time conditions. Analyse wrong answers — pattern recognition is key for JEE Main.",
    tasks: [
      "Attempt NTA free mocks on jeemain.nta.ac.in",
      "Time each section: 40 min/subject is a good benchmark",
      "Build error log — note every wrong answer with reason",
      "Focus on Numerical Value questions (no negative marking)",
      "Revise weak topics identified from mocks",
    ],
    resources: ["NTA Official Mocks (free)", "Allen/Resonance test series", "Arihant 40 Days Crash"],
  },
  {
    month: "Jan (S1)",
    label: "JEE Main Session 1 Exam",
    color: "#EAB308",
    icon: "✏️",
    tip: "Do NOT wait for results after Session 1. Continue preparation immediately. Best of 2 sessions counts — if Session 1 goes well, Session 2 is your backup to improve further.",
    tasks: [
      "Reach exam centre 60 mins early (biometric takes time)",
      "Chemistry first — fastest and most scoring",
      "Numerical section: attempt all (no negative marking)",
      "Flag uncertain MCQs and return after attempting rest",
      "Post-exam: note topic areas that felt weak → revise before S2",
    ],
    resources: ["Admit card", "Aadhaar / School ID", "NTA guidelines document"],
  },
  {
    month: "Feb–Mar",
    label: "Bridge Gap — S1 to S2 Improvement",
    color: "#6366F1",
    icon: "🔁",
    tip: "Between sessions, focus only on weak areas from Session 1. Don't restart everything — targeted improvement gets the most percentile gain. Revise high-weight chapters daily.",
    tasks: [
      "Identify all wrong answers from S1 (use memory/analysis)",
      "Targeted revision: top 3 weak chapters per subject",
      "Solve 5 years' past Session 2 papers",
      "Practice speed: 75 questions in 3 hours consistently",
      "Revise all formulas daily in final 2 weeks",
    ],
    resources: ["Past Session 2 PYQs", "Disha JEE Main 10 Years Papers", "Self revision notes"],
  },
  {
    month: "Apr (S2)",
    label: "JEE Main Session 2 — Best Score Counts",
    color: "#15A06E",
    icon: "🎯",
    tip: "Total 75 questions, 300 marks, 3 hours. Your best of 2 session percentiles is used for JoSAA. If targeting JEE Advanced, top ~2.5 lakh rank in JEE Main is required — confirm eligibility at jeeadv.ac.in.",
    tasks: [
      "Same strategy as Session 1 but with more confidence",
      "Attempt full paper — do not leave anything blank (Numerical: no penalty)",
      "Manage time: max 3 min per MCQ, 4 min per Numerical",
      "After exam: check JoSAA opening date for counselling",
      "If JEE Advanced eligible: immediately shift preparation",
    ],
    resources: ["Admit card", "josaa.nic.in (counselling)", "jeeadv.ac.in (if eligible)"],
  },
];

/* ── Top Coaching Institutes for JEE Main ── */
const COACHING = [
  {
    name: "Allen Career Institute",
    city: "Kota, Rajasthan",
    color: "#F97316",
    badge: "🏆 #1 in India",
    highlights: [
      "Largest coaching institute — 1.5 lakh+ students annually",
      "JEE Main 100 percentile scorers every year from Allen",
      "Classroom, distance (DLPD) & online programs",
      "Leader Board batches for top-ranked students",
    ],
    website: "https://www.allen.ac.in",
    fee: "₹1.2L – ₹2.5L/year",
    mode: "Offline / Online",
  },
  {
    name: "Resonance",
    city: "Kota, Rajasthan",
    color: "#7C3AED",
    badge: "⭐ Strong Maths Faculty",
    highlights: [
      "Excellent track record in JEE Main top 1000 ranks",
      "ResoFAST scholarship exam — merit-based fee waivers",
      "e-Resonance online platform with live + recorded classes",
      "Widely used All-India test series (even by self-studiers)",
    ],
    website: "https://www.resonance.ac.in",
    fee: "₹1.0L – ₹2.2L/year",
    mode: "Offline / Online",
  },
  {
    name: "FIITJEE",
    city: "Delhi + 30+ cities",
    color: "#0EA5A4",
    badge: "🎓 Conceptual Depth",
    highlights: [
      "Pioneer IIT-JEE coaching since 1992",
      "Integrated school + JEE program (Class 9–12)",
      "FTRE scholarship test for merit admissions",
      "Strong focus on JEE Advanced level concept building",
    ],
    website: "https://www.fiitjee.com",
    fee: "₹1.5L – ₹3.0L/year",
    mode: "Offline / Online",
  },
  {
    name: "Narayana",
    city: "Hyderabad + Pan India",
    color: "#EC4899",
    badge: "📍 500+ Centres",
    highlights: [
      "Best value for money — affordable fees + scholarships",
      "Excellent NIT results from SC/ST/OBC categories",
      "Integrated residential school + coaching available",
      "Strong presence in South India and Tier-2 cities",
    ],
    website: "https://www.narayanaiit.com",
    fee: "₹70K – ₹1.6L/year",
    mode: "Offline / Residential",
  },
  {
    name: "Physics Wallah (PW)",
    city: "Online + Patna / Lucknow",
    color: "#15A06E",
    badge: "💸 Most Affordable",
    highlights: [
      "Alakh Pandey's platform — most popular JEE YouTube content",
      "Batch fees under ₹10K–₹30K for full JEE Main prep",
      "PW Vidyapeeth offline centres in major cities",
      "Arjuna / Lakshya batches with DPPs and test series",
    ],
    website: "https://www.pw.live",
    fee: "₹5K – ₹40K/year",
    mode: "Online / Offline (select cities)",
  },
  {
    name: "Vedantu / Unacademy",
    city: "Online (Pan India)",
    color: "#6366F1",
    badge: "💻 Top Online Platform",
    highlights: [
      "Live interactive classes with IIT alumni faculty",
      "Vedantu VSAT / Unacademy ICONIC for top batches",
      "Doubt-solving sessions, recorded lectures, test series",
      "Best for students who cannot relocate to Kota",
    ],
    website: "https://www.vedantu.com",
    fee: "₹30K – ₹1.2L/year",
    mode: "Online",
  },
];

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
      <section className="warm-page-header" style={{ padding: "56px 0 48px" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 20%, rgba(249,115,22,.22) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 50% at 0% 90%, rgba(244,162,97,.18) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow" style={{ marginBottom: 14, display: "inline-flex" }}>JEE Main 2026</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.8rem)", margin: "0 0 10px", lineHeight: 1.2, color: "#1c1c28" }}>
            JEE Main — Rank &amp; College Predictor Hub
          </h1>
          <p style={{ color: "rgba(28,28,40,.62)", maxWidth: 620, marginBottom: 28 }}>
            Predict your rank, find every NIT/IIIT/GFTI you qualify for, analyse session-wise difficulty, and follow the complete syllabus, study roadmap &amp; top coaching options.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              ["#rank","Rank Predictor"],
              ["#college","College Predictor"],
              ["#cutoffs","Top Cutoffs"],
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

      {/* ── College cutoff quick-stats ── */}
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

      {/* ══ JEE MAIN QUALIFYING PERCENTILE TREND ══
          This shows the NTA percentile cutoff for JEE Main result qualification
          (minimum percentile to be eligible for JoSAA NIT/IIIT/GFTI counselling).
          This is NOT the JEE Advanced eligibility cutoff.
          JEE Advanced eligibility = top ~2.5 lakh CRL rank in JEE Main.
          Source: NTA official result notifications 2021–2025.
      ══════════════════════════════════════════════════════════ */}
      <section id="trend" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Cutoff Trends</span>
            <h2 className="section-title">JEE Main — 5-Year Qualifying Percentile Trend</h2>
            <p className="section-sub">
              Minimum NTA percentile required to qualify JEE Main for NIT/IIIT/GFTI admission (JoSAA counselling) — category-wise (2021–2025).
              This is the JEE Main result qualifying cutoff, not the JEE Advanced eligibility cutoff.
              Source: jeemain.nta.ac.in official result notifications.
            </p>
          </div>
          <div className="card">
            {/* Inline data table */}
            <div style={{ overflowX: "auto", marginBottom: 20 }}>
              <table className="data-table" style={{ minWidth: 520, fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th style={{ textAlign: "center" }}>General</th>
                    <th style={{ textAlign: "center" }}>OBC-NCL</th>
                    <th style={{ textAlign: "center" }}>SC</th>
                    <th style={{ textAlign: "center" }}>ST</th>
                  </tr>
                </thead>
                <tbody>
                  {QUALIFYING_TREND.map((row) => (
                    <tr key={row.year}>
                      <td><strong style={{ fontFamily: "Sora" }}>{row.year}</strong></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700 }}>{row.open}%ile</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#F4A261" }}>{row.obc}%ile</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#2EC4B6" }}>{row.sc}%ile</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#F97316" }}>{row.st}%ile</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
              * NTA percentile scores from official JEE Main result notifications. Qualifying cutoff for JoSAA counselling.
              Verify at <a href="https://jeemain.nta.ac.in" target="_blank" rel="noreferrer" style={{ color: "#F97316" }}>jeemain.nta.ac.in</a>
            </p>
          </div>
        </div>
      </section>

      {/* ══ SYLLABUS ══ */}
      <section id="syllabus" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Syllabus</span>
            <h2 className="section-title">Complete JEE Main Syllabus</h2>
            <p className="section-sub">75 questions · 300 marks · 3 hours. 25 questions per subject (20 MCQ + 5 Numerical).</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Total Questions", value: "75",   sub: "25 per subject",  color: "#F97316" },
              { label: "Total Marks",     value: "300",  sub: "4 marks each",    color: "#0EA5A4" },
              { label: "Duration",        value: "3 hrs", sub: "180 minutes",    color: "#7C3AED" },
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

      {/* ══ ENHANCED ROADMAP ══ */}
      <section id="roadmap" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Study Roadmap</span>
            <h2 className="section-title">JEE Main Preparation Roadmap</h2>
            <p className="section-sub">A step-by-step plan with specific tasks, books and daily targets — from foundation through both sessions.</p>
          </div>

          <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0,
              width: 3, background: "linear-gradient(180deg,#F97316,#0EA5A4,#7C3AED,#EC4899,#EAB308,#6366F1,#15A06E)",
              transform: "translateX(-50%)", borderRadius: 4,
            }} />

            {ROADMAP.map((step, i) => (
              <div key={step.month} style={{
                display: "flex",
                justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: 36,
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", left: "50%", top: 28,
                  transform: "translateX(-50%)",
                  width: 20, height: 20, borderRadius: "50%",
                  background: step.color, border: "3px solid #fff",
                  boxShadow: `0 0 0 4px ${step.color}44`, zIndex: 1,
                }} />

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

                  {/* Tasks */}
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

                  {/* Resource tags */}
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

          {/* Full book list */}
          <div className="card" style={{ marginTop: 16, background: "linear-gradient(135deg,#fff3e8,#fde8d0)", color: "#1a1a2e", border: "1px solid rgba(244,123,32,.2)" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 16, color: "#1a1a2e" }}>📚 Complete Book List — JEE Main</h4>
            <div className="grid-3" style={{ gap: 14 }}>
              {[
                {
                  subj: "Physics",
                  books: ["NCERT 11 & 12 (mandatory)", "DC Pandey (full series)", "HC Verma (select chapters)", "Arihant JEE Main Past Years"],
                  color: "#F97316",
                },
                {
                  subj: "Chemistry",
                  books: ["NCERT 11 & 12 (inorganic = enough)", "OP Tandon Organic Chemistry", "Narendra Awasthi Physical Chem", "VK Jaiswal Inorganic (optional)"],
                  color: "#0ea5a4",
                },
                {
                  subj: "Maths",
                  books: ["RD Sharma (Class 11 & 12)", "Cengage Series (topic-wise)", "Arihant 40 Days JEE Main Maths", "NTA Mock Papers (official free)"],
                  color: "#8b5cf6",
                },
              ].map(({ subj, books, color }) => (
                <div key={subj} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${color}`, border: `1px solid ${color}22`, boxShadow: "0 1px 8px rgba(0,0,0,.05)" }}>
                  <div style={{ fontWeight: 700, color, marginBottom: 8, fontSize: 14 }}>{subj}</div>
                  {books.map((b) => (
                    <div key={b} style={{ fontSize: 12, color: "#374151", marginBottom: 5 }}>• {b}</div>
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
            <h2 className="section-title">Best Coaching Institutes for JEE Main</h2>
            <p className="section-sub">From budget-friendly online platforms to Kota's top offline institutes — find the right fit for your preparation style and budget.</p>
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

          {/* Coaching tips */}
          <div className="card" style={{ marginTop: 20, borderLeft: "4px solid #F97316", padding: "16px 20px" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8, fontSize: 15 }}>💡 How to Choose the Right Coaching for JEE Main</h4>
            <div className="grid-2" style={{ gap: 12 }}>
              {[
                { title: "Tight Budget (under ₹10K)", tip: "Physics Wallah (PW) YouTube is free and very good. Spend ₹5K–10K on Arihant/Disha books + NTA free mocks. Self-discipline is the only requirement." },
                { title: "Mid Budget (₹30K–60K)", tip: "Vedantu / Unacademy online batches. Get doubt sessions + test series. Supplement with 3–4 standard books per subject." },
                { title: "Standard Budget (₹1L–2L)", tip: "Narayana or FIITJEE local centre. Good faculty, structured curriculum. Ask about batch sizes — under 40 students is ideal." },
                { title: "Premium / Kota Coaching", tip: "Allen or Resonance Kota if you can relocate. Hostel + coaching is ₹2.5L–4L/year all-in. Best peer group, most competitive environment." },
              ].map(({ title, tip }) => (
                <div key={title} style={{ display: "flex", gap: 10 }}>
                  <Star size={15} color="#F97316" style={{ flexShrink: 0, marginTop: 2 }} />
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
        <Block id="eligibility" eyebrow="Eligibility" title="Who can appear for JEE Main?" sub="Key eligibility criteria at a glance.">
          <EligibilityCards exam={exam} />
        </Block>
      </div>

      {/* ── NIT Rankings ── */}
      <div style={{ background: "var(--sky)" }}>
        <Block id="nit-rankings" eyebrow="NIRF Rankings" title="Top NITs by Ranking &amp; Placements"
          sub="Sort by NIRF rank, average package or placement percentage." bg="transparent">
          <RankingsTable type="NIT" />
        </Block>
      </div>
    </div>
  );
}