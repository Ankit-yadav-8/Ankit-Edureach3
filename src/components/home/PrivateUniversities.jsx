import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowRight, MapPin, TrendingUp, IndianRupee, Users, Star, ChevronRight } from "lucide-react";
import { PRIVATE_UNIS } from "../../data/counselling.js";
import { fmtINR } from "../../utils/format.js";

const CATEGORIES = [
  { id: "all",    label: "All Colleges",  color: "#FF693D" },
  { id: "premier",label: "Premier",       color: "#1a3a5c" },
  { id: "south",  label: "South India",   color: "#0b525b" },
  { id: "north",  label: "North India",   color: "#3b3b98" },
  { id: "west",   label: "West & East",   color: "#2d6a4f" },
];

const TIER_META = {
  premier: { label: "Premier",     bg: "rgba(26,58,92,.12)",  color: "#1a3a5c" },
  good:    { label: "Top Ranked",  bg: "rgba(14,165,164,.12)", color: "#0ea5a4" },
  budget:  { label: "Budget Pick", bg: "rgba(21,160,110,.12)", color: "#15a06e" },
};

function StatusBadge({ status, tone }) {
  const colors = {
    teal:   { bg: "rgba(14,165,164,.12)", color: "#0ea5a4", dot: "#0ea5a4" },
    orange: { bg: "rgba(255, 105, 61,.12)", color: "#FF693D",  dot: "#FF693D" },
    red:    { bg: "rgba(239,68,68,.12)",  color: "#ef4444",  dot: "#ef4444" },
  };
  const c = colors[tone] || colors.teal;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 50,
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.5px",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function UniCard({ u, index }) {
  const nav = useNavigate();
  const tier = TIER_META[u.tier] || TIER_META.good;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
      style={{
        background: "var(--page-bg)",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 16px rgba(28,28,40,.06), 0 1px 4px rgba(28,28,40,.04)",
        cursor: "pointer",
        transition: "box-shadow .25s ease",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(28,28,40,.12), 0 0 0 2px ${u.accent}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(28,28,40,.06), 0 1px 4px rgba(28,28,40,.04)";
      }}
    >
      {/* Colored top banner */}
      <div style={{
        height: 6,
        background: `linear-gradient(90deg, ${u.accent}, ${u.accent}99)`,
      }} />

      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          {/* Logo / Abbreviation badge */}
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: `linear-gradient(135deg, ${u.accent}22, ${u.accent}44)`,
            border: `1.5px solid ${u.accent}44`,
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 11, color: u.accent, letterSpacing: "0.5px" }}>
              {u.short}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <StatusBadge status={u.status} tone={u.tone} />
            <span style={{
              padding: "2px 9px", borderRadius: 50,
              background: tier.bg, color: tier.color,
              fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
            }}>
              {tier.label}
            </span>
          </div>
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: "Sora", fontWeight: 700,
          fontSize: "1.02rem", color: "#1c1c28",
          lineHeight: 1.3, marginBottom: 6,
        }}>
          {u.name}
        </h3>

        {/* Location + Exam */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280", marginBottom: 14 }}>
          <MapPin size={12} style={{ flexShrink: 0, color: "#9ca3af" }} />
          <span>{u.state}</span>
          <span style={{ color: "#d1d5db" }}>·</span>
          <span style={{
            background: "rgba(255, 105, 61,.10)", color: "#FF693D",
            padding: "1px 7px", borderRadius: 50, fontSize: 11, fontWeight: 600,
          }}>
            {u.exam}
          </span>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 0,
          background: "#fdf8f4",
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,.06)",
          overflow: "hidden",
          marginBottom: 14,
        }}>
          {[
            { icon: IndianRupee, label: "Fees/yr", value: u.fees, color: "#6b7280" },
            { icon: TrendingUp,  label: "Avg Pkg",  value: fmtINR(u.placements.avg), color: "#15a06e" },
            { icon: Users,       label: "Placed",   value: `${u.placements.placedPct}%`, color: "#3b3b98" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <div key={label} style={{
              padding: "10px 8px", textAlign: "center",
              borderRight: i < 2 ? "1px solid rgba(0,0,0,.06)" : "none",
            }}>
              <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                <Icon size={10} />{label}
              </div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Deadline */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11.5, color: "#6b7280", marginBottom: 14,
        }}>
          <Star size={11} color={u.tone === "orange" ? "#FF693D" : "#9ca3af"} />
          <span>Apply by <strong style={{ color: u.tone === "orange" ? "#FF693D" : "#374151" }}>{u.deadline}</strong></span>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingBottom: 18 }}>
          <a
            href={u.apply}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              background: `linear-gradient(135deg, ${u.accent}, ${u.accent}cc)`,
              color: "#fff",
              padding: "9px 12px", borderRadius: 10,
              fontSize: 12.5, fontWeight: 700, fontFamily: "DM Sans",
              textDecoration: "none", transition: "all .2s",
              boxShadow: `0 4px 14px ${u.accent}44`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
          >
            Apply <ExternalLink size={12} />
          </a>
          <button
            onClick={() => nav(`/private/${u.slug}`)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              background: "transparent",
              color: u.accent, border: `1.5px solid ${u.accent}55`,
              padding: "9px 12px", borderRadius: 10,
              fontSize: 12.5, fontWeight: 700, fontFamily: "DM Sans",
              cursor: "pointer", transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${u.accent}11`;
              e.currentTarget.style.borderColor = u.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = `${u.accent}55`;
            }}
          >
            Details <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function PrivateUniversities() {
  const [active, setActive] = useState("all");
  const nav = useNavigate();

  const filtered = PRIVATE_UNIS.filter((u) => {
    if (active === "all") return true;
    if (active === "premier") return u.tier === "premier";
    if (active === "west") return u.region === "west" || u.region === "east";
    return u.region === active;
  });

  return (
    <section className="section" id="private" style={{ background: "linear-gradient(160deg, #ffffff 0%, #ffffff 40%, #ffffff 100%)", position: "relative", overflow: "hidden" }}>
      <div className="container">

        {/* Section header */}
        <motion.div
          className="title-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow">Private Universities</span>
          <h2 className="section-title" style={{ color: "#1a1a2e" }}>
            Top Private Colleges <span className="accent">in India</span>
          </h2>
          <p className="section-sub" style={{ color: "#4b5563" }}>
            Explore 13+ leading private universities — compare fees, placements &amp; apply directly.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: "flex", gap: 8, flexWrap: "wrap",
            justifyContent: "center", marginBottom: 36,
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              style={{
                padding: "9px 20px",
                borderRadius: 50,
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: "Sora",
                cursor: "pointer",
                transition: "all .22s ease",
                border: active === cat.id
                  ? `2px solid ${cat.color}`
                  : "2px solid rgba(0,0,0,.10)",
                background: active === cat.id
                  ? cat.color
                  : "#fff",
                color: active === cat.id ? "#fff" : "#4b5563",
                boxShadow: active === cat.id
                  ? `0 4px 18px ${cat.color}44`
                  : "none",
                transform: active === cat.id ? "translateY(-1px)" : "none",
              }}
            >
              {cat.label}
              {active === cat.id && (
                <span style={{ marginLeft: 6, background: "rgba(255,255,255,.25)", borderRadius: 50, padding: "1px 7px", fontSize: 11 }}>
                  {filtered.length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((u, i) => (
              <UniCard key={u.slug} u={u} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: "center", marginTop: 40 }}
        >
          <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 14 }}>
            Can't find what you're looking for?
          </p>
          <button
            className="btn btn-ghost"
            style={{ gap: 8 }}
            onClick={() => nav("/colleges")}
          >
            Explore All Colleges <ChevronRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
