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

function CounsellingView() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, maxWidth: 1000, margin: "0 auto", alignItems: "stretch" }}>
      {/* bullets card */}
      <div style={{ background: CL.card, borderRadius: 22, border: `1px solid ${CL.line}`, boxShadow: CL.shadow, padding: "30px 28px" }}>
        <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.3rem", color: CL.ink, marginBottom: 6 }}>What you get</h3>
        <p style={{ color: CL.body, fontSize: 13.5, marginBottom: 18 }}>A ready-to-fill, rank-specific JoSAA + CSAB choice list — done with you.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {COUNSELLING_BULLETS.map((b) => (
            <div key={b} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: CL.greenSoft, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                <Check size={12} color="#0a8f5b" strokeWidth={3} />
              </span>
              <span style={{ fontSize: 13.8, color: CL.ink2, lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* price card */}
      <div style={{ background: CL.coral, borderRadius: 22, boxShadow: "0 20px 50px -18px rgba(241,90,56,.6)", padding: "32px 30px", color: "#fff", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.1)" }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "1px", background: "rgba(255,255,255,.2)", padding: "6px 14px", borderRadius: 50, alignSelf: "flex-start", marginBottom: 18 }}>
          <Sparkles size={13} /> JoSAA 2026 Expert Plan
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 18, opacity: 0.7, textDecoration: "line-through" }}>₹999</span>
          <span style={{ fontFamily: CL.display, fontWeight: 900, fontSize: 52, lineHeight: 1 }}>₹299</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, background: "rgba(255,255,255,.18)", padding: "5px 12px", borderRadius: 50, alignSelf: "flex-start", marginBottom: 18 }}>
          <Flame size={13} /> Limited counselling slots this season
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.95, marginBottom: 24 }}>
          A personalised, mistake-proofed choice list and expert support through every round — for the price of a textbook.
        </p>
        <Link to="/josaa-2026" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", color: CL.coralDk, padding: "15px 24px", borderRadius: 13, fontFamily: CL.display, fontWeight: 800, fontSize: 15 }}>
            Get my ₹299 plan <ArrowRight size={17} />
        </Link>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16, fontSize: 12, opacity: 0.9 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ShieldCheck size={13} /> Secure</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Phone size={13} /> WhatsApp support</span>
        </div>
      </div>
    </div>
  );
}

function MentorshipView() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 22, maxWidth: 1040, margin: "0 auto", alignItems: "stretch" }}>
      {MENTORSHIP_PLANS.map((p, i) => {
        const Icon = p.icon;
        return (
          <motion.div key={p.to}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ y: -8 }}
            style={{
              position: "relative", display: "flex", flexDirection: "column", background: CL.card,
              borderRadius: 22, border: `1px solid ${p.featured ? CL.coral : CL.line}`,
              boxShadow: p.featured ? "0 22px 50px -22px rgba(241,90,56,.55)" : CL.shadow,
              padding: "26px 24px", overflow: "hidden",
            }}>
            {p.featured && (
              <span style={{ position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 800, letterSpacing: ".06em", color: "#fff", background: CL.coral, padding: "4px 11px", borderRadius: 50 }}>BEST VALUE</span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span style={{ width: 46, height: 46, borderRadius: 13, background: CL.coralSoft, display: "grid", placeItems: "center" }}>
                <Icon size={23} color={CL.coral} />
              </span>
              <div>
                <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.12rem", color: CL.ink, lineHeight: 1.2 }}>{p.exam}</h3>
                <span style={{ fontSize: 12, color: CL.coralDk, fontWeight: 700 }}>{p.tag}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 16 }}>
              <span style={{ fontSize: 15, color: CL.muted, textDecoration: "line-through" }}>₹{p.old}</span>
              <span style={{ fontFamily: CL.display, fontWeight: 900, fontSize: 34, color: CL.ink }}>₹{p.price}</span>
              <span style={{ fontSize: 12, color: CL.body }}>one-time</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
              {p.points.map((pt) => (
                <div key={pt} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: CL.greenSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Check size={11} color="#0a8f5b" strokeWidth={3} />
                  </span>
                  <span style={{ color: CL.ink2, fontSize: 13.3 }}>{pt}</span>
                </div>
              ))}
            </div>
            <Link to={p.to} style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: CL.coral, color: "#fff", padding: "13px 20px", borderRadius: 12, fontFamily: CL.display, fontWeight: 800, fontSize: 14.5 }}>
              Enrol — ₹{p.price} <ArrowRight size={16} />
            </Link>
          </motion.div>
        );
      })}
    </div>
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
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 36 }}>
          {TABS.map((t) => {
            const on = tab === t.key;
            const TIcon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: "inline-flex", alignItems: "center", gap: 9, padding: "12px 24px", borderRadius: 50, cursor: "pointer",
                fontFamily: CL.display, fontWeight: 800, fontSize: 14.5,
                background: on ? CL.coral : CL.card, color: on ? "#fff" : CL.ink,
                border: `1.5px solid ${on ? CL.coral : CL.line}`,
                boxShadow: on ? "0 10px 24px -8px rgba(241,90,56,.5)" : CL.shadow,
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
