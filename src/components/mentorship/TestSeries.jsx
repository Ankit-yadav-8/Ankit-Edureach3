import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Clock, CheckCircle2, Loader2, Play, Trophy, Target, X,
  ChevronLeft, ChevronRight, Flag, Eraser, ListChecks, ExternalLink,
  AlertTriangle, RotateCcw, BookOpenCheck,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiTestList, apiTestGet, apiTestSubmit, apiTestResult, apiTestPerformance } from "../../auth/api.js";
import { Trend } from "../Charts.jsx";
import MathText from "./MathText.jsx";

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
              style={{ padding: "7px 15px", borderRadius: 50, border: `1.5px solid ${on ? ORANGE : "#e5e7eb"}`, background: on ? ORANGE : "#fff", color: on ? "#fff" : NAVY, fontFamily: "Sora", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
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
    <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 10px 30px -24px rgba(13,27,62,.5)" }}>
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
          <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: `1.5px solid ${color}`, color, borderRadius: 10, padding: "8px 12px", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "Sora" }}>
            <RotateCcw size={13} /> Reattempt
          </button>
        </div>
      ) : (
        <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#fff", border: "none", borderRadius: 11, padding: "11px 0", fontWeight: 800, fontFamily: "Sora", fontSize: 14, cursor: "pointer", boxShadow: `0 10px 24px -12px ${color}` }}>
          <Play size={15} /> Start Test
        </button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CBT PLAYER — NTA-style: PDF on the left, palette + answers on the
   right, live timer, auto-grade on submit, then solutions review.
   ════════════════════════════════════════════════════════════════ */
const OPT_KEYS = ["1", "2", "3", "4"];

function CbtPlayer({ token, plan, testId, onClose, onSubmitted }) {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // qno -> choice
  const [marked, setMarked] = useState({});   // qno -> bool (review)
  const [visited, setVisited] = useState({});
  const [left, setLeft] = useState(0);        // seconds remaining
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    let alive = true;
    apiTestGet(token, testId, plan)
      .then((d) => {
        if (!alive) return;
        setTest(d);
        setLeft((d.durationMin || 60) * 60);
        setVisited({ [d.questions?.[0]?.qno]: true });
      })
      .catch((e) => alive && setErr(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [token, testId, plan]);

  // countdown — auto-submits at zero.
  useEffect(() => {
    if (loading || result || !test) return;
    if (left <= 0) { doSubmit(); return; }
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [left, loading, result, test]);

  const questions = test?.questions || [];
  const q = questions[idx];

  const goto = (i) => {
    if (i < 0 || i >= questions.length) return;
    setIdx(i);
    const qn = questions[i]?.qno;
    setVisited((v) => ({ ...v, [qn]: true }));
  };

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
      const d = await apiTestSubmit(token, testId, { answers, durationSec }, plan);
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 5000, background: "#eef0f4", display: "flex", flexDirection: "column" }}>
      {/* top bar */}
      <div style={{ background: NAVY, color: "#fff", padding: "10px 16px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {test?.title || "Loading…"}
        </div>
        {!result && test && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: left < 60 ? "#7f1d1d" : "rgba(255,255,255,.12)", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontVariantNumeric: "tabular-nums", fontSize: 15 }}>
            <Clock size={15} /> {mmss(Math.max(0, left))}
          </div>
        )}
        {!result ? (
          <button onClick={() => setConfirm(true)} disabled={submitting}
            style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: 800, fontFamily: "Sora", fontSize: 13.5, cursor: "pointer" }}>
            Submit Test
          </button>
        ) : (
          <button onClick={onSubmitted} style={{ background: "rgba(255,255,255,.16)", color: "#fff", border: "none", borderRadius: 10, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer" }}><X size={18} /></button>
        )}
      </div>

      {loading ? (
        <div style={{ flex: 1, display: "grid", placeItems: "center", color: MUTE }}><Loader2 size={22} className="ts-spin" /></div>
      ) : err && !test ? (
        <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 24 }}>
          <div style={{ textAlign: "center" }}>
            <AlertTriangle size={28} color={RED} />
            <div style={{ marginTop: 10, color: NAVY, fontWeight: 700 }}>{err}</div>
            <button onClick={onClose} style={{ marginTop: 14, background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      ) : result ? (
        <ResultView token={token} plan={plan} testId={testId} result={result} onClose={onSubmitted} />
      ) : (
        <div className="cbt-grid" style={{ flex: 1, display: "grid", gridTemplateColumns: "1.35fr 1fr", minHeight: 0 }}>
          {/* PDF pane */}
          <div style={{ background: "#525659", minHeight: 0, position: "relative", display: "flex", flexDirection: "column" }}>
            {test.testPdfUrl ? (
              <iframe title="Question paper" src={test.testPdfUrl} style={{ flex: 1, width: "100%", border: "none" }} />
            ) : (
              <div style={{ flex: 1, display: "grid", placeItems: "center", color: "#fff" }}>No paper attached</div>
            )}
            <a href={test.testPdfUrl} target="_blank" rel="noreferrer"
              style={{ position: "absolute", bottom: 12, right: 12, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,.6)", color: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              <ExternalLink size={13} /> Open PDF
            </a>
          </div>

          {/* answer + palette pane */}
          <div style={{ background: "#fff", borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* question + options */}
            <div style={{ padding: "16px 18px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 15 }}>Question {idx + 1} <span style={{ color: MUTE, fontWeight: 600, fontSize: 13 }}>/ {questions.length}</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {q?.marks && (
                    <span style={{ display: "inline-flex", gap: 5, fontSize: 11, fontWeight: 800, borderRadius: 50, padding: "3px 9px", background: "#f1f5f9" }}>
                      <span style={{ color: GREEN }}>+{q.marks.correct}</span>
                      <span style={{ color: RED }}>{q.marks.wrong}</span>
                      <span style={{ color: MUTE }}>0</span>
                    </span>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 700, color: q?.type === "integer" ? "#8b5cf6" : INDIGO, background: q?.type === "integer" ? "#f5f3ff" : "#eef2ff", borderRadius: 50, padding: "3px 10px" }}>
                    {q?.type === "integer" ? "Integer" : "Single correct"}
                  </span>
                </div>
              </div>

              {q?.text && (
                <div style={{ fontSize: 14, color: NAVY, lineHeight: 1.6, marginBottom: q?.image ? 10 : 14 }}><MathText text={q.text} /></div>
              )}
              {q?.image && (
                <img src={q.image} alt={`Question ${q.qno}`} style={{ maxWidth: "100%", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 14 }} />
              )}
              {!q?.text && !q?.image && (
                <div style={{ fontSize: 13, color: MUTE, marginBottom: 14, fontStyle: "italic" }}>Read question {q?.qno} from the paper on the left, then mark your answer below.</div>
              )}

              {q?.type === "integer" ? (
                <input
                  value={answers[q.qno] ?? ""}
                  onChange={(e) => choose(e.target.value.replace(/[^0-9.\-]/g, ""))}
                  placeholder="Type your answer"
                  inputMode="decimal"
                  style={{ width: "100%", height: 48, padding: "0 14px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 16, fontWeight: 700, color: NAVY, outline: "none", boxSizing: "border-box" }}
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {OPT_KEYS.map((k, i) => {
                    const opt = q?.options?.find((o) => o.key === k) || q?.options?.[i];
                    const key = opt?.key || k;
                    const on = answers[q.qno] === key;
                    return (
                      <button key={k} onClick={() => choose(key)}
                        style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", border: `1.5px solid ${on ? ORANGE : "#e5e7eb"}`, background: on ? `${ORANGE}0f` : "#fff", borderRadius: 12, padding: "11px 13px", cursor: "pointer", transition: "all .12s" }}>
                        <span style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", fontWeight: 800, fontFamily: "Sora", fontSize: 13, background: on ? ORANGE : "#f1f5f9", color: on ? "#fff" : NAVY }}>{key}</span>
                        {opt?.image
                          ? <img src={opt.image} alt={`Option ${key}`} style={{ maxHeight: 72, maxWidth: "100%", borderRadius: 8 }} />
                          : <span style={{ fontSize: 13.5, color: NAVY }}><MathText text={opt?.text || `Option ${key}`} /></span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* action buttons */}
            <div style={{ borderTop: "1px solid #eef2f7", padding: "10px 14px", display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={toggleMark} style={ctlBtn(marked[q?.qno] ? "#8b5cf6" : "#fff", marked[q?.qno] ? "#fff" : MUTE)}><Flag size={14} /> {marked[q?.qno] ? "Marked" : "Mark for review"}</button>
              <button onClick={clearAns} style={ctlBtn("#fff", MUTE)}><Eraser size={14} /> Clear</button>
              <div style={{ flex: 1 }} />
              <button onClick={() => goto(idx - 1)} disabled={idx === 0} style={{ ...ctlBtn("#fff", NAVY), opacity: idx === 0 ? 0.4 : 1 }}><ChevronLeft size={15} /> Prev</button>
              <button onClick={() => goto(idx + 1)} disabled={idx >= questions.length - 1} style={{ ...ctlBtn(NAVY, "#fff"), opacity: idx >= questions.length - 1 ? 0.4 : 1 }}>Save & Next <ChevronRight size={15} /></button>
            </div>

            {/* palette */}
            <div style={{ borderTop: "1px solid #eef2f7", background: "#f8fafc", padding: "10px 14px", maxHeight: 188, overflowY: "auto" }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 10.5, color: MUTE, marginBottom: 8 }}>
                <Legend c={GREEN} t={`Answered ${counts.answered}`} />
                <Legend c={RED} t={`Not ans. ${counts.notAnswered - counts.notVisited}`} />
                <Legend c="#8b5cf6" t={`Review ${counts.marked}`} />
                <Legend c="#cbd5e1" t={`Not visited ${counts.notVisited}`} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(34px,1fr))", gap: 6 }}>
                {questions.map((qq, i) => {
                  const st = palStatus(qq);
                  return (
                    <button key={qq.qno} onClick={() => goto(i)}
                      style={{ height: 32, borderRadius: 7, border: `1.5px solid ${st === "notvisited" ? "#cbd5e1" : PAL_BG[st]}`, background: PAL_BG[st], color: PAL_FG[st], fontWeight: 800, fontSize: 12, cursor: "pointer", outline: i === idx ? `2px solid ${ORANGE}` : "none" }}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* submit confirmation */}
      <AnimatePresence>
        {confirm && !result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirm(false)}
            style={{ position: "fixed", inset: 0, zIndex: 5100, background: "rgba(13,27,62,.55)", display: "grid", placeItems: "center", padding: 20 }}>
            <motion.div initial={{ scale: .94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "min(420px,100%)", background: "#fff", borderRadius: 18, padding: "24px 22px", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#FFF1E9", display: "grid", placeItems: "center", margin: "0 auto 12px" }}><ListChecks size={24} color={ORANGE} /></div>
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, margin: "0 0 6px" }}>Submit the test?</h3>
              <p style={{ color: MUTE, fontSize: 13.5, margin: "0 0 8px" }}>Answered <b style={{ color: GREEN }}>{counts.answered}</b> of {counts.total}. Unanswered questions score 0.</p>
              {err && <div style={{ color: RED, fontSize: 12.5, marginBottom: 8 }}>{err}</div>}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setConfirm(false)} style={{ flex: 1, padding: "11px 0", borderRadius: 11, border: "1.5px solid #e5e7eb", background: "#fff", color: NAVY, fontWeight: 700, cursor: "pointer" }}>Keep going</button>
                <button onClick={doSubmit} disabled={submitting} style={{ flex: 1.3, padding: "11px 0", borderRadius: 11, border: "none", background: ORANGE, color: "#fff", fontWeight: 800, fontFamily: "Sora", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  {submitting ? <Loader2 size={16} className="ts-spin" /> : <CheckCircle2 size={16} />} Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@media(max-width:820px){.cbt-grid{grid-template-columns:1fr !important}}`}</style>
    </motion.div>
  );
}

const ctlBtn = (bg, fg) => ({ display: "inline-flex", alignItems: "center", gap: 6, background: bg, color: fg, border: `1.5px solid ${bg === "#fff" ? "#e5e7eb" : bg}`, borderRadius: 9, padding: "8px 12px", fontWeight: 700, fontFamily: "Sora", fontSize: 12.5, cursor: "pointer" });

const Legend = ({ c, t }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
    <span style={{ width: 11, height: 11, borderRadius: 3, background: c }} /> {t}
  </span>
);

/* ── Result + solutions review ──────────────────────────────────── */
function ResultView({ token, plan, testId, result, onClose }) {
  const [review, setReview] = useState(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const r = result;
  const pct = r.percent ?? (r.maxMarks ? Math.round((r.score / r.maxMarks) * 100) : 0);

  const loadReview = () => {
    setBusy(true);
    apiTestResult(token, testId, plan)
      .then((d) => { setReview(d); setOpen(true); })
      .catch(() => {})
      .finally(() => setBusy(false));
  };

  const stat = (icon, label, value, color) => (
    <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}14`, display: "grid", placeItems: "center", margin: "0 auto 8px" }}>{icon}</div>
      <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 20, color: NAVY }}>{value}</div>
      <div style={{ fontSize: 11.5, color: MUTE, marginTop: 2 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "26px 18px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#FF693D,#E0421F)", display: "grid", placeItems: "center", margin: "0 auto 12px", boxShadow: "0 14px 30px -12px #FF693D" }}>
            <Trophy size={30} color="#fff" />
          </div>
          <h2 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: "1.5rem", margin: 0 }}>Test submitted!</h2>
          <p style={{ color: MUTE, fontSize: 13.5, marginTop: 4 }}>Auto-graded against the answer key · saved to your performance</p>
        </div>

        <div style={{ background: NAVY, borderRadius: 18, padding: "20px 24px", color: "#fff", textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, opacity: .7 }}>Your score</div>
          <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 40, lineHeight: 1.1 }}>{r.score} <span style={{ fontSize: 18, opacity: .6 }}>/ {r.maxMarks}</span></div>
          <div style={{ fontSize: 14, opacity: .85, marginTop: 4 }}>{pct}% · {r.accuracy}% accuracy</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginBottom: 18 }}>
          {stat(<CheckCircle2 size={18} color={GREEN} />, "Correct", r.correctCount, GREEN)}
          {stat(<X size={18} color={RED} />, "Wrong", r.wrongCount, RED)}
          {stat(<Target size={18} color={AMBER} />, "Skipped", r.skippedCount, AMBER)}
          {stat(<ListChecks size={18} color={INDIGO} />, "Questions", r.totalQuestions, INDIGO)}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={loadReview} disabled={busy} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1.5px solid ${NAVY}`, color: NAVY, borderRadius: 12, padding: "11px 18px", fontWeight: 800, fontFamily: "Sora", cursor: "pointer" }}>
            {busy ? <Loader2 size={16} className="ts-spin" /> : <BookOpenCheck size={16} />} Review answers & solutions
          </button>
          <button onClick={onClose} style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: 12, padding: "11px 22px", fontWeight: 800, fontFamily: "Sora", cursor: "pointer" }}>Done</button>
        </div>

        {open && review && (
          <div style={{ marginTop: 22 }}>
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

/* One question in the post-submit review: stem, options (correct/your-pick
   highlighted), your answer vs the key, and the worked solution. */
function SolutionCard({ a }) {
  const c = a.status === "correct" ? GREEN : a.status === "wrong" ? RED : "#94a3b8";
  const label = a.status === "correct" ? "Correct" : a.status === "wrong" ? "Wrong" : "Skipped";
  const options = a.options || [];

  return (
    <div style={{ border: "1px solid #eef2f7", borderLeft: `3px solid ${c}`, borderRadius: 12, padding: "12px 14px", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: a.text ? 8 : 6 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: MUTE }}>Q{a.qno}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: c, background: `${c}14`, borderRadius: 50, padding: "2px 9px" }}>{label}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, fontWeight: 800, color: a.marks > 0 ? GREEN : a.marks < 0 ? RED : MUTE }}>
          {a.marks > 0 ? `+${a.marks}` : a.marks}
        </span>
      </div>

      {a.text && <div style={{ fontSize: 13.5, color: NAVY, lineHeight: 1.6, marginBottom: 10 }}><MathText text={a.text} /></div>}

      {a.type === "integer" ? (
        <div style={{ display: "flex", gap: 18, fontSize: 13, marginBottom: a.explanation ? 10 : 0 }}>
          <span style={{ color: MUTE }}>Your answer: <b style={{ color: a.status === "wrong" ? RED : NAVY }}>{a.answer || "—"}</b></span>
          <span style={{ color: MUTE }}>Correct: <b style={{ color: GREEN }}>{a.correct || "—"}</b></span>
        </div>
      ) : options.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: a.explanation ? 10 : 0 }}>
          {options.map((o) => {
            const isKey = String(a.correct) === String(o.key);
            const isYours = String(a.answer) === String(o.key);
            const bg = isKey ? "#ecfdf5" : isYours ? "#fef2f2" : "#fff";
            const bd = isKey ? GREEN : isYours ? RED : "#e5e7eb";
            return (
              <div key={o.key} style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${bd}`, background: bg, borderRadius: 10, padding: "8px 11px" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12, background: isKey ? GREEN : isYours ? RED : "#f1f5f9", color: isKey || isYours ? "#fff" : NAVY }}>{o.key}</span>
                <span style={{ fontSize: 13, color: NAVY, flex: 1 }}>
                  {o.image ? <img src={o.image} alt={`Option ${o.key}`} style={{ maxHeight: 60, maxWidth: "100%", borderRadius: 6 }} /> : <MathText text={o.text || `Option ${o.key}`} />}
                </span>
                {isKey && <span style={{ fontSize: 11, fontWeight: 800, color: GREEN }}>Correct answer</span>}
                {isYours && !isKey && <span style={{ fontSize: 11, fontWeight: 800, color: RED }}>Your answer</span>}
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
        <div style={{ display: "flex", gap: 8, background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 10, padding: "9px 12px" }}>
          <BookOpenCheck size={15} color={INDIGO} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: NAVY, lineHeight: 1.6 }}><b style={{ color: INDIGO }}>Solution:</b> <MathText text={a.explanation} /></div>
        </div>
      )}
    </div>
  );
}
