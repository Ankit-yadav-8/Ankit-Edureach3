import { useState, useMemo, Fragment } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, RotateCcw, ChevronDown, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { predictColleges, TIER_COLOR } from "../../utils/collegePredictor.js";
import { expandRounds } from "../../utils/cutoffEngine.js";
import { COLLEGE_BY_SLUG, BRANCHES, CATEGORIES, STATES } from "../../data/colleges.js";
import { Bars, PieWithLegend } from "../Charts.jsx";
import { fmtRank, fmtINR } from "../../utils/format.js";

const TYPE_SETS = {
  "/jee-main": ["NIT", "IIIT"],
  "/jee-advanced": ["IIT"],
};

function RoundDetail({ slug, branchCode, category }) {
  const college = COLLEGE_BY_SLUG[slug];
  const rounds = expandRounds(college, branchCode, category);
  const chart = rounds.map((r) => ({ name: r.round, Opening: r.opening, Closing: r.closing }));
  return (
    <div style={{ padding: "16px 4px 4px" }}>
      <div className="grid-2" style={{ gap: 18, alignItems: "start" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ fontSize: 12.5 }}>
            <thead><tr><th>Round</th><th>Stage</th><th>Opening</th><th>Closing</th></tr></thead>
            <tbody>
              {rounds.map((r) => (
                <tr key={r.round}>
                  <td><strong>{r.round}</strong></td>
                  <td><span className={`badge ${r.stage === "CSAB" ? "violet" : "teal"}`}>{r.stage}</span></td>
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
          <Bars data={chart} bars={[{ key: "Opening", label: "Opening", color: "#2EC4B6" }, { key: "Closing", label: "Closing", color: "#F97316" }]} height={220} fmt={fmtRank} angle={-30} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Link to={`/colleges/${slug}?tab=placements`} className="btn btn-ghost" style={{ fontSize: 13 }}>Placements <ArrowRight size={14} /></Link>
        <Link to={`/colleges/${slug}`} className="btn btn-coral" style={{ fontSize: 13 }}>Full college details <ArrowRight size={14} /></Link>
        <a href={college.website} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 13 }}>Official site <ExternalLink size={13} /></a>
      </div>
    </div>
  );
}

export default function CollegePredictorTool({ basePath = "/jee-main" }) {
  const allowedTypes = TYPE_SETS[basePath] || ["IIT", "NIT", "IIIT"];
  const [form, setForm] = useState({ rank: "", category: "OPEN", state: "", branch: "", female: false, homeState: false });
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const run = () => {
    const out = predictColleges({ ...form, types: allowedTypes });
    setResults(out);
    setOpen(null);
  };
  const reset = () => { setForm({ rank: "", category: "OPEN", state: "", branch: "", female: false, homeState: false }); setResults(null); };

  const summary = useMemo(() => {
    if (!results) return null;
    const tiers = ["Safe", "Moderate", "Stretch"];
    const dist = tiers.map((t) => ({ name: t, value: results.filter((r) => r.tier === t).length })).filter((d) => d.value);
    const byType = {};
    results.forEach((r) => { byType[r.type] = (byType[r.type] || 0) + 1; });
    const typeData = Object.entries(byType).map(([name, value]) => ({ name, value }));
    return { dist, typeData };
  }, [results]);

  return (
    <div>
      {/* Form */}
      <div className="card">
        <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.2rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Crosshair size={20} color="#F97316" /> Find every college within your reach
        </h3>
        <div className="grid-4" style={{ gap: 12 }}>
          <div className="field">
            <label>Your rank (CRL / category)</label>
            <input className="input" type="number" min="1" value={form.rank} onChange={(e) => set("rank", e.target.value)} placeholder="e.g. 8500" />
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
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, opacity: form.state ? 1 : 0.5 }} title={form.state ? "" : "Pick a home state first"}>
            <input type="checkbox" checked={form.homeState} disabled={!form.state} onChange={(e) => set("homeState", e.target.checked)} />
            Apply home-state quota (NIT/IIIT)
          </label>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="btn btn-coral" style={{ flex: 1, justifyContent: "center" }} onClick={run}>Predict Colleges</button>
          <button className="btn btn-ghost" onClick={reset}><RotateCcw size={16} /></button>
        </div>
      </div>

      {/* Summary charts */}
      {results && results.length > 0 && (
        <div className="grid-2" style={{ marginTop: 22, gap: 22 }}>
          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Confidence breakdown</h4>
            <PieWithLegend data={summary.dist} colors={["#2EC4B6", "#F4A261", "#F97316"]} height={200} />
          </div>
          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Matches by institute type</h4>
            <PieWithLegend data={summary.typeData} colors={["#0EA5A4", "#0EA5A4", "#2EC4B6"]} height={200} />
          </div>
        </div>
      )}

      {/* Results table */}
      {results && (
        <div className="card" style={{ marginTop: 22, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <strong style={{ fontFamily: "Sora" }}>{results.length} eligible college-branch options</strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Tap any row to see all JoSAA &amp; CSAB round cutoffs</span>
          </div>

          {results.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>No matches — try widening the branch or category filters, or check your rank.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>College</th><th>Branch</th><th>Type</th><th>Closing (final)</th><th>Avg pkg</th><th>Confidence</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
                    const key = `${r.slug}-${r.branchCode}`;
                    const isOpen = open === key;
                    return (
                      <Fragment key={key}>
                        <tr onClick={() => setOpen(isOpen ? null : key)} style={{ cursor: "pointer", background: isOpen ? "var(--sky)" : undefined }}>
                          <td>
                            <Link to={`/colleges/${r.slug}`} onClick={(e) => e.stopPropagation()} style={{ fontWeight: 700, color: "var(--navy)" }}>{r.college}</Link>
                            <div style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 3 }}><MapPin size={11} /> {r.state} · NIRF #{r.nirf}</div>
                          </td>
                          <td>{r.branch}</td>
                          <td><span className="badge teal">{r.type}</span></td>
                          <td>{fmtRank(r.closing)}</td>
                          <td>{fmtINR(r.avgPackage)}</td>
                          <td><span className="badge" style={{ background: `${TIER_COLOR[r.tier]}22`, color: TIER_COLOR[r.tier] }}>{r.tier}</span></td>
                          <td><ChevronDown size={16} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: ".2s" }} /></td>
                        </tr>
                        <AnimatePresence>
                          {isOpen && (
                            <tr>
                              <td colSpan={7} style={{ padding: 0, background: "var(--sky)" }}>
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", padding: "0 20px" }}>
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
