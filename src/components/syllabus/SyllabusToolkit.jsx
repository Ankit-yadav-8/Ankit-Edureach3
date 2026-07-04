import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Map, Zap, Atom, FlaskConical, Calculator, Dna, Sparkles } from "lucide-react";
import Seo from "../Seo.jsx";
import MindMapViewer from "../MindMapViewer.jsx";
import { getChapterMindmap } from "../../data/chapterMindmaps.js";

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

function PremiumChapterCard({ chapter, idx, subjectColor, subjectIcon: Icon, subjectName, classLevel, onOpenMindMap }) {
  const [isHovered, setIsHovered] = useState(false);
  const isString = typeof chapter === 'string';
  const title = isString ? chapter : chapter.title;
  const mindmap = getChapterMindmap(classLevel, subjectName, title);

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
        padding: 24,
        boxShadow: isHovered ? `0 12px 30px ${subjectColor}15` : "0 4px 16px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12, background: isHovered ? subjectColor : `${subjectColor}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isHovered ? "#ffffff" : subjectColor, transition: "all 0.3s ease", flexShrink: 0
        }}>
          <Icon size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', 'Sora', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px 0", lineHeight: 1.3 }}>
              {isString ? chapter : chapter.title}
            </h3>
            {!isString && chapter.priority && (
              <span style={{ 
                fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6,
                background: chapter.priority.includes("Tier 1") ? "#fef2f2" : chapter.priority.includes("Tier 2") ? "#fffbeb" : "#f0fdf4",
                color: chapter.priority.includes("Tier 1") ? "#b91c1c" : chapter.priority.includes("Tier 2") ? "#b45309" : "#166534"
              }}>
                {chapter.priority.includes("Tier 1") ? "🟥" : chapter.priority.includes("Tier 2") ? "🟧" : chapter.priority.includes("Tier 3") ? "🟨" : "🟩"} {chapter.priority}
              </span>
            )}
          </div>
          
          {!isString && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>
                Diff: {"⭐".repeat(chapter.difficulty)}{"☆".repeat(5-chapter.difficulty)}
              </span>
              {chapter.jeeMain && (
                <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>
                  JEE M: {"⭐".repeat(chapter.jeeMain)}{"☆".repeat(5-chapter.jeeMain)}
                </span>
              )}
              {chapter.jeeAdv && (
                <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>
                  JEE A: {"⭐".repeat(chapter.jeeAdv)}{"☆".repeat(5-chapter.jeeAdv)}
                </span>
              )}
              {chapter.neet && (
                <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>
                  NEET: {"⭐".repeat(chapter.neet)}{"☆".repeat(5-chapter.neet)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 16px 0", flexGrow: 1 }}>
        {isString ? "Comprehensive study material, important formulas, and quick revision notes." : chapter.description}
      </p>

      {!isString && (
        <>
          <div style={{ marginBottom: 16 }}>
            <strong style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              🎯 What You'll Learn
            </strong>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", fontSize: "0.85rem", lineHeight: 1.5 }}>
              {chapter.outcomes.map((outcome, i) => (
                <li key={i}>{outcome}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 12, marginBottom: 16 }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
              <strong>⏳ Time:</strong> {chapter.studyTime}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
              <strong>📚 Pre-req:</strong> {chapter.prerequisites}
            </div>
          </div>
        </>
      )}

      <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button
          onClick={mindmap ? () => onOpenMindMap({ subjectId: mindmap.subjectId, chapter: { name: mindmap.name, pages: mindmap.pages } }) : undefined}
          disabled={!mindmap}
          title={mindmap ? `Open mind map — ${mindmap.pages.length} sheet${mindmap.pages.length > 1 ? "s" : ""}` : "Mind map coming soon"}
          style={{
            flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: mindmap ? `${subjectColor}12` : "#f4f4f5",
            color: mindmap ? subjectColor : "#a1a1aa", border: "none", padding: "8px 12px",
            borderRadius: 10, fontSize: 12, fontWeight: 700,
            cursor: mindmap ? "pointer" : "not-allowed", transition: "background 0.2s"
          }}>
          <Map size={14} /> {mindmap ? "Mind Map" : "Mind Map (Soon)"}
        </button>
        <button style={{
          flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          background: "#f4f4f5", color: "#a1a1aa", border: "none", padding: "8px 12px",
          borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "not-allowed",
        }}>
          <Zap size={14} /> Quiz (Soon)
        </button>
      </div>
    </motion.div>
  );
}

import PremiumHero from "../PremiumHero.jsx";

export default function SyllabusToolkit({ data, heroProps, seoTitle, seoDesc, seoPath, classLevel }) {
  const subjects = Object.keys(data);
  const [activeTab, setActiveTab] = useState(subjects[0]);
  const [viewer, setViewer] = useState(null); // { subjectId, chapter }

  return (
    <div className="page" style={{ background: "#fdfdfd", minHeight: "100vh" }}>
      <Seo title={seoTitle} description={seoDesc} path={seoPath} />

      {heroProps && <PremiumHero {...heroProps} />}
      
      <section style={{ padding: "40px 0" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          
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
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
                gap: 20 
              }}
            >
              {data[activeTab].map((chapter, idx) => (
                <PremiumChapterCard
                  key={chapter.title || chapter}
                  chapter={chapter}
                  idx={idx}
                  subjectColor={SUBJECT_COLORS[activeTab]}
                  subjectIcon={SUBJECT_ICONS[activeTab]}
                  subjectName={activeTab}
                  classLevel={classLevel}
                  onOpenMindMap={setViewer}
                />
              ))}
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      <MindMapViewer
        open={!!viewer}
        subjectId={viewer?.subjectId}
        chapter={viewer?.chapter}
        onClose={() => setViewer(null)}
      />
    </div>
  );
}
