import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency } from "../../utils/financialEngine";

const ACCENT = "#FF693D";

// Custom Tooltip component matching Image 2 look
const CustomChartTooltip = ({ active, payload, label, currency = "INR" }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(6px)",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "10px 14px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.12)",
          fontSize: 12,
          color: "#0f172a",
          minWidth: 160,
        }}
      >
        <div style={{ fontWeight: 800, color: "#334155", marginBottom: 6, borderBottom: "1px solid #f1f5f9", paddingBottom: 4 }}>
          {label}
        </div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, margin: "3px 0" }}>
            <span style={{ color: entry.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color, display: "inline-block" }} />
              {entry.name}:
            </span>
            <span style={{ fontWeight: 800, fontFamily: "monospace", color: "#0f172a" }}>
              {formatCurrency(entry.value, currency, true)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancialCharts({ monthlyResults = [], currency = "INR" }) {
  // Map monthly data for charts
  const chartData = monthlyResults.map((m) => ({
    month: m.month.slice(0, 3),
    fullMonth: m.month,
    revenue: m.totalRevenue,
    expenses: m.monthlyMentorCost + m.totalOpEx + m.gatewayFees,
    netIncome: m.netProfit,
    cashIn: m.cashInflows,
    cashOut: -m.cashOutflows, // negative for visual mirroring like Image 2
    cashOutAbs: m.cashOutflows,
    cashOnHand: m.closingCash,
    retainedCash: m.netCashFlow,
    retainedEarnings: m.cumulativeRetained,
    activeStudents: m.activeStudents,
    mentorCost: m.monthlyMentorCost,
  }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 20 }}>
      {/* ── CHART 1: CASH FLOW (Cash In vs Cash Out with dual fills - like Image 2) ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          padding: "20px 22px",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>Cash Flow Dynamics</h3>
            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
              Gross cash inflows (student payments) vs total cash outflows (mentor payouts + OpEx)
            </p>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", background: "#ecfdf5", padding: "3px 9px", borderRadius: 20 }}>
            Cash Flow Positive
          </span>
        </div>

        <div style={{ height: 260, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cashInGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="cashOutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.02} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => formatCurrency(val, currency, true)} />
              <Tooltip content={<CustomChartTooltip currency={currency} />} />
              <Area type="monotone" dataKey="cashIn" name="Cash In (Collections)" stroke="#10b981" strokeWidth={2.2} fillOpacity={1} fill="url(#cashInGrad)" />
              <Area type="monotone" dataKey="cashOut" name="Cash Out (Outflows)" stroke="#f43f5e" strokeWidth={2.2} fillOpacity={1} fill="url(#cashOutGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── CHART 2: CASH ON HAND (Ending cash reserve trajectory - like Image 2) ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          padding: "20px 22px",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>Cash on Hand (Runway)</h3>
            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
              Monthly cumulative liquidity and bank balance trajectory after all disbursements
            </p>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#0284c7", background: "#f0f9ff", padding: "3px 9px", borderRadius: 20 }}>
            Liquidity Growth
          </span>
        </div>

        <div style={{ height: 260, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cashOnHandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => formatCurrency(val, currency, true)} />
              <Tooltip content={<CustomChartTooltip currency={currency} />} />
              <Area type="monotone" dataKey="cashOnHand" name="Cash Balance" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#cashOnHandGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── CHART 3: INCOME & EXPENSES (Revenue vs Expenses vs Net Income - like Image 2) ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          padding: "20px 22px",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>Income & Expenses</h3>
            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
              Total Mentorship Revenue, Operating Expenses, and Net Accounting Profit
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 700 }}>
            <span style={{ color: "#06b6d4" }}>● Revenue</span>
            <span style={{ color: "#f59e0b" }}>● Expense</span>
            <span style={{ color: "#10b981" }}>● Net Profit</span>
          </div>
        </div>

        <div style={{ height: 260, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="incomeExpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="incomeNetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => formatCurrency(val, currency, true)} />
              <Tooltip content={<CustomChartTooltip currency={currency} />} />
              <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#06b6d4" strokeWidth={2.2} fill="url(#incomeRevGrad)" />
              <Area type="monotone" dataKey="expenses" name="Total Expenses" stroke="#f59e0b" strokeWidth={2.2} fill="url(#incomeExpGrad)" />
              <Area type="monotone" dataKey="netIncome" name="Net Profit" stroke="#10b981" strokeWidth={2.2} fill="url(#incomeNetGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── CHART 4: RETAINED EARNINGS & RESERVES (like Image 2) ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          padding: "20px 22px",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>Retained Earnings & Reserves</h3>
            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
              Company capital retained in business for tech expansion & emergency reserve
            </p>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#854d0e", background: "#fef9c3", padding: "3px 9px", borderRadius: 20 }}>
            Reinvestment Pool
          </span>
        </div>

        <div style={{ height: 260, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="retainedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ca8a04" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => formatCurrency(val, currency, true)} />
              <Tooltip content={<CustomChartTooltip currency={currency} />} />
              <Area type="monotone" dataKey="retainedEarnings" name="Retained Capital" stroke="#ca8a04" strokeWidth={2.4} fillOpacity={1} fill="url(#retainedGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

