import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Users, UserCheck, Calendar, Clock, Download, RefreshCw, Search,
  ChevronDown, ChevronUp, ArrowUpDown, ChevronRight, X, CheckCircle2,
  AlertTriangle, PieChart as PieIcon, Activity, Layers, CheckSquare,
  FileSpreadsheet, ExternalLink, Mail, Phone, Building2, Shield, Eye,
  Tag, Edit2, Plus, Check, ClipboardCheck, FolderGit2
} from "lucide-react";
import {
  apiAdminMentorTracking, apiAdminMentorTrackingDetail,
  apiAdminAllStudentsOverview, apiAdminSetStudentGroup, apiAdminSendMentorEmail
} from "../../auth/api.js";
import {
  TaskCompletedSection, StudentGroupsSection, AssignedTasksRosterSection
} from "./MentorTrackingSections.jsx";

const ORANGE = "#FF693D";

const COMPARISON_METRICS = [
  { id: "logins", label: "Total Logins", key: "totalLogins", unit: "logins", icon: Activity },
  { id: "completed", label: "Tasks Completed", key: "tasksCompleted", unit: "tasks", icon: CheckSquare },
  { id: "students", label: "Assigned Students", key: "assignedStudentsCount", unit: "students", icon: Users },
  { id: "studentLogins", label: "Students Logged In", key: "studentsLoggedIn", unit: "students", icon: UserCheck },
  { id: "activity", label: "Tasks Assigned", key: "tasksAssigned", unit: "tasks", icon: Layers },
];

const fmtDate = (iso) => {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const fmtShortDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

export default function MentorTracking({ adminToken }) {
  const [mentors, setMentors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedRange, setSelectedRange] = useState("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Chart state
  const [activeMetric, setActiveMetric] = useState("logins");
  const [hoveredMentorId, setHoveredMentorId] = useState(null);
  const [chartTooltip, setChartTooltip] = useState(null);
  const [legendSearch, setLegendSearch] = useState("");

  // Table state
  const [tableSearch, setTableSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive"
  const [sortField, setSortField] = useState("totalLogins");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drilldown modal state
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTab, setDetailTab] = useState("timeline"); // "timeline" | "students" | "tasks"

  // Section view state
  const [viewSection, setViewSection] = useState("telemetry"); // "telemetry" | "tasks-breakdown" | "groups" | "assigned-tasks"
  const [taskMentorFilter, setTaskMentorFilter] = useState("all");
  const [taskStatusFilter, setTaskStatusFilter] = useState("all");
  const [taskSearch, setTaskSearch] = useState("");
  const [expandedStudentTasks, setExpandedStudentTasks] = useState(new Set());

  // Groups data state
  const [groupsData, setGroupsData] = useState(null);

  // Email Mentors Modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTarget, setEmailTarget] = useState("all");
  const [emailSingleMentorId, setEmailSingleMentorId] = useState("");
  const [emailSubject, setEmailSubject] = useState("Action Required: Please review daily student reports · Campus Point");
  const [emailMessage, setEmailMessage] = useState(
    "Please take 5 minutes today to open your mentor dashboard, review your assigned students' daily study progress, test accuracy, and update their tasks or 1-on-1 meeting links."
  );
  const [emailSending, setEmailSending] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState({ type: "", text: "" });

  const handleSendMentorEmail = async (e) => {
    if (e) e.preventDefault();
    if (emailTarget === "single" && !emailSingleMentorId) {
      setEmailFeedback({ type: "error", text: "Please choose a mentor from the dropdown list." });
      return;
    }
    setEmailSending(true);
    setEmailFeedback({ type: "", text: "" });
    try {
      const res = await apiAdminSendMentorEmail(adminToken, {
        targetType: emailTarget,
        target: emailTarget,
        mentorId: emailTarget === "single" ? emailSingleMentorId : undefined,
        subject: emailSubject,
        message: emailMessage,
      });
      if (res?.ok) {
        setEmailFeedback({
          type: "success",
          text: `Success! Sent ${res.sentCount || 1} email(s) to ${res.targetLabel || "mentors"}.`,
        });
        setTimeout(() => {
          setEmailModalOpen(false);
          setEmailFeedback({ type: "", text: "" });
        }, 2200);
      } else {
        setEmailFeedback({ type: "error", text: res?.error || "Failed to send email." });
      }
    } catch (err) {
      setEmailFeedback({ type: "error", text: err?.message || "Failed to deliver email." });
    } finally {
      setEmailSending(false);
    }
  };
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingGroupText, setEditingGroupText] = useState("");

  const loadData = useCallback(async (r, start, end) => {
    setLoading(true);
    setErr("");
    try {
      const res = await apiAdminMentorTracking(adminToken, r, start, end);
      setMentors(res.mentors || []);
      setSummary(res.summary || null);
    } catch (e) {
      setErr(e.message || "Could not load mentor tracking analytics");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  const loadGroupsData = useCallback(async () => {
    setGroupsLoading(true);
    try {
      const res = await apiAdminAllStudentsOverview(adminToken);
      setGroupsData(res);
    } catch (e) {
      console.error("Failed to load groups overview:", e);
    } finally {
      setGroupsLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    loadData(selectedRange, customStart, customEnd);
  }, [loadData, selectedRange, customStart, customEnd]);

  useEffect(() => {
    if (viewSection === "groups" && !groupsData) {
      loadGroupsData();
    }
  }, [viewSection, groupsData, loadGroupsData]);

  const toggleStudentTasksExpand = (sid) => {
    setExpandedStudentTasks((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) next.delete(sid);
      else next.add(sid);
      return next;
    });
  };

  const saveGroupTag = async (studentId, tag) => {
    if (!tag.trim()) {
      setEditingGroupId(null);
      return;
    }
    try {
      await apiAdminSetStudentGroup(adminToken, studentId, tag.trim());
      if (groupsData) {
        setGroupsData((prev) => {
          if (!prev) return prev;
          const nextGroups = (prev.mentorGroups || []).map((g) => ({
            ...g,
            students: (g.students || []).map((s) => s.studentId === studentId ? { ...s, studentGroup: tag.trim() } : s),
          }));
          const nextUnassigned = {
            ...prev.unassigned,
            students: (prev.unassigned?.students || []).map((s) => s.studentId === studentId ? { ...s, studentGroup: tag.trim() } : s),
          };
          return { ...prev, mentorGroups: nextGroups, unassigned: nextUnassigned };
        });
      }
      setEditingGroupId(null);
      setEditingGroupText("");
    } catch (e) {
      alert("Failed to update student group: " + e.message);
    }
  };

  // Load drilldown details when mentor is selected
  const openMentorDetail = async (mentor) => {
    setSelectedMentor(mentor);
    setDetailLoading(true);
    setDetailTab("students");
    try {
      const res = await apiAdminMentorTrackingDetail(adminToken, mentor.id, selectedRange, customStart, customEnd);
      setDetailData(res);
    } catch (e) {
      console.error("Detail load error:", e);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeMentorDetail = () => {
    setSelectedMentor(null);
    setDetailData(null);
  };

  // Close inspector on Escape key
  useEffect(() => {
    if (!selectedMentor) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeMentorDetail();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMentor]);

  // Metric configuration
  const currentMetricConfig = useMemo(
    () => COMPARISON_METRICS.find((m) => m.id === activeMetric) || COMPARISON_METRICS[0],
    [activeMetric]
  );

  // Calculation for Doughnut / Pie Chart
  const chartSegments = useMemo(() => {
    const key = currentMetricConfig.key;
    const items = mentors.map((m) => ({
      ...m,
      val: Number(m[key]) || 0,
    }));

    const totalVal = items.reduce((acc, cur) => acc + cur.val, 0);

    let currentAngle = 0;
    return items.map((m) => {
      const percentage = totalVal > 0 ? (m.val / totalVal) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      return {
        ...m,
        percentage,
        startAngle,
        angle,
      };
    });
  }, [mentors, currentMetricConfig]);

  const totalMetricVal = useMemo(() => {
    const key = currentMetricConfig.key;
    return mentors.reduce((acc, cur) => acc + (Number(cur[key]) || 0), 0);
  }, [mentors, currentMetricConfig]);

  // Filtered mentors for searchable legend
  const filteredLegendMentors = useMemo(() => {
    if (!legendSearch) return chartSegments;
    const q = legendSearch.toLowerCase().trim();
    return chartSegments.filter((m) => m.name.toLowerCase().includes(q) || m.college?.toLowerCase().includes(q));
  }, [chartSegments, legendSearch]);

  // Filtered and sorted mentors for table
  const filteredTableMentors = useMemo(() => {
    let list = [...mentors];

    if (tableSearch) {
      const q = tableSearch.toLowerCase().trim();
      list = list.filter((m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.college?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((m) => m.activityStatus?.toLowerCase() === statusFilter.toLowerCase());
    }

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [mentors, tableSearch, statusFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredTableMentors.length / pageSize));
  const paginatedMentors = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTableMentors.slice(start, start + pageSize);
  }, [filteredTableMentors, page, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  // CSV Export for authorized analytics
  const exportCsv = () => {
    const headers = [
      "Mentor Name",
      "Email",
      "College",
      "Status",
      "Logins (Selected Period)",
      "Last Login",
      "Assigned Students",
      "Students Logged In",
      "Tasks Assigned",
      "Tasks Completed",
      "Tasks Updated",
      "Pending Tasks",
      "Completion Rate (%)",
    ];

    const rows = filteredTableMentors.map((m) => [
      `"${m.name || ""}"`,
      `"${m.email || ""}"`,
      `"${m.college || ""}"`,
      m.activityStatus,
      m.totalLogins,
      m.lastLogin ? `"${new Date(m.lastLogin).toISOString()}"` : `"Never"`,
      m.assignedStudentsCount,
      m.studentsLoggedIn,
      m.tasksAssigned,
      m.tasksCompleted,
      m.tasksUpdated,
      m.tasksPending,
      `${m.completionRate}%`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CampusPoint-Mentor-Analytics-${selectedRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // All students with tasks flattened
  const allStudentsWithTasks = useMemo(() => {
    const list = [];
    mentors.forEach((m) => {
      (m.tasksByStudentList || []).forEach((st) => {
        list.push({
          ...st,
          mentorId: m.id,
          mentorName: m.name,
          mentorEmail: m.email,
          mentorColor: m.color,
          mentorCollege: m.college,
        });
      });
    });
    return list;
  }, [mentors]);

  // All assigned tasks flattened
  const allAssignedTasks = useMemo(() => {
    const list = [];
    mentors.forEach((m) => {
      (m.assignedTasksList || []).forEach((t) => {
        list.push({
          ...t,
          mentorColor: m.color,
        });
      });
    });
    return list;
  }, [mentors]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      {/* Top Header & Range Filter Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 14,
        background: "#ffffff",
        padding: "16px 20px",
        borderRadius: 16,
        border: "1px solid #f0e9e0",
        boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${ORANGE}15`, display: "grid", placeItems: "center",
          }}>
            <PieIcon size={18} color={ORANGE} />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
              Mentor Tracking & Performance Analytics
            </h2>
            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
              Live server-side activity audits, login counts, task completions & comparative doughnut charts
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex",
            background: "#f8fafc",
            borderRadius: 10,
            padding: 3,
            border: "1px solid #e2e8f0",
          }}>
            {[
              { id: "today", label: "Today" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "custom", label: "Custom" },
            ].map((p) => {
              const active = selectedRange === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedRange(p.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: active ? "#ffffff" : "transparent",
                    color: active ? ORANGE : "#64748b",
                    fontWeight: active ? 700 : 500,
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: active ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {selectedRange === "custom" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                style={{ height: 32, padding: "0 8px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 11.5 }}
              />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                style={{ height: 32, padding: "0 8px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 11.5 }}
              />
            </div>
          )}

          <button
            onClick={exportCsv}
            style={{
              height: 34,
              padding: "0 14px",
              borderRadius: 9,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#334155",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <Download size={13} /> Export CSV
          </button>

          <button
            onClick={() => loadData(selectedRange, customStart, customEnd)}
            disabled={loading}
            style={{
              height: 34,
              padding: "0 12px",
              borderRadius: 9,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              color: "#475569",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <RefreshCw size={13} style={{ animation: loading ? "admSpin 1s linear infinite" : "none" }} />
          </button>
        </div>
      </div>

      {err && (
        <div style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          padding: "12px 16px",
          borderRadius: 12,
          color: "#991b1b",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <AlertTriangle size={16} />
          <span>{err}</span>
        </div>
      )}

      {/* SECTION TABS SWITCHER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "4px",
        background: "#f1f5f9",
        borderRadius: 12,
        width: "fit-content",
        flexWrap: "wrap",
      }}>
        <button
          onClick={() => setViewSection("telemetry")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 16px",
            borderRadius: 9,
            border: "none",
            background: viewSection === "telemetry" ? "#ffffff" : "transparent",
            color: viewSection === "telemetry" ? ORANGE : "#475569",
            fontWeight: viewSection === "telemetry" ? 800 : 600,
            fontSize: 12.5,
            cursor: "pointer",
            boxShadow: viewSection === "telemetry" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <Activity size={14} color={viewSection === "telemetry" ? ORANGE : "#64748b"} />
          Telemetry & Distribution
        </button>

        <button
          onClick={() => setViewSection("tasks-breakdown")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 16px",
            borderRadius: 9,
            border: "none",
            background: viewSection === "tasks-breakdown" ? "#ffffff" : "transparent",
            color: viewSection === "tasks-breakdown" ? ORANGE : "#475569",
            fontWeight: viewSection === "tasks-breakdown" ? 800 : 600,
            fontSize: 12.5,
            cursor: "pointer",
            boxShadow: viewSection === "tasks-breakdown" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <CheckSquare size={14} color={viewSection === "tasks-breakdown" ? ORANGE : "#64748b"} />
          Tasks Completed (By Student)
          {summary?.totalTasksCompletedSum != null && (
            <span style={{
              background: viewSection === "tasks-breakdown" ? `${ORANGE}15` : "#e2e8f0",
              color: viewSection === "tasks-breakdown" ? ORANGE : "#475569",
              padding: "1px 6px",
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 800,
            }}>
              {summary.totalTasksCompletedSum}/{summary.totalTasksAssignedSum}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setViewSection("groups");
            if (!groupsData) loadGroupsData();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 16px",
            borderRadius: 9,
            border: "none",
            background: viewSection === "groups" ? "#ffffff" : "transparent",
            color: viewSection === "groups" ? ORANGE : "#475569",
            fontWeight: viewSection === "groups" ? 800 : 600,
            fontSize: 12.5,
            cursor: "pointer",
            boxShadow: viewSection === "groups" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <FolderGit2 size={14} color={viewSection === "groups" ? ORANGE : "#64748b"} />
          Student Groups (Campus-Point-X)
        </button>

        <button
          onClick={() => setViewSection("assigned-tasks")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 16px",
            borderRadius: 9,
            border: "none",
            background: viewSection === "assigned-tasks" ? "#ffffff" : "transparent",
            color: viewSection === "assigned-tasks" ? ORANGE : "#475569",
            fontWeight: viewSection === "assigned-tasks" ? 800 : 600,
            fontSize: 12.5,
            cursor: "pointer",
            boxShadow: viewSection === "assigned-tasks" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <Layers size={14} color={viewSection === "assigned-tasks" ? ORANGE : "#64748b"} />
          All Assigned Tasks Roster
        </button>
      </div>

      {/* ── SUB-SECTIONS RENDERING ── */}
      {viewSection === "tasks-breakdown" && (
        <TaskCompletedSection
          studentsWithTasks={allStudentsWithTasks}
          mentors={mentors}
          mentorFilter={taskMentorFilter}
          setMentorFilter={setTaskMentorFilter}
          statusFilter={taskStatusFilter}
          setStatusFilter={setTaskStatusFilter}
          search={taskSearch}
          setSearch={setTaskSearch}
          expanded={expandedStudentTasks}
          onToggleExpand={toggleStudentTasksExpand}
        />
      )}

      {viewSection === "groups" && (
        <StudentGroupsSection
          groupsData={groupsData}
          loading={groupsLoading}
          onSaveGroupTag={saveGroupTag}
          onRefresh={loadGroupsData}
        />
      )}

      {viewSection === "assigned-tasks" && (
        <AssignedTasksRosterSection
          tasks={allAssignedTasks}
          mentors={mentors}
          mentorFilter={taskMentorFilter}
          setMentorFilter={setTaskMentorFilter}
          statusFilter={taskStatusFilter}
          setStatusFilter={setTaskStatusFilter}
          search={taskSearch}
          setSearch={setTaskSearch}
        />
      )}

      {/* Primary Telemetry View */}
      {viewSection === "telemetry" && (
        <>
          {/* Summary KPI Strip */}
          {summary && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }}>
          <div style={{ background: "#ffffff", borderRadius: 14, padding: "14px 18px", border: "1px solid #f0e9e0" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Mentors</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
              {summary.totalMentors}
              <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginLeft: 6 }}>
                ({summary.activeMentorsCount} active)
              </span>
            </div>
          </div>

          <div style={{ background: "#ffffff", borderRadius: 14, padding: "14px 18px", border: "1px solid #f0e9e0" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Mentor Logins</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
              {summary.totalLoginsSum}
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginLeft: 6 }}>in period</span>
            </div>
          </div>

          <div style={{ background: "#ffffff", borderRadius: 14, padding: "14px 18px", border: "1px solid #f0e9e0" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Assigned Students</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
              {summary.totalAssignedStudentsSum}
              <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, marginLeft: 6 }}>
                ({summary.totalUniqueStudentsLoggedIn} logged in)
              </span>
            </div>
          </div>

          <div style={{ background: "#ffffff", borderRadius: 14, padding: "14px 18px", border: "1px solid #f0e9e0" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Tasks Status</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
              {summary.totalTasksCompletedSum}
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginLeft: 6 }}>
                / {summary.totalTasksAssignedSum} ({summary.avgCompletionRate}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Interactive Mentor Comparison Pie / Doughnut Chart */}
      <div style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: "24px",
        border: "1px solid #f0e9e0",
        boxShadow: "0 2px 12px rgba(15,23,42,0.03)",
      }}>
        {/* Metric Selector Navigation */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid #f1f5f9",
        }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
              Comparative Mentor Distribution Chart
            </h3>
            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
              Switch metric comparisons to analyze workload, student attendance, and task execution
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#f1f5f9",
            borderRadius: 12,
            padding: 3,
            gap: 2,
            flexWrap: "wrap",
          }}>
            {COMPARISON_METRICS.map(({ id, label, icon: Icon }) => {
              const active = activeMetric === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveMetric(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 13px",
                    borderRadius: 9,
                    border: "none",
                    background: active ? "#ffffff" : "transparent",
                    color: active ? ORANGE : "#475569",
                    fontWeight: active ? 700 : 500,
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={14} color={active ? ORANGE : "#64748b"} />
                  {label}
                </button>
              );
            })}

            {/* Added Email Mentors Action Option */}
            <button
              onClick={() => {
                setEmailModalOpen(true);
                setEmailFeedback({ type: "", text: "" });
              }}
              title="Compose and send email reminder or notice to mentors"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 9,
                border: "none",
                background: "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(255,105,61,0.25)",
                transition: "all 0.15s ease",
                marginLeft: 4,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.92")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Mail size={14} color="#ffffff" />
              Email Mentors
            </button>
          </div>
        </div>

        {/* Chart + Searchable Legend Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 28,
          alignItems: "center",
        }}>
          {/* SVG Doughnut Chart with Rich Tooltip */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            minHeight: 280,
          }}>
            {totalMetricVal === 0 ? (
              <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, padding: 40 }}>
                No {currentMetricConfig.label.toLowerCase()} recorded in this period.
              </div>
            ) : (
              <div style={{ position: "relative", width: 260, height: 260 }}>
                <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                  {chartSegments.map((seg) => {
                    if (seg.val === 0) return null;
                    const strokeLen = (seg.percentage / 100) * (2 * Math.PI * 38);
                    const strokeDash = `${strokeLen} ${2 * Math.PI * 38 - strokeLen}`;
                    const offset = (seg.startAngle / 360) * (2 * Math.PI * 38);
                    const isHovered = hoveredMentorId === seg.id;

                    return (
                      <circle
                        key={seg.id}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth={isHovered ? 16 : 13}
                        strokeDasharray={strokeDash}
                        strokeDashoffset={-offset}
                        style={{
                          cursor: "pointer",
                          transition: "stroke-width 0.2s ease, filter 0.2s ease",
                          filter: isHovered ? "drop-shadow(0 0 6px rgba(0,0,0,0.25))" : "none",
                        }}
                        onMouseEnter={(e) => {
                          setHoveredMentorId(seg.id);
                          setChartTooltip({
                            mentor: seg,
                            x: e.clientX,
                            y: e.clientY,
                          });
                        }}
                        onMouseMove={(e) => {
                          setChartTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
                        }}
                        onMouseLeave={() => {
                          setHoveredMentorId(null);
                          setChartTooltip(null);
                        }}
                        onClick={() => openMentorDetail(seg)}
                      />
                    );
                  })}
                </svg>

                {/* Center Readout */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  textAlign: "center",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {currentMetricConfig.label}
                  </span>
                  <span style={{ fontFamily: "Sora, sans-serif", fontSize: 26, fontWeight: 800, color: "#0f172a" }}>
                    {totalMetricVal}
                  </span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    across {chartSegments.filter((s) => s.val > 0).length} mentors
                  </span>
                </div>
              </div>
            )}

            {/* Hover Tooltip Render */}
            {chartTooltip && chartTooltip.mentor && (
              <div
                style={{
                  position: "fixed",
                  left: chartTooltip.x + 14,
                  top: chartTooltip.y - 40,
                  background: "#0f172a",
                  color: "#ffffff",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontSize: 12,
                  pointerEvents: "none",
                  zIndex: 9999,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                  maxWidth: 260,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: chartTooltip.mentor.color }} />
                  <strong style={{ fontSize: 13, fontFamily: "Sora, sans-serif" }}>
                    {chartTooltip.mentor.name}
                  </strong>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 8 }}>
                  {chartTooltip.mentor.college || "Mentor"}
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#cbd5e1" }}>{currentMetricConfig.label}:</span>
                    <strong style={{ color: chartTooltip.mentor.color }}>
                      {chartTooltip.mentor.val} ({chartTooltip.mentor.percentage.toFixed(1)}%)
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Total Logins:</span>
                    <span>{chartTooltip.mentor.totalLogins} (last: {fmtShortDate(chartTooltip.mentor.lastLogin)})</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Assigned Students:</span>
                    <span>{chartTooltip.mentor.assignedStudentsCount} ({chartTooltip.mentor.studentsLoggedIn} logged in)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Tasks Assigned:</span>
                    <span>{chartTooltip.mentor.tasksAssigned} ({chartTooltip.mentor.tasksCompleted} completed)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Completion Rate:</span>
                    <span style={{ color: "#34d399", fontWeight: 700 }}>{chartTooltip.mentor.completionRate}%</span>
                  </div>
                </div>

                <div style={{ fontSize: 10, color: "#64748b", marginTop: 8, textAlign: "center" }}>
                  Click to open full mentor profile
                </div>
              </div>
            )}
          </div>

          {/* Searchable Legend for Large Groups */}
          <div style={{
            background: "#f8fafc",
            borderRadius: 14,
            padding: "16px",
            border: "1px solid #e2e8f0",
            maxHeight: 290,
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search mentor in legend..."
                value={legendSearch}
                onChange={(e) => setLegendSearch(e.target.value)}
                style={{
                  width: "100%",
                  height: 32,
                  padding: "0 10px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  fontSize: 12,
                  outline: "none",
                  background: "#ffffff",
                }}
              />
            </div>

            <div className="cp-custom-scroll" style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, paddingRight: 4 }}>
              {filteredLegendMentors.length === 0 ? (
                <div style={{ color: "#94a3b8", fontSize: 12, textAlign: "center", padding: 20 }}>
                  No mentors match "{legendSearch}"
                </div>
              ) : (
                filteredLegendMentors.map((m) => {
                  const isHovered = hoveredMentorId === m.id;
                  return (
                    <div
                      key={m.id}
                      onMouseEnter={() => setHoveredMentorId(m.id)}
                      onMouseLeave={() => setHoveredMentorId(null)}
                      onClick={() => openMentorDetail(m)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: isHovered ? "#ffffff" : "transparent",
                        cursor: "pointer",
                        boxShadow: isHovered ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                        border: isHovered ? "1px solid #e2e8f0" : "1px solid transparent",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                        <span style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: m.color, flexShrink: 0,
                        }} />
                        <span style={{
                          fontSize: 12.5, fontWeight: 600, color: "#1e293b",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {m.name}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <strong style={{ fontSize: 12.5, color: "#0f172a" }}>{m.val}</strong>
                        <span style={{ fontSize: 11, color: "#64748b" }}>({m.percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Detailed Mentor Analytics Table */}
      <div style={{
        background: "#ffffff",
        borderRadius: 18,
        border: "1px solid #f0e9e0",
        boxShadow: "0 2px 12px rgba(15,23,42,0.03)",
        overflow: "hidden",
      }}>
        {/* Table Filter and Search Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          padding: "18px 20px",
          borderBottom: "1px solid #f1f5f9",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
              Mentor Engagement Roster
            </h3>
            <span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 12, fontSize: 11.5, fontWeight: 700, color: "#475569" }}>
              {filteredTableMentors.length} mentors
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search mentor by name, email, college..."
                value={tableSearch}
                onChange={(e) => { setTableSearch(e.target.value); setPage(1); }}
                style={{
                  height: 34,
                  paddingLeft: 30,
                  paddingRight: 10,
                  borderRadius: 9,
                  border: "1px solid #e2e8f0",
                  fontSize: 12.5,
                  outline: "none",
                  width: 220,
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              style={{
                height: 34,
                padding: "0 10px",
                borderRadius: 9,
                border: "1px solid #e2e8f0",
                fontSize: 12.5,
                color: "#475569",
                background: "#ffffff",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active (Recent)</option>
              <option value="inactive">Inactive</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="cp-custom-scroll" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", color: "#64748b", fontWeight: 700 }}>
                <th style={{ padding: "12px 16px", cursor: "pointer" }} onClick={() => handleSort("name")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Mentor {sortField === "name" && <ArrowUpDown size={12} />}
                  </div>
                </th>
                <th style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => handleSort("totalLogins")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Logins {sortField === "totalLogins" && <ArrowUpDown size={12} />}
                  </div>
                </th>
                <th style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => handleSort("lastLogin")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Last Login {sortField === "lastLogin" && <ArrowUpDown size={12} />}
                  </div>
                </th>
                <th style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => handleSort("assignedStudentsCount")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Students Assigned {sortField === "assignedStudentsCount" && <ArrowUpDown size={12} />}
                  </div>
                </th>
                <th style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => handleSort("studentsLoggedIn")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Students Active {sortField === "studentsLoggedIn" && <ArrowUpDown size={12} />}
                  </div>
                </th>
                <th style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => handleSort("tasksAssigned")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Tasks Assigned {sortField === "tasksAssigned" && <ArrowUpDown size={12} />}
                  </div>
                </th>
                <th style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => handleSort("tasksCompleted")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Completed {sortField === "tasksCompleted" && <ArrowUpDown size={12} />}
                  </div>
                </th>
                <th style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => handleSort("tasksUpdated")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Updated {sortField === "tasksUpdated" && <ArrowUpDown size={12} />}
                  </div>
                </th>
                <th style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => handleSort("tasksPending")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Pending {sortField === "tasksPending" && <ArrowUpDown size={12} />}
                  </div>
                </th>
                <th style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => handleSort("completionRate")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Completion % {sortField === "completionRate" && <ArrowUpDown size={12} />}
                  </div>
                </th>
                <th style={{ padding: "12px 14px" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMentors.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ padding: "36px", textAlign: "center", color: "#94a3b8" }}>
                    No mentors found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedMentors.map((m) => {
                  const statusBg = m.activityStatus === "Active" ? "#ecfdf5" : m.activityStatus === "Disabled" ? "#fef2f2" : "#f1f5f9";
                  const statusColor = m.activityStatus === "Active" ? "#059669" : m.activityStatus === "Disabled" ? "#dc2626" : "#64748b";

                  return (
                    <tr
                      key={m.id}
                      style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fbfcfe"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      {/* Mentor Info */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 10,
                            background: m.color, color: "#ffffff",
                            display: "grid", placeItems: "center",
                            fontSize: 13, fontWeight: 800, flexShrink: 0,
                          }}>
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#0f172a" }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: "#64748b" }}>{m.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Logins */}
                      <td style={{ padding: "14px" }}>
                        <span style={{
                          background: "#eff6ff", color: "#2563eb",
                          padding: "3px 8px", borderRadius: 6, fontWeight: 700, fontSize: 12,
                        }}>
                          {m.totalLogins}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td style={{ padding: "14px", color: "#475569", whiteSpace: "nowrap" }}>
                        {fmtDate(m.lastLogin)}
                      </td>

                      {/* Assigned Students */}
                      <td style={{ padding: "14px", fontWeight: 600, color: "#0f172a" }}>
                        {m.assignedStudentsCount}
                      </td>

                      {/* Students Logged In */}
                      <td style={{ padding: "14px" }}>
                        <span style={{ color: "#059669", fontWeight: 700 }}>
                          {m.studentsLoggedIn}
                        </span>
                        <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>
                          ({m.assignedStudentsCount > 0 ? Math.round((m.studentsLoggedIn / m.assignedStudentsCount) * 100) : 0}%)
                        </span>
                      </td>

                      {/* Tasks Assigned */}
                      <td style={{ padding: "14px", color: "#475569" }}>
                        {m.tasksAssigned}
                      </td>

                      {/* Tasks Completed */}
                      <td style={{ padding: "14px" }}>
                        <span style={{ background: "#f0fdf4", color: "#16a34a", padding: "2px 7px", borderRadius: 6, fontWeight: 700 }}>
                          {m.tasksCompleted}
                        </span>
                      </td>

                      {/* Tasks Updated */}
                      <td style={{ padding: "14px" }}>
                        <span style={{ background: "#f8fafc", color: "#64748b", padding: "2px 7px", borderRadius: 6, fontWeight: 600 }}>
                          {m.tasksUpdated}
                        </span>
                      </td>

                      {/* Pending Tasks */}
                      <td style={{ padding: "14px" }}>
                        <span style={{
                          background: m.tasksPending > 0 ? "#fffbeb" : "#f8fafc",
                          color: m.tasksPending > 0 ? "#b45309" : "#94a3b8",
                          padding: "2px 7px", borderRadius: 6, fontWeight: 700,
                        }}>
                          {m.tasksPending}
                        </span>
                      </td>

                      {/* Completion Rate */}
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 44, height: 6, borderRadius: 3, background: "#e2e8f0", overflow: "hidden" }}>
                            <div style={{ width: `${m.completionRate}%`, height: "100%", background: "#10b981", borderRadius: 3 }} />
                          </div>
                          <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 12 }}>
                            {m.completionRate}%
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px" }}>
                        <span style={{
                          padding: "3px 8px", borderRadius: 20,
                          fontSize: 11, fontWeight: 700,
                          background: statusBg, color: statusColor,
                        }}>
                          {m.activityStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <button
                          onClick={() => openMentorDetail(m)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "1px solid #e2e8f0",
                            background: "#ffffff",
                            color: ORANGE,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 20px",
            borderTop: "1px solid #f1f5f9",
            fontSize: 12,
            color: "#64748b",
          }}>
            <div>
              Showing {(page - 1) * pageSize + 1} to {Math.min(filteredTableMentors.length, page * pageSize)} of {filteredTableMentors.length} mentors
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0",
                  background: "#ffffff", cursor: page <= 1 ? "not-allowed" : "pointer",
                  color: page <= 1 ? "#cbd5e1" : "#475569", fontWeight: 600,
                }}
              >
                Previous
              </button>
              <span style={{ padding: "4px 8px", fontWeight: 700, color: "#0f172a" }}>
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0",
                  background: "#ffffff", cursor: page >= totalPages ? "not-allowed" : "pointer",
                  color: page >= totalPages ? "#cbd5e1" : "#475569", fontWeight: 600,
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      </>
      )}

      {/* SECTION 6: Sleek Slide-Over Mentor Inspector Drawer */}
      {selectedMentor && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMentorDetail();
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(2px)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 9999,
            animation: "admFadeIn 0.18s ease-out",
          }}
        >
          <style>{`
            @keyframes admDrawerSlideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            @keyframes admFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>

          <div
            style={{
              background: "#ffffff",
              width: "min(460px, 94vw)",
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-12px 0 40px rgba(15,23,42,0.18)",
              borderLeft: "1px solid #e2e8f0",
              animation: "admDrawerSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fafafa",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: selectedMentor.color || ORANGE,
                    color: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 15,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {selectedMentor.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <h3
                      style={{
                        fontSize: 14.5,
                        fontWeight: 800,
                        color: "#0f172a",
                        margin: 0,
                        fontFamily: "Sora, sans-serif",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {selectedMentor.name}
                    </h3>
                    <span
                      style={{
                        padding: "1.5px 6px",
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: 700,
                        background: selectedMentor.active ? "#ecfdf5" : "#fef2f2",
                        color: selectedMentor.active ? "#059669" : "#dc2626",
                      }}
                    >
                      {selectedMentor.active ? "Active" : "Deactivated"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#64748b",
                      marginTop: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selectedMentor.email} · {selectedMentor.college || "Mentor"}
                  </div>
                </div>
              </div>

              <button
                onClick={closeMentorDetail}
                title="Close drawer (Esc)"
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  width: 28,
                  height: 28,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 7,
                  flexShrink: 0,
                  transition: "background 0.15s ease",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Stat Pill Cards (Compact 2x2 Grid) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 8,
                padding: "12px 18px",
                background: "#f8fafc",
                borderBottom: "1px solid #eef2f6",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: 10.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  Period Logins
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
                  {selectedMentor.totalLogins}
                </div>
              </div>
              <div
                style={{
                  background: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: 10.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  All-Time Logins
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
                  {selectedMentor.allTimeLogins ?? selectedMentor.totalLogins}
                </div>
              </div>
              <div
                style={{
                  background: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: 10.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  Assigned Mentees
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
                  {selectedMentor.assignedStudentsCount}
                </div>
              </div>
              <div
                style={{
                  background: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: 10.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  Tasks Completed
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#16a34a", marginTop: 2 }}>
                  {selectedMentor.tasksCompleted} / {selectedMentor.tasksAssigned}
                </div>
              </div>
            </div>

            {/* Segmented Navigation Tabs */}
            <div
              style={{
                display: "flex",
                background: "#f1f5f9",
                margin: "10px 18px 4px",
                padding: 3,
                borderRadius: 9,
                gap: 2,
              }}
            >
              {[
                {
                  id: "students",
                  label: `Assigned Students (${detailData?.students?.length ?? selectedMentor.assignedStudentsCount})`,
                },
                { id: "timeline", label: "Activity Timeline" },
              ].map((t) => {
                const active = detailTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setDetailTab(t.id)}
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      border: "none",
                      background: active ? "#ffffff" : "transparent",
                      cursor: "pointer",
                      fontWeight: active ? 700 : 500,
                      fontSize: 12,
                      color: active ? ORANGE : "#64748b",
                      borderRadius: 7,
                      boxShadow: active ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Drawer Body */}
            <div
              className="cp-custom-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {detailLoading ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                  <RefreshCw
                    size={16}
                    style={{ animation: "admSpin 1s linear infinite", margin: "0 auto 8px" }}
                  />
                  <div>Loading mentor telemetry...</div>
                </div>
              ) : detailTab === "students" ? (
                /* Assigned Students View */
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
                    Assigned Mentees & Attendance
                  </div>

                  {!detailData?.students || detailData.students.length === 0 ? (
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 12,
                        padding: "30px 10px",
                        textAlign: "center",
                        background: "#f8fafc",
                        borderRadius: 10,
                        border: "1px dashed #cbd5e1",
                      }}
                    >
                      No students are currently assigned to this mentor.
                    </div>
                  ) : (
                    detailData.students.map((st) => (
                      <div
                        key={st.studentId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          borderRadius: 10,
                          background: "#ffffff",
                          border: "1px solid #eef2f6",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                          gap: 10,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 12.5 }}>
                              {st.name}
                            </span>
                            <span
                              style={{
                                color: "#64748b",
                                background: "#f1f5f9",
                                padding: "1px 5px",
                                borderRadius: 4,
                                fontSize: 10.5,
                                fontWeight: 600,
                              }}
                            >
                              {st.studentId}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                            Plan: {st.plan || "Paid"} · Last login: {fmtDate(st.lastLogin)}
                          </div>
                        </div>

                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span
                            style={{
                              padding: "2px 7px",
                              borderRadius: 10,
                              fontSize: 10.5,
                              fontWeight: 700,
                              display: "inline-block",
                              background: st.hasLoggedInInRange ? "#ecfdf5" : "#fef2f2",
                              color: st.hasLoggedInInRange ? "#059669" : "#991b1b",
                            }}
                          >
                            {st.hasLoggedInInRange ? `Active (${st.loginsCount} logins)` : "No Logins"}
                          </span>
                          <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 3 }}>
                            {st.tasksCompleted} / {st.tasksCount} tasks
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* Activity Timeline View */
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
                    Verified Activity Stream
                  </div>

                  {!detailData?.logs || detailData.logs.length === 0 ? (
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 12,
                        padding: "30px 10px",
                        textAlign: "center",
                        background: "#f8fafc",
                        borderRadius: 10,
                        border: "1px dashed #cbd5e1",
                      }}
                    >
                      No recent activity events recorded for this mentor in this period.
                    </div>
                  ) : (
                    detailData.logs.map((log) => {
                      const d = new Date(log.createdAt);
                      return (
                        <div
                          key={log.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "9px 12px",
                            borderRadius: 8,
                            background: "#f8fafc",
                            border: "1px solid #f1f5f9",
                            fontSize: 11.5,
                            gap: 8,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                            <span
                              style={{
                                padding: "2px 6px",
                                borderRadius: 5,
                                fontSize: 9.5,
                                fontWeight: 800,
                                background: log.action.includes("login") ? "#eff6ff" : "#f0fdf4",
                                color: log.action.includes("login") ? "#2563eb" : "#16a34a",
                                flexShrink: 0,
                              }}
                            >
                              {log.action.replace("_", " ").toUpperCase()}
                            </span>
                            <span
                              style={{
                                color: "#1e293b",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {log.studentId
                                ? `${log.studentId} (${log.studentName || ""})`
                                : "Mentor session logged"}
                            </span>
                          </div>
                          <span style={{ color: "#94a3b8", fontSize: 10.5, flexShrink: 0 }}>
                            {d.toLocaleString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                padding: "12px 18px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={closeMentorDetail}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Admin Email to Mentors Modal ────────────────────────────────────── */}
      {emailModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "grid",
            placeItems: "center",
            padding: 16,
            overflowY: "auto",
            boxSizing: "border-box",
          }}
          onClick={() => !emailSending && setEmailModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              maxWidth: 560,
              width: "100%",
              maxHeight: "calc(100vh - 40px)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 50px rgba(15, 23, 42, 0.28)",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              margin: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #FF693D 0%, #ee5326 100%)",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Mail size={18} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Send Email to Mentors</h3>
                  <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.9 }}>
                    Automated delivery with assigned students & direct mentor dashboard link
                  </p>
                </div>
              </div>
              <button
                disabled={emailSending}
                onClick={() => setEmailModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 6,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendMentorEmail} style={{ padding: 22, overflowY: "auto", flex: 1, boxSizing: "border-box" }}>
              {/* Target Selector */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                  Target Recipient(s)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { id: "all", label: "All Active Mentors" },
                    { id: "inactive_today", label: "Inactive Today (9 PM Lobby)" },
                    { id: "single", label: "Single Mentor" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setEmailTarget(t.id);
                        if (t.id === "single" && !emailSingleMentorId && mentors.length > 0) {
                          setEmailSingleMentorId(mentors[0].id || mentors[0]._id);
                        }
                      }}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: emailTarget === t.id ? "2px solid #FF693D" : "1px solid #cbd5e1",
                        background: emailTarget === t.id ? "#fff7ed" : "#ffffff",
                        color: emailTarget === t.id ? "#c2410c" : "#475569",
                        fontWeight: emailTarget === t.id ? 700 : 500,
                        fontSize: 11.5,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Single Mentor Dropdown */}
              {emailTarget === "single" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                    Select Mentor
                  </label>
                  <select
                    value={emailSingleMentorId}
                    onChange={(e) => setEmailSingleMentorId(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1.5px solid #cbd5e1",
                      fontSize: 12,
                      color: "#0f172a",
                      background: "#ffffff",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">-- Choose a mentor ({mentors.length} available) --</option>
                    {(mentors || []).map((m) => {
                      const mId = m.id || m._id;
                      return (
                        <option key={mId} value={mId}>
                          {m.name} ({m.email}) — {m.assignedStudentsCount ?? m.studentsCount ?? 0} students
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Quick Template Buttons */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5 }}>
                  Quick Templates
                </label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailSubject("Action Required: Please review daily student reports · Campus Point");
                      setEmailMessage(
                        "Please take 5 minutes today to open your mentor dashboard, review your assigned students' daily study progress, test accuracy, and update their tasks or 1-on-1 meeting links."
                      );
                    }}
                    style={{
                      padding: "4px 9px",
                      borderRadius: 6,
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#475569",
                      cursor: "pointer",
                    }}
                  >
                    Daily Reports Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailSubject("Reminder: Update weekly tasks & schedule 1-on-1 meetings");
                      setEmailMessage(
                        "Hi Mentors, please make sure this week's study tasks are assigned and all upcoming 1-on-1 video sessions have active meeting links configured in your dashboard."
                      );
                    }}
                    style={{
                      padding: "4px 9px",
                      borderRadius: 6,
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#475569",
                      cursor: "pointer",
                    }}
                  >
                    Tasks & Meetings Update
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                  Subject Line
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                  placeholder="Subject line..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 12.5,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                  Custom Message Note
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Enter message for mentor..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    fontFamily: "inherit",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Automatic inclusions note */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: 11,
                  color: "#64748b",
                  lineHeight: 1.5,
                  marginBottom: 16,
                }}
              >
                <strong style={{ color: "#0f172a" }}>✓ Auto-included in email:</strong> Assigned student names, target exams, student regions, and direct 1-click button to <code>https://campuspoint.in/mentor</code>.
              </div>

              {/* Feedback Alert */}
              {emailFeedback.text && (
                <div
                  style={{
                    padding: "9px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 14,
                    background: emailFeedback.type === "success" ? "#ecfdf5" : "#fef2f2",
                    color: emailFeedback.type === "success" ? "#065f46" : "#991b1b",
                    border: `1px solid ${emailFeedback.type === "success" ? "#a7f3d0" : "#fecaca"}`,
                  }}
                >
                  {emailFeedback.text}
                </div>
              )}

              {/* Footer Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  disabled={emailSending}
                  onClick={() => setEmailModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailSending}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg, #FF693D 0%, #ee5326 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(255,105,61,0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {emailSending ? (
                    <>
                      <RefreshCw size={13} className="spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={13} />
                      Send Email Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}