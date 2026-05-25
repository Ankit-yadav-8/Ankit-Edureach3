import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, ExternalLink, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import { PRIVATE_BY_SLUG } from "../data/counselling.js";
import { CenterDonut } from "../components/Charts.jsx";
import { fmtINR } from "../utils/format.js";
import Reveal from "../components/Reveal.jsx";

export default function PrivateDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const u = PRIVATE_BY_SLUG[slug];
  if (!u) return <div className="page container" style={{ padding: "80px 0", textAlign: "center" }}><h2>University not found</h2><Link to="/#private" className="btn btn-coral" style={{ marginTop: 16 }}>Private universities</Link></div>;

  const placeData = [
    { name: "Avg package", value: u.placements.avg },
    { name: "Highest", value: u.placements.highest },
  ];

  return (
    <div className="page">
      <section style={{ background: `linear-gradient(135deg,${u.accent},#1c1c28)`, color: "#fff", padding: "40px 0" }}>
        <div className="container">
          <button onClick={() => nav(-1)} className="btn btn-light" style={{ marginBottom: 18 }}><ArrowLeft size={16} /> Back</button>
          <span className="badge teal">Private University · {u.exam}</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "10px 0 4px" }}>{u.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.85)" }}><MapPin size={16} /> {u.state} · Fees {u.fees}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <a href={u.apply} target="_blank" rel="noreferrer" className="btn btn-coral">Apply Now <ExternalLink size={15} /></a>
            <a href={u.website} target="_blank" rel="noreferrer" className="btn btn-light"><Globe size={15} /> Website</a>
          </div>
        </div>
      </section>

      <div className="container section">
        <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
          <Reveal>
            <div className="card">
              <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>About</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{u.about}</p>
              <h4 style={{ fontFamily: "Sora", fontWeight: 700, margin: "18px 0 10px", display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={17} color="var(--gold)" /> Highlights</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                {u.highlights.map((h) => <li key={h} style={{ display: "flex", gap: 9, fontSize: 14.5, color: "var(--navy)" }}><CheckCircle2 size={17} color="var(--teal)" style={{ flexShrink: 0, marginTop: 2 }} /> {h}</li>)}
              </ul>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                {u.courses.map((c) => <span key={c} className="pill" style={{ background: "var(--sky)", border: "1px solid var(--line)" }}>{c}</span>)}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="card">
              <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Placements</h3>
              <CenterDonut data={placeData} centerLabel={`${u.placements.placedPct}%`} centerSub="placed" colors={["#2EC4B6", "#F97316"]} height={190} />
              <div className="grid-2" style={{ gap: 12, marginTop: 12 }}>
                {[["Average", u.placements.avg], ["Highest", u.placements.highest]].map(([l, v]) => (
                  <div key={l} style={{ background: "var(--sky)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{l}</div>
                    <strong style={{ fontFamily: "Sora", fontSize: "1.2rem", color: "var(--navy)" }}>{fmtINR(v)}</strong>
                  </div>
                ))}
              </div>
              <span className="pill" style={{ marginTop: 14, background: "#fff3e6", color: "#F97316" }}>Application deadline: {u.deadline}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
