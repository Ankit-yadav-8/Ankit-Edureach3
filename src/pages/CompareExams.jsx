import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, GitCompare, ArrowRight, Sparkles, Crown, Flame, Target,
  Globe, TrendingUp,
} from "lucide-react";
import { EXAMS, EXAM_BY_SLUG } from "../data/exams.js";
import Seo from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";
import { CL, clEyebrow } from "../components/home/clTheme.js";
import { AiAnalyzing, Sparkline, MiniBar, rgba } from "../components/CompareAI.jsx";

/* Editorial "CP read" of each exam — difficulty (0-10), reach and
   competition (0-100). Indicative, used to drive the AI recommendation. */
const META = {
  "jee-main":     { d: 7.5, reach: 97, comp: 100, bestFor: "The widest net — NITs, IIITs, GFTIs and the gateway to JEE Advanced." },
  "jee-advanced": { d: 9.6, reach: 55, comp: 88,  bestFor: "The only route to the 23 IITs, and India's toughest UG paper." },
  "bitsat":       { d: 7.0, reach: 45, comp: 55,  bestFor: "A speed-and-accuracy test for the three elite BITS campuses." },
  "viteee":       { d: 4.5, reach: 40, comp: 60,  bestFor: "Low-stress, no negative marking — a strong private backup." },
  "mht-cet":      { d: 5.5, reach: 62, comp: 70,  bestFor: "Best value across Maharashtra's govt & private engineering seats." },
  "kcet":         { d: 4.8, reach: 58, comp: 52,  bestFor: "A calm gateway to Karnataka's government colleges." },
  "wbjee":        { d: 5.2, reach: 55, comp: 50,  bestFor: "The state route to West Bengal's govt & private institutes." },
  "comedk":       { d: 5.0, reach: 42, comp: 40,  bestFor: "One test for Karnataka's private-consortium colleges." },
};
const metaOf = (e) => META[e.slug] || { d: 5, reach: 50, comp: 50, bestFor: e.accepts };

const reachWord = (r) => (r >= 80 ? "Nationwide" : r >= 55 ? "State / multi-campus" : "Institute-level");
const compWord = (c) => (c >= 85 ? "Very high" : c >= 60 ? "High" : c >= 45 ? "Moderate" : "Lower");
const diffWord = (d) => (d >= 8.5 ? "Brutal" : d >= 7 ? "Hard" : d >= 5 ? "Moderate" : "Approachable");

const ROWS = [
  ["Full name", (e) => e.full],
  ["Conducting body", (e) => e.body],
  ["Level", (e) => e.level],
  ["Accepted by", (e) => e.accepts],
  ["Eligibility", (e) => e.eligibility?.[0] || "—"],
  ["Pattern", (e) => e.pattern?.[0] || "—"],
];

const STEPS = [
  "Reading eligibility, pattern & who accepts each exam",
  "Rating difficulty from 5-year cutoff trends",
  "Mapping college reach & competition",
  "Weighing effort against opportunity",
  "Picking where you should start",
];

export default function CompareExams() {
  const [picked, setPicked] = useState(["jee-main", "jee-advanced"]);
  const [showPicker, setShowPicker] = useState(false);
  const exams = picked.map((s) => EXAM_BY_SLUG[s]).filter(Boolean);
  const key = picked.join("|");

  const [phase, setPhase] = useState("result");
  const seen = useRef("");
  useEffect(() => {
    if (exams.length >= 2 && key !== seen.current) { seen.current = key; setPhase("analyzing"); }
  }, [key, exams.length]);

  const add = (slug) => { if (picked.length < 3 && !picked.includes(slug)) setPicked((p) => [...p, slug]); setShowPicker(false); };
  const remove = (slug) => setPicked((p) => p.filter((s) => s !== slug));

  const read = useMemo(() => {
    if (exams.length < 1) return null;
    const withMeta = exams.map((e) => ({ e, m: metaOf(e) }));
    const start = [...withMeta].sort((a, b) => b.m.reach - a.m.reach || a.m.d - b.m.d)[0];
    const toughest = [...withMeta].sort((a, b) => b.m.d - a.m.d)[0];
    const easiest = [...withMeta].sort((a, b) => a.m.d - b.m.d)[0];
    const fiercest = [...withMeta].sort((a, b) => b.m.comp - a.m.comp)[0];
    return { start: start.e, toughest: toughest.e, easiest: easiest.e, fiercest: fiercest.e };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page">
      <div className="container"><BackButton style={{ margin: "0 0 2px" }} /></div>
      <Seo
        title="Compare Engineering Exams — JEE Main vs Advanced vs BITSAT (AI read)"
        description="Side-by-side comparison of JEE Main, JEE Advanced, BITSAT and state exams with an AI read — difficulty, reach, competition, 5-year cutoff trends, pattern and eligibility on CollegeParichay."
        path="/compare-exams"
      />

      {/* Hero */}
      <section style={{ padding: "34px 0 8px" }}>
        <div className="container">
          <span style={clEyebrow}><GitCompare size={13} /> AI Exam Comparison</span>
          <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.5rem)", letterSpacing: "-0.5px", color: CL.ink, margin: "12px 0 6px" }}>
            Compare entrance exams, get an <span style={{ color: CL.coral }}>AI read</span>
          </h1>
          <p style={{ color: CL.body, maxWidth: 620 }}>
            Pick up to 3 exams to see difficulty, college reach, competition and 5-year cutoff trends side by side — then a plain-English take on where to start.
          </p>
        </div>
      </section>

      <div className="container section" style={{ paddingTop: 20 }}>
        <AnimatePresence mode="wait">
          {phase === "analyzing" ? (
            <AiAnalyzing key="ai" steps={STEPS} title="Reading these exams…" eyebrow="AI EXAM ENGINE" onDone={() => setPhase("result")} />
          ) : (
            <motion.div key="res" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              {/* AI read verdict */}
              {read && <ReadCard read={read} count={exams.length} />}

              {/* Intel cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "22px 0 26px" }} className="exam-intel">
                {exams.map((e, i) => (
                  <IntelCard key={e.slug} exam={e} idx={i} recommended={read && read.start.slug === e.slug}
                    removable={exams.length > 1} onRemove={() => remove(e.slug)} />
                ))}
                {exams.length < 3 && (
                  <button onClick={() => setShowPicker(true)}
                    style={{ minHeight: 180, border: `1.5px dashed ${CL.cream3}`, borderRadius: 18, background: CL.card, color: CL.coral, fontWeight: 700, fontFamily: CL.display, display: "grid", placeItems: "center", cursor: "pointer" }}>
                    <span style={{ display: "grid", justifyItems: "center", gap: 8 }}><Plus size={26} /> Add exam</span>
                  </button>
                )}
              </div>

              {/* Detail table */}
              <div style={{ overflowX: "auto", borderRadius: 18, border: `1px solid ${CL.line}`, boxShadow: CL.shadow, background: CL.card }}>
                <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: 130, padding: "14px", textAlign: "left" }}></th>
                      {exams.map((e) => (
                        <th key={e.slug} style={{ minWidth: 160, padding: "14px", textAlign: "left", borderBottom: `2px solid ${e.color}` }}>
                          <Link to={`/exams/${e.slug}`} style={{ fontFamily: CL.display, fontWeight: 800, color: CL.ink }}>{e.name}</Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map(([label, fn], ri) => (
                      <motion.tr key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + ri * 0.05 }}
                        style={{ borderBottom: `1px solid ${CL.line}` }}>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: CL.ink2, fontSize: 13 }}>{label}</td>
                        {exams.map((e) => <td key={e.slug} style={{ padding: "12px 14px", fontSize: 13.5, color: CL.body }}>{fn(e)}</td>)}
                      </motion.tr>
                    ))}
                    <tr>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: CL.ink2, fontSize: 13 }}>Details</td>
                      {exams.map((e) => (
                        <td key={e.slug} style={{ padding: "12px 14px" }}>
                          <Link to={`/exams/${e.slug}`} className="btn btn-ghost" style={{ fontSize: 12.5, padding: "6px 12px" }}>Open <ArrowRight size={13} /></Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showPicker && (
        <div onClick={() => setShowPicker(false)} style={{ position: "fixed", inset: 0, background: "rgba(33,29,46,.5)", zIndex: 80, display: "grid", placeItems: "center", padding: 16 }}>
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} onClick={(e) => e.stopPropagation()}
            className="card" style={{ width: "min(480px,100%)", maxHeight: "75vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontFamily: CL.display, fontWeight: 800, color: CL.ink }}>Add an exam</h3>
              <button onClick={() => setShowPicker(false)}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {EXAMS.filter((e) => !picked.includes(e.slug)).map((e) => (
                <button key={e.slug} onClick={() => add(e.slug)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 13px", borderRadius: 12, background: CL.cream2, border: `1px solid ${CL.line}`, textAlign: "left" }}>
                  <span><strong style={{ color: CL.ink }}>{e.name}</strong> <span style={{ fontSize: 12, color: CL.muted }}>· {e.body}</span></span>
                  <Plus size={16} color={CL.coral} />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ── AI read verdict ── */
function ReadCard({ read, count }) {
  const chips = [
    { icon: Flame, label: "Toughest", val: read.toughest.name },
    { icon: Target, label: "Most approachable", val: read.easiest.name },
    { icon: TrendingUp, label: "Fiercest competition", val: read.fiercest.name },
  ];
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
      style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${CL.ink} 0%, #2c2740 60%, ${rgba(CL.coral, 0.55)} 140%)`, borderRadius: 22, padding: "26px 26px 22px", color: "#fff", boxShadow: CL.shadowLg }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        style={{ position: "absolute", top: -70, right: -70, width: 200, height: 200, borderRadius: "50%", background: `conic-gradient(${rgba(CL.coral, 0.5)}, transparent 60%)`, filter: "blur(6px)", pointerEvents: "none" }} />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", background: "rgba(255,255,255,.14)", padding: "5px 13px", borderRadius: 50 }}>
        <Sparkles size={13} /> AI READ
      </span>
      <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.4rem,3.4vw,2rem)", letterSpacing: "-0.5px", margin: "14px 0 6px", position: "relative" }}>
        <Crown size={22} style={{ verticalAlign: "-3px", marginRight: 8 }} color={CL.amber} />
        Start with {read.start.name}
      </h2>
      <p style={{ color: "rgba(255,255,255,.82)", maxWidth: 640, fontSize: 14.5, lineHeight: 1.55, position: "relative" }}>
        Of these {count} exams, <b style={{ color: "#fff" }}>{read.start.name}</b> opens the most doors, so build your prep around it. {read.toughest.slug !== read.start.slug && <>Keep <b style={{ color: "#fff" }}>{read.toughest.name}</b> as your stretch target</>}{read.toughest.slug !== read.start.slug ? ", and " : ""}{read.easiest.slug !== read.start.slug && <>treat <b style={{ color: "#fff" }}>{read.easiest.name}</b> as a safety net.</>}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, position: "relative" }}>
        {chips.map((c) => (
          <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,.12)", padding: "6px 12px", borderRadius: 50 }}>
            <c.icon size={12} color={CL.amber} /> {c.label}: {c.val}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Per-exam intel card ── */
function IntelCard({ exam, idx, recommended, removable, onRemove }) {
  const m = metaOf(exam);
  const trend = (exam.cutoffTrend || []).map((t) => t.open);
  const meters = [
    { label: "Difficulty", cap: `${diffWord(m.d)} · ${m.d}/10`, pct: m.d / 10 },
    { label: "College reach", cap: reachWord(m.reach), pct: m.reach / 100 },
    { label: "Competition", cap: compWord(m.comp), pct: m.comp / 100 },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.08 }}
      style={{ position: "relative", background: CL.card, border: `1px solid ${recommended ? exam.color : CL.line}`, boxShadow: recommended ? `0 10px 34px ${rgba(exam.color, 0.22)}` : CL.shadow, borderRadius: 18, padding: "16px 16px 18px", overflow: "hidden" }}>
      <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: exam.color }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <Link to={`/exams/${exam.slug}`} style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 17, color: CL.ink }}>{exam.name}</Link>
        {removable && (
          <button onClick={onRemove} aria-label="Remove" style={{ marginLeft: "auto", display: "grid", placeItems: "center", width: 22, height: 22, borderRadius: "50%", background: CL.cream2, border: `1px solid ${CL.line}` }}>
            <X size={12} />
          </button>
        )}
      </div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, color: exam.color, background: rgba(exam.color, 0.1), padding: "3px 9px", borderRadius: 50, marginTop: 8 }}>
        <Globe size={11} /> {exam.level} · {exam.body}
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: 11, margin: "14px 0 4px" }}>
        {meters.map((mt, i) => (
          <div key={mt.label}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
              <span style={{ fontWeight: 700, color: CL.ink2 }}>{mt.label}</span>
              <span style={{ color: CL.muted, fontWeight: 600 }}>{mt.cap}</span>
            </div>
            <MiniBar pct={mt.pct} color={exam.color} delay={0.15 + i * 0.08} />
          </div>
        ))}
      </div>

      {trend.length > 1 && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${CL.line}` }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: CL.muted, marginBottom: 4 }}>
            OPEN cutoff · 5-yr trend
          </div>
          <Sparkline data={trend} color={exam.color} width={200} height={44} />
        </div>
      )}

      <p style={{ fontSize: 12.5, color: CL.body, lineHeight: 1.5, marginTop: 12 }}>{m.bestFor}</p>
    </motion.div>
  );
}
