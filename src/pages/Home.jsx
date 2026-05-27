import Hero from "../components/home/Hero.jsx";
import PredictorCards from "../components/home/PredictorCards.jsx";
import NewTools from "../components/home/NewTools.jsx";
import ApplicationRadar from "../components/home/ApplicationRadar.jsx";
import EntranceExams from "../components/home/EntranceExams.jsx";
import TopColleges from "../components/home/TopColleges.jsx";
import PrivateUniversities from "../components/home/PrivateUniversities.jsx";
import NewsSection from "../components/home/NewsSection.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import { Bars, CenterDonut } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import { Users, BookOpen, Target, BarChart3, ArrowRight, Trophy, Building2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

/* ── Inline chart data ── */
const SEAT_DATA = [
  { name: "IITs",   value: 17385 },
  { name: "NITs",   value: 23954 },
  { name: "IIITs",  value: 7402  },
  { name: "GFTIs",  value: 12280 },
];

const BRANCH_DEMAND = [
  { name: "CSE",       value: 98 },
  { name: "ECE",       value: 84 },
  { name: "Mech",      value: 72 },
  { name: "Civil",     value: 58 },
  { name: "Chem Engg", value: 54 },
  { name: "EE",        value: 80 },
];

const STATS = [
  { label: "Students helped",    value: "2.4L+",   icon: Users,     color: "#F97316", bg: "#fff7f0" },
  { label: "Colleges listed",    value: "850+",    icon: BookOpen,  color: "#0EA5A4", bg: "#f0fdfc" },
  { label: "Rank predictions",   value: "98% acc", icon: Target,    color: "#15a06e", bg: "#ecfdf3" },
  { label: "Cutoff data points", value: "1.2M+",   icon: BarChart3, color: "#1c1c28", bg: "#f3f4f6" },
];

/* ── JEE exams (parallel) — each links to its full section ── */
const EXAMS = [
  {
    key: "advanced",
    name: "JEE Advanced 2026",
    tag: "Gateway to the IITs",
    icon: Trophy,
    accent: "#1c1c28",
    date: "May 18, 2026",
    blurb: "The single exam for admission to all 23 IITs. Only the top ~2.5 lakh JEE Main qualifiers are eligible to attempt it.",
    info: [
      ["Conducted by", "IITs (rotational)"],
      ["Eligibility", "Top 2.5L in JEE Main"],
      ["Attempts", "2 consecutive years"],
      ["Papers", "Paper 1 + Paper 2 (both compulsory)"],
      ["Seats", "~17,385 across IITs"],
    ],
    link: "/jee-advanced",
    cta: "Open JEE Advanced",
  },
  {
    key: "main",
    name: "JEE Main 2026",
    tag: "NITs · IIITs · GFTIs",
    icon: Building2,
    accent: "#F97316",
    date: "Session 1: Jan · Session 2: Apr",
    blurb: "India's largest engineering entrance. Qualifies you for 31 NITs, 26 IIITs, 38 GFTIs — and is the first step to JEE Advanced.",
    info: [
      ["Conducted by", "NTA"],
      ["Eligibility", "Class 12 with PCM"],
      ["Attempts", "Both sessions · best score counts"],
      ["Pattern", "75 questions · 300 marks"],
      ["Seats", "~43,600 across NIT + IIIT + GFTI"],
    ],
    link: "/jee-main",
    cta: "Open JEE Main",
  },
];

/* ── Section wrapper ── */
function HomeSection({ id, eyebrow, title, sub, children, bg }) {
  return (
    <section id={id} style={{ padding: "64px 0", background: bg || "transparent", scrollMarginTop: 80 }}>
      <div className="container">
        {(eyebrow || title) && (
          <div className="title-bar" style={{ marginBottom: 36 }}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2 className="section-title">{title}</h2>}
            {sub && <p className="section-sub">{sub}</p>}
          </div>
        )}
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}

/* ── Parallel JEE exam card ── */
function ExamCard({ ex }) {
  const Icon = ex.icon;
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* accent header */}
      <div style={{ background: ex.accent, color: "#fff", padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.16)", display: "grid", placeItems: "center" }}>
            <Icon size={22} color="#fff" />
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 700, padding: "5px 12px", borderRadius: 50, background: "rgba(255,255,255,.18)", color: "#fff" }}>
            {ex.tag}
          </span>
        </div>
        <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 22 }}>{ex.name}</h3>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.78)", marginTop: 4 }}>📅 {ex.date}</div>
      </div>

      {/* body */}
      <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{ex.blurb}</p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {ex.info.map(([k, v], i) => (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 0",
              borderTop: i === 0 ? "none" : "1px solid var(--line)",
            }}>
              <span style={{ fontSize: 13, color: "var(--muted)", display: "flex", alignItems: "center", gap: 7 }}>
                <CheckCircle2 size={14} color={ex.accent} /> {k}
              </span>
              <span style={{ fontSize: 13, color: "var(--navy)", fontWeight: 600, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>

        <Link to={ex.link} style={{
          marginTop: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: ex.accent, color: "#fff", padding: "13px 20px", borderRadius: 12,
          fontSize: 14.5, fontWeight: 700, textDecoration: "none",
        }}>
          {ex.cta} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function Home({ onSearch }) {
  return (
    <>
      {/* ── Hero ── */}
      <Hero onSearch={onSearch} />

      {/* ── Stats bar ── */}
      <section style={{ background: "#1c1c28", padding: "32px 0" }}>
        <div className="container">
          <div className="grid-4" style={{ gap: 16 }}>
            {STATS.map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "rgba(255,255,255,0.06)", borderRadius: 14,
                padding: "16px 20px", border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}22`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon size={22} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 20, color: "#fff" }}>{value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginTop: 2 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Predictor Cards ── */}
      <PredictorCards />

      {/* ── JEE Main & Advanced (parallel) ── */}
      <HomeSection
        eyebrow="Exams 2026"
        title="JEE Main & JEE Advanced — choose your path"
        bg="var(--sky)"
        sub="Two exams, two doors to the top engineering colleges. Tap either to open its full guide, rank predictor and real cutoffs."
      >
        <div className="grid-2" style={{ gap: 24, alignItems: "stretch" }}>
          {EXAMS.map((ex) => <ExamCard key={ex.key} ex={ex} />)}
        </div>

        {/* quick comparison strip */}
        <div className="card" style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-around", textAlign: "center", padding: "20px 24px" }}>
          {[
            ["1", "Clear JEE Main", "Qualify for NIT/IIIT/GFTI seats"],
            ["2", "Top 2.5L → Advanced", "Become eligible for the IITs"],
            ["3", "Clear JEE Advanced", "Get into one of the 23 IITs"],
          ].map(([n, t, s]) => (
            <div key={n} style={{ flex: "1 1 200px", minWidth: 180 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--coral)", color: "#fff", fontFamily: "Sora", fontWeight: 800, display: "grid", placeItems: "center", margin: "0 auto 8px" }}>{n}</div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)", fontSize: 14.5 }}>{t}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{s}</div>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* ── Seat Distribution Chart ── */}
      <HomeSection eyebrow="Seat Matrix" title="Total Seats Available (JoSAA 2025)"
        sub="Approximate seat distribution across IITs, NITs, IIITs and GFTIs via JoSAA counselling.">
        <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 16 }}>Seat distribution by institute type</h4>
            <CenterDonut
              data={SEAT_DATA}
              centerLabel="60K+"
              centerSub="total seats"
              colors={["#F97316", "#0EA5A4", "#15a06e", "#1c1c28"]}
              height={260}
              fmt={(v) => v.toLocaleString("en-IN")}
            />
          </div>
          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 16 }}>Branch-wise demand index</h4>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Higher index = more competitive cutoffs across top institutes.</p>
            <Bars
              data={BRANCH_DEMAND}
              bars={[{ key: "value", label: "Demand Index", color: "#F97316" }]}
              height={260}
            />
          </div>
        </div>
      </HomeSection>

      {/* ── New Tools ── */}
      <NewTools />

      {/* ── Application Radar ── */}
      <ApplicationRadar />

      {/* ── Entrance Exams ── */}
      <EntranceExams />

      {/* ── Top Colleges ── */}
      <TopColleges />

      {/* ── Private Universities ── */}
      <PrivateUniversities />

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── News ── */}
      <NewsSection />
    </>
  );
}