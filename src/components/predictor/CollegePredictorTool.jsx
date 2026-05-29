import { useState, useMemo, Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair, RotateCcw, ChevronDown, MapPin,
  ExternalLink, ArrowRight, Loader2, Info,
} from "lucide-react";
import { TIER_COLOR } from "../../utils/collegePredictor.js";
import { expandRounds } from "../../utils/cutoffEngine.js";
import { loadPredictorDB } from "../../utils/realCutoffEngine.js";
import { COLLEGE_BY_SLUG, BRANCHES, CATEGORIES, STATES } from "../../data/colleges.js";

// Pre-warm 2024 cutoff data for round detail display
loadPredictorDB();
import { useCollegePredictor } from "../../hooks/useCollegePredictor.js";
import { Bars, PieWithLegend } from "../Charts.jsx";
import { fmtRank, fmtINR } from "../../utils/format.js";

const TYPE_SETS = {
  "/jee-main":      ["NIT", "IIIT"],
  "/jee-advanced":  ["IIT"],
};

const LOADING_TIPS = [
  "Scanning all college-branch combinations…",
  "Matching your rank against 2024 JoSAA cutoffs…",
  "Calculating fit scores across all rounds…",
  "Ranking results by NIRF & branch value…",
];

function RoundDetail({ slug, branchCode, category }) {
  const college = COLLEGE_BY_SLUG[slug];
  const rounds  = expandRounds(college, branchCode, category);
  const chart   = rounds.map((r) => ({ name: r.round, Opening: r.opening, Closing: r.closing }));

  return (
    <div style={{ padding: "16px 4px 4px" }}>
      <div className="grid-2" style={{ gap: 18, alignItems: "start" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ fontSize: 12.5 }}>
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
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
            {college.type === "IIT"
              ? "6 JoSAA rounds (IITs have no CSAB). Illustrative ranks modelled from base cutoffs — verify on josaa.nic.in."
              : "6 JoSAA + 2 CSAB special rounds. Illustrative ranks modelled from base cutoffs — verify on josaa.nic.in / csab.nic.in."}
          </p>
        </div>
        <div>
          <Bars
            data={chart}
            bars={[
              { key: "Opening", label: "Opening", color: "#2EC4B6" },
              { key: "Closing", label: "Closing", color: "#F97316" },
            ]}
            height={220} fmt={fmtRank} angle={-30}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Link to={`/colleges/${slug}?tab=placements`} className="btn btn-ghost" style={{ fontSize: 13 }}>
          Placements <ArrowRight size={14} />
        </Link>
        <Link to={`/colleges/${slug}`} className="btn btn-coral" style={{ fontSize: 13 }}>
          Full college details <ArrowRight size={14} />
        </Link>
        <a href={college.website} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 13 }}>
          Official site <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

export default function CollegePredictorTool({ basePath = "/jee-main" }) {
  const allowedTypes = TYPE_SETS[basePath] || ["IIT", "NIT", "IIIT"];

  const [form, setForm] = useState({
    rank: "", category: "OPEN", state: "",
    branch: "", female: false, homeState: false,
  });
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

    predict({ ...form, rank: Number(form.rank), types: allowedTypes }, false);
  }

  if (!loading && tipTimer.current) {
    clearInterval(tipTimer.current);
    tipTimer.current = null;
  }

  function handleReset() {
    setForm({ rank: "", category: "OPEN", state: "", branch: "", female: false, homeState: false });
    setExpandedRow(null);
    resetWorker();
  }

  const summary = useMemo(() => {
    if (!results?.length) return null;
    const tiers    = ["Safe", "Good", "Moderate", "Reach"];
    const dist     = tiers
      .map((t) => ({ name: t, value: results.filter((r) => r.tier === t).length }))
      .filter((d) => d.value);
    const byType   = {};
    results.forEach((r) => { byType[r.type] = (byType[r.type] || 0) + 1; });
    const typeData = Object.entries(byType).map(([name, value]) => ({ name, value }));
    return { dist, typeData };
  }, [results]);

  return (
    <div>
      {/* ── Form ── */}
      <div className="card">
        <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.2rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Crosshair size={20} color="#F97316" /> Find every college within your reach
        </h3>

        <div className="grid-4" style={{ gap: 12 }}>
          <div className="field">
            <label>Your rank (CRL / category)</label>
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

      {/* ── JEE Advanced category notice ── */}
      {basePath === "/jee-advanced" && form.category !== "OPEN" && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          background: "rgba(249,115,22,0.08)",
          border: "1px solid rgba(249,115,22,0.30)",
          borderRadius: 10, padding: "11px 16px", marginTop: 14,
          fontSize: 13, color: "var(--navy)",
        }}>
          <Info size={16} style={{ color: "#F97316", marginTop: 1, flexShrink: 0 }} />
          <span>
            <strong>Note:</strong> The rank you enter is your JEE Advanced{" "}
            <strong>CRL (General) rank</strong>. Colleges are matched against{" "}
            <strong>{form.category}</strong> category cutoffs from JoSAA data.
            For detailed category-rank analysis, open the{" "}
            <strong>College Details</strong> page of any result below.
          </span>
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
            borderTop: "4px solid #F47B20",
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

      {/* ── Summary charts ── */}
      {results && results.length > 0 && !loading && (
        <div className="grid-2" style={{ marginTop: 22, gap: 22 }}>
          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Confidence breakdown</h4>
            <PieWithLegend
              data={summary.dist}
              colors={["#2EC4B6", "#0EA5A4", "#F4A261", "#F97316"]}
              height={200}
            />
          </div>
          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Matches by institute type</h4>
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
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
              Tap any row to see all JoSAA &amp; CSAB round cutoffs
            </span>
          </div>

          {results.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              No matches — try widening the branch or category filters, or check your rank.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>College</th>
                    <th>Branch</th>
                    <th>Type</th>
                    <th>Closing (final)</th>
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
                          <td>
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
                          </td>
                          <td>{r.branch}</td>
                          <td><span className="badge teal">{r.type}</span></td>
                          <td>{fmtRank(r.closing)}</td>
                          <td>{fmtINR(r.avgPackage)}</td>
                          <td>
                            <span className="badge" style={{ background: `${TIER_COLOR[r.tier]}22`, color: TIER_COLOR[r.tier] }}>
                              {r.tier}
                            </span>
                          </td>
                          <td>
                            <ChevronDown size={16} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: ".2s" }} />
                          </td>
                        </tr>
                        <AnimatePresence>
                          {isOpen && (
                            <tr>
                              <td colSpan={7} style={{ padding: 0, background: "var(--sky)" }}>
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  style={{ overflow: "hidden", padding: "0 20px" }}
                                >
                                  <RoundDetail slug={r.slug} branchCode={r.branchCode} category={r.category} />
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
          )}
        </div>
      )}
    </div>
  );
}