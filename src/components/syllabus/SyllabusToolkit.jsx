import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Map, Zap, Atom, FlaskConical, Calculator, Dna, Sparkles } from "lucide-react";
import Seo from "../Seo.jsx";

const SUBJECT_ICONS = {
  Physics: Atom,
  Chemistry: FlaskConical,
  Mathematics: Calculator,
  Biology: Dna
};

const SUBJECT_COLORS = {
  Physics: "#F47E20",
  Chemistry: "#0EA5A4",
  Mathematics: "#7C3AED",
  Biology: "#15A06E"
};

function ChapterCard({ chapter, idx, subjectColor, subjectIcon: Icon }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (idx % 10) * 0.04 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#ffffff",
        border: `1px solid ${isHovered ? subjectColor : `${subjectColor}25`}`,
        borderRadius: 20,
        padding: 22,
        boxShadow: isHovered ? `0 12px 30px ${subjectColor}15` : "0 4px 16px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: isHovered ? subjectColor : `${subjectColor}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isHovered ? "#ffffff" : subjectColor,
          transition: "all 0.3s ease",
          flexShrink: 0
        }}>
          <Icon size={20} />
        </div>
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', 'Sora', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#1a1a2e",
            margin: "0 0 6px 0",
            lineHeight: 1.3
          }}>
            {chapter}
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
            Comprehensive study material, important formulas, and quick revision notes.
          </p>
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button style={{
          flex: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          background: `${subjectColor}12`,
          color: subjectColor,
          border: "none",
          padding: "8px 12px",
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          transition: "background 0.2s"
        }}>
          <Map size={14} /> Mind Map
        </button>
        <button style={{
          flex: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          background: "#f4f4f5",
          color: "#a1a1aa",
          border: "none",
          padding: "8px 12px",
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 700,
          cursor: "not-allowed",
        }}>
          <Zap size={14} /> Quiz (Soon)
        </button>
      </div>
    </motion.div>
  );
}

export default function SyllabusToolkit({ title, subtitle, data, seoTitle, seoDesc, seoPath, imageSrc }) {
  const subjects = Object.keys(data);
  const [activeTab, setActiveTab] = useState(subjects[0]);

  return (
    <div className="page" style={{ background: "#fdfdfd", minHeight: "100vh" }}>
      <Seo title={seoTitle} description={seoDesc} path={seoPath} />
      
      <section style={{ padding: "80px 0 40px" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          
          {/* Hero Section */}
          <div className="syllabus-hero">
            <div>
              <span style={{ 
                display: "inline-flex", alignItems: "center", gap: 6, 
                background: "#fff0eb", color: "#FF693D", 
                padding: "6px 14px", borderRadius: 50, 
                fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 20
              }}>
                <Sparkles size={14} /> SYLLABUS HUB
              </span>
              <h1 style={{ 
                fontFamily: "'Space Grotesk', 'Sora', sans-serif", 
                fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, 
                color: "#1a1a2e", margin: "0 0 16px 0", lineHeight: 1.15, letterSpacing: "-1px"
              }}>
                {title}
              </h1>
              <p style={{ color: "#6b7280", fontSize: "1.1rem", maxWidth: imageSrc ? 600 : 650, margin: imageSrc ? "0" : "0 auto", lineHeight: 1.6 }}>
                {subtitle}
              </p>
            </div>
            
            {imageSrc && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}
              >
                <div style={{
                  position: "absolute", inset: -20, background: "radial-gradient(circle, rgba(255,105,61,0.1) 0%, transparent 70%)",
                  zIndex: -1, borderRadius: "50%"
                }} />
                <img src={imageSrc} alt={title} style={{ width: "100%", height: "auto", maxWidth: 400, display: "block", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))" }} />
              </motion.div>
            )}
          </div>

          <style>{`
            .syllabus-hero {
              display: grid;
              grid-template-columns: ${imageSrc ? "1.2fr 0.8fr" : "1fr"};
              gap: 40px;
              align-items: center;
              margin-bottom: 60px;
              text-align: ${imageSrc ? "left" : "center"};
            }
            @media (max-width: 768px) {
              .syllabus-hero {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 30px;
              }
              .syllabus-hero p {
                margin: 0 auto !important;
              }
            }
          `}</style>

          {/* Subject Tabs */}
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 40
          }}>
            {subjects.map((subj) => {
              const TabIcon = SUBJECT_ICONS[subj] || BookOpen;
              const isActive = activeTab === subj;
              const color = SUBJECT_COLORS[subj] || "#FF693D";

              return (
                <button
                  key={subj}
                  onClick={() => setActiveTab(subj)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 24px", borderRadius: 50,
                    border: `1.5px solid ${isActive ? color : "#e5e7eb"}`,
                    background: isActive ? color : "#ffffff",
                    color: isActive ? "#ffffff" : "#4b5563",
                    fontSize: 14, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.2s ease",
                    boxShadow: isActive ? `0 4px 14px ${color}40` : "none"
                  }}
                >
                  <TabIcon size={16} /> {subj}
                </button>
              );
            })}
          </div>

          {/* Chapters Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                gap: 20 
              }}
            >
              {data[activeTab].map((chapter, idx) => (
                <ChapterCard 
                  key={chapter} 
                  chapter={chapter} 
                  idx={idx} 
                  subjectColor={SUBJECT_COLORS[activeTab]} 
                  subjectIcon={SUBJECT_ICONS[activeTab]} 
                />
              ))}
            </motion.div>
          </AnimatePresence>
          
        </div>
      </section>
    </div>
  );
}
