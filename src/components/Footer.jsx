import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Github, Linkedin, Dribbble, Mail, Phone,
  Instagram, Heart, Sparkles, Youtube,
  MessageCircle, MapPin, Code2, ArrowUpRight,
} from "lucide-react";
import { TEAM } from "../data/team.js";

const COLLEGE_LINKS = [
  ["State-wise Colleges", "/colleges"],
  ["Explore All IITs", "/colleges?type=IIT"],
  ["Explore All NITs", "/colleges?type=NIT"],
  ["Explore All IIITs", "/colleges?type=IIIT"],
  ["Private Universities", "/private-universities"],
];
const EXAM_LINKS = [
  ["JEE Main 2026", "/exams/jee-main"],
  ["JEE Advanced 2026", "/exams/jee-advanced"],
  ["BITSAT 2026", "/exams/bitsat"],
  ["MHT-CET 2026", "/exams/mht-cet"],
  ["WBJEE 2026", "/exams/wbjee"],
  ["KCET 2026", "/exams/kcet"],
  ["VITEEE 2026", "/exams/viteee"],
];
const TOOL_LINKS = [
  ["JoSAA 2026 Counselling ₹499", "/josaa-2026"],
  ["JEE Main Rank Predictor", "/jee-main#rank"],
  ["College Predictor", "/jee-main#college"],
  ["Counselling Planner", "/planner"],
  ["Compare Colleges", "/compare"],
  ["Compare Exams", "/compare-exams"],
  ["College Map", "/map"],
  ["Scholarships & Loans", "/scholarships"],
  ["My Shortlist", "/shortlist"],
];
const COMPANY_LINKS = [
  ["About Us", "/about"],
  ["Blog", "/blog"],
  ["Contact Us", "/about#contact"],
  ["Privacy Policy", "/privacy"],
  ["Terms of Use", "/terms"],
  ["Support", "/about#contact"],
];

const ICON = { github: Github, linkedin: Linkedin, dribbble: Dribbble };

/* ── Footer column ──────────────────────────────────────────────── */
function Col({ title, links }) {
  return (
    <div>
      <h4
        style={{
          color: "#fff",
          fontSize: ".95rem",
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: ".4rem",
        }}
      >
        {title}
      </h4>
      <div
        style={{
          width: 36,
          height: 3,
          background: "var(--coral)",
          borderRadius: 3,
          marginBottom: "1rem",
        }}
      />
      <ul style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
        {links.map(([label, to]) => (
          <li key={label}>
            <Link
              to={to}
              style={{
                color: "rgba(255,255,255,.7)",
                fontSize: ".88rem",
                transition: ".2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--coral-light)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(255,255,255,.7)")
              }
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Team member card ───────────────────────────────────────────── */
function DevCard({ t, index = 0 }) {
  const roleParts = (t.role || "")
    .split(/\s*(?:&|\band\b|,|\/)\s*/i)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 0.68, 0, 1.1] }}
      whileHover={{ y: -4 }}
    >
      <Link
        className="fdev-card"
        to={`/team/${t.id}`}
        title={`View ${t.name}'s portfolio`}
      >
        {/* ── Member photo (falls back to initials) ── */}
        <span
          className="fdev-initials"
          style={{
            position: "relative",
            width: 72,
            height: 72,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            background: `linear-gradient(135deg, ${t.accent} 0%, #E0421F 100%)`,
            fontFamily: "Sora, sans-serif",
            fontWeight: 900,
            fontSize: "1.25rem",
            letterSpacing: "-0.5px",
            color: "#fff",
            flexShrink: 0,
            border: `1.5px solid ${t.accent}cc`,
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          {t.initials}
          {t.photo && (
            <img
              src={t.photo}
              alt={t.name}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
            />
          )}
        </span>

        {/* Name + highlighted role chips */}
        <span style={{ flex: 1, minWidth: 0 }}>
          <span className="fdev-name">{t.name}</span>
          <span className="fdev-roles">
            {roleParts.map((r) => (
              <span
                key={r}
                className="frole-chip"
                style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(241,90,56,.45)", color: "#fb9b85" }}
              >
                {r}
              </span>
            ))}
          </span>
        </span>
        <ArrowUpRight className="fdev-arrow" size={16} color="rgba(255,255,255,.55)" />
      </Link>
    </motion.div>
  );
}

/* ── Footer ─────────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", color: "#fff", paddingTop: "3.5rem" }}>
      <style>{`
        .fdev-card {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px; border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(249,115,22,0.25);
          color: #fff; text-decoration: none;
          position: relative; overflow: hidden;
          backdrop-filter: blur(8px);
          transition: background .25s, border-color .25s, box-shadow .25s;
        }
        .fdev-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(249,115,22,0.5);
        }
        .fdev-initials { transition: transform .3s cubic-bezier(.22,.68,0,1.3); }
        .fdev-card:hover .fdev-initials { transform: rotate(-5deg) scale(1.07); }
        .fdev-arrow { transition: transform .25s ease, color .25s ease; }
        .fdev-card:hover .fdev-arrow { transform: translate(3px,-3px); color: var(--coral-light); }
        .fdev-name { display: block; font-size: .9rem; font-weight: 700; color: #fff; }
        .fdev-roles { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px; }
        .frole-chip {
          display: inline-flex; align-items: center;
          padding: 2px 9px; border-radius: 50px;
          font-family: "Sora", sans-serif; font-size: .6rem; font-weight: 800;
          letter-spacing: .5px; text-transform: uppercase; color: #fff;
          white-space: nowrap;
        }
        .fteam-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          max-width: 1080px;
          margin: 0 auto;
        }
        @media (max-width: 880px) {
          .fteam-grid { grid-template-columns: 1fr; max-width: 460px; }
        }
      `}</style>
      <div className="container">

        {/* Main link grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: "2.5rem",
          }}
          className="footer-grid"
        >
          <div>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "#F15A38",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#fff", fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "-0.5px", lineHeight: 1 }}>
                  CP
                </span>
              </span>
              <span
                style={{
                  fontFamily: "Sora",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                }}
              >
                Collegeparichay
              </span>
            </Link>
            <p
              style={{
                color: "rgba(255,255,255,.65)",
                fontSize: ".9rem",
                maxWidth: 280,
                marginBottom: "1.4rem",
              }}
            >
              Founded by IIT Roorkee alumni{" "}
              <span style={{ color: "#F15A38", fontWeight: 800, background: "rgba(241,90,56,.14)", padding: "0 5px", borderRadius: 5 }}>Ankit Yadav</span>{" "}&amp;{" "}
              <span style={{ color: "#F15A38", fontWeight: 800, background: "rgba(241,90,56,.14)", padding: "0 5px", borderRadius: 5 }}>Ankit Kumar</span>{" "}— a
              student-first JEE rank predictor &amp; college discovery platform,
              headquartered in Jaipur, Rajasthan.
            </p>
            <Col title="College Parichay" links={COLLEGE_LINKS} />
          </div>
          <Col title="Exam" links={EXAM_LINKS} />
          <Col title="Tools" links={TOOL_LINKS} />
          <Col title="Company" links={COMPANY_LINKS} />
        </div>

        {/* ── Developer Team Section ─────────────────────────── */}
        <div
          style={{
            marginTop: "2.8rem",
            borderRadius: 20,
            padding: "2rem 1.8rem 1.8rem",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.03)",
          }}
        >
          {/* "Built by developers" badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <span
              className="fteam-badge glow-pulse"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 18px",
                borderRadius: 99,
                background: "#F15A38",
                fontSize: ".78rem",
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "#fff",
                boxShadow: "0 0 22px rgba(241,90,56,.6), 0 0 0 1px rgba(255,255,255,.12)",
              }}
            >
              <Code2 size={13} />
              Built by IITians · Trusted by Aspirants
            </span>
          </div>

          {/* Sub-heading */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              textAlign: "center",
              color: "var(--gold)",
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              fontSize: ".85rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: "1.5rem",
            }}
          >
            <Sparkles size={14} />
            Crafted with{" "}
            <Heart
              size={13}
              fill="var(--coral)"
              color="var(--coral)"
              style={{ margin: "0 2px" }}
            />{" "}
            by the Collegeparichay Team
          </motion.p>

          {/* Team cards grid */}
          <div className="fteam-grid">
            {TEAM.map((t, i) => (
              <DevCard key={t.id} t={t} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.4rem",
            paddingBottom: "1.6rem",
            borderTop: "1px solid rgba(255,255,255,.1)",
            display: "flex",
            flexWrap: "wrap",
            gap: "1.2rem",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: ".85rem",
            color: "rgba(255,255,255,.7)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.4rem" }}>
            <a
              href="mailto:collegeparichay@gmail.com"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Mail size={15} /> collegeparichay@gmail.com
            </a>
            <a
              href="tel:+918118826194"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Phone size={15} /> +91-8118826194
            </a>
            <a
              href="tel:+917877596464 "
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Phone size={15} /> +91-7877596464 
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={15} /> Jaipur, Rajasthan
            </span>
          </div>
          <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
            {[
              { Icon: Linkedin, url: "https://www.linkedin.com/company/college-parichay/", label: "LinkedIn" },
              { Icon: Instagram, url: "https://www.instagram.com/collegeparichay", label: "Instagram" },
              { Icon: Youtube, url: "https://www.youtube.com/@CollegeParichay-2626", label: "YouTube" },
              { Icon: MessageCircle, url: "https://chat.whatsapp.com/EKezcNXEw9iKRdo7Wrjzzx?mode=gi_t", label: "WhatsApp" },
            ].map(({ Icon, url, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="social-ico"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.15)",
                  color: "rgba(255,255,255,.8)",
                  transition: "box-shadow .2s, border-color .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(249,115,22,0.18)";
                  e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            padding: "0 0 1.4rem",
            color: "rgba(255,255,255,.45)",
            fontSize: ".8rem",
          }}
        >
        </p>
      </div>
    </footer>
  );
}