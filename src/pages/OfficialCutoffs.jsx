import { useEffect, useMemo, useState } from "react";
import { Search, Database, FileSpreadsheet, AlertTriangle } from "lucide-react";

/* Loads JoSAA cutoffs from public/data/ at runtime (static — works on GitHub Pages).
   Preferred: per-year files via a manifest:
     public/data/manifest.json  ->  { "years": [2025, 2024] }
     public/data/josaa_2025.csv , josaa_2024.csv , ...
   Fallback: a single public/data/josaa_cutoffs.csv (sample).
   CSV headers: Institute, Academic Program Name, Quota, Seat Type, Gender,
                Opening Rank, Closing Rank, Round, Year */

function parseCSV(text) {
  const rows = [];
  let i = 0, field = "", row = [], inQ = false;
  while (i < text.length) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (ch === '"') { inQ = false; i++; continue; }
      field += ch; i++; continue;
    }
    if (ch === '"') { inQ = true; i++; continue; }
    if (ch === ",") { row.push(field); field = ""; i++; continue; }
    if (ch === "\r") { i++; continue; }
    if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += ch; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.trim());
  return rows.slice(1).filter((r) => r.length > 1).map((r) => {
    const o = {};
    head.forEach((h, idx) => { o[h] = (r[idx] ?? "").trim(); });
    return o;
  });
}

const PAGE = 200;
const BASE = import.meta.env.BASE_URL;

export default function OfficialCutoffs() {
  const [raw, setRaw] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [years, setYears] = useState([]);          // from manifest (per-year mode)
  const [year, setYear] = useState("");
  const [q, setQ] = useState("");
  const [round, setRound] = useState("");
  const [cat, setCat] = useState("OPEN");
  const [gender, setGender] = useState("Gender-Neutral");

  const loadFile = (path) => {
    setStatus("loading");
    return fetch(BASE + path)
      .then((r) => { if (!r.ok) throw new Error("not found"); return r.text(); })
      .then((t) => {
        const rows = parseCSV(t);
        setRaw(rows);
        const rounds = [...new Set(rows.map((r) => r["Round"]).filter(Boolean))].map(Number);
        if (rounds.length) setRound(String(Math.max(...rounds)));
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  // try manifest (per-year) first, else fall back to single sample file
  useEffect(() => {
    fetch(BASE + "data/manifest.json")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((m) => {
        const ys = (m.years || []).slice().sort((a, b) => b - a);
        if (!ys.length) throw new Error();
        setYears(ys); setYear(String(ys[0]));
        loadFile(`data/josaa_${ys[0]}.csv`);
      })
      .catch(() => loadFile("data/josaa_cutoffs.csv"));
  }, []);

  const onYear = (y) => {
    setYear(y);
    if (years.length) loadFile(`data/josaa_${y}.csv`); // per-year mode → fetch that file
  };

  const opts = useMemo(() => {
    const u = (k) => [...new Set(raw.map((r) => r[k]).filter(Boolean))];
    return {
      years: years.length ? years : u("Year").sort((a, b) => b - a),
      rounds: u("Round").sort((a, b) => a - b),
      cats: u("Seat Type").sort(),
      genders: u("Gender").sort(),
    };
  }, [raw, years]);

  const filtered = useMemo(() => {
    return raw.filter((r) =>
      (years.length || !year || r["Year"] === year) &&
      (!round || r["Round"] === round) &&
      (!cat || r["Seat Type"] === cat) &&
      (!gender || r["Gender"] === gender) &&
      (!q || (r["Institute"] || "").toLowerCase().includes(q.toLowerCase()) || (r["Academic Program Name"] || "").toLowerCase().includes(q.toLowerCase()))
    ).sort((a, b) => (Number(a["Closing Rank"]) || 9e9) - (Number(b["Closing Rank"]) || 9e9));
  }, [raw, years, year, round, cat, gender, q]);

  const num = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? Math.round(n).toLocaleString("en-IN") : v; };

  return (
    <div className="page">
      <section style={{ background: "linear-gradient(135deg,#ffffff,#ffffff)", color: "var(--ink)", padding: "44px 0", textAlign: "center" }}>
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--coral)" }}>Official Cutoffs</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.9rem,4.5vw,3rem)", margin: "8px 0 6px" }}>JoSAA Cutoffs <span style={{ color: "var(--coral)" }}>2018–2025</span></h1>
          <p style={{ color: "var(--muted)", maxWidth: 640, margin: "0 auto" }}>Real opening &amp; closing ranks from official JoSAA data — all rounds, all categories.</p>
        </div>
      </section>

      <div className="container section">
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", marginBottom: 14 }}>
          <Search size={18} color="var(--muted)" />
          <input className="input" style={{ border: "none", padding: 4 }} placeholder="Search institute or program…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="grid-4" style={{ gap: 12, marginBottom: 14 }}>
          <div className="field"><label>Year</label><select className="select" value={year} onChange={(e) => onYear(e.target.value)}>{!years.length && <option value="">All</option>}{opts.years.map((y) => <option key={y}>{y}</option>)}</select></div>
          <div className="field"><label>Round</label><select className="select" value={round} onChange={(e) => setRound(e.target.value)}><option value="">All</option>{opts.rounds.map((r) => <option key={r}>{r}</option>)}</select></div>
          <div className="field"><label>Category (Seat type)</label><select className="select" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All</option>{opts.cats.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="field"><label>Gender</label><select className="select" value={gender} onChange={(e) => setGender(e.target.value)}><option value="">All</option>{opts.genders.map((g) => <option key={g}>{g}</option>)}</select></div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{status === "ready" ? `Showing ${Math.min(filtered.length, PAGE)} of ${filtered.length.toLocaleString()} records` : ""}</span>
          <span className="badge" style={{ background: "#15a06e1a", color: "var(--green)" }}><FileSpreadsheet size={12} /> Local CSV data</span>
        </div>

        {status === "loading" && <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Loading cutoff data…</div>}

        {status === "error" && (
          <div className="card" style={{ padding: 24, borderLeft: "4px solid var(--gold)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
              <AlertTriangle size={18} color="var(--gold)" /> No cutoff data loaded yet
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
              Add JoSAA data to <code>public/data/</code> — either per-year files (<code>josaa_2025.csv</code> + a <code>manifest.json</code> listing the years) or a single <code>josaa_cutoffs.csv</code>. Columns: Institute, Academic Program Name, Quota, Seat Type, Gender, Opening Rank, Closing Rank, Round, Year.
            </p>
          </div>
        )}

        {status === "ready" && filtered.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No records match these filters.</div>
        )}

        {status === "ready" && filtered.length > 0 && (
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table className="data-table" style={{ minWidth: 880 }}>
              <thead><tr><th>#</th><th>Institute</th><th>Program</th><th>Quota</th><th>Category</th><th>Gender</th><th>Round</th><th>Opening</th><th>Closing</th></tr></thead>
              <tbody>
                {filtered.slice(0, PAGE).map((r, i) => (
                  <tr key={i}>
                    <td style={{ color: "var(--muted)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 700, color: "var(--navy)" }}>{r["Institute"]}</td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>{r["Academic Program Name"]}</td>
                    <td><span className="badge" style={{ background: "#15a06e1a", color: "var(--green)", fontWeight: 700 }}>{r["Quota"]}</span></td>
                    <td><span className="badge" style={{ background: "#0ea5a41a", color: "var(--teal)", fontWeight: 700 }}>{r["Seat Type"]}</span></td>
                    <td style={{ fontSize: 12.5, color: "var(--muted)" }}>{(r["Gender"] || "").replace(" (including Supernumerary)", "")}</td>
                    <td>{r["Round"]}</td>
                    <td style={{ color: "var(--green)", fontWeight: 600 }}>{num(r["Opening Rank"])}</td>
                    <td><span style={{ background: "var(--teal)", color: "#fff", fontWeight: 800, borderRadius: 999, padding: "3px 12px", fontSize: 13, display: "inline-block" }}>{num(r["Closing Rank"])}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > PAGE && <p style={{ fontSize: 12, color: "var(--muted)", padding: "10px 16px" }}>Showing first {PAGE}. Narrow the filters to see more.</p>}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <Database size={13} /> Loaded from your local CSV. Always verify final cutoffs on josaa.nic.in.
        </p>
      </div>
    </div>
  );
}
