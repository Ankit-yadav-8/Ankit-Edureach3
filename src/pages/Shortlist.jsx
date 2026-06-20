import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";
import { Heart, MapPin, Trophy, ArrowRight, GitCompare, Share2, Printer, Check, Sparkles } from "lucide-react";
import { useShortlist } from "../context/Shortlist.jsx";
import { COLLEGE_BY_SLUG, COLLEGES } from "../data/colleges.js";
import { SaveButton, CompareButton } from "../components/SaveButton.jsx";
import { fmtINR } from "../utils/format.js";

export default function Shortlist() {
  const { saved, toggleSaved, toggleCompare, inCompare, isSaved, MAX_COMPARE } = useShortlist();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const cols = saved.map((s) => COLLEGE_BY_SLUG[s]).filter(Boolean);

  // Import a shared shortlist from ?ids=slug1,slug2
  useEffect(() => {
    const ids = sp.get("ids");
    if (ids) ids.split(",").forEach((s) => { if (s && COLLEGE_BY_SLUG[s] && !isSaved(s)) toggleSaved(s); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const compareShortlist = () => {
    saved.slice(0, MAX_COMPARE).forEach((s) => { if (!inCompare(s)) toggleCompare(s); });
    nav("/compare");
  };

  const share = async () => {
    const url = `${window.location.origin}/shortlist?ids=${saved.join(",")}`;
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  // "Colleges for you" — recommend by overlap of type/state with saved, excluding saved
  const recommendations = useMemo(() => {
    if (!cols.length) return [];
    const types = new Set(cols.map((c) => c.type));
    const states = new Set(cols.map((c) => c.state));
    return COLLEGES
      .filter((c) => !saved.includes(c.slug))
      .map((c) => ({ c, score: (types.has(c.type) ? 2 : 0) + (states.has(c.state) ? 2 : 0) - c.nirf * 0.01 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.c);
  }, [saved]);

  return (
    <div className="page">
      <div className="container"><BackButton style={{ margin: "0 0 2px" }} /></div>
      <Seo
        title="Shortlist Your College"
        description="Build and share your personalised college shortlist on CollegeParichay — save IITs, NITs and IIITs, compare them side by side, and plan your JoSAA choices. Free by IIT Roorkee alumni."
        path="/shortlist"
        robots="noindex, follow"
      />
      <section className="warm-page-header" style={{ padding: "40px 0" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 65% at 90% 20%, rgba(249,115,22,.20) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow">My Colleges</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.4rem)", margin: "8px 0 4px", display: "flex", alignItems: "center", gap: 10, color: "#1c1c28" }}>
            <Heart size={28} fill="#FF693D" color="#FF693D" /> Your shortlist
          </h1>
          <p style={{ color: "rgba(28,28,40,.62)" }}>{cols.length ? `${cols.length} saved college${cols.length > 1 ? "s" : ""}.` : "Save colleges with the heart button to build your shortlist."}</p>
        </div>
      </section>

      <div className="container section">
        {cols.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>
            <Heart size={44} color="var(--line)" />
            <p style={{ margin: "12px 0 16px" }}>No saved colleges yet. Browse colleges and tap the heart to add them here.</p>
            <button className="btn btn-coral" onClick={() => nav("/colleges")}>Explore colleges <ArrowRight size={16} /></button>
          </div>
        ) : (
          <div className="grid-3" style={{ paddingBottom: 40 }}>
            {cols.map((c) => (
              <div key={c.slug} className="card" style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%", borderTop: `3px solid ${c.accent}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.08rem", color: "var(--navy)" }}>{c.name}</h3>
                  <span className="badge orange" style={{ display: "inline-flex", gap: 3, alignItems: "center" }}><Trophy size={11} />#{c.nirf}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {c.location}</div>
                <div style={{ display: "flex", gap: 14, padding: "10px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
                  <div><div style={{ color: "var(--muted)", fontSize: 11 }}>Avg pkg</div><strong>{fmtINR(c.placements.avg)}</strong></div>
                  <div><div style={{ color: "var(--muted)", fontSize: 11 }}>Placed</div><strong>{c.placements.placedPct}%</strong></div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <SaveButton slug={c.slug} label />
                  <CompareButton slug={c.slug} />
                </div>
                <button className="btn btn-coral" style={{ justifyContent: "center", marginTop: "auto", fontSize: 13 }} onClick={() => nav(`/colleges/${c.slug}`)}>View details <ArrowRight size={15} /></button>
              </div>
            ))}
          </div>
        )}

        {cols.length >= 2 && (
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-navy" onClick={compareShortlist}><GitCompare size={16} /> Compare shortlist</button>
            <button className="btn btn-ghost" onClick={share}>{copied ? <><Check size={16} /> Link copied!</> : <><Share2 size={16} /> Share shortlist</>}</button>
            <button className="btn btn-ghost" onClick={() => window.print()}><Printer size={16} /> Print / Save PDF</button>
          </div>
        )}

        {recommendations.length > 0 && (
          <div style={{ marginTop: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Sparkles size={20} color="var(--coral)" />
              <h3 style={{ fontFamily: "Sora", fontWeight: 700 }}>Colleges for you</h3>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 16 }}>Similar to your shortlist, based on type and location.</p>
            <div className="grid-3">
              {recommendations.map((c) => (
                <div key={c.slug} className="card" style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%", borderTop: `3px solid ${c.accent}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <h4 style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)" }}>{c.name}</h4>
                    <SaveButton slug={c.slug} size={16} />
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {c.location} · NIRF #{c.nirf}</div>
                  <div style={{ fontSize: 13 }}>Avg <strong>{fmtINR(c.placements.avg)}</strong> · Placed <strong>{c.placements.placedPct}%</strong></div>
                  <button className="btn btn-coral" style={{ justifyContent: "center", fontSize: 13, marginTop: "auto" }} onClick={() => nav(`/colleges/${c.slug}`)}>View details <ArrowRight size={15} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
