/* ============================================================
   StudyRoadmap — animated study-roadmap timeline + complete book
   list. Fully self-contained (inline styles), so it renders with
   the exact original exam-page design even inside the Strategy
   pages' scoped CSS. Data comes from data/roadmaps.js.
   ============================================================ */
import { motion } from "framer-motion";
import { Target, CheckCircle2 } from "lucide-react";

/* inline replicas of the global .container / .eyebrow / .section-title
   / .section-sub / .card styles so strategy.css can't restyle them */
const container = { width: "100%", maxWidth: "var(--maxw, 1200px)", marginInline: "auto", paddingInline: "1.5rem", boxSizing: "border-box" };
const cardBase = { background: "var(--page-bg)", borderRadius: "var(--radius, 18px)", boxShadow: "0 2px 16px rgba(0,0,0,.07), inset 0 1px 0 rgba(255,255,255,.9)", border: "1px solid rgba(0,0,0,.08)", color: "#1a1a2e" };
const eyebrowStyle = { display: "inline-flex", alignItems: "center", gap: ".4rem", background: "rgba(255, 105, 61,.10)", color: "var(--coral, #FF693D)", fontWeight: 700, fontSize: "0.70rem", letterSpacing: "3px", textTransform: "uppercase", padding: "0.42rem 1.1rem", borderRadius: 999, border: "1px solid rgba(255, 105, 61,.22)", marginBottom: "1.1rem", fontFamily: "'Space Grotesk','Sora',sans-serif" };
const titleStyle = { fontSize: "clamp(1.95rem,3.8vw,3.1rem)", fontWeight: 800, letterSpacing: "-1.2px", lineHeight: 1.12, fontFamily: "'Space Grotesk','Sora',sans-serif", color: "#1a1a2e", margin: 0 };
const subStyle = { color: "#4b5563", maxWidth: 580, margin: ".9rem auto 0", fontSize: "1.06rem", lineHeight: 1.7 };

/* card slides in from its own side of the spine */
const cardV = (fromLeft) => ({
  hidden: { opacity: 0, x: fromLeft ? -46 : 46, y: 10 },
  show: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 190, damping: 24 } },
});

export default function StudyRoadmap({ data, background }) {
  if (!data) return null;
  const { eyebrow = "Study Roadmap", title, sub, gradient, steps, bookTitle, bookWrap, books } = data;

  return (
    <section style={{ padding: "5.5rem 0", position: "relative", background: background || "transparent", maxWidth: "none", margin: 0 }}>
      <div style={container}>
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 760, margin: "0 auto 2.8rem" }}
        >
          <span style={eyebrowStyle}>{eyebrow}</span>
          <h2 style={titleStyle}>{title}</h2>
          {sub && <p style={subStyle}>{sub}</p>}
        </motion.div>

        {/* timeline */}
        <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
          {/* animated spine */}
          <motion.div
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.1, ease: "easeInOut" }}
            style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, background: gradient, transform: "translateX(-50%)", transformOrigin: "top", borderRadius: 4 }}
          />
          {steps.map((step, i) => {
            const fromLeft = i % 2 === 0;
            return (
              <div key={step.month} style={{ display: "flex", justifyContent: fromLeft ? "flex-start" : "flex-end", marginBottom: 36, position: "relative" }}>
                {/* node */}
                <motion.div
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-90px" }} transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.12 }}
                  style={{ position: "absolute", left: "50%", top: 28, transform: "translateX(-50%)", width: 22, height: 22, borderRadius: "50%", background: step.color, border: "3px solid #fff", boxShadow: `0 0 0 4px ${step.color}44`, zIndex: 1 }}
                />
                {/* card */}
                <motion.div
                  variants={cardV(fromLeft)} initial="hidden" whileInView="show"
                  viewport={{ once: true, margin: "-70px" }}
                  whileHover={{ y: -6, boxShadow: `0 20px 56px ${step.color}26, 0 4px 16px rgba(0,0,0,.06)` }}
                  style={{ ...cardBase, width: "44%", borderTop: `4px solid ${step.color}`, padding: "20px 22px", marginLeft: fromLeft ? 0 : "auto", marginRight: fromLeft ? "auto" : 0 }}
                >
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{step.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: step.color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{step.month}</div>
                  <h4 style={{ fontFamily: "Sora", fontWeight: 800, marginBottom: 8, fontSize: 15 }}>{step.label}</h4>
                  <p style={{ fontSize: 13, color: "var(--muted, #6b7280)", lineHeight: 1.65, marginBottom: 12 }}>{step.tip}</p>
                  <div style={{ borderTop: `1px solid ${step.color}22`, paddingTop: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>
                      <Target size={11} style={{ display: "inline", marginRight: 4 }} />Key Tasks
                    </div>
                    {step.tasks.map((task, ti) => (
                      <motion.div key={task}
                        initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.15 + ti * 0.05 }}
                        style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12, marginBottom: 5 }}>
                        <CheckCircle2 size={13} color={step.color} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ color: "var(--navy, #1a1a2e)", lineHeight: 1.5 }}>{task}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {step.resources.map((r) => (
                      <span key={r} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 50, background: `${step.color}14`, color: step.color, fontWeight: 600, border: `1px solid ${step.color}33` }}>{r}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* book list */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}
          style={{ ...cardBase, padding: "1.3rem 1.4rem", marginTop: 16, ...bookWrap }}
        >
          <h4 style={{ fontFamily: "Sora", fontWeight: 800, marginBottom: 16, color: "#1a1a2e" }}>{bookTitle}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(210px, 100%), 1fr))", gap: 14 }}>
            {books.map(({ subj, books: list, color }, bi) => (
              <motion.div key={subj}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.08 + bi * 0.08 }}
                style={{ background: "var(--page-bg)", borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${color}`, boxShadow: "0 1px 8px rgba(0,0,0,.05)" }}>
                <div style={{ fontWeight: 800, color, marginBottom: 8, fontSize: 14 }}>{subj}</div>
                {list.map((b) => (
                  <div key={b} style={{ fontSize: 12, color: "#374151", marginBottom: 5 }}>• {b}</div>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
