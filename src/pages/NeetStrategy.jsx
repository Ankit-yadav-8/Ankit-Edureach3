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

export default function NeetStrategy() {
  return (
    <div className="page" style={{ background: "#fdfdfd", minHeight: "100vh" }}>
      <Seo 
        title="NEET Exam Strategy & Roadmap" 
        description="Master Biology, Maximize Accuracy & Build a Medical Rank with Smart Preparation." 
        path="/neet-strategy" 
      />
      
      {/* Hero Section */}
      <section style={{ padding: "80px 0 40px" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div className="strategy-hero">
            <div>
              <span style={{ 
                display: "inline-flex", alignItems: "center", gap: 6, 
                background: "#fdf2f8", color: "#db2777", 
                padding: "6px 14px", borderRadius: 50, 
                fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 20
              }}>
                <ShieldCheck size={14} /> EXAM MASTERY
              </span>
              <h1 style={{ 
                fontFamily: "'Space Grotesk', 'Sora', sans-serif", 
                fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, 
                color: "#1a1a2e", margin: "0 0 16px 0", lineHeight: 1.15, letterSpacing: "-1px"
              }}>
                Exam Strategies for NEET
              </h1>
              <p style={{ color: "#6b7280", fontSize: "1.1rem", maxWidth: 600, margin: "0", lineHeight: 1.6 }}>
                Master Biology, Maximize Accuracy & Build a Medical Rank with Smart Preparation. Every mark can shift your rank by hundreds of positions.
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}
            >
              <div style={{
                position: "absolute", inset: -20, background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
                zIndex: -1, borderRadius: "50%"
              }} />
              <img src="/images/ai/neet_strategy_hero.png" alt="NEET Strategy Roadmap" style={{ width: "100%", height: "auto", maxWidth: 400, display: "block", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))" }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Five Pillars */}
      <section style={{ padding: "40px 0", background: "#f8fafc" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1a1a2e" }}>The Five Pillars of NEET Success</h2>
            <p style={{ color: "#64748b", maxWidth: 600, margin: "10px auto 0" }}>NEET rewards consistency, accuracy, and NCERT mastery.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {FIVE_PILLARS.map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ 
                  background: "#fff", padding: 30, borderRadius: 20, 
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9"
                }}
              >
                <div style={{ 
                  width: 50, height: 50, borderRadius: 16, background: `${pillar.color}15`, 
                  color: pillar.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
                }}>
                  <pillar.icon size={24} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10, color: "#1e293b" }}>{pillar.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "0.95rem", margin: 0 }}>{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section style={{ padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1a1a2e" }}>Preparation Roadmap</h2>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30 }}>
            <div style={{ background: "#f0fdf4", padding: 30, borderRadius: 24, border: "1px solid #bbf7d0" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#166534", marginBottom: 15 }}>Phase 1: Foundation</h3>
              <p style={{ color: "#14532d", opacity: 0.8, fontSize: "0.95rem" }}>Build concepts using NCERT and trusted reference material. Don't skip diagrams, tables, flowcharts, or highlighted notes.</p>
            </div>
            <div style={{ background: "#fffbeb", padding: 30, borderRadius: 24, border: "1px solid #fde68a" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#b45309", marginBottom: 15 }}>Phase 2: Practice</h3>
              <p style={{ color: "#78350f", opacity: 0.8, fontSize: "0.95rem" }}>Solve 150-250 MCQs daily. Chapter-wise MCQs, 15-20 years of previous-year questions, and sectional tests.</p>
            </div>
            <div style={{ background: "#fef2f2", padding: 30, borderRadius: 24, border: "1px solid #fecaca" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#b91c1c", marginBottom: 15 }}>Phase 3: Simulation</h3>
              <p style={{ color: "#7f1d1d", opacity: 0.8, fontSize: "0.95rem" }}>Attempt full-length mock tests under exam conditions. Review wrong answers, guessed answers, and time wasted. Maintain a mistake notebook.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subject-Wise Strategy */}
      <section style={{ padding: "60px 0", background: "#1a1a2e", color: "#fff" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>Subject-Wise Master Strategy</h2>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 30 }}>
            {SUBJECTS.map((subj, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 30 }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: subj.color, marginBottom: 20 }}>{subj.name}</h3>
                <div style={{ marginBottom: 15 }}>
                  <strong style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Key Focus Areas</strong>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#e2e8f0", fontSize: "0.95rem", lineHeight: 1.6 }}>
                    {subj.focus.map((f, idx) => <li key={idx}>{f}</li>)}
                  </ul>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <strong style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Resources</strong>
                  <p style={{ margin: 0, color: "#e2e8f0", fontSize: "0.95rem" }}>{subj.resources}</p>
                </div>
                <div>
                  <strong style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Daily Target</strong>
                  <p style={{ margin: 0, color: "#e2e8f0", fontSize: "0.95rem" }}>{subj.target}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Strategy & Mistakes */}
      <section style={{ padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 40 }}>
            
            <div style={{ background: "#fff", border: "2px solid #e2e8f0", borderRadius: 24, padding: 40 }}>
              <h3 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Memory & Revision System</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>Follow a structured spaced-repetition cycle:</p>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {["Within 24 hours", "After 3 days", "After 7 days", "After 15 days", "After 30 days", "Final revision before the exam"].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "#334155", fontWeight: 600 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F43F5E" }} /> {item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 24, padding: 15, background: "#f0fdf4", borderRadius: 12, color: "#166534", fontSize: "0.9rem", fontWeight: 600 }}>
                💡 Never let Biology remain unrevised. Read NCERT repeatedly rather than reading many different books.
              </div>
            </div>

            <div style={{ background: "#fff", border: "2px solid #e2e8f0", borderRadius: 24, padding: 40 }}>
              <h3 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Common Mistakes to Avoid</h3>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {["Ignoring NCERT in Biology", "Spending too much time on one difficult Physics question", "Delaying revision", "Taking mocks without reviewing them", "Memorizing Organic Chemistry without understanding mechanisms", "Neglecting sleep, exercise, or nutrition"].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, color: "#475569", fontWeight: 600 }}>
                    <span style={{ color: "#ef4444", fontWeight: 800 }}>✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .strategy-hero {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          margin-bottom: 20px;
          text-align: left;
        }
        @media (max-width: 768px) {
          .strategy-hero {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 30px;
          }
          .strategy-hero p {
            margin: 0 auto !important;
          }
        }
      `}</style>
    </div>
  );
}
