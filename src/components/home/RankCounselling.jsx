import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Phone, MessageCircle, CheckCircle2, ChevronDown,
  Star, Users, Award, ShieldCheck, MapPin, GraduationCap, Sparkles,
  ClipboardList, Target, BookOpen, CalendarCheck, Quote,
} from "lucide-react";
import Reveal from "../Reveal.jsx";

/* ════════════════════════════════════════════════
   CONTACT
════════════════════════════════════════════════ */
const WA_NUMBER = "917877596464";
const PHONE_DISPLAY = "+91 78775 96464";
const PHONE_TEL = "+917877596464";
const PRICE = "499";
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

const BRANCHES = {
  "CSE": ["IIIT (newer campuses)", "State Govt. — CSE", "Top private CSE", "Deemed univ. CSE"],
  "ECE": ["NIT (HS quota) ECE", "IIIT ECE", "GFTI ECE", "Private ECE"],
  "IT": ["IIIT IT", "State Govt. IT", "Private IT", "Autonomous IT"],
  "Mechanical": ["NIT (HS) Mech", "GFTI Mech", "State Govt. Mech", "Private Mech"],
  "Civil": ["NIT (HS) Civil", "State Govt. Civil", "GFTI Civil", "Private Civil"],
  "AI / ML": ["IIIT AI", "Private AI/ML", "Deemed univ. AI", "Autonomous AI/DS"],
  "Data Science": ["IIIT Data Sci.", "Private DS programs", "State Govt. DS", "Deemed univ. DS"],
  "Electrical": ["NIT (HS) EE", "GFTI EE", "State Govt. EE", "Private EE"],
};

const STATE_BOARDS = [
  { board: "JoSAA / CSAB", region: "All-India · NIT/IIIT/GFTI", color: "#F97316" },
  { board: "MHT-CET", region: "Maharashtra", color: "#6366f1" },
  { board: "KCET", region: "Karnataka", color: "#0ea5a4" },
  { board: "WBJEE", region: "West Bengal", color: "#15a06e" },
  { board: "UPCET / AKTU", region: "Uttar Pradesh", color: "#8b5cf6" },
  { board: "MP DTE", region: "Madhya Pradesh", color: "#f59e0b" },
  { board: "REAP", region: "Rajasthan", color: "#ef4444" },
  { board: "TS / AP EAMCET", region: "Telangana · Andhra", color: "#0891b2" },
];

const STORIES = [
  { name: "Rahul S.", rank: "1,42,000", college: "GFTI — CSE", quote: "I thought my rank was too low for a good college. The counsellor found me a CSE seat I didn't even know existed." },
  { name: "Priya M.", rank: "3,10,000", college: "State Govt. — IT", quote: "Home-state quota changed everything. Got into a government college close to home with great placements." },
  { name: "Aman K.", rank: "5,80,000", college: "Top Private — AI/ML", quote: "Their list was honest and realistic. I joined a private college with a strong AI program and a scholarship." },
  { name: "Sneha R.", rank: "2,05,000", college: "IIIT — ECE", quote: "The CSAB round guidance got me an IIIT seat in the last round. Forever grateful for the deadline reminders!" },
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
  const [branch, setBranch] = useState("CSE");
  const [openFaq, setOpenFaq] = useState(0);

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

        {/* ── 5 · BRANCH / STREAM SELECTOR ── */}
        <Reveal>
          <SectionHead eyebrow="Explore by branch" title={<>Find colleges by <span className="accent">your stream</span></>}
            sub="Pick a branch to see the kinds of colleges you can target in your rank range." />
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(244,123,32,.18)", boxShadow: "0 2px 16px rgba(0,0,0,.06)", padding: "26px", marginBottom: 64, maxWidth: 760, margin: "0 auto 64px" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 8, fontFamily: "'Space Grotesk',sans-serif" }}>
              <BookOpen size={15} color="#F47B20" style={{ verticalAlign: -3, marginRight: 6 }} /> Select your branch
            </label>
            <div style={{ position: "relative", maxWidth: 320 }}>
              <select value={branch} onChange={(e) => setBranch(e.target.value)}
                style={{ width: "100%", appearance: "none", padding: "12px 40px 12px 16px", borderRadius: 12, border: "1.5px solid rgba(244,123,32,.35)", background: "#fff7f0", fontSize: 15, fontWeight: 600, color: "#1a1a2e", cursor: "pointer", outline: "none", fontFamily: "'Space Grotesk',sans-serif" }}>
                {Object.keys(BRANCHES).map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown size={18} color="#F47B20" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 22 }}>
              {BRANCHES[branch].map((c) => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 9, background: "#fff7f0", border: "1px solid rgba(244,123,32,.18)", borderRadius: 12, padding: "12px 14px" }}>
                  <GraduationCap size={17} color="#F47B20" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: ".86rem", fontWeight: 600, color: "#374151" }}>{c}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 16, marginBottom: 0 }}>
              * Indicative options. Your counsellor builds the exact list using previous-year cut-offs for your rank &amp; category.
            </p>
          </div>
        </Reveal>

        {/* ── 6 · STATE-WISE COUNSELLING ── */}
        <Reveal>
          <SectionHead eyebrow="State-wise help" title={<>Counselling for <span className="accent">every board</span></>}
            sub="We guide you through all-India and state counselling boards." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 64 }}>
            {STATE_BOARDS.map((s) => (
              <motion.div key={s.board} whileHover={{ y: -4 }}
                style={{ background: "#fff", borderRadius: 14, border: `1px solid ${s.color}22`, borderLeft: `4px solid ${s.color}`, boxShadow: "0 2px 12px rgba(0,0,0,.05)", padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <MapPin size={16} color={s.color} />
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#1a1a2e", margin: 0 }}>{s.board}</h3>
                </div>
                <div style={{ fontSize: ".82rem", color: "#6b7280" }}>{s.region}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* ── 7 · SUCCESS STORIES ── */}
        <Reveal>
          <SectionHead eyebrow="Real results" title={<>Success <span className="accent">stories</span></>}
            sub="Students with ranks like yours who found the right college." />
          <div className="grid-2" style={{ gap: 20, marginBottom: 64 }}>
            {STORIES.map((s) => (
              <div key={s.name} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(244,123,32,.16)", boxShadow: "0 2px 16px rgba(0,0,0,.06)", padding: "22px 24px", position: "relative" }}>
                <Quote size={30} color="rgba(244,123,32,.18)" style={{ position: "absolute", top: 16, right: 18 }} />
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={15} color="#fbbf24" fill="#fbbf24" />)}
                </div>
                <p style={{ color: "#374151", fontSize: ".92rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: 16 }}>“{s.quote}”</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#F47B20,#ea580c)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{s.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: ".9rem" }}>{s.name}</div>
                    <div style={{ fontSize: ".78rem", color: "#6b7280" }}>Rank {s.rank} · {s.college}</div>
                  </div>
                </div>
              </div>
            ))}
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
                <Link to="/josaa-2026"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, color: "rgba(255,255,255,.85)", fontSize: 13.5, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>
                  Or fill the enrolment form <ArrowRight size={14} />
                </Link>
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
