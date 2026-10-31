import React from "react";
import { Download, Table, CheckCircle2, TrendingUp, AlertCircle, FileText } from "lucide-react";
import { formatCurrency, generateSimulationCSV } from "../../utils/financialEngine";

const ACCENT = "#FF693D";

export default function MonthlyPnLTable({ simulation, currency = "INR" }) {
  const monthlyResults = simulation?.monthlyResults || [];
  const aggregates = simulation?.aggregates || {};

  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(generateSimulationCSV(simulation));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `CampusPoint-12Month-Financial-Model-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── HEADER WITH CSV EXPORT ── */}
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
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#fff7ed",
              color: ACCENT,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Table size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              12-Month Financial Statement & Cash Flow Ledger
            </h3>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: "2px 0 0" }}>
              Formula-driven P&L, direct mentor delivery costs, OpEx, taxes, and liquidity tracking
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadCSV}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 16px",
            borderRadius: 10,
            background: "#ffffff",
            color: "#0f172a",
            border: "1.5px solid #cbd5e1",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            transition: "all .15s ease",
          }}
        >
          <Download size={16} /> Export Full CSV
        </button>
      </div>

      {/* ── COMPLETE 12-MONTH TABLE ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 18,
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "right" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", color: "#64748b", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <th style={{ padding: "12px 14px", textAlign: "left" }}>Month</th>
                <th style={{ padding: "12px 14px" }}>Paying</th>
                <th style={{ padding: "12px 14px" }}>Active</th>
                <th style={{ padding: "12px 14px" }}>Total Rev</th>
                <th style={{ padding: "12px 14px" }}>Mentor Payout</th>
                <th style={{ padding: "12px 14px" }}>Gross Profit</th>
                <th style={{ padding: "12px 14px" }}>GM %</th>
                <th style={{ padding: "12px 14px" }}>Tech</th>
                <th style={{ padding: "12px 14px" }}>Marketing</th>
                <th style={{ padding: "12px 14px" }}>Ops & Fees</th>
                <th style={{ padding: "12px 14px" }}>Salaries</th>
                <th style={{ padding: "12px 14px" }}>OpEx</th>
                <th style={{ padding: "12px 14px" }}>EBITDA</th>
                <th style={{ padding: "12px 14px" }}>Tax</th>
                <th style={{ padding: "12px 14px" }}>Net Profit</th>
                <th style={{ padding: "12px 14px" }}>Net %</th>
                <th style={{ padding: "12px 14px" }}>Retained</th>
                <th style={{ padding: "12px 14px" }}>Cash In</th>
                <th style={{ padding: "12px 14px" }}>Cash Out</th>
                <th style={{ padding: "12px 14px" }}>Closing Cash</th>
              </tr>
            </thead>
            <tbody>
              {monthlyResults.map((m, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={m.month}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      background: isEven ? "#ffffff" : "#fafafa",
                      transition: "background .15s ease",
                    }}
                  >
                    <td style={{ padding: "12px 14px", textAlign: "left", fontWeight: 800, color: "#0f172a" }}>
                      {m.month}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#334155" }}>
                      {m.indianPaying + m.intlPaying}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: ACCENT }}>
                      {m.activeStudents}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 800, color: "#0f172a" }}>
                      {formatCurrency(m.totalRevenue, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#f43f5e", fontWeight: 700 }}>
                      -{formatCurrency(m.monthlyMentorCost, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 800, color: ACCENT }}>
                      {formatCurrency(m.grossProfit, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#64748b", fontSize: 11.5 }}>
                      {m.grossMarginPct}%
                    </td>
                    <td style={{ padding: "12px 14px", color: "#64748b" }}>
                      {formatCurrency(m.techExpenses, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#64748b" }}>
                      {formatCurrency(m.marketingExpenses, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#64748b" }}>
                      {formatCurrency(m.operationsExpenses + m.gatewayFees, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#64748b" }}>
                      {formatCurrency(m.teamSalaries, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#475569", fontWeight: 700 }}>
                      {formatCurrency(m.totalOpEx, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: m.operatingProfit >= 0 ? "#10b981" : "#f43f5e" }}>
                      {formatCurrency(m.operatingProfit, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#64748b" }}>
                      {formatCurrency(m.taxProvision, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 900, color: m.netProfit >= 0 ? "#10b981" : "#f43f5e" }}>
                      {formatCurrency(m.netProfit, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 11.5, fontWeight: 700, color: m.netMarginPct >= 0 ? "#10b981" : "#f43f5e" }}>
                      {m.netMarginPct}%
                    </td>
                    <td style={{ padding: "12px 14px", color: "#854d0e", fontWeight: 700 }}>
                      {formatCurrency(m.retainedEarnings, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#10b981", fontWeight: 700 }}>
                      {formatCurrency(m.cashInflows, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#f43f5e" }}>
                      -{formatCurrency(m.cashOutflows, currency, true)}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 900, color: "#0284c7" }}>
                      {formatCurrency(m.closingCash, currency, true)}
                    </td>
                  </tr>
                );
              })}

              {/* ── ANNUAL TOTAL ROW ── */}
              <tr style={{ background: "#fff7ed", borderTop: "2px solid #fed7aa", fontWeight: 900, fontSize: 13, color: "#0f172a" }}>
                <td style={{ padding: "14px", textAlign: "left", color: ACCENT }}>
                  ANNUAL FY TOTAL
                </td>
                <td style={{ padding: "14px" }}>
                  {aggregates.totalPayingStudents}
                </td>
                <td style={{ padding: "14px", color: ACCENT }}>
                  Avg ~{Math.round(aggregates.totalPayingStudents / 12)}
                </td>
                <td style={{ padding: "14px", color: "#0f172a" }}>
                  {formatCurrency(aggregates.annualRevenue, currency)}
                </td>
                <td style={{ padding: "14px", color: "#f43f5e" }}>
                  -{formatCurrency(aggregates.annualMentorCost, currency)}
                </td>
                <td style={{ padding: "14px", color: ACCENT }}>
                  {formatCurrency(aggregates.annualGrossProfit, currency)}
                </td>
                <td style={{ padding: "14px" }}>
                  {aggregates.annualGrossMarginPct}%
                </td>
                <td colSpan={4} style={{ padding: "14px", textAlign: "center", color: "#64748b" }}>
                  Annual Operating Expenses
                </td>
                <td style={{ padding: "14px", color: "#475569" }}>
                  {formatCurrency(aggregates.annualOpEx, currency)}
                </td>
                <td style={{ padding: "14px", color: aggregates.annualOperatingProfit >= 0 ? "#10b981" : "#f43f5e" }}>
                  {formatCurrency(aggregates.annualOperatingProfit, currency)}
                </td>
                <td style={{ padding: "14px" }}>
                  {formatCurrency(aggregates.annualTaxes, currency)}
                </td>
                <td style={{ padding: "14px", color: "#10b981" }}>
                  {formatCurrency(aggregates.annualNetProfit, currency)}
                </td>
                <td style={{ padding: "14px", color: "#10b981" }}>
                  {aggregates.annualNetMarginPct}%
                </td>
                <td style={{ padding: "14px", color: "#854d0e" }}>
                  {formatCurrency(aggregates.annualRetainedEarnings, currency)}
                </td>
                <td colSpan={2} style={{ padding: "14px", textAlign: "center", color: "#64748b" }}>
                  Ending Cash Balance
                </td>
                <td style={{ padding: "14px", color: "#0284c7" }}>
                  {formatCurrency(aggregates.endingCashOnHand, currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

