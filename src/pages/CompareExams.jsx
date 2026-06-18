import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Plus, ArrowRight, GitCompare } from "lucide-react";
import { EXAMS, EXAM_BY_SLUG } from "../data/exams.js";
import Seo from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";

export default function CompareExams() {
  const [picked, setPicked] = useState(["jee-main", "jee-advanced"]);
  const [showPicker, setShowPicker] = useState(false);
  const exams = picked.map((s) => EXAM_BY_SLUG[s]).filter(Boolean);

  const add = (slug) => { if (picked.length < 3 && !picked.includes(slug)) setPicked((p) => [...p, slug]); setShowPicker(false); };
  const remove = (slug) => setPicked((p) => p.filter((s) => s !== slug));

  const ROWS = [
    ["Full name", (e) => e.full],
    ["Conducting body", (e) => e.body],
    ["Level", (e) => e.level],
    ["Accepted by", (e) => e.accepts],
    ["Eligibility", (e) => e.eligibility?.[0] || "—"],
    ["Pattern", (e) => e.pattern?.[0] || "—"],
  ];

  return (
    <div className="page">
      <div className="container"><BackButton style={{ margin: "0 0 2px" }} /></div>
      <Seo
        title="Compare Engineering Exams — JEE Main vs Advanced vs BITSAT"
        description="Side-by-side comparison of JEE Main, JEE Advanced, BITSAT and other engineering entrance exams — pattern, eligibility, difficulty and cutoffs on CollegeParichay."
        path="/compare-exams"
      />
      <section style={{ background: "linear-gradient(135deg,#ffffff,#ffffff)", color: "var(--ink)", padding: "40px 0" }}>
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--coral)" }}>Compare Exams</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.4rem)", margin: "8px 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
            <GitCompare size={26} /> Compare entrance exams
          </h1>
          <p style={{ color: "var(--muted)" }}>Pick up to 3 exams to see eligibility, pattern and who accepts them, side by side.</p>
        </div>
      </section>

      <div className="container section">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: 520 }}>
            <thead>
              <tr>
                <th style={{ minWidth: 130 }}></th>
                {exams.map((e) => (
                  <th key={e.slug} style={{ minWidth: 160 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                      <Link to={`/exams/${e.slug}`} style={{ fontWeight: 800, color: "var(--navy)", fontFamily: "Sora" }}>{e.name}</Link>
                      {exams.length > 1 && <button onClick={() => remove(e.slug)} aria-label="Remove" style={{ display: "grid", placeItems: "center", width: 20, height: 20, borderRadius: "50%", background: "rgba(13,27,62,.08)" }}><X size={12} /></button>}
                    </div>
                  </th>
                ))}
                {exams.length < 3 && <th><button className="btn btn-ghost" style={{ fontSize: 12.5 }} onClick={() => setShowPicker(true)}><Plus size={14} /> Add</button></th>}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, fn]) => (
                <tr key={label}>
                  <td style={{ fontWeight: 700, color: "var(--navy)" }}>{label}</td>
                  {exams.map((e) => <td key={e.slug} style={{ fontSize: 13.5 }}>{fn(e)}</td>)}
                  {exams.length < 3 && <td></td>}
                </tr>
              ))}
              <tr>
                <td style={{ fontWeight: 700, color: "var(--navy)" }}>Details</td>
                {exams.map((e) => <td key={e.slug}><Link to={`/exams/${e.slug}`} className="btn btn-ghost" style={{ fontSize: 12.5, padding: "6px 12px" }}>Open <ArrowRight size={13} /></Link></td>)}
                {exams.length < 3 && <td></td>}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showPicker && (
        <div onClick={() => setShowPicker(false)} style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,.5)", zIndex: 80, display: "grid", placeItems: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: "min(480px,100%)", maxHeight: "75vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontFamily: "Sora", fontWeight: 700 }}>Add an exam</h3>
              <button onClick={() => setShowPicker(false)}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {EXAMS.filter((e) => !picked.includes(e.slug)).map((e) => (
                <button key={e.slug} onClick={() => add(e.slug)} className="row-btn" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 10, background: "var(--sky)", textAlign: "left" }}>
                  <span><strong style={{ color: "var(--navy)" }}>{e.name}</strong> <span style={{ fontSize: 12, color: "var(--muted)" }}>· {e.body}</span></span>
                  <Plus size={16} color="var(--coral)" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
