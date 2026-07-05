import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Github, Linkedin, Dribbble, Globe, Instagram, MessageCircle,
  Mail, MapPin, Sparkles, ExternalLink,
} from "lucide-react";
import { TEAM_BY_ID } from "../data/team.js";
import Reveal from "../components/Reveal.jsx";
import Seo, { SITE_URL } from "../components/Seo.jsx";

const ICON = { github: Github, linkedin: Linkedin, dribbble: Dribbble, website: Globe, instagram: Instagram, whatsapp: MessageCircle, email: Mail };
const SOCIAL_LABEL = { website: "Website", email: "Email" };

/* ── Square Photo Card — clean, no glow ─────────────────────────── */
function SquarePhotoCard({ dev }) {
  return (
    <div style={{
      width: 220, height: 270, borderRadius: 18, overflow: "hidden",
      position: "relative", flexShrink: 0,
      border: "1px solid rgba(0,0,0,.08)",
      boxShadow: "0 10px 30px rgba(13,27,62,.12)",
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
        background: "linear-gradient(to top, rgba(13,27,62,.78) 0%, transparent 100%)",
      }}>
        <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: "#fff", lineHeight: 1.2 }}>{dev.name}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", marginTop: 2 }}>{dev.role}</div>
      </div>
    </div>
  );
}

/* ── Initials avatar (fallback for non-photo devs) — clean, no glow ── */
function DevGlowLogo({ initials, accent, size = 110 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${accent} 0%, #E0421F 100%)`,
      display: "grid", placeItems: "center",
      fontFamily: "Sora", fontWeight: 800, fontSize: size * 0.3, color: "#fff",
      boxShadow: "0 8px 24px rgba(13,27,62,.16)",
      flexShrink: 0, userSelect: "none",
    }}>
      {initials}
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
        <Seo title="Profile not found" robots="noindex, follow" path={`/team/${id}`} />
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

  const cleanBio = (dev.bio || dev.tagline || "").replace(/\s+/g, " ").trim();
  const seoDesc =
    cleanBio.length > 155 ? `${cleanBio.slice(0, 152).trimEnd()}…` : cleanBio;
  const socialUrls = Object.values(dev.socials || {}).filter(Boolean);
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: dev.name,
    jobTitle: dev.role,
    description: cleanBio || undefined,
    url: `${SITE_URL}/team/${dev.id}`,
    ...(dev.photo ? { image: `${SITE_URL}${dev.photo}` } : {}),
    worksFor: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    ...(dev.college
      ? { alumniOf: { "@type": "CollegeOrUniversity", name: dev.college } }
      : {}),
    ...(socialUrls.length ? { sameAs: socialUrls } : {}),
  };

  return (
    <div className="page">
      <Seo
        title={`${dev.name} — ${dev.role} at CollegeParichay`}
        description={seoDesc}
        path={`/team/${dev.id}`}
        type="profile"
        image={dev.photo ? `${SITE_URL}${dev.photo}` : undefined}
        jsonLd={personSchema}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: dev.name, path: `/team/${dev.id}` },
        ]}
      />
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="warm-page-header" style={{ padding: "52px 0 60px" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <button onClick={() => nav(-1)} className="cp-back-btn" style={{ marginBottom: 28 }}>
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
              <span className="eyebrow" style={{ marginBottom: 16, background: "#f3f4f6", color: "#6b7280", border: "1px solid #e5e7eb" }}>
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
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.12, type: "spring", bounce: 0.5 }}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "6px 15px", borderRadius: 50,
                        fontFamily: "Sora", fontSize: 12.5, fontWeight: 800, letterSpacing: ".3px",
                        color: "#fff", whiteSpace: "nowrap",
                        background: `linear-gradient(135deg, ${dev.accent}, #fbbf24)`,
                      }}
                    >
                      <Sparkles size={12} /> {p}
                    </motion.span>
                  ))}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                <div style={{ color: "rgba(28,28,40,.6)", display: "flex", alignItems: "center", gap: 5, fontSize: 13.5 }}>
                  <MapPin size={14} color="#9ca3af" /> {dev.location}
                </div>
                {dev.jeeRank && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "#f3f4f6", border: "1px solid #e5e7eb",
                    borderRadius: 99, padding: "4px 14px",
                    fontSize: 13, fontWeight: 600, color: "#374151",
                  }}>
                    🏆 {dev.jeeRank} · {dev.exam}
                  </div>
                )}
                {dev.college && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "#f3f4f6", border: "1px solid #e5e7eb",
                    borderRadius: 99, padding: "4px 14px",
                    fontSize: 13, fontWeight: 600, color: "#374151",
                  }}>
                    🎓 {dev.college}
                  </div>
                )}
              </div>

              <p style={{ color: "rgba(28,28,40,.62)", fontSize: "1.02rem", maxWidth: 560, fontStyle: "italic", lineHeight: 1.7, marginBottom: 18 }}>
                "{dev.tagline}"
              </p>

              {/* All connect links in one simple card — uniform clickable buttons */}
              <div style={{
                background: "#fff", border: "1px solid #ececec", borderRadius: 16,
                padding: "16px 18px", boxShadow: "0 6px 20px rgba(13,27,62,.06)", maxWidth: 560,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 12 }}>
                  Connect
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {[...Object.entries(dev.socials), ...(dev.email ? [["email", `mailto:${dev.email}`]] : [])].map(([k, url]) => {
                    const I = ICON[k] || Globe;
                    const label = SOCIAL_LABEL[k] || k.charAt(0).toUpperCase() + k.slice(1);
                    const external = !url.startsWith("mailto:");
                    return (
                      <a key={k} href={url} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 7,
                          padding: "9px 16px", borderRadius: 10,
                          background: "#f8f8fa", border: "1px solid #e5e7eb",
                          color: "#1c1c28", fontSize: 13, fontWeight: 600, fontFamily: "Sora",
                          textDecoration: "none", transition: "background .15s, border-color .15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f1f4"; e.currentTarget.style.borderColor = "#d8d8de"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#f8f8fa"; e.currentTarget.style.borderColor = "#e5e7eb"; }}>
                        <I size={15} color="#6b7280" /> {label}
                      </a>
                    );
                  })}
                </div>
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
                      background: "#f3f4f6",
                      border: "1px solid #e5e7eb",
                      fontSize: 11, color: "#6b7280", fontWeight: 600,
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