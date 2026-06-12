import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Sparkles, TrendingUp, Crosshair,
  GraduationCap, Users, Star, Award, ArrowRight,
  BookOpen, Target, MapPin, Trophy, Zap, ChevronRight,
} from "lucide-react";
import {
  TypewriterText,
  FloatingOrbs,
  GradientText,
  RippleButton,
  AnimatedNumber,
} from "../Animations.jsx";

/* ════════════════════════════════════════════════
   HOOK — useIsMobile / useBreakpoint
════════════════════════════════════════════════ */
/*
  Device breakpoints (CSS logical pixels / device-independent pixels):
  xs      : ≤ 430px  — small Android, iPhone SE/14/15 mini
  mobile  : ≤ 768px  — iPhone 14/15 Pro, Android, phablets
  tablet  : ≤ 1024px — iPad mini/Air/10th portrait + landscape, Android tablets
  ipadpro : ≤ 1366px — iPad Pro 11" landscape, iPad Pro 12.9" both
  desktop : > 1366px — MacBook Air/Pro, Windows laptops, iMac
*/
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
    isMobile:  bp === "mobile" || bp === "xs",
    isXs:      bp === "xs",
    isTablet:  bp === "tablet" || bp === "ipadpro",
    isDesktop: bp === "desktop",
    isSmall:   bp !== "desktop" && bp !== "ipadpro",
  };
}

/* ════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════ */
const ABOUT_ACCENT = "#f5a623";

const QUICK = ["IIT Bombay", "JEE Main 2026", "College Predictor", "NIT Trichy", "VITEEE", "JEE Advanced"];

const TOP_COLLEGES = [
  { name: "IIT Bombay",  type: "IIT",  nirf: 3,  avg: "₹33.8L", placed: 96, color: "#6366f1" },
  { name: "IIT Delhi",   type: "IIT",  nirf: 2,  avg: "₹32.3L", placed: 96, color: "#F97316" },
  { name: "IIT Roorkee",  type: "IIT",  nirf: 6,  avg: "₹30.7L", placed: 95, color: "#0ea5a4" },
  { name: "IIT Madras",  type: "IIT",  nirf: 1, avg: "₹31.2L", placed: 97, color: "#8b5cf6" },
  { name: "IIT Kanpur",    type: "IIT", nirf: 4, avg: "₹32.6L", placed: 97, color: "#10b981" },
];

/* ════════════════════════════════════════════════
   STATS BAR
════════════════════════════════════════════════ */
function StatsBar({ isMobile, isXs }) {
  const stats = [
    { icon: <Users size={isXs ? 16 : 20} />,      val: "2.4L+",   lbl: "Students helped",    iconClass: "orange" },
    { icon: <BookOpen size={isXs ? 16 : 20} />,   val: "850+",    lbl: "Colleges listed",    iconClass: "teal"   },
    { icon: <Target size={isXs ? 16 : 20} />,     val: "98% acc", lbl: "Rank predictions",   iconClass: "green"  },
    { icon: <TrendingUp size={isXs ? 16 : 20} />, val: "1.2M+",   lbl: "Cutoff data points", iconClass: "orange" },
  ];

  const palette = {
    orange: { bg: "rgba(244,123,32,.18)",  border: "rgba(244,123,32,.35)", color: "#F47B20" },
    teal:   { bg: "rgba(14,165,164,.15)",  border: "rgba(14,165,164,.30)", color: "#0ea5a4" },
    green:  { bg: "rgba(34,197,94,.13)",   border: "rgba(34,197,94,.28)",  color: "#22c55e" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: isXs ? 8 : 12,
        maxWidth: 580,
        margin: "0 auto",
        padding: isXs ? "14px 0" : "20px 0",
        borderTop: "1px solid rgba(244,123,32,.20)",
        borderBottom: "1px solid rgba(244,123,32,.20)",
      }}
    >
      {stats.map(({ icon, val, lbl, iconClass }) => {
        const c = palette[iconClass];
        return (
          <div
            key={lbl}
            style={{
              display: "flex",
              alignItems: "center",
              gap: isXs ? 7 : 10,
              background: "rgba(255,255,255,.72)",
              border: "1px solid rgba(244,123,32,.18)",
              borderRadius: 12,
              padding: isXs ? "8px 7px" : "12px 10px",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                width: isXs ? 30 : 38,
                height: isXs ? 30 : 38,
                borderRadius: 9,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                background: c.bg,
                border: `1px solid ${c.border}`,
                color: c.color,
              }}
            >
              {icon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Space Grotesk','Sora',sans-serif",
                  fontWeight: 800,
                  fontSize: isXs ? "0.82rem" : "clamp(.9rem,1.8vw,1.05rem)",
                  color: "#1c1c28",
                  lineHeight: 1.1,
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: isXs ? 9 : 10.5,
                  color: "rgba(28,28,40,.50)",
                  marginTop: 3,
                  fontFamily: "'DM Sans',sans-serif",
                  lineHeight: 1.3,
                }}
              >
                {lbl}
              </div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   MESH DOTS CANVAS — performance-aware
════════════════════════════════════════════════ */
function MeshDots({ dotCount = 80 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const COLORS = ["#6366f1", "#F97316", "#0ea5a4", "#8b5cf6", "#f4a261", "#ffffff"];
    const dots = Array.from({ length: dotCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.4 + 0.05,
      sx: (Math.random() - 0.5) * 0.2,
      sy: (Math.random() - 0.5) * 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.sx;
        d.y += d.sy;
        d.pulse += 0.015;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = d.alpha * (0.5 + 0.5 * Math.sin(d.pulse));
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [dotCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

/* ════════════════════════════════════════════════
   ABOUT US CARD (left panel — desktop only)
════════════════════════════════════════════════ */
function AboutUsCard() {
  const nav = useNavigate();
  const ACCENT = ABOUT_ACCENT;

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}   /* x:0 — no horizontal bleed on any size */
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="hero-about-col"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(244,123,32,.20)",
        borderRadius: 20,
        padding: "1.1rem 1.2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        boxShadow: "0 8px 30px rgba(13,27,62,.08)",
        position: "relative",
        overflow: "hidden",
        minWidth: 0, /* prevent flex blowout */
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: "rgba(244,123,32,.12)",
                  border: "1.5px solid rgba(244,123,32,.3)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: 13,
                    color: "#F47B20",
                    letterSpacing: "0.5px",
                  }}>CP</span>
                </div>
        <div>
          <div style={{ fontSize: 9.5, color: "#F47B20", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" }}>About Us</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, color: "#1c1c28", fontSize: "1rem" }}>College Parichay</div>
        </div>
        <span style={{ marginLeft: "auto", width: 9, height: 9, borderRadius: "50%", background: "#22c55e", display: "block", flexShrink: 0 }} />
      </div>

      <div style={{ height: 1, background: "rgba(0,0,0,.07)" }} />

      {/* Origin story */}
      <div style={{
        background: "rgba(244,123,32,.06)",
        border: "1px solid rgba(244,123,32,.14)",
        borderRadius: 10, padding: "10px 12px",
      }}>
        <div style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 6 }}>Our Story</div>
        <p style={{ fontSize: 12, color: "rgba(28,28,40,.7)", lineHeight: 1.65, margin: 0 }}>
          Built in an <span style={{ color: "#F47B20", fontWeight: 700 }}>IIT Roorkee</span> hostel room by students who lived the JoSAA chaos — and decided to fix it for everyone after them.
        </p>
      </div>

      {/* Values */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {[
          { emoji: "🛡️", label: "Honest data",   sub: "Real cutoffs, real caveats" },
          { emoji: "❤️", label: "Student-first", sub: "Built by students, for students" },
          { emoji: "⚡", label: "One platform",  sub: "Rank · College · Counselling" },
        ].map(({ emoji, label, sub }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(0,0,0,.025)", border: "1px solid rgba(0,0,0,.06)",
            borderRadius: 10, padding: "8px 11px",
          }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>{emoji}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1c28" }}>{label}</div>
              <div style={{ fontSize: 10.5, color: "rgba(28,28,40,.5)" }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "rgba(0,0,0,.07)" }} />

      {/* Mini stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ val: "IIT-R", lbl: "Founded" }, { val: "3", lbl: "Engineers" }, { val: "Free", lbl: "Always" }].map(({ val, lbl }) => (
          <div key={lbl} style={{
            textAlign: "center", background: "rgba(0,0,0,.025)",
            borderRadius: 9, padding: "8px 4px",
          }}>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, color: "#1c1c28" }}>{val}</div>
            <div style={{ fontSize: 10, color: "rgba(28,28,40,.5)", marginTop: 1 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => nav("/about")}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          background: "#F47B20",
          color: "#fff", border: "none", borderRadius: 11,
          padding: "10px 14px", fontSize: 12.5, fontWeight: 800,
          fontFamily: "Sora", cursor: "pointer", marginTop: "auto",
          transition: "background .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#e36a14"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#F47B20"; }}
      >
        Our Story <ArrowRight size={13} />
      </button>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   DEVELOPER PROFILE CARD (left panel — desktop only)
════════════════════════════════════════════════ */
function DevProfileCard() {
  const nav = useNavigate();
  const ACCENT = "#F47B20";
  const SKILLS = ["React", "Node.js", "AI / GPT", "Python", "MongoDB", "REST APIs"];

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="hero-about-col"
      style={{
        background: "rgba(10,10,26,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 20,
        padding: "1.1rem 1.2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        boxShadow: "0 0 0 1px rgba(255,255,255,.06), 0 24px 64px rgba(0,0,0,.6)",
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${ACCENT}20`, border: `1.5px solid ${ACCENT}40`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 17 }}>👨‍💻</span>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase" }}>Developer</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, color: "#fff", fontSize: ".97rem" }}>Ankit Yadav GPT</div>
        </div>
        <motion.span
          animate={{ boxShadow: ["0 0 0px #22c55e", "0 0 12px #22c55e", "0 0 0px #22c55e"] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ marginLeft: "auto", width: 9, height: 9, borderRadius: "50%", background: "#22c55e", display: "block", flexShrink: 0 }}
        />
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${ACCENT}, #ea580c)`,
          display: "grid", placeItems: "center",
          border: `2px solid ${ACCENT}66`,
          boxShadow: `0 0 22px ${ACCENT}44`,
          position: "relative",
        }}>
          <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 20, color: "#fff" }}>AK</span>
          <span style={{ position: "absolute", bottom: 2, right: 2, width: 11, height: 11, borderRadius: "50%", background: "#22c55e", border: "2px solid #0a0a1a", boxShadow: "0 0 8px #22c55e" }} />
        </div>
        <div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: "#fff" }}>Ankit Yadav GPT</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 }}>
            <span style={{ fontSize: 10, background: "rgba(244,123,32,.18)", color: "#fdba74", border: "1px solid rgba(244,123,32,.32)", padding: "2px 8px", borderRadius: 50, fontWeight: 700 }}>IIT Roorkee</span>
            <span style={{ fontSize: 10, background: "rgba(99,102,241,.18)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,.28)", padding: "2px 8px", borderRadius: 50, fontWeight: 700 }}>AI Dev</span>
          </div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.42)", marginTop: 3 }}>AIR 4846 · JEE Advanced · Founder</div>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

      <div>
        <div style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>Tech Stack</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SKILLS.map((s) => (
            <span key={s} style={{
              fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 50,
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.10)",
              color: "rgba(255,255,255,.78)", fontFamily: "'DM Sans', sans-serif",
            }}>{s}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ val: "850+", lbl: "Colleges" }, { val: "8 yrs", lbl: "Data" }, { val: "50K+", lbl: "Students" }].map(({ val, lbl }) => (
          <div key={lbl} style={{ textAlign: "center", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, padding: "8px 4px" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: ACCENT }}>{val}</div>
            <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.38)", marginTop: 1 }}>{lbl}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => nav("/developer")}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          background: `linear-gradient(135deg, ${ACCENT}, #ea580c)`,
          color: "#fff", border: "none", borderRadius: 11,
          padding: "10px 14px", fontSize: 12.5, fontWeight: 700,
          fontFamily: "Sora", cursor: "pointer", marginTop: "auto",
          boxShadow: `0 4px 20px ${ACCENT}55`, transition: "all .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${ACCENT}88`; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 20px ${ACCENT}55`; }}
      >
        View Developer Profile <ArrowRight size={13} />
      </button>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   LIVE COLLEGE PANEL (right panel)
   Visible: desktop (full) · tablet (condensed, right col)
════════════════════════════════════════════════ */
function LiveCollegePanel({ isTablet }) {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % TOP_COLLEGES.length), 2800);
    return () => clearInterval(t);
  }, []);
  const c = TOP_COLLEGES[activeIdx];

  /* On tablet show only 3 colleges to save space */
  const colleges = isTablet ? TOP_COLLEGES.slice(0, 3) : TOP_COLLEGES;

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="hero-about-col"
      style={{
        background: "rgba(10,10,26,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 20,
        padding: isTablet ? "0.9rem 1rem" : "1.1rem 1.2rem",
        display: "flex",
        flexDirection: "column",
        gap: isTablet ? "0.7rem" : "0.9rem",
        boxShadow: "0 0 0 1px rgba(255,255,255,.06), 0 24px 64px rgba(0,0,0,.6)",
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${c.color}, transparent)`, transition: "background .6s" }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: `${c.color}22`, border: `1.5px solid ${c.color}44`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <GraduationCap size={19} color={c.color} />
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>Live College Data</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, color: "#fff", fontSize: isTablet ? ".88rem" : "1rem" }}>Top Institutes 2026</div>
        </div>
        <motion.span
          animate={{ boxShadow: ["0 0 0px #22c55e", "0 0 14px #22c55e", "0 0 0px #22c55e"], scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ marginLeft: "auto", width: 9, height: 9, borderRadius: "50%", background: "#22c55e", display: "block" }}
        />
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

      {/* College list */}
      <div style={{ display: "flex", flexDirection: "column", gap: isTablet ? 6 : 8 }}>
        {colleges.map((col, i) => (
          <motion.div
            key={col.name}
            animate={{ opacity: i === activeIdx % colleges.length ? 1 : 0.45, scale: i === activeIdx % colleges.length ? 1 : 0.97 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: i === activeIdx % colleges.length ? `${col.color}18` : "rgba(255,255,255,.03)",
              border: `1px solid ${i === activeIdx % colleges.length ? col.color + "44" : "rgba(255,255,255,.06)"}`,
              borderRadius: 10, padding: isTablet ? "6px 8px" : "7px 10px",
              transition: "border .4s, background .4s",
            }}
          >
            <span style={{ width: 28, height: 28, borderRadius: 8, background: `${col.color}22`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 9, color: col.color }}>{col.type}</span>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: isTablet ? 11 : 12, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.name}</div>
              <div style={{ fontSize: isTablet ? 9 : 10, color: "#9ca3af", whiteSpace: "nowrap" }}>NIRF #{col.nirf} · {col.placed}% placed</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 800, fontSize: isTablet ? 11 : 12.5, color: col.color }}>{col.avg}</div>
              <div style={{ fontSize: 9.5, color: "#6b7280" }}>avg pkg</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini stat row — lifted up: tighter top margin so the IITs/NITs/IIITs
          counts + Explore button sit a touch higher in the panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: -2 }}>
        {[{ val: "23", lbl: "IITs" }, { val: "31", lbl: "NITs" }, { val: "26+", lbl: "IIITs" }].map(({ val, lbl }) => (
          <div key={lbl} style={{ textAlign: "center", background: "rgba(255,255,255,.04)", borderRadius: 9, padding: isTablet ? "6px 4px" : "8px 4px" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: isTablet ? 13 : 15, color: "#fff" }}>{val}</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <button
        onClick={() => window.location.href = "/colleges"}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          background: "linear-gradient(135deg, #F97316, #ea580c)",
          color: "#fff", border: "none", borderRadius: 11,
          padding: isTablet ? "9px 12px" : "11px 16px",
          fontSize: isTablet ? 12 : 13, fontWeight: 700,
          fontFamily: "Sora", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(249,115,22,.4)", transition: "all .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(249,115,22,.55)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,.4)"; }}
      >
        Explore All Colleges <ArrowRight size={14} />
      </button>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   MENTORSHIP CARD (right panel) — JEE & NEET 2027 / 2028
   Replaces the old live-college panel. Dynamic + animated.
════════════════════════════════════════════════ */
function MentorshipHeroCard({ isTablet }) {
  const nav = useNavigate();
  const GOLD = "#f5a623";
  const [active, setActive] = useState(0);

  // rotating spotlight across the JEE/NEET tracks
  const tracks = [
    { exam: "JEE 2027",  price: "₹1999", color: "#f5a623", to: "/mentorship/jee-2027" },
    { exam: "NEET 2027", price: "₹1999", color: "#22c55e", to: "/mentorship/jee-2027" },
    { exam: "JEE 2028",  price: "₹3999", color: "#f5a623", to: "/mentorship/jee-2028" },
    { exam: "NEET 2028", price: "₹3999", color: "#22c55e", to: "/mentorship/jee-2028" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="hero-about-col"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(244,123,32,.20)",
        borderRadius: 20,
        padding: isTablet ? "0.95rem 1rem" : "1.1rem 1.2rem",
        display: "flex", flexDirection: "column", gap: isTablet ? "0.7rem" : "0.85rem",
        boxShadow: "0 8px 30px rgba(13,27,62,.08)",
        position: "relative", overflow: "hidden", minWidth: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(244,123,32,.12)", border: "1.5px solid rgba(244,123,32,.3)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <GraduationCap size={20} color="#F47B20" />
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: "#F47B20", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" }}>1-on-1 Mentorship</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, color: "#1c1c28", fontSize: isTablet ? ".9rem" : "1rem" }}>JEE & NEET · 2027 · 2028</div>
        </div>
        <span style={{ marginLeft: "auto", width: 9, height: 9, borderRadius: "50%", background: "#22c55e", display: "block" }} />
      </div>

      <div style={{ height: 1, background: "rgba(0,0,0,.07)" }} />

      {/* Mentorship tracks */}
      <div style={{ display: "flex", flexDirection: "column", gap: isTablet ? 6 : 8 }}>
        {tracks.map((tr) => (
          <div
            key={tr.exam}
            onClick={() => nav(tr.to)}
            style={{
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
              background: `${tr.color}12`,
              border: `1px solid ${tr.color}33`,
              borderRadius: 10, padding: isTablet ? "7px 9px" : "8px 11px",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: tr.color, flexShrink: 0 }} />
            <span style={{ flex: 1, fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: isTablet ? 12 : 13, color: "#1c1c28" }}>{tr.exam} Mentorship</span>
            <span style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 800, fontSize: isTablet ? 12 : 13.5, color: tr.color }}>{tr.price}</span>
          </div>
        ))}
      </div>

      {/* mini stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ val: "1:1", lbl: "Mentor" }, { val: "1000+", lbl: "Students" }, { val: "Daily", lbl: "Targets" }].map(({ val, lbl }) => (
          <div key={lbl} style={{ textAlign: "center", background: "rgba(0,0,0,.025)", borderRadius: 9, padding: isTablet ? "6px 4px" : "8px 4px" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: isTablet ? 13 : 15, color: "#1c1c28" }}>{val}</div>
            <div style={{ fontSize: 10, color: "rgba(28,28,40,.5)", marginTop: 1 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => nav("/mentorship/jee-2027")}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          background: "#F47B20",
          color: "#fff", border: "none", borderRadius: 11,
          padding: isTablet ? "9px 12px" : "11px 16px",
          fontSize: isTablet ? 12 : 13, fontWeight: 800,
          fontFamily: "Sora", cursor: "pointer",
          transition: "background .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#e36a14"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#F47B20"; }}
      >
        Explore Mentorship <ArrowRight size={14} />
      </button>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   HERO — MAIN EXPORT
════════════════════════════════════════════════ */
export default function Hero({ onSearch }) {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const { bp, isMobile, isXs, isTablet, isDesktop } = useBreakpoint();

  const go = (term) => {
    const t = (term ?? q).trim();
    if (t) nav(`/search?q=${encodeURIComponent(t)}`);
  };

  /* ── Responsive heading font size ── */
  const headingSize =
    isXs                          ? "1.8rem"  :
    isMobile                      ? "2rem"    :
    bp === "tablet"               ? "2.4rem"  :
    bp === "ipadpro"              ? "clamp(2.8rem,4vw,3.4rem)" :
    "clamp(3.2rem,4.8vw,4.2rem)";

  /* ── Grid columns ── */
  const gridCols =
    isMobile  ? "1fr" :
    isTablet  ? "1fr minmax(0,290px)" :
    "300px 1fr 300px";

  /* ── Hero background — warm gradient on all sizes ── */
  const heroBg = "linear-gradient(160deg, #ffffff 0%, #ffffff 40%, #ffffff 72%, #ffffff 100%)";

  /* ── Dot/orb counts for performance ── */
  const dotCount  = isMobile ? 30 : isTablet ? 50 : 80;
  const orbCount  = isMobile ? 3 : isTablet ? 4 : 6;

  /* ── Text/accent colors — warm light theme on all sizes ── */
  const textColor    = "#1c1c28";
  const subColor     = "rgba(28,28,40,.62)";
  const borderColor  = "rgba(244,123,32,.18)";

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",           /* ← stops framer-motion x offset from causing scroll */
        background: heroBg,
        paddingTop: isXs ? 114 : isMobile ? 124 : isTablet ? 134 : 144,
        paddingBottom: isXs ? 40 : isMobile ? 52 : isTablet ? 60 : 70,
        minHeight: isMobile ? "auto" : isTablet ? "90vh" : "95vh",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* ═══ Content wrapper ═══ */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          paddingInline: isXs ? "0.85rem" : isMobile ? "1rem" : isTablet ? "1.25rem" : "1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: isMobile ? 0 : isTablet ? "1.25rem" : "1.75rem",
            alignItems: "center",
            width: "100%",
          }}
        >

          {/* ══ LEFT — About Us Card (desktop only, hidden via CSS class) ══ */}
          <AboutUsCard />

          {/* ══ CENTER ══ */}
          <div style={{ textAlign: "center", minWidth: 0 }}>

            {/* Badge */}
            <div>
              <span
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "rgba(244,123,32,.10)",
                  border: "1px solid rgba(244,123,32,.30)",
                  color: "#F47B20",
                  fontSize: isXs ? 11 : 12, fontWeight: 700, letterSpacing: "0.5px",
                  padding: isXs ? "5px 12px" : "6px 16px", borderRadius: 50,
                  marginBottom: isXs ? 16 : 22,
                  fontFamily: "'Space Grotesk',sans-serif",
                }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                {isXs ? "JEE 2026 is Live" : "JEE 2026 Season is Live — Start Your Journey"}
              </span>
            </div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.05 }}>
              <h1 style={{
                fontFamily: "'Space Grotesk','Sora',sans-serif",
                fontWeight: 800,
                color: textColor,
                fontSize: headingSize,
                lineHeight: 1.04,
                margin: "0 0 1.1rem",
                letterSpacing: "-0.03em",
              }}>
                Know Your Rank.{" "}
                <br />
                <GradientText from="#F47B20" via="#fbbf24" to="#F97316">Find Your College.</GradientText>
              </h1>

              <p style={{
                color: subColor,
                fontSize: isXs ? ".85rem" : "clamp(.92rem,1.7vw,1.08rem)",
                maxWidth: 540, margin: "0 auto 0.6rem",
                lineHeight: 1.75,
              }}>
                Predict your JEE rank from marks, discover every college you can get into across all JoSAA &amp; CSAB rounds, and track every deadline — all in one place.
              </p>

              <div style={{ marginBottom: "1.4rem" }} />
            </motion.div>

            {/* ── Search bar ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              style={{ maxWidth: 560, margin: "0 auto 1rem" }}
            >
              <div style={{
                display: "flex",
                gap: 6,
                background: "rgba(255,255,255,.97)",
                padding: isXs ? 5 : 6,
                borderRadius: 14,
                boxShadow: "0 8px 28px rgba(13,27,62,.10), 0 0 0 1px rgba(244,123,32,.16)",
                border: "1px solid rgba(244,123,32,.18)",
              }}>
                <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 8, paddingLeft: isXs ? 10 : 14, minWidth: 0 }}>
                  <Search size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && go()}
                    placeholder="Search colleges, exams…"
                    onFocus={onSearch}
                    style={{
                      border: "none",
                      outline: "none",
                      flex: 1,
                      minWidth: 0,
                      fontSize: 14,        /* ← min 14px prevents iOS auto-zoom */
                      fontFamily: "DM Sans",
                      background: "transparent",
                      color: "#111",
                    }}
                  />
                </div>
                <button
                  className="btn btn-coral"
                  onClick={() => go()}
                  style={{
                    borderRadius: 10,
                    padding: isXs ? "8px 14px" : "9px 20px",
                    fontSize: isXs ? 13 : 14,   /* ← never below 13px */
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Search
                </button>
              </div>
            </motion.div>

            {/* ── Quick chips ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                display: "flex",
                gap: isXs ? 5 : 7,
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: isMobile ? "1.4rem" : "1.8rem",
              }}
            >
              {QUICK.map((t) => (
                <button
                  key={t}
                  onClick={() => t === "College Predictor" ? nav("/jee-main#college") : go(t)}
                  style={{
                    padding: isXs ? "4px 10px" : "5px 13px",
                    borderRadius: 50,
                    background: "rgba(244,123,32,.10)",
                    border: "1px solid rgba(244,123,32,.30)",
                    color: "#c75b0a",
                    fontSize: isXs ? 11.5 : 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .2s",
                    fontFamily: "DM Sans",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,123,32,.22)"; e.currentTarget.style.borderColor = "#F47B20"; e.currentTarget.style.color = "#a04010"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(244,123,32,.10)";
                    e.currentTarget.style.borderColor = "rgba(244,123,32,.30)";
                    e.currentTarget.style.color = "#c75b0a";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  {t}
                </button>
              ))}
            </motion.div>

            {/* ── CTA buttons ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: "flex",
                gap: isMobile ? 10 : 12,
                justifyContent: "center",
                flexWrap: "wrap",
                flexDirection: isMobile ? "column" : "row",   /* ← stack on mobile */
                alignItems: isMobile ? "stretch" : "center",
                marginBottom: isMobile ? "2rem" : "2.8rem",
                paddingInline: isMobile ? "0" : "0",
              }}
            >
              <RippleButton
                className="btn btn-shimmer btn-glow hero-cp-highlight"
                onClick={() => nav("/jee-main#college")}
                style={{
                  padding: isXs ? "11px 22px" : "12px 26px",
                  fontSize: isXs ? 14 : 15,
                  fontWeight: 800,
                  borderRadius: 12,
                  gap: 8,
                  background: "#F47B20",
                  color: "#fff",
                  border: "none",
                  letterSpacing: "0.2px",
                  boxShadow: "0 6px 18px rgba(244,123,32,.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: isMobile ? "100%" : "auto",
                  position: "relative",
                }}
                color="rgba(255,255,255,0.45)"
              >
                <Crosshair size={isXs ? 17 : 19} /> College Predictor
              </RippleButton>

              <RippleButton
                className="btn btn-shimmer btn-glow"
                onClick={() => nav("/jee-advanced-result-2026")}
                style={{
                  padding: isXs ? "11px 20px" : "12px 24px",
                  fontSize: isXs ? 13.5 : 14.5,
                  fontWeight: 700,
                  borderRadius: 12,
                  gap: 8,
                  background: "#F47B20",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 6px 18px rgba(244,123,32,.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: isMobile ? "100%" : "auto",
                  position: "relative",
                }}
                color="rgba(255,255,255,0.4)"
              >
                <Trophy size={isXs ? 16 : 18} /> JEE Advanced Result 2026
              </RippleButton>

              <RippleButton
                className="btn btn-shimmer"
                onClick={() => nav("/neet")}
                style={{
                  padding: isXs ? "11px 20px" : "12px 24px",
                  fontSize: isXs ? 13.5 : 14.5,
                  fontWeight: 700,
                  borderRadius: 12,
                  gap: 8,
                  background: "#F47B20",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 6px 18px rgba(244,123,32,.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: isMobile ? "100%" : "auto",
                }}
                color="rgba(255,255,255,0.4)"
              >
                <Award size={isXs ? 16 : 18} /> NEET 2026
              </RippleButton>
            </motion.div>

            {/* ── Stats bar ── */}
            <StatsBar isMobile={isMobile} isXs={isXs} />

          </div>
          {/* ══ end CENTER ══ */}

          {/* ══ RIGHT — Mentorship Card (hidden on mobile via CSS .hero-about-col) ══ */}
          <MentorshipHeroCard isTablet={isTablet} />

        </div>
      </div>

    </section>
  );
}