/* ExploreColleges — "Explore Colleges" section that sits just below the
   Counselling + Mentorship plans. Six flagship IITs shown as tool-style white
   cards (photo banner, NIRF badge, quick stats, CTA) on the same surface and
   card language as ToolsGrid. Tapping a card opens that college's page. */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Trophy, Briefcase, ArrowRight, Building2, GraduationCap } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const IITS = [
  {
    slug: "iit-madras", name: "IIT Madras", short: "IITM", nirf: 1,
    location: "Chennai, Tamil Nadu", img: "/assets/team/IITs/IITs/IIT MADRAS.jpg",
    bullets: ["NIRF #1 engineering, 8 years running", "Avg package ₹31.2 L · 97% placed", "Strongest CSE, Data Science & research"],
  },
  {
    slug: "iit-delhi", name: "IIT Delhi", short: "IITD", nirf: 2,
    location: "Hauz Khas, New Delhi", img: "/assets/team/IITs/IITs/IIT DELHI.jpg",
    bullets: ["NIRF #2 · top recruiter footfall", "Avg package ₹32.3 L · 96% placed", "Elite CSE, EE & startup ecosystem"],
  },
  {
    slug: "iit-bombay", name: "IIT Bombay", short: "IITB", nirf: 3,
    location: "Powai, Mumbai", img: "/assets/team/IITs/IITs/IIT BOMBAY.jpg",
    bullets: ["Most-preferred IIT for top rankers", "Avg package ₹33.8 L · 96% placed", "Powerhouse CSE & finance placements"],
  },
  {
    slug: "iit-kanpur", name: "IIT Kanpur", short: "IITK", nirf: 4,
    location: "Kanpur, Uttar Pradesh", img: "/assets/team/IITs/IITs/IIT KANPUR.jpg",
    bullets: ["NIRF #4 · legendary CSE & EE", "Avg package ₹32.6 L · 97% placed", "Deep research & coding culture"],
  },
  {
    slug: "iit-kharagpur", name: "IIT Kharagpur", short: "IIT KGP", nirf: 5,
    location: "Kharagpur, West Bengal", img: "/assets/team/IITs/IITs/IIT KHARAGPUR.jpg",
    bullets: ["Oldest IIT · largest campus", "Avg package ₹30.4 L · 95% placed", "Widest branch & dual-degree choice"],
  },
  {
    slug: "iit-roorkee", name: "IIT Roorkee", short: "IITR", nirf: 6,
    location: "Roorkee, Uttarakhand", img: "/assets/team/IITs/IITs/IIT ROORKEE.jpg",
    bullets: ["NIRF #6 · 175+ years of legacy", "Avg package ₹30.7 L · 95% placed", "Core + CSE strength, the CP home turf"],
  },
  {
    slug: "iit-guwahati", name: "IIT Guwahati", short: "IITG", nirf: 7,
    location: "Guwahati, Assam", img: "/assets/team/IITs/IITs/IIT GUWAHATI.jpg",
    bullets: ["NIRF #7 · stunning riverside campus", "Avg package ₹28.6 L · 92% placed", "Top CSE, Data Science & design"],
  },
  {
    slug: "iit-hyderabad", name: "IIT Hyderabad", short: "IITH", nirf: 8,
    location: "Sangareddy, Telangana", img: "/assets/team/IITs/IITs/IIT HYDERABAD.jpg",
    bullets: ["NIRF #8 · the fast-rising new IIT", "Avg package ₹27.9 L · 91% placed", "AI, CSE & fractal-academics pioneer"],
  },
];

const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function CollegeCard({ c, nav, extra }) {
  return (
    <motion.div
      variants={itemV}
      role="button"
      tabIndex={0}
      className={extra ? "ec-card ec-card-extra" : "ec-card"}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      onClick={() => nav(`/colleges/${c.slug}`)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); nav(`/colleges/${c.slug}`); } }}
      style={{
        textAlign: "left", cursor: "pointer", width: "100%", height: "100%",
        background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`,
        boxShadow: CL.shadow, display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* photo banner */}
      <div style={{ position: "relative", height: 152, overflow: "hidden" }}>
        <img src={c.img} alt={c.name} loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,12,4,.55), transparent 55%)" }} />
        <span style={{
          position: "absolute", top: 12, left: 12, display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11, fontWeight: 800, color: "#fff", background: CL.coral,
          padding: "5px 11px", borderRadius: 50, boxShadow: "0 6px 16px rgba(255, 105, 61,.4)",
        }}>
          <Trophy size={12} /> NIRF #{c.nirf}
        </span>
        <span style={{
          position: "absolute", top: 12, right: 12, fontSize: 11, fontWeight: 800,
          color: "#fff", background: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,.3)", padding: "5px 11px", borderRadius: 50,
        }}>
          {c.short}
        </span>
      </div>

      {/* content */}
      <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.15rem", color: CL.ink, letterSpacing: "-0.3px", marginBottom: 4 }}>
          {c.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: CL.muted, marginBottom: 14 }}>
          <MapPin size={13} color={CL.coral} /> {c.location}
        </div>

        <ul style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {c.bullets.map((b) => (
            <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 12.8, color: CL.ink2 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: CL.coral, marginTop: 6, flexShrink: 0 }} />
              {b}
            </li>
          ))}
        </ul>

        <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 7, color: CL.coralDk, fontWeight: 700, fontSize: 13, fontFamily: CL.display }}>
          View college <ArrowRight size={15} />
        </span>
      </div>
    </motion.div>
  );
}

export default function ExploreColleges() {
  const nav = useNavigate();
  return (
    <section id="explore-colleges" style={{ background: CL.cream, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 44px" }}>
          <span style={clEyebrow}><Building2 size={13} /> Explore Colleges</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.7rem)", color: CL.ink, letterSpacing: "-1px", margin: "16px 0 12px", lineHeight: 1.12 }}>
            Start with the <span style={{ color: CL.coral }}>flagship IITs.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            Real photos, verified cutoffs, placements and fees for every IIT, NIT and IIIT — here are six of the most-chosen institutes to begin your exploration.
          </p>
        </div>

        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 22 }}
        >
          {IITS.map((c, i) => <CollegeCard key={c.slug} c={c} nav={nav} extra={i >= 6} />)}
        </motion.div>

        {/* On phones only the first 6 colleges show; the last two are desktop-only. */}
        <style>{`@media (max-width: 760px){ .ec-card-extra{ display:none !important; } }`}</style>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button
            onClick={() => nav("/colleges")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: CL.coral, color: "#fff", border: "none", borderRadius: 50,
              padding: "13px 26px", fontFamily: CL.display, fontWeight: 800, fontSize: 14.5,
              cursor: "pointer", boxShadow: "0 10px 26px rgba(255, 105, 61,.35)",
            }}
          >
            <GraduationCap size={17} /> Explore all 850+ colleges <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
