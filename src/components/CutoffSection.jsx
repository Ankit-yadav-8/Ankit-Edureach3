/**
 * CutoffSection.jsx — Enhanced JoSAA Cutoff tab for CollegeDetail
 * ─────────────────────────────────────────────────────────────────
 * • Uses realCutoffEngine.js (loads all CSVs 2018–2025)
 * • Shows all available years for both IITs and NITs
 * • Falls back to legacy engine if no real data found
 * • Better, cleaner UI with animated transitions
 *
 * Usage inside CollegeDetail:
 *   import CutoffSection from "../components/CutoffSection.jsx";
 *   {tab === "Cutoff" && <CutoffSection college={college} />}
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  loadCutoffDB,
  getRealPrograms,
  getRealRounds,
  getRealHistory,
  getRealForecast,
  getDefaultQuota,
  getAvailableQuotas,
  getAvailableYears,
  findProgramByBranch,
  REAL_YEARS,
  fmtR,
} from "../utils/realCutoffEngine.js";
import { expandRounds, collegeBranches, cutoffHistory, forecastClosing } from "../utils/cutoffEngine.js";
import { CATEGORIES } from "../data/colleges.js";
import { fmtRank } from "../utils/format.js";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  orange:  "#FF693D",
  teal:    "#2EC4B6",
  violet:  "#8B5CF6",
  coral:   "#EF4444",
  green:   "#22C55E",
  amber:   "#F59E0B",
  sky:     "#F0F9FF",
  navy:    "#1C1C28",
  muted:   "#6B7280",
  line:    "#E5E7EB",
};

// Year-specific accent colours
const YR_COLOR = {
  "2018": "#94A3B8",
  "2019": "#38BDF8",
  "2020": "#34D399",
  "2021": "#2EC4B6",
  "2022": "#A78BFA",
  "2023": "#8B5CF6",
  "2024": "#FB923C",
  "2025": "#FF693D",
};

const fmt = (v) => (v ? fmtRank(v) : "—");

// ── Micro components ──────────────────────────────────────────────────────────

function Badge({ children, color = T.teal }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: `${color}1A`, color,
    }}>
      {children}
    </span>
  );
}

function TrendArrow({ delta }) {
  if (delta === null || delta === undefined) return <span style={{ color: T.muted }}>—</span>;
  const up = delta > 0;   // higher rank number = more seats (relaxing = good for students)
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      padding: "1px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: up ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)",
      color: up ? T.green : T.coral,
    }}>
      {up ? "▲" : "▼"} {delta > 0 ? "+" : ""}{delta.toLocaleString("en-IN")}
    </span>
  );
}

function StatCard({ label, value, color = T.navy, sub }) {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${T.line}`,
      borderRadius: 14,
      padding: "16px 14px",
      textAlign: "center",
      boxShadow: "0 1px 8px rgba(0,0,0,.05)",
    }}>
      <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".04em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1.15rem", color }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 10, color: T.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ── Custom Recharts tooltip ────────────────────────────────────────────────────
function CTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${T.line}`,
      borderRadius: 10,
      padding: "10px 14px",
      boxShadow: "0 6px 24px rgba(0,0,0,.10)",
      fontSize: 13,
      minWidth: 160,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: T.navy }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{
          display: "flex", justifyContent: "space-between", gap: 16,
          color: p.color, marginBottom: 2,
        }}>
          <span style={{ opacity: .85 }}>{p.name}</span>
          <strong>{fmtRank(p.value)}</strong>
        </div>
      ))}
    </div>
  );
}

// ── Select component ──────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{
        fontSize: 11, fontWeight: 700, color: T.muted,
        letterSpacing: ".06em", textTransform: "uppercase",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const selectStyle = {
  padding: "9px 12px",
  border: `1.5px solid ${T.line}`,
  borderRadius: 10,
  fontSize: 13,
  color: T.navy,
  background: "#fff",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: 32,
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
//  Props:
//    college        – college object from colleges.js
//    initialProgram – optional branch code or name pre-selected from Courses tab
//                     e.g. "cse", "Computer Science", "ece"
// ═══════════════════════════════════════════════════════════════════════════════
export default function CutoffSection({ college, initialProgram }) {
  const [dbReady, setDbReady]     = useState(false);
  const [programs, setPrograms]   = useState([]);
  const [program,  setProgram]    = useState("");
  const [quota,    setQuota]      = useState(getDefaultQuota(college));
  const [cat,      setCat]        = useState("OPEN");
  const [gender,   setGender]     = useState("GN");
  const [viewYear, setViewYear]   = useState("trend");
  const [availYears, setAvailYears] = useState([]);

  // ── Load DB once ─────────────────────────────────────────────────────────
  useEffect(() => {
    loadCutoffDB().then(() => {
      setDbReady(true);
      const progs = getRealPrograms(college);
      const yrs   = getAvailableYears(college);
      setPrograms(progs);
      setAvailYears(yrs);

      // If a branch was passed in, try to match it; otherwise default to first
      if (progs.length) {
        const matched = initialProgram
          ? (findProgramByBranch(college, initialProgram) ?? progs[0])
          : progs[0];
        setProgram(matched);
      }

      setQuota(getDefaultQuota(college));
      if (yrs.length) setViewYear(yrs[yrs.length - 1]);
    });
  }, [college]);

  // ── When initialProgram changes after DB is ready (tab switch) ───────────
  useEffect(() => {
    if (!dbReady || !initialProgram || !programs.length) return;
    const matched = findProgramByBranch(college, initialProgram);
    if (matched) setProgram(matched);
  }, [initialProgram, dbReady]);

  // ── Fallback ──────────────────────────────────────────────────────────────
  const useFallback = dbReady && programs.length === 0;
  const legacyBranches = useFallback ? collegeBranches(college) : [];
  const [legacyBranch, setLegacyBranch] = useState(legacyBranches[0]?.code || "cse");

  const legacyRounds  = useFallback ? expandRounds(college, legacyBranch, cat) : [];
  const legacyHistory = useFallback ? cutoffHistory(college, legacyBranch, cat) : [];
  const legacyForecast = useFallback ? forecastClosing(college, legacyBranch, cat) : null;

  const availableQuotas = useMemo(() => getAvailableQuotas(college), [dbReady, college]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const displayYear = viewYear === "trend" ? (availYears[availYears.length - 1] ?? "2025") : viewYear;

  const rounds = useMemo(() => {
    if (!dbReady || !program) return [];
    return getRealRounds(college, program, quota, cat, displayYear, gender);
  }, [dbReady, program, quota, cat, displayYear, gender, college]);

  const history = useMemo(() => {
    if (!dbReady || !program) return [];
    return getRealHistory(college, program, quota, cat, gender);
  }, [dbReady, program, quota, cat, gender, college]);

  const forecast = useMemo(() => {
    if (!dbReady || !program) return null;
    return getRealForecast(college, program, quota, cat, gender);
  }, [dbReady, program, quota, cat, gender, college]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (!dbReady) {
    return (
      <div style={{
        textAlign: "center", padding: "80px 20px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          border: `3px solid ${T.line}`,
          borderTop: `3px solid ${T.orange}`,
          animation: "spin 0.9s linear infinite",
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ color: T.muted, fontSize: 14 }}>Loading JoSAA cutoff data (2018–2025)…</div>
      </div>
    );
  }

  // ── Year pill ─────────────────────────────────────────────────────────────
  const YearPill = ({ v, label }) => {
    const color = v === "trend" ? T.violet : (YR_COLOR[v] ?? T.orange);
    const active = viewYear === v;
    return (
      <button
        onClick={() => setViewYear(v)}
        style={{
          padding: "5px 14px",
          borderRadius: 20,
          border: `1.5px solid ${active ? color : T.line}`,
          background: active ? `${color}18` : "transparent",
          color: active ? color : T.muted,
          fontWeight: active ? 700 : 500,
          fontSize: 12,
          cursor: "pointer",
          transition: "all .15s ease",
        }}
      >
        {label ?? v}
      </button>
    );
  };

  // ── Controls card ─────────────────────────────────────────────────────────
  const ControlsCard = () => (
    <div style={{
      background: "#fff",
      border: `1px solid ${T.line}`,
      borderRadius: 16,
      padding: "20px 22px",
      marginBottom: 22,
      boxShadow: "0 2px 12px rgba(0,0,0,.05)",
    }}>
      {/* Deep-linked branch banner */}
      {initialProgram && program && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "9px 14px", marginBottom: 18,
          background: `${T.teal}12`,
          border: `1px solid ${T.teal}40`,
          borderRadius: 10, fontSize: 13,
        }}>
          <span style={{ fontSize: 16 }}>🎯</span>
          <span style={{ color: T.navy }}>
            Showing cutoffs for{" "}
            <strong style={{ color: T.teal }}>
              {program.replace(/\s*\((?:B\.Tech|B\.E\.)[^)]*\)\s*/gi, " ").trim()}
            </strong>
            {" "}— selected from Courses tab.
          </span>
          <span style={{
            marginLeft: "auto", fontSize: 11, color: T.muted,
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
            Change below ↓
          </span>
        </div>
      )}

      {/* Filter row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
        gap: 16,
        marginBottom: 20,
      }}>
        <Field label={useFallback ? "Branch" : "Program"}>
          {useFallback ? (
            <select style={selectStyle} value={legacyBranch}
              onChange={(e) => setLegacyBranch(e.target.value)}>
              {legacyBranches.map((b) => (
                <option key={b.code} value={b.code}>{b.name}</option>
              ))}
            </select>
          ) : (
            <select style={{ ...selectStyle, fontSize: 12 }} value={program}
              onChange={(e) => setProgram(e.target.value)}>
              {programs.map((p) => (
                <option key={p} value={p}>
                  {p.replace(/\s*\((?:B\.Tech|B\.E\.)[^)]*\)\s*/gi, " ").trim()}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Category">
          <select style={selectStyle} value={cat} onChange={(e) => setCat(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        {!useFallback && (
          <Field label="Quota">
            <select style={selectStyle} value={quota}
              onChange={(e) => setQuota(e.target.value)}>
              {availableQuotas.map((q) => (
                <option key={q.value} value={q.value}>{q.label}</option>
              ))}
            </select>
          </Field>
        )}

        {!useFallback && (
          <Field label="Gender Pool">
            <select style={selectStyle} value={gender}
              onChange={(e) => setGender(e.target.value)}>
              <option value="GN">Gender-Neutral</option>
              <option value="FO">Female-Only (Supernumerary)</option>
            </select>
          </Field>
        )}
      </div>

      {/* Year selector */}
      <div>
        <div style={{
          fontSize: 11, color: T.muted, fontWeight: 700,
          letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10,
        }}>
          Select Year / View
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(useFallback ? REAL_YEARS : availYears).map((yr) => (
            <YearPill key={yr} v={yr} />
          ))}
          <YearPill v="trend" label="📈 All Years" />
        </div>
        {!useFallback && (
          <div style={{ fontSize: 11, color: T.muted, marginTop: 10 }}>
            Data available for{" "}
            <strong style={{ color: T.navy }}>{availYears.join(", ")}</strong>.
            {" "}Sourced from JoSAA official records.
          </div>
        )}
      </div>
    </div>
  );

  // ── Stats banner ──────────────────────────────────────────────────────────
  const StatsBanner = ({ data }) => {
    if (!data.length) return null;
    const r1 = data[0];
    const rf = data[data.length - 1];
    const relaxPct = rf.closing && r1.closing
      ? Math.round(((rf.closing - r1.closing) / r1.closing) * 100)
      : 0;
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: 12,
        marginBottom: 22,
      }}>
        <StatCard label="R1 Opening"    value={fmt(r1.opening)}  color={T.teal}   />
        <StatCard label="R1 Closing"    value={fmt(r1.closing)}  color={T.orange} />
        <StatCard label="Final Closing" value={fmt(rf.closing)}  color={T.violet} />
        <StatCard
          label="Rank relaxation"
          value={`${relaxPct > 0 ? "+" : ""}${relaxPct}%`}
          color={relaxPct > 0 ? T.green : T.coral}
          sub="R1 → Final"
        />
      </div>
    );
  };

  // ── Rounds table ──────────────────────────────────────────────────────────
  const RoundsTable = ({ data, yr }) => {
    if (!data.length) return (
      <div style={{
        padding: "32px 20px", textAlign: "center",
        color: T.muted, fontSize: 13,
        background: `${T.amber}0A`,
        borderRadius: 12,
        border: `1px dashed ${T.amber}40`,
      }}>
        <div style={{ fontSize: 22, marginBottom: 8 }}>📭</div>
        No cutoff data for this combination in {yr}.
        <br />
        <span style={{ fontSize: 12 }}>Try changing Category, Quota, or Year.</span>
      </div>
    );

    const r1Close = data[0].closing;
    return (
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 15 }}>
            All Rounds · <span style={{ color: YR_COLOR[yr] ?? T.orange }}>{yr}</span>
          </div>
          <Badge color={YR_COLOR[yr] ?? T.orange}>
            {data.length} rounds · {college.type === "IIT" ? "AI Quota" : `${quota} Quota`}
          </Badge>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%", borderCollapse: "collapse", fontSize: 13,
          }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.line}` }}>
                {["Round", "Stage", "Opening Rank", "Closing Rank", "Δ from R1"].map((h) => (
                  <th key={h} style={{
                    padding: "8px 10px", textAlign: "left",
                    color: T.muted, fontWeight: 600, fontSize: 11,
                    letterSpacing: ".04em", whiteSpace: "nowrap",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => {
                const delta = r1Close ? r.closing - r1Close : null;
                const isLast = i === data.length - 1;
                return (
                  <tr key={r.round} style={{
                    background: isLast ? `${T.orange}08` : i % 2 === 0 ? "#FAFAFA" : "#fff",
                    transition: "background .1s",
                  }}>
                    <td style={{ padding: "10px", fontWeight: 700, color: T.navy }}>
                      {r.round}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <Badge color={r.stage === "CSAB" ? T.violet : T.teal}>
                        {r.stage}
                      </Badge>
                    </td>
                    <td style={{ padding: "10px", color: T.muted }}>{fmt(r.opening)}</td>
                    <td style={{
                      padding: "10px",
                      fontWeight: isLast ? 800 : 500,
                      color: isLast ? T.orange : T.navy,
                    }}>
                      {fmt(r.closing)}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {i === 0
                        ? <span style={{ color: T.muted }}>—</span>
                        : <TrendArrow delta={delta} />
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 11, color: T.muted, marginTop: 10 }}>
          Official JoSAA data · Verify at{" "}
          <a href="https://josaa.nic.in" target="_blank" rel="noreferrer"
            style={{ color: T.orange, fontWeight: 600 }}>josaa.nic.in</a>
        </p>
      </div>
    );
  };

  // ── Bar chart ─────────────────────────────────────────────────────────────
  const RoundsChart = ({ data, yr }) => {
    if (!data.length) return null;
    const chartData = data.map((r) => ({
      name: r.round,
      Opening: r.opening,
      Closing: r.closing,
    }));
    return (
      <div>
        <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
          Opening vs Closing — {yr}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 28 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={fmtRank} />
            <Tooltip content={<CTip />} />
            <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Opening" name="Opening" fill={T.teal}   radius={[4,4,0,0]} />
            <Bar dataKey="Closing" name="Closing" fill={T.orange} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // ── History table ─────────────────────────────────────────────────────────
  const HistoryTable = () => {
    const data = useFallback ? legacyHistory : history;
    if (!data.length) return (
      <div style={{ color: T.muted, fontSize: 13 }}>No history data found.</div>
    );
    return (
      <div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.line}` }}>
                {["Year", "R1 Opening", "R1 Closing", "Final Closing", "YoY Δ"].map((h) => (
                  <th key={h} style={{
                    padding: "8px 10px", textAlign: "left",
                    color: T.muted, fontWeight: 600, fontSize: 11, letterSpacing: ".04em",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((h, i) => {
                const prev = data[i - 1];
                const delta = prev && h.r6Close && prev.r6Close
                  ? h.r6Close - prev.r6Close : null;
                return (
                  <tr key={h.year} style={{
                    background: i % 2 === 0 ? "#FAFAFA" : "#fff",
                  }}>
                    <td style={{ padding: "10px" }}>
                      <span style={{
                        display: "inline-block", padding: "2px 10px", borderRadius: 8,
                        background: `${YR_COLOR[String(h.year)] ?? T.orange}18`,
                        color: YR_COLOR[String(h.year)] ?? T.orange,
                        fontWeight: 700, fontSize: 12,
                      }}>
                        {h.year}
                      </span>
                    </td>
                    <td style={{ padding: "10px", color: T.muted }}>{fmt(h.opening)}</td>
                    <td style={{ padding: "10px" }}>{fmt(h.closing)}</td>
                    <td style={{ padding: "10px", fontWeight: 700 }}>{fmt(h.r6Close)}</td>
                    <td style={{ padding: "10px" }}>
                      <TrendArrow delta={delta} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Forecast banner */}
        {(useFallback ? legacyForecast : forecast) && (() => {
          const f = useFallback ? legacyForecast : forecast;
          return (
            <div style={{
              marginTop: 14, padding: "14px 16px",
              background: "linear-gradient(135deg,#F0F9FF,rgba(139,92,246,.06))",
              border: `1.5px dashed ${T.violet}50`,
              borderRadius: 12,
              display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: 12, flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.navy, marginBottom: 3 }}>
                  📈 Forecast {f.year} (linear trend)
                </div>
                <div style={{ fontSize: 11, color: T.muted }}>
                  {f.points} data points · Trend:{" "}
                  {f.trend === "tightening"
                    ? <span style={{ color: T.coral }}>🔴 Tightening (ranks falling)</span>
                    : <span style={{ color: T.green }}>🟢 Relaxing (ranks rising)</span>
                  }
                </div>
              </div>
              <div style={{
                fontFamily: "Sora,sans-serif", fontWeight: 800,
                fontSize: "1.25rem", color: T.violet, whiteSpace: "nowrap",
              }}>
                ~{fmt(f.closing)} closing
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  // ── Trend area chart ──────────────────────────────────────────────────────
  const TrendChart = () => {
    const data = useFallback ? legacyHistory : history;
    if (data.length < 2) return (
      <div style={{ color: T.muted, fontSize: 13 }}>Not enough data for trend chart.</div>
    );
    const chartData = data.map((h) => ({
      year: String(h.year),
      "Closing (Final)": h.r6Close,
      "Closing (R1)":   h.closing,
      "Opening (R1)":   h.opening,
    }));
    const fc = useFallback ? legacyForecast : forecast;
    return (
      <div>
        <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, marginBottom: 4, fontSize: 14 }}>
          Closing Rank Trend
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 14 }}>
          R1 opening &amp; closing ranks by year
          {fc ? ` · ${fc.year} forecast: ~${fmtRank(fc.closing)}` : ""}
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 4 }}>
            <defs>
              <linearGradient id="gClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={T.orange} stopOpacity={0.25} />
                <stop offset="95%" stopColor={T.orange} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gOpen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={T.teal} stopOpacity={0.2} />
                <stop offset="95%" stopColor={T.teal} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={fmtRank} />
            <Tooltip content={<CTip />} />
            <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Closing (Final)"
              stroke={T.orange} strokeWidth={2.5} fill="url(#gClose)"
              dot={{ r: 5, fill: T.orange }} activeDot={{ r: 7 }} />
            <Area type="monotone" dataKey="Closing (R1)"
              stroke={T.violet} strokeWidth={2} fill="none" strokeDasharray="5 3"
              dot={{ r: 4, fill: T.violet }} activeDot={{ r: 6 }} />
            <Area type="monotone" dataKey="Opening (R1)"
              stroke={T.teal} strokeWidth={1.5} fill="url(#gOpen)"
              dot={{ r: 3, fill: T.teal }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // ── Multi-year grouped bar chart ──────────────────────────────────────────
  const MultiYearBarChart = () => {
    if (!dbReady || !program) return null;

    // Build per-round data with all available years
    const roundNums = ["1","2","3","4","5","6"];
    const chartData = roundNums.map((rnd) => {
      const entry = { round: `R${rnd}` };
      let anyData = false;
      for (const yr of availYears) {
        const d = getRealRounds(college, program, quota, cat, yr, gender);
        const r = d.find((x) => x.round === `JR ${rnd}`);
        if (r) { entry[yr] = r.closing; anyData = true; }
      }
      return anyData ? entry : null;
    }).filter(Boolean);

    if (!chartData.length) return null;

    return (
      <div>
        <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, marginBottom: 4, fontSize: 14 }}>
          All-Year Closing Rank Comparison
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 14 }}>
          Round-wise closing ranks across all available years
        </div>
        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
            <XAxis dataKey="round" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={fmtRank} />
            <Tooltip content={<CTip />} />
            <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
            {availYears.map((yr) => (
              <Bar key={yr} dataKey={yr} name={`${yr}`}
                fill={YR_COLOR[yr] ?? T.muted} radius={[3,3,0,0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // ── Card wrapper ──────────────────────────────────────────────────────────
  const Card = ({ children, style }) => (
    <div style={{
      background: "#fff",
      border: `1px solid ${T.line}`,
      borderRadius: 16,
      padding: "20px 22px",
      boxShadow: "0 1px 8px rgba(0,0,0,.05)",
      ...style,
    }}>
      {children}
    </div>
  );

  const Grid2 = ({ children, style }) => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(340px,1fr))",
      gap: 20,
      alignItems: "start",
      ...style,
    }}>
      {children}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <ControlsCard />

      {useFallback && (
        <div style={{
          padding: "10px 16px", marginBottom: 18,
          background: `${T.amber}15`,
          border: `1px solid ${T.amber}40`,
          borderRadius: 10, fontSize: 13, color: T.muted,
        }}>
          ⚠️ This college isn't in the JoSAA real-data index yet.
          Showing illustrative estimates — add the institute name to{" "}
          <code>realCutoffEngine.js</code> INSTITUTE_ALIASES.
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${program}|${quota}|${cat}|${viewYear}|${gender}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24 }}
        >
          {/* ─── TREND VIEW ────────────────────────────────────────── */}
          {viewYear === "trend" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Grid2>
                <Card>
                  <div style={{
                    fontFamily: "Sora,sans-serif", fontWeight: 700, marginBottom: 4, fontSize: 15,
                  }}>
                    Year-wise Cutoff History
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>
                    R1 &amp; final-round cutoffs · Official JoSAA data
                  </div>
                  <HistoryTable />
                </Card>
                <Card>
                  <TrendChart />
                </Card>
              </Grid2>

              <Card>
                <MultiYearBarChart />
              </Card>

              {/* Latest year rounds as reference */}
              {availYears.length > 0 && (() => {
                const latestYr = availYears[availYears.length - 1];
                const latestRounds = getRealRounds(college, program, quota, cat, latestYr, gender);
                return (
                  <Grid2>
                    <Card>
                      <RoundsTable data={latestRounds} yr={latestYr} />
                    </Card>
                    <Card>
                      <RoundsChart data={latestRounds} yr={latestYr} />
                    </Card>
                  </Grid2>
                );
              })()}
            </div>
          )}

          {/* ─── SINGLE-YEAR VIEW ──────────────────────────────────── */}
          {viewYear !== "trend" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <StatsBanner data={useFallback ? legacyRounds : rounds} />

              <Grid2>
                <Card>
                  <RoundsTable data={useFallback ? legacyRounds : rounds} yr={viewYear} />
                </Card>
                <Card>
                  <RoundsChart data={useFallback ? legacyRounds : rounds} yr={viewYear} />
                </Card>
              </Grid2>

              {history.length > 1 && (
                <Grid2>
                  <Card>
                    <div style={{
                      fontFamily: "Sora,sans-serif", fontWeight: 700, marginBottom: 4, fontSize: 15,
                    }}>
                      How {viewYear} compares to other years
                    </div>
                    <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>
                      Final closing ranks year over year
                    </div>
                    <HistoryTable />
                  </Card>
                  <Card>
                    <TrendChart />
                  </Card>
                </Grid2>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Data source footer ─────────────────────────────────────── */}
      <div style={{
        marginTop: 28, padding: "14px 18px",
        background: "#F8F9FF",
        border: `1px solid ${T.line}`,
        borderRadius: 12,
        fontSize: 12, color: T.muted,
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <span>
          Cutoff data sourced from official JoSAA records for{" "}
          <strong style={{ color: T.navy }}>{(useFallback ? REAL_YEARS : availYears).join(", ")}</strong>.
          Covers Gender-Neutral and Female-only pools.
          {college?.type !== "IIT" &&
            " Quota: OS = Other State (nationwide competition), HS = Home State candidates."
          }
          {" "}Always verify at{" "}
          <a href="https://josaa.nic.in" target="_blank" rel="noreferrer"
            style={{ color: T.orange, fontWeight: 600 }}>josaa.nic.in</a>
          {college?.type !== "IIT" && (
            <> and{" "}
              <a href="https://csab.nic.in" target="_blank" rel="noreferrer"
                style={{ color: T.violet, fontWeight: 600 }}>csab.nic.in</a>
            </>
          )}.
        </span>
      </div>
    </div>
  );
}