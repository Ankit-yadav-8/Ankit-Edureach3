import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, FileText, ExternalLink, CalendarDays, CheckCircle2, ListChecks, GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { EXAM_BY_SLUG } from "../data/exams.js";
import { Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import Seo from "../components/Seo.jsx";

export default function ExamDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const exam = EXAM_BY_SLUG[slug];

  if (!exam) return <div className="page container" style={{ padding: "80px 0", textAlign: "center" }}><Seo title="Exam not found" robots="noindex, follow" path={`/exams/${slug}`} /><h2>Exam not found</h2><Link to="/exams" className="btn btn-coral" style={{ marginTop: 16 }}>All exams</Link></div>;

  const seoYear = new Date().getFullYear();

  return (
    <div className="page">
      <Seo
        title={`${exam.name} ${seoYear} — Dates, Pattern, Eligibility & Cutoffs`}
        description={`${exam.name}: ${(exam.about || "").slice(0, 150)} Check exam dates, pattern, eligibility, previous papers and cutoff trends on CollegeParichay.`}
        path={`/exams/${slug}`}
      />
      <section className="warm-page-header">
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: `radial-gradient(ellipse 60% 70% at 100% 20%, ${exam.color}30 0%, transparent 60%)` }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 50% at 0% 100%, rgba(244,162,97,.18) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, display: "flex", gap: 28, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 440px", minWidth: 0 }}>
            <button onClick={() => nav(-1)} className="btn btn-ghost" style={{ marginBottom: 18, color: "#fff" }}><ArrowLeft size={16} /> Back</button>
            <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#1c1c28" }}>{exam.name}</h1>
            <p style={{ color: "rgba(28,28,40,.62)", maxWidth: 640, margin: "6px 0 14px" }}>{exam.about}</p>
            <a href={exam.website} target="_blank" rel="noreferrer" className="btn btn-coral"><Globe size={16} /> Official Website</a>
          </div>

          {/* Small Explore Mentorship card (right side) */}
          <Link
            to="/mentorship/jee-2027"
            style={{
              flex: "0 1 320px", maxWidth: 340, alignSelf: "stretch",
              display: "flex", flexDirection: "column", gap: 10,
              background: "linear-gradient(160deg, #fff7ef 0%, #ffffff 60%, #fff3e6 100%)",
              border: "1px solid rgba(244,123,32,.28)", borderRadius: 18,
              padding: "20px 22px", textDecoration: "none", position: "relative", overflow: "hidden",
              boxShadow: "0 16px 44px -26px rgba(244,123,32,.55)",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#F47B20,#f5a623)" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start", fontSize: 11, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "#c2410c", background: "rgba(244,123,32,.1)", border: "1px solid rgba(244,123,32,.28)", padding: "4px 11px", borderRadius: 50 }}>
              <Sparkles size={12} /> 1-on-1 Mentorship
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(244,123,32,.14)", border: "1px solid rgba(244,123,32,.3)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <GraduationCap size={20} color="#F47B20" />
              </span>
              <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1.02rem", color: "#1a1a2e", margin: 0, lineHeight: 1.2 }}>
                Crack {exam.name} with a mentor
              </h3>
            </div>
            <p style={{ color: "#5b6472", fontSize: 13, lineHeight: 1.55, margin: 0 }}>
              A personal IITian / doctor mentor, a study plan and weekly accountability.
            </p>
            <span style={{ marginTop: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg,#F47B20,#f5a623)", color: "#fff", padding: "11px 18px", borderRadius: 11, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 13.5, boxShadow: "0 10px 24px -8px rgba(244,123,32,.6)" }}>
              Explore Mentorship <ArrowRight size={15} />
            </span>
          </Link>
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
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><CalendarDays size={18} color="var(--violet)" /> Important dates</h3>
            {/* Responsive date cards (no fixed-width table) so dates stay readable on every device */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
              {exam.dates.map(([l, d]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--sky)", border: "1px solid rgba(0,0,0,.06)", borderRadius: 12, padding: "12px 14px" }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: `${exam.color}16`, border: `1px solid ${exam.color}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <CalendarDays size={17} color={exam.color} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>{l}</div>
                    <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--navy)" }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
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
