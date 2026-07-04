import { motion } from "framer-motion";
import Seo from "../components/Seo.jsx";
import { BookOpen, Zap, Target, BookMarked, Activity, CalendarDays, Brain, ShieldCheck } from "lucide-react";

const FIVE_PILLARS = [
  { title: "Concept Mastery", icon: BookOpen, desc: "Derivations over memorization. Connect concepts.", color: "#3B82F6" },
  { title: "Practice with Purpose", icon: Target, desc: "Quality beats quantity. PYQs and Advanced problems.", color: "#10B981" },
  { title: "Scientific Revision", icon: Zap, desc: "Spaced repetition: 1, 3, 7, 15, 30 days.", color: "#F59E0B" },
  { title: "Test Analysis", icon: Activity, desc: "3 hours of mock test = 4 hours of analysis.", color: "#EF4444" },
  { title: "Mental Discipline", icon: Brain, desc: "Consistent sleep, positive mindset, realistic goals.", color: "#8B5CF6" }
];

const SUBJECTS = [
  {
    name: "Physics",
    focus: ["Mechanics", "Rotation", "Thermodynamics", "Electricity", "Magnetism", "Modern Physics"],
    resources: "HC Verma, PYQs, Coaching Material",
    target: "25–40 quality problems daily.",
    color: "#F47E20"
  },
  {
    name: "Chemistry",
    focus: ["Physical: Practice numericals daily", "Organic: Mechanisms & Named Reactions", "Inorganic: NCERT & Fact Summaries"],
    resources: "NCERT, Standard Books, PYQs",
    target: "Master reactions, don't just memorize blindly.",
    color: "#0EA5A4"
  },
  {
    name: "Mathematics",
    focus: ["Calculus", "Algebra", "Coordinate Geometry", "Probability", "Vector & 3D"],
    resources: "Daily consistent practice, PYQs",
    target: "15–20 challenging problems daily.",
    color: "#7C3AED"
  }
];

export default function JeeStrategy() {
  return (
    <div className="page" style={{ background: "#fdfdfd", minHeight: "100vh" }}>
      <Seo 
        title="JEE Exam Strategy & Roadmap" 
        description="Master JEE Main & Advanced with Proven Roadmaps, Topper Frameworks, AI Insights & Smart Preparation" 
        path="/jee-strategy" 
      />
      
      {/* Hero Section */}
      <section style={{ padding: "80px 0 40px" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div className="strategy-hero">
            <div>
              <span style={{ 
                display: "inline-flex", alignItems: "center", gap: 6, 
                background: "#f0fdf4", color: "#16a34a", 
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
                Exam Strategies for JEE
              </h1>
              <p style={{ color: "#6b7280", fontSize: "1.1rem", maxWidth: 600, margin: "0", lineHeight: 1.6 }}>
                Master JEE Main & Advanced with Proven Roadmaps, Topper Frameworks, AI Insights & Smart Preparation. Quality beats quantity.
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}
            >
              <div style={{
                position: "absolute", inset: -20, background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
                zIndex: -1, borderRadius: "50%"
              }} />
              <img src="/images/ai/jee_strategy_hero.png" alt="JEE Strategy Roadmap" style={{ width: "100%", height: "auto", maxWidth: 400, display: "block", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))" }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Five Pillars */}
      <section style={{ padding: "40px 0", background: "#f8fafc" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1a1a2e" }}>The Five Pillars of JEE Success</h2>
            <p style={{ color: "#64748b", maxWidth: 600, margin: "10px auto 0" }}>Every successful JEE aspirant masters these core principles.</p>
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

      {/* Year-Wise Roadmap */}
      <section style={{ padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1a1a2e" }}>Year-Wise Roadmap</h2>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30 }}>
            <div style={{ background: "#f0f9ff", padding: 30, borderRadius: 24, border: "1px solid #bae6fd" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0369a1", marginBottom: 15 }}>Class 11</h3>
              <p style={{ color: "#0c4a6e", opacity: 0.8, fontSize: "0.95rem" }}>Build concepts slowly and correctly. Finish NCERT thoroughly, solve standard coaching sheets, make concise notes. Avoid collecting too many books. Revise weekly and never ignore backlogs.</p>
            </div>
            <div style={{ background: "#fef2f2", padding: 30, borderRadius: 24, border: "1px solid #fecaca" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#b91c1c", marginBottom: 15 }}>Class 12</h3>
              <p style={{ color: "#7f1d1d", opacity: 0.8, fontSize: "0.95rem" }}>Balance Board Exams + JEE. Maintain a daily routine: Class 12 concepts, Class 11 revision, PYQs, and weekly mocks. Don't postpone Class 11 revision until the end.</p>
            </div>
            <div style={{ background: "#fbf6ff", padding: 30, borderRadius: 24, border: "1px solid #e9d5ff" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#7e22ce", marginBottom: 15 }}>Droppers</h3>
              <p style={{ color: "#581c87", opacity: 0.8, fontSize: "0.95rem" }}>Treat preparation like a full-time job. Concept Revision → PYQs → Chapter Tests → Mock Analysis → Weak Chapter Revision → Daily Formula Revision. Consistency matters more than intensity.</p>
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
              <h3 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>AI Study Strategy</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>Leverage tools like <strong>College Parichay AI</strong> for maximum efficiency:</p>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {["Doubt solving & Concept explanations", "Formula revision & Quiz generation", "Personalized study plans", "Error analysis & Mock discussion"].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "#334155", fontWeight: 600 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} /> {item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 24, padding: 15, background: "#fef2f2", borderRadius: 12, color: "#991b1b", fontSize: "0.9rem", fontWeight: 600 }}>
                ⚠️ Avoid using AI to copy answers without understanding the core concept.
              </div>
            </div>

            <div style={{ background: "#fff", border: "2px solid #e2e8f0", borderRadius: 24, padding: 40 }}>
              <h3 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Biggest Mistakes to Avoid</h3>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {["Collecting too many books", "Watching endless lectures", "Ignoring NCERT", "No revision schedule", "Solving questions without analysis", "Chasing difficult problems too early", "Comparing with friends"].map((item, i) => (
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
