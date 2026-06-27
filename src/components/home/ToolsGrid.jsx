import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Gauge, Crosshair, BarChart3, BookOpen, Map, ListChecks,
  GitCompareArrows, Layers, Check, Sparkles, Ticket,
} from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const TOOLS = [
  {
    icon: Ticket, title: "Events & Fest marketplace", accent: "#FF693D",
    desc: "Book hackathons, cultural fests, seminars across colleges. Students discover events nearby.",
    bullets: ["One-tap ticket booking", "Curated, high-impact events", "Connect across colleges"],
    to: "/campus-fests", live: true, hot: true,
  },
  {
    icon: Gauge, title: "Rank Predictor", accent: "#FF693D",
    desc: "Enter your expected marks and instantly project your JEE Main rank, percentile and category rank.",
    bullets: ["Marks → percentile → CRL", "Category & home-state ranks", "Session-wise normalisation"],
    to: "/jee-main#rank", live: true,
  },
  {
    icon: Crosshair, title: "College Predictor", accent: "#FF693D",
    desc: "Map your rank against previous years' cutoffs for IITs, NITs, IIITs and GFTIs in one shot.",
    bullets: ["High / medium probability tags", "All JoSAA + CSAB rounds", "Branch & quota filters"],
    to: "/jee-advanced#college", live: true,
  },
  {
    icon: BarChart3, title: "Official Cutoff Analysis", accent: "#FF693D",
    desc: "Real JoSAA opening & closing ranks with weightage breakdowns built around your target scorecard.",
    bullets: ["Interactive score slider", "2021-2025 cutoff history", "Priority checklist recommendations"],
    to: "/cutoffs", live: true,
  },
  {
    icon: Layers, title: "Branch Explorer", accent: "#FF693D",
    desc: "220+ branches bucketed into 10 clear paths — salaries, AI outlook, placements and common myths.",
    bullets: ["10 domain paths, deep insights", "5-year salary arcs & charts", "Myth-vs-reality breakdowns"],
    to: "/branches", live: true, hot: true,
  },
  {
    icon: GitCompareArrows, title: "Branch vs College", accent: "#FF693D",
    desc: "Answer six quick questions and find out whether the institute or the branch should win for you.",
    bullets: ["6-question fit assessment", "College-first vs branch-first verdict", "Personalised next steps"],
    to: "/branch-vs-college", live: true, hot: true,
  },
  {
    icon: BookOpen, title: "Study Resources", accent: "#FF693D",
    desc: "Chapter-wise notes, revision guides and cheat sheets across Maths, Physics and Chemistry.",
    bullets: ["73 chapters mapped", "Main vs Advanced coverage", "Difficulty-rated topics"],
    to: "/jee-resources", live: true,
  },
  {
    icon: Map, title: "Campus Map Explorer", accent: "#FF693D",
    desc: "Explore every IIT, NIT and IIIT on an interactive map — filter by state, type and ranking.",
    bullets: ["80+ institutes mapped", "State & type filters", "Cutoff & placement drawers"],
    to: "/map", live: true,
  },
  {
    icon: ListChecks, title: "Choice List Planner", accent: "#FF693D",
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
  const badgeColor = t.hot ? "#FF693D" : "#22c55e"; // Orange for NEW, Green for LIVE
  const iconColor = t.accent;

  return (
    <motion.button
      variants={itemV}
      onClick={() => nav(t.to)}
      style={{
        background: "#ffffff",
        border: "1px solid #f0f0f0",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ 
          width: 44, 
          height: 44, 
          borderRadius: 12, 
          background: `${iconColor}15`, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: iconColor
        }}>
          <t.icon size={22} />
        </div>
        {t.live && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 6, 
            background: `${badgeColor}10`, 
            color: badgeColor, 
            padding: "4px 10px", 
            borderRadius: 50, 
            fontSize: 11, 
            fontWeight: 700 
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: badgeColor }} />
            {t.hot ? "NEW" : "LIVE"}
          </div>
        )}
      </div>

      <h3 style={{ 
        fontFamily: "'Space Grotesk', 'Sora', sans-serif", 
        fontSize: "1.2rem", 
        fontWeight: 800, 
        color: "#1a1a2e", 
        margin: "0 0 12px 0" 
      }}>
        {t.title}
      </h3>
      <p style={{ 
        color: "#6b7280", 
        fontSize: "0.95rem", 
        lineHeight: 1.5, 
        margin: "0 0 24px 0",
        flexGrow: 1
      }}>
        {t.desc}
      </p>

      <ul style={{ 
        listStyle: "none", 
        padding: 0, 
        margin: 0, 
        display: "flex", 
        flexDirection: "column", 
        gap: 12 
      }}>
        {t.bullets.map((b) => (
          <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.9rem", color: "#4b5563" }}>
            <Check size={16} color={iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ lineHeight: 1.4 }}>{b}</span>
          </li>
        ))}
      </ul>
    </motion.button>
  );
}

export default function ToolsGrid() {
  const nav = useNavigate();
  return (
    <section id="tools" style={{ background: "#ffffff", padding: "80px 0" }}>
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 6, 
            background: "#fff0eb", 
            color: "#FF693D", 
            padding: "6px 14px", 
            borderRadius: 50, 
            fontSize: 12, 
            fontWeight: 700, 
            letterSpacing: "0.05em",
            marginBottom: 20
          }}>
            <Sparkles size={14} /> SMART TOOLS
          </span>
          <h2 style={{ 
            fontFamily: "'Space Grotesk', 'Sora', sans-serif", 
            fontSize: "2.8rem", 
            fontWeight: 800, 
            color: "#1a1a2e", 
            margin: "0 0 16px 0",
            letterSpacing: "-1px"
          }}>
            Everything you need, <span style={{ color: "#FF693D" }}>in one<br/>toolkit.</span>
          </h2>
          <p style={{ 
            color: "#6b7280", 
            fontSize: "1.1rem", 
            maxWidth: 650, 
            margin: "0 auto", 
            lineHeight: 1.6 
          }}>
            From rank prediction to branch deep-dives and personalised college lists — every tool, consistent and built for JEE 2026.
          </p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}
        >
          {TOOLS.map((t) => <ToolCard key={t.title} t={t} nav={nav} />)}
        </motion.div>
      </div>
    </section>
  );
}
