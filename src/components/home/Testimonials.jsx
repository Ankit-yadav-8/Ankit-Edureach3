/* Testimonials — what students & parents say. Campusloom-styled cards. */
import { Quote, Star, BadgeCheck } from "lucide-react";
import Reveal from "../Reveal.jsx";
import { CL, clEyebrow } from "./clTheme.js";

const TESTIMONIALS = [
  {
    name: "Ananya R.", detail: "B.Tech CSE, NIT Trichy · 2025", initials: "AR", color: CL.coral,
    text: "The college predictor showed me exactly which NITs were in reach for my 8,400 rank. I filled my JoSAA choices with so much more confidence — and landed CSE at Trichy in Round 3.",
  },
  {
    name: "Karthik V.", detail: "B.Tech, IIT Hyderabad · 2024", initials: "KV", color: CL.green,
    text: "Seeing all the round-wise opening and closing ranks in one place was a game-changer. The rank predictor came within ~400 ranks of my actual JEE Advanced result.",
  },
  {
    name: "Sneha P.", detail: "Parent of a 2025 aspirant", initials: "SP", color: CL.amber,
    text: "As a parent, the fee and placement breakdowns helped us plan finances honestly. No jargon, no false promises — just clear numbers we could actually understand.",
  },
  {
    name: "Rohit M.", detail: "Branch vs College user", initials: "RM", color: CL.violet,
    text: "I was torn between a top NIT's core branch and CSE at a mid-tier college. The 6-question assessment finally gave me clarity — it said branch-first, and it was spot on for me.",
  },
  {
    name: "Fatima S.", detail: "JoSAA ₹499 plan · 2025", initials: "FS", color: CL.blue,
    text: "The Pro counselling plan was worth every rupee. My mentor built a 32-choice list around my category rank and walked me through Float vs Freeze after Round 1 on WhatsApp.",
  },
  {
    name: "Aditya K.", detail: "Dropper, JEE 2026 prep", initials: "AK", color: CL.coralDk,
    text: "The Branch Catalog killed a lot of myths for me. I almost dropped ECE thinking it had 'no software scope' — turns out that's completely wrong. Changed my whole strategy.",
  },
];

export default function Testimonials() {
  return (
    <section style={{ background: CL.cream, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 40px" }}>
          <span style={clEyebrow}><Star size={13} /> Loved by students & parents</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.7rem)", color: CL.ink, letterSpacing: "-1.1px", margin: "16px 0 12px", lineHeight: 1.1 }}>
            What students & parents <span style={{ color: CL.coral }}>say.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            Real outcomes from people who used College Parichay to navigate JEE admissions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22 }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.07}>
              <div style={{
                height: "100%", background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`,
                boxShadow: CL.shadow, padding: "26px 24px", display: "flex", flexDirection: "column", gap: 14,
                borderTop: `3px solid ${t.color}`,
              }}>
                <Quote size={26} color={t.color} />
                <p style={{ color: CL.ink2, lineHeight: 1.7, fontSize: 14.5, flex: 1 }}>"{t.text}"</p>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={15} fill={CL.amber} color={CL.amber} />)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 42, height: 42, borderRadius: "50%", background: `${t.color}1a`, color: t.color, display: "grid", placeItems: "center", fontFamily: CL.display, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                    {t.initials}
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, color: CL.ink, fontFamily: CL.display, fontSize: 14.5, display: "flex", alignItems: "center", gap: 5 }}>
                      {t.name} <BadgeCheck size={14} color={CL.green} />
                    </div>
                    <div style={{ fontSize: 12.5, color: CL.muted }}>{t.detail}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
