import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Layers,
  Sliders,
  Table,
  Building,
  Wrench,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileText,
  Printer,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Server,
  Globe,
} from "lucide-react";
import Seo from "../components/Seo";
import {
  DEFAULT_STARTING_CASH,
  DEFAULT_USD_INR_RATE,
  DEFAULT_TAX_RATE,
  DEFAULT_GATEWAY_FEE_PCT,
  DEFAULT_PACKAGES,
  DEFAULT_MENTORS,
  DEFAULT_TEAM,
  DEFAULT_PROFIT_POLICY,
  DEFAULT_EXPENSES,
  DEFAULT_MONTHLY_STUDENT_TARGETS,
  DEFAULT_FUNNEL,
  DEFAULT_WHAT_IF,
  runFinancialSimulation,
  formatCurrency,
  generateSimulationCSV,
} from "../utils/financialEngine";
import FinancialCharts from "../components/finance/FinancialCharts";
import OrgChartTree from "../components/finance/OrgChartTree";
import MentorsManager from "../components/finance/MentorsManager";
import WhatIfLab from "../components/finance/WhatIfLab";
import PackagesManager from "../components/finance/PackagesManager";
import ExpensesManager from "../components/finance/ExpensesManager";
import MonthlyPnLTable from "../components/finance/MonthlyPnLTable";

const ACCENT = "#FF693D";
const SORA = "'Sora', sans-serif";
const STORAGE_KEY = "cp:mentorship_financial_model_v1";

export default function FinancialSimulator() {
  // Navigation active tab:
  // "dashboard" | "whatif" | "pnl" | "mentors" | "packages" | "team" | "expenses"
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currency, setCurrency] = useState("INR"); // "INR" | "USD"
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Core Editable State with LocalStorage Persistence
  const [packages, setPackages] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}:packages`);
      return saved ? JSON.parse(saved) : DEFAULT_PACKAGES;
    } catch {
      return DEFAULT_PACKAGES;
    }
  });

  const [mentors, setMentors] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}:mentors`);
      return saved ? JSON.parse(saved) : DEFAULT_MENTORS;
    } catch {
      return DEFAULT_MENTORS;
    }
  });

  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}:team`);
      return saved ? JSON.parse(saved) : DEFAULT_TEAM;
    } catch {
      return DEFAULT_TEAM;
    }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}:expenses`);
      return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
    } catch {
      return DEFAULT_EXPENSES;
    }
  });

  const [monthlyTargets, setMonthlyTargets] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}:targets`);
      return saved ? JSON.parse(saved) : DEFAULT_MONTHLY_STUDENT_TARGETS;
    } catch {
      return DEFAULT_MONTHLY_STUDENT_TARGETS;
    }
  });

  const [profitPolicy, setProfitPolicy] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}:profitPolicy`);
      return saved ? JSON.parse(saved) : DEFAULT_PROFIT_POLICY;
    } catch {
      return DEFAULT_PROFIT_POLICY;
    }
  });

  const [startingCash, setStartingCash] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}:startingCash`);
      return saved ? Number(saved) : DEFAULT_STARTING_CASH;
    } catch {
      return DEFAULT_STARTING_CASH;
    }
  });

  const [whatIf, setWhatIf] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}:whatIf`);
      return saved ? JSON.parse(saved) : DEFAULT_WHAT_IF;
    } catch {
      return DEFAULT_WHAT_IF;
    }
  });

  // Save to LocalStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}:packages`, JSON.stringify(packages));
      localStorage.setItem(`${STORAGE_KEY}:mentors`, JSON.stringify(mentors));
      localStorage.setItem(`${STORAGE_KEY}:team`, JSON.stringify(team));
      localStorage.setItem(`${STORAGE_KEY}:expenses`, JSON.stringify(expenses));
      localStorage.setItem(`${STORAGE_KEY}:targets`, JSON.stringify(monthlyTargets));
      localStorage.setItem(`${STORAGE_KEY}:profitPolicy`, JSON.stringify(profitPolicy));
      localStorage.setItem(`${STORAGE_KEY}:startingCash`, String(startingCash));
      localStorage.setItem(`${STORAGE_KEY}:whatIf`, JSON.stringify(whatIf));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [packages, mentors, team, expenses, monthlyTargets, profitPolicy, startingCash, whatIf]);

  // Reset to original simulation defaults
  const handleResetDefaults = () => {
    if (window.confirm("Reset all financial assumptions back to the official 1,050 student baseline simulation?")) {
      setPackages(DEFAULT_PACKAGES);
      setMentors(DEFAULT_MENTORS);
      setTeam(DEFAULT_TEAM);
      setExpenses(DEFAULT_EXPENSES);
      setMonthlyTargets(DEFAULT_MONTHLY_STUDENT_TARGETS);
      setProfitPolicy(DEFAULT_PROFIT_POLICY);
      setStartingCash(DEFAULT_STARTING_CASH);
      setWhatIf(DEFAULT_WHAT_IF);
      try {
        localStorage.clear();
      } catch {}
    }
  };

  // Base Simulation (Without What-If adjustments)
  const baseSimulation = useMemo(() => {
    return runFinancialSimulation({
      packages,
      mentors,
      team,
      profitPolicy,
      expenses,
      monthlyTargets,
      startingCash,
      whatIf: DEFAULT_WHAT_IF,
    });
  }, [packages, mentors, team, profitPolicy, expenses, monthlyTargets, startingCash]);

  // Active Simulation (Factoring in What-If scenario knobs)
  const simulation = useMemo(() => {
    return runFinancialSimulation({
      packages,
      mentors,
      team,
      profitPolicy,
      expenses,
      monthlyTargets,
      startingCash,
      whatIf,
    });
  }, [packages, mentors, team, profitPolicy, expenses, monthlyTargets, startingCash, whatIf]);

  const aggregates = simulation.aggregates;

  const isScenarioActive =
    whatIf.priceAdjustmentPct !== 0 ||
    whatIf.mentorCommissionOverridePct !== null ||
    whatIf.indianVolumeMultiplier !== 1.0 ||
    whatIf.intlVolumeMultiplier !== 1.0 ||
    whatIf.serverCostMultiplier !== 1.0 ||
    whatIf.marketingCostMultiplier !== 1.0 ||
    whatIf.renewalRateBoostPct !== 0;

  return (
    <>
      <Seo
        title="Mentorship Financial Simulator & CFO Console · Campus Point"
        description="Interactive 1-year financial and operational simulation engine for Campus Point mentorship business."
        robots="noindex, nofollow"
      />

      <div
        className="cfo-console-root"
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          color: "#0f172a",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── TOP APP BAR (MATCHING IMAGE 2 & 1) ── */}
        <header
          style={{
            height: 64,
            background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            padding: "0 clamp(1rem, 3vw, 2.5rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          {/* Left: Brand Mark + Console Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: ACCENT,
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 2px 6px rgba(255,105,61,0.25)",
                }}
              >
                <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
                  CP
                </span>
              </span>
              <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 16, color: "#0f172a", letterSpacing: "-0.01em" }}>
                Campus Point
              </span>
            </Link>

            <span style={{ width: 1, height: 20, background: "#cbd5e1" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 14, color: ACCENT }}>
                Mentorship Financial Simulator
              </span>
              <span style={{ fontSize: 10, fontWeight: 800, background: "#fff7ed", color: ACCENT, border: `1px solid ${ACCENT}30`, padding: "2px 7px", borderRadius: 20 }}>
                CFO LAB
              </span>
            </div>
          </div>

          {/* Right: Currency Toggle, Scenario Pill, Report & Reset */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Scenario Status Indicator */}
            {isScenarioActive ? (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#d97706",
                  background: "#fef3c7",
                  border: "1px solid #fde68a",
                  padding: "4px 10px",
                  borderRadius: 20,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Sparkles size={12} /> Custom Scenario Active
              </span>
            ) : (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#047857",
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  padding: "4px 10px",
                  borderRadius: 20,
                }}
              >
                Base Target: 1,050 Students
              </span>
            )}

            {/* Currency Switcher */}
            <div style={{ display: "inline-flex", background: "#f1f5f9", padding: 2, borderRadius: 8 }}>
              <button
                onClick={() => setCurrency("INR")}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "none",
                  fontSize: 11.5,
                  fontWeight: 800,
                  background: currency === "INR" ? "#ffffff" : "transparent",
                  color: currency === "INR" ? ACCENT : "#64748b",
                  cursor: "pointer",
                  boxShadow: currency === "INR" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                }}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("USD")}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "none",
                  fontSize: 11.5,
                  fontWeight: 800,
                  background: currency === "USD" ? "#ffffff" : "transparent",
                  color: currency === "USD" ? ACCENT : "#64748b",
                  cursor: "pointer",
                  boxShadow: currency === "USD" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                }}
              >
                $ USD
              </button>
            </div>

            {/* Executive Summary Button */}
            <button
              onClick={() => setReportModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
              title="View formatted executive summary report"
            >
              <FileText size={14} /> Executive Report
            </button>

            {/* Reset to Defaults */}
            <button
              onClick={handleResetDefaults}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#64748b",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
              title="Reset all numbers to initial 1,050 target simulation"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </header>

        {/* ── TOP SUB-NAV TABS (MATCHING IMAGE 2: Dashboard, Forecast, Actual, Reports) ── */}
        <div
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            padding: "0 clamp(1rem, 3vw, 2.5rem)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {[
            { id: "dashboard", label: "Dashboard (Overview)", icon: TrendingUp },
            { id: "whatif", label: "What-If Scenario Lab", icon: Sliders },
            { id: "pnl", label: "12-Month P&L & Cash", icon: Table },
            { id: "mentors", label: "Mentors & Economics", icon: Award },
            { id: "packages", label: "Packages & Funnel", icon: Layers },
            { id: "team", label: "Team & Org Chart", icon: Building },
            { id: "expenses", label: "OpEx Costs & Settings", icon: Wrench },
          ].map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 14px",
                  fontSize: 13,
                  fontWeight: active ? 800 : 600,
                  color: active ? ACCENT : "#64748b",
                  border: "none",
                  borderBottom: active ? `2.5px solid ${ACCENT}` : "2.5px solid transparent",
                  background: "transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all .15s ease",
                }}
              >
                <Icon size={16} color={active ? ACCENT : "#64748b"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── MAIN CONTENT CONTAINER ── */}
        <main
          style={{
            flex: 1,
            padding: "24px clamp(1rem, 3vw, 2.5rem) 60px",
            maxWidth: 1440,
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* ══════════════ TAB 1: DASHBOARD (MATCHING IMAGE 2) ══════════════ */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* 4 PRIMARY METRIC CARDS (EXACTLY MATCHING IMAGE 2 TOP ROW) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                {/* 1. Total Revenue */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    padding: "20px 22px",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>TOTAL MENTORSHIP REVENUE</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginTop: 4, letterSpacing: "-0.02em" }}>
                    {formatCurrency(aggregates.annualRevenue, currency)}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    From {aggregates.totalPayingStudents} paying students ({aggregates.totalPayingIndian} Indian + {aggregates.totalPayingIntl} Intl)
                  </div>
                </div>

                {/* 2. Total Cost of Mentorship Delivery */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    padding: "20px 22px",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>TOTAL COST OF SALES (MENTORS)</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#f43f5e", marginTop: 4, letterSpacing: "-0.02em" }}>
                    {formatCurrency(aggregates.annualMentorCost, currency)}
                  </div>
                  <div style={{ fontSize: 12, color: "#f43f5e", fontWeight: 700, marginTop: 4 }}>
                    {aggregates.mentorSharePct}% of gross revenue paid to mentors
                  </div>
                </div>

                {/* 3. Gross Profit (What Campus Point Keeps) */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    padding: "20px 22px",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>GROSS PROFIT (RETAINED TAKE)</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: ACCENT, marginTop: 4, letterSpacing: "-0.02em" }}>
                    {formatCurrency(aggregates.annualGrossProfit, currency)}
                  </div>
                  <div style={{ fontSize: 12, color: "#10b981", fontWeight: 700, marginTop: 4 }}>
                    {aggregates.annualGrossMarginPct}% Gross Margin after mentor & gateway fees
                  </div>
                </div>

                {/* 4. Net Income / Profit */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 16,
                    border: "1.5px solid rgba(16, 185, 129, 0.3)",
                    padding: "20px 22px",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.06)",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#047857" }}>NET INCOME / NET PROFIT</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#10b981", marginTop: 4, letterSpacing: "-0.02em" }}>
                    {formatCurrency(aggregates.annualNetProfit, currency)}
                  </div>
                  <div style={{ fontSize: 12, color: "#047857", fontWeight: 700, marginTop: 4 }}>
                    {aggregates.annualNetMarginPct}% Net Margin after taxes & all OpEx
                  </div>
                </div>
              </div>

              {/* 4 RECHARTS DUAL AREA CHARTS (EXACTLY MATCHING IMAGE 2) */}
              <FinancialCharts monthlyResults={simulation.monthlyResults} currency={currency} />

              {/* EXECUTIVE BENCHMARKS SUMMARY */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 18,
                  border: "1px solid #e2e8f0",
                  padding: "22px 24px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 20,
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>BREAK-EVEN STUDENTS</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginTop: 2 }}>
                    {aggregates.annualBreakEvenStudents} Students
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    ~{aggregates.monthlyBreakEvenStudents}/mo needed to cover fixed overhead
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>CONTRIBUTION MARGIN</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#047857", marginTop: 2 }}>
                    {formatCurrency(aggregates.contributionMarginPerStudent, currency)} / student
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    {aggregates.contributionMarginPct}% contribution margin
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>CAC vs LTV RATIO</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#0284c7", marginTop: 2 }}>
                    {aggregates.ltvToCacRatio}x
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    LTV: {formatCurrency(aggregates.customerLTV, currency, true)} · CAC: {formatCurrency(aggregates.blendedCAC, currency, true)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>PROFITABLE IN</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: ACCENT, marginTop: 2 }}>
                    {aggregates.firstProfitableMonth}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    Net positive cash generation achieved
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ TAB 2: WHAT-IF SCENARIO LAB ══════════════ */}
          {activeTab === "whatif" && (
            <WhatIfLab
              whatIf={whatIf}
              onUpdateWhatIf={setWhatIf}
              baseSimulation={baseSimulation}
              scenarioSimulation={simulation}
              currency={currency}
            />
          )}

          {/* ══════════════ TAB 3: 12-MONTH P&L & CASH FLOW ══════════════ */}
          {activeTab === "pnl" && (
            <MonthlyPnLTable simulation={simulation} currency={currency} />
          )}

          {/* ══════════════ TAB 4: MENTORS & COMPENSATION ══════════════ */}
          {activeTab === "mentors" && (
            <MentorsManager
              mentors={mentors}
              onUpdateMentors={setMentors}
              simulation={simulation}
              currency={currency}
            />
          )}

          {/* ══════════════ TAB 5: PACKAGES & FUNNELS ══════════════ */}
          {activeTab === "packages" && (
            <PackagesManager
              packages={packages}
              onUpdatePackages={setPackages}
              funnel={DEFAULT_FUNNEL}
              onUpdateFunnel={() => {}}
              arpu={simulation.arpu}
              currency={currency}
              usdToInr={DEFAULT_USD_INR_RATE}
            />
          )}

          {/* ══════════════ TAB 6: TEAM & ORG CHART (IMAGE 1) ══════════════ */}
          {activeTab === "team" && (
            <OrgChartTree
              team={team}
              onUpdateTeam={setTeam}
              currency={currency}
            />
          )}

          {/* ══════════════ TAB 7: OPEX EXPENSES & SETTINGS ══════════════ */}
          {activeTab === "expenses" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Profit Distribution Policy (100% Total) */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 18,
                  border: "1px solid #e2e8f0",
                  padding: "22px 24px",
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                  Profit Distribution Policy (When Net Income &gt; 0)
                </h3>
                <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 16px" }}>
                  Rule: If net profit is zero or negative, zero profit is distributed. In profitable months, profit is allocated as follows (must equal 100%):
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                  <div style={{ background: "#f8fafc", padding: "14px", borderRadius: 10, border: "1px solid #cbd5e1" }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>
                      Retained in Business (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={profitPolicy.retainedBusinessPct}
                      onChange={(e) => setProfitPolicy({ ...profitPolicy, retainedBusinessPct: Number(e.target.value) })}
                      style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, fontWeight: 700 }}
                    />
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>For R&amp;D &amp; Tech expansion</div>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "14px", borderRadius: 10, border: "1px solid #cbd5e1" }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>
                      Founder Distribution (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={profitPolicy.founderDistributionPct}
                      onChange={(e) => setProfitPolicy({ ...profitPolicy, founderDistributionPct: Number(e.target.value) })}
                      style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, fontWeight: 700 }}
                    />
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Quarterly founder dividend</div>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "14px", borderRadius: 10, border: "1px solid #cbd5e1" }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>
                      Team Profit-Sharing Pool (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={profitPolicy.teamProfitSharingPct}
                      onChange={(e) => setProfitPolicy({ ...profitPolicy, teamProfitSharingPct: Number(e.target.value) })}
                      style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, fontWeight: 700 }}
                    />
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Distributed to team members</div>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "14px", borderRadius: 10, border: "1px solid #cbd5e1" }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>
                      Emergency Reserve Fund (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={profitPolicy.emergencyReservePct}
                      onChange={(e) => setProfitPolicy({ ...profitPolicy, emergencyReservePct: Number(e.target.value) })}
                      style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, fontWeight: 700 }}
                    />
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Held in bank for risk hedge</div>
                  </div>
                </div>
              </div>

              {/* Recurring Expenses Manager */}
              <ExpensesManager expenses={expenses} onUpdateExpenses={setExpenses} currency={currency} />
            </div>
          )}
        </main>

        {/* ── MODAL: FORMATTED EXECUTIVE REPORT ── */}
        {reportModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 3000,
              display: "grid",
              placeItems: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 720,
                maxHeight: "90vh",
                overflowY: "auto",
                background: "#ffffff",
                borderRadius: 20,
                padding: "32px",
                boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.3)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #f1f5f9", paddingBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: ACCENT, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 11 }}>CP</span>
                    <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 18, color: "#0f172a" }}>Campus Point Mentorship</span>
                  </div>
                  <h2 style={{ fontFamily: SORA, fontWeight: 900, fontSize: 20, color: ACCENT, margin: "6px 0 0" }}>
                    FY 2026-27 Executive Financial Plan &amp; Model
                  </h2>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
                    Target: 1,000 Indian + 50 International Mentorship Students · Exclusively Student Mentorship
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "20px 0" }}>
                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>PROJECTED ANNUAL REVENUE</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginTop: 2 }}>{formatCurrency(aggregates.annualRevenue, currency)}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>1,050 Target Students</div>
                </div>

                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>DIRECT MENTOR PAYOUTS</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#f43f5e", marginTop: 2 }}>{formatCurrency(aggregates.annualMentorCost, currency)}</div>
                  <div style={{ fontSize: 11, color: "#f43f5e", fontWeight: 700 }}>{aggregates.mentorSharePct}% of gross revenue</div>
                </div>

                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}>CAMPUS POINT GROSS PROFIT</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: ACCENT, marginTop: 2 }}>{formatCurrency(aggregates.annualGrossProfit, currency)}</div>
                  <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>{aggregates.annualGrossMarginPct}% Gross Margin</div>
                </div>

                <div style={{ background: "#ecfdf5", padding: "14px", borderRadius: 10, border: "1px solid #a7f3d0" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#047857" }}>NET PROFIT / INCOME</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#10b981", marginTop: 2 }}>{formatCurrency(aggregates.annualNetProfit, currency)}</div>
                  <div style={{ fontSize: 11, color: "#047857", fontWeight: 700 }}>{aggregates.annualNetMarginPct}% Net Margin</div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Strategic Takeaways for Founder</h4>
                <ul style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
                  <li><strong>What is left to Campus Point:</strong> Campus Point retains <strong>{aggregates.campusPointRetainedSharePct}%</strong> ({formatCurrency(aggregates.annualGrossProfit, currency)}) of revenue to power technology, team salaries, and retained reserves.</li>
                  <li><strong>Break-Even Milestone:</strong> The company achieves break-even at <strong>{aggregates.annualBreakEvenStudents} paying students</strong> (~{aggregates.monthlyBreakEvenStudents} students/month), turning cash-flow positive in <strong>{aggregates.firstProfitableMonth}</strong>.</li>
                  <li><strong>Unit Economics:</strong> Contribution margin per mentee is <strong>{formatCurrency(aggregates.contributionMarginPerStudent, currency)}</strong> ({aggregates.contributionMarginPct}%), with a healthy <strong>{aggregates.ltvToCacRatio}x</strong> LTV-to-CAC ratio.</li>
                  <li><strong>Ending Liquidity:</strong> Year-end closing bank balance is <strong>{formatCurrency(aggregates.endingCashOnHand, currency)}</strong>, providing sustainable growth runway.</li>
                </ul>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <button
                  onClick={() => setReportModalOpen(false)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 8,
                    background: ACCENT,
                    color: "#ffffff",
                    border: "none",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

