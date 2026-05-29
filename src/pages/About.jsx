import {
  ShieldCheck, Mail, Phone, GraduationCap, Heart, Lightbulb,
  Linkedin, Github, MapPin, Quote, Trophy,
  Code2, Zap, Users, MessageCircle, Globe,
  Sparkles, Star, ArrowRight, CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { COLLEGES } from "../data/colleges.js";
import { EXAMS } from "../data/exams.js";
import useCountUp from "../utils/useCountUp.js";
import Reveal from "../components/Reveal.jsx";

/* ── Social constants ──────────────────────────────────────── */
const LK = "https://www.linkedin.com/in/ankityadavpm/";
const IG = "https://www.instagram.com/ankits_yadavv?igsh=aTF0NnU5bDJxN2F5&utm_source=qr";
const WA = "https://chat.whatsapp.com/EKezcNXEw9iKRdo7Wrjzzx?mode=gi_t";

/* ── Inline SVG brand icons (lucide 0.408 removed brand icons) */
function IgIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function WaIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

/* ── Founders data ─────────────────────────────────────────── */
const FOUNDERS = [
  {
    name: "Ankit Yadav",
    initials: "AY",
    photo: "/assets/team/ankit2.png",
    role: "Founder & CEO",
    accent: "#F47B20",
    edu: "B.Tech Electrical Engineering, IIT Roorkee",
    jeeRank: "AIR 4846 · JEE Advanced",
    bio: "Hi, I'm Ankit Yadav, an IIT Roorkee graduate and the founder of College Parichay — a platform built to make college guidance simpler, clearer, and more accessible for students across India. During my own journey, I saw how confusing the college and career decision process can be. That experience inspired me to create College Parichay with one simple belief: \"Students need clarity, not confusion.\" Through authentic insights, relatable experiences, and a community-driven approach, we aim to help students make informed decisions with confidence.",
    skills: ["Product Strategy", "React", "System Design", "Leadership", "Data Analysis", "UX"],
    socials: { linkedin: LK, instagram: IG, whatsapp: WA },
  },
  {
    name: "Ankit Kumar",
    initials: "AK",
    photo: "/assets/team/ankit.jpeg",
    role: "Co-Founder & CTO",
    accent: "#F47B20",
    edu: "B.Tech, IIT Roorkee",
    bio: "Hi, I'm Ankit Kumar, Co-Founder & CTO of College Parichay and an IIT Roorkee engineer. I lead all technical development on the platform — from the React frontend and data pipelines to backend APIs and deployment. Like every student who has used this platform, I experienced firsthand how overwhelming the college admission process can be. Building College Parichay is my way of putting engineering skills to work for something that truly matters. One mission: helping every student make confident, data-driven decisions.",
    skills: ["React", "Node.js", "MongoDB", "Express", "Python", "REST APIs"],
    socials: { linkedin: LK, instagram: IG, whatsapp: WA },
  },
];

/* ── Values ────────────────────────────────────────────────── */
const VALUES = [
  { icon: ShieldCheck, color: "#F47B20", t: "Honest, not hype",     d: "Real data and clear caveats. We tell you when a number is an estimate — never fake certainty." },
  { icon: Heart,       color: "#EC4899", t: "Student-first always", d: "Built by people who were students yesterday. Every feature answers a question we once had." },
  { icon: Lightbulb,   color: "#EAB308", t: "Clarity over clutter", d: "Clean, simple, fast. Counselling is stressful enough without a confusing website." },
  { icon: Code2,       color: "#7C3AED", t: "Data-driven",          d: "Every predictor and cutoff is backed by verified JoSAA & NTA data from 2019–2025." },
  { icon: Users,       color: "#0EA5A4", t: "Open to everyone",     d: "Free for all students. No paywalls, no subscriptions. Knowledge should be accessible." },
  { icon: Zap,         color: "#15A06E", t: "Built to evolve",      d: "We ship improvements every week. Your feedback directly shapes the next feature." },
];

/* ── Story timeline ────────────────────────────────────────── */
const TIMELINE = [
  {
    year: "2023", icon: "💡", color: "#F47B20",
    title: "The Frustration That Started It All",
    content: "Sitting in a hostel room at IIT Roorkee after JoSAA round 1, we watched a batchmate nearly lose his preferred branch because of bad information — outdated cutoff PDFs, contradictory WhatsApp forwards, and no clear way to compare options. That moment became the spark.",
  },
  {
    year: "Early 2024", icon: "🏗️", color: "#7C3AED",
    title: "Building in the Hostel Room",
    content: "We began building College Parichay right in our IIT Roorkee hostel, coding late into the night between classes and exams. The first version was a simple rank-to-college matcher. We shared it in JEE WhatsApp groups and got 500+ users within the first week.",
  },
  {
    year: "Mid 2024", icon: "📊", color: "#0EA5A4",
    title: "Solving the Data Problem",
    content: "We scraped, cleaned and structured 7 years of JoSAA cutoff data across 800+ colleges, 5000+ branches and 6 categories. Building the predictor engine was the hardest challenge — handling NTA percentile rounding, fresh allocation vs. spot rounds, and edge cases for new IITs.",
  },
  {
    year: "2025", icon: "🚀", color: "#EC4899",
    title: "Official Launch & Student Impact",
    content: "College Parichay officially launched with rank predictors for JEE Main & Advanced, a college explorer, JoSAA counselling planner, and the comparison tool. Thousands of students used it for their choice-filling. Messages poured in from students who avoided costly mistakes thanks to our data.",
  },
  {
    year: "2026", icon: "🎯", color: "#15A06E",
    title: "What We're Building Next",
    content: "Expanding to cover NEET, BITSAT, and state counselling — every major technical and medical admission in India. New tools include AI-powered choice-filling strategy, personalised college recommendations, and alumni connect. Our goal: the go-to platform for every Indian student navigating admissions.",
  },
];

/* ── Stat component ────────────────────────────────────────── */
function Stat({ target, suffix, label, color = "#F47B20" }) {
  const [ref, val] = useCountUp(target);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "Sora", fontWeight: 900,
        fontSize: "clamp(2.6rem,5vw,3.8rem)",
        color, lineHeight: 1, marginBottom: 8,
        textShadow: `0 0 40px ${color}66`,
      }}>
        {val.toLocaleString("en-IN")}{suffix}
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,.6)", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

/* ── Square founder photo ──────────────────────────────────── */
function FounderPhoto({ founder }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: -3, borderRadius: 20, zIndex: 0,
        background: `linear-gradient(135deg, ${founder.accent}, #fbbf24, ${founder.accent}88, #ea580c, ${founder.accent})`,
        backgroundSize: "300% 300%",
        animation: "aboutGlow 3s ease infinite",
      }} />
      <div style={{
        width: 200, height: 248, borderRadius: 18, overflow: "hidden",
        position: "relative", zIndex: 1,
        boxShadow: `0 0 32px ${founder.accent}88, 0 0 60px ${founder.accent}33`,
      }}>
        <img
          src={founder.photo} alt={founder.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "36px 14px 14px",
          background: `linear-gradient(to top, ${founder.accent}ee 0%, transparent 100%)`,
        }}>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: "#fff", lineHeight: 1.2 }}>{founder.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", marginTop: 2 }}>{founder.role}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Social button for dark sections ──────────────────────── */
function SocialBtn({ href, icon: Icon, label, accent }) {
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 14px", borderRadius: 50,
        background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)",
        color: "rgba(255,255,255,.8)", fontSize: 12, fontWeight: 600,
        textDecoration: "none", transition: "all .2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = accent; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.15)"; }}
    >
      <Icon size={13} /> {label}
    </a>
  );
}

/* ════════════════════════════════════════════════════════════
   Main About Page
════════════════════════════════════════════════════════════ */
export default function About() {
  return (
    <div className="page">
      <style>{`
        @keyframes aboutGlow {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes aboutFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes aboutPulse {
          0%,100% { opacity:.7; transform:scale(1); }
          50%      { opacity:1;  transform:scale(1.04); }
        }
        @keyframes gradText {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .about-social-hero {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 50px;
          font-size: 13px; font-weight: 600; text-decoration: none;
          border: 1px solid rgba(255,255,255,.2);
          color: #fff; background: rgba(255,255,255,.1);
          transition: all .2s; backdrop-filter: blur(4px);
        }
        .about-social-hero:hover {
          background: rgba(255,255,255,.22);
          border-color: rgba(255,255,255,.4);
          transform: translateY(-2px);
        }
        .founder-card-wrap {
          transition: transform .25s, box-shadow .25s;
        }
        .founder-card-wrap:hover {
          transform: translateY(-5px);
          box-shadow: 0 28px 72px rgba(244,123,32,.22) !important;
        }
        .value-card-about {
          transition: transform .2s, box-shadow .2s;
        }
        .value-card-about:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,.1);
        }
        .timeline-dot {
          animation: aboutPulse 2.8s ease-in-out infinite;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HERO — dark dramatic gradient
      ══════════════════════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #0c0c18 0%, #170f28 50%, #0c1828 100%)",
        padding: "110px 0 90px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Ambient glow blobs */}
        <div style={{ position: "absolute", top: -120, right: -80, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.22) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,.18) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", left: "35%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,164,.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,.055) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 22,
              background: "rgba(244,123,32,.18)", border: "1px solid rgba(244,123,32,.35)",
              color: "#fb923c", padding: "6px 20px", borderRadius: 50,
              fontSize: 13, fontWeight: 700, letterSpacing: .5,
            }}>
              <Sparkles size={13} /> About College Parichay
            </span>

            <h1 style={{
              fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 900,
              fontSize: "clamp(2.2rem,5vw,3.6rem)", margin: "0 0 18px",
              letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.15,
            }}>
              Made by students who've been{" "}
              <span style={{
                background: "linear-gradient(90deg,#F47B20,#fbbf24,#fb923c,#F47B20)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", animation: "gradText 3s ease infinite",
              }}>
                exactly where you are
              </span>
            </h1>

            <p style={{ color: "rgba(255,255,255,.62)", maxWidth: 640, margin: "0 auto 36px", fontSize: "1.08rem", lineHeight: 1.75 }}>
              Two engineers from IIT Roorkee who cracked JEE Advanced, lived through the chaos of JoSAA counselling, and built the platform they wished existed. College Parichay brings rank prediction, college discovery and counselling guidance into one clean, student-first platform — completely free.
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={LK} target="_blank" rel="noreferrer" className="about-social-hero">
                <Linkedin size={15} /> LinkedIn
              </a>
              <a href={IG} target="_blank" rel="noreferrer" className="about-social-hero">
                <IgIcon size={15} /> Instagram
              </a>
              <a href={WA} target="_blank" rel="noreferrer" className="about-social-hero">
                <WaIcon size={15} /> WhatsApp
              </a>
              <a href="#contact" className="about-social-hero" style={{ background: "rgba(244,123,32,.22)", borderColor: "rgba(244,123,32,.4)", color: "#fb923c" }}>
                <Mail size={15} /> Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOUNDERS — dark section  (FIRST CONTENT SECTION)
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: "#0d0d1c", padding: "84px 0", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div className="container">
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14,
              background: "rgba(244,123,32,.15)", border: "1px solid rgba(244,123,32,.3)",
              color: "#fb923c", padding: "5px 18px", borderRadius: 50, fontSize: 12, fontWeight: 700, letterSpacing: .5,
            }}>
              <Trophy size={12} /> The Founders
            </span>
            <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 900, fontSize: "clamp(1.9rem,3.5vw,2.7rem)", color: "#fff", margin: "0 0 12px" }}>
              Who's behind College Parichay
            </h2>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
              Two engineers from IIT Roorkee, building the tool every JEE aspirant deserves
            </p>
          </div>

          {/* Founder cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: 28 }}>
            {FOUNDERS.map((f, idx) => (
              <Reveal key={f.name} delay={idx * 0.1}>
                <motion.div
                  className="founder-card-wrap"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,.02) 100%)",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderTop: `4px solid ${f.accent}`,
                    borderRadius: 22,
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    boxShadow: "0 8px 40px rgba(0,0,0,.3)",
                  }}
                >
                  {/* ── Left: text ── */}
                  <div style={{ padding: "28px 26px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start",
                      background: `${f.accent}18`, color: f.accent,
                      border: `1px solid ${f.accent}35`,
                      padding: "4px 14px", borderRadius: 50,
                      fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase",
                    }}>
                      <Trophy size={10} /> {idx === 0 ? "Founder" : "Co-Founder"}
                    </span>

                    <div>
                      <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.45rem", color: "#fff", marginBottom: 4, lineHeight: 1.2 }}>{f.name}</h3>
                      <div style={{ color: f.accent, fontWeight: 600, fontSize: 14 }}>{f.role}</div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,.5)" }}>
                        <GraduationCap size={13} color={f.accent} /> {f.edu}
                      </div>
                      {f.jeeRank && (
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          background: `${f.accent}18`, color: f.accent,
                          padding: "3px 12px", borderRadius: 50,
                          fontSize: 12, fontWeight: 700,
                        }}>
                          🏆 {f.jeeRank}
                        </div>
                      )}
                    </div>

                    <p style={{ color: "rgba(255,255,255,.58)", lineHeight: 1.72, fontSize: 13.5, flex: 1 }}>{f.bio}</p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {f.skills.slice(0, 4).map(s => (
                        <span key={s} style={{
                          padding: "3px 10px", borderRadius: 50, fontSize: 11,
                          background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)",
                          color: "rgba(255,255,255,.72)", fontWeight: 500,
                        }}>{s}</span>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <SocialBtn href={f.socials.linkedin}  icon={Linkedin} label="LinkedIn"  accent={f.accent} />
                      <SocialBtn href={f.socials.instagram} icon={IgIcon}   label="Instagram" accent={f.accent} />
                      <SocialBtn href={f.socials.whatsapp}  icon={WaIcon}   label="WhatsApp"  accent={f.accent} />
                    </div>
                  </div>

                  {/* ── Right: photo column ── */}
                  <div style={{
                    width: 220, flexShrink: 0,
                    background: `linear-gradient(160deg, rgba(244,123,32,.18) 0%, rgba(251,191,36,.1) 60%, rgba(244,123,32,.08) 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden", padding: "20px 16px",
                  }}>
                    {/* Glow blobs */}
                    <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: `radial-gradient(circle, ${f.accent}44 0%, transparent 70%)` }} />
                    <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${f.accent}28 0%, transparent 70%)` }} />

                    {/* Floating skill badges */}
                    {[
                      { text: f.skills[0], pos: { top: 14, left: 8 } },
                      { text: f.skills[1], pos: { top: 46, right: 6 } },
                      { text: f.skills[4] || f.skills[3], pos: { bottom: 46, left: 6 } },
                      { text: f.skills[2], pos: { bottom: 14, right: 8 } },
                    ].map(({ text, pos }) => text && (
                      <div key={text} style={{
                        position: "absolute", ...pos,
                        background: `${f.accent}20`, border: `1px solid ${f.accent}38`,
                        borderRadius: 8, padding: "4px 8px",
                        fontSize: 10, color: f.accent, fontWeight: 700,
                        backdropFilter: "blur(4px)",
                      }}>{text}</div>
                    ))}

                    <FounderPhoto founder={f} />
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          OUR STORY — expanded IIT Roorkee narrative
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "88px 0" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="title-bar" style={{ textAlign: "left", alignItems: "flex-start", marginBottom: 44 }}>
            <span className="eyebrow">Our story</span>
            <h2 className="section-title" style={{ textAlign: "left", maxWidth: 640 }}>
              It started in an IIT Roorkee hostel room
            </h2>
          </div>

          {/* Narrative cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 44 }}>
            {[
              `A few years ago, sitting in a hostel room at IIT Roorkee, we were remembering how stressful our own JEE counselling had been. Endless browser tabs, outdated cutoff PDFs, WhatsApp forwards full of conflicting information, and a constant fear: "what if I fill my choices wrong and lose a seat I deserved?"`,
              `We watched batchmates — bright students who had cracked one of the toughest exams in the world — stumble at the last hurdle simply because the right information wasn't available. Students from small towns without seniors to guide them were at a real disadvantage. That didn't sit right with us.`,
              `IIT Roorkee gave us the technical foundation and the peer environment that pushes you to build real things. We had access to years of JoSAA data, the engineering coursework to build prediction models, and most importantly — the lived experience of going through this process with AIR 4846 in JEE Advanced. We decided to use all of it to build something meaningful.`,
              `Today, College Parichay is used by thousands of students every counselling season. We've structured 7+ years of JoSAA data, built rank predictors for JEE Main and Advanced, a college explorer, a JoSAA planner, and a comparison engine — all from that same hostel room drive to make this process less chaotic for the next student.`,
            ].map((text, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p style={{ fontSize: "1.04rem", lineHeight: 1.82, color: "var(--ink)", margin: 0 }}
                  dangerouslySetInnerHTML={{ __html: text.replace(/"([^"]+)"/g, '<em>"$1"</em>') }} />
              </Reveal>
            ))}
          </div>

          {/* Pull quote */}
          <Reveal>
            <div style={{
              borderLeft: "4px solid #F47B20", borderRadius: "0 14px 14px 0",
              background: "linear-gradient(135deg,#fff8f0,#fff)", padding: "22px 26px",
              display: "flex", gap: 16, marginBottom: 56,
              boxShadow: "0 4px 24px rgba(244,123,32,.1)",
            }}>
              <Quote size={30} color="#F47B20" style={{ flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontStyle: "italic", color: "var(--navy)", fontSize: "1.08rem", lineHeight: 1.68, margin: 0 }}>
                "We're not a faceless portal. We're engineers who lived this chaos and decided to fix it for the next student. Every feature on College Parichay answers a question one of us once had — and found no good answer to."
              </p>
            </div>
          </Reveal>

          {/* Timeline */}
          <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 22, marginBottom: 32, color: "var(--navy)" }}>
            How we built it — from IIT hostel to live platform
          </h3>

          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute", left: 20, top: 0, bottom: 0, width: 2,
              background: "linear-gradient(180deg, #F47B20, #7C3AED, #0EA5A4, #EC4899, #15A06E)",
              borderRadius: 2,
            }} />

            {TIMELINE.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.07}>
                <div style={{ display: "flex", gap: 24, marginBottom: 32, position: "relative" }}>
                  {/* Dot */}
                  <div className="timeline-dot" style={{
                    width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                    background: item.color, display: "grid", placeItems: "center",
                    fontSize: 18, zIndex: 1,
                    boxShadow: `0 0 0 6px ${item.color}20, 0 4px 16px ${item.color}55`,
                  }}>
                    {item.icon}
                  </div>
                  {/* Card */}
                  <div className="card" style={{ flex: 1, borderLeft: `3px solid ${item.color}`, padding: "18px 22px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: item.color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{item.year}</div>
                    <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8, color: "var(--navy)", fontSize: 15 }}>{item.title}</h4>
                    <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.72, margin: 0 }}>{item.content}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS — dark glowing
      ══════════════════════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #0c0c18 0%, #170f28 100%)",
        padding: "88px 0", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,.045) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        <div style={{ position: "absolute", top: -60, right: -60, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.2) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,.16) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14,
              background: "rgba(244,123,32,.15)", border: "1px solid rgba(244,123,32,.3)",
              color: "#fb923c", padding: "5px 18px", borderRadius: 50, fontSize: 12, fontWeight: 700,
            }}>
              By the numbers
            </span>
            <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 900, fontSize: "clamp(1.9rem,3.5vw,2.6rem)", color: "#fff", margin: 0 }}>
              What we've built so far
            </h2>
          </div>

          <div className="grid-4">
            <Stat target={COLLEGES.length} suffix="+" label="Colleges profiled"     color="#F47B20" />
            <Stat target={EXAMS.length}   suffix=""  label="Entrance exams tracked" color="#a855f7" />
            <Stat target={2000}           suffix="+" label="Students guided"        color="#2EC4B6" />
            <Stat target={5}              suffix="-yr" label="Cutoff history"       color="#EC4899" />
          </div>

          {/* Mini achievement cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48 }}>
            {[
              { icon: "🏆", title: "AIR 4846", sub: "Founder's JEE Advanced rank — built this from lived experience" },
              { icon: "📊", title: "7 Years of Data", sub: "JoSAA cutoffs from 2019–2025 across 800+ colleges structured & verified" },
              { icon: "🎓", title: "IIT Roorkee",     sub: "Built by B.Tech students — the same IIT grind that shaped the platform" },
            ].map(({ icon, title, sub }) => (
              <div key={title} style={{
                background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 16, padding: "20px 22px", textAlign: "center",
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--sky)", padding: "88px 0" }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">What we stand for</span>
            <h2 className="section-title">Our values</h2>
            <p className="section-sub">The principles that guide every feature we build and every decision we make.</p>
          </div>
          <div className="grid-3" style={{ gap: 20 }}>
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.06}>
                <div className="card value-card-about" style={{ height: "100%", borderTop: `3px solid ${v.color}` }}>
                  <span style={{
                    width: 50, height: 50, borderRadius: 14,
                    display: "grid", placeItems: "center",
                    background: `${v.color}14`,
                  }}>
                    <v.icon size={24} color={v.color} />
                  </span>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, margin: "14px 0 7px", color: "var(--navy)" }}>{v.t}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: 14 }}>{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CONTACT — dark CTA
      ══════════════════════════════════════════════════════ */}
      <section id="contact" style={{
        background: "linear-gradient(135deg, #0c0c18 0%, #170f28 100%)",
        padding: "88px 0", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,.045) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,.18) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -40, right: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.16) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            maxWidth: 720, margin: "0 auto", textAlign: "center",
            background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 28, padding: "56px 44px",
            boxShadow: "0 0 80px rgba(244,123,32,.08), inset 0 1px 0 rgba(255,255,255,.08)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🤝</div>
            <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 900, fontSize: "clamp(1.7rem,3vw,2.3rem)", color: "#fff", marginBottom: 12 }}>
              Have a question? Talk to us.
            </h2>
            <p style={{ color: "rgba(255,255,255,.52)", marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
              We reply personally — no call centres, no bots. Just two IIT engineers who built this and genuinely want to help every student navigate admissions better.
            </p>

            {/* Primary CTAs */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              <a
                href="mailto:collegeparichay@gmail.com"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#F47B20", color: "#fff", padding: "13px 26px", borderRadius: 50,
                  fontWeight: 700, fontSize: 14, textDecoration: "none", transition: "all .2s",
                  boxShadow: "0 4px 20px rgba(244,123,32,.4)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e0680c"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#F47B20"; e.currentTarget.style.transform = ""; }}
              >
                <Mail size={16} /> collegeparichay@gmail.com
              </a>
              <a
                href="tel:+918118826194"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
                  color: "#fff", padding: "13px 26px", borderRadius: 50,
                  fontWeight: 700, fontSize: 14, textDecoration: "none", transition: "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.18)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.1)"; e.currentTarget.style.transform = ""; }}
              >
                <Phone size={16} /> +91-8118826194
              </a>
            </div>

            {/* Social row */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { href: LK, Icon: Linkedin, label: "LinkedIn" },
                { href: IG, Icon: IgIcon,   label: "Instagram" },
                { href: WA, Icon: WaIcon,   label: "WhatsApp Community" },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                  background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)",
                  color: "rgba(255,255,255,.78)", textDecoration: "none", transition: "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.18)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "rgba(255,255,255,.78)"; }}
                >
                  <Icon size={14} /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
