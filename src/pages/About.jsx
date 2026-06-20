import {
  ShieldCheck, Mail, Phone, GraduationCap, Heart, Lightbulb,
  Linkedin, Quote, Trophy, Code2, Zap, Users, BookOpen, Target, TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import Seo from "../components/Seo.jsx";
import { COLLEGES } from "../data/colleges.js";
import { EXAMS } from "../data/exams.js";
import useCountUp from "../utils/useCountUp.js";
import Reveal from "../components/Reveal.jsx";

/* ── Social constants ──────────────────────────────────────── */
const LK = "https://www.linkedin.com/in/ankityadavpm/";
const IG = "https://www.instagram.com/ankits_yadavv?igsh=aTF0NnU5bDJxN2F5&utm_source=qr";
const WA = "https://chat.whatsapp.com/EKezcNXEw9iKRdo7Wrjzzx?mode=gi_t";

/* ── Inline SVG brand icons ─────────────────────────────────── */
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
    photo: "/assets/team/ankit2.PNG",
    role: "Founder & CEO",
    accent: "#FF693D",
    edu: "B.Tech, IIT Roorkee",
   bio: "Hi, I'm Ankit Yadav, an IIT Roorkee graduate and the founder of College Parichay — a platform built to make college guidance simpler, clearer, and more accessible for students across India. During my own journey, I saw how confusing the college and career decision process can be. That experience inspired me to create College Parichay with one simple belief: \"Students need clarity, not confusion.\" Through authentic insights, relatable experiences, and a community-driven approach, we aim to help students make informed decisions with confidence.",
    skills: ["Product Strategy", "React", "Leadership", "Data Analysis", "UX"],
    socials: { linkedin: LK, instagram: IG, whatsapp: WA },
  },
  {
    name: "Ankit Kumar",
    initials: "AK",
    photo: "/assets/team/ankit.png?v=2",
    role: "Co-Founder & CTO",
    accent: "#FF693D",
    badge: "Visionary behind the Platform",
    edu: "B.Tech Electrical Engineering, IIT Roorkee",
    bio: "Hi,I’m Ankit Kumar, Co-Founder & CTO of College Parichay and an IIT Roorkee alumnus. I lead the technical vision and execution of our platform, architecting everything from intuitive user interfaces to scalable data pipelines and backend infrastructure. I know firsthand how chaotic the college admission process is—because I’ve been there. Building College Parichay is my way of using technology to solve a massive real-world problem. My mission is simple: to turn complex admission data into clear, actionable insights so every student can make confident decisions.",
    skills: ["Co-Founder", "Tech Head", "Full Stack Developer", "System Design", "Node.js", "Express", "Python", "REST APIs"],
    socials: { linkedin: "https://www.linkedin.com/in/ankit-kumar-1b9a64387?utm_source=share_via&utm_content=profile&utm_medium=member_android", instagram: "https://www.instagram.com/ankit_1_7_/", whatsapp: WA },
  },
];

/* ── Operations team data ──────────────────────────────────── */
const OPERATIONS = [
  {
    name: "K. Gopal",
    initials: "KG",
    photo: "/assets/team/K.Gopal.jpeg",
    role: "COO & Operations Head",
    accent: "#FF693D",
    edu: "B.Tech, IIT Roorkee",
    bio: "Hi, I'm K. Gopal, Operations Head at College Parichay and an IIT Roorkee student. I oversee all operational aspects of the platform — ensuring seamless day-to-day functioning, team coordination, and execution across departments. Like every student who has used this platform, I experienced firsthand how overwhelming the college admission process can be. Being part of College Parichay is my way of channelling that experience into something that truly matters. One mission: helping every student make confident, data-driven decisions.",
    skills: ["Operations", "Team Coordination", "Execution", "Strategy", "Communication", "Management"],
    socials: { instagram: "https://www.instagram.com/_mr_gopal.___0?utm_source=qr&igsh=M3V5eXRzcGExeTR2", whatsapp: WA },
  },
];

/* ── Values ────────────────────────────────────────────────── */
const VALUES = [
  { icon: ShieldCheck, color: "#FF693D", t: "Honest, not hype",     d: "Real data and clear caveats. We tell you when a number is an estimate — never fake certainty." },
  { icon: Heart,       color: "#EC4899", t: "Student-first always", d: "Built by people who were students yesterday. Every feature answers a question we once had." },
  { icon: Lightbulb,   color: "#EAB308", t: "Clarity over clutter", d: "Clean, simple, fast. Counselling is stressful enough without a confusing website." },
  { icon: Code2,       color: "#7C3AED", t: "Data-driven",          d: "Every predictor and cutoff is backed by verified JoSAA & NTA data from 2019–2025." },
  { icon: Users,       color: "#0EA5A4", t: "Open to everyone",     d: "Free for all students. No paywalls, no subscriptions. Knowledge should be accessible." },
  { icon: Zap,         color: "#15A06E", t: "Built to evolve",      d: "We ship improvements every week. Your feedback directly shapes the next feature." },
];

/* ── Story timeline ────────────────────────────────────────── */
const TIMELINE = [
  {
    year: "May 2026", icon: "💡", color: "#FF693D",
    title: "The Frustration That Started It All",
    content: "Sitting in a hostel room at IIT Roorkee right after JoSAA Round 1, we watched a batchmate nearly lose his preferred branch to bad information — outdated cutoff PDFs, contradictory WhatsApp forwards and no clear way to compare options. That single moment became the spark for College Parichay.",
  },
  {
    year: "Jun 2026", icon: "🏗️", color: "#7C3AED",
    title: "Building in the Hostel Room",
    content: "We started coding College Parichay late into the night between classes and exams. The first version was a simple rank-to-college matcher we shared in JEE WhatsApp groups — it crossed 500+ users in the very first week, and the feedback never stopped coming.",
  },
  {
    year: "Jul 2026", icon: "📊", color: "#0EA5A4",
    title: "Solving the Data Problem",
    content: "We scraped, cleaned and structured 7 years of JoSAA cutoff data across 800+ colleges, 5,000+ branches and 6 categories. The predictor engine was the hardest part — handling NTA percentile rounding, fresh vs. spot rounds, and edge cases for the newest IITs and IIITs.",
  },
  {
    year: "Aug 2026", icon: "🚀", color: "#EC4899",
    title: "Official Launch & Student Impact",
    content: "College Parichay launched with JEE Main & Advanced rank predictors, a college explorer, a JoSAA counselling planner and a side-by-side comparison tool. Thousands of students used it for choice-filling, and messages poured in from those who avoided costly mistakes thanks to our data.",
  },
  {
    year: "Sep 2026", icon: "🤝", color: "#F59E0B",
    title: "Mentorship & 1-on-1 Guidance",
    content: "We added 1-on-1 mentorship from IITians and doctors for JEE & NEET aspirants, plus an expert JoSAA + CSAB counselling plan — pairing our verified data with real human guidance through every single round of seat allotment.",
  },
  {
    year: "Oct 2026", icon: "🎯", color: "#15A06E",
    title: "What We're Building Next",
    content: "Expanding to NEET, BITSAT and every major state counselling, with AI-powered choice-filling strategy, personalised college recommendations and an alumni-connect network. The goal: the single go-to platform for every Indian student navigating admissions.",
  },
];

/* ── Animated count-up stat (no glow) ──────────────────────── */
function Stat({ target, suffix, label, color = "#FF693D" }) {
  const [ref, val] = useCountUp(target);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: "clamp(2.4rem,5vw,3.4rem)", color, lineHeight: 1, marginBottom: 8 }}>
        {val.toLocaleString("en-IN")}{suffix}
      </div>
      <div style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

/* ── Role pills (Founder / CTO / COO …) ────────────────────── */
function RoleTags({ role, accent }) {
  const parts = role.split(/\s*[&,/]\s*/).map((p) => p.trim()).filter(Boolean);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 7 }}>
      {parts.map((p) => (
        <span key={p} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px", borderRadius: 50,
          fontFamily: "Sora, sans-serif", fontSize: 12.5, fontWeight: 800,
          letterSpacing: ".3px", color: "#fff", background: accent,
        }}>
          {p}
        </span>
      ))}
    </div>
  );
}

/* ── Square founder photo (no animated border / glow) ──────── */
function FounderPhoto({ founder }) {
  return (
    <div className="founder-photo-frame" style={{
      width: 360, height: 450, borderRadius: 20, overflow: "hidden",
      position: "relative",
      border: `2px solid ${founder.accent}33`,
      boxShadow: "0 12px 36px rgba(13,27,62,.14)",
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
  );
}

/* ── Social button — plain & neutral (no colour) ───────────────
   Used only by the three team-member cards. Deliberately uncoloured:
   white face, grey border/text, and a subtle grey hover — no accent. */
function SocialBtn({ href, icon: Icon, label }) {
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 14px", borderRadius: 50,
        background: "#fff", border: "1px solid rgba(0,0,0,.14)",
        color: "#374151", fontSize: 12, fontWeight: 600,
        textDecoration: "none", transition: "background .2s, border-color .2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.borderColor = "rgba(0,0,0,.22)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "rgba(0,0,0,.14)"; }}
    >
      <Icon size={13} /> {label}
    </a>
  );
}

/* ── Section header ────────────────────────────────────────── */
function SectionHead({ icon: Icon, eyebrow, title, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: "center", marginBottom: 52 }}
    >
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14,
        background: "rgba(255, 105, 61,.1)", border: "1px solid rgba(255, 105, 61,.3)",
        color: "#c2410c", padding: "5px 18px", borderRadius: 50, fontSize: 12, fontWeight: 700, letterSpacing: ".5px",
      }}>
        {Icon && <Icon size={12} />} {eyebrow}
      </span>
      <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 900, fontSize: "clamp(1.9rem,3.5vw,2.7rem)", color: "var(--navy)", margin: "0 0 12px" }}>
        {title}
      </h2>
      {sub && <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 520, margin: "0 auto" }}>{sub}</p>}
    </motion.div>
  );
}

/* ── Team member card (founders + operations) ──────────────── */
function TeamCard({ f, idx, badgeIcon: BadgeIcon, badgeLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: idx * 0.1 }}
    >
      <div
        className="founder-card-wrap"
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,.08)",
          borderTop: `4px solid ${f.accent}`,
          borderRadius: 22, overflow: "hidden",
          display: "grid", gridTemplateColumns: "1fr auto",
          boxShadow: "0 8px 30px rgba(13,27,62,.08)",
        }}
      >
        {/* ── Left: text ── */}
        <div className="team-content" style={{ padding: "28px 26px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "flex-start",
            padding: "10px 20px", borderRadius: 14,
            background: "rgba(255, 105, 61,.1)", border: "1px solid rgba(255, 105, 61,.3)",
          }}>
            <GraduationCap size={22} color="#FF693D" />
            <span style={{ fontFamily: "Sora", fontWeight: 900, fontSize: "1.25rem", color: "#FF693D", letterSpacing: "-0.02em" }}>IIT Roorkee</span>
          </div>

          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start",
            background: `${f.accent}14`, color: f.accent, border: `1px solid ${f.accent}30`,
            padding: "4px 14px", borderRadius: 50,
            fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase",
          }}>
            <BadgeIcon size={10} /> {f.badge || badgeLabel}
          </span>

          <div>
            <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.45rem", color: "var(--navy)", marginBottom: 4, lineHeight: 1.2 }}>{f.name}</h3>
            <RoleTags role={f.role} accent={f.accent} />
          </div>

          {f.edu && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)" }}>
              <GraduationCap size={13} color={f.accent} /> {f.edu}
            </div>
          )}

          <p style={{ color: "#4b5563", lineHeight: 1.72, fontSize: 13.5, flex: 1 }}>{f.bio}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {f.skills.slice(0, 4).map((s) => (
              <span key={s} style={{
                padding: "3px 10px", borderRadius: 50, fontSize: 11,
                background: "rgba(0,0,0,.04)", border: "1px solid rgba(0,0,0,.08)",
                color: "#4b5563", fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {f.socials.linkedin && <SocialBtn href={f.socials.linkedin} icon={Linkedin} label="LinkedIn" accent={f.accent} />}
            {f.socials.instagram && <SocialBtn href={f.socials.instagram} icon={IgIcon} label="Instagram" accent={f.accent} />}
            {f.socials.whatsapp && <SocialBtn href={f.socials.whatsapp} icon={WaIcon} label="WhatsApp" accent={f.accent} />}
          </div>
        </div>

        {/* ── Right: photo column ── */}
        <div className="team-photo-col" style={{
          width: 420, flexShrink: 0,
          background: "linear-gradient(160deg, rgba(255, 105, 61,.12) 0%, rgba(251,191,36,.07) 60%, rgba(255, 105, 61,.05) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden", padding: "28px 20px",
        }}>
          <FounderPhoto founder={f} />
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   Main About Page — flat white, no glow / background animations
════════════════════════════════════════════════════════════ */
export default function About() {
  return (
    <div className="page">
      <Seo
        title="About CollegeParichay — Built by IIT Roorkee Alumni"
        description="CollegeParichay is a free student platform built by IIT Roorkee alumni Ankit Yadav and Ankit Kumar to help JEE aspirants predict ranks, shortlist colleges and navigate JoSAA counselling."
        path="/about"
      />
      <style>{`
        @media (max-width: 640px) {
          .team-grid { grid-template-columns: 1fr !important; }
          .founder-card-wrap { grid-template-columns: 1fr !important; }
          .team-photo-col { width: auto !important; order: -1; padding: 26px 16px !important; }
          .founder-photo-frame { width: min(240px, 68vw) !important; height: auto !important; aspect-ratio: 4 / 5; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", background: "#ffffff", padding: "84px 0 72px", borderBottom: "1px solid rgba(255, 105, 61,.12)" }}>
        {/* animated IIT Roorkee backdrop */}
        <motion.div
          aria-hidden="true"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.18 }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: "url('/IITroorkee.png')",
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 1,
            filter: "saturate(1.28) brightness(1.06) contrast(1.08)",
          }}
        />
        {/* light scrim — keeps the photo fully visible while text stays legible */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(180deg, rgba(255,255,255,.34) 0%, rgba(255,245,236,.16) 45%, rgba(255,255,255,.40) 100%)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 70% 65% at 50% 42%, rgba(255,255,255,.42) 0%, transparent 60%)" }} />
        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22,
            background: "rgba(255, 105, 61,.1)", border: "1px solid rgba(255, 105, 61,.3)",
            color: "#c2410c", padding: "5px 16px 5px 5px", borderRadius: 50,
            fontSize: 13, fontWeight: 700, letterSpacing: ".5px",
          }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#FF693D", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "11px", letterSpacing: "-0.5px", lineHeight: 1 }}>CP</span>
            </span>
            About College Parichay
          </span>

          <h1 style={{
            fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 900,
            fontSize: "clamp(2.2rem,5vw,3.6rem)", margin: "0 0 18px",
            letterSpacing: "-0.04em", color: "var(--navy)", lineHeight: 1.15,
            textShadow: "0 1px 10px rgba(255,255,255,.9), 0 1px 2px rgba(255,255,255,.95)",
          }}>
            Made by students who've been{" "}
            <span style={{ color: "#FF693D" }}>exactly where you are</span>
          </h1>

          <p style={{ color: "#334155", maxWidth: 640, margin: "0 auto 36px", fontSize: "1.08rem", lineHeight: 1.75, fontWeight: 500, textShadow: "0 1px 6px rgba(255,255,255,.92)" }}>
            Two engineers from IIT Roorkee who cracked JEE Advanced, lived through the chaos of JoSAA counselling, and built the platform they wished existed. College Parichay brings rank prediction, college discovery and counselling guidance into one clean, student-first platform — completely free.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={LK} target="_blank" rel="noreferrer" className="btn btn-light"><Linkedin size={15} /> LinkedIn</a>
            <a href={IG} target="_blank" rel="noreferrer" className="btn btn-light"><IgIcon size={15} /> Instagram</a>
            <a href={WA} target="_blank" rel="noreferrer" className="btn btn-light"><WaIcon size={15} /> WhatsApp</a>
            <a href="#contact" className="btn btn-coral"><Mail size={15} /> Contact Us</a>
          </div>
        </div>
      </section>

      {/* ── FOUNDERS ── */}
      <section style={{ background: "#ffffff", padding: "76px 0" }}>
        <div className="container">
          <SectionHead icon={Trophy} eyebrow="The Founders" title="Who's behind College Parichay" sub="Two engineers from IIT Roorkee, building the tool every JEE aspirant deserves" />
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
            {FOUNDERS.map((f, idx) => (
              <TeamCard key={f.name} f={f} idx={idx} badgeIcon={Trophy} badgeLabel={idx === 0 ? "Founder" : "Co-Founder"} />
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATIONS ── */}
      <section style={{ background: "#ffffff", padding: "0 0 76px" }}>
        <div className="container">
          <SectionHead icon={Users} eyebrow="The Operations Team" title="Keeping everything running smoothly" sub="The people behind the scenes making sure students always come first" />
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
            {OPERATIONS.map((f, idx) => (
              <TeamCard key={f.name} f={f} idx={idx} badgeIcon={Zap} badgeLabel="Operations" />
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section style={{ background: "#ffffff", padding: "96px 0", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div className="container" style={{ maxWidth: 1160 }}>
          <div className="title-bar" style={{ textAlign: "left", alignItems: "flex-start", marginBottom: 44 }}>
            <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <GraduationCap size={15} /> Our story · IIT Roorkee
            </span>
            <h2 className="section-title" style={{ textAlign: "left", maxWidth: 1000, fontSize: "clamp(2.2rem, 4.8vw, 3.6rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              It started in an IIT Roorkee hostel room
            </h2>
          </div>

          <Reveal>
            <p style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.65rem)", lineHeight: 1.6, fontWeight: 600, color: "var(--navy)", margin: "0 0 34px", maxWidth: 1040 }}>
              College Parichay was founded by two <strong>IIT Roorkee</strong> alumni —{" "}
              <strong>Ankit Yadav</strong> (Founder &amp; CEO) and <strong>Ankit Kumar</strong> (Co-Founder &amp; CTO) —
              with <strong>K. Gopal</strong> (COO &amp; Operations Head) keeping everything running. Three students from the
              same campus, building the platform we wished existed when we were the ones staring at rank lists and cutoffs.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 48 }}>
            {[
              `A few years ago, sitting in a hostel room at IIT Roorkee, we were remembering how stressful our own JEE counselling had been. Endless browser tabs, outdated cutoff PDFs, WhatsApp forwards full of conflicting information, and a constant fear: "what if I fill my choices wrong and lose a seat I deserved?"`,
              `We watched batchmates — bright students who had cracked one of the toughest exams in the world — stumble at the last hurdle simply because the right information wasn't available. Students from small towns without seniors to guide them were at a real disadvantage. That didn't sit right with us.`,
              `<strong>IIT Roorkee</strong> gave us the technical foundation and the peer environment that pushes you to build real things. We had access to years of JoSAA data, the engineering coursework to build prediction models, and most importantly — the lived experience of going through this process. We decided to use all of it to build something meaningful.`,
              `Today, College Parichay is used by thousands of students every counselling season. We've structured 7+ years of JoSAA data, built rank predictors for JEE Main and Advanced, a college explorer, a JoSAA planner, and a comparison engine — all from that same <strong>IIT Roorkee</strong> hostel-room drive to make this process less chaotic for the next student.`,
            ].map((text, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p style={{ fontSize: "1.2rem", lineHeight: 1.9, color: "var(--ink)", margin: 0, maxWidth: 1040 }}
                  dangerouslySetInnerHTML={{ __html: text.replace(/"([^"]+)"/g, '<em>"$1"</em>') }} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div style={{
              borderLeft: "5px solid #FF693D", borderRadius: "0 16px 16px 0",
              background: "rgba(255, 105, 61,.06)", padding: "30px 34px",
              display: "flex", gap: 18, marginBottom: 38, maxWidth: 1040,
            }}>
              <Quote size={38} color="#FF693D" style={{ flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontStyle: "italic", color: "var(--navy)", fontSize: "1.32rem", lineHeight: 1.62, fontWeight: 500, margin: 0 }}>
                "We're not a faceless portal. We're <strong>IIT&nbsp;Roorkee</strong> engineers who lived this chaos and decided to fix it for the next student. Every feature on College Parichay answers a question one of us once had — and found no good answer to."
              </p>
            </div>
          </Reveal>

          {/* Founder & team signature */}
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 64 }}>
              {[
                ["Ankit Yadav", "Founder & CEO"],
                ["Ankit Kumar", "Co-Founder & CTO"],
                ["K. Gopal", "COO & Operations Head"],
              ].map(([name, role]) => (
                <div key={name} style={{
                  display: "flex", flexDirection: "column", gap: 3,
                  padding: "16px 24px", borderRadius: 16, background: "#fff",
                  border: "1px solid rgba(255, 105, 61,.28)", boxShadow: "0 4px 18px rgba(13,27,62,.06)",
                  minWidth: 200, flex: "1 1 220px",
                }}>
                  <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.18rem", color: "var(--navy)" }}>{name}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#FF693D" }}>{role}</span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <GraduationCap size={13} /> IIT Roorkee
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 26, marginBottom: 32, color: "var(--navy)" }}>
            How we built it — from IIT Roorkee hostel to live platform
          </h3>

          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: "rgba(255, 105, 61,.25)", borderRadius: 2 }} />
            {TIMELINE.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.05}>
                <div style={{ display: "flex", gap: 24, marginBottom: 28, position: "relative" }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                    background: item.color, display: "grid", placeItems: "center",
                    fontSize: 18, zIndex: 1,
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, borderRadius: 16, background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderLeft: `3px solid ${item.color}`, padding: "18px 22px", boxShadow: "0 2px 14px rgba(13,27,62,.05)" }}>
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

      {/* ── STATS ── */}
      <section style={{ background: "#ffffff", padding: "76px 0", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div className="container">
          <SectionHead eyebrow="By the numbers" title="What we've built so far" />

          {/* Headline impact metrics (moved here from the home hero) */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 16, maxWidth: 880, margin: "0 auto 44px",
          }}>
            {[
              { icon: Users,       val: "3,200+", lbl: "Students helped",    bg: "rgba(255, 105, 61,.12)", color: "#FF693D" },
              { icon: BookOpen,    val: "850+",   lbl: "Colleges listed",    bg: "rgba(14,165,164,.12)", color: "#0ea5a4" },
              { icon: Target,      val: "98% acc",lbl: "Rank predictions",   bg: "rgba(34,197,94,.12)",  color: "#22c55e" },
              { icon: TrendingUp,  val: "1.2M+",  lbl: "Cutoff data points", bg: "rgba(255, 105, 61,.12)", color: "#FF693D" },
            ].map(({ icon: Icon, val, lbl, bg, color }) => (
              <div key={lbl} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "#fff", border: "1px solid rgba(0,0,0,.08)",
                borderRadius: 16, padding: "16px 18px", boxShadow: "0 2px 14px rgba(13,27,62,.05)",
              }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: bg, color, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon size={22} />
                </span>
                <div>
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.15rem", color: "var(--navy)", lineHeight: 1.1 }}>{val}</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>{lbl}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid-4">
            <Stat target={COLLEGES.length} suffix="+" label="Colleges profiled"     color="#FF693D" />
            <Stat target={EXAMS.length}   suffix=""  label="Entrance exams tracked" color="#a855f7" />
            <Stat target={3200}           suffix="+" label="Students guided"        color="#2EC4B6" />
            <Stat target={5}              suffix="-yr" label="Cutoff history"       color="#EC4899" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 44 }} className="about-highlight-grid">
            {[
              { icon: "🏆", title: "AIR 3846", sub: "Co-Founder's JEE Advanced rank — built this from lived experience", color: "#FF693D" },
              { icon: "📊", title: "7 Years of Data", sub: "JoSAA cutoffs from 2019–2025 across 800+ colleges structured & verified", color: "#a855f7" },
              { icon: "🎓", title: "IIT Roorkee", sub: "Built by B.Tech students — the same IIT grind that shaped the platform", color: "#2EC4B6" },
            ].map(({ icon, title, sub, color }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div style={{
                  background: "#fff", border: "1px solid rgba(0,0,0,.08)",
                  borderTop: `3px solid ${color}`, borderRadius: 16,
                  padding: "20px 22px", textAlign: "center", height: "100%",
                  boxShadow: "0 2px 14px rgba(13,27,62,.05)",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 18, marginBottom: 6, color }}>{title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>{sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ background: "#ffffff", padding: "76px 0", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div className="container">
          <div className="title-bar">
            <span className="eyebrow">What we stand for</span>
            <h2 className="section-title">Our values</h2>
            <p className="section-sub">The principles that guide every feature we build and every decision we make.</p>
          </div>
          <div className="grid-3" style={{ gap: 20 }}>
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={(i % 3) * 0.07}>
                <div className="card" style={{ height: "100%", borderTop: `3px solid ${v.color}` }}>
                  <span style={{ width: 50, height: 50, borderRadius: 14, display: "grid", placeItems: "center", background: `${v.color}14` }}>
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

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: "#ffffff", padding: "76px 0", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div className="container">
          <div style={{
            maxWidth: 720, margin: "0 auto", textAlign: "center",
            background: "#fff", border: "1px solid rgba(255, 105, 61,.2)",
            borderRadius: 28, padding: "48px 40px",
            boxShadow: "0 10px 36px rgba(13,27,62,.08)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🤝</div>
            <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 900, fontSize: "clamp(1.7rem,3vw,2.3rem)", color: "var(--navy)", marginBottom: 12 }}>
              Have a question? Talk to us.
            </h2>
            <p style={{ color: "var(--muted)", marginBottom: 30, fontSize: 15, lineHeight: 1.7 }}>
              We reply personally — no call centres, no bots. Just two IIT engineers who built this and genuinely want to help every student navigate admissions better.
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 22 }}>
              <a href="mailto:collegeparichay@gmail.com" className="btn btn-coral"><Mail size={16} /> collegeparichay@gmail.com</a>
              <a href="tel:+918118826194" className="btn btn-light"><Phone size={16} /> +91-8118826194</a>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { href: LK, Icon: Linkedin, label: "LinkedIn" },
                { href: IG, Icon: IgIcon,   label: "Instagram" },
                { href: WA, Icon: WaIcon,   label: "WhatsApp Community" },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                  background: "#fff", border: "1px solid rgba(0,0,0,.12)",
                  color: "var(--navy)", textDecoration: "none", transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255, 105, 61,.5)"; e.currentTarget.style.color = "#c2410c"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,.12)"; e.currentTarget.style.color = "var(--navy)"; }}
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
