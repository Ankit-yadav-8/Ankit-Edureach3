import { Target, Users, ShieldCheck, Mail, Phone, GraduationCap, Heart, Lightbulb, Linkedin, Github, MapPin, Quote, Trophy, Code2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { COLLEGES } from "../data/colleges.js";
import { EXAMS } from "../data/exams.js";
import useCountUp from "../utils/useCountUp.js";
import Reveal from "../components/Reveal.jsx";

/* ─── Team ──────────────────────────────────────────────────────── */
const TEAM = [
  {
    initials: "AK",
    photo: null,
    name: "Ankit Kumar",
    role: "Project Lead & Full-Stack Developer",
    accent: "#f97316",
    edu: "B.Tech Electrical Engineering, IIT Roorkee",
    jeeRank: "AIR 4846 · JEE Advanced",
    bio: "Ankit secured AIR 4846 in JEE Advanced and leads the full-stack development of Collegeparichay — from React frontend and component architecture to backend APIs, database modelling and deployment pipelines. Having personally lived through the chaos of JoSAA counselling rounds, he built the platform he wished had existed for every aspirant.",
    socials: {
      linkedin: "https://www.linkedin.com/in/ankit-kumar-1b9a64387",
      github: "https://github.com",
    },
    isHead: true,
  },
  {
    initials: "TH",
    name: "Rohit Singh",
    role: "Co-founder & Tech Head",
    accent: "#0ea5a4",
    edu: "B.Tech, IIT Roorkee",
    bio: "Rohit builds the predictors, data pipelines and the platform itself. He's obsessed with turning scattered cutoff data into clear, trustworthy answers.",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" },
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    t: "Honest, not hype",
    d: "Real data and clear caveats. We tell you when a number is an estimate — never fake certainty.",
  },
  {
    icon: Heart,
    t: "Student-first",
    d: "Built by people who were students yesterday. Every feature answers a question we once had.",
  },
  {
    icon: Lightbulb,
    t: "Clarity over clutter",
    d: "Clean, simple, fast. Counselling is stressful enough without a confusing website.",
  },
];

/* ─── Stat ───────────────────────────────────────────────────────── */
function Stat({ target, suffix, label }) {
  const [ref, val] = useCountUp(target);
  return (
    <div ref={ref} className="card" style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "Sora",
          fontWeight: 800,
          fontSize: "2rem",
          color: "var(--coral)",
        }}
      >
        {val.toLocaleString("en-IN")}
        {suffix}
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

const ICON = { linkedin: Linkedin, github: Github };

/* ─── AK Glow Logo ───────────────────────────────────────────────── */
function AKGlowLogo({ initials, accent, size = 120 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Outer glow ring */}
      <div style={{
        position: "absolute",
        inset: -12,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}40 0%, ${accent}18 50%, transparent 75%)`,
        animation: "akGlow 3s ease-in-out infinite alternate",
      }} />
      {/* Middle ring */}
      <div style={{
        position: "absolute",
        inset: -4,
        borderRadius: "50%",
        border: `2px solid ${accent}44`,
        animation: "akRing 3s ease-in-out infinite",
      }} />
      {/* Main logo circle */}
      <div style={{
        width: size, height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${accent} 0%, #ea580c 60%, #c2410c 100%)`,
        display: "grid", placeItems: "center",
        fontFamily: "Sora", fontWeight: 800,
        fontSize: size * 0.3, color: "#fff",
        letterSpacing: "-1px",
        boxShadow: `0 0 0 3px ${accent}33, 0 8px 32px ${accent}66, 0 0 60px ${accent}33`,
        position: "relative", zIndex: 1,
        userSelect: "none",
      }}>
        {initials}
      </div>
    </div>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ member, size = 64 }) {
  const fontSize = size * 0.34;
  if (member.photo) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
        border: `3px solid ${member.accent}`,
        boxShadow: `0 0 14px ${member.accent}55`,
      }}>
        <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${member.accent}, #fb923c)`,
      color: "#fff", display: "grid", placeItems: "center",
      fontFamily: "Sora", fontWeight: 800, fontSize: fontSize, flexShrink: 0,
      boxShadow: `0 0 20px ${member.accent}55`,
    }}>
      {member.initials}
    </div>
  );
}

/* ─── About page ─────────────────────────────────────────────────── */
export default function About() {
  return (
    <div className="page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg,#fff7f0,#ffe8d6)",
          color: "var(--ink)",
          padding: "104px 0 56px",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ color: "var(--coral)" }}>
            About EduReach
          </span>
          <h1
            style={{
              fontFamily: "Sora",
              fontWeight: 800,
              fontSize: "clamp(1.9rem,4vw,2.8rem)",
              margin: "12px 0 10px",
            }}
          >
            Made by students who've been exactly where you are
          </h1>
          <p
            style={{
              color: "var(--muted)",
              maxWidth: 660,
              margin: "0 auto",
              fontSize: "1.08rem",
              lineHeight: 1.6,
            }}
          >
            EduReach brings rank prediction, college discovery and counselling
            guidance into one clean, honest, student-first platform.
          </p>
        </div>
      </section>

      {/* ── Our story ───────────────────────────────────────────── */}
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <div
            className="title-bar"
            style={{ textAlign: "left", alignItems: "flex-start" }}
          >
            <span className="eyebrow">Our story</span>
            <h2
              className="section-title"
              style={{ textAlign: "left" }}
            >
              It started in an IIT Roorkee hostel room
            </h2>
          </div>
          <div
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <p>
              A few years ago, sitting in a hostel room at{" "}
              <strong>IIT Roorkee</strong>, we were remembering how stressful
              our own JEE counselling had been. Endless browser tabs, outdated
              cutoff PDFs, WhatsApp forwards, and a constant fear:{" "}
              <em>
                "what if I fill my choices wrong and lose a seat I deserved?"
              </em>
            </p>
            <p>
              We realised the information existed — it was just scattered,
              confusing and often wrong. Students from small towns, without
              seniors to guide them, were at a real disadvantage. That didn't
              sit right with us.
            </p>
            <p>
              So we built <strong>EduReach</strong>: a place where any student
              can predict their rank, explore every IIT, NIT and IIIT with real
              data, and fill their JoSAA choices with confidence instead of
              guesswork. No hype, no fake promises — just the clarity we wish
              we'd had.
            </p>
          </div>
          <div
            className="card"
            style={{
              marginTop: 26,
              borderLeft: "4px solid var(--coral)",
              display: "flex",
              gap: 14,
            }}
          >
            <Quote size={28} color="var(--coral)" style={{ flexShrink: 0 }} />
            <p
              style={{
                fontStyle: "italic",
                color: "var(--navy)",
                fontSize: "1.05rem",
                lineHeight: 1.6,
              }}
            >
              "We're not a faceless portal. We're engineers who lived this chaos
              and decided to fix it for the next student."
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <section className="section section--sky">
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">By the numbers</span>
            <h2 className="section-title">What we've built so far</h2>
          </div>
          <div className="grid-4">
            <Stat target={COLLEGES.length} suffix="+" label="Colleges profiled" />
            <Stat target={EXAMS.length} suffix="" label="Entrance exams tracked" />
            <Stat target={2000} suffix="+" label="Students guided" />
            <Stat target={5} suffix="-yr" label="Cutoff history" />
          </div>
        </div>
      </section>

      {/* ── Team ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">The team</span>
            <h2 className="section-title">Who's behind EduReach</h2>
            <p className="section-sub">
              A small team from IIT Roorkee, building the tool we needed.
            </p>
          </div>

          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* ── Team Head — special wide card ── */}
            {TEAM.filter((m) => m.isHead).map((m) => (
              <Reveal key={m.name}>
                <motion.div
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    border: `1px solid rgba(0,0,0,.08)`,
                    borderTop: `4px solid ${m.accent}`,
                    boxShadow: "0 4px 32px rgba(28,28,40,.08)",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 0,
                  }}
                >
                  {/* Left — text content */}
                  <div style={{ padding: "28px 28px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Leader badge */}
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: `${m.accent}15`, color: m.accent,
                      border: `1px solid ${m.accent}30`,
                      padding: "4px 14px", borderRadius: 50,
                      fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
                      textTransform: "uppercase", alignSelf: "flex-start",
                    }}>
                      <Trophy size={11} /> Project Lead
                    </span>

                    {/* Name + role */}
                    <div>
                      <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.5rem", color: "#1c1c28", marginBottom: 4 }}>
                        {m.name}
                      </h3>
                      <div style={{ color: m.accent, fontWeight: 600, fontSize: 14.5 }}>{m.role}</div>
                    </div>

                    {/* Meta */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#6b7280" }}>
                        <GraduationCap size={14} color={m.accent} /> {m.edu}
                      </div>
                      {m.jeeRank && (
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          background: `${m.accent}12`, color: m.accent,
                          padding: "3px 12px", borderRadius: 50,
                          fontSize: 12.5, fontWeight: 700,
                        }}>
                          🏆 {m.jeeRank}
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: 14 }}>{m.bio}</p>

                    {/* Socials */}
                    <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                      {Object.entries(m.socials).map(([k, url]) => {
                        const I = ICON[k] || Linkedin;
                        return (
                          <a key={k} href={url} target="_blank" rel="noreferrer" aria-label={k} style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "7px 14px", borderRadius: 50,
                            background: "#f3f4f6", border: "1px solid #e5e7eb",
                            color: "#374151", fontSize: 12.5, fontWeight: 600,
                            textDecoration: "none", textTransform: "capitalize", transition: "all .2s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = m.accent; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = m.accent; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                          >
                            <I size={14} /> {k}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right — AK logo with glow */}
                  <div style={{
                    width: 200,
                    background: `linear-gradient(135deg, #1c1c28 0%, #2a1a0e 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}>
                    {/* Ambient glow blobs */}
                    <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, ${m.accent}44 0%, transparent 70%)`, pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${m.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />

                    {/* Skills floating badges */}
                    <div style={{ position: "absolute", top: 18, left: 12, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "4px 8px", fontSize: 10, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>React</div>
                    <div style={{ position: "absolute", top: 44, right: 10, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "4px 8px", fontSize: 10, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>Node.js</div>
                    <div style={{ position: "absolute", bottom: 44, left: 10, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "4px 8px", fontSize: 10, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>MongoDB</div>
                    <div style={{ position: "absolute", bottom: 18, right: 14, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "4px 8px", fontSize: 10, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>IIT-R</div>

                    {/* AK Logo */}
                    <AKGlowLogo initials={m.initials} accent={m.accent} size={96} />
                  </div>
                </motion.div>
              </Reveal>
            ))}

            {/* ── Other team members ── */}
            <div className="grid-2" style={{ gap: 20 }}>
              {TEAM.filter((m) => !m.isHead).map((m, i) => (
                <Reveal key={m.name} delay={i * 0.08}>
                  <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12, borderTop: `3px solid ${m.accent}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <Avatar member={m} size={56} />
                      <div>
                        <h3 style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)" }}>{m.name}</h3>
                        <div style={{ color: m.accent, fontWeight: 600, fontSize: 13.5 }}>{m.role}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}><GraduationCap size={12} style={{ display: "inline", marginRight: 4 }} />{m.edu}</div>
                      </div>
                    </div>
                    <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: 14 }}>{m.bio}</p>
                    <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                      {Object.entries(m.socials).map(([k, url]) => {
                        const I = ICON[k] || Linkedin;
                        return (
                          <a key={k} href={url} target="_blank" rel="noreferrer" aria-label={k} style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--sky)", border: "1px solid var(--line)", color: "var(--navy)" }}>
                            <I size={16} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────────── */}
      <section className="section section--sky">
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">What we stand for</span>
            <h2 className="section-title">Our values</h2>
          </div>
          <div className="grid-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.07}>
                <div className="card" style={{ height: "100%" }}>
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(249,115,22,.12)",
                    }}
                  >
                    <v.icon size={22} color="var(--coral)" />
                  </span>
                  <h3
                    style={{
                      fontFamily: "Sora",
                      fontWeight: 700,
                      margin: "12px 0 6px",
                      color: "var(--navy)",
                    }}
                  >
                    {v.t}
                  </h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                    {v.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ─────────────────────────────────────────── */}
      <section className="section" id="contact">
        <div className="container">
          <div
            className="card"
            style={{
              textAlign: "center",
              background: "linear-gradient(135deg,#fff,var(--sky))",
              padding: 40,
            }}
          >
            <h2
              style={{
                fontFamily: "Sora",
                fontWeight: 800,
                fontSize: "1.6rem",
                color: "var(--navy)",
                marginBottom: 8,
              }}
            >
              Have a question? Talk to us.
            </h2>
            <p style={{ color: "var(--muted)", marginBottom: 20 }}>
              We reply personally — no call centres, no bots that dodge you.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="mailto:hello@edureachportal.in"
                className="btn btn-coral"
              >
                <Mail size={16} /> hello@edureachportal.in
              </a>
              <a href="tel:+918118826194" className="btn btn-ghost">
                <Phone size={16} /> +91-8118826194
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}