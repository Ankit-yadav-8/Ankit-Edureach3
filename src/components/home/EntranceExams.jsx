import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EXAMS } from "../../data/exams.js";
import Reveal from "../Reveal.jsx";

export default function EntranceExams() {
  const nav = useNavigate();

  return (
    <section className="section" id="exams" style={{ background: "linear-gradient(160deg, #ffffff 0%, #ffffff 40%, #ffffff 100%)", position: "relative", overflow: "hidden" }}>
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">Entrance Exams</span>
          <h2 className="section-title" style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", color: "#1a1a2e" }}>Every major engineering entrance, <span className="accent">decoded</span></h2>
          <p className="section-sub" style={{ color: "#4b5563" }}>Eligibility, pattern, important dates and 5-year cutoff trends for each exam.</p>
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

        {/* Single button (consistent on laptop + mobile) instead of a long pill cloud */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <button
            className="btn btn-coral"
            style={{ fontSize: 14.5, padding: "13px 26px" }}
            onClick={() => nav("/exams")}
          >
            View All Entrance Exams <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
