import { useNavigate } from "react-router-dom";
import { Gauge, Crosshair, Building2, ArrowRight } from "lucide-react";
import { CenterDonut } from "../Charts.jsx";
import Reveal from "../Reveal.jsx";

const CARDS = [
  {
    icon: Gauge, title: "Rank Predictor", accent: "#F97316",
    desc: "Enter your expected marks and instantly see your projected JEE Main rank, percentile and category rank.",
    to: "/jee-main#rank", cta: "Predict Rank",
    donut: { data: [{ name: "Physics", value: 33 }, { name: "Chemistry", value: 33 }, { name: "Maths", value: 34 }], label: "300", sub: "max marks" },
    colors: ["#4361ee", "#2EC4B6", "#F4A261"],
  },
  {
    icon: Crosshair, title: "College Predictor", accent: "#F97316",
    desc: "Turn your rank into a personalised list of colleges — across all JoSAA & CSAB rounds, with packages & placements.",
    to: "/jee-main#college", cta: "Find Colleges",
    donut: { data: [{ name: "Safe", value: 40 }, { name: "Moderate", value: 35 }, { name: "Stretch", value: 25 }], label: "6+2", sub: "JoSAA + CSAB" },
    colors: ["#2EC4B6", "#F4A261", "#F97316"],
  },
  {
    icon: Building2, title: "College Explorer", accent: "#0EA5A4",
    desc: "Deep-dive into IITs, NITs & IIITs — cutoffs, fees, branch-wise placements, recruiters and campus life.",
    to: "/colleges", cta: "Explore Colleges",
    donut: { data: [{ name: "IITs", value: 8 }, { name: "NITs", value: 6 }, { name: "IIITs", value: 3 }], label: "17", sub: "top institutes" },
    colors: ["#0EA5A4", "#0EA5A4", "#2EC4B6"],
  },
];

export default function PredictorCards() {
  const nav = useNavigate();
  return (
    <section className="section">
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">Smart Tools</span>
          <h2 className="section-title">Everything you need, before you fill a single choice</h2>
          <p className="section-sub">Three connected tools that take you from marks → rank → the exact colleges within your reach.</p>
        </div>
        <div className="grid-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ width: 46, height: 46, borderRadius: 12, display: "grid", placeItems: "center", background: `${c.accent}1a`, color: c.accent }}>
                    <c.icon size={24} />
                  </span>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.2rem" }}>{c.title}</h3>
                </div>
                <CenterDonut data={c.donut.data} centerLabel={c.donut.label} centerSub={c.donut.sub} colors={c.colors} height={170} />
                <p style={{ color: "var(--muted)", fontSize: 14, margin: "6px 0 16px" }}>{c.desc}</p>
                <button className="btn full" style={{ marginTop: "auto", justifyContent: "center", background: c.accent, color: "#fff" }} onClick={() => nav(c.to)}>
                  {c.cta} <ArrowRight size={16} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
