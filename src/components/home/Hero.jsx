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
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w <= 480)  return "xs";
    if (w <= 768)  return "mobile";
    if (w <= 1080) return "tablet";
    if (w <= 1180) return "ipadpro";
    return "desktop";
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 480)  setBp("xs");
      else if (w <= 768)  setBp("mobile");
      else if (w <= 1080) setBp("tablet");
      else if (w <= 1180) setBp("ipadpro");
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
const ABOUT_ACCENT = "#F47B20";

const QUICK = ["IIT Bombay", "JEE Main 2026", "College Predictor", "NIT Trichy", "VITEEE", "JEE Advanced"];

const TOP_COLLEGES = [
  { name: "IIT Bombay",  type: "IIT",  nirf: 3,  avg: "₹21.8L", placed: 96, color: "#6366f1" },
  { name: "IIT Delhi",   type: "IIT",  nirf: 2,  avg: "₹20.4L", placed: 95, color: "#F97316" },
  { name: "IIT Madras",  type: "IIT",  nirf: 1,  avg: "₹24.4L", placed: 94, color: "#0ea5a4" },
  { name: "NIT Trichy",  type: "NIT",  nirf: 10, avg: "₹11.2L", placed: 92, color: "#8b5cf6" },
  { name: "IIIT Hyd",    type: "IIIT", nirf: 24, avg: "₹18.6L", placed: 97, color: "#10b981" },
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
        borderTop: "1px solid rgba(255,255,255,.08)",
        borderBottom: "1px solid rgba(255,255,255,.08)",
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
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12,
              padding: isXs ? "8px 7px" : "12px 10px",
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
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: isXs ? 9 : 10.5,
                  color: "rgba(255,255,255,.42)",
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
        minWidth: 0, /* prevent flex blowout */
      }}
    >
      {/* Top glow bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${ACCENT}20`, border: `1.5px solid ${ACCENT}40`,
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 17 }}>🎓</span>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase" }}>About Us</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, color: "#fff", fontSize: ".97rem" }}>College Parichay</div>
        </div>
        <motion.span
          animate={{ boxShadow: ["0 0 0px #22c55e", "0 0 12px #22c55e", "0 0 0px #22c55e"] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ marginLeft: "auto", width: 9, height: 9, borderRadius: "50%", background: "#22c55e", display: "block", flexShrink: 0 }}
        />
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

      {/* Origin story */}
      <div style={{
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 11, padding: "10px 12px",
      }}>
        <div style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 6 }}>Our Story</div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.65, margin: 0 }}>
          Built in an <span style={{ color: ACCENT, fontWeight: 700 }}>IIT Roorkee</span> hostel room by students who lived the JoSAA chaos — and decided to fix it for everyone after them.
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
            background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 9, padding: "7px 10px",
          }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>{emoji}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{label}</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.38)" }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

      {/* Mini stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ val: "IIT-R", lbl: "Founded" }, { val: "3", lbl: "Engineers" }, { val: "Free", lbl: "Always" }].map(({ val, lbl }) => (
          <div key={lbl} style={{
            textAlign: "center", background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, padding: "8px 4px",
          }}>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: ACCENT }}>{val}</div>
            <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.38)", marginTop: 1 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => nav("/about")}
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

      <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

      {/* Mini stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
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
    isXs      ? "1.85rem" :
    isMobile  ? "1.85rem" :
    isTablet && bp === "tablet"   ? "2.2rem" :
    isTablet && bp === "ipadpro"  ? "2.8rem" :
    "clamp(3.2rem,5.8vw,4.2rem)";

  /* ── Grid columns ── */
  const gridCols =
    isMobile  ? "1fr" :
    isTablet  ? "1fr minmax(0,260px)" :
    "290px 1fr 290px";

  /* ── Hero background ── */
  const heroBg = isMobile
    ? "linear-gradient(160deg, #fff7f0 0%, #fde8d4 40%, #fddcbc 72%, #fbc99a 100%)"
    : "#080818";

  /* ── Dot/orb counts for performance ── */
  const dotCount  = isMobile || isTablet ? 40 : 80;
  const orbCount  = isMobile || isTablet ? 3  : 6;

  /* ── Text/accent colors change on mobile (light bg) ── */
  const textColor    = isMobile ? "#1c1c28" : "#fff";
  const subColor     = isMobile ? "rgba(28,28,40,.62)" : "rgba(255,255,255,.65)";
  const borderColor  = isMobile ? "rgba(244,123,32,.18)" : "rgba(255,255,255,.08)";

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",           /* ← stops framer-motion x offset from causing scroll */
        background: heroBg,
        paddingTop: isMobile ? 90 : isTablet ? 100 : 110,
        paddingBottom: isMobile ? 50 : 70,
        minHeight: isMobile ? "auto" : "95vh",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* ═══ Gradient backdrops — hidden on mobile (light bg) ═══ */}
      {!isMobile && (
        <>
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 65% 55% at -5% 5%, rgba(79,70,229,.45) 0%, rgba(67,56,202,.18) 35%, transparent 65%)" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 70% at 105% 20%, rgba(234,88,12,.70) 0%, rgba(249,115,22,.32) 35%, transparent 62%)" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 45% 40% at -5% 98%, rgba(14,165,164,.28) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 35% 50% at 50% 100%, rgba(139,92,246,.14) 0%, transparent 55%)" }} />
          {/* Mesh grid */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
        </>
      )}

      {/* Animated canvas dots — reduced on mobile/tablet */}
      <MeshDots dotCount={dotCount} />
      <FloatingOrbs count={orbCount} colors={["#F47B20","#6366f1","#0ea5a4","#fbbf24","#8b5cf6","#F47B20"]} />

      {/* ═══ Content wrapper ═══ */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          paddingInline: isXs ? "0.9rem" : isMobile ? "1rem" : "0.75rem",
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
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <motion.span
                animate={!isMobile ? { boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 20px rgba(99,102,241,.4)", "0 0 0px rgba(99,102,241,0)"] } : {}}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: isMobile ? "rgba(244,123,32,.10)" : "rgba(99,102,241,.18)",
                  border: isMobile ? "1px solid rgba(244,123,32,.30)" : "1px solid rgba(99,102,241,.35)",
                  color: isMobile ? "#F47B20" : "#a5b4fc",
                  fontSize: isXs ? 11 : 12, fontWeight: 700, letterSpacing: "0.5px",
                  padding: isXs ? "5px 12px" : "6px 16px", borderRadius: 50,
                  marginBottom: isXs ? 16 : 22,
                  fontFamily: "'Space Grotesk',sans-serif",
                }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "livePulse 2s infinite", flexShrink: 0 }} />
                {isXs ? "JEE 2026 is Live" : "JEE 2026 Season is Live — Start Your Journey"}
              </motion.span>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.05 }}>
              <h1 style={{
                fontFamily: "'Space Grotesk','Sora',sans-serif",
                fontWeight: 800,
                color: textColor,
                fontSize: headingSize,
                lineHeight: 1.04,
                margin: "0 0 1.1rem",
                letterSpacing: isMobile ? "-0.02em" : "-0.04em",
              }}>
                Know Your Rank.{" "}
                <br />
                {isMobile
                  ? <span style={{ color: "#F47B20" }}>Find Your College.</span>
                  : <GradientText from="#F47B20" via="#fbbf24" to="#F97316">Find Your College.</GradientText>
                }
              </h1>

              <p style={{
                color: subColor,
                fontSize: isXs ? ".85rem" : "clamp(.92rem,1.7vw,1.08rem)",
                maxWidth: 540, margin: "0 auto 0.6rem",
                lineHeight: 1.75,
              }}>
                Predict your JEE rank from marks, discover every college you can get into across all JoSAA &amp; CSAB rounds, and track every deadline — all in one place.
              </p>

              <div style={{ height: 32, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.4rem" }}>
                <TypewriterText
                  words={["8 years of JoSAA data", "850+ institutes tracked", "Real-time rank predictions", "JEE Advanced cutoffs", "NIT / IIIT / GFTI seats"]}
                  style={{
                    fontSize: isXs ? ".78rem" : "clamp(.82rem,1.5vw,.96rem)",
                    color: "#F47B20",
                    fontFamily: "'Space Grotesk','Sora',sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.3px",
                  }}
                  cursorColor="#fbbf24"
                />
              </div>
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
                boxShadow: isMobile
                  ? "0 8px 28px rgba(244,123,32,.18), 0 0 0 1px rgba(244,123,32,.14)"
                  : "0 20px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(249,115,22,.25)",
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
                  onClick={() => go(t)}
                  style={{
                    padding: isXs ? "4px 10px" : "5px 13px",   /* ← fixed padding */
                    borderRadius: 50,
                    background: isMobile ? "rgba(244,123,32,.10)" : "rgba(255,255,255,.06)",
                    border: isMobile ? "1px solid rgba(244,123,32,.28)" : "1px solid rgba(255,255,255,.12)",
                    color: isMobile ? "#F47B20" : "rgba(255,255,255,.8)",
                    fontSize: isXs ? 11.5 : 12.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all .2s",
                    fontFamily: "DM Sans",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(249,115,22,.2)"; e.currentTarget.style.borderColor = "rgba(249,115,22,.5)"; e.currentTarget.style.color = isMobile ? "#fff" : "#fff"; }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isMobile ? "rgba(244,123,32,.10)" : "rgba(255,255,255,.06)";
                    e.currentTarget.style.borderColor = isMobile ? "rgba(244,123,32,.28)" : "rgba(255,255,255,.12)";
                    e.currentTarget.style.color = isMobile ? "#F47B20" : "rgba(255,255,255,.8)";
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
                className="btn btn-coral btn-shimmer"
                onClick={() => nav("/jee-main#college")}
                style={{
                  padding: isXs ? "11px 20px" : "12px 24px",
                  fontSize: isXs ? 13.5 : 14.5,
                  fontWeight: 700,
                  borderRadius: 12,
                  gap: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <Crosshair size={isXs ? 16 : 18} /> Predict My College
              </RippleButton>

              <RippleButton
                className="btn btn-light btn-shimmer"
                onClick={() => nav("/jee-main#rank")}
                style={{
                  padding: isXs ? "11px 20px" : "12px 24px",
                  fontSize: isXs ? 13.5 : 14.5,
                  fontWeight: 700,
                  borderRadius: 12,
                  gap: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <TrendingUp size={isXs ? 16 : 18} /> Predict My Rank
              </RippleButton>

              <RippleButton
                className="btn btn-shimmer"
                onClick={() => nav("/jee-resources")}
                style={{
                  padding: isXs ? "11px 20px" : "12px 24px",
                  fontSize: isXs ? 13.5 : 14.5,
                  fontWeight: 700,
                  borderRadius: 12,
                  gap: 8,
                  background: isMobile ? "rgba(244,123,32,.12)" : "rgba(99,102,241,.2)",
                  color: isMobile ? "#F47B20" : "#a5b4fc",
                  border: isMobile ? "1.5px solid rgba(244,123,32,.35)" : "1.5px solid rgba(99,102,241,.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: isMobile ? "100%" : "auto",
                }}
                color="rgba(165,180,252,0.3)"
              >
                <BookOpen size={isXs ? 16 : 18} /> JEE Resources
              </RippleButton>
            </motion.div>

            {/* ── Stats bar ── */}
            <StatsBar isMobile={isMobile} isXs={isXs} />

          </div>
          {/* ══ end CENTER ══ */}

          {/* ══ RIGHT — Live College Panel (hidden on mobile via CSS .hero-about-col) ══ */}
          <LiveCollegePanel isTablet={isTablet} />

        </div>
      </div>

      {/* Bottom fade — only on dark bg */}
      {!isMobile && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(to bottom, transparent, rgba(8,8,24,.8))",
          pointerEvents: "none", zIndex: 2,
        }} />
      )}
    </section>
  );
}