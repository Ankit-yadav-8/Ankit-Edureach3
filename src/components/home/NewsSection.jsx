import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { NEWS } from "../../data/news.js";
import Reveal from "../Reveal.jsx";

/* Auto-scroll news ticker */
function NewsTicker() {
  const items = NEWS.slice(0, 8);
  const all = [...items, ...items];
  return (
    <div className="news-ticker-wrap" style={{ marginBottom: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 16, position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 3 }}>
        <span style={{ background: "#F47B20", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 4, letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: "'Space Grotesk',sans-serif" }}>
          🔔 LIVE
        </span>
      </div>
      <div style={{ paddingLeft: 90, overflow: "hidden" }}>
        <div className="news-ticker-track">
          {all.map((n, i) => (
            <span key={i} className="news-ticker-item">
              <span className="news-ticker-dot" />
              <span style={{ color: "#F47B20", fontWeight: 700, marginRight: 4 }}>{n.tags[0]}</span>
              {n.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const TAG_COLORS = {
  "JEE Main": "#F47B20",
  "JEE Advanced": "#6366f1",
  "CBSE": "#0ea5a4",
  "JoSAA": "#15a06e",
  "CSAB": "#15a06e",
  "VITEEE": "#2a2a3c",
  "IIIT Hyderabad": "#8b5cf6",
};

export default function NewsSection() {
  const [count, setCount] = useState(6);
  const nav = useNavigate();
  const shown = NEWS.slice(0, count);

  return (
    <section className="section" id="news" style={{ background: "var(--sky)", paddingTop: 0 }}>
      {/* Breaking news ticker */}
      <NewsTicker />

      <div className="container" style={{ paddingTop: "3.5rem" }}>
        <div className="title-bar">
          <span className="eyebrow"><Zap size={11} /> Latest Updates</span>
          <h2 className="section-title">Exam & Admission Updates <span className="accent">That Matter</span></h2>
          <p className="section-sub">Results, admit cards, counselling schedules — tap any card to read the full story.</p>
        </div>

        <div className="grid-3">
          {shown.map((n, i) => (
            <Reveal key={n.slug} delay={(i % 3) * 0.06}>
              <button
                onClick={() => nav(`/news/${n.slug}`)}
                style={{
                  textAlign: "left", width: "100%", cursor: "pointer",
                  padding: 0, overflow: "hidden", display: "flex", flexDirection: "column",
                  height: "100%", background: "#fff", borderRadius: 16,
                  border: "1px solid rgba(0,0,0,.07)", boxShadow: "0 2px 14px rgba(28,28,40,.07)",
                  transition: "box-shadow .25s, transform .25s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(28,28,40,.13)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 14px rgba(28,28,40,.07)"; }}
              >
                {/* Image banner */}
                <div style={{ height: 155, position: "relative", overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: n.image,
                    transition: "transform .4s ease",
                  }} />
                  {/* Gradient overlay */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.55) 100%)" }} />
                  {/* Tags */}
                  <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap", zIndex: 2 }}>
                    {n.tags.slice(0, 2).map((t) => (
                      <span key={t} style={{
                        background: TAG_COLORS[t] || "#F47B20",
                        color: "#fff", fontSize: 10, fontWeight: 700,
                        padding: "3px 10px", borderRadius: 20,
                        fontFamily: "'Space Grotesk',sans-serif",
                        letterSpacing: "0.5px",
                      }}>{t}</span>
                    ))}
                  </div>
                  {/* Date on image */}
                  <div style={{ position: "absolute", bottom: 10, right: 12, zIndex: 2, display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(255,255,255,.8)", fontWeight: 600 }}>
                    <Clock size={10} /> {n.date}
                  </div>
                </div>
                {/* Body */}
                <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <h3 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: "0.98rem", lineHeight: 1.35, color: "var(--navy)" }}>{n.title}</h3>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55, flex: 1 }}>{n.excerpt}</p>
                  <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--coral)", fontWeight: 700, fontSize: 12.5, fontFamily: "'Space Grotesk',sans-serif" }}>
                    Read full story <ArrowRight size={13} />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {count < NEWS.length && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button className="btn btn-navy" onClick={() => setCount((c) => c + 3)}>Load more news</button>
          </div>
        )}
      </div>
    </section>
  );
}
