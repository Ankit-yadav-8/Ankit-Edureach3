import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Clock, CheckCircle2, Loader2, Play, Trophy, Target, X,
  ChevronLeft, ChevronRight, Flag, Eraser, ListChecks, ExternalLink,
  AlertTriangle, RotateCcw, BookOpenCheck, Award, Flame, TrendingDown,
  Gauge, Timer, ZoomIn, Image as ImageIcon, Menu, BarChart3,
  CircleDot, Hash, Eye, EyeOff, XCircle,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiTestList, apiTestGet, apiTestSubmit, apiTestResult, apiTestPerformance } from "../../auth/api.js";
import { Trend } from "../Charts.jsx";
import MathText from "./MathText.jsx";
import { predictRank, predictNeetRank } from "../../utils/rankPredictor.js";
import { fmtRank } from "../../utils/format.js";

const SUBJECT_COLOR = { Physics: "#FF693D", Chemistry: "#0EA5A4", Maths: "#7C3AED", Biology: "#16a34a" };

// The CBT runs as a full-screen overlay (position:fixed). The mentorship
// dashboard wraps its content in a framer-motion <motion.div> whose `transform`
// makes `position:fixed` resolve against IT, not the viewport — which let the
// dashboard bleed through behind the player. Rendering the overlay in a portal to
// <body> escapes that transformed ancestor so it always covers the whole screen.
const Portal = ({ children }) => createPortal(children, document.body);

// Predict AIR + percentile from the graded result, scaling the paper to the real
// exam's marks (JEE Main /300, Advanced /360, NEET /720).
function predictForExam(examType, subjects, result) {
  const frac = result.maxMarks ? result.score / result.maxMarks : 0;
  if (examType === "neet") return predictNeetRank({ total: frac * 720 });
  if (examType === "mains" || examType === "advanced") {
    const cap = examType === "advanced" ? 120 : 100;
    const m = {};
    for (const s of subjects || []) if (s.maxMarks) m[s.name] = (s.score / s.maxMarks) * cap;
    const has = m.Physics != null || m.Chemistry != null || m.Maths != null;
    const each = frac * cap; // even split fallback when sections aren't tagged
    return predictRank({
      physics: has ? (m.Physics || 0) : each,
      chemistry: has ? (m.Chemistry || 0) : each,
      maths: has ? (m.Maths || 0) : each,
      advanced: examType === "advanced",
    });
  }
  return null;
}

const mmToHM = (sec) => {
  const m = Math.round((sec || 0) / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
};

const ORANGE = "#FF693D", NAVY = "#0d1b3e", GREEN = "#15a06e", INDIGO = "#6366f1", MUTE = "#6b7280";
const RED = "#ef4444", AMBER = "#f59e0b";

const CATS = [
  { key: "", label: "All" },
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "full", label: "Full / Major" },
];
const CAT_COLOR = { daily: RED, weekly: INDIGO, full: "#8b5cf6" };
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "");
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/* ═══════════════════════════════════════════════════════════════════
   IMAGE VIEWER — click-to-zoom lightbox for question / option images
   ═══════════════════════════════════════════════════════════════════ */
function QuestionImage({ src, alt = "Diagram", maxH = 280, style: extraStyle }) {
  const [zoom, setZoom] = useState(false);
  const [broken, setBroken] = useState(false);

  if (!src) return null;
  if (broken) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", color: "#92400e", fontSize: 12.5, marginBottom: 12, ...extraStyle }}>
        <ImageIcon size={16} /> Diagram could not be loaded — refer to the question paper.
      </div>
    );
  }

  return (
    <>
      <div style={{ position: "relative", display: "inline-block", cursor: "zoom-in", marginBottom: 16, width: "100%", ...extraStyle }}
        onClick={() => setZoom(true)}>
        <img src={src} alt={alt} onError={() => setBroken(true)}
          style={{ maxWidth: "100%", maxHeight: "500px", objectFit: "contain", borderRadius: 12, border: "1.5px solid #e2e8f0", display: "block", boxShadow: "0 4px 16px rgba(13,27,62,.08)", background: "#fff" }} />
        <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(13,27,62,.7)", color: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4, backdropFilter: "blur(4px)" }}>
          <ZoomIn size={12} /> Zoom
        </span>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {zoom && (
          <Portal>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setZoom(false)}
              style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.85)", display: "grid", placeItems: "center", padding: 20, cursor: "zoom-out" }}>
              <motion.img src={src} alt={alt} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                style={{ maxWidth: "95vw", maxHeight: "90vh", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }} />
              <button onClick={() => setZoom(false)}
                style={{ position: "fixed", top: 16, right: 16, background: "rgba(255,255,255,.15)", border: "none", borderRadius: "50%", width: 40, height: 40, display: "grid", placeItems: "center", cursor: "pointer", color: "#fff", backdropFilter: "blur(8px)" }}>
                <X size={20} />
              </button>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
}

/* OptionImage — variant for option figures (graphs/structures to choose between).
   maxH was 90px, which made four-graph options unreadable; bigger by default and
   still click-to-zoom for a full-size look. */
function OptionImage({ src, alt = "Option", maxH = 170 }) {
  const [zoom, setZoom] = useState(false);
  const [broken, setBroken] = useState(false);
  if (!src) return null;
  if (broken) return <span style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>[image unavailable]</span>;
  return (
    <>
      <img src={src} alt={alt} onClick={() => setZoom(true)} onError={() => setBroken(true)}
        style={{ maxHeight: maxH, maxWidth: "100%", objectFit: "contain", borderRadius: 8, cursor: "zoom-in", border: "1px solid #e5e7eb", background: "#fff", display: "block", marginBottom: 6 }} />
      <AnimatePresence>
        {zoom && (
          <Portal>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setZoom(false)}
              style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.85)", display: "grid", placeItems: "center", padding: 20, cursor: "zoom-out" }}>
              <motion.img src={src} alt={alt} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                style={{ maxWidth: "95vw", maxHeight: "90vh", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }} />
              <button onClick={() => setZoom(false)}
                style={{ position: "fixed", top: 16, right: 16, background: "rgba(255,255,255,.15)", border: "none", borderRadius: "50%", width: 40, height: 40, display: "grid", placeItems: "center", cursor: "pointer", color: "#fff" }}>
                <X size={20} />
              </button>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   TEST SERIES — list of tests for the batch + CBT launcher
   ════════════════════════════════════════════════════════════════ */
export default function TestSeries({ plan }) {
  const { token } = useAuth();
  const [cat, setCat] = useState("");
  const [examFilter, setExamFilter] = useState(""); // "" | mains | advanced (JEE only)
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [perf, setPerf] = useState(null);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true); setErr("");
    apiTestList(token, plan, cat || undefined)
      .then((d) => setTests(d.tests || []))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [token, plan, cat]);

  const loadPerf = useCallback(() => {
    if (!token) return;
    apiTestPerformance(token, plan).then(setPerf).catch(() => {});
  }, [token, plan]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadPerf(); }, [loadPerf]);

  const showExamFilter = tests.some((t) => t.examType === "mains" || t.examType === "advanced");
  const shown = examFilter ? tests.filter((t) => t.examType === examFilter) : tests;

  return (
    <div>
      {/* performance summary — fed by graded CBT attempts */}
      {perf && perf.testsAttempted > 0 && <PerfStrip perf={perf} />}

      {/* category filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {CATS.map((c) => {
          const on = cat === c.key;
          return (
            <button key={c.key} onClick={() => setCat(c.key)}
              style={{ padding: "7px 15px", borderRadius: 50, border: `1.5px solid ${on ? ORANGE : "#e5e7eb"}`, background: on ? ORANGE : "#fff", color: on ? "#fff" : NAVY, fontFamily: "Sora", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s" }}>
              {c.label}
            </button>
          );
        })}
      </div>

      {/* JEE exam-pattern filter — only when the batch has JEE Mains/Advanced tests */}
      {showExamFilter && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {[{ k: "", l: "All patterns" }, { k: "mains", l: "JEE Mains" }, { k: "advanced", l: "JEE Advanced" }].map((e) => {
            const on = examFilter === e.k;
            return (
              <button key={e.k} onClick={() => setExamFilter(e.k)}
                style={{ padding: "6px 14px", borderRadius: 50, border: `1.5px solid ${on ? NAVY : "#e5e7eb"}`, background: on ? NAVY : "#fff", color: on ? "#fff" : NAVY, fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                {e.l}
              </button>
            );
          })}
        </div>
      )}

      {err && (
        <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={15} /> {err}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: MUTE, padding: 20 }}><Loader2 size={16} className="ts-spin" /> Loading tests…</div>
      ) : shown.length === 0 ? (
        <div style={{ background: "#fff", border: "1px dashed #e5d3c4", borderRadius: 16, padding: "40px 20px", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${ORANGE}12`, display: "grid", placeItems: "center", margin: "0 auto 12px" }}><FileText size={22} color={ORANGE} /></div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 15 }}>No tests yet</div>
          <div style={{ fontSize: 13, color: MUTE, marginTop: 4 }}>Your mentor will upload daily, weekly and full tests here.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 14 }}>
          {shown.map((t) => (
            <TestCard key={t.id} t={t} onStart={() => setActiveId(t.id)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {activeId && (
          <CbtPlayer token={token} plan={plan} testId={activeId}
            onClose={() => setActiveId(null)}
            onSubmitted={() => { setActiveId(null); load(); loadPerf(); }} />
        )}
      </AnimatePresence>

      <style>{`@keyframes tsSpin{to{transform:rotate(360deg)}}.ts-spin{display:inline-block;animation:tsSpin .8s linear infinite}`}</style>
    </div>
  );
}

/* Aggregate CBT performance — the "test record auto-uploaded to performance". */
function PerfStrip({ perf }) {
  const cells = [
    { label: "Tests taken", value: perf.testsAttempted, color: INDIGO, icon: <ListChecks size={15} color={INDIGO} /> },
    { label: "Avg score", value: `${perf.avgPercent}%`, color: ORANGE, icon: <Target size={15} color={ORANGE} /> },
    { label: "Avg accuracy", value: `${perf.avgAccuracy}%`, color: GREEN, icon: <CheckCircle2 size={15} color={GREEN} /> },
    { label: "Best score", value: `${perf.bestPercent}%`, color: "#8b5cf6", icon: <Trophy size={15} color="#8b5cf6" /> },
  ];
  return (
    <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 16, marginBottom: 16, boxShadow: "0 14px 36px -30px rgba(13,27,62,.5)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: "#ecfeff", display: "grid", placeItems: "center" }}><Target size={15} color="#0ea5a4" /></span>
        <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 14.5 }}>Your CBT performance</div>
      </div>
      <div className="ts-perf" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr) 1.4fr", gap: 12, alignItems: "stretch" }}>
        {cells.map((c) => (
          <div key={c.label} style={{ background: "#f8fafc", borderRadius: 12, padding: "11px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>{c.icon}<span style={{ fontSize: 11, color: MUTE, fontWeight: 600 }}>{c.label}</span></div>
            <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 20, color: NAVY, marginTop: 4 }}>{c.value}</div>
          </div>
        ))}
        <div style={{ background: "#f8fafc", borderRadius: 12, padding: "8px 10px", minWidth: 0 }}>
          <div style={{ fontSize: 11, color: MUTE, fontWeight: 600, marginBottom: 2 }}>Score trend</div>
          {perf.trend?.length > 1 ? (
            <Trend data={perf.trend} lines={[{ key: "score", label: "Score", color: ORANGE }, { key: "acc", label: "Acc.", color: GREEN }]} height={92} fmt={(v) => `${v}%`} />
          ) : (
            <div style={{ fontSize: 12, color: "#9ca3af", padding: "14px 0" }}>Take another test to see your trend.</div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:680px){.ts-perf{grid-template-columns:1fr 1fr !important}}`}</style>
    </div>
  );
}

function TestCard({ t, onStart }) {
  const color = CAT_COLOR[t.category] || ORANGE;
  const done = t.attempted;
  return (
    <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 10px 30px -24px rgba(13,27,62,.5)", transition: "box-shadow .2s, transform .2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 16px 40px -20px rgba(13,27,62,.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 10px 30px -24px rgba(13,27,62,.5)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color, background: `${color}14`, borderRadius: 50, padding: "4px 10px" }}>
            <FileText size={12} /> {t.categoryLabel}
          </span>
          {t.examTypeLabel && t.examType !== "standard" && (
            <span style={{ fontSize: 11, fontWeight: 800, color: NAVY, background: "#eef2ff", borderRadius: 50, padding: "4px 10px" }}>{t.examTypeLabel}</span>
          )}
        </div>
        {done && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 800, color: GREEN, background: "#dcfce7", borderRadius: 50, padding: "4px 9px" }}><CheckCircle2 size={12} /> Done</span>}
      </div>
      <div>
        <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, color: NAVY, lineHeight: 1.3 }}>{t.title}</div>
        <div style={{ fontSize: 12, color: MUTE, marginTop: 5, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span>{t.totalQuestions} Qs · {t.maxMarks} marks</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {t.durationMin}m</span>
          {t.createdAt && <span>{fmtDate(t.createdAt)}</span>}
        </div>
      </div>

      {done && t.result ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", borderRadius: 12, padding: "10px 12px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 18, color: NAVY }}>{t.result.score}<span style={{ fontSize: 12, color: MUTE, fontWeight: 700 }}> / {t.result.maxMarks}</span></div>
            <div style={{ fontSize: 11, color: MUTE }}>{t.result.percent}% · {t.result.accuracy}% accuracy</div>
          </div>
          <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: `1.5px solid ${color}`, color, borderRadius: 10, padding: "8px 12px", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "Sora", transition: "all .15s" }}>
            <RotateCcw size={13} /> Reattempt
          </button>
        </div>
      ) : (
        <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#fff", border: "none", borderRadius: 11, padding: "11px 0", fontWeight: 800, fontFamily: "Sora", fontSize: 14, cursor: "pointer", boxShadow: `0 10px 24px -12px ${color}`, transition: "all .15s" }}>
          <Play size={15} /> Start Test
        </button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CBT PLAYER — NTA-style: question pane on the left, palette +
   answers on the right, live timer with progress bar, auto-grade
   on submit, then solutions review.
   ════════════════════════════════════════════════════════════════ */
// Support both numeric ("1","2","3","4") and letter ("A","B","C","D") option keys
const OPT_LABELS = ["A", "B", "C", "D"];

function CbtPlayer({ token, plan, testId, onClose, onSubmitted }) {
  const { user } = useAuth();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [stage, setStage] = useState("instructions"); // instructions | test
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // qno -> choice
  const [marked, setMarked] = useState({});   // qno -> bool (review)
  const [visited, setVisited] = useState({});
  const [left, setLeft] = useState(0);        // seconds remaining
  const [totalTime, setTotalTime] = useState(0); // total seconds for progress
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [palOpen, setPalOpen] = useState(false); // mobile palette drawer
  const [animDir, setAnimDir] = useState(1); // 1=forward, -1=backward
  const startRef = useRef(Date.now());

  useEffect(() => {
    let alive = true;
    apiTestGet(token, testId, plan)
      .then((d) => {
        if (!alive) return;
        setTest(d);
        const secs = (d.durationMin || 60) * 60;
        setLeft(secs);
        setTotalTime(secs);
      })
      .catch((e) => alive && setErr(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [token, testId, plan]);

  const questions = test?.questions || [];
  const q = questions[idx];

  // Sections (subject tabs). Falls back to one untitled section for old tests.
  const sections = useMemo(() => {
    const ss = test?.subjectSections?.length ? test.subjectSections : null;
    if (ss) {
      const built = ss
        .map((s) => ({ name: s.name, items: (s.qnos || []).map((qno) => ({ qno, gi: questions.findIndex((x) => x.qno === qno) })).filter((x) => x.gi >= 0) }))
        .filter((s) => s.items.length);
      // Gather any question NOT in a subject section into a trailing "Other" tab
      const covered = new Set();
      built.forEach((s) => s.items.forEach((it) => covered.add(it.gi)));
      const leftover = questions.map((_, gi) => gi).filter((gi) => !covered.has(gi));
      if (leftover.length) built.push({ name: "Other", items: leftover.map((gi) => ({ qno: questions[gi].qno, gi })) });
      if (built.length) return built;
    }
    // Fallback: try grouping by subject field on questions
    const subjectGroups = {};
    questions.forEach((qq, gi) => {
      const sub = qq.subject || "";
      if (!subjectGroups[sub]) subjectGroups[sub] = [];
      subjectGroups[sub].push({ qno: qq.qno, gi });
    });
    const keys = Object.keys(subjectGroups).filter(Boolean);
    if (keys.length > 1) {
      return keys.map((name) => ({ name, items: subjectGroups[name] }));
    }
    return [{ name: "", items: questions.map((x, gi) => ({ qno: x.qno, gi })) }];
  }, [test, questions]);

  const curSecIdx = Math.max(0, sections.findIndex((s) => s.items.some((it) => it.gi === idx)));
  const curSec = sections[curSecIdx] || sections[0];
  const posInSec = curSec ? curSec.items.findIndex((it) => it.gi === idx) : 0;

  // countdown — only while actually taking the test; auto-submits at zero.
  useEffect(() => {
    if (stage !== "test" || result || !test) return;
    if (left <= 0) { doSubmit(); return; }
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [left, stage, result, test]);

  // Per-subject time tracking
  const segRef = useRef({ subject: null, ts: Date.now() });
  const accumRef = useRef({});
  const curSubject = curSec?.name || "";
  useEffect(() => {
    if (stage !== "test") return;
    const seg = segRef.current;
    if (seg.subject != null) accumRef.current[seg.subject] = (accumRef.current[seg.subject] || 0) + (Date.now() - seg.ts);
    segRef.current = { subject: curSubject, ts: Date.now() };
  }, [curSubject, stage]);

  function buildSectionTimes() {
    const acc = { ...accumRef.current };
    const seg = segRef.current;
    if (seg.subject != null) acc[seg.subject] = (acc[seg.subject] || 0) + (Date.now() - seg.ts);
    const out = {};
    for (const k in acc) if (k) out[k] = Math.round(acc[k] / 1000);
    return out;
  }

  const goto = (i) => {
    if (i < 0 || i >= questions.length) return;
    setAnimDir(i > idx ? 1 : -1);
    setIdx(i);
    setVisited((v) => ({ ...v, [questions[i]?.qno]: true }));
  };
  const startTest = () => { setStage("test"); startRef.current = Date.now(); segRef.current = { subject: questions[0]?.subject || "", ts: Date.now() }; setVisited({ [questions[0]?.qno]: true }); };

  const choose = (val) => setAnswers((a) => ({ ...a, [q.qno]: val }));
  const clearAns = () => setAnswers((a) => { const n = { ...a }; delete n[q.qno]; return n; });
  const toggleMark = () => setMarked((m) => ({ ...m, [q.qno]: !m[q.qno] }));

  const counts = useMemo(() => {
    let answered = 0, markedC = 0, notVisited = 0;
    for (const qq of questions) {
      const a = answers[qq.qno] !== undefined && answers[qq.qno] !== "";
      if (a) answered++;
      if (marked[qq.qno]) markedC++;
      if (!visited[qq.qno]) notVisited++;
    }
    return { answered, marked: markedC, notVisited, total: questions.length, notAnswered: questions.length - answered };
  }, [questions, answers, marked, visited]);

  async function doSubmit() {
    if (submitting || result) return;
    setSubmitting(true); setErr("");
    try {
      const durationSec = Math.round((Date.now() - startRef.current) / 1000);
      const d = await apiTestSubmit(token, testId, { answers, durationSec, sectionTimes: buildSectionTimes() }, plan);
      setResult(d.result);
    } catch (e) { setErr(e.message); setConfirm(false); }
    finally { setSubmitting(false); }
  }

  const palStatus = (qq) => {
    const ans = answers[qq.qno] !== undefined && answers[qq.qno] !== "";
    if (marked[qq.qno]) return ans ? "ansmarked" : "marked";
    if (ans) return "answered";
    if (visited[qq.qno]) return "notanswered";
    return "notvisited";
  };
  const PAL_BG = { answered: GREEN, ansmarked: "#8b5cf6", marked: "#8b5cf6", notanswered: RED, notvisited: "#fff" };
  const PAL_FG = { answered: "#fff", ansmarked: "#fff", marked: "#fff", notanswered: "#fff", notvisited: NAVY };

  const candidate = user?.name || (user?.email ? user.email.split("@")[0] : "Candidate");

  // Timer progress
  const timerFrac = totalTime > 0 ? left / totalTime : 1;
  const timerColor = timerFrac > 0.33 ? GREEN : timerFrac > 0.1 ? AMBER : RED;

  // ── Loading / error ────────────────────────────────────────────────────────
  if (loading || (err && !test)) {
    return (
      <Portal>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: "fixed", inset: 0, zIndex: 5000, background: "#eef0f4", display: "grid", placeItems: "center" }}>
        {loading ? <Loader2 size={24} className="ts-spin" color={MUTE} /> : (
          <div style={{ textAlign: "center", padding: 24 }}>
            <AlertTriangle size={28} color={RED} />
            <div style={{ marginTop: 10, color: NAVY, fontWeight: 700 }}>{err}</div>
            <button onClick={onClose} style={{ marginTop: 14, background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, cursor: "pointer" }}>Close</button>
          </div>
        )}
      </motion.div>
      </Portal>
    );
  }

  // ── Result ──────────────────────────────────────────────────────────────────
  if (result) {
    return (
      <Portal>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: "fixed", inset: 0, zIndex: 5000, background: "#f4f6fb", display: "flex", flexDirection: "column" }}>
        <ResultView token={token} plan={plan} testId={testId} result={result} onClose={onSubmitted} />
      </motion.div>
      </Portal>
    );
  }

  // ── Pre-test General Instructions ────────────────────────────────────────────
  if (stage === "instructions") {
    return (
      <InstructionsScreen test={test} sections={sections} candidate={candidate} left={left}
        onProceed={startTest} onClose={onClose} />
    );
  }

  // ── Helper: get options for a question ─────────────────────────────────────
  const qOptions = q?.options?.length ? q.options : [];
  const displayOptions = OPT_LABELS.map((label, i) => {
    // Try matching by key (supports "1"/"2"/"3"/"4" or "A"/"B"/"C"/"D" or "a"/"b"/"c"/"d")
    const byKey = qOptions.find((o) => String(o.key).toUpperCase() === label || String(o.key) === String(i + 1));
    const byIdx = qOptions[i];
    const opt = byKey || byIdx;
    const key = opt?.key || String(i + 1);
    return { label, key, text: opt?.text || "", image: opt?.image || "" };
  });

  // ── Test interface ───────────────────────────────────────────────────────────
  return (
    <Portal>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 5000, background: "#eef0f4", display: "flex", flexDirection: "column" }}>
      {/* top bar — title + candidate + timer + progress bar */}
      <div style={{ background: NAVY, color: "#fff", flexShrink: 0 }}>
        <div style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{test?.title}</div>

          {/* Question counter */}
          <div style={{ background: "rgba(255,255,255,.1)", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
            Q {idx + 1} / {questions.length}
          </div>

          {/* Timer */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: left < 60 ? "#7f1d1d" : "rgba(255,255,255,.12)", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontVariantNumeric: "tabular-nums", fontSize: 15, transition: "background .3s" }}>
            <Clock size={15} /> {mmss(Math.max(0, left))}
          </div>

          {/* Candidate avatar */}
          <div className="cbt-candidate" style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 6, borderLeft: "1px solid rgba(255,255,255,.18)" }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: ORANGE, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13 }}>{candidate[0]?.toUpperCase()}</span>
            <span style={{ fontSize: 13, fontWeight: 700, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{candidate}</span>
          </div>

          {/* Submit button */}
          <button onClick={() => setConfirm(true)} disabled={submitting}
            style={{ background: `linear-gradient(135deg, ${ORANGE}, #E0421F)`, color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: 800, fontFamily: "Sora", fontSize: 13.5, cursor: "pointer", boxShadow: `0 6px 16px -6px ${ORANGE}`, transition: "all .15s" }}>Submit Test</button>

          {/* Mobile palette toggle */}
          <button className="cbt-pal-toggle" onClick={() => setPalOpen((o) => !o)}
            style={{ display: "none", background: "rgba(255,255,255,.15)", border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: "#fff" }}>
            <Menu size={18} />
          </button>
        </div>

        {/* Timer progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,.1)" }}>
          <div style={{ height: "100%", width: `${timerFrac * 100}%`, background: timerColor, transition: "width 1s linear, background .5s", borderRadius: "0 3px 3px 0" }} />
        </div>
      </div>

      {/* section tabs */}
      {sections.length > 1 && (
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "8px 16px", display: "flex", gap: 8, flexShrink: 0, overflowX: "auto" }}>
          {sections.map((s, i) => {
            const on = i === curSecIdx;
            const col = SUBJECT_COLOR[s.name] || INDIGO;
            const secAnswered = s.items.filter((it) => answers[questions[it.gi]?.qno] !== undefined && answers[questions[it.gi]?.qno] !== "").length;
            return (
              <button key={s.name || i} onClick={() => goto(s.items[0].gi)}
                style={{ padding: "7px 16px", borderRadius: 50, border: `1.5px solid ${on ? col : "#e5e7eb"}`, background: on ? col : "#fff", color: on ? "#fff" : NAVY, fontFamily: "Sora", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all .15s", position: "relative" }}>
                {s.name || "Section"} <span style={{ opacity: .7, fontWeight: 600 }}>· {secAnswered}/{s.items.length}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Even for single-section tests, show a subject badge */}
      {sections.length === 1 && sections[0].name && (
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "6px 16px", display: "flex", gap: 8, flexShrink: 0 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: SUBJECT_COLOR[sections[0].name] || INDIGO, background: `${SUBJECT_COLOR[sections[0].name] || INDIGO}14`, borderRadius: 50, padding: "5px 14px" }}>
            {sections[0].name} · {sections[0].items.length} Questions
          </span>
        </div>
      )}

      <div className="cbt-grid" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 320px", minHeight: 0 }}>
        {/* question pane */}
        <div style={{ background: "#fff", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* question header */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #eef2f7", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 16 }}>Question {posInSec + 1}</span>
              {q?.subject && (
                <span style={{ fontSize: 11, fontWeight: 800, color: SUBJECT_COLOR[q.subject] || INDIGO, background: `${SUBJECT_COLOR[q.subject] || INDIGO}14`, borderRadius: 50, padding: "3px 10px" }}>
                  {q.subject}
                </span>
              )}
              <span style={{ fontSize: 11.5, fontWeight: 700, color: MUTE, textTransform: "uppercase", letterSpacing: ".03em", display: "inline-flex", alignItems: "center", gap: 4 }}>
                {q?.type === "integer" ? <><Hash size={12} /> Numerical</> : <><CircleDot size={12} /> Single Choice</>}
              </span>
            </div>
            {q?.marks && (
              <div style={{ display: "inline-flex", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: GREEN, background: "#dcfce7", borderRadius: 50, padding: "3px 10px" }}>+{q.marks.correct} Marks</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: RED, background: "#fee2e2", borderRadius: 50, padding: "3px 10px" }}>{q.marks.wrong} Negative</span>
              </div>
            )}
          </div>

          {/* question body with animation */}
          <div style={{ padding: 0, overflowY: "auto", flex: 1, position: "relative" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={idx}
                initial={{ x: animDir * 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: animDir * -40, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ padding: "20px 24px" }}>

                {/* Question text */}
                {q?.text && (
                  <div style={{ fontSize: 15.5, color: NAVY, lineHeight: 1.8, marginBottom: q?.image ? 14 : 18 }}>
                    <MathText text={q.text} />
                  </div>
                )}

                {/* Question image with zoom */}
                <QuestionImage src={q?.image} alt={`Question ${q?.qno}`} />

                {/* Fallback when no text and no image */}
                {!q?.text && !q?.image && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: MUTE, marginBottom: 16, fontStyle: "italic", background: "#f8fafc", padding: "10px 14px", borderRadius: 10 }}>
                    <Eye size={15} /> Refer to the question paper for this question. Choose your answer below.
                  </div>
                )}

                {/* Answer input */}
                {q?.type === "integer" ? (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: MUTE, marginBottom: 8 }}>Enter your numerical answer:</div>
                    <input value={answers[q.qno] ?? ""} onChange={(e) => choose(e.target.value.replace(/[^0-9.\-]/g, ""))}
                      placeholder="Type your numerical answer here"
                      inputMode="decimal"
                      style={{ width: "100%", maxWidth: 360, height: 52, padding: "0 16px", borderRadius: 14, border: `2px solid ${answers[q.qno] ? ORANGE : "#e5e7eb"}`, fontSize: 18, fontWeight: 700, color: NAVY, outline: "none", boxSizing: "border-box", background: answers[q.qno] ? `${ORANGE}08` : "#fff", transition: "all .15s", fontFamily: "inherit" }} />
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12, maxWidth: 860 }}>
                    {displayOptions.map((opt, i) => {
                      const on = answers[q?.qno] === opt.key;
                      const hasText = opt.text && opt.text.trim();
                      const hasImage = opt.image;
                      const isEmpty = !hasText && !hasImage;
                      return (
                        <motion.button key={opt.key}
                          onClick={() => choose(opt.key)}
                          whileHover={{ scale: 1.02, boxShadow: "0 8px 24px -8px rgba(0,0,0,0.12)", borderColor: on ? ORANGE : "#cbd5e1" }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                            border: `2px solid ${on ? ORANGE : "#e2e8f0"}`,
                            background: on ? `${ORANGE}0c` : "#fff",
                            borderRadius: 16, padding: "16px 20px", cursor: "pointer",
                            transition: "all .2s ease", minHeight: 64,
                            boxShadow: on ? `0 8px 24px -8px ${ORANGE}50` : "0 2px 8px rgba(0,0,0,0.02)",
                          }}>
                          {/* Option letter badge */}
                          <span style={{
                            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                            display: "grid", placeItems: "center", fontWeight: 800, fontFamily: "Sora", fontSize: 14,
                            background: on ? `linear-gradient(135deg, ${ORANGE}, #E0421F)` : "#f1f5f9",
                            color: on ? "#fff" : NAVY,
                            transition: "all .15s",
                            boxShadow: on ? `0 4px 12px -4px ${ORANGE}` : "none",
                          }}>
                            {opt.label}
                          </span>

                          {/* Option content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {hasImage && <OptionImage src={opt.image} alt={`Option ${opt.label}`} />}
                            {hasText && (
                              <span style={{ fontSize: 14.5, color: NAVY, lineHeight: 1.6, display: "block" }}>
                                <MathText text={opt.text} />
                              </span>
                            )}
                            {isEmpty && (
                              <span style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>
                                Option {opt.label} — refer to the question paper
                              </span>
                            )}
                          </div>

                          {/* Selected checkmark */}
                          {on && <CheckCircle2 size={20} color={ORANGE} style={{ flexShrink: 0 }} />}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* bottom nav */}
          <div style={{ borderTop: "1px solid #eef2f7", padding: "16px 20px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", background: "#fff", boxShadow: "0 -4px 20px rgba(13,27,62,0.04)" }}>
            <button onClick={() => goto(idx - 1)} disabled={idx === 0}
              style={{ ...ctlBtn("#fff", NAVY), opacity: idx === 0 ? 0.4 : 1 }}>
              <ChevronLeft size={15} /> Previous
            </button>
            <button onClick={() => { toggleMark(); goto(idx + 1); }}
              style={ctlBtn("#ede9fe", "#7c3aed")}>
              <Flag size={14} /> Mark &amp; Next
            </button>
            <div style={{ flex: 1, textAlign: "center", fontSize: 12, color: MUTE, fontWeight: 600 }}>
              {counts.answered} of {counts.total} answered
            </div>
            <button onClick={clearAns} style={ctlBtn("#fff", MUTE)}>
              <Eraser size={14} /> Clear
            </button>
            <button onClick={() => goto(idx + 1)} disabled={idx >= questions.length - 1}
              style={{ ...ctlBtn(NAVY, "#fff"), opacity: idx >= questions.length - 1 ? 0.4 : 1 }}>
              Save &amp; Next <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* palette pane */}
        <div className="cbt-palette" style={{ background: "#fff", borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* palette header */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 13.5, display: "flex", alignItems: "center", gap: 7 }}>
              <ListChecks size={15} color={ORANGE} /> Question Palette
            </div>
            {/* Mobile close */}
            <button className="cbt-pal-close" onClick={() => setPalOpen(false)}
              style={{ display: "none", background: "none", border: "none", color: MUTE, cursor: "pointer" }}>
              <X size={18} />
            </button>
          </div>

          {/* legend */}
          <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 10px", fontSize: 10.5, color: MUTE, borderBottom: "1px solid #eef2f7" }}>
            <Legend c={GREEN} t={`Answered ${counts.answered}`} />
            <Legend c={RED} t={`Not answered ${Math.max(0, counts.total - counts.answered - counts.notVisited)}`} />
            <Legend c="#8b5cf6" t={`Marked ${counts.marked}`} />
            <Legend c="#cbd5e1" t={`Not visited ${counts.notVisited}`} />
          </div>

          {/* Progress bar */}
          <div style={{ padding: "10px 14px 6px", borderBottom: "1px solid #eef2f7" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MUTE, marginBottom: 6 }}>
              <span>Progress</span>
              <span style={{ fontWeight: 700, color: NAVY }}>{Math.round((counts.answered / Math.max(1, counts.total)) * 100)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: "#eef0f5", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(counts.answered / Math.max(1, counts.total)) * 100}%`, background: `linear-gradient(90deg, ${GREEN}, #22c55e)`, borderRadius: 4, transition: "width .3s" }} />
            </div>
          </div>

          {/* section-grouped palette buttons */}
          <div style={{ padding: "12px 14px", overflowY: "auto", flex: 1 }}>
            {sections.map((sec, si) => (
              <div key={sec.name || si} style={{ marginBottom: sections.length > 1 ? 16 : 0 }}>
                {sections.length > 1 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, position: "sticky", top: 0, background: "#fff", paddingTop: 2, paddingBottom: 2, zIndex: 1 }}>
                    <div style={{ width: 4, height: 14, borderRadius: 3, background: SUBJECT_COLOR[sec.name] || INDIGO }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: SUBJECT_COLOR[sec.name] || NAVY }}>{sec.name || "Section"}</span>
                    <span style={{ fontSize: 10.5, color: MUTE, fontWeight: 600 }}>
                      {sec.items.filter((it) => answers[questions[it.gi]?.qno] !== undefined && answers[questions[it.gi]?.qno] !== "").length}/{sec.items.length}
                    </span>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 7 }}>
                  {sec.items.map((it, i) => {
                    const st = palStatus(questions[it.gi]);
                    const isCurrent = it.gi === idx;
                    return (
                      <button key={it.qno} onClick={() => goto(it.gi)}
                        style={{
                          height: 40, borderRadius: 10,
                          border: isCurrent ? `2.5px solid ${ORANGE}` : `1.5px solid ${st === "notvisited" ? "#cbd5e1" : PAL_BG[st]}`,
                          background: PAL_BG[st], color: PAL_FG[st],
                          fontWeight: 800, fontSize: 13, cursor: "pointer",
                          transition: "all .12s",
                          boxShadow: isCurrent ? `0 0 0 2px ${ORANGE}40` : "none",
                        }}>
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* submit confirmation */}
      <AnimatePresence>
        {confirm && !result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirm(false)}
            style={{ position: "fixed", inset: 0, zIndex: 5100, background: "rgba(13,27,62,.55)", display: "grid", placeItems: "center", padding: 20 }}>
            <motion.div initial={{ scale: .94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "min(440px,100%)", background: "#fff", borderRadius: 20, padding: "28px 24px", textAlign: "center", boxShadow: "0 30px 60px -20px rgba(13,27,62,.3)" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FFF1E9", display: "grid", placeItems: "center", margin: "0 auto 14px" }}><ListChecks size={26} color={ORANGE} /></div>
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, margin: "0 0 8px", fontSize: 18 }}>Submit the test?</h3>
              <p style={{ color: MUTE, fontSize: 13.5, margin: "0 0 14px", lineHeight: 1.5 }}>Answered <b style={{ color: GREEN }}>{counts.answered}</b> of {counts.total}. Unanswered questions score 0.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                <MiniStat n={counts.answered} label="Answered" c={GREEN} />
                <MiniStat n={counts.total - counts.answered} label="Unanswered" c={RED} />
                <MiniStat n={counts.marked} label="Marked" c="#8b5cf6" />
              </div>
              {err && <div style={{ color: RED, fontSize: 12.5, marginBottom: 8 }}>{err}</div>}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setConfirm(false)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: NAVY, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Keep going</button>
                <button onClick={doSubmit} disabled={submitting} style={{ flex: 1.3, padding: "12px 0", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${ORANGE}, #E0421F)`, color: "#fff", fontWeight: 800, fontFamily: "Sora", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 14, boxShadow: `0 8px 20px -8px ${ORANGE}` }}>
                  {submitting ? <Loader2 size={16} className="ts-spin" /> : <CheckCircle2 size={16} />} Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile palette overlay */}
      <AnimatePresence>
        {palOpen && (
          <motion.div className="cbt-pal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPalOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 5050, background: "rgba(13,27,62,.4)", display: "none" }}>
            <motion.div initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(320px,85vw)", background: "#fff", boxShadow: "-10px 0 40px rgba(13,27,62,.2)" }}>
              {/* Re-render palette content inside the drawer */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width:820px){
          .cbt-grid{grid-template-columns:1fr !important}
          .cbt-palette{display:none !important}
          .cbt-pal-toggle{display:flex !important}
          .cbt-candidate{display:none !important}
        }
        @media(max-width:500px){
          .cbt-grid{grid-template-columns:1fr !important}
        }
      `}</style>
    </motion.div>
    </Portal>
  );
}

const MiniStat = ({ n, label, c }) => (
  <div style={{ background: `${c}10`, borderRadius: 12, padding: "10px 4px" }}>
    <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 20, color: c }}>{n}</div>
    <div style={{ fontSize: 10.5, color: MUTE }}>{label}</div>
  </div>
);

/* ── Pre-test General Instructions (NTA-style) ─────────────────────────────── */
function InstructionsScreen({ test, sections, candidate, left, onProceed, onClose }) {
  const [agree, setAgree] = useState(false);
  const [lang, setLang] = useState("English");
  const legend = [
    { c: "#cbd5e1", t: "You have not visited the question yet." },
    { c: RED, t: "You have not answered the question." },
    { c: GREEN, t: "You have answered the question." },
    { c: "#8b5cf6", t: "You have NOT answered, but marked for review." },
  ];
  return (
    <Portal>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 5000, background: "#f4f6fb", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 16, flex: 1 }}>{test?.title}</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10.5, color: MUTE, fontWeight: 700, letterSpacing: ".05em" }}>TIME REMAINING</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontVariantNumeric: "tabular-nums" }}>{mmss(left)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 12, borderLeft: "1px solid #eef2f7" }}>
          <span style={{ width: 32, height: 32, borderRadius: "50%", background: ORANGE, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800 }}>{candidate[0]?.toUpperCase()}</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{candidate}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16 }} className="instr-grid">
          {/* instructions */}
          <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 16, margin: 0, display: "flex", alignItems: "center", gap: 8 }}><FileText size={17} color={ORANGE} /> General Instructions</h3>
              <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, background: "#eef2ff", borderRadius: 50, padding: "4px 12px" }}>Duration: {test?.durationMin} Mins</span>
            </div>
            <ol style={{ margin: 0, paddingLeft: 18, color: "#374151", fontSize: 13, lineHeight: 1.7 }}>
              <li style={{ marginBottom: 10 }}><b style={{ color: NAVY }}>General:</b> The total duration is {test?.durationMin} minutes. The server clock counts down the time remaining; the exam ends automatically when it reaches zero.</li>
              <li style={{ marginBottom: 10 }}>
                <b style={{ color: NAVY }}>Question Palette:</b> the colour of each question button shows its status:
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  {legend.map((l, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: l.c, flexShrink: 0 }} /> {l.t}
                    </div>
                  ))}
                </div>
              </li>
              <li style={{ marginBottom: 10 }}><b style={{ color: NAVY }}>Answering:</b> click an option to select it; click <b>Clear Response</b> to deselect. You MUST click <b>Save &amp; Next</b> to save an answer.</li>
              <li><b style={{ color: NAVY }}>Sections:</b> you can attempt the sections in any order and move freely between questions using the palette.</li>
            </ol>
            <div style={{ marginTop: 14, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#9a3412" }}>
              <b>Important:</b> Make sure you click <b>Save &amp; Next</b> to record answers — questions only marked for review (without an answer) are not scored.
            </div>
          </div>

          {/* candidate panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ background: NAVY, color: "#fff", padding: "10px 16px", fontFamily: "Sora", fontWeight: 700, fontSize: 13.5 }}>Candidate</div>
              <div style={{ padding: "18px 16px", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${ORANGE}1a`, color: ORANGE, display: "grid", placeItems: "center", margin: "0 auto 10px", fontFamily: "Sora", fontWeight: 900, fontSize: 26 }}>{candidate[0]?.toUpperCase()}</div>
                <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 16 }}>{candidate}</div>
                <div style={{ fontSize: 12, color: MUTE, marginTop: 2 }}>{test?.examTypeLabel || test?.categoryLabel}</div>
              </div>
              <div style={{ borderTop: "1px solid #eef2f7", padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTE, marginBottom: 6 }}>Choose Language</div>
                <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ width: "100%", height: 38, borderRadius: 9, border: "1.5px solid #e5e7eb", padding: "0 10px", fontSize: 13, color: NAVY, outline: "none" }}>
                  <option>English</option><option>Hindi</option>
                </select>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTE, margin: "14px 0 8px" }}>SUBJECTS &amp; QUESTIONS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {sections.map((s, i) => (
                    <div key={s.name || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", borderRadius: 8, padding: "8px 11px" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, display: "flex", alignItems: "center", gap: 6 }}>
                        {s.name && <span style={{ width: 4, height: 14, borderRadius: 3, background: SUBJECT_COLOR[s.name] || INDIGO }} />}
                        {s.name || "All questions"}
                      </span>
                      <span style={{ fontSize: 12, color: MUTE, fontWeight: 700 }}>{s.items.length} Qs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: NAVY, cursor: "pointer", flex: 1, minWidth: 240 }}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 18, height: 18, accentColor: ORANGE }} />
          I have read and understood all the instructions.
        </label>
        <button onClick={onClose} style={{ background: "#fff", color: MUTE, border: "1.5px solid #e5e7eb", borderRadius: 11, padding: "10px 18px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
        <button onClick={onProceed} disabled={!agree}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: agree ? "linear-gradient(135deg,#FF693D,#E0421F)" : "#cbd5e1", color: "#fff", border: "none", borderRadius: 11, padding: "11px 24px", fontWeight: 800, fontFamily: "Sora", fontSize: 14, cursor: agree ? "pointer" : "not-allowed", boxShadow: agree ? "0 10px 22px -10px #FF693D" : "none", transition: "all .2s" }}>
          Proceed to Test <ChevronRight size={16} />
        </button>
      </div>
      <style>{`@media(max-width:760px){.instr-grid{grid-template-columns:1fr !important}}`}</style>
    </motion.div>
    </Portal>
  );
}

const ctlBtn = (bg, fg) => ({ display: "inline-flex", alignItems: "center", gap: 6, background: bg, color: fg, border: `1.5px solid ${bg === "#fff" ? "#e5e7eb" : bg}`, borderRadius: 10, padding: "9px 14px", fontWeight: 700, fontFamily: "Sora", fontSize: 12.5, cursor: "pointer", transition: "all .15s" });

const Legend = ({ c, t }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
    <span style={{ width: 12, height: 12, borderRadius: 4, background: c }} /> {t}
  </span>
);

/* ── Result + solutions review ──────────────────────────────────── */
function ResultView({ token, plan, testId, result, onClose }) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    let alive = true;
    apiTestResult(token, testId, plan)
      .then((d) => alive && setReview(d))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [token, testId, plan]);

  const r = review?.result || result;
  const subjects = review?.subjects || [];
  const topics = review?.topics || [];
  const examType = review?.examType || "";
  const examLabel = review?.examTypeLabel || "";
  const pct = r.percent ?? (r.maxMarks ? Math.round((r.score / r.maxMarks) * 100) : 0);
  const rank = useMemo(() => (examType ? predictForExam(examType, subjects, r) : null), [examType, subjects, r]);

  const ranked = [...subjects].filter((s) => s.total).sort((a, b) => b.accuracy - a.accuracy);
  const strong = ranked.slice(0, 2);
  const weakSet = ranked.slice(-2).reverse().filter((s) => !strong.includes(s));

  // Derived analytics
  const answers = review?.answers || [];
  const marksGained = answers.reduce((s, a) => s + (a.marks > 0 ? a.marks : 0), 0);
  const marksLost = answers.reduce((s, a) => s + (a.marks < 0 ? -a.marks : 0), 0);
  const attempted = r.correctCount + r.wrongCount;
  const attemptRate = r.totalQuestions ? Math.round((attempted / r.totalQuestions) * 100) : 0;
  const avgSecPerQ = attempted ? Math.round((r.durationSec || 0) / attempted) : 0;
  const marksPerMin = r.durationSec ? Math.round((r.score / (r.durationSec / 60)) * 10) / 10 : 0;

  // Auto-generated coaching insights
  const insights = useMemo(() => {
    const out = [];
    if (!r.totalQuestions) return out;
    if (marksLost > 0 && marksLost >= marksGained * 0.35)
      out.push({ tone: "warn", text: `Negative marking cost you ${marksLost} marks. Skip questions you're genuinely unsure about instead of guessing.` });
    if (attemptRate < 60)
      out.push({ tone: "warn", text: `You attempted only ${attemptRate}% of the paper — work on pace so you reach more questions.` });
    if (r.accuracy >= 80 && attemptRate < 85)
      out.push({ tone: "good", text: `Excellent ${r.accuracy}% accuracy — you can safely attempt more questions to lift your score.` });
    const weakTopic = [...topics].sort((a, b) => a.accuracy - b.accuracy)[0];
    if (weakTopic && weakTopic.accuracy < 50)
      out.push({ tone: "warn", text: `Revise the chapter "${weakTopic.topic}" (${weakTopic.subject}) — ${weakTopic.accuracy}% accuracy there.` });
    else if (weakSet[0])
      out.push({ tone: "warn", text: `Give ${weakSet[0].name} extra revision time (${weakSet[0].accuracy}% accuracy).` });
    if (strong[0] && strong[0].accuracy >= 70)
      out.push({ tone: "good", text: `${strong[0].name} is a clear strength (${strong[0].accuracy}% accuracy) — keep it sharp.` });
    if (r.skippedCount > r.totalQuestions * 0.4)
      out.push({ tone: "warn", text: `You left ${r.skippedCount} questions unattempted — even a few educated attempts add marks.` });
    return out.slice(0, 5);
  }, [r, topics, weakSet, strong, marksLost, marksGained, attemptRate]);

  const card = { background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, padding: "16px 18px", boxShadow: "0 10px 30px -26px rgba(13,27,62,.5)" };
  const head = (icon, txt) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      {icon}<span style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 14.5 }}>{txt}</span>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "22px 16px", background: "#f4f6fb" }}>
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: "linear-gradient(135deg,#FF693D,#E0421F)", display: "grid", placeItems: "center", boxShadow: "0 12px 26px -12px #FF693D" }}>
            <Trophy size={22} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: "1.3rem", margin: 0, lineHeight: 1.2 }}>{review?.title || "Result Analysis"}</h2>
            <div style={{ color: MUTE, fontSize: 12.5 }}>Auto-graded · saved to your performance{examLabel ? ` · ${examLabel}` : ""}</div>
          </div>
          <button onClick={onClose} style={{ background: NAVY, color: "#fff", border: "none", borderRadius: 11, padding: "10px 18px", fontWeight: 800, fontFamily: "Sora", cursor: "pointer", fontSize: 13.5 }}>Done</button>
        </div>

        {loading && !review ? (
          <div style={{ display: "grid", placeItems: "center", padding: 40, color: MUTE }}><Loader2 size={20} className="ts-spin" /></div>
        ) : null}

        {/* Parent notification */}
        {result?.parentNotified && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#047857", borderRadius: 12, padding: "10px 14px", fontSize: 12.5, marginBottom: 14 }}>
            <CheckCircle2 size={15} /> A copy of this report has been emailed to your parent.
          </div>
        )}

        {/* Performance summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 14 }}>
          <div style={{ ...card, background: NAVY, border: "none", color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: 12, opacity: .7 }}>Score</div>
            <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 30, lineHeight: 1.1 }}>{r.score}<span style={{ fontSize: 15, opacity: .6 }}>/{r.maxMarks}</span></div>
            <div style={{ fontSize: 12, opacity: .85 }}>{pct}% · {r.accuracy}% acc.</div>
          </div>
          {rank && rank.ranked !== false && (
            <>
              <BigStat icon={<Gauge size={16} color={INDIGO} />} label="Percentile (est.)" value={`${rank.percentile}`} sub="%ile" color={INDIGO} card={card} />
              <BigStat icon={<Award size={16} color={ORANGE} />} label="All India Rank (est.)" value={`#${fmtRank(rank.rank)}`} sub={`range ${fmtRank(rank.low)}–${fmtRank(rank.high)}`} color={ORANGE} card={card} />
            </>
          )}
          {rank && rank.ranked === false && (
            <div style={{ ...card, gridColumn: "span 2", display: "flex", alignItems: "center", gap: 10, color: RED }}>
              <AlertTriangle size={18} /> <span style={{ fontSize: 13, color: NAVY }}>Below the JEE Advanced qualifying cutoff — no AIR. Keep practising!</span>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12, marginBottom: 14 }}>
          {/* Subject proficiency */}
          {subjects.length > 0 && (
            <div style={card}>
              {head(<Target size={16} color={ORANGE} />, "Subject Proficiency")}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {subjects.map((s) => {
                  const col = SUBJECT_COLOR[s.name] || INDIGO;
                  const p = s.maxMarks ? Math.round((s.score / s.maxMarks) * 100) : 0;
                  return (
                    <div key={s.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                        <span style={{ fontWeight: 700, color: NAVY }}>{s.name}</span>
                        <span style={{ color: MUTE, fontWeight: 700 }}>{s.score}/{s.maxMarks} · {p}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 5, background: "#eef0f5", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.max(2, p)}%`, borderRadius: 5, background: col, transition: "width .5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question distribution */}
          <div style={card}>
            {head(<ListChecks size={16} color={INDIGO} />, "Question Distribution")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, textAlign: "center" }}>
              <DistCell n={r.correctCount} label="Correct" color={GREEN} />
              <DistCell n={r.wrongCount} label="Incorrect" color={RED} />
              <DistCell n={r.skippedCount} label="Unattempted" color="#94a3b8" />
            </div>
            <div style={{ marginTop: 12, height: 10, borderRadius: 6, overflow: "hidden", display: "flex", background: "#eef0f5" }}>
              {r.totalQuestions > 0 && [["#15a06e", r.correctCount], ["#ef4444", r.wrongCount], ["#cbd5e1", r.skippedCount]].map(([c, n], i) => (
                <div key={i} style={{ width: `${(n / r.totalQuestions) * 100}%`, background: c, transition: "width .5s" }} />
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: MUTE, display: "flex", alignItems: "center", gap: 6 }}>
              <Timer size={13} /> Time taken: <b style={{ color: NAVY }}>{mmToHM(r.durationSec)}</b>
            </div>
          </div>
        </div>

        {/* Time allocation per subject */}
        {subjects.some((s) => s.timeSec > 0) && (
          <div style={{ ...card, marginBottom: 14 }}>
            {head(<Clock size={16} color="#0EA5A4" />, "Time Allocation")}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(() => {
                const maxT = Math.max(...subjects.map((s) => s.timeSec || 0), 1);
                return subjects.map((s) => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 80, fontSize: 12.5, fontWeight: 700, color: NAVY, flexShrink: 0 }}>{s.name}</span>
                    <div style={{ flex: 1, height: 18, borderRadius: 6, background: "#eef0f5", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${((s.timeSec || 0) / maxT) * 100}%`, background: `${SUBJECT_COLOR[s.name] || INDIGO}cc`, borderRadius: 6, transition: "width .5s" }} />
                    </div>
                    <span style={{ width: 48, fontSize: 12, color: MUTE, textAlign: "right", flexShrink: 0 }}>{mmToHM(s.timeSec)}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* Marks breakdown + pace */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12, marginBottom: 14 }}>
          <div style={card}>
            {head(<Award size={16} color={GREEN} />, "Marks Breakdown")}
            {(() => {
              const span = Math.max(marksGained + marksLost, 1);
              return (
                <>
                  <div style={{ display: "flex", height: 22, borderRadius: 7, overflow: "hidden", background: "#eef0f5", marginBottom: 10 }}>
                    <div style={{ width: `${(marksGained / span) * 100}%`, background: GREEN, transition: "width .5s" }} />
                    <div style={{ width: `${(marksLost / span) * 100}%`, background: RED, transition: "width .5s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                    <span style={{ color: NAVY }}><b style={{ color: GREEN }}>+{marksGained}</b> earned</span>
                    <span style={{ color: NAVY }}><b style={{ color: RED }}>−{marksLost}</b> lost to negatives</span>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 13, color: NAVY, textAlign: "center", fontWeight: 700 }}>
                    Net score <b style={{ color: NAVY }}>{r.score}</b>/{r.maxMarks}
                  </div>
                  {marksLost > 0 && (
                    <div style={{ marginTop: 6, fontSize: 11.5, color: MUTE, textAlign: "center" }}>
                      Without negative marking you'd have <b>{r.score + marksLost}</b>.
                    </div>
                  )}
                </>
              );
            })()}
          </div>
          <div style={card}>
            {head(<Timer size={16} color={INDIGO} />, "Pace & Efficiency")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, textAlign: "center" }}>
              <DistCell n={`${attemptRate}%`} label="Attempted" color={INDIGO} />
              <DistCell n={avgSecPerQ ? `${avgSecPerQ}s` : "—"} label="Avg / question" color="#0EA5A4" />
              <DistCell n={marksPerMin || "—"} label="Marks / min" color={ORANGE} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: MUTE, textAlign: "center" }}>
              Attempted <b style={{ color: NAVY }}>{attempted}</b> of {r.totalQuestions} in {mmToHM(r.durationSec)}.
            </div>
          </div>
        </div>

        {/* Insights & recommendations */}
        {insights.length > 0 && (
          <div style={{ ...card, marginBottom: 14, borderLeft: `3px solid ${INDIGO}` }}>
            {head(<Flame size={16} color={INDIGO} />, "Insights & Recommendations")}
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: NAVY, lineHeight: 1.55 }}>
                  {ins.tone === "good"
                    ? <CheckCircle2 size={15} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
                    : <AlertTriangle size={15} color={AMBER} style={{ flexShrink: 0, marginTop: 2 }} />}
                  <span>{ins.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strong / weak areas */}
        {(strong.length > 0 || weakSet.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12, marginBottom: 14 }}>
            <div style={{ ...card, borderLeft: `3px solid ${GREEN}` }}>
              {head(<Flame size={16} color={GREEN} />, "Strong Areas")}
              {strong.length ? strong.map((s) => (
                <div key={s.name} style={{ fontSize: 13, color: NAVY, marginBottom: 6 }}><b>{s.name}</b> — {s.accuracy}% accuracy ({s.correct}/{s.total})</div>
              )) : <div style={{ fontSize: 12.5, color: MUTE }}>Attempt more to see strengths.</div>}
            </div>
            <div style={{ ...card, borderLeft: `3px solid ${AMBER}` }}>
              {head(<TrendingDown size={16} color={AMBER} />, "Needs Work")}
              {weakSet.length ? weakSet.map((s) => (
                <div key={s.name} style={{ fontSize: 13, color: NAVY, marginBottom: 6 }}><b>{s.name}</b> — {s.accuracy}% accuracy ({s.correct}/{s.total})</div>
              )) : <div style={{ fontSize: 12.5, color: MUTE }}>Great — no weak section!</div>}
            </div>
          </div>
        )}

        {/* Topic accuracy heatmap */}
        {topics.length > 0 && (
          <div style={{ ...card, marginBottom: 14 }}>
            {head(<Gauge size={16} color={ORANGE} />, "Chapter-wise Accuracy")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 8 }}>
              {topics.map((t, i) => {
                const c = t.accuracy >= 70 ? GREEN : t.accuracy >= 40 ? AMBER : RED;
                return (
                  <div key={i} style={{ background: `${c}14`, border: `1px solid ${c}40`, borderRadius: 10, padding: "9px 10px" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.topic}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: c }}>{t.accuracy}% <span style={{ color: MUTE, fontWeight: 600 }}>· {t.subject}</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
          <button onClick={() => setShowAnswers((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1.5px solid ${NAVY}`, color: NAVY, borderRadius: 12, padding: "11px 18px", fontWeight: 800, fontFamily: "Sora", cursor: "pointer", transition: "all .15s" }}>
            {showAnswers ? <EyeOff size={16} /> : <BookOpenCheck size={16} />} {showAnswers ? "Hide" : "Review"} answers & solutions
          </button>
          <button onClick={onClose} style={{ background: `linear-gradient(135deg, ${ORANGE}, #E0421F)`, color: "#fff", border: "none", borderRadius: 12, padding: "11px 22px", fontWeight: 800, fontFamily: "Sora", cursor: "pointer", boxShadow: `0 8px 20px -8px ${ORANGE}` }}>Done</button>
        </div>

        {/* Answers review */}
        {showAnswers && review && (
          <div style={{ marginTop: 6 }}>
            {review.keyPdfUrl && (
              <a href={review.keyPdfUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: INDIGO, fontWeight: 700, fontSize: 13.5, marginBottom: 12, textDecoration: "none" }}>
                <ExternalLink size={14} /> Open full answer-key / solutions PDF
              </a>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {review.answers.map((a) => <SolutionCard key={a.qno} a={a} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const BigStat = ({ icon, label, value, sub, color, card }) => (
  <div style={{ ...card, textAlign: "center" }}>
    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}14`, display: "grid", placeItems: "center", margin: "0 auto 8px" }}>{icon}</div>
    <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 24, color: NAVY, lineHeight: 1.1 }}>{value}</div>
    <div style={{ fontSize: 11, color: MUTE, marginTop: 3 }}>{label}</div>
    {sub && <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2 }}>{sub}</div>}
  </div>
);

const DistCell = ({ n, label, color }) => (
  <div style={{ background: `${color}10`, borderRadius: 12, padding: "12px 6px" }}>
    <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 22, color }}>{n}</div>
    <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{label}</div>
  </div>
);

/* One question in the post-submit review: stem, options (correct/your-pick
   highlighted), your answer vs the key, and the worked solution. */
function SolutionCard({ a }) {
  const c = a.status === "correct" ? GREEN : a.status === "wrong" ? RED : "#94a3b8";
  const label = a.status === "correct" ? "Correct" : a.status === "wrong" ? "Wrong" : "Skipped";
  const options = a.options || [];

  return (
    <div style={{ border: "1px solid #eef2f7", borderLeft: `3px solid ${c}`, borderRadius: 12, padding: "14px 16px", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: a.text || a.image ? 10 : 6 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: MUTE }}>Q{a.qno}</span>
        {a.subject && (
          <span style={{ fontSize: 10.5, fontWeight: 700, color: SUBJECT_COLOR[a.subject] || INDIGO, background: `${SUBJECT_COLOR[a.subject] || INDIGO}14`, borderRadius: 50, padding: "2px 8px" }}>{a.subject}</span>
        )}
        <span style={{ fontSize: 11, fontWeight: 800, color: c, background: `${c}14`, borderRadius: 50, padding: "2px 9px" }}>{label}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, fontWeight: 800, color: a.marks > 0 ? GREEN : a.marks < 0 ? RED : MUTE }}>
          {a.marks > 0 ? `+${a.marks}` : a.marks}
        </span>
      </div>

      {/* Question text with math rendering */}
      {a.text && <div style={{ fontSize: 14, color: NAVY, lineHeight: 1.7, marginBottom: 10 }}><MathText text={a.text} /></div>}

      {/* Question image with zoom */}
      {a.image && <QuestionImage src={a.image} alt={`Q${a.qno} diagram`} maxH={200} style={{ marginBottom: 10 }} />}

      {a.type === "integer" ? (
        <div style={{ display: "flex", gap: 18, fontSize: 13, marginBottom: a.explanation ? 10 : 0, flexWrap: "wrap" }}>
          <span style={{ color: MUTE }}>Your answer: <b style={{ color: a.status === "wrong" ? RED : NAVY }}>{a.answer || "—"}</b></span>
          <span style={{ color: MUTE }}>Correct: <b style={{ color: GREEN }}>{a.correct || "—"}</b></span>
        </div>
      ) : options.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: a.explanation ? 10 : 0 }}>
          {options.map((o, oi) => {
            const isKey = String(a.correct) === String(o.key);
            const isYours = String(a.answer) === String(o.key);
            const bg = isKey ? "#ecfdf5" : isYours ? "#fef2f2" : "#fff";
            const bd = isKey ? GREEN : isYours ? RED : "#e5e7eb";
            const optLabel = OPT_LABELS[oi] || o.key;
            return (
              <div key={o.key} style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${bd}`, background: bg, borderRadius: 12, padding: "10px 12px", transition: "all .15s" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12.5, background: isKey ? GREEN : isYours ? RED : "#f1f5f9", color: isKey || isYours ? "#fff" : NAVY }}>{optLabel}</span>
                <span style={{ fontSize: 13.5, color: NAVY, flex: 1 }}>
                  {o.image
                    ? <OptionImage src={o.image} alt={`Option ${optLabel}`} />
                    : <MathText text={o.text || `Option ${optLabel}`} />}
                </span>
                {isKey && <span style={{ fontSize: 11, fontWeight: 800, color: GREEN, whiteSpace: "nowrap" }}>✓ Correct</span>}
                {isYours && !isKey && <span style={{ fontSize: 11, fontWeight: 800, color: RED, whiteSpace: "nowrap" }}>✗ Your pick</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 18, fontSize: 13, marginBottom: a.explanation ? 10 : 0 }}>
          <span style={{ color: MUTE }}>You: <b style={{ color: a.status === "wrong" ? RED : NAVY }}>{a.answer || "—"}</b></span>
          <span style={{ color: MUTE }}>Key: <b style={{ color: GREEN }}>{a.correct || "—"}</b></span>
        </div>
      )}

      {a.explanation && (
        <div style={{ display: "flex", gap: 8, background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 10, padding: "10px 14px" }}>
          <BookOpenCheck size={15} color={INDIGO} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13.5, color: NAVY, lineHeight: 1.7 }}><b style={{ color: INDIGO }}>Solution:</b> <MathText text={a.explanation} /></div>
        </div>
      )}
    </div>
  );
}
