import { useNavigate } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { ArrowRight, Globe, CalendarDays, Building2 } from "lucide-react";
import { EXAMS } from "../data/exams.js";
import Reveal from "../components/Reveal.jsx";

export default function Exams() {
  const nav = useNavigate();
  return (
    <div className="page">
      <Seo
        title="Engineering Entrance Exams 2026 — JEE Main, Advanced, BITSAT & More"
        description="Dates, eligibility, exam pattern, syllabus and 5-year cutoff trends for JEE Main, JEE Advanced, BITSAT and other top engineering entrance exams in India."
        path="/exams"
      />
      <section className="warm-page-header" style={{ padding: "48px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 65% at 100% 20%, rgba(249,115,22,.20) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow">Entrance Exams</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "8px 0 4px", color: "#1c1c28" }}>Every engineering entrance, in one place</h1>
          <p style={{ color: "rgba(28,28,40,.62)" }}>Eligibility, exam pattern, important dates and cutoff trends for each test.</p>
        </div>
      </section>

      <div className="container section">
        <div className="grid-3">
          {EXAMS.map((e, i) => {
            const nextDate = e.dates && e.dates[0];
            return (
              <Reveal key={e.slug} delay={(i % 3) * 0.06}>
                <div
                  className="card hover-glow"
                  style={{ display: "flex", flexDirection: "column", height: "100%", padding: 0, overflow: "hidden", cursor: "pointer" }}
                  onClick={() => nav(`/exams/${e.slug}`)}
                >
                  {/* colour header */}
                  <div style={{ background: `linear-gradient(135deg, ${e.color}, ${e.color}cc)`, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -18, right: -18, width: 84, height: 84, borderRadius: "50%", background: "rgba(255,255,255,.10)" }} />
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, position: "relative", zIndex: 1 }}>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "#fff", margin: 0, letterSpacing: "-0.2px" }}>{e.name}</h3>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", marginTop: 3 }}>{e.full}</div>
                      </div>
                      <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 800, letterSpacing: ".04em", color: "#fff", background: "rgba(255,255,255,.22)", padding: "4px 9px", borderRadius: 50, whiteSpace: "nowrap" }}>{e.level}</span>
                    </div>
                  </div>

                  {/* body */}
                  <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: e.color, background: `${e.color}14`, border: `1px solid ${e.color}33`, padding: "3px 10px", borderRadius: 50 }}>
                        <Building2 size={12} /> {e.body}
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>{e.accepts}</p>
                    {nextDate && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#374151", background: "rgba(244,123,32,.06)", border: "1px solid rgba(244,123,32,.18)", borderRadius: 10, padding: "8px 11px" }}>
                        <CalendarDays size={14} color="#F47B20" style={{ flexShrink: 0 }} />
                        <span style={{ minWidth: 0 }}><strong style={{ color: "#1c1c28" }}>{nextDate[0]}:</strong> {nextDate[1]}</span>
                      </div>
                    )}
                  </div>

                  {/* footer */}
                  <div style={{ display: "flex", gap: 8, padding: "0 18px 18px" }}>
                    <button
                      className="btn btn-coral"
                      style={{ flex: 1, justifyContent: "center", fontSize: 13 }}
                      onClick={(ev) => { ev.stopPropagation(); nav(`/exams/${e.slug}`); }}
                    >
                      View details <ArrowRight size={15} />
                    </button>
                    <a
                      href={e.website}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost"
                      style={{ fontSize: 13 }}
                      onClick={(ev) => ev.stopPropagation()}
                      aria-label={`${e.name} official website`}
                    >
                      <Globe size={15} />
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Single CTA in place of the long pill cloud (consistent on laptop + mobile) */}
        <Reveal>
          <div style={{ marginTop: 44, textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: 14.5, maxWidth: 520, margin: "0 auto 16px", lineHeight: 1.6 }}>
              Looking for a state or private-university exam? Explore every college and the exams it accepts — all in one place.
            </p>
            <button
              className="btn btn-coral"
              style={{ fontSize: 14.5, padding: "13px 26px" }}
              onClick={() => nav("/colleges")}
            >
              Explore All Colleges <ArrowRight size={16} />
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
