import { useState, useMemo, useEffect, useDeferredValue } from "react";
import Seo from "../components/Seo.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, MapPin, Stethoscope, ArrowRight, SlidersHorizontal, X,
  Landmark, Users, Building2, CalendarDays,
} from "lucide-react";
import { NEET_COLLEGES, NEET_STATES, NEET_TOTAL_SEATS } from "../data/neetColleges.js";
import Reveal from "../components/Reveal.jsx";

const MGMT_FILTERS = ["All", "Government", "Private", "Trust", "Society"];
const SORTS = [
  ["seats", "Most seats"],
  ["name", "Name (A–Z)"],
  ["year", "Newest"],
  ["oldest", "Oldest"],
];
const PAGE = 48;
const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-IN"));

const mgmtColor = (c) => (c.govt ? "#15a06e" : "#8b5cf6");

export default function NeetColleges() {
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const [state, setState] = useState(sp.get("state") || "");
  const [mgmt, setMgmt] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("seats");
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => { setState(sp.get("state") || ""); }, [sp]);
  useEffect(() => { setLimit(PAGE); }, [state, mgmt, q, sort]);

  const dq = useDeferredValue(q);

  const list = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    const arr = NEET_COLLEGES.filter((c) =>
      (!state || c.state === state) &&
      (mgmt === "All" || (mgmt === "Private" ? !c.govt && c.management === "Private" : c.management === mgmt)) &&
      (!needle ||
        c.name.toLowerCase().includes(needle) ||
        (c.district || "").toLowerCase().includes(needle) ||
        (c.university || "").toLowerCase().includes(needle) ||
        c.state.toLowerCase().includes(needle))
    );
    arr.sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) :
      sort === "year" ? (b.year || 0) - (a.year || 0) :
      sort === "oldest" ? (a.year || 9999) - (b.year || 9999) :
      (b.seats || 0) - (a.seats || 0)
    );
    return arr;
  }, [state, mgmt, dq, sort]);

  const setStateParam = (s) => {
    setState(s);
    if (s) setSp({ state: s }); else setSp({});
  };

  const hasFilters = state || mgmt !== "All" || q;
  const shown = list.slice(0, limit);

  return (
    <div className="page">
      <Seo
        title="All NEET / MBBS Medical Colleges in India — State-wise List & Seats"
        description="Browse all 780 MBBS medical colleges in India (incl. AIIMS & JIPMER) from the NMC 2024-25 seat matrix. Filter state-wise by government/private, MBBS seats, affiliating university and year — built for NEET UG aspirants on CollegeParichay."
        path="/neet-colleges"
      />

      {/* Page header */}
      <section className="warm-page-header">
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 30%, rgba(21,160,110,.18) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 60% at 0% 100%, rgba(255, 105, 61,.16) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(21,160,110,.14)", color: "#0f7a53",
              border: "1px solid rgba(21,160,110,.38)", fontSize: 11, fontWeight: 700,
              letterSpacing: "2px", textTransform: "uppercase", padding: "5px 14px",
              borderRadius: 50, marginBottom: 14, fontFamily: "'Space Grotesk',sans-serif",
            }}>
              <Stethoscope size={12} /> NEET Medical College Explorer
            </span>
            <h1 style={{
              fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800,
              fontSize: "clamp(1.9rem,4.5vw,2.8rem)", color: "#1c1c28",
              letterSpacing: "-0.5px", margin: "0 0 10px",
            }}>
              All {NEET_COLLEGES.length} MBBS Medical Colleges in India
            </h1>
            <p style={{ color: "rgba(28,28,40,.62)", fontSize: "1rem", maxWidth: 580, lineHeight: 1.65 }}>
              Every MBBS college from the NMC 2024-25 seat matrix — AIIMS, JIPMER, government
              &amp; private. Filter by state, management and seats. <em>Source: official seat matrix.</em>
            </p>
            {/* quick stats */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              {[
                { icon: Landmark, label: `${NEET_COLLEGES.length} colleges` },
                { icon: Users, label: `${fmt(NEET_TOTAL_SEATS)} MBBS seats` },
                { icon: MapPin, label: `${NEET_STATES.length} states & UTs` },
              ].map(({ icon: Icon, label }) => (
                <span key={label} style={{
                  display: "inline-flex", alignItems: "center", gap: 7, background: "var(--page-bg)",
                  border: "1px solid rgba(0,0,0,.08)", borderRadius: 50, padding: "7px 14px",
                  fontSize: 13, fontWeight: 700, color: "#1c1c28", boxShadow: "0 2px 12px rgba(28,28,40,.06)",
                }}>
                  <Icon size={14} color="#15a06e" /> {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container" style={{ marginTop: 28 }}>
        {/* Filter bar */}
        <div style={{
          background: "var(--page-bg)", borderRadius: 16, border: "1px solid rgba(0,0,0,.08)",
          boxShadow: "0 2px 20px rgba(28,28,40,.07)", padding: "16px 20px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 6, background: "#f3f4f6", borderRadius: 50, padding: 4, flexWrap: "wrap" }}>
              {MGMT_FILTERS.map((t) => (
                <button key={t} onClick={() => setMgmt(t)}
                  style={{
                    padding: "7px 15px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                    fontFamily: "Sora", cursor: "pointer", border: "none",
                    background: mgmt === t ? (t === "Government" ? "#15a06e" : t === "All" ? "#FF693D" : "#8b5cf6") : "transparent",
                    color: mgmt === t ? "#fff" : "#6b7280",
                    boxShadow: mgmt === t ? "0 2px 10px rgba(0,0,0,.15)" : "none",
                  }}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, background: "#f9fafb",
              borderRadius: 10, border: "1.5px solid #e5e7eb", padding: "9px 14px", flex: 1, minWidth: 200,
            }}>
              <Search size={16} color="#9ca3af" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search college, district or university…"
                style={{ border: "none", background: "transparent", outline: "none", flex: 1, fontFamily: "DM Sans", fontSize: 14, color: "#1c1c28" }} />
              {q && <button onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}><X size={14} /></button>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
            <select className="select" style={{ width: "auto", minWidth: 170, fontSize: 13 }} value={state} onChange={(e) => setStateParam(e.target.value)}>
              <option value="">All states &amp; UTs</option>
              {NEET_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select className="select" style={{ width: "auto", minWidth: 150, fontSize: 13 }} value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map(([v, l]) => <option key={v} value={v}>Sort: {l}</option>)}
            </select>
            {hasFilters && (
              <button onClick={() => { setStateParam(""); setMgmt("All"); setQ(""); }}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 10, border: "1.5px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.06)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans" }}>
                <X size={13} /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
          <SlidersHorizontal size={14} />
          <strong style={{ color: "#374151" }}>{list.length}</strong> medical colleges
          {state && <span style={{ background: "rgba(21,160,110,.12)", color: "#15a06e", padding: "2px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700, marginLeft: 4 }}>{state}</span>}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 18, paddingBottom: 30 }}>
          {shown.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.03} className="cv-card">
              <div onClick={() => nav(`/neet-colleges/${c.slug}`)}
                style={{
                  background: "var(--page-bg)", borderRadius: 16, border: "1px solid rgba(0,0,0,.08)",
                  overflow: "hidden", display: "flex", flexDirection: "column",
                  boxShadow: "0 2px 16px rgba(28,28,40,.06)", height: "100%", cursor: "pointer",
                  transition: "box-shadow .25s ease, transform .25s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(28,28,40,.12)"; e.currentTarget.style.transform = "translateY(-5px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 16px rgba(28,28,40,.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                {/* accent strip */}
                <div style={{ height: 6, background: `linear-gradient(90deg, ${mgmtColor(c)}, ${mgmtColor(c)}55)` }} />
                <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: `${mgmtColor(c)}16`, color: mgmtColor(c), fontSize: 10.5, fontWeight: 800, padding: "3px 9px", borderRadius: 50, textTransform: "uppercase", letterSpacing: ".4px" }}>
                      <Building2 size={10} /> {c.govt ? "Government" : c.management}
                    </span>
                    {c.year && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f3f4f6", color: "#6b7280", fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 50 }}><CalendarDays size={10} /> Est. {c.year}</span>}
                  </div>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.02rem", color: "#1c1c28", lineHeight: 1.3 }}>{c.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7280", fontSize: 12.5 }}>
                    <MapPin size={12} color="#15a06e" /> {[c.district, c.state].filter(Boolean).join(", ")}
                  </div>
                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f3f4f6", padding: "11px 0 14px" }}>
                    <div>
                      <div style={{ fontSize: 9.5, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px" }}>MBBS Seats</div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.15rem", color: "#15a06e" }}>{fmt(c.seats)}</div>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#0f7a53", fontSize: 13, fontWeight: 700 }}>Details <ArrowRight size={14} /></span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {limit < list.length && (
          <div style={{ textAlign: "center", paddingBottom: 50 }}>
            <button className="btn btn-coral" onClick={() => setLimit((l) => l + PAGE)}>
              Show more ({list.length - limit} left)
            </button>
          </div>
        )}

        {list.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, color: "#374151", marginBottom: 8 }}>No colleges found</h3>
            <p style={{ fontSize: 14 }}>Try a different state or search term.</p>
            <button className="btn btn-coral" style={{ marginTop: 20 }} onClick={() => { setStateParam(""); setMgmt("All"); setQ(""); }}>Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
