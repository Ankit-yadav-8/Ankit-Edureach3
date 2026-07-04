import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, FlaskConical, Sigma, Atom, Search, X, Sparkles,
  ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, RotateCcw,
  Layers, GraduationCap, ArrowRight, Images, Eye, Grid2x2, Keyboard,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { CL } from "../components/home/clTheme.js";
import mindmaps from "../data/mindmaps.json";

/* ── Subject accents — all drawn from the site's CL palette ── */
const SUBJECTS = [
  { id: "physics",   Icon: Atom,         accent: CL.coral,  soft: CL.coralSoft, dk: CL.coralDk, tint: "#FFF4F0" },
  { id: "chemistry", Icon: FlaskConical, accent: CL.green,  soft: CL.greenSoft, dk: "#0A8F5B",  tint: "#F0FBF6" },
  { id: "maths",     Icon: Sigma,        accent: CL.violet, soft: "#EFEAF7",    dk: "#5B4088",  tint: "#F6F3FB" },
];
const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));
const SECTION_ORDER = ["Physical", "Inorganic", "Organic"];

const imgSrc = (subj, p) => `/mindmaps_raw/${subj}/${subj}_page_${String(p).padStart(3, "0")}.png`;
const download = (href, name) => {
  const a = document.createElement("a");
  a.href = href; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
};

/* ════════════════════════════════════════════════════════════════
   MIND-MAP VIEWER — full-screen gallery for one chapter's pages
   ════════════════════════════════════════════════════════════════ */
function MindMapViewer({ open, subjectId, chapter, onClose }) {
  const meta = SUBJECT_MAP[subjectId] || SUBJECTS[0];
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
  const src = imgSrc(subjectId, pages[idx]);
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
          padding: "14px 20px", color: "#fff", flexShrink: 0,
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ToolBtn title="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.4))} disabled={zoom <= 1}><ZoomOut size={18} /></ToolBtn>
            <span style={{ fontSize: 12.5, fontWeight: 700, minWidth: 46, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
            <ToolBtn title="Zoom in" onClick={() => setZoom((z) => Math.min(3, z + 0.4))} disabled={zoom >= 3}><ZoomIn size={18} /></ToolBtn>
            <ToolBtn title="Reset zoom" onClick={() => setZoom(1)}><RotateCcw size={16} /></ToolBtn>
            <ToolBtn title="Download this page" onClick={() => download(src, fileName)}><Download size={18} /></ToolBtn>
            <ToolBtn title="Close (Esc)" onClick={onClose} strong><X size={20} /></ToolBtn>
          </div>
        </div>

        {/* image stage */}
        <div ref={scrollRef} onClick={(e) => e.stopPropagation()} style={{
          flex: 1, overflow: zoom > 1 ? "auto" : "hidden",
          display: "flex", alignItems: zoom > 1 ? "flex-start" : "center", justifyContent: "center",
          padding: "6px 16px", position: "relative",
        }}>
          {/* prev / next */}
          {idx > 0 && (
            <NavArrow side="left" onClick={() => go(-1)} />
          )}
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
                objectFit: "contain",
                borderRadius: 10,
                background: "#fff",
                boxShadow: "0 24px 60px rgba(0,0,0,.5)",
                cursor: zoom >= 3 ? "zoom-out" : "zoom-in",
                userSelect: "none",
              }}
            />
          </AnimatePresence>
          {idx < pages.length - 1 && (
            <NavArrow side="right" onClick={() => go(1)} />
          )}
        </div>

        {/* thumbnail strip */}
        {pages.length > 1 && (
          <div onClick={(e) => e.stopPropagation()} style={{
            flexShrink: 0, display: "flex", gap: 8, padding: "12px 18px 18px",
            overflowX: "auto", justifyContent: pages.length < 8 ? "center" : "flex-start",
          }}>
            {pages.map((p, i) => (
              <button key={p} onClick={() => setIdx(i)} style={{
                flexShrink: 0, width: 54, height: 72, borderRadius: 8, overflow: "hidden",
                border: i === idx ? `2.5px solid ${meta.accent}` : "2.5px solid rgba(255,255,255,.15)",
                background: "#fff", cursor: "pointer", padding: 0,
                boxShadow: i === idx ? `0 4px 14px ${meta.accent}88` : "none",
                opacity: i === idx ? 1 : 0.7, transition: "opacity .15s, border-color .15s",
              }}>
                <img src={imgSrc(subjectId, p)} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function ToolBtn({ children, onClick, title, disabled, strong }) {
  return (
    <button title={title} onClick={onClick} disabled={disabled} style={{
      width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center",
      background: strong ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.08)",
      color: "#fff", border: "1px solid rgba(255,255,255,.14)",
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1,
      transition: "background .15s",
    }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "rgba(255,255,255,.22)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = strong ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.08)"; }}
    >{children}</button>
  );
}

function NavArrow({ side, onClick }) {
  return (
    <button onClick={onClick} style={{
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

/* ════════════════════════════════════════════════════════════════
   CHAPTER CARD
   ════════════════════════════════════════════════════════════════ */
function ChapterCard({ ch, subject, index, onOpen }) {
  const [hover, setHover] = useState(false);
  const first = ch.pages[0];
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.34, delay: (index % 8) * 0.035, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(ch)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left", cursor: "pointer", padding: 0, overflow: "hidden",
        background: CL.card, borderRadius: 18,
        border: `1px solid ${hover ? subject.accent + "66" : CL.line}`,
        boxShadow: hover ? `0 16px 38px ${subject.accent}22` : CL.shadow,
        transform: hover ? "translateY(-4px)" : "none",
        transition: "box-shadow .22s, border-color .22s, transform .22s",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* thumbnail preview */}
      <div style={{ position: "relative", height: 150, background: subject.tint, overflow: "hidden", borderBottom: `1px solid ${CL.line}` }}>
        <img
          src={imgSrc(subject.id, first)} alt="" loading="lazy"
          style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center",
            transform: hover ? "scale(1.05)" : "scale(1)", transition: "transform .35s ease",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(255,255,255,.92) 100%)" }} />
        {/* page-count pill */}
        <span style={{
          position: "absolute", top: 10, right: 10, display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(24,20,33,.72)", color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "4px 10px", borderRadius: 50, backdropFilter: "blur(4px)",
        }}>
          <Images size={12} /> {ch.pages.length} {ch.pages.length > 1 ? "maps" : "map"}
        </span>
        {/* number badge */}
        <span style={{
          position: "absolute", bottom: 10, left: 12, width: 32, height: 32, borderRadius: 9,
          background: subject.accent, color: "#fff", display: "grid", placeItems: "center",
          fontFamily: CL.display, fontWeight: 800, fontSize: 13, boxShadow: `0 4px 12px ${subject.accent}66`,
        }}>
          {String(ch.n).padStart(2, "0")}
        </span>
      </div>

      {/* body */}
      <div style={{ padding: "13px 15px 15px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, flex: 1 }}>
          <h4 style={{ fontFamily: CL.display, fontWeight: 700, fontSize: "0.95rem", color: CL.ink, lineHeight: 1.32, margin: 0 }}>
            {ch.name}
          </h4>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          {ch.section ? (
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: subject.dk, background: subject.soft, padding: "3px 9px", borderRadius: 6 }}>
              {ch.section}
            </span>
          ) : <span />}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700,
            color: subject.dk, opacity: hover ? 1 : 0.85,
          }}>
            <Eye size={14} /> View {hover ? <ArrowRight size={13} /> : null}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */
export default function JeeResources() {
  const [sp, setSp] = useSearchParams();
  const [active, setActive] = useState(SUBJECT_MAP[sp.get("subject")] ? sp.get("subject") : "physics");
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");
  const [viewer, setViewer] = useState(null); // { chapter }
  const nav = useNavigate();

  useEffect(() => {
    const s = sp.get("subject");
    if (s && SUBJECT_MAP[s]) { setActive(s); setQuery(""); setSection("all"); }
  }, [sp]);

  const subject = SUBJECT_MAP[active];
  const blob = mindmaps[active];
  const hasSections = blob.chapters.some((c) => c.section);

  const totals = useMemo(() => {
    let ch = 0, pg = 0;
    Object.values(mindmaps).forEach((b) => {
      ch += b.chapters.length;
      b.chapters.forEach((c) => { pg += c.pages.length; });
    });
    return { ch, pg };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blob.chapters.filter((c) => {
      if (section !== "all" && c.section !== section) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [blob, query, section]);

  const grouped = useMemo(() => {
    if (!hasSections || section !== "all") return [{ key: null, items: filtered }];
    return SECTION_ORDER.map((s) => ({ key: s, items: filtered.filter((c) => c.section === s) }))
      .filter((g) => g.items.length);
  }, [filtered, hasSections, section]);

  const switchSubject = (id) => {
    setActive(id); setQuery(""); setSection("all");
    setSp((prev) => { const n = new URLSearchParams(prev); n.set("subject", id); return n; }, { replace: true });
  };

  return (
    <div className="page" style={{ minHeight: "100vh", background: CL.cream }}>
      <Seo
        title="JEE Mind Maps — Chapter-wise Revision Sheets for Physics, Chemistry & Maths"
        description={`${totals.ch} chapter-wise JEE Main & Advanced mind maps across Physics, Chemistry and Mathematics — ${totals.pg} high-yield revision sheets to memorise every formula fast, free on College Parichay.`}
        path="/jee-resources"
      />

      {/* ── HERO ── */}
      <section className="warm-page-header" style={{ padding: "48px 0 40px" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 65% at 100% 10%, rgba(255,105,61,.16) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 50% at 0% 90%, rgba(123,94,167,.12) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="eyebrow"><Sparkles size={12} /> JEE Revision Mind Maps</span>
            <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.5vw,3rem)", color: CL.ink, letterSpacing: "-0.6px", lineHeight: 1.12, margin: "0 0 14px" }}>
              Every JEE chapter,{" "}
              <span style={{ background: `linear-gradient(90deg, ${CL.coral}, ${CL.coralDk})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                one mind map away
              </span>
            </h1>
            <p style={{ color: CL.body, fontSize: "1.02rem", maxWidth: 560, lineHeight: 1.7, margin: "0 0 26px" }}>
              High-yield, chapter-wise revision sheets for Physics, Chemistry &amp; Mathematics — every
              formula, reaction and result condensed into visual mind maps you can revise in minutes.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <HeroStat icon={GraduationCap} value={totals.ch} label="Chapters" color={CL.coral} />
              <HeroStat icon={Images} value={totals.pg} label="Mind-map pages" color={CL.violet} />
              <HeroStat icon={Layers} value="3" label="Subjects" color={CL.green} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY SUBJECT SWITCHER ── */}
      <div style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${CL.line}`, position: "sticky", top: 98, zIndex: 50 }}>
        <div className="container" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 1.5rem" }}>
          {SUBJECTS.map((s) => {
            const on = s.id === active;
            const count = mindmaps[s.id].chapters.length;
            return (
              <button key={s.id} onClick={() => switchSubject(s.id)} style={{
                display: "inline-flex", alignItems: "center", gap: 9, whiteSpace: "nowrap",
                padding: "9px 18px", borderRadius: 50, cursor: "pointer",
                fontFamily: CL.display, fontWeight: 700, fontSize: 14,
                background: on ? s.accent : CL.cream2,
                color: on ? "#fff" : CL.ink2,
                border: `1px solid ${on ? s.accent : CL.line}`,
                boxShadow: on ? `0 8px 20px ${s.accent}44` : "none",
                transition: "all .2s",
              }}>
                <s.Icon size={17} /> {mindmaps[s.id].name}
                <span style={{ fontSize: 11.5, fontWeight: 800, padding: "1px 8px", borderRadius: 50, background: on ? "rgba(255,255,255,.25)" : "#fff", color: on ? "#fff" : CL.muted, border: on ? "none" : `1px solid ${CL.line}` }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TOOLBAR + CONTENT ── */}
      <div className="container" style={{ padding: "26px 1.5rem 64px" }}>
        {/* toolbar */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", flex: "1 1 auto" }}>
            {/* search */}
            <div style={{ position: "relative", flex: "0 1 300px", minWidth: 220 }}>
              <Search size={16} color={CL.muted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${blob.name} chapters…`}
                style={{
                  width: "100%", padding: "10px 34px 10px 38px", borderRadius: 50,
                  border: `1px solid ${CL.line}`, background: CL.card, color: CL.ink,
                  fontSize: 13.5, fontFamily: CL.display, outline: "none",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = subject.accent}
                onBlur={(e) => e.currentTarget.style.borderColor = CL.line}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: CL.muted }}>
                  <X size={15} />
                </button>
              )}
            </div>
            {/* section filter (chemistry) */}
            {hasSections && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["all", ...SECTION_ORDER].map((s) => {
                  const on = section === s;
                  return (
                    <button key={s} onClick={() => setSection(s)} style={{
                      padding: "7px 14px", borderRadius: 50, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                      fontFamily: CL.display, textTransform: s === "all" ? "none" : "capitalize",
                      border: `1px solid ${on ? subject.accent : CL.line}`,
                      background: on ? subject.soft : CL.card,
                      color: on ? subject.dk : CL.body,
                      transition: "all .18s",
                    }}>
                      {s === "all" ? "All sections" : s}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <span style={{ fontSize: 12.5, color: CL.muted, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Grid2x2 size={14} /> {filtered.length} chapter{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "70px 20px", color: CL.muted }}>
                <Search size={34} style={{ opacity: 0.4 }} />
                <p style={{ marginTop: 12, fontSize: 15, fontFamily: CL.display, fontWeight: 700, color: CL.ink2 }}>No chapters match “{query}”.</p>
                <button onClick={() => { setQuery(""); setSection("all"); }} style={{ marginTop: 6, color: subject.dk, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 13.5 }}>Clear filters</button>
              </div>
            ) : (
              grouped.map((g) => (
                <div key={g.key || "all"} style={{ marginBottom: 30 }}>
                  {g.key && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "6px 0 18px" }}>
                      <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", color: subject.dk }}>
                        {g.key} Chemistry
                      </span>
                      <span style={{ fontSize: 11.5, color: CL.muted, fontWeight: 700, background: subject.soft, padding: "2px 9px", borderRadius: 50 }}>{g.items.length}</span>
                      <span style={{ flex: 1, height: 1, background: CL.line }} />
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
                    {g.items.map((ch, i) => (
                      <ChapterCard key={`${active}-${ch.section || ""}-${ch.n}`} ch={ch} subject={subject} index={i} onOpen={(c) => setViewer({ chapter: c })} />
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* hint + CTA */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "10px 0 34px", fontSize: 12.5, color: CL.muted }}>
              <Keyboard size={15} /> Tip: open any chapter, then use ← / → to flip pages and +/− to zoom.
            </div>

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{
                background: `linear-gradient(120deg, ${subject.accent}, ${subject.dk})`,
                borderRadius: 22, padding: "30px 34px", display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: 20,
                boxShadow: `0 18px 44px ${subject.accent}33`,
              }}
            >
              <div>
                <h3 style={{ fontFamily: CL.display, fontWeight: 800, color: "#fff", fontSize: "1.35rem", margin: "0 0 6px" }}>
                  Revised the theory? See where your rank can take you.
                </h3>
                <p style={{ color: "rgba(255,255,255,.82)", fontSize: 14, margin: 0, maxWidth: 460, lineHeight: 1.6 }}>
                  Use the free College Predictor to find the institutes and branches your JEE score can unlock.
                </p>
              </div>
              <button onClick={() => nav("/jee-main#rank")} style={{
                display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: subject.dk,
                fontFamily: CL.display, fontWeight: 800, fontSize: 14, padding: "13px 24px", borderRadius: 50,
                border: "none", cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,.22)", whiteSpace: "nowrap",
              }}>
                Predict My Rank <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <MindMapViewer
        open={!!viewer}
        subjectId={active}
        chapter={viewer?.chapter}
        onClose={() => setViewer(null)}
      />
    </div>
  );
}

function HeroStat({ icon: Icon, value, label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 14, padding: "11px 16px", boxShadow: CL.shadow }}>
      <span style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon size={19} color={color} />
      </span>
      <div>
        <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.25rem", color: CL.ink, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11.5, color: CL.muted, marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}
