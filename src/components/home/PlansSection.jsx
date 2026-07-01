/* PlansSection — the home page's 1-on-1 Mentorship block. Redesigned to a
   mentorship-only layout: a concise header, an overview band (feature list +
   image) and the three mentorship plans as cards, followed by a trust strip.
   The JoSAA Counselling toggle/tiers that used to share this section were
   removed — counselling now lives only on its dedicated /josaa-2026 page. */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Check, ArrowRight, Trophy, Award,
  ShieldCheck, Star, Phone, CalendarCheck, LineChart, MessageCircle,
} from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const MENTORSHIP_PLANS = [
  { to: "/mentorship/jee-2027", icon: Trophy, exam: "JEE & NEET 2027", tag: "Class 12 · Droppers", price: "1", old: "7999",
    points: ["1-on-1 IITian / doctor mentor", "Daily targets + weekly test analysis", "Backlog clearing sprints"], featured: false },
  { to: "/mentorship/jee-2028", icon: Award, exam: "JEE & NEET 2028", tag: "Class 11 · 2-Year Plan", price: "1", old: "7999",
    points: ["Same mentor for 2 full years", "4-phase concept-first roadmap", "Quarterly progress checkpoints"], featured: true },
  { to: "/mentorship/foundation", icon: GraduationCap, exam: "Foundation 9–10", tag: "Class 9 & 10", price: "1", old: "5999",
    points: ["NCERT mastery + study habits", "Early JEE / NEET pattern exposure", "Board + Olympiad edge"], featured: false },
];

const FEATURES = [
  { icon: CalendarCheck, title: "Daily targets & accountability", desc: "A customised day-by-day plan, checked so you never drift." },
  { icon: LineChart,     title: "Weekly test analysis",           desc: "Spot weak chapters early and fix them before they cost marks." },
  { icon: MessageCircle, title: "1-on-1 doubt solving",           desc: "Direct mentor access on WhatsApp whenever you're stuck." },
];

const WHY = [
  { icon: Star,        title: "1000+ students mentored", desc: "Real students, real rank jumps across JEE & NEET every season." },
  { icon: ShieldCheck, title: "IITian & doctor mentors", desc: "1-on-1 guidance from people who have actually cracked the exam." },
  { icon: Phone,       title: "WhatsApp support",        desc: "A direct line to your mentor whenever you're stuck — no waiting." },
];

function PlanCard({ plan }) {
  const { featured } = plan;
  const Icon = plan.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ y: -6 }}
      style={{
        position: "relative", display: "flex", flexDirection: "column",
        background: featured ? CL.coral : CL.card, color: featured ? "#fff" : CL.ink,
        border: `1px solid ${featured ? CL.coral : CL.line}`, borderRadius: 22, padding: "28px 26px",
        boxShadow: featured ? "0 22px 52px -18px rgba(255, 105, 61,.6)" : CL.shadow,
      }}
    >
      {featured && (
        <span style={{
          position: "absolute", top: 18, right: 18, fontSize: 10.5, fontWeight: 800, letterSpacing: ".5px",
          background: "rgba(255,255,255,.2)", color: "#fff", padding: "5px 11px", borderRadius: 50,
        }}>
          MOST POPULAR
        </span>
      )}
      <span style={{
        width: 46, height: 46, borderRadius: 13, display: "grid", placeItems: "center", marginBottom: 16,
        background: featured ? "rgba(255,255,255,.18)" : CL.coralSoft, color: featured ? "#fff" : CL.coralDk,
      }}>
        <Icon size={22} />
      </span>
      <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.25rem", lineHeight: 1.15, marginBottom: 4 }}>{plan.exam}</h3>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: featured ? "#fff" : CL.body, opacity: featured ? 0.9 : 0.75, marginBottom: 16 }}>{plan.tag}</div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 18 }}>
        <span style={{ fontSize: 15, opacity: 0.6, textDecoration: "line-through" }}>₹{plan.old}</span>
        <span style={{ fontFamily: CL.display, fontWeight: 900, fontSize: 40, lineHeight: 1 }}>₹{plan.price}</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>to start</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {plan.points.map((p) => (
          <div key={p} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{
              width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1, display: "grid", placeItems: "center",
              background: featured ? "rgba(255,255,255,.22)" : CL.greenSoft,
            }}>
              <Check size={11} color={featured ? "#fff" : "#0a8f5b"} strokeWidth={3} />
            </span>
            <span style={{ fontSize: 13, lineHeight: 1.5, color: featured ? "rgba(255,255,255,.95)" : CL.ink2 }}>{p}</span>
          </div>
        ))}
      </div>

      <Link to={plan.to} style={{
        marginTop: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: featured ? "#fff" : CL.coral, color: featured ? CL.coralDk : "#fff",
        padding: "13px 22px", borderRadius: 13, fontFamily: CL.display, fontWeight: 800, fontSize: 15, textDecoration: "none",
      }}>
        Start now <ArrowRight size={17} />
      </Link>
    </motion.div>
  );
}

export default function PlansSection() {
  return (
    <section id="plans" style={{ background: CL.cream, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* header */}
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 36px" }}>
          <span style={clEyebrow}><GraduationCap size={13} /> 1-on-1 Mentorship</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.8rem)", color: CL.ink, letterSpacing: "-1.2px", margin: "16px 0 12px", lineHeight: 1.1 }}>
            Your personal <span style={{ color: CL.coral }}>IITian mentor.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            Stop guessing. Get a customised daily study plan, weekly test analysis and real accountability from mentors who have actually cracked JEE &amp; NEET.
          </p>
        </div>

        {/* overview band — feature list + image */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 36, alignItems: "center",
            maxWidth: 1040, margin: "0 auto 44px", background: CL.card, borderRadius: 24,
            border: `1px solid ${CL.line}`, boxShadow: CL.shadow, padding: 30,
          }}>
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 26 }}>
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, display: "grid", placeItems: "center", background: CL.coralSoft, color: CL.coralDk }}>
                    <Icon size={19} />
                  </span>
                  <div>
                    <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 15.5, color: CL.ink, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 13.5, color: CL.body, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/mentorship" style={{
              display: "inline-flex", alignItems: "center", gap: 8, background: CL.coral, color: "#fff",
              padding: "15px 26px", borderRadius: 14, fontFamily: CL.display, fontWeight: 800, fontSize: 15.5,
              textDecoration: "none", boxShadow: "0 10px 24px -8px rgba(255, 105, 61,.6)",
            }}>
              Explore Mentorship <ArrowRight size={18} />
            </Link>
          </div>
          <div style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${CL.line}`, boxShadow: "0 18px 44px -24px rgba(26,26,46,.2)" }}>
            <img src="/images/home_mentorship_overview.png" alt="Mentorship overview" style={{ width: "100%", display: "block" }} />
          </div>
        </motion.div>

        {/* mentorship plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1040, margin: "0 auto", alignItems: "stretch" }}>
          {MENTORSHIP_PLANS.map((p) => <PlanCard key={p.to} plan={p} />)}
        </div>

        {/* why-us small cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, maxWidth: 1040, margin: "40px auto 0" }}>
          {WHY.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 16, padding: "20px 22px", boxShadow: CL.shadow }}>
              <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 11, background: CL.coralSoft, color: CL.coralDk, marginBottom: 13 }}>
                <Icon size={18} />
              </span>
              <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.05rem", color: CL.ink, marginBottom: 6 }}>{title}</div>
              <p style={{ fontSize: 13, color: CL.body, lineHeight: 1.55, margin: 0 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
