import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Phone, MessageCircle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  Star, Users, Award, ShieldCheck, MapPin, GraduationCap, Sparkles, Check,
  ClipboardList, Target, CalendarCheck, Quote, TrendingUp,
} from "lucide-react";
import Reveal from "../Reveal.jsx";

/* ════════════════════════════════════════════════
   CONTACT
════════════════════════════════════════════════ */
const WA_NUMBER = "917877596464";
const PHONE_DISPLAY = "+91 78775 96464";
const PHONE_TEL = "+917877596464";
const PRICE = "499";
const FORM_LINK = "https://forms.gle/AsfEKer3xBnpu7bB6";
const WA_LINK =
  `https://wa.me/${WA_NUMBER}?text=` +
  encodeURIComponent("Hi! I scored a rank between 80,000–9,00,000 in JEE Main. I'd like to enrol in the ₹499 college counselling plan.");

/* ════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════ */
const CATEGORIES = [
  { icon: "🏛️", title: "NITs", sub: "National Institutes of Technology", desc: "Home-state quota seats open up many NITs even at 80K–2L. We map HS vs OS cutoffs for your category.", color: "#F97316" },
  { icon: "🔬", title: "IIITs", sub: "Institutes of Information Technology", desc: "CS/IT focused institutes — several newer IIITs are reachable in your range via JoSAA & CSAB rounds.", color: "#6366f1" },
  { icon: "🏫", title: "GFTIs", sub: "Govt.-Funded Technical Institutes", desc: "Low-fee, government-backed colleges with relaxed cutoffs — strong safe choices for your list.", color: "#0ea5a4" },
  { icon: "🏢", title: "State Govt. Colleges", sub: "Category-wise: General · OBC · SC/ST", desc: "State boards reserve big quotas. We guide you category-wise so you use every reservation advantage.", color: "#15a06e" },
  { icon: "🏗️", title: "Semi-Govt / Autonomous", sub: "Deemed & autonomous institutes", desc: "Autonomous colleges with industry tie-ups and flexible admission — great mid-range options.", color: "#8b5cf6" },
  { icon: "🎓", title: "Top Private Colleges", sub: "State-wise & all-India", desc: "Hand-picked private colleges with strong placements that genuinely fit your rank and budget.", color: "#f59e0b" },
];

const STEPS = [
  { icon: Target, title: "Enter Your JEE Rank & Category", desc: "Share your CRL / category rank and reservation details to begin." },
  { icon: MapPin, title: "Select Preferred States / Branches", desc: "Pick the states and branches you care about most." },
  { icon: ClipboardList, title: "Get Predicted College List", desc: "We generate a list based on previous-year cut-offs." },
  { icon: Users, title: "Book a 1-on-1 Counsellor Session", desc: "Talk to an expert who builds a plan around your goals." },
  { icon: CalendarCheck, title: "Application & Admission Guidance", desc: "We guide you through forms, documents and deadlines." },
];

const RANK_RANGES = [
  { range: "80K – 2L", color: "#15a06e", tag: "Strong options", options: ["Newer NITs (HS quota)", "Several IIITs", "GFTIs", "Top private (CSE)"] },
  { range: "2L – 5L", color: "#F97316", tag: "Good balance", options: ["State Govt. colleges", "GFTIs (core branches)", "Reputed private colleges", "Autonomous institutes"] },
  { range: "5L – 9L", color: "#6366f1", tag: "Smart choices", options: ["Private engineering colleges", "Deemed universities", "State quota seats", "Management / scholarship seats"] },
];

const STORIES = [
  { name: "Rahul Sharma", city: "Patna, Bihar", rank: "1,42,000", category: "OBC-NCL", college: "GFTI — CSE", quote: "I thought my rank was too low for a good college. The counsellor found me a CSE seat I didn't even know existed.", note: "GFTI cut-off was relaxed for OBC-NCL — a branch most aggregators had marked 'out of reach'." },
  { name: "Priya Mehta", city: "Indore, MP", rank: "3,10,000", category: "General", college: "State Govt. — IT", quote: "Home-state quota changed everything. Got into a government college close to home with great placements.", note: "Home-state quota dropped her effective cut-off by ~40% vs the all-India list." },
  { name: "Aman Kumar", city: "Jaipur, Rajasthan", rank: "5,80,000", category: "EWS", college: "Top Private — AI/ML", quote: "Their list was honest and realistic. I joined a private college with a strong AI program and a scholarship.", note: "Bagged a merit scholarship that cut 30% off the fee — flagged by the counsellor during the call." },
  { name: "Sneha Reddy", city: "Hyderabad, Telangana", rank: "2,05,000", category: "General", college: "IIIT — ECE", quote: "The CSAB round guidance got me an IIIT seat in the last round. Forever grateful for the deadline reminders!", note: "Seat allotted in the final CSAB special round — most students had already stopped checking." },
  { name: "Vikram Singh", city: "Lucknow, UP", rank: "4,25,000", category: "SC", college: "State Govt. — Mechanical", quote: "I almost gave up after JoSAA. The team mapped my state counselling options and I got a core branch seat.", note: "Switched focus to state counselling (UPCET) after JoSAA — that's where his seat finally came through." },
  { name: "Ananya Das", city: "Kolkata, WB", rank: "7,40,000", category: "General", college: "Deemed Univ. — Data Science", quote: "Even at 7.4 lakh I landed a future-proof branch. The Safe–Moderate–Reach list took all the panic away.", note: "Avoided two overpriced colleges the counsellor flagged for weak placement records." },
];

const PLAN_INCLUDES = [
  "Personalised college list for YOUR rank & category",
  "Covers NITs · IIITs · GFTIs · State · Private · Deemed",
  "1-on-1 expert counsellor call (45 min)",
  "Choice-filling order — JoSAA + CSAB + State boards",
  "Home-state & reservation quota optimisation",
  "Safe / Moderate / Reach list, mistake-proofed",
  "Document & deadline checklist",
  "WhatsApp support till your seat is locked",
];

const PLAN_BULLETS = [
  "Built for the 80,000 – 9,00,000 rank band specifically",
  "Every college category covered — not just NITs",
  "Honest, data-backed advice (no overpriced colleges pushed)",
  "Guidance through every round until you have a seat",
];

const FAQS = [
  { q: "Can I get an NIT with rank 1.5 lakh?", a: "Yes — through home-state quota and reserved categories, several NITs admit students around the 1–1.5 lakh range, especially in core branches. We check both HS and OS cut-offs for your exact category before advising." },
  { q: "Which private colleges are worth it?", a: "We only recommend private colleges with verified placement records, NAAC/NBA accreditation and reasonable fees. We match them to your budget and branch preference so you avoid overpriced options." },
  { q: "How does home-state quota work?", a: "NITs and most state colleges reserve ~50% of seats for students from the home state, with significantly relaxed cut-offs. If you qualify, your effective rank is far stronger — we factor this into your list." },
  { q: "What documents do I need for counselling?", a: "Typically: JEE Main scorecard & rank card, Class 10 & 12 mark sheets, category/caste certificate (if applicable), domicile certificate, ID proof and passport photos. We give you a full personalised checklist." },
  { q: "Is the first counselling session really free?", a: "Yes. Your first 1-on-1 session is completely free — you get a realistic college list and a clear plan with no obligation to continue." },
];

const TRUST = [
  { icon: Users, label: "10,000+ Students Counselled" },
  { icon: Award, label: "Expert Advisors" },
  { icon: ShieldCheck, label: "Free First Session" },
];

/* ════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════ */
export default function RankCounselling() {
  const [openFaq, setOpenFaq] = useState(0);
  const [story, setStory] = useState(0);
  const [paused, setPaused] = useState(false);

  // auto-rotate success stories
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStory((s) => (s + 1) % STORIES.length), 4500);
    return () => clearInterval(t);
  }, [paused]);

  const gotoStory = (i) => setStory((i + STORIES.length) % STORIES.length);

  return (
    <section
      id="rank-counselling"
      style={{ position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #fff7f0 0%, #fef3e8 45%, #fff7f0 100%)", scrollMarginTop: 80 }}
    >
      {/* ambient glow */}
      <div style={{ position: "absolute", top: -80, left: "12%", width: 420, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.14) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, right: "8%", width: 320, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 72, paddingBottom: 72 }}>

        {/* ── 1 · HERO ── */}
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto 56px" }}>
            <span className="eyebrow" style={{ background: "rgba(244,123,32,.1)", border: "1px solid rgba(244,123,32,.25)", color: "#F47B20" }}>
              <Sparkles size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
              JEE Mains College Counselling
            </span>
            <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, color: "#1a1a2e", fontSize: "clamp(1.7rem,4vw,2.7rem)", lineHeight: 1.12, letterSpacing: "-1px", margin: "16px 0 14px" }}>
              Your Rank Is Not Your Limit —{" "}
              <span style={{ background: "linear-gradient(90deg,#F47B20,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Find the Right College for You
              </span>
            </h2>
            <p style={{ color: "#4b5563", fontSize: "1.02rem", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 26px" }}>
              Dedicated guidance for JEE Mains rank holders between{" "}
              <strong style={{ color: "#1a1a2e" }}>80,000 – 9,00,000</strong>. There are thousands of great
              seats in your reach across NITs, IIITs, GFTIs, state &amp; private colleges — we help you find them.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", alignItems: "center" }}>
              <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn btn-coral btn-shimmer"
                style={{ fontSize: "1rem", padding: "14px 30px", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, position: "relative", overflow: "hidden" }}>
                Start Free Counselling <ArrowRight size={18} />
              </a>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 50, background: "#fff", border: "1.5px dashed rgba(244,123,32,.5)", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>
                <span style={{ color: "#9ca3af", textDecoration: "line-through", fontWeight: 600 }}>₹1999</span>
                Full plan <span style={{ background: "linear-gradient(90deg,#F47B20,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 16 }}>₹{PRICE}</span>
              </div>
            </div>

            {/* trust badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 26 }}>
              {TRUST.map(({ icon: Icon, label }) => (
                <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 50, background: "#fff", border: "1px solid rgba(244,123,32,.25)", boxShadow: "0 2px 10px rgba(244,123,32,.08)", fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>
                  <Icon size={15} color="#F47B20" /> {label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── 2 · COLLEGE CATEGORIES ── */}
        <Reveal>
          <SectionHead eyebrow="What we cover" title={<>Colleges across <span className="accent">every category</span></>}
            sub="From government institutes to top private colleges — counselling guidance for all of them." />
          <div className="grid-3" style={{ gap: 20, marginBottom: 64 }}>
            {CATEGORIES.map((c) => (
              <motion.div key={c.title} whileHover={{ y: -5 }}
                style={{ background: "#fff", borderRadius: 16, border: `1px solid ${c.color}22`, borderTop: `3px solid ${c.color}`, boxShadow: "0 2px 16px rgba(0,0,0,.06)", padding: "22px 22px 20px", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: `${c.color}14`, border: `1.5px solid ${c.color}28`, display: "grid", placeItems: "center", fontSize: 24 }}>{c.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#1a1a2e", margin: 0 }}>{c.title}</h3>
                    <div style={{ fontSize: 12, color: c.color, fontWeight: 600 }}>{c.sub}</div>
                  </div>
                </div>
                <p style={{ color: "#6b7280", fontSize: ".86rem", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* ── 3 · HOW COUNSELLING WORKS ── */}
        <Reveal>
          <SectionHead eyebrow="Simple process" title={<>How counselling <span className="accent">works</span></>}
            sub="Five clear steps from your rank to a confirmed admission." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 64 }}>
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(244,123,32,.16)", boxShadow: "0 2px 14px rgba(0,0,0,.05)", padding: "20px 18px", textAlign: "center", position: "relative" }}>
                  <div style={{ position: "absolute", top: 12, right: 14, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 26, color: "rgba(244,123,32,.16)" }}>{i + 1}</div>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,#F47B20,#ea580c)", display: "grid", placeItems: "center", margin: "0 auto 14px", boxShadow: "0 6px 16px rgba(244,123,32,.35)" }}>
                    <Icon size={22} color="#fff" />
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: ".92rem", color: "#1a1a2e", marginBottom: 6, lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ color: "#6b7280", fontSize: ".8rem", lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ── 4 · RANK-RANGE GUIDANCE ── */}
        <Reveal>
          <SectionHead eyebrow="Where you stand" title={<>Rank-range <span className="accent">guidance</span></>}
            sub="A quick view of what's realistically within reach for your rank band." />
          <div className="grid-3" style={{ gap: 20, marginBottom: 64 }}>
            {RANK_RANGES.map((r) => (
              <div key={r.range} style={{ background: "#fff", borderRadius: 18, border: `1px solid ${r.color}22`, boxShadow: "0 2px 16px rgba(0,0,0,.06)", overflow: "hidden", height: "100%" }}>
                <div style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}cc)`, padding: "18px 22px", color: "#fff" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, opacity: .9, letterSpacing: ".5px", textTransform: "uppercase" }}>{r.tag}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.5rem", marginTop: 2 }}>Rank {r.range}</div>
                </div>
                <div style={{ padding: "18px 22px" }}>
                  {r.options.map((o) => (
                    <div key={o} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 11 }}>
                      <CheckCircle2 size={16} color={r.color} style={{ marginTop: 1, flexShrink: 0 }} />
                      <span style={{ fontSize: ".88rem", color: "#374151", lineHeight: 1.45 }}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── 4b · ₹499 COUNSELLING PLAN CARD ── */}
        <Reveal>
          <SectionHead eyebrow="Counselling Plan" title={<>One plan for <span className="accent">all colleges</span></>}
            sub="Built for the 80,000 – 9,00,000 rank band — NITs, IIITs, GFTIs, State, Private & Deemed, all covered." />
          <div className="grid-2" style={{ gap: 32, alignItems: "center", marginBottom: 64 }}>
            {/* LEFT — pitch */}
            <div>
              <div className="josaa-promo-badge" style={{ marginBottom: 18 }}>
                <span className="pulse-dot" />
                Free first session · then just ₹{PRICE}
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, color: "#1a1a2e", fontSize: "clamp(1.4rem,2.6vw,2rem)", lineHeight: 1.2, marginBottom: 14, letterSpacing: "-0.5px" }}>
                Everything you need to turn your rank into a{" "}
                <span style={{ background: "linear-gradient(90deg,#F47B20,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>confirmed seat</span>
              </h3>
              <p style={{ color: "#4b5563", fontSize: ".96rem", lineHeight: 1.7, marginBottom: 20 }}>
                Most students in the 80K–9L range lose good seats simply because they don't know every option open to them. Our ₹{PRICE} plan gives you a complete, data-backed roadmap across all college categories.
              </p>
              <div className="josaa-bullets">
                {PLAN_BULLETS.map((b) => (
                  <div className="josaa-bullet" key={b}>
                    <span className="josaa-bullet-icon">✓</span>
                    {b}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 22, flexWrap: "wrap", fontSize: 13, color: "#6b7280" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Users size={14} color="#fb923c" /> 10,000+ counselled</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Star size={14} color="#fbbf24" fill="#fbbf24" /> 4.8/5 rating</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Award size={14} color="#fb923c" /> Expert advisors</span>
              </div>
            </div>

            {/* RIGHT — price card (matches ₹249 card style) */}
            <div className="josaa-price-card">
              <div className="josaa-save-ribbon">SAVE 75%</div>
              <div className="josaa-price-header">
                <div className="josaa-price-header-mesh" />
                <div className="josaa-price-header-glow" />
                <div className="josaa-price-header-top">
                  <div className="josaa-price-header-icon">
                    <GraduationCap size={22} color="#fff" />
                  </div>
                  <span className="josaa-price-header-tag">All Colleges · Rank 80K–9L</span>
                </div>
                <div className="limited-tag">🔥 Limited slots this cycle</div>
                <div className="josaa-price-row">
                  <div className="josaa-old-price">₹1999</div>
                  <span className="josaa-off-pill">75% OFF</span>
                </div>
                <div className="josaa-new-price">
                  <span className="josaa-rupee">₹</span>{PRICE}
                  <span className="josaa-per">/plan</span>
                </div>
                <div className="josaa-price-label">one-time · all counselling rounds</div>
              </div>

              <div className="josaa-price-body">
                <div className="josaa-includes">
                  {PLAN_INCLUDES.map((item) => (
                    <div className="josaa-include-item" key={item}>
                      <Check size={15} color="#22c55e" strokeWidth={2.5} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <a href={FORM_LINK} target="_blank" rel="noreferrer" className="josaa-cta-btn">
                  Enrol Now — ₹{PRICE} <ArrowRight size={17} />
                </a>
                <div className="josaa-secure-note">
                  <ShieldCheck size={13} />
                  Secure · counsellor assigned within hours
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── 7 · SUCCESS STORIES (dynamic carousel) ── */}
        <Reveal>
          <SectionHead eyebrow="Real results" title={<>Success <span className="accent">stories</span></>}
            sub="Students with ranks like yours who found the right college." />
          <div
            style={{ position: "relative", maxWidth: 820, margin: "0 auto 64px" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div style={{ position: "relative", minHeight: 320 }}>
              <AnimatePresence mode="wait">
                {(() => {
                  const s = STORIES[story];
                  return (
                    <motion.div
                      key={story}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4 }}
                      style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(244,123,32,.2)", boxShadow: "0 10px 40px rgba(244,123,32,.12)", padding: "30px 32px", position: "relative", overflow: "hidden" }}
                    >
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#F47B20,#fbbf24,#F47B20)" }} />
                      <Quote size={48} color="rgba(244,123,32,.14)" style={{ position: "absolute", top: 20, right: 24 }} />

                      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={17} color="#fbbf24" fill="#fbbf24" />)}
                      </div>
                      <p style={{ color: "#1a1a2e", fontSize: "1.08rem", lineHeight: 1.65, fontWeight: 500, marginBottom: 16, position: "relative", zIndex: 1 }}>“{s.quote}”</p>

                      {/* notable note */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 9, background: "linear-gradient(135deg,#fff7f0,#fef0e2)", border: "1px solid rgba(244,123,32,.25)", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
                        <TrendingUp size={17} color="#F47B20" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: ".84rem", color: "#7c3a12", lineHeight: 1.5, fontWeight: 600 }}>
                          <strong style={{ color: "#ea580c" }}>What worked:</strong> {s.note}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 14, borderTop: "1px solid rgba(0,0,0,.07)", paddingTop: 16, flexWrap: "wrap" }}>
                        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg,#F47B20,#ea580c)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 18, fontFamily: "'Space Grotesk',sans-serif", flexShrink: 0 }}>{s.name[0]}</div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: ".98rem", fontFamily: "'Space Grotesk',sans-serif" }}>{s.name}</div>
                          <div style={{ fontSize: ".8rem", color: "#6b7280" }}>{s.city}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: ".74rem", fontWeight: 700, color: "#6366f1", background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.25)", padding: "5px 11px", borderRadius: 50 }}>Rank {s.rank}</span>
                          <span style={{ fontSize: ".74rem", fontWeight: 700, color: "#15a06e", background: "rgba(21,160,110,.1)", border: "1px solid rgba(21,160,110,.25)", padding: "5px 11px", borderRadius: 50 }}>{s.category}</span>
                          <span style={{ fontSize: ".74rem", fontWeight: 700, color: "#F47B20", background: "rgba(244,123,32,.1)", border: "1px solid rgba(244,123,32,.25)", padding: "5px 11px", borderRadius: 50 }}>{s.college}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20 }}>
              <button onClick={() => gotoStory(story - 1)} aria-label="Previous story"
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(244,123,32,.3)", background: "#fff", color: "#F47B20", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                <ChevronLeft size={20} />
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                {STORIES.map((_, i) => (
                  <button key={i} onClick={() => gotoStory(i)} aria-label={`Story ${i + 1}`}
                    style={{ width: i === story ? 26 : 9, height: 9, borderRadius: 50, border: "none", cursor: "pointer", background: i === story ? "linear-gradient(90deg,#F47B20,#ea580c)" : "rgba(244,123,32,.25)", transition: "all .3s" }} />
                ))}
              </div>
              <button onClick={() => gotoStory(story + 1)} aria-label="Next story"
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(244,123,32,.3)", background: "#fff", color: "#F47B20", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </Reveal>

        {/* ── 8 · FAQ ── */}
        <Reveal>
          <SectionHead eyebrow="Got questions?" title={<>Frequently asked <span className="accent">questions</span></>}
            sub="Everything you need to know before you start." />
          <div style={{ maxWidth: 760, margin: "0 auto 64px" }}>
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${open ? "rgba(244,123,32,.4)" : "rgba(0,0,0,.08)"}`, boxShadow: open ? "0 4px 18px rgba(244,123,32,.12)" : "0 1px 8px rgba(0,0,0,.04)", marginBottom: 12, overflow: "hidden", transition: "all .2s" }}>
                  <button onClick={() => setOpenFaq(open ? -1 : i)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#1a1a2e" }}>
                    {f.q}
                    <ChevronDown size={18} color="#F47B20" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                  </button>
                  {open && (
                    <div style={{ padding: "0 20px 18px", color: "#4b5563", fontSize: ".9rem", lineHeight: 1.65 }}>{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ── 9 · CTA FOOTER BANNER ── */}
        <Reveal>
          <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 55%, #3d1d0f 100%)", borderRadius: 22, padding: "40px 36px", position: "relative", overflow: "hidden", boxShadow: "0 16px 50px rgba(26,26,46,.35)" }}>
            <div style={{ position: "absolute", top: -40, right: -20, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.3) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
              <div style={{ maxWidth: 520 }}>
                <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, color: "#fff", fontSize: "clamp(1.4rem,3vw,2rem)", lineHeight: 1.2, marginBottom: 10 }}>
                  Don't Miss Your Admission Deadline —{" "}
                  <span style={{ background: "linear-gradient(90deg,#fbbf24,#F47B20)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Talk to a Counsellor Today</span>
                </h3>
                <p style={{ color: "rgba(255,255,255,.7)", fontSize: ".95rem", lineHeight: 1.6 }}>
                  Free first session · personalised college list · guidance through every round.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 16, padding: "10px 18px", borderRadius: 50, background: "rgba(244,123,32,.15)", border: "1px solid rgba(244,123,32,.4)" }}>
                  <span style={{ color: "rgba(255,255,255,.6)", textDecoration: "line-through", fontSize: 14 }}>₹1999</span>
                  <span style={{ color: "#fff", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", fontSize: 18 }}>₹{PRICE}</span>
                  <span style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700 }}>complete plan</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 240 }}>
                <a href={WA_LINK} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#25D366", color: "#fff", padding: "14px 24px", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", textDecoration: "none", boxShadow: "0 8px 24px rgba(37,211,102,.4)" }}>
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
                <a href={`tel:${PHONE_TEL}`}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.25)", color: "#fff", padding: "14px 24px", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", textDecoration: "none" }}>
                  <Phone size={17} /> {PHONE_DISPLAY}
                </a>
                <a href={FORM_LINK} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, color: "rgba(255,255,255,.85)", fontSize: 13.5, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>
                  Or fill the enrolment form <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

/* ── shared section heading ── */
function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="title-bar" style={{ marginBottom: 32 }}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title" style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", color: "#1a1a2e" }}>{title}</h2>
      {sub && <p className="section-sub" style={{ color: "#4b5563" }}>{sub}</p>}
    </div>
  );
}
