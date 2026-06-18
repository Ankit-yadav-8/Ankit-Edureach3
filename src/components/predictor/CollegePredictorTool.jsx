import { useState, useMemo, Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair, RotateCcw, ChevronDown, MapPin,
  ExternalLink, ArrowRight, Loader2, Info,
  Database, Layers, Trophy, Users, BarChart3,
} from "lucide-react";
import { NotesBlock } from "./RankPredictorTool.jsx";
import { COLLEGE_BY_SLUG, BRANCHES, CATEGORIES, STATES } from "../../data/colleges.js";
import { useCollegePredictor } from "../../hooks/useCollegePredictor.js";
import { Bars, PieWithLegend } from "../Charts.jsx";
import { fmtRank, fmtINR } from "../../utils/format.js";

const TYPE_SETS = {
  "/jee-main":      ["NIT", "IIIT"],
  "/jee-advanced":  ["IIT"],
};

// Map each confidence tier to a valid badge colour class. (Using
// TIER_COLOR's `var(--…)` values for an inline translucent background is
// invalid CSS — `var(--green)22` silently drops — so the pill rendered with
// no background and was nearly invisible, especially on mobile.)
const TIER_BADGE = { Safe: "green", Moderate: "orange", Ambitious: "red" };

const LOADING_TIPS = [
  "Scanning all college-branch combinations…",
  "Matching your rank against 2025 JoSAA cutoffs…",
  "Calculating fit scores across all rounds…",
  "Ranking results by NIRF & branch value…",
];

function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; }
}

/* College "logo" pulled from Google's favicon service (the institute's own
   site icon), with a coral monogram fallback when none is available. */
function CollegeLogo({ slug, name }) {
  const [err, setErr] = useState(false);
  const college = COLLEGE_BY_SLUG[slug];
  const domain  = college?.website ? domainOf(college.website) : null;
  const initials = name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 3).map((w) => w[0]).join("").toUpperCase();
  if (domain && !err) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt="" width={30} height={30} loading="lazy" onError={() => setErr(true)}
        style={{ borderRadius: 8, flexShrink: 0, background: "#fff", border: "1px solid var(--line)", objectFit: "contain", padding: 2 }}
      />
    );
  }
  return (
    <span style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(241,90,56,.12)", color: "#E0421F", display: "grid", placeItems: "center", fontSize: 9.5, fontWeight: 800, flexShrink: 0, fontFamily: "'Space Grotesk','Sora',sans-serif" }}>
      {initials}
    </span>
  );
}

function RoundDetail({ row }) {
  const college   = COLLEGE_BY_SLUG[row.slug];
  const rounds    = row.roundData ?? [];
  const chart     = rounds.map((r) => ({ name: r.round, Opening: r.opening, Closing: r.closing }));
  const estimated = row.relaxMultiplier && row.relaxMultiplier !== 1;

  const r1   = rounds[0];
  const last = rounds[rounds.length - 1];
  const statCards = [
    { label: "Round 1 Opening", value: r1 ? fmtRank(r1.opening) : "—", color: "#0e9c90" },
    { label: "Round 1 Closing", value: r1 ? fmtRank(r1.closing) : "—", color: "#F15A38" },
    { label: "Final Closing",   value: last ? fmtRank(last.closing) : "—", color: "#6366f1" },
    { label: "Avg Package",     value: row.avgPackage ? fmtINR(row.avgPackage) : "—", color: "#15a06e" },
  ];

  return (
    <div style={{ padding: "16px 4px 4px" }}>
      {row.fullProgramName && (
        <p style={{ fontSize: 12.5, color: "var(--navy)", fontWeight: 600, marginBottom: 10 }}>
          {row.fullProgramName}
        </p>
      )}

      {/* ── Cutoff snapshot stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 16 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px", borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".04em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 18, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table (left) gets ~1 part, chart+actions (right) gets ~1.4 parts so the
          graph reads as a wide landscape and the buttons sit under it, using the
          width that was previously blank. */}
      <div className="grid-2 rd-grid" style={{ gap: 18, alignItems: "stretch", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)" }}>
        <div style={{ overflowX: "auto" }}>
          {rounds.length === 0 ? (
            <p style={{ fontSize: 12.5, color: "var(--muted)" }}>
              Round-by-round data unavailable for this program.
            </p>
          ) : (
          <table className="data-table rd-table" style={{ fontSize: 12.5 }}>
            <thead>
              <tr><th>Round</th><th>Stage</th><th>Opening</th><th>Closing</th></tr>
            </thead>
            <tbody>
              {rounds.map((r) => (
                <tr key={r.round}>
                  <td><strong>{r.round}</strong></td>
                  <td>
                    <span className={`badge ${r.stage === "CSAB" ? "violet" : "teal"}`}>
                      {r.stage}
                    </span>
                  </td>
                  <td>{fmtRank(r.opening)}</td>
                  <td>{fmtRank(r.closing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
            {estimated
              ? "Closing ranks are estimated by relaxing JoSAA 2025 general-pool cutoffs for the selected quota — verify on josaa.nic.in / csab.nic.in."
              : "Actual JoSAA 2025 opening & closing ranks for this program — verify on josaa.nic.in / csab.nic.in."}
          </p>
        </div>

        {/* right column — wide chart with the action buttons filling the space
            that used to be blank below the graph */}
        <div className="cp-cutoff-chart" style={{ display: "flex", flexDirection: "column" }}>
          {chart.length > 0 && (
            <>
              <div className="cp-cutoff-chart-head">
                <BarChart3 size={15} color="#F15A38" />
                <span>Opening vs Closing rank by round</span>
              </div>
              <Bars
                data={chart}
                bars={[
                  { key: "Opening", label: "Opening rank", color: "#2EC4B6" },
                  { key: "Closing", label: "Closing rank", color: "#F15A38" },
                ]}
                height={230} fmt={fmtRank} angle={-30}
              />
            </>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingTop: 14, flexWrap: "wrap" }}>
            <Link to={`/colleges/${row.slug}?tab=placements`} className="btn btn-ghost" style={{ fontSize: 13 }}>
              Placements <ArrowRight size={14} />
            </Link>
            <Link to={`/colleges/${row.slug}`} className="btn cp-explore-btn" style={{ fontSize: 13 }}>
              Explore full college details <ArrowRight size={14} />
            </Link>
            {college?.website && (
              <a href={college.website} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 13 }}>
                Official site <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollegePredictorTool({ basePath = "/jee-main" }) {
  const allowedTypes = TYPE_SETS[basePath] || ["IIT", "NIT", "IIIT"];

  const [form, setForm] = useState({
    rank: "", category: "OPEN", rankType: "category", state: "",
    branch: "", female: false, homeState: false,
  });
  const isReserved = form.category !== "OPEN";
  const [expandedRow, setExpandedRow] = useState(null);
  const [tipIdx, setTipIdx]           = useState(0);
  const tipTimer                      = useRef(null);

  const { predict, reset: resetWorker, results, loading, error } = useCollegePredictor();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function handleRun() {
    if (!form.rank || Number(form.rank) <= 0) return;

    setExpandedRow(null);
    setTipIdx(0);
    if (tipTimer.current) clearInterval(tipTimer.current);
    tipTimer.current = setInterval(() => {
      setTipIdx((i) => (i + 1) % LOADING_TIPS.length);
    }, 1500);

    // OPEN candidates always supply a CRL; reserved candidates choose CRL vs category rank.
    const rankType = isReserved ? form.rankType : "crl";
    predict({ ...form, rank: Number(form.rank), rankType, types: allowedTypes }, false);
  }

  if (!loading && tipTimer.current) {
    clearInterval(tipTimer.current);
    tipTimer.current = null;
  }

  function handleReset() {
    setForm({ rank: "", category: "OPEN", rankType: "category", state: "", branch: "", female: false, homeState: false });
    setExpandedRow(null);
    resetWorker();
  }

  const summary = useMemo(() => {
    if (!results?.length) return null;
    const tiers    = ["Safe", "Moderate", "Ambitious"];
    const counts   = { Safe: 0, Moderate: 0, Ambitious: 0 };
    results.forEach((r) => { counts[r.tier] = (counts[r.tier] || 0) + 1; });
    const dist     = tiers
      .map((t) => ({ name: t, value: counts[t] }))
      .filter((d) => d.value);
    const byType   = {};
    results.forEach((r) => { byType[r.type] = (byType[r.type] || 0) + 1; });
    const typeData = Object.entries(byType).map(([name, value]) => ({ name, value }));
    return { dist, typeData, counts, total: results.length };
  }, [results]);

  return (
    <div>
      {/* ── Data-vintage notice ── */}
      <div className="cp-data-banner">
        <Database size={18} className="cp-data-banner-icon" />
        <p>
          <strong>Predictions are based on official JoSAA 2025 cutoff data.</strong>{" "}
          To explore the complete year-on-year data from{" "}
          <strong>2018&nbsp;to&nbsp;2025</strong>, open{" "}
          <span className="cp-data-banner-cta">Explore full college details</span>{" "}
          on any result below.
        </p>
      </div>

      {/* ── Form ── */}
      <div className="card">
        <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.2rem", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <Crosshair size={20} color="#F15A38" /> Find every college within your reach
        </h3>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, lineHeight: 1.5 }}>
          Enter your rank below — the rest is optional. We'll instantly match it against real JoSAA&nbsp;2025 cutoffs and show you every college you can get.
        </p>

        <div className="grid-4" style={{ gap: 12 }}>
          <div className="field">
            <label>
              {isReserved
                ? (form.rankType === "category" ? `Your ${form.category} category rank` : "Your All-India CRL")
                : "Your rank (CRL)"}
            </label>
            <input
              className="input" type="number" min="1"
              value={form.rank}
              onChange={(e) => set("rank", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRun()}
              placeholder="e.g. 8500"
            />
          </div>
          <div className="field">
            <label>Category</label>
            <select className="select" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Home state (preference)</label>
            <select className="select" value={form.state} onChange={(e) => set("state", e.target.value)}>
              <option value="">Any state</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Branch</label>
            <select className="select" value={form.branch} onChange={(e) => set("branch", e.target.value)}>
              <option value="">All branches</option>
              {BRANCHES.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
          </div>
        </div>

        {/* ── Rank-type toggle (reserved categories only) ── */}
        {isReserved && (
          <div style={{ marginTop: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 7 }}>
              Which rank are you entering?
            </label>
            <div style={{ display: "inline-flex", background: "var(--sky)", border: "1px solid var(--line)", borderRadius: 10, padding: 4, gap: 4 }}>
              {[
                ["category", `${form.category} category rank`],
                ["crl", "All-India CRL"],
              ].map(([val, lbl]) => {
                const active = form.rankType === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => set("rankType", val)}
                    style={{
                      padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer",
                      fontSize: 13, fontWeight: 700, fontFamily: "Sora",
                      background: active ? "#F15A38" : "transparent",
                      color: active ? "#fff" : "var(--muted)",
                      boxShadow: active ? "0 2px 8px rgba(249,115,22,.30)" : "none",
                      transition: "all .18s",
                    }}
                  >{lbl}</button>
                );
              })}
            </div>
            <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 7, lineHeight: 1.5, maxWidth: 520 }}>
              {form.rankType === "category"
                ? `Colleges are matched directly against ${form.category} closing ranks from JoSAA 2025 data.`
                : `We'll convert your CRL to an approximate ${form.category} rank, then match against ${form.category} closing ranks. Enter your category rank above for the most accurate result.`}
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
            <input type="checkbox" checked={form.female} onChange={(e) => set("female", e.target.checked)} />
            Female candidate (supernumerary seats)
          </label>
          <label
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, opacity: form.state ? 1 : 0.5 }}
            title={form.state ? "" : "Pick a home state first"}
          >
            <input type="checkbox" checked={form.homeState} disabled={!form.state} onChange={(e) => set("homeState", e.target.checked)} />
            Apply home-state quota (NIT/IIIT)
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            className="btn btn-coral"
            style={{ flex: 1, justifyContent: "center", opacity: loading ? 0.7 : 1 }}
            onClick={handleRun}
            disabled={loading || !form.rank}
          >
            {loading
              ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Predicting…</>
              : "Predict Colleges"
            }
          </button>
          <button className="btn btn-ghost" onClick={handleReset} title="Reset">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* ── Reserved-category notice ── */}
      {isReserved && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          background: "rgba(249,115,22,0.08)",
          border: "1px solid rgba(249,115,22,0.30)",
          borderRadius: 10, padding: "11px 16px", marginTop: 14,
          fontSize: 13, color: "var(--navy)",
        }}>
          <Info size={16} style={{ color: "#F15A38", marginTop: 1, flexShrink: 0 }} />
          <span>
            <strong>Note:</strong> JoSAA publishes reserved-category cutoffs as{" "}
            <strong>category ranks</strong>. Pick{" "}
            <strong>“{form.category} category rank”</strong> above for the most accurate
            matches{basePath === "/jee-advanced" ? " (your JEE Advanced category rank)" : ""}. If you only know your
            All-India CRL, choose <strong>“All-India CRL”</strong> and we'll estimate
            your {form.category} rank automatically. Use the Rank Predictor to find your
            category rank from your marks.
          </span>
        </div>
      )}

      {/* ── Empty state — guides the user before the first prediction ── */}
      {!results && !loading && !error && (
        <div className="cp-empty">
          <div className="cp-empty-icon"><Crosshair size={26} color="#F15A38" /></div>
          <h4 className="cp-empty-title">Ready when you are</h4>
          <p className="cp-empty-sub">
            Type your rank in the box above and hit <strong>Predict Colleges</strong>. Here's what you'll get:
          </p>
          <div className="cp-empty-steps">
            {[
              { n: "1", t: "Every eligible college", d: "All NIT / IIIT / GFTI (or IIT) branches your rank can reach." },
              { n: "2", t: "Colour-coded confidence", d: "Safe, Moderate or Ambitious — so you know your real chances." },
              { n: "3", t: "Round-by-round cutoffs", d: "Tap any result to see all JoSAA & CSAB opening/closing ranks." },
            ].map((s) => (
              <div className="cp-empty-step" key={s.n}>
                <span className="cp-empty-step-num">{s.n}</span>
                <div>
                  <div className="cp-empty-step-t">{s.t}</div>
                  <div className="cp-empty-step-d">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div style={{
          textAlign: "center", padding: "52px 24px", marginTop: 22,
          background: "#fff", borderRadius: 16, border: "1px solid var(--line)",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "4px solid #f3f0ec",
            borderTop: "4px solid #F15A38",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 18px",
          }} />
          <p style={{ fontWeight: 700, color: "var(--navy)", fontSize: 15, marginBottom: 6 }}>
            Scanning college-branch combinations…
          </p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>
            {LOADING_TIPS[tipIdx]}
          </p>
          <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 10 }}>
            Runs in background — page stays responsive
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: "#fff0f0", border: "1px solid #fca5a5",
          borderRadius: 12, padding: "14px 18px", marginTop: 18,
          color: "#dc2626", fontSize: 13,
        }}>
          ⚠️ {error} — please try again.
        </div>
      )}

      {/* ── At-a-glance result strip — instant read on how many options & how safe ── */}
      {results && results.length > 0 && !loading && summary && (
        <div className="cp-glance-strip">
          {[
            { label: "Total options", value: summary.total, color: "#1a1a2e", bg: "rgba(26,26,46,.06)", hint: "college + branch matches" },
            { label: "Safe", value: summary.counts.Safe, color: "#0e9c90", bg: "rgba(46,196,182,.12)", hint: "rank clears comfortably" },
            { label: "Moderate", value: summary.counts.Moderate, color: "#d9641a", bg: "rgba(249,115,22,.12)", hint: "rank is near the cutoff" },
            { label: "Ambitious", value: summary.counts.Ambitious, color: "#dc2626", bg: "rgba(239,68,68,.10)", hint: "a stretch — worth a shot" },
          ].map((s) => (
            <div key={s.label} className="cp-glance-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="cp-glance-val" style={{ color: s.color }}>{s.value}</div>
              <div className="cp-glance-lbl">{s.label}</div>
              <div className="cp-glance-hint">{s.hint}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Summary charts — side-by-side on desktop, stacked one-by-one on mobile ── */}
      {results && results.length > 0 && !loading && (
        <div className="grid-2 cp-results-summary" style={{ marginTop: 22, gap: 22 }}>
          <div className="card cp-summary-card">
            <div className="cp-summary-head">
              <span className="cp-summary-icon" style={{ background: "rgba(46,196,182,.14)", color: "#0e9c90" }}>
                <Crosshair size={16} />
              </span>
              <div>
                <h4>Confidence breakdown</h4>
                <p>How realistic each match is for your rank</p>
              </div>
            </div>
            <PieWithLegend
              data={summary.dist}
              colors={["#2EC4B6", "#F15A38", "#EF4444"]}
              height={200}
            />
          </div>
          <div className="card cp-summary-card">
            <div className="cp-summary-head">
              <span className="cp-summary-icon" style={{ background: "rgba(249,115,22,.12)", color: "#e05a2b" }}>
                <Layers size={16} />
              </span>
              <div>
                <h4>Matches by institute type</h4>
                <p>Spread of your options across NIT / IIIT / IIT</p>
              </div>
            </div>
            <PieWithLegend
              data={summary.typeData}
              colors={["#e05a2b", "#2563eb", "#7c3aed", "#059669"]}
              height={200}
            />
          </div>
        </div>
      )}

      {/* ── Results table ── */}
      {results && !loading && (
        <div className="card" style={{ marginTop: 22, padding: 0, overflow: "hidden" }}>
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid var(--line)",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 8,
          }}>
            <strong style={{ fontFamily: "Sora" }}>
              {results.length} eligible college-branch option{results.length !== 1 ? "s" : ""}
            </strong>
            <span className="cp-rank-legend">
              <span className="cp-legend-dot" style={{ background: "#2EC4B6" }} /> Opening
              <span className="cp-legend-dot" style={{ background: "#F15A38", marginLeft: 12 }} /> Closing
              <span style={{ marginLeft: 14, color: "var(--muted)" }}>· Tap a row for all rounds</span>
            </span>
          </div>

          {results.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              No matches — try widening the branch or category filters, or check your rank.
            </div>
          ) : (
            <>
            <p className="cp-swipe-hint">← Swipe sideways for every column · scroll down for more colleges ↓</p>
            <div className="cp-results-scroll">
              <table className="data-table cp-results-table">
                <thead>
                  <tr>
                    <th>College</th>
                    <th>Branch</th>
                    <th>Type</th>
                    <th>Opening rank</th>
                    <th>Closing rank</th>
                    <th>Avg pkg</th>
                    <th>Confidence</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => {
                    const key    = `${r.slug}-${r.branchCode}`;
                    const isOpen = expandedRow === key;
                    return (
                      <Fragment key={key}>
                        <tr
                          onClick={() => setExpandedRow(isOpen ? null : key)}
                          style={{ cursor: "pointer", background: isOpen ? "var(--sky)" : undefined }}
                        >
                          <td data-label="College">
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <CollegeLogo slug={r.slug} name={r.college} />
                              <div>
                                <Link
                                  to={`/colleges/${r.slug}`}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ fontWeight: 700, color: "var(--navy)" }}
                                >
                                  {r.college}
                                </Link>
                                <div style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 3 }}>
                                  <MapPin size={11} /> {r.state} · NIRF #{r.nirf}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td data-label="Branch">{r.branch}</td>
                          <td data-label="Type"><span className="badge teal">{r.type}</span></td>
                          <td data-label="Opening rank"><span className="cp-rank cp-rank-open">{fmtRank(r.opening)}</span></td>
                          <td data-label="Closing rank"><span className="cp-rank cp-rank-close">{fmtRank(r.closing)}</span></td>
                          <td data-label="Avg package">{fmtINR(r.avgPackage)}</td>
                          <td data-label="Confidence">
                            <span className={`badge ${TIER_BADGE[r.tier] || "teal"} cp-tier-badge`}>
                              {r.tier}
                            </span>
                          </td>
                          <td className="cp-expand-cell" data-label="">
                            <ChevronDown size={16} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: ".2s" }} />
                          </td>
                        </tr>
                        <AnimatePresence>
                          {isOpen && (
                            <tr className="cp-detail-row">
                              <td className="cp-detail-cell" colSpan={8} style={{ padding: 0, background: "var(--sky)" }}>
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  style={{ overflow: "hidden", padding: "0 20px" }}
                                >
                                  <RoundDetail row={r} />
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      )}

      {/* ── How the College Predictor works ── */}
      <NotesBlock
        accent="#F15A38"
        eyebrow="About this tool"
        heading="How the College Predictor works"
        points={[
          {
            icon: Database,
            title: "Real JoSAA 2025 data only",
            body: "Every match comes straight from official JoSAA 2025 opening & closing ranks — no modelled or made-up programs, so you never see branches a college doesn't actually offer.",
          },
          {
            icon: Layers,
            title: "All rounds, 3 confidence tiers",
            body: "We scan every JoSAA (and CSAB) round and classify each option as Safe (≤80% of closing), Moderate (80–100%) or Ambitious (100–115%) so you know how realistic it is.",
          },
          {
            icon: Trophy,
            title: "Category-rank matching",
            body: "JoSAA publishes reserved cutoffs as category ranks. Enter your category rank for the most accurate matches, or your CRL and we'll estimate the category rank for you.",
          },
          {
            icon: Users,
            title: "Female & home-state quotas",
            body: "Toggle female (supernumerary) seats to use female-only cutoffs, and apply home-state quota for NIT/IIIT to relax closing ranks for colleges in your state.",
          },
          {
            icon: BarChart3,
            title: "Smart, useful ordering",
            body: "Results are sorted by home-state preference, then NIRF rank, branch value and closing rank — the strongest, most relevant options surface first.",
          },
          {
            icon: MapPin,
            title: "Full detail on every row",
            body: "Tap any college to see round-by-round opening/closing cutoffs, seat counts, average package and a direct link to the full college profile.",
          },
        ]}
        note="Cutoffs are based on JoSAA 2025 and are indicative for 2026 — always verify on josaa.nic.in / csab.nic.in before locking choices."
      />
    </div>
  );
}