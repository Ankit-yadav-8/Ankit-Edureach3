import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check, Star, ShieldCheck, Phone, MessageCircle, Clock, FileText, Target,
  TrendingUp, Users, ChevronDown, Sparkles, Award, ArrowRight, BadgeCheck,
} from "lucide-react";
import Reveal from "../components/Reveal.jsx";

/* 👉 Replace with your real payment link (Razorpay/PhonePe) and WhatsApp number. */
const PAY_LINK = "https://forms.gle/bgtSMjr1QXJytXHDA"; // Google Form — enrolment
const WA = "https://wa.me/917877596464?text=" + encodeURIComponent("Hi! I want to enrol in the JoSAA 2026 ₹249 counselling plan.");

const INCLUDES = [
  { icon: Target, t: "Personalised choice list", d: "A ranked, college-by-college JoSAA choice-filling sheet built around your rank, category & preferences." },
  { icon: Phone, t: "1-on-1 expert call", d: "A 45-min video call with a mentor who has cleared JEE & been through counselling." },
  { icon: TrendingUp, t: "Predicted allotment", d: "Round-wise probability of what you'll likely be allotted — Safe / Moderate / Reach." },
  { icon: FileText, t: "Document checklist", d: "Everything you need ready before reporting, so you never miss a deadline." },
  { icon: MessageCircle, t: "WhatsApp support", d: "Direct line to your mentor through all rounds of JoSAA + CSAB." },
  { icon: ShieldCheck, t: "Mistake-proofing", d: "We review your filled choices and flag risky ordering before you lock." },
];

const STEPS = [
  { n: "1", t: "Enrol for ₹249", d: "Secure your slot — limited mentors per cycle." },
  { n: "2", t: "Share your scorecard", d: "Rank, category, home state & branch preferences." },
  { n: "3", t: "Get your plan + call", d: "Personalised choice list and a 1:1 mentor call." },
  { n: "4", t: "Fill with confidence", d: "We support you through every JoSAA & CSAB round." },
];

const FAQ = [
  ["Is ₹249 a one-time fee?", "Yes — one payment covers your full JoSAA + CSAB 2026 counselling support, all rounds."],
  ["Who are the mentors?", "Students and alumni from IITs/NITs who have personally cleared JEE and been through counselling."],
  ["What if my rank changes after a round?", "Your plan is revised each round at no extra cost — that's the point of ongoing support."],
  ["Do you guarantee a specific college?", "No one honestly can. We maximise your chances with data-driven choice ordering and flag mistakes — the allotment is by JoSAA."],
  ["How do I get started?", "Click Enrol, complete the ₹249 payment, and you'll get a WhatsApp message within hours to begin."],
];

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{ cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <strong style={{ color: "var(--navy)", fontFamily: "Sora" }}>{q}</strong>
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }} />
      </div>
      {open && <p style={{ color: "var(--muted)", marginTop: 10, lineHeight: 1.6 }}>{a}</p>}
    </div>
  );
}

export default function Josaa2026() {
  return (
    <div className="page">
      {/* HERO */}
      <section className="warm-page-header" style={{ padding: "110px 0 70px" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 20%, rgba(249,115,22,.22) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 50% at 0% 80%, rgba(244,162,97,.20) 0%, transparent 60%)" }} />
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 40, alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <span className="pill" style={{ background: "rgba(244,123,32,.12)", color: "#c75b0a", border: "1px solid rgba(244,123,32,.38)" }}>
              <Sparkles size={13} /> JoSAA + CSAB 2026 Counselling
            </span>
            <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,3.1rem)", lineHeight: 1.12, margin: "16px 0 14px", color: "#1c1c28" }}>
              Don't lose your dream college to a <span style={{ color: "#F47B20" }}>wrong choice list</span>.
            </h1>
            <p style={{ color: "rgba(28,28,40,.65)", fontSize: "1.1rem", maxWidth: 540, lineHeight: 1.6 }}>
              Get a personalised, data-backed JoSAA choice-filling plan and 1-on-1 mentorship from people who've done it — for just ₹249.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
              <a href={PAY_LINK} target="_blank" rel="noreferrer" className="btn btn-coral" style={{ fontSize: 16, padding: "14px 26px" }}>Enrol now — ₹249 <ArrowRight size={18} /></a>
              <a href={WA} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 15, padding: "14px 22px" }}><MessageCircle size={17} /> Talk on WhatsApp</a>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap", fontSize: 13.5, color: "rgba(28,28,40,.65)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><BadgeCheck size={15} color="#F47B20" /> Built by IITians</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={15} color="#F47B20" /> 2,000+ students guided</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Star size={15} color="#F47B20" fill="#F47B20" /> 4.8/5 rating</span>
            </div>
          </div>

          {/* Price card */}
          <Reveal>
            <div className="josaa-price-card">
              {/* animated colour aura behind the card */}
              <span className="josaa-price-aura" aria-hidden="true" />
              {/* corner discount ribbon */}
              <span className="josaa-ribbon">87% OFF</span>

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center" }}>
                  <span className="badge orange" style={{ animation: "borderFlash 2.2s ease-in-out infinite" }}>🔥 Limited slots this cycle</span>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10, marginTop: 16 }}>
                    <span style={{ fontSize: 20, color: "var(--muted)", textDecoration: "line-through" }}>₹1,999</span>
                    <span className="josaa-price-amt">₹249</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, marginBottom: 18 }}>one-time · all rounds covered</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {["Personalised choice list", "1-on-1 mentor call (45 min)", "Round-wise allotment prediction", "WhatsApp support till seat locked", "Document & deadline checklist"].map((x, i) => (
                    <span key={x} className="josaa-feat" style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 14.5, animationDelay: `${0.15 + i * 0.08}s` }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(34,197,94,.14)", display: "grid", placeItems: "center", flexShrink: 0 }}><Check size={14} color="var(--green)" /></span>
                      {x}
                    </span>
                  ))}
                </div>
                <a href={PAY_LINK} target="_blank" rel="noreferrer" className="btn btn-coral josaa-cta" style={{ width: "100%", justifyContent: "center", marginTop: 20, fontSize: 16, padding: "13px" }}>Enrol now — ₹249 <ArrowRight size={18} /></a>
                <p style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><ShieldCheck size={13} /> Secure payment · mentor assigned within hours</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">Why it matters</span><h2 className="section-title">One wrong choice order can cost you a <span className="accent">whole branch</span></h2></div>
          <div className="grid-3">
            {[
              ["Filling choices randomly", "Most students order colleges by 'name', not by realistic cutoffs — and lose a better seat."],
              ["Ignoring later rounds & CSAB", "Float/slide and CSAB special rounds confuse everyone. Miss them and you miss upgrades."],
              ["No backup strategy", "Filling only dream colleges with no safe options means risking no allotment at all."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="card" style={{ height: "100%", borderTop: "3px solid var(--coral)" }}>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>{t}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUDES */}
      <section className="section section--sky">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">What you get</span><h2 className="section-title">Everything you need to fill choices right</h2></div>
          <div className="grid-3">
            {INCLUDES.map((f, i) => (
              <Reveal key={f.t} delay={(i % 3) * 0.06}>
                <div className="card" style={{ height: "100%" }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(249,115,22,.12)" }}><f.icon size={22} color="var(--coral)" /></span>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, margin: "12px 0 6px", color: "var(--navy)" }}>{f.t}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.55, fontSize: 14.5 }}>{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="section">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">How it works</span><h2 className="section-title">From enrol to allotment in 4 steps</h2></div>
          <div className="grid-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.07}>
                <div className="card" style={{ height: "100%", textAlign: "center" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--coral)", color: "#fff", display: "grid", placeItems: "center", fontFamily: "Sora", fontWeight: 800, margin: "0 auto 12px", fontSize: 20 }}>{s.n}</div>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 6, color: "var(--navy)" }}>{s.t}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section--sky">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">Student results</span><h2 className="section-title">They filled smart — and upgraded</h2></div>
          <div className="grid-3">
            {[
              ["Got CSE at a top NIT in CSAB round 2 — I'd never have filled those choices myself.", "Rahul, NIT"],
              ["The mentor call cleared all my float/slide doubts in 30 minutes. Worth way more than ₹249.", "Ishita, IIIT"],
              ["Predicted allotment was almost exactly what I got. Took all the stress out.", "Aman, GFTI→NIT"],
            ].map(([t, n], i) => (
              <Reveal key={n} delay={i * 0.07}>
                <div className="card" style={{ height: "100%" }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>{[1,2,3,4,5].map((s) => <Star key={s} size={15} fill="#F4A261" color="#F4A261" />)}</div>
                  <p style={{ color: "var(--ink)", lineHeight: 1.6, fontStyle: "italic" }}>"{t}"</p>
                  <div style={{ fontWeight: 700, color: "var(--navy)", marginTop: 10, fontFamily: "Sora" }}>{n}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="title-bar"><span className="eyebrow">FAQ</span><h2 className="section-title">Questions, answered</h2></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map(([q, a]) => <Faq key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: "linear-gradient(135deg,var(--coral),#ea580c)", color: "#fff", padding: "56px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.6rem,3.5vw,2.3rem)", marginBottom: 10 }}>Counselling opens soon. Be ready.</h2>
          <p style={{ color: "rgba(255,255,255,.9)", maxWidth: 560, margin: "0 auto 22px" }}>Lock your ₹249 plan now and get your personalised choice list before the rush.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={PAY_LINK} target="_blank" rel="noreferrer" className="btn btn-light" style={{ fontSize: 16, padding: "14px 28px", background: "#fff", color: "var(--coral)", border: "none" }}>Enrol now — ₹249</a>
            <a href={WA} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 15, padding: "14px 22px", background: "rgba(255,255,255,.15)", color: "#fff", border: "1px solid rgba(255,255,255,.5)" }}><MessageCircle size={17} /> Ask on WhatsApp</a>
          </div>
        </div>
      </section>
    </div>
  );
}
