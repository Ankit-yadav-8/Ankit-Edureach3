import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, FileText, ExternalLink, CalendarDays, CheckCircle2, ListChecks } from "lucide-react";
import { EXAM_BY_SLUG } from "../data/exams.js";
import { Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";

export default function ExamDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const exam = EXAM_BY_SLUG[slug];

  if (!exam) return <div className="page container" style={{ padding: "80px 0", textAlign: "center" }}><h2>Exam not found</h2><Link to="/exams" className="btn btn-coral" style={{ marginTop: 16 }}>All exams</Link></div>;

  return (
    <div className="page">
      <section style={{ background: `linear-gradient(135deg,${exam.color},#1c1c28)`, color: "#fff", padding: "40px 0" }}>
        <div className="container">
          <button onClick={() => nav(-1)} className="btn btn-light" style={{ marginBottom: 18 }}><ArrowLeft size={16} /> Back</button>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)" }}>{exam.name}</h1>
          <p style={{ color: "rgba(255,255,255,.85)", maxWidth: 640, margin: "6px 0 14px" }}>{exam.about}</p>
          <a href={exam.website} target="_blank" rel="noreferrer" className="btn btn-coral"><Globe size={16} /> Official Website</a>
        </div>
      </section>

      <div className="container section" style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <Reveal>
          <div className="grid-2" style={{ gap: 22, alignItems: "start" }}>
            <div className="card">
              <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><CheckCircle2 size={18} color="var(--green)" /> Eligibility</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {exam.eligibility.map((e, i) => <li key={i} style={{ display: "flex", gap: 10, fontSize: 14.5, color: "var(--navy)" }}><CheckCircle2 size={17} color="var(--teal)" style={{ flexShrink: 0, marginTop: 2 }} /> {e}</li>)}
              </ul>
            </div>
            <div className="card">
              <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><ListChecks size={18} color="var(--coral)" /> Exam pattern</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {exam.pattern.map((p, i) => <li key={i} style={{ display: "flex", gap: 10, fontSize: 14.5, color: "var(--navy)" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--coral)", marginTop: 7, flexShrink: 0 }} /> {p}</li>)}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="card">
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><CalendarDays size={18} color="var(--violet)" /> Important dates</h3>
            <table className="data-table">
              <tbody>{exam.dates.map(([l, d]) => <tr key={l}><td>{l}</td><td style={{ textAlign: "right", fontWeight: 600 }}>{d}</td></tr>)}</tbody>
            </table>
          </div>
        </Reveal>

        <Reveal>
          <div className="card">
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>5-year cutoff trend</h3>
            <Trend data={exam.cutoffTrend} lines={[
              { key: "open", label: "General", color: "#1c1c28" },
              { key: "obc", label: "OBC-NCL", color: "#F4A261" },
              { key: "sc", label: "SC", color: "#2EC4B6" },
              { key: "st", label: "ST", color: "#F97316" },
            ]} height={300} />
          </div>
        </Reveal>

        <Reveal>
          <div className="card">
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Question papers & keys</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {exam.papers.map((p) => (
                <a key={p.label} href={p.url} target="_blank" rel="noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "var(--sky)", borderRadius: 10, color: "var(--navy)", fontWeight: 500 }}>
                  <span style={{ display: "flex", gap: 9, alignItems: "center" }}><FileText size={16} color="var(--coral)" /> {p.label}</span>
                  <ExternalLink size={14} color="var(--muted)" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {(slug === "jee-main" || slug === "jee-advanced") && (
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to={`/${slug}#rank`} className="btn btn-coral">Open Rank Predictor</Link>
            <Link to={`/${slug}#college`} className="btn btn-navy">Open College Predictor</Link>
          </div>
        )}
      </div>
    </div>
  );
}
