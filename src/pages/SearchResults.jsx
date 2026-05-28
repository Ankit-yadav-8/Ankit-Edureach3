import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, ArrowRight, Sparkles, MapPin, TrendingUp } from "lucide-react";
import { search, answerFor } from "../utils/searchIndex.js";
import { fmtINR } from "../utils/format.js";

const KIND_COLOR = { College: "#0EA5A4", Private: "#0EA5A4", Exam: "#F97316", News: "#F4A261", Tool: "#2EC4B6" };
const FILTERS = ["All", "College", "Exam", "Private", "News", "Tool"];
const SUGGESTIONS = ["Top IITs with package above 20 lakh", "CSE colleges in Tamil Nadu", "Best NITs for placements", "Affordable IIITs"];

export default function SearchResults() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") || "";
  const nav = useNavigate();
  const [filter, setFilter] = useState("All");

  const results = useMemo(() => search(q, 40), [q]);
  const answer = useMemo(() => answerFor(q, results), [q, results]);
  const shown = filter === "All" ? results : results.filter((r) => r.kind === filter);

  const runSearch = (term) => setSp({ q: term });

  return (
    <div className="page">
      <section style={{ background: "linear-gradient(135deg,#fff7f0,#ffe8d6)", color: "var(--ink)", padding: "40px 0" }}>
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--coral)" }}>Smart Search</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.6rem,4vw,2.2rem)", margin: "8px 0 4px" }}>
            {q ? <>Results for &ldquo;{q}&rdquo;</> : "Search College Parichay"}
          </h1>
          <p style={{ color: "var(--muted)" }}>{results.length} matches across colleges, exams, tools and news.</p>
        </div>
      </section>

      <div className="container section">
        {/* AI-style answer card */}
        {answer && (
          <div className="card" style={{ marginBottom: 22, borderLeft: "4px solid var(--coral)", background: "linear-gradient(135deg,#fff, var(--sky))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Sparkles size={18} color="var(--coral)" />
              <strong style={{ fontFamily: "Sora", color: "var(--navy)" }}>AI summary</strong>
            </div>
            <p style={{ color: "var(--ink)", lineHeight: 1.6, fontSize: 14.5 }}>{answer}</p>
          </div>
        )}

        <div className="tabs" style={{ flexWrap: "wrap", marginBottom: 22 }}>
          {FILTERS.map((f) => <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>)}
        </div>

        {shown.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 50, color: "var(--muted)" }}>
            <Search size={42} color="var(--line)" />
            <p style={{ marginTop: 12, marginBottom: 16 }}>No results{q ? ` for "${q}"` : ""}. Try one of these:</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {SUGGESTIONS.map((s) => (
                <button key={s} className="pill" style={{ cursor: "pointer", background: "var(--sky)", border: "1px solid var(--line)", color: "var(--navy)" }} onClick={() => runSearch(s)}>{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 50 }}>
            {shown.map((r, i) => {
              const m = r.meta || {};
              const hasStats = m.avg || m.nirf || m.placed;
              return (
                <Link key={i} to={r.to} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span className="badge" style={{ background: `${KIND_COLOR[r.kind]}1a`, color: KIND_COLOR[r.kind] }}>{r.kind}</span>
                      <strong style={{ fontFamily: "Sora", color: "var(--navy)" }}>{r.title}</strong>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                      {m.location && <><MapPin size={12} /> {m.location} ·</>} {r.sub}
                    </div>
                    {hasStats && (
                      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12.5, flexWrap: "wrap" }}>
                        {m.avg && <span style={{ color: "var(--navy)" }}><TrendingUp size={12} style={{ verticalAlign: -2 }} /> Avg <strong>{fmtINR(m.avg)}</strong></span>}
                        {m.highest && <span style={{ color: "var(--green)" }}>Highest <strong>{fmtINR(m.highest)}</strong></span>}
                        {m.placed && <span style={{ color: "var(--muted)" }}>Placed <strong>{m.placed}%</strong></span>}
                        {m.recruiters?.length > 0 && <span style={{ color: "var(--muted)" }}>{m.recruiters.slice(0, 3).join(", ")}…</span>}
                      </div>
                    )}
                  </div>
                  <ArrowRight size={18} color="var(--muted)" style={{ flexShrink: 0 }} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
