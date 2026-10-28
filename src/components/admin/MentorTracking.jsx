import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users, UserCheck, Calendar, Clock, Download, RefreshCw, Search,
  ChevronDown, ChevronUp, ArrowUpDown, ChevronRight, X, CheckCircle2,
  AlertTriangle, PieChart as PieIcon, Activity, Layers, CheckSquare,
  FileSpreadsheet, ExternalLink, Mail, Phone, Building2, Shield, Eye
} from "lucide-react";
import { apiAdminMentorTracking, apiAdminMentorTrackingDetail } from "../../auth/api.js";

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

  useEffect(() => {
    loadData(selectedRange, customStart, customEnd);
  }, [loadData, selectedRange, customStart, customEnd]);

  // Load drilldown details when mentor is selected
  const openMentorDetail = async (mentor) => {
    setSelectedMentor(mentor);
    setDetailLoading(true);
    setDetailTab("timeline");
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
    link.remove();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
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

            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, paddingRight: 4 }}>
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
        <div style={{ overflowX: "auto" }}>
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

      {/* SECTION 6: Individual Mentor Detail Modal */}
      {selectedMentor && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.6)",
          backdropFilter: "blur(4px)",
          display: "grid",
          placeItems: "center",
          zIndex: 1000,
          padding: 16,
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: 20,
            maxWidth: 760,
            width: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              background: "#fafafa",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: selectedMentor.color || ORANGE, color: "#ffffff",
                  display: "grid", placeItems: "center", fontSize: 18, fontWeight: 800,
                }}>
                  {selectedMentor.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
                    {selectedMentor.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, fontSize: 12, color: "#64748b" }}>
                    <span>{selectedMentor.email}</span>
                    <span>·</span>
                    <span>{selectedMentor.college || "Mentor"}</span>
                    <span>·</span>
                    <span style={{
                      padding: "2px 7px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                      background: selectedMentor.active ? "#ecfdf5" : "#fef2f2",
                      color: selectedMentor.active ? "#059669" : "#dc2626",
                    }}>
                      {selectedMentor.active ? "Active Account" : "Deactivated"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeMentorDetail}
                style={{
                  background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
                  padding: 4, display: "grid", placeItems: "center", borderRadius: 8,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Quick Stat Pill Cards */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: 10,
              }}>
                <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Period Logins</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
                    {selectedMentor.totalLogins}
                  </div>
                </div>
                <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>All-Time Logins</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
                    {selectedMentor.allTimeLogins ?? selectedMentor.totalLogins}
                  </div>
                </div>
                <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Assigned Students</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
                    {selectedMentor.assignedStudentsCount}
                  </div>
                </div>
                <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Tasks Completed</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#16a34a", marginTop: 2 }}>
                    {selectedMentor.tasksCompleted} / {selectedMentor.tasksAssigned}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs Inside Modal */}
              <div style={{
                display: "flex",
                gap: 6,
                borderBottom: "1.5px solid #f1f5f9",
                paddingBottom: 2,
              }}>
                {[
                  { id: "timeline", label: "Activity Timeline" },
                  { id: "students", label: "Assigned Students" },
                ].map((t) => {
                  const active = detailTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setDetailTab(t.id)}
                      style={{
                        padding: "8px 16px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: active ? 700 : 500,
                        fontSize: 13,
                        color: active ? ORANGE : "#64748b",
                        borderBottom: active ? `2px solid ${ORANGE}` : "2px solid transparent",
                        marginBottom: -2,
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {detailLoading ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                  Loading mentor details...
                </div>
              ) : detailTab === "timeline" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                    Verified Activity Stream
                  </div>

                  {(!detailData?.logs || detailData.logs.length === 0) ? (
                    <div style={{ color: "#94a3b8", fontSize: 12.5, padding: "20px 0", textAlign: "center" }}>
                      No recent activity events recorded in this period for this mentor.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {detailData.logs.map((log) => {
                        const d = new Date(log.createdAt);
                        return (
                          <div
                            key={log.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px 14px",
                              borderRadius: 10,
                              background: "#f8fafc",
                              border: "1px solid #f1f5f9",
                              fontSize: 12,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{
                                padding: "2px 7px", borderRadius: 6, fontSize: 10.5, fontWeight: 800,
                                background: log.action.includes("login") ? "#eff6ff" : "#f0fdf4",
                                color: log.action.includes("login") ? "#2563eb" : "#16a34a",
                              }}>
                                {log.action.replace("_", " ").toUpperCase()}
                              </span>
                              <span style={{ color: "#1e293b" }}>
                                {log.studentId ? `Student: ${log.studentId} (${log.studentName || ""})` : "Mentor session logged"}
                              </span>
                            </div>
                            <span style={{ color: "#94a3b8", fontSize: 11 }}>
                              {d.toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Assigned Students Tab */
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                    Assigned Students & Login Status
                  </div>

                  {(!detailData?.students || detailData.students.length === 0) ? (
                    <div style={{ color: "#94a3b8", fontSize: 12.5, padding: "20px 0", textAlign: "center" }}>
                      No students are currently assigned to this mentor.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {detailData.students.map((st) => (
                        <div
                          key={st.studentId}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 16px",
                            borderRadius: 10,
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13 }}>
                              {st.name} <span style={{ color: "#64748b", fontWeight: 500 }}>({st.studentId})</span>
                            </div>
                            <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                              Plan: {st.plan || "Paid"} · Last login: {fmtDate(st.lastLogin)}
                            </div>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <span style={{
                              padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                              background: st.hasLoggedInInRange ? "#ecfdf5" : "#fef2f2",
                              color: st.hasLoggedInInRange ? "#059669" : "#991b1b",
                            }}>
                              {st.hasLoggedInInRange ? `Active (${st.loginsCount} logins)` : "No Logins in Period"}
                            </span>
                            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                              {st.tasksCompleted} / {st.tasksCount} tasks completed
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "14px 24px",
              borderTop: "1px solid #f1f5f9",
              background: "#fafafa",
              display: "flex",
              justifyContent: "flex-end",
            }}>
              <button
                onClick={closeMentorDetail}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
