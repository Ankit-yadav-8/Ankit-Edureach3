import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EXAMS, EXAM_PILLS } from "../../data/exams.js";
import Reveal from "../Reveal.jsx";

// map a pill label to a known exam slug if we have a detail page for it
const SLUG_BY_NAME = Object.fromEntries(EXAMS.map((e) => [e.name.toLowerCase(), e.slug]));

export default function EntranceExams() {
  const nav = useNavigate();
  const open = (label) => {
    const slug = SLUG_BY_NAME[label.toLowerCase()];
    nav(slug ? `/exams/${slug}` : `/exams`);
  };

  return (
    <section className="section" id="exams" style={{ background: "linear-gradient(160deg, #1a0800 0%, #2d1200 40%, #1a0800 100%)", position: "relative", overflow: "hidden" }}>
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">Entrance Exams</span>
          <h2 className="section-title" style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", color: "#fff" }}>Every major engineering entrance, <span className="accent">decoded</span></h2>
          <p className="section-sub" style={{ color: "rgba(255,255,255,.65)" }}>Eligibility, pattern, important dates and 5-year cutoff trends for each exam.</p>
        </div>

        {/* Featured exam cards */}
        <div className="grid-4" style={{ marginBottom: 22 }}>
          {EXAMS.slice(0, 8).map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.05}>
              <button onClick={() => nav(`/exams/${e.slug}`)} className="card hover-glow" style={{ textAlign: "left", width: "100%", cursor: "pointer", borderTop: `3px solid ${e.color}`, padding: "18px 16px" }}>
                <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--navy)", letterSpacing: "-0.2px" }}>{e.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", margin: "5px 0 12px" }}>{e.body} · {e.level}</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: e.color, fontWeight: 700, fontSize: 12.5, fontFamily: "'Space Grotesk',sans-serif" }}>
                  View details <ArrowRight size={13} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {EXAM_PILLS.map((p) => (
            <button key={p} className="pill" onClick={() => open(p)} style={{ cursor: "pointer" }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
