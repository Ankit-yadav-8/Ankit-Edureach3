import { useNavigate } from "react-router-dom";
import { Calculator, ListChecks, Map, Sparkles, ArrowRight, Rocket } from "lucide-react";
import Reveal from "../Reveal.jsx";

const TOOLS = [
  {
    icon: Calculator, accent: "#f97316", badge: "NEW",
    title: "ROI Calculator",
    desc: "Calculate total degree cost, EMI, scholarship savings & long-term return.",
    cta: "Calculate ROI", to: "/scholarships",
  },
  {
    icon: ListChecks, accent: "#0ea5a4", badge: "NEW",
    title: "Choice Filling Helper",
    desc: "Smart JoSAA choice order based on your rank, category & branch preferences.",
    cta: "Fill Choices", to: "/planner",
  },
  {
    icon: Map, accent: "#15803d", badge: "NEW",
    title: "College Map View",
    desc: "Explore all IITs, NITs & IIITs on an interactive map. Filter by state & type.",
    cta: "Open Map", to: "/map",
  },
  {
    icon: Sparkles, accent: "#d97706", badge: "NEW",
    title: "Colleges for You",
    desc: "Answer a couple of questions and get a personalised college shortlist instantly.",
    cta: "Get My List", to: "/for-you",
  },
];

export default function NewTools() {
  const nav = useNavigate();
  return (
    <section className="section section--sky">
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow"><Rocket size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} /> Just launched</span>
          <h2 className="section-title">Powerful new tools for <span className="accent">smarter decisions</span></h2>
          <p className="section-sub">From financial planning to personalised college lists — new features to help you decide better.</p>
        </div>

        <div className="grid-4" style={{ gap: 20 }}>
          {TOOLS.map((t, i) => (
            <Reveal key={t.title} delay={(i % 4) * 0.06}>
              <div className="card tool-card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ width: 46, height: 46, borderRadius: 13, display: "grid", placeItems: "center", background: `${t.accent}1a` }}>
                    <t.icon size={23} color={t.accent} />
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", color: "#fff", background: t.accent, padding: "3px 9px", borderRadius: 999 }}>{t.badge}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.12rem", color: "var(--navy)", marginBottom: 7 }}>{t.title}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>{t.desc}</p>
                </div>
                <button
                  onClick={() => nav(t.to)}
                  className="btn"
                  onMouseEnter={(e) => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.accent; }}
                  style={{
                    marginTop: "auto", width: "100%", justifyContent: "center", fontSize: 14, fontWeight: 700,
                    background: "transparent", color: t.accent, border: `1.6px solid ${t.accent}`,
                  }}
                >
                  {t.cta} <ArrowRight size={16} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
