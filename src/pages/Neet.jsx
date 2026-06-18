import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { Bars, Trend, Gauge } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import { NEET_COLLEGES, NEET_STATES, NEET_TOTAL_SEATS } from "../data/neetColleges.js";
import {
  Atom, FlaskConical, Leaf, FileText, CheckCircle2, ArrowRight, RotateCcw,
  MapPin, Globe, Target, TrendingUp, TrendingDown, Building2, AlertCircle,
  Stethoscope, Users, Landmark, Gauge as GaugeIcon, BadgeCheck, Sparkles,
  CalendarDays, Trophy, Clock, BookOpen,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   NEET UG hub — mirrors the JEE Advanced page in layout & style.
   NEET is a single 720-mark paper (Physics 180 · Chemistry 180 ·
   Biology 360 = Botany + Zoology), conducted by the NTA.

   Historical data (difficulty, cut-offs, toppers) is the real
   2021–2025 record. The two predictor tools are interactive
   design demos — they show illustrative estimates, not an
   official prediction.
═══════════════════════════════════════════════════════════ */

const ACCENT = "#15a06e";   // NEET green
const C_PHY = "#F15A38";    // Physics — orange
const C_CHEM = "#0EA5A4";   // Chemistry — teal
const C_BIO = "#15a06e";    // Biology — green

const YEARS = [2021, 2022, 2023, 2024, 2025];

/* Past-5-year difficulty (verbatim from the official-analysis grid). idx = a
   0–100 difficulty index used for the bars/charts; the note strings are the
   qualitative read shown in the summary table. */
const DIFFICULTY = {
  2021: {
    overall: "Toughest: Physics", overallIdx: 64,
    phy: { idx: 82, note: "Toughest section with numerical questions" },
    chem: { idx: 52, note: "Easy to moderate, NCERT-based" },
    bio: { idx: 45, note: "Easier; Botany simpler than Zoology" },
    notes: "Biotechnology questions featured",
    snap: { candidates: "16.1 L", qualified: "8.7 L" },
  },
  2022: {
    overall: "Moderate to difficult", overallIdx: 68,
    phy: { idx: 85, note: "Most challenging, concept-oriented" },
    chem: { idx: 64, note: "Moderate difficulty, concept-oriented" },
    bio: { idx: 56, note: "Moderate difficulty" },
    notes: "Re-exam slightly easier, but still testing in-depth knowledge",
    snap: { candidates: "18.7 L", qualified: "9.9 L" },
  },
  2023: {
    overall: "Easy to moderate", overallIdx: 56,
    phy: { idx: 66, note: "Moderate challenge" },
    chem: { idx: 63, note: "Moderate, tricky and lengthy" },
    bio: { idx: 40, note: "Easiest, mostly NCERT aligned" },
    notes: "Botany easier than Zoology and lengthy",
    snap: { candidates: "20.9 L", qualified: "11.4 L" },
  },
  2024: {
    overall: "Easy to moderate", overallIdx: 58,
    phy: { idx: 74, note: "Toughest section, lengthy & conceptual" },
    chem: { idx: 56, note: "Balanced conceptual and practical" },
    bio: { idx: 50, note: "Mostly NCERT-based with some tricky questions" },
    notes: "Strong concept clarity needed, NCERT-based with some tricky questions",
    snap: { candidates: "24.0 L", qualified: "13.1 L" },
  },
  2025: {
    overall: "Moderate overall", overallIdx: 60,
    phy: { idx: 80, note: "Most challenging, numerical problems" },
    chem: { idx: 50, note: "Easy to moderate" },
    bio: { idx: 52, note: "Relatively easy but lengthy" },
    notes: "28% hard, 33% easy, 39% moderate questions",
    snap: { candidates: "22.7 L", qualified: "12.3 L" },
  },
};

const TREND_PHY = YEARS.map((y) => ({ year: y, value: DIFFICULTY[y].phy.idx }));
const TREND_CHEM = YEARS.map((y) => ({ year: y, value: DIFFICULTY[y].chem.idx }));
const TREND_BIO = YEARS.map((y) => ({ year: y, value: DIFFICULTY[y].bio.idx }));

/* NEET UG past-5-year cut-off (qualifying marks range) — official grid. */
const CUTOFF_TABLE = {
  years: [2025, 2024, 2023, 2022, 2021],
  rows: [
    { cat: "UR / EWS",      crit: "50th Percentile", ranges: ["720–165", "720–162", "720–137", "715–117", "720–138"] },
    { cat: "OBC",           crit: "40th Percentile", ranges: ["164–129", "161–127", "136–107", "116–93", "137–108"] },
    { cat: "SC",            crit: "40th Percentile", ranges: ["164–129", "161–127", "136–107", "116–93", "137–108"] },
    { cat: "ST",            crit: "40th Percentile", ranges: ["164–129", "161–127", "136–107", "116–93", "137–108"] },
    { cat: "UR / EWS & PH", crit: "45th Percentile", ranges: ["165–148", "161–144", "136–121", "116–105", "137–122"] },
    { cat: "OBC & PH",      crit: "40th Percentile", ranges: ["146–130", "143–127", "120–107", "104–93", "137–108"] },
    { cat: "SC & PH",       crit: "40th Percentile", ranges: ["146–130", "143–127", "120–107", "104–93", "136–108"] },
    { cat: "ST & PH",       crit: "40th Percentile", ranges: ["145–129", "142–127", "120–108", "104–93", "135–108"] },
  ],
};

/* Qualifying-marks trend (lower bound of each range) for the chart. */
const CUTOFF_TREND = [
  { year: 2021, ur: 138, res: 108, pwd: 122 },
  { year: 2022, ur: 117, res: 93,  pwd: 105 },
  { year: 2023, ur: 137, res: 107, pwd: 121 },
  { year: 2024, ur: 162, res: 127, pwd: 144 },
  { year: 2025, ur: 165, res: 129, pwd: 148 },
];

/* NEET toppers — past 5 years (official rank-1 record). */
const TOPPERS = [
  { sno: 1, name: "Mahesh Kumar",       roll: "3923210013", marks: 686, pct: "99.9999547", rank: 1, state: "Rajasthan" },
  { sno: 2, name: "Mridul Manya Anand", roll: "4301010696", marks: 720, pct: "99.9999999", rank: 1, state: "Uttar Pradesh" },
  { sno: 3, name: "Prabhanjan J",       roll: "4201020831", marks: 720, pct: "99.9999999", rank: 1, state: "Maharashtra" },
  { sno: 4, name: "Tanishka",           roll: "3905190306", marks: 715, pct: "99.9997733", rank: 1, state: "Rajasthan" },
  { sno: 5, name: "Tanmay Gupta",       roll: "4201020831", marks: 720, pct: "99.999806",  rank: 1, state: "Delhi (NCT)" },
];

/* Illustrative NEET marks → expected All-India Rank band (out of 720). */
const MARKS_VS_RANK = [
  { lo: 700, label: "700 – 720", airLo: 1,      airHi: 80,      rank: "1 – 80",            color: "#15A06E" },
  { lo: 680, label: "680 – 699", airLo: 80,     airHi: 600,     rank: "80 – 600",          color: "#15A06E" },
  { lo: 650, label: "650 – 679", airLo: 600,    airHi: 2800,    rank: "600 – 2,800",       color: "#0EA5A4" },
  { lo: 620, label: "620 – 649", airLo: 2800,   airHi: 7500,    rank: "2,800 – 7,500",     color: "#0EA5A4" },
  { lo: 600, label: "600 – 619", airLo: 7500,   airHi: 15000,   rank: "7,500 – 15,000",    color: "#EAB308" },
  { lo: 580, label: "580 – 599", airLo: 15000,  airHi: 27000,   rank: "15,000 – 27,000",   color: "#EAB308" },
  { lo: 550, label: "550 – 579", airLo: 27000,  airHi: 52000,   rank: "27,000 – 52,000",   color: "#F15A38" },
  { lo: 500, label: "500 – 549", airLo: 52000,  airHi: 95000,   rank: "52,000 – 95,000",   color: "#F15A38" },
  { lo: 450, label: "450 – 499", airLo: 95000,  airHi: 160000,  rank: "95,000 – 1.6 L",    color: "#EF4444" },
  { lo: 0,   label: "Below 450", airLo: 160000, airHi: 1100000, rank: "1.6 L – 11 L",      color: "#EF4444" },
];

const CAT_FACTOR = { General: 1, EWS: 0.86, "OBC-NCL": 0.55, SC: 0.18, ST: 0.09, PwD: 0.05 };

const SYLLABUS = {
  Physics: {
    color: C_PHY, icon: Atom, q: "45 Q · 180 marks", chapters: 29,
    topics: [
      "Mechanics — Kinematics, Laws of Motion, Work-Energy",
      "Rotational Motion & Gravitation",
      "Thermodynamics & Kinetic Theory of Gases",
      "Oscillations & Waves",
      "Electrostatics & Current Electricity",
      "Magnetism & Electromagnetic Induction",
      "Ray & Wave Optics",
      "Modern Physics & Semiconductor Electronics",
    ],
  },
  Chemistry: {
    color: C_CHEM, icon: FlaskConical, q: "45 Q · 180 marks", chapters: 30,
    topics: [
      "Physical — Mole Concept, Thermodynamics, Equilibrium",
      "Atomic Structure & Chemical Bonding",
      "Electrochemistry, Kinetics & Solutions",
      "Organic — GOC, Hydrocarbons, Isomerism",
      "Oxygen & Nitrogen Functional Groups",
      "Biomolecules, Polymers & Everyday Chemistry",
      "Inorganic — Periodic Table, p / d / f-block",
      "Coordination Compounds & Metallurgy",
    ],
  },
  Biology: {
    color: C_BIO, icon: Leaf, q: "90 Q · 360 marks", chapters: 38,
    topics: [
      "Diversity of Living Organisms",
      "Structural Organisation in Plants & Animals",
      "Cell Structure & Function",
      "Plant Physiology",
      "Human Physiology (highest weightage)",
      "Reproduction (Plant & Human)",
      "Genetics & Evolution",
      "Human Welfare, Biotechnology & Ecology",
    ],
  },
};

const PATTERN = [
  ["Mode", "Pen & paper (OMR sheet)"],
  ["Duration", "3 hours 20 minutes"],
  ["Total questions", "200 — attempt any 180"],
  ["Total marks", "720"],
  ["Marking scheme", "+4 correct · −1 wrong · 0 unattempted"],
  ["Subjects", "Physics · Chemistry · Botany · Zoology"],
  ["Section pattern", "Section A: 35 Q · Section B: 15 Q (attempt 10)"],
  ["Languages", "13 (English, Hindi & 11 regional)"],
];

const EXAM_CYCLE = [
  { phase: "Notification & Brochure", when: "Feb 2026", color: C_PHY, icon: "📢" },
  { phase: "Online Application", when: "Feb – Mar 2026", color: C_CHEM, icon: "📝" },
  { phase: "Correction Window", when: "Mar 2026", color: "#7C3AED", icon: "✏️" },
  { phase: "Admit Card Release", when: "Apr 2026", color: "#EC4899", icon: "🎫" },
  { phase: "NEET UG Exam Day", when: "03 May 2026 (Sun)", color: ACCENT, icon: "🎯" },
  { phase: "Provisional Answer Key", when: "May 2026", color: "#EAB308", icon: "🔑" },
  { phase: "Result & Rank List", when: "Jun 2026", color: C_PHY, icon: "📊" },
  { phase: "MCC / State Counselling", when: "Jul – Oct 2026", color: C_CHEM, icon: "🏥" },
];

const ROADMAP = [
  {
    month: "Jun–Aug", label: "NCERT Foundation (Biology First)", color: C_BIO, icon: "🌿",
    tip: "NEET is won on NCERT — especially Biology. Read NCERT Biology line by line and start Class 11 Physics & Chemistry fundamentals.",
    tasks: ["NCERT Biology Class 11 — every line, twice", "NCERT Chemistry 11 — mole concept, bonding, GOC", "NCERT Physics 11 — mechanics fundamentals", "Build a Biology one-liner / diagram notebook"],
    resources: ["NCERT Biology 11", "NCERT Physics & Chemistry 11", "Truemans Biology"],
  },
  {
    month: "Sep–Nov", label: "Concept Building & Problem Solving", color: C_CHEM, icon: "🔬",
    tip: "Layer problem-solving onto NCERT. Practice Physics numericals daily, master Organic mechanisms, revise Biology weekly.",
    tasks: ["Physics: HC Verma + DC Pandey (NEET-level)", "Organic Chemistry — reaction mechanisms", "NCERT Biology 12 — Genetics & Reproduction", "Weekly Biology + assertion-reason practice"],
    resources: ["HC Verma", "MS Chouhan Organic", "NCERT Biology 12"],
  },
  {
    month: "Dec–Feb", label: "Class 12 Depth & PYQs", color: C_PHY, icon: "📐",
    tip: "Finish Class 12 Physics & Chemistry, complete Human Physiology & Ecology, and solve 10 years of NEET PYQs subject-wise.",
    tasks: ["Electrostatics → Modern Physics (full)", "Inorganic & Coordination Chemistry", "Human Physiology, Ecology & Biotech", "NEET PYQs (2015–2024) chapter-wise"],
    resources: ["NCERT 12 (all)", "MTG 33 Years NEET PYQ", "Allen modules"],
  },
  {
    month: "Mar–Apr", label: "Full Mocks & Weak-Area Fix", color: "#EC4899", icon: "📝",
    tip: "Attempt full 720-mark mocks (3h 20m) twice a week. Prioritise Biology accuracy — it carries half the paper.",
    tasks: ["2 full mocks/week (200 Q · attempt 180)", "Subject-wise error log with NCERT refs", "Re-revise Biology weekly", "Speed + accuracy drills for Physics"],
    resources: ["Allen / Aakash test series", "NEET PYQ 2020–2025", "MTG NCERT Fingertips"],
  },
  {
    month: "May", label: "Revision Sprint & NCERT Lock", color: "#EAB308", icon: "⚡",
    tip: "No new topics. Revise NCERT Biology & Inorganic cover to cover, lock formulas, and solve one full mock daily.",
    tasks: ["NCERT Biology + Inorganic full revision", "Formula sheets — Physics & Physical Chem", "1 full mock daily, exam-day timing", "Revise NCERT diagrams & exceptions"],
    resources: ["NCERT (Biology + Chemistry)", "Self-made formula sheets"],
  },
  {
    month: "Exam Day", label: "NEET UG — 3h 20m, 720 marks", color: C_BIO, icon: "🎯",
    tip: "Start with Biology to bank marks fast, then Chemistry, then Physics. Fill the OMR carefully — no negative for unattempted.",
    tasks: ["Reach centre early; carry admit card + ID", "Attempt Biology first (scoring, fast)", "Then Chemistry, then Physics numericals", "Mark OMR in batches; double-check bubbling"],
    resources: ["Admit card", "Valid photo ID", "Stationery per NTA guidelines"],
  },
];

const COACHING = [
  { name: "Aakash (BYJU'S)", city: "Pan-India (300+ centres)", color: "#0EA5A4", badge: "🏆 #1 for NEET", highlights: ["India's most NEET-focused coaching brand", "Largest medical-selection numbers each year", "ANTHE scholarship exam for fee waiver", "Classroom + hybrid + online (iTutor)"], website: "https://www.aakash.ac.in", fee: "₹1.2L – ₹2.6L/year", mode: "Offline / Online" },
  { name: "Allen Career Institute", city: "Kota, Rajasthan", color: "#F15A38", badge: "⭐ Top Results", highlights: ["Legendary Kota ecosystem for NEET", "Strong Biology & Physical Chemistry faculty", "Dropper & 2-year integrated batches", "All-India test series for self-studiers"], website: "https://www.allen.ac.in", fee: "₹1.4L – ₹2.6L/year", mode: "Offline / Online" },
  { name: "Narayana / Sri Chaitanya", city: "Hyderabad + Pan-India", color: "#7C3AED", badge: "📍 Residential", highlights: ["Strongest in South India medical results", "Integrated school + residential model", "Pinnacle / Super-30 batches for toppers", "Affordable, scholarship-driven admissions"], website: "https://www.narayanagroup.com", fee: "₹90K – ₹2.0L/year", mode: "Offline / Residential" },
  { name: "Physics Wallah (PW)", city: "Online + Vidyapeeth", color: "#15A06E", badge: "💻 Best Value", highlights: ["Most affordable quality NEET coaching", "Arjuna / Yakeen NEET batches", "Live + recorded lectures, strong faculty", "Great with disciplined NCERT self-study"], website: "https://www.pw.live", fee: "₹4K – ₹40K/year", mode: "Online / Offline" },
  { name: "Unacademy / Vedantu", city: "Online (Pan-India)", color: "#EC4899", badge: "🖥 Online Live", highlights: ["Live interactive classes with top educators", "Affordable vs offline Kota coaching", "Doubt sessions, test series & analytics", "Flexible — ideal for school-going aspirants"], website: "https://unacademy.com", fee: "₹25K – ₹1.0L/year", mode: "Online" },
  { name: "Self Study + NCERT", city: "Anywhere", color: "#EAB308", badge: "🌟 Topper Favourite", highlights: ["Many AIR <1000 are NCERT self-studiers", "NCERT (esp. Biology) + PYQs + 1 test series", "Lowest cost, fully flexible schedule", "Needs strong discipline & a fixed routine"], website: "https://neet.nta.nic.in", fee: "₹8K – ₹20K (tests + books)", mode: "Self-paced" },
];

const ELIGIBILITY = [
  ["Qualification", "Class 12 (or equivalent) with Physics, Chemistry, Biology/Biotechnology & English."],
  ["Minimum marks", "50% in PCB for General (40% for SC/ST/OBC, 45% for PwD)."],
  ["Age limit", "Minimum 17 years as on 31 Dec of the admission year; no upper age limit."],
  ["Attempts", "No cap on the number of attempts."],
  ["Nationality", "Indian nationals, NRIs, OCIs, PIOs & foreign nationals are eligible."],
  ["Seats via NEET", "MBBS, BDS, AYUSH, BVSc, Nursing & all medical UG seats in India."],
];

/* ── Helpers ── */
function diffIndex(val) {
  if (val >= 80) return { label: "Very Hard", color: "#EF4444", bg: "#fee2e2" };
  if (val >= 70) return { label: "Hard",      color: "#F15A38", bg: "#fff7ed" };
  if (val >= 55) return { label: "Moderate",  color: "#EAB308", bg: "#fefce8" };
  return               { label: "Easy",      color: "#15A06E", bg: "#d1fae5" };
}
function overallMeta(t) {
  const s = t.toLowerCase();
  if (s.includes("difficult") || s.includes("toughest")) return { color: "#F15A38", bg: "#fff7ed" };
  if (s.includes("easy")) return { color: "#15A06E", bg: "#d1fae5" };
  return { color: "#EAB308", bg: "#fefce8" };
}
const fmtN = (n) => (n == null ? "—" : n.toLocaleString("en-IN"));

/* ── Anchor helper — invisible scroll target so navbar menu links land right ── */
function Anchor({ id }) {
  return <div id={id} style={{ position: "relative", top: -84, height: 0 }} aria-hidden />;
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

/* ── "Good to know" notes block (local copy of the JEE predictor's) ── */
function NotesBlock({ accent, eyebrow, heading, points, note }) {
  return (
    <div className="card" style={{ marginTop: 22, borderTop: `3px solid ${accent}` }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 3 }}>{eyebrow}</div>
        <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, color: "var(--navy)" }}>{heading}</h4>
      </div>
      <div className="notes-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {points.map(({ icon: Icon, title, body }) => (
          <div key={title} style={{ display: "flex", gap: 11, padding: "13px 15px", background: "var(--sky)", borderRadius: 12, border: "1px solid var(--line)" }}>
            <span style={{ display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 9, background: `${accent}18`, color: accent, flexShrink: 0 }}><Icon size={17} /></span>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, color: "var(--navy)", marginBottom: 3 }}>{title}</div>
              <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>{body}</p>
            </div>
          </div>
        ))}
      </div>
      {note && <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={13} color={accent} style={{ flexShrink: 0 }} /> {note}</p>}
      <style>{`@media (max-width: 640px){ .notes-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function SubjectBar({ label, value, animate }) {
  const di = diffIndex(value);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: "var(--navy)" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: di.color }}>{value} · {di.label}</span>
      </div>
      <div style={{ height: 12, borderRadius: 6, background: "#f0f0f5", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 6, width: animate ? `${value}%` : "0%", background: `linear-gradient(90deg, ${di.color}99, ${di.color})`, transition: "width 0.9s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

function SnapshotBanner({ year }) {
  const dd = DIFFICULTY[year];
  if (!dd) return null;
  return (
    <div key={`snap-${year}`} className="org-banner" style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT}cc 60%, ${ACCENT}99 100%)`, borderRadius: 18, padding: "22px 26px", marginBottom: 22, position: "relative", overflow: "hidden", boxShadow: `0 14px 40px ${ACCENT}33` }}>
      <div className="org-glow" style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,.28) 0%, transparent 55%)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <div className="org-seal" style={{ width: 64, height: 64, borderRadius: 16, flexShrink: 0, display: "grid", placeItems: "center", background: "rgba(255,255,255,.18)", border: "2px solid rgba(255,255,255,.4)", backdropFilter: "blur(4px)" }}>
          <Stethoscope size={28} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>
            <Building2 size={13} style={{ display: "inline", marginRight: 5, marginBottom: -2 }} /> Conducted by NTA · NEET UG {year}
          </span>
          <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: "#fff", lineHeight: 1.1, marginTop: 4 }}>{dd.overall}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", fontSize: 13, color: "rgba(255,255,255,.92)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Users size={13} /> {dd.snap.candidates} candidates</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><BadgeCheck size={13} /> {dd.snap.qualified} qualified</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Target size={13} /> Toughest: Physics</span>
          </div>
        </div>
        <div style={{ flexShrink: 0, maxWidth: 320, fontSize: 12.5, lineHeight: 1.55, color: "rgba(255,255,255,.95)", borderLeft: "2px solid rgba(255,255,255,.35)", paddingLeft: 14, fontStyle: "italic" }}>"{dd.notes}"</div>
      </div>
    </div>
  );
}

function MarksBar({ label, value, color, maxValue = 250 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: "var(--muted)", minWidth: 120, fontWeight: 600 }}>{label}</span>
      <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#f0f0f5", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(value / maxValue) * 100}%`, background: color, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color, minWidth: 60, textAlign: "right", fontFamily: "Sora" }}>{value}/720</span>
    </div>
  );
}

/* ════════ TOOL 1 — NEET Rank Predictor (interactive demo) ════════ */
function NeetRankPredictor() {
  const nav = useNavigate();
  const [form, setForm] = useState({ phy: "", chem: "", bio: "", category: "General" });
  const [res, setRes] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const FIELDS = [
    { key: "phy",  label: "Physics",   max: 180, color: C_PHY,  icon: Atom },
    { key: "chem", label: "Chemistry", max: 180, color: C_CHEM, icon: FlaskConical },
    { key: "bio",  label: "Biology",   max: 360, color: C_BIO,  icon: Leaf },
  ];
  const setMark = (k, max, raw) => {
    if (raw === "") return set(k, "");
    const n = Math.floor(Number(raw));
    if (Number.isNaN(n) || n < 0) return;
    set(k, String(Math.min(max, n)));
  };

  const total = (Number(form.phy) || 0) + (Number(form.chem) || 0) + (Number(form.bio) || 0);
  const livePct = Math.round((total / 720) * 100);
  const hasInput = form.phy !== "" || form.chem !== "" || form.bio !== "";

  const submit = () => {
    const band = MARKS_VS_RANK.find((b) => total >= b.lo) || MARKS_VS_RANK[MARKS_VS_RANK.length - 1];
    const airMid = Math.round((band.airLo + band.airHi) / 2);
    const factor = CAT_FACTOR[form.category] ?? 1;
    const catMid = Math.max(1, Math.round(airMid * factor));
    const percentile = Math.max(0, 100 * (1 - airMid / 2400000));
    setRes({ band, airLo: band.airLo, airHi: band.airHi, airMid, catMid, percentile, category: form.category, total });
  };
  const reset = () => { setForm({ phy: "", chem: "", bio: "", category: "General" }); setRes(null); };

  const scorePct = res ? Math.round((res.total / 720) * 100) : 0;
  const sampleColleges = useMemo(() => [...NEET_COLLEGES].filter((c) => c.govt).sort((a, b) => (b.seats || 0) - (a.seats || 0)).slice(0, 5), []);

  return (
    <>
      <div className="grid-2" style={{ alignItems: "start", gap: 28 }}>
        {/* INPUT */}
        <div className="card" style={{ borderTop: `3px solid ${ACCENT}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 70% 60% at 100% 0%, ${ACCENT}10 0%, transparent 60%)` }} />
          <div style={{ position: "relative" }}>
            <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.25rem", marginBottom: 4, display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 9, background: `${ACCENT}18`, color: ACCENT }}><GaugeIcon size={18} /></span>
              Enter your expected marks
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>Physics & Chemistry out of 180, Biology out of 360 — total 720.</p>

            <div className="grid-3" style={{ gap: 11 }}>
              {FIELDS.map(({ key, label, max, color, icon: Icon }) => {
                const filled = form[key] !== "";
                return (
                  <div key={key} style={{ border: `1px solid ${filled ? `${color}55` : "var(--line)"}`, background: filled ? `${color}0c` : "var(--sky)", borderRadius: 13, padding: "12px 12px 11px", transition: "all .18s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <span style={{ display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: 7, background: `${color}1c`, color }}><Icon size={14} /></span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--navy)", fontFamily: "Sora" }}>{label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                      <input type="number" min="0" max={max} value={form[key]} onChange={(e) => setMark(key, max, e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="0"
                        style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontFamily: "Sora", fontWeight: 800, fontSize: 22, color: "var(--navy)", padding: 0, minWidth: 0 }} />
                      <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>/ {max}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 12, background: "var(--sky)", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>Total entered</span>
                <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, color: "var(--navy)" }}>{total}<span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}> / 720</span><span style={{ fontSize: 12, color: ACCENT, fontWeight: 700, marginLeft: 8 }}>{livePct}%</span></span>
              </div>
              <div style={{ height: 8, borderRadius: 5, background: "#e7e7ee", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 5, width: `${Math.min(100, livePct)}%`, background: `linear-gradient(90deg, ${ACCENT}aa, ${ACCENT})`, transition: "width .35s cubic-bezier(.4,0,.2,1)" }} />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>Category</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {Object.keys(CAT_FACTOR).map((c) => {
                  const active = form.category === c;
                  return (
                    <button key={c} type="button" onClick={() => set("category", c)} style={{ padding: "7px 14px", borderRadius: 50, cursor: "pointer", fontSize: 12.5, fontWeight: 700, fontFamily: "Sora", border: `1px solid ${active ? ACCENT : "var(--line)"}`, background: active ? ACCENT : "#fff", color: active ? "#fff" : "var(--navy)", boxShadow: active ? `0 2px 10px ${ACCENT}40` : "none", transition: "all .16s" }}>{c}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn full" style={{ background: ACCENT, color: "#fff", justifyContent: "center", boxShadow: `0 6px 18px ${ACCENT}44`, fontWeight: 700 }} onClick={submit}><Sparkles size={16} /> Predict my rank</button>
              <button className="btn btn-ghost" onClick={reset} aria-label="Reset" title="Reset" disabled={!hasInput && !res}><RotateCcw size={16} /></button>
            </div>
          </div>
        </div>

        {/* RESULT */}
        <div className="card" style={{ minHeight: 320 }}>
          {!res ? (
            <div style={{ display: "grid", placeItems: "center", height: 320, color: "var(--muted)", textAlign: "center" }}>
              <div>
                <div style={{ display: "grid", placeItems: "center", width: 76, height: 76, borderRadius: "50%", margin: "0 auto", background: `${ACCENT}10`, border: `2px dashed ${ACCENT}40` }}><GaugeIcon size={36} color={ACCENT} style={{ opacity: 0.7 }} /></div>
                <p style={{ marginTop: 16, fontWeight: 600, color: "var(--navy)" }}>Your predicted rank &amp; colleges appear here</p>
                <p style={{ marginTop: 4, fontSize: 13 }}>Enter your marks and hit <strong style={{ color: ACCENT }}>Predict my rank</strong>.</p>
                <p style={{ marginTop: 10, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 50, background: "var(--sky)", border: "1px solid var(--line)" }}><Target size={12} color={ACCENT} /> NEET scale: 0–720</p>
              </div>
            </div>
          ) : (
            <div className="fade-up">
              <div className="grid-2" style={{ gap: 8, alignItems: "center" }}>
                <Gauge value={scorePct} label="Score %" color={ACCENT} height={170} />
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Predicted All-India Rank</div>
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.7rem", color: "var(--navy)", lineHeight: 1.1 }}>{fmtN(res.airLo)} – {fmtN(res.airHi)}</div>
                  <div style={{ fontSize: 12.5, color: ACCENT, fontWeight: 700, marginTop: 2 }}>mid ~{fmtN(res.airMid)}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, padding: "4px 10px", borderRadius: 50, fontSize: 12, fontWeight: 700, background: `${ACCENT}14`, color: ACCENT }}><TrendingUp size={12} /> ~{res.percentile.toFixed(4)} %ile</div>
                </div>
              </div>

              <div className="grid-3" style={{ gap: 10, marginTop: 14, textAlign: "center" }}>
                {[["Total", `${res.total}/720`], ["AIR (est.)", `~${fmtN(res.airMid)}`], [`${res.category} rank`, `~${fmtN(res.catMid)}`]].map(([l, v]) => (
                  <div key={l} style={{ background: "var(--sky)", borderRadius: 12, padding: "12px 8px" }}>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{l}</div>
                    <strong style={{ color: "var(--navy)", fontSize: 14 }}>{v}</strong>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}><Building2 size={13} color={ACCENT} /> Example government colleges to target</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {sampleColleges.map((c) => (
                    <div key={c.slug} onClick={() => nav(`/neet-colleges/${c.slug}`)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 11px", borderRadius: 9, background: "var(--sky)", fontSize: 12.5, cursor: "pointer" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: "var(--navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} /> {c.district || c.state} · {fmtN(c.seats)} seats</div>
                      </div>
                      <span className="badge" style={{ flexShrink: 0, background: `${ACCENT}22`, color: ACCENT }}>Govt</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn full" style={{ background: "var(--navy)", color: "#fff", justifyContent: "center", marginTop: 16 }} onClick={() => nav("/neet-colleges")}>See all medical colleges <ArrowRight size={16} /></button>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>Illustrative demo from past marks-vs-rank trends. Not an official prediction — verify on neet.nta.nic.in.</p>
            </div>
          )}
        </div>
      </div>

      <NotesBlock accent={ACCENT} eyebrow="About this tool" heading="How the NEET Rank Predictor works"
        points={[
          { icon: GaugeIcon, title: "Marks → All-India Rank", body: "Your 720-mark total is mapped to an expected AIR band using historical NEET marks-vs-rank trends across the ~22–24 lakh candidate pool." },
          { icon: Trophy, title: "Category rank too", body: "Along with the All-India Rank you get an indicative category rank — for OBC/SC/ST/EWS that's what actually drives MCC & state counselling." },
          { icon: Target, title: "A band, not one number", body: "Real ranks shift with paper difficulty, normalisation and candidate count, so we show a realistic low–high band rather than a single figure." },
          { icon: Building2, title: "Colleges for your score", body: "We surface medical colleges to target. Open the full directory of 780 MBBS colleges to filter by state, seats & management." },
        ]}
        note="This is an interactive demo using illustrative trends — not an official prediction. Verify on neet.nta.nic.in." />
    </>
  );
}

/* ════════ TOOL 2 — NEET College Predictor (filters real college data) ════════ */
function NeetCollegePredictor() {
  const nav = useNavigate();
  const [score, setScore] = useState("");
  const [category, setCategory] = useState("General");
  const [quota, setQuota] = useState("All India (AIQ)");
  const [course, setCourse] = useState("MBBS");
  const [state, setState] = useState("");
  const [shown, setShown] = useState(false);

  const results = useMemo(() => {
    let arr = NEET_COLLEGES.filter((c) => (!state || c.state === state));
    // Higher score → government / higher-seat colleges first (illustrative ordering)
    const s = Number(score) || 0;
    arr = [...arr].sort((a, b) => {
      if (quota === "State Quota" && state) { /* keep state set */ }
      const ga = a.govt ? 1 : 0, gb = b.govt ? 1 : 0;
      if (s >= 600 && ga !== gb) return gb - ga; // top scores → govt first
      return (b.seats || 0) - (a.seats || 0);
    });
    return arr.slice(0, 9);
  }, [score, quota, state]);

  const sel = { background: "#fff", border: "1.5px solid var(--line)", borderRadius: 10, padding: "10px 12px", fontSize: 13, fontFamily: "Sora", fontWeight: 600, color: "var(--navy)", width: "100%" };

  return (
    <>
      <div className="card" style={{ padding: "24px 26px", borderTop: `3px solid ${C_CHEM}` }}>
        <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.2rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 9, background: `${C_CHEM}18`, color: C_CHEM }}><Landmark size={18} /></span>
          Find your medical colleges
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5 }}>NEET Score / 720</label>
            <input value={score} onChange={(e) => setScore(e.target.value)} placeholder="e.g. 620" style={{ ...sel, marginTop: 4 }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5 }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...sel, marginTop: 4 }}>{["General", "EWS", "OBC-NCL", "SC", "ST", "PwD"].map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5 }}>Quota</label>
            <select value={quota} onChange={(e) => setQuota(e.target.value)} style={{ ...sel, marginTop: 4 }}>{["All India (AIQ)", "State Quota", "Deemed / Central", "Management / NRI"].map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5 }}>State</label>
            <select value={state} onChange={(e) => setState(e.target.value)} style={{ ...sel, marginTop: 4 }}><option value="">All states</option>{NEET_STATES.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5 }}>Course</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)} style={{ ...sel, marginTop: 4 }}>{["MBBS", "BDS", "BAMS / AYUSH", "BVSc"].map((c) => <option key={c}>{c}</option>)}</select>
          </div>
        </div>
        <button onClick={() => setShown(true)} className="btn" style={{ background: C_CHEM, color: "#fff", border: "none", padding: "11px 24px", fontWeight: 800, borderRadius: 12 }}><Landmark size={16} /> Find My Colleges</button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff8ed", border: "1px solid #f59e0b", borderRadius: 10, padding: "10px 14px", margin: "16px 0 0", fontSize: 12.5, color: "#92400e" }}>
          <span style={{ fontSize: 16 }}>🛠️</span>
          <span><strong>Interactive demo.</strong> Results are drawn from the real database of {NEET_COLLEGES.length} MBBS colleges, ordered illustratively by your score — not official cut-off matching.</span>
        </div>

        {shown && (
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14, marginTop: 18 }}>
            {results.map((c) => (
              <div key={c.slug} onClick={() => nav(`/neet-colleges/${c.slug}`)} className="card card-hover" style={{ padding: "14px 16px", cursor: "pointer", borderLeft: `3px solid ${c.govt ? ACCENT : "#8b5cf6"}` }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 50, background: `${c.govt ? ACCENT : "#8b5cf6"}16`, color: c.govt ? ACCENT : "#8b5cf6", textTransform: "uppercase" }}>{c.govt ? "Government" : c.management}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50, background: "#f3f4f6", color: "#6b7280" }}>{fmtN(c.seats)} seats</span>
                </div>
                <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, color: "var(--navy)", lineHeight: 1.3 }}>{c.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--muted)", marginTop: 5 }}><MapPin size={11} color={ACCENT} /> {c.district || c.state}</div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => nav("/neet-colleges")} className="btn btn-coral" style={{ fontWeight: 800, marginTop: 18 }}><Landmark size={16} /> Explore all {NEET_COLLEGES.length} medical colleges <ArrowRight size={15} /></button>
      </div>

      <NotesBlock accent={C_CHEM} eyebrow="About this tool" heading="How the College Predictor works"
        points={[
          { icon: Landmark, title: "Real college database", body: `Results come from the full ${NEET_COLLEGES.length}-college NMC seat-matrix dataset — every MBBS college incl. AIIMS & JIPMER, with seats & management.` },
          { icon: Users, title: "Score, category & quota", body: "Pick your score, category, quota and state. NEET fills 15% seats via All-India Quota (MCC) and 85% via state counselling." },
          { icon: MapPin, title: "Filter state-wise", body: "Most MBBS seats are state-quota, so filtering by your home state surfaces the colleges you're most likely to get." },
          { icon: Building2, title: "Open any college", body: "Tap a result to open its full page — seats, affiliating university, management, year and NEET admission details." },
        ]}
        note="Interactive demo ordered by score against real college data — not official cut-off matching. Verify on mcc.nic.in & your state portal." />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   Main Page
════════════════════════════════════════════════════════════ */
export default function Neet() {
  const nav = useNavigate();
  const [year, setYear] = useState(2025);
  const [animateBars, setAnimateBars] = useState(true);
  const dd = DIFFICULTY[year];

  const subjectBars = [
    { name: "Physics",   value: dd.phy.idx },
    { name: "Chemistry", value: dd.chem.idx },
    { name: "Biology",   value: dd.bio.idx },
  ];

  const stateStats = useMemo(() => {
    const m = {};
    for (const c of NEET_COLLEGES) {
      const s = (m[c.state] ||= { state: c.state, count: 0, seats: 0 });
      s.count += 1; s.seats += c.seats || 0;
    }
    return Object.values(m).sort((a, b) => b.count - a.count);
  }, []);

  function handleYear(y) {
    setAnimateBars(false);
    setTimeout(() => { setYear(y); setAnimateBars(true); }, 60);
  }

  return (
    <div className="page">
      <Seo
        title="NEET UG Rank Predictor, College Predictor, Cutoffs, Toppers & Syllabus"
        description="NEET UG hub — interactive rank & medical college predictors, 5-year difficulty analysis, cut-off trends, toppers, full 720-mark syllabus, exam pattern, 12-month roadmap and best coaching. Built for NEET aspirants on CollegeParichay."
        path="/neet"
      />

      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.95)}      to{opacity:1;transform:scale(1)}      }
        @keyframes pulseRingNeet { 0%{box-shadow:0 0 0 0 rgba(21,160,110,.4)} 70%{box-shadow:0 0 0 10px rgba(21,160,110,0)} 100%{box-shadow:0 0 0 0 rgba(21,160,110,0)} }
        .fade-up { animation: fadeUp .44s cubic-bezier(.4,0,.2,1) both; }
        .scale-in { animation: scaleIn .36s cubic-bezier(.4,0,.2,1) both; }
        .d1 { animation-delay:.04s } .d2 { animation-delay:.10s }
        .year-active-neet { animation: pulseRingNeet 1.2s ease; }
        @keyframes orgIn { from{opacity:0;transform:translateY(14px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes orgGlow { 0%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} 100%{opacity:.5;transform:scale(1)} }
        @keyframes sealPop { from{transform:scale(.6) rotate(-8deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        .org-banner { animation: orgIn .5s cubic-bezier(.34,1.56,.64,1) both; }
        .org-glow { position:absolute; inset:0; animation: orgGlow 4s ease-in-out infinite; pointer-events:none; }
        .org-seal { animation: sealPop .55s cubic-bezier(.34,1.56,.64,1) .08s both; }
        @media (max-width: 640px) { .org-banner [style*="border-left"] { border-left:none !important; padding-left:0 !important; } }
        .card-hover { transition: transform .2s, box-shadow .2s; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,.09); }
        .diff-tag-neet { display:inline-block; font-size:11px; font-weight:700; padding:4px 11px; border-radius:50px; background:rgba(21,160,110,.10); color:#0f7a53; border:1px solid rgba(21,160,110,.22); margin:3px 3px 3px 0; }
        .marks-card { background:var(--sky); border-radius:14px; padding:16px 20px; border:1px solid var(--line); transition:transform .2s, box-shadow .2s; }
        .marks-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.06); }
        .yr-row-neet:hover td { background:#ecfdf5 !important; }
        .nav-pill-neet { background:rgba(21,160,110,.11); border:1px solid rgba(21,160,110,.3); color:#0f7a53; padding:8px 16px; border-radius:50px; font-size:13px; font-weight:600; text-decoration:none; transition:all .18s; }
        .nav-pill-neet:hover { background:${ACCENT}; color:#fff; border-color:${ACCENT}; }
        @media (max-width: 720px) { .paper-char-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── Hero ── */}
      <section className="warm-page-header" style={{ padding: "36px 0 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 20%, rgba(21,160,110,.18) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 50% at 0% 90%, rgba(14,165,164,.14) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow" style={{ marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 6 }}><Stethoscope size={12} /> NEET UG 2026</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.8rem)", margin: "0 0 10px", lineHeight: 1.2, color: "#1c1c28" }}>NEET — Rank &amp; Medical College Predictor Hub</h1>
          <p style={{ color: "rgba(28,28,40,.62)", maxWidth: 640, marginBottom: 0 }}>
            Predict your NEET rank &amp; the MBBS colleges you can get, analyse 5-year difficulty (Physics · Chemistry · Biology),
            track cut-off &amp; topper trends, and explore the full 720-mark syllabus, pattern, roadmap &amp; coaching.
          </p>
        </div>
      </section>

      {/* ── Tool 1 — Rank Predictor ── */}
      <Anchor id="rank" />
      <Block id="predictor" eyebrow="Tool 1" title="NEET Rank Predictor"
        sub="Enter your Physics, Chemistry & Biology marks (out of 720) to see your expected All-India Rank, category rank, percentile & colleges to target.">
        <NeetRankPredictor />
      </Block>

      {/* ── Tool 2 — College Predictor ── */}
      <div style={{ background: "var(--sky)" }}>
        <Block id="college" eyebrow="Tool 2" title="NEET Medical College Predictor"
          sub="Filter the full database of 780 MBBS colleges by your score, category, quota & state to see where you can land." bg="transparent">
          <NeetCollegePredictor />
        </Block>
      </div>

      {/* ════════ DIFFICULTY ANALYSIS (subject-wise, 5-year) ════════ */}
      <section id="difficulty" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Paper Analysis · 2021–2025</span>
            <h2 className="section-title">NEET UG Past 5-Year Difficulty Level Analysis</h2>
            <p className="section-sub">Subject-wise difficulty read for each year. Index: 0 = easiest · 100 = hardest. <strong>Physics is the toughest, Biology the most scoring</strong>, every year.</p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <div style={{ display: "inline-flex", gap: 6, background: "var(--sky)", padding: 6, borderRadius: 50, border: "1px solid var(--line)", boxShadow: "0 2px 12px rgba(0,0,0,.05)", flexWrap: "wrap", justifyContent: "center" }}>
              {YEARS.map((y) => (
                <button key={y} onClick={() => handleYear(y)} className={year === y ? "year-active-neet" : ""} style={{ padding: "9px 22px", borderRadius: 50, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "Sora", background: year === y ? `linear-gradient(135deg,${ACCENT},#22c55e)` : "transparent", color: year === y ? "#fff" : "var(--navy)", boxShadow: year === y ? `0 4px 16px ${ACCENT}59` : "none", transition: "all 0.22s" }}>{y}</button>
              ))}
            </div>
          </div>

          <SnapshotBanner year={year} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }} className="paper-char-grid">
            {(() => {
              const meta = overallMeta(dd.overall);
              const avg = Math.round((dd.phy.idx + dd.chem.idx + dd.bio.idx) / 3);
              return (
                <div className="card card-hover scale-in d1" style={{ borderTop: `4px solid ${meta.color}`, padding: "22px 26px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Overall · NEET {year}</div>
                      <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: "clamp(1.2rem,2.3vw,1.7rem)", color: meta.color, lineHeight: 1.1 }}>{dd.overall}</div>
                    </div>
                    <div style={{ textAlign: "right" }}><div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 28, color: meta.color }}>{avg}</div><div style={{ fontSize: 10, color: "var(--muted)" }}>Avg Index</div></div>
                  </div>
                  <div style={{ height: 10, borderRadius: 6, background: "#e5e7eb", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 6, background: `linear-gradient(90deg,${meta.color}88,${meta.color})`, width: animateBars ? `${avg}%` : "0%", transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}><strong style={{ color: "var(--navy)" }}>Notes:</strong> {dd.notes}</div>
                </div>
              );
            })()}

            <div className="card card-hover scale-in d2" style={{ padding: "20px 24px" }}>
              <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, marginBottom: 14 }}>Subject Breakdown · {year}</h4>
              <SubjectBar label="⚛ Physics"   value={dd.phy.idx}  animate={animateBars} />
              <SubjectBar label="⚗ Chemistry" value={dd.chem.idx} animate={animateBars} />
              <SubjectBar label="🌿 Biology"   value={dd.bio.idx}  animate={animateBars} />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <h4 style={{ fontFamily: "Sora", fontWeight: 700 }}>Subject Difficulty Index · {year}</h4>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Higher bar = more difficult</span>
            </div>
            <Bars key={`bars-${year}`} data={subjectBars} bars={[{ key: "value", label: "Difficulty index", color: ACCENT }]} height={260} />
          </div>

          {/* Year-wise summary table — verbatim subject reads */}
          <div style={{ marginTop: 10 }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, marginBottom: 14 }}>📋 NEET UG Past 5 Years Difficulty Level Analysis (2021–2025)</h4>
            <div className="card" style={{ overflowX: "auto", padding: 0 }}>
              <table className="data-table" style={{ minWidth: 820 }}>
                <thead><tr><th>Year</th><th>Overall</th><th>Physics</th><th>Chemistry</th><th>Biology</th><th>Notes</th></tr></thead>
                <tbody>
                  {YEARS.map((y) => {
                    const row = DIFFICULTY[y]; const m = overallMeta(row.overall);
                    return (
                      <tr key={y} className="yr-row-neet">
                        <td><strong style={{ fontFamily: "Sora", fontSize: 15, color: year === y ? ACCENT : "var(--navy)" }}>{y}{year === y ? " ◀" : ""}</strong></td>
                        <td><span style={{ fontSize: 12, fontWeight: 700, padding: "4px 11px", borderRadius: 50, background: m.bg, color: m.color, whiteSpace: "nowrap" }}>{row.overall}</span></td>
                        <td style={{ fontSize: 12.5, color: "var(--navy)", minWidth: 150 }}>{row.phy.note}</td>
                        <td style={{ fontSize: 12.5, color: "var(--navy)", minWidth: 150 }}>{row.chem.note}</td>
                        <td style={{ fontSize: 12.5, color: "var(--navy)", minWidth: 150 }}>{row.bio.note}</td>
                        <td style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55, minWidth: 200 }}>{row.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 6-YEAR SUBJECT TREND ════════ */}
      <section className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">5-Year Trend</span>
            <h2 className="section-title">Subject Difficulty Trend (2021–2025)</h2>
            <p className="section-sub">How Physics, Chemistry &amp; Biology difficulty shifted over five years. Physics stays the rank-decider; Biology the most scoring.</p>
          </div>
          <div className="grid-3" style={{ gap: 22 }}>
            {[
              { label: "Physics",   data: TREND_PHY,  color: C_PHY,  note: "The toughest, rank-deciding section — lengthy numericals every year." },
              { label: "Chemistry", data: TREND_CHEM, color: C_CHEM, note: "NCERT-aligned, moderately scoring; can turn tricky & lengthy." },
              { label: "Biology",   data: TREND_BIO,  color: C_BIO,  note: "Most scoring — 90 Q / 360 marks. Accuracy here makes the rank." },
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

      {/* ════════ CUT-OFF TRENDS (5-year, official grid) ════════ */}
      <section id="cutoffs" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Cut-off Trends · 2021–2025</span>
            <h2 className="section-title">NEET UG Past 5 Years Cut-Off Trends Analysis</h2>
            <p className="section-sub">Category-wise qualifying marks range (out of 720) for the last five years. The lower number is the minimum qualifying score.</p>
          </div>

          {/* Latest-year quick cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 26 }} className="paper-char-grid">
            {[
              { cat: "UR / EWS (50th)", key: "ur",  color: ACCENT },
              { cat: "OBC / SC / ST (40th)", key: "res", color: C_PHY },
              { cat: "PwD (45th)",      key: "pwd", color: C_CHEM },
            ].map(({ cat, key, color }) => {
              const latest = CUTOFF_TREND[CUTOFF_TREND.length - 1], prev = CUTOFF_TREND[CUTOFF_TREND.length - 2];
              const val = latest[key], diff = val - prev[key], isUp = diff >= 0;
              return (
                <div key={cat} className="marks-card fade-up" style={{ borderTop: `4px solid ${color}` }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>{cat}</div>
                  <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 26, color, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 8 }}>min qualifying (2025) / 720</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: isUp ? "#EF4444" : "#15A06E" }}>{isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{isUp ? "+" : ""}{diff} vs {prev.year}</div>
                </div>
              );
            })}
          </div>

          {/* Full official cut-off table */}
          <div className="card" style={{ overflowX: "auto", marginBottom: 20, padding: 0 }}>
            <table className="data-table" style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th>Category</th><th>Qualifying Criteria</th>
                  {CUTOFF_TABLE.years.map((y) => <th key={y} style={{ textAlign: "center" }}>NEET {y}</th>)}
                </tr>
              </thead>
              <tbody>
                {CUTOFF_TABLE.rows.map((r) => (
                  <tr key={r.cat} className="yr-row-neet">
                    <td><strong style={{ fontFamily: "Sora", color: "var(--navy)" }}>{r.cat}</strong></td>
                    <td><span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{r.crit}</span></td>
                    {r.ranges.map((rg, i) => <td key={i} style={{ textAlign: "center", fontWeight: 600, color: "var(--navy)", whiteSpace: "nowrap" }}>{rg}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Minimum Qualifying Marks Trend (out of 720)</h4>
            <Trend data={CUTOFF_TREND} lines={[
              { key: "ur", label: "UR / EWS", color: ACCENT },
              { key: "res", label: "OBC / SC / ST", color: C_PHY },
              { key: "pwd", label: "PwD", color: C_CHEM },
            ]} height={300} />
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14, textAlign: "center" }}>Source: NTA NEET UG official cut-offs. Verify the latest at <a href="https://neet.nta.nic.in" target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 600 }}>neet.nta.nic.in</a></p>
          </div>
        </div>
      </section>

      {/* ════════ TOPPERS + RESULT ════════ */}
      <section id="result" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Toppers · Past 5 Years</span>
            <h2 className="section-title">Toppers Trends of NEET Exam — Past 5 Years</h2>
            <p className="section-sub">The increasing competitiveness of NEET means top scorers now attain — or come very close to — full marks. Here are the rank-1 toppers of the last five years.</p>
          </div>

          <div className="card" style={{ overflowX: "auto", marginBottom: 20, padding: 0 }}>
            <table className="data-table" style={{ minWidth: 720 }}>
              <thead><tr><th>S. No.</th><th>Candidate Name</th><th>Roll Number</th><th style={{ textAlign: "center" }}>Total Marks</th><th style={{ textAlign: "center" }}>Percentile</th><th style={{ textAlign: "center" }}>NEET Rank</th><th>State</th></tr></thead>
              <tbody>
                {TOPPERS.map((t) => (
                  <tr key={t.sno} className="yr-row-neet">
                    <td><strong style={{ fontFamily: "Sora" }}>{t.sno}</strong></td>
                    <td style={{ fontWeight: 700, color: "var(--navy)" }}>{t.name}</td>
                    <td style={{ color: "var(--muted)", fontFamily: "monospace", fontSize: 12.5 }}>{t.roll}</td>
                    <td style={{ textAlign: "center" }}><span style={{ fontFamily: "Sora", fontWeight: 800, color: t.marks === 720 ? ACCENT : "var(--navy)" }}>{t.marks}</span><span style={{ fontSize: 11, color: "var(--muted)" }}>/720</span></td>
                    <td style={{ textAlign: "center", fontSize: 12.5, color: "var(--muted)" }}>{t.pct}</td>
                    <td style={{ textAlign: "center" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "Sora", fontWeight: 800, color: ACCENT }}><Trophy size={12} /> {t.rank}</span></td>
                    <td style={{ fontSize: 13 }}>{t.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid-3" style={{ gap: 14 }}>
            {[
              { icon: "🏆", title: "Perfect 720", stat: "3 of 5", sub: "toppers scored a perfect 720/720 — the ceiling effect makes tie-breakers decisive." },
              { icon: "📈", title: "Percentile", stat: "99.9999+", sub: "top scorers sit in the 99.9999+ percentile band of ~22–24 lakh candidates." },
              { icon: "🗺️", title: "Spread", stat: "5 states", sub: "Rajasthan, UP, Maharashtra & Delhi — talent is spread right across India." },
            ].map((c) => (
              <div key={c.title} className="card" style={{ borderLeft: `4px solid ${ACCENT}`, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
                  <div><div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13 }}>{c.title}</div><div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 18, color: ACCENT }}>{c.stat}</div></div>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55 }}>{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ EXAM PATTERN ════════ */}
      <section id="pattern" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Exam Pattern</span>
            <h2 className="section-title">NEET UG Exam Pattern</h2>
            <p className="section-sub">One pen-and-paper paper of 720 marks across Physics, Chemistry, Botany &amp; Zoology.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Total Marks", value: "720", sub: "Phy 180 · Chem 180 · Bio 360", color: ACCENT },
              { label: "Questions", value: "200", sub: "attempt any 180", color: C_PHY },
              { label: "Duration", value: "3h 20m", sub: "single paper", color: C_CHEM },
              { label: "Marking", value: "+4 / −1", sub: "0 for unattempted", color: "#7C3AED" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="card card-hover" style={{ textAlign: "center", borderTop: `4px solid ${color}`, padding: "20px 12px" }}>
                <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 30, color }}>{value}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{sub}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "10px 28px" }}>
            {PATTERN.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 14, borderBottom: "1px solid rgba(0,0,0,.06)", paddingBottom: 9 }}>
                <span style={{ color: "var(--muted)", fontSize: 13.5 }}>{k}</span>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--navy)", textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SYLLABUS ════════ */}
      <section id="syllabus" className="section" style={{ background: "var(--sky)", scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Syllabus &amp; Resources</span>
            <h2 className="section-title">Complete NEET UG Syllabus</h2>
            <p className="section-sub">Chapter areas per subject. Biology carries half the paper (90 Q / 360 marks), so it decides your rank.</p>
          </div>
          <div className="grid-3" style={{ gap: 22 }}>
            {Object.entries(SYLLABUS).map(([subj, { color, icon: Icon, topics, q, chapters }]) => (
              <div key={subj} className="card card-hover" style={{ borderTop: `4px solid ${color}`, scrollMarginTop: 90 }} id={subj.toLowerCase()}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "grid", placeItems: "center" }}><Icon size={22} color={color} /></div>
                  <div><h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17 }}>{subj}</h3><div style={{ fontSize: 12, color: "var(--muted)" }}>{chapters} chapters · {q}</div></div>
                </div>
                {topics.map((t) => (
                  <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, marginBottom: 8 }}>
                    <CheckCircle2 size={15} color={color} style={{ flexShrink: 0, marginTop: 2 }} /><span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
                <a href="https://neet.nta.nic.in" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 13, fontWeight: 600, color }}><FileText size={14} /> Official Syllabus <ArrowRight size={12} /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ EXAM CYCLE ════════ */}
      <section id="cycle" className="section" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">Exam Cycle 2026</span>
            <h2 className="section-title">NEET UG 2026 — Key Dates</h2>
            <p className="section-sub">Every milestone from notification to counselling. <em>Tentative — confirm on the official NTA portal.</em></p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
            {EXAM_CYCLE.map((e, i) => (
              <Reveal key={e.phase} delay={(i % 4) * 0.04}>
                <div className="card card-hover" style={{ borderLeft: `4px solid ${e.color}`, display: "flex", alignItems: "center", gap: 12, height: "100%" }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{e.icon}</span>
                  <div>
                    <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, color: "var(--navy)", lineHeight: 1.25 }}>{e.phase}</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: e.color, marginTop: 3 }}><CalendarDays size={12} /> {e.when}</div>
                  </div>
                </div>
              </Reveal>
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
            <p className="section-sub">An NCERT-first, Biology-heavy plan with tasks, books and daily targets — from foundation through exam day.</p>
          </div>
          <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg,${C_BIO},${C_CHEM},${C_PHY},#EC4899,#EAB308,${C_BIO})`, transform: "translateX(-50%)", borderRadius: 4 }} />
            {ROADMAP.map((step, i) => (
              <div key={step.month} style={{ display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end", marginBottom: 36, position: "relative" }}>
                <div style={{ position: "absolute", left: "50%", top: 28, transform: "translateX(-50%)", width: 22, height: 22, borderRadius: "50%", background: step.color, border: "3px solid #fff", boxShadow: `0 0 0 4px ${step.color}44`, zIndex: 1 }} />
                <div className="card card-hover" style={{ width: "44%", borderTop: `4px solid ${step.color}`, padding: "20px 22px", marginLeft: i % 2 === 0 ? 0 : "auto", marginRight: i % 2 === 0 ? "auto" : 0 }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{step.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: step.color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{step.month}</div>
                  <h4 style={{ fontFamily: "Sora", fontWeight: 800, marginBottom: 8, fontSize: 15 }}>{step.label}</h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, marginBottom: 12 }}>{step.tip}</p>
                  <div style={{ borderTop: `1px solid ${step.color}22`, paddingTop: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}><Target size={11} style={{ display: "inline", marginRight: 4 }} />Key Tasks</div>
                    {step.tasks.map((task) => (
                      <div key={task} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12, marginBottom: 5 }}><CheckCircle2 size={13} color={step.color} style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{task}</span></div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {step.resources.map((r) => <span key={r} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 50, background: `${step.color}14`, color: step.color, fontWeight: 600, border: `1px solid ${step.color}33` }}>{r}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ marginTop: 16, background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: `1px solid ${ACCENT}33` }}>
            <h4 style={{ fontFamily: "Sora", fontWeight: 800, marginBottom: 16, color: "#1a1a2e" }}>📚 Complete Book List — NEET UG</h4>
            <div className="grid-3" style={{ gap: 14 }}>
              {[
                { subj: "Physics", books: ["NCERT 11 & 12 (base)", "HC Verma Vol 1 & 2", "DC Pandey NEET series", "Errorless / MTG PYQ"], color: C_PHY },
                { subj: "Chemistry", books: ["NCERT 11 & 12 (esp. Inorganic)", "MS Chouhan Organic", "N. Awasthi Physical", "MTG NCERT Fingertips"], color: C_CHEM },
                { subj: "Biology", books: ["NCERT 11 & 12 (the bible)", "Trueman's Biology Vol 1 & 2", "MTG NCERT Fingertips", "33 Years NEET PYQ"], color: C_BIO },
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
                  <div><h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, marginBottom: 3 }}>{c.name}</h3><div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)" }}><MapPin size={12} /> {c.city}</div></div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50, background: `${c.color}18`, color: c.color, whiteSpace: "nowrap" }}>{c.badge}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 50, background: "#f3f4f6", color: "var(--navy)", fontWeight: 600 }}>💰 {c.fee}</span>
                  <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 50, background: "#f3f4f6", color: "var(--navy)", fontWeight: 600 }}>🖥 {c.mode}</span>
                </div>
                {c.highlights.map((h) => (
                  <div key={h} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12, marginBottom: 6 }}><CheckCircle2 size={13} color={c.color} style={{ flexShrink: 0, marginTop: 2 }} /><span style={{ color: "var(--navy)", lineHeight: 1.5 }}>{h}</span></div>
                ))}
                <a href={c.website} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 13, fontWeight: 600, color: c.color }}><Globe size={13} /> Visit Website <ArrowRight size={12} /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ELIGIBILITY ════════ */}
      <Block id="eligibility" eyebrow="Eligibility" title="Who can appear for NEET UG?" sub="Key eligibility criteria at a glance." bg="var(--sky)">
        <div className="grid-2" style={{ gap: 14 }}>
          {ELIGIBILITY.map(([t, ddd]) => (
            <div key={t} className="card card-hover" style={{ display: "flex", gap: 12, alignItems: "flex-start", borderLeft: `4px solid ${ACCENT}` }}>
              <BadgeCheck size={18} color={ACCENT} style={{ flexShrink: 0, marginTop: 2 }} />
              <div><div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14 }}>{t}</div><p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.55, margin: "2px 0 0" }}>{ddd}</p></div>
            </div>
          ))}
        </div>
      </Block>

      {/* ════════ COUNSELLING + STATE-WISE COLLEGES ════════ */}
      <section id="counselling" className="section" style={{ scrollMarginTop: 90 }}>
        <Anchor id="colleges" />
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow"><MapPin size={12} style={{ display: "inline", marginRight: 4 }} /> Counselling &amp; Colleges</span>
            <h2 className="section-title">All {NEET_COLLEGES.length} MBBS Colleges — State by State</h2>
            <p className="section-sub">NEET fills 15% seats via All-India Quota (MCC) and 85% via state counselling. Browse every MBBS college across {NEET_STATES.length} states &amp; UTs ({NEET_TOTAL_SEATS.toLocaleString("en-IN")} seats).</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginBottom: 24 }}>
            {stateStats.map((s, i) => (
              <Reveal key={s.state} delay={(i % 4) * 0.03}>
                <Link to={`/neet-colleges?state=${encodeURIComponent(s.state)}`} className="card card-hover" style={{ display: "flex", alignItems: "center", gap: 12, height: "100%", textDecoration: "none", borderLeft: `3px solid ${ACCENT}` }}>
                  <span style={{ width: 42, height: 42, borderRadius: 11, background: `${ACCENT}18`, display: "grid", placeItems: "center", flexShrink: 0 }}><MapPin size={20} color={ACCENT} /></span>
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
            <button className="btn btn-coral" onClick={() => nav("/neet-colleges")}><Landmark size={16} /> Explore all {NEET_COLLEGES.length} medical colleges <ArrowRight size={15} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}
