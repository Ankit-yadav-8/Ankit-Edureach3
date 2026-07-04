import { motion } from "framer-motion";
import Seo from "../components/Seo.jsx";
import { BookOpen, Zap, Target, Activity, Brain, ShieldCheck, Map, ArrowRight } from "lucide-react";

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

const TIMELINE = [
  {
    phase: "Months 1-3",
    title: "Foundation & Concepts",
    details: [
      "Focus purely on NCERT and basic concepts.",
      "Clear backlogs if any.",
      "Solve chapter-wise basic level questions."
    ],
    color: "#3B82F6"
  },
  {
    phase: "Months 4-6",
    title: "Advanced Problem Solving",
    details: [
      "Move to standard reference books (HC Verma, Cengage).",
      "Focus on multi-concept questions.",
      "Start giving part-syllabus mock tests."
    ],
    color: "#8B5CF6"
  },
  {
    phase: "Months 7-9",
    title: "Intense Practice & PYQs",
    details: [
      "Solve at least last 10 years of PYQs.",
      "Identify weak areas and revise specific topics.",
      "Increase test frequency to weekly."
    ],
    color: "#F59E0B"
  },
  {
    phase: "Months 10-12",
    title: "Mock Tests & Revision",
    details: [
      "Full syllabus mock tests twice a week.",
      "Analyze mistakes deeply after every test.",
      "Focus on exam temperament and time management."
    ],
    color: "#10B981"
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

import PremiumHero from "../components/PremiumHero.jsx";
import { Atom, FlaskConical, Sigma } from "lucide-react";

export default function JeeStrategy() {
  const heroProps = {
    badgeText: "EXAM MASTERY · JEE",
    titlePart1: "The ultimate strategy.",
    titlePart2: "Study ",
    highlight1: "smart",
    titlePart3: ", score ",
    highlight2: "higher.",
    description: "Master JEE Main & Advanced with Proven Roadmaps, Topper Frameworks, and AI Insights. Quality beats quantity.",
    stats: [
      { value: "Top 1%", label: "target", color: "#EF4444" },
      { value: "4", label: "prep phases", color: "#0f172a" },
      { value: "5", label: "success pillars", color: "#0f172a" }
    ],
    primaryButton: { text: "View Roadmap", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } },
    secondaryButton: { text: "See 5 Pillars", onClick: () => { window.scrollTo({top: 1400, behavior: 'smooth'}) } },
    chartPercentage: 99,
    chartLabel: "percentile\ngoal",
    floatingCards: [
      { title: "Physics", subtitle: "25-40 Qs/day", icon: Atom, color: "#6366f1", progress: 75, pos: { top: "5%", left: "5%" } },
      { title: "Chemistry", subtitle: "Reactions", icon: FlaskConical, color: "#ef4444", progress: 85, pos: { top: "15%", right: "5%" } },
      { title: "Mathematics", subtitle: "15-20 Qs/day", icon: Sigma, color: "#f59e0b", progress: 65, pos: { bottom: "10%", left: "20%" } }
    ]
  };

  return (
    <div className="page" style={{ background: "#ffffff", minHeight: "100vh" }}>
      <Seo 
        title="JEE Exam Strategy & Roadmap" 
        description="Master JEE Main & Advanced with Proven Roadmaps, Topper Frameworks, AI Insights & Smart Preparation" 
        path="/jee-strategy" 
      />
      
      <PremiumHero {...heroProps} />

      {/* Timeline / Roadmap Section */}
      <section style={{ padding: "60px 0", background: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            style={{ textAlign: "center", marginBottom: 50 }}
          >
            <span style={{ display: "inline-block", color: "#6366f1", fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>Roadmap</span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>The 1-Year Master Plan</h2>
            <p style={{ color: "#64748b", maxWidth: 600, margin: "12px auto 0", fontSize: "1.05rem" }}>A structured 4-phase approach to completely master the JEE syllabus.</p>
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
            <p style={{ color: "#64748b", maxWidth: 600, margin: "12px auto 0", fontSize: "1.05rem" }}>Every successful JEE aspirant masters these core principles.</p>
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
