import Hero from "../components/home/Hero.jsx";
import PredictorCards from "../components/home/PredictorCards.jsx";
import NewTools from "../components/home/NewTools.jsx";
import ApplicationRadar from "../components/home/ApplicationRadar.jsx";
import EntranceExams from "../components/home/EntranceExams.jsx";
import TopColleges from "../components/home/TopColleges.jsx";
import PrivateUniversities from "../components/home/PrivateUniversities.jsx";
import NewsSection from "../components/home/NewsSection.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import { Bars, CenterDonut } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  Users, BookOpen, Target, BarChart3, ArrowRight, Trophy, Building2,
  CheckCircle2, ShieldCheck, Phone, MessageCircle, Check, Star, Sparkles,
  TrendingUp, MapPin, GraduationCap, Zap, Award,
} from "lucide-react";
import { Link } from "react-router-dom";

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
    <section id={id} style={{ padding: "64px 0", background: bg || "transparent", scrollMarginTop: 80 }}>
      <div className="container">
        {(eyebrow || title) && (
          <div className="title-bar" style={{ marginBottom: 36 }}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title  && <h2 className="section-title">{title}</h2>}
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
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ background: ex.accent, color: "#fff", padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.16)", display: "grid", placeItems: "center" }}>
            <Icon size={22} color="#fff" />
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 700, padding: "5px 12px", borderRadius: 50, background: "rgba(255,255,255,.18)", color: "#fff" }}>{ex.tag}</span>
        </div>
        <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 22 }}>{ex.name}</h3>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.78)", marginTop: 4 }}>📅 {ex.date}</div>
      </div>
      <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{ex.blurb}</p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {ex.info.map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
              <span style={{ fontSize: 13, color: "var(--muted)", display: "flex", alignItems: "center", gap: 7 }}>
                <CheckCircle2 size={14} color={ex.accent} /> {k}
              </span>
              <span style={{ fontSize: 13, color: "var(--navy)", fontWeight: 600, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
        <Link to={ex.link} style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: ex.accent, color: "#fff", padding: "13px 20px", borderRadius: 12, fontSize: 14.5, fontWeight: 700, textDecoration: "none" }}>
          {ex.cta} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   JOSAA 2026 PROMO SECTION
════════════════════════════════════════════════ */
function JoSAAPromoSection() {
  const PAY_LINK = "/josaa-2026";
  const WA_LINK  = "https://wa.me/910000000000?text=" + encodeURIComponent("Hi! I want to enrol in the JoSAA 2026 ₹999 counselling plan.");

  return (
    <section className="josaa-promo-section">
      <div className="container">
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
                <Link to={PAY_LINK} className="josaa-cta-btn" style={{ maxWidth: 260 }}>
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
      title="NITs & IIITs — Know Before You Choose"
      sub="31 NITs and 26 IIITs together offer ~31,000 seats. Here's what separates them and which ones you should target."
      bg="var(--sky)"
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
    >
      <div className="grid-3" style={{ marginBottom: 28 }}>
        {PICK_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="card" style={{ height: "100%", borderTop: `3px solid ${s.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${s.color}18`, display: "grid", placeItems: "center", flexShrink: 0,
                  }}>
                    <Icon size={19} color={s.color} />
                  </div>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: s.color, color: "#fff",
                    fontFamily: "Sora", fontWeight: 800, fontSize: ".78rem",
                    display: "grid", placeItems: "center", flexShrink: 0,
                  }}>{i + 1}</span>
                </div>
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: ".95rem", color: "var(--navy)", marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: ".84rem", lineHeight: 1.6, marginBottom: 10 }}>{s.desc}</p>
                <div style={{
                  background: `${s.color}0f`, border: `1px solid ${s.color}28`,
                  borderRadius: 8, padding: ".5rem .7rem",
                  fontSize: ".78rem", color: s.color, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  💡 {s.tip}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* CTA to counselling page */}
      <div style={{
        background: "linear-gradient(135deg,rgba(244,123,32,.08),rgba(244,162,97,.05))",
        border: "1.5px solid rgba(244,123,32,.22)",
        borderRadius: 16, padding: "1.6rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <h4 style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>
            Want a personalised choice list done for you?
          </h4>
          <p style={{ fontSize: ".88rem", color: "var(--muted)" }}>
            Skip the guesswork. Our JoSAA 2026 expert plan gives you a ready-to-fill, rank-specific choice list for just ₹999.
          </p>
        </div>
        <Link to="/josaa-2026" className="btn btn-coral" style={{ flexShrink: 0 }}>
          Get my ₹999 plan <ArrowRight size={15} />
        </Link>
      </div>
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
      <section style={{ background: "#1c1c28", padding: "32px 0" }}>
        <div className="container">
          <div className="grid-4" style={{ gap: 16 }}>
            {STATS.map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "rgba(255,255,255,0.06)", borderRadius: 14,
                padding: "16px 20px", border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}22`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon size={22} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 20, color: "#fff" }}>{value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginTop: 2 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Predictor Cards ── */}
      <PredictorCards />

      {/* ── JEE Main & Advanced ── */}
      <HomeSection
        eyebrow="Exams 2026"
        title="JEE Main & JEE Advanced — choose your path"
        bg="var(--sky)"
        sub="Two exams, two doors to the top engineering colleges. Tap either to open its full guide, rank predictor and real cutoffs."
      >
        <div className="grid-2" style={{ gap: 24, alignItems: "stretch" }}>
          {EXAMS.map((ex) => <ExamCard key={ex.key} ex={ex} />)}
        </div>

        {/* quick comparison strip */}
        <div className="card" style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-around", textAlign: "center", padding: "20px 24px" }}>
          {[
            ["1", "Clear JEE Main", "Qualify for NIT/IIIT/GFTI seats"],
            ["2", "Top 2.5L → Advanced", "Become eligible for the IITs"],
            ["3", "Clear JEE Advanced", "Get into one of the 23 IITs"],
          ].map(([n, t, s]) => (
            <div key={n} style={{ flex: "1 1 200px", minWidth: 180 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--coral)", color: "#fff", fontFamily: "Sora", fontWeight: 800, display: "grid", placeItems: "center", margin: "0 auto 8px" }}>{n}</div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)", fontSize: 14.5 }}>{t}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{s}</div>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* ── JoSAA 2026 Counselling Promo ── */}
      <JoSAAPromoSection />

      {/* ── How to Pick the Right College ── */}
      <CollegePickingGuide />

      {/* ── NITs & IIITs Deep Dive ── */}
      <InstitutesSection />

      {/* ── Seat Distribution Chart ── */}
      <HomeSection
        eyebrow="Seat Matrix"
        title="Total Seats Available (JoSAA 2025)"
        sub="Approximate seat distribution across IITs, NITs, IIITs and GFTIs via JoSAA counselling."
      >
        <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 16 }}>Seat distribution by institute type</h4>
            <CenterDonut
              data={SEAT_DATA}
              centerLabel="60K+"
              centerSub="total seats"
              colors={["#F97316", "#0EA5A4", "#15a06e", "#1c1c28"]}
              height={260}
              fmt={(v) => v.toLocaleString("en-IN")}
            />
          </div>
          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 16 }}>Branch-wise demand index</h4>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Higher index = more competitive cutoffs across top institutes.</p>
            <Bars
              data={BRANCH_DEMAND}
              bars={[{ key: "value", label: "Demand Index", color: "#F97316" }]}
              height={260}
            />
          </div>
        </div>
      </HomeSection>

      {/* ── New Tools ── */}
      <NewTools />

      {/* ── Application Radar ── */}
      <ApplicationRadar />

      {/* ── Entrance Exams ── */}
      <EntranceExams />

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