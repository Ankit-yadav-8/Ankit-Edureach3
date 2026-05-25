import { Link } from "react-router-dom";
import { GraduationCap, Github, Linkedin, Dribbble, Mail, Phone, Instagram, Facebook, Heart, Sparkles, Twitter, Youtube, Send, MessageCircle, MapPin } from "lucide-react";
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

function Col({ title, links }) {
  return (
    <div>
      <h4 style={{ color: "#fff", fontSize: ".95rem", letterSpacing: 1, textTransform: "uppercase", marginBottom: ".4rem" }}>{title}</h4>
      <div style={{ width: 36, height: 3, background: "var(--coral)", borderRadius: 3, marginBottom: "1rem" }} />
      <ul style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} style={{ color: "rgba(255,255,255,.7)", fontSize: ".88rem", transition: ".2s" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--coral-light)")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,.7)")}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "var(--navy)", color: "#fff", paddingTop: "3.5rem" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: "2.5rem" }} className="footer-grid">
          <div>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", background: "linear-gradient(135deg,var(--coral),var(--coral-light))" }}>
                <GraduationCap size={20} />
              </span>
              <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.4rem" }}>
                EduReach<span style={{ color: "var(--coral)" }}>.in</span>
              </span>
            </Link>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".9rem", maxWidth: 280, marginBottom: "1.4rem" }}>
              India's most trusted JEE rank predictor & college discovery platform for engineering aspirants.
            </p>
            <Col title="College" links={COLLEGE_LINKS} />
          </div>
          <Col title="Exam" links={EXAM_LINKS} />
          <Col title="Tools" links={TOOL_LINKS} />
          <Col title="Company" links={COMPANY_LINKS} />
        </div>

        {/* Developer team */}
        <div style={{ marginTop: "2.8rem", background: "rgba(249,115,22,.12)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, padding: "1.5rem", textAlign: "center" }}>
          <p style={{ color: "var(--gold)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontSize: ".9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "1.2rem" }}>
            <Sparkles size={16} /> Built with <Heart size={15} fill="var(--coral)" color="var(--coral)" /> by Team EduReach
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.6rem" }}>
            {TEAM.map((t) => {
              const social = Object.keys(t.socials || {})[0];
              const Ic = ICON[social] || Github;
              return (
                <Link key={t.id} to={`/team/${t.id}`} title={`View ${t.name}'s portfolio`}
                  className="dev-link" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
                  <span style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", background: `linear-gradient(135deg, ${t.accent}, var(--coral-light))`, fontWeight: 700, fontSize: ".8rem" }}>
                    {t.initials}
                  </span>
                  <span>
                    <span style={{ display: "block", fontSize: ".88rem", fontWeight: 600 }}>{t.name}</span>
                    <span style={{ display: "block", fontSize: ".72rem", color: "rgba(255,255,255,.6)" }}>{t.role}</span>
                  </span>
                  <Ic size={16} color="rgba(255,255,255,.7)" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ marginTop: "2rem", paddingTop: "1.4rem", paddingBottom: "1.6rem", borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", flexWrap: "wrap", gap: "1.2rem", justifyContent: "space-between", alignItems: "center", fontSize: ".85rem", color: "rgba(255,255,255,.7)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.4rem" }}>
            <a href="mailto:support@edureachportal.in" style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={15} /> support@edureachportal.in</a>
            <a href="tel:+910000000000" style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={15} /> +91-XXXXXXXXXX</a>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={15} /> New Delhi, India</span>
          </div>
          <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
            {[
              { Icon: Instagram, url: "https://instagram.com", label: "Instagram" },
              { Icon: Facebook, url: "https://facebook.com", label: "Facebook" },
              { Icon: Twitter, url: "https://twitter.com", label: "Twitter / X" },
              { Icon: Linkedin, url: "https://linkedin.com", label: "LinkedIn" },
              { Icon: Youtube, url: "https://youtube.com", label: "YouTube" },
              { Icon: Github, url: "https://github.com", label: "GitHub" },
              { Icon: Send, url: "https://telegram.org", label: "Telegram" },
              { Icon: MessageCircle, url: "https://whatsapp.com", label: "WhatsApp" },
            ].map(({ Icon, url, label }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}
                className="social-ico" style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.8)" }}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <p style={{ textAlign: "center", padding: "0 0 1.4rem", color: "rgba(255,255,255,.45)", fontSize: ".8rem" }}>
          © 2026 EduReach. All rights reserved. · Data is illustrative — verify on official portals.
        </p>
      </div>
    </footer>
  );
}
