import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";

/* ════════════════════════════════════════════════
   JEE timeline — alternating left / right cards on a
   single vertical orange line (jastro.in style).
════════════════════════════════════════════════ */
const PHASES = [
  { period: "Nov – Dec", color: "#6366f1", exam: "JEE Mains Form", lines: [
    "Registration opens on the NTA portal",
    "Photo, signature & document upload",
    "Application-fee window closes early December",
  ] },
  { period: "Jan – Feb", color: "#F47B20", exam: "JEE Mains — Session 1", lines: [
    "Exam dates & admit-card release",
    "75% board / top-20-percentile criteria to apply",
    "NTA percentile out within ~1–2 weeks",
  ] },
  { period: "Mar – Apr", color: "#8b5cf6", exam: "JEE Mains — Session 2", lines: [
    "Best of the two sessions is counted",
    "Final NTA percentile converted to AIR",
    "Result & rank list by late April",
  ] },
  { period: "May", color: "#0ea5a4", exam: "JEE Advanced", lines: [
    "Top 2.5L session-best qualifiers eligible",
    "Two papers — Paper 1 + Paper 2 (compulsory)",
    "IIT-set pattern, both papers on the same day",
  ] },
  { period: "Jun", color: "#15a06e", exam: "JEE Advanced Result + JoSAA", lines: [
    "All-India rank list declared",
    "6 rounds of JoSAA seat allotment",
    "Float / Slide / Freeze your seat",
  ] },
];

const CSS = `
.tl { position: relative; max-width: 1000px; margin: 40px auto 0; }
.tl-line { position: absolute; top: 8px; bottom: 8px; left: 50%; width: 2px; transform: translateX(-50%);
  background: linear-gradient(to bottom, rgba(244,123,32,.55), rgba(244,123,32,.12)); border-radius: 2px; }
.tl-row { display: grid; grid-template-columns: 1fr 44px 1fr; align-items: center; margin-bottom: 26px; }
.tl-row:last-child { margin-bottom: 0; }
.tl-card { grid-column: 1; }
.tl-row.right .tl-card { grid-column: 3; }
.tl-node { grid-column: 2; display: grid; place-items: center; }
.tl-dot { width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 3px solid currentColor;
  box-shadow: 0 0 0 4px rgba(244,123,32,.10); }
@media (max-width: 768px) {
  .tl { margin-top: 28px; }
  .tl-line { left: 17px; }
  .tl-row { grid-template-columns: 34px 1fr; margin-bottom: 18px; }
  .tl-card, .tl-row.right .tl-card { grid-column: 2; }
  .tl-node { grid-column: 1; }
}
`;

function TimelineCard({ p, left }) {
  return (
    <motion.div
      className="tl-card"
      initial={{ opacity: 0, x: left ? -28 : 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div style={{
        background: "#fff", border: `1px solid ${p.color}33`, borderRadius: 16,
        padding: "15px 18px", boxShadow: "0 2px 16px rgba(0,0,0,.06)", textAlign: "left",
      }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: p.color, letterSpacing: ".8px", textTransform: "uppercase", marginBottom: 4 }}>{p.period}</div>
        <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", color: "#1c1c28", marginBottom: 9 }}>{p.exam}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {p.lines.map((l) => (
            <div key={l} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "#4b5563", lineHeight: 1.45 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.color, flexShrink: 0, marginTop: 6 }} />{l}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ExamCycle() {
  return (
    <section id="exam-cycle" className="section" style={{ background: "#ffffff", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <style>{CSS}</style>
      <div className="container">

        {/* header */}
        <motion.div
          className="title-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow"><Sparkles size={11} /> JEE 2026 Timeline</span>
          <h2 className="section-title" style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", color: "#1a1a2e" }}>
            Your JEE Year, <span className="accent">Phase by Phase</span>
          </h2>
          <p className="section-sub" style={{ color: "#4b5563" }}>
            From the JEE Mains form to JoSAA seat allotment — every milestone, in order.
          </p>
        </motion.div>

        {/* alternating timeline */}
        <div className="tl">
          <div className="tl-line" />
          {PHASES.map((p, i) => {
            const left = i % 2 === 0;
            return (
              <div key={p.exam} className={"tl-row " + (left ? "left" : "right")}>
                <TimelineCard p={p} left={left} />
                <div className="tl-node" style={{ color: p.color }}>
                  <span className="tl-dot" />
                </div>
              </div>
            );
          })}
        </div>

        {/* note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            marginTop: 40, background: "rgba(244,123,32,.06)", border: "1px solid rgba(244,123,32,.18)",
            borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10,
            fontSize: 13, color: "#92400e",
          }}
        >
          <Clock size={15} color="#F47B20" style={{ flexShrink: 0 }} />
          <span>Dates are indicative, based on previous-year patterns. Always verify on the official websites before applying.</span>
        </motion.div>
      </div>
    </section>
  );
}
