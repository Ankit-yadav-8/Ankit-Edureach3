import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, GraduationCap, Compass, CheckCircle2 } from "lucide-react";
import { useEnrol } from "../EnrolModal.jsx";

export default function JeeBatchSelectModal({ isOpen, onClose }) {
  const { open: openEnrol } = useEnrol();

  if (!isOpen) return null;

  const handleSelect = (planKey) => {
    onClose();
    openEnrol(planKey);
  };

  const modalJSX = (
    <AnimatePresence>
      <motion.div
        className="ijr-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 9999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 16px",
          overflowY: "auto"
        }}
      >
        <motion.div
          className="ijr-modal-window"
          style={{
            width: "100%",
            maxWidth: 620,
            background: "#FFFFFF",
            borderRadius: 20,
            boxShadow: "0 25px 70px -15px rgba(0, 0, 0, 0.35)",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            margin: "auto",
            display: "flex",
            flexDirection: "column"
          }}
          initial={{ scale: 0.95, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 14 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Light & Simple Header */}
          <div style={{
            background: "#FFFFFF",
            padding: "22px 24px 18px",
            borderBottom: "1px solid #F1F5F9",
            position: "relative"
          }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid #E2E8F0",
                background: "#F8FAFC",
                color: "#475569",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                transition: "all 0.16s"
              }}
            >
              <X size={16} />
            </button>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#FFF0EB",
              color: "#D8512A",
              border: "1px solid #FFD6C4",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "4px 12px",
              borderRadius: 50,
              marginBottom: 8
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF693D", display: "inline-block" }} />
              Choose Your Target Batch
            </div>

            <h2 style={{
              fontSize: "1.35rem",
              fontWeight: 800,
              margin: "0 0 4px",
              fontFamily: "var(--font-heading, sans-serif)",
              color: "#111827",
              lineHeight: 1.25
            }}>
              Enroll in Personalized 1-on-1 Mentorship
            </h2>

            <p style={{
              color: "#64748B",
              fontSize: "0.86rem",
              margin: 0,
              lineHeight: 1.5
            }}>
              Paired directly with verified IIT Roorkee / IIT Bombay rankers. Select your target exam year:
            </p>
          </div>

          {/* Clean Light Cards Body */}
          <div style={{
            background: "#FAFAFA",
            padding: "22px 22px 26px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16
          }}>
            {/* ── Option 1: JEE 2027 ── */}
            <div style={{
              background: "#FFFFFF",
              border: "2px solid #FF693D",
              borderRadius: 16,
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              boxShadow: "0 4px 14px rgba(255, 105, 61, 0.08)"
            }}>
              <span style={{
                position: "absolute",
                top: -11,
                right: 14,
                background: "#FF693D",
                color: "#FFFFFF",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: 50
              }}>
                Till Mains 2027
              </span>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#FFF0EB",
                    display: "grid",
                    placeItems: "center",
                    color: "#D8512A"
                  }}>
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111827" }}>
                      JEE 2027 Batch
                    </h3>
                    <span style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 600 }}>
                      Class 12 & Droppers
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "14px 0 12px" }}>
                  <span style={{ fontSize: "1.65rem", fontWeight: 900, color: "#D8512A", fontFamily: "var(--font-heading, sans-serif)" }}>
                    ₹3,499
                  </span>
                  <span style={{ fontSize: "0.82rem", color: "#94A3B8", textDecoration: "line-through" }}>
                    ₹5,999
                  </span>
                  <span style={{ fontSize: "0.76rem", color: "#64748B", fontWeight: 600 }}>
                    · one-time
                  </span>
                </div>

                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 18px",
                  fontSize: "0.82rem",
                  color: "#475569",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8
                }}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
                    <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>Valid until JEE Mains 2027 Session 2</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
                    <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>70-30 Backlog formula & high-yield PYQs</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
                    <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>Question-level mock CBT error autopsy</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px 16px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  borderRadius: 50,
                  border: "none",
                  background: "#FF693D",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(255, 105, 61, 0.25)",
                  transition: "background 0.16s, transform 0.16s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#E55328")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#FF693D")}
                onClick={() => handleSelect("mentor-jee-2027-6m")}
              >
                Enroll in JEE 2027 · ₹3,499 <ArrowRight size={15} />
              </button>
            </div>

            {/* ── Option 2: JEE 2028 ── */}
            <div style={{
              background: "#FFFFFF",
              border: "2px solid #8B5CF6",
              borderRadius: 16,
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              boxShadow: "0 4px 14px rgba(139, 92, 246, 0.08)"
            }}>
              <span style={{
                position: "absolute",
                top: -11,
                right: 14,
                background: "#8B5CF6",
                color: "#FFFFFF",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: 50
              }}>
                Class 11 Foundation
              </span>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#F5F3FF",
                    display: "grid",
                    placeItems: "center",
                    color: "#7C3AED"
                  }}>
                    <Compass size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#111827" }}>
                      JEE 2028 Batch
                    </h3>
                    <span style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 600 }}>
                      Class 11 Students
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "14px 0 12px" }}>
                  <span style={{ fontSize: "1.65rem", fontWeight: 900, color: "#7C3AED", fontFamily: "var(--font-heading, sans-serif)" }}>
                    ₹3,499
                  </span>
                  <span style={{ fontSize: "0.82rem", color: "#94A3B8", textDecoration: "line-through" }}>
                    ₹5,999
                  </span>
                  <span style={{ fontSize: "0.76rem", color: "#64748B", fontWeight: 600 }}>
                    · 6 months
                  </span>
                </div>

                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 18px",
                  fontSize: "0.82rem",
                  color: "#475569",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8
                }}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
                    <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>6-Month intensive Class 11 foundation</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
                    <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>School exam & JEE coaching time balance</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 }}>
                    <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>Zero-backlog foundation for Class 12</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px 16px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  borderRadius: 50,
                  border: "none",
                  background: "#7C3AED",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(124, 58, 237, 0.25)",
                  transition: "background 0.16s, transform 0.16s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#6D28D9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#7C3AED")}
                onClick={() => handleSelect("mentor-jee-2028-6m")}
              >
                Enroll in JEE 2028 · ₹3,499 <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(modalJSX, document.body) : null;
}
