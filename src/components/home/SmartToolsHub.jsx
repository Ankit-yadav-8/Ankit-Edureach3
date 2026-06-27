import { motion } from "framer-motion";
import { Ticket, Gauge, Target, BarChart2, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TOOLS = [
  {
    icon: Ticket,
    title: "Events & fest marketplace",
    desc: "Book hackathons, cultural fests and seminars across colleges — discover what's happening near you.",
    badge: "NEW",
    badgeColor: "#FF693D",
    to: "/campus-fests",
    features: [
      "One-tap ticket booking",
      "Curated, high-impact events",
      "Connect across colleges"
    ]
  },
  {
    icon: Gauge,
    title: "Rank predictor",
    desc: "Enter your expected marks and instantly project your JEE Main rank, percentile and category rank.",
    badge: "LIVE",
    badgeColor: "#22c55e",
    to: "/jee-main#rank",
    features: [
      "Marks → percentile → CRL",
      "Category & home-state ranks",
      "Session-wise normalisation"
    ]
  },
  {
    icon: Target,
    title: "College predictor",
    desc: "Map your rank against previous years' cutoffs for IITs, NITs, IIITs and GFTIs in one shot.",
    badge: "LIVE",
    badgeColor: "#22c55e",
    to: "/jee-main#college",
    features: [
      "High / medium probability tags",
      "All JoSAA + CSAB rounds",
      "Branch & quota filters"
    ]
  },
  {
    icon: BarChart2,
    title: "Official cutoff analysis",
    desc: "Real JoSAA opening & closing ranks with weightage breakdowns built around your target scorecard.",
    badge: "LIVE",
    badgeColor: "#22c55e",
    to: "/colleges",
    features: [
      "Interactive score slider",
      "2021-2025 cutoff history",
      "Priority checklist recommendations"
    ]
  }
];

export default function SmartToolsHub() {
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
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
          gap: 24 
        }}>
          {TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => tool.to && nav(tool.to)}
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
                {/* Card Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ 
                    width: 44, 
                    height: 44, 
                    borderRadius: 12, 
                    background: `${tool.badgeColor}15`, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: tool.badgeColor
                  }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 6, 
                    background: `${tool.badgeColor}10`, 
                    color: tool.badgeColor, 
                    padding: "4px 10px", 
                    borderRadius: 50, 
                    fontSize: 11, 
                    fontWeight: 700 
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: tool.badgeColor }} />
                    {tool.badge}
                  </div>
                </div>

                {/* Card Content */}
                <h3 style={{ 
                  fontFamily: "'Space Grotesk', 'Sora', sans-serif", 
                  fontSize: "1.2rem", 
                  fontWeight: 800, 
                  color: "#1a1a2e", 
                  margin: "0 0 12px 0" 
                }}>
                  {tool.title}
                </h3>
                <p style={{ 
                  color: "#6b7280", 
                  fontSize: "0.95rem", 
                  lineHeight: 1.5, 
                  margin: "0 0 24px 0",
                  flexGrow: 1
                }}>
                  {tool.desc}
                </p>

                {/* Features List */}
                <ul style={{ 
                  listStyle: "none", 
                  padding: 0, 
                  margin: 0, 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 12 
                }}>
                  {tool.features.map((feature, fIdx) => (
                    <li key={fIdx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.9rem", color: "#4b5563" }}>
                      <Check size={16} color="#FF693D" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ lineHeight: 1.4 }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
