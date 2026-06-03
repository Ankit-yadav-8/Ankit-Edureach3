import { useState, useMemo } from "react";
import { Award, ExternalLink, Landmark, Percent } from "lucide-react";
import { SCHOLARSHIPS } from "../data/scholarships.js";
import { fmtINR } from "../utils/format.js";
import Reveal from "../components/Reveal.jsx";
import ROICalculator from "../components/ROICalculator.jsx";

function EMICalculator() {
  const [amount, setAmount] = useState(800000);
  const [rate, setRate] = useState(9.5);
  const [years, setYears] = useState(7);

  const r = useMemo(() => {
    const n = years * 12;
    const i = rate / 12 / 100;
    const emi = i === 0 ? amount / n : (amount * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = emi * n;
    return { emi: Math.round(emi), total: Math.round(total), interest: Math.round(total - amount) };
  }, [amount, rate, years]);

  return (
    <div className="card">
      <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><Landmark size={18} color="var(--coral)" /> Education loan EMI calculator</h3>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>Estimate your monthly EMI and total interest on an education loan.</p>
      <div className="grid-3" style={{ gap: 12 }}>
        <div className="field"><label>Loan amount (₹)</label><input className="input" type="number" min="0" step="50000" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Interest rate (% p.a.)</label><input className="input" type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Tenure (years)</label><input className="input" type="number" min="1" max="20" value={years} onChange={(e) => setYears(Number(e.target.value) || 1)} /></div>
      </div>
      <div className="grid-3" style={{ gap: 12, marginTop: 14 }}>
        {[["Monthly EMI", r.emi, "var(--coral)"], ["Total interest", r.interest, "var(--orange)"], ["Total payable", r.total, "var(--navy)"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "var(--sky)", borderRadius: 12, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{l}</div>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.25rem", color: c }}>{fmtINR(v)}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>Many education loans offer a moratorium (no EMI during the course) and interest subsidies for eligible families — check the Vidya Lakshmi portal.</p>
    </div>
  );
}

export default function Scholarships() {
  return (
    <div className="page">
      <section className="warm-page-header" style={{ padding: "40px 0" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 20%, rgba(249,115,22,.20) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow">Scholarships &amp; Loans</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.4rem)", margin: "8px 0 4px", display: "flex", alignItems: "center", gap: 10, color: "#1c1c28" }}>
            <Award size={28} color="#F47B20" /> Fund your engineering education
          </h1>
          <p style={{ color: "rgba(28,28,40,.62)" }}>Major scholarships, fee waivers and an education-loan EMI calculator in one place.</p>
        </div>
      </section>

      <div className="container section" style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <ROICalculator />
        <EMICalculator />

        <div>
          <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 14 }}>Scholarships &amp; financial aid</h3>
          <div className="grid-2">
            {SCHOLARSHIPS.map((s, i) => (
              <Reveal key={s.name} delay={(i % 2) * 0.06}>
                <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 8, borderTop: "3px solid var(--gold)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <h4 style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)" }}>{s.name}</h4>
                    <span className="badge orange" style={{ whiteSpace: "nowrap" }}>{s.amount}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{s.body}</div>
                  <div style={{ fontSize: 13.5, color: "var(--ink)" }}><strong>Who:</strong> {s.who}</div>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{s.note}</p>
                  <a href={s.link} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ marginTop: "auto", fontSize: 13, justifyContent: "center" }}>Official portal <ExternalLink size={13} /></a>
                </div>
              </Reveal>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>Amounts &amp; eligibility are indicative — always confirm on the official scholarship portal before applying.</p>
        </div>
      </div>
    </div>
  );
}
