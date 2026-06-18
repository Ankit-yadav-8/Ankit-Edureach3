import { useNavigate } from "react-router-dom";
import { Calculator, ListChecks, Map, Sparkles, ArrowRight, Rocket } from "lucide-react";
import { TiltCard, StaggerReveal, StaggerItem } from "../Animations.jsx";

const TOOLS = [
  {
    icon: Calculator, accent: "#F15A38", badge: "NEW",
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
    <section className="section" style={{ background: "linear-gradient(160deg, #ffffff 0%, #ffffff 40%, #ffffff 100%)", position: "relative", overflow: "hidden" }}>
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow"><Rocket size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} /> Just launched</span>
          <h2 className="section-title" style={{ color: "#1a1a2e" }}>Powerful new tools for <span className="accent">smarter decisions</span></h2>
          <p className="section-sub" style={{ color: "#4b5563" }}>From financial planning to personalised college lists — new features to help you decide better.</p>
        </div>

        <StaggerReveal stagger={0.09} className="grid-4" style={{ gap: 20 }}>
          {TOOLS.map((t, i) => (
            <StaggerItem key={t.title}>
            <TiltCard intensity={10} style={{ height: "100%" }}>
              <div className="card tool-card hover-glow" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span className="float-y" style={{ width: 48, height: 48, borderRadius: 13, display: "grid", placeItems: "center", background: `${t.accent}16`, border: `1.5px solid ${t.accent}28` }}>
                    <t.icon size={23} color={t.accent} />
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", color: "#fff", background: t.accent, padding: "3px 9px", borderRadius: 999 }}>{t.badge}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#1a1a2e", marginBottom: 7, letterSpacing: "-0.2px" }}>{t.title}</h3>
                  <p style={{ color: "#6b7280", lineHeight: 1.55, fontSize: 14 }}>{t.desc}</p>
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
            </TiltCard>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
