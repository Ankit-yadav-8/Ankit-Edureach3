import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Phone, MessageCircle, ChevronDown, ChevronLeft, ChevronRight,
  Star, Users, Award, ShieldCheck, GraduationCap, Sparkles, Check,
  Quote, TrendingUp, Flame,
} from "lucide-react";
import Reveal from "../Reveal.jsx";
import { useEnrol } from "../EnrolModal.jsx";
import MentorshipHome from "./MentorshipHome.jsx";

/* ════════════════════════════════════════════════
   CONTACT
════════════════════════════════════════════════ */
const WA_NUMBER = "917877596464";
const PHONE_DISPLAY = "+91 78775 96464";
const PHONE_TEL = "+917877596464";
const PRICE = "499";
const WA_LINK =
  `https://wa.me/${WA_NUMBER}?text=` +
  encodeURIComponent("Hi! I have my JEE Main rank and I'd like to enrol in the college counselling plan.");

/* ════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════ */
const STORIES = [
  { name: "Rahul Sharma", city: "Patna, Bihar", rank: "1,42,000", category: "OBC-NCL", college: "GFTI — CSE", quote: "I thought my rank was too low for a good college. The counsellor found me a CSE seat I didn't even know existed.", note: "GFTI cut-off was relaxed for OBC-NCL — a branch most aggregators had marked 'out of reach'." },
  { name: "Priya Mehta", city: "Indore, MP", rank: "3,10,000", category: "General", college: "State Govt. — IT", quote: "Home-state quota changed everything. Got into a government college close to home with great placements.", note: "Home-state quota dropped her effective cut-off by ~40% vs the all-India list." },
  { name: "Aman Kumar", city: "Jaipur, Rajasthan", rank: "5,80,000", category: "EWS", college: "Top Private — AI/ML", quote: "Their list was honest and realistic. I joined a private college with a strong AI program and a scholarship.", note: "Bagged a merit scholarship that cut 30% off the fee — flagged by the counsellor during the call." },
  { name: "Sneha Reddy", city: "Hyderabad, Telangana", rank: "2,05,000", category: "General", college: "IIIT — ECE", quote: "The CSAB round guidance got me an IIIT seat in the last round. Forever grateful for the deadline reminders!", note: "Seat allotted in the final CSAB special round — most students had already stopped checking." },
  { name: "Vikram Singh", city: "Lucknow, UP", rank: "4,25,000", category: "SC", college: "State Govt. — Mechanical", quote: "I almost gave up after JoSAA. The team mapped my state counselling options and I got a core branch seat.", note: "Switched focus to state counselling (UPCET) after JoSAA — that's where his seat finally came through." },
  { name: "Ananya Das", city: "Kolkata, WB", rank: "7,40,000", category: "General", college: "Deemed Univ. — Data Science", quote: "Even at 7.4 lakh I landed a future-proof branch. The Safe–Moderate–Reach list took all the panic away.", note: "Avoided two overpriced colleges the counsellor flagged for weak placement records." },
];

/* ── The two counselling plans shown side-by-side ── */
const PLANS = [
  {
    key: "josaa",
    icon: Award,
    tag: "JoSAA + CSAB 2026",
    band: "Strong ranks · IITs / NITs / IIITs",
    price: "299",
    old: "1999",
    off: "85% OFF",
    save: "SAVE 85%",
    label: "one-time · all JoSAA + CSAB rounds",
    blurb: "Best when your rank is strong — secure the best possible IIT, NIT, IIIT or GFTI seat through the official JoSAA & CSAB rounds.",
    includes: [
      "Personalised choice list (your rank + category)",
      "1-on-1 mentor call — 45 min",
      "Round-wise allotment prediction",
      "WhatsApp support till seat locked",
      "Document & deadline checklist",
      "Choice review before you lock",
    ],
    cta: "Enrol Now — ₹299",
    to: "/josaa-2026",
    external: false,
    featured: false,
  },
  {
    key: "all-colleges",
    icon: GraduationCap,
    tag: "All Colleges · Any Rank",
    band: "Higher ranks · State / Private / Deemed",
    price: "499",
    old: "1999",
    off: "75% OFF",
    save: "SAVE 75%",
    label: "one-time · all counselling rounds",
    blurb: "Got a high rank? Don't settle. Join us and our experts land you a better college across NITs, GFTIs, State, Private & Deemed institutes you'd otherwise miss.",
    includes: [
      "Personalised college list for YOUR rank & category",
      "Covers NITs · IIITs · GFTIs · State · Private · Deemed",
      "1-on-1 expert counsellor call (45 min)",
      "Choice-filling order — JoSAA + CSAB + State boards",
      "Home-state & reservation quota optimisation",
      "Safe / Moderate / Reach list, mistake-proofed",
      "Document & deadline checklist",
      "WhatsApp support till your seat is locked",
    ],
    cta: "Enrol Now — ₹499",
    featured: true,
  },
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
  const { open: openEnrol } = useEnrol();
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
      style={{ position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #ffffff 0%, #ffffff 45%, #ffffff 100%)", scrollMarginTop: 80 }}
    >
      {/* ambient glow */}

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 72, paddingBottom: 16 }}>

        {/* ── 1 · HERO ── */}
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto 56px" }}>
            <span className="eyebrow" style={{ background: "rgba(244,123,32,.1)", border: "1px solid rgba(244,123,32,.25)", color: "#F15A38" }}>
              <Sparkles size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
              JEE Mains College Counselling
            </span>
            <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, color: "#1a1a2e", fontSize: "clamp(1.7rem,4vw,2.7rem)", lineHeight: 1.12, letterSpacing: "-1px", margin: "16px 0 14px" }}>
              Your Rank Is Not Your Limit —{" "}
              <span style={{ background: "linear-gradient(90deg,#F15A38,#E0421F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Find the Right College for You
              </span>
            </h2>
            <p style={{ color: "#4b5563", fontSize: "1.02rem", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 26px" }}>
              Dedicated guidance for every JEE Mains rank holder. Whatever your rank, there are
              thousands of great seats in your reach across NITs, IIITs, GFTIs, state &amp; private
              colleges — we help you find them.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", alignItems: "center" }}>
              <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn btn-coral"
                style={{ fontSize: "1rem", padding: "14px 30px", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>
                Start Free Counselling <ArrowRight size={18} />
              </a>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 50, background: "#fff", border: "1.5px dashed rgba(244,123,32,.5)", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>
                <span style={{ color: "#9ca3af", textDecoration: "line-through", fontWeight: 600 }}>₹1999</span>
                Full plan <span style={{ background: "linear-gradient(90deg,#F15A38,#E0421F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 16 }}>₹{PRICE}</span>
              </div>
            </div>

            {/* trust badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 26 }}>
              {TRUST.map(({ icon: Icon, label }) => (
                <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 50, background: "#fff", border: "1px solid rgba(244,123,32,.25)", boxShadow: "0 2px 10px rgba(244,123,32,.08)", fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>
                  <Icon size={15} color="#F15A38" /> {label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── 2 · COUNSELLING PLANS (₹299 + ₹499) ── */}
        <Reveal>
          <SectionHead eyebrow="Counselling Plans" title={<>One plan for <span className="accent">all colleges</span></>}
            sub="Pick the plan that fits your rank — expert, data-backed counselling that turns your rank into a confirmed seat." />
          <div className="counsel-plans" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22, maxWidth: 760, margin: "36px auto 0", alignItems: "stretch" }}>
            {PLANS.map((p, i) => {
              const Icon = p.icon;
              const featured = p.featured;
              const color = featured ? "#6366f1" : "#F15A38";
              const ctaStyle = {
                margin: "auto 24px 24px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: `linear-gradient(135deg,${color},#F15A38)`, color: "#fff",
                padding: "13px 20px", borderRadius: 12, fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: 800, fontSize: 14.5, textDecoration: "none", boxShadow: `0 10px 24px -8px ${color}aa`,
              };
              return (
                <Reveal key={p.key} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    style={{
                      position: "relative", height: "100%", display: "flex", flexDirection: "column",
                      background: "#fff", borderRadius: 20, overflow: "hidden",
                      border: `1px solid ${color}33`,
                      boxShadow: featured ? `0 28px 60px -28px ${color}88, 0 0 0 2px ${color}44` : `0 18px 44px -26px ${color}77`,
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${color},#F15A38)` }} />
                    {featured && (
                      <div style={{ position: "absolute", top: 14, right: -34, transform: "rotate(45deg)", background: `linear-gradient(135deg,${color},#818cf8)`, color: "#fff", fontWeight: 800, fontSize: 10.5, letterSpacing: "0.5px", padding: "4px 40px", boxShadow: "0 4px 12px rgba(0,0,0,.2)" }}>
                        MOST POPULAR
                      </div>
                    )}

                    <div style={{ padding: "26px 24px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 13, background: `${color}16`, border: `1px solid ${color}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <Icon size={24} color={color} />
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.18rem", color: "#1a1a2e", margin: 0, lineHeight: 1.2 }}>{p.tag}</h3>
                          <span style={{ fontSize: 12, color, fontWeight: 700 }}>{p.band}</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 8 }}>
                        <span style={{ fontSize: 16, color: "#9ca3af", textDecoration: "line-through", textDecorationColor: "#ef4444" }}>₹{p.old}</span>
                        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 34, color: "#1a1a2e" }}>₹{p.price}</span>
                        <span style={{ fontSize: 12.5, color: "#6b7280" }}>one-time</span>
                      </div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 800, color: "#dc2626", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)", padding: "4px 10px", borderRadius: 50, marginBottom: 12 }}>
                        {p.off} · limited slots
                      </div>

                      <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>{p.blurb}</p>
                    </div>

                    <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
                      {p.includes.map((pt) => (
                        <div key={pt} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <span style={{ width: 18, height: 18, borderRadius: "50%", background: `${color}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                            <Check size={12} color={color} strokeWidth={3} />
                          </span>
                          <span style={{ color: "#374151", fontSize: 13.3 }}>{pt}</span>
                        </div>
                      ))}
                    </div>

                    {p.to ? (
                      <Link to={p.to} style={ctaStyle}>{p.cta} <ArrowRight size={16} /></Link>
                    ) : (
                      <button type="button" onClick={() => openEnrol(p.key)} style={{ ...ctaStyle, border: "none", cursor: "pointer" }}>{p.cta} <ArrowRight size={16} /></button>
                    )}
                  </motion.div>
                </Reveal>
              );
            })}
          </div>

          {/* trust strip under the plans */}
          <div className="plan-trust-strip">
            <span><Users size={15} color="#F15A38" /> 10,000+ counselled</span>
            <span><Star size={15} color="#fbbf24" fill="#fbbf24" /> 4.8/5 rating</span>
            <span><Award size={15} color="#F15A38" /> Expert advisors</span>
            <span><ShieldCheck size={15} color="#F15A38" /> Free first session</span>
          </div>
        </Reveal>
      </div>

      {/* ── Mentorship (just below the ₹299 / ₹499 plans) ── */}
      <MentorshipHome />

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 16, paddingBottom: 72 }}>

        {/* ── 7 · SUCCESS STORIES (left) + EXPLORE MENTORSHIP (right) on desktop ── */}
        <div className="cta-merge-grid-rev">
          {/* Explore Mentorship — source first → right column on desktop, on top on mobile */}
          <Reveal delay={0.1} style={{ display: "flex" }}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{
                width: "100%",
                background: "linear-gradient(160deg, #fff7ef 0%, #ffffff 55%, #fff3e6 100%)",
                border: "1px solid rgba(244,123,32,.28)",
                borderRadius: 20, padding: "30px", position: "relative", overflow: "hidden",
                boxShadow: "0 18px 50px -28px rgba(244,123,32,.45)",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14,
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#F15A38,#F15A38)" }} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#c2410c", background: "rgba(244,123,32,.1)", border: "1px solid rgba(244,123,32,.28)", padding: "5px 12px", borderRadius: 50 }}>
                <Flame size={14} /> Serious aspirants only
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, color: "#1a1a2e", fontSize: "clamp(1.3rem,2.4vw,1.7rem)", lineHeight: 1.2, margin: 0 }}>
                The earlier you start, the higher you rank.
              </h3>
              <p style={{ color: "#5b6472", fontSize: ".95rem", lineHeight: 1.7, margin: 0 }}>
                1-on-1 mentorship from IITians &amp; doctors who&apos;ve cracked JEE and NEET — a personalised plan, daily accountability, and the strategy that actually moves your rank. Seats are limited each batch, because a mentor can only guide so many students well.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, width: "100%", margin: "2px 0" }}>
                {[
                  "Personal IITian / doctor mentor",
                  "Weekly targets & honest test analysis",
                  "Backlog-clearing + final rank-push plan",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.6, color: "#374151" }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(244,123,32,.14)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Check size={12} color="#F15A38" strokeWidth={3} />
                    </span>
                    {t}
                  </div>
                ))}
              </div>
              <Link
                to="/mentorship/jee-2027"
                style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 9, background: "linear-gradient(135deg,#F15A38,#F15A38)", color: "#fff", padding: "14px 26px", borderRadius: 12, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 12px 28px -8px rgba(244,123,32,.6)" }}
              >
                Explore Mentorship <ArrowRight size={17} />
              </Link>
            </motion.div>
          </Reveal>

          {/* Success stories — source last → left column on desktop */}
          <Reveal>
            <SectionHead eyebrow="Real results" title={<>Success <span className="accent">stories</span></>}
              sub="Students with ranks like yours who found the right college." />
          <div
            style={{ position: "relative", maxWidth: "none", margin: 0 }}
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
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#F15A38,#fbbf24,#F15A38)" }} />
                      <Quote size={48} color="rgba(244,123,32,.14)" style={{ position: "absolute", top: 20, right: 24 }} />

                      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={17} color="#fbbf24" fill="#fbbf24" />)}
                      </div>
                      <p style={{ color: "#1a1a2e", fontSize: "1.08rem", lineHeight: 1.65, fontWeight: 500, marginBottom: 16, position: "relative", zIndex: 1 }}>“{s.quote}”</p>

                      {/* notable note */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 9, background: "linear-gradient(135deg,#ffffff,#ffffff)", border: "1px solid rgba(244,123,32,.25)", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
                        <TrendingUp size={17} color="#F15A38" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: ".84rem", color: "#7c3a12", lineHeight: 1.5, fontWeight: 600 }}>
                          <strong style={{ color: "#E0421F" }}>What worked:</strong> {s.note}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 14, borderTop: "1px solid rgba(0,0,0,.07)", paddingTop: 16, flexWrap: "wrap" }}>
                        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg,#F15A38,#E0421F)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 18, fontFamily: "'Space Grotesk',sans-serif", flexShrink: 0 }}>{s.name[0]}</div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: ".98rem", fontFamily: "'Space Grotesk',sans-serif" }}>{s.name}</div>
                          <div style={{ fontSize: ".8rem", color: "#6b7280" }}>{s.city}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: ".74rem", fontWeight: 700, color: "#6366f1", background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.25)", padding: "5px 11px", borderRadius: 50 }}>Rank {s.rank}</span>
                          <span style={{ fontSize: ".74rem", fontWeight: 700, color: "#15a06e", background: "rgba(21,160,110,.1)", border: "1px solid rgba(21,160,110,.25)", padding: "5px 11px", borderRadius: 50 }}>{s.category}</span>
                          <span style={{ fontSize: ".74rem", fontWeight: 700, color: "#F15A38", background: "rgba(244,123,32,.1)", border: "1px solid rgba(244,123,32,.25)", padding: "5px 11px", borderRadius: 50 }}>{s.college}</span>
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
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(244,123,32,.3)", background: "#fff", color: "#F15A38", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                <ChevronLeft size={20} />
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                {STORIES.map((_, i) => (
                  <button key={i} onClick={() => gotoStory(i)} aria-label={`Story ${i + 1}`}
                    style={{ width: i === story ? 26 : 9, height: 9, borderRadius: 50, border: "none", cursor: "pointer", background: i === story ? "linear-gradient(90deg,#F15A38,#E0421F)" : "rgba(244,123,32,.25)", transition: "all .3s" }} />
                ))}
              </div>
              <button onClick={() => gotoStory(story + 1)} aria-label="Next story"
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(244,123,32,.3)", background: "#fff", color: "#F15A38", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          </Reveal>
        </div>

        {/* ── 8 · FAQ (left) + TALK TO A COUNSELLOR (right) on desktop ── */}
        <div className="cta-merge-grid">
          <Reveal>
            <SectionHead eyebrow="Got questions?" title={<>Frequently asked <span className="accent">questions</span></>}
              sub="Everything you need to know before you start." />
          <div style={{ maxWidth: "none", margin: 0 }}>
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${open ? "rgba(244,123,32,.4)" : "rgba(0,0,0,.08)"}`, boxShadow: open ? "0 4px 18px rgba(244,123,32,.12)" : "0 1px 8px rgba(0,0,0,.04)", marginBottom: 12, overflow: "hidden", transition: "all .2s" }}>
                  <button onClick={() => setOpenFaq(open ? -1 : i)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#1a1a2e" }}>
                    {f.q}
                    <ChevronDown size={18} color="#F15A38" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                  </button>
                  {open && (
                    <div style={{ padding: "0 20px 18px", color: "#4b5563", fontSize: ".9rem", lineHeight: 1.65 }}>{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ── 9 · CTA FOOTER BANNER (right column beside FAQ) ── */}
          <Reveal style={{ display: "flex" }}>
            <div style={{ width: "100%", background: "linear-gradient(160deg, #fff7ef 0%, #ffffff 55%, #fff3e6 100%)", border: "1px solid rgba(244,123,32,.28)", borderRadius: 20, padding: "30px", position: "relative", overflow: "hidden", boxShadow: "0 18px 50px -28px rgba(244,123,32,.45)", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#F15A38,#F15A38)" }} />
              <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#c2410c", background: "rgba(244,123,32,.1)", border: "1px solid rgba(244,123,32,.28)", padding: "5px 12px", borderRadius: 50 }}>
                <Sparkles size={13} /> Free first session
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, color: "#1a1a2e", fontSize: "clamp(1.3rem,2.4vw,1.7rem)", lineHeight: 1.2, margin: 0 }}>
                Don&apos;t miss your admission deadline — <span style={{ color: "#F15A38" }}>talk to a counsellor today</span>
              </h3>
              <p style={{ color: "#5b6472", fontSize: ".95rem", lineHeight: 1.7, margin: 0 }}>
                Get a personalised, rank-based college list and round-by-round guidance from advisors who&apos;ve navigated JoSAA, CSAB and state counselling hundreds of times — so you lock the best seat your rank can get.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, width: "100%", margin: "2px 0" }}>
                {[
                  "Personalised, rank-based college list",
                  "Choice-filling order done right",
                  "Guidance through every counselling round",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.6, color: "#374151" }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(244,123,32,.14)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Check size={12} color="#F15A38" strokeWidth={3} />
                    </span>
                    {t}
                  </div>
                ))}
              </div>
              <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 10, padding: "9px 16px", borderRadius: 50, background: "rgba(244,123,32,.1)", border: "1px solid rgba(244,123,32,.3)" }}>
                <span style={{ color: "#9ca3af", textDecoration: "line-through", fontSize: 14 }}>₹1999</span>
                <span style={{ color: "#1a1a2e", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", fontSize: 18 }}>₹{PRICE}</span>
                <span style={{ color: "#c2410c", fontSize: 12, fontWeight: 700 }}>complete plan</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: "auto" }}>
                <a href={WA_LINK} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#25D366", color: "#fff", padding: "13px 22px", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", textDecoration: "none", boxShadow: "0 8px 22px rgba(37,211,102,.35)" }}>
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a href={`tel:${PHONE_TEL}`}
                    style={{ flex: 1, minWidth: 150, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#fff", border: "1.5px solid rgba(244,123,32,.35)", color: "#c2410c", padding: "13px 18px", borderRadius: 12, fontSize: 14.5, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", textDecoration: "none" }}>
                    <Phone size={17} /> {PHONE_DISPLAY}
                  </a>
                  <button type="button" onClick={() => openEnrol("all-colleges")}
                    style={{ flex: 1, minWidth: 150, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg,#F15A38,#F15A38)", color: "#fff", padding: "13px 18px", borderRadius: 12, fontSize: 14.5, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", border: "none", cursor: "pointer", boxShadow: "0 10px 24px -8px rgba(244,123,32,.6)" }}>
                    Enrol ₹499 <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

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
