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
  ["BITSAT 2026", "/other-exams#exam-bitsat"],
  ["VITEEE 2026", "/other-exams#exam-viteee"],
  ["MHT CET 2026", "/other-exams#exam-mht-cet"],
  ["KCET 2026", "/other-exams#exam-kcet"],
  ["WBJEE 2026", "/other-exams#exam-wbjee"],
  ["COMEDK UGET 2026", "/other-exams#exam-comedk-uget"],
  ["SRMJEEE 2026", "/other-exams#exam-srmjeee"],
  ["KEAM 2026", "/other-exams#exam-keam"],
];
const TOOL_LINKS = [
  ["All Smart Tools", "/tools"],
  ["JoSAA 2026 Counselling ₹499", "/josaa-2026"],
  ["JEE Main Rank Predictor", "/jee-main#rank"],
  ["College Predictor", "/jee-main#college"],
  ["Counselling Planner", "/planner"],
  ["Compare Colleges", "/compare"],
  ["Compare Exams", "/compare-exams"],
  ["Hostel & Mess Reviews", "/reviews"],
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
function Col({ title, links, unclickable }) {
  return (
    <div>
      {/* h2, not h4: these are top-level site sections. Pages end on h2/h3, so
          an h4 here skipped a level and failed the heading-order audit. Size is
          set inline, so the rendered footer is unchanged. */}
      <h2
        style={{
          color: "#fff",
          fontSize: ".95rem",
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: ".4rem",
        }}
      >
        {title}
      </h2>
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
            {unclickable ? (
              <span
                style={{
                  color: "rgba(255,255,255,.7)",
                  fontSize: ".88rem",
                  cursor: "default",
                }}
              >
                {label}
              </span>
            ) : (
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
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Member image positioning for perfect uncropped headshot framing ──────── */
const MEMBER_IMAGE_POS = {
  "team-head": "center 36%",
  "developer-1": "center 8%",
  "developer-2": "center 12%",
};

/* ── Team member card ───────────────────────────────────────────── */
function DevCard({ t, index = 0 }) {
  const roleParts = (t.role || "")
    .split(/\s*(?:&|\band\b|,|\/)\s*/i)
    .map((s) => s.trim())
    .filter(Boolean);

  const imgPos = MEMBER_IMAGE_POS[t.id] || "center 30%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 0.68, 0, 1.1] }}
      whileHover={{ y: -5 }}
      style={{ height: "100%" }}
    >
      <Link
        className="fdev-card"
        to={`/team/${t.id}`}
        title={`View ${t.name}'s portfolio`}
      >
        {/* ── Member photo showcase (3x size: 216px tall, full width) ── */}
        <div className="fdev-img-wrap">
          {t.photo ? (
            <img
              src={t.photo}
              alt={t.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: imgPos,
                display: "block",
              }}
            />
          ) : (
            <div className="fdev-fallback-initials">
              {t.initials}
            </div>
          )}

          {/* Top arrow pill overlay */}
          <div className="fdev-arrow-pill" title="View Portfolio">
            <ArrowUpRight size={15} />
          </div>
        </div>

        {/* ── Card Content Body ── */}
        <div className="fdev-body">
          <div>
            <span className="fdev-name">{t.name}</span>
            <div className="fdev-roles">
              {roleParts.map((r) => (
                <span key={r} className="frole-chip">
                  {r}
                </span>
              ))}
            </div>
          </div>

          {t.tagline && (
            <p className="fdev-quote">
              "{t.tagline}"
            </p>
          )}

          {t.college && (
            <div className="fdev-college">
              <MapPin size={11} />
              <span>{t.college}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Footer ─────────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer style={{ background: "#000000", color: "#fff", paddingTop: "3.5rem", position: "relative", overflow: "hidden" }}>
      <style>{`
        .fdev-card {
          display: flex;
          flex-direction: column;
          border-radius: 18px;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          color: #fff;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          height: 100%;
          transition: background .22s ease, border-color .22s ease, transform .22s ease;
        }
        .fdev-card:hover {
          background: #111111;
          border-color: #2e2e2e;
          transform: translateY(-4px);
        }
        .fdev-img-wrap {
          position: relative;
          width: 100%;
          height: 285px;
          background: #141414;
          overflow: hidden;
          border-bottom: 1px solid #171717;
        }
        .fdev-card:hover .fdev-img-wrap img {
          transform: scale(1.02);
        }
        .fdev-img-wrap img {
          transform-origin: center 25%;
          transition: transform .35s ease;
        }
        .fdev-fallback-initials {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          background: #171717;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-weight: 900;
          font-size: 2.2rem;
        }
        .fdev-arrow-pill {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(255,255,255,0.12);
          display: grid;
          place-items: center;
          color: rgba(255,255,255,0.7);
          transition: background .2s, color .2s, transform .2s;
        }
        .fdev-card:hover .fdev-arrow-pill {
          background: #ff693d;
          color: #fff;
          border-color: #ff693d;
          transform: translate(2px, -2px);
        }
        .fdev-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 10px;
        }
        .fdev-name {
          display: block;
          font-family: 'Sora', sans-serif;
          font-size: 1.08rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
        }
        .fdev-roles {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }
        .frole-chip {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 6px;
          background: #141414;
          border: 1px solid #242424;
          font-family: 'Sora', sans-serif;
          font-size: .62rem;
          font-weight: 800;
          letter-spacing: .5px;
          text-transform: uppercase;
          color: #ff7a50;
          white-space: nowrap;
        }
        .fdev-quote {
          margin: 4px 0 0;
          font-size: .84rem;
          color: #a1a1aa;
          line-height: 1.5;
          font-style: italic;
          flex: 1;
        }
        .fdev-college {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: .72rem;
          color: #ff7a50;
          font-weight: 800;
          letter-spacing: .6px;
          text-transform: uppercase;
          padding-top: 10px;
          margin-top: auto;
          border-top: 1px solid #171717;
        }
        .fteam-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.3rem;
          max-width: 1140px;
          margin: 0 auto;
        }
        @media (max-width: 960px) {
          .fteam-grid {
            grid-template-columns: 1fr;
            max-width: 440px;
          }
          .fdev-img-wrap {
            height: 310px;
          }
        }
      `}</style>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

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
                  background: "#FF693D",
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
                CampusPoint
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
              <span style={{ color: "#FF693D", fontWeight: 800, background: "rgba(255, 105, 61,.14)", padding: "0 5px", borderRadius: 5 }}>Ankit Kumar</span>,{" "}
              <span style={{ color: "#FF693D", fontWeight: 800, background: "rgba(255, 105, 61,.14)", padding: "0 5px", borderRadius: 5 }}>Mayank Singh</span>, and{" "}
              <span style={{ color: "#FF693D", fontWeight: 800, background: "rgba(255, 105, 61,.14)", padding: "0 5px", borderRadius: 5 }}>Saket Kumar</span>{" "}- a
              student-first JEE rank predictor &amp; college discovery platform,
              headquartered in Jaipur, Rajasthan.
            </p>
            <Col title="Campus Point" links={COLLEGE_LINKS} />
          </div>
          <Col title="Other Exams" links={EXAM_LINKS} />
          <Col title="Tools" links={TOOL_LINKS} />
          <Col title="Company" links={COMPANY_LINKS} />
        </div>

        {/* ── Developer Team Section ─────────────────────────── */}
        <div
          style={{
            marginTop: "2.8rem",
            borderRadius: 22,
            padding: "2.2rem 1.8rem 2rem",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #1a1a1a",
            background: "#050505",
          }}
        >
          {/* "Built by IITians" badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 18px",
                borderRadius: 50,
                background: "#0f0f0f",
                border: "1px solid #222222",
                fontSize: ".74rem",
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "#ff7a50",
              }}
            >
              <Code2 size={13} />
              Built by IITians · Trusted by Aspirants
            </span>
          </div>

          {/* Sub-heading */}
          <p
            style={{
              textAlign: "center",
              color: "#e4e4e7",
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontSize: ".82rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: "1.8rem",
            }}
          >
            <Sparkles size={14} color="#ff7a50" />
            Crafted with{" "}
            <Heart
              size={13}
              fill="#ff693d"
              color="#ff693d"
              style={{ margin: "0 2px" }}
            />{" "}
            by the CampusPoint Team
          </p>

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
            borderTop: "1px solid #1a1a1a",
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
              href="mailto:campuspath6@gmail.com"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Mail size={15} /> campuspath6@gmail.com
            </a>
            <a
              href="tel:+918118826194"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Phone size={15} /> +91-8118826194
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={15} /> Jaipur, Rajasthan
            </span>
          </div>
          <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
            {[
              { Icon: Linkedin, url: "https://www.linkedin.com/company/college-parichay/", label: "LinkedIn" },
              { Icon: Instagram, url: "https://www.instagram.com/CampusPoint", label: "Instagram" },
              { Icon: Youtube, url: "https://www.youtube.com/@CampusPoint-2626", label: "YouTube" },
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
                  background: "#111111",
                  border: "1px solid #222222",
                  color: "rgba(255,255,255,.8)",
                  transition: "background .2s, border-color .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1a1a1a";
                  e.currentTarget.style.borderColor = "#ff693d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#111111";
                  e.currentTarget.style.borderColor = "#222222";
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

      {/* giant CampusLoom-style wordmark - ghosted brand at the base */}
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", overflow: "hidden", pointerEvents: "none", zIndex: 0, lineHeight: 1.12 }}>
        <span style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(2.8rem, 12.5vw, 12.5rem)", color: "rgba(255,255,255,.055)", whiteSpace: "nowrap", letterSpacing: "-0.03em", display: "inline-block", textShadow: "0 6px 50px rgba(255,90,54,.18), 0 2px 3px rgba(0,0,0,.5)" }}>
          Campus Point
        </span>
      </div>
    </footer>
  );
}