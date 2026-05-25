import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, ExternalLink, ArrowRight } from "lucide-react";
import { NEWS_BY_SLUG, NEWS } from "../data/news.js";
import Reveal from "../components/Reveal.jsx";

export default function NewsDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const n = NEWS_BY_SLUG[slug];
  if (!n) return <div className="page container" style={{ padding: "80px 0", textAlign: "center" }}><h2>Article not found</h2><Link to="/#news" className="btn btn-coral" style={{ marginTop: 16 }}>All news</Link></div>;

  const related = NEWS.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <div className="page">
      <section style={{ background: n.image, height: 240, position: "relative" }}>
        <div className="container" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 24 }}>
          <button onClick={() => nav(-1)} className="btn btn-light" style={{ alignSelf: "flex-start", marginBottom: "auto", marginTop: 20 }}><ArrowLeft size={16} /> Back</button>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>{n.tags.map((t) => <span key={t} style={{ background: "rgba(255,255,255,.92)", color: "var(--navy)", fontWeight: 700, fontSize: 11.5, padding: "4px 10px", borderRadius: 20 }}>{t}</span>)}</div>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, color: "#fff", fontSize: "clamp(1.5rem,3.5vw,2.3rem)", lineHeight: 1.2, maxWidth: 800 }}>{n.title}</h1>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 760, marginTop: 24, paddingBottom: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}><Clock size={14} /> {n.date}</div>
        <article style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {n.body.map((p, i) => <p key={i} style={{ fontSize: 16.5, lineHeight: 1.75, color: "#2b2f38" }}>{p}</p>)}
        </article>
        <a href={n.source} target="_blank" rel="noreferrer" className="btn btn-coral" style={{ marginTop: 24 }}>Read at official source <ExternalLink size={15} /></a>

        <h3 style={{ fontFamily: "Sora", fontWeight: 700, margin: "44px 0 16px" }}>Related updates</h3>
        <div className="grid-3">
          {related.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.06}>
              <button onClick={() => { nav(`/news/${r.slug}`); window.scrollTo({ top: 0 }); }} className="card" style={{ textAlign: "left", cursor: "pointer", width: "100%", height: "100%" }}>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{r.date}</div>
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "0.98rem", lineHeight: 1.35, margin: "6px 0 8px", color: "var(--navy)" }}>{r.title}</h4>
                <span style={{ color: "var(--coral)", fontWeight: 600, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 5 }}>Read <ArrowRight size={13} /></span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
