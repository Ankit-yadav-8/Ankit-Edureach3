import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, RotateCcw,
  Atom, FlaskConical, Sigma,
} from "lucide-react";
import { CL } from "./home/clTheme.js";

/* Subject accents — mirror the JEE mind-maps page */
const SUBJECT_META = {
  physics:   { Icon: Atom,         accent: CL.coral },
  chemistry: { Icon: FlaskConical, accent: CL.green },
  maths:     { Icon: Sigma,        accent: CL.violet },
};

export const mindMapImgSrc = (subj, p) =>
  `/mindmaps_raw/${subj}/${subj}_page_${String(p).padStart(3, "0")}.png`;

const download = (href, name) => {
  const a = document.createElement("a");
  a.href = href; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
};

/* ════════════════════════════════════════════════════════════════
   MIND-MAP VIEWER — full-screen gallery for one chapter's pages
   ════════════════════════════════════════════════════════════════ */
export default function MindMapViewer({ open, subjectId, chapter, onClose }) {
  const meta = SUBJECT_META[subjectId] || SUBJECT_META.physics;
  const pages = chapter?.pages || [];
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const scrollRef = useRef(null);

  useEffect(() => { setIdx(0); setZoom(1); }, [chapter]);
  useEffect(() => { setZoom(1); if (scrollRef.current) scrollRef.current.scrollTo(0, 0); }, [idx]);

  const go = useCallback((d) => {
    setIdx((i) => Math.min(pages.length - 1, Math.max(0, i + d)));
  }, [pages.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(3, z + 0.4));
      else if (e.key === "-") setZoom((z) => Math.max(1, z - 0.4));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, go, onClose]);

  if (!open || !chapter) return null;
  const src = mindMapImgSrc(subjectId, pages[idx]);
  const fileName = `${subjectId}-${chapter.name.replace(/[^\w]+/g, "-").toLowerCase()}-${idx + 1}.png`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 12000,
          background: "rgba(24,20,33,.86)", backdropFilter: "blur(6px)",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* top bar */}
        <div onClick={(e) => e.stopPropagation()} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
          padding: "12px 14px", color: "#fff", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <span style={{ width: 38, height: 38, borderRadius: 11, background: meta.accent, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <meta.Icon size={20} color="#fff" />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 16, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {chapter.name}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>
                Mind map · page {idx + 1} of {pages.length}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <ToolBtn title="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.4))} disabled={zoom <= 1}><ZoomOut size={18} /></ToolBtn>
            <span className="mmv-zoom" style={{ fontSize: 12.5, fontWeight: 700, minWidth: 46, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
            <ToolBtn title="Zoom in" onClick={() => setZoom((z) => Math.min(3, z + 0.4))} disabled={zoom >= 3}><ZoomIn size={18} /></ToolBtn>
            <ToolBtn className="mmv-reset" title="Reset zoom" onClick={() => setZoom(1)}><RotateCcw size={16} /></ToolBtn>
            <ToolBtn title="Download this page" onClick={() => download(src, fileName)}><Download size={18} /></ToolBtn>
            <ToolBtn title="Close (Esc)" onClick={onClose} strong><X size={20} /></ToolBtn>
          </div>
        </div>

        {/* image stage */}
        <div ref={scrollRef} onClick={(e) => e.stopPropagation()} style={{
          flex: 1, overflow: zoom > 1 ? "auto" : "hidden",
          display: "flex", alignItems: zoom > 1 ? "flex-start" : "center", justifyContent: "center",
          padding: "6px 12px", position: "relative",
        }}>
          {idx > 0 && <NavArrow side="left" onClick={() => go(-1)} />}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={pages[idx]}
              src={src}
              alt={`${chapter.name} mind map ${idx + 1}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setZoom((z) => (z >= 3 ? 1 : z + 0.6))}
              style={{
                width: zoom > 1 ? `${zoom * 62}%` : "auto",
                maxWidth: zoom > 1 ? "none" : "min(920px, 96%)",
                maxHeight: zoom > 1 ? "none" : "100%",
                objectFit: "contain", borderRadius: 10, background: "var(--page-bg)",
                boxShadow: "0 24px 60px rgba(0,0,0,.5)",
                cursor: zoom >= 3 ? "zoom-out" : "zoom-in", userSelect: "none",
              }}
            />
          </AnimatePresence>
          {idx < pages.length - 1 && <NavArrow side="right" onClick={() => go(1)} />}
        </div>

        {/* thumbnail strip */}
        {pages.length > 1 && (
          <div onClick={(e) => e.stopPropagation()} style={{
            flexShrink: 0, display: "flex", gap: 8, padding: "10px 14px 16px",
            overflowX: "auto", justifyContent: pages.length < 8 ? "center" : "flex-start",
          }}>
            {pages.map((p, i) => (
              <button key={`${p}-${i}`} onClick={() => setIdx(i)} style={{
                flexShrink: 0, width: 48, height: 64, borderRadius: 8, overflow: "hidden",
                border: i === idx ? `2.5px solid ${meta.accent}` : "2.5px solid rgba(255,255,255,.15)",
                background: "var(--page-bg)", cursor: "pointer", padding: 0,
                boxShadow: i === idx ? `0 4px 14px ${meta.accent}88` : "none",
                opacity: i === idx ? 1 : 0.7, transition: "opacity .15s, border-color .15s",
              }}>
                <img src={mindMapImgSrc(subjectId, p)} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function ToolBtn({ children, onClick, title, disabled, strong, className }) {
  return (
    <button title={title} onClick={onClick} disabled={disabled} className={className} style={{
      width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center",
      background: strong ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.08)",
      color: "#fff", border: "1px solid rgba(255,255,255,.14)",
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1,
      transition: "background .15s", flexShrink: 0,
    }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "rgba(255,255,255,.22)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = strong ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.08)"; }}
    >{children}</button>
  );
}

function NavArrow({ side, onClick }) {
  return (
    <button onClick={onClick} className={`mmv-arrow mmv-arrow-${side}`} style={{
      position: "absolute", top: "50%", transform: "translateY(-50%)",
      [side]: 14, zIndex: 5,
      width: 48, height: 48, borderRadius: "50%", display: "grid", placeItems: "center",
      background: "rgba(255,255,255,.14)", color: "#fff", border: "1px solid rgba(255,255,255,.2)",
      backdropFilter: "blur(4px)", cursor: "pointer",
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.28)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.14)"}
    >
      {side === "left" ? <ChevronLeft size={26} /> : <ChevronRight size={26} />}
    </button>
  );
}
