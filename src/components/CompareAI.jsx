/* ============================================================
   CompareAI.jsx — shared building blocks for the AI-animated
   Compare Colleges / Compare Exams pages.
   • AiAnalyzing  — pulsing orb + stepping checklist interstitial
   • Sparkline    — tiny self-scaled trend line (own axis per series)
   • MiniBar      — animated proportional bar used inside table cells
   ============================================================ */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Sparkles, Check } from "lucide-react";
import { CL } from "./home/clTheme.js";

/* hex → rgba */
export const rgba = (hex, a) => {
  const c = hex.replace("#", "");
  const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

/* ── AiAnalyzing — animated "AI is crunching the numbers" interstitial ── */
export function AiAnalyzing({ steps, title = "Crunching the numbers…", eyebrow = "AI COMPARISON ENGINE", onDone, accent = CL.coral }) {
  const [i, setI] = useState(0);
  const per = 420;
  useEffect(() => {
    const iv = setInterval(() => setI((x) => (x < steps.length - 1 ? x + 1 : x)), per);
    const end = setTimeout(onDone, per * steps.length + 480);
    return () => { clearInterval(iv); clearTimeout(end); };
  }, [onDone, steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}
      style={{ background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "40px 30px 34px", maxWidth: 560, margin: "0 auto", textAlign: "center", overflow: "hidden", position: "relative" }}
    >
      {/* AI orb */}
      <div style={{ position: "relative", width: 108, height: 108, margin: "0 auto 24px" }}>
        {[0, 1].map((k) => (
          <motion.span key={k}
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: k * 0.9, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${accent}` }} />
        ))}
        <motion.div
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
          style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(${accent}, ${CL.amber}, ${CL.green}, ${accent})`, padding: 4 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: CL.card, display: "grid", placeItems: "center" }}>
            <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>
              <Cpu size={34} color={accent} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", color: CL.coralDk, background: CL.coralSoft, padding: "5px 13px", borderRadius: 50, marginBottom: 8 }}>
        <Sparkles size={12} /> {eyebrow}
      </div>
      <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.4rem", color: CL.ink, letterSpacing: "-0.5px", margin: "0 0 22px" }}>
        {title}
      </h3>

      {/* analysis checklist */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400, margin: "0 auto 22px", textAlign: "left" }}>
        {steps.map((s, idx) => {
          const doneStep = idx < i, activeStep = idx === i;
          return (
            <motion.div key={s}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: doneStep || activeStep ? 1 : 0.35, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 13.5, fontWeight: 600, color: doneStep ? CL.ink2 : activeStep ? CL.ink : CL.muted }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", background: doneStep ? CL.green : activeStep ? CL.coralSoft : CL.cream2, border: `1px solid ${doneStep ? CL.green : activeStep ? accent : CL.cream3}`, transition: "all .3s" }}>
                {doneStep
                  ? <Check size={13} color="#fff" strokeWidth={3} />
                  : activeStep
                    ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${accent}`, borderTopColor: "transparent" }} />
                    : <span style={{ width: 5, height: 5, borderRadius: "50%", background: CL.muted }} />}
              </span>
              {s}
            </motion.div>
          );
        })}
      </div>

      {/* sweep bar */}
      <div style={{ height: 6, borderRadius: 50, background: CL.cream2, overflow: "hidden", maxWidth: 400, margin: "0 auto" }}>
        <motion.div
          initial={{ width: "0%" }} animate={{ width: "100%" }}
          transition={{ duration: (per * steps.length + 300) / 1000, ease: "easeInOut" }}
          style={{ height: "100%", borderRadius: 50, background: `linear-gradient(90deg, ${accent}, ${CL.amber}, ${CL.green})` }} />
      </div>
    </motion.div>
  );
}

/* ── Sparkline — self-scaled mini trend (each series on its own axis) ── */
export function Sparkline({ data = [], color = CL.coral, width = 128, height = 40, strokeWidth = 2 }) {
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pad = strokeWidth + 1;
  const stepX = (width - pad * 2) / (data.length - 1 || 1);
  const pts = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (height - pad * 2) * (1 - (v - min) / span);
    return [x, y];
  });
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${d} L${pts[pts.length - 1][0].toFixed(1)},${height} L${pts[0][0].toFixed(1)},${height} Z`;
  const gid = `spark-${color.replace("#", "")}`;
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <motion.path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "easeOut" }} />
      <circle cx={last[0]} cy={last[1]} r={3} fill={color} stroke="#fff" strokeWidth={1.5} />
    </svg>
  );
}

/* ── MiniBar — animated proportional bar (0–1) used under a cell value ── */
export function MiniBar({ pct = 0, color = CL.coral, delay = 0 }) {
  return (
    <div style={{ height: 5, borderRadius: 50, background: CL.cream2, overflow: "hidden", marginTop: 6 }}>
      <motion.div
        initial={{ width: 0 }} animate={{ width: `${Math.max(4, Math.round(pct * 100))}%` }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
        style={{ height: "100%", borderRadius: 50, background: `linear-gradient(90deg, ${rgba(color, 0.65)}, ${color})` }} />
    </div>
  );
}
