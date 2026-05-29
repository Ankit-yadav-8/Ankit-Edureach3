import { Quote, Star } from "lucide-react";
import Reveal from "../Reveal.jsx";

const TESTIMONIALS = [
  { name: "Ananya R.", detail: "Got into NIT Trichy CSE", text: "The college predictor showed me exactly which NITs were in reach for my rank. I filled my JoSAA choices with way more confidence.", accent: "#F97316" },
  { name: "Karthik V.", detail: "IIT Hyderabad, 2024", text: "Loved seeing all the round-wise cutoffs in one place. The rank predictor was surprisingly close to my actual result.", accent: "#2EC4B6" },
  { name: "Sneha P.", detail: "Parent", text: "As a parent, the fees and placement breakdowns helped us plan finances. Clean, honest and easy to understand.", accent: "#0EA5A4" },
];

export default function Testimonials() {
  return (
    <section className="section" style={{ background: "linear-gradient(160deg, #1a0800 0%, #2d1200 40%, #1a0800 100%)", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: -60, left: "20%", width: 400, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,123,32,.18) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="title-bar">
          <span className="eyebrow">Loved by students</span>
          <h2 className="section-title" style={{ color: "#fff" }}>What students &amp; parents say</h2>
          <p className="section-sub" style={{ color: "rgba(255,255,255,.65)" }}>Real outcomes from people who used College Parichay to navigate admissions.</p>
        </div>
        <div className="grid-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12, borderTop: `3px solid ${t.accent}`, background: "rgba(255,255,255,.05)", border: `1px solid ${t.accent}22` }}>
                <Quote size={28} color={t.accent} />
                <p style={{ color: "rgba(255,255,255,.8)", lineHeight: 1.65, fontSize: 15, flex: 1 }}>"{t.text}"</p>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={15} fill="#F4A261" color="#F4A261" />)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff", fontFamily: "Sora" }}>{t.name}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.5)" }}>{t.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
