import { Link } from "react-router-dom";
import {
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight,
  Phone, Star, Users, Clock,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════
   Counselling 2026 — sticky sell card shown beside the
   College Predictor on the JEE Main / JEE Advanced pages.
════════════════════════════════════════════════════════════ */

const VARIANTS = {
  main: {
    accent: "#FF693D",
    accentDark: "#c75b0a",
    grad: "linear-gradient(135deg,#1a1a2e 0%,#2a1c12 55%,#3d2410 100%)",
    label: "JoSAA + CSAB · NIT / IIIT / GFTI",
    title: "JEE Main Counselling 2026",
  },
  advanced: {
    accent: "#7C3AED",
    accentDark: "#5b21b6",
    grad: "linear-gradient(135deg,#1a1a2e 0%,#241640 55%,#2e1065 100%)",
    label: "JoSAA · All 23 IITs",
    title: "JEE Advanced Counselling 2026",
  },
};

const FEATURES = [
  "1-on-1 expert guidance through every JoSAA round",
  "Personalised choice-filling order (college + branch)",
  "Real cutoff & seat-matrix analysis for your rank",
  "Document & reporting checklist — zero mistakes",
  "Dedicated WhatsApp support till seat allotment",
];

export default function CounsellingCard({ exam = "main", whatsapp = "917877596464" }) {
  const v = VARIANTS[exam] || VARIANTS.main;

  return (
    <aside className="counselling-card">
      <style>{`
        .counselling-card {
          width: 340px; flex-shrink: 0;
          position: sticky; top: 90px;
          align-self: flex-start;
        }
        .cc-shell {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 18px 50px rgba(0,0,0,.10);
        }
        .cc-head {
          padding: 22px 22px 20px;
          color: #fff; position: relative; overflow: hidden;
        }
        .cc-head::after {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(circle at 85% 10%, rgba(255,255,255,.16) 0%, transparent 45%);
          pointer-events: none;
        }
        .cc-pop {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10.5px; font-weight: 800; letter-spacing: .6px;
          text-transform: uppercase;
          background: rgba(255,255,255,.16);
          border: 1px solid rgba(255,255,255,.28);
          color: #fff; padding: 5px 11px; border-radius: 50px;
          backdrop-filter: blur(4px);
        }
        .cc-feat-row { display: flex; align-items: flex-start; gap: 9px; }
        .cc-btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 14px 16px; border: none; cursor: pointer;
          border-radius: 12px; color: #fff; font-family: Sora, sans-serif;
          font-weight: 800; font-size: 15px; text-decoration: none;
          transition: transform .18s, box-shadow .18s, filter .18s;
        }
        .cc-btn-primary:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .cc-btn-ghost {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px 16px; cursor: pointer;
          border-radius: 12px; background: #fff;
          font-family: Sora, sans-serif; font-weight: 700; font-size: 13.5px;
          text-decoration: none; transition: all .18s;
        }
        .cc-btn-ghost:hover { transform: translateY(-2px); }
        @media (max-width: 980px) {
          .counselling-card { width: 100%; position: static; margin-top: 22px; }
        }
      `}</style>

      <div className="cc-shell">
        {/* ── Header ── */}
        <div className="cc-head" style={{ background: v.grad }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span className="cc-pop"><Sparkles size={12} /> Most Popular</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,.82)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,.3)" }} />
              2026 Live
            </span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginBottom: 6 }}>
            {v.label}
          </div>
          <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 20, lineHeight: 1.25, margin: 0 }}>
            {v.title}
          </h3>

          {/* ── Price ── */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 16 }}>
            <span style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 38, lineHeight: 1, color: "#fff" }}>₹299</span>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,.55)", textDecoration: "line-through" }}>₹1,999</span>
            <span style={{
              fontSize: 11, fontWeight: 800, color: "#1a1a2e",
              background: v.accent, padding: "4px 9px", borderRadius: 50,
            }}>85% OFF</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "rgba(255,255,255,.7)", marginTop: 8 }}>
            <Clock size={12} /> Limited-period launch price · all rounds covered
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "20px 22px 22px" }}>
          {/* rating strip */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--sky)", border: "1px solid var(--line)",
            borderRadius: 12, padding: "10px 14px", marginBottom: 18,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 1 }}>
                {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} fill={v.accent} color={v.accent} />)}
              </div>
              <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: "var(--navy)" }}>4.9</span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
              <Users size={13} /> 2,400+ students guided
            </span>
          </div>

          {/* features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 20 }}>
            {FEATURES.map((f) => (
              <div key={f} className="cc-feat-row">
                <CheckCircle2 size={17} color={v.accent} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: "var(--navy)", lineHeight: 1.45 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <Link
            to="/planner"
            className="cc-btn-primary"
            style={{ background: `linear-gradient(135deg, ${v.accent}, ${v.accentDark})`, boxShadow: `0 10px 26px ${v.accent}55` }}
          >
            Enroll Now — ₹299 <ArrowRight size={17} />
          </Link>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi! I want to know more about Counselling 2026.")}`}
            target="_blank" rel="noreferrer"
            className="cc-btn-ghost"
            style={{ border: `1.5px solid ${v.accent}`, color: v.accentDark, marginTop: 10 }}
          >
            <Phone size={15} /> Talk to an Expert
          </a>

          {/* trust */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontSize: 11.5, color: "var(--muted)", marginTop: 14,
          }}>
            <ShieldCheck size={14} color="#15A06E" />
            100% money-back if not satisfied after round 1
          </div>
        </div>
      </div>
    </aside>
  );
}
