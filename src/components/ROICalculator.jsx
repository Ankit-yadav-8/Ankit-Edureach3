import { useState, useMemo } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { fmtINR } from "../utils/format.js";

/* Fee + ROI calculator. Pre-fills from a college if passed. */
export default function ROICalculator({ college }) {
  const baseFee = college ? Object.values(college.fees).reduce((a, b) => a + b, 0) : 200000;
  const basePkg = college ? college.placements.avg : 1500000;

  const [years, setYears] = useState(4);
  const [feePerYear, setFeePerYear] = useState(baseFee);
  const [pkg, setPkg] = useState(basePkg);
  const [livingPerYear, setLiving] = useState(120000);

  const r = useMemo(() => {
    const totalCost = (feePerYear + livingPerYear) * years;
    const firstYearNet = pkg * 0.7; // rough post-tax take-home
    const payback = firstYearNet > 0 ? totalCost / firstYearNet : 0;
    return { totalCost, payback };
  }, [years, feePerYear, pkg, livingPerYear]);

  const field = (label, value, set, step = 10000) => (
    <div className="field">
      <label>{label}</label>
      <input className="input" type="number" min="0" step={step} value={value} onChange={(e) => set(Number(e.target.value) || 0)} />
    </div>
  );

  return (
    <div className="card">
      <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
        <Calculator size={18} color="var(--coral)" /> Fee &amp; ROI calculator
      </h4>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>Estimate the total cost of the degree and how quickly the average package could pay it back.</p>
      <div className="grid-2" style={{ gap: 12 }}>
        {field("Tuition + hostel / year (₹)", feePerYear, setFeePerYear)}
        {field("Living cost / year (₹)", livingPerYear, setLiving)}
        {field("Expected avg package / year (₹)", pkg, setPkg, 50000)}
        <div className="field">
          <label>Course duration (years)</label>
          <select className="select" value={years} onChange={(e) => setYears(Number(e.target.value))}>
            {[4, 5].map((y) => <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>
      </div>
      <div className="grid-2" style={{ gap: 12, marginTop: 14 }}>
        <div style={{ background: "var(--sky)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Total cost of degree</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.5rem", color: "var(--navy)" }}>{fmtINR(r.totalCost)}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#e7f8f5,#fff)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><TrendingUp size={13} /> Payback time</div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.5rem", color: "var(--green)" }}>{r.payback ? `${r.payback.toFixed(1)} yrs` : "—"}</div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>Rough estimate assuming ~70% take-home of the average package. Adjust the numbers for your situation. Scholarships and fee waivers can lower the cost significantly.</p>
    </div>
  );
}
