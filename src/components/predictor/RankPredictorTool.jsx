import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Gauge as GaugeIcon, RotateCcw, ArrowRight, Trophy,
  Target, AlertCircle, BookOpen, TrendingUp, Loader2, MapPin, Building2,
  Atom, FlaskConical, Calculator, Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { predictRank, predictFromPercentile, maxPerSubject, maxTotal } from "../../utils/rankPredictor.js";
import { useCollegePredictor } from "../../hooks/useCollegePredictor.js";
import { TIER_COLOR } from "../../utils/collegePredictor.js";
import { Gauge } from "../Charts.jsx";
import { fmtRank } from "../../utils/format.js";

/* NOTE: no module-scope pre-warm. This component renders on the homepage, so a
   module-level loadPredictorDB() fetched josaa_2025.csv (~12 MB) on every visit
   before the user touched anything. The cutoff DB is only ever read inside the
   predictor worker (rank prediction itself is pure math), so the main thread
   never loads the CSV at all now — we just spin the worker up on the first
   keystroke, seconds before "Predict" is clicked. */

const CATS_MAIN = ["General", "EWS", "OBC-NCL", "SC", "ST"];
const CATS_ADV  = ["General", "EWS", "OBC-NCL", "SC", "ST", "PwD"];

// rankPredictor category names → collegePredictor category names
const CAT_TO_COLLEGE = {
  General: "OPEN", EWS: "EWS", "OBC-NCL": "OBC-NCL", SC: "SC", ST: "ST", PwD: "OPEN",
};

// Per-subject visual identity for the input cards
const SUBJECTS = [
  { key: "physics",   label: "Physics",   icon: Atom,         color: "#FF693D" },
  { key: "chemistry", label: "Chemistry", icon: FlaskConical, color: "#0EA5A4" },
  { key: "maths",     label: "Maths",     icon: Calculator,   color: "#7C3AED" },
];

// Staggered fade-up used by the empty-state placeholder (icon → text)
const EMPTY_WRAP = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } } };
const EMPTY_ITEM = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function RankPredictorTool({ accent = "#FF693D", accentText = accent, advanced = false }) {
  const cap      = maxPerSubject(advanced);
  const totalMax = maxTotal(advanced);
  const cats     = advanced ? CATS_ADV : CATS_MAIN;

  // Input mode — JEE Main lets students predict from raw marks OR from their
  // NTA percentile (which is what the result card actually shows them). JEE
  // Advanced is marks-only.
  const [mode, setMode] = useState("marks"); // "marks" | "percentile"
  const isPctMode = !advanced && mode === "percentile";

  const [form, setForm] = useState({ physics: "", chemistry: "", maths: "", percentile: "", category: "General" });
  const [res,  setRes]  = useState(null);
  const nav = useNavigate();

  // Inline college preview — predicted from the CATEGORY rank (CRL for General)
  const { predict: predictColleges, reset: resetColleges, warmWorker, results: colleges, loading: collegesLoading } =
    useCollegePredictor();

  // Boot the predictor worker (which fetches the 2025 cutoff CSV) on the user's
  // first keystroke — see the note at the top of this file.
  const warmed = useRef(false);
  const warm = () => {
    if (warmed.current) return;
    warmed.current = true;
    warmWorker();
  };

  const set = (k, v) => { warm(); setForm((f) => ({ ...f, [k]: v })); };

  // Percentile entry: accept 0–100 with up to 4 decimals (NTA reports 7), clamp
  // the integer part so a stray digit can't push it past 100.
  const setPct = (raw) => {
    if (raw === "") return set("percentile", "");
    if (!/^\d{0,3}(\.\d{0,4})?$/.test(raw)) return;
    const n = Number(raw);
    if (Number.isNaN(n) || n < 0) return;
    set("percentile", n > 100 ? "100" : raw);
  };

  // Marks entry: accept what the student types (0–999) so we can SHOW a clear
  // "max {cap}" message when any subject exceeds 100 (or 120 for JEE Advanced),
  // instead of silently swallowing the extra digits. Empty stays empty.
  const setMark = (k, raw) => {
    if (raw === "") return set(k, "");
    const n = Math.floor(Number(raw));
    if (Number.isNaN(n) || n < 0) return;
    set(k, String(Math.min(999, n)));
  };

  // Per-subject overflow (marks above the per-subject cap) → drives the inline
  // warning + blocks prediction until corrected. (Marks mode only.)
  const overSubjects = isPctMode ? [] : SUBJECTS.filter((s) => Number(form[s.key]) > cap);
  const hasOverflow  = overSubjects.length > 0;

  // Percentile mode is ready once a 0–100 value is present.
  const pctValid = form.percentile !== "" && Number(form.percentile) >= 0 && Number(form.percentile) <= 100;

  const submit = () => {
    if (isPctMode) {
      if (!pctValid) return;
      setRes(predictFromPercentile({ percentile: form.percentile, category: form.category }));
      return;
    }
    if (hasOverflow) return; // never predict from invalid (>cap) marks
    setRes(predictRank({ ...form, advanced }));
  };
  const reset  = () => {
    setForm({ physics: "", chemistry: "", maths: "", percentile: "", category: "General" });
    setRes(null);
    resetColleges();
  };

  // Whenever a rank is predicted, fetch matching colleges using the CATEGORY
  // rank (res.rank already holds the category rank — CRL only for General),
  // matched directly against JoSAA category closing ranks (rankType "category").
  useEffect(() => {
    if (!res || !res.ranked || !res.rank) { resetColleges(); return; }
    predictColleges({
      rank:     res.rank,
      category: CAT_TO_COLLEGE[res.category] ?? "OPEN",
      rankType: "category",
      types:    advanced ? ["IIT"] : ["NIT", "IIIT"],
    }, false);
  }, [res, advanced, predictColleges, resetColleges]);

  // Gauge value: % of max marks in marks mode, the percentile itself in pct mode.
  const scorePct = res ? (res.total != null ? Math.round((res.total / totalMax) * 100) : Math.round(res.percentile)) : 0;

  // Live running total as the user types (raw, so over-cap entries are visible)
  const liveTotal = SUBJECTS.reduce((sum, s) => sum + (Number(form[s.key]) || 0), 0);
  const livePct = Math.round((liveTotal / totalMax) * 100);
  const hasInput = SUBJECTS.some((s) => form[s.key] !== "") || form.percentile !== "";

  return (
    <>
      <div className="grid-2" style={{ alignItems: "stretch", gap: 28 }}>

      {/* ── INPUT FORM ─────────────────────────────────────── */}
      <div className="card" style={{ borderTop: `3px solid ${accent}`, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 70% 60% at 100% 0%, ${accent}10 0%, transparent 60%)`,
        }} />
        <div style={{ position: "relative" }}>
          <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.25rem", marginBottom: 4, display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{
              display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 9,
              background: `${accent}18`, color: accentText, flexShrink: 0,
            }}>
              <GaugeIcon size={18} />
            </span>
            Enter your expected marks
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: advanced ? 4 : 16 }}>
            Out of {cap} each · total {totalMax} marks{advanced ? " (Paper 1 + Paper 2 combined)" : ""}.
          </p>
          {advanced && (
            <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 16 }}>
              Add Paper 1 + Paper 2 marks per subject (≈60 + 60 each, max 120 per subject).
            </p>
          )}

          {/* ── Subject input cards ── */}
          <div className="grid-3" style={{ gap: 11 }}>
            {SUBJECTS.map(({ key, label, icon: Icon, color }) => {
              const filled = form[key] !== "";
              const over   = Number(form[key]) > cap;
              return (
                <div key={key} style={{
                  border: `1px solid ${over ? "#ef4444" : filled ? `${color}55` : "var(--line)"}`,
                  background: over ? "#fef2f2" : filled ? `${color}0c` : "var(--sky)",
                  borderRadius: 13, padding: "12px 12px 11px", transition: "all .18s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{
                      display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: 7,
                      background: over ? "#fee2e2" : `${color}1c`, color: over ? "#ef4444" : color, flexShrink: 0,
                    }}>
                      <Icon size={14} />
                    </span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--navy)", fontFamily: "Sora" }}>{label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                    <input
                      type="number" min="0" max={cap} step="1"
                      value={form[key]} onChange={(e) => setMark(key, e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submit()}
                      placeholder="0"
                      aria-invalid={over}
                      style={{
                        width: "100%", border: "none", background: "transparent", outline: "none",
                        fontFamily: "Sora", fontWeight: 800, fontSize: 22,
                        color: over ? "#ef4444" : "var(--navy)",
                        padding: 0, minWidth: 0,
                      }}
                    />
                    <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>/ {cap}</span>
                  </div>
                  {over && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, color: "#ef4444", fontSize: 11, fontWeight: 700 }}>
                      <AlertCircle size={12} /> Max {cap}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Live total bar ── */}
          <div style={{
            marginTop: 14, padding: "12px 14px", borderRadius: 12,
            background: "var(--sky)", border: "1px solid var(--line)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>
                Total entered
              </span>
              <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, color: "var(--navy)" }}>
                {liveTotal}<span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}> / {totalMax}</span>
                <span style={{ fontSize: 12, color: accentText, fontWeight: 700, marginLeft: 8 }}>{livePct}%</span>
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 5, background: "#e7e7ee", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 5,
                width: `${Math.min(100, livePct)}%`,
                background: `linear-gradient(90deg, ${accent}aa, ${accent})`,
                transition: "width .35s cubic-bezier(.4,0,.2,1)",
              }} />
            </div>
          </div>

          {/* ── Category pills ── */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
              Category
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {cats.map((c) => {
                const active = form.category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("category", c)}
                    style={{
                      padding: "7px 14px", borderRadius: 50, cursor: "pointer",
                      fontSize: 12.5, fontWeight: 700, fontFamily: "Sora",
                      border: `1px solid ${active ? accentText : "var(--line)"}`,
                      background: active ? accentText : "#fff",
                      color: active ? "#fff" : "var(--navy)",
                      boxShadow: active ? `0 2px 10px ${accent}40` : "none",
                      transition: "all .16s",
                    }}
                  >{c}</button>
                );
              })}
            </div>
          </div>

          {/* ── Validation message: any subject above the cap ── */}
          {hasOverflow && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 14, padding: "10px 13px", borderRadius: 11,
                background: "#fef2f2", border: "1px solid #fecaca",
                display: "flex", alignItems: "flex-start", gap: 8,
                fontSize: 12.5, color: "#b91c1c", lineHeight: 1.5,
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                Each subject is out of <strong>{cap}</strong> marks. Please fix{" "}
                <strong>{overSubjects.map((s) => s.label).join(", ")}</strong> —
                a single subject can&apos;t exceed {cap}.
              </span>
            </motion.div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: hasOverflow ? 12 : 20 }}>
            <button
              className="btn full"
              style={{
                background: hasOverflow ? "#cbd5e1" : accentText, color: "#fff", justifyContent: "center",
                boxShadow: hasOverflow ? "none" : `0 6px 18px ${accent}44`, fontWeight: 700,
                cursor: hasOverflow ? "not-allowed" : "pointer",
              }}
              onClick={submit}
              disabled={hasOverflow}
            >
              <Sparkles size={16} /> Predict my rank
            </button>
            <button className="btn btn-ghost" onClick={reset} aria-label="Reset" title="Reset"
              disabled={!hasInput && !res}>
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── RESULT PANEL ───────────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ minHeight: 320, display: "flex", flexDirection: "column" }}>
        {!res ? (
          <motion.div
            style={{ display: "grid", placeItems: "center", flex: 1, minHeight: 320, color: "var(--muted)", textAlign: "center" }}
            variants={EMPTY_WRAP} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          >
            <div>
              {/* animated gauge badge — slowly rotating dashed ring + gently pulsing icon */}
              <motion.div variants={EMPTY_ITEM} style={{ position: "relative", width: 76, height: 76, margin: "0 auto" }}>
                <motion.span aria-hidden
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px dashed ${accent}40` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 16, ease: "linear", repeat: Infinity }}
                />
                <motion.span
                  style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", borderRadius: "50%", background: `${accent}10` }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
                >
                  <GaugeIcon size={36} color={accent} style={{ opacity: 0.75 }} />
                </motion.span>
              </motion.div>
              <motion.p variants={EMPTY_ITEM} style={{ marginTop: 16, fontWeight: 600, color: "var(--navy)" }}>
                Your predicted rank &amp; colleges will appear here
              </motion.p>
              <motion.p variants={EMPTY_ITEM} style={{ marginTop: 4, fontSize: 13 }}>
                Enter your marks and hit <strong style={{ color: accentText }}>Predict my rank</strong>.
              </motion.p>
              <motion.p variants={EMPTY_ITEM} style={{ marginTop: 10, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 50, background: "var(--sky)", border: "1px solid var(--line)" }}>
                <Target size={12} color={accent} />
                {advanced ? "JEE Advanced scale: 0–360 (P1 + P2 combined)" : "JEE Main scale: 0–300"}
              </motion.p>
            </div>
          </motion.div>
        ) : advanced ? (
          <AdvancedResult res={res} scorePct={scorePct} accent={accent} nav={nav}
            colleges={colleges} collegesLoading={collegesLoading} />
        ) : (
          <MainResult res={res} scorePct={scorePct} totalMax={totalMax} accent={accent} nav={nav}
            colleges={colleges} collegesLoading={collegesLoading} />
        )}
        </motion.div>
      </div>

      {/* ── How the Rank Predictor works ── */}
      <RankPredictorNotes accent={accent} accentText={accentText} advanced={advanced} />
    </>
  );
}

/* ══════════════════════════════════════════════
   "Good to know" points about the Rank Predictor
══════════════════════════════════════════════ */
function RankPredictorNotes({ accent, accentText, advanced }) {
  const points = [
    {
      icon: GaugeIcon,
      title: "How your rank is estimated",
      body: advanced
        ? "Your Paper 1 + Paper 2 marks are mapped to an All-India CRL using 2025 actual marks-vs-rank data cross-checked against 2026 projections."
        : "Your marks are converted to an All-India CRL by interpolating historical NTA marks-vs-rank trends across the full ~11–12 lakh candidate pool.",
    },
    {
      icon: Trophy,
      title: "CRL + your category rank",
      body: "You get both the All-India (CRL) rank and your reserved-category rank. For SC/ST/OBC-NCL/EWS, the category rank is what actually drives counselling — so that's what we predict colleges with.",
    },
    {
      icon: Target,
      title: "A range, not a single number",
      body: "Real ranks shift with shift-wise normalisation, paper difficulty and the candidate pool, so we show a realistic low–high band around the estimate rather than one exact figure.",
    },
    {
      icon: Building2,
      title: "Colleges matched to that rank",
      body: advanced
        ? "The IIT options shown use your category rank against JoSAA closing ranks. Tap 'See all IIT options' for the full branch-wise predictor."
        : "The NIT/IIIT options shown use your category rank against JoSAA closing ranks. Tap 'See all colleges' for the full branch-wise predictor.",
    },
  ];
  return <NotesBlock accent={accent} accentText={accentText} eyebrow="About this tool" heading="How the Rank Predictor works" points={points}
    note={advanced
      ? "Estimates use 2025 actuals + 2026 projections — expect ±5–10% variance. Not an official prediction; verify on jeeadv.ac.in."
      : "Estimates model past marks-vs-rank trends — actual ranks vary by session & shift normalisation. Not an official prediction; verify on jeemain.nta.nic.in."} />;
}

/* ══════════════════════════════════════════════
   Animated count-up number — eases from 0 to `value`
   on mount / whenever the value changes.
══════════════════════════════════════════════ */
function CountUp({ value, format = (n) => n, duration = 850 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!Number.isFinite(value)) { setDisplay(value); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{format(display)}</>;
}

/* ══════════════════════════════════════════════
   JEE MAIN result
══════════════════════════════════════════════ */
function MainResult({ res, scorePct, totalMax, accent, nav, colleges, collegesLoading }) {
  const headline = res.isGeneral
    ? "Predicted All-India Rank (CRL)"
    : `Predicted ${res.category} category rank`;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
      <div className="grid-2" style={{ gap: 8, alignItems: "center" }}>
        <Gauge value={scorePct} label="Score %" color={accent} height={180} />
        <div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{headline}</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "2rem", color: "var(--navy)", lineHeight: 1.1 }}>
            <CountUp value={res.rank} format={fmtRank} />
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
            Range {fmtRank(res.low)} – {fmtRank(res.high)} <span style={{ color: "var(--muted)" }}>(±{Math.round((res.high / res.rank - 1) * 100)}%)</span>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8,
            padding: "4px 10px", borderRadius: 50, fontSize: 12, fontWeight: 700,
            background: `${accent}14`, color: accentText,
          }}>
            <TrendingUp size={12} /> {res.percentile} %ile
          </div>
        </div>
      </div>

      <div className={res.isGeneral ? "grid-2" : "grid-3"} style={{ gap: 10, marginTop: 14, textAlign: "center" }}>
        {[
          ["Total", `${res.total}/${totalMax}`],
          ["CRL (AIR)", fmtRank(res.crl)],
          ...(res.isGeneral ? [] : [[`${res.category} category rank`, fmtRank(res.categoryRank)]]),
        ].map(([l, v]) => (
          <div key={l} style={{ background: "var(--sky)", borderRadius: 12, padding: "12px 8px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{l}</div>
            <strong style={{ color: "var(--navy)", fontSize: 15 }}>{v}</strong>
          </div>
        ))}
      </div>

      {!res.isGeneral && (
        <div style={{
          marginTop: 12, padding: "9px 12px", borderRadius: 10,
          background: `${accent}12`, border: `1px solid ${accent}30`,
          display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
          fontSize: 12.5, color: "var(--navy)",
        }}>
          <Trophy size={14} color={accent} />
          Use your <strong>{res.category} category rank {fmtRank(res.categoryRank)}</strong> in the College Predictor below.
        </div>
      )}

      <CollegePreview
        colleges={colleges}
        loading={collegesLoading}
        accent={accent}
        category={res.category}
        isGeneral={res.isGeneral}
        rankUsed={res.rank}
      />

      <button
        className="btn full"
        style={{ background: "var(--navy)", color: "#fff", justifyContent: "center", marginTop: 16 }}
        onClick={() => nav("/jee-main#college")}
      >
        See all colleges for rank {fmtRank(res.rank)} <ArrowRight size={16} />
      </button>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
        Illustrative model from past marks-vs-rank trends. Actual ranks vary by session &amp; shift.
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   Build "likely branches" from REAL JoSAA category-cutoff
   matches (the same data the college preview uses), so
   reserved-category candidates see branches that actually
   close at their CATEGORY rank — not the General/CRL table.
   Returns distinct "College — Branch (closing ~X)" lines.
══════════════════════════════════════════════ */
function branchesFromColleges(colleges, limit = 5) {
  if (!colleges || !colleges.length) return null;
  const seen = new Set();
  const out  = [];
  for (const c of colleges) {
    const name = c.short || c.college;
    const key  = `${name}|${c.branch}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(`${name} ${c.branch} (closing ~${fmtRank(c.closing)})`);
    if (out.length >= limit) break;
  }
  return out.length ? out : null;
}

/* ══════════════════════════════════════════════
   JEE ADVANCED result — full 8-point output
══════════════════════════════════════════════ */
function AdvancedResult({ res, scorePct, accent, nav, colleges, collegesLoading }) {
  const OR = accent;

  /* ── Not ranked / below cutoff ── */
  if (!res.ranked) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "28px 8px", textAlign: "center" }}>
          <AlertCircle size={48} color="#ef4444" />
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.25rem", color: "#ef4444" }}>
            Below Cutoff — Not Ranked
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13.5, maxWidth: 340, lineHeight: 1.65 }}>
            Your score of <strong>{res.total}/360</strong> is below the minimum required for the{" "}
            <strong>{res.category}</strong> rank list.
          </p>
          <div style={{ background: "#fff1f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "12px 18px", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
            <div style={{ fontSize: 12.5, color: "#991b1b", lineHeight: 1.7 }}>
              <strong>Minimum aggregate:</strong> ~{res.cutoffNeeded} marks<br />
              <strong>Per-subject minimum:</strong> ≥ {res.subCutoffNeeded} in each subject<br />
              <strong>Your total:</strong> {res.total} marks
            </div>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 12.5, maxWidth: 340 }}>
            You will not receive a JEE Advanced AIR. Use your JEE Main rank for NIT/IIIT counselling.
          </p>
        </div>
      </motion.div>
    );
  }

  const effLabel = res.isGeneral
    ? `CRL (drives IIT branch prediction)`
    : `${res.category} rank (drives IIT branch prediction)`;
  const effDisplay = res.isGeneral
    ? `~${fmtRank(res.crl)}`
    : `~${fmtRank(res.catRank)}`;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>

      {/* 1. Score gauge + CRL range headline */}
      <div className="grid-2" style={{ gap: 10, alignItems: "center", marginBottom: 14 }}>
        <Gauge value={scorePct} label="Score %" color={OR} height={155} />
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 3 }}>
            CRL Rank 2026 (est.)
          </div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.5rem", color: "var(--navy)", lineHeight: 1.15 }}>
            {fmtRank(res.crlLo)} – {fmtRank(res.crlHi)}
          </div>
          <div style={{ fontSize: 12.5, color: OR, fontWeight: 700 }}>
            mid ~{fmtRank(res.crl)}
          </div>

          {/* 2. Category rank (only if non-General) */}
          {!res.isGeneral && (
            <div style={{
              marginTop: 6, padding: "5px 10px", borderRadius: 8,
              background: `${OR}12`, border: `1px solid ${OR}30`, fontSize: 12,
            }}>
              <Trophy size={11} color={OR} style={{ verticalAlign: "middle", marginRight: 4 }} />
              <strong>{res.category} rank:</strong>{" "}
              <span style={{ color: "var(--navy)", fontWeight: 700 }}>
                ~{fmtRank(res.catRankLo)} – {fmtRank(res.catRankHi)}
              </span>
              <span style={{ color: "var(--muted)", fontSize: 11 }}> (mid ~{fmtRank(res.catRank)})</span>
            </div>
          )}
        </div>
      </div>

      {/* 3 + 4. Key stats: Total, CRL / Category rank, 2025 Reference */}
      <div className="grid-3" style={{ gap: 8, marginBottom: 10 }}>
        <StatBox label="Total marks" value={`${res.total} / 360`} />
        {res.isGeneral
          ? <StatBox label="CRL 2026 (est.)" value={`~${fmtRank(res.crl)}`} accent={OR} />
          : <StatBox label={`${res.category} category rank`} value={`~${fmtRank(res.catRank)}`} accent={OR} />}
        <StatBox
          label="2025 Reference AIR"
          value={`${fmtRank(res.ref25Lo)}–${fmtRank(res.ref25Hi)}`}
          sub="2025 actual data"
        />
      </div>

      {/* 5. Effective rank badge */}
      <div style={{
        background: `${OR}0e`, border: `1px solid ${OR}2a`,
        borderRadius: 10, padding: "8px 12px", marginBottom: 10,
        display: "flex", alignItems: "center", gap: 8, fontSize: 12.5,
      }}>
        <Target size={14} color={OR} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>
          <strong>Effective rank for branch prediction:</strong>{" "}
          <span style={{ color: "var(--muted)" }}>{effLabel}</span>
        </span>
        <strong style={{ color: "var(--navy)", fontSize: 14, whiteSpace: "nowrap" }}>{effDisplay}</strong>
      </div>

      {/* 6. Likely branches — for reserved categories, derive from REAL JoSAA
            CATEGORY closing ranks (res.branches/BRANCH_TABLE is General/CRL-only). */}
      {(() => {
        const realBranches = res.isGeneral ? null : branchesFromColleges(colleges);
        // Reserved category, still fetching real category cutoffs → show loader
        // instead of the (General-calibrated) fallback list.
        if (!res.isGeneral && !realBranches && collegesLoading) {
          return (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                <BookOpen size={13} color={OR} />
                Likely branches at {res.category} rank ~{fmtRank(res.effRank)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 12.5, padding: "8px 2px" }}>
                <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} />
                Matching branches against {res.category} closing ranks…
              </div>
            </div>
          );
        }
        const branchList = realBranches ?? res.branches;
        return (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
              <BookOpen size={13} color={OR} />
              Likely branches at {res.isGeneral ? "CRL" : `${res.category} rank`} ~{fmtRank(res.effRank)}
            </div>
            {branchList.map((b, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 10px", borderRadius: 8, marginBottom: 5, fontSize: 13,
                background: i === 0 ? `${OR}10` : "var(--sky)",
                border: i === 0 ? `1px solid ${OR}25` : "none",
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: i === 0 ? OR : "var(--line)",
                  color: i === 0 ? "#fff" : "var(--navy)",
                  fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center",
                }}>{i + 1}</span>
                {b}
              </div>
            ))}
          </div>
        );
      })()}

      {/* 7. Stretch option */}
      <div style={{
        background: "#f0fdf4", border: "1px solid #86efac",
        borderRadius: 9, padding: "8px 12px", marginBottom: 10, fontSize: 12.5,
      }}>
        <TrendingUp size={13} color="#16a34a" style={{ verticalAlign: "middle", marginRight: 5 }} />
        <strong style={{ color: "#15803d" }}>Stretch (best case, rank at low end): </strong>
        <span style={{ color: "#166534" }}>{res.stretch}</span>
      </div>

      {/* 8. Advice */}
      <div style={{
        background: "var(--sky)", borderRadius: 9,
        padding: "9px 12px", marginBottom: 14,
        fontSize: 12.5, color: "var(--navy)", lineHeight: 1.6,
      }}>
        <strong>Assessment: </strong>{res.advice}
      </div>

      <CollegePreview
        colleges={colleges}
        loading={collegesLoading}
        accent={OR}
        category={res.category}
        isGeneral={res.isGeneral}
        rankUsed={res.effRank}
      />

      <button
        className="btn full"
        style={{ background: "var(--navy)", color: "#fff", justifyContent: "center", marginTop: 14 }}
        onClick={() => nav("/jee-advanced#college")}
      >
        See all IIT options for rank {fmtRank(res.effRank)} <ArrowRight size={16} />
      </button>

      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
        Based on 2025 actual data + 2026 projections. ±5–10% variance expected. Not official.
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   Inline college preview — driven by the CATEGORY rank
   (CRL only for General). Matched against JoSAA category
   closing ranks so reserved candidates see colleges at the
   right place for their category rank.
══════════════════════════════════════════════ */
function CollegePreview({ colleges, loading, accent, category, isGeneral, rankUsed }) {
  const rankLabel = isGeneral
    ? `CRL ${fmtRank(rankUsed)}`
    : `${category} category rank ${fmtRank(rankUsed)}`;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
        <Building2 size={13} color={accent} />
        Top colleges for your {rankLabel}
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 13, padding: "10px 2px" }}>
          <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />
          Matching colleges against {isGeneral ? "All-India" : category} closing ranks…
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : !colleges ? null : colleges.length === 0 ? (
        <div style={{ fontSize: 12.5, color: "var(--muted)", padding: "8px 2px" }}>
          No close college-branch matches at this rank — try the full College Predictor below for wider options.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {colleges.slice(0, 5).map((c) => (
            <div key={`${c.slug}-${c.branchCode}`} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 11px", borderRadius: 9, background: "var(--sky)", fontSize: 12.5,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "var(--navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.short || c.college}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={10} /> {c.branch} · closing {fmtRank(c.closing)}
                </div>
              </div>
              <span className="badge" style={{
                flexShrink: 0,
                background: `${TIER_COLOR[c.tier]}22`, color: TIER_COLOR[c.tier],
              }}>
                {c.tier}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Shared stat box ── */
function StatBox({ label, value, sub, accent }) {
  return (
    <div style={{ background: "var(--sky)", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 3 }}>{label}</div>
      <strong style={{ color: "var(--navy)", fontSize: 14 }}>{value}</strong>
      {sub && <div style={{ fontSize: 10, color: accent || "var(--muted)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   Shared "Good to know" points block (reused by the
   College Predictor too). Renders a titled card with a
   responsive grid of icon + text points.
══════════════════════════════════════════════ */
export function NotesBlock({ accent, accentText = accent, eyebrow, heading, points, note }) {
  return (
    <div className="card" style={{ marginTop: 22, borderTop: `3px solid ${accent}` }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: accentText, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 3 }}>
          {eyebrow}
        </div>
        <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, color: "var(--navy)" }}>{heading}</h4>
      </div>

      <div className="notes-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {points.map(({ icon: Icon, title, body }) => (
          <div key={title} style={{
            display: "flex", gap: 11, padding: "13px 15px",
            background: "var(--sky)", borderRadius: 12, border: "1px solid var(--line)",
          }}>
            <span style={{
              display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 9,
              background: `${accent}18`, color: accent, flexShrink: 0,
            }}>
              <Icon size={17} />
            </span>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, color: "var(--navy)", marginBottom: 3 }}>{title}</div>
              <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      {note && (
        <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <AlertCircle size={13} color={accent} style={{ flexShrink: 0 }} /> {note}
        </p>
      )}

      <style>{`@media (max-width: 640px){ .notes-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
