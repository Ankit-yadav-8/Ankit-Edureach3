import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Sparkles, TrendingUp, Crosshair,
  GraduationCap, Users, Star, Award, ArrowRight,
  BookOpen, Target,
} from "lucide-react";
import useCountUp from "../../utils/useCountUp.js";

const QUICK = ["IIT Bombay", "JEE Main 2026", "College Predictor", "NIT Trichy", "VITEEE", "Cutoffs"];

/* ── Animated count-up stat ── */
function Stat({ target, suffix, label }) {
  const [ref, val] = useCountUp(target);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "Sora", fontWeight: 800,
        fontSize: "clamp(1.5rem,3.5vw,2.2rem)", color: "#fff",
      }}>
        {val.toLocaleString("en-IN")}{suffix}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 3 }}>{label}</div>
    </div>
  );
}

/* ── Canvas floating dots — warm palette to match dark+orange theme ── */
function FloatingDots() {
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

    /* warm dots — mostly white/orange tones to suit the dark-orange bg */
    const COLORS = ["#F97316", "#fb923c", "#ffffff", "#fcd34d", "#fdba74"];
    const dots = Array.from({ length: 110 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      pulse: Math.random() * Math.PI * 2,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.speedX;
        d.y += d.speedY;
        d.pulse += 0.018;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        const alpha = d.alpha * (0.6 + 0.4 * Math.sin(d.pulse));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = alpha;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 1,
      }}
    />
  );
}

/* ── Main Hero ── */
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
      background: "#050505",          /* near-black, matching College Parichay banner */
      paddingTop: 120,
      paddingBottom: 64,
      minHeight: "92vh",
      display: "flex",
      alignItems: "center",
    }}>

      {/* ══════ Background layers — replicating Image 2 glow ══════ */}

      {/* PRIMARY: bright orange bloom at top-right corner */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 52% 68% at 102% -2%,
            rgba(230, 80, 15, 0.82) 0%,
            rgba(200, 60, 10, 0.45) 30%,
            rgba(160, 45,  5, 0.18) 55%,
            transparent 75%
          )
        `,
      }} />

      {/* SECONDARY: softer mid-right bloom so glow bleeds down */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 38% 55% at 100% 28%,
            rgba(249, 115, 22, 0.28) 0%,
            transparent 60%
          )
        `,
      }} />

      {/* TERTIARY: very subtle warm haze across far-right edge */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 20% 100% at 100% 50%,
            rgba(249, 115, 22, 0.10) 0%,
            transparent 70%
          )
        `,
      }} />

      {/* Floating dots */}
      <FloatingDots />

      {/* ══════ Content ══════ */}
      <div className="container" style={{ position: "relative", zIndex: 2, width: "100%" }}>

        {/* ── Two-column grid: left = hero text, right = About Us card ── */}
        <div className="hero-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "3rem",
          alignItems: "center",
        }}>

          {/* ════ LEFT — hero text ════ */}
          <div style={{ textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <span className="pill" style={{
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.18)",
              }}>
                <Sparkles size={13} /> India's smartest JEE &amp; college discovery portal
              </span>

              <h1 style={{
                fontFamily: "Sora", fontWeight: 800,
                color: "#fff",
                fontSize: "clamp(2.2rem,5.5vw,3.8rem)",
                lineHeight: 1.07,
                margin: "1.2rem 0 0.7rem",
                letterSpacing: "-0.02em",
              }}>
                Know Your Rank.<br />
                <span style={{
                  background: "linear-gradient(90deg, #F97316 0%, #F4A261 55%, #fb923c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Find Your College.
                </span>
              </h1>

              <p style={{
                color: "rgba(255,255,255,.7)",
                fontSize: "clamp(.95rem,1.8vw,1.12rem)",
                maxWidth: 580, margin: "0 auto 1.8rem",
                lineHeight: 1.7,
              }}>
                Predict your JEE rank from marks, discover every college you can get
                into across all JoSAA &amp; CSAB rounds, and track every counselling
                deadline — all in one place.
              </p>
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{
                maxWidth: 580, margin: "0 auto",
                display: "flex", gap: 10,
                background: "#fff", padding: 7,
                borderRadius: 14,
                boxShadow: "0 20px 60px rgba(0,0,0,.6)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 10, paddingLeft: 12 }}>
                <Search size={19} color="#9ca3af" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && go()}
                  placeholder="Search colleges, exams, predictors…"
                  onFocus={onSearch}
                  style={{
                    border: "none", outline: "none", flex: 1,
                    fontSize: 15, fontFamily: "DM Sans",
                    background: "transparent", color: "#111",
                  }}
                />
              </div>
              <button className="btn btn-coral" onClick={() => go()}>Search</button>
            </motion.div>

            {/* Quick chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 14 }}
            >
              {QUICK.map((t) => (
                <button key={t} onClick={() => go(t)} className="pill"
                  style={{
                    background: "rgba(255,255,255,.07)",
                    color: "rgba(255,255,255,.85)",
                    border: "1px solid rgba(255,255,255,.14)",
                    cursor: "pointer", transition: "all .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(249,115,22,.18)";
                    e.currentTarget.style.borderColor = "rgba(249,115,22,.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.07)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,.14)";
                  }}
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
              style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}
            >
              <button className="btn btn-coral" onClick={() => nav("/jee-main#college")}>
                <Crosshair size={18} /> Predict My College
              </button>
              <button className="btn btn-light" onClick={() => nav("/jee-main#rank")}>
                <TrendingUp size={18} /> Predict My Rank
              </button>
            </motion.div>

            {/* Stats row */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4,1fr)",
              gap: 16, maxWidth: 680,
              margin: "40px auto 0",
              padding: "20px 0",
              borderTop: "1px solid rgba(255,255,255,.1)",
              borderBottom: "1px solid rgba(255,255,255,.1)",
            }}>
              <Stat target={2500} suffix="+" label="Colleges & branches" />
              <Stat target={17}   suffix=""   label="Entrance exams" />
              <Stat target={8}    suffix=""   label="Counselling rounds" />
              <Stat target={50}   suffix="K+" label="Students guided" />
            </div>
          </div>
          {/* ════ end left column ════ */}

          {/* ════ RIGHT — About Us card (hidden on mobile via .hero-about-col) ════ */}
          <motion.div
            className="hero-about-col"
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{ position: "relative" }}
          >
            {/* Outer ambient glow — diffused orange halo */}
            <div style={{
              position: "absolute",
              inset: -24,
              background: "radial-gradient(ellipse at 60% 40%, rgba(249,115,22,0.38) 0%, rgba(234,88,12,0.15) 45%, transparent 72%)",
              filter: "blur(28px)",
              borderRadius: 28,
              zIndex: 0,
              pointerEvents: "none",
            }} />

            {/* Card */}
            <div style={{
              position: "relative", zIndex: 1,
              background: "rgba(12,10,8, 0.72)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(249,115,22, 0.55)",
              borderRadius: 18,
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
              boxShadow: `
                0 0 0 1px rgba(249,115,22,0.12),
                0 0 18px rgba(249,115,22,0.30),
                0 0 48px rgba(249,115,22,0.15),
                0 0 90px rgba(249,115,22,0.07),
                inset 0 1px 0 rgba(255,255,255,0.07)
              `,
            }}>

              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                  background: "linear-gradient(135deg,#F97316 0%,#ea580c 100%)",
                  display: "grid", placeItems: "center",
                  boxShadow: "0 4px 18px rgba(249,115,22,0.55)",
                }}>
                  <GraduationCap size={22} color="#fff" />
                </div>
                <div>
                  <div style={{
                    color: "#F97316", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2,
                  }}>
                    About Us
                  </div>
                  <h3 style={{
                    fontFamily: "Sora", fontWeight: 800,
                    color: "#fff", fontSize: "1.1rem", margin: 0, lineHeight: 1.2,
                  }}>
                    EduReach<span style={{ color: "#F97316" }}>.in</span>
                  </h3>
                </div>
              </div>

              {/* Divider */}
              <div style={{
                height: 1,
                background: "linear-gradient(90deg, rgba(249,115,22,0.7) 0%, rgba(249,115,22,0.15) 60%, transparent 100%)",
              }} />

              {/* Tagline */}
              <p style={{
                color: "rgba(255,255,255,.72)", fontSize: ".88rem",
                lineHeight: 1.72, margin: 0,
              }}>
                India's most trusted platform for JEE aspirants — built by IITians who've
                been through the same journey. Real data, honest guidance, tools that work.
              </p>

              {/* Feature points */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: Target,   title: "Data-driven predictions",  desc: "Real cutoffs from 8+ JoSAA rounds" },
                  { icon: BookOpen, title: "850+ colleges mapped",      desc: "IITs, NITs, IIITs, GFTIs & private" },
                  { icon: Users,    title: "Built by IITians",          desc: "Mentors who cleared JEE themselves" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: "rgba(249,115,22,0.12)",
                      border: "1px solid rgba(249,115,22,0.32)",
                      display: "grid", placeItems: "center",
                    }}>
                      <Icon size={14} color="#F97316" />
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontSize: ".83rem", fontWeight: 700, fontFamily: "Sora", marginBottom: 1 }}>{title}</div>
                      <div style={{ color: "rgba(255,255,255,.42)", fontSize: ".76rem" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{
                height: 1,
                background: "linear-gradient(90deg, rgba(249,115,22,0.7) 0%, rgba(249,115,22,0.15) 60%, transparent 100%)",
              }} />

              {/* Trust badges */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[
                  { icon: Users, val: "2,000+", lbl: "Students" },
                  { icon: Star,  val: "4.8 / 5",  lbl: "Avg rating" },
                  { icon: Award, val: "IITians", lbl: "Built by" },
                ].map(({ icon: Icon, val, lbl }) => (
                  <div key={lbl} style={{
                    textAlign: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(249,115,22,0.20)",
                    borderRadius: 11, padding: "10px 6px",
                  }}>
                    <Icon size={15} color="#F97316" style={{ marginBottom: 4 }} />
                    <div style={{ color: "#fff", fontSize: ".78rem", fontWeight: 700, fontFamily: "Sora" }}>{val}</div>
                    <div style={{ color: "rgba(255,255,255,.38)", fontSize: ".68rem", marginTop: 1 }}>{lbl}</div>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <button
                onClick={() => nav("/about")}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "linear-gradient(135deg, #F97316 0%, #ea580c 100%)",
                  color: "#fff", border: "none", borderRadius: 11,
                  padding: "12px 18px",
                  fontSize: ".88rem", fontWeight: 700, fontFamily: "Sora",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(249,115,22,0.45), 0 0 40px rgba(249,115,22,0.15)",
                  transition: "transform .18s, box-shadow .18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(249,115,22,0.6), 0 0 60px rgba(249,115,22,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.45), 0 0 40px rgba(249,115,22,0.15)";
                }}
              >
                Learn More About Us <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
          {/* ════ end right column ════ */}

        </div>
      </div>
    </section>
  );
}