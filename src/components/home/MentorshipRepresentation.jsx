import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Users, Calendar, TrendingUp, ArrowRight, Sparkles, MessageCircle, FileText } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const FEATURES = [
  {
    icon: Users,
    title: "1-on-1 Expert Mentor",
    desc: "Get paired with an IITian or Top Medical College student who has cleared the exam you're preparing for."
  },
  {
    icon: Target,
    title: "Daily Micro-Targets",
    desc: "No more feeling lost. Wake up to a clear, actionable study plan tailored to your current level and syllabus."
  },
  {
    icon: TrendingUp,
    title: "Weekly Test Analysis",
    desc: "We don't just take tests; we dissect them. Understand your weak areas and get a strategy to improve."
  },
  {
    icon: Calendar,
    title: "Backlog Clearance Plan",
    desc: "Struggling with 11th class backlog? Your mentor will integrate backlog clearance seamlessly into your schedule."
  },
  {
    icon: MessageCircle,
    title: "Live Doubt Solving",
    desc: "Weekly Google Meets and immediate doubt solving on WhatsApp directly with your mentor."
  },
  {
    icon: FileText,
    title: "Weekly Reports",
    desc: "Get detailed weekly progress reports to track your performance and stay accountable."
  }
];

const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const itemV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function MentorshipRepresentation() {
  const nav = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section style={{ background: CL.cream, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Header Area */}
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 50px" }}>
          <span style={clEyebrow}>
            <Sparkles size={13} /> Premium Mentorship
          </span>
          <h2 style={{ 
            fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.7rem)", 
            color: CL.ink, letterSpacing: "-1px", margin: "16px 0 12px", lineHeight: 1.12 
          }}>
            Don't prepare alone. <br/>
            <span style={{ color: CL.coral }}>Get an IITian Mentor.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            Unlock your true potential with personalized guidance. Our mentors have walked the path and know exactly what it takes to crack JEE & NEET with top ranks.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 50 }}
        >
          {FEATURES.map((feat, idx) => (
            <motion.div 
              key={idx}
              variants={itemV}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              style={{
                background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`,
                boxShadow: CL.shadow, display: "flex", flexDirection: "column", gap: 16,
                padding: "26px", textAlign: "left"
              }}
            >
              <div style={{ 
                width: 52, height: 52, borderRadius: 14, 
                background: CL.coralSoft, display: "flex", alignItems: "center", justifyContent: "center", 
                color: CL.coralDk
              }}>
                <feat.icon size={24} strokeWidth={2} />
              </div>
              <div>
                <h3 style={{ fontFamily: CL.display, fontSize: 19, fontWeight: 800, color: CL.ink, marginBottom: 8, letterSpacing: "-0.3px" }}>
                  {feat.title}
                </h3>
                <p style={{ color: CL.body, fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Area (Neumorphic Button) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}
        >
          <button
            onClick={() => nav("/mentorship")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 12, cursor: "pointer",
              padding: "18px 42px", borderRadius: 999,
              background: "#FF5A36", border: "none", color: "#fff",
              fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 700, fontSize: 16,
              boxShadow: isHovered 
                ? `6px 6px 16px rgba(255,90,54,0.35), -6px -6px 16px #FFFFFF`
                : `4px 4px 12px rgba(255,90,54,0.3), -4px -4px 12px #FFFFFF`, 
              transition: "all .3s ease",
              transform: isHovered ? "translateY(-3px)" : "translateY(0)"
            }}
          >
            Explore Mentorship Plans
            <ArrowRight size={20} />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
