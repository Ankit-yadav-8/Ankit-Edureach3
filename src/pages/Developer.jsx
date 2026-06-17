import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Github, Linkedin, Dribbble, Globe,
  Mail, MapPin, Sparkles, ExternalLink, Code2, Trophy,
} from "lucide-react";
import { TEAM_BY_ID } from "../data/team.js";
import Reveal from "../components/Reveal.jsx";

const ICON = { github: Github, linkedin: Linkedin, dribbble: Dribbble, website: Globe };

/* ── Square Photo Card for Ankit (large, glowing border) ─────── */
function SquarePhotoCard({ dev }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {/* Outer ambient glow */}
      <div style={{
        position: "absolute",
        inset: -20,
        borderRadius: 24,
        background: `radial-gradient(circle, ${dev.accent}55 0%, ${dev.accent}22 50%, transparent 75%)`,
        animation: "akGlow 3s ease-in-out infinite alternate",
        pointerEvents: "none",
        filter: "blur(10px)",
      }} />
      {/* Animated border glow ring */}
      <div style={{
        position: "absolute", inset: -3,
        borderRadius: 20,
        background: `linear-gradient(135deg, ${dev.accent}, #fbbf24, ${dev.accent}88, #E0421F, ${dev.accent})`,
        backgroundSize: "300% 300%",
        animation: "photoGlowBorder 3s ease infinite",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      {/* Photo container */}
      <div style={{
        width: 220,
        height: 270,
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
        boxShadow: `0 0 30px ${dev.accent}88, 0 0 60px ${dev.accent}44`,
      }}>
        <img
          src={dev.photo}
          alt={dev.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
        />
        {/* Bottom name overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "32px 14px 14px",
          background: `linear-gradient(to top, ${dev.accent}ee 0%, transparent 100%)`,
        }}>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: "#fff", lineHeight: 1.2 }}>{dev.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", marginTop: 2 }}>{dev.role}</div>
        </div>
      </div>
    </div>
  );
}

/* ── AK Glow Logo (fallback for non-photo devs) ─────────────────── */
function DevGlowLogo({ initials, accent, size = 110 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: -20, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}55 0%, ${accent}22 45%, transparent 72%)`,
        animation: "akGlow 3s ease-in-out infinite alternate", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: -6, borderRadius: "50%",
        border: `2px dashed ${accent}50`, animation: "spin 8s linear infinite", pointerEvents: "none",
      }} />
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${accent} 0%, #E0421F 55%, #c2410c 100%)`,
        display: "grid", placeItems: "center",
        fontFamily: "Sora", fontWeight: 800, fontSize: size * 0.3, color: "#fff",
        boxShadow: `0 0 0 4px rgba(255,255,255,.15), 0 8px 40px ${accent}88, 0 0 80px ${accent}44`,
        position: "relative", zIndex: 1, userSelect: "none",
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
        boxShadow: "0 0 24px rgba(255,255,255,0.25)",
        flexShrink: 0,
      }}>
        <img src={dev.photo} alt={dev.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div style={{
      width: 92, height: 92, borderRadius: "50%",
      background: "rgba(255,255,255,.18)", border: "2px solid rgba(255,255,255,.5)",
      display: "grid", placeItems: "center", fontFamily: "Sora", fontWeight: 800, fontSize: 30,
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
      <section className="warm-page-header" style={{ padding: "52px 0 60px" }}>
        {/* Background glow blobs */}
        <div style={{ position: "absolute", top: -80, right: -40, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${dev.accent}25 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, rgba(244,162,97,.18) 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: "40%", left: "30%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, rgba(244,123,32,.14) 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <button onClick={() => nav(-1)} className="btn btn-ghost" style={{ marginBottom: 28, color: "#fff" }}>
            <ArrowLeft size={16} /> Back
          </button>

          {/* Two-column layout: left = info, right = photo/logo */}
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
              <span className="eyebrow" style={{ marginBottom: 16 }}>
                <Sparkles size={12} /> Team College Parichay · {dev.role.split("&")[0].trim()}
              </span>

              <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,3rem)", margin: "0 0 8px", letterSpacing: "-0.5px", color: "#1c1c28" }}>
                {dev.name}
              </h1>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {dev.role
                  .split(/\s*(?:&|\band\b|,|\/)\s*/i)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((p, i) => (
                    <motion.span
                      key={p}
                      className="role-chip"
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.12, type: "spring", bounce: 0.5 }}
                      style={{
                        background: `linear-gradient(135deg, ${dev.accent}, #fbbf24)`,
                        boxShadow: `0 5px 18px ${dev.accent}66, inset 0 1px 0 rgba(255,255,255,.35)`,
                      }}
                    >
                      <Sparkles size={12} /> {p}
                    </motion.span>
                  ))}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
                <div style={{ color: "rgba(28,28,40,.65)", display: "flex", alignItems: "center", gap: 5, fontSize: 13.5 }}>
                  <MapPin size={14} color="#F15A38" /> {dev.location}
                </div>
                {dev.jeeRank && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(244,123,32,.12)",
                    border: `1px solid rgba(244,123,32,.38)`,
                    borderRadius: 99, padding: "4px 14px",
                    fontSize: 13, fontWeight: 600, color: "#c75b0a",
                    boxShadow: `0 0 14px rgba(244,123,32,.2)`,
                    animation: "rankGlow 2s ease-in-out infinite alternate",
                  }}>
                    🏆 {dev.jeeRank} · {dev.exam}
                  </div>
                )}
                {dev.college && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: `rgba(244,123,32,.12)`,
                    border: `1px solid rgba(244,123,32,.35)`,
                    borderRadius: 99, padding: "4px 14px",
                    fontSize: 13, fontWeight: 600,
                    color: "#c75b0a",
                    boxShadow: `0 0 14px rgba(244,123,32,.18)`,
                    animation: "rankGlow 2s ease-in-out infinite alternate",
                  }}>
                    🎓 {dev.college}
                  </div>
                )}
              </div>

              <p style={{ color: "rgba(28,28,40,.62)", fontSize: "1.02rem", maxWidth: 560, fontStyle: "italic", lineHeight: 1.7, marginBottom: 22 }}>
                "{dev.tagline}"
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {Object.entries(dev.socials).map(([k, url]) => {
                  const I = ICON[k] || Globe;
                  return (
                    <a key={k} href={url} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 13, textTransform: "capitalize" }}>
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
              {dev.photo ? (
                <SquarePhotoCard dev={dev} />
              ) : (
                <DevGlowLogo initials={dev.initials} accent={dev.accent} size={120} />
              )}

              {/* Skill chips below logo */}
              {dev.skills && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", maxWidth: 200 }}>
                  {dev.skills.slice(0, 4).map((s) => (
                    <span key={s} style={{
                      padding: "3px 10px", borderRadius: 50,
                      background: "rgba(244,123,32,.1)",
                      border: "1px solid rgba(244,123,32,.25)",
                      fontSize: 11, color: "#c2540a", fontWeight: 600,
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