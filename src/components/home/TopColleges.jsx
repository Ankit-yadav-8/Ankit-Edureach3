import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Trophy, ArrowRight, BadgeCheck, TrendingUp, Percent, ChevronRight } from "lucide-react";
import { COLLEGES } from "../../data/colleges.js";
import { fmtINR } from "../../utils/format.js";

const TYPES = [
  { id: "IIT",  label: "IITs",  color: "#F47B20", desc: "Indian Institutes of Technology" },
  { id: "NIT",  label: "NITs",  color: "#3b3b98", desc: "National Institutes of Technology" },
  { id: "IIIT", label: "IIITs", color: "#0b525b", desc: "Indian Institutes of Information Technology" },
];

const QUICK_TABS = [
  ["Rankings", "overview"],
  ["Admission", "cutoff"],
  ["Courses", "courses"],
  ["Fees", "fees"],
  ["Placements", "placements"],
];

/* Gradient banners per college type */
const TYPE_BG = {
  IIT:  "linear-gradient(135deg,#2d1b5e 0%,#5c2d91 60%,#1e0e47 100%)",
  NIT:  "linear-gradient(135deg,#0d3340 0%,#1a6b7a 60%,#0a2830 100%)",
  IIIT: "linear-gradient(135deg,#0f2e1e 0%,#1c5c38 60%,#0a2118 100%)",
};

const TYPE_ACCENT = { IIT: "#a855f7", NIT: "#22d3ee", IIIT: "#34d399" };

function CollegeCard({ c, typeAccent, typeBg, index }) {
  const nav = useNavigate();
  const goTab = (slug, tab) => nav(`/colleges/${slug}?tab=${tab}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,.08)",
        boxShadow: "0 2px 16px rgba(28,28,40,.06)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "box-shadow .25s, transform .25s",
        cursor: "pointer",
      }}
      whileHover={{
        y: -6,
        boxShadow: "0 16px 48px rgba(28,28,40,.14)",
        transition: { duration: 0.22 },
      }}
      onClick={() => nav(`/colleges/${c.slug}`)}
    >
      {/* Banner */}
      <div style={{
        position: "relative",
        height: 110,
        background: typeBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* subtle grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,.03) 20px)`,
        }} />

        {/* Glow blob */}
        <div style={{
          position: "absolute", width: 100, height: 100, borderRadius: "50%",
          background: `radial-gradient(circle, ${typeAccent}44, transparent 70%)`,
          top: -20, right: -10,
        }} />

        {/* Institute initial */}
        <span style={{
          fontFamily: "Sora", fontWeight: 800, fontSize: "2rem",
          color: "rgba(255,255,255,.18)",
          position: "relative", zIndex: 1, letterSpacing: "-2px",
          userSelect: "none",
        }}>
          {c.short || c.name.split(" ").map((w) => w[0]).join("").slice(0, 4)}
        </span>

        {/* NIRF badge */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "linear-gradient(135deg,#F97316,#f4a261)",
          color: "#fff",
          fontSize: 10.5, fontWeight: 700,
          padding: "3px 9px", borderRadius: 50,
          display: "flex", alignItems: "center", gap: 4,
          boxShadow: "0 3px 10px rgba(249,115,22,.4)",
        }}>
          <Trophy size={9} /> NIRF #{c.nirf}
        </div>

        {/* Location */}
        <div style={{
          position: "absolute", bottom: 8, left: 10,
          background: "rgba(0,0,0,.35)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,.15)",
          color: "#fff",
          fontSize: 11, fontWeight: 500,
          padding: "3px 9px", borderRadius: 50,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <MapPin size={10} /> {c.location}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>
        <h3 style={{
          fontFamily: "Sora", fontWeight: 700,
          fontSize: "1.05rem", color: "#1c1c28",
          lineHeight: 1.3,
        }}>
          {c.name}
        </h3>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          background: "#fdf8f4",
          borderRadius: 10, overflow: "hidden",
          border: "1px solid rgba(0,0,0,.06)",
        }}>
          {[
            { icon: TrendingUp, label: "Avg Pkg",  value: fmtINR(c.placements.avg),     color: "#F47B20" },
            { icon: Trophy,     label: "Highest",  value: fmtINR(c.placements.highest),  color: "#15a06e" },
            { icon: Percent,    label: "Placed",   value: `${c.placements.placedPct}%`,  color: "#3b3b98" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <div key={label} style={{
              padding: "9px 6px",
              textAlign: "center",
              borderRight: i < 2 ? "1px solid rgba(0,0,0,.06)" : "none",
            }}>
              <div style={{ fontSize: 9.5, color: "#9ca3af", marginBottom: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <Icon size={9} />{label}
              </div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Quick-link pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {QUICK_TABS.map(([label, tab]) => (
            <button
              key={label}
              onClick={(e) => { e.stopPropagation(); goTab(c.slug, tab); }}
              style={{
                padding: "5px 11px",
                borderRadius: 8,
                fontSize: 11.5,
                fontWeight: 500,
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                color: "#374151",
                cursor: "pointer",
                transition: "all .18s",
                fontFamily: "DM Sans",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff3e6";
                e.currentTarget.style.borderColor = "#F47B20";
                e.currentTarget.style.color = "#F47B20";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#374151";
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingBottom: 16 }}>
          <button
            className="btn btn-ghost"
            style={{ flex: 1, justifyContent: "center", fontSize: 12.5, padding: "8px 10px" }}
            onClick={(e) => { e.stopPropagation(); nav("/jee-main#college"); }}
          >
            <BadgeCheck size={14} /> Eligibility
          </button>
          <button
            className="btn btn-coral"
            style={{ flex: 1, justifyContent: "center", fontSize: 12.5, padding: "8px 10px" }}
            onClick={(e) => { e.stopPropagation(); nav(`/colleges/${c.slug}`); }}
          >
            Details <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TopColleges() {
  const [type, setType] = useState("IIT");
  const nav = useNavigate();
  const list = COLLEGES.filter((c) => c.type === type).slice(0, 6);
  const typeInfo = TYPES.find((t) => t.id === type);

  return (
    <section className="section" id="colleges" style={{ background: "var(--sky)" }}>
      <div className="container">

        {/* Section header */}
        <motion.div
          className="title-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow">Top Colleges</span>
          <h2 className="section-title">
            Explore India's Premier <span className="accent">Engineering Institutes</span>
          </h2>
          <p className="section-sub">
            Tap any tag to jump straight to that section — rankings, cutoffs, fees or placements.
          </p>
        </motion.div>

        {/* Type tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}
        >
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              style={{
                padding: "10px 24px",
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "Sora",
                cursor: "pointer",
                transition: "all .22s ease",
                border: type === t.id ? `2px solid ${t.color}` : "2px solid rgba(0,0,0,.10)",
                background: type === t.id ? t.color : "#fff",
                color: type === t.id ? "#fff" : "#4b5563",
                boxShadow: type === t.id ? `0 4px 18px ${t.color}44` : "none",
                transform: type === t.id ? "translateY(-1px)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </motion.div>

        {/* Type descriptor */}
        <AnimatePresence mode="wait">
          <motion.p
            key={type}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#9ca3af",
              marginBottom: 24,
              fontStyle: "italic",
            }}
          >
            {typeInfo?.desc} · Showing top 6 by NIRF rank
          </motion.p>
        </AnimatePresence>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={type}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {list.map((c, i) => (
              <CollegeCard
                key={c.slug}
                c={c}
                index={i}
                typeAccent={TYPE_ACCENT[type]}
                typeBg={TYPE_BG[type]}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          style={{ textAlign: "center", marginTop: 36 }}
        >
          <button
            className="btn btn-navy"
            style={{ gap: 8, padding: "12px 28px", fontSize: 14 }}
            onClick={() => nav(`/colleges?type=${type}`)}
          >
            View all {typeInfo?.label} <ChevronRight size={17} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
