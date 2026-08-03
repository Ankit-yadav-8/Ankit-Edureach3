import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Users, Calendar, TrendingUp, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

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
  }
];

export default function MentorshipRepresentation() {
  const nav = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const shadowDark = "#DCD6C8";
  const shadowLight = "#FFFFFF";

  return (
    <section style={{ background: "#FFFFFF", padding: "40px 0 80px 0", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        
        <div 
          className="mentorship-rep-card"
          style={{
            background: "#FFFFFF",
            borderRadius: 32,
            padding: "64px",
            boxShadow: `12px 12px 28px ${shadowDark}, -12px -12px 28px ${shadowLight}`,
            display: "flex",
            flexDirection: "column",
            gap: 48,
            border: "1px solid rgba(255,90,54,0.08)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Decorative Background Elements */}
          <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, background: "radial-gradient(circle, rgba(255,90,54,0.04) 0%, rgba(255,255,255,0) 70%)", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: -100, left: -100, width: 250, height: 250, background: "radial-gradient(circle, rgba(255,90,54,0.03) 0%, rgba(255,255,255,0) 70%)", zIndex: 0 }} />

          {/* Header Area */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 18, position: "relative", zIndex: 1 }}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ 
                display: "inline-flex", alignItems: "center", gap: 6, 
                background: "#FFF4F2", color: "#FF5A36", 
                padding: "8px 18px", borderRadius: 999, 
                fontSize: 12, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                boxShadow: `inset 2px 2px 4px rgba(255,90,54,0.1), inset -2px -2px 4px #FFFFFF`
              }}
            >
              <Sparkles size={14} /> Premium Mentorship
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mentorship-rep-title"
              style={{ 
                fontFamily: "'Space Grotesk', 'Sora', sans-serif", fontSize: "2.8rem", 
                fontWeight: 800, color: "#1a1a2e", margin: 0, letterSpacing: "-1px", lineHeight: 1.15 
              }}
            >
              Don't prepare alone. <br/>
              <span style={{ color: "#FF5A36" }}>Get an IITian Mentor.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ maxWidth: 640, color: "#6E6656", fontSize: "1.1rem", lineHeight: 1.6, margin: 0 }}
            >
              Unlock your true potential with personalized guidance. Our mentors have walked the path and know exactly what it takes to crack JEE & NEET with top ranks.
            </motion.p>
          </div>

          {/* Features Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 36,
            marginTop: 16,
            position: "relative",
            zIndex: 1
          }}>
            {FEATURES.map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + (idx * 0.1), duration: 0.5 }}
                style={{
                  display: "flex", flexDirection: "column", gap: 18
                }}
              >
                <div style={{ 
                  width: 58, height: 58, borderRadius: 16, 
                  background: "#FFFFFF", display: "grid", placeItems: "center", color: "#FF5A36",
                  boxShadow: `inset 4px 4px 10px ${shadowDark}, inset -4px -4px 10px ${shadowLight}`
                }}>
                  <feat.icon size={26} strokeWidth={2} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "#241F18", marginBottom: 10 }}>{feat.title}</h3>
                  <p style={{ color: "#6E6656", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Area */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", justifyContent: "center", marginTop: 24, position: "relative", zIndex: 1 }}
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
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .mentorship-rep-card {
            padding: 40px 24px !important;
            border-radius: 24px !important;
            gap: 40px !important;
          }
          .mentorship-rep-title {
            font-size: 2.2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
