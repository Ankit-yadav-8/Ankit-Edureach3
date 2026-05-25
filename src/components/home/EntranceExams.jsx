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
    <section className="section" id="exams">
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">Entrance Exams</span>
          <h2 className="section-title">Every major engineering entrance, decoded</h2>
          <p className="section-sub">Eligibility, pattern, important dates and 5-year cutoff trends for each exam.</p>
        </div>

        {/* Featured exam cards */}
        <div className="grid-4" style={{ marginBottom: 22 }}>
          {EXAMS.slice(0, 8).map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.05}>
              <button onClick={() => nav(`/exams/${e.slug}`)} className="card" style={{ textAlign: "left", width: "100%", cursor: "pointer", borderTop: `3px solid ${e.color}` }}>
                <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.05rem", color: "var(--navy)" }}>{e.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 10px" }}>{e.body} · {e.level}</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: e.color, fontWeight: 600, fontSize: 13 }}>
                  View details <ArrowRight size={14} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {EXAM_PILLS.map((p) => (
            <button key={p} className="pill" onClick={() => open(p)} style={{ cursor: "pointer", background: "#fff", border: "1px solid var(--line)", color: "var(--navy)" }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
