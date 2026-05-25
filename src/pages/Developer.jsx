import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Github, Linkedin, Dribbble, Globe, Mail, MapPin, Sparkles, ExternalLink } from "lucide-react";
import { TEAM_BY_ID } from "../data/team.js";
import Reveal from "../components/Reveal.jsx";

const ICON = { github: Github, linkedin: Linkedin, dribbble: Dribbble, website: Globe };

export default function Developer() {
  const { id } = useParams();
  const nav = useNavigate();
  const dev = TEAM_BY_ID[id];

  if (!dev) {
    return (
      <div className="page container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h2>Profile not found</h2>
        <Link to="/" className="btn btn-coral" style={{ marginTop: 16 }}>Back home</Link>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${dev.accent}, #1c1c28)`, color: "#fff", padding: "48px 0 56px" }}>
        <div className="container">
          <button onClick={() => nav(-1)} className="btn btn-light" style={{ marginBottom: 22 }}><ArrowLeft size={16} /> Back</button>
          <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 92, height: 92, borderRadius: "50%", background: "rgba(255,255,255,.18)", border: "2px solid rgba(255,255,255,.5)", display: "grid", placeItems: "center", fontFamily: "Sora", fontWeight: 800, fontSize: 30 }}>
              {dev.initials}
            </div>
            <div>
              <span className="badge" style={{ background: "rgba(255,255,255,.16)", color: "#fff" }}><Sparkles size={12} /> Team EduReach</span>
              <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "8px 0 4px" }}>{dev.name}</h1>
              <div style={{ color: "rgba(255,255,255,.85)", fontWeight: 600 }}>{dev.role}</div>
              <div style={{ color: "rgba(255,255,255,.7)", display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 14 }}>
                <MapPin size={14} /> {dev.location}
              </div>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,.9)", fontSize: "1.05rem", marginTop: 18, maxWidth: 620, fontStyle: "italic" }}>“{dev.tagline}”</p>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {Object.entries(dev.socials).map(([k, url]) => {
              const I = ICON[k] || Globe;
              return (
                <a key={k} href={url} target="_blank" rel="noreferrer" className="btn btn-light" style={{ fontSize: 13, textTransform: "capitalize" }}>
                  <I size={15} /> {k}
                </a>
              );
            })}
            <a href={`mailto:${dev.email}`} className="btn btn-coral" style={{ fontSize: 13 }}><Mail size={15} /> Email</a>
          </div>
        </div>
      </section>

      <div className="container section" style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <Reveal>
          <div className="card">
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>About</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{dev.bio}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {dev.skills.map((s) => (
                <span key={s} className="pill" style={{ background: "var(--sky)", border: "1px solid var(--line)", color: "var(--navy)" }}>{s}</span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 14 }}>Featured work</h3>
            <div className="grid-3">
              {dev.projects.map((p, i) => (
                <div key={i} className="card" style={{ height: "100%", borderTop: `3px solid ${dev.accent}` }}>
                  <span className="badge" style={{ background: `${dev.accent}1a`, color: dev.accent }}>{p.tag}</span>
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, margin: "10px 0 6px" }}>{p.name}</h4>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="card" style={{ textAlign: "center", background: "linear-gradient(135deg,#fff,var(--sky))" }}>
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 6 }}>Want to work together?</h3>
            <p style={{ color: "var(--muted)", marginBottom: 14 }}>Reach out — always happy to chat about projects and ideas.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={`mailto:${dev.email}`} className="btn btn-coral"><Mail size={15} /> {dev.email}</a>
              {dev.socials.website && <a href={dev.socials.website} target="_blank" rel="noreferrer" className="btn btn-ghost">Visit website <ExternalLink size={14} /></a>}
            </div>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14 }}>This is a demo portfolio page. Edit src/data/team.js to add the real profile.</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
