import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

export default function MentorshipHome() {
  return (
    <section
      id="mentorship"
      style={{
        position: "relative", overflow: "hidden", scrollMarginTop: 80,
        background: "linear-gradient(160deg, #ffffff 0%, #ffffff 45%, #ffffff 100%)",
        padding: "84px 0",
      }}
    >
      {/* ambient glows */}
      <motion.div
        animate={{ opacity: [0.55, 0.9, 0.55] }} transition={{ duration: 4, repeat: Infinity }}
        style={{ position: "absolute", top: -80, left: "8%", width: 420, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.16), transparent 65%)", pointerEvents: "none" }}
      />
      <div style={{ position: "absolute", bottom: -60, right: "6%", width: 340, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.12), transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(244,123,32,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(244,123,32,.04) 1px,transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />

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

        {/* ── Program cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22, maxWidth: 1080, margin: "36px auto 0", alignItems: "stretch" }}>
          {PROGRAMS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.to} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  style={{
                    position: "relative", height: "100%", display: "flex", flexDirection: "column",
                    background: "#fff", borderRadius: 20, overflow: "hidden",
                    border: `1px solid ${p.color}33`,
                    boxShadow: p.featured
                      ? `0 28px 60px -28px ${p.color}88, 0 0 0 2px ${p.color}44`
                      : `0 18px 44px -26px ${p.color}77`,
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${p.color},#f5a623)` }} />
                  {p.featured && (
                    <div style={{ position: "absolute", top: 14, right: -34, transform: "rotate(45deg)", background: `linear-gradient(135deg,${p.color},#818cf8)`, color: "#fff", fontWeight: 800, fontSize: 10.5, letterSpacing: "0.5px", padding: "4px 40px", boxShadow: "0 4px 12px rgba(0,0,0,.2)" }}>
                      BEST VALUE
                    </div>
                  )}

                  <div style={{ padding: "26px 24px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 13, background: `${p.color}16`, border: `1px solid ${p.color}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Icon size={24} color={p.color} />
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.18rem", color: "#1a1a2e", margin: 0, lineHeight: 1.2 }}>{p.exam}</h3>
                        <span style={{ fontSize: 12, color: p.color, fontWeight: 700 }}>{p.tag}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 8 }}>
                      <span style={{ fontSize: 16, color: "#9ca3af", textDecoration: "line-through", textDecorationColor: "#ef4444" }}>₹{p.old}</span>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 34, color: "#1a1a2e" }}>₹{p.price}</span>
                      <span style={{ fontSize: 12.5, color: "#6b7280" }}>one-time</span>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 800, color: "#dc2626", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)", padding: "4px 10px", borderRadius: 50, marginBottom: 12 }}>
                      <Flame size={12} /> Only 120 seats · enrol fast
                    </div>

                    <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>{p.blurb}</p>
                  </div>

                  <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
                    {p.points.map((pt) => (
                      <div key={pt} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <span style={{ width: 18, height: 18, borderRadius: "50%", background: `${p.color}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <Check size={12} color={p.color} strokeWidth={3} />
                        </span>
                        <span style={{ color: "#374151", fontSize: 13.3 }}>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={p.to}
                    style={{
                      margin: "auto 24px 24px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: `linear-gradient(135deg,${p.color},#f5a623)`, color: "#fff",
                      padding: "13px 20px", borderRadius: 12, fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: 800, fontSize: 14.5, textDecoration: "none",
                      boxShadow: `0 10px 24px -8px ${p.color}aa`,
                    }}
                  >
                    Enrol — ₹{p.price} <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

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
            <div style={{ position: "absolute", top: -40, right: -20, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.32), transparent 70%)", pointerEvents: "none" }} />
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
