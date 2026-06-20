import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ExternalLink, CheckCircle2, Trophy } from "lucide-react";
import { CenterDonut, Bars } from "../Charts.jsx";
import { COLLEGES } from "../../data/colleges.js";
import { fmtINR, fmtRank } from "../../utils/format.js";
import Reveal from "../Reveal.jsx";

/* ---------- Subject-wise difficulty (per shift) ---------- */
const SHIFTS = [
  { id: "s1", label: "Session 1 · Shift 1", phys: 62, chem: 48, math: 70 },
  { id: "s2", label: "Session 1 · Shift 2", phys: 55, chem: 52, math: 66 },
  { id: "s3", label: "Session 2 · Shift 1", phys: 58, chem: 45, math: 72 },
  { id: "s4", label: "Session 2 · Shift 2", phys: 60, chem: 50, math: 64 },
];
const SUBJECT_COLOR = { Physics: "#4361ee", Chemistry: "#2EC4B6", Maths: "#F4A261" };

export function DifficultyAnalysis() {
  const [shift, setShift] = useState(SHIFTS[0].id);
  const s = SHIFTS.find((x) => x.id === shift);
  const donut = (label, val) => [{ name: "Difficulty", value: val }, { name: "Rest", value: 100 - val }];
  const overall = Math.round((s.phys + s.chem + s.math) / 3);

  return (
    <div>
      <div className="tabs" style={{ marginBottom: 22, flexWrap: "wrap" }}>
        {SHIFTS.map((x) => (
          <button key={x.id} className={`tab ${shift === x.id ? "active" : ""}`} onClick={() => setShift(x.id)}>{x.label}</button>
        ))}
      </div>
      <div className="grid-4">
        {[["Physics", s.phys], ["Chemistry", s.chem], ["Maths", s.math], ["Overall", overall]].map(([label, val]) => (
          <div className="card" key={label} style={{ textAlign: "center" }}>
            <CenterDonut data={donut(label, val)} centerLabel={`${val}%`} centerSub={label}
              colors={[SUBJECT_COLOR[label] || "#FF693D", "#eef0f5"]} height={150} />
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", marginTop: 4 }}>
              {val >= 65 ? "Tough" : val >= 50 ? "Moderate" : "Easy"} difficulty
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14, textAlign: "center" }}>
        Difficulty index is an illustrative aggregate of student feedback & expert review per shift.
      </p>
    </div>
  );
}

/* ---------- Shift-wise papers grid ---------- */
export function PapersGrid({ exam }) {
  const sessions = exam?.slug === "jee-advanced"
    ? [
        { t: "Paper 1", shifts: ["Question Paper", "Answer Key", "Solutions"] },
        { t: "Paper 2", shifts: ["Question Paper", "Answer Key", "Solutions"] },
      ]
    : [
        { t: "Session 1 (January)", shifts: ["Shift 1 Paper", "Shift 1 Key", "Shift 2 Paper", "Shift 2 Key"] },
        { t: "Session 2 (April)", shifts: ["Shift 1 Paper", "Shift 1 Key", "Shift 2 Paper", "Shift 2 Key"] },
      ];
  const examName = exam?.name || "JEE";
  // Build a guaranteed-valid link for each specific paper/shift.
  const linkFor = (session, shift) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${examName} 2026 ${session} ${shift} download PDF`)}`;
  return (
    <div className="grid-2">
      {sessions.map((sess) => (
        <Reveal key={sess.t}>
          <div className="card">
            <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4 }}>{sess.t}</h4>
            <p style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 12 }}>Opens the official paper/key in a new tab.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sess.shifts.map((sh) => (
                <a key={sh} href={linkFor(sess.t, sh)} target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "var(--sky)", borderRadius: 10, color: "var(--navy)", fontSize: 14, fontWeight: 500 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 9 }}><FileText size={16} color="var(--coral)" /> {sh}</span>
                  <ExternalLink size={14} color="var(--muted)" />
                </a>
              ))}
            </div>
            {exam?.website && (
              <a href={exam.website} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ marginTop: 12, fontSize: 13, justifyContent: "center", width: "100%" }}>
                Official portal <ExternalLink size={13} />
              </a>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- Eligibility cards ---------- */
export function EligibilityCards({ exam }) {
  const items = exam?.eligibility || [];
  return (
    <div className="grid-3">
      {items.map((e, i) => (
        <Reveal key={i} delay={i * 0.06}>
          <div className="card" style={{ display: "flex", gap: 12, alignItems: "flex-start", height: "100%" }}>
            <CheckCircle2 size={22} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--navy)" }}>{e}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- Rankings table (sortable) ---------- */
export function RankingsTable({ type }) {
  const [sort, setSort] = useState("nirf");
  const rows = COLLEGES.filter((c) => c.type === type);
  const sorted = [...rows].sort((a, b) =>
    sort === "nirf" ? a.nirf - b.nirf :
    sort === "package" ? b.placements.avg - a.placements.avg :
    sort === "placed" ? b.placements.placedPct - a.placements.placedPct : 0
  );
  const Btn = ({ k, children }) => (
    <button onClick={() => setSort(k)} className={`tab ${sort === k ? "active" : ""}`} style={{ fontSize: 13 }}>{children}</button>
  );
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", display: "flex", gap: 8, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "var(--muted)", alignSelf: "center", marginRight: 4 }}>Sort by:</span>
        <Btn k="nirf">NIRF rank</Btn><Btn k="package">Avg package</Btn><Btn k="placed">Placement %</Btn>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>NIRF</th><th>Institute</th><th>Location</th><th>Avg package</th><th>Highest</th><th>Placed</th><th></th></tr></thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.slug}>
                <td><span className="badge orange" style={{ display: "inline-flex", gap: 3, alignItems: "center" }}><Trophy size={11} />{c.nirf}</span></td>
                <td><Link to={`/colleges/${c.slug}`} style={{ fontWeight: 700, color: "var(--navy)" }}>{c.name}</Link></td>
                <td style={{ fontSize: 13, color: "var(--muted)" }}>{c.location}</td>
                <td>{fmtINR(c.placements.avg)}</td>
                <td style={{ color: "var(--green)" }}>{fmtINR(c.placements.highest)}</td>
                <td>{c.placements.placedPct}%</td>
                <td><Link to={`/colleges/${c.slug}`} className="btn btn-ghost" style={{ fontSize: 12.5, padding: "6px 12px" }}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
