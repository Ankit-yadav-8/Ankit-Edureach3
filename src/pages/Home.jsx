import Hero from "../components/home/Hero.jsx";
import PredictorCards from "../components/home/PredictorCards.jsx";
import NewTools from "../components/home/NewTools.jsx";
import ApplicationRadar from "../components/home/ApplicationRadar.jsx";
import EntranceExams from "../components/home/EntranceExams.jsx";
import TopColleges from "../components/home/TopColleges.jsx";
import PrivateUniversities from "../components/home/PrivateUniversities.jsx";
import NewsSection from "../components/home/NewsSection.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import { Trend, Bars, CenterDonut } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import { TrendingUp, Users, BookOpen, Award, ArrowRight, Zap, Target, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

/* ── Inline chart data ── */
const SEAT_DATA = [
  { name: "IITs",   value: 17385 },
  { name: "NITs",   value: 23954 },
  { name: "IIITs",  value: 7402  },
  { name: "GFTIs",  value: 12280 },
];

const CUTOFF_TREND = [
  { year: 2021, IIT: 87,  NIT: 72, IIIT: 68 },
  { year: 2022, IIT: 88,  NIT: 74, IIIT: 70 },
  { year: 2023, IIT: 90,  NIT: 76, IIIT: 72 },
  { year: 2024, IIT: 93,  NIT: 78, IIIT: 75 },
  { year: 2025, IIT: 95,  NIT: 80, IIIT: 77 },
];

const BRANCH_DEMAND = [
  { name: "CSE",          value: 98 },
  { name: "ECE",          value: 84 },
  { name: "Mech",         value: 72 },
  { name: "Civil",        value: 58 },
  { name: "Chem Engg",    value: 54 },
  { name: "EE",           value: 80 },
];

const STATS = [
  { label: "Students helped",    value: "2.4L+",   icon: Users,      color: "#F97316", bg: "#fff7f0" },
  { label: "Colleges listed",    value: "850+",    icon: BookOpen,   color: "#0EA5A4", bg: "#f0fdfc" },
  { label: "Rank predictions",   value: "98% acc", icon: Target,     color: "#7C3AED", bg: "#faf5ff" },
  { label: "Cutoff data points", value: "1.2M+",   icon: BarChart3,  color: "#EC4899", bg: "#fdf2f8" },
];

const EXAM_QUICK = [
  {
    name: "JEE Advanced 2026",
    badge: "IIT Admission", badgeColor: "#7C3AED",
    date: "May 18, 2026",
    details: ["Paper 1: 9AM–12PM", "Paper 2: 2:30–5:30PM", "~1.8 lakh appear"],
    link: "/jee-advanced",
    color: "#7C3AED",
  },
  {
    name: "JEE Main 2026",
    badge: "NIT / IIIT / GFTI", badgeColor: "#F97316",
    date: "Session 1: Jan · Session 2: Apr",
    details: ["75 Questions · 300 Marks", "Best of 2 sessions", "~13 lakh appear"],
    link: "/jee-main",
    color: "#F97316",
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

export default function Home({ onSearch }) {
  return (
    <>
      {/* ── Hero ── */}
      <Hero onSearch={onSearch} />

      {/* ── Stats bar ── */}
      <section style={{ background: "#1c1c28", padding: "32px 0" }}>
        <div className="container">
          <div className="grid-4" style={{ gap: 16 }}>
            {STATS.map(({ label, value, icon: Icon, color, bg }) => (
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

      {/* ── Exam Quick Overview ── */}
      <HomeSection eyebrow="Exams 2026" title="JEE Main & Advanced — At a Glance" bg="var(--sky)"
        sub="Everything you need to know about both exams before you start predicting.">
        <div className="grid-2" style={{ gap: 24 }}>
          {EXAM_QUICK.map((exam) => (
            <div key={exam.name} className="card" style={{ borderTop: `4px solid ${exam.color}`, padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 50,
                  background: `${exam.badgeColor}18`, color: exam.badgeColor,
                }}>{exam.badge}</span>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>📅 {exam.date}</span>
              </div>
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 20, marginBottom: 14, color: exam.color }}>{exam.name}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {exam.details.map((d) => (
                  <div key={d} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                    <Zap size={13} color={exam.color} />
                    <span style={{ color: "var(--navy)" }}>{d}</span>
                  </div>
                ))}
              </div>
              <Link to={exam.link} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: exam.color, color: "#fff",
                padding: "10px 20px", borderRadius: 50, fontSize: 13, fontWeight: 700,
                textDecoration: "none",
              }}>
                Predict Now <ArrowRight size={14} />
              </Link>
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
              colors={["#F97316", "#0EA5A4", "#7C3AED", "#EC4899"]}
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

      {/* ── Cutoff Trend Chart ── */}
      <HomeSection eyebrow="5-Year Analysis" title="Qualifying Cutoff Trend (2021–2025)"
        bg="var(--sky)"
        sub="How the qualifying percentile for IITs, NITs and IIITs has moved over 5 years. Plan accordingly.">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h4 style={{ fontFamily: "Sora", fontWeight: 700 }}>Qualifying percentile by institute type</h4>
              <p style={{ fontSize: 12, color: "var(--muted)" }}>General category — JEE Main qualifying cutoff</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[["IIT", "#1c1c28"], ["NIT", "#F97316"], ["IIIT", "#0EA5A4"]].map(([label, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
                  <span style={{ color: "var(--navy)", fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <Trend
            data={CUTOFF_TREND}
            lines={[
              { key: "IIT",  label: "IIT cutoff",  color: "#1c1c28" },
              { key: "NIT",  label: "NIT cutoff",  color: "#F97316" },
              { key: "IIIT", label: "IIIT cutoff", color: "#0EA5A4" },
            ]}
            height={300}
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12, textAlign: "center" }}>
            ⚠️ Cutoffs are illustrative. Verify on josaa.nic.in before making decisions.
          </p>
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