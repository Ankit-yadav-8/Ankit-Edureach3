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
  ArrowRight, ArrowUpRight, Plus, Check, Star, Send, Radio,
  Video, Phone, Paperclip, Camera, Mic, Smile, GraduationCap, Sparkles,
  BookOpen, CircleDot, Zap, Target, Clock,
} from "lucide-react";
import { MENTORSHIP, MENTOR_PLANS, SEATS_LIMIT, SEATS_LEFT, MENTOR_LINKS } from "../data/mentorship.js";
import { useEnrol } from "../components/EnrolModal.jsx";
import Seo from "../components/Seo.jsx";

const WA_NUMBER = "917877596464";

/* ── warm paper / coral / navy theme ── */
const T = {
  paper: "#F7F3EC", paper2: "#F1EBE0", card: "#FFFFFF",
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

/* ═══════════════ HERO — journal masthead ═══════════════ */
function Hero({ cfg, plan, year, exam, openEnrol, scrollTo }) {
  return (
    <section className="mj-hero">
      <span className="mj-watermark" aria-hidden="true">{year}</span>
      <div className="mj-wrap mj-hero-inner">
        <div className="mj-hero-grid">
          <Reveal className="mj-hero-left">
            <h1 className="mj-hero-h1">
              A 1-on-1 mentorship built by <em>IITians</em> — with weekly test surgery,
              a live tracker your parents can read, and the calm rhythm that actually
              gets you a rank in <em>{exam}.</em>
            </h1>
            <div className="mj-hero-cta">
              <button className="mj-btn-dark" onClick={() => openEnrol(plan)}>Start at ₹1 <ArrowRight size={17} /></button>
              <button className="mj-btn-link" onClick={() => scrollTo("method")}>
                <span className="mj-btn-circ"><ArrowUpRight size={15} /></span> SEE THE METHOD
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="mj-hero-visual">
            <span className="mj-badge-jump"><b>AVG JUMP</b>+18,400 ranks</span>
            <div className="mj-hero-imgcard">
              <img src={cfg.heroImage} alt={`${exam} mentorship`} loading="eager" />
            </div>
            <span className="mj-badge-live"><span className="mj-dot mj-dot-live" /> LIVE NOW · 312 studying</span>
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

/* ═══════════════ QUALIFIER — "is this you?" ═══════════════ */
function Qualifier({ cfg }) {
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal>
          <p className="mj-lead">
            This program is designed for <em>one type of aspirant</em> — the one who
            wants a real system, not another shelf of unopened books.
          </p>
        </Reveal>
        <div className="mj-checklist">
          {(cfg.forYou || []).map((line, i) => (
            <Reveal key={i} delay={(i % 2) * 0.05} className={i % 2 ? "mj-check-card mj-check-right" : "mj-check-card"}>
              <span className="mj-check-ic"><Check size={16} strokeWidth={3} /></span>
              <span className="mj-check-t">{line}</span>
              <span className="mj-check-n">{String(i + 1).padStart(2, "0")}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ § 02 · METHOD (dark, vertical timeline) ═══════════════ */
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
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true" />
          {steps.map((s, i) => (
            <motion.div key={i} className="mj-vstep"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.08 * i, ease: [0.16, 0.84, 0.32, 1] }}>
              <div className="mj-vstep-mark">
                <span className="mj-vstep-n">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="mj-vstep-card">
                <div className="mj-vstep-cardtop">
                  <span className="mj-vstep-tag">STEP {String(i + 1).padStart(2, "0")}</span>
                  <span className="mj-vstep-foot">{i + 1 < steps.length ? `→ ${String(i + 2).padStart(2, "0")}` : "RANK ACHIEVED ★"}</span>
                </div>
                <h3 className="mj-vstep-t">{s.title}</h3>
                <p className="mj-vstep-d">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ § 04 · TEST ANALYSIS (animated) ═══════════════ */
const TA_STEPS = ["You enter test data", "AI analyses your paper", "Trends visualised", "Strategies + rank predicted"];
function TrendLine({ data, color, target }) {
  const series = target ? [...data, ...target] : data;
  const max = Math.max(...series, 1), min = Math.min(...series);
  const W = 300, H = 88, n = Math.max(data.length, 2);
  const y = (v) => H - 8 - ((v - min) / ((max - min) || 1)) * (H - 22);
  const pts = data.map((v, i) => [(i / (n - 1)) * W, y(v)]);
  const line = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mj-ta-svg" preserveAspectRatio="none" aria-hidden="true">
      {target && (
        <motion.line x1="0" y1={y(target[0])} x2={W} y2={y(target[0])} stroke={T.ink} strokeWidth="2" strokeDasharray="3 4" opacity=".4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
      )}
      <motion.polyline points={line} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeInOut" }} />
      {pts.map((p, i) => (
        <motion.circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill="#fff" stroke={color} strokeWidth="1.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }} />
      ))}
    </svg>
  );
}
function TestAnalysis({ cfg }) {
  const m = cfg.metrics || {};
  const you = m.growth?.you || [84, 120, 150, 178, 196, 214];
  const total = 300;
  const scored = you[you.length - 1] || 214;
  const prev = you[you.length - 2] || scored;
  const pctUp = prev ? Math.max(Math.round(((scored - prev) / prev) * 100), 1) : 9;
  const accN = parseInt((m.outcomes || []).find((o) => /accuracy/i.test(o.l))?.v || "86", 10) || 86;
  const accTrend = [accN - 16, accN - 12, accN - 14, accN - 8, accN - 5, accN - 3, accN].map((v) => Math.max(v, 40));
  const target = you.map(() => Math.round(total * 0.75));
  const weak = m.test?.weak || ["Rotational Motion", "Thermodynamics", "p-Block"];
  const exam = cfg.tracks?.[0]?.exam || "JEE Main 2026";
  const strategies = [
    { Ic: BookOpen, t: `Add 1 hr/day to ${weak[0]} — your weakest area this week.` },
    { Ic: Zap, t: `Attack ${weak[1] || "Physics"}${weak[2] ? " & " + weak[2] : ""} first — the most recurring weak chapters.` },
    { Ic: Clock, t: "Reserve the last 10 min per paper to recheck — silly errors cost ~5 marks." },
    { Ic: Target, t: `Accuracy at ${accN}% — skip low-confidence questions to dodge negatives.` },
  ];
  const rank = [
    { v: "9,842", l: "All-India" }, { v: "2,410", l: "Category" },
    { v: "99.31", l: "percentile" }, { v: "1.8k–2.6k", l: "likely band" },
  ];

  const [stage, setStage] = useState(0);
  const rootRef = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setStage(3); return; }
    const timers = [];
    const cycle = () => {
      setStage(0);
      timers.push(setTimeout(() => setStage(1), 1400));
      timers.push(setTimeout(() => setStage(2), 2700));
      timers.push(setTimeout(() => setStage(3), 4500));
      timers.push(setTimeout(cycle, 9500));
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; cycle(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, []);
  const active = stage === 0 ? 1 : stage === 1 ? 2 : stage === 2 ? 3 : 4;

  return (
    <section className="mj-section mj-ta" ref={rootRef}>
      <div className="mj-wrap">
        <Reveal className="mj-sec-head">
          <span className="mj-ta-pill"><span className="mj-dot mj-dot-live" /> LIVE PRODUCT PREVIEW</span>
          <div><h2 className="mj-display mj-display-lg">See how your test turns<br />into a <em>game plan.</em></h2></div>
          <p className="mj-sec-sub">Enter your marks. Watch the analysis spot the trend, predict your rank, and hand you the next steps.</p>
        </Reveal>

        <div className="mj-ta-steps">
          {TA_STEPS.map((s, i) => {
            const num = i + 1;
            const st = num < active ? "done" : num === active ? "on" : "off";
            return (
              <div key={i} className={`mj-ta-step mj-ta-step-${st}`}>
                <span className="mj-ta-stepn">{num < active ? <Check size={13} strokeWidth={3} /> : num}</span>
                <span className="mj-ta-steptxt">{s}</span>
              </div>
            );
          })}
        </div>

        <Reveal delay={0.06} className="mj-ta-grid">
          <div className="mj-ta-form">
            <div className="mj-ta-formhead">
              <strong>Add a test result</strong>
              <span className="mj-ta-tabs"><i className="mj-ta-tab-on">Mock</i><i>Mains</i><i>Advanced</i></span>
            </div>
            <label className="mj-ta-field"><span>Test name</span><div className="mj-ta-input">Mock 7</div></label>
            <div className="mj-ta-frow">
              <label className="mj-ta-field"><span>Total marks</span><div className="mj-ta-input">{total}</div></label>
              <label className="mj-ta-field"><span>Marks scored</span><div className="mj-ta-input">{scored}</div></label>
            </div>
            <div className="mj-ta-frow">
              <label className="mj-ta-field"><span>Correct</span><div className="mj-ta-input">71</div></label>
              <label className="mj-ta-field"><span>Wrong</span><div className="mj-ta-input">9</div></label>
            </div>
            <label className="mj-ta-field"><span>Skipped</span><div className="mj-ta-input">10</div></label>
            <button className={`mj-ta-btn ${stage >= 1 ? "mj-ta-btn-on" : ""}`}>
              {stage >= 1 && stage < 3 ? "Analysing…" : "+ Analyse this test"}
            </button>
            <AnimatePresence>
              {stage >= 3 && (
                <motion.div key="banner" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mj-ta-banner">
                  <Check size={15} strokeWidth={3} /> Great work — your score is up {pctUp}% vs last mock. Momentum going.
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {stage >= 3 && (
                <motion.div key="rank" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.1 }} className="mj-ta-rank">
                  <span className="mj-ta-rank-l">🎯 PREDICTED {exam.toUpperCase()} RANK</span>
                  <div className="mj-ta-rank-row">
                    {rank.map((r, i) => <div key={i} className="mj-ta-rank-c"><strong>{r.v}</strong><span>{r.l}</span></div>)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mj-ta-right">
            <div className="mj-ta-card">
              <div className="mj-ta-cardhead"><strong>Score trend</strong><span>vs 75% target</span></div>
              {stage >= 2 ? <TrendLine data={you} target={target} color={T.coral} /> : <div className="mj-ta-waiting">Waiting for data…</div>}
              <div className="mj-ta-legend"><span><i style={{ background: T.coral }} /> You</span><span><i style={{ background: T.ink }} /> Target</span></div>
            </div>
            <div className="mj-ta-card">
              <div className="mj-ta-cardhead"><strong>Accuracy trend</strong><span>correct ÷ attempted</span></div>
              {stage >= 2 ? <TrendLine data={accTrend} color="#16a34a" /> : <div className="mj-ta-waiting">Waiting for data…</div>}
            </div>
            <div className="mj-ta-card">
              <div className="mj-ta-cardhead"><strong>💡 Strategies to do better</strong></div>
              {stage >= 3 ? (
                <div className="mj-ta-strat">
                  {strategies.map((s, i) => (
                    <motion.div key={i} className="mj-ta-strat-i" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                      <span className="mj-ta-strat-ic"><s.Ic size={14} /></span>
                      <span>{s.t}</span>
                    </motion.div>
                  ))}
                </div>
              ) : <div className="mj-ta-waiting mj-ta-waiting-sm">Personalised tips appear after analysis…</div>}
            </div>
          </div>
        </Reveal>
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
              <span className="mj-wa-av"><GraduationCap size={18} /><span className="mj-wa-online" /></span>
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

/* ═══════════════ § 08 · ALUMNI (proof) ═══════════════ */
function Proof({ cfg }) {
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal className="mj-sec-head">
          <div><h2 className="mj-display mj-display-lg">Chose to be <em>mentored,</em><br />not just taught.</h2></div>
          <p className="mj-sec-sub">Real messages from students who stopped drifting — the week a rank moved, a backlog cleared, a panic turned into a plan.</p>
        </Reveal>
        <div className="mj-proof-grid">
        <div className="mj-proof-head">
          <div className="mj-stars">
            {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={18} fill={T.coral} color={T.coral} />)}
            <span>4.9 / 5 · 1,240 REVIEWS</span>
          </div>
          <div className="mj-proof-stats">
            <div className="mj-proof-stat"><strong>92%</strong><span>improved their rank within 8 weeks</span></div>
            <div className="mj-proof-stat"><strong>1,240+</strong><span>aspirants mentored 1-on-1</span></div>
            <div className="mj-proof-stat"><strong>18,400</strong><span>average ranks jumped</span></div>
          </div>
          <div className="mj-proof-quote">
            <span className="mj-quote-mark">&ldquo;</span>
            <p>The difference wasn&rsquo;t more content. It was one person who refused to let me drift.</p>
          </div>
        </div>
        <div className="mj-proof-wall" aria-label="Student testimonials">
          {[0, 1, 2].map((col) => {
            const base = cfg.testimonials || [];
            if (!base.length) return null;
            const rot = base.map((_, k) => base[(k + col) % base.length]);
            const cards = [...rot, ...rot];
            return (
              <div key={col} className={`mj-wall-col mj-wall-col-${col}`}>
                <div className="mj-wall-track">
                  {cards.map((t, i) => (
                    <div key={i} className="mj-quote-card" aria-hidden={i >= rot.length}>
                      <span className="mj-quote-mark">&ldquo;</span>
                      <p className="mj-quote-t">{t.quote}</p>
                      <div className="mj-quote-by">
                        <span className="mj-quote-av">{t.name[0]}</span>
                        <div><strong>{t.name}</strong><span>{t.improvement}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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
  const p = MENTOR_PLANS[plan] || { amount: 1, old: 7999 };
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
        <Reveal>
          <h2 className="mj-display mj-display-lg mj-faq-h">Everything you're<br /><em>wondering.</em></h2>
        </Reveal>
        <div className="mj-faqs">
          {(cfg.faqs || []).map((f, i) => (
            <div key={i} className={open === i ? "mj-faq mj-faq-open" : "mj-faq"}>
              <button className="mj-faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="mj-faq-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="mj-faq-qt">{f.q}</span>
                <span className="mj-faq-ic"><Plus size={18} /></span>
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
      <div className="mj-wrap mj-talk-grid">
        <Reveal>          <h2 className="mj-display mj-display-lg">Not sure?<br /><em>Let&rsquo;s talk.</em></h2>
          <p className="mj-body">A 15-minute call, no pressure. We&rsquo;ll listen to where you are,
            share what the year could look like, and let you decide.</p>
          <div className="mj-reach">
            <span>REACH US · HELLO@COLLEGEPARICHAY.IN</span>
            <span>CALL · +91 78775 96464</span>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mj-form">
          <form onSubmit={submit}>
            <div className="mj-form-row">
              <label className="mj-field"><span>Your name</span><input required value={f.name} onChange={set("name")} placeholder="Your name" /></label>
              <label className="mj-field"><span>Phone</span><input required inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="Phone" /></label>
            </div>
            <label className="mj-field"><span>Email</span><input type="email" value={f.email} onChange={set("email")} placeholder="Email" /></label>
            <label className="mj-field"><span>Tell us about your goal</span><textarea rows={3} value={f.goal} onChange={set("goal")} placeholder="Tell us about your goal" /></label>
            <button className="mj-btn-dark mj-btn-block" type="submit">Request a callback <Send size={16} /></button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ variant tabs + floating enrol ═══════════════ */
function VariantTabs({ variant }) {
  return (
    <div className="mj-wrap mj-tabs">
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
        description="1-on-1 JEE & NEET mentorship by IIT alumni — daily targets, weekly test analysis, live tracking and parent reports. Limited seats. Start at ₹1 on CollegeParichay."
        path={`/mentorship/${variant}`}
      />
      <VariantTabs variant={variant} />
      <Hero cfg={cfg} plan={plan} year={year} exam={exam} openEnrol={openEnrol} scrollTo={scrollTo} />
      <StatBand cfg={cfg} />
      <Qualifier cfg={cfg} />
      <Method cfg={cfg} />
      <LiveTracking cfg={cfg} />
      <TestAnalysis cfg={cfg} />
      <ForParents cfg={cfg} />
      <WhatsApp />
      <Proof cfg={cfg} />
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
.mj em { font-family:'Playfair Display',serif; font-style:italic; color:${T.coral}; font-weight:800; }
.mj-display { font-family:'Playfair Display',serif; font-weight:800; color:${T.ink}; letter-spacing:-.5px; line-height:1.08; margin:14px 0 0; }
.mj-display em { color:${T.coral}; }
.mj-display-lg { font-size:clamp(2rem,4.4vw,3.3rem); }
.mj-display-xl { font-size:clamp(2.3rem,5.4vw,4rem); }
.mj-on-navy { color:${T.onNavy}; }
.mj-label { display:inline-flex; align-items:center; gap:8px; padding:5px 13px; border:1px solid ${T.lineDk}; border-radius:6px; background:${T.card}; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.body}; }
.mj-label-dark { background:transparent; border-color:${T.navyLine}; color:${T.onNavyMute}; }
.mj-body { font:400 1.05rem/1.7 'DM Sans',sans-serif; color:${T.body}; margin:20px 0 0; max-width:460px; }
.mj-section { padding:clamp(64px,9vw,110px) 0; position:relative; }

/* variant tabs */
.mj-tabs { display:flex; justify-content:center; gap:8px; padding-top:112px; padding-bottom:2px; flex-wrap:wrap; position:relative; z-index:2; }
.mj-tab { text-decoration:none; padding:8px 16px; border-radius:50px; border:1px solid ${T.line}; background:${T.card}; color:${T.body}; font:700 .82rem/1 'Space Grotesk',sans-serif; transition:.16s; }
.mj-tab:hover { border-color:${T.coral}; color:${T.coralDk}; }
.mj-tab-on { background:${T.ink}; border-color:${T.ink}; color:#fff; }

/* hero */
.mj-hero { position:relative; padding:22px 0 70px; overflow:hidden; border-bottom:1px solid ${T.line}; }
.mj-watermark { position:absolute; top:-4%; left:50%; transform:translateX(-50%); font-family:'Playfair Display',serif; font-style:italic; font-weight:900; font-size:min(42vw,600px); line-height:1; color:transparent; -webkit-text-stroke:1.5px ${T.lineDk}; opacity:.28; pointer-events:none; user-select:none; z-index:0; }
.mj-hero-inner { position:relative; z-index:1; }
.mj-hero-meta { display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; }
.mj-pill { display:inline-flex; align-items:center; gap:8px; padding:7px 14px; border:1px solid ${T.lineDk}; border-radius:50px; background:${T.card}; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.body}; }
.mj-pill-warn { color:${T.coralDk}; border-color:${T.coralSoft}; background:${T.coralSoft}; }
.mj-issue { font:700 .7rem/1 'Space Grotesk',sans-serif; letter-spacing:.16em; color:${T.muted}; text-align:center; }
.mj-dot { width:8px; height:8px; border-radius:50%; background:${T.coral}; flex-shrink:0; }
.mj-dot-live { background:#22c55e; box-shadow:0 0 0 0 rgba(34,197,94,.5); animation:mjpulse 1.8s infinite; }
@keyframes mjpulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,.5);} 100%{box-shadow:0 0 0 8px rgba(34,197,94,0);} }
.mj-hero-grid { display:grid; grid-template-columns:1.05fr .95fr; gap:56px; align-items:center; margin-top:clamp(16px,3vw,40px); }
.mj-hero-h1 { position:relative; font-family:'Playfair Display',serif; font-weight:800; font-size:clamp(1.9rem,3.5vw,2.95rem); line-height:1.24; letter-spacing:-.4px; color:${T.ink}; margin:0; text-shadow:0 1px 0 ${T.paper}; }
.mj-hero-cta { display:flex; align-items:center; gap:22px; flex-wrap:wrap; margin-top:34px; }
.mj-btn-dark { display:inline-flex; align-items:center; gap:9px; padding:15px 26px; border:none; border-radius:12px; background:${T.ink}; color:#fff; font:700 .98rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:transform .16s, background .16s; }
.mj-btn-dark:hover { background:#000; transform:translateY(-2px); }
.mj-btn-link { display:inline-flex; align-items:center; gap:10px; background:none; border:none; cursor:pointer; font:800 .74rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:${T.ink}; }
.mj-btn-circ { display:grid; place-items:center; width:30px; height:30px; border:1px solid ${T.lineDk}; border-radius:50%; transition:.16s; }
.mj-btn-link:hover .mj-btn-circ { background:${T.coral}; border-color:${T.coral}; color:#fff; }
.mj-btn-outline { display:inline-flex; align-items:center; gap:8px; margin-top:26px; padding:13px 24px; border:1px solid ${T.lineDk}; border-radius:12px; background:${T.card}; color:${T.ink}; font:700 .9rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:.16s; }
.mj-btn-outline:hover { border-color:${T.coral}; color:${T.coralDk}; }
.mj-btn-block { width:100%; justify-content:center; margin-top:22px; }

.mj-hero-visual { position:relative; }
.mj-hero-imgcard { position:relative; border-radius:22px; overflow:hidden; background:${T.navy}; border:1px solid ${T.line}; box-shadow:14px 14px 0 -2px ${T.coral}, 0 30px 60px -30px rgba(0,0,0,.4); }
.mj-hero-imgcard img { width:100%; display:block; }
.mj-badge-jump { position:absolute; top:-18px; right:14px; z-index:3; display:flex; flex-direction:column; align-items:flex-end; gap:1px; padding:10px 16px; border-radius:14px; background:${T.coral}; color:#fff; font:800 1.15rem/1 'Playfair Display',serif; box-shadow:0 12px 26px -10px rgba(255,105,61,.7); }
.mj-badge-jump b { font:800 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; opacity:.85; }
.mj-badge-live { position:absolute; bottom:-16px; left:14px; z-index:3; display:inline-flex; align-items:center; gap:8px; padding:9px 16px; border-radius:50px; background:${T.card}; border:1px solid ${T.line}; font:700 .78rem/1 'Space Grotesk',sans-serif; color:${T.ink}; box-shadow:0 14px 30px -14px rgba(0,0,0,.35); }

/* stat band */
.mj-statband { border-bottom:1px solid ${T.line}; }
.mj-stat-row { display:grid; grid-template-columns:repeat(4,1fr); }
.mj-stat { padding:34px 10px 34px 0; border-left:1px solid ${T.line}; padding-left:26px; }
.mj-stat:first-child { border-left:none; padding-left:0; }
.mj-stat-v { font:800 clamp(1.7rem,3vw,2.4rem)/1 'Playfair Display',serif; color:${T.ink}; }
.mj-stat-l { margin-top:8px; font:700 .74rem/1.3 'Space Grotesk',sans-serif; letter-spacing:.06em; text-transform:uppercase; color:${T.muted}; }

/* qualifier */
.mj-lead { font-family:'Playfair Display',serif; font-weight:600; font-size:clamp(1.3rem,2.6vw,2rem); line-height:1.4; color:${T.ink}; max-width:820px; margin:0 0 44px; }
.mj-checklist { display:flex; flex-direction:column; gap:16px; }
.mj-check-card { display:flex; align-items:center; gap:16px; width:min(620px,100%); padding:20px 24px; background:${T.card}; border:1px solid ${T.line}; border-radius:16px; box-shadow:0 10px 30px -24px rgba(0,0,0,.4); }
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
.mj-vstep-mark { position:relative; z-index:2; display:grid; place-items:center; width:64px; height:64px; border-radius:50%; background:${T.card}; border:1.5px solid ${T.lineDk}; box-shadow:0 0 0 6px ${T.paper}, 0 10px 24px -16px rgba(0,0,0,.4); transition:.28s; }
.mj-vstep-n { font:800 1.5rem/1 'Playfair Display',serif; color:${T.coral}; }
.mj-vstep-card { border:1px solid ${T.line}; border-radius:18px; background:${T.card}; padding:22px 24px; box-shadow:0 14px 34px -28px rgba(0,0,0,.35); transition:transform .28s, border-color .28s, box-shadow .28s; }
.mj-vstep:hover .mj-vstep-card { transform:translateX(6px); border-color:${T.coral}; box-shadow:0 24px 48px -30px rgba(255,105,61,.5); }
.mj-vstep:hover .mj-vstep-mark { border-color:${T.coral}; background:${T.coral}; box-shadow:0 0 0 6px ${T.paper}, 0 12px 26px -12px rgba(255,105,61,.6); }
.mj-vstep:hover .mj-vstep-n { color:#fff; }
.mj-vstep-cardtop { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px; }
.mj-vstep-tag { padding:4px 10px; border:1px solid ${T.lineDk}; border-radius:6px; font:800 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.muted}; }
.mj-vstep-foot { font:800 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:${T.coral}; }
.mj-vstep-t { font:700 1.3rem/1.2 'Playfair Display',serif; color:${T.ink}; margin:0; }
.mj-vstep-d { font:400 .94rem/1.6 'DM Sans',sans-serif; color:${T.body}; margin:8px 0 0; }

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
.mj-bignum { font:800 clamp(2.6rem,5vw,3.6rem)/1 'Playfair Display',serif; margin-top:14px; }
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
.mj-ta-step:not(:last-child)::after { content:""; width:26px; height:1.5px; margin-left:8px; background:${T.lineDk}; }
.mj-ta-stepn { display:grid; place-items:center; width:26px; height:26px; border-radius:50%; background:${T.card}; border:1.5px solid ${T.lineDk}; font:800 .74rem/1 'Space Grotesk',sans-serif; color:${T.muted}; flex-shrink:0; transition:.3s; }
.mj-ta-step-on .mj-ta-stepn { background:${T.coral}; border-color:${T.coral}; color:#fff; box-shadow:0 0 0 5px ${T.coralSoft}; }
.mj-ta-step-done .mj-ta-stepn { background:${T.coral}; border-color:${T.coral}; color:#fff; }
.mj-ta-steptxt { font:700 .8rem/1.2 'Space Grotesk',sans-serif; color:${T.body}; white-space:nowrap; }
.mj-ta-step-off .mj-ta-steptxt { color:${T.muted}; }
.mj-ta-grid { display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:start; }
.mj-ta-form { background:${T.card}; border:1px solid ${T.line}; border-radius:18px; padding:26px; box-shadow:0 20px 44px -34px rgba(0,0,0,.35); }
.mj-ta-formhead { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:20px; }
.mj-ta-formhead strong { font:800 1.05rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.mj-ta-tabs { display:inline-flex; gap:3px; padding:3px; border-radius:9px; background:${T.paper2}; }
.mj-ta-tabs i { font:700 .66rem/1 'Space Grotesk',sans-serif; font-style:normal; padding:5px 10px; border-radius:6px; color:${T.muted}; }
.mj-ta-tab-on { background:${T.card}; color:${T.coralDk} !important; box-shadow:0 1px 3px rgba(0,0,0,.12); }
.mj-ta-frow { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.mj-ta-field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.mj-ta-field span { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.04em; color:${T.muted}; }
.mj-ta-input { padding:11px 13px; border-radius:9px; border:1px solid ${T.line}; background:${T.paper}; font:600 .92rem/1 'DM Sans',sans-serif; color:${T.ink}; }
.mj-ta-btn { width:100%; margin-top:6px; padding:14px; border:none; border-radius:11px; background:${T.coralSoft}; color:${T.coralDk}; font:800 .92rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:.3s; }
.mj-ta-btn-on { background:linear-gradient(135deg,#FF8A47,#F1531F); color:#fff; box-shadow:0 14px 30px -14px rgba(255,105,61,.7); }
.mj-ta-banner { display:flex; align-items:center; gap:9px; margin-top:16px; padding:13px 15px; border-radius:11px; background:#e9f8ee; border:1px solid #bbe6c8; font:600 .84rem/1.3 'DM Sans',sans-serif; color:#15803d; }
.mj-ta-banner svg { flex-shrink:0; }
.mj-ta-rank { margin-top:14px; padding:16px 18px; border-radius:13px; border:1px dashed ${T.lineDk}; background:${T.paper2}; }
.mj-ta-rank-l { font:800 .6rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.body}; }
.mj-ta-rank-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:12px; }
.mj-ta-rank-c strong { display:block; font:800 1.15rem/1 'Playfair Display',serif; color:${T.coralDk}; }
.mj-ta-rank-c span { font:600 .58rem/1.2 'DM Sans',sans-serif; color:${T.muted}; }
.mj-ta-right { display:flex; flex-direction:column; gap:16px; }
.mj-ta-card { background:${T.card}; border:1px solid ${T.line}; border-radius:16px; padding:20px 22px; box-shadow:0 16px 36px -30px rgba(0,0,0,.3); }
.mj-ta-cardhead { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.mj-ta-cardhead strong { font:800 .96rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.mj-ta-cardhead span { font:600 .68rem/1 'Space Grotesk',sans-serif; color:${T.muted}; }
.mj-ta-svg { width:100%; height:88px; display:block; overflow:visible; }
.mj-ta-waiting { display:grid; place-items:center; height:88px; font:600 .82rem/1 'DM Sans',sans-serif; color:${T.muted}; }
.mj-ta-waiting-sm { height:70px; font-style:italic; }
.mj-ta-legend { display:flex; gap:18px; margin-top:12px; }
.mj-ta-legend span { display:inline-flex; align-items:center; gap:6px; font:600 .7rem/1 'DM Sans',sans-serif; color:${T.body}; }
.mj-ta-legend i { width:9px; height:9px; border-radius:50%; }
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
.mj-dash-name { font:800 1.9rem/1.05 'Playfair Display',serif; color:${T.ink}; margin:8px 0 6px; }
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
.mj-dring-c strong { font:800 1.7rem/1 'Playfair Display',serif; color:${T.ink}; }
.mj-dring-c span { font:700 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.muted}; margin-top:3px; text-transform:uppercase; }
.mj-dash-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.mj-dash-stat { padding:16px 18px; border-radius:14px; background:${T.paper2}; border:1px solid ${T.line}; }
.mj-dash-stat-l { font:700 .6rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:${T.muted}; }
.mj-dash-stat-v { display:block; font:800 2rem/1 'Playfair Display',serif; color:${T.ink}; margin-top:8px; }
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
.mj-dash-next strong { font:700 1.15rem/1.1 'Playfair Display',serif; color:#fff; margin-top:4px; }
.mj-dash-next-s { font:500 .78rem/1.3 'DM Sans',sans-serif; color:rgba(255,255,255,.72); }

/* for parents */
.mj-parent-card { display:grid; grid-template-columns:.92fr 1.08fr; align-items:stretch; border-radius:20px; overflow:hidden; border:1px solid ${T.lineDk};
  box-shadow:20px 22px 0 -2px ${T.coral}, 0 40px 70px -40px rgba(0,0,0,.32); transition:transform .3s, box-shadow .3s; }
.mj-parent-card:hover { transform:translate(-3px,-3px); box-shadow:26px 28px 0 -2px ${T.coral}, 0 46px 76px -44px rgba(0,0,0,.38); }
.mj-booklet { display:flex; flex-direction:column; padding:36px 34px; color:#fff;
  background:linear-gradient(160deg, #FF7A3C 0%, #F1531F 60%, #E0481B 100%); position:relative; overflow:hidden; }
.mj-booklet::before { content:""; position:absolute; inset:0; background:
  repeating-linear-gradient(0deg, transparent 0 33px, rgba(255,255,255,.07) 33px 34px),
  repeating-linear-gradient(90deg, transparent 0 33px, rgba(255,255,255,.07) 33px 34px); pointer-events:none; }
.mj-booklet > * { position:relative; }
.mj-booklet-pill { align-self:flex-start; display:inline-flex; align-items:center; gap:7px; padding:7px 14px; border-radius:50px; background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.25); font:800 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; }
.mj-booklet-h { font:800 2.1rem/1.08 'Playfair Display',serif; letter-spacing:-.5px; margin:20px 0 0; color:#fff; }
.mj-booklet-sub { font:400 .98rem/1.55 'DM Sans',sans-serif; color:rgba(255,255,255,.9); margin:14px 0 0; max-width:400px; }
.mj-booklet-div { height:1px; background:rgba(255,255,255,.22); margin:24px 0 22px; }
.mj-booklet-lbl { font:800 .6rem/1 'Space Grotesk',sans-serif; letter-spacing:.16em; color:rgba(255,255,255,.7); }
.mj-booklet-lbl2 { margin-top:22px; }
.mj-booklet-name { display:block; font:800 1.35rem/1.1 'Playfair Display',serif; color:#fff; margin:8px 0 4px; }
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
.mj-weekly-name { font:600 1.9rem/1 'Playfair Display',serif; font-style:italic; color:${T.ink}; letter-spacing:-.5px; }
.mj-weekly-vol { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.18em; color:${T.body}; text-align:right; white-space:nowrap; }
.mj-weekly-body { display:grid; grid-template-columns:1.32fr 1fr; gap:28px; margin-top:24px; }
.mj-weekly-featured { border-right:1px solid ${T.line}; padding-right:26px; }
.mj-featured-lbl { font:800 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.18em; color:${T.coral}; }
.mj-glance-lbl { display:block; margin-bottom:12px; font:800 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.18em; color:${T.ink}; }
.mj-featured-quote { font:700 1.6rem/1.16 'Playfair Display',serif; color:${T.ink}; margin:13px 0 14px; letter-spacing:-.4px; }
.mj-featured-body { font:400 .92rem/1.6 'DM Sans',sans-serif; color:#5c6773; margin:0 0 18px; }
.mj-weekly-photo { position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; min-height:180px; border-radius:10px; border:1px solid ${T.lineDk};
  background:repeating-linear-gradient(45deg, transparent 0 9px, rgba(27,27,36,.09) 9px 10px), ${T.paper2}; }
.mj-photo-ic { display:grid; place-items:center; width:36px; height:36px; border-radius:50%; background:${T.card}; color:${T.coral}; box-shadow:0 4px 10px -4px rgba(0,0,0,.25); margin-bottom:4px; }
.mj-photo-t { font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.16em; color:${T.body}; }
.mj-photo-s { font:700 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.16em; color:${T.muted}; }
.mj-glance-row { display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:12px 0; border-bottom:1px solid ${T.line}; font:500 .82rem/1.3 'DM Sans',sans-serif; color:${T.body}; }
.mj-glance-row span { flex-shrink:0; }
.mj-glance-row strong { font:600 .98rem/1.25 'Playfair Display',serif; color:${T.ink}; text-align:right; }
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
.mj-phone-cap { font:italic 600 1rem/1 'Playfair Display',serif; color:${T.body}; }

.mj-wa-header { background:linear-gradient(145deg,#FF8B48 0%,#FA5E28 55%,#EF5320 100%); color:#fff; padding-top:8px; box-shadow:0 6px 16px -10px rgba(0,0,0,.5); z-index:3; }
.mj-wa-head { display:flex; align-items:center; justify-content:space-between; padding:2px 20px 3px; }
.mj-wa-status { font:800 .72rem/1 'Space Grotesk',sans-serif; }
.mj-wa-bars { display:flex; align-items:flex-end; gap:3px; }
.mj-wa-bars i { width:3px; background:#fff; border-radius:1px; } .mj-wa-bars i:nth-child(1){height:5px;} .mj-wa-bars i:nth-child(2){height:8px;} .mj-wa-bars i:nth-child(3){height:11px;}
.mj-wa-top { display:flex; align-items:center; gap:9px; padding:6px 14px 12px; }
.mj-wa-av { position:relative; display:grid; place-items:center; width:38px; height:38px; border-radius:50%; background:#fff; color:${T.coralDk}; flex-shrink:0; }
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

/* proof */
.mj-proof-grid { display:grid; grid-template-columns:.8fr 1.2fr; gap:44px; align-items:start; }
.mj-proof-head { position:sticky; top:110px; }
.mj-stars { display:flex; align-items:center; gap:4px; margin-top:22px; }
.mj-stars span { margin-left:10px; font:700 .74rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; color:${T.muted}; }
.mj-proof-lead { font:400 1.02rem/1.65 'DM Sans',sans-serif; color:${T.body}; margin:26px 0 0; max-width:380px; }
.mj-proof-stats { display:flex; flex-direction:column; gap:2px; margin:28px 0 0; border-top:1px solid ${T.line}; }
.mj-proof-stat { display:flex; align-items:baseline; gap:14px; padding:15px 0; border-bottom:1px solid ${T.line}; }
.mj-proof-stat strong { font:800 1.7rem/1 'Playfair Display',serif; color:${T.coral}; min-width:96px; }
.mj-proof-stat span { font:500 .88rem/1.35 'DM Sans',sans-serif; color:${T.body}; }
.mj-proof-quote { margin-top:28px; padding:22px 24px; border-radius:16px; background:${T.ink}; color:#fff; box-shadow:0 24px 44px -30px rgba(0,0,0,.6); }
.mj-proof-quote .mj-quote-mark { color:${T.coral}; }
.mj-proof-quote p { font:600 1.05rem/1.45 'Playfair Display',serif; font-style:italic; color:#fff; margin:2px 0 0; }
.mj-proof-wall { position:relative; display:grid; grid-template-columns:repeat(3,1fr); gap:16px; height:600px; overflow:hidden;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 10%,#000 90%,transparent 100%);
  mask-image:linear-gradient(180deg,transparent 0,#000 10%,#000 90%,transparent 100%); }
.mj-wall-col { overflow:hidden; }
.mj-wall-track { display:block; animation:mjWall 40s linear infinite; will-change:transform; }
.mj-wall-col-0 .mj-wall-track { animation-duration:44s; }
.mj-wall-col-1 .mj-wall-track { animation-duration:56s; }
.mj-wall-col-2 .mj-wall-track { animation-duration:50s; animation-direction:reverse; }
.mj-proof-wall:hover .mj-wall-track { animation-play-state:paused; }
@keyframes mjWall { from { transform:translateY(0); } to { transform:translateY(-50%); } }
.mj-quote-card { margin-bottom:16px; background:${T.card}; border:1px solid ${T.line}; border-radius:16px; padding:22px; box-shadow:0 12px 30px -24px rgba(0,0,0,.4); }
.mj-quote-mark { font:800 2.4rem/.6 'Playfair Display',serif; color:${T.coral}; }
.mj-quote-t { font:500 .98rem/1.55 'DM Sans',sans-serif; color:${T.ink}; margin:6px 0 18px; }
.mj-quote-by { display:flex; align-items:center; gap:11px; }
.mj-quote-av { display:grid; place-items:center; width:36px; height:36px; border-radius:50%; background:${T.coralSoft}; color:${T.coralDk}; font:800 .9rem/1 'Space Grotesk',sans-serif; flex-shrink:0; }
.mj-quote-by strong { display:block; font:700 .88rem/1.2 'Space Grotesk',sans-serif; color:${T.ink}; }
.mj-quote-by span { font:600 .74rem/1.2 'DM Sans',sans-serif; color:${T.coralDk}; }

/* pricing */
.mj-price-card { display:grid; grid-template-columns:.85fr 1.15fr; margin:44px auto 0; max-width:960px; border-radius:22px; overflow:hidden; border:1px solid ${T.line}; box-shadow:0 40px 80px -50px rgba(0,0,0,.4); }
.mj-price-left { background:${T.coral}; color:#fff; padding:36px 30px; display:flex; flex-direction:column; }
.mj-price-kicker { font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; opacity:.9; }
.mj-price-plan { font:800 1.6rem/1.1 'Playfair Display',serif; margin-top:8px; }
.mj-price-amt { font:800 3.6rem/1 'Playfair Display',serif; margin-top:auto; }
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
.mj-faq-h { margin-bottom:40px; }
.mj-faqs { border-top:1px solid ${T.lineDk}; }
.mj-faq { border-bottom:1px solid ${T.lineDk}; }
.mj-faq-q { display:flex; align-items:center; gap:20px; width:100%; padding:24px 4px; background:none; border:none; cursor:pointer; text-align:left; }
.mj-faq-n { font:700 .8rem/1 'Space Grotesk',sans-serif; color:${T.muted}; }
.mj-faq-qt { flex:1; font:700 clamp(1.05rem,2vw,1.4rem)/1.3 'Playfair Display',serif; color:${T.ink}; }
.mj-faq-ic { display:grid; place-items:center; width:34px; height:34px; border:1px solid ${T.lineDk}; border-radius:50%; color:${T.ink}; transition:.2s; flex-shrink:0; }
.mj-faq-open .mj-faq-ic { background:${T.coral}; border-color:${T.coral}; color:#fff; transform:rotate(45deg); }
.mj-faq-a { overflow:hidden; }
.mj-faq-a p { font:400 1rem/1.7 'DM Sans',sans-serif; color:${T.body}; padding:0 54px 26px; max-width:760px; margin:0; }

/* talk */
.mj-talk-grid { display:grid; grid-template-columns:.85fr 1.15fr; gap:48px; align-items:center; }
.mj-reach { display:flex; flex-direction:column; gap:8px; margin-top:30px; font:700 .74rem/1.4 'Space Grotesk',sans-serif; letter-spacing:.08em; color:${T.muted}; }
.mj-form { background:${T.card}; border:1px solid ${T.line}; border-radius:22px; padding:34px; box-shadow:0 30px 60px -40px rgba(0,0,0,.3); }
.mj-form-row { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.mj-field { display:flex; flex-direction:column; gap:6px; margin-bottom:22px; }
.mj-field span { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; text-transform:uppercase; color:${T.muted}; }
.mj-field input, .mj-field textarea { border:none; border-bottom:1.5px solid ${T.line}; background:none; padding:8px 2px; font:500 1rem/1.4 'DM Sans',sans-serif; color:${T.ink}; outline:none; resize:vertical; transition:border-color .16s; }
.mj-field input:focus, .mj-field textarea:focus { border-color:${T.coral}; }

/* responsive */
@media (max-width:940px) {
  .mj-hero-grid, .mj-parent-card, .mj-proof-grid, .mj-talk-grid, .mj-price-card, .mj-dash-body, .mj-weekly-body, .mj-ta-grid { grid-template-columns:1fr; }
  .mj-ta-step:not(:last-child)::after { display:none; }
  .mj-hero-visual { order:-1; }
  .mj-sec-head, .mj-dark-head { flex-direction:column; align-items:center; }
  .mj-prog-grid { grid-template-columns:1fr 1fr; } .mj-navy-card { grid-row:auto; grid-column:span 2; }
  .mj-phones { justify-content:flex-start; }
  .mj-proof-wall { grid-template-columns:repeat(2,1fr); height:560px; } .mj-wall-col-2 { display:none; } .mj-proof-head { position:static; }
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
  .mj-badge-jump { font-size:.95rem; } .mj-watermark { font-size:64vw; }
}
@media (prefers-reduced-motion: reduce) {
  .mj-wall-track { animation:none; }
  .mj-proof-wall { height:auto; -webkit-mask-image:none; mask-image:none; }
}
`;
