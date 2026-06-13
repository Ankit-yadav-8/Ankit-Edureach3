import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Phone, MessageCircle, ChevronDown, ChevronLeft, ChevronRight,
  Star, Users, Award, ShieldCheck, GraduationCap, Sparkles, Check,
  Quote, TrendingUp,
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

        {/* ── 2 · COUNSELLING PLANS (₹299 + ₹499) ── */}
        <Reveal>
          <SectionHead eyebrow="Counselling Plans" title={<>One plan for <span className="accent">all colleges</span></>}
            sub="Pick the plan that fits your rank — expert, data-backed counselling that turns your rank into a confirmed seat." />
          <div className="plan-duo">
            {PLANS.map((p) => {
              const Icon = p.icon;
              const featured = p.featured;
              return (
                <motion.div
                  key={p.key}
                  className={`josaa-price-card plan-card${featured ? " plan-card--featured" : ""}`}
                  initial={{ scale: featured ? 1.03 : 1 }}
                  animate={{ scale: featured ? 1.03 : 1 }}
                  whileHover={{ y: -8, scale: featured ? 1.04 : 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  {featured && <div className="plan-popular">★ Most Popular</div>}
                  <div className="josaa-save-ribbon">{p.save}</div>

                  <div className="josaa-price-header">
                    <div className="josaa-price-header-mesh" />
                    <div className="josaa-price-header-glow" />
                    <div className="josaa-price-header-top">
                      <div className="josaa-price-header-icon">
                        <Icon size={22} color="#fff" />
                      </div>
                      <span className="josaa-price-header-tag">{p.tag}</span>
                    </div>
                    <div className="plan-band">{p.band}</div>
                    <div className="josaa-price-row">
                      <div className="josaa-old-price">₹{p.old}</div>
                      <span className="josaa-off-pill">{p.off}</span>
                    </div>
                    <div className="josaa-new-price">
                      <span className="josaa-rupee">₹</span>{p.price}
                      <span className="josaa-per">/plan</span>
                    </div>
                    <div className="josaa-price-label">{p.label}</div>
                  </div>

                  <div className="josaa-price-body">
                    <p className="plan-blurb">{p.blurb}</p>
                    <div className="plan-includes-label">What's included</div>
                    <div className="josaa-includes">
                      {p.includes.map((item) => (
                        <div className="josaa-include-item" key={item}>
                          <span className="josaa-include-tick">
                            <Check size={12} color="#fff" strokeWidth={3.5} />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    {p.to ? (
                      <Link to={p.to} className="josaa-cta-btn">
                        {p.cta} <ArrowRight size={17} />
                      </Link>
                    ) : (
                      <button type="button" onClick={() => openEnrol(p.key)} className="josaa-cta-btn" style={{ border: "none", cursor: "pointer", width: "100%" }}>
                        {p.cta} <ArrowRight size={17} />
                      </button>
                    )}
                    <div className="josaa-secure-note">
                      <ShieldCheck size={13} />
                      Secure · counsellor assigned within hours
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* trust strip under the plans */}
          <div className="plan-trust-strip">
            <span><Users size={15} color="#F47B20" /> 10,000+ counselled</span>
            <span><Star size={15} color="#fbbf24" fill="#fbbf24" /> 4.8/5 rating</span>
            <span><Award size={15} color="#F47B20" /> Expert advisors</span>
            <span><ShieldCheck size={15} color="#F47B20" /> Free first session</span>
          </div>
        </Reveal>
      </div>

      {/* ── Mentorship (just below the ₹299 / ₹499 plans) ── */}
      <MentorshipHome />

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 16, paddingBottom: 72 }}>

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
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 9, background: "linear-gradient(135deg,#ffffff,#ffffff)", border: "1px solid rgba(244,123,32,.25)", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
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
                <button type="button" onClick={() => openEnrol("all-colleges")}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, color: "rgba(255,255,255,.85)", fontSize: 13.5, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, background: "transparent", border: "none", cursor: "pointer" }}>
                  Or enrol now — ₹499 <ArrowRight size={14} />
                </button>
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
