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

/* Gradient banners per college type (fallback) */
const TYPE_BG = {
  IIT:  "linear-gradient(135deg,#2d1b5e 0%,#5c2d91 60%,#1e0e47 100%)",
  NIT:  "linear-gradient(135deg,#0d3340 0%,#1a6b7a 60%,#0a2830 100%)",
  IIIT: "linear-gradient(135deg,#0f2e1e 0%,#1c5c38 60%,#0a2118 100%)",
};

/* Unsplash campus photos per college slug */
const COLLEGE_IMG = {
  /* IITs */
  "iit-bombay":    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=70",
  "iit-delhi":     "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=70",
  "iit-madras":    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=70",
  "iit-kharagpur": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=70",
  "iit-kanpur":    "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=800&q=70",
  "iit-roorkee":   "https://images.unsplash.com/photo-1461088945293-0c17689e48ac?auto=format&fit=crop&w=800&q=70",
  "iit-hyderabad": "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=800&q=70",
  "iit-guwahati":  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=70",
  "iit-bhu":       "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=70",
  "iit-patna":     "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=70",
  "iit-gandhinagar":"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=70",
  "iit-mandi":     "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=70",
  "iit-indore":    "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?auto=format&fit=crop&w=800&q=70",
  "iit-jodhpur":   "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?auto=format&fit=crop&w=800&q=70",
  "iit-tirupati":  "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?auto=format&fit=crop&w=800&q=70",
  "iit-palakkad":  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=70",
  "iit-dhanbad":   "https://images.unsplash.com/photo-1513116476489-7635e79103b8?auto=format&fit=crop&w=800&q=70",
  "iit-jammu":     "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=70",
  "iit-dharwad":   "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=70",
  "iit-bhilai":    "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=70",
  /* NITs */
  "nit-trichy":    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=70",
  "nit-surathkal": "https://images.unsplash.com/photo-1513116476489-7635e79103b8?auto=format&fit=crop&w=800&q=70",
  "nit-warangal":  "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?auto=format&fit=crop&w=800&q=70",
  "nit-rourkela":  "https://images.unsplash.com/photo-1461088945293-0c17689e48ac?auto=format&fit=crop&w=800&q=70",
  "nit-calicut":   "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=70",
  "nit-silchar":   "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=70",
  "nit-allahabad": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=70",
  "nit-nagpur":    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=70",
  "nit-jaipur":    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=70",
  "nit-bhopal":    "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=800&q=70",
  "nit-hamirpur":  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=70",
  "nit-kurukshetra":"https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=70",
  /* IIITs */
  "iiit-hyderabad":"https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=800&q=70",
  "iiit-allahabad":"https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=70",
  "iiit-bangalore":"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=70",
  "iiit-delhi":    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=70",
  "iiit-gwalior":  "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?auto=format&fit=crop&w=800&q=70",
  "iiit-kancheepuram": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=70",
};

const TYPE_ACCENT = { IIT: "#a855f7", NIT: "#22d3ee", IIIT: "#34d399" };

function CollegeCard({ c, typeAccent, typeBg, index }) {
  const nav = useNavigate();
  const goTab = (slug, tab) => nav(`/colleges/${slug}?tab=${tab}`);
  const imgUrl = COLLEGE_IMG[c.slug];

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
        height: 130,
        background: typeBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Campus photo */}
        {imgUrl && (
          <img
            src={imgUrl}
            alt={`${c.name} campus`}
            className="college-banner-img"
            loading="lazy"
          />
        )}
        {/* Overlay */}
        <div className="college-banner-overlay" />

        {/* Institute initial */}
        <span style={{
          fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1.9rem",
          color: "rgba(255,255,255,.28)",
          position: "relative", zIndex: 1, letterSpacing: "-2px",
          userSelect: "none", textShadow: "0 2px 8px rgba(0,0,0,.5)",
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
          fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700,
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
    <section className="section" id="colleges" style={{ background: "linear-gradient(160deg, #1a0800 0%, #2d1200 40%, #1a0800 100%)", position: "relative", overflow: "hidden" }}>
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
          <h2 className="section-title" style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", color: "#fff" }}>
            Explore India's Premier <span className="accent">Engineering Institutes</span>
          </h2>
          <p className="section-sub" style={{ color: "rgba(255,255,255,.65)" }}>
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
            <motion.button
              key={t.id}
              onClick={() => setType(t.id)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.04 }}
              animate={{
                background: type === t.id ? t.color : "#fff",
                color: type === t.id ? "#fff" : "#4b5563",
                borderColor: type === t.id ? t.color : "rgba(0,0,0,.10)",
                boxShadow: type === t.id ? `0 6px 22px ${t.color}55` : "0 2px 8px rgba(0,0,0,.06)",
                y: type === t.id ? -2 : 0,
              }}
              transition={{ duration: 0.2 }}
              style={{
                padding: "10px 26px", borderRadius: 50,
                fontSize: 14, fontWeight: 700,
                fontFamily: "'Space Grotesk','Sora',sans-serif",
                cursor: "pointer", border: "2px solid transparent",
              }}
            >
              {t.label}
            </motion.button>
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
