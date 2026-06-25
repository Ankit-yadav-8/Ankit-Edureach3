/* PlansSection — merges the JoSAA Counselling plan and the 1-on-1 Mentorship
   plans into one section with a two-button toggle. Campusloom styling with
   animated content swap. Replaces the separate RankCounselling +
   MentorshipHome blocks on the home page. */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListChecks, GraduationCap, Check, ArrowRight, Sparkles, Flame,
  Trophy, Award, ShieldCheck, Star, Phone,
} from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const COUNSELLING_BULLETS = [
  "Personalised choice list built around YOUR rank & category",
  "1-on-1 mentor call (45 min) with IIT / NIT alumni",
  "Round-wise allotment prediction — Safe / Moderate / Reach",
  "WhatsApp support through all JoSAA + CSAB rounds",
  "Document & reporting checklist so you never miss a deadline",
  "Choice review & mistake-proofing before you lock",
];

const MENTORSHIP_PLANS = [
  { to: "/mentorship/jee-2027", icon: Trophy, exam: "JEE & NEET 2027", tag: "Class 12 · Droppers", price: "1", old: "7999",
    points: ["1-on-1 IITian / doctor mentor", "Daily targets + weekly test analysis", "Backlog clearing sprints"], featured: false },
  { to: "/mentorship/jee-2028", icon: Award, exam: "JEE & NEET 2028", tag: "Class 11 · 2-Year Plan", price: "1", old: "7999",
    points: ["Same mentor for 2 full years", "4-phase concept-first roadmap", "Quarterly progress checkpoints"], featured: true },
  { to: "/mentorship/foundation", icon: GraduationCap, exam: "Foundation 9–10", tag: "Class 9 & 10", price: "1", old: "5999",
    points: ["NCERT mastery + study habits", "Early JEE / NEET pattern exposure", "Board + Olympiad edge"], featured: false },
];

const TABS = [
  { key: "counselling", label: "JoSAA Counselling", icon: ListChecks },
  { key: "mentorship",  label: "1-on-1 Mentorship", icon: GraduationCap },
];

const COUNSELLING_TIERS = [
  {
    badge: "Essential", price: "299", old: "999", featured: false,
    tagline: "A personalised, mistake-proofed choice list and expert support through every round — for the price of a textbook.",
    bullets: COUNSELLING_BULLETS,
  },
  {
    badge: "Pro · Most Picked", price: "499", old: "1499", featured: true,
    tagline: "Everything in Essential, plus deeper 1-on-1 attention and end-to-end handling right up to seat acceptance.",
    bullets: [
      ...COUNSELLING_BULLETS,
      "Two 1-on-1 mentor calls (pre-fill + after Round 1)",
      "Priority same-day WhatsApp response",
      "Float / Slide / Freeze decision help every round",
      "Document & reporting handled end-to-end with you",
    ],
  },
];

function PriceCard({ tier }) {
  const featured = tier.featured;
  const fg = featured ? "#fff" : CL.ink;
  return (
    <div style={{
      background: featured ? CL.coral : CL.card, color: fg,
      borderRadius: 22, padding: "30px 28px", position: "relative", overflow: "hidden",
      border: `1px solid ${featured ? CL.coral : CL.line}`,
      boxShadow: featured ? "0 22px 52px -18px rgba(255, 105, 61,.6)" : CL.shadow,
      display: "flex", flexDirection: "column",
    }}>
      {featured && <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.1)" }} />}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "1px",
          background: featured ? "rgba(255,255,255,.2)" : CL.coralSoft, color: featured ? "#fff" : CL.coralDk,
          padding: "6px 14px", borderRadius: 50, alignSelf: "flex-start", marginBottom: 16,
        }}>
          <Sparkles size={13} /> {tier.badge}
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 18, opacity: 0.65, textDecoration: "line-through" }}>₹{tier.old}</span>
          <span style={{ fontFamily: CL.display, fontWeight: 900, fontSize: 50, lineHeight: 1 }}>₹{tier.price}</span>
          <span style={{ fontSize: 12, opacity: 0.8 }}>one-time</span>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 800,
          background: featured ? "rgba(255,255,255,.18)" : "rgba(224,66,31,.08)", color: featured ? "#fff" : CL.coralDk,
          padding: "5px 12px", borderRadius: 50, alignSelf: "flex-start", marginBottom: 16,
        }}>
          <Flame size={13} /> Limited counselling slots this season
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, opacity: featured ? 0.95 : 0.85, marginBottom: 18, color: featured ? "#fff" : CL.body }}>{tier.tagline}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {tier.bullets.map((b) => (
            <div key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: featured ? "rgba(255,255,255,.22)" : CL.greenSoft, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                <Check size={11} color={featured ? "#fff" : "#0a8f5b"} strokeWidth={3} />
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.5, color: featured ? "rgba(255,255,255,.95)" : CL.ink2 }}>{b}</span>
            </div>
          ))}
        </div>

        <Link to="/josaa-2026" style={{
          marginTop: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: featured ? "#fff" : CL.coral, color: featured ? CL.coralDk : "#fff",
          padding: "14px 24px", borderRadius: 13, fontFamily: CL.display, fontWeight: 800, fontSize: 15,
        }}>
          Get my ₹{tier.price} plan <ArrowRight size={17} />
        </Link>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 14, fontSize: 12, opacity: 0.85 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ShieldCheck size={13} /> Secure</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Phone size={13} /> WhatsApp support</span>
        </div>
      </div>
    </div>
  );
}

function CounsellingView() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, maxWidth: 880, margin: "0 auto", alignItems: "stretch" }}>
      {COUNSELLING_TIERS.map((t) => (
        <motion.div key={t.badge}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          whileHover={{ y: -6 }} style={{ display: "flex" }}>
          <PriceCard tier={t} />
        </motion.div>
      ))}
    </div>
  );
}

function MentorshipView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 40,
        maxWidth: 1040, margin: "0 auto", background: CL.card, borderRadius: 24,
        border: `1px solid ${CL.line}`, boxShadow: CL.shadow, padding: 32, alignItems: "center"
      }}>
      
      {/* Left: Copy & CTA */}
      <div style={{ textAlign: "left" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, letterSpacing: "1px",
          background: CL.coralSoft, color: CL.coralDk, padding: "6px 14px", borderRadius: 50, marginBottom: 16, textTransform: "uppercase"
        }}>
          <Sparkles size={13} /> 1-on-1 Guidance
        </span>
        <h3 style={{ fontFamily: CL.display, fontWeight: 900, fontSize: "clamp(2rem, 3.5vw, 2.6rem)", color: CL.ink, lineHeight: 1.1, marginBottom: 18 }}>
          Your Personal <span style={{ color: CL.coral }}>IITian Mentor</span>
        </h3>
        <p style={{ color: CL.body, fontSize: 16, lineHeight: 1.6, marginBottom: 28, maxWidth: 440 }}>
          Stop guessing. Get a customized daily study plan, weekly test analysis, and real accountability from mentors who have cracked JEE and NEET.
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {["Daily Targets & Accountability", "Weekly Test Analysis", "1-on-1 Doubt Solving"].map(bullet => (
             <div key={bullet} style={{ display: "flex", gap: 10, alignItems: "center" }}>
               <span style={{ width: 22, height: 22, borderRadius: "50%", background: CL.greenSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                 <Check size={13} color="#0a8f5b" strokeWidth={3} />
               </span>
               <span style={{ fontSize: 14.5, color: CL.ink2, fontWeight: 600 }}>{bullet}</span>
             </div>
          ))}
        </div>

        <Link to="/mentorship/jee-2027" style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: CL.coral, color: "#fff",
          padding: "16px 28px", borderRadius: 14, fontFamily: CL.display, fontWeight: 800, fontSize: 16,
          textDecoration: "none", boxShadow: "0 10px 24px -8px rgba(255, 105, 61,.6)"
        }}>
          Explore Mentorship <ArrowRight size={18} />
        </Link>
      </div>

      {/* Right: AI Image */}
      <div style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${CL.line}`, boxShadow: "0 18px 44px -24px rgba(26,26,46,.2)" }}>
        <img src="/images/home_mentorship_overview.png" alt="Mentorship Overview" style={{ width: "100%", display: "block" }} />
      </div>
    </motion.div>
  );
}

const TRUST = [
  { icon: Star, label: "1000+ students mentored" },
  { icon: ShieldCheck, label: "IITian & doctor mentors" },
  { icon: Phone, label: "WhatsApp support" },
];

export default function PlansSection() {
  const [tab, setTab] = useState("counselling");
  return (
    <section id="plans" style={{ background: CL.cream, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 30px" }}>
          <span style={clEyebrow}><Sparkles size={13} /> Plans & Mentorship</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.8rem)", color: CL.ink, letterSpacing: "-1.2px", margin: "16px 0 12px", lineHeight: 1.1 }}>
            Know your path. <span style={{ color: CL.coral }}>Own your future.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            Expert JoSAA counselling for this season, or year-long 1-on-1 mentorship for the long game. Pick what fits where you are.
          </p>
        </div>

        {/* two-button toggle */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 36 }}>
          {TABS.map((t) => {
            const on = tab === t.key;
            const TIcon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: "inline-flex", alignItems: "center", gap: 9, padding: "12px 24px", borderRadius: 50, cursor: "pointer",
                fontFamily: CL.display, fontWeight: 800, fontSize: 14.5,
                background: on ? CL.coral : CL.card, color: on ? "#fff" : CL.ink,
                border: `1.5px solid ${on ? CL.coral : CL.line}`,
                boxShadow: on ? "0 10px 24px -8px rgba(255, 105, 61,.5)" : CL.shadow,
                transition: "all .25s",
              }}>
                <TIcon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}>
            {tab === "counselling" ? <CounsellingView /> : <MentorshipView />}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 34 }}>
          {TRUST.map(({ icon: Icon, label }) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 50, background: CL.card, border: `1px solid ${CL.line}`, boxShadow: CL.shadow, fontSize: 13, fontWeight: 700, color: CL.ink }}>
              <Icon size={15} color={CL.coral} /> {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
