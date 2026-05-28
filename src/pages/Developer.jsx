import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Github, Linkedin, Dribbble, Globe,
  Mail, MapPin, Sparkles, ExternalLink, Code2, Trophy,
} from "lucide-react";
import { TEAM_BY_ID } from "../data/team.js";
import Reveal from "../components/Reveal.jsx";

const ICON = { github: Github, linkedin: Linkedin, dribbble: Dribbble, website: Globe };

/* ── AK Glow Logo ──────────────────────────────────────────────── */
function DevGlowLogo({ initials, accent, size = 110 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Outer ambient glow */}
      <div style={{
        position: "absolute",
        inset: -20,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}55 0%, ${accent}22 45%, transparent 72%)`,
        animation: "akGlow 3s ease-in-out infinite alternate",
        pointerEvents: "none",
      }} />
      {/* Rotating ring */}
      <div style={{
        position: "absolute", inset: -6,
        borderRadius: "50%",
        border: `2px dashed ${accent}50`,
        animation: "spin 8s linear infinite",
        pointerEvents: "none",
      }} />
      {/* Solid ring */}
      <div style={{
        position: "absolute", inset: -2,
        borderRadius: "50%",
        border: `2px solid ${accent}55`,
        animation: "akRing 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      {/* Main logo */}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${accent} 0%, #ea580c 55%, #c2410c 100%)`,
        display: "grid", placeItems: "center",
        fontFamily: "Sora", fontWeight: 800,
        fontSize: size * 0.3, color: "#fff",
        letterSpacing: "-1px",
        boxShadow: `0 0 0 4px rgba(255,255,255,.15), 0 8px 40px ${accent}88, 0 0 80px ${accent}44`,
        position: "relative", zIndex: 1,
        userSelect: "none",
      }}>
        {initials}
      </div>
    </div>
  );
}

/* ── Avatar for non-head members ───────────────────────────────── */
function HeroAvatar({ dev }) {
  if (dev.photo) {
    return (
      <div style={{
        width: 92, height: 92, borderRadius: "50%", overflow: "hidden",
        border: "3px solid rgba(255,255,255,0.6)",
        boxShadow: "0 0 24px rgba(255,255,255,0.25), 0 0 8px rgba(0,0,0,0.3)",
        flexShrink: 0,
      }}>
        <img src={dev.photo} alt={dev.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div style={{
      width: 92, height: 92, borderRadius: "50%",
      background: "rgba(255,255,255,.18)",
      border: "2px solid rgba(255,255,255,.5)",
      display: "grid", placeItems: "center",
      fontFamily: "Sora", fontWeight: 800, fontSize: 30,
    }}>
      {dev.initials}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function Developer() {
  const { id } = useParams();
  const nav = useNavigate();
  const dev = TEAM_BY_ID[id];

  if (!dev) {
    return (
      <div
        className="page container"
        style={{ padding: "80px 0", textAlign: "center" }}
      >
        <h2>Profile not found</h2>
        <Link
          to="/"
          className="btn btn-coral"
          style={{ marginTop: 16 }}
        >
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(135deg, #0f0c29 0%, #1c1c28 50%, ${dev.accent}33 100%)`,
        color: "#fff",
        padding: "52px 0 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: -80, right: -40, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${dev.accent}30 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${dev.accent}18 0%, transparent 65%)`, pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <button onClick={() => nav(-1)} className="btn btn-light" style={{ marginBottom: 28 }}>
            <ArrowLeft size={16} /> Back
          </button>

          {/* Two-column layout: left = info, right = logo */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 40,
            alignItems: "center",
          }}>
            {/* ── Left: Info ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="badge" style={{ background: "rgba(255,255,255,.14)", color: "#fff", marginBottom: 16, display: "inline-flex" }}>
                <Sparkles size={12} /> Team EduReach · Project Lead
              </span>

              <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,3rem)", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                {dev.name}
              </h1>

              <div style={{ color: `${dev.accent}`, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>
                {dev.role}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
                <div style={{ color: "rgba(255,255,255,.7)", display: "flex", alignItems: "center", gap: 5, fontSize: 13.5 }}>
                  <MapPin size={14} /> {dev.location}
                </div>
                {dev.jeeRank && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,.12)",
                    borderRadius: 99, padding: "4px 14px",
                    fontSize: 13, fontWeight: 600,
                  }}>
                    🏆 {dev.jeeRank} · {dev.exam}
                  </div>
                )}
              </div>

              <p style={{ color: "rgba(255,255,255,.8)", fontSize: "1.02rem", maxWidth: 560, fontStyle: "italic", lineHeight: 1.7, marginBottom: 22 }}>
                "{dev.tagline}"
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {Object.entries(dev.socials).map(([k, url]) => {
                  const I = ICON[k] || Globe;
                  return (
                    <a key={k} href={url} target="_blank" rel="noreferrer" className="btn btn-light" style={{ fontSize: 13, textTransform: "capitalize" }}>
                      <I size={15} /> {k}
                    </a>
                  );
                })}
                <a href={`mailto:${dev.email}`} className="btn btn-coral" style={{ fontSize: 13 }}>
                  <Mail size={15} /> Email
                </a>
              </div>
            </motion.div>

            {/* ── Right: AK Glow Logo ── */}
            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
              className="dev-logo-col"
            >
              {dev.initials === "AK" || !dev.photo ? (
                <DevGlowLogo initials={dev.initials} accent={dev.accent} size={120} />
              ) : (
                <HeroAvatar dev={dev} />
              )}

              {/* Skill chips below logo */}
              {dev.skills && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", maxWidth: 200 }}>
                  {dev.skills.slice(0, 4).map((s) => (
                    <span key={s} style={{
                      padding: "3px 10px", borderRadius: 50,
                      background: "rgba(255,255,255,.1)",
                      border: "1px solid rgba(255,255,255,.15)",
                      fontSize: 11, color: "rgba(255,255,255,.8)", fontWeight: 600,
                    }}>{s}</span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div
        className="container section"
        style={{ display: "flex", flexDirection: "column", gap: 26 }}
      >
        {/* About */}
        <Reveal>
          <div className="card">
            <h3
              style={{
                fontFamily: "Sora",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              About
            </h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{dev.bio}</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 16,
              }}
            >
              {dev.skills.map((s) => (
                <span
                  key={s}
                  className="pill"
                  style={{
                    background: "var(--sky)",
                    border: "1px solid var(--line)",
                    color: "var(--navy)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Featured work */}
        <Reveal delay={0.08}>
          <div>
            <h3
              style={{
                fontFamily: "Sora",
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              Featured work
            </h3>
            <div className="grid-3">
              {dev.projects.map((p, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    height: "100%",
                    borderTop: `3px solid ${dev.accent}`,
                  }}
                >
                  <span
                    className="badge"
                    style={{
                      background: `${dev.accent}1a`,
                      color: dev.accent,
                    }}
                  >
                    {p.tag}
                  </span>
                  <h4
                    style={{
                      fontFamily: "Sora",
                      fontWeight: 700,
                      margin: "10px 0 6px",
                    }}
                  >
                    {p.name}
                  </h4>
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Contact CTA */}
        <Reveal delay={0.12}>
          <div
            className="card"
            style={{
              textAlign: "center",
              background: "linear-gradient(135deg,#fff,var(--sky))",
            }}
          >
            <h3
              style={{
                fontFamily: "Sora",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Want to work together?
            </h3>
            <p style={{ color: "var(--muted)", marginBottom: 14 }}>
              Reach out — always happy to chat about projects and ideas.
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a href={`mailto:${dev.email}`} className="btn btn-coral">
                <Mail size={15} /> {dev.email}
              </a>
              {dev.socials.website && (
                <a
                  href={dev.socials.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                >
                  Visit website <ExternalLink size={14} />
                </a>
              )}
            </div>
            <p
              style={{
                fontSize: 11,
                color: "var(--muted)",
                marginTop: 14,
              }}
            >
              This is a demo portfolio page. Edit src/data/team.js to add the
              real profile.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}