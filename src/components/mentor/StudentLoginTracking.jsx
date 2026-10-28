import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Activity, Calendar, Clock, Search, ArrowUpDown, Download,
  CheckCircle2, XCircle, AlertCircle, RefreshCw, Smartphone, Laptop,
  Filter, ChevronRight, Eye, ShieldCheck, PieChart,
} from "lucide-react";
import { apiMentorStudentLogins } from "../../auth/api.js";

const ACCENT = "#FF693D";
const SORA = "Sora, system-ui, sans-serif";

function fmtDate(iso) {
  if (!iso) return "Never";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
}

function timeAgo(iso) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return fmtDate(iso);
}

export default function StudentLoginTracking({ token, onSelectStudent }) {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive
  const [sortBy, setSortBy] = useState("logins"); // logins | name | lastLogin
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const fetchLogins = async (r = range) => {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const res = await apiMentorStudentLogins(token, r);
      setData(res);
    } catch (e) {
      setErr(e.message || "Could not load student login analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogins(range);
  }, [token, range]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];
    let list = [...data.students];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.studentId?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q)
      );
    }

    if (statusFilter === "active") list = list.filter((s) => s.isActive);
    if (statusFilter === "inactive") list = list.filter((s) => !s.isActive);

    list.sort((a, b) => {
      let diff = 0;
      if (sortBy === "logins") diff = (a.loginsInPeriod || 0) - (b.loginsInPeriod || 0);
      else if (sortBy === "name") diff = (a.name || "").localeCompare(b.name || "");
      else if (sortBy === "lastLogin") {
        const tA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const tB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        diff = tA - tB;
      }
      return sortAsc ? diff : -diff;
    });

    return list;
  }, [data, search, statusFilter, sortBy, sortAsc]);

  // Pie chart calculation
  const chartSegments = useMemo(() => {
    if (!data?.chartData || data.chartData.length === 0) return [];
    const total = data.summary?.totalLoginsInPeriod || 0;
    if (total === 0) return [];

    let cumAngle = 0;
    return data.chartData
      .filter((d) => d.val > 0)
      .map((d) => {
        const pct = (d.val / total) * 100;
        const angle = (pct / 100) * 360;
        const seg = {
          ...d,
          pct: Math.round(pct * 10) / 10,
          startAngle: cumAngle,
          angle,
        };
        cumAngle += angle;
        return seg;
      });
  }, [data]);

  // Export CSV of student logins
  const exportCsv = () => {
    if (!filteredStudents.length) return;
    const headers = [
      "Student ID",
      "Name",
      "Email",
      "Plan",
      `Logins (${range})`,
      "Lifetime Logins",
      "Status",
      "Last Login",
    ];
    const rows = filteredStudents.map((s) => [
      s.studentId,
      `"${s.name}"`,
      s.email,
      s.plan,
      s.loginsInPeriod,
      s.totalLifetimeLogins,
      s.isActive ? "Active" : "Inactive",
      s.lastLogin ? `"${new Date(s.lastLogin).toLocaleString()}"` : "Never",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student-logins-${range}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = data?.summary || {
    totalLoginsInPeriod: 0,
    activeStudentsCount: 0,
    inactiveStudentsCount: 0,
    totalAssigned: 0,
    activeDefinition: "Logged in at least once during the selected time period",
  };

  const activeRate = summary.totalAssigned
    ? Math.round((summary.activeStudentsCount / summary.totalAssigned) * 100)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Top Filter Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          padding: "12px 16px",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={18} color={ACCENT} />
          <div>
            <h3
              style={{
                fontFamily: SORA,
                fontSize: 15,
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Student Login Telemetry
            </h3>
            <p style={{ fontSize: 11.5, color: "#64748b", margin: 0 }}>
              Live portal authentication events for your assigned students
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Time Range Selector */}
          <div
            style={{
              display: "flex",
              background: "#f1f5f9",
              borderRadius: 10,
              padding: 3,
              gap: 2,
            }}
          >
            {[
              { key: "today", label: "Today" },
              { key: "7d", label: "Last 7 Days" },
              { key: "30d", label: "Last 30 Days" },
              { key: "all", label: "All Time" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setRange(btn.key)}
                style={{
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: 11.5,
                  fontWeight: range === btn.key ? 800 : 600,
                  cursor: "pointer",
                  background: range === btn.key ? "#fff" : "transparent",
                  color: range === btn.key ? ACCENT : "#64748b",
                  boxShadow: range === btn.key ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  transition: "all .15s ease",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchLogins(range)}
            disabled={loading}
            title="Refresh"
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              border: "1px solid #e2e8f0",
              background: "#fff",
              color: "#64748b",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} className={loading ? "cp-spin" : ""} />
          </button>
        </div>
      </div>

      {err && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: "11px 14px",
            fontSize: 12.5,
            color: "#b91c1c",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} /> {err}
        </div>
      )}

      {/* KPI Cards Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 12,
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: "14px 16px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(255,105,61,0.12)",
                color: ACCENT,
                display: "grid",
                placeItems: "center",
              }}
            >
              <Activity size={15} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
              Total Logins
            </span>
          </div>
          <div
            style={{
              fontFamily: SORA,
              fontSize: 24,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.1,
            }}
          >
            {summary.totalLoginsInPeriod}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Recorded in selected {range === "today" ? "day" : range}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: "14px 16px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(16,185,129,0.12)",
                color: "#10b981",
                display: "grid",
                placeItems: "center",
              }}
            >
              <CheckCircle2 size={15} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
              Active Students
            </span>
          </div>
          <div
            style={{
              fontFamily: SORA,
              fontSize: 24,
              fontWeight: 800,
              color: "#10b981",
              lineHeight: 1.1,
            }}
          >
            {summary.activeStudentsCount}{" "}
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
              / {summary.totalAssigned}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#10b981", marginTop: 4, fontWeight: 700 }}>
            {activeRate}% engagement rate
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: "14px 16px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(239,68,68,0.12)",
                color: "#ef4444",
                display: "grid",
                placeItems: "center",
              }}
            >
              <XCircle size={15} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
              No Recent Login
            </span>
          </div>
          <div
            style={{
              fontFamily: SORA,
              fontSize: 24,
              fontWeight: 800,
              color: summary.inactiveStudentsCount > 0 ? "#ef4444" : "#10b981",
              lineHeight: 1.1,
            }}
          >
            {summary.inactiveStudentsCount}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Pending portal check-in
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: "14px 16px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(59,130,246,0.12)",
                color: "#3b82f6",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Users size={15} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
              Assigned Group
            </span>
          </div>
          <div
            style={{
              fontFamily: SORA,
              fontSize: 24,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.1,
            }}
          >
            {summary.totalAssigned}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Total mentees under your guidance
          </div>
        </div>
      </div>

      {/* Active Definition Callout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: "8px 12px",
          fontSize: 11.5,
          color: "#64748b",
        }}
      >
        <ShieldCheck size={14} color={ACCENT} style={{ flexShrink: 0 }} />
        <span>
          <strong>Active Student Metric:</strong> {summary.activeDefinition}. Note: Login
          telemetry reflects platform access events, separate from study hours or test
          completion.
        </span>
      </div>

      {/* Interactive Pie Chart & Student Distribution Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))",
          gap: 16,
        }}
      >
        {/* Doughnut Chart Card */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: "18px 20px",
            boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <h4
                style={{
                  fontFamily: SORA,
                  fontWeight: 800,
                  fontSize: 14.5,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Login Volume Distribution
              </h4>
              <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>
                Hover over a slice to see detailed mentee stats
              </p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: ACCENT,
                background: `${ACCENT}12`,
                padding: "3px 8px",
                borderRadius: 50,
              }}
            >
              {summary.totalLoginsInPeriod} Logins
            </span>
          </div>

          {summary.totalLoginsInPeriod === 0 ? (
            <div
              style={{
                padding: "48px 20px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 13,
                display: "grid",
                placeItems: "center",
              }}
            >
              <PieChart size={36} color="#cbd5e1" style={{ marginBottom: 8 }} />
              <div>No student logins recorded during this timeframe.</div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 24,
                padding: "10px 0",
              }}
            >
              {/* Pure SVG Doughnut */}
              <div style={{ position: "relative", width: 190, height: 190 }}>
                <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ transform: "rotate(-90deg)" }}>
                  {chartSegments.map((seg, i) => {
                    const radius = 38;
                    const circumference = 2 * Math.PI * radius;
                    const strokeLen = (seg.pct / 100) * circumference;
                    const strokeOffset =
                      circumference - (seg.startAngle / 360) * circumference;
                    const isHovered = hoveredSegment?.studentId === seg.studentId;

                    return (
                      <circle
                        key={seg.studentId || i}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={isHovered ? 18 : 14}
                        strokeDasharray={`${strokeLen} ${circumference}`}
                        strokeDashoffset={strokeOffset}
                        style={{
                          transition: "stroke-width 0.2s ease, opacity 0.2s ease",
                          cursor: "pointer",
                          opacity: hoveredSegment && !isHovered ? 0.45 : 1,
                        }}
                        onMouseEnter={() => setHoveredSegment(seg)}
                        onMouseLeave={() => setHoveredSegment(null)}
                        onClick={() => onSelectStudent && onSelectStudent(seg.studentId)}
                      />
                    );
                  })}
                </svg>

                {/* Center Stats Display */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  {hoveredSegment ? (
                    <>
                      <div
                        style={{
                          fontFamily: SORA,
                          fontSize: 20,
                          fontWeight: 800,
                          color: hoveredSegment.color,
                          lineHeight: 1,
                        }}
                      >
                        {hoveredSegment.val}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#64748b",
                          maxWidth: 80,
                          textAlign: "center",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginTop: 3,
                        }}
                      >
                        {hoveredSegment.name}
                      </div>
                      <div style={{ fontSize: 9.5, color: "#94a3b8" }}>
                        {hoveredSegment.pct}%
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          fontFamily: SORA,
                          fontSize: 22,
                          fontWeight: 800,
                          color: "#0f172a",
                          lineHeight: 1,
                        }}
                      >
                        {summary.totalLoginsInPeriod}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: "#64748b",
                          marginTop: 3,
                        }}
                      >
                        Total Logins
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Interactive Legend */}
              <div
                style={{
                  flex: 1,
                  minWidth: 160,
                  maxHeight: 190,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  paddingRight: 4,
                }}
              >
                {data.chartData.map((d) => {
                  const isHovered = hoveredSegment?.studentId === d.studentId;
                  return (
                    <div
                      key={d.studentId}
                      onMouseEnter={() => setHoveredSegment(d)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      onClick={() => onSelectStudent && onSelectStudent(d.studentId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "5px 8px",
                        borderRadius: 8,
                        background: isHovered ? "#f8fafc" : "transparent",
                        cursor: "pointer",
                        transition: "background .15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: d.color,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: isHovered ? 700 : 500,
                            color: isHovered ? "#0f172a" : "#475569",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.name}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: d.val > 0 ? "#0f172a" : "#94a3b8",
                          flexShrink: 0,
                          marginLeft: 8,
                        }}
                      >
                        {d.val}{" "}
                        <span style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 500 }}>
                          ({d.percentage}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Recent Authentication Live Stream */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: "18px 20px",
            boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>
              <h4
                style={{
                  fontFamily: SORA,
                  fontWeight: 800,
                  fontSize: 14.5,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Recent Authentication Feed
              </h4>
              <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>
                Chronological timeline of assigned student logins
              </p>
            </div>
            <Clock size={16} color="#64748b" />
          </div>

          <div
            style={{
              flex: 1,
              maxHeight: 220,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {data?.historyTimeline && data.historyTimeline.length > 0 ? (
              data.historyTimeline.slice(0, 15).map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: ev.color || ACCENT,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#0f172a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.studentName}{" "}
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: "#64748b",
                          background: "#e2e8f0",
                          borderRadius: 4,
                          padding: "1px 4px",
                        }}
                      >
                        {ev.studentId}
                      </span>
                    </div>
                    <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 1 }}>
                      {ev.userAgent?.includes("Mobile") ? "Mobile App/Web" : "Desktop Browser"} ·{" "}
                      {fmtDate(ev.timestamp)}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#64748b",
                      flexShrink: 0,
                    }}
                  >
                    {timeAgo(ev.timestamp)}
                  </span>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "40px 10px",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: 12.5,
                }}
              >
                No login events logged for this timeframe yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Searchable, Sortable Students Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          padding: "18px 20px",
          boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h4
              style={{
                fontFamily: SORA,
                fontWeight: 800,
                fontSize: 15,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Assigned Students Telemetry Table
            </h4>
            <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0" }}>
              Detailed breakdown of login frequency, status, and latest access
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {/* Search Box */}
            <div style={{ position: "relative", minWidth: 180 }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                placeholder="Search mentee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "7px 10px 7px 30px",
                  borderRadius: 9,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "7px 10px",
                borderRadius: 9,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                color: "#334155",
                background: "#fff",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={exportCsv}
              disabled={filteredStudents.length === 0}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                borderRadius: 9,
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#334155",
                fontSize: 12,
                fontWeight: 600,
                cursor: filteredStudents.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: 12.5,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1.5px solid #e2e8f0",
                  color: "#64748b",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                <th
                  onClick={() => {
                    setSortBy("name");
                    setSortAsc(!sortAsc);
                  }}
                  style={{ padding: "10px 12px", cursor: "pointer" }}
                >
                  Mentee Name &amp; ID {sortBy === "name" && (sortAsc ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => {
                    setSortBy("logins");
                    setSortAsc(!sortAsc);
                  }}
                  style={{ padding: "10px 12px", cursor: "pointer", textAlign: "center" }}
                >
                  Logins ({range}) {sortBy === "logins" && (sortAsc ? "↑" : "↓")}
                </th>
                <th style={{ padding: "10px 12px", textAlign: "center" }}>Lifetime</th>
                <th style={{ padding: "10px 12px" }}>Status</th>
                <th
                  onClick={() => {
                    setSortBy("lastLogin");
                    setSortAsc(!sortAsc);
                  }}
                  style={{ padding: "10px 12px", cursor: "pointer" }}
                >
                  Last Active {sortBy === "lastLogin" && (sortAsc ? "↑" : "↓")}
                </th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "36px 12px",
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    No student records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const isExp = expandedStudent === s.studentId;
                  return (
                    <>
                      <tr
                        key={s.studentId}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          transition: "background .15s",
                          background: isExp ? "#f8fafc" : "transparent",
                        }}
                      >
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: s.color,
                                flexShrink: 0,
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 800, color: "#0f172a" }}>
                                {s.name}
                              </div>
                              <div style={{ fontSize: 11, color: "#64748b" }}>
                                {s.studentId} · {s.plan}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            fontFamily: SORA,
                            fontWeight: 800,
                            fontSize: 14,
                            color: s.loginsInPeriod > 0 ? ACCENT : "#94a3b8",
                          }}
                        >
                          {s.loginsInPeriod}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          {s.totalLifetimeLogins}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {s.isActive ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: "rgba(16,185,129,0.12)",
                                color: "#10b981",
                                padding: "3px 9px",
                                borderRadius: 50,
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              <CheckCircle2 size={12} /> Active
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: "#f1f5f9",
                                color: "#94a3b8",
                                padding: "3px 9px",
                                borderRadius: 50,
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              <XCircle size={12} /> Inactive
                            </span>
                          )}
                        </td>

                        <td style={{ padding: "12px", fontSize: 12, color: "#475569" }}>
                          {s.lastLogin ? (
                            <div>
                              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                                {timeAgo(s.lastLogin)}
                              </div>
                              <div style={{ fontSize: 10.5, color: "#94a3b8" }}>
                                {fmtDate(s.lastLogin)}
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>Never</span>
                          )}
                        </td>

                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <button
                              onClick={() =>
                                setExpandedStudent(isExp ? null : s.studentId)
                              }
                              style={{
                                padding: "5px 9px",
                                borderRadius: 7,
                                border: "1px solid #e2e8f0",
                                background: isExp ? "#e2e8f0" : "#fff",
                                color: "#475569",
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              {isExp ? "Hide Logs" : "View Logs"}
                            </button>

                            <button
                              onClick={() => onSelectStudent && onSelectStudent(s.studentId)}
                              style={{
                                padding: "5px 9px",
                                borderRadius: 7,
                                border: "none",
                                background: ACCENT,
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Report →
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Log Details Row */}
                      {isExp && (
                        <tr style={{ background: "#f8fafc" }}>
                          <td colSpan={6} style={{ padding: "14px 18px" }}>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#0f172a",
                                marginBottom: 8,
                              }}
                            >
                              Recent Access Logs for {s.name} ({s.studentId}):
                            </div>
                            {s.recentEvents && s.recentEvents.length > 0 ? (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "repeat(auto-fit, minmax(240px, 1fr))",
                                  gap: 8,
                                }}
                              >
                                {s.recentEvents.map((ev, ei) => (
                                  <div
                                    key={ei}
                                    style={{
                                      background: "#fff",
                                      border: "1px solid #e2e8f0",
                                      borderRadius: 8,
                                      padding: "8px 10px",
                                      fontSize: 11,
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: 700,
                                        color: "#0f172a",
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span>Session #{ei + 1}</span>
                                      <span style={{ color: "#64748b" }}>
                                        {timeAgo(ev.timestamp)}
                                      </span>
                                    </div>
                                    <div style={{ color: "#64748b", marginTop: 2 }}>
                                      {fmtDate(ev.timestamp)}
                                    </div>
                                    <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 1 }}>
                                      Device: {ev.userAgent?.slice(0, 45) || "Web"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                                No specific telemetry events recorded for this mentee.
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
