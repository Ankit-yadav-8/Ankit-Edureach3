import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gauge as GaugeIcon, RotateCcw, ArrowRight, Trophy,
  Target, AlertCircle, BookOpen, TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { predictRank, maxPerSubject, maxTotal } from "../../utils/rankPredictor.js";
import { Gauge } from "../Charts.jsx";
import { fmtRank } from "../../utils/format.js";

const CATS_MAIN = ["General", "EWS", "OBC-NCL", "SC", "ST"];
const CATS_ADV  = ["General", "EWS", "OBC-NCL", "SC", "ST", "PwD"];

export default function RankPredictorTool({ accent = "#F97316", advanced = false }) {
  const cap      = maxPerSubject(advanced);
  const totalMax = maxTotal(advanced);
  const cats     = advanced ? CATS_ADV : CATS_MAIN;

  const [form, setForm] = useState({ physics: "", chemistry: "", maths: "", category: "General" });
  const [res,  setRes]  = useState(null);
  const nav = useNavigate();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => setRes(predictRank({ ...form, advanced }));
  const reset  = () => { setForm({ physics: "", chemistry: "", maths: "", category: "General" }); setRes(null); };

  const scorePct = res ? Math.round((res.total / totalMax) * 100) : 0;

  return (
    <div className="grid-2" style={{ alignItems: "start", gap: 28 }}>

      {/* ── INPUT FORM ─────────────────────────────────────── */}
      <div className="card">
        <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.2rem", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <GaugeIcon size={20} color={accent} /> Enter your expected marks
        </h3>
        <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 4 }}>
          Out of {cap} each · total {totalMax} marks{advanced ? " (Paper 1 + Paper 2 combined)" : ""}.
        </p>
        {advanced && (
          <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 16 }}>
            Add Paper 1 + Paper 2 marks per subject (≈60 + 60 each, max 120 per subject).
          </p>
        )}

        <div className="grid-3" style={{ gap: 12, marginTop: advanced ? 0 : 12 }}>
          {["physics", "chemistry", "maths"].map((s) => (
            <div className="field" key={s}>
              <label style={{ textTransform: "capitalize" }}>{s}</label>
              <input
                className="input" type="number" min="0" max={cap}
                value={form[s]} onChange={(e) => set(s, e.target.value)}
                placeholder={`0–${cap}`}
              />
            </div>
          ))}
        </div>

        <div className="field" style={{ marginTop: 4 }}>
          <label>Category</label>
          <select className="select" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            className="btn full"
            style={{ background: accent, color: "#fff", justifyContent: "center" }}
            onClick={submit}
          >
            Predict my rank
          </button>
          <button className="btn btn-ghost" onClick={reset} aria-label="Reset">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* ── RESULT PANEL ───────────────────────────────────── */}
      <div className="card" style={{ minHeight: 320 }}>
        {!res ? (
          <div style={{ display: "grid", placeItems: "center", height: 320, color: "var(--muted)", textAlign: "center" }}>
            <div>
              <GaugeIcon size={48} color="var(--line)" />
              <p style={{ marginTop: 12 }}>Your predicted All-India rank and category rank<br />will appear here.</p>
              <p style={{ marginTop: 6, fontSize: 12 }}>
                {advanced ? "JEE Advanced scale: 0–360 (P1 + P2 combined)" : "JEE Main scale: 0–300"}
              </p>
            </div>
          </div>
        ) : advanced ? (
          <AdvancedResult res={res} scorePct={scorePct} accent={accent} nav={nav} />
        ) : (
          <MainResult res={res} scorePct={scorePct} totalMax={totalMax} accent={accent} nav={nav} />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   JEE MAIN result (unchanged logic)
══════════════════════════════════════════════ */
function MainResult({ res, scorePct, totalMax, accent, nav }) {
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
            {fmtRank(res.rank)}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
            Range {fmtRank(res.low)} – {fmtRank(res.high)}
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

      <button
        className="btn full"
        style={{ background: "var(--navy)", color: "#fff", justifyContent: "center", marginTop: 16 }}
        onClick={() => nav("/jee-main#college")}
      >
        See colleges for rank {fmtRank(res.rank)} <ArrowRight size={16} />
      </button>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
        Illustrative model from past marks-vs-rank trends. Actual ranks vary by session &amp; shift.
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   JEE ADVANCED result — full 8-point output
══════════════════════════════════════════════ */
function AdvancedResult({ res, scorePct, accent, nav }) {
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

      {/* 6. Likely branches */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
          <BookOpen size={13} color={OR} />
          Likely branches at rank ~{fmtRank(res.effRank)}
        </div>
        {res.branches.map((b, i) => (
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

      <button
        className="btn full"
        style={{ background: "var(--navy)", color: "#fff", justifyContent: "center" }}
        onClick={() => nav("/jee-advanced#college")}
      >
        See IIT options for rank {fmtRank(res.effRank)} <ArrowRight size={16} />
      </button>

      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
        Based on 2025 actual data + 2026 projections. ±5–10% variance expected. Not official.
      </p>
    </motion.div>
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
