import { Link } from "react-router-dom";
import {
  GraduationCap, Github, Linkedin, Dribbble, Mail, Phone,
  Instagram, Facebook, Heart, Sparkles, Twitter, Youtube,
  Send, MessageCircle, MapPin, Code2,
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
  ["JoSAA 2026 Counselling ₹999", "/josaa-2026"],
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
function DevCard({ t }) {
  const social = Object.keys(t.socials || {})[0];
  const Ic = ICON[social] || Github;

  return (
    <Link
      to={`/team/${t.id}`}
      title={`View ${t.name}'s portfolio`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 18px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(249,115,22,0.25)",
        color: "#fff",
        textDecoration: "none",
        transition: "all .25s ease",
        backdropFilter: "blur(8px)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(249,115,22,0.12)";
        e.currentTarget.style.border = "1px solid rgba(249,115,22,0.55)";
        e.currentTarget.style.boxShadow =
          "0 0 18px rgba(249,115,22,0.28), 0 0 6px rgba(249,115,22,0.15)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.border = "1px solid rgba(249,115,22,0.25)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* subtle inner glow dot */}
      <span
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${t.accent}33, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Avatar — shows photo if available, else initials ── */}
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(135deg, ${t.accent}, var(--coral-light))`,
          fontWeight: 700,
          fontSize: ".82rem",
          flexShrink: 0,
          boxShadow: `0 0 10px ${t.accent}66`,
          overflow: "hidden",
          /* photo border glow */
          border: t.photo ? `2px solid ${t.accent}99` : "none",
        }}
      >
        {t.photo ? (
          <img
            src={t.photo}
            alt={t.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          t.initials
        )}
      </span>

      {/* Name + role */}
      <span style={{ flex: 1 }}>
        <span
          style={{ display: "block", fontSize: ".88rem", fontWeight: 600 }}
        >
          {t.name}
        </span>
        <span
          style={{
            display: "block",
            fontSize: ".72rem",
            color: "rgba(255,255,255,.55)",
          }}
        >
          {t.role}
        </span>
      </span>
      <Ic size={15} color="rgba(255,255,255,.5)" />
    </Link>
  );
}

/* ── Footer ─────────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer style={{ background: "var(--navy)", color: "#fff", paddingTop: "3.5rem" }}>
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
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg,var(--coral),var(--coral-light))",
                }}
              >
                <GraduationCap size={20} />
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
            boxShadow:
              "0 0 0 1px rgba(249,115,22,0.22), 0 0 30px rgba(249,115,22,0.18), 0 0 60px rgba(249,115,22,0.08)",
            background:
              "linear-gradient(145deg, rgba(249,115,22,0.10) 0%, rgba(15,20,40,0.85) 60%, rgba(249,115,22,0.06) 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* corner glow blobs */}
          <span
            style={{
              position: "absolute",
              top: -40,
              left: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(249,115,22,0.22), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* "Built by developers" badge */}
          <div
            style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 18px",
                borderRadius: 99,
                background: "rgba(249,115,22,0.85)",
                boxShadow: "0 0 14px rgba(249,115,22,0.55)",
                fontSize: ".78rem",
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              <Code2 size={13} />
              Built by Developers
            </span>
          </div>

          {/* Sub-heading */}
          <p
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
          </p>

          {/* Team cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              maxWidth: 860,
              margin: "0 auto",
            }}
          >
            {TEAM.map((t) => (
              <DevCard key={t.id} t={t} />
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
              href="mailto:support@edureachportal.in"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Mail size={15} /> support@edureachportal.in
            </a>
            <a
              href="tel:+918118826194"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Phone size={15} /> +91-8118826194
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={15} /> New Delhi, India
            </span>
          </div>
          <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
            {[
              { Icon: Instagram, url: "https://instagram.com/ankit_1_7_", label: "Instagram" },
              { Icon: Facebook, url: "https://facebook.com", label: "Facebook" },
              { Icon: Twitter, url: "https://twitter.com", label: "Twitter / X" },
              { Icon: Linkedin, url: "https://www.linkedin.com/in/ankit-kumar-1b9a64387", label: "LinkedIn" },
              { Icon: Youtube, url: "https://youtube.com", label: "YouTube" },
              { Icon: Github, url: "https://github.com", label: "GitHub" },
              { Icon: Send, url: "https://telegram.org", label: "Telegram" },
              { Icon: MessageCircle, url: "https://whatsapp.com", label: "WhatsApp" },
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
                  e.currentTarget.style.boxShadow =
                    "0 0 10px rgba(249,115,22,0.5)";
                  e.currentTarget.style.borderColor = "rgba(249,115,22,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
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