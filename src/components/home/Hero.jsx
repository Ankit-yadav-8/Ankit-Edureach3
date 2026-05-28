import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Sparkles, TrendingUp, Crosshair,
  GraduationCap, Users, Star, Award, ArrowRight,
  BookOpen, Target, MapPin, Trophy, Zap, ChevronRight,
} from "lucide-react";
import useCountUp from "../../utils/useCountUp.js";

const ABOUT_ACCENT = "#F47B20";

const QUICK = ["IIT Bombay", "JEE Main 2026", "College Predictor", "NIT Trichy", "VITEEE", "JEE Advanced"];

const TOP_COLLEGES = [
  { name: "IIT Bombay",   type: "IIT",  nirf: 3,  avg: "₹21.8L", placed: 96, color: "#6366f1" },
  { name: "IIT Delhi",    type: "IIT",  nirf: 2,  avg: "₹20.4L", placed: 95, color: "#F97316" },
  { name: "IIT Madras",   type: "IIT",  nirf: 1,  avg: "₹24.4L", placed: 94, color: "#0ea5a4" },
  { name: "NIT Trichy",   type: "NIT",  nirf: 10, avg: "₹11.2L", placed: 92, color: "#8b5cf6" },
  { name: "IIIT Hyd",     type: "IIIT", nirf: 24, avg: "₹18.6L", placed: 97, color: "#10b981" },
];

function Stat({ target, suffix, label }) {
  const [ref, val] = useCountUp(target);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.4rem,3vw,2rem)", color: "#fff", lineHeight: 1 }}>
        {val.toLocaleString("en-IN")}{suffix}
      </div>
      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.5)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

/* ── Animated mesh dots canvas ── */
function MeshDots() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const COLORS = ["#6366f1", "#F97316", "#0ea5a4", "#8b5cf6", "#f4a261", "#ffffff"];
    const dots = Array.from({ length: 80 }, () => ({
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
        d.x += d.sx; d.y += d.sy; d.pulse += 0.015;
        if (d.x < 0) d.x = canvas.width; if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height; if (d.y > canvas.height) d.y = 0;
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
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
}

/* ── About Us Card (left panel) ── */
function AboutUsCard() {
  const nav = useNavigate();
  const STORY = [
    { icon: "🎯", title: "The Problem", text: "JoSAA counselling felt overwhelming — scattered data, no clarity on which college to choose." },
    { icon: "💡", title: "IIT Roorkee Dream", text: "Ankit cracked JEE Advanced (AIR 4846) and lived through the chaos of counselling firsthand." },
    { icon: "📊", title: "How We Built It", text: "8 years of real JoSAA data · 850+ institutes · Real-time rank predictions. Built for every aspirant." },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: -36 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="hero-about-col"
      style={{
        background: "rgba(10,10,26,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 20,
        padding: "1.6rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxShadow: "0 0 0 1px rgba(255,255,255,.06), 0 24px 64px rgba(0,0,0,.6)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top glow bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ABOUT_ACCENT}, transparent)` }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: `${ABOUT_ACCENT}22`, border: `1.5px solid ${ABOUT_ACCENT}44`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Sparkles size={18} color={ABOUT_ACCENT} />
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>Our Story</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, color: "#fff", fontSize: "1rem" }}>Built by an IITian</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

      {/* Founder card */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 54, height: 54, borderRadius: 12, overflow: "hidden", flexShrink: 0,
          border: `2px solid ${ABOUT_ACCENT}88`,
          boxShadow: `0 0 16px ${ABOUT_ACCENT}55`,
        }}>
          <img src="/assets/team/ankit.jpeg" alt="Ankit Yadav" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        </div>
        <div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, color: "#fff" }}>Ankit Yadav</div>
          <div style={{ fontSize: 11, color: ABOUT_ACCENT, fontWeight: 700, marginTop: 2 }}>IIT Roorkee · AIR 4846 JEE Adv.</div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.5)", marginTop: 1 }}>B.Tech EE · Founder</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

      {/* Story bullets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {STORY.map(({ icon, title, text }) => (
          <div key={title} style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 10, padding: "9px 11px",
            display: "flex", gap: 9, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 11.5, color: "#fff" }}>{title}</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.55)", lineHeight: 1.45, marginTop: 2 }}>{text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => nav("/team/team-head")}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          background: `linear-gradient(135deg, ${ABOUT_ACCENT}, #ea580c)`,
          color: "#fff", border: "none", borderRadius: 11,
          padding: "10px 14px", fontSize: 12.5, fontWeight: 700,
          fontFamily: "Sora", cursor: "pointer", marginTop: "auto",
          boxShadow: `0 4px 20px ${ABOUT_ACCENT}55`,
          transition: "all .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${ABOUT_ACCENT}88`; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 20px ${ABOUT_ACCENT}55`; }}
      >
        Read Our Story <ArrowRight size={13} />
      </button>
    </motion.div>
  );
}

/* ── Live College Card (right panel) ── */
function LiveCollegePanel() {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % TOP_COLLEGES.length), 2800);
    return () => clearInterval(t);
  }, []);
  const c = TOP_COLLEGES[activeIdx];
  return (
    <motion.div
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="hero-about-col"
      style={{
        background: "rgba(10,10,26,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 20,
        padding: "1.6rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.1rem",
        boxShadow: "0 0 0 1px rgba(255,255,255,.06), 0 24px 64px rgba(0,0,0,.6)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top glow accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${c.color}, transparent)`, transition: "background .6s" }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: `${c.color}22`, border: `1.5px solid ${c.color}44`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <GraduationCap size={19} color={c.color} />
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>Live College Data</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, color: "#fff", fontSize: "1rem" }}>Top Institutes 2026</div>
        </div>
        <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "livePulse 2s infinite" }} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

      {/* College cards list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {TOP_COLLEGES.map((col, i) => (
          <motion.div
            key={col.name}
            animate={{ opacity: i === activeIdx ? 1 : 0.45, scale: i === activeIdx ? 1 : 0.97 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: i === activeIdx ? `${col.color}18` : "rgba(255,255,255,.03)",
              border: `1px solid ${i === activeIdx ? col.color + "44" : "rgba(255,255,255,.06)"}`,
              borderRadius: 10, padding: "9px 12px",
              transition: "border .4s, background .4s",
            }}
          >
            <span style={{ width: 28, height: 28, borderRadius: 8, background: `${col.color}22`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 9, color: col.color }}>{col.type}</span>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.name}</div>
              <div style={{ fontSize: 10.5, color: "#9ca3af" }}>NIRF #{col.nirf} · {col.placed}% placed</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: col.color }}>{col.avg}</div>
              <div style={{ fontSize: 10, color: "#6b7280" }}>avg pkg</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

      {/* Footer stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { val: "23", lbl: "IITs" },
          { val: "31", lbl: "NITs" },
          { val: "26+", lbl: "IIITs" },
        ].map(({ val, lbl }) => (
          <div key={lbl} style={{ textAlign: "center", background: "rgba(255,255,255,.04)", borderRadius: 9, padding: "8px 4px" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, color: "#fff" }}>{val}</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => window.location.href = "/colleges"}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          background: "linear-gradient(135deg, #F97316, #ea580c)",
          color: "#fff", border: "none", borderRadius: 11,
          padding: "11px 16px", fontSize: 13, fontWeight: 700,
          fontFamily: "Sora", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(249,115,22,.4)",
          transition: "all .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(249,115,22,.55)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,.4)"; }}
      >
        Explore All Colleges <ArrowRight size={14} />
      </button>
    </motion.div>
  );
}

export default function Hero({ onSearch }) {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const go = (term) => {
    const t = (term ?? q).trim();
    if (t) nav(`/search?q=${encodeURIComponent(t)}`);
  };

  return (
    <section style={{
      position: "relative",
      overflow: "hidden",
      background: "#080818",
      paddingTop: 110,
      paddingBottom: 70,
      minHeight: "95vh",
      display: "flex",
      alignItems: "center",
    }}>

      {/* ═══ Multi-color gradient backdrop ═══ */}

      {/* Deep indigo sweep — top left */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 65% 55% at -5% 5%, rgba(79,70,229,.45) 0%, rgba(67,56,202,.18) 35%, transparent 65%)" }} />

      {/* Orange/coral bloom — center right */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 55% 70% at 105% 20%, rgba(234,88,12,.70) 0%, rgba(249,115,22,.32) 35%, transparent 62%)" }} />

      {/* Teal accent — bottom left */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 45% 40% at -5% 98%, rgba(14,165,164,.28) 0%, transparent 60%)" }} />

      {/* Subtle purple mid */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 35% 50% at 50% 100%, rgba(139,92,246,.14) 0%, transparent 55%)" }} />

      {/* Mesh grid overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Animated dots */}
      <MeshDots />

      {/* ═══ Content ═══ */}
      <div className="container" style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "300px 1fr 300px", gap: "2rem", alignItems: "center" }}>

          {/* ══ ABOUT US CARD (left) ══ */}
          <AboutUsCard />

          {/* ══ CENTER ══ */}
          <div style={{ textAlign: "center" }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(99,102,241,.18)",
                border: "1px solid rgba(99,102,241,.35)",
                color: "#a5b4fc",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.5px",
                padding: "6px 16px", borderRadius: 50, marginBottom: 22,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "livePulse 2s infinite" }} />
                JEE 2026 Season is Live — Start Your Journey
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.05 }}>
              <h1 style={{
                fontFamily: "Sora", fontWeight: 800,
                color: "#fff",
                fontSize: "clamp(2.2rem,5.5vw,3.9rem)",
                lineHeight: 1.06,
                margin: "0 0 1rem",
                letterSpacing: "-0.03em",
              }}>
                Know Your Rank.{" "}
                <br />
                <span style={{
                  background: "linear-gradient(90deg, #F97316 0%, #fb923c 40%, #fbbf24 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Find Your College.
                </span>
              </h1>

              <p style={{
                color: "rgba(255,255,255,.65)",
                fontSize: "clamp(.92rem,1.7vw,1.08rem)",
                maxWidth: 540, margin: "0 auto 2rem",
                lineHeight: 1.75,
              }}>
                Predict your JEE rank from marks, discover every college you can get
                into across all JoSAA &amp; CSAB rounds, and track every deadline —
                all in one place.
              </p>
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              style={{ maxWidth: 560, margin: "0 auto 1rem" }}
            >
              <div style={{
                display: "flex", gap: 8,
                background: "rgba(255,255,255,.97)",
                padding: 6, borderRadius: 14,
                boxShadow: "0 20px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(249,115,22,.25)",
              }}>
                <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 10, paddingLeft: 14 }}>
                  <Search size={18} color="#9ca3af" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && go()}
                    placeholder="Search colleges, exams, cutoffs…"
                    onFocus={onSearch}
                    style={{ border: "none", outline: "none", flex: 1, fontSize: 14.5, fontFamily: "DM Sans", background: "transparent", color: "#111" }}
                  />
                </div>
                <button
                  className="btn btn-coral"
                  onClick={() => go()}
                  style={{ borderRadius: 10, padding: "9px 20px", fontSize: 14, fontWeight: 700 }}
                >
                  Search
                </button>
              </div>
            </motion.div>

            {/* Quick chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ display: "flex", gap: 7, flexWrap: "wrap", justifyContent: "center", marginBottom: "1.8rem" }}
            >
              {QUICK.map((t) => (
                <button
                  key={t}
                  onClick={() => go(t)}
                  style={{
                    padding: "5px 13px", borderRadius: 50,
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.12)",
                    color: "rgba(255,255,255,.8)",
                    fontSize: 12.5, fontWeight: 500,
                    cursor: "pointer", transition: "all .2s",
                    fontFamily: "DM Sans",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(249,115,22,.2)"; e.currentTarget.style.borderColor = "rgba(249,115,22,.5)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.12)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; }}
                >
                  {t}
                </button>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}
            >
              <button
                className="btn btn-coral"
                onClick={() => nav("/jee-main#college")}
                style={{ padding: "12px 24px", fontSize: 14.5, fontWeight: 700, borderRadius: 12, gap: 8 }}
              >
                <Crosshair size={18} /> Predict My College
              </button>
              <button
                className="btn btn-light"
                onClick={() => nav("/jee-main#rank")}
                style={{ padding: "12px 24px", fontSize: 14.5, fontWeight: 700, borderRadius: 12, gap: 8 }}
              >
                <TrendingUp size={18} /> Predict My Rank
              </button>
              <button
                className="btn"
                onClick={() => nav("/jee-resources")}
                style={{
                  padding: "12px 24px", fontSize: 14.5, fontWeight: 700, borderRadius: 12, gap: 8,
                  background: "rgba(99,102,241,.2)", color: "#a5b4fc",
                  border: "1.5px solid rgba(99,102,241,.35)",
                }}
              >
                <BookOpen size={18} /> JEE Resources
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                gap: 12, maxWidth: 580, margin: "0 auto",
                padding: "20px 0",
                borderTop: "1px solid rgba(255,255,255,.08)",
                borderBottom: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <Stat target={2500} suffix="+" label="Colleges & branches" />
              <Stat target={17}   suffix=""   label="Entrance exams" />
              <Stat target={8}    suffix=""   label="Counselling rounds" />
              <Stat target={50}   suffix="K+" label="Students guided" />
            </motion.div>
          </div>
          {/* ══ end CENTER ══ */}

          {/* ══ RIGHT — Live College Panel ══ */}
          <LiveCollegePanel />
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom, transparent, rgba(8,8,24,.8))", pointerEvents: "none", zIndex: 2 }} />
    </section>
  );
}
