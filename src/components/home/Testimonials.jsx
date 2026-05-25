import { Quote, Star } from "lucide-react";
import Reveal from "../Reveal.jsx";

const TESTIMONIALS = [
  { name: "Ananya R.", detail: "Got into NIT Trichy CSE", text: "The college predictor showed me exactly which NITs were in reach for my rank. I filled my JoSAA choices with way more confidence.", accent: "#F97316" },
  { name: "Karthik V.", detail: "IIT Hyderabad, 2024", text: "Loved seeing all the round-wise cutoffs in one place. The rank predictor was surprisingly close to my actual result.", accent: "#2EC4B6" },
  { name: "Sneha P.", detail: "Parent", text: "As a parent, the fees and placement breakdowns helped us plan finances. Clean, honest and easy to understand.", accent: "#0EA5A4" },
];

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">Loved by students</span>
          <h2 className="section-title">What students &amp; parents say</h2>
          <p className="section-sub">Real outcomes from people who used EduReach to navigate admissions.</p>
        </div>
        <div className="grid-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12, borderTop: `3px solid ${t.accent}` }}>
                <Quote size={28} color={t.accent} />
                <p style={{ color: "var(--ink)", lineHeight: 1.65, fontSize: 15, flex: 1 }}>"{t.text}"</p>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={15} fill="#F4A261" color="#F4A261" />)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--navy)", fontFamily: "Sora" }}>{t.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{t.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
