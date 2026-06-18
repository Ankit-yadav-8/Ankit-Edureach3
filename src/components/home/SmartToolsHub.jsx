/* SmartToolsHub — merged "Smart Tools" + "New Tools" into one section.
   Desktop: auto-rotates between the two named groups (shows a set of cards,
   then replaces it with the next). Mobile: timeline-style named buttons —
   tap a button to show that group's cards. Card styles are unchanged. */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gauge, Crosshair, Building2, ArrowRight, Rocket, Sparkles,
  Calculator, ListChecks, Map,
} from "lucide-react";
import { CenterDonut } from "../Charts.jsx";
import { TiltCard } from "../Animations.jsx";

/* ── Group 1: predictor tools (gradient + donut cards) ── */
const PREDICTOR_CARDS = [
  {
    icon: Gauge, title: "Rank Predictor", accent: "#F15A38",
    gradient: "linear-gradient(135deg, #F15A38, #E0421F)",
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
    colors: ["#2EC4B6", "#6366f1", "#F15A38"],
    badge: "850+ colleges",
  },
  {
    icon: Building2, title: "College Explorer", accent: "#0EA5A4",
    gradient: "linear-gradient(135deg, #0ea5a4, #0891b2)",
    desc: "Deep-dive into IITs, NITs & IIITs — cutoffs, fees, branch-wise placements, recruiters and campus life.",
    to: "/colleges", cta: "Explore Colleges",
    donut: { data: [{ name: "IITs", value: 23 }, { name: "NITs", value: 31 }, { name: "IIITs", value: 26 }], label: "80+", sub: "institutes" },
    colors: ["#F15A38", "#0EA5A4", "#6366f1"],
    badge: "Real cutoffs",
  },
];

/* ── Group 2: newly launched tools (simple cards) ── */
const NEW_TOOLS = [
  { icon: Calculator, accent: "#F15A38", badge: "NEW", title: "ROI Calculator",       desc: "Calculate total degree cost, EMI, scholarship savings & long-term return.",        cta: "Calculate ROI", to: "/scholarships" },
  { icon: ListChecks, accent: "#0ea5a4", badge: "NEW", title: "Choice Filling Helper", desc: "Smart JoSAA choice order based on your rank, category & branch preferences.",       cta: "Fill Choices",  to: "/planner" },
  { icon: Map,        accent: "#15803d", badge: "NEW", title: "College Map View",      desc: "Explore all IITs, NITs & IIITs on an interactive map. Filter by state & type.",     cta: "Open Map",      to: "/map" },
  { icon: Sparkles,   accent: "#d97706", badge: "NEW", title: "Colleges for You",      desc: "Answer a couple of questions and get a personalised college shortlist instantly.",   cta: "Get My List",   to: "/for-you" },
];

const GROUPS = [
  { key: "predict", label: "Predictor Tools", icon: Gauge,  type: "donut",  cards: PREDICTOR_CARDS },
  { key: "new",     label: "New Tools",       icon: Rocket, type: "simple", cards: NEW_TOOLS },
];

const ROTATE_MS = 6000;

const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const itemV = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/* ── gradient + donut card (Smart Tools style) ── */
function DonutCard({ c, nav }) {
  return (
    <TiltCard intensity={8} style={{ height: "100%" }}>
      <motion.div
        style={{
          background: "#fff", borderRadius: 18, border: "1px solid rgba(0,0,0,.08)",
          overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 4px 20px rgba(28,28,40,.07)", cursor: "pointer", height: "100%",
        }}
        whileHover={{ boxShadow: `0 24px 60px ${c.accent}22` }}
        onClick={() => nav(c.to)}
      >
        <div style={{ background: c.gradient, padding: "20px 20px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.2)", display: "grid", placeItems: "center" }}>
              <c.icon size={22} color="#fff" />
            </div>
            <span style={{ padding: "3px 10px", borderRadius: 50, background: "rgba(255,255,255,.2)", color: "#fff", fontSize: 11, fontWeight: 700 }}>{c.badge}</span>
          </div>
          <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>{c.title}</h3>
        </div>

        <div style={{ padding: "4px 16px 0" }}>
          <CenterDonut data={c.donut.data} centerLabel={c.donut.label} centerSub={c.donut.sub} colors={c.colors} height={155} />
        </div>

        <div style={{ padding: "8px 20px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
          <button
            style={{
              marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              background: c.gradient, color: "#fff", border: "none", borderRadius: 11, padding: "11px 16px",
              fontSize: 13.5, fontWeight: 700, fontFamily: "'Space Grotesk','Sora',sans-serif", cursor: "pointer",
            }}
            onClick={(e) => { e.stopPropagation(); nav(c.to); }}
          >
            {c.cta} <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ── simple icon card (New Tools style) ── */
function SimpleCard({ t, nav }) {
  return (
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
          style={{ marginTop: "auto", width: "100%", justifyContent: "center", fontSize: 14, fontWeight: 700, background: "transparent", color: t.accent, border: `1.6px solid ${t.accent}` }}
        >
          {t.cta} <ArrowRight size={16} />
        </button>
      </div>
    </TiltCard>
  );
}

export default function SmartToolsHub() {
  const nav = useNavigate();
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  /* Auto-rotate between groups on desktop; on mobile it's button-driven. */
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 860px)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % GROUPS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [active]);

  const group = GROUPS[active];

  return (
    <section
      id="tools"
      className="section"
      style={{ background: "linear-gradient(160deg, #ffffff 0%, #ffffff 40%, #ffffff 100%)", position: "relative", overflow: "hidden", scrollMarginTop: 80 }}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <motion.div
          className="title-bar"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow" style={{ background: "rgba(244,123,32,.1)", border: "1px solid rgba(244,123,32,.25)", color: "#F15A38" }}>
            <Sparkles size={12} style={{ marginRight: 5, verticalAlign: "-2px" }} /> Smart Tools
          </span>
          <h2 className="section-title" style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", color: "#1a1a2e", letterSpacing: "-1.5px" }}>
            Everything you need, <span style={{ background: "linear-gradient(90deg,#F15A38,#E0421F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>in one toolkit</span>
          </h2>
          <p className="section-sub" style={{ color: "#4b5563" }}>From rank prediction to personalised college lists — pick a set and dive in.</p>
        </motion.div>

        {/* ── Named group buttons (timeline strategy) ── */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 34 }}>
          {GROUPS.map((g, i) => {
            const on = i === active;
            const Icon = g.icon;
            return (
              <button
                key={g.key}
                onClick={() => setActive(i)}
                aria-pressed={on}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 9,
                  padding: "11px 22px", borderRadius: 50, cursor: "pointer",
                  fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 14.5,
                  border: on ? "1.5px solid transparent" : "1.5px solid rgba(244,123,32,.3)",
                  background: on ? "linear-gradient(135deg,#F15A38,#E0421F)" : "#fff",
                  color: on ? "#fff" : "#c2410c",
                  boxShadow: on ? "0 10px 24px -8px rgba(244,123,32,.6)" : "0 2px 10px rgba(0,0,0,.05)",
                  transition: "all .25s",
                }}
              >
                <Icon size={16} /> {g.label}
                <span style={{
                  minWidth: 22, height: 22, padding: "0 7px", borderRadius: 50,
                  display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800,
                  background: on ? "rgba(255,255,255,.25)" : "rgba(244,123,32,.12)",
                  color: on ? "#fff" : "#F15A38",
                }}>
                  {g.cards.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Cards for the active group (animate in, then swap) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={group.key}
            variants={containerV}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, position: "relative", zIndex: 1 }}
          >
            {group.type === "donut"
              ? group.cards.map((c) => (
                  <motion.div key={c.title} variants={itemV} style={{ height: "100%" }}>
                    <DonutCard c={c} nav={nav} />
                  </motion.div>
                ))
              : group.cards.map((t) => (
                  <motion.div key={t.title} variants={itemV} style={{ height: "100%" }}>
                    <SimpleCard t={t} nav={nav} />
                  </motion.div>
                ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
