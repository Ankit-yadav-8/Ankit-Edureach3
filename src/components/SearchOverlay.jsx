import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, GraduationCap, FileText, Newspaper, Wrench, Building2, Stethoscope } from "lucide-react";
import { search } from "../utils/searchIndex.js";

const KIND_ICON = {
  College: GraduationCap,
  Medical: Stethoscope,
  Private: Building2,
  Exam: FileText,
  News: Newspaper,
  Tool: Wrench,
};
const KIND_COLOR = {
  College: "#4361ee",
  Medical: "#15a06e",
  Private: "#0EA5A4",
  Exam: "#2ec4b6",
  News: "#FF693D",
  Tool: "#FF693D",
};

const SUGGESTED = ["IIT Bombay", "NIT Trichy", "JEE Main", "BITSAT", "Rank Predictor", "VIT"];

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = q ? search(q, 14) : [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQ("");
      setActive(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter") {
        if (results[active]) go(results[active].to);
        else if (q) { navigate(`/search?q=${encodeURIComponent(q)}`); onClose(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, q]);

  const go = (to) => {
    onClose();
    if (to.startsWith("/jee") && to.includes("#")) {
      const [path, hash] = to.split("#");
      navigate(path);
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 300);
    } else navigate(to);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 5000,
            background: "rgba(13,27,62,0.45)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            paddingTop: "9vh",
          }}
        >
          <motion.div
            initial={{ y: -30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(680px,92vw)", background: "#fff",
              borderRadius: 18, boxShadow: "var(--shadow-lg)", overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "1rem 1.2rem", borderBottom: "1px solid var(--gray-light)" }}>
              <Search size={22} color="var(--coral)" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => { setQ(e.target.value); setActive(0); }}
                placeholder="Search colleges, exams, tools, news…"
                style={{ flex: 1, border: "none", outline: "none", fontSize: "1.05rem", color: "var(--navy)", background: "transparent" }}
              />
              <button onClick={onClose} aria-label="Close search" style={{ color: "var(--gray)" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: "56vh", overflowY: "auto" }}>
              {!q && (
                <div style={{ padding: "1rem 1.2rem" }}>
                  <p style={{ fontSize: ".75rem", letterSpacing: 1, color: "var(--gray)", textTransform: "uppercase", marginBottom: ".6rem" }}>
                    Trending
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                    {SUGGESTED.map((s) => (
                      <button key={s} className="pill" onClick={() => setQ(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {q && results.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--gray)" }}>
                  No results for “{q}”. Press Enter to see all matches.
                </div>
              )}

              {results.map((r, i) => {
                const Icon = KIND_ICON[r.kind] || Search;
                return (
                  <button
                    key={r.to + i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.to)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14, width: "100%",
                      textAlign: "left", padding: "0.85rem 1.2rem",
                      background: i === active ? "var(--sky)" : "transparent",
                      borderLeft: i === active ? "3px solid var(--coral)" : "3px solid transparent",
                    }}
                  >
                    <span style={{ width: 36, height: 36, borderRadius: 9, display: "grid", placeItems: "center", background: (KIND_COLOR[r.kind] || "#888") + "1a", color: KIND_COLOR[r.kind] }}>
                      <Icon size={18} />
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontWeight: 600, color: "var(--navy)", fontSize: ".95rem" }}>{r.title}</span>
                      <span style={{ display: "block", fontSize: ".8rem", color: "var(--gray)" }}>{r.sub}</span>
                    </span>
                    <span className="badge badge-red">{r.kind}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ padding: ".6rem 1.2rem", borderTop: "1px solid var(--gray-light)", fontSize: ".75rem", color: "var(--gray)", display: "flex", gap: "1rem" }}>
              <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
