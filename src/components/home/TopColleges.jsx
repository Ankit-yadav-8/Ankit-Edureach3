import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Trophy, ArrowRight, BadgeCheck, TrendingUp, Percent, ChevronRight } from "lucide-react";
import { COLLEGES } from "../../data/colleges.js";
import { fmtINR } from "../../utils/format.js";

const TYPES = [
  { id: "IIT",  label: "IITs",  color: "#FF693D", desc: "Indian Institutes of Technology" },
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

/* Real campus photos per college slug — served from /public/assets/team/ */
const COLLEGE_IMG = {
  /* IITs */
  "iit-bombay":       "/assets/team/IITs/IITs/IIT BOMBAY.jpg",
  "iit-delhi":        "/assets/team/IITs/IITs/IIT DELHI.jpg",
  "iit-madras":       "/assets/team/IITs/IITs/IIT MADRAS.jpg",
  "iit-kharagpur":    "/assets/team/IITs/IITs/IIT KHARAGPUR.jpg",
  "iit-kanpur":       "/assets/team/IITs/IITs/IIT KANPUR.jpg",
  "iit-roorkee":      "/assets/team/IITs/IITs/IIT ROORKEE.jpg",
  "iit-hyderabad":    "/assets/team/IITs/IITs/IIT HYDERABAD.jpg",
  "iit-guwahati":     "/assets/team/IITs/IITs/IIT GUWAHATI.jpg",
  "iit-bhu":          "/assets/team/IITs/IITs/IIT BHU_VARANASI.jpg",
  "iit-patna":        "/assets/team/IITs/IITs/IIT PATNA.jpeg",
  "iit-gandhinagar":  "/assets/team/IITs/IITs/IIT GANDHINAGAR.jpg",
  "iit-mandi":        "/assets/team/IITs/IITs/IIT MANDI.avif",
  "iit-indore":       "/assets/team/IITs/IITs/IIT INDORE.webp",
  "iit-jodhpur":      "/assets/team/IITs/IITs/IIT JODHPUR.jpg",
  "iit-tirupati":     "/assets/team/IITs/IITs/IIT TIRUPATI.jpeg",
  "iit-palakkad":     "/assets/team/IITs/IITs/IIT PALAKKAD.jpg",
  "iit-ism-dhanbad":  "/assets/team/IITs/IITs/IIT DHANBAD.jpeg",
  "iit-jammu":        "/assets/team/IITs/IITs/IIT JAMMU.webp",
  "iit-dharwad":      "/assets/team/IITs/IITs/IIT DHARWAD.jpg",
  "iit-bhilai":       "/assets/team/IITs/IITs/IIT BHILAI.jpg",
  "iit-bhubaneswar":  "/assets/team/IITs/IITs/IIT BHUBANESWAR.jpg",
  "iit-goa":          "/assets/team/IITs/IITs/IIT GOA.webp",
  /* NITs */
  "nit-trichy":       "/assets/team/NITs/NIT TRICHY.jpg",
  "nit-surathkal":    "/assets/team/NITs/NIT SURATKAL.jpg",
  "nit-warangal":     "/assets/team/NITs/NIT WARANGAL.jpg",
  "nit-rourkela":     "/assets/team/NITs/NIT ROURKELA.avif",
  "nit-calicut":      "/assets/team/NITs/NIT CALICUT.jpg",
  "nit-silchar":      "/assets/team/NITs/NIT SILCHAR.jpg",
  "mnnit-allahabad":  "/assets/team/NITs/NIT ALLAHABAD.jpeg",
  "nit-nagpur":       "/assets/team/NITs/NIT NAGPUR.avif",
  "mnit-jaipur":      "/assets/team/NITs/NIT JAIPUR.jpeg",
  "manit-bhopal":     "/assets/team/NITs/NIT BHOPAL.jpeg",
  "nit-hamirpur":     "/assets/team/NITs/NIT HAMIRPUR.jpg",
  "nit-kurukshetra":  "/assets/team/NITs/NIT KRUKSHETRA.jpg",
  "nit-durgapur":     "/assets/team/NITs/NIT DURGAPUR.jpg",
  "nit-jamshedpur":   "/assets/team/NITs/NIT JAMSHEDPUR.jpeg",
  "nit-jalandhar":    "/assets/team/NITs/NIT JHALANDAR.jpg",
  "nit-raipur":       "/assets/team/NITs/NIT RAIPUR.jpg",
  "nit-patna":        "/assets/team/NITs/NIT PATNA.jpg",
  "nit-ap":           "/assets/team/NITs/NIT ANDHRAPRADESH.webp",
  "nit-agartala":     "/assets/team/NITs/NIT AGARTALA.jpg",
  "nit-srinagar":     "/assets/team/NITs/NIT SRINAGAR.jpg",
  "nit-goa":          "/assets/team/NITs/NIT GOA.jpeg",
  "nit-delhi":        "/assets/team/NITs/NIT DELHI.webp",
  "nit-ap-puducherry":"/assets/team/NITs/NIT PUDUCHERRY.webp",
  "nit-meghalaya":    "/assets/team/NITs/NIT MEGHALAYA.jpeg",
  "nit-arunachal":    "/assets/team/NITs/NIT ARRUNACHAL PRADESH.jpeg",
  "nit-manipur":      "/assets/team/NITs/NIT MANIPUR.jpeg",
  "nit-mizoram":      "/assets/team/NITs/NIT MIZORAM.jpeg",
  "nit-nagaland":     "/assets/team/NITs/NIT NAGALAND.jpeg",
  "nit-sikkim":       "/assets/team/NITs/NIT SIKKIM.jpg",
  "nit-uttarakhand":  "/assets/team/NITs/NIT UTTARAKHAND.jpg",
  "svnit-surat":      "/assets/team/NITs/NIT SURAT.JPG",
  /* IIITs */
  "iiit-hyderabad":   "/assets/team/IIITs/IIIT HYDERABAD.jpg",
  "iiit-allahabad":   "/assets/team/IIITs/IIIT ALLAHABHAD.jpg",
  "iiitm-gwalior":    "/assets/team/IIITs/IIIT GWALIOR.jpeg",
  "iiitdm-jabalpur":  "/assets/team/IIITs/IIIT JABALPUR.jpeg",
  "iiitdm-kancheepuram": "/assets/team/IIITs/IIIT KANCHEPURAM.jpg",
  "iiit-lucknow":     "/assets/team/IIITs/IIIT LUCKNOW.jpeg",
  "iiit-nagpur":      "/assets/team/IIITs/IIIT NAGPUR.jpeg",
  "iiit-guwahati":    "/assets/team/IIITs/IIIT GUWAHATI.jpg",
  "iiit-ranchi":      "/assets/team/IIITs/IIIT RANCHI.jpeg",
  "iiit-trichy":      "/assets/team/IIITs/IIIT TRICHY.jpg",
  "iiit-bhagalpur":   "/assets/team/IIITs/IIIT BHAGALPUR.avif",
  "iiit-kalyani":     "/assets/team/IIITs/IIIT KALYANI.webp",
  "iiit-pune":        "/assets/team/IIITs/IIIT PUNE.jpg",
  "iiit-kottayam":    "/assets/team/IIITs/IIIT KOTTAYAM.jpeg",
  "iiit-vadodara":    "/assets/team/IIITs/IIIT VADODARA.jpeg",
  "iiit-sricity":     "/assets/team/IIITs/IIIT SRI CITY.jpg",
  "iiit-surat":       "/assets/team/IIITs/IIIT SURAT.webp",
  "iiit-bangalore":   "/assets/team/IIITs/IIIT BANGALORE.jpg",
  "iiit-una":         "/assets/team/IIITs/IIIT UNA.jpg",
  "iiit-sonepat":     "/assets/team/IIITs/IIIT SONEPAT.jpeg",
  "iiit-kota":        "/assets/team/IIITs/IIIT KOTA.jpg",
  "iiit-dharwad":     "/assets/team/IIITs/IIIT DHARWAD.jpg",
  "iiit-kurnool":     "/assets/team/IIITs/IIIT KURNOOL.jpeg",
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
        background: "var(--page-bg)",
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
          background: "linear-gradient(135deg,#FF693D,#f4a261)",
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
            { icon: TrendingUp, label: "Avg Pkg",  value: fmtINR(c.placements.avg),     color: "#FF693D" },
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
                e.currentTarget.style.borderColor = "#FF693D";
                e.currentTarget.style.color = "#FF693D";
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
    <section className="section" id="colleges" style={{ background: "linear-gradient(160deg, #ffffff 0%, #ffffff 40%, #ffffff 100%)", position: "relative", overflow: "hidden" }}>
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
          <h2 className="section-title" style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", color: "#1a1a2e" }}>
            Explore India's Premier <span className="accent">Engineering Institutes</span>
          </h2>
          <p className="section-sub" style={{ color: "#4b5563" }}>
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
              gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
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
