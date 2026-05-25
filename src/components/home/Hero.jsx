import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sparkles, TrendingUp, Crosshair } from "lucide-react";
import ParticleBackground from "../ParticleBackground.jsx";
import useCountUp from "../../utils/useCountUp.js";

const QUICK = ["IIT Bombay", "JEE Main 2026", "College Predictor", "NIT Trichy", "VITEEE", "Cutoffs"];

function Stat({ target, suffix, label }) {
  const [ref, val] = useCountUp(target);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "#fff" }}>
        {val.toLocaleString("en-IN")}{suffix}
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginTop: 2 }}>{label}</div>
    </div>
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
    <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#1c1c28 0%,#2a2a3c 55%,#3a2416 100%)", paddingTop: 130, paddingBottom: 70 }}>
      <ParticleBackground density={80} />
      <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="pill" style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "1px solid rgba(255,255,255,.25)" }}>
            <Sparkles size={14} /> India's smartest JEE & college discovery portal
          </span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, color: "#fff", fontSize: "clamp(2.1rem,6vw,4rem)", lineHeight: 1.05, margin: "1.2rem 0 0.6rem" }}>
            Know Your Rank.<br />
            <span style={{ background: "linear-gradient(90deg,#F97316,#F4A261)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Find Your College.
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.8)", fontSize: "clamp(1rem,2vw,1.18rem)", maxWidth: 640, margin: "0 auto 1.8rem" }}>
            Predict your JEE rank from marks, discover every college you can get into across all JoSAA & CSAB rounds, and track every counselling deadline — all in one place.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          style={{ maxWidth: 620, margin: "0 auto", display: "flex", gap: 10, background: "#fff", padding: 8, borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,.3)" }}>
          <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 10, paddingLeft: 12 }}>
            <Search size={20} color="var(--muted)" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()}
              placeholder="Search colleges, exams, predictors…"
              onFocus={onSearch}
              style={{ border: "none", outline: "none", flex: 1, fontSize: 16, fontFamily: "DM Sans", background: "transparent" }}
            />
          </div>
          <button className="btn btn-coral" onClick={() => go()}>Search</button>
        </motion.div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 14 }}>
          {QUICK.map((t) => (
            <button key={t} onClick={() => go(t)} className="pill"
              style={{ background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.9)", border: "1px solid rgba(255,255,255,.2)", cursor: "pointer" }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
          <button className="btn btn-coral" onClick={() => nav("/jee-main#college")}><Crosshair size={18} /> Predict My College</button>
          <button className="btn btn-light" onClick={() => nav("/jee-main#rank")}><TrendingUp size={18} /> Predict My Rank</button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 760, margin: "44px auto 0", padding: "22px 0", borderTop: "1px solid rgba(255,255,255,.15)", borderBottom: "1px solid rgba(255,255,255,.15)" }}>
          <Stat target={2500} suffix="+" label="Colleges & branches" />
          <Stat target={17} suffix="" label="Entrance exams" />
          <Stat target={8} suffix="" label="Counselling rounds" />
          <Stat target={50} suffix="K+" label="Students guided" />
        </div>
      </div>
    </section>
  );
}
