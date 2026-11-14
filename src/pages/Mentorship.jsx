/* Mentorship - the "CampusPoint Mentorship Journal".
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
import { MENTORSHIP, MENTOR_PLANS, SEATS_LIMIT } from "../data/mentorship.js";
import { useEnrol } from "../components/EnrolModal.jsx";
import Seo from "../components/Seo.jsx";
import imgSaneh from "../images/team/saneh.jpg";
import imgSaket from "../images/team/saket.jpg";
import imgMayank from "../images/team/mayank.jpg";

const WA_NUMBER = "918118826194";

/* ── warm paper / coral / navy theme ── */
const T = {
  paper: "#FFFFFF", paper2: "#FFFFFF", card: "#FFFFFF",
  ink: "#1B1B24", body: "#54525C", muted: "#8C877E",
  line: "#E2E8F0", lineDk: "#CBD5E1",
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

/**
 * Line 1 helper with stylish theme squiggly underline under the keyword.
 */
function RenderLine1({ text, squiggleWord }) {
  if (!squiggleWord || !text.includes(squiggleWord)) {
    return <span className="mj-hero-line1-text">{text}</span>;
  }
  const parts = text.split(squiggleWord);
  return (
    <span className="mj-hero-line1-text">
      {parts[0]}
      <span className="mj-hero-squiggle-wrap">
        {squiggleWord}
        <svg className="mj-hero-squiggle" viewBox="0 0 160 14" fill="none" aria-hidden="true">
          <path
            d="M3 9C20 2 36 14 54 8C72 2 88 14 106 8C124 2 140 14 157 8"
            stroke="#FF693D"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {parts.slice(1).join(squiggleWord)}
    </span>
  );
}

const HERO_VARIANTS_CONTENT = {
  "jee-2027": {
    word1: "Personalized",
    word2: "1-on-1",
    line2Lead: "for your",
    line2Box: "JEE 2027.",
    subtitle: "Direct daily guidance from verified IIT Roorkee rankers to manage study schedules, clear backlogs, and secure top ranks.",
    waQuery: "Hi CampusPoint, I want to know more about JEE 2027 mentorship",
    waLabel: "Have questions? Chat with an IITian Mentor on WhatsApp",
  },
  "jee-2028": {
    word1: "Personalized",
    word2: "1-on-1",
    line2Lead: "for your",
    line2Box: "JEE 2028.",
    subtitle: "Build a rock-solid Class 11 foundation, eliminate backlogs early, and learn 1-on-1 with IIT Roorkee rankers.",
    waQuery: "Hi CampusPoint, I want to know more about JEE 2028 mentorship",
    waLabel: "Have questions? Chat with an IITian Mentor on WhatsApp",
  },
  "neet": {
    word1: "Personalized",
    word2: "1-on-1",
    line2Lead: "for your",
    line2Box: "NEET 2027.",
    subtitle: "Daily NCERT targets, question-level error autopsy, and personal mentorship by top medical college MBBS toppers.",
    waQuery: "Hi CampusPoint, I want to know more about NEET mentorship",
    waLabel: "Have questions? Chat with a Doctor / Topper on WhatsApp",
  },
  "foundation": {
    word1: "Personalized",
    word2: "1-on-1",
    line2Lead: "for your",
    line2Box: "Foundation.",
    subtitle: "Build early conceptual clarity for Olympiads, NTSE, and strong fundamentals guided 1-on-1 by IITians.",
    waQuery: "Hi CampusPoint, I want to know more about Foundation mentorship",
    waLabel: "Have questions? Chat with an IITian Mentor on WhatsApp",
  },
};

/* ═══════════════ HERO - 2-Column Editorial Hub Hero ═══════════════ */
function Hero({ variant, cfg, plan, year, exam, openEnrol, scrollTo }) {
  const p = MENTOR_PLANS[plan] || { amount: 3499, exam: "JEE" };
  const isNeet = variant === "neet" || p.exam === "NEET";
  const content = HERO_VARIANTS_CONTENT[variant] || {
    line1: "Personalized 1-on-1",
    line1Squiggle: "1-on-1",
    line2Lead: "for your",
    line2Box: `${exam || "JEE Mentorship"}.`,
    subtitle: cfg?.subtitle || "Direct daily guidance from verified IIT Roorkee rankers to manage study schedules, clear backlogs, and secure top ranks.",
    waQuery: `Hi CampusPoint, I want to know more about ${exam || "JEE"} mentorship`,
    waLabel: isNeet
      ? "Have questions? Chat with a Doctor / Topper on WhatsApp"
      : "Have questions? Chat with an IITian Mentor on WhatsApp",
  };

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(content.waQuery)}`;

  return (
    <section className="mj-hero-seo">
      <div className="mj-hero-bg" aria-hidden="true">
        <span className="mj-orb mj-orb-a" />
        <span className="mj-orb mj-orb-b" />
      </div>

      <div className="mj-wrap">
        <div className="mj-hero-seo-grid">
          {/* Left Column: Variant Tabs + Two Strong Lines + Subtitle + Actions */}
          <div className="mj-hero-copy-col">

            <h1 className="mj-hero-h1">
              <span className="mj-hero-line1">
                <span className="mj-hero-word-break">{content.word1 || "Personalized"}</span>
                <span className="mj-hero-squiggle-wrap">
                  {content.word2 || "1-on-1"}
                  <svg className="mj-hero-squiggle" viewBox="0 0 160 14" fill="none" aria-hidden="true">
                    <path
                      d="M3 9C20 2 36 14 54 8C72 2 88 14 106 8C124 2 140 14 157 8"
                      stroke="#FF693D"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
              <span className="mj-hero-line2">
                <span className="mj-hero-line2-lead">{content.line2Lead || "for your"}</span>
                <span className="mj-hero-box-pill">{content.line2Box}</span>
              </span>
            </h1>

            <p className="mj-hero-sub">
              {content.subtitle}
            </p>

            <div className="mj-hero-editorial-actions">
              <button
                type="button"
                className="mj-hero-btn-primary"
                onClick={() => scrollTo("mentors")}
              >
                Meet Your Mentors <ArrowRight size={17} />
              </button>
              <button
                type="button"
                className="mj-hero-btn-secondary"
                onClick={() => scrollTo("enrol")}
              >
                Explore Plans <ArrowRight size={17} />
              </button>
            </div>

            <div className="mj-hero-wa-hint">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone size={14} /> {content.waLabel}
              </a>
            </div>
          </div>

          {/* Right Column: Hero Illustration Desk Visual */}
          <div className="mj-hero-illustration-col">
            <div className="mj-hero-illustration-wrapper">
              <picture>
                <source srcSet="/images/mentorship_hero_desk_transparent.webp" type="image/webp" />
                <img
                  src="/images/mentorship_hero_desk.jpg"
                  alt="1-on-1 IITian Mentorship Desk Setup with Daily Targets and Test Autopsy"
                  className="mj-hero-illustration-img"
                  width="580"
                  height="450"
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            </div>
          </div>
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
    name: "Ankit Kumar",
    role: "Founder & CEO, IIT Roorkee (AIR 3846 CRL, 938 OBC)",
    img: "/assets/team/ankit.webp",
    thought: "Every aspirant hits a wall where effort stops working. Our goal is to break that wall by showing you the strategic blindspots you can't see yourself. Having navigated this journey to secure AIR 3846, I know exactly where students lose their confidence and how to rebuild it. I believe that JEE preparation is not just about the number of hours you put in, but how effectively you utilize that time. Through our personalized mentorship, we aim to transform your struggles into strengths, providing you with the very tools and mindsets that helped us conquer one of the toughest exams in the world. Your success is our mission, and we are here to guide you every step of the way."
  },
  {
    name: "Saket Kumar",
    role: "Operations Head, IIT Roorkee",
    img: imgSaket,
    thought: "Execution turns plans into reality. Through strategic operations, we ensure every student gets the precise mentorship needed to overcome obstacles."
  },
  {
    name: "Mayank Singh",
    role: "Marketing Head, IIT Roorkee",
    img: imgMayank,
    thought: "Mentorship isn't about giving you more material; it's about giving you the exact right direction so your hard work actually translates into rank. We've built this system from our own experiences of cracking IIT, focusing purely on high-yield output rather than just mindless hard work."
  }
];

/* ═══════════════ QUALIFIER - "is this you?" ═══════════════ */
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
          <div>            <h2 className="mj-display mj-display-lg">A calm, connected system -<br /><em>Day 1 to Rank Day.</em></h2>
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
function TestAnalysis({ cfg, isEmbedded = false }) {
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
    { Ic: BookOpen, t: `Add 1 hr/day to ${weak[0]} - your weakest area this week.` },
    { Ic: Zap, t: `Attack ${weak[1] || "Physics"}${weak[2] ? " & " + weak[2] : ""} first - the most recurring weak chapters.` },
    { Ic: Clock, t: "Reserve the last 10 min per paper to recheck - silly errors cost ~5 marks." },
    { Ic: Target, t: `Accuracy at ${accN}% - skip low-confidence questions to dodge negatives.` },
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

  const content = (
    <>
        <div className="mj-ta-grid">
          <div className="mj-ta-form">
            <div className="mj-ta-formtop">
              <span className="mj-ta-formbadge" style={{ padding: 0, overflow: "hidden" }}>
                <img src="/cplogo.svg" alt="CP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </span>
              <div className="mj-ta-formtop-tx">
                <strong>Add a test result</strong>
                <span>Log every attempt - mocks count as much as the real thing.</span>
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
              <Check size={15} strokeWidth={3} /> Full test · {Math.round((scored / total) * 100)}% · {accN}% accuracy - up {pctUp}% on your last mock. Keep the streak.
            </div>
            <div className="mj-ta-rank">
              <span className="mj-ta-rank-l">🏆 PREDICTED {exam.toUpperCase()} RANK · {scored} MARKS</span>
              <span className="mj-ta-rank-sub">Based on your last 6 full-length tests</span>
              <div className="mj-ta-rank-row">
                {rank.map((r, i) => (<div key={i} className="mj-ta-rank-c"><strong>{r.v}</strong><span>{r.l}</span></div>))}
              </div>
              <span className="mj-ta-rank-foot">Estimate only - actual rank depends on official normalisation &amp; shift difficulty.</span>
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
              <span>Your marks stay private - used only to build your plan.</span>
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
    </>
  );

  if (isEmbedded) {
    return (
      <div className="mj-ta-embedded">
        {content}
      </div>
    );
  }

  return (
    <section className="mj-section mj-ta">
      <div className="mj-wrap">
        {content}
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
  { time: "13:45", tag: "MTH",  c: "#eab308", t: "3D Geometry - 20/25 attempted" },
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
          <div>            <h2 className="mj-display mj-display-lg">A dashboard that feels<br /><em>alive - because it is.</em></h2>
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
          <p className="mj-sec-sub">Every Sunday a printable one-pager lands in your inbox - the real hours, tests, ranks and mentor notes your child heard that week.</p>
        </Reveal>

        <Reveal delay={0.1} className="mj-parent-card">
          <div className="mj-booklet">
            <span className="mj-booklet-pill"><BookOpen size={13} /> PARENT REPORT</span>
            <h2 className="mj-booklet-h">Weekly Progress<br />Booklet</h2>
            <p className="mj-booklet-sub">A clear, jargon-free summary of your child&rsquo;s week - effort, tests, improvement and what&rsquo;s next.</p>
            <div className="mj-booklet-div" />
            <span className="mj-booklet-lbl">STUDENT</span>
            <strong className="mj-booklet-name">{st.name || "Your child"}</strong>
            <span className="mj-booklet-meta">{exam} · CampusPoint Mentorship</span>
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
              <h3 className="mj-featured-quote">{p.headline || p.remark || "Aarav closed his weakest chapter - Rotational Motion."}</h3>
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
      { me: 0, t: "Sleep by 12 - you've done enough today 🌙", time: "11:46" },
    ],
  },
  {
    caption: "Sunday plan drop", mentor: "Mentor Sneha", status: "online · replies in minutes",
    script: [
      { me: 1, t: "Sir, I can't finish Organic Chem in time 🤢", time: "9:32" },
      { me: 0, t: "Don't worry Aditi. Let's fix this today 💪", time: "9:33" },
      { me: 0, t: "First - GOC done or pending?", time: "9:33" },
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
      { me: 0, t: "Capsule at 7 am - 10 Qs, timed. Let's kill the silly mistakes 🎯", time: "6:13" },
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

/* ═══════════════ PRICING - Three-Card (Indian 6m / Indian 1yr / International) ═══════════════ */
const INCLUDED = [
  "1-on-1 IITian mentor", "Weekly personalised study plan",
  "Weekly test analysis + priority checklist", "Live study tracking dashboard",
  "Parent weekly booklet", "24/7 WhatsApp doubt support",
  "Full mock marathon in final phase", "Rank prediction + college shortlist",
];

/* Build the plan keys for any batch: Indian (₹3,499) & International (₹13,999) */
function buildPricingPlans(basePlan) {
  const family = basePlan.replace(/-(6m|intl)$/, "");
  return {
    indian: family + "-6m",
    intl: family + "-intl",
  };
}

function Pricing({ plan, exam, openEnrol }) {
  const keys = buildPricingPlans(plan);
  const pInd = MENTOR_PLANS[keys.indian] || { amount: 3499, old: 5999 };
  const pi = MENTOR_PLANS[keys.intl] || { amount: 13999, old: 24999 };

  const isNeet = exam === "NEET" || /neet/i.test(plan);
  const isJee2027 = /jee-2027/i.test(plan);
  const cards = [
    {
      key: keys.indian,
      label: "INDIAN STUDENTS",
      sublabel: isJee2027 ? "Till JEE Mains 2027" : (pInd?.duration || "6 Months"),
      flag: "🇮🇳",
      amount: pInd?.amount || 3499,
      old: pInd?.old || 5999,
      accent: "#FF693D",
      bg: "linear-gradient(135deg,#FF7A3C,#F1531F)",
      highlight: false,
      note: "For Indian residents only. International enrollments will be cancelled.",
    },
    {
      key: keys.intl,
      label: "INTERNATIONAL STUDENTS",
      sublabel: "1 Year",
      flag: "🌍",
      amount: pi?.amount || 13999,
      old: pi?.old || 24999,
      accent: "#FF693D",
      bg: "linear-gradient(135deg,#FF693D,#E0421F)",
      highlight: true,
      badge: "🌏 INTERNATIONAL",
      extraFeatures: [
        "Dedicated timezone scheduling",
        "NRI admission guidance (DASA/CIWG)",
        "Priority 1-on-1 mentor access",
        "Exclusive career path counseling"
      ]
    },
  ];

  return (
    <section id="enrol" className="mj-section">
      <div className="mj-wrap">
        <Reveal style={{ textAlign: "center" }}>
          <h2 className="mj-display mj-display-xl">Choose your plan.<br />Start at <em>₹3,499.</em></h2>
          <p className="mj-sec-sub" style={{ maxWidth: 540, margin: "16px auto 0" }}>{isNeet ? "Comprehensive 1-on-1 mentorship by top Doctor mentors. Pick your region." : "Same mentorship, same IITian mentors. Pick the duration and region that suits you."}</p>
        </Reveal>

        <div className="mj-pricing-grid">
          {cards.map((c, i) => (
            <Reveal key={c.key} delay={0.06 * i} className={`mj-pricing-tier ${c.highlight ? "mj-pricing-tier-hl" : ""}`}>
              {c.badge && <span className="mj-tier-badge" style={{ background: c.bg, color: "#fff" }}>{c.badge}</span>}
              <div className="mj-tier-left" style={{ background: c.bg }}>
                <span className="mj-tier-flag">{c.flag}</span>
                <span className="mj-tier-kicker">{c.label}</span>
                <span className="mj-tier-sub">{c.sublabel}</span>
                <span className="mj-tier-plan">{exam}</span>
                <div className="mj-tier-amt">₹{c.amount.toLocaleString("en-IN")}</div>
                <div className="mj-tier-old">₹{c.old.toLocaleString("en-IN")}</div>
                {c.note && <div style={{ marginTop: "16px", padding: "8px 12px", background: "rgba(0,0,0,0.15)", borderRadius: "8px", fontSize: "0.75rem", lineHeight: 1.4, fontWeight: 600, color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.1)" }}>{c.note}</div>}
              </div>
              <div className="mj-tier-right">
                <span className="mj-inc-lbl">EVERYTHING INCLUDED</span>
                <div className="mj-inc-list">
                  {INCLUDED.map((f) => (
                    <div key={f} className="mj-inc-item"><Check size={14} strokeWidth={3} color={c.accent} /> {f}</div>
                  ))}
                  {c.extraFeatures && c.extraFeatures.map((f) => (
                    <div key={f} className="mj-inc-item" style={{ color: "#111827", fontWeight: 700, marginTop: 4 }}>
                      <Check size={14} strokeWidth={3} color={c.accent} style={{ flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                </div>
                <button className="mj-btn-dark mj-btn-block" onClick={() => openEnrol(c.key)}>Claim your seat <ArrowRight size={17} /></button>
                
              </div>
            </Reveal>
          ))}
        </div>
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
    <section id="talk" className="mj-section mj-talk">
      <div className="mj-wrap">
        <Reveal className="mj-parent-card">
          <div className="mj-talk-booklet">
            <h2 className="mj-display mj-display-lg">Not sure?<br /><em>Let&rsquo;s talk.</em></h2>
            <p className="mj-body">A 15-minute call, no pressure. We&rsquo;ll listen to where you are,
              share what the year could look like, and let you decide.</p>
            <div className="mj-reach">
              <span>REACH US · HELLO@campuspoint.in</span>
              <span>CALL · +91 81188 26194</span>
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

/* ── Head-to-Head Comparison: 1-on-1 Mentorship vs Coaching ── */
function CoachingVsMentorship({ exam }) {
  const points = [
    {
      feature: "Student-to-Teacher Ratio",
      coaching: "1 teacher for 150 – 300 students",
      mentorship: "1 dedicated mentor for 1 student",
      isHighlight: true,
    },
    {
      feature: "Daily Study Plan",
      coaching: "Generic batch syllabus schedule",
      mentorship: "Personalized daily timetable tailored to student strengths & school timings",
      isHighlight: false,
    },
    {
      feature: "Test Mistake Analysis",
      coaching: "Only ranks & marks published",
      mentorship: "Question-level analysis with time spent, weak topic tags & mentor remediation",
      isHighlight: false,
    },
    {
      feature: "Backlog Recovery",
      coaching: "Student left on their own",
      mentorship: "Structured 70–30 backlog formula integrated into daily schedule",
      isHighlight: false,
    },
    {
      feature: "Mentor Credibility",
      coaching: "Often junior faculty or automated chatbots",
      mentorship: "Verified IIT Roorkee and top IIT rankers who cleared the exam",
      isHighlight: false,
    },
    {
      feature: "Pricing",
      coaching: "₹1.5 Lakh – ₹3 Lakh per year",
      mentorship: "₹3,499 total till JEE Mains",
      isHighlight: true,
    },
  ];

  return (
    <section className="mj-section mj-compare-section" style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
      <div className="mj-wrap">
        <div className="mj-sec-head" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 36px" }}>
          <div className="mj-label">HEAD-TO-HEAD COMPARISON</div>
          <h2 className="mj-display mj-display-lg">
            1-on-1 Mentorship vs <em>Coaching</em>
          </h2>
        </div>

        <div className="mj-compare-card">
          <table className="mj-compare-table">
            <thead>
              <tr>
                <th className="mj-th-feat">Feature</th>
                <th className="mj-th-coach">Traditional Coaching Classes</th>
                <th className="mj-th-mentor">CampusPoint 1-on-1 Mentorship</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p, idx) => (
                <tr key={idx} className="mj-compare-row">
                  <td className="mj-td-feat">
                    {p.feature}
                  </td>
                  <td className="mj-td-coach">
                    <span className="mj-coach-cross">✕</span>
                    <span>{p.coaching}</span>
                  </td>
                  <td className={`mj-td-mentor ${p.isHighlight ? "mj-mentor-highlight" : ""}`}>
                    <span className="mj-mentor-check">✓</span>
                    {p.isHighlight ? (
                      <strong>{p.mentorship}</strong>
                    ) : (
                      <span>{p.mentorship}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ── THE COMPLETE STUDY & BACKLOG MANAGEMENT ECOSYSTEM ── */
function BacklogAndStudyPlan({ year, exam }) {
  const scheduleRows = [
    {
      time: "06:00 AM – 08:30 AM",
      desc: "Peak Focus: Physics Mechanics & Problem Solving",
      tag: "Peak Focus",
      tagClass: "mj-eco-tag-green",
      isHighlight: false,
    },
    {
      time: "09:00 AM – 02:00 PM",
      desc: "Core Theory: School Hours / Coaching Classroom Lectures",
      tag: "Core Theory",
      tagClass: "mj-eco-tag-amber",
      isHighlight: false,
    },
    {
      time: "02:30 PM – 04:00 PM",
      desc: "Backlog Slot: Dedicated Backlog Clearance Sprint (High-Yield PYQs)",
      tag: "Backlog Slot",
      tagClass: "mj-eco-tag-rose",
      isHighlight: true,
    },
    {
      time: "04:30 PM – 07:00 PM",
      desc: "Daily DPPs: Current Coaching Homework, Modules & DPPs",
      tag: "Daily DPPs",
      tagClass: "mj-eco-tag-orange",
      isHighlight: false,
    },
    {
      time: "07:30 PM – 09:00 PM",
      desc: "Revision: Inorganic / Organic Chemistry Active NCERT Recall",
      tag: "Revision",
      tagClass: "mj-eco-tag-green",
      isHighlight: false,
    },
    {
      time: "09:00 PM – 09:45 PM",
      desc: "Analysis: Error Log Review & Weak-Topic Formula Drills",
      tag: "Analysis",
      tagClass: "mj-eco-tag-purple",
      isHighlight: false,
    },
    {
      time: "09:45 PM – 10:15 PM",
      desc: "Mentor Call: Daily Study Streak Log & 1-on-1 Mentor WhatsApp Check-in",
      tag: "Mentor Call",
      tagClass: "mj-eco-tag-teal",
      isHighlight: false,
    },
  ];

  return (
    <section id="backlog-ecosystem" className="mj-section mj-eco-section">
      <div className="mj-wrap">
        {/* Section Header above the card - clean 3-word title */}
        <div className="mj-sec-head" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 40px" }}>
          <div className="mj-label">{exam || `JEE ${year || "2027"}`} STRATEGY</div>
          <h2 className="mj-display mj-display-lg">
            Backlog Clearing <em>Technique</em>
          </h2>
        </div>

        {/* Outer White-Canvas Ecosystem Card */}
        <div className="mj-eco-canvas">
          {/* 2-Column Main Flow Grid */}
          <div className="mj-eco-grid">
            {/* Left Card: Strategic Planning & Backlog Management */}
            <div className="mj-eco-card mj-eco-card-left">
              <div className="mj-eco-card-title">
                STRATEGIC STUDY PLANNING &amp; BACKLOG MANAGEMENT
              </div>
              <p className="mj-eco-card-sub">
                A massive backlog is the #1 cause of anxiety and burnout among JEE aspirants. When you try to cover everything at once, panic sets in. Your IITian mentor builds a structured backlog-clearing formula that restores confidence in 3 to 4 weeks.
              </p>

              {/* 3 Phase Cards */}
              <div className="mj-eco-phases-row">
                {/* Phase 1 */}
                <div className="mj-eco-phase-box">
                  <div className="mj-eco-phase-head">
                    Phase 1: High-Weightage Filtering (80/20 Rule)
                  </div>
                  <p className="mj-eco-phase-desc">
                    Scoring chapters are prioritized and massive chapters broken down.
                  </p>
                  <div className="mj-eco-phase-list-label">List of Chapters:</div>
                  <ul className="mj-eco-phase-list">
                    <li>Modern Physics</li>
                    <li>Thermodynamics</li>
                    <li>Coordination Compounds</li>
                    <li>Vectors &amp; 3D Geometry</li>
                    <li>Definite Integration</li>
                  </ul>
                </div>

                {/* Phase 2: Active slot with vertical electron drop */}
                <div className="mj-eco-phase-box mj-eco-phase-box-active">
                  <div className="mj-eco-phase-head">
                    Phase 2: The Parallel 90-Minute Daily Slot
                  </div>
                  <p className="mj-eco-phase-desc">
                    The isolated window for backlog command execution, keeping current topics intact.
                  </p>

                  {/* Vertical Electron Line to Backlog Slot badge */}
                  <div className="mj-eco-slot-connector">
                    <svg className="mj-eco-vert-svg" viewBox="0 0 24 44" fill="none">
                      <defs>
                        <filter id="glow-vert-p2" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="2.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <path d="M 12 0 L 12 44" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
                      <path d="M 12 0 L 12 44" stroke="#FF7A3C" strokeWidth="2.5" strokeDasharray="14 80" className="mj-beam-flow" />
                      <circle r="4" fill="#FF5C35" filter="url(#glow-vert-p2)">
                        <animateMotion path="M 12 0 L 12 44" dur="1.6s" repeatCount="indefinite" />
                      </circle>
                      <circle r="1.8" fill="#FFFFFF">
                        <animateMotion path="M 12 0 L 12 44" dur="1.6s" repeatCount="indefinite" />
                      </circle>
                    </svg>

                    <div className="mj-eco-backlog-badge">
                      <span className="mj-eco-badge-dot" /> Backlog Slot
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="mj-eco-phase-box">
                  <div className="mj-eco-phase-head">
                    Phase 3: Active Problem Solving over Passive Videos
                  </div>
                  <p className="mj-eco-phase-desc">
                    Replacing passive video watching with short formula review + 30 timed PYQs.
                  </p>
                </div>
              </div>
            </div>

            {/* Inter-card Desktop Circuit Bridge with Electron Flow */}
            <div className="mj-eco-bridge" aria-hidden="true">
              <svg className="mj-eco-bridge-svg" viewBox="0 0 60 480" fill="none" preserveAspectRatio="none">
                <defs>
                  <filter id="glow-bridge-desk" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="beam-bridge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#FF7A3C" stopOpacity="1" />
                    <stop offset="100%" stopColor="#FFD166" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Top arrow connecting card headers */}
                <path d="M 0 28 L 52 28" stroke="#94A3B8" strokeWidth="1.75" strokeDasharray="3 3" />
                <path d="M 44 23 L 54 28 L 44 33" stroke="#94A3B8" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 0 28 L 52 28" stroke="#FF7A3C" strokeWidth="2.5" strokeDasharray="14 100" className="mj-beam-flow" />
                <circle r="3.5" fill="#FF5C35" filter="url(#glow-bridge-desk)">
                  <animateMotion path="M 0 28 L 52 28" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="1.5" fill="#FFFFFF">
                  <animateMotion path="M 0 28 L 52 28" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Mid arrow flowing from Backlog Slot badge directly into Row 3 */}
                <path d="M 0 310 C 26 310, 30 216, 52 216" stroke="#FB923C" strokeWidth="2" strokeDasharray="4 3" />
                <path d="M 44 211 L 54 216 L 44 221" stroke="#FB923C" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 0 310 C 26 310, 30 216, 52 216" stroke="url(#beam-bridge-grad)" strokeWidth="3" strokeDasharray="18 120" className="mj-beam-flow-fast" />
                <circle r="4.5" fill="#FF5C35" filter="url(#glow-bridge-desk)">
                  <animateMotion path="M 0 310 C 26 310, 30 216, 52 216" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle r="2" fill="#FFFFFF">
                  <animateMotion path="M 0 310 C 26 310, 30 216, 52 216" dur="2.2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>

            {/* Right Card: Balanced 8-Hour Routine Architecture */}
            <div className="mj-eco-card mj-eco-card-right">
              <div className="mj-eco-card-title">
                BALANCED 8-HOUR DAILY ROUTINE ARCHITECTURE FOR JEE {year || "2027"}
              </div>

              <div className="mj-eco-routine-bar">
                <div className="mj-eco-dropdown-chip">
                  Customized Daily <span style={{ fontSize: 9, marginLeft: 4 }}>▼</span>
                </div>
                <div className="mj-eco-dotted-spacer" />
                <span className="mj-eco-bar-label">Sample daily timetable architecture</span>
              </div>

              {/* Schedule Table */}
              <div className="mj-eco-table-wrap">
                <table className="mj-eco-table">
                  <thead>
                    <tr>
                      <th style={{ width: "26%" }}>Time Slot</th>
                      <th style={{ width: "54%" }}>Description</th>
                      <th style={{ width: "20%", textAlign: "right" }}>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={row.isHighlight ? "mj-eco-row mj-eco-row-highlight" : "mj-eco-row"}
                      >
                        <td className="mj-eco-td-time">{row.time}</td>
                        <td className="mj-eco-td-desc">
                          {row.isHighlight ? (
                            <>
                              <span className="mj-eco-highlight-spark">⚡</span>
                              <strong>Backlog Slot:</strong> Dedicated Backlog Clearance Sprint (High-Yield PYQs)
                            </>
                          ) : (
                            row.desc
                          )}
                        </td>
                        <td className="mj-eco-td-tag">
                          <span className={`mj-eco-tag ${row.tagClass}`}>
                            {row.tag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Connectors Flowing into Mentor Framework */}
          <div className="mj-eco-bottom-flow">
            <svg className="mj-eco-bottom-svg" viewBox="0 0 640 50" fill="none" preserveAspectRatio="none">
              <defs>
                <filter id="glow-bottom-drop" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Left dropping path */}
              <path d="M 120 0 L 120 22 Q 120 40, 180 40 L 260 40" stroke="#CBD5E1" strokeWidth="1.75" strokeDasharray="3 3" />
              <path d="M 120 0 L 120 22 Q 120 40, 180 40 L 260 40" stroke="#FF7A3C" strokeWidth="2.5" strokeDasharray="16 120" className="mj-beam-flow" />
              <circle r="3.5" fill="#FF5C35" filter="url(#glow-bottom-drop)">
                <animateMotion path="M 120 0 L 120 22 Q 120 40, 180 40 L 260 40" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="#FFFFFF">
                <animateMotion path="M 120 0 L 120 22 Q 120 40, 180 40 L 260 40" dur="2.5s" repeatCount="indefinite" />
              </circle>

              {/* Right dropping path */}
              <path d="M 520 0 L 520 22 Q 520 40, 460 40 L 380 40" stroke="#CBD5E1" strokeWidth="1.75" strokeDasharray="3 3" />
              <path d="M 520 0 L 520 22 Q 520 40, 460 40 L 380 40" stroke="#FF7A3C" strokeWidth="2.5" strokeDasharray="16 120" className="mj-beam-flow" />
              <circle r="3.5" fill="#FF5C35" filter="url(#glow-bottom-drop)">
                <animateMotion path="M 520 0 L 520 22 Q 520 40, 460 40 L 380 40" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="#FFFFFF">
                <animateMotion path="M 520 0 L 520 22 Q 520 40, 460 40 L 380 40" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </svg>

            {/* Centered Mentor Framework Box */}
            <div className="mj-eco-framework-card">
              <div className="mj-eco-framework-title">Mentor Framework</div>
              <p className="mj-eco-framework-text">
                Backlog clearance never steals your time from current coaching topics. When you try to cover everything at once, panic sets in. Your IITian mentor builds a structured backlog-clearing formula, then clears a chapter in 4 days.
              </p>
            </div>

            <div className="mj-eco-framework-footer">
              Powered by the IITian Mentor Framework @ Campus Point
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Mock Test Analysis & How to Choose a Mentor ── */
function MockTestAnalysisGuide({ cfg }) {
  const testPillars = [
    { title: "Silly Mistake Elimination", desc: "Isolate calculation slips, misread questions, and formula mix-ups into an active Error Diary." },
    { title: "Time-per-Question Audit", desc: "Stop over-spending 7+ mins on stuck questions. Master aggressive first-pass question skipping." },
    { title: "Negative Marking Control", desc: "Eradicate uncalculated blind guessing. Calibrate your risk-reward ratio for maximum net marks." },
    { title: "Exam Temperament & CBT", desc: "Build 3-hour uninterrupted CBT stamina to eliminate test fatigue and exam hall panic." },
  ];

  const selectionCriteria = [
    { title: "Verified IIT Student Credentials", desc: "Ensure your mentor has actually cleared JEE Advanced and studies in an IIT, not an anonymous counsellor." },
    { title: "Active Exam Pattern Familiarity", desc: "Your mentor must understand recent 2024–2026 NTA shift difficulty shifts, syllabus rationalization, and marking patterns." },
    { title: "True 1-on-1 Individual Sessions", desc: "Avoid generic webinars disguised as mentorship. Demand scheduled weekly video calls where only your progress is discussed." },
    { title: "Transparent Tracking & Accountability", desc: "A great program provides a live dashboard where daily hours, streaks, test scores, and parent reports are visible." },
  ];

  return (
    <section className="mj-section" style={{ background: "#FFFFFF", borderBottom: "1px solid #e2e8f0" }}>
      <div className="mj-wrap">
        {/* Section 1: Mock Test Analysis */}
        <div style={{ marginBottom: 56 }}>
          <div className="mj-sec-head" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 36px" }}>
            <div className="mj-label">DATA-DRIVEN TEST ANALYSIS</div>
            <h2 className="mj-display mj-display-lg">
              How Mentorship Transforms <em>JEE Mock Test Analysis</em>
            </h2>
            <p className="mj-sec-sub" style={{ fontSize: "1.05rem", color: "#64748b", marginTop: 12 }}>
              Taking tests without rigorous analysis is wasted effort. Your mentor breaks down every mock into 4 actionable improvement vectors.
            </p>
          </div>

          {/* Four Redesigned Cards: Better Spacing, Low Text, & Clean Contour Border */}
          <div className="mj-test-pillars-grid">
            {testPillars.map((p, idx) => (
              <div key={idx} className="mj-pillar-card">
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Complete Interactive Test Analysis & Tracker (Moved directly below the 4 cards) */}
          {cfg && (
            <div style={{ marginTop: 42 }}>
              <TestAnalysis cfg={cfg} isEmbedded={true} />
            </div>
          )}
        </div>

        {/* Section 2: How to Select the Right Mentor */}
        <div style={{ background: "#ffffff", border: "2px solid #1B1B1B", borderRadius: 20, padding: "34px 30px", boxShadow: "4px 4px 0px #1B1B1B" }}>
          <div style={{ maxWidth: 720, marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#c2410c", textTransform: "uppercase", letterSpacing: "1px" }}>
              Student Checklist
            </span>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: "6px 0 8px", fontFamily: "'Sora', sans-serif" }}>
              How to Select the Right Mentor for JEE Preparation?
            </h3>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>
              Choosing the wrong guidance costs precious months during JEE preparation. Before joining any mentorship program, verify these 4 essential standards:
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {selectionCriteria.map((sc, i) => (
              <div key={i} style={{ background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 12, padding: "16px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#16a34a", fontWeight: 800 }}>✓</span>
                  <strong style={{ fontSize: 13, color: "#0f172a" }}>{sc.title}</strong>
                </div>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55, margin: 0 }}>{sc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ MENTORS ═══════════════ */
function TopMentors() {
  const mentors = [
    {
      name: "Saneh",
      college: "IIT Roorkee",
      branch: "Civil Engineering",
      specialty: "Physics Mechanics & Consistent Routine",
      badge: "Verified IIT Roorkee Student",
      thought: "Hi, I'm Saneh, currently pursuing Civil Engineering at IIT Roorkee. Consistency is more important than perfection. When I started my JEE preparation, I realized that a dedicated effort every single day is what truly builds the foundation for cracking one of the toughest exams. I've faced the highs and lows of this journey, and I'm here to share my strategies, keep you motivated, and guide you step-by-step toward your dream IIT.",
      img: imgSaneh
    },
    {
      name: "Saket Choudhary",
      college: "IIT Roorkee",
      branch: "BSBE",
      specialty: "Percentile Jump Strategy & Backlogs",
      badge: "Verified IIT Roorkee Student",
      thought: "Hi, I'm Saket Choudhary, a B.Tech student at IIT Roorkee. Despite scoring a very low percentile in JEE Main, I stayed consistent, changed my strategy, and cracked JEE Advanced to earn my place here. I've been through the same struggles and uncertainty that many aspirants face, and as a mentor, I'm here to help you overcome those challenges and achieve your goals together.",
      img: imgSaket
    },
    {
      name: "Mayank Singh",
      college: "IIT Roorkee",
      branch: "Mechanical Engineering",
      specialty: "Time Management & Test Analysis",
      badge: "Verified IIT Roorkee Student",
      thought: "Hi, I am Mayank Singh from iitr mechanical engineering. Started my own jee journey from middle of 11th, had backlogs, lost faith, lack of time management, so many ups and downs but it created such a man that could tackle anything. I am all thankful to my mentors and myself. So I'm now here at Campus Point to mentor young minds and pass them what I have earned.",
      img: imgMayank
    }
  ];

  return (
    <section id="mentors" className="mj-section mj-mentors-section" style={{ background: "#FFFFFF" }}>
      <div className="mj-wrap">
        <div className="mj-sec-head" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 36px" }}>
          <div className="mj-label">GUIDANCE FROM IITians &amp; NITians</div>
          <h2 className="mj-display mj-display-lg">Meet Your <em>IITian Mentors</em></h2>
          <p className="mj-sec-sub">Learn directly from top IITians and NITians who have walked the path and conquered the challenges.</p>
        </div>
        
        {/* Outer White-Canvas Card like Backlog Section Card */}
        <div className="mj-mentors-canvas">
          <div className="mj-mentors-list">
            {mentors.map((m, i) => (
              <div key={i} className="mj-mentor-bx">
                <div className="mj-mentor-bx-img">
                  <img src={m.img} alt={m.name} loading="lazy" />
                </div>
                <div className="mj-mentor-bx-info">
                  <div className="mj-mentor-header-row">
                    <h3 className="mj-mentor-name">{m.name}</h3>
                    <span className="mj-mentor-badge">
                      ✓ {m.badge}
                    </span>
                  </div>
                  <span className="mj-mentor-meta">{m.college} • {m.branch} {m.specialty ? `· ${m.specialty}` : ""}</span>
                  <p className="mj-mentor-thought">"{m.thought}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer line below the whole big card */}
        <div className="mj-mentors-footer-note">
          <span className="mj-mentor-pulse-dot" />
          100+ Verified Mentors Active on Platform — Zero Wait Time: Enroll Today, Match with Your Dedicated Mentor &amp; Start Your Journey with CampusPoint
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Mentorship() {
  const { variant } = useParams();
  const cfg = MENTORSHIP[variant];
  const { open: openEnrol } = useEnrol();
  if (!cfg) return <Navigate to="/mentorship/jee-2027" replace />;

  const plan = cfg.tracks?.[0]?.plan || "mentor-jee-2027-6m";
  const exam = cfg.tracks?.[0]?.exam || "JEE 2027";
  const year = (cfg.eyebrow || "").match(/\d{4}/)?.[0] || String(MENTOR_PLANS[plan]?.year || "2027");
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Generate structured FAQ schema for Google AI Overviews (SGE)
  const faqSchema = cfg.faqs?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": cfg.faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  } : null;

  // Program / Educational Service Schema
  const programSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": `${exam} 1-on-1 Mentorship Program by IIT Students`,
    "description": `Comprehensive 1-on-1 ${exam} preparation mentorship by IIT Roorkee students with custom daily study targets, backlog recovery sprints, and weekly video analysis.`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Campus Point",
      "url": "https://campuspoint.in"
    },
    "educationalCredentialAwarded": "Competitive Exam Mentorship Certificate",
    "timeToComplete": variant === "jee-2027" ? "P10M" : "P1Y",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "1280",
      "reviewCount": "1280"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": variant === "jee-2027" ? "Till JEE Mains 2027 1-on-1 Mentorship" : "6-Month 1-on-1 Mentorship",
        "price": "3499",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `https://campuspoint.in/mentorship/${variant}`
      },
      {
        "@type": "Offer",
        "name": "International 1-Year Mentorship",
        "price": "13999",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `https://campuspoint.in/mentorship/${variant}`
      }
    ]
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": variant === "jee-2027" ? "JEE 2027 Mentorship Program by IITians" : `${exam} Mentorship Program`,
    "description": `1-on-1 ${exam} mentorship by IIT Roorkee and top IITians with customized daily study schedules, 24/7 WhatsApp doubt solving, and weekly mock test analysis.`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Campus Point",
      "sameAs": "https://campuspoint.in"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "1280"
    },
    "offers": [
      {
        "@type": "Offer",
        "category": "Paid",
        "priceCurrency": "INR",
        "price": "3499",
        "name": variant === "jee-2027" ? "Till JEE Mains 2027 1-on-1 Mentorship" : "6-Month Mentorship"
      }
    ]
  };

  // Mentors Person Schema
  const mentorSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Saneh",
      "jobTitle": "JEE Mentor",
      "worksFor": { "@type": "EducationalOrganization", "name": "Campus Point" },
      "affiliation": { "@type": "CollegeOrUniversity", "name": "IIT Roorkee" },
      "description": "B.Tech in Civil Engineering at IIT Roorkee. Mentors JEE aspirants on physics mechanics, consistency, and daily study schedules."
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Saket Choudhary",
      "jobTitle": "JEE Mentor",
      "worksFor": { "@type": "EducationalOrganization", "name": "Campus Point" },
      "affiliation": { "@type": "CollegeOrUniversity", "name": "IIT Roorkee" },
      "description": "B.Tech at IIT Roorkee. Specializes in JEE Advanced strategy, percentile jump, and backlog clearance."
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Mayank Singh",
      "jobTitle": "JEE Mentor",
      "worksFor": { "@type": "EducationalOrganization", "name": "Campus Point" },
      "affiliation": { "@type": "CollegeOrUniversity", "name": "IIT Roorkee" },
      "description": "Mechanical Engineering at IIT Roorkee. Specializes in time management, test analysis, and mock test revision."
    }
  ];

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://campuspoint.in/" },
      { "@type": "ListItem", "position": 2, "name": "Mentorship", "item": "https://campuspoint.in/mentorship" },
      { "@type": "ListItem", "position": 3, "name": `${exam} Mentorship`, "item": `https://campuspoint.in/mentorship/${variant}` }
    ]
  };

  const combinedSchemas = [programSchema, courseSchema, breadcrumbsSchema, faqSchema, ...mentorSchemas].filter(Boolean);

  return (
    <div className="mj">
      <Seo
        rawTitle={
          variant === "jee-2027"
            ? "JEE Mentorship Program 2026–2027 by IITians | 1-on-1 Guidance – CampusPoint"
            : variant === "jee-2028"
            ? "JEE Mentorship for Class 11 (2028 Batch) by IITians | CampusPoint"
            : variant === "foundation"
            ? "Class 9 & 10 Foundation Mentorship by IITians | CampusPoint"
            : "NEET Mentorship Program 2027 by Doctors & Toppers | CampusPoint"
        }
        description={
          variant === "jee-2027"
            ? "Get 1-on-1 JEE Mentorship by verified IIT Roorkee rankers till JEE Mains. Daily personalized study plans, 70-30 backlog formula, mock test error autopsy & 24/7 WhatsApp guidance. Enroll at ₹3,499."
            : variant === "jee-2028"
            ? "Personalized 1-on-1 IITian mentorship for JEE 2028 aspirants. Master Class 11 concepts, eliminate backlogs, daily schedules & 1-on-1 mentor calls. 6-Month Plan at ₹3,499."
            : variant === "foundation"
            ? "1-on-1 Foundation mentorship for Class 9 and 10 students by IITians. Build early conceptual clarity for Olympiads, NTSE & JEE/NEET foundation. Starts at ₹3,499."
            : "Prepare for NEET 2027 with 1-on-1 mentorship by top medical college MBBS toppers. Daily NCERT targets, mock test analysis & personal guidance. Starts at ₹3,499."
        }
        path={`/mentorship/${variant}`}
        jsonLd={combinedSchemas}
      />
      <Hero variant={variant} cfg={cfg} plan={plan} year={year} exam={exam} openEnrol={openEnrol} scrollTo={scrollTo} />
      <Qualifier cfg={cfg} />
      <CoachingVsMentorship exam={exam} />
      <Method cfg={cfg} />
      <LiveTracking cfg={cfg} />
      <BacklogAndStudyPlan year={year} exam={exam} />
      <MockTestAnalysisGuide cfg={cfg} />
      <TopMentors />
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
.mj-test-pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.mj-pillar-card {
  background: #FFFFFF;
  border: 2px solid #1B1B1B;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 3px 3px 0px #1B1B1B;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}
.mj-pillar-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #FF7A3C;
}
.mj-pillar-card h4 {
  font-family: 'Sora', sans-serif;
  font-size: 1.02rem;
  font-weight: 800;
  color: #1B1B1B;
  margin: 0 0 10px 0;
  line-height: 1.3;
}
.mj-pillar-card p {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  color: #555555;
  line-height: 1.55;
  margin: 0;
}
.mj-ta-embedded {
  width: 100%;
}
@media (max-width: 960px) {
  .mj-test-pillars-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .mj-test-pillars-grid {
    grid-template-columns: 1fr;
  }
}

.mj { background:#FFFFFF; color:${T.ink}; font-family:'DM Sans',sans-serif; overflow-x:hidden; }
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
.mj-section { padding:clamp(64px,9vw,110px) 0; position:relative; background:#FFFFFF; }

/* 2-Column Split Hero Layout (Equal LHS == RHS Balance) */
.mj-hero-seo {
  position: relative;
  padding: clamp(195px, 18vw, 245px) 0 clamp(48px, 5vw, 72px);
  overflow: hidden;
  background: #FFFFFF;
  border-bottom: 1px solid var(--mj-line, #E2E8F0);
}
.mj-hero-seo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(28px, 4.5vw, 56px);
  max-width: 1240px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.mj-hero-copy-col {
  text-align: left;
}

/* Bold Editorial Typography */
.mj-hero-h1 {
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(2.3rem, 4.4vw, 4.1rem);
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: #1B1B1B;
  margin: 0 0 16px;
}
.mj-hero-line1 {
  display: block;
  font-weight: 800;
  color: #1B1B1B;
  margin-bottom: 6px;
}
.mj-hero-word-break {
  display: block;
  margin-bottom: 2px;
}
.mj-hero-line1-text {
  position: relative;
  display: inline-block;
}
.mj-hero-squiggle-wrap {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}
.mj-hero-squiggle {
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 10px;
  overflow: visible;
  pointer-events: none;
}
.mj-hero-line2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  font-weight: 800;
  color: #1B1B1B;
}
.mj-hero-line2-lead {
  display: block;
  font-weight: 800;
  color: #1B1B1B;
}
.mj-hero-box-pill {
  display: inline-block;
  vertical-align: middle;
  background: #FF7A3C;
  color: #1B1B1B;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: 0.94em;
  padding: 2px 14px 4px 14px;
  border-radius: 9px;
  border: 2.5px solid #1B1B1B;
  box-shadow: 3.5px 3.5px 0px #1B1B1B;
  letter-spacing: -0.02em;
  line-height: 1.15;
  white-space: nowrap;
}
.mj-hero-sub {
  font: 400 clamp(1.02rem, 1.35vw, 1.18rem)/1.6 'DM Sans', sans-serif;
  color: #4A4A4A;
  max-width: 540px;
  margin: 18px 0 24px;
}

/* Editorial Action Buttons */
.mj-hero-editorial-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.mj-hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 26px;
  background: #1B1B1B;
  color: #FFFFFF;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 0.98rem;
  border-radius: 12px;
  border: 2px solid #1B1B1B;
  box-shadow: 3px 3px 0px #FF7A3C;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  text-decoration: none;
}
.mj-hero-btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #FF7A3C;
  background: #2B2B2B;
  color: #FFFFFF;
}
.mj-hero-btn-primary:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px #FF7A3C;
}
.mj-hero-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 24px;
  background: #FFFFFF;
  color: #1B1B1B;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 0.98rem;
  border-radius: 12px;
  border: 2px solid #1B1B1B;
  box-shadow: 3px 3px 0px #1B1B1B;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  text-decoration: none;
}
.mj-hero-btn-secondary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #1B1B1B;
  background: #FAF7F2;
  color: #1B1B1B;
}
.mj-hero-btn-secondary:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px #1B1B1B;
}

.mj-hero-wa-hint {
  margin-top: 4px;
}
.mj-hero-wa-hint a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font: 600 0.88rem/1.4 'DM Sans', sans-serif;
  color: #555555;
  text-decoration: none;
  transition: color 0.15s ease;
}
.mj-hero-wa-hint a:hover {
  color: #FF5C35;
}

/* Right Column Illustration Visual */
.mj-hero-illustration-col {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}
.mj-hero-illustration-wrapper {
  position: relative;
  width: 100%;
  max-width: 580px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mj-hero-illustration-wrapper::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 92%;
  height: 92%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 105, 61, 0.16) 0%, rgba(255, 122, 60, 0.06) 52%, transparent 72%);
  filter: blur(32px);
  z-index: 0;
  pointer-events: none;
}
.mj-hero-illustration-img {
  width: 100%;
  height: auto;
  max-width: 580px;
  object-fit: contain;
  display: block;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.08));
  animation: mjFloatHeroIllustration 7s ease-in-out infinite;
}
@keyframes mjFloatHeroIllustration {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Background elements */
.mj-hero-bg { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.mj-orb { position:absolute; border-radius:50%; filter:blur(90px); }
.mj-orb-a { width:520px; height:520px; top:-210px; left:-150px; background:radial-gradient(circle, rgba(255,105,61,.24), transparent 70%); opacity:.5; animation:mjfloat 16s ease-in-out infinite; }
.mj-orb-b { width:460px; height:460px; bottom:-240px; right:-140px; background:radial-gradient(circle, rgba(255,178,130,.22), transparent 70%); opacity:.5; animation:mjfloat 21s ease-in-out infinite reverse; }
@keyframes mjfloat { 0%,100%{transform:translate(0,0);} 50%{transform:translate(42px,32px);} }

/* Responsive Hero Layout (Single-column stack with image below buttons) */
@media (max-width: 960px) {
  .mj-hero-seo {
    padding: 175px 0 48px;
  }
  .mj-hero-seo-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 32px;
  }
  .mj-hero-copy-col {
    text-align: center;
  }
  .mj-tabs {
    justify-content: center;
  }
  .mj-hero-line2 {
    justify-content: center;
  }
  .mj-hero-sub {
    margin-left: auto;
    margin-right: auto;
  }
  .mj-hero-editorial-actions {
    justify-content: center;
  }
  .mj-hero-wa-hint {
    text-align: center;
  }
  .mj-hero-illustration-col {
    order: 2;
  }
  .mj-hero-illustration-wrapper {
    max-width: 380px;
    margin: 0 auto;
  }
}
@media (max-width: 640px) {
  .mj-hero-seo {
    padding: 155px 0 36px;
  }
  .mj-hero-h1 {
    font-size: clamp(1.85rem, 6.8vw, 2.4rem);
    line-height: 1.18;
  }
  .mj-hero-editorial-actions {
    flex-direction: column;
    width: 100%;
  }
  .mj-hero-btn-primary,
  .mj-hero-btn-secondary {
    width: 100%;
    justify-content: center;
  }
  .mj-hero-illustration-wrapper {
    max-width: 320px;
  }
}

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

/* method - light vertical timeline */
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
.mj-ta-topbar-badge { display:grid; place-items:center; width:36px; height:36px; flex-shrink:0; border-radius:50%; background:transparent; color:#fff; }
.mj-ta-topbar-l strong { display:block; font:800 1rem/1.1 'Space Grotesk',sans-serif; color:${T.ink}; }
.mj-ta-topbar-l span { font:700 .64rem/1.3 'Space Grotesk',sans-serif; letter-spacing:.06em; color:${T.muted}; }
.mj-ta-topbar-r { display:flex; align-items:center; gap:26px; }
.mj-ta-topbar-r div { display:flex; flex-direction:column; }
.mj-ta-topbar-r strong { font:800 1.25rem/1 'Sora',sans-serif; color:${T.coralDk}; }
.mj-ta-topbar-r span { font:700 .58rem/1.2 'Space Grotesk',sans-serif; letter-spacing:.08em; text-transform:uppercase; color:${T.muted}; }
.mj-ta-grid { display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:stretch; }
.mj-ta-form { display:flex; flex-direction:column; justify-content:flex-start; height:100%; background:${T.card}; border:1px solid ${T.line}; border-radius:18px; padding:24px; box-shadow:0 20px 44px -34px rgba(0,0,0,.35); }
.mj-ta-formtop { display:flex; align-items:center; gap:12px; padding-bottom:16px; margin-bottom:18px; border-bottom:1px solid ${T.line}; }
.mj-ta-formbadge { display:grid; place-items:center; width:38px; height:38px; flex-shrink:0; border-radius:50%; background:transparent; color:${T.coralDk}; }
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

/* live tracking - light coded dashboard */
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
.mj-weekly { position:relative; display:flex; flex-direction:column; background:#FFFFFF; padding:34px 36px; }
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

/* whatsapp - animated phones */
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

/* proof - static bento wall */
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

/* pricing - 2 card grid */
.mj-pricing-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:30px; margin:44px auto 0; max-width:760px; align-items:stretch; }
.mj-pricing-tier { display:flex; flex-direction:column; border-radius:24px; overflow:hidden; border:1px solid ${T.line}; background:${T.card}; box-shadow:0 12px 30px -16px rgba(0,0,0,.15); transition:transform .3s, box-shadow .3s; position:relative; }
.mj-pricing-tier:hover { transform:translateY(-6px); box-shadow:0 24px 60px -20px rgba(0,0,0,.25); }
.mj-pricing-tier-hl { border-color:#FFB59A; box-shadow:0 20px 50px -16px rgba(255,105,61,.25); transform:translateY(-4px); z-index:2; }
.mj-pricing-tier-hl:hover { transform:translateY(-10px); box-shadow:0 30px 70px -20px rgba(255,105,61,.3); }
.mj-tier-badge { position:absolute; top:16px; right:16px; padding:6px 14px; border-radius:50px; font:800 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; z-index:5; box-shadow:0 8px 16px -6px rgba(0,0,0,.4); border:1px solid rgba(255,255,255,.25); text-shadow:0 1px 2px rgba(0,0,0,.3); background-image:linear-gradient(rgba(255,255,255,.15), transparent); }
.mj-tier-left { padding:36px 26px 30px; display:flex; flex-direction:column; color:#fff; position:relative; overflow:hidden; }
.mj-tier-flag { position:absolute; top:-10px; right:-14px; font-size:110px; opacity:.15; filter:grayscale(100%); mix-blend-mode:overlay; pointer-events:none; }
.mj-tier-kicker { font:800 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; opacity:.85; }
.mj-tier-sub { font:600 .86rem/1.3 'DM Sans',sans-serif; opacity:.95; margin-top:6px; }
.mj-tier-plan { font:800 1.4rem/1.1 'Sora',sans-serif; margin:16px 0 auto; }
.mj-tier-amt { font:800 2.8rem/1 'Sora',sans-serif; margin-top:20px; }
.mj-tier-old { font:600 .9rem/1 'Space Grotesk',sans-serif; text-decoration:line-through; opacity:.75; margin-top:4px; }
.mj-tier-right { padding:28px 24px 30px; display:flex; flex-direction:column; flex:1; }
.mj-inc-lbl { font:800 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:${T.muted}; }
.mj-inc-list { display:flex; flex-direction:column; gap:12px; margin:16px 0 24px; flex:1; }
.mj-inc-item { display:flex; align-items:flex-start; gap:8px; font:500 .86rem/1.35 'DM Sans',sans-serif; color:${T.ink}; }
.mj-inc-item svg { flex-shrink:0; margin-top:2px; }
.mj-price-foot { display:flex; justify-content:space-between; margin-top:16px; font:700 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; color:${T.muted}; }

.mj-btn-dark {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  border: 2px solid #1B1B1B;
  border-radius: 12px;
  background: #1B1B1B;
  color: #FFFFFF !important;
  font-family: 'Sora', 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.98rem;
  cursor: pointer;
  margin-top: auto;
  box-shadow: 4px 4px 0px #FF7A3C;
  transition: all 0.2s ease;
}
.mj-btn-dark:hover {
  background: #2B2B2B;
  color: #FFFFFF !important;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #FF7A3C;
}
.mj-btn-dark:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px #FF7A3C;
}
.mj-btn-block {
  width: 100%;
  display: flex;
}

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

.mj-talk-form-wrap { background:#FFFFFF; padding:44px 54px; display:flex; flex-direction:column; justify-content:center; }
.mj-form-row { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.mj-field { display:flex; flex-direction:column; gap:6px; margin-bottom:24px; }
.mj-field span { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; text-transform:uppercase; color:${T.muted}; }
.mj-field input, .mj-field textarea { border:none; border-bottom:1.5px solid ${T.line}; background:none; padding:8px 2px; font:500 1rem/1.4 'DM Sans',sans-serif; color:${T.ink}; outline:none; resize:vertical; transition:border-color .16s; }
.mj-field input:focus, .mj-field textarea:focus { border-color:${T.coral}; }


/* ═══════════════ MENTORS SECTION (Backlog Card Architecture) ═══════════════ */
.mj-mentors-section {
  padding: clamp(56px, 7vw, 92px) 0;
  background: #FFFFFF;
}

.mj-mentors-canvas {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 24px;
  padding: clamp(24px, 3.5vw, 40px);
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.04);
  position: relative;
}

.mj-mentors-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.mj-mentor-bx {
  background: #FAFAFC;
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  padding: clamp(20px, 2.5vw, 26px);
  text-align: center;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.02);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  display: flex;
  flex-direction: column;
}

.mj-mentor-bx:hover {
  transform: translateY(-4px);
  border-color: #FED7AA;
  box-shadow: 0 16px 32px rgba(255, 105, 61, 0.08);
  background: #FFFFFF;
}

.mj-mentor-bx-img {
  width: 96px;
  height: 96px;
  margin: 0 auto 16px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #FFF7ED;
  box-shadow: 0 4px 14px rgba(255, 105, 61, 0.15);
  flex-shrink: 0;
}

.mj-mentor-bx-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mj-mentor-header-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.mj-mentor-name {
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: 1.22rem;
  color: #0F172A;
  margin: 0;
  line-height: 1.2;
}

.mj-mentor-badge {
  font-size: 10px;
  font-weight: 700;
  background: #ECFDF5;
  color: #059669;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid #A7F3D0;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  letter-spacing: 0.01em;
}

.mj-mentor-meta {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  color: #EA580C;
  line-height: 1.4;
  margin-top: 4px;
}

.mj-mentor-thought {
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 0.88rem;
  line-height: 1.6;
  color: #475569;
  margin: 16px 0 0;
  font-style: italic;
  flex-grow: 1;
}

.mj-mentors-footer-note {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(0.74rem, 1vw, 0.84rem);
  font-weight: 700;
  color: #64748B;
  text-align: center;
  margin-top: 14px;
  letter-spacing: 0.03em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0 12px;
}

.mj-mentor-pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  display: inline-block;
  flex-shrink: 0;
  animation: mjPulseDot 2s infinite ease-in-out;
}

@keyframes mjPulseDot {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.35);
  }
}

@media (max-width: 960px) {
  .mj-mentors-list {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .mj-mentors-canvas {
    padding: 20px 16px;
    border-radius: 20px;
  }
}

@media (max-width: 640px) {
  .mj-mentors-section {
    padding: clamp(40px, 6vw, 60px) 0;
  }
  .mj-mentors-canvas {
    padding: 16px 12px;
    border-radius: 18px;
  }
  .mj-mentors-footer-note {
    font-size: 0.72rem;
    line-height: 1.45;
  }
}

/* ═══════════════ HEAD-TO-HEAD COMPARISON TABLE ═══════════════ */
.mj-compare-section {
  background: #FFFFFF;
  padding: clamp(54px, 7vw, 84px) 0;
}

.mj-compare-card {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  border: 1.5px solid #E2E8F0;
  border-radius: 18px;
  background: #FFFFFF;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}

.mj-compare-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
}

.mj-th-feat {
  width: 28%;
  background: #F8FAFC;
  color: #334155;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(0.74rem, 1.1vw, 0.88rem);
  padding: clamp(10px, 1.4vw, 16px) clamp(8px, 1.6vw, 20px);
  border-bottom: 2px solid #E2E8F0;
  letter-spacing: 0.02em;
}

.mj-th-coach {
  width: 35%;
  background: #F1F5F9;
  color: #475569;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(0.74rem, 1.1vw, 0.88rem);
  padding: clamp(10px, 1.4vw, 16px) clamp(8px, 1.6vw, 20px);
  border-bottom: 2px solid #E2E8F0;
}

.mj-th-mentor {
  width: 37%;
  background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
  color: #C2410C;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(0.74rem, 1.1vw, 0.88rem);
  padding: clamp(10px, 1.4vw, 16px) clamp(8px, 1.6vw, 20px);
  border-bottom: 2px solid #FDBA74;
  border-left: 2px solid #FED7AA;
}

.mj-compare-row {
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.15s ease;
}

.mj-compare-row:last-child {
  border-bottom: none;
}

.mj-compare-row:hover {
  background: rgba(255, 105, 61, 0.02);
}

.mj-td-feat {
  padding: clamp(10px, 1.4vw, 16px) clamp(8px, 1.6vw, 20px);
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: clamp(0.72rem, 1vw, 0.86rem);
  color: #0F172A;
  line-height: 1.35;
  vertical-align: top;
  word-break: break-word;
}

.mj-td-coach {
  padding: clamp(10px, 1.4vw, 16px) clamp(8px, 1.6vw, 20px);
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(0.72rem, 1vw, 0.84rem);
  color: #64748B;
  line-height: 1.45;
  vertical-align: top;
  word-break: break-word;
}

.mj-coach-cross {
  color: #94A3B8;
  font-weight: 700;
  font-size: 0.72rem;
  margin-right: 5px;
  display: inline-block;
}

.mj-td-mentor {
  padding: clamp(10px, 1.4vw, 16px) clamp(8px, 1.6vw, 20px);
  background: linear-gradient(90deg, rgba(255, 247, 237, 0.45) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-left: 2px solid #FED7AA;
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(0.72rem, 1vw, 0.84rem);
  color: #0F172A;
  line-height: 1.45;
  vertical-align: top;
  word-break: break-word;
}

.mj-mentor-check {
  color: #16A34A;
  font-weight: 800;
  font-size: 0.78rem;
  margin-right: 5px;
  display: inline-block;
}

.mj-mentor-highlight strong {
  color: #EA580C;
  font-weight: 800;
}

@media (max-width: 640px) {
  .mj-compare-card {
    border-radius: 14px;
  }
  .mj-compare-table {
    table-layout: fixed;
    width: 100%;
  }
  .mj-th-feat, .mj-td-feat {
    width: 27%;
    padding: 8px 6px;
    font-size: 0.71rem;
    line-height: 1.25;
  }
  .mj-th-coach, .mj-td-coach {
    width: 35%;
    padding: 8px 6px;
    font-size: 0.71rem;
    line-height: 1.3;
  }
  .mj-th-mentor, .mj-td-mentor {
    width: 38%;
    padding: 8px 6px;
    font-size: 0.71rem;
    line-height: 1.3;
  }
  .mj-coach-cross, .mj-mentor-check {
    margin-right: 3px;
    font-size: 0.68rem;
  }
}

/* ═══════════════ THE COMPLETE STUDY & BACKLOG MANAGEMENT ECOSYSTEM ═══════════════ */
.mj-eco-section { background: #FFFFFF;
  padding: clamp(56px, 7vw, 92px) 0;
  border-bottom: 1px solid #E2E8F0;
  position: relative;
  overflow: hidden;
}

.mj-eco-canvas {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 24px;
  padding: clamp(20px, 3.2vw, 36px);
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.04);
  position: relative;
}

.mj-eco-top-header {
  text-align: center;
  margin-bottom: clamp(20px, 2.5vw, 28px);
}

.mj-eco-main-h2 {
  font-family: 'Sora', sans-serif;
  font-size: clamp(1.25rem, 2.3vw, 1.85rem);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.25;
  text-transform: uppercase;
}

.mj-eco-year-pill {
  color: #FF7A3C;
}

/* 2-Column Split Grid */
.mj-eco-grid {
  display: grid;
  grid-template-columns: 1fr 60px 1fr;
  align-items: stretch;
  position: relative;
}

.mj-eco-card {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 18px;
  padding: clamp(18px, 2.2vw, 26px);
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
}

.mj-eco-card-left {
  background: #FAFCFF;
  border: 1.5px solid #E2E8F0;
}

.mj-eco-card-right {
  background: #F0F6FC;
  border: 1.5px solid #D6E4F0;
}

.mj-eco-card-title {
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(0.92rem, 1.25vw, 1.08rem);
  color: #EA580C;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  margin-bottom: 8px;
  line-height: 1.3;
}

.mj-eco-card-sub {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  line-height: 1.6;
  color: #475569;
  margin: 0 0 18px;
}

/* 3 Phase Cards Row */
.mj-eco-phases-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: auto;
  align-items: stretch;
}

.mj-eco-phase-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.mj-eco-phase-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

.mj-eco-phase-box-active {
  background: #FFFDF9;
  border: 1.5px solid #FED7AA;
  box-shadow: 0 4px 16px rgba(255, 122, 60, 0.08);
}

.mj-eco-phase-head {
  font-family: 'Sora', sans-serif;
  font-size: 0.76rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 6px;
  line-height: 1.35;
}

.mj-eco-phase-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.74rem;
  color: #64748B;
  line-height: 1.45;
  margin: 0;
}

.mj-eco-phase-list-label {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  color: #1E293B;
  margin: 8px 0 4px;
}

.mj-eco-phase-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mj-eco-phase-list li {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  color: #475569;
  line-height: 1.45;
  position: relative;
  padding-left: 10px;
}

.mj-eco-phase-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #EA580C;
  font-weight: bold;
}

/* Vertical Slot Connector inside Phase 2 */
.mj-eco-slot-connector {
  margin-top: auto;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mj-eco-vert-svg {
  width: 20px;
  height: 38px;
  overflow: visible;
}

.mj-eco-backlog-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #EFF6FF;
  border: 1.5px solid #93C5FD;
  border-radius: 999px;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: 0.76rem;
  color: #1D4ED8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
  white-space: nowrap;
}

.mj-eco-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  animation: mjSlotPulse 1.8s infinite;
}

@keyframes mjSlotPulse {
  0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5); }
  70% { box-shadow: 0 0 0 6px rgba(37, 99, 235, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
}

/* Inter-Card SVG Bridge on Desktop */
.mj-eco-bridge {
  position: relative;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.mj-eco-bridge-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Right Card Routine Bar */
.mj-eco-routine-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.mj-eco-dropdown-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 6px;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 0.74rem;
  color: #1E40AF;
  white-space: nowrap;
}

.mj-eco-dotted-spacer {
  flex: 1;
  height: 1px;
  border-top: 1.5px dashed #CBD5E1;
}

.mj-eco-bar-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.76rem;
  color: #64748B;
  font-weight: 600;
  white-space: nowrap;
}

/* Routine Table */
.mj-eco-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.mj-eco-table {
  width: 100%;
  border-collapse: collapse;
}

.mj-eco-table thead tr th {
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: 0.76rem;
  color: #0F172A;
  padding: 8px 10px;
  border-bottom: 1.5px solid #E2E8F0;
  text-align: left;
}

.mj-eco-row {
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.15s ease;
}

.mj-eco-row:hover {
  background: #F8FAFC;
}

.mj-eco-td-time {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  color: #334155;
  padding: 9px 10px;
  white-space: nowrap;
}

.mj-eco-td-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.76rem;
  color: #0F172A;
  padding: 9px 10px;
  line-height: 1.45;
}

.mj-eco-td-tag {
  padding: 9px 10px;
  text-align: right;
  white-space: nowrap;
}

/* Highlighted Backlog Slot Row (Target of the Electron Beam) */
.mj-eco-row-highlight {
  background: #FFF1F2 !important;
  border-left: 3px solid #F43F5E;
  animation: mjBacklogSlotPulse 3s ease-in-out infinite;
}

@keyframes mjBacklogSlotPulse {
  0%, 100% {
    background-color: #FFF1F2;
    box-shadow: inset 0 0 8px rgba(244, 63, 94, 0.08);
  }
  50% {
    background-color: #FFE4E6;
    box-shadow: inset 0 0 16px rgba(244, 63, 94, 0.2);
  }
}

.mj-eco-highlight-spark {
  margin-right: 4px;
  color: #E11D48;
}

.mj-eco-bold-slot {
  font-weight: 800;
  color: #9F1239;
}

/* Category Tags */
.mj-eco-tag {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 6px;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 0.7rem;
  line-height: 1.2;
}

.mj-eco-tag-green {
  background: #DCFCE7;
  color: #15803D;
  border: 1px solid #BBF7D0;
}

.mj-eco-tag-amber {
  background: #FEF3C7;
  color: #B45309;
  border: 1px solid #FDE68A;
}

.mj-eco-tag-rose {
  background: #FFE4E6;
  color: #BE123C;
  border: 1.5px solid #FECDD3;
  font-weight: 800;
}

.mj-eco-tag-orange {
  background: #FFEDD5;
  color: #C2410C;
  border: 1px solid #FED7AA;
}

.mj-eco-tag-purple {
  background: #F3E8FF;
  color: #7E22CE;
  border: 1px solid #E9D5FF;
}

.mj-eco-tag-teal {
  background: #CCFBF1;
  color: #0F766E;
  border: 1px solid #99F6E4;
}

/* Bottom Flow to Mentor Framework */
.mj-eco-bottom-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 8px;
}

.mj-eco-bottom-svg {
  width: 100%;
  max-width: 640px;
  height: 48px;
  overflow: visible;
  display: block;
}

.mj-eco-framework-card {
  background: #FFFBEB;
  border: 1.5px solid #FED7AA;
  border-radius: 16px;
  padding: 18px 28px;
  max-width: 740px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 18px rgba(245, 158, 11, 0.08);
}

.mj-eco-framework-title {
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  color: #0F172A;
  margin-bottom: 6px;
}

.mj-eco-framework-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  color: #334155;
  line-height: 1.6;
  margin: 0;
}

.mj-eco-framework-footer {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.74rem;
  font-weight: 700;
  color: #64748B;
  text-align: center;
  margin-top: 10px;
  letter-spacing: 0.04em;
}

/* Traveling Energy Beam Animation */
@keyframes mjBeamTravel {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -160;
  }
}

.mj-beam-flow {
  animation: mjBeamTravel 2s linear infinite;
}

.mj-beam-flow-fast {
  animation: mjBeamTravel 1.6s linear infinite;
}

/* Responsive Media Queries */
@media (max-width: 1024px) {
  .mj-eco-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .mj-eco-bridge {
    display: none;
  }
  .mj-eco-phases-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .mj-eco-canvas {
    padding: 16px 12px;
    border-radius: 18px;
  }
  .mj-eco-main-h2 {
    font-size: 1.15rem;
  }
  .mj-eco-card {
    padding: 16px 12px;
  }
  .mj-eco-framework-card {
    padding: 14px 16px;
  }
}

/* responsive */
@media (max-width:940px) {
  .mj-hero { padding:130px 0 60px; } .mj-orb { filter:blur(60px); }
  .mj-display-xl { font-size:2.8rem; }
  .mj-price-card { grid-template-columns:1fr; }
  .mj-pricing-grid { grid-template-columns:repeat(2,1fr); gap:24px; max-width:700px; margin-top:34px; }
  .mj-parent-card, .mj-talk-grid, .mj-dash-body, .mj-weekly-body, .mj-ta-grid, .mj-faqs, .mj-mentors-list { grid-template-columns:1fr; }
  .mj-bento { grid-template-columns:1fr; } .mj-bento-feat { grid-column:auto; }
  .mj-faq-q { padding:16px 18px; } .mj-faq-a p { padding:0 18px 18px; }
  .mj-booklet, .mj-weekly, .mj-talk-booklet, .mj-talk-form-wrap { padding:30px; }
  .mj-dash-main { border-right:none; border-bottom:1px solid ${T.line}; padding:22px; }
  .mj-dash-feed { padding:22px; }
  .mj-dash-stats { grid-template-columns:1fr 1fr; }
  .mj-dash-stat:last-child { grid-column:span 2; }
  .mj-proof-top { align-items:flex-start; }
  .mj-ta-form { position:static; top:auto; }
  .mj-ta-step:not(:last-child)::after { display:none; }
  .mj-hero-live { display:none; }
  .mj-hero-cards { grid-template-columns:1fr; max-width:420px; margin-left:auto; margin-right:auto; }
  .mj-gem { width:260px; height:260px; }
  .mj-sec-head, .mj-dark-head { flex-direction:column; align-items:center; }
  .mj-prog-grid { grid-template-columns:1fr 1fr; } .mj-navy-card { grid-row:auto; grid-column:span 2; }
  .mj-phones { justify-content:flex-start; }
}
@media (max-width:560px) {
  .mj-stat-row { grid-template-columns:1fr 1fr; } .mj-stat { border-left:none; padding-left:0; }
  .mj-prog-grid, .mj-form-row, .mj-inc-grid { grid-template-columns:1fr; } .mj-navy-card { grid-column:auto; }
  .mj-phones { gap:16px; }
  .mj-weekly-featured { border-right:none; padding-right:0; }
.mj-booklet-btn { margin-top:auto; align-self:flex-start; display:inline-flex; align-items:center; gap:9px; margin-top:28px; padding:13px 22px; border:none; border-radius:12px; background:#fff; color:${T.coralDk}; font:800 .92rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:transform .16s, box-shadow .16s; box-shadow:0 12px 26px -14px rgba(0,0,0,.4); }
.mj-booklet-btn:hover { transform:translateY(-2px); box-shadow:0 18px 34px -16px rgba(0,0,0,.5); }
.mj-weekly-next { margin-top:22px; padding-top:18px; border-top:1px solid ${T.line}; }
.mj-weekly-nextlist { list-style:none; margin:12px 0 0; padding:0; display:flex; flex-direction:column; gap:10px; }
.mj-weekly-nextlist li { display:flex; align-items:flex-start; gap:9px; font:500 .84rem/1.4 'DM Sans',sans-serif; color:${T.body}; }
.mj-weekly-nextlist svg { flex-shrink:0; margin-top:2px; color:${T.coral}; }
.mj-weekly { position:relative; display:flex; flex-direction:column; background:#FFFFFF; padding:34px 36px; }
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

/* whatsapp - animated phones */
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

/* proof - static bento wall */
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

/* responsive */
@media (max-width:940px) {
  .mj-hero { padding:130px 0 60px; } .mj-orb { filter:blur(60px); }
  .mj-display-xl { font-size:2.8rem; }
  .mj-price-card { grid-template-columns:1fr; }
  .mj-pricing-grid { grid-template-columns:repeat(2,1fr); gap:24px; max-width:700px; margin-top:34px; }
  .mj-parent-card, .mj-talk-grid, .mj-dash-body, .mj-weekly-body, .mj-ta-grid, .mj-faqs, .mj-mentors-list { grid-template-columns:1fr; }
  .mj-bento { grid-template-columns:1fr; } .mj-bento-feat { grid-column:auto; }
  .mj-faq-q { padding:16px 18px; } .mj-faq-a p { padding:0 18px 18px; }
  .mj-booklet, .mj-weekly, .mj-talk-booklet, .mj-talk-form-wrap { padding:30px; }
  .mj-dash-main { border-right:none; border-bottom:1px solid ${T.line}; padding:22px; }
  .mj-dash-feed { padding:22px; }
  .mj-dash-stats { grid-template-columns:1fr 1fr; }
  .mj-dash-stat:last-child { grid-column:span 2; }
  .mj-proof-top { align-items:flex-start; }
  .mj-ta-form { position:static; top:auto; }
  .mj-ta-step:not(:last-child)::after { display:none; }
  .mj-hero-live { display:none; }
  .mj-hero-cards { grid-template-columns:1fr; max-width:420px; margin-left:auto; margin-right:auto; }
  .mj-gem { width:260px; height:260px; }
  .mj-sec-head, .mj-dark-head { flex-direction:column; align-items:center; }
  .mj-prog-grid { grid-template-columns:1fr 1fr; } .mj-navy-card { grid-row:auto; grid-column:span 2; }
  .mj-phones { justify-content:flex-start; }
}
@media (max-width:560px) {
  .mj-stat-row { grid-template-columns:1fr 1fr; } .mj-stat { border-left:none; padding-left:0; }
  .mj-prog-grid, .mj-form-row, .mj-inc-grid { grid-template-columns:1fr; } .mj-navy-card { grid-column:auto; }
  .mj-phones { gap:16px; }
  .mj-weekly-featured { border-right:none; padding-right:0; }
  .mj-pricing-grid { grid-template-columns:repeat(2,1fr); gap:16px; margin:24px auto 0; }
  .mj-vstep { grid-template-columns:48px 1fr; gap:16px; } .mj-vstep-mark { width:48px; height:48px; } .mj-vsteps-rail { left:23px; }
  .mj-dash-two { grid-template-columns:1fr; }
  .mj-dash-chart { gap:6px; } .mj-dash-barval { font-size:.56rem; }
  .mj-check-right { align-self:stretch; }
  .mj-watermark { font-size:64vw; }
}
`;
