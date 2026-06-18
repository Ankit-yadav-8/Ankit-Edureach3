import { useState } from "react";
import Seo from "../components/Seo.jsx";
import PageHero from "../components/home/PageHero.jsx";
import { EXAM_BY_SLUG } from "../data/exams.js";
import RankPredictorTool from "../components/predictor/RankPredictorTool.jsx";
import CollegePredictorTool from "../components/predictor/CollegePredictorTool.jsx";
import CounsellingCard from "../components/predictor/CounsellingCard.jsx";
import { EligibilityCards, RankingsTable } from "../components/predictor/AnalysisSections.jsx";
import { Bars, Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  Atom, FlaskConical, Calculator, FileText,
  CheckCircle2, ArrowRight, MapPin, Globe,
  Star, Target, TrendingUp, TrendingDown, Minus,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   DIFFICULTY DATA  (2021–2025)
   Qualitative labels from official paper-analysis reports.
   Numeric indices calibrated to match qualitative labels.
   Mathematics = toughest subject every year (confirmed).
═══════════════════════════════════════════════════════════ */
const DIFFICULTY_YEARS = [2021, 2022, 2023, 2024, 2025];

const DIFFICULTY_DATA = {
  2021: {
    s1: { phy: 58, chem: 52, math: 65 },
    s2: { phy: 62, chem: 56, math: 70 },
    s1Label: "Moderate",
    s2Label: "Moderate",
    toughest: "Mathematics",
    keyTrend:
      "Physics was the easiest subject; Chemistry was largely NCERT-centric. Mathematics had lengthy calculations but remained at standard difficulty overall.",
    tags: ["Physics easiest", "NCERT-heavy Chemistry", "Maths lengthy"],
  },
  2022: {
    s1: { phy: 65, chem: 52, math: 75 },
    s2: { phy: 70, chem: 58, math: 80 },
    s1Label: "Moderate",
    s2Label: "Tough",
    toughest: "Mathematics",
    keyTrend:
      'Physics became trickier across both sessions. Mathematics was widely rated "most difficult". Chemistry remained the most scoring subject.',
    tags: ["Physics trickier", "Maths most difficult", "Chemistry scoring"],
  },
  2023: {
    s1: { phy: 64, chem: 56, math: 76 },
    s2: { phy: 62, chem: 54, math: 72 },
    s1Label: "Moderate",
    s2Label: "Moderate",
    toughest: "Mathematics",
    keyTrend:
      "Chemistry was scoring and straightforward in both sessions. Mathematics was very lengthy with tricky integrals and coordinate geometry. Physics remained balanced.",
    tags: ["Chemistry scoring", "Maths very lengthy", "Physics balanced"],
  },
  2024: {
    s1: { phy: 70, chem: 55, math: 78 },
    s2: { phy: 68, chem: 58, math: 76 },
    s1Label: "Moderate-Difficult",
    s2Label: "Moderate",
    toughest: "Mathematics",
    keyTrend:
      "Heavy weightage on Calculus and 3D Geometry in Maths. Physics featured application-based questions. Chemistry was the easiest and most scoring subject.",
    tags: ["Heavy Calculus & 3D Geometry", "Physics application-based", "Chemistry easiest"],
  },
  2025: {
    s1: { phy: 68, chem: 57, math: 78 },
    s2: { phy: 72, chem: 60, math: 82 },
    s1Label: "Moderate-Difficult",
    s2Label: "Moderate-Tough",
    toughest: "Mathematics",
    keyTrend:
      "Mathematics was exceptionally lengthy in both sessions. Chemistry remained scoring throughout. Physics was moderate in Session 1 but noticeably tougher in Session 2.",
    tags: ["Maths exceptionally lengthy", "Chemistry scoring", "Physics S2 tougher"],
  },
};

const TREND_PHYSICS   = DIFFICULTY_YEARS.map((y) => ({ year: y, Session1: DIFFICULTY_DATA[y].s1.phy,  Session2: DIFFICULTY_DATA[y].s2.phy  }));
const TREND_CHEMISTRY = DIFFICULTY_YEARS.map((y) => ({ year: y, Session1: DIFFICULTY_DATA[y].s1.chem, Session2: DIFFICULTY_DATA[y].s2.chem }));
const TREND_MATHS     = DIFFICULTY_YEARS.map((y) => ({ year: y, Session1: DIFFICULTY_DATA[y].s1.math, Session2: DIFFICULTY_DATA[y].s2.math }));

/* ═══════════════════════════════════════════════════════════
   QUALIFYING PERCENTILE TREND  (2021–2025)
   Minimum NTA percentile for JoSAA counselling eligibility.
   NOT the JEE Advanced eligibility cutoff.
   Source: jeemain.nta.ac.in official result notifications.
═══════════════════════════════════════════════════════════ */
const QUALIFYING_TREND = [
  { year: 2021, open: 87.89, ews: 66.22, obc: 68.02, sc: 46.88, st: 34.67 },
  { year: 2022, open: 88.41, ews: 67.00, obc: 63.11, sc: 43.08, st: 26.77 },
  { year: 2023, open: 90.77, ews: 75.62, obc: 73.61, sc: 51.97, st: 37.23 },
  { year: 2024, open: 93.23, ews: 81.32, obc: 79.67, sc: 60.09, st: 46.69 },
  { year: 2025, open: 93.10, ews: 80.38, obc: 79.43, sc: 60.09, st: 46.69 },
];

/* Top college cutoffs (JoSAA 2025 Round 6) */
const COLLEGE_CUTOFFS = [
  { name: "NIT Trichy CSE",     open: 99.1, obc: 98.4, sc: 95.2 },
  { name: "NIT Warangal CSE",   open: 98.9, obc: 97.8, sc: 94.8 },
  { name: "NIT Surathkal CSE",  open: 98.5, obc: 97.2, sc: 94.1 },
  { name: "IIIT Hyderabad",     open: 99.4, obc: 98.7, sc: 96.0 },
  { name: "IIIT Bangalore",     open: 98.2, obc: 96.9, sc: 93.5 },
  { name: "NIT Calicut CSE",    open: 98.0, obc: 96.5, sc: 92.8 },
];

/* Syllabus */
const SYLLABUS = {
  Physics: {
    color: "#F15A38", icon: Atom,
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

/* Roadmap */
const ROADMAP = [
  {
    month: "Apr–May", label: "Foundation Build — NCERT First", color: "#F15A38", icon: "📚",
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
    month: "Jun–Aug", label: "Concept Depth — Reference Books", color: "#0EA5A4", icon: "🔬",
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
    month: "Sep–Oct", label: "Class 12 Topics — Full Coverage", color: "#7C3AED", icon: "📐",
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
    month: "Nov–Dec", label: "Mock Tests + Session 1 Prep", color: "#EC4899", icon: "📝",
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
    month: "Jan (S1)", label: "JEE Main Session 1 Exam", color: "#EAB308", icon: "✏️",
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
    month: "Feb–Mar", label: "Bridge Gap — S1 to S2 Improvement", color: "#6366F1", icon: "🔁",
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
    month: "Apr (S2)", label: "JEE Main Session 2 — Best Score Counts", color: "#15A06E", icon: "🎯",
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

/* Coaching institutes */
const COACHING = [
  {
    name: "Allen Career Institute", city: "Kota, Rajasthan", color: "#F15A38", badge: "🏆 #1 in India",
    highlights: [
      "Largest coaching institute — 1.5 lakh+ students annually",
      "JEE Main 100 percentile scorers every year from Allen",
      "Classroom, distance (DLPD) & online programs",
      "Leader Board batches for top-ranked students",
    ],
    website: "https://www.allen.ac.in", fee: "₹1.2L – ₹2.5L/year", mode: "Offline / Online",
  },
  {
    name: "Resonance", city: "Kota, Rajasthan", color: "#7C3AED", badge: "⭐ Strong Maths Faculty",
    highlights: [
      "Excellent track record in JEE Main top 1000 ranks",
      "ResoFAST scholarship exam — merit-based fee waivers",
      "e-Resonance online platform with live + recorded classes",
      "Widely used All-India test series (even by self-studiers)",
    ],
    website: "https://www.resonance.ac.in", fee: "₹1.0L – ₹2.2L/year", mode: "Offline / Online",
  },
  {
    name: "FIITJEE", city: "Delhi + 30+ cities", color: "#0EA5A4", badge: "🎓 Conceptual Depth",
    highlights: [
      "Pioneer IIT-JEE coaching since 1992",
      "Integrated school + JEE program (Class 9–12)",
      "FTRE scholarship test for merit admissions",
      "Strong focus on JEE Advanced level concept building",
    ],
    website: "https://www.fiitjee.com", fee: "₹1.5L – ₹3.0L/year", mode: "Offline / Online",
  },
  {
    name: "Narayana", city: "Hyderabad + Pan India", color: "#EC4899", badge: "📍 500+ Centres",
    highlights: [
      "Best value for money — affordable fees + scholarships",
      "Excellent NIT results from SC/ST/OBC categories",
      "Integrated residential school + coaching available",
      "Strong presence in South India and Tier-2 cities",
    ],
    website: "https://www.narayanaiit.com", fee: "₹70K – ₹1.6L/year", mode: "Offline / Residential",
  },
  {
    name: "Physics Wallah (PW)", city: "Online + Patna / Lucknow", color: "#15A06E", badge: "💸 Most Affordable",
    highlights: [
      "Alakh Pandey's platform — most popular JEE YouTube content",
      "Batch fees under ₹10K–₹30K for full JEE Main prep",
      "PW Vidyapeeth offline centres in major cities",
      "Arjuna / Lakshya batches with DPPs and test series",
    ],
    website: "https://www.pw.live", fee: "₹5K – ₹40K/year", mode: "Online / Offline (select cities)",
  },
  {
    name: "Vedantu / Unacademy", city: "Online (Pan India)", color: "#6366F1", badge: "💻 Top Online Platform",
    highlights: [
      "Live interactive classes with IIT alumni faculty",
      "Vedantu VSAT / Unacademy ICONIC for top batches",
      "Doubt-solving sessions, recorded lectures, test series",
      "Best for students who cannot relocate to Kota",
    ],
    website: "https://www.vedantu.com", fee: "₹30K – ₹1.2L/year", mode: "Online",
  },
];

/* ── Helpers ── */
function diffIndex(val) {
  if (val >= 75) return { label: "Hard",   color: "#EF4444", bg: "#fee2e2" };
  if (val >= 65) return { label: "Medium", color: "#F15A38", bg: "#ffffff" };
  return               { label: "Easy",   color: "#15A06E", bg: "#d1fae5" };
}
function labelMeta(label) {
  if (label.includes("Tough"))     return { color: "#EF4444", bg: "#fee2e2" };
  if (label.includes("Difficult")) return { color: "#F15A38", bg: "#ffffff" };
  return                                  { color: "#15A06E", bg: "#d1fae5" };
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

/* ── Animated bar chart (inline, no external dep) ── */
function SubjectBar({ label, s1, s2, color, animate }) {
  const maxVal = 100;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: "var(--navy)" }}>{label}</span>
        <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--muted)" }}>
          <span style={{ color: "#F15A38", fontWeight: 700 }}>S1: {s1}</span>
          <span style={{ color: "#7C3AED", fontWeight: 700 }}>S2: {s2}</span>
        </div>
      </div>
      {/* Session 1 */}
      <div style={{ marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--muted)", minWidth: 60 }}>Session 1</span>
          <div style={{ flex: 1, height: 10, borderRadius: 6, background: "#f0f0f5", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: animate ? `${(s1 / maxVal) * 100}%` : "0%",
              background: `linear-gradient(90deg, #F15A38, #fb923c)`,
              borderRadius: 6,
              transition: "width 0.9s cubic-bezier(.4,0,.2,1)",
            }} />
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, minWidth: 32, textAlign: "right",
            color: diffIndex(s1).color,
          }}>{diffIndex(s1).label}</span>
        </div>
      </div>
      {/* Session 2 */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--muted)", minWidth: 60 }}>Session 2</span>
          <div style={{ flex: 1, height: 10, borderRadius: 6, background: "#f0f0f5", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: animate ? `${(s2 / maxVal) * 100}%` : "0%",
              background: `linear-gradient(90deg, #7C3AED, #a855f7)`,
              borderRadius: 6,
              transition: "width 0.9s cubic-bezier(.4,0,.2,1) 0.15s",
            }} />
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, minWidth: 32, textAlign: "right",
            color: diffIndex(s2).color,
          }}>{diffIndex(s2).label}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Qualifying percentile mini-bar ── */
function PctBar({ label, value, color, maxValue = 100 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: "var(--muted)", minWidth: 68, fontWeight: 600 }}>{label}</span>
      <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#f0f0f5", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${(value / maxValue) * 100}%`,
          background: color,
          borderRadius: 4,
          transition: "width 0.8s ease",
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color, minWidth: 44, textAlign: "right", fontFamily: "Sora" }}>{value}%</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Main Page Component
════════════════════════════════════════════════════════════ */
export default function JeeMain() {
  const exam = EXAM_BY_SLUG["jee-main"];
  const [selectedYear, setSelectedYear] = useState(2025);
  const [animateBars, setAnimateBars] = useState(true);
  const d = DIFFICULTY_DATA[selectedYear];

  const subjectBars = [
    { name: "Physics",   Session1: d.s1.phy,  Session2: d.s2.phy  },
    { name: "Chemistry", Session1: d.s1.chem, Session2: d.s2.chem },
    { name: "Maths",     Session1: d.s1.math, Session2: d.s2.math },
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
      <Seo
        title="JEE Main Rank Predictor — Percentile to Rank & College Predictor"
        description="Free JEE Main rank predictor. Convert your NTA percentile to an expected rank and see which IITs, NITs and IIITs you can get, category-wise. Built by IIT Roorkee alumni."
        path="/jee-main"
      />

      {/* ── Global Styles ── */}
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.95)}      to{opacity:1;transform:scale(1)}      }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(249,115,22,.4); }
          70%  { box-shadow: 0 0 0 10px rgba(249,115,22,0); }
          100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
        }
        .fade-up   { animation: fadeUp  .44s cubic-bezier(.4,0,.2,1) both; }
        .scale-in  { animation: scaleIn .36s cubic-bezier(.4,0,.2,1) both; }
        .d1 { animation-delay: .04s }
        .d2 { animation-delay: .10s }
        .d3 { animation-delay: .16s }
        .d4 { animation-delay: .22s }
        .year-active { animation: pulseRing 1.2s ease; }

        .card-hover { transition: transform .2s, box-shadow .2s; cursor: default; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,.09); }

        .diff-tag {
          display: inline-block;
          font-size: 11px; font-weight: 700;
          padding: 4px 11px; border-radius: 50px;
          background: rgba(244,123,32,.12); color: #c75b0a;
          border: 1px solid rgba(244,123,32,.25);
          margin: 3px 3px 3px 0; letter-spacing: .2px;
        }

        .pct-card {
          background: var(--sky);
          border-radius: 14px;
          padding: 16px 20px;
          border: 1px solid var(--line);
          transition: transform .2s, box-shadow .2s;
        }
        .pct-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.06); }

        .yr-row:hover td { background: #fdf6ee !important; }
        .qty-row:hover td { background: #f0f9ff !important; }

        .nav-pill {
          background: rgba(244,123,32,.11); border: 1px solid rgba(244,123,32,.3);
          color: #c75b0a; padding: 8px 16px; border-radius: 50px;
          font-size: 13px; font-weight: 600; text-decoration: none;
          transition: all 0.18s;
        }
        .nav-pill:hover { background: #F15A38; color: #fff; border-color: #F15A38; }

        .section-divider {
          height: 3px;
          background: linear-gradient(90deg, #F15A38 0%, #0EA5A4 40%, #7C3AED 70%, #EC4899 100%);
          border-radius: 2px; margin: 0;
        }
      `}</style>

      {/* ── Hero (blog-style) ── */}
      <PageHero
        eyebrow="JEE Main 2026" eyebrowIcon={Target} accent="#F15A38"
        titleLead="JEE Main —" highlight="rank & college" titleTail="" highlightTail="predictor hub."
        sub="Predict your rank, find every NIT, IIIT & GFTI you qualify for, analyse session-wise difficulty, and follow the complete syllabus, roadmap & coaching options."
        cta={{ label: "Predict my rank", to: "#rank" }}
        cards={[
          { icon: Calculator, accent: "#F15A38", category: "Tool", title: "JEE Main Rank Predictor", meta: "Marks → percentile → CRL", badge: "LIVE" },
          { icon: Target, accent: "#0ea5a4", category: "Tool", title: "College Predictor", meta: "Every NIT · IIIT · GFTI", badge: "LIVE" },
          { icon: TrendingUp, accent: "#6366f1", category: "Trends", title: "Qualifying Cutoffs 2021–25", meta: "Category-wise percentile" },
        ]}
      />
      {/* #cutoffs anchor kept for the "Top Cutoffs" sub-nav pill */}
      <div id="cutoffs" style={{ scrollMarginTop: 90 }} />

      {/* ── Rank Predictor ── */}
      <Block id="rank" eyebrow="Tool 1" title="JEE Main Rank Predictor"
        sub="Convert your expected marks into an All-India rank (CRL) and your category rank.">
        <RankPredictorTool accent="#F15A38" />
      </Block>

      {/* ── College Predictor ── */}
      <div style={{ background: "var(--sky)" }}>
        <Block id="college" eyebrow="Tool 2" title="JEE Main College Predictor"
          sub="Enter your rank to see every eligible NIT, IIIT & GFTI with JoSAA and CSAB round cutoffs." bg="transparent">
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#fff8ed", border: "1px solid #F15A38",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            fontSize: 13, color: "#92400e",
          }}>
            <span style={{ fontSize: 18 }}>⏳</span>
            <span>
              <strong>Please wait 1–2 minutes</strong> while colleges load. If your browser shows a "Page Unresponsive" pop-up, click <strong>"Wait"</strong> — do <em>not</em> click "Exit Page".
            </span>
          </div>
          <div className="predictor-layout" style={{ display: "block" }}>
            <div style={{ minWidth: 0 }}>
              <CollegePredictorTool basePath="/jee-main" />
            </div>
          </div>
        </Block>
      </div>

      {/* ════════════════════════════════════════════════════════
          DIFFICULTY ANALYSIS
      ════════════════════════════════════════════════════════ */}
      <section id="difficulty" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">

          <div className="title-bar">
            <span className="eyebrow">Session Analysis · 2021–2025</span>
            <h2 className="section-title">Session-wise Difficulty — Subject Analysis</h2>
            <p className="section-sub">
              Select a year to compare Physics, Chemistry &amp; Maths difficulty across both sessions.
              Qualitative labels from official paper analysis. Index: 0 = easiest · 100 = hardest.
            </p>
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
                  className={selectedYear === y ? "year-active" : ""}
                  style={{
                    padding: "9px 24px", borderRadius: 50, fontWeight: 700, fontSize: 14,
                    border: "none", cursor: "pointer", fontFamily: "Sora",
                    background: selectedYear === y ? "linear-gradient(135deg,#F15A38,#fb923c)" : "transparent",
                    color: selectedYear === y ? "#fff" : "var(--navy)",
                    boxShadow: selectedYear === y ? "0 4px 16px rgba(249,115,22,.35)" : "none",
                    transition: "all 0.22s",
                  }}
                >{y}</button>
              ))}
            </div>
          </div>

          {/* ── Session Overall Badges ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            {[
              { session: "Session 1", label: d.s1Label, vals: d.s1, delay: "d1" },
              { session: "Session 2", label: d.s2Label, vals: d.s2, delay: "d2" },
            ].map(({ session, label, vals, delay }) => {
              const meta = labelMeta(label);
              const avg  = Math.round((vals.phy + vals.chem + vals.math) / 3);
              return (
                <div key={session}
                  className={`card card-hover scale-in ${delay}`}
                  style={{ borderTop: `4px solid ${meta.color}`, padding: "22px 26px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                        {session} Overall · JEE Main {selectedYear}
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

          {/* ── Enhanced Subject Cards with inline bars ── */}
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
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#F15A38", display: "inline-block" }} />Session 1
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#7C3AED", display: "inline-block" }} />Session 2
                </span>
              </div>
            </div>
            <SubjectBar label="⚛ Physics"   s1={d.s1.phy}  s2={d.s2.phy}  color="#F15A38" animate={animateBars} />
            <SubjectBar label="⚗ Chemistry" s1={d.s1.chem} s2={d.s2.chem} color="#0EA5A4" animate={animateBars} />
            <SubjectBar label="∑ Maths"     s1={d.s1.math} s2={d.s2.math} color="#7C3AED" animate={animateBars} />
          </div>

          {/* ── Grouped Bar Chart via Charts.jsx ── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <h4 style={{ fontFamily: "Sora", fontWeight: 700 }}>
                Session 1 vs Session 2 — All Subjects · {selectedYear}
              </h4>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Higher bar = more difficult</span>
            </div>
            <Bars
              key={`bars-${selectedYear}`}
              data={subjectBars}
              bars={[
                { key: "Session1", label: "Session 1", color: "#F15A38" },
                { key: "Session2", label: "Session 2", color: "#7C3AED" },
              ]}
              height={280}
            />
          </div>

          {/* ── Key Trends Card ── */}
          <div className={`card fade-up`} style={{ borderLeft: "4px solid #F15A38", padding: "20px 24px", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>💡</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
                  Key Trends — JEE Main {selectedYear}
                </h4>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 12 }}>{d.keyTrend}</p>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 11, color: "#F15A38", marginRight: 6, textTransform: "uppercase", letterSpacing: .5 }}>
                    <TrendingUp size={12} style={{ display: "inline", marginRight: 4 }} />Highlights:
                  </span>
                  {d.tags.map((tag) => (
                    <span key={tag} className="diff-tag">{tag}</span>
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
                    <th>Session 1 Difficulty</th>
                    <th>Session 2 Difficulty</th>
                    <th>Toughest Subject</th>
                    <th>Key Trends</th>
                  </tr>
                </thead>
                <tbody>
                  {DIFFICULTY_YEARS.map((y) => {
                    const row = DIFFICULTY_DATA[y];
                    const m1  = labelMeta(row.s1Label);
                    const m2  = labelMeta(row.s2Label);
                    return (
                      <tr key={y} className="yr-row">
                        <td>
                          <strong style={{ fontFamily: "Sora", fontSize: 15, color: selectedYear === y ? "#F15A38" : "var(--navy)" }}>
                            {y}{selectedYear === y ? " ◀" : ""}
                          </strong>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 11px", borderRadius: 50, background: m1.bg, color: m1.color }}>
                            {row.s1Label}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 11px", borderRadius: 50, background: m2.bg, color: m2.color }}>
                            {row.s2Label}
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
              How Session 1 &amp; Session 2 difficulty has shifted per subject over 5 years.
              Mathematics toughest every year; Chemistry consistently scoring.
            </p>
          </div>

          <div className="grid-3" style={{ gap: 22, marginBottom: 22 }}>
            {[
              { label: "Physics",   data: TREND_PHYSICS,   c1: "#F15A38", c2: "#fdba74", note: "Becoming harder each year — application-based questions rising" },
              { label: "Chemistry", data: TREND_CHEMISTRY, c1: "#0EA5A4", c2: "#5eead4", note: "Most scoring subject consistently — NCERT-based prep sufficient" },
              { label: "Maths",     data: TREND_MATHS,     c1: "#7C3AED", c2: "#c084fc", note: "Toughest every year — Calculus & 3D Geometry heavily weighted" },
            ].map(({ label, data, c1, c2, note }) => (
              <div key={label} className="card card-hover">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, color: c1 }}>{label}</h4>
                  <div style={{ display: "flex", gap: 10, fontSize: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c1, display: "inline-block" }} />S1
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c2, display: "inline-block" }} />S2
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 }}>{note}</p>
                <Trend
                  data={data}
                  lines={[
                    { key: "Session1", label: "Session 1", color: c1 },
                    { key: "Session2", label: "Session 2", color: c2 },
                  ]}
                  height={200}
                />
              </div>
            ))}
          </div>

          {/* Trend insight mini cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              { icon: "⚛", color: "#F15A38", title: "Physics",   stat: "↑ +14 pts", sub: "Index rose from ~60 (2021) to ~72 (2025 S2) — harder every year" },
              { icon: "⚗", color: "#0EA5A4", title: "Chemistry", stat: "↑ +8 pts",  sub: "Mild increase overall — still the most scoring subject consistently" },
              { icon: "∑",  color: "#7C3AED", title: "Maths",    stat: "↑ +17 pts", sub: "Steepest rise — from ~65 (2021) to ~82 (2025 S2). Calculus is key" },
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
          QUALIFYING PERCENTILE TREND  (enhanced)
      ════════════════════════════════════════════════════════ */}
      <section id="trend" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Cutoff Trends · 2021–2025</span>
            <h2 className="section-title">JEE Main — Qualifying Percentile Trend</h2>
            <p className="section-sub">
              Minimum NTA percentile to qualify JEE Main for NIT/IIIT/GFTI admission via JoSAA — category-wise.
              <strong> This is the JEE Main qualifying cutoff, not JEE Advanced eligibility.</strong>
            </p>
          </div>

          {/* Latest year quick visual */}
          <div className="cat-cutoff-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { cat: "General",  key: "open", color: "#1c4fa0" },
              { cat: "GEN-EWS",  key: "ews",  color: "#7C3AED" },
              { cat: "OBC-NCL",  key: "obc",  color: "#F4A261" },
              { cat: "SC",       key: "sc",   color: "#2EC4B6" },
              { cat: "ST",       key: "st",   color: "#F15A38" },
            ].map(({ cat, key, color }) => {
              const latest = QUALIFYING_TREND[QUALIFYING_TREND.length - 1];
              const prev   = QUALIFYING_TREND[QUALIFYING_TREND.length - 2];
              const val    = latest[key];
              const diff   = (val - prev[key]).toFixed(2);
              const isUp   = diff >= 0;
              return (
                <div key={cat} className="pct-card fade-up" style={{ borderTop: `4px solid ${color}` }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>{cat}</div>
                  <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 22, color, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 8 }}>percentile (2025)</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: isUp ? "#EF4444" : "#15A06E" }}>
                    {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {isUp ? "+" : ""}{diff} vs 2024
                  </div>
                  <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: "#e5e7eb", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card">
            {/* Data table */}
            <div style={{ overflowX: "auto", marginBottom: 24 }}>
              <table className="data-table" style={{ minWidth: 600, fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th style={{ textAlign: "center" }}>General</th>
                    <th style={{ textAlign: "center" }}>GEN-EWS</th>
                    <th style={{ textAlign: "center" }}>OBC-NCL</th>
                    <th style={{ textAlign: "center" }}>SC</th>
                    <th style={{ textAlign: "center" }}>ST</th>
                  </tr>
                </thead>
                <tbody>
                  {QUALIFYING_TREND.map((row) => (
                    <tr key={row.year} className="qty-row">
                      <td><strong style={{ fontFamily: "Sora", fontSize: 14 }}>{row.year}</strong></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 800 }}>{row.open}%ile</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#7C3AED" }}>{row.ews}%ile</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#F4A261" }}>{row.obc}%ile</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#2EC4B6" }}>{row.sc}%ile</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: "#F15A38" }}>{row.st}%ile</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Per-category mini bars for latest year */}
            <div style={{ marginBottom: 20, padding: "16px 20px", background: "var(--sky)", borderRadius: 12, border: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, marginBottom: 14, color: "var(--navy)" }}>
                📊 2025 Qualifying Percentile — Category Visual
              </div>
              <PctBar label="General"  value={93.10} color="#1c4fa0" />
              <PctBar label="GEN-EWS"  value={80.38} color="#7C3AED" />
              <PctBar label="OBC-NCL"  value={79.43} color="#F4A261" />
              <PctBar label="SC"       value={60.09} color="#2EC4B6" />
              <PctBar label="ST"       value={46.69} color="#F15A38" />
            </div>

            <Trend
              data={QUALIFYING_TREND}
              lines={[
                { key: "open", label: "General",  color: "#1c4fa0" },
                { key: "ews",  label: "GEN-EWS",  color: "#7C3AED" },
                { key: "obc",  label: "OBC-NCL",  color: "#F4A261" },
                { key: "sc",   label: "SC",        color: "#2EC4B6" },
                { key: "st",   label: "ST",        color: "#F15A38" },
              ]}
              height={320}
            />

            {/* Key insights */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
              <div style={{ padding: "12px 16px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fca5a5" }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#EF4444", marginBottom: 4 }}>📈 General cutoff rising</div>
                <div style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.5 }}>
                  General category cutoff rose from 87.89 (2021) to 93.23 (2024) — an increase of ~5.3 percentile points in 4 years.
                </div>
              </div>
              <div style={{ padding: "12px 16px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #86efac" }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#15A06E", marginBottom: 4 }}>📉 2025 slight dip</div>
                <div style={{ fontSize: 12, color: "#14532d", lineHeight: 1.5 }}>
                  2025 saw a marginal drop across most categories (~0.1–1%) compared to 2024, possibly due to higher paper difficulty.
                </div>
              </div>
            </div>

            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14, textAlign: "center" }}>
              * NTA percentile scores from official JEE Main result notifications. Qualifying cutoff for JoSAA counselling.
              Verify at{" "}
              <a href="https://jeemain.nta.ac.in" target="_blank" rel="noreferrer" style={{ color: "#F15A38", fontWeight: 600 }}>
                jeemain.nta.ac.in
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
            <h2 className="section-title">Complete JEE Main Syllabus</h2>
            <p className="section-sub">75 questions · 300 marks · 3 hours. 25 questions per subject (20 MCQ + 5 Numerical Value).</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Total Questions", value: "75",    sub: "25 per subject", color: "#F15A38" },
              { label: "Total Marks",     value: "300",   sub: "4 marks each",   color: "#0EA5A4" },
              { label: "Duration",        value: "3 hrs", sub: "180 minutes",    color: "#7C3AED" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="card" style={{ textAlign: "center", borderTop: `4px solid ${color}`, padding: "20px 12px" }}>
                <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 32, color }}>{value}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</div>
              </div>
            ))}
          </div>

          <div className="grid-3" style={{ gap: 22 }}>
            {Object.entries(SYLLABUS).map(([subj, { color, icon: Icon, topics }]) => (
              <div key={subj} className="card card-hover" style={{ borderTop: `4px solid ${color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "grid", placeItems: "center" }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17 }}>{subj}</h3>
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

      {/* ════════════════════════════════════════════════════════
          STUDY ROADMAP
      ════════════════════════════════════════════════════════ */}
      <section id="roadmap" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Study Roadmap</span>
            <h2 className="section-title">JEE Main Preparation Roadmap</h2>
            <p className="section-sub">Step-by-step plan with specific tasks, books and daily targets — from foundation through both sessions.</p>
          </div>

          <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0, width: 3,
              background: "linear-gradient(180deg,#F15A38,#0EA5A4,#7C3AED,#EC4899,#EAB308,#6366F1,#15A06E)",
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
          <div className="card" style={{ marginTop: 16, background: "linear-gradient(135deg,#ffffff,#ffffff)", border: "1px solid rgba(244,123,32,.2)" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 800, marginBottom: 16, color: "#1a1a2e" }}>📚 Complete Book List — JEE Main</h4>
            <div className="grid-3" style={{ gap: 14 }}>
              {[
                { subj: "Physics",   books: ["NCERT 11 & 12 (mandatory)", "DC Pandey (full series)", "HC Verma (select chapters)", "Arihant JEE Main Past Years"], color: "#F15A38" },
                { subj: "Chemistry", books: ["NCERT 11 & 12 (inorganic = enough)", "OP Tandon Organic Chemistry", "Narendra Awasthi Physical Chem", "VK Jaiswal Inorganic (optional)"], color: "#0ea5a4" },
                { subj: "Maths",     books: ["RD Sharma (Class 11 & 12)", "Cengage Series (topic-wise)", "Arihant 40 Days JEE Main Maths", "NTA Mock Papers (official free)"], color: "#8b5cf6" },
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
            <h2 className="section-title">Best Coaching Institutes for JEE Main</h2>
            <p className="section-sub">From budget-friendly online platforms to Kota's top offline institutes — find the right fit for your budget and study style.</p>
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

          <div className="card" style={{ marginTop: 20, borderLeft: "4px solid #F15A38", padding: "16px 20px" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 800, marginBottom: 10, fontSize: 15 }}>💡 How to Choose the Right Coaching for JEE Main</h4>
            <div className="grid-2" style={{ gap: 12 }}>
              {[
                { title: "Tight Budget (under ₹10K)",  tip: "Physics Wallah (PW) YouTube is free and excellent. Spend ₹5K–10K on Arihant/Disha books + NTA free mocks. Self-discipline is the only requirement." },
                { title: "Mid Budget (₹30K–60K)",      tip: "Vedantu / Unacademy online batches. Get doubt sessions + test series. Supplement with 3–4 standard books per subject." },
                { title: "Standard Budget (₹1L–2L)",   tip: "Narayana or FIITJEE local centre. Good faculty, structured curriculum. Ask about batch sizes — under 40 students is ideal." },
                { title: "Premium / Kota Coaching",    tip: "Allen or Resonance Kota if you can relocate. Hostel + coaching is ₹2.5L–4L/year all-in. Best peer group, most competitive environment." },
              ].map(({ title, tip }) => (
                <div key={title} style={{ display: "flex", gap: 10 }}>
                  <Star size={15} color="#F15A38" style={{ flexShrink: 0, marginTop: 2 }} />
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
