import { motion } from "framer-motion";
import Seo from "../components/Seo.jsx";
import { BookOpen, Stethoscope, Microscope, Zap, ShieldCheck, Clock, Brain, Activity } from "lucide-react";

const FIVE_PILLARS = [
  { title: "NCERT First", icon: BookOpen, desc: "Master every paragraph, diagram, and table in Biology.", color: "#10B981" },
  { title: "Biology Strength", icon: Stethoscope, desc: "Target 340-360. Create flashcards for facts.", color: "#F43F5E" },
  { title: "Chemistry Logic", icon: Microscope, desc: "Reactions over memorization. Periodic trends.", color: "#8B5CF6" },
  { title: "Physics Practice", icon: Zap, desc: "Consistency. Formula recall and numerical practice.", color: "#F59E0B" },
  { title: "Precision & Speed", icon: Clock, desc: "Accuracy > Speed. Review all options carefully.", color: "#3B82F6" }
];

const SUBJECTS = [
  {
    name: "Biology",
    focus: ["Line-by-line NCERT revision", "Diagrams and labeling", "Scientific names & Plant families", "Human physiology & Genetics"],
    resources: "NCERT is your Bible. Flashcards.",
    target: "3-4 hours daily. Target 340–360 marks.",
    color: "#10B981"
  },
  {
    name: "Chemistry",
    focus: ["Physical: Calculations", "Organic: Mechanisms & Reagents", "Inorganic: One-page summaries of blocks"],
    resources: "NCERT & Standard MCQs",
    target: "2-3 hours daily. Balanced practice.",
    color: "#8B5CF6"
  },
  {
    name: "Physics",
    focus: ["Formula recall", "Numerical practice", "Unit analysis", "Graph interpretation"],
    resources: "Coaching material, PYQs",
    target: "2-3 hours daily. 40-80 questions.",
    color: "#F59E0B"
  }
];

const TIMELINE = [
  {
    phase: "Months 1-3",
    title: "NCERT & Foundation",
    details: [
      "Read Biology NCERT line-by-line.",
      "Clear physics and chemistry basic concepts.",
      "Make short notes for memorization-heavy topics."
    ],
    color: "#10B981"
  },
  {
    phase: "Months 4-6",
    title: "Deep Practice & Revision",
    details: [
      "Start solving previous 15 years' PYQs.",
      "Re-read NCERT Biology for the 2nd/3rd time.",
      "Start appearing for part-syllabus mock tests."
    ],
    color: "#F43F5E"
  },
  {
    phase: "Months 7-9",
    title: "Intense Mock Testing",
    details: [
      "Take weekly full-syllabus mock tests.",
      "Focus heavily on time-management.",
      "Identify weak spots in Chemistry & Physics."
    ],
    color: "#3B82F6"
  },
  {
    phase: "Months 10-12",
    title: "Final Consolidation",
    details: [
      "Daily full-syllabus mock tests.",
      "Revise Biology NCERT multiple times.",
      "Strictly maintain exam-like conditions."
    ],
    color: "#8B5CF6"
  }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function NeetStrategy() {
  return (
    <div className="page" style={{ background: "#ffffff", minHeight: "100vh" }}>
      <Seo 
        title="NEET Exam Strategy & Roadmap" 
        description="Master Biology, Maximize Accuracy & Build a Medical Rank with Smart Preparation." 
        path="/neet-strategy" 
      />
      
      {/* Hero Section */}
      <section style={{ padding: "100px 0 60px", background: "#ffffff", overflow: "hidden" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div className="strategy-hero">
            <motion.div
              initial="hidden"
              animate="show"
              variants={staggerContainer}
            >
              <motion.span variants={fadeUp} style={{ 
                display: "inline-flex", alignItems: "center", gap: 6, 
                background: "#fdf2f8", color: "#db2777", 
                padding: "8px 16px", borderRadius: 50, border: "1px solid #fbcfe8",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 24
              }}>
                <ShieldCheck size={14} /> EXAM MASTERY
              </motion.span>
              <motion.h1 variants={fadeUp} style={{ 
                fontFamily: "'Space Grotesk', 'Sora', sans-serif", 
                fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800, 
                color: "#0f172a", margin: "0 0 20px 0", lineHeight: 1.1, letterSpacing: "-1px"
              }}>
                Exam Strategies for <span style={{ color: "#db2777" }}>NEET</span>
              </motion.h1>
              <motion.p variants={fadeUp} style={{ color: "#475569", fontSize: "1.15rem", maxWidth: 600, margin: "0", lineHeight: 1.6 }}>
                Master Biology, Maximize Accuracy & Build a Medical Rank with Smart Preparation. Every mark can shift your rank by hundreds of positions.
              </motion.p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}
            >
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div style={{
                  position: "absolute", inset: -30, background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
                  zIndex: -1, borderRadius: "50%"
                }} />
                <img src="/images/ai/neet_strategy_hero.png" alt="NEET Strategy Roadmap" style={{ width: "100%", height: "auto", maxWidth: 450, display: "block", filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.12))" }} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline / Roadmap Section */}
      <section style={{ padding: "60px 0", background: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            style={{ textAlign: "center", marginBottom: 50 }}
          >
            <span style={{ display: "inline-block", color: "#db2777", fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>Roadmap</span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>The 1-Year Master Plan</h2>
            <p style={{ color: "#64748b", maxWidth: 600, margin: "12px auto 0", fontSize: "1.05rem" }}>A structured 4-phase approach to completely master the NEET syllabus.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}
          >
            {TIMELINE.map((item, i) => (
              <motion.div 
                key={i} variants={fadeUp}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }}
                style={{
                  background: "#ffffff", borderRadius: 24, padding: 32, border: "1px solid #f1f5f9",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)", transition: "all 0.3s ease", position: "relative", overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: item.color }} />
                <span style={{ display: "inline-block", background: `${item.color}15`, color: item.color, padding: "6px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
                  {item.phase}
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: 16, lineHeight: 1.3 }}>{item.title}</h3>
                <ul style={{ margin: 0, paddingLeft: 20, color: "#475569", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {item.details.map((detail, idx) => (
                    <li key={idx} style={{ marginBottom: 8 }}>{detail}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Five Pillars */}
      <section style={{ padding: "80px 0", background: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            style={{ textAlign: "center", marginBottom: 50 }}
          >
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>The Five Pillars of Success</h2>
            <p style={{ color: "#64748b", maxWidth: 600, margin: "12px auto 0", fontSize: "1.05rem" }}>NEET rewards consistency, accuracy, and NCERT mastery.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}
          >
            {FIVE_PILLARS.map((pillar, i) => (
              <motion.div 
                key={i} variants={fadeUp}
                whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.05)" }}
                style={{ 
                  background: "#ffffff", padding: 32, borderRadius: 24, border: "1px solid #f1f5f9",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.02)", display: "flex", gap: 20, alignItems: "flex-start", transition: "all 0.3s ease"
                }}
              >
                <div style={{ 
                  width: 54, height: 54, borderRadius: 16, background: `${pillar.color}15`, 
                  display: "flex", alignItems: "center", justifyContent: "center", color: pillar.color, flexShrink: 0 
                }}>
                  <pillar.icon size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>{pillar.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Subject-wise Strategy */}
      <section style={{ padding: "80px 0 100px", background: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            style={{ textAlign: "center", marginBottom: 50 }}
          >
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Subject-wise Strategy</h2>
            <p style={{ color: "#64748b", maxWidth: 600, margin: "12px auto 0", fontSize: "1.05rem" }}>Tailor your approach to the specific demands of each subject.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 30 }}
          >
            {SUBJECTS.map((subj, i) => (
              <motion.div 
                key={i} variants={fadeUp}
                whileHover={{ y: -8, boxShadow: `0 20px 40px ${subj.color}15`, borderColor: `${subj.color}40` }}
                style={{ 
                  background: "#ffffff", padding: 32, borderRadius: 24, border: "1px solid #f1f5f9",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.03)", transition: "all 0.3s ease", display: "flex", flexDirection: "column"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: subj.color }} />
                  <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{subj.name}</h3>
                </div>
                
                <div style={{ marginBottom: 24, flexGrow: 1 }}>
                  <strong style={{ display: "block", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8", marginBottom: 12 }}>Key Focus Areas</strong>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#475569", fontSize: "0.95rem", lineHeight: 1.6 }}>
                    {subj.focus.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: 6 }}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div style={{ background: "#f8fafc", padding: 20, borderRadius: 16, marginTop: "auto" }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8", fontWeight: 700, display: "block", marginBottom: 4 }}>📚 Resources</span>
                    <span style={{ fontSize: "0.9rem", color: "#334155", fontWeight: 600 }}>{subj.resources}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8", fontWeight: 700, display: "block", marginBottom: 4 }}>🎯 Target</span>
                    <span style={{ fontSize: "0.9rem", color: subj.color, fontWeight: 700 }}>{subj.target}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <style>{`
        .strategy-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .strategy-hero {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }
          .strategy-hero p {
            margin: 0 auto !important;
          }
        }
      `}</style>
    </div>
  );
}
