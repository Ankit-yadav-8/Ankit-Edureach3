import { useState, useMemo } from "react";
import {
  Users, UserCheck, Calendar, Clock, Search, ChevronDown, ChevronRight,
  CheckCircle2, AlertTriangle, CheckSquare, Layers, Tag, Edit2, Check,
  Mail, Phone, ExternalLink, GraduationCap, X, RefreshCw
} from "lucide-react";

const ORANGE = "#FF693D";

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

/* ══════════════════════════════════════════════════════════════════
   1. TASKS COMPLETED & STUDENT BREAKDOWN SECTION
   Shows how many tasks are completed given by mentor and by which student
══════════════════════════════════════════════════════════════════ */
export function TaskCompletedSection({
  studentsWithTasks = [],
  mentors = [],
  mentorFilter,
  setMentorFilter,
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
  expanded,
  onToggleExpand,
}) {
  const filtered = useMemo(() => {
    let list = [...studentsWithTasks];
    if (mentorFilter !== "all") {
      list = list.filter((s) => s.mentorId === mentorFilter);
    }
    if (statusFilter === "completed") {
      list = list.filter((s) => s.tasksAssigned > 0 && s.tasksCompleted === s.tasksAssigned);
    } else if (statusFilter === "pending") {
      list = list.filter((s) => s.tasksAssigned > s.tasksCompleted);
    }
    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter((s) =>
        s.studentName?.toLowerCase().includes(q) ||
        s.studentId?.toLowerCase().includes(q) ||
        s.mentorName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [studentsWithTasks, mentorFilter, statusFilter, search]);

  const totalAssigned = useMemo(() => filtered.reduce((s, x) => s + (x.tasksAssigned || 0), 0), [filtered]);
  const totalCompleted = useMemo(() => filtered.reduce((s, x) => s + (x.tasksCompleted || 0), 0), [filtered]);
  const avgRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;
  const fullyCompletedCount = useMemo(() => filtered.filter((s) => s.tasksAssigned > 0 && s.tasksCompleted === s.tasksAssigned).length, [filtered]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: 12 }}>
        <div style={{ background: "#ffffff", borderRadius: 12, padding: "14px 18px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(15,23,42,.02)" }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Tasks Given by Mentors</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginTop: 2, fontFamily: "Sora, sans-serif" }}>
            {totalAssigned}
          </div>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 12, padding: "14px 18px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(15,23,42,.02)" }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Tasks Completed</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#16a34a", marginTop: 2, fontFamily: "Sora, sans-serif" }}>
            {totalCompleted}
            <span style={{ fontSize: 12, color: "#64748b", marginLeft: 6, fontWeight: 500 }}>
              ({avgRate}%)
            </span>
          </div>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 12, padding: "14px 18px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(15,23,42,.02)" }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Mentees With 100% Tasks</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#2563eb", marginTop: 2, fontFamily: "Sora, sans-serif" }}>
            {fullyCompletedCount}
            <span style={{ fontSize: 12, color: "#64748b", marginLeft: 6, fontWeight: 500 }}>
              / {filtered.length} students
            </span>
          </div>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 12, padding: "14px 18px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(15,23,42,.02)" }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Pending Tasks Backlog</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: totalAssigned - totalCompleted > 0 ? "#ea580c" : "#16a34a", marginTop: 2, fontFamily: "Sora, sans-serif" }}>
            {Math.max(0, totalAssigned - totalCompleted)}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #f0e9e0", overflow: "hidden", boxShadow: "0 2px 10px rgba(15,23,42,0.03)" }}>
        {/* Controls Bar */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
              Task Completion Breakdown by Student &amp; Mentor
            </h3>
            <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0" }}>
              Exact count of tasks given by each mentor and completed by each individual mentee
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student or mentor..."
                style={{
                  height: 32, paddingLeft: 28, paddingRight: 10, borderRadius: 8,
                  border: "1px solid #cbd5e1", fontSize: 12, outline: "none", width: 190,
                }}
              />
            </div>

            {/* Mentor Filter */}
            <select
              value={mentorFilter}
              onChange={(e) => setMentorFilter(e.target.value)}
              style={{
                height: 32, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1",
                fontSize: 12, color: "#334155", background: "#fff", outline: "none", cursor: "pointer",
              }}
            >
              <option value="all">All Mentors ({mentors.length})</option>
              {mentors.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                height: 32, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1",
                fontSize: 12, color: "#334155", background: "#fff", outline: "none", cursor: "pointer",
              }}
            >
              <option value="all">All Statuses</option>
              <option value="completed">All Completed (100%)</option>
              <option value="pending">Pending Tasks Backlog</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "50px 20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
            No students found matching your filters.
          </div>
        ) : (
          <div className="cp-custom-scroll" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 950, borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                  <th style={{ padding: "10px 14px", width: 36, textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>#</th>
                  <th style={{ padding: "10px 6px", width: 24 }}></th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Student Name</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Assigned Mentor</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Tasks Status</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Completion Progress</th>
                  <th style={{ padding: "10px 14px", textAlign: "right", fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((st, i) => {
                  const isOpen = expanded.has(st.studentId);
                  const is100 = st.tasksAssigned > 0 && st.tasksCompleted === st.tasksAssigned;

                  return (
                    <tr key={st.studentId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td colSpan={7} style={{ padding: 0 }}>
                        <div
                          onClick={() => onToggleExpand(st.studentId)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 14px",
                            cursor: "pointer",
                            background: isOpen ? "#f8fafc" : "#ffffff",
                            transition: "background .12s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = isOpen ? "#f8fafc" : "#ffffff"; }}
                        >
                          <div style={{ width: 36, fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{i + 1}</div>
                          <div style={{ width: 24, color: "#94a3b8" }}>
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </div>

                          {/* Student */}
                          <div style={{ flex: 1.2, minWidth: 160 }}>
                            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 12.5 }}>
                              {st.studentName}
                            </div>
                            <div style={{ fontSize: 10.5, fontFamily: "monospace", color: "#64748b" }}>
                              {st.studentId} {st.studentEmail && `• ${st.studentEmail}`}
                            </div>
                          </div>

                          {/* Mentor */}
                          <div style={{ flex: 1, minWidth: 140 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: st.mentorColor || ORANGE }} />
                              <span style={{ fontWeight: 600, color: "#0f172a" }}>{st.mentorName}</span>
                            </div>
                            <div style={{ fontSize: 10.5, color: "#64748b", paddingLeft: 14 }}>
                              {st.mentorCollege || "Mentor"}
                            </div>
                          </div>

                          {/* Task Count Status */}
                          <div style={{ flex: 1, minWidth: 120 }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 6,
                              background: is100 ? "#f0fdf4" : st.tasksCompleted > 0 ? "#eff6ff" : "#fef2f2",
                              color: is100 ? "#16a34a" : st.tasksCompleted > 0 ? "#2563eb" : "#dc2626",
                            }}>
                              {is100 ? <CheckCircle2 size={11} /> : null}
                              {st.tasksCompleted} / {st.tasksAssigned} Completed
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div style={{ flex: 1.2, minWidth: 140, display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                              <div style={{
                                width: `${st.completionRate}%`,
                                height: "100%",
                                background: is100 ? "#16a34a" : ORANGE,
                                borderRadius: 4,
                                transition: "width .3s ease",
                              }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", minWidth: 32 }}>
                              {st.completionRate}%
                            </span>
                          </div>

                          {/* Action */}
                          <div style={{ width: 80, textAlign: "right" }}>
                            <span style={{ fontSize: 11, color: ORANGE, fontWeight: 700 }}>
                              {isOpen ? "Hide tasks" : "View tasks"}
                            </span>
                          </div>
                        </div>

                        {/* Expandable Task Items */}
                        {isOpen && (
                          <div style={{ padding: "8px 14px 14px 74px", background: "#f8fafc", borderTop: "1px dashed #e2e8f0" }}>
                            <div style={{ fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                              Tasks Given by Mentor {st.mentorName} ({st.tasks?.length || 0}):
                            </div>
                            {!st.tasks || st.tasks.length === 0 ? (
                              <div style={{ fontSize: 11.5, color: "#94a3b8" }}>No active tasks listed for this student.</div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                {st.tasks.map((t, tidx) => (
                                  <div
                                    key={t.id || tidx}
                                    style={{
                                      display: "flex", alignItems: "center", justifyContent: "space-between",
                                      padding: "6px 10px", borderRadius: 7,
                                      background: t.completed ? "#f0fdf4" : "#ffffff",
                                      border: `1px solid ${t.completed ? "#bbf7d0" : "#e2e8f0"}`,
                                      fontSize: 12,
                                    }}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      <span style={{
                                        width: 16, height: 16, borderRadius: "50%", display: "grid", placeItems: "center",
                                        background: t.completed ? "#16a34a" : "#cbd5e1", color: "#fff", fontSize: 9.5, fontWeight: 800,
                                      }}>
                                        {t.completed ? "✓" : (tidx + 1)}
                                      </span>
                                      <span style={{ color: t.completed ? "#166534" : "#0f172a", textDecoration: t.completed ? "line-through" : "none", fontWeight: 500 }}>
                                        {t.text}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: 10.5, color: t.completed ? "#15803d" : "#94a3b8" }}>
                                      {t.completed ? `Completed ${fmtDate(t.completedAt)}` : `Assigned ${fmtDate(t.createdAt)}`}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2. STUDENT GROUPS OVERVIEW SECTION (CAMPUS-POINT-X)
   Divides all students group-wise by common mentor, displays all things,
   and lets admin assign / rename student group tag.
══════════════════════════════════════════════════════════════════ */
export function StudentGroupsSection({
  groupsData,
  loading,
  onSaveGroupTag,
  onRefresh,
}) {
  const [editingSid, setEditingSid] = useState(null);
  const [editingTag, setEditingTag] = useState("");
  const [groupSearch, setGroupSearch] = useState("");

  const mentorGroups = groupsData?.mentorGroups || [];
  const unassigned = groupsData?.unassigned?.students || [];

  const handleSave = (sid) => {
    if (editingTag.trim()) {
      onSaveGroupTag(sid, editingTag.trim());
      setEditingSid(null);
      setEditingTag("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Overview Header */}
      <div style={{
        background: "#ffffff", borderRadius: 14, border: "1px solid #f0e9e0", padding: "16px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
            Student Cohort Groups by Mentor (Campus-Point-X)
          </h3>
          <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0" }}>
            All students grouped by common assigned mentor with customizable cohort tags and telemetry
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              placeholder="Search student in cohorts..."
              style={{ height: 32, paddingLeft: 28, paddingRight: 10, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12, outline: "none", width: 210 }}
            />
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid #e2e8f0",
              background: "#fff", cursor: loading ? "wait" : "pointer", fontSize: 11.5, fontWeight: 700,
              display: "inline-flex", alignItems: "center", gap: 5, color: "#475569",
            }}
          >
            <RefreshCw size={12} style={{ animation: loading ? "admSpin 1s linear infinite" : "none" }} /> Refresh
          </button>
        </div>
      </div>

      {loading && !groupsData ? (
        <div style={{ background: "#ffffff", borderRadius: 14, padding: "50px 20px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <RefreshCw size={20} style={{ animation: "admSpin 1s linear infinite", margin: "0 auto 10px" }} color={ORANGE} />
          <div style={{ fontSize: 12.5, color: "#64748b" }}>Loading cohort groups...</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mentorGroups.map((group, gIdx) => {
            const filteredStudents = groupSearch
              ? group.students.filter((s) =>
                  s.name.toLowerCase().includes(groupSearch.toLowerCase()) ||
                  s.studentId.toLowerCase().includes(groupSearch.toLowerCase()) ||
                  s.email.toLowerCase().includes(groupSearch.toLowerCase())
                )
              : group.students;

            return (
              <div
                key={group.mentorId || gIdx}
                style={{
                  background: "#ffffff", borderRadius: 14, border: "1.5px solid #e2e8f0",
                  overflow: "hidden", boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
                }}
              >
                {/* Cohort Header Strip */}
                <div style={{
                  padding: "12px 18px", borderBottom: "1px solid #f1f5f9",
                  background: "linear-gradient(to right, #fafafa, #ffffff)",
                  display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, background: `${ORANGE}15`,
                      color: ORANGE, fontWeight: 900, display: "grid", placeItems: "center", fontSize: 13,
                    }}>
                      G{gIdx + 1}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: 13.5, color: "#0f172a", fontFamily: "Sora, sans-serif" }}>
                          Mentor: {group.mentorName}
                        </span>
                        <span style={{
                          fontSize: 10.5, fontWeight: 800, color: "#2563eb", background: "#eff6ff",
                          border: "1px solid #dbeafe", padding: "1px 7px", borderRadius: 6,
                        }}>
                          {group.defaultGroupLabel}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>
                        {group.mentorCollege || "Campus Point"} • {group.mentorEmail} • {group.students.length} mentees enrolled
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "3px 8px", borderRadius: 6 }}>
                    Active Mentorship Group
                  </span>
                </div>

                {/* Students Table */}
                {filteredStudents.length === 0 ? (
                  <div style={{ padding: "24px 18px", color: "#94a3b8", fontSize: 12 }}>
                    {groupSearch ? "No students matching search in this group." : "No students assigned to this mentor yet."}
                  </div>
                ) : (
                  <div className="cp-custom-scroll" style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                          <th style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>#</th>
                          <th style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Student Name</th>
                          <th style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Contact Details</th>
                          <th style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Class / Target</th>
                          <th style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Cohort Group Tag</th>
                          <th style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Tasks Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((st, sIdx) => {
                          const isEditing = editingSid === st.studentId;
                          return (
                            <tr key={st.studentId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "9px 12px", color: "#94a3b8", fontFamily: "monospace", fontSize: 11 }}>{sIdx + 1}</td>
                              <td style={{ padding: "9px 12px" }}>
                                <div style={{ fontWeight: 700, color: "#0f172a" }}>{st.name}</div>
                                <span style={{ fontSize: 10, fontFamily: "monospace", color: "#64748b" }}>{st.studentId}</span>
                              </td>
                              <td style={{ padding: "9px 12px", color: "#475569" }}>
                                <div>{st.email}</div>
                                {st.phone && <div style={{ fontSize: 10.5, color: "#94a3b8" }}>{st.phone}</div>}
                              </td>
                              <td style={{ padding: "9px 12px" }}>
                                <span style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, fontSize: 10.5, fontWeight: 600 }}>
                                  {st.currentClass || "Class 12+"}
                                </span>
                                {st.targetExam && <span style={{ fontSize: 10, color: "#64748b", marginLeft: 4 }}>• {st.targetExam}</span>}
                              </td>
                              <td style={{ padding: "9px 12px" }}>
                                {isEditing ? (
                                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <input
                                      value={editingTag}
                                      onChange={(e) => setEditingTag(e.target.value)}
                                      placeholder="Campus-Point-1"
                                      autoFocus
                                      style={{ height: 24, fontSize: 11, padding: "0 6px", borderRadius: 4, border: "1px solid #cbd5e1" }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSave(st.studentId);
                                        if (e.key === "Escape") setEditingSid(null);
                                      }}
                                    />
                                    <button
                                      onClick={() => handleSave(st.studentId)}
                                      style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: 4, fontSize: 10, padding: "3px 6px", fontWeight: 700, cursor: "pointer" }}
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditingSid(st.studentId);
                                      setEditingTag(st.studentGroup || group.defaultGroupLabel);
                                    }}
                                    title="Click to change student group tag"
                                    style={{
                                      display: "inline-flex", alignItems: "center", gap: 3,
                                      padding: "2px 7px", borderRadius: 5, fontSize: 11, fontWeight: 700,
                                      background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Tag size={10} /> {st.studentGroup || group.defaultGroupLabel}
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: "9px 12px" }}>
                                <span style={{
                                  fontSize: 10.5, fontWeight: 700,
                                  color: st.tasksCompleted === st.tasksAssigned && st.tasksAssigned > 0 ? "#16a34a" : "#475569",
                                  background: "#f8fafc", padding: "2px 6px", borderRadius: 4,
                                }}>
                                  {st.tasksCompleted} / {st.tasksAssigned} tasks
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}

          {/* Unassigned Students Section */}
          {unassigned.length > 0 && (
            <div style={{ background: "#ffffff", borderRadius: 14, border: "1.5px solid #fed7aa", overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", background: "#fff7ed", borderBottom: "1px solid #fed7aa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: 13.5, color: "#9a3412", fontFamily: "Sora, sans-serif" }}>
                    Unassigned Students Pool ({unassigned.length})
                  </strong>
                  <div style={{ fontSize: 11, color: "#b45309" }}>These students have paid mentorship enrollments but are not yet linked to any mentor</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#ea580c", background: "#ffedd5", padding: "2px 8px", borderRadius: 6 }}>
                  Requires Assignment
                </span>
              </div>

              <div className="cp-custom-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#64748b" }}>#</th>
                      <th style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#64748b" }}>Student</th>
                      <th style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#64748b" }}>Email / Phone</th>
                      <th style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 800, color: "#64748b" }}>Target Exam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unassigned.map((st, idx) => (
                      <tr key={st.studentId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "9px 12px", color: "#94a3b8" }}>{idx + 1}</td>
                        <td style={{ padding: "9px 12px" }}>
                          <span style={{ fontWeight: 700, color: "#0f172a" }}>{st.name}</span>
                          <span style={{ fontFamily: "monospace", color: "#64748b", marginLeft: 6, fontSize: 11 }}>{st.studentId}</span>
                        </td>
                        <td style={{ padding: "9px 12px", color: "#475569" }}>{st.email} {st.phone && `• ${st.phone}`}</td>
                        <td style={{ padding: "9px 12px", color: "#64748b" }}>{st.targetExam || "JEE / NEET"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3. ALL ASSIGNED TASKS ROSTER SECTION
   Shows which tasks mentor assigned to student, visible with student name
   along with that mentor
══════════════════════════════════════════════════════════════════ */
export function AssignedTasksRosterSection({
  tasks = [],
  mentors = [],
  mentorFilter,
  setMentorFilter,
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
}) {
  const filtered = useMemo(() => {
    let list = [...tasks];
    if (mentorFilter !== "all") {
      list = list.filter((t) => t.mentorId === mentorFilter);
    }
    if (statusFilter === "completed") {
      list = list.filter((t) => t.completed);
    } else if (statusFilter === "pending") {
      list = list.filter((t) => !t.completed);
    }
    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter((t) =>
        t.studentName?.toLowerCase().includes(q) ||
        t.studentId?.toLowerCase().includes(q) ||
        t.mentorName?.toLowerCase().includes(q) ||
        t.text?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tasks, mentorFilter, statusFilter, search]);

  return (
    <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #f0e9e0", overflow: "hidden", boxShadow: "0 2px 10px rgba(15,23,42,0.03)" }}>
      {/* Header and Filters */}
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
            All Mentor-Assigned Tasks Roster
          </h3>
          <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0" }}>
            Every task assigned by mentors, with student name, mentor name, and completion status
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search task text, student, mentor..."
              style={{ height: 32, paddingLeft: 28, paddingRight: 10, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12, outline: "none", width: 220 }}
            />
          </div>

          <select
            value={mentorFilter}
            onChange={(e) => setMentorFilter(e.target.value)}
            style={{ height: 32, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12, outline: "none", background: "#fff" }}
          >
            <option value="all">All Mentors</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: 32, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12, outline: "none", background: "#fff" }}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed Tasks</option>
            <option value="pending">Pending Tasks</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "50px 20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
          No tasks match your search and filter criteria.
        </div>
      ) : (
        <div className="cp-custom-scroll" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                <th style={{ padding: "10px 14px", width: 36, textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b" }}>#</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b" }}>Student Name</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b" }}>Assigned By Mentor</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b" }}>Task Description</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b" }}>Status</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: "#64748b" }}>Assigned / Completed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr key={t.id || idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 14px", color: "#94a3b8", fontFamily: "monospace", fontSize: 11 }}>{idx + 1}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{t.studentName}</div>
                    <span style={{ fontSize: 10.5, fontFamily: "monospace", color: "#64748b" }}>{t.studentId}</span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.mentorColor || ORANGE }} />
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>{t.mentorName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", maxWidth: 360 }}>
                    <div style={{
                      color: t.completed ? "#166534" : "#0f172a",
                      fontWeight: 500,
                      lineHeight: 1.45,
                      textDecoration: t.completed ? "line-through" : "none",
                    }}>
                      {t.text}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 6,
                      background: t.completed ? "#dcfce7" : "#fef3c7",
                      color: t.completed ? "#15803d" : "#b45309",
                    }}>
                      {t.completed ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {t.completed ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: "#64748b" }}>
                    <div>{fmtDate(t.createdAt)}</div>
                    {t.completedAt && (
                      <div style={{ color: "#16a34a", fontWeight: 600 }}>Done: {fmtDate(t.completedAt)}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
