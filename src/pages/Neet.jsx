import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { Bars, Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import { NEET_COLLEGES, NEET_STATES, NEET_TOTAL_SEATS } from "../data/neetColleges.js";
import {
  Atom, FlaskConical, Leaf, FileText, CheckCircle2, ArrowRight,
  MapPin, Globe, Target, TrendingUp, TrendingDown, Building2,
  Stethoscope, Users, Landmark, Gauge as GaugeIcon, BadgeCheck,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   NEET UG — built to mirror the JEE Advanced hub in layout &
   style. NEET is a single 720-mark paper (Physics 180 ·
   Chemistry 180 · Biology 360 = Botany + Zoology), conducted
   by the NTA. ALL figures below are ILLUSTRATIVE for layout —
   the predictor tools are non-functional design mock-ups.
═══════════════════════════════════════════════════════════ */

const ACCENT = "#15a06e";          // NEET green
const C_PHY = "#F47B20";           // Physics — orange
const C_CHEM = "#0EA5A4";          // Chemistry — teal
const C_BIO = "#15a06e";           // Biology — green

const DIFFICULTY_YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

/* Per-subject difficulty index (0 = easiest, 100 = hardest).
   In NEET, Physics is the toughest and Biology the most scoring. */
const DIFFICULTY_DATA = {
  2021: {
    phy: 78, chem: 55, bio: 42, label: "Moderate", toughest: "Physics",
    keyTrend: "A balanced paper overall. Physics was calculation-heavy and the main rank-decider, Chemistry leaned on NCERT, and Biology stayed the most scoring section with direct, fact-based questions.",
    tags: ["Physics decisive", "Biology scoring", "NCERT-heavy chemistry"],
    snap: { candidates: "16.1 L", qualified: "8.7 L", note: "Tie-breaking marks pushed the cutoff conversation." },
  },
  2022: {
    phy: 82, chem: 60, bio: 45, label: "Moderate-Hard", toughest: "Physics",
    keyTrend: "Physics turned lengthy and numerical-intensive — the toughest section by far. Chemistry rose slightly in difficulty with more Physical Chemistry numericals. Biology remained predictable and high-scoring.",
    tags: ["Lengthy physics", "More physical chem", "Biology predictable"],
    snap: { candidates: "18.7 L", qualified: "9.9 L", note: "Lengthy physics stretched time management." },
  },
  2023: {
    phy: 80, chem: 52, bio: 40, label: "Moderate", toughest: "Physics",
    keyTrend: "Physics again led difficulty but was a touch more direct than 2022. Chemistry was the most NCERT-aligned in years. Biology was straightforward, making accuracy the differentiator at the top.",
    tags: ["Direct biology", "NCERT chemistry", "Accuracy decisive"],
    snap: { candidates: "20.9 L", qualified: "11.4 L", note: "Record registrations; biology kept toppers tightly bunched." },
  },
  2024: {
    phy: 62, chem: 48, bio: 38, label: "Easy", toughest: "Physics",
    keyTrend: "One of the easiest papers in years across all three subjects — which pushed scores and the cutoff to record highs. With Biology and Chemistry very scoring, even small Physics errors cost thousands of ranks.",
    tags: ["Easiest in years", "Record-high scores", "Tiny errors costly"],
    snap: { candidates: "24.0 L", qualified: "13.1 L", note: "Easy paper → record 720/720 scorers & cutoff spike." },
  },
  2025: {
    phy: 85, chem: 64, bio: 46, label: "Hard", toughest: "Physics",
    keyTrend: "A sharp swing back to difficulty. Physics was the hardest in recent memory with multi-step numericals, Chemistry leaned application-based, and even Biology had tricky assertion-reason questions — dropping scores sharply.",
    tags: ["Toughest physics", "Application chemistry", "Tricky biology A-R"],
    snap: { candidates: "22.7 L", qualified: "12.3 L", note: "Hard paper reset scores after the 2024 spike." },
  },
  2026: {
    phy: 74, chem: 56, bio: 43, label: "Moderate", toughest: "Physics",
    keyTrend: "A balanced rebound from 2025. Physics stayed the toughest but was more approachable, Chemistry was NCERT-first, and Biology returned to its reliable, scoring form — a fair paper rewarding consistent NCERT prep.",
    tags: ["Balanced rebound", "NCERT-first chemistry", "Biology back to scoring"],
    snap: { candidates: "25.4 L", qualified: "13.8 L", note: "A fair, balanced paper after a hard 2025." },
  },
};

const TREND_PHYSICS   = DIFFICULTY_YEARS.map((y) => ({ year: y, value: DIFFICULTY_DATA[y].phy }));
const TREND_CHEMISTRY = DIFFICULTY_YEARS.map((y) => ({ year: y, value: DIFFICULTY_DATA[y].chem }));
const TREND_BIOLOGY   = DIFFICULTY_YEARS.map((y) => ({ year: y, value: DIFFICULTY_DATA[y].bio }));

/* Year-wise score-for-rank reference (≈ same AIR band) — the basis for the
   difficulty read: an easier paper needs a higher score for the same rank. */
const SCORE_RANK_TREND = [
  { year: 2021, air: 17517, score: 603 },
  { year: 2022, air: 20004, score: 602 },
  { year: 2023, air: 21957, score: 612 },
  { year: 2024, air: 22719, score: 655 },
  { year: 2025, air: 24949, score: 529 },
];

/* Illustrative NEET marks → expected All-India Rank band (out of 720). */
const MARKS_VS_RANK = [
  { marks: "700 – 720", rank: "1 – 80",            color: "#15A06E" },
  { marks: "680 – 699", rank: "80 – 600",          color: "#15A06E" },
  { marks: "650 – 679", rank: "600 – 2,800",       color: "#0EA5A4" },
  { marks: "620 – 649", rank: "2,800 – 7,500",     color: "#0EA5A4" },
  { marks: "600 – 619", rank: "7,500 – 15,000",    color: "#EAB308" },
  { marks: "580 – 599", rank: "15,000 – 27,000",   color: "#EAB308" },
  { marks: "550 – 579", rank: "27,000 – 52,000",   color: "#F97316" },
  { marks: "500 – 549", rank: "52,000 – 95,000",   color: "#F97316" },
  { marks: "450 – 499", rank: "95,000 – 1.6 L",    color: "#EF4444" },
];

/* Qualifying cutoff (NEET 50th-percentile, out of 720) — illustrative. */
const QUALIFYING_TREND = [
  { year: 2021, gen: 138, obc_sc_st: 108, pwd: 122 },
  { year: 2022, gen: 117, obc_sc_st: 93,  pwd: 105 },
  { year: 2023, gen: 137, obc_sc_st: 107, pwd: 121 },
  { year: 2024, gen: 164, obc_sc_st: 130, pwd: 146 },
  { year: 2025, gen: 144, obc_sc_st: 113, pwd: 127 },
  { year: 2026, gen: 150, obc_sc_st: 117, pwd: 132 },
];

const SYLLABUS = {
  Physics: {
    color: C_PHY, icon: Atom, q: "45 Q · 180 marks",
    topics: [
      "Mechanics — Kinematics, Laws of Motion, Work-Energy",
      "Rotational Motion & Gravitation",
      "Thermodynamics & Kinetic Theory of Gases",
      "Oscillations & Waves",
      "Electrostatics & Current Electricity",
      "Magnetism & Electromagnetic Induction",
      "Optics — Ray & Wave Optics",
      "Modern Physics & Semiconductor Electronics",
    ],
  },
  Chemistry: {
    color: C_CHEM, icon: FlaskConical, q: "45 Q · 180 marks",
    topics: [
      "Physical — Mole Concept, Thermodynamics, Equilibrium",
      "Atomic Structure & Chemical Bonding",
      "Electrochemistry, Kinetics & Solutions",
      "Organic — GOC, Hydrocarbons, Isomerism",
      "Oxygen-containing & Nitrogen Functional Groups",
      "Biomolecules, Polymers & Chemistry in Everyday Life",
      "Inorganic — Periodic Table, p / d / f-block",
      "Coordination Compounds & Metallurgy",
    ],
  },
  Biology: {
    color: C_BIO, icon: Leaf, q: "90 Q · 360 marks",
    topics: [
      "Diversity of Living Organisms",
      "Structural Organisation in Plants & Animals",
      "Cell Structure & Function",
      "Plant Physiology",
      "Human Physiology (highest weightage)",
      "Reproduction (Plant & Human)",
      "Genetics & Evolution",
      "Biology in Human Welfare, Biotechnology & Ecology",
    ],
  },
};

/* 12-month NEET roadmap (NCERT-first, Biology-heavy). */
const ROADMAP = [
  {
    month: "Jun–Aug", label: "NCERT Foundation (Biology First)", color: C_BIO, icon: "🌿",
    tip: "NEET is won on NCERT — especially Biology. Read NCERT Biology line by line and start Class 11 Physics & Chemistry fundamentals. Build the habit of underlining every NCERT statement.",
    tasks: [
      "NCERT Biology Class 11 — every line, twice",
      "NCERT Chemistry 11 — mole concept, bonding, GOC",
      "NCERT Physics 11 — mechanics fundamentals",
      "Start a Biology one-liner / diagram notebook",
      "Target: 6–8 hrs/day with daily NCERT reading",
    ],
    resources: ["NCERT Biology 11", "NCERT Physics & Chemistry 11", "Truemans Elementary Biology"],
  },
  {
    month: "Sep–Nov", label: "Concept Building & Problem Solving", color: C_CHEM, icon: "🔬",
    tip: "Layer problem-solving onto NCERT. Practice Physics numericals daily, master Organic reaction mechanisms, and keep revising Biology weekly so retention compounds.",
    tasks: [
      "Physics: HC Verma + DC Pandey (NEET-level)",
      "Organic Chemistry — reaction mechanisms chapter-wise",
      "NCERT Biology Class 12 — Genetics & Reproduction",
      "Weekly Biology revision + assertion-reason practice",
      "Physical Chemistry numericals (N. Awasthi selective)",
    ],
    resources: ["HC Verma", "MS Chouhan Organic", "NCERT Biology 12", "Trueman's Biology"],
  },
  {
    month: "Dec–Feb", label: "Class 12 Depth & PYQs", color: C_PHY, icon: "📐",
    tip: "Finish Class 12 Physics & Chemistry, complete Human Physiology and Ecology in Biology, and start solving the last 10 years of NEET PYQs subject-wise.",
    tasks: [
      "Electrostatics → Modern Physics (full Class 12)",
      "Inorganic & Coordination Chemistry",
      "Human Physiology, Ecology & Biotechnology",
      "NEET PYQs (2015–2023) chapter-wise",
      "Build NCERT-line-based mistake log",
    ],
    resources: ["NCERT 12 (all)", "MTG 33 Years NEET PYQ", "Allen modules"],
  },
  {
    month: "Mar–Apr", label: "Full Mocks & Weak-Area Fix", color: "#EC4899", icon: "📝",
    tip: "Attempt full 720-mark mocks (3h 20m) twice a week in exam-day conditions. Analyse every mock subject-wise. Prioritise Biology accuracy — it carries half the paper.",
    tasks: [
      "2 full mocks/week (200 Q · attempt 180)",
      "Subject-wise error log with NCERT references",
      "Re-revise Biology weekly (90 Q decide rank)",
      "Speed + accuracy drills for Physics",
      "Past 5 years NEET papers timed",
    ],
    resources: ["Allen / Aakash test series", "NEET PYQ 2020–2025", "MTG NCERT at your fingertips"],
  },
  {
    month: "May", label: "Revision Sprint & NCERT Lock", color: "#EAB308", icon: "⚡",
    tip: "No new topics. Revise NCERT Biology & Inorganic Chemistry cover to cover, lock formulas, and solve one full mock daily. Sleep well — NEET is a single 3h 20m marathon.",
    tasks: [
      "NCERT Biology + Inorganic full revision",
      "Formula sheets — Physics & Physical Chemistry",
      "1 full mock daily, exam-day timing",
      "Revise NCERT diagrams & exceptions",
      "Sleep 7–8 hrs; taper study load near exam",
    ],
    resources: ["NCERT (Biology + Chemistry)", "Self-made formula sheets", "Rapid revision booklets"],
  },
  {
    month: "Exam Day", label: "NEET UG — 3h 20m, 720 marks", color: C_BIO, icon: "🎯",
    tip: "Single paper, 200 questions (attempt 180), +4 / −1. Start with Biology to bank marks and build confidence, then Chemistry, then Physics. Fill the OMR carefully — no negative for unattempted.",
    tasks: [
      "Reach centre early; carry admit card + ID",
      "Attempt Biology first (scoring, fast)",
      "Then Chemistry, then Physics numericals",
      "Mark OMR in batches; double-check bubbling",
      "Skip-and-return on lengthy Physics problems",
    ],
    resources: ["Admit card", "Valid photo ID", "Stationery per NTA guidelines"],
  },
];

const COACHING = [
  {
    name: "Aakash (BYJU'S)", city: "Pan-India (300+ centres)", color: "#0EA5A4", badge: "🏆 #1 for NEET",
    highlights: [
      "India's most NEET-focused coaching brand",
      "Largest medical-selection numbers each year",
      "ANTHE scholarship exam for admission & fee waiver",
      "Classroom + hybrid + online (Aakash iTutor)",
    ],
    website: "https://www.aakash.ac.in", fee: "₹1.2L – ₹2.6L/year", mode: "Offline / Online",
  },
  {
    name: "Allen Career Institute", city: "Kota, Rajasthan", color: "#F47B20", badge: "⭐ Top Results",
    highlights: [
      "Legendary Kota ecosystem for NEET & JEE",
      "Strong Biology & Physical Chemistry faculty",
      "Dropper & 2-year integrated batches",
      "All-India test series widely used by self-studiers",
    ],
    website: "https://www.allen.ac.in", fee: "₹1.4L – ₹2.6L/year", mode: "Offline / Online",
  },
  {
    name: "Narayana / Sri Chaitanya", city: "Hyderabad + Pan-India", color: "#7C3AED", badge: "📍 Residential",
    highlights: [
      "Strongest in South India medical results",
      "Integrated school + coaching residential model",
      "Pinnacle / Super-30 batches for toppers",
      "Affordable, scholarship-driven admissions",
    ],
    website: "https://www.narayanagroup.com", fee: "₹90K – ₹2.0L/year", mode: "Offline / Residential",
  },
  {
    name: "Physics Wallah (PW)", city: "Online + Vidyapeeth centres", color: "#15A06E", badge: "💻 Best Value",
    highlights: [
      "Most affordable quality NEET coaching",
      "Lakhpati Batch & Arjuna/Yakeen NEET series",
      "Live + recorded lectures with strong faculty",
      "Best combined with disciplined NCERT self-study",
    ],
    website: "https://www.pw.live", fee: "₹4K – ₹40K/year", mode: "Online / Offline",
  },
  {
    name: "Unacademy / Vedantu", city: "Online (Pan-India)", color: "#EC4899", badge: "🖥 Online Live",
    highlights: [
      "Live interactive classes with top educators",
      "Affordable vs offline Kota coaching",
      "Doubt sessions, test series & analytics",
      "Flexible — ideal for school-going aspirants",
    ],
    website: "https://unacademy.com", fee: "₹25K – ₹1.0L/year", mode: "Online",
  },
  {
    name: "Self Study + NCERT", city: "Anywhere", color: "#EAB308", badge: "🌟 Topper Favourite",
    highlights: [
      "Many AIR <1000 rankers are NCERT self-studiers",
      "NCERT (esp. Biology) + PYQs + one test series",
      "Lowest cost, fully flexible schedule",
      "Needs strong discipline & a fixed daily routine",
    ],
    website: "https://nta.ac.in", fee: "₹8K – ₹20K (tests + books)", mode: "Self-paced",
  },
];

const ELIGIBILITY = [
  ["Qualification", "Class 12 with Physics, Chemistry, Biology/Biotechnology & English."],
  ["Minimum marks", "50% in PCB for General (40% for SC/ST/OBC, 45% for PwD)."],
  ["Age limit", "Minimum 17 years as on 31 Dec of the admission year; no upper age limit."],
  ["Attempts", "No cap on the number of attempts."],
];

/* ── Helpers ── */
function diffIndex(val) {
  if (val >= 80) return { label: "Very Hard", color: "#EF4444", bg: "#fee2e2" };
  if (val >= 70) return { label: "Hard",      color: "#F97316", bg: "#fff7ed" };
  if (val >= 55) return { label: "Moderate",  color: "#EAB308", bg: "#fefce8" };
  return               { label: "Easy",      color: "#15A06E", bg: "#d1fae5" };
}
function labelMeta(label) {
  if (label.includes("Very Hard")) return { color: "#EF4444", bg: "#fee2e2" };
  if (label.includes("Hard"))      return { color: "#F97316", bg: "#fff7ed" };
  if (label.includes("Moderate"))  return { color: "#EAB308", bg: "#fefce8" };
  return                                  { color: "#15A06E", bg: "#d1fae5" };
}
const fmtN = (n) => (n == null ? "—" : n.toLocaleString("en-IN"));

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

/* ── Animated single-bar difficulty row ── */
function SubjectBar({ label, value, animate }) {
  const di = diffIndex(value);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: "var(--navy)" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: di.color }}>{value} · {di.label}</span>
      </div>
      <div style={{ height: 12, borderRadius: 6, background: "#f0f0f5", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 6,
          width: animate ? `${value}%` : "0%",
          background: `linear-gradient(90deg, ${di.color}99, ${di.color})`,
          transition: "width 0.9s cubic-bezier(.4,0,.2,1)",
        }} />
      </div>
    </div>
  );
}

/* ── Year snapshot banner (mirrors the JEE "organising IIT" banner) ── */
function SnapshotBanner({ year }) {
  const d = DIFFICULTY_DATA[year];
  if (!d) return null;
  const meta = labelMeta(d.label);
  return (
    <div key={`snap-${year}`} className="org-banner" style={{
      background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT}cc 60%, ${ACCENT}99 100%)`,
      borderRadius: 18, padding: "22px 26px", marginBottom: 22, position: "relative",
      overflow: "hidden", boxShadow: `0 14px 40px ${ACCENT}33`,
    }}>
      <div className="org-glow" style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,.28) 0%, transparent 55%)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <div className="org-seal" style={{
          width: 64, height: 64, borderRadius: 16, flexShrink: 0, display: "grid", placeItems: "center",
          background: "rgba(255,255,255,.18)", border: "2px solid rgba(255,255,255,.4)", backdropFilter: "blur(4px)",
        }}>
          <Stethoscope size={28} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>
            <Building2 size={13} style={{ display: "inline", marginRight: 5, marginBottom: -2 }} />
            Conducted by NTA · NEET UG {year}
          </span>
          <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: "#fff", lineHeight: 1.1, marginTop: 4 }}>
            {d.label} Paper
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", fontSize: 13, color: "rgba(255,255,255,.92)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Users size={13} /> {d.snap.candidates} candidates</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><BadgeCheck size={13} /> {d.snap.qualified} qualified</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Target size={13} /> Toughest: {d.toughest}</span>
          </div>
        </div>
        <div style={{
          flexShrink: 0, maxWidth: 320, fontSize: 12.5, lineHeight: 1.55, color: "rgba(255,255,255,.95)",
          borderLeft: "2px solid rgba(255,255,255,.35)", paddingLeft: 14, fontStyle: "italic",
        }}>
          "{d.snap.note}"
        </div>
      </div>
    </div>
  );
}

/* ── Qualifying marks mini-bar ── */
function MarksBar({ label, value, color, maxValue = 250 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: "var(--muted)", minWidth: 110, fontWeight: 600 }}>{label}</span>
      <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#f0f0f5", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(value / maxValue) * 100}%`, background: color, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color, minWidth: 60, textAlign: "right", fontFamily: "Sora" }}>{value}/720</span>
    </div>
  );
}

/* ── Tool 1 — NEET Rank Predictor (LAYOUT-ONLY mock-up) ── */
function NeetRankPredictor() {
  const [phy, setPhy] = useState("");
  const [chem, setChem] = useState("");
  const [bio, setBio] = useState("");
  const [result, setResult] = useState(null);
  const total = (Number(phy) || 0) + (Number(chem) || 0) + (Number(bio) || 0);

  const fields = [
    { key: "phy",  label: "Physics",   max: 180, val: phy,  set: setPhy,  color: C_PHY,  icon: Atom },
    { key: "chem", label: "Chemistry", max: 180, val: chem, set: setChem, color: C_CHEM, icon: FlaskConical },
    { key: "bio",  label: "Biology",   max: 360, val: bio,  set: setBio,  color: C_BIO,  icon: Leaf },
  ];

  const predict = () => {
    // Illustrative only — picks a marks→rank band. Not a real predictor.
    const band = MARKS_VS_RANK.find((b) => {
      const lo = Number((b.marks.match(/\d+/) || [0])[0]); // lower bound of the band
      return total >= lo;
    }) || MARKS_VS_RANK[MARKS_VS_RANK.length - 1];
    setResult(band);
  };

  return (
    <div className="card" style={{ padding: "26px 28px", borderTop: `4px solid ${ACCENT}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 18 }}>
        {fields.map((f) => (
          <div key={f.key} style={{ background: "var(--sky)", borderRadius: 14, padding: "14px 16px", border: `1px solid ${f.color}22` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: `${f.color}18`, display: "grid", placeItems: "center" }}>
                <f.icon size={16} color={f.color} />
              </span>
              <span style={{ fontWeight: 700, fontSize: 13, color: "var(--navy)" }}>{f.label}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>/ {f.max}</span>
            </div>
            <input
              type="number" min="0" max={f.max} value={f.val}
              onChange={(e) => f.set(e.target.value)}
              placeholder="0"
              style={{ width: "100%", border: `1.5px solid ${f.color}44`, borderRadius: 10, padding: "9px 12px", fontFamily: "Sora", fontWeight: 700, fontSize: 16, color: "var(--navy)", outline: "none", background: "#fff" }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Total score</span>
            <span style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 16, color: ACCENT }}>{total} / 720</span>
          </div>
          <div style={{ height: 12, borderRadius: 6, background: "#f0f0f5", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 6, width: `${(total / 720) * 100}%`, background: `linear-gradient(90deg,${ACCENT}99,${ACCENT})`, transition: "width .4s ease" }} />
          </div>
        </div>
        <button onClick={predict} className="btn" style={{ background: ACCENT, color: "#fff", border: "none", padding: "12px 26px", fontWeight: 800, borderRadius: 12 }}>
          <GaugeIcon size={16} /> Predict My Rank
        </button>
      </div>

      {result ? (
        <div className="fade-up" style={{ background: `${ACCENT}0e`, border: `1px solid ${ACCENT}33`, borderRadius: 14, padding: "18px 22px", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5, fontWeight: 700 }}>Illustrative expected AIR</div>
            <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: ACCENT }}>{result.rank}</div>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6, flex: 1, minWidth: 220 }}>
            Based on a sample {result.marks} band. <strong>This is a layout demo</strong> — the live NEET rank predictor (trained on real percentile data) is coming soon.
            <Link to="/neet-colleges" style={{ color: ACCENT, fontWeight: 700, marginLeft: 6 }}>Browse colleges →</Link>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
          Enter your subject scores and tap <strong>Predict My Rank</strong>. <em>Demo layout — figures are illustrative.</em>
        </p>
      )}
    </div>
  );
}

/* ── Tool 2 — NEET College Predictor (LAYOUT-ONLY mock-up) ── */
function NeetCollegePredictor() {
  const nav = useNavigate();
  const [score, setScore] = useState("");
  const [category, setCategory] = useState("General");
  const [quota, setQuota] = useState("All India (AIQ)");
  const [course, setCourse] = useState("MBBS");
  const [shown, setShown] = useState(false);

  const samples = useMemo(
    () => [...NEET_COLLEGES].filter((c) => c.govt).sort((a, b) => (b.seats || 0) - (a.seats || 0)).slice(0, 6),
    []
  );

  const sel = { background: "#fff", border: "1.5px solid var(--line)", borderRadius: 10, padding: "10px 12px", fontSize: 13, fontFamily: "Sora", fontWeight: 600, color: "var(--navy)", width: "100%" };

  return (
    <div className="card" style={{ padding: "24px 26px", borderTop: `4px solid ${C_CHEM}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5 }}>NEET Score / Rank</label>
          <input value={score} onChange={(e) => setScore(e.target.value)} placeholder="e.g. 620" style={{ ...sel, marginTop: 4 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5 }}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...sel, marginTop: 4 }}>
            {["General", "EWS", "OBC-NCL", "SC", "ST", "PwD"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5 }}>Quota</label>
          <select value={quota} onChange={(e) => setQuota(e.target.value)} style={{ ...sel, marginTop: 4 }}>
            {["All India (AIQ)", "State Quota", "Deemed / Central", "Management / NRI"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5 }}>Course</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)} style={{ ...sel, marginTop: 4 }}>
            {["MBBS", "BDS", "BAMS / AYUSH", "BVSc"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <button onClick={() => setShown(true)} className="btn" style={{ background: C_CHEM, color: "#fff", border: "none", padding: "11px 24px", fontWeight: 800, borderRadius: 12, marginBottom: 18 }}>
        <Landmark size={16} /> Find My Colleges
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff8ed", border: "1px solid #f59e0b", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 12.5, color: "#92400e" }}>
        <span style={{ fontSize: 16 }}>🛠️</span>
        <span><strong>Demo layout.</strong> The live NEET college predictor is coming soon. Below is a <em>sample</em> of government medical colleges — explore the full list anytime.</span>
      </div>

      {shown && (
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14, marginBottom: 16 }}>
          {samples.map((c) => (
            <div key={c.slug} onClick={() => nav(`/neet-colleges/${c.slug}`)} className="card card-hover" style={{ padding: "14px 16px", cursor: "pointer", borderLeft: `3px solid ${ACCENT}` }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 50, background: `${ACCENT}16`, color: ACCENT, textTransform: "uppercase" }}>Government</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50, background: "#f3f4f6", color: "#6b7280" }}>{fmtN(c.seats)} seats</span>
              </div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, color: "var(--navy)", lineHeight: 1.3 }}>{c.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--muted)", marginTop: 5 }}>
                <MapPin size={11} color={ACCENT} /> {c.district || c.state}
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => nav("/neet-colleges")} className="btn btn-coral" style={{ fontWeight: 800 }}>
        <Landmark size={16} /> Explore all {NEET_COLLEGES.length} medical colleges <ArrowRight size={15} />
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Main Page
════════════════════════════════════════════════════════════ */
export default function Neet() {
  const nav = useNavigate();
  const [selectedYear, setSelectedYear] = useState(2026);
  const [animateBars, setAnimateBars] = useState(true);
  const d = DIFFICULTY_DATA[selectedYear];

  const subjectBars = [
    { name: "Physics",   value: d.phy  },
    { name: "Chemistry", value: d.chem },
    { name: "Biology",   value: d.bio  },
  ];

  const stateStats = useMemo(() => {
    const m = {};
    for (const c of NEET_COLLEGES) {
      const s = (m[c.state] ||= { state: c.state, count: 0, seats: 0 });
      s.count += 1; s.seats += c.seats || 0;
    }
    return Object.values(m).sort((a, b) => b.count - a.count);
  }, []);

  function handleYearChange(y) {
    setAnimateBars(false);
    setTimeout(() => { setSelectedYear(y); setAnimateBars(true); }, 60);
  }

  return (
    <div className="page">
      <Seo
        title="NEET UG Rank Predictor, College Predictor, Cutoffs & Syllabus"
        description="NEET UG hub — rank predictor, medical college predictor, year-wise difficulty analysis, marks-vs-rank trends, qualifying cutoffs, full syllabus, 12-month roadmap and best coaching. Built for NEET aspirants on CollegeParichay."
        path="/neet"
      />

      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.95)}      to{opacity:1;transform:scale(1)}      }
        @keyframes pulseRingNeet {
          0%   { box-shadow: 0 0 0 0 rgba(21,160,110,.4); }
          70%  { box-shadow: 0 0 0 10px rgba(21,160,110,0); }
          100% { box-shadow: 0 0 0 0 rgba(21,160,110,0); }
        }
        .fade-up   { animation: fadeUp  .44s cubic-bezier(.4,0,.2,1) both; }
        .scale-in  { animation: scaleIn .36s cubic-bezier(.4,0,.2,1) both; }
        .d1 { animation-delay: .04s } .d2 { animation-delay: .10s } .d3 { animation-delay: .16s }
        .year-active-neet { animation: pulseRingNeet 1.2s ease; }
        @keyframes orgIn   { from{opacity:0;transform:translateY(14px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes orgGlow { 0%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} 100%{opacity:.5;transform:scale(1)} }
        @keyframes sealPop { from{transform:scale(.6) rotate(-8deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        .org-banner { animation: orgIn .5s cubic-bezier(.34,1.56,.64,1) both; }
        .org-glow   { position:absolute; inset:0; animation: orgGlow 4s ease-in-out infinite; pointer-events:none; }
        .org-seal   { animation: sealPop .55s cubic-bezier(.34,1.56,.64,1) .08s both; }
        @media (max-width: 640px) {
          .org-banner [style*="border-left"] { border-left:none !important; padding-left:0 !important; }
        }
        .card-hover { transition: transform .2s, box-shadow .2s; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,.09); }
        .diff-tag-neet {
          display: inline-block; font-size: 11px; font-weight: 700;
          padding: 4px 11px; border-radius: 50px; background: rgba(21,160,110,.10);
          color: #0f7a53; border: 1px solid rgba(21,160,110,.22); margin: 3px 3px 3px 0;
        }
        .marks-card { background: var(--sky); border-radius: 14px; padding: 16px 20px; border: 1px solid var(--line); transition: transform .2s, box-shadow .2s; }
        .marks-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.06); }
        .yr-row-neet:hover td { background: #ecfdf5 !important; }
        .nav-pill-neet {
          background: rgba(21,160,110,.11); border: 1px solid rgba(21,160,110,.3);
          color: #0f7a53; padding: 8px 16px; border-radius: 50px; font-size: 13px;
          font-weight: 600; text-decoration: none; transition: all 0.18s;
        }
        .nav-pill-neet:hover { background: ${ACCENT}; color: #fff; border-color: ${ACCENT}; }
        @media (max-width: 720px) { .paper-char-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── Hero ── */}
      <section className="warm-page-header" style={{ padding: "56px 0 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 20%, rgba(21,160,110,.18) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 50% at 0% 90%, rgba(14,165,164,.14) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow" style={{ marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Stethoscope size={12} /> NEET UG 2026
          </span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.8rem)", margin: "0 0 10px", lineHeight: 1.2, color: "#1c1c28" }}>
            NEET — Rank &amp; Medical College Predictor Hub
          </h1>
          <p style={{ color: "rgba(28,28,40,.62)", maxWidth: 640, marginBottom: 28 }}>
            Estimate your NEET rank, find the MBBS colleges you can get, analyse year-wise difficulty
            subject-wise (Physics · Chemistry · Biology), and explore the full 720-mark syllabus,
            12-month roadmap &amp; top coaching. <em>Tools below are layout demos.</em>
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              ["#rank", "Rank Predictor"], ["#college", "College Predictor"], ["#difficulty", "Difficulty"],
              ["#marks-rank", "Marks vs Rank"], ["#cutoffs", "Cutoffs"], ["#syllabus", "Syllabus"],
              ["#roadmap", "Roadmap"], ["#coaching", "Coaching"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="nav-pill-neet">{label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tool 1 — Rank Predictor ── */}
      <Block id="rank" eyebrow="Tool 1" title="NEET Rank Predictor"
        sub="Enter your Physics, Chemistry & Biology scores (out of 720) to see an illustrative All-India Rank. Layout demo — the live predictor is coming soon.">
        <NeetRankPredictor />
      </Block>

      {/* ── Tool 2 — College Predictor ── */}
      <div style={{ background: "var(--sky)" }}>
        <Block id="college" eyebrow="Tool 2" title="NEET Medical College Predictor"
          sub="See the MBBS / medical colleges you can target by score, category and quota. Layout demo — explore the full college database anytime." bg="transparent">
          <NeetCollegePredictor />
        </Block>
      </div>

      {/* ════════ DIFFICULTY ANALYSIS ════════ */}
      <section id="difficulty" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Paper Analysis · 2021–2026</span>
            <h2 className="section-title">Year-wise Difficulty — Physics, Chemistry &amp; Biology</h2>
            <p className="section-sub">
              Select a year to see the NEET paper's overall difficulty and a subject-wise breakdown.
              Index: 0 = easiest · 100 = hardest. <strong>Physics is the toughest, Biology the most scoring</strong>, every year.
            </p>
          </div>

          {/* Year selector */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <div style={{ display: "inline-flex", gap: 6, background: "var(--sky)", padding: 6, borderRadius: 50, border: "1px solid var(--line)", boxShadow: "0 2px 12px rgba(0,0,0,.05)", flexWrap: "wrap", justifyContent: "center" }}>
              {DIFFICULTY_YEARS.map((y) => (
                <button key={y} onClick={() => handleYearChange(y)} className={selectedYear === y ? "year-active-neet" : ""}
                  style={{ padding: "9px 22px", borderRadius: 50, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "Sora",
                    background: selectedYear === y ? `linear-gradient(135deg,${ACCENT},#22c55e)` : "transparent",
                    color: selectedYear === y ? "#fff" : "var(--navy)",
                    boxShadow: selectedYear === y ? `0 4px 16px ${ACCENT}59` : "none", transition: "all 0.22s" }}>
                  {y}
                </button>
              ))}
            </div>
          </div>

          <SnapshotBanner year={selectedYear} />

          {/* Overall badge + subject cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }} className="paper-char-grid">
            {(() => {
              const meta = labelMeta(d.label);
              const avg = Math.round((d.phy + d.chem + d.bio) / 3);
              return (
                <div className="card card-hover scale-in d1" style={{ borderTop: `4px solid ${meta.color}`, padding: "22px 26px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Overall · NEET {selectedYear}</div>
                      <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: "clamp(1.3rem,2.5vw,1.8rem)", color: meta.color, lineHeight: 1.1 }}>{d.label}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 28, color: meta.color }}>{avg}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>Avg Index</div>
                    </div>
                  </div>
                  <div style={{ height: 10, borderRadius: 6, background: "#e5e7eb", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 6, background: `linear-gradient(90deg,${meta.color}88,${meta.color})`, width: animateBars ? `${avg}%` : "0%", transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>Average difficulty across Physics, Chemistry &amp; Biology</div>
                </div>
              );
            })()}

            <div className="card card-hover scale-in d2" style={{ padding: "20px 24px" }}>
              <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, marginBottom: 14 }}>Subject Breakdown · {selectedYear}</h4>
              <SubjectBar label="⚛ Physics"   value={d.phy}  animate={animateBars} />
              <SubjectBar label="⚗ Chemistry" value={d.chem} animate={animateBars} />
              <SubjectBar label="🌿 Biology"   value={d.bio}  animate={animateBars} />
            </div>
          </div>

          {/* Grouped bar chart */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <h4 style={{ fontFamily: "Sora", fontWeight: 700 }}>Subject Difficulty Index · {selectedYear}</h4>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Higher bar = more difficult</span>
            </div>
            <Bars key={`bars-${selectedYear}`} data={subjectBars}
              bars={[{ key: "value", label: "Difficulty index", color: ACCENT }]} height={260} />
          </div>

          {/* Key trends */}
          <div className="card fade-up" style={{ borderLeft: `4px solid ${ACCENT}`, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>💡</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, marginBottom: 8 }}>Key Trends — NEET {selectedYear}</h4>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 12 }}>{d.keyTrend}</p>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 11, color: ACCENT, marginRight: 6, textTransform: "uppercase", letterSpacing: .5 }}>
                    <TrendingUp size={12} style={{ display: "inline", marginRight: 4 }} />Highlights:
                  </span>
                  {d.tags.map((tag) => <span key={tag} className="diff-tag-neet">{tag}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Year-wise summary table */}
          <div style={{ marginTop: 28 }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, marginBottom: 14 }}>📋 Year-wise Difficulty Summary (2021–2026)</h4>
            <div className="card" style={{ overflowX: "auto" }}>
              <table className="data-table" style={{ minWidth: 640 }}>
                <thead>
                  <tr><th>Year</th><th>Overall</th><th>Physics</th><th>Chemistry</th><th>Biology</th><th>Toughest</th></tr>
                </thead>
                <tbody>
                  {DIFFICULTY_YEARS.map((y) => {
                    const row = DIFFICULTY_DATA[y];
                    const m = labelMeta(row.label);
                    return (
                      <tr key={y} className="yr-row-neet">
                        <td><strong style={{ fontFamily: "Sora", fontSize: 15, color: selectedYear === y ? ACCENT : "var(--navy)" }}>{y}{selectedYear === y ? " ◀" : ""}</strong></td>
                        <td><span style={{ fontSize: 12, fontWeight: 700, padding: "4px 11px", borderRadius: 50, background: m.bg, color: m.color }}>{row.label}</span></td>
                        <td style={{ fontWeight: 700, color: diffIndex(row.phy).color }}>{row.phy}</td>
                        <td style={{ fontWeight: 700, color: diffIndex(row.chem).color }}>{row.chem}</td>
                        <td style={{ fontWeight: 700, color: diffIndex(row.bio).color }}>{row.bio}</td>
                        <td><span style={{ fontWeight: 700, color: C_PHY, fontSize: 13 }}>{row.toughest}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 6-YEAR SUBJECT DIFFICULTY TREND ════════ */}
      <section className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">6-Year Trend</span>
            <h2 className="section-title">Subject Difficulty Trend (2021–2026)</h2>
            <p className="section-sub">How Physics, Chemistry &amp; Biology difficulty has shifted over six years. Physics stays the rank-decider; Biology the most scoring.</p>
          </div>
          <div className="grid-3" style={{ gap: 22, marginBottom: 22 }}>
            {[
              { label: "Physics",   data: TREND_PHYSICS,   color: C_PHY,  note: "The toughest, rank-deciding section — lengthy numericals each year." },
              { label: "Chemistry", data: TREND_CHEMISTRY, color: C_CHEM, note: "NCERT-aligned and moderately scoring; Physical Chem numericals decide edge." },
              { label: "Biology",   data: TREND_BIOLOGY,   color: C_BIO,  note: "Most scoring — 90 questions / 360 marks. Accuracy here makes the rank." },
            ].map(({ label, data, color, note }) => (
              <div key={label} className="card card-hover">
                <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, color, marginBottom: 4 }}>{label}</h4>
                <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 }}>{note}</p>
                <Trend data={data} lines={[{ key: "value", label: "Difficulty", color }]} height={200} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ MARKS vs RANK (from cutoff marks & rank) ════════ */}
      <section id="marks-rank" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Marks vs Rank</span>
            <h2 className="section-title">Score-for-Rank Trend &amp; Difficulty Read</h2>
            <p className="section-sub">
              The score needed for roughly the same All-India Rank, year by year. A <strong>higher score for the same rank means an easier paper</strong> — so 2024 (655) was easy, 2025 (529) was hard.
            </p>
          </div>

          {/* Difficulty read cards from the score trend */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 26 }}>
            {[
              { yr: 2024, score: 655, tag: "Easiest paper", color: "#15A06E", note: "Highest score for the band — an easy paper inflated scores & cutoffs." },
              { yr: 2023, score: 612, tag: "Moderate", color: "#EAB308", note: "Mid-range score for the band — a balanced, NCERT-aligned paper." },
              { yr: 2025, score: 529, tag: "Hardest paper", color: "#EF4444", note: "Lowest score for the band — a tough paper pulled scores down sharply." },
            ].map((c) => (
              <div key={c.yr} className="marks-card fade-up" style={{ borderTop: `4px solid ${c.color}` }}>
                <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>NEET {c.yr}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 26, color: c.color, lineHeight: 1 }}>{c.score}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>/ 720</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: c.color, margin: "6px 0 6px" }}>{c.tag}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{c.note}</div>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ gap: 20, alignItems: "start" }}>
            {/* Score trend chart */}
            <div className="card">
              <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Score for ≈ same AIR band (2021–2025)</h4>
              <Trend data={SCORE_RANK_TREND} lines={[{ key: "score", label: "Score / 720", color: ACCENT }]} height={250} />
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>Reference AIR band: ~17.5k – 25k. Higher score ⇒ easier paper that year.</p>
            </div>
            {/* Reference table */}
            <div className="card" style={{ overflowX: "auto" }}>
              <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>📊 Cutoff Marks &amp; Rank — Year-wise</h4>
              <table className="data-table" style={{ minWidth: 360 }}>
                <thead><tr><th>Year</th><th style={{ textAlign: "center" }}>AIR</th><th style={{ textAlign: "center" }}>Score / 720</th></tr></thead>
                <tbody>
                  {SCORE_RANK_TREND.map((r) => (
                    <tr key={r.year} className="yr-row-neet">
                      <td><strong style={{ fontFamily: "Sora" }}>{r.year}</strong></td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: "var(--navy)" }}>{fmtN(r.air)}</td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 800, color: ACCENT }}>{r.score}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marks → expected rank reference */}
          <div className="card" style={{ marginTop: 20, overflowX: "auto" }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4 }}>NEET Marks → Expected All-India Rank</h4>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Illustrative bands to gauge where your score lands. Actual ranks vary with paper difficulty &amp; number of candidates.</p>
            <table className="data-table" style={{ minWidth: 420 }}>
              <thead><tr><th>Marks (out of 720)</th><th>Expected AIR</th></tr></thead>
              <tbody>
                {MARKS_VS_RANK.map((m) => (
                  <tr key={m.marks} className="yr-row-neet">
                    <td><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: m.color }} /><strong style={{ fontFamily: "Sora" }}>{m.marks}</strong></span></td>
                    <td style={{ fontWeight: 700, color: m.color }}>{m.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ════════ QUALIFYING CUTOFF TREND ════════ */}
      <section id="cutoffs" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Cutoff Trends · 2021–2026</span>
            <h2 className="section-title">NEET Qualifying Cutoff (out of 720)</h2>
            <p className="section-sub">Minimum NEET-qualifying marks by category (50th percentile for General). <em>Illustrative figures — verify on the official NTA portal.</em></p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }} className="paper-char-grid">
            {[
              { cat: "General (50th %ile)", key: "gen",       color: ACCENT },
              { cat: "OBC / SC / ST (40th)", key: "obc_sc_st", color: C_PHY },
              { cat: "PwD (45th %ile)",      key: "pwd",       color: C_CHEM },
            ].map(({ cat, key, color }) => {
              const latest = QUALIFYING_TREND[QUALIFYING_TREND.length - 1];
              const prev = QUALIFYING_TREND[QUALIFYING_TREND.length - 2];
              const val = latest[key]; const diff = val - prev[key]; const isUp = diff >= 0;
              return (
                <div key={cat} className="marks-card fade-up" style={{ borderTop: `4px solid ${color}` }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>{cat}</div>
                  <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 26, color, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 8 }}>marks ({latest.year}) / 720</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: isUp ? "#EF4444" : "#15A06E" }}>
                    {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{isUp ? "+" : ""}{diff} vs {prev.year}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card">
            <div style={{ overflowX: "auto", marginBottom: 24 }}>
              <table className="data-table" style={{ minWidth: 520, fontSize: 13 }}>
                <thead><tr><th>Year</th><th style={{ textAlign: "center" }}>General</th><th style={{ textAlign: "center" }}>OBC / SC / ST</th><th style={{ textAlign: "center" }}>PwD</th></tr></thead>
                <tbody>
                  {QUALIFYING_TREND.map((row) => (
                    <tr key={row.year} className="yr-row-neet">
                      <td><strong style={{ fontFamily: "Sora", fontSize: 14 }}>{row.year}</strong></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 800, color: ACCENT }}>{row.gen}</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: C_PHY }}>{row.obc_sc_st}</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 700, color: C_CHEM }}>{row.pwd}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginBottom: 20, padding: "16px 20px", background: "var(--sky)", borderRadius: 12, border: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>📊 2026 Qualifying Marks — Category Visual (out of 720)</div>
              <MarksBar label="General (50th)"   value={150} color={ACCENT} />
              <MarksBar label="OBC / SC / ST"    value={117} color={C_PHY} />
              <MarksBar label="PwD (45th)"       value={132} color={C_CHEM} />
            </div>
            <Trend data={QUALIFYING_TREND} lines={[
              { key: "gen", label: "General", color: ACCENT },
              { key: "obc_sc_st", label: "OBC/SC/ST", color: C_PHY },
              { key: "pwd", label: "PwD", color: C_CHEM },
            ]} height={300} />
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14, textAlign: "center" }}>
              * Illustrative for layout. Verify official NEET cutoffs at{" "}
              <a href="https://neet.nta.nic.in" target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 600 }}>neet.nta.nic.in</a>
            </p>
          </div>
        </div>
      </section>

      {/* ════════ SYLLABUS ════════ */}
      <section id="syllabus" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Syllabus</span>
            <h2 className="section-title">Complete NEET UG Syllabus</h2>
            <p className="section-sub">One 3h 20m paper · 200 questions (attempt 180) · +4 correct / −1 wrong. Biology carries half the paper, so it decides your rank.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Total Marks",  value: "720",     sub: "Phy 180 · Chem 180 · Bio 360", color: ACCENT },
              { label: "Questions",    value: "200",     sub: "attempt any 180",             color: C_PHY },
              { label: "Duration",     value: "3h 20m",  sub: "single paper",                color: C_CHEM },
              { label: "Marking",      value: "+4 / −1",  sub: "no negative for unattempted", color: "#7C3AED" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="card" style={{ textAlign: "center", borderTop: `4px solid ${color}`, padding: "20px 12px" }}>
                <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 30, color }}>{value}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{sub}</div>
              </div>
            ))}
          </div>

          <div className="grid-3" style={{ gap: 22 }}>
            {Object.entries(SYLLABUS).map(([subj, { color, icon: Icon, topics, q }]) => (
              <div key={subj} className="card card-hover" style={{ borderTop: `4px solid ${color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "grid", placeItems: "center" }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17 }}>{subj}</h3>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{q}</div>
                  </div>
                </div>
                {topics.map((t) => (
                  <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, marginBottom: 8 }}>
                    <CheckCircle2 size={15} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
                <a href="https://neet.nta.nic.in" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 13, fontWeight: 600, color }}>
                  <FileText size={14} /> Official Syllabus <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ROADMAP ════════ */}
      <section id="roadmap" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Study Roadmap</span>
            <h2 className="section-title">12-Month NEET Preparation Roadmap</h2>
            <p className="section-sub">An NCERT-first, Biology-heavy plan with specific tasks, books and daily targets — from foundation through exam day.</p>
          </div>

          <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg,${C_BIO},${C_CHEM},${C_PHY},#EC4899,#EAB308,${C_BIO})`, transform: "translateX(-50%)", borderRadius: 4 }} />
            {ROADMAP.map((step, i) => (
              <div key={step.month} style={{ display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end", marginBottom: 36, position: "relative" }}>
                <div style={{ position: "absolute", left: "50%", top: 28, transform: "translateX(-50%)", width: 22, height: 22, borderRadius: "50%", background: step.color, border: "3px solid #fff", boxShadow: `0 0 0 4px ${step.color}44`, zIndex: 1 }} />
                <div className="card card-hover roadmap-card" style={{ width: "44%", borderTop: `4px solid ${step.color}`, padding: "20px 22px", marginLeft: i % 2 === 0 ? 0 : "auto", marginRight: i % 2 === 0 ? "auto" : 0 }}>
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
                      <span key={r} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 50, background: `${step.color}14`, color: step.color, fontWeight: 600, border: `1px solid ${step.color}33` }}>{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 16, background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: `1px solid ${ACCENT}33` }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 800, marginBottom: 16, color: "#1a1a2e" }}>📚 Complete Book List — NEET UG</h4>
            <div className="grid-3" style={{ gap: 14 }}>
              {[
                { subj: "Physics",   books: ["NCERT 11 & 12 (base)", "HC Verma Vol 1 & 2", "DC Pandey NEET series", "Errorless / MTG PYQ"], color: C_PHY },
                { subj: "Chemistry", books: ["NCERT 11 & 12 (must — esp. Inorganic)", "MS Chouhan Organic", "N. Awasthi Physical", "MTG NCERT at Fingertips"], color: C_CHEM },
                { subj: "Biology",   books: ["NCERT 11 & 12 (the bible)", "Trueman's Biology Vol 1 & 2", "MTG NCERT at Fingertips", "33 Years NEET PYQ"], color: C_BIO },
              ].map(({ subj, books, color }) => (
                <div key={subj} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${color}`, boxShadow: "0 1px 8px rgba(0,0,0,.05)" }}>
                  <div style={{ fontWeight: 800, color, marginBottom: 8, fontSize: 14 }}>{subj}</div>
                  {books.map((b) => <div key={b} style={{ fontSize: 12, color: "#374151", marginBottom: 5 }}>• {b}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ COACHING ════════ */}
      <section id="coaching" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Top Coaching</span>
            <h2 className="section-title">Best Coaching Institutes for NEET</h2>
            <p className="section-sub">From NEET-specialist brands to affordable online options — choose by city, budget &amp; learning style.</p>
          </div>
          <div className="grid-3" style={{ gap: 22 }}>
            {COACHING.map((c) => (
              <div key={c.name} className="card card-hover" style={{ borderTop: `4px solid ${c.color}`, padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, marginBottom: 3 }}>{c.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)" }}><MapPin size={12} /> {c.city}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50, background: `${c.color}18`, color: c.color, whiteSpace: "nowrap" }}>{c.badge}</span>
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
        </div>
      </section>

      {/* ════════ ELIGIBILITY ════════ */}
      <Block id="eligibility" eyebrow="Eligibility" title="Who can appear for NEET UG?"
        sub="Key eligibility criteria at a glance." bg="var(--sky)">
        <div className="grid-2" style={{ gap: 14 }}>
          {ELIGIBILITY.map(([t, dd]) => (
            <div key={t} className="card card-hover" style={{ display: "flex", gap: 12, alignItems: "flex-start", borderLeft: `4px solid ${ACCENT}` }}>
              <BadgeCheck size={18} color={ACCENT} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14 }}>{t}</div>
                <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.55, margin: "2px 0 0" }}>{dd}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* ════════ STATE-WISE COLLEGES ════════ */}
      <section className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow"><MapPin size={12} style={{ display: "inline", marginRight: 4 }} /> Counselling</span>
            <h2 className="section-title">All {NEET_COLLEGES.length} MBBS Colleges — State by State</h2>
            <p className="section-sub">
              Every MBBS college from the NMC seat matrix across {NEET_STATES.length} states &amp; UTs
              ({NEET_TOTAL_SEATS.toLocaleString("en-IN")} seats). Pick a state to explore.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginBottom: 24 }}>
            {stateStats.map((s, i) => (
              <Reveal key={s.state} delay={(i % 4) * 0.03}>
                <Link to={`/neet-colleges?state=${encodeURIComponent(s.state)}`} className="card card-hover" style={{ display: "flex", alignItems: "center", gap: 12, height: "100%", textDecoration: "none", borderLeft: `3px solid ${ACCENT}` }}>
                  <span style={{ width: 42, height: 42, borderRadius: 11, background: `${ACCENT}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <MapPin size={20} color={ACCENT} />
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: "block", fontFamily: "Sora", fontWeight: 700, fontSize: 14.5, color: "var(--navy)", lineHeight: 1.25 }}>{s.state}</span>
                    <span style={{ display: "flex", gap: 10, marginTop: 4, fontSize: 12, color: "var(--muted)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Landmark size={11} /> {s.count}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Users size={11} /> {s.seats.toLocaleString("en-IN")}</span>
                    </span>
                  </span>
                  <ArrowRight size={16} color={ACCENT} />
                </Link>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="btn btn-coral" onClick={() => nav("/neet-colleges")}>
              <Landmark size={16} /> Explore all {NEET_COLLEGES.length} medical colleges <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
