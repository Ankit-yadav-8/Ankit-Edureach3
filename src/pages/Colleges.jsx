import { useState, useMemo, useEffect, useDeferredValue } from "react";
import Seo from "../components/Seo.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Trophy, ArrowRight, BadgeCheck, SlidersHorizontal, TrendingUp, Percent, X } from "lucide-react";
import { COLLEGES, STATES } from "../data/colleges.js";
import { fmtINR } from "../utils/format.js";
import Reveal from "../components/Reveal.jsx";
import { SaveButton, CompareButton } from "../components/SaveButton.jsx";

const TYPES = ["All", "IIT", "NIT", "IIIT"];
const SORTS = [
  ["nirf", "NIRF rank"],
  ["package", "Avg package"],
  ["placed", "Placement %"],
  ["fees", "Lowest fees"],
];
const PKG_BANDS = [
  ["", "Any package"],
  ["1000000", "₹10L+"],
  ["1500000", "₹15L+"],
  ["2000000", "₹20L+"],
];
const feeTotal = (c) => Object.values(c.fees).reduce((a, b) => a + b, 0);

const TYPE_COLORS = { IIT: "#F47E20", NIT: "#3b3b98", IIIT: "#0b525b" };
const TYPE_BG = {
  IIT:  "linear-gradient(135deg,#2d1b5e 0%,#5c2d91 60%,#1e0e47 100%)",
  NIT:  "linear-gradient(135deg,#0d3340 0%,#1a6b7a 60%,#0a2830 100%)",
  IIIT: "linear-gradient(135deg,#0f2e1e 0%,#1c5c38 60%,#0a2118 100%)",
};

export default function Colleges() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const [type, setType] = useState(sp.get("type") || "All");
  const [state, setState] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("nirf");
  const [minPkg, setMinPkg] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => { setType(sp.get("type") || "All"); }, [sp]);

  // Defer the search term so typing stays snappy — the heavy grid re-render
  // runs at a lower priority instead of blocking every keystroke.
  const dq = useDeferredValue(q);

  const list = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    let arr = COLLEGES.filter((c) =>
      (type === "All" || c.type === type) &&
      (!state || c.state === state) &&
      (!minPkg || c.placements.avg >= Number(minPkg)) &&
      (!needle || c.name.toLowerCase().includes(needle) || c.location.toLowerCase().includes(needle))
    );
    arr.sort((a, b) =>
      sort === "package" ? b.placements.avg - a.placements.avg :
      sort === "placed" ? b.placements.placedPct - a.placements.placedPct :
      sort === "fees" ? feeTotal(a) - feeTotal(b) :
      a.nirf - b.nirf
    );
    return arr;
  }, [type, state, dq, sort, minPkg]);

  const hasFilters = type !== "All" || state || minPkg || q;

  return (
    <div className="page">
      <Seo
        title="All IIT, NIT & IIIT Colleges — Cutoffs, Reviews & Placements"
        description="Browse and compare every IIT, NIT and IIIT in India. Filter by JEE rank, branch, state and category to find JoSAA cutoffs, placements, fees and student reviews on CollegeParichay."
        path="/colleges"
      />

      {/* Page header */}
      <section className="warm-page-header">
        {/* Warm radial glows */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 30%, rgba(249,115,22,.22) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 60% at 0% 100%, rgba(244,162,97,.18) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(244,123,32,.14)", color: "#c75b0a",
              border: "1px solid rgba(244,123,32,.38)",
              fontSize: 11, fontWeight: 700, letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "5px 14px", borderRadius: 50, marginBottom: 14,
              fontFamily: "'Space Grotesk',sans-serif",
            }}>
              College Explorer
            </span>
            <h1 style={{
              fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800,
              fontSize: "clamp(1.9rem,4.5vw,2.8rem)",
              color: "#1c1c28", letterSpacing: "-0.5px",
              margin: "0 0 10px",
            }}>
              Discover {COLLEGES.length}+ Premier Institutes
            </h1>
            <p style={{ color: "rgba(28,28,40,.62)", fontSize: "1rem", maxWidth: 520, lineHeight: 1.65 }}>
              Filter by type, state, package and fees — save favourites or add to compare.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container" style={{ marginTop: 28 }}>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,.08)",
            boxShadow: "0 2px 20px rgba(28,28,40,.07)",
            padding: "16px 20px",
            marginBottom: 24,
          }}
        >
          {/* Top row: type tabs + search */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
            {/* Type tabs */}
            <div style={{ display: "flex", gap: 6, background: "#f3f4f6", borderRadius: 50, padding: 4 }}>
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    padding: "7px 16px", borderRadius: 50,
                    fontSize: 13, fontWeight: 600, fontFamily: "Sora",
                    cursor: "pointer", transition: "all .2s",
                    border: "none",
                    background: type === t
                      ? (t === "All" ? "#F47E20" : (TYPE_COLORS[t] || "#F47E20"))
                      : "transparent",
                    color: type === t ? "#fff" : "#6b7280",
                    boxShadow: type === t ? "0 2px 10px rgba(0,0,0,.15)" : "none",
                  }}
                >
                  {t === "All" ? "All" : t + "s"}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#f9fafb", borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              padding: "9px 14px",
              flex: 1, minWidth: 200,
              transition: "border-color .2s",
            }}
              onFocusCapture={(e) => e.currentTarget.style.borderColor = "#F47E20"}
              onBlurCapture={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
            >
              <Search size={16} color="#9ca3af" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search college or city…"
                style={{
                  border: "none", background: "transparent",
                  outline: "none", flex: 1,
                  fontFamily: "DM Sans", fontSize: 14, color: "#1c1c28",
                }}
              />
              {q && (
                <button onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 14px", borderRadius: 10,
                border: `1.5px solid ${hasFilters ? "#F47E20" : "#e5e7eb"}`,
                background: hasFilters ? "rgba(244,123,32,.08)" : "#fff",
                color: hasFilters ? "#F47E20" : "#6b7280",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "DM Sans",
              }}
            >
              <SlidersHorizontal size={15} />
              Filters {hasFilters && <span style={{ background: "#F47E20", color: "#fff", borderRadius: 50, width: 18, height: 18, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700 }}>!</span>}
            </button>
          </div>

          {/* Advanced filters row */}
          {(showFilters) && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
              <select
                className="select"
                style={{ width: "auto", minWidth: 150, fontSize: 13 }}
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">All states</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select
                className="select"
                style={{ width: "auto", minWidth: 140, fontSize: 13 }}
                value={minPkg}
                onChange={(e) => setMinPkg(e.target.value)}
              >
                {PKG_BANDS.map(([v, l]) => <option key={l} value={v}>{l}</option>)}
              </select>
              <select
                className="select"
                style={{ width: "auto", minWidth: 160, fontSize: 13 }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORTS.map(([v, l]) => <option key={v} value={v}>Sort: {l}</option>)}
              </select>
              {hasFilters && (
                <button
                  onClick={() => { setType("All"); setState(""); setMinPkg(""); setQ(""); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "8px 14px", borderRadius: 10,
                    border: "1.5px solid rgba(239,68,68,.3)",
                    background: "rgba(239,68,68,.06)", color: "#ef4444",
                    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans",
                  }}
                >
                  <X size={13} /> Clear all
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
          <SlidersHorizontal size={14} />
          <strong style={{ color: "#374151" }}>{list.length}</strong> colleges found
          {type !== "All" && (
            <span style={{
              background: `${TYPE_COLORS[type]}18`, color: TYPE_COLORS[type],
              padding: "2px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700, marginLeft: 4,
            }}>{type}s</span>
          )}
        </div>

        {/* College grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 20,
            paddingBottom: 60,
          }}
        >
          {list.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.04} className="cv-card">
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,.08)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 16px rgba(28,28,40,.06)",
                  transition: "box-shadow .25s ease, transform .25s ease",
                  height: "100%",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(28,28,40,.12)";
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 16px rgba(28,28,40,.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={() => nav(`/colleges/${c.slug}`)}
              >
                {/* Banner */}
                <div style={{
                  position: "relative",
                  height: 120,
                  background: c.heroImage
                    ? `url("${encodeURI(c.heroImage)}") center/cover no-repeat`
                    : (TYPE_BG[c.type] || TYPE_BG.NIT),
                }}>
                  {c.heroImage && (
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.32))" }} />
                  )}
                  {!c.heroImage && (
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,.03) 20px)`,
                    }} />
                  )}

                  {/* Save button */}
                  <span style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
                    <SaveButton slug={c.slug} size={14} />
                  </span>

                  {/* NIRF badge */}
                  <span style={{
                    position: "absolute", top: 10, right: 10,
                    background: "linear-gradient(135deg,#F47E20,#f4a261)",
                    color: "#fff", fontSize: 10.5, fontWeight: 700,
                    padding: "3px 9px", borderRadius: 50,
                    display: "inline-flex", alignItems: "center", gap: 4,
                    boxShadow: "0 3px 10px rgba(249,115,22,.4)",
                  }}>
                    <Trophy size={9} /> #{c.nirf}
                  </span>

                  {/* Type badge */}
                  <span style={{
                    position: "absolute", top: 10, left: c.heroImage ? 44 : 10,
                    background: `${TYPE_COLORS[c.type] || "#F47E20"}cc`,
                    color: "#fff", fontSize: 10, fontWeight: 700,
                    padding: "3px 8px", borderRadius: 50,
                    backdropFilter: "blur(4px)",
                  }}>
                    {c.type}
                  </span>

                  {/* Location */}
                  <span style={{
                    position: "absolute", left: 10, bottom: 8,
                    background: "rgba(0,0,0,.4)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,.15)",
                    color: "#fff", fontSize: 11, fontWeight: 500,
                    padding: "3px 9px", borderRadius: 50,
                    display: "inline-flex", alignItems: "center", gap: 4,
                  }}>
                    <MapPin size={10} /> {c.location}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: "14px 16px 0", display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
                  <h3 style={{
                    fontFamily: "Sora", fontWeight: 700,
                    fontSize: "1.02rem", color: "#1c1c28", lineHeight: 1.3,
                  }}>
                    {c.name}
                  </h3>

                  {/* Stats */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                    background: "#fdf8f4", borderRadius: 10,
                    border: "1px solid rgba(0,0,0,.06)", overflow: "hidden",
                  }}>
                    {[
                      { icon: TrendingUp, label: "Avg", value: fmtINR(c.placements.avg), color: "#F47E20" },
                      { icon: Trophy,     label: "Top",  value: fmtINR(c.placements.highest), color: "#15a06e" },
                      { icon: Percent,    label: "Placed", value: `${c.placements.placedPct}%`, color: "#3b3b98" },
                    ].map(({ icon: Icon, label, value, color }, i) => (
                      <div key={label} style={{
                        padding: "8px 5px", textAlign: "center",
                        borderRight: i < 2 ? "1px solid rgba(0,0,0,.06)" : "none",
                      }}>
                        <div style={{ fontSize: 9.5, color: "#9ca3af", marginBottom: 2 }}>{label}</div>
                        <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12, color }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA buttons */}
                  <div style={{ display: "flex", gap: 8, paddingBottom: 14, marginTop: "auto" }}>
                    <span onClick={(e) => e.stopPropagation()}>
                      <CompareButton slug={c.slug} />
                    </span>
                    <button
                      className="btn btn-ghost"
                      style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "7px 8px" }}
                      onClick={(e) => { e.stopPropagation(); nav("/jee-main#college"); }}
                    >
                      <BadgeCheck size={13} /> Eligibility
                    </button>
                    <button
                      className="btn btn-coral"
                      style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "7px 8px" }}
                      onClick={(e) => { e.stopPropagation(); nav(`/colleges/${c.slug}`); }}
                    >
                      Details <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {list.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, color: "#374151", marginBottom: 8 }}>No colleges found</h3>
            <p style={{ fontSize: 14 }}>Try adjusting your filters or search query.</p>
            <button
              className="btn btn-coral"
              style={{ marginTop: 20 }}
              onClick={() => { setType("All"); setState(""); setMinPkg(""); setQ(""); }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
