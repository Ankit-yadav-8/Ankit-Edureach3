import { useState } from "react";
import { motion } from "framer-motion";
import { Gauge as GaugeIcon, RotateCcw, ArrowRight, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { predictRank, maxPerSubject, maxTotal } from "../../utils/rankPredictor.js";
import { Gauge } from "../Charts.jsx";
import { fmtRank } from "../../utils/format.js";

const CATS = ["General", "EWS", "OBC-NCL", "SC", "ST"];

export default function RankPredictorTool({ accent = "#F97316", advanced = false }) {
  const cap = maxPerSubject(advanced);
  const totalMax = maxTotal(advanced);
  const [form, setForm] = useState({ physics: "", chemistry: "", maths: "", category: "General" });
  const [res, setRes] = useState(null);
  const nav = useNavigate();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => setRes(predictRank({ ...form, advanced }));
  const reset = () => { setForm({ physics: "", chemistry: "", maths: "", category: "General" }); setRes(null); };

  const scorePct = res ? Math.round((res.total / totalMax) * 100) : 0;
  const headlineLabel = res
    ? res.isGeneral ? "Predicted All-India Rank (CRL)" : `Predicted ${res.category} category rank`
    : "";

  return (
    <div className="grid-2" style={{ alignItems: "start", gap: 28 }}>
      {/* Form */}
      <div className="card">
        <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.2rem", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <GaugeIcon size={20} color={accent} /> Enter your expected marks
        </h3>
        <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 4 }}>
          Out of {cap} each · total {totalMax} marks{advanced ? " (JEE Advanced — Paper 1 + Paper 2 combined)" : ""}.
        </p>
        {advanced && <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 16 }}>Add your Paper 1 + Paper 2 marks per subject (≈60 + 60).</p>}

        <div className="grid-3" style={{ gap: 12, marginTop: advanced ? 0 : 12 }}>
          {["physics", "chemistry", "maths"].map((s) => (
            <div className="field" key={s}>
              <label style={{ textTransform: "capitalize" }}>{s}</label>
              <input className="input" type="number" min="0" max={cap} value={form[s]}
                onChange={(e) => set(s, e.target.value)} placeholder={`0–${cap}`} />
            </div>
          ))}
        </div>

        <div className="field" style={{ marginTop: 4 }}>
          <label>Category</label>
          <select className="select" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button className="btn full" style={{ background: accent, color: "#fff", justifyContent: "center" }} onClick={submit}>Predict my rank</button>
          <button className="btn btn-ghost" onClick={reset} aria-label="Reset"><RotateCcw size={16} /></button>
        </div>
      </div>

      {/* Result */}
      <div className="card" style={{ minHeight: 320 }}>
        {!res ? (
          <div style={{ display: "grid", placeItems: "center", height: 320, color: "var(--muted)", textAlign: "center" }}>
            <div>
              <GaugeIcon size={48} color="var(--line)" />
              <p style={{ marginTop: 12 }}>Your predicted rank, percentile and category rank<br />will appear here.</p>
              <p style={{ marginTop: 6, fontSize: 12 }}>{advanced ? "JEE Advanced scale: 0–360" : "JEE Main scale: 0–300"}</p>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <div className="grid-2" style={{ gap: 8, alignItems: "center" }}>
              <Gauge value={scorePct} label="Score %" color={accent} height={180} />
              <div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{headlineLabel}</div>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "2rem", color: "var(--navy)", lineHeight: 1.1 }}>{fmtRank(res.rank)}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>Range {fmtRank(res.low)} – {fmtRank(res.high)}</div>
              </div>
            </div>

            <div className="grid-3" style={{ gap: 10, marginTop: 14, textAlign: "center" }}>
              {(() => {
                const stats = [["Total", `${res.total}/${totalMax}`]];
                if (!advanced) stats.push(["Percentile", `${res.percentile}`]);
                stats.push([res.isGeneral ? "CRL (AIR)" : "Common rank", fmtRank(res.crl)]);
                if (!res.isGeneral) stats.push([`${res.category} rank`, fmtRank(res.categoryRank)]);
                return stats.slice(0, 3).map(([l, v]) => (
                  <div key={l} style={{ background: "var(--sky)", borderRadius: 12, padding: "12px 8px" }}>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{l}</div>
                    <strong style={{ color: "var(--navy)", fontSize: 15 }}>{v}</strong>
                  </div>
                ));
              })()}
            </div>

            {!res.isGeneral && (
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                <Trophy size={13} color={accent} /> CRL {fmtRank(res.crl)} · Your {res.category} rank {fmtRank(res.categoryRank)}
              </div>
            )}

            <button className="btn full" style={{ background: "var(--navy)", color: "#fff", justifyContent: "center", marginTop: 16 }}
              onClick={() => nav(`${advanced ? "/jee-advanced" : "/jee-main"}#college`)}>
              See colleges for rank {fmtRank(res.rank)} <ArrowRight size={16} />
            </button>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
              Illustrative model from past marks-vs-rank trends. Actual ranks vary by session &amp; shift.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
