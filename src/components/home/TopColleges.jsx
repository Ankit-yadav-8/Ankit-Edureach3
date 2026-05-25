import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Trophy, ArrowRight, BadgeCheck } from "lucide-react";
import { COLLEGES } from "../../data/colleges.js";
import { fmtINR } from "../../utils/format.js";
import Reveal from "../Reveal.jsx";

const TYPES = ["IIT", "NIT", "IIIT"];
const TAGS = [
  ["Rankings", "overview"],
  ["Admission", "cutoff"],
  ["Courses", "courses"],
  ["Cutoffs", "cutoff"],
  ["Fees", "fees"],
  ["Placements", "placements"],
];

export default function TopColleges() {
  const [type, setType] = useState("IIT");
  const nav = useNavigate();
  const list = COLLEGES.filter((c) => c.type === type).slice(0, 6);

  const goTab = (slug, tab) => nav(`/colleges/${slug}?tab=${tab}`);

  return (
    <section className="section" id="colleges" style={{ background: "var(--sky)" }}>
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">Top Colleges</span>
          <h2 className="section-title">Explore India's premier engineering institutes</h2>
          <p className="section-sub">Tap any tag to jump straight to that section — rankings, cutoffs, fees or placements.</p>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ justifyContent: "center", marginBottom: 26 }}>
          {TYPES.map((t) => (
            <button key={t} className={`tab ${type === t ? "active" : ""}`} onClick={() => setType(t)}>
              {t}s
            </button>
          ))}
        </div>

        <div className="grid-3">
          {list.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.12rem", color: "var(--navy)" }}>{c.name}</h3>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                      <MapPin size={13} /> {c.location}
                    </div>
                  </div>
                  <span className="badge orange" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Trophy size={12} /> NIRF #{c.nirf}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 16, padding: "10px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
                  <div><div style={{ fontSize: 11, color: "var(--muted)" }}>Avg package</div><strong style={{ color: "var(--navy)" }}>{fmtINR(c.placements.avg)}</strong></div>
                  <div><div style={{ fontSize: 11, color: "var(--muted)" }}>Highest</div><strong style={{ color: "var(--green)" }}>{fmtINR(c.placements.highest)}</strong></div>
                  <div><div style={{ fontSize: 11, color: "var(--muted)" }}>Placed</div><strong style={{ color: "var(--navy)" }}>{c.placements.placedPct}%</strong></div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {TAGS.map(([label, tab]) => (
                    <button key={label} onClick={() => goTab(c.slug, tab)} className="pill"
                      style={{ cursor: "pointer", fontSize: 12, padding: "5px 11px", background: "var(--sky)", border: "1px solid var(--line)", color: "var(--navy)" }}>
                      {label}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 13 }} onClick={() => nav(`/jee-main#college`)}>
                    <BadgeCheck size={15} /> Check Eligibility
                  </button>
                  <button className="btn btn-coral" style={{ flex: 1, justifyContent: "center", fontSize: 13 }} onClick={() => nav(`/colleges/${c.slug}`)}>
                    View Details <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button className="btn btn-navy" onClick={() => nav(`/colleges?type=${type}`)}>
            View all {type}s <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
