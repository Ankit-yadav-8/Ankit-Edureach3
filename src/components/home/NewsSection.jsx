import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { NEWS } from "../../data/news.js";
import Reveal from "../Reveal.jsx";

export default function NewsSection() {
  const [count, setCount] = useState(6);
  const nav = useNavigate();
  const shown = NEWS.slice(0, count);

  return (
    <section className="section" id="news" style={{ background: "var(--sky)" }}>
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">Latest News</span>
          <h2 className="section-title">Exam & admission updates that matter</h2>
          <p className="section-sub">Results, admit cards, counselling schedules — tap any card to read the full story.</p>
        </div>

        <div className="grid-3">
          {shown.map((n, i) => (
            <Reveal key={n.slug} delay={(i % 3) * 0.06}>
              <button onClick={() => nav(`/news/${n.slug}`)} className="card" style={{ textAlign: "left", width: "100%", cursor: "pointer", padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ height: 120, background: n.image, position: "relative" }}>
                  <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {n.tags.slice(0, 2).map((t) => (
                      <span key={t} style={{ background: "rgba(255,255,255,.9)", color: "var(--navy)", fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 5 }}><Clock size={12} /> {n.date}</div>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.02rem", lineHeight: 1.32, color: "var(--navy)" }}>{n.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{n.excerpt}</p>
                  <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--coral)", fontWeight: 600, fontSize: 13 }}>
                    Read more <ArrowRight size={14} />
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
