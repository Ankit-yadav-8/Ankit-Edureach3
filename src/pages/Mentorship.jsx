/* Mentorship — the "CollegeParichay Mentorship Journal".
   An editorial, magazine-style landing page for 1-on-1 IITian mentorship:
   cream paper, Playfair display serif with coral-italic emphasis, dark navy
   feature sections, §0X·LABEL micro-headers. Config-driven per variant
   (jee-2027 / jee-2028 / neet) from data/mentorship.js. Image slots are filled
   with the existing /images mentorship assets. */
import { useState, useRef, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Plus, Minus, HelpCircle, Check, Star, Send, Radio,
  Video, Phone, Paperclip, Camera, Mic, Smile, Sparkles,
  BookOpen, CircleDot, Zap, Target, Clock,
  Brain, PlayCircle, Activity, LineChart, ShieldCheck,
} from "lucide-react";
import { MENTORSHIP, MENTOR_PLANS, SEATS_LIMIT, SEATS_LEFT, MENTOR_LINKS } from "../data/mentorship.js";
import { useEnrol } from "../components/EnrolModal.jsx";
import Seo from "../components/Seo.jsx";

const WA_NUMBER = "917877596464";

/* ── warm paper / coral / navy theme ── */
const T = {
  paper: "var(--page-bg)", paper2: "#F1EBE0", card: "#FFFFFF",
  ink: "#1B1B24", body: "#54525C", muted: "#8C877E",
  line: "#E4DED2", lineDk: "#D6CFC0",
  coral: "#FF693D", coralDk: "#D8512A", coralSoft: "#FFE7DE",
  navy: "#12141C", navy2: "#191C26", navyLine: "rgba(255,255,255,.10)",
  onNavy: "#EDEBE6", onNavyMute: "#8E93A3",
};

/* ── small building blocks ── */
function Reveal({ children, delay = 0, className, style }) {
  return (
    <motion.div className={className} style={style}
      initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.6, delay, ease: [0.16, 0.84, 0.32, 1] }}>
      {children}
    </motion.div>
  );
}
function Label({ children, dark }) {
  return <span className={dark ? "mj-label mj-label-dark" : "mj-label"}>{children}</span>;
}

/* ═══════════════ HERO — glassmorphic performance engine ═══════════════ */
function Hero({ variant, cfg, plan, year, exam, openEnrol, scrollTo }) {
  const p = MENTOR_PLANS[plan] || { amount: 2499, exam: "JEE" };
  const isNeet = p.exam === "NEET";
  const ifaceLabel = isNeet ? "NEET" : p.exam === "JEE" ? "JEE Main" : "exam";
  const dream = isNeet ? "medical-college" : "IIT / NIT";
  const bullets = [`Real ${ifaceLabel} interface`, "One-time payment", "7-day money-back"];
  return (
    <section className="mj-hero">
      <div className="mj-hero-bg" aria-hidden="true">
        <span className="mj-orb mj-orb-a" />
        <span className="mj-orb mj-orb-b" />
      </div>

      <div className="mj-wrap mj-hero-inner">
        <div className="mj-hero-center">
          <VariantTabs variant={variant} />
          
          <Reveal className="mj-hero-pill" style={{ marginTop: "32px" }}>
            <span className="mj-dot" /> Built by IITians
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mj-hero-h1">
              The mentorship built<br />for{" "}
              <span className="mj-hero-accent">
                {exam}.
                <svg className="mj-hero-uline" viewBox="0 0 320 14" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M5 9 C 78 3, 244 3, 315 8" />
                </svg>
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mj-hero-sub">
              Real-exam mocks, deep AI analysis, and 1-on-1 mentorship from 99%ilers —
              everything to turn your {dream} dream into a real rank.
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mj-hero-cta">
            <button className="mj-btn-glow" onClick={() => openEnrol(plan)}>
              Get Started <ArrowRight size={18} />
            </button>
            <button className="mj-btn-glass" onClick={() => scrollTo("enrol")}>
              View Plans
            </button>
          </Reveal>

          <Reveal delay={0.32} className="mj-hero-bullets">
            {bullets.map((b, i) => (
              <span key={i} className="mj-hero-bullet"><i /> {b}</span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ STAT BAND ═══════════════ */
function StatBand({ cfg }) {
  return (
    <section className="mj-statband">
      <div className="mj-wrap mj-stat-row">
        {(cfg.stats || []).map((s, i) => (
          <div key={i} className="mj-stat">
            <div className="mj-stat-v">{s.val}</div>
            <div className="mj-stat-l">{s.lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const ASPIRANT_POINTS = [
  { title: "You have backlogs and no idea where to start", desc: "The pile of untouched chapters is growing every week. We'll give you a structured recovery plan to catch up without burning out." },
  { title: "You go to coaching but your retention is zero", desc: "You understand concepts in class, but blank out during tests. Our active recall strategies ensure knowledge actually sticks." },
  { title: "You're consistent for 2 days then disappear for 10", desc: "Motivation comes in bursts, but discipline is missing. We build an accountability system that keeps you on track daily." },
  { title: "You want IIT but fear you're not smart enough", desc: "Self-doubt creeps in when you see toppers solving questions faster. We show you how consistent smart work beats raw talent." },
  { title: "You study hard but your test scores never move", desc: "You're putting in 10-hour days but still scoring the same. We analyze your test attempts to fix the hidden gaps in your strategy." }
];

const QUALIFIER_MENTORS = [
  {
    name: "Ankit Yadav",
    role: "Founder, IIT Roorkee",
    img: "/assets/team/ankit2.webp",
    thought: "Mentorship isn't about giving you more material; it's about giving you the exact right direction so your hard work actually translates into rank. We've built this system from our own experiences of cracking IIT, focusing purely on high-yield output rather than just mindless hard work."
  },
  {
    name: "Ankit Kumar",
    role: "Co-Founder, IIT Roorkee (AIR 3846 CRL, 938 OBC)",
    img: "/assets/team/ankit.webp",
    thought: "Every aspirant hits a wall where effort stops working. Our goal is to break that wall by showing you the strategic blindspots you can't see yourself. Having navigated this journey to secure AIR 3846, I know exactly where students lose their confidence and how to rebuild it."
  }
];

/* ═══════════════ QUALIFIER — "is this you?" ═══════════════ */
function Qualifier({ cfg }) {
  const hurdles = cfg?.qualifierHurdles || ASPIRANT_POINTS;
  const mentors = cfg?.qualifierMentors || QUALIFIER_MENTORS;
  return (
    <section className="mj-section">
      <style>{`
        .mj-qualifier-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 24px;
          border: 1px solid var(--line);
          background: var(--card);
          box-shadow: 0 20px 60px -30px rgba(0,0,0,.15);
          overflow: hidden;
          margin-top: 44px;
        }
        .mj-qual-left {
          padding: 40px;
          background: var(--card);
        }
        .mj-qual-right {
          padding: 40px;
          background: linear-gradient(135deg, #FF7A3C, #F1531F);
          color: #fff;
          position: relative;
        }
        .mj-qual-right::before {
          content: ""; position: absolute; inset: 0;
          background: repeating-linear-gradient(45deg, transparent 0 10px, rgba(255,255,255,.05) 10px 12px);
          pointer-events: none;
        }
        .mj-qual-pt {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px; border-radius: 14px;
          border: 1px solid var(--line); background: #F7F7F8;
          transition: transform .2s, box-shadow .2s;
        }
        .mj-qual-pt:hover {
          transform: translateY(-2px); box-shadow: 0 10px 20px -10px rgba(0,0,0,.1);
          border-color: rgba(249,115,22,0.3);
        }
        .mj-qual-pt-ic {
          display: grid; place-items: center; width: 28px; height: 28px;
          border-radius: 50%; background: #FCE7E0; color: #E0421F; flex-shrink: 0;
        }
        @media (max-width: 860px) {
          .mj-qualifier-split { grid-template-columns: 1fr; }
          .mj-qual-left, .mj-qual-right { padding: 30px 24px; }
        }
      `}</style>
      <div className="mj-wrap">
        <Reveal>
          <p className="mj-lead" style={{ textAlign: "center", margin: "0 auto 44px", fontStyle: "normal", maxWidth: "680px", fontWeight: 700, fontFamily: "'Sora', sans-serif", fontSize: "1.75rem", lineHeight: 1.4, color: "var(--ink)", letterSpacing: "-0.02em" }}>
            Built for the aspirant who wants a <span style={{ color: "#FF693D", fontWeight: 800 }}>real system</span>, not unopened books.
          </p>
        </Reveal>
        
        <div className="mj-qualifier-split">
          <div className="mj-qual-left">
            <h3 style={{ fontSize: "1.4rem", fontFamily: "Playfair Display, serif", color: "var(--ink)", marginBottom: 24, fontStyle: "italic" }}>
              Are you facing these hurdles?
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="mj-qual-l-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {hurdles.map((pt, i) => (
                  <motion.div key={i} className="mj-qual-pt"
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 * i }}>
                    <div className="mj-qual-icon"><Check size={16} strokeWidth={3} /></div>
                    <div className="mj-qual-tx">
                      <strong>{pt.title}</strong>
                      <p style={{ marginTop: 6, color: "var(--body)", fontSize: "0.85rem", lineHeight: 1.5 }}>{pt.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mj-qual-right">
            <div style={{ position: "relative", zIndex: 2 }}>
              <h3 style={{ fontSize: "1.1rem", fontFamily: "Space Grotesk, sans-serif", color: "#fff", marginBottom: 24, letterSpacing: "1px", textTransform: "uppercase" }}>
                Guidance from the Founders
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {mentors.map((m, i) => (
                  <motion.div key={i} className="mj-qual-mentor"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <img src={m.img} alt={m.name} style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.2)" }} />
                      <div>
                        <strong style={{ display: "block", color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "1.15rem", fontStyle: "normal" }}>{m.name}</strong>
                        <span style={{ display: "block", color: "rgba(255,255,255,0.7)", fontFamily: "Space Grotesk", fontSize: "0.72rem", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2 }}>
                          {m.role}
                        </span>
                      </div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 20px", color: "rgba(255,255,255,0.95)", fontSize: "0.88rem", lineHeight: 1.6, fontFamily: "DM Sans, sans-serif", fontStyle: "normal", position: "relative" }}>
                      {m.thought}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ § 02 · METHOD (vertical roadmap timeline) ═══════════════ */
const STEP_ICONS = [Zap, Brain, Activity, Target, BookOpen, Clock];
const STEP_COLORS = ["#FF693D", "#6366f1", "#eab308", "#22c55e", "#0ea5a4", "#ec4899"];
function Method({ cfg }) {
  const steps = cfg.howWeGuide || [];
  return (
    <section id="method" className="mj-section mj-method">
      <div className="mj-wrap">
        <div className="mj-dark-head">
          <div>            <h2 className="mj-display mj-display-lg">A calm, connected system —<br /><em>Day 1 to Rank Day.</em></h2>
          </div>
          <span className="mj-scrollhint">6 MOVING PARTS · ONE RHYTHM</span>
        </div>

        <div className="mj-vsteps">
          <motion.span className="mj-vsteps-rail" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: Math.max(steps.length * 0.15, 0.6), ease: "easeOut" }} aria-hidden="true" />
          {steps.map((s, i) => {
            const at = i * 0.12; /* faster staggered delay */
            const Ic = STEP_ICONS[i % STEP_ICONS.length];
            const color = STEP_COLORS[i % STEP_COLORS.length];
            return (
              <motion.div key={i} className="mj-vstep" style={{ "--step-color": color }}
                initial={{ opacity: 0, x: 20, y: 10 }} whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: at, ease: "easeOut" }}>
                <motion.div className="mj-vstep-mark"
                  initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: at, type: "spring", stiffness: 400, damping: 25 }}>
                  <span className="mj-vstep-n">{String(i + 1).padStart(2, "0")}</span>
                </motion.div>
                <div className="mj-vstep-card">
                  <div className="mj-vstep-cardtop">
                    <span className="mj-vstep-ic"><Ic size={16} strokeWidth={2.4} /></span>
                    <span className="mj-vstep-tag">{s.tag || `STEP ${String(i + 1).padStart(2, "0")}`}</span>
                    <span className="mj-vstep-foot">{i + 1 < steps.length ? `→ ${String(i + 2).padStart(2, "0")}` : "RANK ACHIEVED ★"}</span>
                  </div>
                  <h3 className="mj-vstep-t">{s.title}</h3>
                  <p className="mj-vstep-d">{s.desc}</p>
                  {s.tasks?.length > 0 && (
                    <div className="mj-vstep-tasks">
                      <span className="mj-vstep-tasksl"><Target size={12} strokeWidth={2.6} /> KEY TASKS</span>
                      <ul>
                        {s.tasks.map((t, k) => (<li key={k}><Check size={12} strokeWidth={3} /> {t}</li>))}
                      </ul>
                    </div>
                  )}
                  {s.chips?.length > 0 && (
                    <div className="mj-vstep-chips">
                      {s.chips.map((c, k) => (<span key={k}>{c}</span>))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ § 04 · TEST ANALYSIS (coded, per-variant static preview) ═══════════════ */
const TA_STEPS = ["You enter test data", "AI analyses your paper", "Trends visualised", "Strategies + rank predicted"];
function AnalysisChart({ series, xLabels, yTicks, yMin, yMax, suffix = "", yLabel }) {
  const W = 348, H = 202, padL = 42, padR = 12, padT = 14, padB = 40;
  const pw = W - padL - padR, ph = H - padT - padB;
  const n = xLabels.length;
  const X = (i) => padL + (n <= 1 ? pw / 2 : (i / (n - 1)) * pw);
  const Y = (v) => padT + (1 - (v - yMin) / ((yMax - yMin) || 1)) * ph;
  const pts = (d) => d.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mj-ta-chart" role="img" aria-label={yLabel}>
      {yTicks.map((t, i) => (
        <g key={`y${i}`}>
          <line x1={padL} y1={Y(t)} x2={W - padR} y2={Y(t)} stroke={T.line} strokeWidth="1" strokeLinecap="round" strokeDasharray={i === 0 ? undefined : "1 6"} opacity={i === 0 ? 1 : 0.9} />
          <text x={padL - 9} y={Y(t) + 3} textAnchor="end" className="mj-ta-axtxt">{t}{suffix}</text>
        </g>
      ))}
      {xLabels.map((l, i) => (
        <g key={`x${i}`}>
          <line x1={X(i)} y1={padT + ph} x2={X(i)} y2={padT + ph + 4} stroke={T.lineDk} strokeWidth="1" opacity=".7" />
          <text x={X(i)} y={padT + ph + 16} textAnchor="middle" className="mj-ta-axtxt">{l}</text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + ph} stroke={T.lineDk} strokeWidth="1.2" />
      <line x1={padL} y1={padT + ph} x2={W - padR} y2={padT + ph} stroke={T.lineDk} strokeWidth="1.4" />
      <text x={padL + pw / 2} y={H - 5} textAnchor="middle" className="mj-ta-axcap">MOCK TESTS &#8594;</text>
      {yLabel && <text transform={`rotate(-90 13 ${padT + ph / 2})`} x={13} y={padT + ph / 2} textAnchor="middle" className="mj-ta-axcap">{yLabel}</text>}
      {series.map((s, si) => (
        <g key={si}>
          {s.area && <polygon points={`${padL},${padT + ph} ${pts(s.data)} ${W - padR},${padT + ph}`} fill={s.color} opacity="0.1" />}
          <polyline points={pts(s.data)} fill="none" stroke={s.color} strokeWidth={s.w || 2.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s.dashed ? "5 4" : undefined} opacity={s.dashed ? 0.7 : 1} />
          {!s.dashed && s.data.map((v, i) => (
            <circle key={i} cx={X(i)} cy={Y(v)} r={s.w >= 2.6 ? 2.8 : 2.1} fill="#fff" stroke={s.color} strokeWidth="1.5" />
          ))}
        </g>
      ))}
    </svg>
  );
}
function ChartLegend({ series }) {
  return (
    <div className="mj-ta-legend">
      {series.map((s, i) => (<span key={i}><i style={{ background: s.color, opacity: s.dashed ? 0.6 : 1 }} />{s.name}</span>))}
    </div>
  );
}
function TestAnalysis({ cfg }) {
  const m = cfg.metrics || {};
  const isNeet = /neet/i.test(cfg.slug || "");
  const base = m.growth?.you || m.test?.trend || [84, 98, 92, 126, 150, 178, 196, 214];
  const you = base.length >= 9 ? base : [...base, Math.round(base[base.length - 1] * 1.06)];
  const total = isNeet ? 720 : 300;
  const scored = you[you.length - 1] || (isNeet ? 650 : 214);
  const prev = you[you.length - 2] || scored;
  const pctUp = prev ? Math.max(Math.round(((scored - prev) / prev) * 100), 1) : 9;
  const accN = parseInt((m.outcomes || []).find((o) => /accuracy/i.test(o.l))?.v || "86", 10) || 86;
  const totalQ = isNeet ? 180 : 75;
  const correct = Math.round((scored / total) * totalQ * 0.92);
  const wrong = Math.max(Math.round((totalQ - correct) * 0.42), 1);
  const skipped = Math.max(totalQ - correct - wrong, 0);

  const nP = you.length;
  const xPool = isNeet
    ? ["Mock 8", "Mock 11", "NEET GT", "AIIMS GT", "Mock 15", "Grand T", "Mock 17", "Full test", "Full test", "Full test"]
    : ["Mock 8", "Mock 11", "JEE Adv", "JEE Adv", "Mock 15", "JEE Main", "Mock 17", "Full test", "Full test", "Full test"];
  const xL = you.map((_, i) => xPool[i] || `T${i + 1}`);
  const batch = m.growth?.batch && m.growth.batch.length >= nP ? m.growth.batch : you.map((v) => Math.round(v * 0.62));
  const target = you.map(() => Math.round(total * 0.75));
  const mentored = you.map((v, i) => Math.round(v + (v - batch[i]) * 0.35 * (i / (nP - 1))));
  const topper = you.map(() => Math.round(total * 0.9));
  const sRawMax = Math.max(...you, ...batch, ...target, ...mentored, ...topper);
  const sStep = [50, 100, 150, 200, 250, 300, 400].find((s) => s >= sRawMax / 5) || 400;
  const sMax = Math.ceil(sRawMax / sStep) * sStep;
  const sTicks = []; for (let v = 0; v <= sMax; v += sStep) sTicks.push(v);
  const scoreSeries = [
    { name: "You", color: T.coral, data: you, w: 2.9, area: true },
    { name: "With mentor", color: T.coralDk, data: mentored, w: 2.2 },
    { name: "Batch avg", color: "#b7ae9f", data: batch, w: 2 },
    { name: "Topper avg", color: "#6366f1", data: topper, dashed: true, w: 2 },
    { name: "Target 75%", color: T.ink, data: target, dashed: true, w: 2 },
  ];
  const accYou = you.map((_, i) => Math.max(Math.round(accN - (nP - 1 - i) * 2.2), 44));
  const accBatch = accYou.map((v) => Math.max(v - 11, 36));
  const accGoal = you.map(() => 90);
  const accTop = you.map(() => 95);
  const accSeries = [
    { name: "You", color: "#16a34a", data: accYou, w: 2.9, area: true },
    { name: "Batch avg", color: "#b7ae9f", data: accBatch, w: 2 },
    { name: "Topper", color: "#6366f1", data: accTop, dashed: true, w: 2 },
    { name: "Goal 90%", color: T.ink, data: accGoal, dashed: true, w: 2 },
  ];

  const weak = m.test?.weak || ["Rotational Motion", "Thermodynamics", "p-Block"];
  const exam = cfg.tracks?.[0]?.exam || (isNeet ? "NEET 2027" : "JEE Main 2026");
  const strategies = [
    { Ic: BookOpen, t: `Add 1 hr/day to ${weak[0]} — your weakest area this week.` },
    { Ic: Zap, t: `Attack ${weak[1] || "Physics"}${weak[2] ? " & " + weak[2] : ""} first — the most recurring weak chapters.` },
    { Ic: Clock, t: "Reserve the last 10 min per paper to recheck — silly errors cost ~5 marks." },
    { Ic: Target, t: `Accuracy at ${accN}% — skip low-confidence questions to dodge negatives.` },
  ];
  const slug = cfg.slug || (isNeet ? "neet" : "jee-2027");
  const RANKS = {
    "jee-2027": [{ v: "9,842", l: "All-India CRL" }, { v: "2,410", l: "OBC-NCL rank" }, { v: "99.31", l: "percentile" }, { v: "1.8k–2.6k", l: "likely band" }],
    "jee-2028": [{ v: "38,200", l: "All-India CRL" }, { v: "9,400", l: "OBC-NCL rank" }, { v: "96.40", l: "percentile" }, { v: "34k–42k", l: "likely band" }],
    "neet": [{ v: "6,188", l: "All-India rank" }, { v: "1,418", l: "OBC-NCL rank" }, { v: "99.62", l: "percentile" }, { v: "5.6k–6.9k", l: "likely band" }],
  };
  const rank = RANKS[slug] || RANKS["jee-2027"];
  const testsLogged = { "jee-2027": 18, "jee-2028": 6, "neet": 21 }[slug] || 14;

  const year = parseInt((cfg.eyebrow || "").match(/\d{4}/)?.[0] || "2027", 10);
  const daysToGo = Math.max(Math.round((new Date(year, isNeet ? 4 : 0, 15) - new Date()) / 86400000), 30);
  const session = isNeet ? `May ${year}` : `Jan ${year}`;
  const subs = (m.subjects || []).map((s) => {
    const cap = s.After <= 100 ? 100 : s.name === "Biology" ? 360 : 180; // NEET stores raw marks
    return { name: s.name, pct: Math.min(Math.round((s.After / cap) * 100), 100) };
  });

  return (
    <section className="mj-section mj-ta">
      <div className="mj-wrap">
        <Reveal className="mj-sec-head">
          <span className="mj-ta-pill"><span className="mj-dot mj-dot-live" /> LIVE PRODUCT PREVIEW</span>
          <div><h2 className="mj-display mj-display-lg">See how your test turns<br />into a <em>game plan.</em></h2></div>
          <p className="mj-sec-sub">Enter your marks and the analyser spots the trend, predicts your rank, and hands you the next steps — automatically.</p>
        </Reveal>

        <div className="mj-ta-topbar">
          <div className="mj-ta-topbar-l">
            <span className="mj-ta-topbar-badge" style={{ padding: 0, overflow: "hidden" }}>
              <img src="/cplogo3.jpeg" alt="CP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </span>
            <div>
              <strong>{exam} · Test Tracker</strong>
              <span>ADMIT CODE {isNeet ? "NEET" : "JEE"}-TRK-0419 · Target session: {session}</span>
            </div>
          </div>
          <div className="mj-ta-topbar-r">
            <div><strong>{daysToGo}</strong><span>days to go</span></div>
            <div><strong>{testsLogged}</strong><span>tests logged</span></div>
            <div><strong>{accN}%</strong><span>avg accuracy</span></div>
          </div>
        </div>

        <div className="mj-ta-grid">
          <div className="mj-ta-form">
            <div className="mj-ta-formtop">
              <span className="mj-ta-formbadge" style={{ padding: 0, overflow: "hidden" }}>
                <img src="/cplogo3.jpeg" alt="CP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </span>
              <div className="mj-ta-formtop-tx">
                <strong>Add a test result</strong>
                <span>Log every attempt — mocks count as much as the real thing.</span>
              </div>
              <span className="mj-ta-tabs"><i className="mj-ta-tab-on">Mock</i><i>{isNeet ? "Full" : "Mains"}</i><i>{isNeet ? "PCB" : "Adv"}</i></span>
            </div>
            <label className="mj-ta-field"><span>Test name</span><div className="mj-ta-input">Mock {nP + 3}</div></label>
            <div className="mj-ta-frow">
              <label className="mj-ta-field"><span>Total marks</span><div className="mj-ta-input">{total}</div></label>
              <label className="mj-ta-field"><span>Marks scored</span><div className="mj-ta-input">{scored}</div></label>
            </div>
            <div className="mj-ta-frow mj-ta-frow-3">
              <label className="mj-ta-field"><span>Correct</span><div className="mj-ta-input">{correct}</div></label>
              <label className="mj-ta-field"><span>Wrong</span><div className="mj-ta-input">{wrong}</div></label>
              <label className="mj-ta-field"><span>Skipped</span><div className="mj-ta-input">{skipped}</div></label>
            </div>
            <div className="mj-ta-frow">
              <label className="mj-ta-field"><span>Silly mistakes</span><div className="mj-ta-input mj-ta-input-ph">e.g. 3</div></label>
              <label className="mj-ta-field"><span>Silly mistake topic</span><div className="mj-ta-input mj-ta-input-ph">e.g. Sign errors</div></label>
            </div>
            <label className="mj-ta-field"><span>Over-spent time on (quick pick)</span><div className="mj-ta-input mj-ta-input-ph mj-ta-input-sel">Select subject</div></label>
            <button className="mj-ta-btn mj-ta-btn-on">+ Analyse this test</button>
            <div className="mj-ta-banner">
              <Check size={15} strokeWidth={3} /> Full test · {Math.round((scored / total) * 100)}% · {accN}% accuracy — up {pctUp}% on your last mock. Keep the streak.
            </div>
            <div className="mj-ta-rank">
              <span className="mj-ta-rank-l">🏆 PREDICTED {exam.toUpperCase()} RANK · {scored} MARKS</span>
              <span className="mj-ta-rank-sub">Based on your last 6 full-length tests</span>
              <div className="mj-ta-rank-row">
                {rank.map((r, i) => (<div key={i} className="mj-ta-rank-c"><strong>{r.v}</strong><span>{r.l}</span></div>))}
              </div>
              <span className="mj-ta-rank-foot">Estimate only — actual rank depends on official normalisation &amp; shift difficulty.</span>
            </div>
            {subs.length > 0 && (
              <div className="mj-ta-subs">
                <span className="mj-ta-subs-l">SUBJECT ACCURACY · LAST 6 TESTS</span>
                {subs.map((s, i) => (
                  <div key={i} className="mj-ta-sub">
                    <span>{s.name}</span>
                    <div className="mj-ta-subbar"><i style={{ width: `${s.pct}%` }} /></div>
                    <b>{s.pct}%</b>
                  </div>
                ))}
              </div>
            )}
            <div className="mj-ta-formfoot">
              <ShieldCheck size={13} strokeWidth={2.4} />
              <span>Your marks stay private — used only to build your plan.</span>
            </div>
          </div>

          <div className="mj-ta-right">
            <div className="mj-ta-card">
              <div className="mj-ta-cardhead"><strong>Score trend</strong><span>marks · out of {total}</span></div>
              <AnalysisChart series={scoreSeries} xLabels={xL} yTicks={sTicks} yMin={0} yMax={sMax} yLabel="MARKS" />
              <ChartLegend series={scoreSeries} />
            </div>
            <div className="mj-ta-card">
              <div className="mj-ta-cardhead"><strong>Accuracy trend</strong><span>correct ÷ attempted</span></div>
              <AnalysisChart series={accSeries} xLabels={xL} yTicks={[40, 60, 80, 100]} yMin={40} yMax={100} suffix="%" yLabel="ACCURACY" />
              <ChartLegend series={accSeries} />
            </div>
            <div className="mj-ta-card mj-ta-card-grow">
              <div className="mj-ta-cardhead"><strong>💡 Strategies to do better</strong></div>
              <div className="mj-ta-strat">
                {strategies.map((s, i) => (
                  <div key={i} className="mj-ta-strat-i">
                    <span className="mj-ta-strat-ic"><s.Ic size={14} /></span>
                    <span>{s.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ § 05 · LIVE TRACKING (coded dashboard) ═══════════════ */
const DASH_FEED = [
  { time: "09:14", tag: "PHY",  c: "#FF693D", t: "Solved 12 Rotational Motion DPPs" },
  { time: "10:02", tag: "CHM",  c: "#6366f1", t: "Watched Aldehydes revision · 28 min" },
  { time: "11:30", tag: "MOCK", c: "#22c55e", t: "Mock test #14 submitted · 218/300" },
  { time: "12:05", tag: "MENT", c: "#0ea5a4", t: "Mentor call scheduled · 6 PM" },
  { time: "13:45", tag: "MTH",  c: "#eab308", t: "3D Geometry — 20/25 attempted" },
];
function DashArea({ data = [] }) {
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const W = 320, H = 96, n = Math.max(data.length, 2);
  const y = (v) => H - 8 - ((v - min) / (max - min || 1)) * (H - 20);
  const pts = data.map((v, i) => [(i / (n - 1)) * W, y(v)]);
  const line = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mj-dl" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="mjDashArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF693D" stopOpacity=".26" />
          <stop offset="1" stopColor="#FF693D" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon points={area} fill="url(#mjDashArea)"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.35 }} />
      <motion.polyline points={line} fill="none" stroke="#FF693D" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeInOut" }} />
      {pts.map((p, i) => (
        <motion.circle key={i} cx={p[0]} cy={p[1]} r="2.6" fill="#fff" stroke="#FF693D" strokeWidth="1.6"
          initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.55 + i * 0.05 }} />
      ))}
    </svg>
  );
}
function DashRing({ pct = 0, sub }) {
  const r = 40, c = 2 * Math.PI * r;
  return (
    <div className="mj-dring">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke={T.line} strokeWidth="9" />
        <motion.circle cx="50" cy="50" r={r} fill="none" stroke={T.coral} strokeWidth="9" strokeLinecap="round"
          transform="rotate(-90 50 50)" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: c * (1 - pct / 100) }}
          viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      <div className="mj-dring-c"><strong>{pct}%</strong><span>{sub}</span></div>
    </div>
  );
}
function LiveTracking({ cfg }) {
  const m = cfg.metrics || {};
  const wk = m.weekHours || [];
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const wkMax = Math.max(...wk, 1);
  const total = wk.reduce((a, b) => a + b, 0);
  const st = m.student || {};
  const g = m.growth || {};
  const acc = (m.outcomes || []).find((o) => /accuracy/i.test(o.l))?.v || "86%";
  const accN = parseInt(acc, 10) || 86;
  const you = g.you || [];
  const gain = you.length ? `+${you[you.length - 1] - you[0]}` : "+130";
  const subjects = m.subjects || [];
  const fixList = (m.test?.fix || []).slice(0, 3);
  const dashStats = [
    { l: "HRS", v: Math.round(total) },
    { l: "DPPS", v: 128 },
    { l: "ACC%", v: accN },
  ];
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal className="mj-sec-head">
          <div>            <h2 className="mj-display mj-display-lg">A dashboard that feels<br /><em>alive — because it is.</em></h2>
          </div>
          <span className="mj-live-chip"><span className="mj-dot mj-dot-live" /> SESSION · LIVE</span>
        </Reveal>

        <Reveal delay={0.08} className="mj-dash">
          <div className="mj-dash-bar">
            <span className="mj-traffic"><i /><i /><i /></span>
            <span className="mj-dash-title">PARICHAY / TRACKER · {(st.name || "STUDENT").toUpperCase()}.SHARMA</span>
            <span className="mj-dash-stream"><Radio size={12} /> STREAMING</span>
          </div>
          <div className="mj-dash-body">
            <div className="mj-dash-main">
              <div className="mj-dash-idrow">
                <div>
                  <span className="mj-dash-kicker">STUDENT · {(st.exam || "JEE 2027").toUpperCase()}</span>
                  <h3 className="mj-dash-name">{st.line?.split("·")[0]?.trim() || st.name || "Aarav Sharma"}</h3>
                  <span className="mj-dash-mentor">MENTOR: {(st.mentor || "Rohan · IIT-B").toUpperCase()}</span>
                </div>
                <span className="mj-dash-active"><span className="mj-dot mj-dot-live" /> ACTIVE</span>
              </div>

              <div className="mj-dash-panel">
                <div className="mj-dash-panelhead"><span className="mj-dash-lbl">MOCK SCORE · LAST {you.length} WEEKS</span><span className="mj-dash-up">↗ {gain} marks</span></div>
                <DashArea data={you} />
              </div>

              <div className="mj-dash-two">
                <div className="mj-dash-panel">
                  <span className="mj-dash-lbl">STUDY HOURS · THIS WEEK</span>
                  <div className="mj-dash-chart">
                    {wk.map((h, i) => (
                      <div key={i} className="mj-dash-barcol">
                        <span className="mj-dash-barval">{h}h</span>
                        <div className="mj-dash-bartrack">
                          <motion.div className="mj-dash-barfill"
                            initial={{ height: 0 }} whileInView={{ height: `${(h / wkMax) * 100}%` }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }} />
                        </div>
                        <span className="mj-dash-barday">{days[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mj-dash-panel mj-dash-ringpanel">
                  <span className="mj-dash-lbl">ACCURACY</span>
                  <DashRing pct={accN} sub="avg" />
                </div>
              </div>

              <div className="mj-dash-stats">
                {dashStats.map((s, i) => (
                  <div key={i} className="mj-dash-stat">
                    <span className="mj-dash-stat-l">{s.l}</span>
                    <span className="mj-dash-stat-v">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mj-dash-feed">
              <span className="mj-dash-lbl">ACTIVITY FEED</span>
              <div className="mj-dash-feedlist">
                {DASH_FEED.map((f, i) => (
                  <Reveal key={i} delay={0.06 * i} className="mj-dash-feeditem">
                    <span className="mj-dash-feedtime">{f.time}</span>
                    <span className="mj-dash-feedtag" style={{ color: f.c, borderColor: f.c }}>{f.tag}</span>
                    <span className="mj-dash-feedtext">{f.t}</span>
                  </Reveal>
                ))}
              </div>

              <span className="mj-dash-lbl mj-dash-lbl-sp">SUBJECT MASTERY</span>
              <div className="mj-dash-subs">
                {subjects.map((s, i) => (
                  <div key={i} className="mj-dash-sub">
                    <div className="mj-dash-sub-top"><span>{s.name}</span><strong>{s.After}%</strong></div>
                    <div className="mj-dash-sub-track">
                      <motion.div className="mj-dash-sub-fill"
                        initial={{ width: 0 }} whileInView={{ width: `${s.After}%` }}
                        viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.9, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }} />
                    </div>
                  </div>
                ))}
              </div>

              {fixList.length > 0 && (
                <>
                  <span className="mj-dash-lbl mj-dash-lbl-sp">THIS WEEK&rsquo;S FIX-LIST</span>
                  <div className="mj-dash-fix">
                    {fixList.map((f, i) => (
                      <Reveal key={i} delay={0.06 * i} className="mj-dash-fixitem">
                        <span className="mj-dash-fixcheck"><Check size={12} strokeWidth={3} /></span>
                        <span className="mj-dash-fixtext">{f}</span>
                      </Reveal>
                    ))}
                  </div>
                </>
              )}

              <div className="mj-dash-next">
                <span className="mj-dash-next-l"><Radio size={11} /> NEXT MENTOR CALL</span>
                <strong>Today · 6:00 PM</strong>
                <span className="mj-dash-next-s">Weekly review + next-week plan</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ § 06 · FOR PARENTS ═══════════════ */
const BOOKLET_INSIDE = [
  "Study hours, streak & routine",
  "Test scores & predicted rank",
  "Weak / medium / strong chapters",
  "Weekly task progress",
  "Mentor's note & next-week plan",
];
function ForParents({ cfg }) {
  const p = cfg.metrics?.parent || {};
  const st = cfg.metrics?.student || {};
  const exam = cfg.tracks?.[0]?.exam || "JEE 2027";
  const focus = (cfg.metrics?.test?.fix || []).slice(0, 3);
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal className="mj-sec-head">
          <div><h2 className="mj-display mj-display-lg">A window into <em>the week.</em></h2></div>
          <p className="mj-sec-sub">Every Sunday a printable one-pager lands in your inbox — the real hours, tests, ranks and mentor notes your child heard that week.</p>
        </Reveal>

        <Reveal delay={0.1} className="mj-parent-card">
          <div className="mj-booklet">
            <span className="mj-booklet-pill"><BookOpen size={13} /> PARENT REPORT</span>
            <h2 className="mj-booklet-h">Weekly Progress<br />Booklet</h2>
            <p className="mj-booklet-sub">A clear, jargon-free summary of your child&rsquo;s week — effort, tests, improvement and what&rsquo;s next.</p>
            <div className="mj-booklet-div" />
            <span className="mj-booklet-lbl">STUDENT</span>
            <strong className="mj-booklet-name">{st.name || "Your child"}</strong>
            <span className="mj-booklet-meta">{exam} · CollegeParichay Mentorship</span>
            <span className="mj-booklet-lbl mj-booklet-lbl2">WHAT&rsquo;S INSIDE</span>
            <ul className="mj-booklet-list">
              {BOOKLET_INSIDE.map((it, i) => (
                <li key={i}><CircleDot size={15} /> {it}</li>
              ))}
            </ul>
            <button className="mj-booklet-btn" onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! Can I see a sample parent weekly report?")}`, "_blank")}>
              See a sample booklet <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="mj-weekly">
          <div className="mj-weekly-top">
            <span className="mj-weekly-name">The Weekly</span>
            <span className="mj-weekly-vol">{p.issue || "VOL 14 · SUN 12 NOV"}</span>
          </div>
          <div className="mj-weekly-body">
            <div className="mj-weekly-featured">
              <span className="mj-featured-lbl">FEATURED</span>
              <h3 className="mj-featured-quote">{p.headline || p.remark || "Aarav closed his weakest chapter — Rotational Motion."}</h3>
              {p.body && <p className="mj-featured-body">{p.body}</p>}
              <div className="mj-weekly-photo">
                <span className="mj-photo-ic"><Sparkles size={15} /></span>
                <span className="mj-photo-t">BOOKLET PHOTO</span>
                <span className="mj-photo-s">DROP IMAGE</span>
              </div>
            </div>
            <div className="mj-weekly-glance">
              <span className="mj-glance-lbl">AT A GLANCE</span>
              {(p.rows || []).slice(0, 5).map((r, i) => (
                <div key={i} className="mj-glance-row">
                  <span>{r.l}</span><strong>{r.v}</strong>
                </div>
              ))}
              {focus.length > 0 && (
                <div className="mj-weekly-next">
                  <span className="mj-glance-lbl">FOCUS NEXT WEEK</span>
                  <ul className="mj-weekly-nextlist">
                    {focus.map((f, i) => <li key={i}><Check size={13} strokeWidth={3} /> {f}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="mj-weekly-foot"><span>PARICHAY · PARENT REPORT</span><span>PAGE 01 / 04</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ § 07 · REAL THREADS (animated whatsapp phones) ═══════════════ */
const PHONE_CHATS = [
  {
    caption: "Doubt at 11 pm", mentor: "Mentor Arjun", status: "online · replies in minutes",
    script: [
      { me: 1, t: "Sir I'm stuck on rotational motion, been 2 hrs 😩", time: "11:42" },
      { me: 0, t: "Send me the question 📸 which PYQ?", time: "11:43" },
      { me: 1, t: "The pulley + inclined plane one from 2019", time: "11:44" },
      { me: 0, t: "Skip torque-heavy ones tonight. Do the 6 PYQs I marked 💪", time: "11:45" },
      { me: 0, t: "Sleep by 12 — you've done enough today 🌙", time: "11:46" },
    ],
  },
  {
    caption: "Sunday plan drop", mentor: "Mentor Sneha", status: "online · replies in minutes",
    script: [
      { me: 1, t: "Sir, I can't finish Organic Chem in time 🤢", time: "9:32" },
      { me: 0, t: "Don't worry Aditi. Let's fix this today 💪", time: "9:33" },
      { me: 0, t: "First — GOC done or pending?", time: "9:33" },
      { me: 1, t: "GOC half done. Hydrocarbons not started 🤪", time: "9:34" },
      { me: 0, t: "Got it. Here's your new 7-day plan 👇\n📅 Mon–Tue → GOC\n📅 Wed–Fri → Hydrocarbons\n📅 Sat → Revision\n📅 Sun → Mock", time: "9:35" },
      { me: 1, t: "This actually feels doable 🥹", time: "9:36" },
      { me: 0, t: "It is. I'm targeting 75+ for you this time 🚀", time: "9:37" },
    ],
  },
  {
    caption: "Mock breakdown", mentor: "Mentor Rahul", status: "online · replies in minutes",
    script: [
      { me: 1, t: "Mock went 178/300 today 🔥 up from 126", time: "6:10" },
      { me: 0, t: "That's the jump we planned 👏", time: "6:11" },
      { me: 0, t: "Chemistry accuracy is your next 20 marks", time: "6:11" },
      { me: 1, t: "Yeah I lost 14 marks in silly errors 😔", time: "6:12" },
      { me: 0, t: "Capsule at 7 am — 10 Qs, timed. Let's kill the silly mistakes 🎯", time: "6:13" },
    ],
  },
  {
    caption: "Pep talk", mentor: "Mentor Priya", status: "online · replies in minutes",
    script: [
      { me: 1, t: "Sir I feel like I'm falling behind everyone 😞", time: "8:40" },
      { me: 0, t: "You were at 42%ile in March. You're at 88 now 📈", time: "8:41" },
      { me: 0, t: "Your only competition is last week's you 🫡", time: "8:41" },
      { me: 1, t: "Needed to hear that 🥹 thank you sir", time: "8:42" },
      { me: 0, t: "Now close the app and sleep. Big day tomorrow 🌙💪", time: "8:43" },
    ],
  },
];

function Ticks() {
  return (
    <svg className="mj-ticks" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M1 6.5 4 9.5 10 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 6.5 10 9.5 16 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatPhone({ chat, startDelay = 300 }) {
  const { script } = chat;
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const rootRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setCount(script.length); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [script.length]);

  useEffect(() => {
    if (!started) return;
    let cancelled = false;
    const timers = [];
    let i = 0;
    const wait = (ms, fn) => timers.push(setTimeout(() => { if (!cancelled) fn(); }, ms));
    const step = () => {
      if (i >= script.length) {
        wait(4600, () => { setCount(0); setTyping(false); i = 0; wait(700, step); });
        return;
      }
      const msg = script[i];
      const reveal = () => {
        setTyping(false);
        setCount((c) => c + 1);
        i += 1;
        const readMs = 700 + Math.min(msg.t.length * 22, 1800);
        wait(readMs, step);
      };
      if (!msg.me) { setTyping(true); wait(950 + Math.min(msg.t.length * 12, 1200), reveal); }
      else reveal();
    };
    wait(startDelay, step);
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [started, script, startDelay]);

  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTo({ top: b.scrollHeight, behavior: "smooth" });
  }, [count, typing]);

  return (
    <div className="mj-phonewrap" ref={rootRef}>
      <div className="mj-phone">
        <span className="mj-phone-island" />
        <div className="mj-phone-screen">
          <div className="mj-wa-header">
            <div className="mj-wa-head">
              <span className="mj-wa-status">9:41</span>
              <span className="mj-wa-bars"><i /><i /><i /></span>
            </div>
            <div className="mj-wa-top">
              <span className="mj-wa-av"><b className="mj-wa-cp">CP</b><span className="mj-wa-online" /></span>
              <div className="mj-wa-id">
                <strong>{chat.mentor} <span className="mj-wa-spark">✨</span></strong>
                <span>{typing ? "typing…" : chat.status}</span>
              </div>
              <Video size={18} className="mj-wa-ic" />
              <Phone size={17} className="mj-wa-ic" />
            </div>
          </div>
          <div className="mj-wa-body" ref={bodyRef}>
            <span className="mj-wa-day">Today</span>
            {script.slice(0, count).map((m, idx) => (
              <div key={idx} className={m.me ? "mj-wa-row mj-wa-me" : "mj-wa-row"}>
                <div className={m.me ? "mj-wa-msg mj-wa-msg-me" : "mj-wa-msg"}>
                  <p>{m.t}</p>
                  <span className="mj-wa-time">{m.time}{m.me ? <Ticks /> : null}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="mj-wa-row">
                <div className="mj-wa-msg mj-wa-typing"><i /><i /><i /></div>
              </div>
            )}
          </div>
          <div className="mj-wa-input">
            <Paperclip size={17} />
            <div className="mj-wa-field"><Smile size={16} /><span>Message your mentor…</span><Camera size={16} /></div>
            <span className="mj-wa-mic"><Mic size={16} /></span>
          </div>
        </div>
      </div>
      <span className="mj-phone-cap">&ldquo;{chat.caption}&rdquo;</span>
    </div>
  );
}

function WhatsApp() {
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal className="mj-sec-head">
          <div>            <h2 className="mj-display mj-display-lg">What actually happens<br />in <em>your WhatsApp.</em></h2>
          </div>
          <p className="mj-sec-sub">Unedited. Unscripted. Late-night doubt, Sunday plan, Wednesday pep talk.</p>
        </Reveal>
        <div className="mj-phones">
          {PHONE_CHATS.map((c, i) => (
            <ChatPhone key={i} chat={c} startDelay={300 + i * 650} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ PRICING ═══════════════ */
const INCLUDED = [
  "1-on-1 IITian mentor for 12 months", "Weekly personalised study plan",
  "Weekly test analysis + priority checklist", "Live study tracking dashboard",
  "Parent weekly booklet", "24/7 WhatsApp doubt support",
  "Full mock marathon in final phase", "Rank prediction + college shortlist",
];
function Pricing({ plan, exam, openEnrol }) {
  const p = MENTOR_PLANS[plan] || { amount: 2499, old: 7999 };
  return (
    <section id="enrol" className="mj-section">
      <div className="mj-wrap">
        <Reveal style={{ textAlign: "center" }}>
          <h2 className="mj-display mj-display-xl">One plan. Everything.<br />Start at <em>₹{p.amount}.</em></h2>
        </Reveal>
        <Reveal delay={0.1} className="mj-price-card">
          <div className="mj-price-left">
            <span className="mj-price-kicker">ADMISSION PASS</span>
            <span className="mj-price-plan">{exam}</span>
            <div className="mj-price-amt">₹{p.amount}</div>
            <div className="mj-price-old">₹{p.old?.toLocaleString("en-IN")}</div>
            <div className="mj-price-terms">7-DAY TRIAL · THEN ₹{p.old?.toLocaleString("en-IN")}/YR</div>
            <span className="mj-price-seats">⚡ {SEATS_LEFT} SEATS LEFT</span>
          </div>
          <div className="mj-price-right">
            <span className="mj-inc-lbl">EVERYTHING INCLUDED</span>
            <div className="mj-inc-grid">
              {INCLUDED.map((f) => (
                <div key={f} className="mj-inc-item"><Check size={15} strokeWidth={3} color={T.coral} /> {f}</div>
              ))}
            </div>
            <button className="mj-btn-dark mj-btn-block" onClick={() => openEnrol(plan)}>Claim your seat <ArrowRight size={17} /></button>
            <div className="mj-price-foot"><span>◈ RAZORPAY</span><span>⟲ 7-DAY REFUND</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ FAQ ═══════════════ */
function Faqs({ cfg }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal className="mj-faq-head">
          <span className="mj-faq-pill"><HelpCircle size={13} /> FAQ</span>
          <h2 className="mj-display mj-display-lg mj-faq-h">Everything you're <em>wondering.</em></h2>
          <p className="mj-sec-sub">Everything students and parents ask us before getting started.</p>
        </Reveal>
        <div className="mj-faqs">
          {(cfg.faqs || []).map((f, i) => (
            <div key={i} className={open === i ? "mj-faq mj-faq-open" : "mj-faq"}>
              <button className="mj-faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="mj-faq-qt">{f.q}</span>
                <span className="mj-faq-ic">{open === i ? <Minus size={16} /> : <Plus size={16} />}</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div className="mj-faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ § 11 · TALK TO US ═══════════════ */
function TalkToUs({ exam }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", goal: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const text = `Hi! I'd like a callback about ${exam} mentorship.\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}\nGoal: ${f.goal}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };
  return (
    <section className="mj-section mj-talk">
      <div className="mj-wrap">
        <Reveal className="mj-parent-card">
          <div className="mj-talk-booklet">
            <h2 className="mj-display mj-display-lg">Not sure?<br /><em>Let&rsquo;s talk.</em></h2>
            <p className="mj-body">A 15-minute call, no pressure. We&rsquo;ll listen to where you are,
              share what the year could look like, and let you decide.</p>
            <div className="mj-reach">
              <span>REACH US · HELLO@COLLEGEPARICHAY.IN</span>
              <span>CALL · +91 78775 96464</span>
            </div>
          </div>
          <div className="mj-talk-form-wrap">
            <form onSubmit={submit}>
              <div className="mj-form-row">
                <label className="mj-field"><span>Your name</span><input required value={f.name} onChange={set("name")} placeholder="Your name" /></label>
                <label className="mj-field"><span>Phone</span><input required inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="Phone" /></label>
              </div>
              <label className="mj-field"><span>Email</span><input type="email" value={f.email} onChange={set("email")} placeholder="Email" /></label>
              <label className="mj-field"><span>Tell us about your goal</span><textarea rows={3} value={f.goal} onChange={set("goal")} placeholder="Tell us about your goal" /></label>
              <button className="mj-btn-dark mj-btn-block" type="submit">Request a callback <Send size={16} /></button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ variant tabs + floating enrol ═══════════════ */
function VariantTabs({ variant }) {
  return (
    <div className="mj-tabs">
      {MENTOR_LINKS.map((l) => (
        <Link key={l.slug} to={l.to} className={l.slug === variant ? "mj-tab mj-tab-on" : "mj-tab"}>{l.label}</Link>
      ))}
    </div>
  );
}
/* ═══════════════ PAGE ═══════════════ */
export default function Mentorship() {
  const { variant } = useParams();
  const cfg = MENTORSHIP[variant];
  const { open: openEnrol } = useEnrol();
  if (!cfg) return <Navigate to="/mentorship/jee-2027" replace />;

  const plan = cfg.tracks?.[0]?.plan || "mentor-jee-2027";
  const exam = cfg.tracks?.[0]?.exam || "JEE 2027";
  const year = (cfg.eyebrow || "").match(/\d{4}/)?.[0] || String(MENTOR_PLANS[plan]?.year || "2027");
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="mj">
      <Seo
        title={`${exam} Mentorship by IITians — 1-on-1 Guidance | CollegeParichay`}
        description="1-on-1 JEE & NEET mentorship by IIT alumni — daily targets, weekly test analysis, live tracking and parent reports. Limited seats. Start at ₹2,499 on CollegeParichay."
        path={`/mentorship/${variant}`}
      />
      <Hero variant={variant} cfg={cfg} plan={plan} year={year} exam={exam} openEnrol={openEnrol} scrollTo={scrollTo} />
      <Qualifier cfg={cfg} />
      <Method cfg={cfg} />
      <LiveTracking cfg={cfg} />
      <TestAnalysis cfg={cfg} />
      <ForParents cfg={cfg} />
      <WhatsApp />
      <Pricing plan={plan} exam={exam} openEnrol={openEnrol} />
      <Faqs cfg={cfg} />
      <TalkToUs exam={exam} />
      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
.mj { background:${T.paper}; color:${T.ink}; font-family:'DM Sans',sans-serif; overflow-x:hidden; }
.mj * { box-sizing:border-box; }
.mj-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
.mj em { font-family:'Sora',sans-serif;  color:${T.coral}; font-weight:800; }
.mj-display { font-family:'Sora',sans-serif; font-weight:800; color:${T.ink}; letter-spacing:-.5px; line-height:1.08; margin:14px 0 0; }
.mj-display em { color:${T.coral}; }
.mj-display-lg { font-size:clamp(2rem,4.4vw,3.3rem); }
.mj-display-xl { font-size:clamp(2.3rem,5.4vw,4rem); }
.mj-on-navy { color:${T.onNavy}; }
.mj-label { display:inline-flex; align-items:center; gap:8px; padding:5px 13px; border:1px solid ${T.lineDk}; border-radius:6px; background:${T.card}; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.body}; }
.mj-label-dark { background:transparent; border-color:${T.navyLine}; color:${T.onNavyMute}; }
.mj-body { font:400 1.05rem/1.7 'DM Sans',sans-serif; color:${T.body}; margin:20px 0 0; max-width:460px; }
.mj-section { padding:clamp(64px,9vw,110px) 0; position:relative; }

/* variant tabs */
.mj-tabs { display:flex; justify-content:center; gap:8px; padding-top:48px; padding-bottom:2px; flex-wrap:wrap; position:relative; z-index:2; }
.mj-tab { text-decoration:none; padding:8px 16px; border-radius:50px; border:1px solid ${T.line}; background:${T.card}; color:${T.body}; font:700 .82rem/1 'Space Grotesk',sans-serif; transition:.16s; }
.mj-tab:hover { border-color:${T.coral}; color:${T.coralDk}; }
.mj-tab-on { background:${T.ink}; border-color:${T.ink}; color:#fff; }

/* hero — glassmorphic performance engine (coral + cream) */
.mj-hero { position:relative; padding:clamp(110px,12vw,130px) 0 clamp(70px,8vw,104px); overflow:hidden; border-bottom:1px solid ${T.line}; background:var(--page-bg); }
.mj-hero-bg { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.mj-orb { position:absolute; border-radius:50%; filter:blur(90px); }
.mj-orb-a { width:520px; height:520px; top:-210px; left:-150px; background:radial-gradient(circle, rgba(255,105,61,.24), transparent 70%); opacity:.5; animation:mjfloat 16s ease-in-out infinite; }
.mj-orb-b { width:460px; height:460px; bottom:-240px; right:-140px; background:radial-gradient(circle, rgba(255,178,130,.22), transparent 70%); opacity:.5; animation:mjfloat 21s ease-in-out infinite reverse; }
@keyframes mjfloat { 0%,100%{transform:translate(0,0);} 50%{transform:translate(42px,32px);} }
.mj-gem { position:absolute; top:34%; left:50%; width:360px; height:360px; transform:translate(-50%,-50%); animation:mjspin 30s linear infinite; }
.mj-gem-core { position:absolute; inset:0; clip-path:polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%); background:conic-gradient(from 0deg, rgba(255,105,61,.5), rgba(255,196,158,.22), rgba(216,81,42,.5), rgba(255,105,61,.5)); filter:blur(7px); opacity:.38; }
@keyframes mjspin { to{transform:rotate(360deg);} }
.mj-grid { position:absolute; inset:0; background-image:linear-gradient(${T.lineDk} 1px,transparent 1px),linear-gradient(90deg,${T.lineDk} 1px,transparent 1px); background-size:46px 46px; opacity:.05; -webkit-mask-image:radial-gradient(72% 62% at 50% 40%, #000, transparent 76%); mask-image:radial-gradient(72% 62% at 50% 40%, #000, transparent 76%); }
.mj-watermark { position:absolute; top:-2%; left:50%; transform:translateX(-50%); font-family:'Sora',sans-serif;  font-weight:900; font-size:min(42vw,600px); line-height:1; color:transparent; -webkit-text-stroke:1.5px ${T.lineDk}; opacity:.16; pointer-events:none; user-select:none; z-index:1; }

.mj-hero-inner { position:relative; z-index:2; }
.mj-hero-center { display:flex; flex-direction:column; align-items:center; text-align:center; max-width:940px; margin:0 auto; }
.mj-hero-pill { display:inline-flex; align-items:center; gap:9px; padding:8px 18px; border-radius:50px; background:${T.coralSoft}; border:1px solid #F6CDBE; color:${T.coralDk}; font:700 .84rem/1 'Sora',sans-serif; box-shadow:0 10px 26px -16px rgba(255,105,61,.6); }
.mj-hero-pill .mj-dot { width:7px; height:7px; background:${T.coral}; box-shadow:0 0 0 4px rgba(255,105,61,.14); }
.mj-glass-tag { display:inline-flex; align-items:center; gap:8px; padding:8px 17px; border-radius:50px; background:rgba(255,255,255,.6); -webkit-backdrop-filter:blur(12px) saturate(160%); backdrop-filter:blur(12px) saturate(160%); border:1px solid rgba(255,105,61,.3); color:${T.coralDk}; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; text-transform:uppercase; box-shadow:0 10px 26px -14px rgba(255,105,61,.55); }
.mj-hero-h1 { position:relative; font-family:'Sora',sans-serif; font-weight:800; font-size:clamp(2.5rem,6.6vw,5.1rem); line-height:1.05; letter-spacing:-.03em; color:${T.ink}; margin:30px 0 0; }
.mj-hero-accent { position:relative; display:inline-block; background:linear-gradient(96deg, #E5401A 0%, #FF7A45 52%, #FF9E6B 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; color:transparent; white-space:nowrap; }
.mj-hero-uline { position:absolute; left:2%; bottom:-.14em; width:96%; height:.26em; overflow:visible; }
.mj-hero-uline path { fill:none; stroke:${T.coral}; stroke-width:5; stroke-linecap:round; vector-effect:non-scaling-stroke; }
.mj-hero-sub { font:400 clamp(1.04rem,1.6vw,1.3rem)/1.62 'DM Sans',sans-serif; color:${T.body}; max-width:660px; margin:26px 0 0; }
.mj-hero-cta { display:flex; align-items:center; justify-content:center; gap:15px; flex-wrap:wrap; margin-top:38px; }
.mj-hero-cta .mj-btn-glow, .mj-hero-cta .mj-btn-glass { border-radius:50px; padding:16px 32px; }
.mj-hero-bullets { display:flex; align-items:center; justify-content:center; gap:14px 28px; flex-wrap:wrap; margin-top:34px; }
.mj-hero-bullet { display:inline-flex; align-items:center; gap:9px; font:600 .92rem/1 'DM Sans',sans-serif; color:${T.body}; }
.mj-hero-bullet i { width:7px; height:7px; border-radius:50%; background:${T.coral}; flex-shrink:0; }
.mj-btn-glow { display:inline-flex; align-items:center; gap:10px; padding:16px 30px; border:none; border-radius:14px; background:linear-gradient(135deg, ${T.coral}, ${T.coralDk}); color:#fff; font:700 1rem/1 'Space Grotesk',sans-serif; cursor:pointer; box-shadow:0 12px 32px -8px rgba(255,105,61,.55); animation:mjglow 3.6s ease-in-out infinite; transition:transform .16s; }
.mj-btn-glow:hover { transform:translateY(-2px) scale(1.02); }
@keyframes mjglow { 0%,100%{box-shadow:0 12px 32px -12px rgba(255,105,61,.45);} 50%{box-shadow:0 16px 46px -8px rgba(255,105,61,.78);} }
.mj-btn-glass { display:inline-flex; align-items:center; gap:10px; padding:16px 28px; border-radius:14px; background:rgba(255,255,255,.55); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); border:1px solid ${T.lineDk}; color:${T.ink}; font:700 1rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:.16s; }
.mj-btn-glass:hover { border-color:${T.coral}; color:${T.coralDk}; transform:translateY(-2px); }

.mj-dot { width:8px; height:8px; border-radius:50%; background:${T.coral}; flex-shrink:0; }
.mj-dot-live { background:#22c55e; box-shadow:0 0 0 0 rgba(34,197,94,.5); animation:mjpulse 1.8s infinite; }
@keyframes mjpulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,.5);} 100%{box-shadow:0 0 0 8px rgba(34,197,94,0);} }
.mj-pill { display:inline-flex; align-items:center; gap:8px; padding:7px 14px; border:1px solid ${T.lineDk}; border-radius:50px; background:${T.card}; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.body}; }
.mj-pill-warn { color:${T.coralDk}; border-color:${T.coralSoft}; background:${T.coralSoft}; }

.mj-btn-dark { display:inline-flex; align-items:center; gap:9px; padding:15px 26px; border:none; border-radius:12px; background:${T.ink}; color:#fff; font:700 .98rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:transform .16s, background .16s; }
.mj-btn-dark:hover { background:#000; transform:translateY(-2px); }
.mj-btn-outline { display:inline-flex; align-items:center; gap:8px; margin-top:26px; padding:13px 24px; border:1px solid ${T.lineDk}; border-radius:12px; background:${T.card}; color:${T.ink}; font:700 .9rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:.16s; }
.mj-btn-outline:hover { border-color:${T.coral}; color:${T.coralDk}; }
.mj-btn-block { width:100%; justify-content:center; margin-top:22px; }

.mj-hero-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; width:100%; margin-top:56px; }
.mj-gcard { text-align:center; padding:26px 18px; border-radius:20px; background:rgba(255,255,255,.5); -webkit-backdrop-filter:blur(16px) saturate(170%); backdrop-filter:blur(16px) saturate(170%); border:1px solid rgba(255,255,255,.72); box-shadow:0 22px 52px -34px rgba(27,27,36,.42), inset 0 1px 0 rgba(255,255,255,.6); transition:transform .2s, box-shadow .2s; }
.mj-gcard:hover { transform:translateY(-4px); box-shadow:0 28px 62px -30px rgba(255,105,61,.5); }
.mj-gcard-ic { display:inline-grid; place-items:center; width:46px; height:46px; border-radius:14px; background:${T.coralSoft}; color:${T.coralDk}; margin-bottom:14px; }
.mj-gcard h3 { font:700 1.05rem/1.2 'Space Grotesk',sans-serif; color:${T.ink}; margin:0 0 8px; }
.mj-gcard p { font:400 .85rem/1.55 'DM Sans',sans-serif; color:${T.body}; margin:0; }

.mj-hero-live { position:absolute; bottom:44px; right:34px; z-index:3; width:232px; padding:18px; border-radius:18px; background:rgba(255,255,255,.62); -webkit-backdrop-filter:blur(16px) saturate(160%); backdrop-filter:blur(16px) saturate(160%); border:1px solid rgba(255,255,255,.72); box-shadow:0 26px 62px -30px rgba(27,27,36,.5); }
.mj-hl-top { display:flex; align-items:center; gap:8px; font:800 .6rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.coralDk}; }
.mj-hl-row { display:flex; justify-content:space-between; align-items:baseline; margin-top:14px; font:700 .6rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.muted}; }
.mj-hl-row b { font:800 1.2rem/1 'Sora',sans-serif; color:${T.ink}; }
.mj-hl-bar { margin-top:10px; height:6px; border-radius:50px; background:${T.line}; overflow:hidden; }
.mj-hl-bar span { display:block; height:100%; border-radius:50px; background:linear-gradient(90deg,${T.coral},${T.coralDk}); }

/* stat band */
.mj-statband { border-bottom:1px solid ${T.line}; }
.mj-stat-row { display:grid; grid-template-columns:repeat(4,1fr); }
.mj-stat { padding:34px 10px 34px 0; border-left:1px solid ${T.line}; padding-left:26px; }
.mj-stat:first-child { border-left:none; padding-left:0; }
.mj-stat-v { font:800 clamp(1.7rem,3vw,2.4rem)/1 'Sora',sans-serif; color:${T.ink}; }
.mj-stat-l { margin-top:8px; font:700 .74rem/1.3 'Space Grotesk',sans-serif; letter-spacing:.06em; text-transform:uppercase; color:${T.muted}; }

/* qualifier */
.mj-lead { font-family:'Sora',sans-serif; font-weight:600; font-size:clamp(1.3rem,2.6vw,2rem); line-height:1.4; color:${T.ink}; max-width:820px; margin:0 0 44px; }
.mj-checklist { display:flex; flex-direction:column; gap:16px; }
.mj-check-card { display:flex; align-items:center; gap:16px; width:min(620px,100%); padding:20px 24px; background:${T.card}; border:1px solid ${T.line}; border-radius:16px; box-shadow:0 10px 30px -24px rgba(0,0,0,.4); transition:border-color .22s, box-shadow .22s; }
.mj-check-card:hover { border-color:${T.coral}; box-shadow:0 22px 46px -28px rgba(255,105,61,.5); }
.mj-check-right { align-self:flex-end; flex-direction:row-reverse; text-align:right; }
.mj-check-ic { display:grid; place-items:center; width:38px; height:38px; border-radius:50%; background:${T.coral}; color:#fff; flex-shrink:0; }
.mj-check-t { flex:1; font:600 1rem/1.4 'DM Sans',sans-serif; color:${T.ink}; }
.mj-check-n { font:800 .8rem/1 'Space Grotesk',sans-serif; color:${T.muted}; }

/* method — light vertical timeline */
.mj-method { position:relative; overflow:hidden; }
.mj-method::before { content:""; position:absolute; top:-14%; right:-8%; width:520px; height:520px; border-radius:50%; background:radial-gradient(circle, ${T.coralSoft}, transparent 68%); opacity:.55; pointer-events:none; }
.mj-dark-head { display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px; margin-bottom:56px; position:relative; }
.mj-dark-head > div { text-align:center; }
.mj-dark-head .mj-display { position:relative; padding-bottom:22px; }
.mj-scrollhint { font:800 .72rem/1 'Space Grotesk',sans-serif; letter-spacing:.16em; color:${T.muted}; white-space:nowrap; }
.mj-vsteps { position:relative; max-width:860px; margin:0 auto; padding-left:8px; }
.mj-vsteps-rail { position:absolute; left:31px; top:14px; bottom:34px; width:2px; transform-origin:top; background:linear-gradient(180deg, ${T.coral}, ${T.lineDk}); }
.mj-vstep { position:relative; display:grid; grid-template-columns:64px 1fr; gap:24px; align-items:start; margin-bottom:22px; }
.mj-vstep-mark { position:relative; z-index:2; display:grid; place-items:center; width:64px; height:64px; border-radius:50%; background:${T.card}; border:1.5px solid ${T.lineDk}; box-shadow:0 0 0 6px ${T.paper}, 0 10px 24px -16px rgba(0,0,0,.4); transition:.2s; }
.mj-vstep-n { font:800 1.5rem/1 'Sora',sans-serif; color:var(--step-color, ${T.coral}); }
.mj-vstep-card { border:1px solid ${T.line}; border-radius:18px; background:${T.card}; padding:22px 24px; box-shadow:0 14px 34px -28px rgba(0,0,0,.35); transition:transform .2s, border-color .2s, box-shadow .2s; }
.mj-vstep:hover .mj-vstep-card { transform:translateX(6px); border-color:var(--step-color, ${T.coral}); box-shadow:0 24px 48px -30px rgba(0,0,0,.2); }
.mj-vstep:hover .mj-vstep-mark { border-color:var(--step-color, ${T.coral}); background:var(--step-color, ${T.coral}); box-shadow:0 0 0 6px ${T.paper}, 0 12px 26px -12px rgba(0,0,0,.3); }
.mj-vstep:hover .mj-vstep-n { color:#fff; }
.mj-vstep-cardtop { display:flex; align-items:center; gap:10px; margin-bottom:11px; }
.mj-vstep-ic { display:grid; place-items:center; width:30px; height:30px; flex-shrink:0; border-radius:9px; background:var(--step-color, ${T.coral}); color:#fff; opacity:0.95; }
.mj-vstep-tag { padding:4px 10px; border:1px solid ${T.lineDk}; border-radius:6px; font:800 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.muted}; }
.mj-vstep-foot { margin-left:auto; font:800 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:var(--step-color, ${T.coral}); white-space:nowrap; }
.mj-vstep-t { font:700 1.3rem/1.2 'Sora',sans-serif; color:${T.ink}; margin:0; }
.mj-vstep-d { font:400 .94rem/1.6 'DM Sans',sans-serif; color:${T.body}; margin:8px 0 0; }
.mj-vstep-tasks { margin-top:15px; padding-top:15px; border-top:1px solid ${T.line}; }
.mj-vstep-tasksl { display:inline-flex; align-items:center; gap:6px; font:800 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:var(--step-color, ${T.coral}); }
.mj-vstep-tasks ul { list-style:none; margin:11px 0 0; padding:0; display:flex; flex-direction:column; gap:9px; }
.mj-vstep-tasks li { display:flex; align-items:flex-start; gap:9px; font:500 .87rem/1.4 'DM Sans',sans-serif; color:${T.body}; }
.mj-vstep-tasks li svg { flex-shrink:0; margin-top:3px; color:var(--step-color, ${T.coral}); }
.mj-vstep-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:15px; }
.mj-vstep-chips span { padding:6px 12px; border-radius:50px; background:${T.paper}; border:1px solid ${T.line}; font:700 .72rem/1 'Space Grotesk',sans-serif; color:var(--step-color, ${T.coral}); }

/* section head shared */
.mj-sec-head { display:flex; flex-direction:column; align-items:center; text-align:center; gap:18px; margin-bottom:52px; }
.mj-sec-head > div { text-align:center; }
.mj-sec-head .mj-display { position:relative; padding-bottom:22px; }
.mj-sec-head .mj-display::after, .mj-dark-head .mj-display::after { content:""; position:absolute; left:50%; bottom:0; transform:translateX(-50%); width:64px; height:3px; border-radius:3px; background:linear-gradient(90deg, ${T.coral}, ${T.coralDk}); }
.mj-sec-head .mj-display::before, .mj-dark-head .mj-display::before { content:""; position:absolute; left:50%; bottom:1px; transform:translateX(-50%); width:150px; height:1px; background:${T.lineDk}; }
.mj-sec-sub { font:400 1rem/1.6 'DM Sans',sans-serif; color:${T.body}; max-width:420px; margin:0 auto; }
.mj-live-chip { display:inline-flex; align-items:center; gap:8px; padding:8px 15px; border:1px solid #bbe6c8; border-radius:50px; background:#e9f8ee; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:#15803d; }

/* progress */
.mj-prog-grid { display:grid; grid-template-columns:2fr 1fr; grid-auto-rows:auto; gap:18px; }
.mj-prog-card { border-radius:18px; padding:24px; border:1px solid ${T.line}; }
.mj-navy-card { grid-row:span 2; background:${T.navy}; border-color:${T.navyLine}; color:${T.onNavy}; display:flex; flex-direction:column; }
.mj-card-head { display:flex; justify-content:space-between; font:700 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.onNavyMute}; margin-bottom:auto; }
.mj-up { color:#22c55e; } .mj-up-dk { color:#16a34a; }
.mj-line { width:100%; height:150px; margin-top:24px; }
.mj-coral-card { background:${T.coral}; color:#fff; border-color:${T.coral}; display:flex; flex-direction:column; }
.mj-card-head-lite { font:700 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; opacity:.85; }
.mj-card-head-lite.mj-dk { color:${T.muted}; opacity:1; }
.mj-bignum { font:800 clamp(2.6rem,5vw,3.6rem)/1 'Sora',sans-serif; margin-top:14px; }
.mj-bignum.mj-dk { color:${T.ink}; }
.mj-bignum-l { font:600 .82rem/1.3 'DM Sans',sans-serif; opacity:.9; margin-top:6px; }
.mj-paper-card { background:${T.card}; }
.mj-prog-bars .mj-bars { display:flex; align-items:flex-end; gap:8px; height:90px; margin-top:16px; }
.mj-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%; justify-content:flex-end; }
.mj-bar { width:100%; background:${T.coral}; border-radius:5px 5px 0 0; min-height:5px; }
.mj-bar-col span { font:700 .6rem/1 'Space Grotesk',sans-serif; color:${T.muted}; }

/* test analysis */
.mj-ta-pill { display:inline-flex; align-items:center; gap:7px; padding:6px 14px; border-radius:50px; background:${T.coralSoft}; border:1px solid ${T.coral}; font:800 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:${T.coralDk}; }
.mj-ta-steps { display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:12px 8px; margin-bottom:44px; }
.mj-ta-step { display:inline-flex; align-items:center; gap:9px; }
.mj-ta-step:not(:last-child)::after { content:""; width:28px; height:2px; margin-left:8px; border-radius:2px; background:${T.lineDk}; transition:background .5s ease; }
.mj-ta-step-done:not(:last-child)::after { background:${T.coral}; }
.mj-ta-stepn { display:grid; place-items:center; width:26px; height:26px; border-radius:50%; background:${T.card}; border:1.5px solid ${T.lineDk}; font:800 .74rem/1 'Space Grotesk',sans-serif; color:${T.muted}; flex-shrink:0; transition:.3s; }
.mj-ta-step-on .mj-ta-stepn { background:${T.coral}; border-color:${T.coral}; color:#fff; box-shadow:0 0 0 5px ${T.coralSoft}; }
.mj-ta-step-done .mj-ta-stepn { background:${T.coral}; border-color:${T.coral}; color:#fff; }
.mj-ta-steptxt { font:700 .8rem/1.2 'Space Grotesk',sans-serif; color:${T.body}; white-space:nowrap; }
.mj-ta-step-off .mj-ta-steptxt { color:${T.muted}; }
.mj-ta-shot { border-radius:20px; overflow:hidden; border:1px solid ${T.line}; background:${T.card}; box-shadow:0 34px 74px -42px rgba(27,27,36,.4); }
.mj-ta-shot img { display:block; width:100%; height:auto; }
.mj-ta-topbar { display:flex; align-items:center; justify-content:space-between; gap:16px 24px; flex-wrap:wrap; margin-bottom:18px; padding:16px 22px; border-radius:16px; border:1px solid ${T.line}; background:linear-gradient(120deg, ${T.coralSoft}, ${T.card} 60%); box-shadow:0 16px 40px -34px rgba(0,0,0,.3); }
.mj-ta-topbar-l { display:flex; align-items:center; gap:12px; }
.mj-ta-topbar-badge { display:grid; place-items:center; width:36px; height:36px; flex-shrink:0; border-radius:10px; background:${T.coral}; color:#fff; }
.mj-ta-topbar-l strong { display:block; font:800 1rem/1.1 'Space Grotesk',sans-serif; color:${T.ink}; }
.mj-ta-topbar-l span { font:700 .64rem/1.3 'Space Grotesk',sans-serif; letter-spacing:.06em; color:${T.muted}; }
.mj-ta-topbar-r { display:flex; align-items:center; gap:26px; }
.mj-ta-topbar-r div { display:flex; flex-direction:column; }
.mj-ta-topbar-r strong { font:800 1.25rem/1 'Sora',sans-serif; color:${T.coralDk}; }
.mj-ta-topbar-r span { font:700 .58rem/1.2 'Space Grotesk',sans-serif; letter-spacing:.08em; text-transform:uppercase; color:${T.muted}; }
.mj-ta-grid { display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:stretch; }
.mj-ta-form { display:flex; flex-direction:column; justify-content:flex-start; height:100%; background:${T.card}; border:1px solid ${T.line}; border-radius:18px; padding:24px; box-shadow:0 20px 44px -34px rgba(0,0,0,.35); }
.mj-ta-formtop { display:flex; align-items:center; gap:12px; padding-bottom:16px; margin-bottom:18px; border-bottom:1px solid ${T.line}; }
.mj-ta-formbadge { display:grid; place-items:center; width:38px; height:38px; flex-shrink:0; border-radius:11px; background:${T.coralSoft}; color:${T.coralDk}; }
.mj-ta-formtop-tx { display:flex; flex-direction:column; gap:3px; margin-right:auto; }
.mj-ta-formtop-tx strong { font:800 1.05rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.mj-ta-formtop-tx span { font:600 .7rem/1.25 'DM Sans',sans-serif; color:${T.muted}; }
.mj-ta-formfoot { display:flex; align-items:center; gap:8px; margin-top:auto; padding-top:18px; font:600 .72rem/1.3 'DM Sans',sans-serif; color:${T.muted}; }
.mj-ta-formfoot svg { flex-shrink:0; color:${T.coralDk}; opacity:.85; }
.mj-ta-formhead { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
.mj-ta-formhead strong { font:800 1.05rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.mj-ta-tabs { display:inline-flex; gap:3px; padding:3px; border-radius:9px; background:${T.paper2}; }
.mj-ta-tabs i { font:700 .66rem/1 'Space Grotesk',sans-serif; font-style:normal; padding:5px 10px; border-radius:6px; color:${T.muted}; }
.mj-ta-tab-on { background:${T.card}; color:${T.coralDk} !important; box-shadow:0 1px 3px rgba(0,0,0,.12); }
.mj-ta-frow { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.mj-ta-frow-3 { grid-template-columns:repeat(3,1fr); }
.mj-ta-field { display:flex; flex-direction:column; gap:5px; margin-bottom:10px; }
.mj-ta-field span { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.04em; color:${T.muted}; }
.mj-ta-input { padding:8px 13px; border-radius:9px; border:1px solid ${T.line}; background:${T.paper}; font:600 .9rem/1 'DM Sans',sans-serif; color:${T.ink}; }
.mj-ta-input-ph { color:${T.muted}; font-weight:500; }
.mj-ta-input-sel { display:flex; align-items:center; justify-content:space-between; }
.mj-ta-input-sel::after { content:"▾"; color:${T.muted}; }
.mj-ta-btn { position:relative; overflow:hidden; width:100%; margin-top:14px; padding:13px; border:none; border-radius:11px; background:${T.coralSoft}; color:${T.coralDk}; font:800 .92rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:.3s; }
.mj-ta-btn-on { background:linear-gradient(135deg,#FF8A47,#F1531F); color:#fff; box-shadow:0 14px 30px -14px rgba(255,105,61,.7); }
.mj-ta-btn-on::after { content:""; position:absolute; top:0; left:-60%; width:45%; height:100%; background:linear-gradient(100deg, transparent, rgba(255,255,255,.45), transparent); transform:skewX(-18deg); animation:mjShimmer 1.5s infinite; }
@keyframes mjShimmer { 0%{ left:-60%; } 60%,100%{ left:120%; } }
.mj-ta-banner { display:flex; align-items:center; gap:9px; margin-top:16px; padding:13px 15px; border-radius:11px; background:#e9f8ee; border:1px solid #bbe6c8; font:600 .84rem/1.3 'DM Sans',sans-serif; color:#15803d; }
.mj-ta-banner svg { flex-shrink:0; }
.mj-ta-rank { margin-top:14px; padding:16px 18px; border-radius:13px; border:1px dashed ${T.lineDk}; background:${T.paper2}; }
.mj-ta-rank-l { display:block; font:800 .6rem/1.2 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.body}; }
.mj-ta-rank-sub { display:block; font:600 .64rem/1.2 'DM Sans',sans-serif; color:${T.muted}; margin-top:5px; }
.mj-ta-rank-row { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-top:12px; }
.mj-ta-rank-c { padding:11px 13px; border-radius:10px; background:${T.card}; border:1px solid ${T.line}; }
.mj-ta-rank-c strong { display:block; font:800 1.2rem/1 'Sora',sans-serif; color:${T.coralDk}; }
.mj-ta-rank-c span { font:600 .6rem/1.2 'DM Sans',sans-serif; color:${T.muted}; }
.mj-ta-rank-foot { display:block; font:500 .58rem/1.4 'DM Sans',sans-serif; color:${T.muted}; margin-top:12px; }
.mj-ta-subs { margin-top:14px; padding:15px 17px; border-radius:12px; background:${T.paper}; border:1px solid ${T.line}; }
.mj-ta-subs-l { font:800 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.13em; color:${T.muted}; }
.mj-ta-sub { display:grid; grid-template-columns:74px 1fr 40px; align-items:center; gap:10px; margin-top:11px; }
.mj-ta-sub > span { font:700 .74rem/1 'Space Grotesk',sans-serif; color:${T.body}; }
.mj-ta-sub b { font:800 .74rem/1 'Space Grotesk',sans-serif; color:${T.coralDk}; text-align:right; }
.mj-ta-subbar { height:7px; border-radius:5px; background:${T.paper2}; overflow:hidden; }
.mj-ta-subbar i { display:block; height:100%; border-radius:5px; background:linear-gradient(90deg,#FF8A47,#F1531F); }
.mj-ta-right { display:flex; flex-direction:column; gap:16px; }
.mj-ta-card-grow { flex:1; }
.mj-ta-card { background:${T.card}; border:1px solid ${T.line}; border-radius:16px; padding:20px 22px; box-shadow:0 16px 36px -30px rgba(0,0,0,.3); }
.mj-ta-cardhead { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.mj-ta-cardhead strong { font:800 .96rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.mj-ta-cardhead span { font:600 .68rem/1 'Space Grotesk',sans-serif; color:${T.muted}; }
.mj-ta-chart { width:100%; height:auto; display:block; }
.mj-ta-axtxt { font:700 8px/1 'Space Grotesk',sans-serif; fill:${T.muted}; }
.mj-ta-axcap { font:800 7px/1 'Space Grotesk',sans-serif; letter-spacing:.12em; fill:${T.muted}; opacity:.8; }
.mj-ta-wait { font:italic 600 11px/1 'DM Sans',sans-serif; fill:${T.muted}; }
.mj-ta-waiting { display:grid; place-items:center; height:88px; font:600 .82rem/1 'DM Sans',sans-serif; color:${T.muted}; }
.mj-ta-waiting-sm { height:70px;  }
.mj-ta-legend { display:flex; flex-wrap:wrap; gap:8px 16px; margin-top:12px; }
.mj-ta-legend span { display:inline-flex; align-items:center; gap:6px; font:600 .7rem/1 'DM Sans',sans-serif; color:${T.body}; }
.mj-ta-legend i { width:14px; height:3px; border-radius:2px; }
.mj-ta-strat { display:flex; flex-direction:column; gap:12px; }
.mj-ta-strat-i { display:flex; align-items:flex-start; gap:11px; font:500 .84rem/1.4 'DM Sans',sans-serif; color:${T.body}; }
.mj-ta-strat-ic { display:grid; place-items:center; width:26px; height:26px; border-radius:8px; background:${T.coralSoft}; color:${T.coralDk}; flex-shrink:0; }

/* live tracking — light coded dashboard */
.mj-dash { border-radius:22px; overflow:hidden; border:1px solid ${T.lineDk}; background:${T.card}; box-shadow:0 40px 80px -50px rgba(0,0,0,.4); }
.mj-dash-bar { display:flex; align-items:center; gap:14px; padding:13px 20px; background:${T.ink}; }
.mj-traffic { display:flex; gap:6px; } .mj-traffic i { width:11px; height:11px; border-radius:50%; background:#3a3f4d; } .mj-traffic i:first-child{background:#ff5f57;} .mj-traffic i:nth-child(2){background:#febc2e;} .mj-traffic i:nth-child(3){background:#28c840;}
.mj-dash-title { font:700 .72rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:rgba(255,255,255,.72); }
.mj-dash-stream { margin-left:auto; display:inline-flex; align-items:center; gap:6px; font:700 .68rem/1 'Space Grotesk',sans-serif; color:#4ade80; }
.mj-dash-body { display:grid; grid-template-columns:1.55fr 1fr; }
.mj-dash-main { padding:26px 28px; border-right:1px solid ${T.line}; }
.mj-dash-idrow { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:22px; }
.mj-dash-kicker { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.muted}; }
.mj-dash-name { font:800 1.9rem/1.05 'Sora',sans-serif; color:${T.ink}; margin:8px 0 6px; }
.mj-dash-mentor { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:${T.muted}; }
.mj-dash-active { display:inline-flex; align-items:center; gap:7px; padding:7px 13px; border-radius:50px; background:#e9f8ee; border:1px solid #bbe6c8; font:800 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:#15803d; white-space:nowrap; }
.mj-dash-lbl { display:block; font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.muted}; margin-bottom:14px; }
.mj-dash-lbl-sp { margin-top:24px; }
.mj-dash-panel { padding:18px 18px 16px; margin-bottom:16px; border-radius:16px; background:${T.paper}; border:1px solid ${T.line}; }
.mj-dash-panelhead { display:flex; align-items:center; justify-content:space-between; }
.mj-dash-up { font:800 .66rem/1 'Space Grotesk',sans-serif; color:#16a34a; }
.mj-dl { width:100%; height:96px; display:block; overflow:visible; }
.mj-dash-two { display:grid; grid-template-columns:1.5fr 1fr; gap:16px; margin-bottom:16px; }
.mj-dash-two .mj-dash-panel { margin-bottom:0; }
.mj-dash-chart { display:flex; align-items:flex-end; gap:10px; height:132px; }
.mj-dash-barcol { flex:1; display:flex; flex-direction:column; align-items:center; height:100%; }
.mj-dash-barval { font:800 .64rem/1 'Space Grotesk',sans-serif; color:${T.body}; margin-bottom:6px; }
.mj-dash-bartrack { flex:1; width:100%; display:flex; align-items:flex-end; border-radius:7px; background:${T.paper2}; }
.mj-dash-barfill { width:100%; min-height:6px; border-radius:7px; background:linear-gradient(180deg, #FF8A47, #F1531F); box-shadow:0 6px 14px -6px rgba(255,105,61,.7); }
.mj-dash-barday { font:700 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; color:${T.muted}; margin-top:8px; }
.mj-dash-ringpanel { display:flex; flex-direction:column; }
.mj-dring { position:relative; flex:1; display:grid; place-items:center; }
.mj-dring svg { width:118px; height:118px; }
.mj-dring-c { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.mj-dring-c strong { font:800 1.7rem/1 'Sora',sans-serif; color:${T.ink}; }
.mj-dring-c span { font:700 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.muted}; margin-top:3px; text-transform:uppercase; }
.mj-dash-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.mj-dash-stat { padding:16px 18px; border-radius:14px; background:${T.paper2}; border:1px solid ${T.line}; }
.mj-dash-stat-l { font:700 .6rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:${T.muted}; }
.mj-dash-stat-v { display:block; font:800 2rem/1 'Sora',sans-serif; color:${T.ink}; margin-top:8px; }
.mj-dash-feed { padding:26px 24px; }
.mj-dash-feedlist { display:flex; flex-direction:column; }
.mj-dash-feeditem { display:grid; grid-template-columns:auto auto 1fr; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid ${T.line}; }
.mj-dash-feeditem:last-child { border-bottom:none; }
.mj-dash-feedtime { font:700 .7rem/1 'Space Grotesk',sans-serif; color:${T.muted}; }
.mj-dash-feedtag { padding:3px 8px; border:1px solid; border-radius:5px; font:800 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; }
.mj-dash-feedtext { font:500 .86rem/1.3 'DM Sans',sans-serif; color:${T.body}; }
.mj-dash-subs { display:flex; flex-direction:column; gap:14px; }
.mj-dash-sub-top { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:6px; font:600 .82rem/1 'DM Sans',sans-serif; color:${T.body}; }
.mj-dash-sub-top strong { font:800 .82rem/1 'Space Grotesk',sans-serif; color:${T.coralDk}; }
.mj-dash-sub-track { height:8px; border-radius:6px; background:${T.paper2}; overflow:hidden; }
.mj-dash-sub-fill { height:100%; border-radius:6px; background:linear-gradient(90deg, #FF8A47, #F1531F); }
.mj-dash-fix { display:flex; flex-direction:column; gap:10px; }
.mj-dash-fixitem { display:flex; align-items:flex-start; gap:10px; }
.mj-dash-fixcheck { display:grid; place-items:center; width:20px; height:20px; border-radius:6px; background:${T.coralSoft}; color:${T.coralDk}; flex-shrink:0; margin-top:1px; }
.mj-dash-fixtext { font:500 .84rem/1.4 'DM Sans',sans-serif; color:${T.body}; }
.mj-dash-next { display:flex; flex-direction:column; gap:4px; margin-top:20px; padding:16px 18px; border-radius:14px; background:${T.ink}; color:#fff; }
.mj-dash-next-l { display:inline-flex; align-items:center; gap:6px; font:800 .6rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:${T.coral}; }
.mj-dash-next strong { font:700 1.15rem/1.1 'Sora',sans-serif; color:#fff; margin-top:4px; }
.mj-dash-next-s { font:500 .78rem/1.3 'DM Sans',sans-serif; color:rgba(255,255,255,.72); }

/* for parents */
.mj-parent-card { display:grid; grid-template-columns:.92fr 1.08fr; align-items:stretch; border-radius:20px; overflow:hidden; border:1px solid ${T.lineDk};
  box-shadow:0 40px 70px -40px rgba(0,0,0,.32); transition:transform .3s, box-shadow .3s; }
.mj-parent-card:hover { transform:translateY(-3px); box-shadow:0 46px 76px -44px rgba(0,0,0,.38); }
.mj-booklet { display:flex; flex-direction:column; padding:36px 34px; color:#fff;
  background:linear-gradient(160deg, #FF7A3C 0%, #F1531F 60%, #E0481B 100%); position:relative; overflow:hidden; }
.mj-booklet::before { content:""; position:absolute; inset:0; background:
  repeating-linear-gradient(0deg, transparent 0 33px, rgba(255,255,255,.07) 33px 34px),
  repeating-linear-gradient(90deg, transparent 0 33px, rgba(255,255,255,.07) 33px 34px); pointer-events:none; }
.mj-booklet > * { position:relative; }
.mj-booklet-pill { align-self:flex-start; display:inline-flex; align-items:center; gap:7px; padding:7px 14px; border-radius:50px; background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.25); font:800 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; }
.mj-booklet-h { font:800 2.1rem/1.08 'Sora',sans-serif; letter-spacing:-.5px; margin:20px 0 0; color:#fff; }
.mj-booklet-sub { font:400 .98rem/1.55 'DM Sans',sans-serif; color:rgba(255,255,255,.9); margin:14px 0 0; max-width:400px; }
.mj-booklet-div { height:1px; background:rgba(255,255,255,.22); margin:24px 0 22px; }
.mj-booklet-lbl { font:800 .6rem/1 'Space Grotesk',sans-serif; letter-spacing:.16em; color:rgba(255,255,255,.7); }
.mj-booklet-lbl2 { margin-top:22px; }
.mj-booklet-name { display:block; font:800 1.35rem/1.1 'Sora',sans-serif; color:#fff; margin:8px 0 4px; }
.mj-booklet-meta { font:600 .8rem/1.3 'DM Sans',sans-serif; color:rgba(255,255,255,.82); }
.mj-booklet-list { list-style:none; margin:14px 0 0; padding:0; display:flex; flex-direction:column; gap:12px; }
.mj-booklet-list li { display:flex; align-items:center; gap:11px; font:600 .96rem/1.3 'DM Sans',sans-serif; color:#fff; }
.mj-booklet-list svg { flex-shrink:0; opacity:.9; }
.mj-booklet-btn { margin-top:auto; align-self:flex-start; display:inline-flex; align-items:center; gap:9px; margin-top:28px; padding:13px 22px; border:none; border-radius:12px; background:#fff; color:${T.coralDk}; font:800 .92rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:transform .16s, box-shadow .16s; box-shadow:0 12px 26px -14px rgba(0,0,0,.4); }
.mj-booklet-btn:hover { transform:translateY(-2px); box-shadow:0 18px 34px -16px rgba(0,0,0,.5); }
.mj-weekly-next { margin-top:22px; padding-top:18px; border-top:1px solid ${T.line}; }
.mj-weekly-nextlist { list-style:none; margin:12px 0 0; padding:0; display:flex; flex-direction:column; gap:10px; }
.mj-weekly-nextlist li { display:flex; align-items:flex-start; gap:9px; font:500 .84rem/1.4 'DM Sans',sans-serif; color:${T.body}; }
.mj-weekly-nextlist svg { flex-shrink:0; margin-top:2px; color:${T.coral}; }
.mj-weekly { position:relative; display:flex; flex-direction:column; background:#FBF8F2; padding:34px 36px; }
.mj-weekly-top { display:flex; align-items:baseline; justify-content:space-between; gap:14px; border-bottom:1.5px solid ${T.ink}; padding-bottom:14px; }
.mj-weekly-name { font:600 1.9rem/1 'Sora',sans-serif;  color:${T.ink}; letter-spacing:-.5px; }
.mj-weekly-vol { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.18em; color:${T.body}; text-align:right; white-space:nowrap; }
.mj-weekly-body { display:grid; grid-template-columns:1.32fr 1fr; gap:28px; margin-top:24px; }
.mj-weekly-featured { border-right:1px solid ${T.line}; padding-right:26px; }
.mj-featured-lbl { font:800 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.18em; color:${T.coral}; }
.mj-glance-lbl { display:block; margin-bottom:12px; font:800 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.18em; color:${T.ink}; }
.mj-featured-quote { font:700 1.6rem/1.16 'Sora',sans-serif; color:${T.ink}; margin:13px 0 14px; letter-spacing:-.4px; }
.mj-featured-body { font:400 .92rem/1.6 'DM Sans',sans-serif; color:#5c6773; margin:0 0 18px; }
.mj-weekly-photo { position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; min-height:180px; border-radius:10px; border:1px solid ${T.lineDk};
  background:repeating-linear-gradient(45deg, transparent 0 9px, rgba(27,27,36,.09) 9px 10px), ${T.paper2}; }
.mj-photo-ic { display:grid; place-items:center; width:36px; height:36px; border-radius:50%; background:${T.card}; color:${T.coral}; box-shadow:0 4px 10px -4px rgba(0,0,0,.25); margin-bottom:4px; }
.mj-photo-t { font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.16em; color:${T.body}; }
.mj-photo-s { font:700 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.16em; color:${T.muted}; }
.mj-glance-row { display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:12px 0; border-bottom:1px solid ${T.line}; font:500 .82rem/1.3 'DM Sans',sans-serif; color:${T.body}; }
.mj-glance-row span { flex-shrink:0; }
.mj-glance-row strong { font:600 .98rem/1.25 'Sora',sans-serif; color:${T.ink}; text-align:right; }
.mj-weekly-foot { display:flex; justify-content:space-between; margin-top:auto; padding-top:18px; border-top:1px solid ${T.line}; font:700 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.muted}; }

/* whatsapp — animated phones */
.mj-phones { display:flex; gap:22px; justify-content:center; overflow-x:auto; padding:8px 4px 16px; scroll-snap-type:x mandatory; scrollbar-width:none; }
.mj-phones::-webkit-scrollbar { display:none; }
.mj-phonewrap { flex:0 0 auto; scroll-snap-align:center; display:flex; flex-direction:column; align-items:center; gap:18px; }
.mj-phone { position:relative; width:264px; height:548px; background:#0b0d12; border-radius:44px; padding:9px; box-shadow:0 0 0 2px #20232b, 0 34px 60px -28px rgba(0,0,0,.6), 0 12px 26px -16px rgba(0,0,0,.4); }
.mj-phone::before { content:""; position:absolute; left:-3px; top:120px; width:3px; height:56px; background:#191c22; border-radius:3px 0 0 3px; box-shadow:0 74px 0 #191c22; }
.mj-phone::after { content:""; position:absolute; right:-3px; top:156px; width:3px; height:86px; background:#191c22; border-radius:0 3px 3px 0; }
.mj-phone-island { position:absolute; top:19px; left:50%; transform:translateX(-50%); width:84px; height:25px; background:#000; border-radius:14px; z-index:7; }
.mj-phone-screen { position:relative; height:100%; border-radius:35px; overflow:hidden; background:#F6F3EF; display:flex; flex-direction:column; }
.mj-phone-cap { font:italic 600 1rem/1 'Sora',sans-serif; color:${T.body}; }

.mj-wa-header { background:linear-gradient(145deg,#FF8B48 0%,#FA5E28 55%,#EF5320 100%); color:#fff; padding-top:8px; box-shadow:0 6px 16px -10px rgba(0,0,0,.5); z-index:3; }
.mj-wa-head { display:flex; align-items:center; justify-content:space-between; padding:2px 20px 3px; }
.mj-wa-status { font:800 .72rem/1 'Space Grotesk',sans-serif; }
.mj-wa-bars { display:flex; align-items:flex-end; gap:3px; }
.mj-wa-bars i { width:3px; background:#fff; border-radius:1px; } .mj-wa-bars i:nth-child(1){height:5px;} .mj-wa-bars i:nth-child(2){height:8px;} .mj-wa-bars i:nth-child(3){height:11px;}
.mj-wa-top { display:flex; align-items:center; gap:9px; padding:6px 14px 12px; }
.mj-wa-av { position:relative; display:grid; place-items:center; width:38px; height:38px; border-radius:50%; background:#fff; color:${T.coralDk}; flex-shrink:0; }
.mj-wa-cp { font:800 15px/1 'Space Grotesk',sans-serif; letter-spacing:-.5px; color:${T.coralDk}; }
.mj-wa-online { position:absolute; right:-1px; bottom:-1px; width:11px; height:11px; border-radius:50%; background:#25D366; border:2px solid #fff; }
.mj-wa-id { flex:1; min-width:0; display:flex; flex-direction:column; gap:1px; }
.mj-wa-id strong { font:700 .92rem/1.15 'DM Sans',sans-serif; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mj-wa-spark { font-size:.78rem; }
.mj-wa-id span { font:500 .66rem/1 'DM Sans',sans-serif; color:rgba(255,255,255,.9); }
.mj-wa-ic { color:#fff; flex-shrink:0; opacity:.95; }

.mj-wa-body { flex:1; overflow:hidden; padding:12px 10px 6px; display:flex; flex-direction:column; align-items:stretch;
  background:#F6F3EF radial-gradient(rgba(0,0,0,.05) 1px, transparent 1px); background-size:16px 16px; }
.mj-wa-day { align-self:center; margin-bottom:10px; padding:4px 12px; border-radius:8px; background:#fff; border:1px solid ${T.line}; font:600 .64rem/1 'DM Sans',sans-serif; color:${T.muted}; box-shadow:0 1px 2px rgba(0,0,0,.05); }
.mj-wa-row { display:flex; margin-bottom:7px; animation:mjPop .32s cubic-bezier(.2,.8,.3,1.1) both; }
.mj-wa-me { justify-content:flex-end; }
@keyframes mjPop { from { opacity:0; transform:translateY(8px) scale(.96); } to { opacity:1; transform:none; } }
.mj-wa-msg { max-width:80%; padding:7px 10px 5px; border-radius:14px; background:#fff; color:#1f2733; box-shadow:0 1px 1.5px rgba(0,0,0,.12); border-top-left-radius:4px; }
.mj-wa-msg-me { background:linear-gradient(135deg,#FF8B48,#F1531F); color:#fff; border-top-left-radius:14px; border-top-right-radius:4px; box-shadow:0 2px 6px -2px rgba(241,83,31,.5); }
.mj-wa-msg p { margin:0; font:500 .78rem/1.34 'DM Sans',sans-serif; white-space:pre-line; word-break:break-word; }
.mj-wa-time { display:flex; align-items:center; justify-content:flex-end; gap:3px; margin-top:2px; font:500 .58rem/1 'DM Sans',sans-serif; color:${T.muted}; }
.mj-wa-msg-me .mj-wa-time { color:rgba(255,255,255,.85); }
.mj-ticks { width:14px; height:9px; flex-shrink:0; }
.mj-wa-typing { display:flex; gap:4px; padding:11px 12px; border-top-left-radius:4px; }
.mj-wa-typing i { width:6px; height:6px; border-radius:50%; background:${T.muted}; animation:mjType 1s infinite ease-in-out; }
.mj-wa-typing i:nth-child(2){ animation-delay:.15s; } .mj-wa-typing i:nth-child(3){ animation-delay:.3s; }
@keyframes mjType { 0%,60%,100%{ transform:translateY(0); opacity:.5; } 30%{ transform:translateY(-4px); opacity:1; } }

.mj-wa-input { display:flex; align-items:center; gap:9px; padding:9px 12px 15px; background:#F6F3EF; color:${T.muted}; }
.mj-wa-field { flex:1; display:flex; align-items:center; gap:7px; padding:7px 10px; border-radius:18px; background:#fff; border:1px solid ${T.line}; font:500 .72rem/1 'DM Sans',sans-serif; color:${T.muted}; }
.mj-wa-field span { flex:1; }
.mj-wa-mic { display:grid; place-items:center; width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#FF8B48,#F1531F); color:#fff; flex-shrink:0; }

/* proof — static bento wall */
.mj-proof-top { display:flex; flex-direction:column; align-items:center; text-align:center; gap:20px; margin-bottom:44px; }
.mj-proof-intro { max-width:640px; }
.mj-proof-intro h2 { margin:0; }
.mj-proof-intro .mj-sec-sub { margin:14px 0 0; text-align:center; }
.mj-proof-kpis { display:flex; justify-content:center; align-items:center; gap:16px 30px; flex-wrap:wrap; margin-top:8px; }
.mj-kpi { display:flex; flex-direction:column; gap:5px; }
.mj-kpi-stars { display:flex; gap:2px; }
.mj-kpi strong { font:800 1.4rem/1 'Sora',sans-serif; color:${T.coral}; }
.mj-kpi span { font:700 .66rem/1.3 'Space Grotesk',sans-serif; letter-spacing:.06em; color:${T.muted}; text-transform:uppercase; }
.mj-quote-mark { font:800 2.6rem/.5 'Sora',sans-serif; color:${T.coral}; }

.mj-bento { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.mj-bento-card { position:relative; display:flex; flex-direction:column; padding:26px; border-radius:20px; border:1px solid ${T.line}; background:${T.card}; box-shadow:0 12px 30px -16px rgba(0,0,0,.15); transition:transform .2s, box-shadow .2s; }
.mj-bento-card:hover { transform:translateY(-3px); box-shadow:0 18px 40px -20px rgba(0,0,0,.2); border-color:#FFB59A; }
.mj-bento-by { display:flex; align-items:center; gap:11px; margin-top:auto; padding-top:20px; }
.mj-quote-av { display:grid; place-items:center; width:38px; height:38px; border-radius:50%; background:${T.coralSoft}; color:${T.coralDk}; font:800 .92rem/1 'Space Grotesk',sans-serif; flex-shrink:0; }
.mj-bento-by strong { display:block; font:700 .9rem/1.2 'Space Grotesk',sans-serif; color:${T.ink}; }
.mj-bento-by span { font:600 .74rem/1.2 'DM Sans',sans-serif; color:${T.coralDk}; }
.mj-bento-q2 { font:500 1rem/1.55 'DM Sans',sans-serif; color:${T.ink}; margin:10px 0 0; }

.mj-bento-stat { justify-content:center; background:${T.coralSoft}; border-color:#F6D8CC; }
.mj-bento-stat strong { font:800 2.6rem/1 'Sora',sans-serif; color:${T.coralDk}; }
.mj-bento-stat span { font:700 .8rem/1.35 'Space Grotesk',sans-serif; color:${T.body}; margin-top:6px; }

.mj-proof-verified { display:flex; align-items:center; gap:9px; padding-top:18px; font:600 .82rem/1.4 'DM Sans',sans-serif; color:${T.body}; }
.mj-proof-verified-c { justify-content:center; padding-top:0; margin-top:26px; }
.mj-proof-vic { display:grid; place-items:center; width:20px; height:20px; border-radius:50%; background:${T.coral}; color:#fff; flex-shrink:0; }

/* pricing */
.mj-price-card { display:grid; grid-template-columns:.85fr 1.15fr; margin:44px auto 0; max-width:960px; border-radius:22px; overflow:hidden; border:1px solid ${T.line}; box-shadow:0 40px 80px -50px rgba(0,0,0,.4); }
.mj-price-left { background:${T.coral}; color:#fff; padding:36px 30px; display:flex; flex-direction:column; }
.mj-price-kicker { font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; opacity:.9; }
.mj-price-plan { font:800 1.6rem/1.1 'Sora',sans-serif; margin-top:8px; }
.mj-price-amt { font:800 3.6rem/1 'Sora',sans-serif; margin-top:auto; }
.mj-price-old { font:600 1rem/1 'Space Grotesk',sans-serif; text-decoration:line-through; opacity:.75; margin-top:4px; }
.mj-price-terms { font:700 .66rem/1.3 'Space Grotesk',sans-serif; letter-spacing:.08em; opacity:.9; margin-top:12px; text-transform:uppercase; }
.mj-price-seats { align-self:flex-start; margin-top:20px; padding:8px 14px; border-radius:50px; background:rgba(0,0,0,.18); font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; }
.mj-price-right { background:${T.card}; padding:36px 32px; }
.mj-inc-lbl { font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.muted}; }
.mj-inc-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px 20px; margin:20px 0 8px; }
.mj-inc-item { display:flex; align-items:flex-start; gap:8px; font:500 .9rem/1.4 'DM Sans',sans-serif; color:${T.ink}; }
.mj-inc-item svg { flex-shrink:0; margin-top:2px; }
.mj-price-foot { display:flex; justify-content:space-between; margin-top:16px; font:700 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; color:${T.muted}; }

/* faq */
.mj-faq-head { display:flex; flex-direction:column; align-items:center; text-align:center; gap:14px; margin-bottom:36px; }
.mj-faq-pill { display:inline-flex; align-items:center; gap:7px; padding:7px 15px; border-radius:50px; background:${T.coralSoft}; color:${T.coralDk}; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; }
.mj-faq-pill svg { flex-shrink:0; }
.mj-faq-h { margin:0; }
.mj-faq-head .mj-sec-sub { margin:0; }
.mj-faqs { display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:start; max-width:1000px; margin:0 auto; }
.mj-faq { background:${T.card}; border:1px solid ${T.line}; border-radius:16px; box-shadow:0 10px 30px -24px rgba(0,0,0,.32); overflow:hidden; transition:border-color .2s, box-shadow .2s; }
.mj-faq-open { border-color:#F6C6B6; box-shadow:0 16px 36px -22px rgba(255,105,61,.42); }
.mj-faq-q { display:flex; align-items:center; justify-content:space-between; gap:16px; width:100%; padding:19px 22px; background:none; border:none; cursor:pointer; text-align:left; }
.mj-faq-qt { flex:1; font:700 1.02rem/1.35 'Sora',sans-serif; color:${T.ink}; }
.mj-faq-ic { display:grid; place-items:center; width:30px; height:30px; border-radius:50%; background:${T.coralSoft}; color:${T.coralDk}; transition:.2s; flex-shrink:0; }
.mj-faq-open .mj-faq-ic { background:${T.coral}; color:#fff; }
.mj-faq-a { overflow:hidden; }
.mj-faq-a p { font:400 .96rem/1.7 'DM Sans',sans-serif; color:${T.body}; padding:0 22px 20px; margin:0; }

/* talk */
.mj-talk-booklet { display:flex; flex-direction:column; padding:44px 44px 44px 54px; color:#fff; background:linear-gradient(160deg, #FF7A3C 0%, #F1531F 60%, #E0481B 100%); position:relative; overflow:hidden; }
.mj-talk-booklet::before { content:""; position:absolute; inset:0; background:repeating-linear-gradient(0deg, transparent 0 33px, rgba(255,255,255,.07) 33px 34px),repeating-linear-gradient(90deg, transparent 0 33px, rgba(255,255,255,.07) 33px 34px); pointer-events:none; }
.mj-talk-booklet > * { position:relative; }
.mj-talk-booklet .mj-display { color:#fff; margin-bottom: 24px; }
.mj-talk-booklet .mj-display em { color:rgba(255,255,255,.9);  }
.mj-talk-booklet .mj-body { color:rgba(255,255,255,.9); margin-bottom:44px; max-width: 420px; font-size:1.05rem; line-height:1.6; }
.mj-talk-booklet .mj-reach { margin-top:auto; display:flex; flex-direction:column; gap:10px; font:700 .74rem/1.4 'Space Grotesk',sans-serif; letter-spacing:.08em; color:rgba(255,255,255,.75); }

.mj-talk-form-wrap { background:#FBF8F2; padding:44px 54px; display:flex; flex-direction:column; justify-content:center; }
.mj-form-row { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.mj-field { display:flex; flex-direction:column; gap:6px; margin-bottom:24px; }
.mj-field span { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; text-transform:uppercase; color:${T.muted}; }
.mj-field input, .mj-field textarea { border:none; border-bottom:1.5px solid ${T.line}; background:none; padding:8px 2px; font:500 1rem/1.4 'DM Sans',sans-serif; color:${T.ink}; outline:none; resize:vertical; transition:border-color .16s; }
.mj-field input:focus, .mj-field textarea:focus { border-color:${T.coral}; }

/* responsive */
@media (max-width:940px) {
  .mj-parent-card, .mj-talk-grid, .mj-price-card, .mj-dash-body, .mj-weekly-body, .mj-ta-grid, .mj-faqs { grid-template-columns:1fr; }
  .mj-bento { grid-template-columns:1fr; } .mj-bento-feat { grid-column:auto; }
  .mj-proof-top { align-items:flex-start; }
  .mj-ta-form { position:static; top:auto; }
  .mj-ta-step:not(:last-child)::after { display:none; }
  .mj-hero-live { display:none; }
  .mj-hero-cards { grid-template-columns:1fr; max-width:420px; margin-left:auto; margin-right:auto; }
  .mj-gem { width:260px; height:260px; }
  .mj-sec-head, .mj-dark-head { flex-direction:column; align-items:center; }
  .mj-prog-grid { grid-template-columns:1fr 1fr; } .mj-navy-card { grid-row:auto; grid-column:span 2; }
  .mj-phones { justify-content:flex-start; }
  .mj-dash-main { border-right:none; border-bottom:1px solid #262b38; }
}
@media (max-width:560px) {
  .mj-stat-row { grid-template-columns:1fr 1fr; } .mj-stat { border-left:none; padding-left:0; }
  .mj-prog-grid, .mj-form-row, .mj-inc-grid { grid-template-columns:1fr; } .mj-navy-card { grid-column:auto; }
  .mj-phones { gap:16px; }
  .mj-weekly-featured { border-right:none; padding-right:0; }
  .mj-vstep { grid-template-columns:48px 1fr; gap:16px; } .mj-vstep-mark { width:48px; height:48px; } .mj-vsteps-rail { left:23px; }
  .mj-dash-two { grid-template-columns:1fr; }
  .mj-dash-chart { gap:6px; } .mj-dash-barval { font-size:.56rem; }
  .mj-check-right { align-self:stretch; }
  .mj-watermark { font-size:64vw; }
}
`;
