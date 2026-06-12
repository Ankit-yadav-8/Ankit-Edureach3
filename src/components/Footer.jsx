import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Github, Linkedin, Dribbble, Mail, Phone,
  Instagram, Facebook, Heart, Sparkles, Twitter, Youtube,
  Send, MessageCircle, MapPin, Code2, ArrowUpRight,
} from "lucide-react";
import { TEAM } from "../data/team.js";

const COLLEGE_LINKS = [
  ["State-wise Colleges", "/colleges"],
  ["Explore All IITs", "/colleges?type=IIT"],
  ["Explore All NITs", "/colleges?type=NIT"],
  ["Explore All IIITs", "/colleges?type=IIIT"],
  ["Private Universities", "/#private"],
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
  ["Contact Us", "/about#contact"],
  ["Privacy Policy", "/about#privacy"],
  ["Terms of Use", "/about#terms"],
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
        {/* ── Initials logo (AY / AK) ── */}
        <span
          className="fdev-initials"
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: `linear-gradient(135deg, ${t.accent} 0%, #ea580c 100%)`,
            fontFamily: "Sora, sans-serif",
            fontWeight: 900,
            fontSize: "1.05rem",
            letterSpacing: "-0.5px",
            color: "#fff",
            flexShrink: 0,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)",
            border: `1.5px solid ${t.accent}cc`,
            userSelect: "none",
          }}
        >
          {t.initials}
        </span>

        {/* Name + highlighted role chips */}
        <span style={{ flex: 1, minWidth: 0 }}>
          <span className="fdev-name">{t.name}</span>
          <span className="fdev-roles">
            {roleParts.map((r) => (
              <span
                key={r}
                className="frole-chip"
                style={{ background: `linear-gradient(135deg, ${t.accent}, #fbbf24)` }}
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
        .fteam-badge { animation: ftBadgePulse 2.6s ease-in-out infinite; }
        @keyframes ftBadgePulse {
          0%,100% { box-shadow: 0 0 12px rgba(249,115,22,0.45); }
          50% { box-shadow: 0 0 22px rgba(249,115,22,0.75); }
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
                  background: "#F47B20",
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
                <span style={{ color: "var(--coral)" }}>.in</span>
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
              India's most trusted JEE rank predictor & college discovery
              platform for engineering aspirants.
            </p>
            <Col title="College" links={COLLEGE_LINKS} />
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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, type: "spring", bounce: 0.45 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}
          >
            <span
              className="fteam-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 18px",
                borderRadius: 99,
                background: "rgba(249,115,22,0.85)",
                fontSize: ".78rem",
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              <Code2 size={13} />
              Built by IITians. Trusted by Aspirants
            </span>
          </motion.div>

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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.2rem",
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
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
              href="mailto:support@collegeparichay.com"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Mail size={15} /> hello@collegeparichay.in
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
              <MapPin size={15} /> Jaipur,Rajasthan
            </span>
          </div>
          <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
            {[
              { Icon: Instagram, url: " https://www.instagram.com/collegeparichay?igsh=YnN6eGJwMWt1a21o&utm_source=qr", label: "Instagram" },
              { Icon: Facebook, url: "https://facebook.com", label: "Facebook" },
              { Icon: Twitter, url: "https://twitter.com", label: "Twitter / X" },
              { Icon: Linkedin, url: "https://www.linkedin.com/company/college-parichay/", label: "LinkedIn" },
              { Icon: Youtube, url: "https://youtube.com/@collegeparichay?si=jB_0mk8J6BSaKjzx", label: "YouTube" },
              { Icon: Send, url: "https://telegram.org", label: "Telegram" },
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