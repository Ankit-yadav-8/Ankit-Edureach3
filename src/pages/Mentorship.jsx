import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, ChevronDown, Sparkles, Play, ShieldCheck,
  Target, Flame, Trophy, Users, MessageCircle, Phone, AlertTriangle,
  GraduationCap, Rocket, Star, Handshake, Library, CalendarClock, TrendingUp,
} from "lucide-react";
import { MENTORSHIP, MENTOR_PLANS } from "../data/mentorship.js";
import { useEnrol } from "../components/EnrolModal.jsx";

const GOLD = "#f5a623";
const WA_NUMBER = "917877596464";

/* ════════════════════════════════════════════════
   Small building blocks
════════════════════════════════════════════════ */
function SectionTitle({ kicker, children, sub }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 48px" }}>
      {kicker && (
        <span style={{
          display: "inline-block", fontSize: 12, fontWeight: 800, letterSpacing: "2px",
          textTransform: "uppercase", color: GOLD, marginBottom: 14,
        }}>{kicker}</span>
      )}
      <h2 style={{
        fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800,
        fontSize: "clamp(1.7rem,4vw,2.7rem)", lineHeight: 1.12, letterSpacing: "-1px",
        color: "#fff", margin: 0,
      }}>{children}</h2>
      {sub && <p style={{ color: "rgba(255,255,255,.58)", fontSize: "1.02rem", lineHeight: 1.7, marginTop: 16 }}>{sub}</p>}
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}

function Section({ children, style }) {
  return (
    <section style={{ padding: "96px 0", position: "relative", ...style }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════ */
function Hero({ cfg, scrollToEnrol }) {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245,166,35,.18) 0%, transparent 60%), #0a0a0a",
      paddingTop: 140, paddingBottom: 90,
    }}>
      {/* mesh grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)",
        backgroundSize: "54px 54px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, #000 0%, transparent 80%)",
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.span
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700,
            color: GOLD, background: "rgba(245,166,35,.12)", border: "1px solid rgba(245,166,35,.4)",
            padding: "8px 18px", borderRadius: 50, marginBottom: 26,
          }}>
          {cfg.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{
            fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 900,
            fontSize: "clamp(2.4rem,7vw,5rem)", lineHeight: 1.04, letterSpacing: "-2px",
            color: "#fff", margin: "0 0 22px",
          }}>
          {cfg.title[0]}<br />
          <span style={{
            background: `linear-gradient(90deg, ${GOLD}, #ffd479, ${GOLD})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>{cfg.title[1]}</span>
          {cfg.title[2] ? <><br />{cfg.title[2]}</> : null}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
          style={{ color: "rgba(255,255,255,.62)", fontSize: "clamp(1rem,2vw,1.2rem)", lineHeight: 1.7, maxWidth: 660, margin: "0 auto 34px" }}>
          {cfg.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
          style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
          <button onClick={scrollToEnrol} style={ctaSolid}>
            JOIN NOW <ArrowRight size={18} />
          </button>
          <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I want to know more about the " + cfg.eyebrow)}`}
            target="_blank" rel="noreferrer" style={ctaGhost}>
            <MessageCircle size={18} /> Talk to us
          </a>
        </motion.div>

        <div style={{ color: "rgba(255,255,255,.45)", fontSize: 13, fontWeight: 600 }}>
          Loved by 1000+ students since 2023 · Serious aspirants only
        </div>

        {/* video placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
          style={{
            maxWidth: 760, margin: "52px auto 0", aspectRatio: "16/9",
            background: "linear-gradient(135deg,#141414,#1d1d1d)", borderRadius: 18,
            border: "1px solid rgba(255,255,255,.1)", display: "grid", placeItems: "center",
            position: "relative", overflow: "hidden", cursor: "pointer",
          }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(245,166,35,.14), transparent 65%)" }} />
          <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", background: GOLD, display: "grid", placeItems: "center",
              margin: "0 auto 14px", boxShadow: "0 0 40px rgba(245,166,35,.5)",
            }}>
              <Play size={28} color="#0a0a0a" fill="#0a0a0a" style={{ marginLeft: 4 }} />
            </div>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14, fontWeight: 600 }}>{cfg.videoNote}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   "THIS PLAN IS FOR YOU"
════════════════════════════════════════════════ */
function ForYou({ cfg }) {
  return (
    <Section style={{ background: "#0a0a0a" }}>
      <SectionTitle kicker="Sound familiar?">This Plan Is <span style={{ color: GOLD }}>For You</span> If…</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, maxWidth: 920, margin: "0 auto" }}>
        {cfg.forYou.map((t, i) => (
          <Reveal key={t} delay={i * 0.05}>
            <div style={darkCard}>
              <span style={{ fontSize: 22 }}>👉</span>
              <span style={{ color: "rgba(255,255,255,.82)", fontSize: 15, lineHeight: 1.5, fontWeight: 500 }}>{t}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   WHY FOUNDATION (foundation page only)
════════════════════════════════════════════════ */
function WhyFoundation({ cfg }) {
  if (!cfg.whyFoundation) return null;
  return (
    <Section style={{ background: "#0d0d0d" }}>
      <SectionTitle kicker="Why it matters">Why <span style={{ color: GOLD }}>Foundation</span> Matters</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
        {cfg.whyFoundation.map((t, i) => (
          <Reveal key={t} delay={i * 0.08}>
            <div style={{ ...darkCard, flexDirection: "column", alignItems: "flex-start", gap: 14, minHeight: 150 }}>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 38, color: GOLD, lineHeight: 1 }}>{i + 1}</span>
              <span style={{ color: "rgba(255,255,255,.82)", fontSize: 15.5, lineHeight: 1.6, fontWeight: 600 }}>{t}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   HOW WE GUIDE (6 cards)
════════════════════════════════════════════════ */
const GUIDE_ICONS = [Flame, Users, Target, Trophy, Rocket, Star];
function HowWeGuide({ cfg }) {
  return (
    <Section style={{ background: "#0d0d0d" }}>
      <SectionTitle kicker="The system" sub="A 1-on-1 mentorship engine built to fix the exact reasons most aspirants fail.">
        How We <span style={{ color: GOLD }}>Guide</span> You
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
        {cfg.howWeGuide.map((g, i) => {
          const Icon = GUIDE_ICONS[i % GUIDE_ICONS.length];
          return (
            <Reveal key={g.title} delay={i * 0.05}>
              <div style={{ ...darkCard, flexDirection: "column", alignItems: "flex-start", gap: 14, height: "100%" }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(245,166,35,.14)", border: "1px solid rgba(245,166,35,.3)", display: "grid", placeItems: "center" }}>
                  <Icon size={22} color={GOLD} />
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.08rem", color: "#fff", margin: 0 }}>{g.title}</h3>
                <p style={{ color: "rgba(255,255,255,.55)", fontSize: 14, lineHeight: 1.65, margin: 0 }}>{g.desc}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   JOURNEY STEPS
════════════════════════════════════════════════ */
function Journey({ cfg }) {
  return (
    <Section style={{ background: "#0a0a0a" }}>
      <SectionTitle kicker="Your journey">Your Journey With <span style={{ color: GOLD }}>JEEsociety</span></SectionTitle>
      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0 }}>
        {cfg.journey.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.05}>
            <div style={{ display: "flex", gap: 20, paddingBottom: i === cfg.journey.length - 1 ? 0 : 28 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg,${GOLD},#ffcf6b)`, color: "#0a0a0a",
                  display: "grid", placeItems: "center", fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: 900, fontSize: 17, boxShadow: "0 0 22px rgba(245,166,35,.4)",
                }}>{i + 1}</div>
                {i !== cfg.journey.length - 1 && <div style={{ width: 2, flex: 1, background: "linear-gradient(rgba(245,166,35,.5),rgba(245,166,35,.05))", marginTop: 6 }} />}
              </div>
              <div style={{ paddingTop: 4 }}>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.12rem", color: "#fff", margin: "0 0 6px" }}>{s.title}</h3>
                <p style={{ color: "rgba(255,255,255,.55)", fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   TWO-YEAR PLAN (2028 only)
════════════════════════════════════════════════ */
function TwoYearPlan({ cfg }) {
  if (!cfg.twoYearPlan) return null;
  return (
    <Section style={{ background: "#0d0d0d" }}>
      <SectionTitle kicker="The roadmap">The <span style={{ color: GOLD }}>2-Year</span> Plan</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
        {cfg.twoYearPlan.map((p, i) => (
          <Reveal key={p.phase} delay={i * 0.07}>
            <div style={{ ...darkCard, flexDirection: "column", alignItems: "flex-start", gap: 10, height: "100%", borderTop: `3px solid ${GOLD}` }}>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1px", color: GOLD, textTransform: "uppercase" }}>{p.phase}</span>
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,.45)", fontWeight: 600 }}>{p.when}</span>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#fff", margin: "2px 0 0" }}>{p.title}</h3>
              <p style={{ color: "rgba(255,255,255,.55)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   TESTIMONIALS
════════════════════════════════════════════════ */
function Testimonials({ cfg }) {
  return (
    <Section style={{ background: "#0a0a0a" }}>
      <SectionTitle kicker="Real results">Students From The <span style={{ color: GOLD }}>2025 Batch</span></SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
        {cfg.testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <div style={{ ...darkCard, flexDirection: "column", alignItems: "flex-start", gap: 14, height: "100%" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[...Array(5)].map((_, k) => <Star key={k} size={15} color={GOLD} fill={GOLD} />)}
              </div>
              <p style={{ color: "rgba(255,255,255,.8)", fontSize: 14.5, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>“{t.quote}”</p>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 12, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,.08)", width: "100%" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#ffcf6b)`, color: "#0a0a0a", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>{t.improvement}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.4)" }}>{t.batch}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   ENROL (track pricing cards) — JEE + NEET
════════════════════════════════════════════════ */
function Enrol({ cfg, enrolRef }) {
  const { open: openEnrol } = useEnrol();
  return (
    <section ref={enrolRef} id="enrol" style={{ padding: "96px 0", background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245,166,35,.12), transparent 60%), #0d0d0d", scrollMarginTop: 80 }}>
      <div className="container">
        <SectionTitle kicker="Limited spots" sub="One-time enrolment. Serious aspirants only. Pick your track below.">
          Join the <span style={{ color: GOLD }}>Mentorship</span> Program
        </SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: cfg.tracks.length > 1 ? "repeat(auto-fit,minmax(300px,1fr))" : "minmax(300px,440px)", gap: 22, maxWidth: 920, margin: "0 auto", justifyContent: "center" }}>
          {cfg.tracks.map((tr, i) => {
            const meta = MENTOR_PLANS[tr.plan];
            return (
              <Reveal key={tr.plan} delay={i * 0.08}>
                <div style={{
                  background: "linear-gradient(160deg,#161616,#101010)", borderRadius: 20,
                  border: `1px solid ${tr.accent}44`, padding: "30px 26px", height: "100%",
                  display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
                  boxShadow: `0 0 0 1px rgba(255,255,255,.03), 0 30px 60px -30px ${tr.accent}55`,
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${tr.accent},transparent)` }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ width: 40, height: 40, borderRadius: 11, background: `${tr.accent}22`, border: `1px solid ${tr.accent}55`, display: "grid", placeItems: "center" }}>
                      <GraduationCap size={20} color={tr.accent} />
                    </span>
                    <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#fff", margin: 0 }}>{tr.exam}</h3>
                  </div>
                  <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13.5, marginBottom: 18 }}>{tr.line}</p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
                    <span style={{ fontSize: 18, color: "rgba(255,255,255,.4)", textDecoration: "line-through" }}>₹{meta.old}</span>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 40, color: "#fff" }}>₹{meta.amount}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,.45)" }}>one-time</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {["Personal 1-on-1 mentor", "Daily targets + accountability", "Weekly test analysis", "WhatsApp support throughout"].map((b) => (
                      <div key={b} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <Check size={16} color={tr.accent} strokeWidth={3} />
                        <span style={{ color: "rgba(255,255,255,.72)", fontSize: 13.5 }}>{b}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => openEnrol(tr.plan)}
                    style={{
                      marginTop: "auto", width: "100%", padding: "15px", borderRadius: 12, border: "none",
                      background: GOLD, color: "#0a0a0a", fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: 800, fontSize: 15.5, cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.3px",
                    }}>
                    Enrol — ₹{meta.amount} <ArrowRight size={17} />
                  </button>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: 12, color: "rgba(255,255,255,.4)", fontWeight: 600 }}>
                    <ShieldCheck size={13} color="#22c55e" /> Secure payment via Razorpay
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 28, color: GOLD, fontSize: 13.5, fontWeight: 700 }}>
          <AlertTriangle size={15} /> Limited spots. Serious aspirants only.
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   CONTACT FORM (-> WhatsApp)
════════════════════════════════════════════════ */
function Contact({ cfg }) {
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const text = `Hi! I'm ${f.name || "a student"} (${f.phone}). Interested in ${cfg.eyebrow}.\n\n${f.message}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };
  return (
    <Section style={{ background: "#0a0a0a" }}>
      <SectionTitle kicker="Get in touch">Join Our <span style={{ color: GOLD }}>Mentorship</span> Program</SectionTitle>
      <form onSubmit={submit} style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <input required value={f.name} onChange={set("name")} placeholder="Your name" style={contactInput} />
        <input required value={f.phone} onChange={set("phone")} placeholder="Phone number" inputMode="tel" style={contactInput} />
        <textarea value={f.message} onChange={set("message")} placeholder="Your message (optional)" rows={4} style={{ ...contactInput, resize: "vertical" }} />
        <button type="submit" style={{ ...ctaSolid, justifyContent: "center", width: "100%" }}>
          Submit <ArrowRight size={17} />
        </button>
      </form>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   FAQ ACCORDION
════════════════════════════════════════════════ */
function Faqs({ cfg }) {
  const [open, setOpen] = useState(0);
  return (
    <Section style={{ background: "#0d0d0d" }}>
      <SectionTitle kicker="Questions">Frequently Asked <span style={{ color: GOLD }}>Questions</span></SectionTitle>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {cfg.faqs.map((q, i) => {
          const isOpen = open === i;
          return (
            <div key={q.q} style={{ background: "#141414", border: `1px solid ${isOpen ? "rgba(245,166,35,.4)" : "rgba(255,255,255,.08)"}`, borderRadius: 14, marginBottom: 12, overflow: "hidden" }}>
              <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                padding: "18px 20px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff",
              }}>
                {q.q}
                <ChevronDown size={19} color={GOLD} style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                    <div style={{ padding: "0 20px 20px", color: "rgba(255,255,255,.6)", fontSize: 14.5, lineHeight: 1.7 }}>{q.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   WHATSAPP PROOF — CSS phone-frame chat mockups
════════════════════════════════════════════════ */
function PhoneFrame({ contact, messages, accent = "#25D366" }) {
  return (
    <div style={{
      width: "100%", maxWidth: 230, margin: "0 auto", aspectRatio: "9 / 18",
      background: "#0a0a0a", borderRadius: 28, border: "1px solid rgba(255,255,255,.14)",
      boxShadow: "0 18px 40px -16px rgba(0,0,0,.8), inset 0 0 0 5px #1c1c1c",
      padding: 6, position: "relative", overflow: "hidden",
    }}>
      {/* notch */}
      <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 64, height: 16, background: "#1c1c1c", borderRadius: 12, zIndex: 3 }} />
      {/* screen */}
      <div style={{ width: "100%", height: "100%", borderRadius: 22, overflow: "hidden", background: "#0b141a", display: "flex", flexDirection: "column" }}>
        {/* WA header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 10px 9px", background: "#202c33", flexShrink: 0 }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: accent, display: "grid", placeItems: "center", flexShrink: 0, fontSize: 11, fontWeight: 800, color: "#0a0a0a" }}>{contact[0]}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#e9edef", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contact}</div>
            <div style={{ fontSize: 8, color: "#8696a0" }}>online</div>
          </div>
        </div>
        {/* chat body */}
        <div style={{
          flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 7, overflow: "hidden",
          backgroundImage: "radial-gradient(rgba(255,255,255,.03) 1px, transparent 1px)", backgroundSize: "14px 14px",
        }}>
          {messages.map((m, i) => {
            const out = m.side === "out";
            return (
              <div key={i} style={{ alignSelf: out ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                <div style={{
                  background: out ? "#005c4b" : "#202c33", color: "#e9edef",
                  borderRadius: 9, borderTopRightRadius: out ? 2 : 9, borderTopLeftRadius: out ? 9 : 2,
                  padding: "6px 9px 5px", fontSize: 9.5, lineHeight: 1.4, whiteSpace: "pre-line",
                }}>
                  {m.name && <div style={{ fontSize: 8.5, fontWeight: 800, color: "#f5a623", marginBottom: 1 }}>{m.name}</div>}
                  {m.text}
                  <span style={{ display: "block", textAlign: "right", fontSize: 7.5, color: out ? "rgba(233,237,239,.6)" : "#8696a0", marginTop: 2 }}>{m.time}{out ? " ✓✓" : ""}</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* input bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 8px", background: "#0b141a", flexShrink: 0 }}>
          <div style={{ flex: 1, background: "#202c33", borderRadius: 16, padding: "6px 10px", fontSize: 8.5, color: "#8696a0" }}>Message</div>
          <span style={{ width: 24, height: 24, borderRadius: "50%", background: accent, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Play size={11} color="#0a0a0a" fill="#0a0a0a" style={{ marginLeft: 1 }} />
          </span>
        </div>
      </div>
    </div>
  );
}

const PROOF_CARDS = [
  {
    head: ["Figuring it out ", "together", ", that's how we grow."],
    contact: "JEE Squad · Group",
    messages: [
      { side: "in", name: "Rahul", text: "Guys which teacher for Rotational Motion?", time: "10:02" },
      { side: "in", name: "Priya", text: "MR sir on YouTube is 🔥 for that", time: "10:03" },
      { side: "out", text: "Adding the playlist — do Q's after each lecture", time: "10:05" },
      { side: "in", name: "Rahul", text: "Got it, starting today 💪", time: "10:06" },
    ],
  },
  {
    head: ["Marks jumped from ", "20 to 126", ". That's the shift."],
    contact: "Aman · Mentor",
    messages: [
      { side: "in", text: "Bhaiya I got 126 in the last test!!", time: "21:14" },
      { side: "in", text: "Last time it was just 20 😭", time: "21:14" },
      { side: "out", text: "That's the shift we worked for 🔥 proud of you", time: "21:15" },
      { side: "in", text: "Thank you so much 🙏", time: "21:16" },
    ],
  },
  {
    head: ["Festival or not — the ", "system", " keeps going."],
    contact: "Community · Announcements",
    messages: [
      { side: "out", text: "Happy Diwali everyone 🪔", time: "09:00" },
      { side: "out", text: "But the system doesn't pause:\n1. Hit your syllabus targets\n2. Attempt today's mock\n3. Daily tasks — non-negotiable", time: "09:01" },
      { side: "in", text: "On it bhaiya 🚀", time: "09:05" },
    ],
  },
  {
    head: ["12 hours tracked", ". Discipline in action."],
    contact: "Sneha · Mentor",
    accent: "#22c55e",
    messages: [
      { side: "in", text: "📷 Study tracker — 12h 04m", time: "23:40" },
      { side: "in", text: "Revised Thermodynamics + Organic today", time: "23:41" },
      { side: "out", text: "12 hours tracked 👏 discipline in action", time: "23:42" },
      { side: "out", text: "Proud of you. Sleep now, recover.", time: "23:42" },
    ],
  },
  {
    head: ["When something feels off, it gets ", "fixed", "."],
    contact: "Community · Announcements",
    messages: [
      { side: "out", text: "📢 New: Feedback & Complaint form is live", time: "12:00" },
      { side: "out", text: "If anything feels off, tell us — anonymously too", time: "12:00" },
      { side: "out", text: "Your voice shapes the system 🙌", time: "12:01" },
      { side: "in", text: "This is why I trust this place 🙏", time: "12:10" },
    ],
  },
  {
    head: ["Doubt at ", "1 AM", "? Someone's there."],
    contact: "Dev · Mentor",
    messages: [
      { side: "in", text: "Bhaiya stuck on this integral 😩", time: "01:02" },
      { side: "in", text: "📷 my handwritten attempt", time: "01:02" },
      { side: "out", text: "📷 full solution", time: "01:09" },
      { side: "out", text: "Use substitution u = 1+x². You almost had it 💪", time: "01:09" },
    ],
  },
];

function WhatsAppProof() {
  return (
    <Section style={{ background: "#0a0a0a" }}>
      <SectionTitle kicker="From the inside" sub="This is what mentorship looks like from the inside.">
        Real Mentorship. <span style={{ color: GOLD }}>Real Results.</span>
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, maxWidth: 1040, margin: "0 auto" }}>
        {PROOF_CARDS.map((c, i) => (
          <Reveal key={i} delay={(i % 3) * 0.06}>
            <div style={{
              background: "#111", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12,
              padding: "24px 22px", boxShadow: "0 12px 30px -16px rgba(0,0,0,.7)", height: "100%",
              display: "flex", flexDirection: "column", gap: 18,
            }}>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.12rem", lineHeight: 1.3, color: "#fff", margin: 0 }}>
                {c.head[0]}<span style={{ color: GOLD }}>{c.head[1]}</span>{c.head[2] || ""}
              </h3>
              <PhoneFrame contact={c.contact} messages={c.messages} accent={c.accent} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════
   YOUR JOURNEY WITH COLLEGE PARICHAY — 6-step cards
════════════════════════════════════════════════ */
const JOURNEY_STEPS = [
  { Icon: Rocket,        title: "Click on Join and Enroll",          desc: "Take the first bold step." },
  { Icon: Handshake,     title: "Mentor Contacts You in 24 Hours",   desc: "Your College Parichay mentor sends you the first WhatsApp message." },
  { Icon: Library,       title: "Receive Study Materials",           desc: "Kickstart your journey with all your notes and plans ready." },
  { Icon: CalendarClock, title: "Get Strict Guidance",               desc: "Daily accountability, weekly targets, zero procrastination." },
  { Icon: TrendingUp,    title: "Score 250+ in JEE / 650+ in NEET",  desc: "Get into flow state and hit your maximum potential." },
  { Icon: GraduationCap, title: "Get Your Dream College",            desc: "Your dream IIT or medical college is waiting for you!" },
];

function JourneyBrand() {
  return (
    <section style={{ padding: "96px 0", background: "linear-gradient(160deg, #fff7f0 0%, #fde8d4 45%, #fddcbc 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, left: "8%", width: 360, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.16), transparent 65%)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 48px" }}>
          <span style={{ display: "inline-block", fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#ea580c", marginBottom: 12 }}>How it works</span>
          <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.6rem)", lineHeight: 1.14, letterSpacing: "-1px", color: "#1a1a2e", margin: 0 }}>
            Your Journey With <span style={{ background: "linear-gradient(90deg,#F47B20,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>College Parichay</span>
          </h2>
          <p style={{ color: "#4b5563", fontSize: "1.02rem", lineHeight: 1.7, marginTop: 14 }}>Six steps from where you are to where you deserve to be.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 22, maxWidth: 1040, margin: "0 auto" }}>
          {JOURNEY_STEPS.map((s, i) => {
            const Icon = s.Icon;
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.07}>
                <div style={{
                  background: "#fff", borderRadius: 16, padding: 32, height: "100%",
                  boxShadow: "0 20px 45px -22px rgba(26,26,46,.4), 0 2px 10px rgba(0,0,0,.05)",
                  border: "1px solid rgba(244,123,32,.12)", textAlign: "center",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                }}>
                  <span style={{ alignSelf: "flex-start", fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#F47B20" }}>Step {i + 1}</span>
                  <div style={{ width: 68, height: 68, borderRadius: 18, background: "linear-gradient(135deg,#fff3e8,#fde8d0)", border: "1px solid rgba(244,123,32,.2)", display: "grid", placeItems: "center", marginTop: 4 }}>
                    <Icon size={32} color="#1a1a2e" strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#1a1a2e", margin: "4px 0 0", lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════ */
export default function Mentorship() {
  const { variant } = useParams();
  const cfg = MENTORSHIP[variant];
  if (!cfg) return <Navigate to="/mentorship/jee-2027" replace />;

  const scrollToEnrol = () => document.getElementById("enrol")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#0a0a0a", color: "#fff" }}>
      {/* cross-page mentorship nav */}
      <div style={{ position: "relative", zIndex: 2, background: "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,.06)", paddingTop: 76 }}>
        <div className="container" style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", padding: "12px 0" }}>
          {Object.values(MENTORSHIP).map((m) => (
            <Link key={m.slug} to={`/mentorship/${m.slug}`} style={{
              fontSize: 13, fontWeight: 700, padding: "7px 16px", borderRadius: 50, textDecoration: "none",
              color: m.slug === variant ? "#0a0a0a" : "rgba(255,255,255,.7)",
              background: m.slug === variant ? GOLD : "rgba(255,255,255,.05)",
              border: `1px solid ${m.slug === variant ? GOLD : "rgba(255,255,255,.1)"}`,
            }}>
              {m.slug === "foundation" ? "Foundation 9–10" : m.slug === "jee-2027" ? "JEE/NEET 2027" : "JEE/NEET 2028"}
            </Link>
          ))}
        </div>
      </div>

      <Hero cfg={cfg} scrollToEnrol={scrollToEnrol} />
      <ForYou cfg={cfg} />
      <WhyFoundation cfg={cfg} />
      <HowWeGuide cfg={cfg} />
      <WhatsAppProof />
      <TwoYearPlan cfg={cfg} />
      <JourneyBrand />
      <Testimonials cfg={cfg} />
      <Enrol cfg={cfg} />
      <Contact cfg={cfg} />
      <Faqs cfg={cfg} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   shared styles
════════════════════════════════════════════════ */
const ctaSolid = {
  display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 30px", borderRadius: 8,
  background: GOLD, color: "#0a0a0a", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800,
  fontSize: 15.5, border: "none", cursor: "pointer", textDecoration: "none", letterSpacing: "0.3px",
  boxShadow: "0 8px 30px rgba(245,166,35,.35)",
};
const ctaGhost = {
  display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 26px", borderRadius: 8,
  background: "rgba(255,255,255,.06)", color: "#fff", fontFamily: "'Space Grotesk',sans-serif",
  fontWeight: 700, fontSize: 15, border: "1px solid rgba(255,255,255,.18)", cursor: "pointer", textDecoration: "none",
};
const darkCard = {
  display: "flex", alignItems: "center", gap: 14, background: "#141414",
  border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "20px 22px",
};
const contactInput = {
  width: "100%", padding: "14px 16px", fontSize: 15, borderRadius: 10,
  background: "#141414", border: "1px solid rgba(255,255,255,.14)", color: "#fff", outline: "none",
  fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box",
};
