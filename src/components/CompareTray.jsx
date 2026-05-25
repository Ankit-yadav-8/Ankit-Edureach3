import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitCompare, ArrowRight } from "lucide-react";
import { useShortlist } from "../context/Shortlist.jsx";
import { COLLEGE_BY_SLUG } from "../data/colleges.js";

export default function CompareTray() {
  const { compare, toggleCompare, clearCompare } = useShortlist();
  const nav = useNavigate();
  if (!compare.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
        style={{ position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: 20, zIndex: 60, width: "min(680px, calc(100% - 32px))" }}
      >
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 16px 48px rgba(13,27,62,.25)", border: "1px solid var(--line)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, color: "var(--navy)", fontFamily: "Sora" }}>
            <GitCompare size={18} color="var(--teal)" /> Compare
          </span>
          <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "wrap" }}>
            {compare.map((slug) => {
              const c = COLLEGE_BY_SLUG[slug];
              if (!c) return null;
              return (
                <span key={slug} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--sky)", border: "1px solid var(--line)", borderRadius: 999, padding: "5px 6px 5px 12px", fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>
                  {c.short}
                  <button onClick={() => toggleCompare(slug)} aria-label="Remove" style={{ display: "grid", placeItems: "center", width: 18, height: 18, borderRadius: "50%", background: "rgba(13,27,62,.08)" }}>
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
          <button onClick={clearCompare} className="btn btn-ghost" style={{ fontSize: 12.5, padding: "7px 12px" }}>Clear</button>
          <button onClick={() => nav("/compare")} className="btn btn-coral" style={{ fontSize: 13 }} disabled={compare.length < 2}>
            Compare {compare.length} <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
