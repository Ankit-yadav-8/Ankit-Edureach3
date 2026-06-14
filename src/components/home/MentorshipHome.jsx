import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, Check, GraduationCap, Trophy, Award,
  Users, Target, CalendarClock, ShieldCheck, Star, Flame,
} from "lucide-react";
import Reveal from "../Reveal.jsx";

/* ════════════════════════════════════════════════
   MENTORSHIP — home section (light, animated)
   Sits just below the three predictor cards.
════════════════════════════════════════════════ */
const PROGRAMS = [
  {
    to: "/mentorship/jee-2027",
    icon: Trophy,
    color: "#F47B20",
    exam: "JEE & NEET 2027",
    tag: "Class 12 · Droppers",
    price: "1999",
    old: "7999",
    blurb: "For serious 2027 aspirants who want to fix backlog, build consistency and push their rank — fast.",
    points: ["1-on-1 IITian / doctor mentor", "Daily targets + weekly test analysis", "Backlog clearing sprints"],
    featured: false,
  },
  {
    to: "/mentorship/jee-2028",
    icon: Award,
    color: "#6366f1",
    exam: "JEE & NEET 2028",
    tag: "Class 11 · 2-Year Plan",
    price: "3999",
    old: "7999",
    blurb: "Start two years early and finish ahead of everyone. A 2-year roadmap that compounds every single day.",
    points: ["Same mentor for 2 full years", "4-phase concept-first roadmap", "Quarterly progress checkpoints"],
    featured: true,
  },
  {
    to: "/mentorship/foundation",
    icon: GraduationCap,
    color: "#0ea5a4",
    exam: "Foundation 9–10",
    tag: "Class 9 & 10",
    price: "2999",
    old: "5999",
    blurb: "Build the rock-solid Maths & Science base that makes JEE & NEET feel easy later. The earlier, the higher you rank.",
    points: ["NCERT mastery + study habits", "Early JEE / NEET pattern exposure", "Board + Olympiad edge"],
    featured: false,
  },
];

const TRUST = [
  { icon: Users, label: "1000+ students mentored" },
  { icon: Star, label: "1-on-1 personal mentor" },
  { icon: CalendarClock, label: "Daily targets & check-ins" },
  { icon: Target, label: "Weekly test analysis" },
  { icon: ShieldCheck, label: "IITian & doctor mentors" },
];

/* ── Right-side detail card for the selected program ───────────── */
function ProgramDetail({ p }) {
  const Icon = p.icon;
  return (
    <motion.div
      key={p.to}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative", background: "#fff", borderRadius: 20, overflow: "hidden",
        border: `1px solid ${p.color}33`,
        boxShadow: p.featured
          ? `0 28px 60px -28px ${p.color}88, 0 0 0 2px ${p.color}44`
          : `0 18px 44px -26px ${p.color}77`,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${p.color},#f5a623)` }} />
      {p.featured && (
        <div style={{ position: "absolute", top: 16, right: -36, transform: "rotate(45deg)", background: `linear-gradient(135deg,${p.color},#818cf8)`, color: "#fff", fontWeight: 800, fontSize: 10.5, letterSpacing: "0.5px", padding: "4px 42px", boxShadow: "0 4px 12px rgba(0,0,0,.2)", zIndex: 1 }}>
          BEST VALUE
        </div>
      )}

      <div style={{ padding: "30px 28px", display: "flex", flexWrap: "wrap", gap: 28 }}>
        {/* ── Overview column ── */}
        <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.color}16`, border: `1px solid ${p.color}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon size={26} color={p.color} />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.32rem", color: "#1a1a2e", margin: 0, lineHeight: 1.2 }}>{p.exam}</h3>
              <span style={{ fontSize: 12.5, color: p.color, fontWeight: 700 }}>{p.tag}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 9 }}>
            <span style={{ fontSize: 17, color: "#9ca3af", textDecoration: "line-through", textDecorationColor: "#ef4444" }}>₹{p.old}</span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 40, color: "#1a1a2e" }}>₹{p.price}</span>
            <span style={{ fontSize: 13, color: "#6b7280" }}>one-time</span>
          </div>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 800, color: "#dc2626", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)", padding: "4px 10px", borderRadius: 50, marginBottom: 14 }}>
            <Flame size={12} /> Only 120 seats · enrol fast
          </div>

          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.65, marginBottom: 22 }}>{p.blurb}</p>

          <Link
            to={p.to}
            style={{
              marginTop: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: `linear-gradient(135deg,${p.color},#f5a623)`, color: "#fff",
              padding: "14px 22px", borderRadius: 12, fontFamily: "'Space Grotesk',sans-serif",
              fontWeight: 800, fontSize: 15, textDecoration: "none",
              boxShadow: `0 10px 24px -8px ${p.color}aa`,
            }}
          >
            Enrol — ₹{p.price} <ArrowRight size={16} />
          </Link>
        </div>

        {/* ── What's included column ── */}
        <div style={{ flex: "1 1 240px", minWidth: 0, background: `${p.color}0c`, border: `1px solid ${p.color}22`, borderRadius: 16, padding: "20px 22px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: p.color, marginBottom: 14 }}>
            What's included
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {p.points.map((pt) => (
              <div key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: `${p.color}1f`, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                  <Check size={12} color={p.color} strokeWidth={3} />
                </span>
                <span style={{ color: "#374151", fontSize: 13.6, lineHeight: 1.45 }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MentorshipHome() {
  const featuredIdx = PROGRAMS.findIndex((p) => p.featured);
  const [active, setActive] = useState(featuredIdx >= 0 ? featuredIdx : 0);

  return (
    <section
      id="mentorship"
      style={{
        position: "relative", overflow: "hidden", scrollMarginTop: 80,
        background: "linear-gradient(160deg, #ffffff 0%, #ffffff 45%, #ffffff 100%)",
        padding: "84px 0",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 18px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c2410c", background: "rgba(244,123,32,.1)", border: "1px solid rgba(244,123,32,.3)", padding: "7px 16px", borderRadius: 50, marginBottom: 18 }}>
              <Sparkles size={13} /> New · 1-on-1 Mentorship
            </span>
            <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", lineHeight: 1.12, letterSpacing: "-1px", color: "#1a1a2e", margin: "0 0 14px" }}>
              Know Your Path.{" "}
              <span style={{ background: "linear-gradient(90deg,#F47B20,#f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Own Your Future.</span>
            </h2>
            <p style={{ color: "#4b5563", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: 660, margin: "0 auto" }}>
              CollegeParichay's 1-on-1 mentorship helps serious JEE &amp; NEET aspirants cut through the confusion — a personal IITian / doctor mentor, daily accountability, and a plan that actually works. Pick the program that fits where you are.
            </p>
          </div>
        </Reveal>

        {/* ── Programs: pick a plan (left) · its full card (right) ── */}
        <Reveal>
          <div className="exam-timeline-grid" style={{ marginTop: 40 }}>

            {/* LEFT — program picker rail */}
            <div className="exam-timeline-rail">
              <div className="etl-rail-card">
                <div className="etl-rail-head">
                  <GraduationCap size={15} color="#F47B20" /> Choose your program
                </div>
                <div className="etl-nodes">
                  {PROGRAMS.map((p, i) => {
                    const Icon = p.icon;
                    const on = i === active;
                    return (
                      <button
                        key={p.to}
                        onClick={() => setActive(i)}
                        className="etl-node"
                        aria-pressed={on}
                        style={{
                          background: on ? `${p.color}10` : undefined,
                          borderColor: on ? `${p.color}33` : undefined,
                        }}
                      >
                        <span className="etl-num" style={{
                          background: on ? `linear-gradient(135deg, ${p.color}, ${p.color}cc)` : "#fff",
                          color: on ? "#fff" : p.color,
                          borderColor: on ? "transparent" : `${p.color}55`,
                          boxShadow: on ? `0 6px 16px -4px ${p.color}88` : "none",
                        }}>
                          <Icon size={18} />
                        </span>
                        <span className="etl-node-text">
                          <span className="etl-node-name" style={{ color: on ? "#1a1a2e" : "#475569" }}>{p.exam}</span>
                          <span className="etl-node-period">{p.tag}</span>
                        </span>
                        <span className="etl-node-count" style={{ background: `${p.color}1a`, color: p.color }}>
                          ₹{p.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT — selected program's full card */}
            <div style={{ minWidth: 0 }}>
              <AnimatePresence mode="wait">
                <ProgramDetail key={active} p={PROGRAMS[active]} />
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* ── Trust strip ── */}
        <Reveal delay={0.1}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 34 }}>
            {TRUST.map(({ icon: Icon, label }) => (
              <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 50, background: "#fff", border: "1px solid rgba(244,123,32,.22)", boxShadow: "0 2px 10px rgba(244,123,32,.08)", fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>
                <Icon size={15} color="#F47B20" /> {label}
              </span>
            ))}
          </div>
        </Reveal>

        {/* ── Closing CTA strip ── */}
        <Reveal delay={0.15}>
          <motion.div
            whileHover={{ scale: 1.005 }}
            style={{
              marginTop: 34, background: "linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 55%, #3d1d0f 100%)",
              borderRadius: 20, padding: "30px 32px", position: "relative", overflow: "hidden",
              boxShadow: "0 18px 50px -22px rgba(26,26,46,.6)",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 22,
            }}
          >
            <div style={{ position: "relative", zIndex: 1, maxWidth: 540 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#fbbf24", marginBottom: 8 }}>
                <Flame size={14} /> Serious aspirants only
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, color: "#fff", fontSize: "clamp(1.3rem,2.6vw,1.8rem)", lineHeight: 1.2, margin: 0 }}>
                The earlier you start, the higher you rank.
              </h3>
              <p style={{ color: "rgba(255,255,255,.7)", fontSize: ".95rem", lineHeight: 1.6, marginTop: 8 }}>
                Limited spots each batch — a mentor can only guide so many students 1-on-1.
              </p>
            </div>
            <Link
              to="/mentorship/jee-2027"
              style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 9, background: "linear-gradient(135deg,#F47B20,#f5a623)", color: "#fff", padding: "15px 28px", borderRadius: 12, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 10px 30px rgba(244,123,32,.5)", flexShrink: 0 }}
            >
              Explore Mentorship <ArrowRight size={17} />
            </Link>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
