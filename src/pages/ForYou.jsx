import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, MapPin, Trophy, ArrowRight, Wand2 } from "lucide-react";
import { predictColleges, TIER_COLOR } from "../utils/collegePredictor.js";
import { COLLEGE_BY_SLUG, CATEGORIES } from "../data/colleges.js";
import { useShortlist } from "../context/Shortlist.jsx";
import { SaveButton, CompareButton } from "../components/SaveButton.jsx";
import { fmtINR, fmtRank } from "../utils/format.js";
import Reveal from "../components/Reveal.jsx";

export default function ForYou() {
  const { saved } = useShortlist();
  const nav = useNavigate();
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("OPEN");
  const [submitted, setSubmitted] = useState(false);

  const recos = useMemo(() => {
    if (!rank) return [];
    const all = predictColleges({ rank: Number(rank), category, types: ["IIT", "NIT", "IIIT"] });
    // one best branch per college, spread across tiers
    const seen = new Set();
    const picks = [];
    for (const m of all) {
      if (seen.has(m.slug)) continue;
      seen.add(m.slug);
      picks.push(m);
      if (picks.length >= 9) break;
    }
    return picks;
  }, [rank, category, submitted]);

  const savedCols = saved.map((s) => COLLEGE_BY_SLUG[s]).filter(Boolean);

  return (
    <div className="page">
      <section style={{ background: "linear-gradient(135deg,#fff7f0,#ffe8d6)", color: "var(--ink)", padding: "44px 0" }}>
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--coral)" }}>Personalized</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.5rem)", margin: "8px 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
            <Wand2 size={28} /> Colleges for you
          </h1>
          <p style={{ color: "var(--muted)" }}>Enter your rank and we'll recommend the best-fit colleges, blended with your shortlist.</p>
        </div>
      </section>

      <div className="container section">
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="grid-3" style={{ gap: 12, alignItems: "end" }}>
            <div className="field">
              <label>Your rank (CRL / category)</label>
              <input className="input" type="number" min="1" value={rank} onChange={(e) => setRank(e.target.value)} placeholder="e.g. 8500" />
            </div>
            <div className="field">
              <label>Category</label>
              <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn btn-coral" style={{ justifyContent: "center" }} onClick={() => setSubmitted((s) => !s)}>
              <Sparkles size={16} /> Recommend colleges
            </button>
          </div>
        </div>

        {recos.length > 0 && (
          <>
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 14 }}>Top picks for rank {fmtRank(Number(rank))}</h3>
            <div className="grid-3" style={{ marginBottom: 36 }}>
              {recos.map((m, i) => {
                const c = COLLEGE_BY_SLUG[m.slug];
                return (
                  <Reveal key={m.slug} delay={(i % 3) * 0.05}>
                    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 9, height: "100%", borderTop: `3px solid ${c.accent}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <h4 style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)" }}>{c.short}</h4>
                        <span className="badge" style={{ background: `${TIER_COLOR[m.tier]}22`, color: TIER_COLOR[m.tier] }}>{m.tier}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {c.location}</div>
                      <div style={{ fontSize: 13 }}>Best fit: <strong>{m.branch}</strong></div>
                      <div style={{ display: "flex", gap: 12, fontSize: 12.5, padding: "8px 0", borderTop: "1px solid var(--line)" }}>
                        <span>Closing <strong>{fmtRank(m.closing)}</strong></span>
                        <span>Avg <strong>{fmtINR(m.avgPackage)}</strong></span>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                        <SaveButton slug={c.slug} size={15} />
                        <CompareButton slug={c.slug} label={false} />
                        <button className="btn btn-coral" style={{ flex: 1, justifyContent: "center", fontSize: 12.5 }} onClick={() => nav(`/colleges/${c.slug}`)}>Details <ArrowRight size={14} /></button>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}

        {savedCols.length > 0 && (
          <>
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 14 }}>From your shortlist</h3>
            <div className="grid-3">
              {savedCols.map((c) => (
                <div key={c.slug} className="card" style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)" }}>{c.short}</h4>
                    <span className="badge orange"><Trophy size={11} /> #{c.nirf}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.location} · Avg {fmtINR(c.placements.avg)}</div>
                  <button className="btn btn-ghost" style={{ marginTop: "auto", justifyContent: "center", fontSize: 13 }} onClick={() => nav(`/colleges/${c.slug}`)}>View <ArrowRight size={14} /></button>
                </div>
              ))}
            </div>
          </>
        )}

        {recos.length === 0 && savedCols.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: 44, color: "var(--muted)" }}>
            <Sparkles size={42} color="var(--line)" />
            <p style={{ marginTop: 12 }}>Enter your rank above for personalized picks, or save colleges to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
