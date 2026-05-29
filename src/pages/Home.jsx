import Hero from "../components/home/Hero.jsx";
import PredictorCards from "../components/home/PredictorCards.jsx";
import NewTools from "../components/home/NewTools.jsx";
import ApplicationRadar from "../components/home/ApplicationRadar.jsx";
import EntranceExams from "../components/home/EntranceExams.jsx";
import TopColleges from "../components/home/TopColleges.jsx";
import PrivateUniversities from "../components/home/PrivateUniversities.jsx";
import NewsSection from "../components/home/NewsSection.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import ExamCycle from "../components/home/ExamCycle.jsx";
import CollegeTicker from "../components/home/CollegeTicker.jsx";
import CollegeSnapshot from "../components/home/CollegeSnapshot.jsx";
import { Bars, CenterDonut } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  Users, BookOpen, Target, BarChart3, ArrowRight, Trophy, Building2,
  CheckCircle2, ShieldCheck, Phone, MessageCircle, Check, Star, Sparkles,
  TrendingUp, MapPin, GraduationCap, Zap, Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { WaveSeparator, FloatingOrbs, GradientText, StaggerReveal, StaggerItem } from "../components/Animations.jsx";

/* ════════════════════════════════════════════════
   INLINE DATA
════════════════════════════════════════════════ */
const SEAT_DATA = [
  { name: "IITs",   value: 17385 },
  { name: "NITs",   value: 23954 },
  { name: "IIITs",  value: 7402  },
  { name: "GFTIs",  value: 12280 },
];

const BRANCH_DEMAND = [
  { name: "CSE",       value: 98 },
  { name: "ECE",       value: 84 },
  { name: "Mech",      value: 72 },
  { name: "Civil",     value: 58 },
  { name: "Chem Engg", value: 54 },
  { name: "EE",        value: 80 },
];

const STATS = [
  { label: "Students helped",    value: "2.4L+",   icon: Users,     color: "#F97316" },
  { label: "Colleges listed",    value: "850+",    icon: BookOpen,  color: "#0EA5A4" },
  { label: "Rank predictions",   value: "98% acc", icon: Target,    color: "#15a06e" },
  { label: "Cutoff data points", value: "1.2M+",   icon: BarChart3, color: "#1c1c28" },
];

const EXAMS = [
  {
    key: "advanced",
    name: "JEE Advanced 2026",
    tag: "Gateway to the IITs",
    icon: Trophy,
    accent: "#1c1c28",
    date: "May 18, 2026",
    blurb: "The single exam for admission to all 23 IITs. Only the top ~2.5 lakh JEE Main qualifiers are eligible to attempt it.",
    info: [
      ["Conducted by", "IITs (rotational)"],
      ["Eligibility", "Top 2.5L in JEE Main"],
      ["Attempts", "2 consecutive years"],
      ["Papers", "Paper 1 + Paper 2 (both compulsory)"],
      ["Seats", "~17,385 across IITs"],
    ],
    link: "/jee-advanced",
    cta: "Open JEE Advanced",
  },
  {
    key: "main",
    name: "JEE Main 2026",
    tag: "NITs · IIITs · GFTIs",
    icon: Building2,
    accent: "#F97316",
    date: "Session 1: Jan · Session 2: Apr",
    blurb: "India's largest engineering entrance. Qualifies you for 31 NITs, 26 IIITs, 38 GFTIs — and is the first step to JEE Advanced.",
    info: [
      ["Conducted by", "NTA"],
      ["Eligibility", "Class 12 with PCM"],
      ["Attempts", "Both sessions · best score counts"],
      ["Pattern", "75 questions · 300 marks"],
      ["Seats", "~43,600 across NIT + IIIT + GFTI"],
    ],
    link: "/jee-main",
    cta: "Open JEE Main",
  },
];

/* JoSAA plan benefits */
const JOSAA_BULLETS = [
  "Personalised choice list built around YOUR rank & category",
  "1-on-1 mentor call (45 min) with IIT/NIT alumni",
  "Round-wise allotment prediction — Safe / Moderate / Reach",
  "WhatsApp support through all JoSAA + CSAB rounds",
  "Document & reporting checklist so you never miss a deadline",
  "Choice review & mistake-proofing before you lock",
];

/* NITs data */
const TOP_NITS = [
  { name: "NIT Trichy", rank: "NIRF #10", state: "Tamil Nadu", seats: 1200, cse_cutoff: "≤ 5,000 CRL" },
  { name: "NIT Warangal", rank: "NIRF #26", state: "Telangana", seats: 1100, cse_cutoff: "≤ 8,000 CRL" },
  { name: "NIT Surathkal", rank: "NIRF #27", state: "Karnataka", seats: 1050, cse_cutoff: "≤ 12,000 CRL" },
  { name: "NIT Calicut", rank: "NIRF #28", state: "Kerala", seats: 960, cse_cutoff: "≤ 15,000 CRL" },
  { name: "NIT Rourkela", rank: "NIRF #35", state: "Odisha", seats: 1080, cse_cutoff: "≤ 18,000 CRL" },
];

/* IIITs data */
const TOP_IIITS = [
  { name: "IIIT Hyderabad", rank: "NIRF #24", state: "Telangana", seats: 280, cse_cutoff: "≤ 200 CRL" },
  { name: "IIIT Allahabad", rank: "NIRF #48", state: "Uttar Pradesh", seats: 540, cse_cutoff: "≤ 6,000 CRL" },
  { name: "IIIT Bangalore", rank: "NIRF #57", state: "Karnataka", seats: 310, cse_cutoff: "≤ 4,500 CRL" },
  { name: "IIIT Delhi", rank: "Top-5 IIIT", state: "Delhi", seats: 250, cse_cutoff: "≤ 3,800 CRL" },
  { name: "IIIT Gwalior", rank: "Govt. IIIT", state: "Madhya Pradesh", seats: 420, cse_cutoff: "≤ 9,000 CRL" },
];

/* College-picking guide steps */
const PICK_STEPS = [
  {
    icon: Target,
    title: "Know your realistic rank range",
    desc: "Use the rank predictor to get your JEE Main percentile → CRL rank. Filter colleges where your rank comfortably clears the closing rank.",
    tip: "Add ±5% buffer — cutoffs shift every year.",
    color: "#F47B20",
  },
  {
    icon: GraduationCap,
    title: "Branch vs Institute — set your priority",
    desc: "Decide upfront: would you rather CSE at a mid-NIT or Mech at NIT Trichy? Both are valid. Your answer reshapes your entire choice list.",
    tip: "CSE at any IIIT often beats core at a lower NIT.",
    color: "#0ea5a4",
  },
  {
    icon: MapPin,
    title: "Consider home state & category quota",
    desc: "NITs reserve 50% seats for Home State quota — closing ranks can be 3–5x more relaxed. SC/ST/OBC-NCL categories open many more doors.",
    tip: "Always check HS cutoff, not just OS cutoff.",
    color: "#15a06e",
  },
  {
    icon: TrendingUp,
    title: "Build a Safe / Moderate / Reach list",
    desc: "Aim for 20–25 choices in order: 5 Safe (rank well below cutoff), 12 Moderate (rank near cutoff), 5–8 Reach (ambitious but realistic).",
    tip: "Never put a preferred college below a less-preferred one.",
    color: "#8b5cf6",
  },
  {
    icon: Zap,
    title: "Use Float, Slide & Upgrade options",
    desc: "JoSAA rounds 2–6 allow upgrades. 'Float' means upgrade institute; 'Slide' means better branch in same institute. Use these actively.",
    tip: "CSAB special rounds run after JoSAA — don't ignore them.",
    color: "#f59e0b",
  },
  {
    icon: ShieldCheck,
    title: "Lock before the deadline — no exceptions",
    desc: "Missing reporting or freeze/float/slide decisions voids your seat. Keep a printed schedule and set phone reminders for every round date.",
    tip: "Prepare documents 1 week before reporting day.",
    color: "#ef4444",
  },
];

/* ════════════════════════════════════════════════
   HELPER COMPONENTS
════════════════════════════════════════════════ */
function HomeSection({ id, eyebrow, title, sub, children, bg }) {
  return (
    <section id={id} style={{ padding: "72px 0", background: bg || "transparent", scrollMarginTop: 80, position: "relative" }}>
      <div className="container">
        {(eyebrow || title) && (
          <div className="title-bar" style={{ marginBottom: 40 }}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title  && <h2 className="section-title" style={{ fontFamily: "'Space Grotesk','Sora',sans-serif" }}>{title}</h2>}
            {sub    && <p className="section-sub">{sub}</p>}
          </div>
        )}
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}

function ExamCard({ ex }) {
  const Icon = ex.icon;
  const isAdvanced = ex.key === "advanced";
  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      style={{
        borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%",
        boxShadow: `0 8px 36px ${ex.accent}22`,
        border: `1px solid ${ex.accent}22`,
        background: "#fff",
      }}
    >
      {/* Header — gradient with mesh pattern */}
      <div style={{
        background: isAdvanced
          ? "linear-gradient(135deg, #1c1c28 0%, #2d1f3d 50%, #0f0a1e 100%)"
          : "linear-gradient(135deg, #F47B20 0%, #ea580c 60%, #c2410c 100%)",
        color: "#fff", padding: "26px 26px 22px",
        position: "relative", overflow: "hidden",
      }}>
        {/* mesh overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        {/* glow blob */}
        <div style={{ position: "absolute", top: -40, right: -30, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${isAdvanced ? "rgba(139,92,246,.25)" : "rgba(255,255,255,.12)"} 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, position: "relative", zIndex: 1 }}>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: "rgba(255,255,255,.15)", border: "1.5px solid rgba(255,255,255,.2)", display: "grid", placeItems: "center" }}>
            <Icon size={24} color="#fff" />
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, padding: "5px 14px", borderRadius: 50, background: "rgba(255,255,255,.15)", color: "#fff", fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "0.5px" }}>
            {ex.tag}
          </span>
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1.45rem", color: "#fff", marginBottom: 6, letterSpacing: "-0.5px", position: "relative", zIndex: 1 }}>{ex.name}</h3>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.7)", display: "flex", alignItems: "center", gap: 5, position: "relative", zIndex: 1 }}>
          <span>📅</span> {ex.date}
        </div>
      </div>

      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.7 }}>{ex.blurb}</p>
        <div style={{ display: "flex", flexDirection: "column", background: "#fafafa", borderRadius: 12, border: "1px solid rgba(0,0,0,.06)", overflow: "hidden" }}>
          {ex.info.map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 14px", borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,.05)" }}>
              <span style={{ fontSize: 12.5, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif" }}>
                <CheckCircle2 size={13} color={ex.accent} /> {k}
              </span>
              <span style={{ fontSize: 12.5, color: "#1c1c28", fontWeight: 700, textAlign: "right", fontFamily: "'Space Grotesk',sans-serif" }}>{v}</span>
            </div>
          ))}
        </div>
        <Link
          to={ex.link}
          style={{
            marginTop: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: isAdvanced ? "linear-gradient(135deg,#1a0800,#2d1200)" : "linear-gradient(135deg,#F47B20,#ea580c)",
            color: "#fff", padding: "14px 22px", borderRadius: 12,
            fontSize: 14, fontWeight: 700, fontFamily: "'Space Grotesk','Sora',sans-serif",
            textDecoration: "none", letterSpacing: "0.2px",
            boxShadow: `0 6px 22px ${ex.accent}44`,
            transition: "all .2s",
          }}
        >
          {ex.cta} <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   JOSAA 2026 PROMO SECTION
════════════════════════════════════════════════ */
function JoSAAPromoSection() {
  const PAY_LINK = "/josaa-2026";
  const WA_LINK  = "https://wa.me/910000000000?text=" + encodeURIComponent("Hi! I want to enrol in the JoSAA 2026 ₹999 counselling plan.");

  return (
    <section className="josaa-promo-section" style={{ position: "relative" }}>
      <FloatingOrbs count={4} colors={["#F47B20","#fbbf24","#F47B20","#ea580c"]} />
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="josaa-promo-inner">
          {/* LEFT: pitch */}
          <Reveal>
            <div>
              <div className="josaa-promo-badge">
                <span className="pulse-dot" />
                JoSAA + CSAB 2026 · Counselling Open
              </div>
              <h2>
                Don't lose your dream college to a{" "}
                <span className="highlight">wrong choice list</span>.
              </h2>
              <p>
                JoSAA counselling is where ranks become seats — and most students
                lose branch upgrades simply because they filled choices in the wrong
                order. Our ₹999 plan gives you a data-backed choice list built
                around YOUR rank, plus a 45-min 1-on-1 mentor call.
              </p>

              <div className="josaa-bullets">
                {JOSAA_BULLETS.map((b) => (
                  <div className="josaa-bullet" key={b}>
                    <span className="josaa-bullet-icon">✓</span>
                    {b}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to={PAY_LINK} className="josaa-cta-btn btn-shimmer" style={{ maxWidth: 260, overflow: "hidden", position: "relative" }}>
                  Enrol now — only ₹999 <ArrowRight size={17} />
                </Link>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "1rem 1.4rem", borderRadius: 50,
                    background: "rgba(255,255,255,.08)",
                    border: "1.5px solid rgba(255,255,255,.22)",
                    color: "rgba(255,255,255,.85)", fontSize: ".9rem", fontWeight: 600,
                    textDecoration: "none", transition: "all .25s",
                  }}
                >
                  <MessageCircle size={16} /> Ask on WhatsApp
                </a>
              </div>

              <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap", fontSize: 13, color: "rgba(255,255,255,.6)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Users size={14} color="#fb923c" /> 2,000+ students guided
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Star size={14} color="#fbbf24" fill="#fbbf24" /> 4.8/5 rating
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Award size={14} color="#fb923c" /> Built by IITians
                </span>
              </div>
            </div>
          </Reveal>

          {/* RIGHT: price card */}
          <Reveal delay={0.1}>
            <div className="josaa-price-card">
              <div className="limited-tag">🔥 Limited slots this cycle</div>
              <div className="josaa-old-price">₹2,999</div>
              <div className="josaa-new-price">₹999 <span>/plan</span></div>
              <div className="josaa-price-label">one-time · all JoSAA + CSAB rounds</div>

              <div className="josaa-includes">
                {[
                  "Personalised choice list (your rank + category)",
                  "1-on-1 mentor call — 45 min",
                  "Round-wise allotment prediction",
                  "WhatsApp support till seat locked",
                  "Document & deadline checklist",
                  "Choice review before you lock",
                ].map((item) => (
                  <div className="josaa-include-item" key={item}>
                    <Check size={15} color="#22c55e" strokeWidth={2.5} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link to={PAY_LINK} className="josaa-cta-btn">
                Enrol Now — ₹999 <ArrowRight size={17} />
              </Link>

              <div className="josaa-secure-note">
                <ShieldCheck size={13} />
                Secure payment · mentor assigned within hours
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   INSTITUTES SECTION (NITs + IIITs deep-dive)
════════════════════════════════════════════════ */
function InstitutesSection() {
  return (
    <HomeSection
      eyebrow="College Guide"
      title={<>NITs &amp; IIITs — <span className="accent">Know Before You Choose</span></>}
      sub="31 NITs and 26 IIITs together offer ~31,000 seats. Here's what separates them and which ones you should target."
      bg="linear-gradient(160deg, #f0f9ff 0%, #fff7ef 50%, #fff 100%)"
    >
      {/* Institute type cards */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {/* NITs Card */}
        <div className="institute-type-card">
          <div className="institute-type-header nit-header">
            <span className="institute-count-badge">31 NITs</span>
            <h3>National Institutes of Technology</h3>
            <p>Government-funded · Autonomous degree-granting</p>
          </div>
          <div className="institute-type-body">
            <div className="institute-stat-row">
              <div className="institute-stat-item">
                <div className="institute-stat-val">~24K</div>
                <div className="institute-stat-lbl">Total seats</div>
              </div>
              <div className="institute-stat-item">
                <div className="institute-stat-val">50%</div>
                <div className="institute-stat-lbl">HS quota</div>
              </div>
              <div className="institute-stat-item">
                <div className="institute-stat-val">4 yr</div>
                <div className="institute-stat-lbl">B.Tech</div>
              </div>
            </div>
            <p style={{ fontSize: ".82rem", color: "var(--muted)", marginBottom: 10, lineHeight: 1.55 }}>
              NITs follow a Home State (HS) + Other State (OS) quota system. HS cutoffs can be significantly more relaxed — always check both before deciding.
            </p>
            <div className="top-colleges-mini">
              {TOP_NITS.map((c) => (
                <div className="top-college-mini-item" key={c.name}>
                  <div>
                    <div className="top-college-mini-name">{c.name}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--gray)" }}>
                      {c.state} · CSE {c.cse_cutoff}
                    </div>
                  </div>
                  <span className="top-college-mini-rank">{c.rank}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* IIITs Card */}
        <div className="institute-type-card">
          <div className="institute-type-header iiit-header">
            <span className="institute-count-badge">26 IIITs</span>
            <h3>Indian Institutes of Information Technology</h3>
            <p>Specialised in CS · IT · Electronics</p>
          </div>
          <div className="institute-type-body">
            <div className="institute-stat-row">
              <div className="institute-stat-item">
                <div className="institute-stat-val">~7.4K</div>
                <div className="institute-stat-lbl">Total seats</div>
              </div>
              <div className="institute-stat-item">
                <div className="institute-stat-val">CS/IT</div>
                <div className="institute-stat-lbl">Core focus</div>
              </div>
              <div className="institute-stat-item">
                <div className="institute-stat-val">4 yr</div>
                <div className="institute-stat-lbl">B.Tech</div>
              </div>
            </div>
            <p style={{ fontSize: ".82rem", color: "var(--muted)", marginBottom: 10, lineHeight: 1.55 }}>
              IIITs specialise in CS, IT and ECE — ideal if you're targeting software roles. IIIT Hyderabad is an autonomous institute with separate admission; IIIT Allahabad, Delhi and Bangalore are top picks via JoSAA.
            </p>
            <div className="top-colleges-mini">
              {TOP_IIITS.map((c) => (
                <div className="top-college-mini-item" key={c.name}>
                  <div>
                    <div className="top-college-mini-name">{c.name}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--gray)" }}>
                      {c.state} · CSE {c.cse_cutoff}
                    </div>
                  </div>
                  <span className="top-college-mini-rank">{c.rank}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GFTIs Card */}
        <div className="institute-type-card">
          <div className="institute-type-header gfti-header">
            <span className="institute-count-badge">38 GFTIs</span>
            <h3>Govt.-Funded Technical Institutes</h3>
            <p>Centrally funded · Wide branch diversity</p>
          </div>
          <div className="institute-type-body">
            <div className="institute-stat-row">
              <div className="institute-stat-item">
                <div className="institute-stat-val">~12K</div>
                <div className="institute-stat-lbl">Total seats</div>
              </div>
              <div className="institute-stat-item">
                <div className="institute-stat-val">Low</div>
                <div className="institute-stat-lbl">Fee</div>
              </div>
              <div className="institute-stat-item">
                <div className="institute-stat-val">Safe</div>
                <div className="institute-stat-lbl">Backup</div>
              </div>
            </div>
            <p style={{ fontSize: ".82rem", color: "var(--muted)", marginBottom: 10, lineHeight: 1.55 }}>
              GFTIs include ISM Dhanbad, IIEST Shibpur, BIT Mesra, NIT Agartala, and more. Fees are government-subsidised and cutoffs are less competitive — excellent safe choices in your list.
            </p>
            <div className="top-colleges-mini">
              {[
                { name: "ISM Dhanbad", rank: "NIRF #19", state: "Jharkhand", cse_cutoff: "≤ 22,000" },
                { name: "IIEST Shibpur", rank: "NIRF #43", state: "West Bengal", cse_cutoff: "≤ 35,000" },
                { name: "BIT Mesra", rank: "Top GFTI", state: "Jharkhand", cse_cutoff: "≤ 45,000" },
                { name: "NIT Agartala", rank: "GFTI", state: "Tripura", cse_cutoff: "≤ 80,000" },
                { name: "SLIET Punjab", rank: "GFTI", state: "Punjab", cse_cutoff: "≤ 1,20,000" },
              ].map((c) => (
                <div className="top-college-mini-item" key={c.name}>
                  <div>
                    <div className="top-college-mini-name">{c.name}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--gray)" }}>
                      {c.state} · CSE {c.cse_cutoff}
                    </div>
                  </div>
                  <span className="top-college-mini-rank">{c.rank}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NIT vs IIIT comparison strip */}
      <div className="card" style={{ padding: "1.6rem 2rem", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span className="eyebrow" style={{ margin: 0 }}>NIT vs IIIT</span>
          <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.05rem", color: "var(--navy)" }}>
            Which should you target?
          </h3>
        </div>
        <div className="grid-2" style={{ gap: 20 }}>
          {[
            {
              title: "Choose NIT if…",
              color: "#1a4a9a",
              points: [
                "You want a wide range of branches (Mech, Civil, Chemical, EE)",
                "You're from a Home State and get the HS quota advantage",
                "You want strong alumni networks in core/manufacturing industries",
                "NIT Trichy / Warangal / Surathkal for brand recognition",
              ],
            },
            {
              title: "Choose IIIT if…",
              color: "#2d1270",
              points: [
                "CSE / IT / ECE is your definitive first choice",
                "You want a specialised tech environment and CS-focused curriculum",
                "You're targeting product roles, startups, or higher studies in CS",
                "Your rank permits IIIT Hyderabad, Delhi, Bangalore or Allahabad",
              ],
            },
          ].map(({ title, color, points }) => (
            <div key={title} style={{ background: "var(--sky)", borderRadius: 12, padding: "1.2rem 1.3rem", border: "1px solid var(--border)" }}>
              <h4 style={{ fontFamily: "Sora", fontWeight: 700, color, marginBottom: 10, fontSize: ".95rem" }}>{title}</h4>
              {points.map((p) => (
                <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <CheckCircle2 size={14} color={color} style={{ marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: ".84rem", color: "var(--navy)", lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CTA to full college finder */}
      <div style={{ textAlign: "center" }}>
        <Link to="/colleges" className="btn btn-coral" style={{ fontSize: ".95rem", padding: ".85rem 1.8rem" }}>
          Browse all 850+ colleges <ArrowRight size={16} />
        </Link>
      </div>
    </HomeSection>
  );
}

/* ════════════════════════════════════════════════
   HOW TO PICK A COLLEGE — GUIDE SECTION
════════════════════════════════════════════════ */
function CollegePickingGuide() {
  return (
    <HomeSection
      eyebrow="Step-by-step guide"
      title={<>How to pick the <span className="accent">right college</span> in JoSAA</>}
      sub="Most rank drops happen not in the exam hall — but at the choice-filling screen. Follow these 6 steps to fill smart."
      bg="linear-gradient(160deg, #fff 0%, #fff7ef 50%, #fffaf5 100%)"
    >
      <div className="grid-3" style={{ marginBottom: 28 }}>
        {PICK_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                style={{
                  height: "100%", background: "#fff", borderRadius: 16,
                  border: `1px solid ${s.color}18`,
                  borderTop: `3px solid ${s.color}`,
                  boxShadow: "0 3px 16px rgba(28,28,40,.07)",
                  padding: "20px 20px 18px",
                  display: "flex", flexDirection: "column",
                  transition: "box-shadow .25s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${s.color}14`, border: `1.5px solid ${s.color}28`,
                    display: "grid", placeItems: "center", flexShrink: 0,
                  }}>
                    <Icon size={20} color={s.color} />
                  </div>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: `linear-gradient(135deg,${s.color},${s.color}cc)`,
                    color: "#fff", fontFamily: "'Space Grotesk','Sora',sans-serif",
                    fontWeight: 800, fontSize: "0.85rem",
                    display: "grid", placeItems: "center", flexShrink: 0,
                    boxShadow: `0 4px 12px ${s.color}44`,
                  }}>{i + 1}</span>
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: "0.96rem", color: "var(--navy)", marginBottom: 8, lineHeight: 1.3 }}>
                  {s.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.84rem", lineHeight: 1.65, marginBottom: 12, flex: 1 }}>{s.desc}</p>
                <div style={{
                  background: `${s.color}0e`, border: `1px solid ${s.color}25`,
                  borderRadius: 9, padding: "8px 11px",
                  fontSize: "0.78rem", color: s.color, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "'Space Grotesk',sans-serif",
                }}>
                  💡 {s.tip}
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        style={{
          background: "linear-gradient(135deg, #1a0800 0%, #2d1200 60%, #3d1800 100%)",
          borderRadius: 18, padding: "24px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 18,
          boxShadow: "0 8px 32px rgba(244,123,32,.22)",
          border: "1px solid rgba(244,123,32,.25)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #F47B20, #fbbf24, #F47B20)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h4 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, color: "#fff", marginBottom: 5, fontSize: "1.1rem" }}>
            Want a personalised choice list done for you?
          </h4>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,.6)" }}>
            Our JoSAA 2026 expert plan gives you a ready-to-fill, rank-specific choice list for just ₹999.
          </p>
        </div>
        <Link to="/josaa-2026" className="btn btn-coral" style={{ flexShrink: 0, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>
          Get my ₹999 plan <ArrowRight size={15} />
        </Link>
      </motion.div>
    </HomeSection>
  );
}

/* ════════════════════════════════════════════════
   MAIN HOME EXPORT
════════════════════════════════════════════════ */
export default function Home({ onSearch }) {
  return (
    <>
      {/* ── Hero ── */}
      <Hero onSearch={onSearch} />

      {/* ── Stats bar ── */}
      <section style={{
        background: "linear-gradient(135deg, #1a0800 0%, #2d1200 30%, #3d1800 60%, #2a1000 100%)",
        padding: "44px 0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Ambient glows */}
        <div style={{ position: "absolute", top: -80, left: "15%", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.22) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: "10%", width: 350, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,162,97,.16) 0%, transparent 65%)", pointerEvents: "none" }} />
        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
            {STATS.map(({ label, value, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "rgba(255,255,255,.04)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 18,
                  padding: "20px 22px",
                  border: `1px solid ${color === "#1c1c28" ? "rgba(244,123,32,.22)" : color + "28"}`,
                  boxShadow: `0 4px 20px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.06)`,
                  transition: "all .3s",
                }}
                whileHover={{ scale: 1.03, background: "rgba(255,255,255,.07)", transition: { duration: 0.2 } }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${color === "#1c1c28" ? "#F47B20" : color}20`,
                  border: `1.5px solid ${color === "#1c1c28" ? "#F47B20" : color}44`,
                  display: "grid", placeItems: "center", flexShrink: 0,
                  boxShadow: `0 0 16px ${color === "#1c1c28" ? "#F47B20" : color}22`,
                }}>
                  <Icon size={24} color={color === "#1c1c28" ? "#F47B20" : color} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 24, color: "#fff", lineHeight: 1, letterSpacing: "-0.5px" }}>{value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 5, fontFamily: "'DM Sans',sans-serif" }}>{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave between dark stats and ticker */}
      <WaveSeparator fillTop="#1c0e00" fillBottom="#1a0800" />

      {/* ── College Ticker ── */}
      <CollegeTicker />

      <WaveSeparator fillTop="#1a0800" fillBottom="#1a0e00" />

      {/* ── Predictor Cards ── */}
      <PredictorCards />

      <WaveSeparator fillTop="#1a0e00" fillBottom="#fff7ef" />

      {/* ── JEE Main & Advanced ── */}
      <HomeSection
        eyebrow="Exams 2026"
        title={<>JEE Main & JEE Advanced — <span className="accent">choose your path</span></>}
        bg="linear-gradient(160deg, #fff7ef 0%, #fff3e6 40%, #fff 100%)"
        sub="Two exams, two doors to the top engineering colleges. Tap either to open its full guide, rank predictor and real cutoffs."
      >
        <div className="grid-2" style={{ gap: 24, alignItems: "stretch" }}>
          {EXAMS.map((ex) => <ExamCard key={ex.key} ex={ex} />)}
        </div>

        {/* quick path strip */}
        <div style={{
          marginTop: 24,
          background: "linear-gradient(135deg, #1a0800 0%, #2d1200 60%, #3d1800 100%)",
          borderRadius: 18, padding: "24px 28px",
          display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-around",
          boxShadow: "0 8px 32px rgba(244,123,32,.15)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />
          {[
            ["1", "Clear JEE Main", "Qualify for NIT/IIIT/GFTI seats", "#F47B20"],
            ["2", "Top 2.5L → Advanced", "Become eligible for the IITs", "#f59e0b"],
            ["3", "Clear JEE Advanced", "Get into one of the 23 IITs", "#6366f1"],
          ].map(([n, t, s, c]) => (
            <div key={n} style={{ flex: "1 1 200px", minWidth: 180, textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${c}, ${c}cc)`, color: "#fff", fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 16, display: "grid", placeItems: "center", margin: "0 auto 10px", boxShadow: `0 4px 14px ${c}55` }}>{n}</div>
              <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, color: "#fff", fontSize: 14.5 }}>{t}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
      </HomeSection>

      <WaveSeparator fillTop="#fff7f0" fillBottom="#1a0800" />
      {/* ── JoSAA 2026 Counselling Promo ── */}
      <JoSAAPromoSection />
      <WaveSeparator fillTop="#1a0800" fillBottom="#fff7ef" />

      {/* ── How to Pick the Right College ── */}
      <CollegePickingGuide />

      {/* ── NITs & IIITs Deep Dive ── */}
      <InstitutesSection />

      {/* ── Seat Distribution Chart ── */}
      <HomeSection
        eyebrow="Seat Matrix"
        title={<>Total Seats Available <span className="accent">(JoSAA 2026)</span></>}
        sub="Approximate seat distribution across IITs, NITs, IIITs and GFTIs via JoSAA counselling."
        bg="linear-gradient(160deg, #faf7f4 0%, #fff3e6 40%, #fff 100%)"
      >
        <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
          <div style={{
            background: "#fff",
            borderRadius: 18, border: "1px solid rgba(0,0,0,.07)",
            boxShadow: "0 4px 24px rgba(28,28,40,.07)",
            padding: "24px",
            position: "relative", overflow: "hidden",
          }}>
            {/* Top accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #F97316, #0EA5A4, #15a06e, #1c1c28)" }} />
            <h4 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, marginBottom: 6, fontSize: "1.05rem" }}>Seat distribution by institute type</h4>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Hover over segments to see exact seat counts.</p>
            <CenterDonut
              data={SEAT_DATA}
              centerLabel="60K+"
              centerSub="total seats"
              colors={["#F97316", "#0EA5A4", "#15a06e", "#1c1c28"]}
              height={260}
              fmt={(v) => v.toLocaleString("en-IN")}
            />
            {/* Legend row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16, justifyContent: "center" }}>
              {SEAT_DATA.map((d, i) => {
                const cols = ["#F97316", "#0EA5A4", "#15a06e", "#1c1c28"];
                return (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: cols[i], display: "block" }} />
                    {d.name}: <strong style={{ color: "#374151" }}>{d.value.toLocaleString("en-IN")}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            background: "#fff",
            borderRadius: 18, border: "1px solid rgba(0,0,0,.07)",
            boxShadow: "0 4px 24px rgba(28,28,40,.07)",
            padding: "24px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #F97316, #f4a261)" }} />
            <h4 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, marginBottom: 6, fontSize: "1.05rem" }}>Branch-wise demand index</h4>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Higher index = more competitive cutoffs across top institutes.</p>
            <Bars
              data={BRANCH_DEMAND}
              bars={[{ key: "value", label: "Demand Index", color: "#F97316" }]}
              height={260}
            />
          </div>
        </div>
      </HomeSection>

      {/* ── Exam Cycle 2025–26 ── */}
      <ExamCycle />

      <WaveSeparator fillTop="#fff7f0" fillBottom="#1a0800" />
      {/* ── JEE Resources Promo Banner ── */}
      <section style={{
        background: "linear-gradient(135deg, #1a0800 0%, #2d1200 50%, #3d1800 100%)",
        padding: "56px 0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, right: 60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,162,97,.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
            <Reveal>
              <div>
                <span className="eyebrow" style={{ marginBottom: 16 }}>
                  JEE Study Material
                </span>
                <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, color: "#fff", fontSize: "clamp(1.6rem,3vw,2.3rem)", marginBottom: 12, lineHeight: 1.15, letterSpacing: "-0.5px" }}>
                  73 chapters across Math,{" "}
                  <span style={{ background: "linear-gradient(90deg, #fbbf24, #F47B20)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Physics & Chemistry
                  </span>
                </h2>
                <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".95rem", maxWidth: 480, lineHeight: 1.7 }}>
                  Chapter-wise breakdown with difficulty ratings, JEE Main vs Advanced coverage and topic-level notes — all in one place.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                  {[
                    { label: "Mathematics", color: "#fbbf24", icon: "∑" },
                    { label: "Physics",     color: "#fb923c", icon: "⚡" },
                    { label: "Chemistry",   color: "#fdba74", icon: "🧪" },
                  ].map(({ label, color, icon }) => (
                    <span key={label} style={{
                      padding: "6px 16px", borderRadius: 50,
                      background: `${color}18`, color,
                      border: `1px solid ${color}35`,
                      fontSize: 13, fontWeight: 600,
                    }}>
                      {icon} {label}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link
                  to="/jee-resources"
                  className="btn btn-coral btn-shimmer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "14px 28px",
                    borderRadius: 12, fontSize: 15, fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 8px 30px rgba(244,123,32,.45)",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  Explore JEE Resources <ArrowRight size={17} />
                </Link>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", textAlign: "center" }}>
                  19 + 25 + 29 chapters · Free access
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <WaveSeparator fillTop="#3d1800" fillBottom="#fff7ef" />
      {/* ── New Tools ── */}
      <NewTools />

      {/* ── Application Radar ── */}
      <ApplicationRadar />

      {/* ── Entrance Exams ── */}
      <EntranceExams />

      {/* ── College Intelligence Snapshot ── */}
      <CollegeSnapshot />

      {/* ── Top Colleges ── */}
      <TopColleges />

      {/* ── Private Universities ── */}
      <PrivateUniversities />

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── News ── */}
      <NewsSection />
    </>
  );
}