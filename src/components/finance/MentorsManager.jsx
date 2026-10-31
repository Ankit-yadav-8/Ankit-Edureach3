import React, { useState } from "react";
import { Users, DollarSign, Award, Plus, Trash2, Edit2, AlertTriangle, TrendingUp, CheckCircle, Percent } from "lucide-react";
import { formatCurrency } from "../../utils/financialEngine";

const ACCENT = "#FF693D";

export default function MentorsManager({ mentors = [], onUpdateMentors, simulation, currency = "INR" }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [college, setCollege] = useState("IIT Roorkee");
  const [role, setRole] = useState("Physics & JEE Advanced Mentor");
  const [department, setDepartment] = useState("Academic & JEE Mentorship");
  const [paymentModel, setPaymentModel] = useState("revenue_share");
  const [commissionPct, setCommissionPct] = useState(40);
  const [fixedCompensation, setFixedCompensation] = useState(15000);
  const [ratePerStudent, setRatePerStudent] = useState(600);
  const [ratePerSession, setRatePerSession] = useState(350);
  const [monthlyCapacity, setMonthlyCapacity] = useState(40);
  const [rating, setRating] = useState(4.8);

  const totalCapacity = mentors.reduce((acc, m) => (m.active ? acc + Number(m.monthlyCapacity || 0) : acc), 0);
  const activeStudentsThisMonth = simulation?.monthlyResults?.[simulation.monthlyResults.length - 1]?.activeStudents || 0;
  const utilizationPct = totalCapacity > 0 ? Math.round((activeStudentsThisMonth / totalCapacity) * 100) : 100;
  const remainingCapacity = Math.max(0, totalCapacity - activeStudentsThisMonth);

  const openAddModal = () => {
    setEditingMentor(null);
    setName("");
    setCollege("IIT Roorkee");
    setRole("Physics & JEE Advanced Mentor");
    setDepartment("Academic & JEE Mentorship");
    setPaymentModel("revenue_share");
    setCommissionPct(40);
    setFixedCompensation(15000);
    setRatePerStudent(600);
    setRatePerSession(350);
    setMonthlyCapacity(40);
    setRating(4.8);
    setModalOpen(true);
  };

  const openEditModal = (m) => {
    setEditingMentor(m);
    setName(m.name);
    setCollege(m.college || "IIT Roorkee");
    setRole(m.role || "Mentor");
    setDepartment(m.department || "Academic & JEE Mentorship");
    setPaymentModel(m.paymentModel || "revenue_share");
    setCommissionPct(m.commissionPct || 40);
    setFixedCompensation(m.fixedCompensation || 0);
    setRatePerStudent(m.ratePerStudent || 600);
    setRatePerSession(m.ratePerSession || 350);
    setMonthlyCapacity(m.monthlyCapacity || 40);
    setRating(m.rating || 4.8);
    setModalOpen(true);
  };

  const handleSaveMentor = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingMentor) {
      const updated = mentors.map((m) =>
        m.id === editingMentor.id
          ? {
              ...m,
              name,
              college,
              role,
              department,
              paymentModel,
              commissionPct: Number(commissionPct),
              fixedCompensation: Number(fixedCompensation),
              ratePerStudent: Number(ratePerStudent),
              ratePerSession: Number(ratePerSession),
              monthlyCapacity: Number(monthlyCapacity),
              rating: Number(rating),
            }
          : m
      );
      onUpdateMentors(updated);
    } else {
      const newMentor = {
        id: `m_${Date.now()}`,
        name,
        college,
        role,
        department,
        paymentModel,
        commissionPct: Number(commissionPct),
        fixedCompensation: Number(fixedCompensation),
        ratePerStudent: Number(ratePerStudent),
        ratePerSession: Number(ratePerSession),
        monthlyCapacity: Number(monthlyCapacity),
        rating: Number(rating),
        active: true,
      };
      onUpdateMentors([...mentors, newMentor]);
    }
    setModalOpen(false);
  };

  const handleDeleteMentor = (id) => {
    if (window.confirm("Remove this mentor from the active roster?")) {
      onUpdateMentors(mentors.filter((m) => m.id !== id));
    }
  };

  const toggleActive = (id) => {
    onUpdateMentors(mentors.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  };

  const aggregates = simulation?.aggregates || {};
  const mentorShare = aggregates.mentorSharePct || 40;
  const companyShare = aggregates.campusPointRetainedSharePct || 60;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── TOP STATS: WHAT WE PAY MENTORS VS WHAT WE KEEP ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {/* Mentor Share */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>TOTAL MENTOR PAYOUTS (ANNUAL)</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#f43f5e", marginTop: 4 }}>
            {formatCurrency(aggregates.annualMentorCost || 0, currency)}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#f43f5e", marginTop: 4 }}>
            {mentorShare}% of Total Mentorship Revenue
          </div>
        </div>

        {/* Campus Point Retention */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1.5px solid rgba(255,105,61,0.3)",
            padding: "20px",
            boxShadow: "0 4px 14px rgba(255,105,61,0.08)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>WHAT CAMPUS POINT RETAINS (GROSS)</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: ACCENT, marginTop: 4 }}>
            {formatCurrency(aggregates.annualGrossProfit || 0, currency)}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginTop: 4 }}>
            {companyShare}% Kept by Campus Point
          </div>
        </div>

        {/* Cost Per Student */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>AVERAGE MENTOR COST / STUDENT</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>
            {formatCurrency(aggregates.averageCostPerStudent || 0, currency)}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Direct variable delivery cost per mentee
          </div>
        </div>

        {/* Capacity & Utilization */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>MENTOR CAPACITY & UTILIZATION</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: utilizationPct > 85 ? "#f59e0b" : "#10b981", marginTop: 4 }}>
            {utilizationPct}% Utilized
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            {remainingCapacity} student slots remaining ({totalCapacity} total cap)
          </div>
        </div>
      </div>

      {/* ── CAPACITY ALERT ── */}
      {utilizationPct > 85 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 12,
            padding: "14px 18px",
            color: "#92400e",
            fontSize: 13,
          }}
        >
          <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0 }} />
          <div>
            <strong>High Mentor Capacity Alert:</strong> You are currently at {utilizationPct}% utilization. To maintain high mentorship quality for Indian & international students, hire 2-3 additional mentors before peak JEE/NEET season.
          </div>
        </div>
      )}

      {/* ── MENTOR ROSTER TABLE ── */}
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
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>Active Mentor Roster & Compensation</h3>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: "3px 0 0" }}>
              Configure individual payment models: Fixed retainer, Per student, Per session, Revenue share or Hybrid
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
            <Plus size={16} /> Add Mentor
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>
                <th style={{ padding: "12px 14px" }}>Mentor & College</th>
                <th style={{ padding: "12px 14px" }}>Department / Subject</th>
                <th style={{ padding: "12px 14px" }}>Compensation Model</th>
                <th style={{ padding: "12px 14px" }}>Monthly Capacity</th>
                <th style={{ padding: "12px 14px" }}>Rate / Terms</th>
                <th style={{ padding: "12px 14px" }}>Rating</th>
                <th style={{ padding: "12px 14px" }}>Status</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid #f8fafc", transition: "background .15s ease" }}>
                  <td style={{ padding: "14px" }}>
                    <div style={{ fontWeight: 800, color: "#0f172a" }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: ACCENT, fontWeight: 700 }}>{m.college}</div>
                  </td>
                  <td style={{ padding: "14px" }}>
                    <div style={{ color: "#334155", fontWeight: 600 }}>{m.role}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{m.department}</div>
                  </td>
                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: 20,
                        background:
                          m.paymentModel === "revenue_share"
                            ? "#ecfdf5"
                            : m.paymentModel === "hybrid"
                            ? "#fff7ed"
                            : m.paymentModel === "fixed"
                            ? "#eff6ff"
                            : "#f5f3ff",
                        color:
                          m.paymentModel === "revenue_share"
                            ? "#047857"
                            : m.paymentModel === "hybrid"
                            ? "#c2410c"
                            : m.paymentModel === "fixed"
                            ? "#1d4ed8"
                            : "#6d28d9",
                        textTransform: "capitalize",
                      }}
                    >
                      {m.paymentModel.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#0f172a" }}>
                    {m.monthlyCapacity} students/mo
                  </td>
                  <td style={{ padding: "14px", fontSize: 12, color: "#334155" }}>
                    {m.paymentModel === "revenue_share" && <strong>{m.commissionPct}% of package</strong>}
                    {m.paymentModel === "fixed" && <strong>{formatCurrency(m.fixedCompensation, currency, true)}/mo</strong>}
                    {m.paymentModel === "per_student" && <strong>{formatCurrency(m.ratePerStudent, currency, true)}/student</strong>}
                    {m.paymentModel === "per_session" && <strong>{formatCurrency(m.ratePerSession, currency, true)}/session</strong>}
                    {m.paymentModel === "hybrid" && (
                      <span>
                        <strong>{formatCurrency(m.fixedCompensation, currency, true)}</strong> + <strong>{m.commissionPct}%</strong>
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px" }}>
                    <span style={{ fontWeight: 800, color: "#d97706" }}>★ {m.rating}</span>
                  </td>
                  <td style={{ padding: "14px" }}>
                    <button
                      onClick={() => toggleActive(m.id)}
                      style={{
                        border: "none",
                        background: m.active ? "#ecfdf5" : "#f1f5f9",
                        color: m.active ? "#047857" : "#94a3b8",
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      {m.active ? "Active" : "Paused"}
                    </button>
                  </td>
                  <td style={{ padding: "14px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button
                        onClick={() => openEditModal(m)}
                        style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", padding: 4 }}
                        title="Edit mentor"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteMentor(m.id)}
                        style={{ border: "none", background: "transparent", color: "#f43f5e", cursor: "pointer", padding: 4 }}
                        title="Delete mentor"
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

      {/* ── MODAL: ADD / EDIT MENTOR ── */}
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
              {editingMentor ? "Edit Mentor Compensation & Role" : "Add New Mentor to Roster"}
            </h3>

            <form onSubmit={handleSaveMentor} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Mentor Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>College / Background</label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIT Roorkee"
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Role & Subject Specialization</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Organic Chemistry & Backlog Specialist"
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Payment Compensation Model</label>
                <select
                  value={paymentModel}
                  onChange={(e) => setPaymentModel(e.target.value)}
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="revenue_share">Percentage Revenue Share (% of student package)</option>
                  <option value="per_student">Payment Per Assigned Student (₹ / student / mo)</option>
                  <option value="per_session">Payment Per Mentorship Session (₹ / session)</option>
                  <option value="fixed">Fixed Monthly Compensation (₹ flat retainer)</option>
                  <option value="hybrid">Hybrid (Fixed Base + % Revenue Share Commission)</option>
                </select>
              </div>

              {/* Dynamic inputs based on compensation model */}
              {(paymentModel === "revenue_share" || paymentModel === "hybrid") && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Commission Percentage (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="80"
                    value={commissionPct}
                    onChange={(e) => setCommissionPct(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              )}

              {(paymentModel === "fixed" || paymentModel === "hybrid") && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Fixed Base Salary (₹/mo)</label>
                  <input
                    type="number"
                    step="1000"
                    value={fixedCompensation}
                    onChange={(e) => setFixedCompensation(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              )}

              {paymentModel === "per_student" && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Rate Per Student (₹/mo)</label>
                  <input
                    type="number"
                    step="50"
                    value={ratePerStudent}
                    onChange={(e) => setRatePerStudent(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              )}

              {paymentModel === "per_session" && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Rate Per Session (₹/session)</label>
                  <input
                    type="number"
                    step="50"
                    value={ratePerSession}
                    onChange={(e) => setRatePerSession(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Monthly Student Capacity</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={monthlyCapacity}
                    onChange={(e) => setMonthlyCapacity(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Performance Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
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
                  Save Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

