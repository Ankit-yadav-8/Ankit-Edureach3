import React, { useState } from "react";
import { Users, Award, ShieldCheck, Plus, Trash2, Edit2, CheckCircle2, ChevronDown, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../../utils/financialEngine";

const ACCENT = "#FF693D";

const DEPARTMENT_COLORS = {
  "Executive Management": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", badge: "#2563eb" },
  "Business & Marketing": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", badge: "#3b82f6" },
  "Academic & Mentorship": { bg: "#ecfdf5", text: "#047857", border: "#a7f3d0", badge: "#10b981" },
  "Technology & Product": { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe", badge: "#8b5cf6" },
  "Student Operations": { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", badge: "#f97316" },
};

const PIE_COLORS = ["#FF693D", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];

export default function OrgChartTree({ team = [], onUpdateTeam, currency = "INR" }) {
  const [selectedDept, setSelectedDept] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form states for adding/editing member
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("Academic & Mentorship");
  const [ownershipPct, setOwnershipPct] = useState(5);
  const [monthlySalary, setMonthlySalary] = useState(30000);
  const [profitSharingPct, setProfitSharingPct] = useState(5);
  const [responsibilities, setResponsibilities] = useState("");

  const totalEquity = team.reduce((acc, m) => acc + (Number(m.ownershipPct) || 0), 0);
  const totalSalaries = team.reduce((acc, m) => acc + (Number(m.monthlySalary) || 0), 0);

  const openAddModal = () => {
    setEditingMember(null);
    setName("");
    setPosition("");
    setDepartment("Academic & Mentorship");
    setOwnershipPct(5);
    setMonthlySalary(30000);
    setProfitSharingPct(5);
    setResponsibilities("");
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setName(member.name);
    setPosition(member.position);
    setDepartment(member.department);
    setOwnershipPct(member.ownershipPct);
    setMonthlySalary(member.monthlySalary);
    setProfitSharingPct(member.profitSharingPct);
    setResponsibilities(member.responsibilities || "");
    setModalOpen(true);
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingMember) {
      const updated = team.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name,
              position,
              department,
              ownershipPct: Number(ownershipPct),
              monthlySalary: Number(monthlySalary),
              profitSharingPct: Number(profitSharingPct),
              responsibilities,
            }
          : m
      );
      onUpdateTeam(updated);
    } else {
      const newMember = {
        id: `tm_${Date.now()}`,
        name,
        position,
        department,
        ownershipPct: Number(ownershipPct),
        monthlySalary: Number(monthlySalary),
        profitSharingPct: Number(profitSharingPct),
        bonusIncentive: 2000,
        responsibilities,
        joiningDate: new Date().toISOString().split("T")[0],
        status: "active",
        avatarInitials: name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      };
      onUpdateTeam([...team, newMember]);
    }
    setModalOpen(false);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm("Remove this team member from organization?")) {
      onUpdateTeam(team.filter((m) => m.id !== id));
    }
  };

  // Group team members by department hierarchy
  const founder = team.find((m) => m.position.toLowerCase().includes("founder") || m.position.toLowerCase().includes("ceo")) || team[0];
  const departments = [
    "Business & Marketing",
    "Academic & Mentorship",
    "Technology & Product",
    "Student Operations",
  ];

  const filteredTeam = selectedDept === "all" ? team : team.filter((m) => m.department === selectedDept);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── TOP HEADER MATCHING IMAGE 1 ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#fff7ed",
              color: ACCENT,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Campus Point Organization & Team Chart
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "3px 0 0" }}>
              Visual hierarchy, equity stakes, monthly operational salaries & profit distributions
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              transition: "all .15s ease",
            }}
          >
            <Plus size={16} /> Add Team Member
          </button>
        </div>
      </div>

      {/* ── EQUITY PIE & KEY STATS ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {/* Equity Total Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>TOTAL EQUITY ALLOCATED</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: totalEquity === 100 ? "#10b981" : "#f59e0b", marginTop: 4 }}>
              {totalEquity.toFixed(1)}%
            </div>
            <div style={{ fontSize: 11, color: totalEquity === 100 ? "#10b981" : "#ef4444", marginTop: 2 }}>
              {totalEquity === 100 ? "✓ 100% Fully Distributed" : `⚠ Equity mismatch (${(100 - totalEquity).toFixed(1)}% unallocated)`}
            </div>
          </div>
          <div style={{ width: 80, height: 80 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={team} dataKey="ownershipPct" nameKey="name" cx="50%" cy="50%" innerRadius={22} outerRadius={38}>
                  {team.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Payroll */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "18px 20px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>MONTHLY CORE TEAM SALARIES</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>
            {formatCurrency(totalSalaries, currency)}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            Accounted in OpEx (Separate from equity & profit share)
          </div>
        </div>

        {/* Active Headcount */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "18px 20px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>TOTAL CORE HEADCOUNT</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>
            {team.length} Members
          </div>
          <div style={{ fontSize: 11, color: "#10b981", marginTop: 2 }}>
            Across 4 Operating Pillars
          </div>
        </div>
      </div>

      {/* ── VISUAL ORGANIZATION HIERARCHY TREE (EXACTLY LIKE IMAGE 1) ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          padding: "36px 24px",
          overflowX: "auto",
          boxShadow: "0 2px 10px rgba(15, 23, 42, 0.03)",
        }}
      >
        <div style={{ minWidth: 920, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* LEVEL 1: FOUNDER & CEO ROOT CARD */}
          {founder && (
            <div
              style={{
                width: 280,
                background: "#ffffff",
                borderRadius: 16,
                border: "2px solid #FF693D",
                padding: "16px 18px",
                boxShadow: "0 10px 25px -5px rgba(255, 105, 61, 0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#fff7ed",
                  color: ACCENT,
                  border: "2px solid #FF693D",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  fontSize: 18,
                  marginBottom: 8,
                }}
              >
                {founder.avatarInitials || "AY"}
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{founder.name}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{founder.position}</div>

              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, background: "#ecfdf5", color: "#047857", padding: "2px 8px", borderRadius: 20 }}>
                  Equity: {founder.ownershipPct}%
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, background: "#f8fafc", color: "#475569", padding: "2px 8px", borderRadius: 20 }}>
                  Salary: {formatCurrency(founder.monthlySalary, currency, true)}/mo
                </span>
              </div>
            </div>
          )}

          {/* VERTICAL CONNECTOR FROM FOUNDER */}
          <div style={{ width: 2, height: 32, background: "#cbd5e1" }} />

          {/* HORIZONTAL CONNECTOR SPREAD */}
          <div style={{ width: "88%", height: 2, background: "#cbd5e1", position: "relative" }} />

          {/* LEVEL 2: FOUR DEPARTMENT COLUMNS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, width: "100%", marginTop: 0 }}>
            {departments.map((deptName) => {
              const color = DEPARTMENT_COLORS[deptName] || DEPARTMENT_COLORS["Business & Marketing"];
              const deptMembers = team.filter((m) => m.department === deptName && m.id !== founder?.id);

              return (
                <div key={deptName} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {/* Stem line down to department badge */}
                  <div style={{ width: 2, height: 24, background: "#cbd5e1" }} />

                  {/* Department Banner Pill (Like Image 1 blue/green/indigo/orange banners) */}
                  <div
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: color.badge,
                      color: "#ffffff",
                      fontSize: 12.5,
                      fontWeight: 800,
                      textAlign: "center",
                      letterSpacing: "0.01em",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    {deptName}
                  </div>

                  {/* Stem line down to member cards */}
                  <div style={{ width: 2, height: 20, background: "#cbd5e1" }} />

                  {/* Member Cards in this Department */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
                    {deptMembers.length > 0 ? (
                      deptMembers.map((member) => (
                        <div
                          key={member.id}
                          style={{
                            background: "#ffffff",
                            borderRadius: 12,
                            border: `1px solid ${color.border}`,
                            padding: "14px",
                            boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              background: color.bg,
                              color: color.text,
                              display: "grid",
                              placeItems: "center",
                              fontWeight: 800,
                              fontSize: 13,
                              flexShrink: 0,
                              border: `1px solid ${color.border}`,
                            }}
                          >
                            {member.avatarInitials || member.name.slice(0, 2).toUpperCase()}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>{member.name}</span>
                              <div style={{ display: "flex", gap: 4 }}>
                                <button
                                  onClick={() => openEditModal(member)}
                                  style={{ border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer", padding: 2 }}
                                  title="Edit details"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(member.id)}
                                  style={{ border: "none", background: "transparent", color: "#f43f5e", cursor: "pointer", padding: 2 }}
                                  title="Remove member"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{member.position}</div>

                            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 10, fontWeight: 800, background: "#ecfdf5", color: "#047857", padding: "2px 6px", borderRadius: 6 }}>
                                Equity: {member.ownershipPct}%
                              </span>
                              <span style={{ fontSize: 10, fontWeight: 700, background: "#f1f5f9", color: "#475569", padding: "2px 6px", borderRadius: 6 }}>
                                {formatCurrency(member.monthlySalary, currency, true)}/mo
                              </span>
                              <span style={{ fontSize: 10, fontWeight: 700, background: "#fef3c7", color: "#92400e", padding: "2px 6px", borderRadius: 6 }}>
                                Profit: {member.profitSharingPct}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: 10,
                          border: "1px dashed #cbd5e1",
                          padding: "16px",
                          textAlign: "center",
                          fontSize: 12,
                          color: "#94a3b8",
                        }}
                      >
                        No additional roles
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MODAL: ADD / EDIT TEAM MEMBER ── */}
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
              maxWidth: 480,
              background: "#ffffff",
              borderRadius: 18,
              padding: "24px",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
            }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>
              {editingMember ? "Edit Team Member" : "Add Team Member to Org Chart"}
            </h3>

            <form onSubmit={handleSaveMember} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cameron Williamson"
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Position / Role</label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Head of Growth Marketing"
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="Executive Management">Executive Management</option>
                  <option value="Business & Marketing">Business & Marketing</option>
                  <option value="Academic & Mentorship">Academic & Mentorship</option>
                  <option value="Technology & Product">Technology & Product</option>
                  <option value="Student Operations">Student Operations</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Ownership Equity (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={ownershipPct}
                    onChange={(e) => setOwnershipPct(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Monthly Salary (₹)</label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Profit Sharing Pool Share (%)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  value={profitSharingPct}
                  onChange={(e) => setProfitSharingPct(e.target.value)}
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Responsibilities</label>
                <textarea
                  rows={2}
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="Primary core deliverables & OKRs"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

