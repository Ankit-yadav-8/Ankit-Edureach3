import { useNavigate } from "react-router-dom";
import { ExternalLink, ArrowRight, MapPin } from "lucide-react";
import { PRIVATE_UNIS } from "../../data/counselling.js";
import { fmtINR } from "../../utils/format.js";
import Reveal from "../Reveal.jsx";

export default function PrivateUniversities() {
  const nav = useNavigate();
  return (
    <section className="section" id="private">
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">Private Universities</span>
          <h2 className="section-title">Strong private options worth applying to</h2>
          <p className="section-sub">Open application windows, fees and placement snapshots — apply directly or view full details.</p>
        </div>

        <div className="grid-4">
          {PRIVATE_UNIS.map((u, i) => (
            <Reveal key={u.slug} delay={i * 0.05}>
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: 9, height: "100%", borderTop: `3px solid ${u.accent}` }}>
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.04rem", color: "var(--navy)" }}>{u.name}</h3>
                <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={12} /> {u.state} · via {u.exam}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12.5, padding: "8px 0", borderTop: "1px solid var(--line)" }}>
                  <div><div style={{ color: "var(--muted)" }}>Fees</div><strong>{u.fees}</strong></div>
                  <div><div style={{ color: "var(--muted)" }}>Avg pkg</div><strong>{fmtINR(u.placements.avg)}</strong></div>
                </div>
                <span className="pill" style={{ alignSelf: "flex-start", background: "#fff3e6", color: "#F97316", fontSize: 11 }}>Deadline {u.deadline}</span>
                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <a href={u.apply} target="_blank" rel="noreferrer" className="btn btn-coral" style={{ flex: 1, justifyContent: "center", fontSize: 12.5 }}>
                    Apply <ExternalLink size={13} />
                  </a>
                  <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 12.5 }} onClick={() => nav(`/private/${u.slug}`)}>
                    Details <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
