import { useNavigate } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { ArrowRight, Globe } from "lucide-react";
import { EXAMS, EXAM_PILLS } from "../data/exams.js";
import Reveal from "../components/Reveal.jsx";

const SLUG_BY_NAME = Object.fromEntries(EXAMS.map((e) => [e.name.toLowerCase(), e.slug]));

export default function Exams() {
  const nav = useNavigate();
  return (
    <div className="page">
      <Seo
        title="Engineering Entrance Exams 2026 — JEE Main, Advanced, BITSAT & More"
        description="Dates, eligibility, exam pattern, syllabus and 5-year cutoff trends for JEE Main, JEE Advanced, BITSAT and other top engineering entrance exams in India."
        path="/exams"
      />
      <section className="warm-page-header" style={{ padding: "44px 0" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 65% at 100% 20%, rgba(249,115,22,.20) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow">Entrance Exams</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "8px 0 4px", color: "#1c1c28" }}>Every engineering entrance, in one place</h1>
          <p style={{ color: "rgba(28,28,40,.62)" }}>Eligibility, exam pattern, important dates and cutoff trends for each test.</p>
        </div>
      </section>

      <div className="container section">
        <div className="grid-3">
          {EXAMS.map((e, i) => (
            <Reveal key={e.slug} delay={(i % 3) * 0.06}>
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%", borderTop: `3px solid ${e.color}` }}>
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.15rem", color: "var(--navy)" }}>{e.name}</h3>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{e.full}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge teal">{e.body}</span>
                  <span className="badge orange">{e.level}</span>
                </div>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>{e.accepts}</p>
                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <button className="btn btn-coral" style={{ flex: 1, justifyContent: "center", fontSize: 13 }} onClick={() => nav(`/exams/${e.slug}`)}>View details <ArrowRight size={15} /></button>
                  <a href={e.website} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 13 }}><Globe size={15} /></a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div style={{ marginTop: 36 }}>
          <h3 style={{ fontFamily: "Sora", fontWeight: 700, textAlign: "center", marginBottom: 16 }}>More state & university exams</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {EXAM_PILLS.map((p) => {
              const slug = SLUG_BY_NAME[p.toLowerCase()];
              return <button key={p} className="pill" style={{ cursor: "pointer", background: "#fff", border: "1px solid var(--line)", color: "var(--navy)" }} onClick={() => nav(slug ? `/exams/${slug}` : "/exams")}>{p}</button>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
