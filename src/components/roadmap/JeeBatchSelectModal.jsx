import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles, GraduationCap, Compass, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useEnrol } from "../EnrolModal.jsx";

export default function JeeBatchSelectModal({ isOpen, onClose }) {
  const { open: openEnrol } = useEnrol();

  if (!isOpen) return null;

  const handleSelect = (planKey) => {
    onClose();
    openEnrol(planKey);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="ijr-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ zIndex: 3500 }}
      >
        <motion.div
          className="ijr-modal-window"
          style={{ maxWidth: 620, padding: 0, overflow: "hidden" }}
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #181824 0%, #2b1f3d 100%)",
            color: "#fff",
            padding: "26px 28px 22px",
            position: "relative"
          }}>
            <button
              type="button"
              className="ijr-modal-close"
              onClick={onClose}
              aria-label="Close"
              style={{ top: 18, right: 18, color: "#fff", background: "rgba(255,255,255,0.15)" }}
            >
              <X size={18} />
            </button>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,105,61,0.22)",
              color: "#FFA07A",
              border: "1px solid rgba(255,105,61,0.4)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              padding: "4px 12px",
              borderRadius: 50,
              marginBottom: 10
            }}>
              <Sparkles size={12} /> Choose Your Target Batch
            </div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "0 0 6px", fontFamily: "var(--font-heading, sans-serif)" }}>
              Enroll in Personalized 1-on-1 Mentorship
            </h2>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
              Paired directly with verified IIT Roorkee / IIT Bombay rankers. Select your target exam year:
            </p>
          </div>

          {/* Cards Body */}
          <div style={{ padding: "24px 24px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {/* ── Option 1: JEE 2027 ── */}
            <div style={{
              border: "2px solid #FF693D",
              background: "linear-gradient(180deg, rgba(255,105,61,0.04) 0%, rgba(255,105,61,0.01) 100%)",
              borderRadius: 18,
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              boxShadow: "0 8px 24px rgba(255,105,61,0.08)"
            }}>
              <span style={{
                position: "absolute",
                top: -11,
                right: 14,
                background: "#FF693D",
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: 50
              }}>
                Till Mains 2027
              </span>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,105,61,0.15)", display: "grid", placeItems: "center", color: "#D8512A" }}>
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.12rem", fontWeight: 800, margin: 0, color: "#1c1c28" }}>JEE 2027 Batch</h3>
                    <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>Class 12 & Droppers</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "14px 0 12px" }}>
                  <span style={{ fontSize: "1.65rem", fontWeight: 900, color: "#D8512A", fontFamily: "var(--font-heading, sans-serif)" }}>₹3,499</span>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", textDecoration: "line-through" }}>₹5,999</span>
                  <span style={{ fontSize: "0.76rem", color: "#64748b", fontWeight: 600 }}>· one-time</span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px", fontSize: "0.82rem", color: "#475569", display: "flex", flexDirection: "column", gap: 8 }}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>Valid until JEE Mains 2027 Session 2</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>70-30 Backlog formula & high-yield PYQs</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>Question-level mock CBT error autopsy</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className="mj-btn-glow"
                style={{ width: "100%", justifyContent: "center", padding: "10px 14px", fontSize: "0.86rem" }}
                onClick={() => handleSelect("mentor-jee-2027-6m")}
              >
                Enroll in JEE 2027 · ₹3,499 <ArrowRight size={14} />
              </button>
            </div>

            {/* ── Option 2: JEE 2028 ── */}
            <div style={{
              border: "2px solid #8B5CF6",
              background: "linear-gradient(180deg, rgba(139,92,246,0.04) 0%, rgba(139,92,246,0.01) 100%)",
              borderRadius: 18,
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              boxShadow: "0 8px 24px rgba(139,92,246,0.08)"
            }}>
              <span style={{
                position: "absolute",
                top: -11,
                right: 14,
                background: "#8B5CF6",
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: 50
              }}>
                Class 11 Foundation
              </span>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(139,92,246,0.15)", display: "grid", placeItems: "center", color: "#7c3aed" }}>
                    <Compass size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.12rem", fontWeight: 800, margin: 0, color: "#1c1c28" }}>JEE 2028 Batch</h3>
                    <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>Class 11 Students</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "14px 0 12px" }}>
                  <span style={{ fontSize: "1.65rem", fontWeight: 900, color: "#7c3aed", fontFamily: "var(--font-heading, sans-serif)" }}>₹3,499</span>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", textDecoration: "line-through" }}>₹5,999</span>
                  <span style={{ fontSize: "0.76rem", color: "#64748b", fontWeight: 600 }}>· 6 months</span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px", fontSize: "0.82rem", color: "#475569", display: "flex", flexDirection: "column", gap: 8 }}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>6-Month intensive Class 11 foundation</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>School exam & JEE coaching time balance</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>Zero-backlog foundation for Class 12</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className="mj-btn-glow"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "10px 14px",
                  fontSize: "0.86rem",
                  background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)"
                }}
                onClick={() => handleSelect("mentor-jee-2028-6m")}
              >
                Enroll in JEE 2028 · ₹3,499 <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
