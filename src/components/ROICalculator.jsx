import { useState, useMemo } from "react";
import { Calculator, TrendingUp, Wallet, Trophy, Clock } from "lucide-react";
import { fmtINR } from "../utils/format.js";

const TAKE_HOME = 0.7; // rough post-tax take-home of CTC

/* Fee + ROI calculator. Pre-fills from a college when one is passed, otherwise
   ships with sensible defaults so it works as a standalone tool too. */
export default function ROICalculator({ college }) {
  const f = college?.fees || {};
  const initTuition = f.tuition ?? 200000;
  const initHostel = (f.hostel ?? 30000) + (f.mess ?? 35000);
  const initOther = f.other ?? 15000;
  const initPkg = college?.placements?.avg ?? 1500000;

  const [years, setYears] = useState(4);
  const [tuition, setTuition] = useState(initTuition);
  const [hostelMess, setHostelMess] = useState(initHostel);
  const [living, setLiving] = useState(initOther + 60000); // other fees + personal/travel
  const [scholarship, setScholarship] = useState(0);
  const [pkg, setPkg] = useState(initPkg);
  const [growth, setGrowth] = useState(8);
  const [horizon, setHorizon] = useState(10);

  const r = useMemo(() => {
    const costPerYear = tuition + hostelMess + living;
    const grossCost = costPerYear * years;
    const aid = scholarship * years;
    const netCost = Math.max(grossCost - aid, 0);

    const g = growth / 100;
    const firstYearTakeHome = pkg * TAKE_HOME;

    // Payback: accumulate yearly take-home (growing) until it covers net cost.
    let cum = 0;
    let payback = null;
    if (netCost <= 0) {
      payback = 0;
    } else {
      for (let k = 1; k <= 60; k++) {
        const th = firstYearTakeHome * Math.pow(1 + g, k - 1);
        if (cum + th >= netCost) {
          payback = k - 1 + (netCost - cum) / th;
          break;
        }
        cum += th;
      }
    }

    // Take-home earned across the chosen career horizon.
    let horizonTakeHome = 0;
    for (let k = 1; k <= horizon; k++) {
      horizonTakeHome += firstYearTakeHome * Math.pow(1 + g, k - 1);
    }
    const netGain = horizonTakeHome - netCost;
    const roiMultiple = netCost > 0 ? horizonTakeHome / netCost : null;

    return { grossCost, aid, netCost, payback, horizonTakeHome, netGain, roiMultiple };
  }, [years, tuition, hostelMess, living, scholarship, pkg, growth, horizon]);

  const field = (label, value, set, step = 10000) => (
    <div className="field">
      <label>{label}</label>
      <input className="input" type="number" min="0" step={step} value={value} onChange={(e) => set(Number(e.target.value) || 0)} />
    </div>
  );

  const metric = (label, value, color, Icon, sub) => (
    <div style={{ background: "var(--sky)", borderRadius: 14, padding: 16, textAlign: "center" }}>
      <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 4 }}>
        {Icon && <Icon size={13} />} {label}
      </div>
      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.4rem", color, lineHeight: 1.15 }}>{value}</div>
      {sub && <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 3 }}>{sub}</div>}
    </div>
  );

  return (
    <div className="card">
      <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
        <Calculator size={18} color="var(--coral)" /> Fee &amp; ROI calculator
      </h4>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
        Estimate the real cost of the degree (after scholarships) and how the average package pays it back, factoring in yearly salary growth.
      </p>

      <div className="roi-grid">
        {field("Tuition fee / year (₹)", tuition, setTuition)}
        {field("Hostel + mess / year (₹)", hostelMess, setHostelMess, 5000)}
        {field("Other living cost / year (₹)", living, setLiving, 5000)}
        {field("Scholarship / waiver / year (₹)", scholarship, setScholarship, 5000)}
        {field("Expected starting package / year (₹)", pkg, setPkg, 50000)}
        <div className="field">
          <label>Annual salary growth (%)</label>
          <input className="input" type="number" min="0" max="40" step="1" value={growth} onChange={(e) => setGrowth(Number(e.target.value) || 0)} />
        </div>
        <div className="field">
          <label>Course duration</label>
          <select className="select" value={years} onChange={(e) => setYears(Number(e.target.value))}>
            {[4, 5].map((y) => <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>
        <div className="field">
          <label>Career horizon</label>
          <select className="select" value={horizon} onChange={(e) => setHorizon(Number(e.target.value))}>
            {[5, 7, 10, 15, 20].map((y) => <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>
      </div>

      {r.aid > 0 && (
        <p style={{ fontSize: 12, color: "var(--green)", marginTop: 12, fontWeight: 600 }}>
          Scholarships cut the cost by {fmtINR(r.aid)} over {years} years — gross {fmtINR(r.grossCost)} → net {fmtINR(r.netCost)}.
        </p>
      )}

      <div className="roi-results" style={{ marginTop: 14 }}>
        {metric("Net degree cost", fmtINR(r.netCost), "var(--navy)", Wallet, `over ${years} years`)}
        {metric("Payback time", r.payback != null ? `${r.payback.toFixed(1)} yrs` : "—", "var(--green)", Clock, "to recover cost")}
        {metric(`${horizon}-yr take-home`, fmtINR(Math.round(r.horizonTakeHome)), "var(--coral)", TrendingUp, "post-tax earnings")}
        {metric("Return on cost", r.roiMultiple != null ? `${r.roiMultiple.toFixed(1)}×` : "—", "var(--violet)", Trophy, `net gain ${fmtINR(Math.round(r.netGain))}`)}
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>
        Assumes ~{Math.round(TAKE_HOME * 100)}% post-tax take-home and {growth}% yearly salary growth. These are rough projections — adjust the inputs for your situation. Loan interest, inflation and job switches will change the real numbers.
      </p>
    </div>
  );
}
