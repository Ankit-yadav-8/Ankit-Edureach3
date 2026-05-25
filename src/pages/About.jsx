import { Target, Users, ShieldCheck, Mail, Phone, GraduationCap, Heart, Lightbulb, Linkedin, Github, MapPin, Quote } from "lucide-react";
import { COLLEGES } from "../data/colleges.js";
import { EXAMS } from "../data/exams.js";
import useCountUp from "../utils/useCountUp.js";
import Reveal from "../components/Reveal.jsx";

/* 👉 Edit names, photos, bios and links below to your real team. */
const TEAM = [
  {
    initials: "AF", name: "Aryan Verma", role: "Founder & CEO", accent: "#f97316",
    edu: "B.Tech, IIT Roorkee",
    bio: "Aryan navigated JEE counselling the hard way — armed with messy spreadsheets and conflicting advice. He started EduReach so no student has to feel that lost again.",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" },
  },
  {
    initials: "TH", name: "Rohit Singh", role: "Co-founder & Tech Head", accent: "#0ea5a4",
    edu: "B.Tech, IIT Roorkee",
    bio: "Rohit builds the predictors, data pipelines and the platform itself. He's obsessed with turning scattered cutoff data into clear, trustworthy answers.",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" },
  },
];

const VALUES = [
  { icon: ShieldCheck, t: "Honest, not hype", d: "Real data and clear caveats. We tell you when a number is an estimate — never fake certainty." },
  { icon: Heart, t: "Student-first", d: "Built by people who were students yesterday. Every feature answers a question we once had." },
  { icon: Lightbulb, t: "Clarity over clutter", d: "Clean, simple, fast. Counselling is stressful enough without a confusing website." },
];

function Stat({ target, suffix, label }) {
  const [ref, val] = useCountUp(target);
  return (
    <div ref={ref} className="card" style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "2rem", color: "var(--coral)" }}>{val.toLocaleString("en-IN")}{suffix}</div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

const ICON = { linkedin: Linkedin, github: Github };

export default function About() {
  return (
    <div className="page">
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#fff7f0,#ffe8d6)", color: "var(--ink)", padding: "104px 0 56px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ color: "var(--coral)" }}>About EduReach</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.8rem)", margin: "12px 0 10px" }}>Made by students who've been exactly where you are</h1>
          <p style={{ color: "var(--muted)", maxWidth: 660, margin: "0 auto", fontSize: "1.08rem", lineHeight: 1.6 }}>
            EduReach brings rank prediction, college discovery and counselling guidance into one clean, honest, student-first platform.
          </p>
        </div>
      </section>

      {/* Our story */}
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="title-bar" style={{ textAlign: "left", alignItems: "flex-start" }}>
            <span className="eyebrow">Our story</span>
            <h2 className="section-title" style={{ textAlign: "left" }}>It started in an IIT Roorkee hostel room</h2>
          </div>
          <div style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--ink)", display: "flex", flexDirection: "column", gap: 16 }}>
            <p>A few years ago, two of us were sitting in a hostel room at <strong>IIT Roorkee</strong>, remembering how stressful our own JEE counselling had been. Endless browser tabs, outdated cutoff PDFs, WhatsApp forwards, and a constant fear: <em>"what if I fill my choices wrong and lose a seat I deserved?"</em></p>
            <p>We realised the information existed — it was just scattered, confusing and often wrong. Students from small towns, without seniors to guide them, were at a real disadvantage. That didn't sit right with us.</p>
            <p>So we built <strong>EduReach</strong>: a place where any student can predict their rank, explore every IIT, NIT and IIIT with real data, and fill their JoSAA choices with confidence instead of guesswork. No hype, no fake promises — just the clarity we wish we'd had.</p>
          </div>
          <div className="card" style={{ marginTop: 26, borderLeft: "4px solid var(--coral)", display: "flex", gap: 14 }}>
            <Quote size={28} color="var(--coral)" style={{ flexShrink: 0 }} />
            <p style={{ fontStyle: "italic", color: "var(--navy)", fontSize: "1.05rem", lineHeight: 1.6 }}>
              "We're not a faceless portal. We're engineers who lived this chaos and decided to fix it for the next student."
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section--sky">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">By the numbers</span><h2 className="section-title">What we've built so far</h2></div>
          <div className="grid-4">
            <Stat target={COLLEGES.length} suffix="+" label="Colleges profiled" />
            <Stat target={EXAMS.length} suffix="" label="Entrance exams tracked" />
            <Stat target={2000} suffix="+" label="Students guided" />
            <Stat target={5} suffix="-yr" label="Cutoff history" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">The team</span><h2 className="section-title">Who's behind EduReach</h2><p className="section-sub">A small team from IIT Roorkee, building the tool we needed.</p></div>
          <div className="grid-2" style={{ maxWidth: 820, margin: "0 auto", gap: 22 }}>
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12, borderTop: `3px solid ${m.accent}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg,${m.accent},#fb923c)`, color: "#fff", display: "grid", placeItems: "center", fontFamily: "Sora", fontWeight: 800, fontSize: 22 }}>{m.initials}</div>
                    <div>
                      <h3 style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)" }}>{m.name}</h3>
                      <div style={{ color: m.accent, fontWeight: 600, fontSize: 14 }}>{m.role}</div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><GraduationCap size={13} /> {m.edu}</div>
                    </div>
                  </div>
                  <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>{m.bio}</p>
                  <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                    {Object.entries(m.socials).map(([k, url]) => {
                      const I = ICON[k] || Linkedin;
                      return <a key={k} href={url} target="_blank" rel="noreferrer" aria-label={k} style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--sky)", border: "1px solid var(--line)", color: "var(--navy)" }}><I size={16} /></a>;
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--sky">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">What we stand for</span><h2 className="section-title">Our values</h2></div>
          <div className="grid-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.07}>
                <div className="card" style={{ height: "100%" }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(249,115,22,.12)" }}><v.icon size={22} color="var(--coral)" /></span>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, margin: "12px 0 6px", color: "var(--navy)" }}>{v.t}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section" id="contact">
        <div className="container">
          <div className="card" style={{ textAlign: "center", background: "linear-gradient(135deg,#fff,var(--sky))", padding: 40 }}>
            <h2 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.6rem", color: "var(--navy)", marginBottom: 8 }}>Have a question? Talk to us.</h2>
            <p style={{ color: "var(--muted)", marginBottom: 20 }}>We reply personally — no call centres, no bots that dodge you.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:hello@edureachportal.in" className="btn btn-coral"><Mail size={16} /> hello@edureachportal.in</a>
              <a href="tel:+910000000000" className="btn btn-ghost"><Phone size={16} /> +91-XXXXXXXXXX</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
