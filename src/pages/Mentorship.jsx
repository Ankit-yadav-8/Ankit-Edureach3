import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, ChevronDown, Play, ShieldCheck, X,
  Target, Flame, Trophy, Users, MessageCircle, AlertTriangle,
  GraduationCap, Rocket, Star, Handshake, Library, CalendarClock, TrendingUp,
  BarChart3, ListChecks, Clock, Zap, Activity, FileText, Mail, CheckCircle2,
} from "lucide-react";
import { MENTORSHIP, MENTOR_PLANS, SEATS_LIMIT, SEATS_LEFT } from "../data/mentorship.js";
import { useEnrol } from "../components/EnrolModal.jsx";
import { Trend, Bars, Gauge } from "../components/Charts.jsx";

const ACCENT = "#F47B20";        // brand orange
const GOLD = "#f5a623";          // highlight gold
const INK = "#1a1a2e";           // dark text
const MUTE = "#5b6472";          // grey text
const WA_NUMBER = "917877596464";

/* string → icon, so per-page metrics can live in the data file */
const ICONS = {
  clock: Clock, activity: Activity, flame: Flame, check: CheckCircle2,
  file: FileText, trend: TrendingUp, bar: BarChart3, target: Target,
  zap: Zap, list: ListChecks,
};

/* ════════════════════════════════════════════════
   Small building blocks
════════════════════════════════════════════════ */
function SectionTitle({ kicker, children, sub }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 48px" }}>
      {kicker && (
        <span style={{
          display: "inline-block", fontSize: 12, fontWeight: 800, letterSpacing: "2px",
          textTransform: "uppercase", color: ACCENT, marginBottom: 14,
        }}>{kicker}</span>
      )}
      <h2 style={{
        fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800,
        fontSize: "clamp(1.7rem,4vw,2.7rem)", lineHeight: 1.12, letterSpacing: "-1px",
        color: INK, margin: 0,
      }}>{children}</h2>
      {sub && <p style={{ color: MUTE, fontSize: "1.05rem", lineHeight: 1.7, marginTop: 16 }}>{sub}</p>}
    </div>
  );
}

function Accent({ children }) {
  return <span style={{ background: `linear-gradient(90deg,${ACCENT},${GOLD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{children}</span>;
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}

function Section({ children, style }) {
  return (
    <section style={{ padding: "92px 0", position: "relative", overflow: "hidden", ...style }}>
      {/* soft ambient orbs */}
      <div style={{ position: "absolute", top: -60, left: "8%", width: 360, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,123,32,.10),transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -50, right: "6%", width: 300, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,166,35,.08),transparent 65%)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </section>
  );
}

/* ── Cascading price drop: 7999 → 3999 → 1999 ── */
function PriceDrop({ drops, size = "lg" }) {
  const final = drops[drops.length - 1];
  const struck = drops.slice(0, -1);
  const big = size === "lg" ? 42 : 30;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 9, flexWrap: "wrap" }}>
      {struck.map((d, i) => (
        <span key={d} style={{ fontSize: size === "lg" ? 17 : 14, color: "#9ca3af", textDecoration: "line-through", textDecorationColor: "#ef4444", fontWeight: 700 }}>
          ₹{d}{i < struck.length - 1 ? "" : ""}
        </span>
      ))}
      <motion.span
        initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
        style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: big, color: INK, lineHeight: 1 }}>
        ₹{final}
      </motion.span>
      <span style={{ fontSize: 12.5, color: MUTE }}>one-time</span>
    </div>
  );
}

/* ── Seats-left urgency bar ── */
function SeatsBar({ compact }) {
  const pct = Math.round((SEATS_LEFT / SEATS_LIMIT) * 100);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: compact ? 12 : 12.5, fontWeight: 800, color: "#dc2626" }}>
          <Flame size={13} /> Only {SEATS_LEFT} of {SEATS_LIMIT} seats left
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: MUTE }}>Enrol fast</span>
      </div>
      <div style={{ height: 7, borderRadius: 50, background: "rgba(0,0,0,.08)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          style={{ height: "100%", borderRadius: 50, background: "linear-gradient(90deg,#ef4444,#f59e0b)" }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   TOP ENROL BAR — quick enrol at the top of the page
════════════════════════════════════════════════ */
function EnrolTopBar({ cfg, scrollToEnrol }) {
  const { open: openEnrol } = useEnrol();
  const primary = cfg.tracks[0];
  const meta = MENTOR_PLANS[primary.plan];
  return (
    <div style={{ background: "linear-gradient(135deg,#1a1208,#2a1c0a)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -20, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,166,35,.3),transparent 70%)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1, padding: "16px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            {meta.drops.slice(0, -1).map((d) => (
              <span key={d} style={{ fontSize: 15, color: "rgba(255,255,255,.45)", textDecoration: "line-through", textDecorationColor: "#ef4444", fontWeight: 700 }}>₹{d}</span>
            ))}
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 26, color: "#fff" }}>₹{meta.amount}</span>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 800, color: "#fbbf24", background: "rgba(245,166,35,.14)", border: "1px solid rgba(245,166,35,.4)", padding: "5px 12px", borderRadius: 50 }}>
            <Flame size={13} /> Only {SEATS_LEFT}/{SEATS_LIMIT} seats left
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => openEnrol(primary.plan)} style={{ ...ctaSolid, padding: "11px 22px", fontSize: 14 }}>
            Enrol Now — ₹{meta.amount} <ArrowRight size={16} />
          </button>
          <button onClick={scrollToEnrol} style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.22)", borderRadius: 12, padding: "11px 18px", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            View plans
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   FLOATING ENROL CARD — dynamic, follows the user through every
   section (top-right on desktop, sticky bottom bar on phones)
════════════════════════════════════════════════ */
function FloatingEnrol({ cfg, scrollToEnrol }) {
  const { open: openEnrol } = useEnrol();
  const [closed, setClosed] = useState(false);
  const [idx, setIdx] = useState(0);
  if (closed) return null;

  const multi = cfg.tracks.length > 1;
  const tr = cfg.tracks[idx] || cfg.tracks[0];
  const meta = MENTOR_PLANS[tr.plan];

  return (
    <div className="mentor-float-enrol" aria-label="Quick enrol">
      {/* ── Desktop / tablet: full floating card ── */}
      <motion.div
        className="mfe-card"
        initial={{ opacity: 0, x: 48 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.5 }}
      >
        <motion.span aria-hidden className="mfe-glow"
          animate={{ opacity: [0.45, 0.85, 0.45] }} transition={{ duration: 3.4, repeat: Infinity }} />
        <button className="mfe-close" onClick={() => setClosed(true)} aria-label="Hide enrol card">
          <X size={14} />
        </button>

        <span className="mfe-kicker"><Flame size={12} /> Limited seats</span>

        {multi && (
          <div className="mfe-toggle" role="tablist" aria-label="Choose exam">
            {cfg.tracks.map((t, i) => (
              <button key={t.plan} role="tab" aria-selected={i === idx}
                onClick={() => setIdx(i)} className={i === idx ? "mfe-toggle-on" : ""}>
                {t.exam.split(" ")[0]}
              </button>
            ))}
          </div>
        )}

        <div className="mfe-exam">{tr.exam} Mentorship</div>
        <div style={{ margin: "2px 0 10px" }}><PriceDrop drops={meta.drops} size="sm" /></div>
        <div style={{ marginBottom: 14 }}><SeatsBar compact /></div>

        <button className="mfe-cta" onClick={() => openEnrol(tr.plan)}>
          Enrol Now — ₹{meta.amount} <ArrowRight size={16} />
        </button>
        <button className="mfe-link" onClick={scrollToEnrol}>View all plans</button>
        <div className="mfe-secure"><ShieldCheck size={12} color="#22c55e" /> Secure payment · Razorpay</div>
      </motion.div>

      {/* ── Mobile: slim sticky bottom bar ── */}
      <div className="mfe-bar">
        <div className="mfe-bar-info">
          <span className="mfe-bar-price">₹{meta.amount}</span>
          <span className="mfe-bar-seats"><Flame size={12} /> {SEATS_LEFT} of {SEATS_LIMIT} seats left</span>
        </div>
        <button className="mfe-cta" onClick={() => openEnrol(tr.plan)} style={{ width: "auto", padding: "11px 20px", flexShrink: 0 }}>
          Enrol <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   HERO (light)
════════════════════════════════════════════════ */
function Hero({ cfg, scrollToEnrol }) {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(160deg, #ffffff 0%, #ffffff 45%, #ffffff 100%)",
      paddingTop: 132, paddingBottom: 80,
    }}>
      {/* warm radial overlays */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 60% at -5% 0%, rgba(244,123,32,.28) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 105% 15%, rgba(249,115,22,.22) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(244,123,32,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(244,123,32,.05) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {/* tagline */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 13, fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 16 }}>
          <Accent>{cfg.tagline}</Accent>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700,
            color: "#c2410c", background: "rgba(244,123,32,.12)", border: "1px solid rgba(244,123,32,.4)",
            padding: "7px 18px", borderRadius: 50, marginBottom: 22,
          }}>
          {cfg.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 900,
            fontSize: "clamp(2.3rem,6.4vw,4.6rem)", lineHeight: 1.05, letterSpacing: "-2px",
            color: INK, margin: "0 0 20px",
          }}>
          {cfg.title[0]}<br />
          <Accent>{cfg.title[1]}</Accent>
          {cfg.title[2] ? <><br />{cfg.title[2]}</> : null}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ color: MUTE, fontSize: "clamp(1rem,2vw,1.18rem)", lineHeight: 1.75, maxWidth: 680, margin: "0 auto 32px" }}>
          {cfg.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 30 }}>
          <button onClick={scrollToEnrol} style={ctaSolid}>JOIN NOW <ArrowRight size={18} /></button>
          <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I want to know more about the " + cfg.eyebrow)}`}
            target="_blank" rel="noreferrer" style={ctaGhost}>
            <MessageCircle size={18} /> Talk to a mentor
          </a>
        </motion.div>

        {/* stats strip */}
        {cfg.stats && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, maxWidth: 720, margin: "0 auto" }}>
            {cfg.stats.map((s) => (
              <div key={s.lbl} style={{ background: "rgba(255,255,255,.78)", border: "1px solid rgba(244,123,32,.2)", borderRadius: 14, padding: "14px 10px", backdropFilter: "blur(8px)" }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.15rem", color: INK }}>{s.val}</div>
                <div style={{ fontSize: 11.5, color: MUTE, marginTop: 3 }}>{s.lbl}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* video placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
          style={{
            maxWidth: 760, margin: "44px auto 0", aspectRatio: "16/9",
            background: "linear-gradient(135deg,#1a1208,#241a0c)", borderRadius: 18,
            border: "1px solid rgba(244,123,32,.3)", display: "grid", placeItems: "center",
            position: "relative", overflow: "hidden", cursor: "pointer",
            boxShadow: "0 30px 70px -30px rgba(244,123,32,.6)",
          }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(245,166,35,.2), transparent 65%)" }} />
          <div style={{ position: "relative", textAlign: "center" }}>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 74, height: 74, borderRadius: "50%", background: GOLD, display: "grid", placeItems: "center", margin: "0 auto 14px", boxShadow: "0 0 44px rgba(245,166,35,.6)" }}>
              <Play size={28} color="#1a1208" fill="#1a1208" style={{ marginLeft: 4 }} />
            </motion.div>
            <div style={{ color: "rgba(255,255,255,.78)", fontSize: 14, fontWeight: 600 }}>{cfg.videoNote}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   "THIS PLAN IS FOR YOU"
════════════════════════════════════════════════ */
function ForYou({ cfg }) {
  return (
    <Section style={{ background: "#fffaf5" }}>
      <SectionTitle kicker="Sound familiar?">This Plan Is <Accent>For You</Accent> If…</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, maxWidth: 940, margin: "0 auto" }}>
        {cfg.forYou.map((t, i) => (
          <Reveal key={t} delay={i * 0.05}>
            <div style={card}>
              <span style={{ fontSize: 22 }}>👉</span>
              <span style={{ color: INK, fontSize: 15, lineHeight: 1.5, fontWeight: 600 }}>{t}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   WHY FOUNDATION (foundation only)
════════════════════════════════════════════════ */
function WhyFoundation({ cfg }) {
  if (!cfg.whyFoundation) return null;
  return (
    <Section style={{ background: "linear-gradient(160deg,#ffffff,#ffffff)" }}>
      <SectionTitle kicker="Why it matters">Why <Accent>Foundation</Accent> Matters</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
        {cfg.whyFoundation.map((t, i) => (
          <Reveal key={t} delay={i * 0.08}>
            <div style={{ ...card, flexDirection: "column", alignItems: "flex-start", gap: 14, minHeight: 150, borderTop: `3px solid ${ACCENT}` }}>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 40, color: GOLD, lineHeight: 1 }}>{i + 1}</span>
              <span style={{ color: INK, fontSize: 15.5, lineHeight: 1.6, fontWeight: 600 }}>{t}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   HOW WE GUIDE
════════════════════════════════════════════════ */
const GUIDE_ICONS = [Flame, Users, Target, Trophy, Rocket, Star];
const GUIDE_COLORS = ["#F47B20", "#6366f1", "#0ea5a4", "#ef4444", "#8b5cf6", "#f59e0b"];
function HowWeGuide({ cfg }) {
  return (
    <Section style={{ background: "#fffaf5" }}>
      <SectionTitle kicker="The system" sub="A 1-on-1 mentorship engine built to fix the exact reasons most aspirants fail.">
        How We <Accent>Guide</Accent> You
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
        {cfg.howWeGuide.map((g, i) => {
          const Icon = GUIDE_ICONS[i % GUIDE_ICONS.length];
          const c = GUIDE_COLORS[i % GUIDE_COLORS.length];
          return (
            <Reveal key={g.title} delay={i * 0.05}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{ ...card, flexDirection: "column", alignItems: "flex-start", gap: 14, height: "100%", borderTop: `3px solid ${c}` }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: `${c}16`, border: `1px solid ${c}33`, display: "grid", placeItems: "center" }}>
                  <Icon size={23} color={c} />
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.08rem", color: INK, margin: 0 }}>{g.title}</h3>
                <p style={{ color: MUTE, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{g.desc}</p>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   WEEKLY TEST ANALYSIS — mock report card
════════════════════════════════════════════════ */
function TestAnalysis({ m }) {
  const trend = m.test.trend.map((v, i) => ({ t: `T${i + 1}`, v }));
  return (
    <Section style={{ background: "linear-gradient(160deg,#ffffff,#ffffff)" }}>
      <SectionTitle kicker="Every test counts" sub="No test is just a score. Every week your mentor turns it into a one-page action plan.">
        Weekly <Accent>Test Analysis</Accent>
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 26, alignItems: "stretch", maxWidth: 1040, margin: "0 auto" }}>
        {/* Left — what we analyse */}
        <Reveal>
          <div style={{ ...card, flexDirection: "column", alignItems: "flex-start", gap: 16, height: "100%" }}>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: INK, margin: 0 }}>
              What your mentor breaks down
            </h3>
            {[
              { Icon: BarChart3, c: "#F47B20", t: "Score & accuracy trend", d: "See exactly how you're improving test over test." },
              { Icon: Target,    c: "#ef4444", t: "Silly-mistake audit", d: "Marks lost to silly errors are tracked and killed." },
              { Icon: Zap,       c: "#8b5cf6", t: "Weak-chapter heatmap", d: "The exact topics dragging your score, ranked." },
              { Icon: Clock,     c: "#0ea5a4", t: "Time-management review", d: "Where you over-spent time in the paper." },
              { Icon: ListChecks,c: "#22c55e", t: "A weekly fix-list", d: "3–5 concrete actions to do before the next test." },
            ].map(({ Icon, c, t, d }) => (
              <div key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: `${c}16`, border: `1px solid ${c}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon size={18} color={c} />
                </span>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14.5, color: INK }}>{t}</div>
                  <div style={{ fontSize: 13, color: MUTE, lineHeight: 1.5 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Right — mock report */}
        <Reveal delay={0.08}>
          <div style={{ background: "#fff", border: "1px solid rgba(244,123,32,.16)", borderRadius: 18, padding: "24px 24px", height: "100%", boxShadow: "0 18px 44px -24px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#F47B20,#f5a623)" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: ACCENT }}>Weekly Report</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: INK }}>Test Analysis · {m.test.week}</div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: "#22c55e", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", padding: "5px 10px", borderRadius: 50 }}>
                <TrendingUp size={13} /> {m.test.gain}
              </span>
            </div>

            {/* score trend bars */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130, padding: "0 4px 8px", borderBottom: "1px solid rgba(0,0,0,.08)", marginBottom: 16 }}>
              {trend.map((d, i) => (
                <div key={d.t} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <motion.div
                    initial={{ height: 0 }} whileInView={{ height: `${d.v}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.07 }}
                    style={{ width: "100%", maxWidth: 26, borderRadius: "6px 6px 0 0", background: i === trend.length - 1 ? "linear-gradient(180deg,#F47B20,#f5a623)" : "rgba(244,123,32,.35)" }} />
                  <span style={{ fontSize: 10.5, color: MUTE, fontWeight: 600 }}>{d.t}</span>
                </div>
              ))}
            </div>

            {/* weak chapters */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: MUTE, marginBottom: 8 }}>Weak chapters this week</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {m.test.weak.map((w) => (
                  <span key={w} style={{ fontSize: 11.5, fontWeight: 700, color: "#b91c1c", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", padding: "4px 10px", borderRadius: 50 }}>{w}</span>
                ))}
              </div>
            </div>

            {/* fix list */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(244,123,32,.22)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#9a3412", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <ListChecks size={14} /> Your fix-list before next test
              </div>
              {m.test.fix.map((a) => (
                <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <Check size={14} color="#22c55e" strokeWidth={3} />
                  <span style={{ fontSize: 12.5, color: "#374151" }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   IMPROVEMENT CHARTS — growth + before/after
════════════════════════════════════════════════ */
function ChartCard({ title, hint, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(244,123,32,.16)", borderRadius: 18, padding: "22px 22px 18px", height: "100%", boxShadow: "0 16px 40px -24px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#F47B20,#f5a623)" }} />
      <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.05rem", color: INK, margin: "0 0 4px" }}>{title}</h3>
      {hint && <p style={{ fontSize: 12.5, color: MUTE, margin: "0 0 14px" }}>{hint}</p>}
      {children}
    </div>
  );
}
function ImprovementCharts({ m }) {
  const growth = m.growth.you.map((you, i) => ({ year: `Wk ${i + 1}`, you, batch: m.growth.batch[i] }));
  return (
    <Section style={{ background: "#fffaf5" }}>
      <SectionTitle kicker="Proof, not promises" sub="Real, visible improvement — tracked every week and shared with you and your parents.">
        Improvement <Accent>Charts</Accent>
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 22, maxWidth: 1040, margin: "0 auto" }}>
        <Reveal>
          <ChartCard title={m.growth.label} hint={m.growth.hint}>
            <Trend data={growth} lines={[{ key: "you", label: "You", color: "#F47B20" }, { key: "batch", label: "Batch avg", color: "#6366f1" }]} height={250} />
          </ChartCard>
        </Reveal>
        <Reveal delay={0.08}>
          <ChartCard title="Before vs After — by subject" hint="Average score lift after mentorship">
            <Bars data={m.subjects} bars={[{ key: "Before", label: "Before", color: "#cbd5e1" }, { key: "After", label: "After", color: "#F47B20" }]} height={250} />
          </ChartCard>
        </Reveal>
      </div>

      {/* outcome stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, maxWidth: 1040, margin: "20px auto 0" }}>
        {m.outcomes.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.05}>
            <div style={{ ...card, flexDirection: "column", alignItems: "flex-start", gap: 4, borderTop: `3px solid ${s.c}` }}>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 26, color: s.c }}>{s.v}</span>
              <span style={{ fontSize: 13, color: MUTE, fontWeight: 600 }}>{s.l}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   LIVE STUDENT TRACKING
════════════════════════════════════════════════ */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function LiveTracking({ m }) {
  const week = m.weekHours.map((h, i) => ({ d: DAYS[i], h }));
  const maxH = Math.max(...m.weekHours);
  const maxIdx = m.weekHours.indexOf(maxH);
  return (
    <Section style={{ background: "linear-gradient(160deg,#ffffff,#ffffff)" }}>
      <SectionTitle kicker="Always on" sub="Your mentor sees your effort live — so nothing ever slips through the cracks.">
        Live Student <Accent>Tracking</Accent>
      </SectionTitle>

      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <Reveal>
          <div style={{ background: "#fff", border: "1px solid rgba(244,123,32,.18)", borderRadius: 20, padding: "24px 26px", boxShadow: "0 20px 46px -24px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#22c55e,#F47B20)" }} />

            {/* header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#F47B20,#f5a623)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{m.student.name[0]}</div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: INK }}>{m.student.name} · {m.student.exam}</div>
                <div style={{ fontSize: 12.5, color: MUTE }}>Mentor: {m.student.mentor}</div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, color: "#16a34a", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", padding: "6px 13px", borderRadius: 50 }}>
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "block" }} />
                LIVE · Active now
              </span>
            </div>

            {/* stat tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, marginBottom: 22 }}>
              {m.liveTiles.map(({ icon, c, v, l }) => {
                const Icon = ICONS[icon];
                return (
                  <div key={l} style={{ background: "#ffffff", border: "1px solid rgba(244,123,32,.16)", borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
                    <Icon size={18} color={c} style={{ marginBottom: 6 }} />
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 17, color: INK }}>{v}</div>
                    <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{l}</div>
                  </div>
                );
              })}
            </div>

            {/* weekly hours + gauge */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: 22, alignItems: "center" }} className="track-grid">
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: MUTE, marginBottom: 10 }}>Study hours · this week</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130 }}>
                  {week.map((x, i) => (
                    <div key={x.d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: INK }}>{x.h}h</span>
                      <motion.div
                        initial={{ height: 0 }} whileInView={{ height: `${(x.h / maxH) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06 }}
                        style={{ width: "100%", maxWidth: 26, borderRadius: "6px 6px 0 0", background: i === maxIdx ? "linear-gradient(180deg,#F47B20,#f5a623)" : "rgba(244,123,32,.4)" }} />
                      <span style={{ fontSize: 10.5, color: MUTE }}>{x.d}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: MUTE, marginBottom: 4 }}>Weekly goal</div>
                <Gauge value={m.goalPct} label="of target" color="#22c55e" height={170} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   PARENT WEEKLY BOOKLET
════════════════════════════════════════════════ */
function ParentBooklet({ m }) {
  return (
    <Section style={{ background: "#fffaf5" }}>
      <SectionTitle kicker="Parents stay in the loop" sub="Every Sunday, parents get a simple weekly booklet — exactly what their child did and how they're improving.">
        Parent <Accent>Weekly Booklet</Accent>
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 0, maxWidth: 960, margin: "0 auto", boxShadow: "0 26px 60px -30px rgba(26,26,46,.5)", borderRadius: 20, overflow: "hidden" }}>
        {/* cover */}
        <Reveal>
          <div style={{ background: "linear-gradient(150deg,#F47B20,#ea580c 60%,#c2410c)", color: "#fff", padding: "34px 30px", height: "100%", position: "relative", overflow: "hidden", minHeight: 360 }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", background: "rgba(255,255,255,.2)", padding: "6px 14px", borderRadius: 50, marginBottom: 22 }}>
                <FileText size={14} /> Parent Report
              </div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: "1.9rem", lineHeight: 1.15, marginBottom: 10 }}>Weekly<br />Progress Booklet</div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.85)", lineHeight: 1.6, marginBottom: 26 }}>A clear, jargon-free summary of your child's week — effort, tests, improvement and what's next.</p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,.25)", paddingTop: 16 }}>
                <div style={{ fontSize: 12, opacity: .8 }}>Student</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>{m.student.line}</div>
                <div style={{ fontSize: 12, opacity: .8, marginTop: 6 }}>{m.parent.week} · CollegeParichay Mentorship</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* inside page */}
        <Reveal delay={0.08}>
          <div style={{ background: "#fff", padding: "30px 30px", height: "100%" }}>
            {m.parent.rows.map(({ icon, c, l, v, note }) => {
              const Icon = ICONS[icon];
              return (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid rgba(0,0,0,.07)" }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: `${c}16`, border: `1px solid ${c}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon size={17} color={c} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>{l}</div>
                    <div style={{ fontSize: 11.5, color: MUTE }}>{note}</div>
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 16, color: c }}>{v}</div>
                </div>
              );
            })}

            <div style={{ background: "#ffffff", border: "1px solid rgba(244,123,32,.22)", borderRadius: 12, padding: "12px 14px", marginTop: 16 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#9a3412", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Star size={13} /> Mentor's remark
              </div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, margin: 0 }}>
                "{m.parent.remark}"
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
                <MessageCircle size={14} /> Sent on WhatsApp
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#6366f1" }}>
                <Mail size={14} /> Emailed every Sunday
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   TWO-YEAR PLAN (2028 only)
════════════════════════════════════════════════ */
function TwoYearPlan({ cfg }) {
  if (!cfg.twoYearPlan) return null;
  return (
    <Section style={{ background: "linear-gradient(160deg,#ffffff,#ffffff)" }}>
      <SectionTitle kicker="The roadmap">The <Accent>2-Year</Accent> Plan</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
        {cfg.twoYearPlan.map((p, i) => (
          <Reveal key={p.phase} delay={i * 0.07}>
            <div style={{ ...card, flexDirection: "column", alignItems: "flex-start", gap: 10, height: "100%", borderTop: `3px solid ${ACCENT}` }}>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1px", color: ACCENT, textTransform: "uppercase" }}>{p.phase}</span>
              <span style={{ fontSize: 12.5, color: MUTE, fontWeight: 600 }}>{p.when}</span>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.05rem", color: INK, margin: "2px 0 0" }}>{p.title}</h3>
              <p style={{ color: MUTE, fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   TESTIMONIALS
════════════════════════════════════════════════ */
function Testimonials({ cfg }) {
  return (
    <Section style={{ background: "#fffaf5" }}>
      <SectionTitle kicker="Real results">Students From The <Accent>2025 Batch</Accent></SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
        {cfg.testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <div style={{ ...card, flexDirection: "column", alignItems: "flex-start", gap: 14, height: "100%" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[...Array(5)].map((_, k) => <Star key={k} size={15} color={GOLD} fill={GOLD} />)}
              </div>
              <p style={{ color: INK, fontSize: 14.5, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>“{t.quote}”</p>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 12, paddingTop: 6, borderTop: "1px solid rgba(0,0,0,.08)", width: "100%" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${GOLD})`, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, color: INK, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{t.improvement}</div>
                  <div style={{ fontSize: 11.5, color: MUTE }}>{t.batch}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   ENROL (track pricing cards) — JEE + NEET
════════════════════════════════════════════════ */
function Enrol({ cfg }) {
  const { open: openEnrol } = useEnrol();
  return (
    <section id="enrol" style={{ padding: "92px 0", background: "linear-gradient(160deg,#ffffff,#ffffff)", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, left: "10%", width: 360, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,123,32,.16),transparent 65%)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <SectionTitle kicker="Limited spots" sub="One-time enrolment. Serious aspirants only. Pick your track below.">
          Join the <Accent>Mentorship</Accent> Program
        </SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: cfg.tracks.length > 1 ? "repeat(auto-fit,minmax(300px,1fr))" : "minmax(300px,440px)", gap: 22, maxWidth: 920, margin: "0 auto", justifyContent: "center" }}>
          {cfg.tracks.map((tr, i) => {
            const meta = MENTOR_PLANS[tr.plan];
            return (
              <Reveal key={tr.plan} delay={i * 0.08}>
                <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  style={{
                    background: "#fff", borderRadius: 20, border: `1px solid ${tr.accent}33`, padding: "30px 26px",
                    height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
                    boxShadow: `0 24px 50px -26px ${tr.accent}66`,
                  }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${tr.accent},${GOLD})` }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ width: 42, height: 42, borderRadius: 12, background: `${tr.accent}18`, border: `1px solid ${tr.accent}44`, display: "grid", placeItems: "center" }}>
                      <GraduationCap size={21} color={tr.accent} />
                    </span>
                    <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: INK, margin: 0 }}>{tr.exam}</h3>
                  </div>
                  <p style={{ color: MUTE, fontSize: 13.5, marginBottom: 18 }}>{tr.line}</p>

                  <div style={{ marginBottom: 14 }}>
                    <PriceDrop drops={meta.drops} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <SeatsBar />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {["Personal 1-on-1 mentor", "Daily targets + accountability", "Weekly test analysis", "Backlog clearing sprints", "WhatsApp support throughout"].map((b) => (
                      <div key={b} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <Check size={16} color="#22c55e" strokeWidth={3} />
                        <span style={{ color: "#374151", fontSize: 13.5 }}>{b}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => openEnrol(tr.plan)}
                    style={{
                      marginTop: "auto", width: "100%", padding: "15px", borderRadius: 12, border: "none",
                      background: `linear-gradient(135deg,${ACCENT},${GOLD})`, color: "#fff",
                      fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 15.5, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: `0 10px 26px ${tr.accent}55`,
                    }}>
                    Enrol — ₹{meta.amount} <ArrowRight size={17} />
                  </button>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: 12, color: MUTE, fontWeight: 600 }}>
                    <ShieldCheck size={13} color="#22c55e" /> Secure payment via Razorpay
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 28, color: "#c2410c", fontSize: 13.5, fontWeight: 700 }}>
          <AlertTriangle size={15} /> Limited spots. Serious aspirants only.
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   CONTACT FORM (-> WhatsApp)
════════════════════════════════════════════════ */
function Contact({ cfg }) {
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const text = `Hi! I'm ${f.name || "a student"} (${f.phone}). Interested in ${cfg.eyebrow}.\n\n${f.message}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };
  return (
    <Section style={{ background: "#fffaf5" }}>
      <SectionTitle kicker="Get in touch">Join Our <Accent>Mentorship</Accent> Program</SectionTitle>
      <form onSubmit={submit} style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <input required value={f.name} onChange={set("name")} placeholder="Your name" style={input} />
        <input required value={f.phone} onChange={set("phone")} placeholder="Phone number" inputMode="tel" style={input} />
        <textarea value={f.message} onChange={set("message")} placeholder="Your message (optional)" rows={4} style={{ ...input, resize: "vertical" }} />
        <button type="submit" style={{ ...ctaSolid, justifyContent: "center", width: "100%" }}>Submit <ArrowRight size={17} /></button>
      </form>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   FAQ ACCORDION
════════════════════════════════════════════════ */
function Faqs({ cfg }) {
  const [open, setOpen] = useState(0);
  return (
    <Section style={{ background: "linear-gradient(160deg,#ffffff,#ffffff)" }}>
      <SectionTitle kicker="Questions">Frequently Asked <Accent>Questions</Accent></SectionTitle>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {cfg.faqs.map((q, i) => {
          const isOpen = open === i;
          return (
            <div key={q.q} style={{ background: "#fff", border: `1px solid ${isOpen ? "rgba(244,123,32,.45)" : "rgba(0,0,0,.08)"}`, borderRadius: 14, marginBottom: 12, overflow: "hidden", boxShadow: isOpen ? "0 6px 20px rgba(244,123,32,.12)" : "0 1px 6px rgba(0,0,0,.04)" }}>
              <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                padding: "18px 20px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK,
              }}>
                {q.q}
                <ChevronDown size={19} color={ACCENT} style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                    <div style={{ padding: "0 20px 20px", color: MUTE, fontSize: 14.5, lineHeight: 1.7 }}>{q.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   WHATSAPP PROOF — CSS phone-frame chat mockups
════════════════════════════════════════════════ */
function PhoneFrame({ contact, messages, accent = "#25D366" }) {
  return (
    <div style={{
      width: "100%", maxWidth: 230, margin: "0 auto", aspectRatio: "9 / 18",
      background: "#0a0a0a", borderRadius: 28, border: "1px solid rgba(0,0,0,.2)",
      boxShadow: "0 18px 40px -16px rgba(0,0,0,.5), inset 0 0 0 5px #1c1c1c",
      padding: 6, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 64, height: 16, background: "#1c1c1c", borderRadius: 12, zIndex: 3 }} />
      <div style={{ width: "100%", height: "100%", borderRadius: 22, overflow: "hidden", background: "#0b141a", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 10px 9px", background: "#202c33", flexShrink: 0 }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: accent, display: "grid", placeItems: "center", flexShrink: 0, fontSize: 11, fontWeight: 800, color: "#0a0a0a" }}>{contact[0]}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#e9edef", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contact}</div>
            <div style={{ fontSize: 8, color: "#8696a0" }}>online</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 7, overflow: "hidden", backgroundImage: "radial-gradient(rgba(255,255,255,.03) 1px, transparent 1px)", backgroundSize: "14px 14px" }}>
          {messages.map((m, i) => {
            const out = m.side === "out";
            return (
              <div key={i} style={{ alignSelf: out ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                <div style={{ background: out ? "#005c4b" : "#202c33", color: "#e9edef", borderRadius: 9, borderTopRightRadius: out ? 2 : 9, borderTopLeftRadius: out ? 9 : 2, padding: "6px 9px 5px", fontSize: 9.5, lineHeight: 1.4, whiteSpace: "pre-line" }}>
                  {m.name && <div style={{ fontSize: 8.5, fontWeight: 800, color: "#f5a623", marginBottom: 1 }}>{m.name}</div>}
                  {m.text}
                  <span style={{ display: "block", textAlign: "right", fontSize: 7.5, color: out ? "rgba(233,237,239,.6)" : "#8696a0", marginTop: 2 }}>{m.time}{out ? " ✓✓" : ""}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 8px", background: "#0b141a", flexShrink: 0 }}>
          <div style={{ flex: 1, background: "#202c33", borderRadius: 16, padding: "6px 10px", fontSize: 8.5, color: "#8696a0" }}>Message</div>
          <span style={{ width: 24, height: 24, borderRadius: "50%", background: accent, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Play size={11} color="#0a0a0a" fill="#0a0a0a" style={{ marginLeft: 1 }} />
          </span>
        </div>
      </div>
    </div>
  );
}

const PROOF_CARDS = [
  { head: ["Figuring it out ", "together", ", that's how we grow."], contact: "JEE Squad · Group", messages: [
    { side: "in", name: "Rahul", text: "Guys which teacher for Rotational Motion?", time: "10:02" },
    { side: "in", name: "Priya", text: "MR sir on YouTube is 🔥 for that", time: "10:03" },
    { side: "out", text: "Adding the playlist — do Q's after each lecture", time: "10:05" },
    { side: "in", name: "Rahul", text: "Got it, starting today 💪", time: "10:06" },
  ] },
  { head: ["Marks jumped from ", "20 to 126", ". That's the shift."], contact: "Aman · Mentor", messages: [
    { side: "in", text: "Bhaiya I got 126 in the last test!!", time: "21:14" },
    { side: "in", text: "Last time it was just 20 😭", time: "21:14" },
    { side: "out", text: "That's the shift we worked for 🔥 proud of you", time: "21:15" },
    { side: "in", text: "Thank you so much 🙏", time: "21:16" },
  ] },
  { head: ["Festival or not — the ", "system", " keeps going."], contact: "Community · Announcements", messages: [
    { side: "out", text: "Happy Diwali everyone 🪔", time: "09:00" },
    { side: "out", text: "But the system doesn't pause:\n1. Hit your syllabus targets\n2. Attempt today's mock\n3. Daily tasks — non-negotiable", time: "09:01" },
    { side: "in", text: "On it bhaiya 🚀", time: "09:05" },
  ] },
  { head: ["12 hours tracked", ". Discipline in action."], contact: "Sneha · Mentor", accent: "#22c55e", messages: [
    { side: "in", text: "📷 Study tracker — 12h 04m", time: "23:40" },
    { side: "in", text: "Revised Thermodynamics + Organic today", time: "23:41" },
    { side: "out", text: "12 hours tracked 👏 discipline in action", time: "23:42" },
    { side: "out", text: "Proud of you. Sleep now, recover.", time: "23:42" },
  ] },
  { head: ["When something feels off, it gets ", "fixed", "."], contact: "Community · Announcements", messages: [
    { side: "out", text: "📢 New: Feedback & Complaint form is live", time: "12:00" },
    { side: "out", text: "If anything feels off, tell us — anonymously too", time: "12:00" },
    { side: "out", text: "Your voice shapes the system 🙌", time: "12:01" },
    { side: "in", text: "This is why I trust this place 🙏", time: "12:10" },
  ] },
  { head: ["Doubt at ", "1 AM", "? Someone's there."], contact: "Dev · Mentor", messages: [
    { side: "in", text: "Bhaiya stuck on this integral 😩", time: "01:02" },
    { side: "in", text: "📷 my handwritten attempt", time: "01:02" },
    { side: "out", text: "📷 full solution", time: "01:09" },
    { side: "out", text: "Use substitution u = 1+x². You almost had it 💪", time: "01:09" },
  ] },
];

function WhatsAppProof() {
  return (
    <Section style={{ background: "#fffaf5" }}>
      <SectionTitle kicker="From the inside" sub="This is what mentorship looks like from the inside.">
        Real Mentorship. <Accent>Real Results.</Accent>
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, maxWidth: 1040, margin: "0 auto" }}>
        {PROOF_CARDS.map((c, i) => (
          <Reveal key={i} delay={(i % 3) * 0.06}>
            <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{ background: "#fff", border: "1px solid rgba(244,123,32,.16)", borderRadius: 12, padding: "24px 22px", boxShadow: "0 14px 34px -18px rgba(26,26,46,.4)", height: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.12rem", lineHeight: 1.3, color: INK, margin: 0 }}>
                {c.head[0]}<span style={{ color: ACCENT }}>{c.head[1]}</span>{c.head[2] || ""}
              </h3>
              <PhoneFrame contact={c.contact} messages={c.messages} accent={c.accent} />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   YOUR JOURNEY WITH COLLEGE PARICHAY — 6-step cards
════════════════════════════════════════════════ */
const JOURNEY_STEPS = [
  { Icon: Rocket,        c: "#F47B20", title: "Click on Join and Enroll",         desc: "Take the first bold step." },
  { Icon: Handshake,     c: "#ef4444", title: "Mentor Contacts You in 24 Hours",  desc: "Your CollegeParichay mentor sends you the first WhatsApp message." },
  { Icon: Library,       c: "#8b5cf6", title: "Receive Study Materials",          desc: "Kickstart your journey with all your notes and plans ready." },
  { Icon: CalendarClock, c: "#0ea5a4", title: "Get Strict Guidance",              desc: "Daily accountability, weekly targets, zero procrastination." },
  { Icon: TrendingUp,    c: "#22c55e", title: "Score 250+ in JEE / 650+ in NEET", desc: "Get into flow state and hit your maximum potential." },
  { Icon: GraduationCap, c: "#6366f1", title: "Get Your Dream College",           desc: "Your dream IIT or medical college is waiting for you!" },
];

function JourneyBrand() {
  return (
    <section style={{ padding: "92px 0", background: "linear-gradient(160deg, #ffffff 0%, #ffffff 45%, #ffffff 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, left: "8%", width: 360, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.18), transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, right: "10%", width: 280, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.12), transparent 65%)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <SectionTitle kicker="How it works" sub="Six steps from where you are to where you deserve to be.">
          Your Journey With <Accent>CollegeParichay</Accent>
        </SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 22, maxWidth: 1040, margin: "0 auto" }}>
          {JOURNEY_STEPS.map((s, i) => {
            const Icon = s.Icon;
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.07}>
                <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  style={{
                    background: "#fff", borderRadius: 18, padding: "34px 28px", height: "100%",
                    boxShadow: "0 22px 48px -24px rgba(26,26,46,.42), 0 2px 10px rgba(0,0,0,.05)",
                    border: "1px solid rgba(244,123,32,.12)", textAlign: "center",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 12, position: "relative", overflow: "hidden",
                  }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${s.c},${s.c}99)` }} />
                  <span style={{ alignSelf: "flex-start", fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: s.c }}>Step {i + 1}</span>
                  {/* gradient icon badge */}
                  <div style={{ position: "relative", marginTop: 4 }}>
                    <motion.div
                      animate={{ y: [0, -5, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.2 }}
                      style={{
                        width: 74, height: 74, borderRadius: "50%",
                        background: `linear-gradient(135deg,${s.c},${s.c}bb)`,
                        display: "grid", placeItems: "center",
                        boxShadow: `0 12px 28px -8px ${s.c}88`,
                        border: "4px solid #fff",
                      }}>
                      <Icon size={32} color="#fff" strokeWidth={2} />
                    </motion.div>
                    <span style={{ position: "absolute", bottom: -4, right: -4, width: 26, height: 26, borderRadius: "50%", background: "#fff", border: `2px solid ${s.c}`, display: "grid", placeItems: "center", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 12, color: s.c }}>{i + 1}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: INK, margin: "6px 0 0", lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ color: MUTE, fontSize: 14, lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   CROSS-PAGE NAV
════════════════════════════════════════════════ */
function MentorTabs({ variant }) {
  const label = (slug) => slug === "foundation" ? "Foundation 9–10" : slug === "jee-2027" ? "JEE / NEET 2027" : "JEE / NEET 2028";
  return (
    <div style={{ position: "relative", zIndex: 2, background: "#fffaf5", borderBottom: "1px solid rgba(244,123,32,.14)", paddingTop: 76 }}>
      <div className="container" style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", padding: "12px 0" }}>
        {Object.values(MENTORSHIP).map((m) => {
          const active = m.slug === variant;
          return (
            <Link key={m.slug} to={`/mentorship/${m.slug}`} style={{
              fontSize: 13, fontWeight: 700, padding: "8px 18px", borderRadius: 50, textDecoration: "none",
              color: active ? "#fff" : "#7c3a12",
              background: active ? `linear-gradient(135deg,${ACCENT},${GOLD})` : "rgba(244,123,32,.08)",
              border: `1px solid ${active ? "transparent" : "rgba(244,123,32,.25)"}`,
              boxShadow: active ? "0 6px 16px -6px rgba(244,123,32,.6)" : "none",
            }}>{label(m.slug)}</Link>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════ */
export default function Mentorship() {
  const { variant } = useParams();
  const cfg = MENTORSHIP[variant];
  if (!cfg) return <Navigate to="/mentorship/jee-2027" replace />;

  const scrollToEnrol = () => document.getElementById("enrol")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#fffaf5", color: INK }}>
      <MentorTabs variant={variant} />
      <EnrolTopBar cfg={cfg} scrollToEnrol={scrollToEnrol} />
      <FloatingEnrol cfg={cfg} scrollToEnrol={scrollToEnrol} />
      <Hero cfg={cfg} scrollToEnrol={scrollToEnrol} />
      <ForYou cfg={cfg} />
      <WhyFoundation cfg={cfg} />
      <HowWeGuide cfg={cfg} />
      <TestAnalysis m={cfg.metrics} />
      <ImprovementCharts m={cfg.metrics} />
      <LiveTracking m={cfg.metrics} />
      <ParentBooklet m={cfg.metrics} />
      <WhatsAppProof />
      <TwoYearPlan cfg={cfg} />
      <JourneyBrand />
      <Testimonials cfg={cfg} />
      <Enrol cfg={cfg} />
      <Contact cfg={cfg} />
      <Faqs cfg={cfg} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   shared styles
════════════════════════════════════════════════ */
const ctaSolid = {
  display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 30px", borderRadius: 12,
  background: `linear-gradient(135deg,${ACCENT},${GOLD})`, color: "#fff", fontFamily: "'Space Grotesk',sans-serif",
  fontWeight: 800, fontSize: 15.5, border: "none", cursor: "pointer", textDecoration: "none", letterSpacing: "0.3px",
  boxShadow: "0 10px 30px rgba(244,123,32,.4)",
};
const ctaGhost = {
  display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 26px", borderRadius: 12,
  background: "#fff", color: "#c2410c", fontFamily: "'Space Grotesk',sans-serif",
  fontWeight: 700, fontSize: 15, border: "1.5px solid rgba(244,123,32,.35)", cursor: "pointer", textDecoration: "none",
};
const card = {
  display: "flex", alignItems: "center", gap: 14, background: "#fff",
  border: "1px solid rgba(244,123,32,.14)", borderRadius: 16, padding: "20px 22px",
  boxShadow: "0 6px 20px -12px rgba(26,26,46,.3)",
};
const input = {
  width: "100%", padding: "14px 16px", fontSize: 15, borderRadius: 12,
  background: "#fff", border: "1.5px solid rgba(244,123,32,.25)", color: INK, outline: "none",
  fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box",
};
