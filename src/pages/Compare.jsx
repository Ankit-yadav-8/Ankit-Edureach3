import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Trophy, GitCompare, Sparkles, Crown, Target, TrendingUp,
  Wallet, ShieldCheck,
} from "lucide-react";
import { useShortlist } from "../context/Shortlist.jsx";
import { COLLEGE_BY_SLUG, COLLEGES } from "../data/colleges.js";
import { realFinalClose2025 } from "../utils/cutoffEngine.js";
import { Bars } from "../components/Charts.jsx";
import { fmtINR, fmtRank } from "../utils/format.js";
import Seo from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";
import { CL, clEyebrow } from "../components/home/clTheme.js";
import { AiAnalyzing, MiniBar, rgba } from "../components/CompareAI.jsx";

const feeTotal = (c) => Object.values(c.fees).reduce((a, b) => a + b, 0);
const cseClose = (c) => realFinalClose2025(c, "cse", "OPEN");

/* Scored metrics feed the AI verdict + winner highlights.
   `better:"low"` means a smaller number wins (rank, fees, cutoff). */
const METRICS = [
  { key: "avg", label: "Average package", icon: TrendingUp, get: (c) => c.placements.avg, fmt: fmtINR, better: "high", weight: 0.28, head: "Best placements" },
  { key: "nirf", label: "NIRF rank", icon: Trophy, get: (c) => c.nirf, fmt: (v) => `#${v}`, better: "low", weight: 0.22, head: "Best ranked" },
  { key: "cutoff", label: "CSE closing rank (Gen)", icon: Target, get: cseClose, fmt: fmtRank, better: "low", weight: 0.16, head: "Most selective" },
  { key: "placed", label: "Placement rate", icon: ShieldCheck, get: (c) => c.placements.placedPct, fmt: (v) => `${v}%`, better: "high", weight: 0.12 },
  { key: "highest", label: "Highest package", icon: Sparkles, get: (c) => c.placements.highest, fmt: fmtINR, better: "high", weight: 0.12 },
  { key: "fee", label: "Total fees / yr", icon: Wallet, get: feeTotal, fmt: fmtINR, better: "low", weight: 0.10, head: "Best value" },
];

const INFO_ROWS = [
  ["Type", (c) => c.type],
  ["Location", (c) => c.location],
  ["Established", (c) => c.estd],
  ["Counselling", (c) => c.counsellingExam],
];

const STEPS = [
  "Pulling placements, fees & JoSAA cutoffs",
  "Normalising every metric across your picks",
  "Weighting outcomes, selectivity & value",
  "Scoring each college out of 100",
  "Writing your recommendation",
];

/* min-max normalise to 0..1 with direction; ties → 1 for all */
function subScores(cols, m) {
  const vals = cols.map((c) => Number(m.get(c)));
  if (vals.some((v) => !Number.isFinite(v))) return vals.map(() => 1); // neutral, no winner
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = max - min;
  return vals.map((v) => {
    if (span === 0) return 1;
    return m.better === "high" ? (v - min) / span : (max - v) / span;
  });
}

export default function Compare() {
  const { compare, toggleCompare, clearCompare, MAX_COMPARE } = useShortlist();
  const [picker, setPicker] = useState(false);
  const cols = compare.map((s) => COLLEGE_BY_SLUG[s]).filter(Boolean);
  const colsKey = cols.map((c) => c.slug).join("|");

  const [phase, setPhase] = useState("result"); // analyzing | result
  const seenKey = useRef("");
  useEffect(() => {
    if (cols.length >= 2 && colsKey !== seenKey.current) {
      seenKey.current = colsKey;
      setPhase("analyzing");
    }
  }, [colsKey, cols.length]);

  /* AI scoring */
  const analysis = useMemo(() => {
    if (cols.length < 2) return null;
    const perMetric = METRICS.map((m) => ({ m, subs: subScores(cols, m) }));
    const composite = cols.map((_, ci) =>
      perMetric.reduce((s, { m, subs }) => s + subs[ci] * m.weight, 0)
    );
    const order = cols.map((_, i) => i).sort((a, b) => composite[b] - composite[a]);
    const winnerIdx = order[0];
    const gap = composite[order[0]] - composite[order[1]];
    const confidence = gap > 0.22 ? "High confidence" : gap > 0.08 ? "Clear edge" : "Very close call";
    // metrics the winner tops
    const leads = perMetric
      .filter(({ subs }) => subs[winnerIdx] === Math.max(...subs) && Math.max(...subs) > 0)
      .map(({ m }) => m);
    // best-in-class per headline metric
    const chips = perMetric
      .filter(({ m }) => m.head)
      .map(({ m, subs }) => {
        const bi = subs.indexOf(Math.max(...subs));
        return { head: m.head, icon: m.icon, col: cols[bi], val: m.fmt(m.get(cols[bi])) };
      });
    return {
      perMetric,
      score: composite.map((v) => Math.round(v * 100)),
      winnerIdx, confidence, leads, chips,
      winner: cols[winnerIdx],
    };
  }, [colsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const pkgChart = cols.map((c) => ({ name: c.short, value: c.placements.avg }));
  const feeChart = cols.map((c) => ({ name: c.short, value: feeTotal(c) }));

  return (
    <div className="page">
      <div className="container"><BackButton style={{ margin: "0 0 2px" }} /></div>
      <Seo
        title="Compare Colleges — IIT vs NIT vs IIIT with an AI verdict"
        description="Compare IITs, NITs and IIITs side by side with an AI verdict — JoSAA cutoffs, placements, average package, fees and a scored recommendation on CollegeParichay."
        path="/compare"
      />

      {/* Hero */}
      <section style={{ padding: "34px 0 8px" }}>
        <div className="container">
          <span style={clEyebrow}><GitCompare size={13} /> AI College Comparison</span>
          <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.5rem)", letterSpacing: "-0.5px", color: CL.ink, margin: "12px 0 6px" }}>
            Compare colleges, get an <span style={{ color: CL.coral }}>AI verdict</span>
          </h1>
          <p style={{ color: CL.body, maxWidth: 620 }}>
            Add up to {MAX_COMPARE} colleges. Our engine scores each on placements, ranking, selectivity and value — then tells you which one to protect in your JoSAA list.
          </p>
        </div>
      </section>

      <div className="container section" style={{ paddingTop: 20 }}>
        {cols.length < 2 ? (
          <EmptyState onAdd={() => setPicker(true)} />
        ) : (
          <AnimatePresence mode="wait">
            {phase === "analyzing" ? (
              <AiAnalyzing key="ai" steps={STEPS} title="Comparing your colleges…" onDone={() => setPhase("result")} />
            ) : (
              <motion.div key="res" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                {/* ── AI verdict ── */}
                {analysis && (
                  <VerdictCard analysis={analysis} cols={cols} />
                )}

                {/* ── Best-in-class chips ── */}
                {analysis && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, margin: "18px 0 26px" }}>
                    {analysis.chips.map((ch, i) => (
                      <motion.div key={ch.head} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                        style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 16, padding: "13px 15px", boxShadow: CL.shadow }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase", color: CL.muted }}>
                          <ch.icon size={13} color={CL.coral} /> {ch.head}
                        </span>
                        <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 16, color: CL.ink, marginTop: 6 }}>{ch.col.short}</div>
                        <div style={{ fontSize: 12.5, color: CL.body }}>{ch.val}</div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* ── Comparison table ── */}
                <div style={{ overflowX: "auto", borderRadius: 18, border: `1px solid ${CL.line}`, boxShadow: CL.shadow, background: CL.card }}>
                  <table className="cmp-table" style={{ width: "100%", minWidth: 520, borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ minWidth: 150, textAlign: "left", padding: "16px 14px", verticalAlign: "middle" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: ".8px", textTransform: "uppercase", color: CL.coralDk }}>
                              <GitCompare size={13} /> Head-to-head
                            </span>
                            <span style={{ fontSize: 12, color: CL.body, lineHeight: 1.5 }}>
                              Scored <b style={{ color: CL.ink }}>/100</b> by AI on placements, ranking, selectivity &amp; value.
                            </span>
                          </div>
                        </th>
                        {cols.map((c, ci) => {
                          const win = analysis && analysis.winnerIdx === ci;
                          const accent = c.accent || CL.coral;
                          return (
                            <th key={c.slug} style={{ minWidth: 200, padding: 12, verticalAlign: "top", background: win ? rgba(CL.coral, 0.05) : "transparent", borderBottom: `2px solid ${win ? CL.coral : CL.line}` }}>
                              {/* Branded, content-rich college card */}
                              <div style={{ position: "relative", borderRadius: 16, padding: "16px 14px 14px", background: `linear-gradient(155deg, ${rgba(accent, 0.16)}, ${rgba(accent, 0.03)})`, border: `1px solid ${rgba(accent, 0.22)}` }}>
                                <button onClick={() => toggleCompare(c.slug)} aria-label="Remove"
                                  style={{ position: "absolute", top: 8, right: 8, display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,.9)", border: `1px solid ${CL.line}`, cursor: "pointer" }}>
                                  <X size={13} color={CL.ink} />
                                </button>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                                  <span style={{ width: 46, height: 46, borderRadius: 13, background: accent, color: "#fff", display: "grid", placeItems: "center", fontFamily: CL.display, fontWeight: 800, fontSize: 14, letterSpacing: "-.5px", boxShadow: `0 8px 18px ${rgba(accent, 0.35)}`, flexShrink: 0 }}>{c.short}</span>
                                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".5px", color: accent, background: rgba(accent, 0.13), padding: "3px 9px", borderRadius: 50 }}>{c.type}</span>
                                </div>
                                <Link to={`/colleges/${c.slug}`} style={{ display: "block", fontFamily: CL.display, fontWeight: 800, fontSize: 15.5, color: CL.ink, lineHeight: 1.2 }}>{c.name}</Link>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 7 }}>
                                  <span style={{ fontSize: 10.5, fontWeight: 700, color: CL.ink2, background: "rgba(255,255,255,.7)", border: `1px solid ${CL.line}`, padding: "2px 8px", borderRadius: 50 }}>NIRF #{c.nirf}</span>
                                  <span style={{ fontSize: 10.5, fontWeight: 700, color: CL.ink2, background: "rgba(255,255,255,.7)", border: `1px solid ${CL.line}`, padding: "2px 8px", borderRadius: 50 }}>Est. {c.estd}</span>
                                </div>
                                {analysis && (
                                  <div style={{ marginTop: 12, paddingTop: 11, borderTop: `1px solid ${rgba(accent, 0.18)}`, display: "flex", alignItems: "center", gap: 6 }}>
                                    {win && <Crown size={16} color={CL.coral} />}
                                    <b style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 23, color: win ? CL.coral : CL.ink, lineHeight: 1 }}>{analysis.score[ci]}</b>
                                    <span style={{ fontSize: 10.5, color: CL.muted }}>/100 match</span>
                                  </div>
                                )}
                              </div>
                            </th>
                          );
                        })}
                        {cols.length < MAX_COMPARE && (
                          <th style={{ minWidth: 110, padding: "16px 14px", verticalAlign: "top" }}>
                            <button className="btn btn-ghost" style={{ fontSize: 12.5 }} onClick={() => setPicker(true)}><Plus size={14} /> Add</button>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis && analysis.perMetric.map(({ m, subs }, ri) => {
                        const bestSub = Math.max(...subs);
                        return (
                          <motion.tr key={m.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + ri * 0.05 }}
                            style={{ borderBottom: `1px solid ${CL.line}` }}>
                            <td style={{ padding: "12px 14px", fontWeight: 700, color: CL.ink2, fontSize: 13 }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><m.icon size={14} color={CL.muted} /> {m.label}</span>
                            </td>
                            {cols.map((c, ci) => {
                              const win = subs[ci] === bestSub && bestSub > 0;
                              return (
                                <td key={c.slug} style={{ padding: "12px 14px", background: analysis.winnerIdx === ci ? rgba(CL.coral, 0.035) : "transparent" }}>
                                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: win ? 800 : 600, color: win ? CL.coralDk : CL.ink2, fontSize: 14 }}>
                                    {m.fmt(m.get(c))}
                                    {win && <Trophy size={13} color={CL.coral} />}
                                  </span>
                                  <MiniBar pct={subs[ci]} color={win ? CL.coral : CL.muted} delay={0.1 + ri * 0.05} />
                                </td>
                              );
                            })}
                            {cols.length < MAX_COMPARE && <td />}
                          </motion.tr>
                        );
                      })}
                      {INFO_ROWS.map(([label, fn]) => (
                        <tr key={label} style={{ borderBottom: `1px solid ${CL.line}` }}>
                          <td style={{ padding: "11px 14px", fontWeight: 700, color: CL.ink2, fontSize: 13 }}>{label}</td>
                          {cols.map((c) => <td key={c.slug} style={{ padding: "11px 14px", fontSize: 13.5, color: CL.body }}>{fn(c)}</td>)}
                          {cols.length < MAX_COMPARE && <td />}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── Charts ── */}
                <div className="grid-2" style={{ gap: 22, marginTop: 24 }}>
                  <div className="card">
                    <h4 style={{ fontFamily: CL.display, fontWeight: 800, marginBottom: 12, color: CL.ink }}>Average package</h4>
                    <Bars data={pkgChart} bars={[{ key: "value", label: "Avg package", color: CL.green }]} height={260} fmt={fmtINR} />
                  </div>
                  <div className="card">
                    <h4 style={{ fontFamily: CL.display, fontWeight: 800, marginBottom: 12, color: CL.ink }}>Total fees / year</h4>
                    <Bars data={feeChart} bars={[{ key: "value", label: "Fees/yr", color: CL.amber }]} height={260} fmt={fmtINR} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
                  {cols.length < MAX_COMPARE && <button className="btn btn-coral" onClick={() => setPicker(true)}><Plus size={16} /> Add college</button>}
                  <button className="btn btn-ghost" onClick={clearCompare}>Clear all</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {picker && (
        <Picker
          items={COLLEGES.filter((c) => !compare.includes(c.slug))}
          onClose={() => setPicker(false)}
          onPick={(c) => { toggleCompare(c.slug); if (compare.length + 1 >= MAX_COMPARE) setPicker(false); }}
          render={(c) => (<><strong style={{ color: CL.ink }}>{c.short}</strong> <span style={{ fontSize: 12, color: CL.muted }}>· {c.type} · NIRF #{c.nirf}</span></>)}
          title="Add a college"
        />
      )}
    </div>
  );
}

/* ── AI verdict card ── */
function VerdictCard({ analysis, cols }) {
  const w = analysis.winner;
  const leadTxt = analysis.leads.slice(0, 3).map((m) => m.label.toLowerCase()).join(", ");
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
      style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${CL.ink} 0%, #2c2740 60%, ${rgba(CL.coral, 0.55)} 140%)`, borderRadius: 22, padding: "26px 26px 24px", color: "#fff", boxShadow: CL.shadowLg }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        style={{ position: "absolute", top: -70, right: -70, width: 200, height: 200, borderRadius: "50%", background: `conic-gradient(${rgba(CL.coral, 0.5)}, transparent 60%)`, filter: "blur(6px)", pointerEvents: "none" }} />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", background: "rgba(255,255,255,.14)", padding: "5px 13px", borderRadius: 50 }}>
        <Sparkles size={13} /> AI VERDICT · {analysis.confidence}
      </span>
      <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.4rem,3.4vw,2rem)", letterSpacing: "-0.5px", margin: "14px 0 6px", position: "relative" }}>
        <Crown size={22} style={{ verticalAlign: "-3px", marginRight: 8 }} color={CL.amber} />
        {w.short} takes it — {analysis.score[analysis.winnerIdx]}/100
      </h2>
      <p style={{ color: "rgba(255,255,255,.82)", maxWidth: 640, fontSize: 14.5, lineHeight: 1.55, position: "relative" }}>
        Across {cols.length} colleges, <b style={{ color: "#fff" }}>{w.name}</b> comes out ahead{leadTxt ? <> — leading on {leadTxt}</> : ""}. It’s the pick to protect at the top of your JoSAA choice list, with the others as strong backups.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, position: "relative" }}>
        {cols.map((c, i) => (
          <span key={c.slug} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, background: i === analysis.winnerIdx ? CL.coral : "rgba(255,255,255,.12)", padding: "6px 12px", borderRadius: 50 }}>
            {i === analysis.winnerIdx && <Crown size={12} />} {c.short} · {analysis.score[i]}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Empty state ── */
function EmptyState({ onAdd }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", background: CL.card, border: `1px dashed ${CL.cream3}`, borderRadius: 20 }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: CL.coralSoft, display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
        <GitCompare size={30} color={CL.coral} />
      </div>
      <h3 style={{ fontFamily: CL.display, fontWeight: 800, color: CL.ink, marginBottom: 6 }}>Pick at least 2 colleges</h3>
      <p style={{ color: CL.body, maxWidth: 420, margin: "0 auto 18px" }}>
        Use the <strong>Compare</strong> button on any college, or add them here to get a scored AI verdict.
      </p>
      <button className="btn btn-coral" onClick={onAdd}><Plus size={16} /> Add colleges</button>
    </div>
  );
}

/* ── Shared picker modal ── */
function Picker({ items, onClose, onPick, render, title }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(33,29,46,.5)", zIndex: 80, display: "grid", placeItems: "center", padding: 16 }}>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} onClick={(e) => e.stopPropagation()}
        className="card" style={{ width: "min(560px,100%)", maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontFamily: CL.display, fontWeight: 800, color: CL.ink }}>{title}</h3>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((c) => (
            <button key={c.slug} onClick={() => onPick(c)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 13px", borderRadius: 12, background: CL.cream2, border: `1px solid ${CL.line}`, textAlign: "left" }}>
              <span>{render(c)}</span>
              <Plus size={16} color={CL.coral} />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
