/* ToolsGrid — campusloom-style tools section.
   White cards on a warm cream surface: soft icon tile, LIVE badge,
   description and a bullet list of sub-features. Replaces the old
   auto-rotating SmartToolsHub on the home page. */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Gauge, Crosshair, BarChart3, BookOpen, Map, ListChecks,
  GitCompareArrows, Layers, ArrowRight, Sparkles,
} from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const TOOLS = [
  {
    icon: Gauge, title: "Rank Predictor",
    desc: "Enter your expected marks and instantly project your JEE Main rank, percentile and category rank.",
    bullets: ["Marks → percentile → CRL", "Category & home-state ranks", "Session-wise normalisation"],
    to: "/jee-main#rank", live: true,
  },
  {
    icon: Crosshair, title: "JoSAA Predictor",
    desc: "Map your rank against previous years' cutoffs for IITs, NITs, IIITs and GFTIs in one shot.",
    bullets: ["High / Medium probability tags", "All JoSAA + CSAB rounds", "Branch & quota filters"],
    to: "/jee-main#college", live: true,
  },
  {
    icon: BarChart3, title: "Advanced Analysis",
    desc: "Personalised exam blueprinting and weightage breakdowns built around your target scorecard.",
    bullets: ["Interactive score slider", "2021–2025 question maps", "Priority checklist recommendations"],
    to: "/cutoffs", live: true,
  },
  {
    icon: Layers, title: "Branch Catalog",
    desc: "220+ branches bucketed into 10 clear paths — salaries, AI outlook, placements and common myths.",
    bullets: ["10 domain paths, deep insights", "5-year salary arcs & charts", "Myth-vs-reality breakdowns"],
    to: "/branches", live: true, hot: true,
  },
  {
    icon: GitCompareArrows, title: "Branch vs College",
    desc: "Answer six quick questions and find out whether the institute or the branch should win for you.",
    bullets: ["6-question fit assessment", "College-first vs branch-first verdict", "Personalised next steps"],
    to: "/branch-vs-college", live: true, hot: true,
  },
  {
    icon: BookOpen, title: "Study Resources",
    desc: "Chapter-wise notes, revision guides and cheat sheets across Maths, Physics and Chemistry.",
    bullets: ["73 chapters mapped", "Main vs Advanced coverage", "Difficulty-rated topics"],
    to: "/jee-resources", live: true,
  },
  {
    icon: Map, title: "College Map View",
    desc: "Explore every IIT, NIT and IIIT on an interactive map — filter by state, type and ranking.",
    bullets: ["80+ institutes mapped", "State & type filters", "Cutoff & placement drawers"],
    to: "/map", live: true,
  },
  {
    icon: ListChecks, title: "Choice-Filling Helper",
    desc: "A smart, rank-aware JoSAA choice order built around your category and branch preferences.",
    bullets: ["Safe / Moderate / Reach mix", "Float, Slide & Upgrade guidance", "Printable export list"],
    to: "/planner", live: true,
  },
];

const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function ToolCard({ t, nav }) {
  return (
    <motion.button
      variants={itemV}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      onClick={() => nav(t.to)}
      style={{
        textAlign: "left", cursor: "pointer", width: "100%", height: "100%",
        background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`,
        boxShadow: CL.shadow, padding: "26px 24px 24px",
        display: "flex", flexDirection: "column", position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <span style={{ width: 46, height: 46, borderRadius: 13, background: CL.coralSoft, display: "grid", placeItems: "center" }}>
          <t.icon size={22} color={CL.coral} />
        </span>
        {t.live && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 10, fontWeight: 800, letterSpacing: ".06em",
            color: t.hot ? CL.coralDk : "#0a8f5b",
            background: t.hot ? CL.coralSoft : CL.greenSoft,
            padding: "4px 10px", borderRadius: 50,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.hot ? CL.coral : CL.green }} />
            {t.hot ? "NEW" : "LIVE"}
          </span>
        )}
      </div>

      <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.15rem", color: CL.ink, marginBottom: 9, letterSpacing: "-0.3px" }}>
        {t.title}
      </h3>
      <p style={{ color: CL.body, fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>{t.desc}</p>

      <ul style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {t.bullets.map((b) => (
          <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 12.8, color: CL.ink2 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: CL.coral, marginTop: 6, flexShrink: 0 }} />
            {b}
          </li>
        ))}
      </ul>

      <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 7, color: CL.coralDk, fontWeight: 700, fontSize: 13, fontFamily: CL.display }}>
        Open tool <ArrowRight size={15} />
      </span>
    </motion.button>
  );
}

export default function ToolsGrid() {
  const nav = useNavigate();
  return (
    <section id="tools" style={{ background: CL.cream, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 44px" }}>
          <span style={clEyebrow}><Sparkles size={13} /> Smart Tools</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.7rem)", color: CL.ink, letterSpacing: "-1px", margin: "16px 0 12px", lineHeight: 1.12 }}>
            Everything you need, <span style={{ color: CL.coral }}>in one toolkit.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            From rank prediction to branch deep-dives and personalised college lists — every tool, consistent and built for JEE 2026.
          </p>
        </div>

        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 22 }}
        >
          {TOOLS.map((t) => <ToolCard key={t.title} t={t} nav={nav} />)}
        </motion.div>
      </div>
    </section>
  );
}
