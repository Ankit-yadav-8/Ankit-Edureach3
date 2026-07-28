import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gauge, Crosshair, Map, GraduationCap,
  GitCompareArrows, Layers, Sparkles,
} from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const TOOLS = [
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
    icon: Layers, title: "Branch Insights Hub", accent: "#FF693D",
    desc: "Deep dive into 15+ clear engineering domains, exploring future career prospects, salaries, and real-world applications.",
    bullets: ["Future-proof career analysis", "In-depth curriculum breakdown", "Salary trends & hiring insights"],
    to: "/branches", live: true, hot: false,
  },
  {
    icon: GitCompareArrows, title: "Trade-off Analyzer", accent: "#FF693D",
    desc: "Stuck between a top-tier college or your preferred branch? Take our quick assessment to find your ideal path forward.",
    bullets: ["Personalized priority quiz", "Data-backed trade-off analysis", "Clear actionable recommendations"],
    to: "/branch-vs-college", live: true, hot: true,
  },
  {
    icon: Map, title: "Campus Map Explorer", accent: "#FF693D",
    desc: "Explore every IIT, NIT and IIIT on an interactive map — filter by state, type and ranking.",
    bullets: ["80+ institutes mapped", "State & type filters", "Cutoff & placement drawers"],
    to: "/map", live: true,
  },
  {
    icon: GraduationCap, title: "JEE 2027 Mentorship", accent: "#FF693D",
    desc: "1-on-1 mentorship from IITians for JEE 2027 aspirants — daily targets, doubt solving and weekly test analysis.",
    bullets: ["1-on-1 IITian mentor", "Daily targets & doubt solving", "Weekly test analysis"],
    to: "/mentorship/jee-2027", live: true, hot: true,
  },
  // No Mentor Dashboard card here. This grid is the student-facing toolkit and
  // renders on the home page; a staff sign-in isn't a tool they can use. It
  // stays listed in the Navbar's Tools menu, which is where mentors look.
];

const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function ToolCard({ t, nav }) {
  const [isHovered, setIsHovered] = useState(false);
  const badgeColor = t.hot ? "#F47B20" : "#1F8A5F"; 
  const badgeText = t.hot ? "NEW" : "LIVE";
  const iconColor = t.accent; 
  
  const shadowDark = "var(--shadow-dark, #CBC3B0)";
  const shadowLight = "var(--shadow-light, #FFFFFF)";

  return (
    <motion.button
      variants={itemV}
      onClick={() => nav(t.to)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "var(--base, #EEEBE4)",
        border: "none",
        borderRadius: 26,
        padding: "30px 28px 32px",
        boxShadow: isHovered 
          ? `14px 14px 28px ${shadowDark}, -14px -14px 28px ${shadowLight}` 
          : `10px 10px 22px ${shadowDark}, -10px -10px 22px ${shadowLight}`,
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow .25s ease, transform .25s ease",
        cursor: "pointer",
        textAlign: "left",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, width: "100%" }}>
        <div style={{ 
          width: 52, 
          height: 52, 
          borderRadius: 16, 
          background: isHovered ? iconColor : `${iconColor}15`, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: isHovered ? "#ffffff" : iconColor,
          boxShadow: isHovered ? "none" : `5px 5px 10px ${iconColor}30, -5px -5px 10px #FFFFFF`,
          transition: "all 0.3s ease"
        }}>
          <t.icon size={24} strokeWidth={1.8} />
        </div>
        {t.live && (
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 5, 
            background: t.hot ? `${iconColor}15` : `#E1F3EA`, 
            color: badgeColor, 
            padding: "5px 11px", 
            borderRadius: 999, 
            fontFamily: "'Inter', sans-serif",
            fontSize: 10, 
            fontWeight: 700,
            letterSpacing: "0.5px",
            boxShadow: t.hot ? `inset 1px 1px 2px ${iconColor}25` : `inset 1px 1px 2px rgba(31,138,95,0.15)`
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: badgeColor }}></span>
            {badgeText}
          </div>
        )}
      </div>

      <h3 style={{ 
        fontFamily: "'Outfit', sans-serif", 
        fontSize: 18.5, 
        fontWeight: 700, 
        color: "var(--text, #241F18)", 
        margin: "0 0 10px 0",
      }}>
        {t.title}
      </h3>
      <p style={{ 
        color: "var(--text-soft, #6E6656)", 
        fontSize: 13.5, 
        lineHeight: 1.65, 
        margin: "0 0 20px 0",
      }}>
        {t.desc}
      </p>

      <ul style={{ 
        listStyle: "none", 
        padding: "16px 0 0", 
        margin: "auto 0 0", 
        borderTop: "1px solid rgba(198,190,172,0.4)",
        display: "flex", 
        flexDirection: "column", 
        gap: 9 
      }}>
        {t.bullets.map((b) => (
          <li key={b} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "var(--text, #241F18)", fontWeight: 500 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: iconColor, flexShrink: 0, boxShadow: `0 0 0 3px ${iconColor}20` }} />
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
    <section id="tools" style={{ background: "var(--base)", padding: "80px 0" }}>
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

        {/* Cards Grid — 3 per row, dropping to 2 then 1 on smaller screens */}
        <style>{`
          .tools-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
          @media (max-width: 900px) { .tools-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 600px) { .tools-grid { grid-template-columns: 1fr; } }
        `}</style>
        <motion.div
          className="tools-grid"
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {TOOLS.map((t) => <ToolCard key={t.title} t={t} nav={nav} />)}
        </motion.div>
      </div>
    </section>
  );
}
