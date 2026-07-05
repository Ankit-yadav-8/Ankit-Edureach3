import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gauge, Crosshair, Building2, ArrowRight } from "lucide-react";
import { CenterDonut } from "../Charts.jsx";
import { TiltCard, FloatingOrbs, StaggerReveal, StaggerItem } from "../Animations.jsx";

const CARDS = [
  {
    icon: Gauge, title: "Rank Predictor", accent: "#FF693D",
    gradient: "linear-gradient(135deg, #FF693D, #E0421F)",
    desc: "Enter your expected marks and instantly see your projected JEE Main rank, percentile and category rank.",
    to: "/jee-main#rank", cta: "Predict My Rank",
    donut: { data: [{ name: "Physics", value: 33 }, { name: "Chemistry", value: 33 }, { name: "Maths", value: 34 }], label: "300", sub: "max marks" },
    colors: ["#4361ee", "#2EC4B6", "#F4A261"],
    badge: "98% accuracy",
  },
  {
    icon: Crosshair, title: "College Predictor", accent: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
    desc: "Turn your rank into a personalised list of colleges — across all JoSAA & CSAB rounds, with packages & placements.",
    to: "/jee-main#college", cta: "Find My Colleges",
    donut: { data: [{ name: "Safe", value: 40 }, { name: "Moderate", value: 35 }, { name: "Ambitious", value: 25 }], label: "6+2", sub: "JoSAA + CSAB" },
    colors: ["#2EC4B6", "#6366f1", "#FF693D"],
    badge: "850+ colleges",
  },
  {
    icon: Building2, title: "College Explorer", accent: "#0EA5A4",
    gradient: "linear-gradient(135deg, #0ea5a4, #0891b2)",
    desc: "Deep-dive into IITs, NITs & IIITs — cutoffs, fees, branch-wise placements, recruiters and campus life.",
    to: "/colleges", cta: "Explore Colleges",
    donut: { data: [{ name: "IITs", value: 23 }, { name: "NITs", value: 31 }, { name: "IIITs", value: 26 } ], label: "80+", sub: "institutes" },
    colors: ["#FF693D", "#0EA5A4", "#6366f1"],
    badge: "Real cutoffs",
  },
];

export default function PredictorCards() {
  const nav = useNavigate();
  return (
    <section className="section" style={{ background: "linear-gradient(160deg, #ffffff 0%, #ffffff 40%, #ffffff 100%)", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          className="title-bar"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <span className="eyebrow" style={{ background: "rgba(255, 105, 61,.1)", border: "1px solid rgba(255, 105, 61,.25)", color: "#FF693D" }}>Smart Tools</span>
          <h2 className="section-title" style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", color: "#1a1a2e", letterSpacing: "-1.5px" }}>
            Everything you need, <span style={{ background: "linear-gradient(90deg,#FF693D,#E0421F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>before you fill a single choice</span>
          </h2>
          <p className="section-sub" style={{ color: "#4b5563" }}>Three connected tools: marks → rank → the exact colleges within your reach.</p>
        </motion.div>

        <StaggerReveal stagger={0.1} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, position: "relative", zIndex: 1 }}>
          {CARDS.map((c, i) => (
            <StaggerItem key={c.title}>
            <TiltCard
              intensity={8}
              style={{ height: "100%" }}
            >
            <motion.div
              style={{
                background: "var(--page-bg)",
                borderRadius: 18,
                border: "1px solid rgba(0,0,0,.08)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 20px rgba(28,28,40,.07)",
                cursor: "pointer",
                height: "100%",
              }}
              whileHover={{ boxShadow: `0 24px 60px ${c.accent}22` }}
              onClick={() => nav(c.to)}
            >
              {/* Gradient header */}
              <div style={{
                background: c.gradient,
                padding: "20px 20px 16px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.2)", display: "grid", placeItems: "center" }}>
                    <c.icon size={22} color="#fff" />
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 50, background: "rgba(255,255,255,.2)", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                    {c.badge}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>{c.title}</h3>
              </div>

              {/* Chart */}
              <div style={{ padding: "4px 16px 0" }}>
                <CenterDonut data={c.donut.data} centerLabel={c.donut.label} centerSub={c.donut.sub} colors={c.colors} height={155} />
              </div>

              {/* Description + CTA */}
              <div style={{ padding: "8px 20px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
                <button
                  style={{
                    marginTop: "auto",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    background: c.gradient, color: "#fff",
                    border: "none", borderRadius: 11, padding: "11px 16px",
                    fontSize: 13.5, fontWeight: 700, fontFamily: "'Space Grotesk','Sora',sans-serif",
                    cursor: "pointer",
                  }}
                  onClick={() => nav(c.to)}
                >
                  {c.cta} <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
            </TiltCard>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
