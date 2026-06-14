import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Trophy, MapPin, ArrowRight, GitCompare } from "lucide-react";
import { useShortlist } from "../context/Shortlist.jsx";
import { COLLEGE_BY_SLUG, COLLEGES, BRANCHES } from "../data/colleges.js";
import { realFinalClose2025 } from "../utils/cutoffEngine.js";
import { Bars } from "../components/Charts.jsx";
import { fmtINR, fmtRank } from "../utils/format.js";
import Seo from "../components/Seo.jsx";

export default function Compare() {
  const { compare, toggleCompare, MAX_COMPARE } = useShortlist();
  const nav = useNavigate();
  const [picker, setPicker] = useState(false);
  const cols = compare.map((s) => COLLEGE_BY_SLUG[s]).filter(Boolean);

  const feeTotal = (c) => Object.values(c.fees).reduce((a, b) => a + b, 0);
  const cseClose = (c) => realFinalClose2025(c, "cse", "OPEN");

  const ROWS = [
    ["Type", (c) => c.type],
    ["NIRF rank", (c) => `#${c.nirf}`],
    ["Location", (c) => c.location],
    ["Established", (c) => c.estd],
    ["Avg package", (c) => fmtINR(c.placements.avg)],
    ["Highest package", (c) => fmtINR(c.placements.highest)],
    ["Placement %", (c) => `${c.placements.placedPct}%`],
    ["Total fees / yr", (c) => fmtINR(feeTotal(c))],
    ["CSE closing 2025 (Gen)", (c) => fmtRank(cseClose(c))],
    ["Counselling", (c) => c.counsellingExam],
  ];

  const pkgChart = cols.map((c) => ({ name: c.short, value: c.placements.avg }));
  const feeChart = cols.map((c) => ({ name: c.short, value: feeTotal(c) }));

  return (
    <div className="page">
      <Seo
        title="Compare Colleges — IIT vs NIT vs IIIT Side by Side"
        description="Compare IITs, NITs and IIITs side by side — JoSAA cutoffs, placements, average package, fees and branches — to make the right counselling choice on CollegeParichay."
        path="/compare"
      />
      <section style={{ background: "linear-gradient(135deg,#ffffff,#ffffff)", color: "var(--ink)", padding: "40px 0" }}>
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--coral)" }}>Compare</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.4rem)", margin: "8px 0 4px" }}>Compare colleges side by side</h1>
          <p style={{ color: "var(--muted)" }}>Add up to {MAX_COMPARE} colleges to see cutoffs, fees and placements together.</p>
        </div>
      </section>

      <div className="container section">
        {cols.length < 2 ? (
          <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>
            <GitCompare size={44} color="var(--line)" />
            <p style={{ margin: "12px 0 16px" }}>Pick at least 2 colleges to compare. Use the <strong>Compare</strong> button on any college, or add them here.</p>
            <button className="btn btn-coral" onClick={() => setPicker(true)}><Plus size={16} /> Add colleges</button>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto", marginBottom: 26 }}>
              <table className="data-table" style={{ minWidth: 520 }}>
                <thead>
                  <tr>
                    <th style={{ minWidth: 130 }}></th>
                    {cols.map((c) => (
                      <th key={c.slug} style={{ minWidth: 150 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                            <Link to={`/colleges/${c.slug}`} style={{ fontWeight: 800, color: "var(--navy)", fontFamily: "Sora" }}>{c.short}</Link>
                            <button onClick={() => toggleCompare(c.slug)} aria-label="Remove" style={{ display: "grid", placeItems: "center", width: 20, height: 20, borderRadius: "50%", background: "rgba(13,27,62,.08)" }}><X size={12} /></button>
                          </span>
                          <span style={{ fontWeight: 400, fontSize: 11, color: "var(--muted)" }}>{c.name}</span>
                        </div>
                      </th>
                    ))}
                    {cols.length < MAX_COMPARE && (
                      <th style={{ minWidth: 110 }}><button className="btn btn-ghost" style={{ fontSize: 12.5 }} onClick={() => setPicker(true)}><Plus size={14} /> Add</button></th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(([label, fn]) => (
                    <tr key={label}>
                      <td style={{ fontWeight: 700, color: "var(--navy)" }}>{label}</td>
                      {cols.map((c) => <td key={c.slug}>{fn(c)}</td>)}
                      {cols.length < MAX_COMPARE && <td></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid-2" style={{ gap: 22 }}>
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Average package</h4>
                <Bars data={pkgChart} bars={[{ key: "value", label: "Avg package", color: "#2EC4B6" }]} height={260} fmt={fmtINR} />
              </div>
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Total fees / year</h4>
                <Bars data={feeChart} bars={[{ key: "value", label: "Fees/yr", color: "#F4A261" }]} height={260} fmt={fmtINR} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Picker modal */}
      {picker && (
        <div onClick={() => setPicker(false)} style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,.5)", zIndex: 80, display: "grid", placeItems: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: "min(560px,100%)", maxHeight: "80vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontFamily: "Sora", fontWeight: 700 }}>Add a college</h3>
              <button onClick={() => setPicker(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {COLLEGES.filter((c) => !compare.includes(c.slug)).map((c) => (
                <button key={c.slug} onClick={() => { toggleCompare(c.slug); if (compare.length + 1 >= MAX_COMPARE) setPicker(false); }}
                  className="row-btn" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 10, background: "var(--sky)", textAlign: "left" }}>
                  <span><strong style={{ color: "var(--navy)" }}>{c.short}</strong> <span style={{ fontSize: 12, color: "var(--muted)" }}>· {c.type} · NIRF #{c.nirf}</span></span>
                  <Plus size={16} color="var(--coral)" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
