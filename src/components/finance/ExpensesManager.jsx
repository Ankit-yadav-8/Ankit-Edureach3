import React, { useState } from "react";
import { Server, Megaphone, Wrench, Plus, Trash2, Edit2, DollarSign, Layers } from "lucide-react";
import { formatCurrency } from "../../utils/financialEngine";

const ACCENT = "#FF693D";

const CATEGORY_ICONS = {
  Technology: Server,
  Marketing: Megaphone,
  Operations: Wrench,
};

export default function ExpensesManager({ expenses = [], onUpdateExpenses, currency = "INR" }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Technology");
  const [monthlyCost, setMonthlyCost] = useState(3000);
  const [recurring, setRecurring] = useState(true);
  const [department, setDepartment] = useState("Technology & Product");

  const totalMonthlyOpEx = expenses
    .filter((e) => e.recurring)
    .reduce((acc, e) => acc + (Number(e.monthlyCost) || 0), 0);

  const techTotal = expenses
    .filter((e) => e.category === "Technology" && e.recurring)
    .reduce((acc, e) => acc + (Number(e.monthlyCost) || 0), 0);

  const mktTotal = expenses
    .filter((e) => e.category === "Marketing" && e.recurring)
    .reduce((acc, e) => acc + (Number(e.monthlyCost) || 0), 0);

  const opsTotal = expenses
    .filter((e) => e.category === "Operations" && e.recurring)
    .reduce((acc, e) => acc + (Number(e.monthlyCost) || 0), 0);

  const openAddModal = () => {
    setEditingExpense(null);
    setName("");
    setCategory("Technology");
    setMonthlyCost(3000);
    setRecurring(true);
    setDepartment("Technology & Product");
    setModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExpense(exp);
    setName(exp.name);
    setCategory(exp.category);
    setMonthlyCost(exp.monthlyCost);
    setRecurring(exp.recurring);
    setDepartment(exp.department || "Technology & Product");
    setModalOpen(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingExpense) {
      const updated = expenses.map((exp) =>
        exp.id === editingExpense.id
          ? {
              ...exp,
              name,
              category,
              monthlyCost: Number(monthlyCost),
              recurring: Boolean(recurring),
              department,
            }
          : exp
      );
      onUpdateExpenses(updated);
    } else {
      const newExp = {
        id: `exp_${Date.now()}`,
        name,
        category,
        monthlyCost: Number(monthlyCost),
        recurring: Boolean(recurring),
        department,
      };
      onUpdateExpenses([...expenses, newExp]);
    }
    setModalOpen(false);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm("Remove this operational expense line item?")) {
      onUpdateExpenses(expenses.filter((e) => e.id !== id));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── EXPENSE TOTALS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>TOTAL MONTHLY OPEX (EXCL. SALARIES)</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>
            {formatCurrency(totalMonthlyOpEx, currency)}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            {formatCurrency(totalMonthlyOpEx * 12, currency)} annual run-rate
          </div>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0284c7" }}>TECHNOLOGY & CLOUD INFRA</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#0284c7", marginTop: 4 }}>
            {formatCurrency(techTotal, currency)}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Hosting, Supabase, Video rooms & Sentry
          </div>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>MARKETING & ACQUISITION</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: ACCENT, marginTop: 4 }}>
            {formatCurrency(mktTotal, currency)}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Meta ads, YouTube content & IIT influencers
          </div>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#047857" }}>OPERATIONS & TOOLS</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#047857", marginTop: 4 }}>
            {formatCurrency(opsTotal, currency)}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Counselling, Notion, Slack & Compliance
          </div>
        </div>
      </div>

      {/* ── EXPENSES LIST ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 18,
          border: "1px solid #e2e8f0",
          padding: "22px 24px",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Operational Expense Management (OpEx)
            </h3>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: "3px 0 0" }}>
              Every server, marketing campaign, and support cost is editable and dynamically factored into monthly net margins
            </p>
          </div>
          <button
            onClick={openAddModal}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              borderRadius: 10,
              background: ACCENT,
              color: "#ffffff",
              border: "none",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(255,105,61,0.25)",
            }}
          >
            <Plus size={16} /> Add Expense
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>
                <th style={{ padding: "12px 14px" }}>Expense Item</th>
                <th style={{ padding: "12px 14px" }}>Category</th>
                <th style={{ padding: "12px 14px" }}>Department</th>
                <th style={{ padding: "12px 14px" }}>Monthly Cost</th>
                <th style={{ padding: "12px 14px" }}>Annual Cost</th>
                <th style={{ padding: "12px 14px" }}>Cadence</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "14px", fontWeight: 800, color: "#0f172a" }}>
                    {exp.name}
                  </td>
                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: 20,
                        background:
                          exp.category === "Technology"
                            ? "#f0f9ff"
                            : exp.category === "Marketing"
                            ? "#fff7ed"
                            : "#ecfdf5",
                        color:
                          exp.category === "Technology"
                            ? "#0284c7"
                            : exp.category === "Marketing"
                            ? ACCENT
                            : "#047857",
                      }}
                    >
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ padding: "14px", color: "#475569", fontSize: 12 }}>
                    {exp.department}
                  </td>
                  <td style={{ padding: "14px", fontWeight: 800, color: "#0f172a", fontSize: 14 }}>
                    {formatCurrency(exp.monthlyCost, currency)}
                  </td>
                  <td style={{ padding: "14px", color: "#64748b" }}>
                    {formatCurrency(exp.monthlyCost * 12, currency)}
                  </td>
                  <td style={{ padding: "14px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: exp.recurring ? "#10b981" : "#94a3b8" }}>
                      {exp.recurring ? "Recurring" : "One-Time"}
                    </span>
                  </td>
                  <td style={{ padding: "14px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button
                        onClick={() => openEditModal(exp)}
                        style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", padding: 4 }}
                        title="Edit expense"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        style={{ border: "none", background: "transparent", color: "#f43f5e", cursor: "pointer", padding: 4 }}
                        title="Delete expense"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: ADD / EDIT EXPENSE ── */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 2000,
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#ffffff",
              borderRadius: 18,
              padding: "24px",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
            }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>
              {editingExpense ? "Edit Expense Line Item" : "Add Operational Expense"}
            </h3>

            <form onSubmit={handleSaveExpense} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Expense Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AWS Cloud Server Clusters"
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Monthly Cost (₹)</label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    required
                    value={monthlyCost}
                    onChange={(e) => setMonthlyCost(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="Technology & Product">Technology & Product</option>
                  <option value="Business & Marketing">Business & Marketing</option>
                  <option value="Student Operations">Student Operations</option>
                  <option value="Executive Management">Executive Management</option>
                  <option value="Academic & Mentorship">Academic & Mentorship</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="recurringCheck"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: ACCENT }}
                />
                <label htmlFor="recurringCheck" style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>
                  Recurring monthly expense
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer", fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

