import React from "react";
import { Sliders, TrendingUp, Sparkles, AlertCircle, ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../../utils/financialEngine";

const ACCENT = "#FF693D";

export default function WhatIfLab({
  whatIf,
  onUpdateWhatIf,
  baseSimulation,
  scenarioSimulation,
  currency = "INR",
}) {
  const baseAgg = baseSimulation?.aggregates || {};
  const scenAgg = scenarioSimulation?.aggregates || {};

  // Deltas
  const revDiff = (scenAgg.annualRevenue || 0) - (baseAgg.annualRevenue || 0);
  const netDiff = (scenAgg.annualNetProfit || 0) - (baseAgg.annualNetProfit || 0);
  const marginDiff = (scenAgg.annualNetMarginPct || 0) - (baseAgg.annualNetMarginPct || 0);
  const cashDiff = (scenAgg.endingCashOnHand || 0) - (baseAgg.endingCashOnHand || 0);

  // Preset scenarios
  const applyPreset = (type) => {
    if (type === "base") {
      onUpdateWhatIf({
        priceAdjustmentPct: 0,
        mentorCommissionOverridePct: null,
        indianVolumeMultiplier: 1.0,
        intlVolumeMultiplier: 1.0,
        serverCostMultiplier: 1.0,
        marketingCostMultiplier: 1.0,
        renewalRateBoostPct: 0,
        refundRateOverridePct: null,
      });
    } else if (type === "conservative") {
      // 500 Indian students instead of 1,000
      onUpdateWhatIf({
        priceAdjustmentPct: -10,
        mentorCommissionOverridePct: 45,
        indianVolumeMultiplier: 0.5,
        intlVolumeMultiplier: 0.4,
        serverCostMultiplier: 1.2,
        marketingCostMultiplier: 1.2,
        renewalRateBoostPct: -5,
        refundRateOverridePct: 4,
      });
    } else if (type === "aggressive") {
      // 2,000 Indian students & 120 intl
      onUpdateWhatIf({
        priceAdjustmentPct: 15,
        mentorCommissionOverridePct: null,
        indianVolumeMultiplier: 2.0,
        intlVolumeMultiplier: 2.4,
        serverCostMultiplier: 1.8,
        marketingCostMultiplier: 2.0,
        renewalRateBoostPct: 10,
        refundRateOverridePct: 2,
      });
    } else if (type === "high_margin") {
      // Highly optimized mentor share & higher renewals
      onUpdateWhatIf({
        priceAdjustmentPct: 20,
        mentorCommissionOverridePct: 32,
        indianVolumeMultiplier: 1.2,
        intlVolumeMultiplier: 1.5,
        serverCostMultiplier: 1.0,
        marketingCostMultiplier: 0.9,
        renewalRateBoostPct: 15,
        refundRateOverridePct: 1.5,
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── PRESET SCENARIO BUTTONS ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: "#fff7ed",
              color: ACCENT,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Interactive What-If Decision Lab
            </h3>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: "2px 0 0" }}>
              Experiment with pricing, commission cuts, volume surges & cost doubling in real-time
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => applyPreset("base")}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#334155",
              cursor: "pointer",
            }}
          >
            Reset to Base (1,050 Target)
          </button>
          <button
            onClick={() => applyPreset("conservative")}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #fecaca",
              background: "#fef2f2",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#b91c1c",
              cursor: "pointer",
            }}
          >
            Conservative (500 Students)
          </button>
          <button
            onClick={() => applyPreset("aggressive")}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #fed7aa",
              background: "#fff7ed",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#c2410c",
              cursor: "pointer",
            }}
          >
            Aggressive Surge (2,000+ Students)
          </button>
          <button
            onClick={() => applyPreset("high_margin")}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #a7f3d0",
              background: "#ecfdf5",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#047857",
              cursor: "pointer",
            }}
          >
            High Margin (Optimized)
          </button>
        </div>
      </div>

      {/* ── BEFORE VS AFTER LIVE COMPARISON TILES ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {/* Total Revenue Tile */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "18px 20px",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
            Scenario Revenue
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>
            {formatCurrency(scenAgg.annualRevenue, currency)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              color: revDiff >= 0 ? "#10b981" : "#f43f5e",
              marginTop: 4,
            }}
          >
            {revDiff >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>
              {revDiff >= 0 ? "+" : ""}
              {formatCurrency(revDiff, currency, true)} vs Base
            </span>
          </div>
        </div>

        {/* Net Profit Tile */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "18px 20px",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
            Scenario Net Profit
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: scenAgg.annualNetProfit >= 0 ? "#10b981" : "#f43f5e", marginTop: 4 }}>
            {formatCurrency(scenAgg.annualNetProfit, currency)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              color: netDiff >= 0 ? "#10b981" : "#f43f5e",
              marginTop: 4,
            }}
          >
            {netDiff >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>
              {netDiff >= 0 ? "+" : ""}
              {formatCurrency(netDiff, currency, true)} ({scenAgg.annualNetMarginPct}% net margin)
            </span>
          </div>
        </div>

        {/* Break-Even Students Tile */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "18px 20px",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
            Break-Even Students Required
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>
            {scenAgg.annualBreakEvenStudents} students
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginTop: 4 }}>
            ~{scenAgg.monthlyBreakEvenStudents} students/month needed
          </div>
        </div>

        {/* Ending Cash on Hand Tile */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "18px 20px",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
            Ending Cash on Hand
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#0284c7", marginTop: 4 }}>
            {formatCurrency(scenAgg.endingCashOnHand, currency)}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: cashDiff >= 0 ? "#10b981" : "#f43f5e", marginTop: 4 }}>
            {cashDiff >= 0 ? "+" : ""}
            {formatCurrency(cashDiff, currency, true)} impact on bank
          </div>
        </div>
      </div>

      {/* ── SLIDERS & CONTROLS LAB ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 18,
          border: "1px solid #e2e8f0",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
        }}
      >
        <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>
          Live Financial Levers & Operational Controls
        </h4>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {/* Lever 1: Pricing Adjustment */}
          <div style={{ background: "#f8fafc", padding: "16px 18px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Indian Mentorship Pricing</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: ACCENT }}>
                {whatIf.priceAdjustmentPct > 0 ? `+${whatIf.priceAdjustmentPct}%` : `${whatIf.priceAdjustmentPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="80"
              step="5"
              value={whatIf.priceAdjustmentPct || 0}
              onChange={(e) => onUpdateWhatIf({ ...whatIf, priceAdjustmentPct: Number(e.target.value) })}
              style={{ width: "100%", accentColor: ACCENT, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              <span>-40% Discount</span>
              <span>Baseline</span>
              <span>+80% Premium</span>
            </div>
          </div>

          {/* Lever 2: Mentor Commission Override */}
          <div style={{ background: "#f8fafc", padding: "16px 18px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Mentor Commission Share</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#f43f5e" }}>
                {whatIf.mentorCommissionOverridePct !== null ? `${whatIf.mentorCommissionOverridePct}%` : "Roster Model (~38%)"}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="65"
              step="1"
              value={whatIf.mentorCommissionOverridePct !== null ? whatIf.mentorCommissionOverridePct : 38}
              onChange={(e) => onUpdateWhatIf({ ...whatIf, mentorCommissionOverridePct: Number(e.target.value) })}
              style={{ width: "100%", accentColor: "#f43f5e", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              <span>20% (Low Cost)</span>
              <span>40% (Standard)</span>
              <span>65% (High Payout)</span>
            </div>
          </div>

          {/* Lever 3: Indian Student Target Volume */}
          <div style={{ background: "#f8fafc", padding: "16px 18px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Indian Student Target</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#047857" }}>
                {Math.round(1000 * (whatIf.indianVolumeMultiplier || 1.0))} Students
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="3.0"
              step="0.1"
              value={whatIf.indianVolumeMultiplier || 1.0}
              onChange={(e) => onUpdateWhatIf({ ...whatIf, indianVolumeMultiplier: Number(e.target.value) })}
              style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              <span>300</span>
              <span>1,000 (Target)</span>
              <span>3,000 (Scale)</span>
            </div>
          </div>

          {/* Lever 4: International Student Volume */}
          <div style={{ background: "#f8fafc", padding: "16px 18px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>International NRI Students</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#8b5cf6" }}>
                {Math.round(50 * (whatIf.intlVolumeMultiplier || 1.0))} Students
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.2"
              value={whatIf.intlVolumeMultiplier || 1.0}
              onChange={(e) => onUpdateWhatIf({ ...whatIf, intlVolumeMultiplier: Number(e.target.value) })}
              style={{ width: "100%", accentColor: "#8b5cf6", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              <span>10</span>
              <span>50 (Target)</span>
              <span>200 (Global)</span>
            </div>
          </div>

          {/* Lever 5: Server & Cloud Expenses Multiplier */}
          <div style={{ background: "#f8fafc", padding: "16px 18px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Server & Tech Cost Scale</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#0284c7" }}>
                {whatIf.serverCostMultiplier || 1.0}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.25"
              value={whatIf.serverCostMultiplier || 1.0}
              onChange={(e) => onUpdateWhatIf({ ...whatIf, serverCostMultiplier: Number(e.target.value) })}
              style={{ width: "100%", accentColor: "#0284c7", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              <span>0.5x</span>
              <span>1.0x (Normal)</span>
              <span>4.0x (Heavy Load)</span>
            </div>
          </div>

          {/* Lever 6: Student Renewal Rate Boost */}
          <div style={{ background: "#f8fafc", padding: "16px 18px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Student Renewal Retention Boost</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#d97706" }}>
                +{whatIf.renewalRateBoostPct || 0}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="5"
              value={whatIf.renewalRateBoostPct || 0}
              onChange={(e) => onUpdateWhatIf({ ...whatIf, renewalRateBoostPct: Number(e.target.value) })}
              style={{ width: "100%", accentColor: "#d97706", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              <span>Baseline</span>
              <span>+15% Renewal</span>
              <span>+35% (Sticky)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

