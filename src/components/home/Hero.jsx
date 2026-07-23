import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, GraduationCap, ArrowRight, Target, Play, Check,
  TrendingUp, Users, Trophy, Stethoscope, Crosshair, Bell,
  Sparkles, ChevronRight, LayoutDashboard, BarChart3, CalendarDays,
  MapPin,
} from "lucide-react";

/* ════════════════════════════════════════════════
   HERO — Rootly-style layout, College Parichay theme.
   Big centred headline with floating notification cards →
   twin CTAs → institute logo cloud → a product dashboard
   mockup + phone mockup rising from a warm coral→violet mist.
════════════════════════════════════════════════ */

const CORAL   = "#FF5A36";
const CORAL_DK = "#E0421F";
const INK     = "#1c1c28";
const VIOLET  = "#8b5cf6";
const TEAL    = "#0ea5a4";
const GREEN   = "#22c55e";

/* ── breakpoints ── */
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w <= 430)  return "xs";
    if (w <= 768)  return "mobile";
    if (w <= 1024) return "tablet";
    if (w <= 1366) return "ipadpro";
    return "desktop";
  });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 430)  setBp("xs");
      else if (w <= 768)  setBp("mobile");
      else if (w <= 1024) setBp("tablet");
      else if (w <= 1366) setBp("ipadpro");
      else setBp("desktop");
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return {
    bp,
    isXs:      bp === "xs",
    isMobile:  bp === "mobile" || bp === "xs",
    isTablet:  bp === "tablet" || bp === "ipadpro",
    isDesktop: bp === "desktop",
    isSmall:   bp !== "desktop" && bp !== "ipadpro",
  };
}

/* ════════════════════════════════════════════════
   FLOATING NOTIFICATION CARD (over the headline)
════════════════════════════════════════════════ */
function FloatCard({ children, style, delay = 0.35, float = 8 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: [0, -float, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale:   { duration: 0.6, delay },
        y:       { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
      }}
      style={{
        position: "absolute",
        background: "#fff",
        borderRadius: 15,
        boxShadow: "0 22px 48px -14px rgba(28,28,40,.34), 0 4px 12px rgba(28,28,40,.06)",
        border: "1px solid rgba(255,255,255,.8)",
        zIndex: 5,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* small rank chip card (top-right of headline) */
function RankChip() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px" }}>
      <div style={{ display: "flex" }}>
        {["#FF7A50", "#8b5cf6", "#22c55e"].map((c, i) => (
          <span key={i} style={{
            width: 24, height: 24, borderRadius: "50%", background: c,
            border: "2px solid #fff", marginLeft: i === 0 ? 0 : -9,
          }} />
        ))}
      </div>
      <span style={{
        fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 12.5,
        color: CORAL_DK, background: "rgba(255,90,54,.12)", padding: "3px 9px", borderRadius: 8,
      }}>#AIR&nbsp;4,846</span>
      <TrendingUp size={15} color={GREEN} />
    </div>
  );
}

/* app-notification card (below/left of headline) */
function PredictionCard() {
  return (
    <div style={{ padding: "11px 13px", width: 264 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          background: `linear-gradient(135deg, ${CORAL}, ${CORAL_DK})`,
          display: "grid", placeItems: "center",
        }}>
          <GraduationCap size={17} color="#fff" />
        </span>
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 12.5, color: INK }}>
            CollegeParichay <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: ".5px", color: CORAL, background: "rgba(255,90,54,.12)", padding: "1px 5px", borderRadius: 5, marginLeft: 2, verticalAlign: "middle" }}>APP</span>
          </div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>Prediction ready · 12:19&nbsp;PM</div>
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: "rgba(28,28,40,.72)", lineHeight: 1.45, marginBottom: 8 }}>
        Your rank maps to <b style={{ color: INK }}>12 IITs</b> — top match CSE at IIT Bombay.
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 800, color: "#0a8f5b", background: "rgba(34,197,94,.14)", padding: "3px 8px", borderRadius: 6 }}>
          <Check size={11} strokeWidth={3} /> 98% match
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, color: VIOLET, background: "rgba(139,92,246,.13)", padding: "3px 8px", borderRadius: 6 }}>JoSAA ready</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   INSTITUTE LOGO CLOUD
════════════════════════════════════════════════ */
const LOGOS = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "NIT Trichy", "BITS Pilani",
  "IIIT Hyderabad", "IIT Roorkee", "NIT Warangal", "IIT Kanpur", "VIT",
];
function LogoCloud({ isMobile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.6 }}
      style={{ width: "100%", maxWidth: 880, margin: "0 auto" }}
    >
      <div style={{
        fontSize: 11.5, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
        color: "rgba(28,28,40,.42)", textAlign: "center", marginBottom: 16,
        fontFamily: "'Inter',system-ui,sans-serif",
      }}>
        Aspirants aiming for the best — with data on
      </div>
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: isMobile ? "14px 20px" : "16px 34px",
      }}>
        {LOGOS.map((name) => (
          <span key={name} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700,
            fontSize: isMobile ? 13 : 15, color: "rgba(28,28,40,.5)",
            filter: "grayscale(1)", opacity: 0.85,
          }}>
            <GraduationCap size={isMobile ? 15 : 17} color="rgba(28,28,40,.4)" />
            {name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   DASHBOARD MOCKUP
════════════════════════════════════════════════ */
const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Crosshair, label: "Rank Predictor", active: true },
  { icon: GraduationCap, label: "Colleges" },
  { icon: BarChart3, label: "Cutoffs" },
  { icon: Users, label: "Mentorship" },
];
const PRED = [
  { rank: "01", name: "IIT Bombay", branch: "CSE", chance: 96, tone: GREEN, pkg: "₹33.8L" },
  { rank: "02", name: "IIT Delhi", branch: "CSE", chance: 88, tone: GREEN, pkg: "₹32.3L" },
  { rank: "03", name: "IIT Madras", branch: "Electrical", chance: 71, tone: "#E29A2E", pkg: "₹31.2L" },
  { rank: "04", name: "NIT Trichy", branch: "CSE", chance: 54, tone: "#E29A2E", pkg: "₹18.4L" },
];
const ROUNDS = [
  ["JoSAA Round 1", "Jun 28"],
  ["JoSAA Round 2", "Jul 05"],
  ["CSAB Special", "Jul 22"],
];
function DashboardMock({ scale = 1 }) {
  return (
    <div style={{
      width: 780, transform: `scale(${scale})`, transformOrigin: "top center",
      background: "#fff", borderRadius: 18, overflow: "hidden",
      border: "1px solid rgba(28,28,40,.08)",
      boxShadow: "0 40px 80px -30px rgba(28,28,40,.35), 0 10px 24px -12px rgba(28,28,40,.14)",
    }}>
      {/* browser chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderBottom: "1px solid rgba(28,28,40,.06)" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: 11.5, color: "#9ca3af", background: "#f4f4f6", padding: "5px 16px", borderRadius: 7, fontFamily: "'Inter',sans-serif" }}>
            collegeparichay.in/predictor
          </span>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: 400 }}>
        {/* sidebar */}
        <div style={{ width: 186, background: "#faf9fb", borderRight: "1px solid rgba(28,28,40,.06)", padding: "16px 12px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg,${CORAL},${CORAL_DK})`, display: "grid", placeItems: "center", fontFamily: "Sora", fontWeight: 800, fontSize: 11, color: "#fff" }}>CP</span>
            <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: INK }}>CollegeParichay</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid rgba(28,28,40,.08)", borderRadius: 8, padding: "7px 10px", marginBottom: 14 }}>
            <Search size={13} color="#9ca3af" />
            <span style={{ fontSize: 11.5, color: "#b6b3bb" }}>Search…</span>
          </div>
          {NAV.map(({ icon: Icon, label, active }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, marginBottom: 3,
              background: active ? "rgba(255,90,54,.1)" : "transparent",
              color: active ? CORAL_DK : "rgba(28,28,40,.62)",
              fontWeight: active ? 700 : 500, fontSize: 12, fontFamily: "'Inter',sans-serif",
            }}>
              <Icon size={15} color={active ? CORAL : "#9ca3af"} /> {label}
            </div>
          ))}
        </div>

        {/* main */}
        <div style={{ flex: 1, padding: "18px 20px", minWidth: 0 }}>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 19, color: INK, marginBottom: 2 }}>College Predictor</div>
          <div style={{ fontSize: 12, color: "rgba(28,28,40,.5)", marginBottom: 14 }}>Your rank → every college you can realistically get.</div>

          {/* filter row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#f7f6f9", border: "1px solid rgba(28,28,40,.07)", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: INK, fontWeight: 700 }}>
              <Target size={13} color={CORAL} /> AIR&nbsp;4,846
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#f7f6f9", border: "1px solid rgba(28,28,40,.07)", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: "rgba(28,28,40,.7)" }}>
              General <ChevronRight size={13} style={{ transform: "rotate(90deg)" }} color="#9ca3af" />
            </div>
            <button style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, background: CORAL, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 800, fontFamily: "Sora" }}>
              Predict <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {/* predicted list */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {PRED.map((c) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 11, border: "1px solid rgba(28,28,40,.07)", borderRadius: 11, padding: "10px 12px" }}>
                  <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 12, color: "#c8c5cf", flexShrink: 0 }}>{c.rank}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: 13, color: INK }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(28,28,40,.5)" }}>{c.branch} · avg {c.pkg}</div>
                    <div style={{ height: 5, borderRadius: 4, background: "#eee", marginTop: 6, overflow: "hidden" }}>
                      <div style={{ width: `${c.chance}%`, height: "100%", borderRadius: 4, background: c.tone }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: c.tone, flexShrink: 0 }}>{c.chance}%</span>
                </div>
              ))}
            </div>

            {/* counselling schedule */}
            <div style={{ width: 158, flexShrink: 0, background: "#faf9fb", border: "1px solid rgba(28,28,40,.06)", borderRadius: 12, padding: "13px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 11 }}>
                <CalendarDays size={14} color={VIOLET} />
                <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 12, color: INK }}>Counselling</span>
              </div>
              {ROUNDS.map(([r, d], i) => (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: i === 0 ? CORAL : "rgba(28,28,40,.2)", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: INK, whiteSpace: "nowrap" }}>{r}</div>
                    <div style={{ fontSize: 10, color: "rgba(28,28,40,.45)" }}>{d}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, background: "rgba(255,90,54,.08)", borderRadius: 9, padding: "9px 10px" }}>
                <div style={{ fontSize: 10, color: CORAL_DK, fontWeight: 800, letterSpacing: ".5px" }}>NEXT ROUND</div>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, color: INK, marginTop: 1 }}>2d&nbsp;: 14h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PHONE MOCKUP
════════════════════════════════════════════════ */
function PhoneMock() {
  return (
    <div style={{
      width: 236, borderRadius: 40, padding: 9, background: "#0b0b12",
      boxShadow: "0 44px 90px -26px rgba(28,28,40,.5), 0 12px 28px -14px rgba(28,28,40,.3)",
      border: "1px solid rgba(255,255,255,.08)",
    }}>
      <div style={{ borderRadius: 32, overflow: "hidden", background: "#0f0f18", position: "relative" }}>
        {/* status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px 6px", fontSize: 11, color: "#fff", fontWeight: 700 }}>
          <span>9:41</span>
          <span style={{ display: "flex", gap: 5, alignItems: "center", opacity: 0.85 }}>
            <span style={{ fontSize: 10 }}>▂▄▆</span>
            <span style={{ width: 20, height: 10, border: "1.4px solid #fff", borderRadius: 3, position: "relative" }}>
              <span style={{ position: "absolute", inset: 1.5, right: 5, background: "#fff", borderRadius: 1 }} />
            </span>
          </span>
        </div>

        {/* greeting */}
        <div style={{ padding: "14px 18px 10px", textAlign: "center" }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, margin: "0 auto 12px", background: `linear-gradient(135deg,${CORAL},${CORAL_DK})`, display: "grid", placeItems: "center", boxShadow: `0 10px 24px -6px ${CORAL}aa` }}>
            <GraduationCap size={24} color="#fff" />
          </div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 19, color: "#fff", lineHeight: 1.25 }}>
            Hi Aspirant,<br />your rank is ready
          </div>
        </div>

        {/* cards */}
        <div style={{ padding: "6px 14px 16px", display: "flex", flexDirection: "column", gap: 9 }}>
          <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 14, padding: "12px 13px" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 700, letterSpacing: ".5px" }}>PREDICTED RANK</div>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: "#fff", marginTop: 2 }}>AIR&nbsp;4,846</div>
            <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
              <TrendingUp size={12} /> Top 1.2% percentile
            </div>
          </div>
          <div style={{ background: "rgba(255,90,54,.14)", border: "1px solid rgba(255,90,54,.3)", borderRadius: 14, padding: "11px 13px" }}>
            <div style={{ fontSize: 10, color: "#ffb59e", fontWeight: 700, letterSpacing: ".5px" }}>TOP MATCH</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,255,255,.14)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Trophy size={14} color="#fff" />
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: "#fff" }}>IIT Bombay</div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.6)" }}>CSE · 96% chance</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 14, padding: "10px 13px" }}>
            <CalendarDays size={15} color={VIOLET} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>JoSAA Round 1</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)" }}>Choice filling · Jun 28</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#0f0f18", background: CORAL, padding: "3px 8px", borderRadius: 6 }}>2d</span>
          </div>
        </div>

        {/* bottom nav */}
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0 14px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
          {[Crosshair, GraduationCap, Users, MapPin].map((Icon, i) => (
            <Icon key={i} size={18} color={i === 0 ? CORAL : "rgba(255,255,255,.4)"} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   HERO — MAIN EXPORT
════════════════════════════════════════════════ */
export default function Hero() {
  const nav = useNavigate();
  const { isXs, isMobile, isTablet, isSmall } = useBreakpoint();

  const headingSize = isXs ? "2.5rem" : isMobile ? "3rem" : isTablet ? "4rem" : "clamp(4.2rem, 5.4vw, 5.4rem)";

  return (
    <section style={{ position: "relative", overflow: "hidden", width: "100%", boxSizing: "border-box" }}>
      {/* ── layered warm-coral → violet → mist background ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: `
          radial-gradient(120% 75% at 50% -12%, rgba(255,138,92,.55), transparent 55%),
          radial-gradient(80% 55% at 82% 8%, rgba(255,90,54,.20), transparent 60%),
          radial-gradient(90% 60% at 12% 26%, rgba(139,92,246,.18), transparent 62%),
          linear-gradient(180deg, #FFEADD 0%, #FCE1E7 18%, #F0E6F6 42%, #E7E7F6 62%, #F4F2FB 84%, #FFFFFF 100%)
        `,
      }} />
      {/* soft blurred "mountain" blobs */}
      <div aria-hidden style={{ position: "absolute", left: "-8%", top: "34%", width: 520, height: 320, background: "rgba(139,92,246,.22)", filter: "blur(80px)", borderRadius: "50%", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", right: "-6%", top: "40%", width: 480, height: 300, background: "rgba(255,90,54,.16)", filter: "blur(80px)", borderRadius: "50%", zIndex: 0 }} />

      <div className="container" style={{
        position: "relative", zIndex: 2, width: "100%",
        paddingInline: "1.5rem", boxSizing: "border-box",
        paddingTop: isXs ? 118 : isMobile ? 128 : isTablet ? 138 : 150,
      }}>
        {/* ══ Headline with floating cards ══ */}
        <div style={{ position: "relative", maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          {!isSmall && (
            <>
              <FloatCard delay={0.4} style={{ top: -6, right: "6%", transform: "rotate(3deg)" }}>
                <RankChip />
              </FloatCard>
              <FloatCard delay={0.55} float={10} style={{ top: 92, left: "3%", transform: "rotate(-3deg)" }}>
                <PredictionCard />
              </FloatCard>
            </>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'Space Grotesk','Sora',system-ui,sans-serif",
              fontWeight: 800, color: INK, fontSize: headingSize,
              lineHeight: 1.06, letterSpacing: "-0.04em", margin: 0,
              position: "relative", zIndex: 3,
            }}
          >
            Predict your <span style={{ color: CORAL }}>rank</span>
            <br />
            find your dream <span style={{ position: "relative", color: CORAL, whiteSpace: "nowrap" }}>
              college
              <svg width="100%" height="12" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: "-0.12em", width: "100%" }}>
                <path d="M3 8C40 3 70 3 100 6C130 9 160 9 197 4" stroke={CORAL} strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              margin: isSmall ? "1.4rem auto 0" : "2.2rem auto 0", maxWidth: 560,
              fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 400,
              fontSize: isXs ? "1rem" : "1.15rem", color: "rgba(28,28,40,.62)", lineHeight: 1.55,
            }}
          >
            An <b style={{ color: CORAL, fontWeight: 700 }}>IIT Roorkee</b> startup — predict your JEE &amp; NEET rank,
            match every IIT · NIT · IIIT, and track each counselling deadline. All free.
          </motion.p>
        </div>

        {/* ══ Twin CTAs ══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, margin: "2rem 0 0" }}
        >
          <button
            onClick={() => nav("/how-to-use")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
              padding: "13px 26px", borderRadius: 9999, whiteSpace: "nowrap",
              background: "rgba(255,255,255,.75)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(28,28,40,.1)", color: INK,
              fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 600, fontSize: isXs ? 14 : 15,
              boxShadow: "0 4px 14px rgba(28,28,40,.06)",
            }}
          >
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: CORAL, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Play size={11} color="#fff" fill="#fff" style={{ marginLeft: 1 }} />
            </span>
            Watch demo
          </button>
          <button
            onClick={() => nav("/jee-main#college")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
              padding: "14px 30px", borderRadius: 9999, whiteSpace: "nowrap",
              background: INK, border: "none", color: "#fff",
              fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 600, fontSize: isXs ? 14 : 15,
              boxShadow: "0 10px 26px -6px rgba(28,28,40,.4)",
              transition: "transform .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
          >
            Predict my college <ArrowRight size={17} />
          </button>
        </motion.div>

        {/* ══ Logo cloud ══ */}
        <div style={{ margin: isSmall ? "2.6rem 0 0" : "3.4rem 0 0" }}>
          <LogoCloud isMobile={isMobile} />
        </div>

        {/* ══ Product mockups rising from the mist ══ */}
        <div style={{
          position: "relative", marginTop: isSmall ? "2.4rem" : "3.4rem",
          maxHeight: isSmall ? 340 : 430, overflow: "hidden",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", display: "flex", justifyContent: "center", paddingBottom: 40 }}
          >
            {isMobile ? (
              /* mobile — dashboard only, scaled to fit */
              <div style={{ transform: "scale(0.46)", transformOrigin: "top center", height: 300 }}>
                <DashboardMock />
              </div>
            ) : (
              <div style={{ position: "relative", width: isTablet ? 720 : 900, maxWidth: "100%", display: "flex", justifyContent: "center" }}>
                <div style={{ transform: isTablet ? "scale(0.82)" : "none", transformOrigin: "top center" }}>
                  <DashboardMock />
                </div>
                {/* phone overlapping right edge */}
                <div style={{ position: "absolute", right: isTablet ? -6 : 8, bottom: -20, transform: isTablet ? "scale(0.88)" : "none", transformOrigin: "bottom right" }}>
                  <PhoneMock />
                </div>
              </div>
            )}
          </motion.div>

          {/* mist fade over the bottom of the mockups */}
          <div aria-hidden style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: isSmall ? 90 : 130,
            background: "linear-gradient(180deg, transparent, #FFFFFF 82%)", pointerEvents: "none",
          }} />
        </div>
      </div>
    </section>
  );
}
