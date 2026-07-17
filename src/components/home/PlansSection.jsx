/* PlansSection — the home page's 1-on-1 Mentorship block. Mentorship-only
   layout: a concise header, an overview band (feature list + image) and a row
   of small "why us" cards. The JoSAA Counselling toggle/tiers and the big
   mentorship pricing cards that used to live here were removed — counselling
   lives on /josaa-2026 and the full plans on /mentorship. */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, ArrowRight, Target, Rocket, CheckCircle2,
  ShieldCheck, Star, Phone, CalendarCheck, LineChart, MessageCircle,
} from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";
import MentorChatPhone from "./MentorChatPhone.jsx";

const FEATURES = [
  { icon: Target,        title: "A roadmap built around you",     desc: "Your syllabus, your weak areas, your target rank — turned into a phase-by-phase plan you actually follow." },
  { icon: CalendarCheck, title: "Daily targets & accountability", desc: "A customised day-by-day plan, checked every single day so you never drift or lose a week." },
  { icon: LineChart,     title: "Weekly test analysis",           desc: "Spot weak chapters early and fix them before they quietly cost you 20–30 marks in the real exam." },
  { icon: MessageCircle, title: "1-on-1 doubt solving",           desc: "Direct mentor access on WhatsApp whenever you're stuck — no waiting days for one concept." },
  { icon: Rocket,        title: "Strategy + motivation",          desc: "Exam tactics, revision cycles and a mentor who keeps you consistent when your own motivation dips." },
];

/* Short reassurance chips shown under the CTA. */
const ASSURANCE = [
  "IITian & doctor mentors",
  "1000+ students mentored",
  "Cancel anytime",
];

const WHY = [
  { icon: Star,        title: "1000+ students mentored", desc: "Real students, real rank jumps across JEE & NEET every season." },
  { icon: ShieldCheck, title: "IITian & doctor mentors", desc: "1-on-1 guidance from people who have actually cracked the exam." },
  { icon: Phone,       title: "WhatsApp support",        desc: "A direct line to your mentor whenever you're stuck — no waiting." },
];

export default function PlansSection() {
  return (
    <section id="plans" style={{ background: CL.cream, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* header */}
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 36px" }}>
          <span style={clEyebrow}><GraduationCap size={13} /> 1-on-1 Mentorship</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.8rem)", color: CL.ink, letterSpacing: "-1.2px", margin: "16px 0 12px", lineHeight: 1.1 }}>
            Your personal <span style={{ color: CL.coralText }}>IITian mentor.</span>
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
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 36, alignItems: "center",
            maxWidth: 1040, margin: "0 auto 44px", background: CL.card, borderRadius: 24,
            border: `1px solid ${CL.line}`, boxShadow: CL.shadow, padding: 30,
          }}>
          <div>
            <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.32rem", color: CL.ink, letterSpacing: "-0.4px", lineHeight: 1.25, marginBottom: 8 }}>
              A topper's mentor — mapped onto your prep.
            </div>
            <p style={{ color: CL.body, fontSize: 14, lineHeight: 1.65, marginBottom: 22 }}>
              Coaching teaches the whole class the same thing. Your CollegeParichay mentor works only on <strong style={{ color: CL.ink }}>you</strong> — what to study today, what's slipping, and exactly how to fix it before the exam. Here's what that looks like week to week:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
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
              display: "inline-flex", alignItems: "center", gap: 8, background: CL.coralText, color: "#fff",
              padding: "15px 26px", borderRadius: 14, fontFamily: CL.display, fontWeight: 800, fontSize: 15.5,
              textDecoration: "none", boxShadow: "0 10px 24px -8px rgba(255, 105, 61,.6)",
            }}>
              Explore Mentorship <ArrowRight size={18} />
            </Link>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 18 }}>
              {ASSURANCE.map((a) => (
                <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: CL.body }}>
                  <CheckCircle2 size={14} color={CL.coral} /> {a}
                </span>
              ))}
            </div>
          </div>
          <MentorChatPhone />
        </motion.div>

        {/* why-us small cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 20, maxWidth: 1040, margin: "0 auto" }}>
          {WHY.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 16, padding: "22px 24px", boxShadow: CL.shadow }}>
              <Icon size={22} color={CL.coral} style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.08rem", color: CL.ink, marginBottom: 6 }}>{title}</div>
              <p style={{ fontSize: 13, color: CL.body, lineHeight: 1.55, margin: 0 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
