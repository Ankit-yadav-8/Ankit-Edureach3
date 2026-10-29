import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Activity, Calendar, Clock, Search, ArrowUpDown, Download,
  CheckCircle2, XCircle, AlertCircle, RefreshCw, Smartphone, Laptop,
  Filter, ChevronRight, Eye, ShieldCheck, PieChart, User, ExternalLink,
  ArrowRight, BarChart3, Radio, Sparkles
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

function parseDevice(ua) {
  if (!ua) return { name: "Web Session", icon: Laptop };
  const str = ua.toLowerCase();
  if (str.includes("iphone") || str.includes("ipad") || str.includes("ios")) {
    return { name: "iOS Mobile", icon: Smartphone };
  }
  if (str.includes("android")) {
    return { name: "Android Mobile", icon: Smartphone };
  }
  if (str.includes("mobile")) {
    return { name: "Mobile Web", icon: Smartphone };
  }
  if (str.includes("windows")) {
    return { name: "Windows PC", icon: Laptop };
  }
  if (str.includes("macintosh") || str.includes("mac os")) {
    return { name: "Mac OS", icon: Laptop };
  }
  if (str.includes("linux")) {
    return { name: "Linux PC", icon: Laptop };
  }
  return { name: "Desktop Web", icon: Laptop };
}

function parseBrowser(ua) {
  if (!ua) return "Portal Access";
  const str = ua.toLowerCase();
  if (str.includes("edg")) return "Microsoft Edge";
  if (str.includes("chrome")) return "Google Chrome";
  if (str.includes("safari") && !str.includes("chrome")) return "Apple Safari";
  if (str.includes("firefox")) return "Mozilla Firefox";
  return "Web Browser";
}

export default function StudentLoginTracking({
  token,
  activeStudentId,
  students: propStudents = [],
  onSelectStudent,
  onOpenReport,
}) {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // View Mode: "student" (Selected Student Focus) | "all" (All Mentees Overview)
  const [viewMode, setViewMode] = useState("student");

  // Selected student state (defaults to activeStudentId or first propStudent)
  const [selectedSid, setSelectedSid] = useState(
    activeStudentId || propStudents[0]?.studentId || ""
  );

  // Sync selectedSid whenever activeStudentId prop changes
  useEffect(() => {
    if (activeStudentId) {
      setSelectedSid(activeStudentId);
    }
  }, [activeStudentId]);

  // Overview table states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("logins");
  const [sortAsc, setSortAsc] = useState(false);

  const fetchLogins = async (r = range) => {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const res = await apiMentorStudentLogins(token, r);
      setData(res);
      // If no student is currently selected, select first available
      if (!selectedSid && res?.students?.length) {
        setSelectedSid(res.students[0].studentId);
      }
    } catch (e) {
      setErr(e.message || "Could not load student login telemetry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogins(range);
  }, [token, range]);

  // Student list combining API results or prop fallback
  const studentList = useMemo(() => {
    if (data?.students && data.students.length > 0) return data.students;
    if (propStudents && propStudents.length > 0) {
      return propStudents.map((s) => ({
        studentId: s.studentId,
        name: s.name,
        email: s.email,
        plan: s.plan,
        color: ACCENT,
        loginsInPeriod: 0,
        totalLifetimeLogins: 0,
        lastLogin: null,
        isActive: false,
        recentEvents: [],
      }));
    }
    return [];
  }, [data, propStudents]);

  // The actively selected student object
  const currentStudent = useMemo(() => {
    if (!studentList.length) return null;
    const match = studentList.find(
      (s) => s.studentId?.toUpperCase() === selectedSid?.toUpperCase()
    );
    return match || studentList[0];
  }, [studentList, selectedSid]);

  // Handler to switch selected mentee
  const handleSelectMentee = (sid) => {
    setSelectedSid(sid);
    if (onSelectStudent) onSelectStudent(sid);
  };

  // Filtered & sorted list for the All Mentees table
  const filteredStudents = useMemo(() => {
    let list = [...studentList];
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
  }, [studentList, search, statusFilter, sortBy, sortAsc]);

  // Cohort summary
  const summary = data?.summary || {
    totalLoginsInPeriod: 0,
    activeStudentsCount: 0,
    inactiveStudentsCount: 0,
    totalAssigned: studentList.length,
    activeDefinition: "Logged in at least once during the selected time period",
  };

  // Selected student metrics
  const studentShare =
    summary.totalLoginsInPeriod > 0 && currentStudent?.loginsInPeriod
      ? Math.round((currentStudent.loginsInPeriod / summary.totalLoginsInPeriod) * 100)
      : 0;

  const avgCohortLogins = studentList.length
    ? (summary.totalLoginsInPeriod / studentList.length).toFixed(1)
    : "0";

  // Primary device info for current student
  const primaryDevice = parseDevice(currentStudent?.recentEvents?.[0]?.userAgent);
  const primaryBrowser = parseBrowser(currentStudent?.recentEvents?.[0]?.userAgent);

  // Consolidated session history for current student
  const sessionHistory = useMemo(() => {
    if (!currentStudent) return [];
    if (currentStudent.recentEvents && currentStudent.recentEvents.length > 0) {
      return currentStudent.recentEvents;
    }
    if (currentStudent.lastLogin) {
      return [
        {
          id: "synth-last",
          timestamp: currentStudent.lastLogin,
          ip: "Portal Web Access",
          userAgent: "Web Session",
          plan: currentStudent.plan,
        },
      ];
    }
    return [];
  }, [currentStudent]);

  // Export CSV for current student or all students
  const exportCsv = () => {
    if (viewMode === "student" && currentStudent) {
      const headers = ["Session #", "Date & Time", "Relative Time", "Device Info", "IP Address", "Plan"];
      const rows = sessionHistory.map((ev, i) => [
        `Session #${i + 1}`,
        `"${new Date(ev.timestamp).toLocaleString()}"`,
        `"${timeAgo(ev.timestamp)}"`,
        `"${ev.userAgent || "Web"}"`,
        `"${ev.ip || "Direct"}"`,
        `"${ev.plan || currentStudent.plan || ""}"`,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `telemetry-${currentStudent.studentId}-${range}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ["Student ID", "Name", "Email", "Plan", `Logins (${range})`, "Total Lifetime", "Status", "Last Active"];
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
      link.setAttribute("download", `mentees-login-summary-${range}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Responsive Inline CSS */}
      <style>{`
        .telemetry-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        @media (max-width: 860px) {
          .telemetry-kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        .telemetry-split-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 12px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .telemetry-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .mentee-pills-scroll {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }
        .mentee-pills-scroll::-webkit-scrollbar {
          display: none;
        }
        .kpi-card-hover {
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .kpi-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(15,23,42,0.06);
        }
      `}</style>

      {/* TOP COMPACT CONTROL STRIP */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "10px 14px",
          boxShadow: "0 1px 4px rgba(15,23,42,0.03)",
        }}
      >
        {/* Left Title & View Scope */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${ACCENT}15`,
              color: ACCENT,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Activity size={17} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <h3
                style={{
                  fontFamily: SORA,
                  fontSize: 14.5,
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Student Login Telemetry
              </h3>
              {viewMode === "student" && currentStudent && (
                <span
                  style={{
                    background: `${ACCENT}12`,
                    color: ACCENT,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentStudent.name}
                </span>
              )}
            </div>
            <p style={{ fontSize: 11, color: "#64748b", margin: "1px 0 0" }}>
              {viewMode === "student"
                ? "Live authentication events for selected student"
                : `Overview across all ${studentList.length} assigned mentees`}
            </p>
          </div>
        </div>

        {/* Right Controls: View Switcher + Time Range + Refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {/* View Mode Switcher: Selected Student vs All Mentees */}
          <div
            style={{
              display: "flex",
              background: "#f1f5f9",
              borderRadius: 8,
              padding: 2,
              gap: 2,
            }}
          >
            <button
              onClick={() => setViewMode("student")}
              style={{
                border: "none",
                borderRadius: 6,
                padding: "5px 10px",
                fontSize: 11.5,
                fontWeight: viewMode === "student" ? 700 : 500,
                cursor: "pointer",
                background: viewMode === "student" ? "#fff" : "transparent",
                color: viewMode === "student" ? "#0f172a" : "#64748b",
                boxShadow: viewMode === "student" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                transition: "all .12s ease",
              }}
            >
              <User size={13} color={viewMode === "student" ? ACCENT : "#64748b"} />
              Selected Student
            </button>
            <button
              onClick={() => setViewMode("all")}
              style={{
                border: "none",
                borderRadius: 6,
                padding: "5px 10px",
                fontSize: 11.5,
                fontWeight: viewMode === "all" ? 700 : 500,
                cursor: "pointer",
                background: viewMode === "all" ? "#fff" : "transparent",
                color: viewMode === "all" ? "#0f172a" : "#64748b",
                boxShadow: viewMode === "all" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                transition: "all .12s ease",
              }}
            >
              <Users size={13} color={viewMode === "all" ? ACCENT : "#64748b"} />
              All Mentees ({studentList.length})
            </button>
          </div>

          {/* Time Range Pills */}
          <div
            style={{
              display: "flex",
              background: "#f1f5f9",
              borderRadius: 8,
              padding: 2,
              gap: 1,
            }}
          >
            {[
              { key: "today", label: "Today" },
              { key: "7d", label: "7D" },
              { key: "30d", label: "30D" },
              { key: "all", label: "All" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setRange(btn.key)}
                style={{
                  border: "none",
                  borderRadius: 6,
                  padding: "5px 9px",
                  fontSize: 11,
                  fontWeight: range === btn.key ? 700 : 500,
                  cursor: "pointer",
                  background: range === btn.key ? "#fff" : "transparent",
                  color: range === btn.key ? ACCENT : "#64748b",
                  boxShadow: range === btn.key ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchLogins(range)}
            disabled={loading}
            title="Refresh Telemetry"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#fff",
              color: "#64748b",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={13} className={loading ? "cp-spin" : ""} />
          </button>
        </div>
      </div>

      {err && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: 12,
            color: "#b91c1c",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0 }} /> {err}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          VIEW MODE 1: SELECTED STUDENT FOCUS (DEFAULT & REQUESTED)
         ────────────────────────────────────────────────────────── */}
      {viewMode === "student" && (
        <>
          {/* MENTEE QUICK SWITCHER & IDENTITY BAR */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "12px 16px",
              boxShadow: "0 1px 4px rgba(15,23,42,0.03)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Top row: Identity & Direct Select dropdown */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar with Initials */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: currentStudent?.color
                      ? `linear-gradient(135deg, ${currentStudent.color}, #0f172a)`
                      : "linear-gradient(135deg, #FF693D, #FF8C68)",
                    color: "#fff",
                    fontFamily: SORA,
                    fontWeight: 800,
                    fontSize: 15,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {currentStudent?.name?.charAt(0) || "S"}
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h2
                      style={{
                        fontFamily: SORA,
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {currentStudent?.name || "Student Telemetry"}
                    </h2>

                    {/* Student ID badge */}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#475569",
                        background: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                        padding: "2px 6px",
                        borderRadius: 5,
                      }}
                    >
                      {currentStudent?.studentId}
                    </span>

                    {/* Plan badge */}
                    {currentStudent?.plan && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#6366f1",
                          background: "rgba(99,102,241,0.08)",
                          padding: "2px 6px",
                          borderRadius: 5,
                        }}
                      >
                        {currentStudent.plan}
                      </span>
                    )}

                    {/* Live Presence indicator */}
                    {currentStudent?.isActive ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#10b981",
                          background: "rgba(16,185,129,0.1)",
                          padding: "2px 7px",
                          borderRadius: 50,
                        }}
                      >
                        <CheckCircle2 size={12} /> Active in selected {range}
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#94a3b8",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          padding: "2px 7px",
                          borderRadius: 50,
                        }}
                      >
                        <XCircle size={12} /> Pending check-in
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                    {currentStudent?.email}
                  </div>
                </div>
              </div>

              {/* Direct Mentee Switcher Dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600 }}>
                  Switch Mentee:
                </span>
                <select
                  value={selectedSid}
                  onChange={(e) => handleSelectMentee(e.target.value)}
                  style={{
                    height: 34,
                    padding: "0 10px",
                    borderRadius: 8,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#0f172a",
                    outline: "none",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  {studentList.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.name} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Switcher Mentee Chips (1-Click selection) */}
            {studentList.length > 1 && (
              <div style={{ paddingTop: 4, borderTop: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>
                  ASSIGNED MENTEES ({studentList.length}):
                </div>
                <div className="mentee-pills-scroll">
                  {studentList.map((s) => {
                    const isSelected = s.studentId?.toUpperCase() === selectedSid?.toUpperCase();
                    return (
                      <button
                        key={s.studentId}
                        onClick={() => handleSelectMentee(s.studentId)}
                        style={{
                          border: isSelected ? "none" : "1px solid #e2e8f0",
                          background: isSelected ? ACCENT : "#f8fafc",
                          color: isSelected ? "#fff" : "#475569",
                          borderRadius: 8,
                          padding: "4px 10px",
                          fontSize: 11.5,
                          fontWeight: isSelected ? 800 : 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          transition: "all .12s ease",
                          boxShadow: isSelected ? "0 2px 6px rgba(255,105,61,0.25)" : "none",
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: isSelected
                              ? "#fff"
                              : s.isActive
                              ? "#10b981"
                              : "#cbd5e1",
                          }}
                        />
                        {s.name}
                        {s.loginsInPeriod > 0 && (
                          <span
                            style={{
                              background: isSelected ? "rgba(255,255,255,0.25)" : "#e2e8f0",
                              color: isSelected ? "#fff" : "#0f172a",
                              fontSize: 10,
                              fontWeight: 800,
                              padding: "1px 5px",
                              borderRadius: 4,
                            }}
                          >
                            {s.loginsInPeriod}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4 COMPACT TELEMETRY KPI CARDS (2x2 on mobile, 4 across on desktop) */}
          <div className="telemetry-kpi-grid">
            {/* Card 1: Logins in Period */}
            <div
              className="kpi-card-hover"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 1px 3px rgba(15,23,42,0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "rgba(255,105,61,0.12)",
                    color: ACCENT,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Activity size={13} />
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                  Period Logins
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                <div
                  style={{
                    fontFamily: SORA,
                    fontSize: 20,
                    fontWeight: 800,
                    color: currentStudent?.loginsInPeriod ? ACCENT : "#0f172a",
                    lineHeight: 1.1,
                  }}
                >
                  {currentStudent?.loginsInPeriod || 0}
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                  Recorded in {range === "today" ? "today" : range}
                </div>
              </div>
            </div>

            {/* Card 2: Last Active Session */}
            <div
              className="kpi-card-hover"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 1px 3px rgba(15,23,42,0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "rgba(59,130,246,0.12)",
                    color: "#3b82f6",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={13} />
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                  Last Active
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                <div
                  style={{
                    fontFamily: SORA,
                    fontSize: 16,
                    fontWeight: 800,
                    color: currentStudent?.lastLogin ? "#0f172a" : "#94a3b8",
                    lineHeight: 1.1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {timeAgo(currentStudent?.lastLogin)}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#94a3b8",
                    marginTop: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fmtDate(currentStudent?.lastLogin)}
                </div>
              </div>
            </div>

            {/* Card 3: Lifetime Logins */}
            <div
              className="kpi-card-hover"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 1px 3px rgba(15,23,42,0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "rgba(16,185,129,0.12)",
                    color: "#10b981",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={13} />
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                  Lifetime Sessions
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                <div
                  style={{
                    fontFamily: SORA,
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.1,
                  }}
                >
                  {currentStudent?.totalLifetimeLogins || 0}
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                  All-time portal authentications
                </div>
              </div>
            </div>

            {/* Card 4: Access Platform */}
            <div
              className="kpi-card-hover"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 1px 3px rgba(15,23,42,0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "rgba(139,92,246,0.12)",
                    color: "#8b5cf6",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <primaryDevice.icon size={13} />
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                  Platform / Device
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                <div
                  style={{
                    fontFamily: SORA,
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {primaryDevice.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#94a3b8",
                    marginTop: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {primaryBrowser}
                </div>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN DETAILS: SESSION LOGS TIMELINE + ENGAGEMENT CONTEXT */}
          <div className="telemetry-split-grid">
            {/* Column 1: Selected Student Session History Timeline */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: "14px 16px",
                boxShadow: "0 1px 4px rgba(15,23,42,0.03)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontFamily: SORA,
                      fontWeight: 800,
                      fontSize: 14,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    Authentication Audit Trail for {currentStudent?.name || "Mentee"}
                  </h4>
                  <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>
                    Verified platform login events with device fingerprints
                  </p>
                </div>

                <button
                  onClick={exportCsv}
                  disabled={sessionHistory.length === 0}
                  style={{
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    borderRadius: 7,
                    padding: "4px 9px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#334155",
                    cursor: sessionHistory.length === 0 ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Download size={12} /> Export CSV
                </button>
              </div>

              {/* Scrollable Timeline Feed (compact max-height, never endless scrolling!) */}
              <div
                className="cp-custom-scroll"
                style={{
                  maxHeight: 260,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  paddingRight: 4,
                }}
              >
                {sessionHistory.length > 0 ? (
                  sessionHistory.map((ev, idx) => {
                    const dev = parseDevice(ev.userAgent);
                    const browser = parseBrowser(ev.userAgent);
                    return (
                      <div
                        key={ev.id || idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                          padding: "9px 12px",
                          borderRadius: 9,
                          background: idx === 0 ? "#f0fdf4" : "#f8fafc",
                          border: idx === 0 ? "1px solid #bbf7d0" : "1px solid #f1f5f9",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                          <span
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 7,
                              background: idx === 0 ? "rgba(16,185,129,0.15)" : "#e2e8f0",
                              color: idx === 0 ? "#10b981" : "#64748b",
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <dev.icon size={15} />
                          </span>

                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontWeight: 800, fontSize: 12.5, color: "#0f172a" }}>
                                Session #{sessionHistory.length - idx}
                              </span>
                              {idx === 0 && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#166534",
                                    background: "#dcfce7",
                                    padding: "1px 5px",
                                    borderRadius: 4,
                                  }}
                                >
                                  Latest
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "#64748b",
                                marginTop: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {dev.name} · {browser}
                              {ev.ip && ev.ip !== "Direct" ? ` · IP: ${ev.ip}` : ""}
                            </div>
                          </div>
                        </div>

                        {/* Timestamp Right Pill */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div
                            style={{
                              fontSize: 11.5,
                              fontWeight: 700,
                              color: idx === 0 ? "#166534" : "#0f172a",
                            }}
                          >
                            {timeAgo(ev.timestamp)}
                          </div>
                          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>
                            {fmtDate(ev.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "36px 16px",
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: 12.5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Calendar size={32} color="#cbd5e1" />
                    <div>
                      No login sessions recorded for <strong>{currentStudent?.name}</strong> during the selected{" "}
                      <strong>{range === "today" ? "day" : range}</strong>.
                    </div>
                    <button
                      onClick={() => setRange("all")}
                      style={{
                        marginTop: 4,
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        color: ACCENT,
                        padding: "5px 12px",
                        borderRadius: 7,
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      View All Time Logs
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Engagement Context & Quick Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Engagement Insight Card */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: "14px 16px",
                  boxShadow: "0 1px 4px rgba(15,23,42,0.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <BarChart3 size={16} color={ACCENT} />
                  <h4 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 13.5, color: "#0f172a", margin: 0 }}>
                    Cohort Engagement Share
                  </h4>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
                    <span style={{ color: "#64748b", fontWeight: 600 }}>Mentee Contribution</span>
                    <span style={{ fontWeight: 800, color: ACCENT }}>{studentShare}%</span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 8,
                      borderRadius: 4,
                      background: "#f1f5f9",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, studentShare)}%`,
                        height: "100%",
                        background: ACCENT,
                        borderRadius: 4,
                        transition: "width .4s ease",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: 9,
                    padding: "8px 10px",
                    fontSize: 11,
                    color: "#475569",
                    lineHeight: 1.45,
                  }}
                >
                  <div>
                    • <strong>Cohort Avg:</strong> {avgCohortLogins} logins/student in {range}.
                  </div>
                  <div style={{ marginTop: 2 }}>
                    • <strong>Status:</strong>{" "}
                    {currentStudent?.loginsInPeriod >= Number(avgCohortLogins) ? (
                      <span style={{ color: "#10b981", fontWeight: 700 }}>
                        At/Above group average ({currentStudent?.loginsInPeriod} logins)
                      </span>
                    ) : (
                      <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                        Below group average ({currentStudent?.loginsInPeriod} logins)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Direct Mentor Actions Card */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: "14px 16px",
                  boxShadow: "0 1px 4px rgba(15,23,42,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>
                  MENTOR ACTIONS
                </div>

                {/* Jump to Student Report */}
                <button
                  onClick={() => onOpenReport && onOpenReport(selectedSid)}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: 9,
                    padding: "9px 12px",
                    background: ACCENT,
                    color: "#fff",
                    fontFamily: SORA,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(255,105,61,0.25)",
                    transition: "transform .12s ease",
                  }}
                >
                  <span>Open Student Workspace &amp; Tasks</span>
                  <ArrowRight size={14} />
                </button>

                {/* Switch to All Mentees Overview */}
                <button
                  onClick={() => setViewMode("all")}
                  style={{
                    width: "100%",
                    border: "1px solid #e2e8f0",
                    borderRadius: 9,
                    padding: "8px 12px",
                    background: "#f8fafc",
                    color: "#334155",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Compare All Assigned Mentees</span>
                  <Users size={14} color="#64748b" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          VIEW MODE 2: ALL MENTEES OVERVIEW (COMPACT, NO LENGTHY CARDS)
         ────────────────────────────────────────────────────────── */}
      {viewMode === "all" && (
        <>
          {/* 4 Compact Summary Metrics in 1 tidy row (grid) */}
          <div className="telemetry-kpi-grid">
            <div
              className="kpi-card-hover"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "rgba(255,105,61,0.12)",
                    color: ACCENT,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Activity size={13} />
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                  Total Group Logins
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ fontFamily: SORA, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                  {summary.totalLoginsInPeriod}
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                  Recorded in {range}
                </div>
              </div>
            </div>

            <div
              className="kpi-card-hover"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "rgba(16,185,129,0.12)",
                    color: "#10b981",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CheckCircle2 size={13} />
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                  Active Students
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ fontFamily: SORA, fontSize: 20, fontWeight: 800, color: "#10b981" }}>
                  {summary.activeStudentsCount}{" "}
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                    / {summary.totalAssigned}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: "#10b981", marginTop: 2, fontWeight: 700 }}>
                  {summary.totalAssigned ? Math.round((summary.activeStudentsCount / summary.totalAssigned) * 100) : 0}% engagement
                </div>
              </div>
            </div>

            <div
              className="kpi-card-hover"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "rgba(239,68,68,0.12)",
                    color: "#ef4444",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <XCircle size={13} />
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                  No Recent Login
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                <div
                  style={{
                    fontFamily: SORA,
                    fontSize: 20,
                    fontWeight: 800,
                    color: summary.inactiveStudentsCount > 0 ? "#ef4444" : "#10b981",
                  }}
                >
                  {summary.inactiveStudentsCount}
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                  Pending portal check-in
                </div>
              </div>
            </div>

            <div
              className="kpi-card-hover"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "rgba(59,130,246,0.12)",
                    color: "#3b82f6",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Users size={13} />
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                  Assigned Group
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ fontFamily: SORA, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                  {summary.totalAssigned}
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                  Avg {avgCohortLogins} logins/student
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Table */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "14px 16px",
              boxShadow: "0 1px 4px rgba(15,23,42,0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h4 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 14, color: "#0f172a", margin: 0 }}>
                  Assigned Mentees Telemetry Table
                </h4>
                <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>
                  Click "View Telemetry" to focus on any individual student
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {/* Search */}
                <div style={{ position: "relative", minWidth: 160 }}>
                  <Search
                    size={13}
                    style={{
                      position: "absolute",
                      left: 9,
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
                      padding: "6px 8px 6px 28px",
                      borderRadius: 7,
                      border: "1px solid #e2e8f0",
                      fontSize: 11.5,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 7,
                    border: "1px solid #e2e8f0",
                    fontSize: 11.5,
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

                {/* Export */}
                <button
                  onClick={exportCsv}
                  disabled={filteredStudents.length === 0}
                  style={{
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    borderRadius: 7,
                    padding: "6px 10px",
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "#334155",
                    cursor: filteredStudents.length === 0 ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Download size={12} /> Export CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="cp-custom-scroll" style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1.5px solid #e2e8f0",
                      color: "#64748b",
                      fontSize: 10.5,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    <th
                      onClick={() => {
                        setSortBy("name");
                        setSortAsc(!sortAsc);
                      }}
                      style={{ padding: "8px 10px", cursor: "pointer" }}
                    >
                      Mentee Name &amp; ID {sortBy === "name" && (sortAsc ? "↑" : "↓")}
                    </th>
                    <th
                      onClick={() => {
                        setSortBy("logins");
                        setSortAsc(!sortAsc);
                      }}
                      style={{ padding: "8px 10px", cursor: "pointer", textAlign: "center" }}
                    >
                      Logins ({range}) {sortBy === "logins" && (sortAsc ? "↑" : "↓")}
                    </th>
                    <th style={{ padding: "8px 10px", textAlign: "center" }}>Lifetime</th>
                    <th style={{ padding: "8px 10px" }}>Status</th>
                    <th
                      onClick={() => {
                        setSortBy("lastLogin");
                        setSortAsc(!sortAsc);
                      }}
                      style={{ padding: "8px 10px", cursor: "pointer" }}
                    >
                      Last Active {sortBy === "lastLogin" && (sortAsc ? "↑" : "↓")}
                    </th>
                    <th style={{ padding: "8px 10px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "28px 12px", textAlign: "center", color: "#94a3b8" }}>
                        No students match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr
                        key={s.studentId}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          transition: "background .12s",
                        }}
                      >
                        <td style={{ padding: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: s.color || ACCENT,
                                flexShrink: 0,
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: "#0f172a" }}>{s.name}</div>
                              <div style={{ fontSize: 10.5, color: "#64748b" }}>
                                {s.studentId} {s.plan ? `· ${s.plan}` : ""}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td
                          style={{
                            padding: "10px",
                            textAlign: "center",
                            fontFamily: SORA,
                            fontWeight: 800,
                            color: s.loginsInPeriod > 0 ? ACCENT : "#94a3b8",
                          }}
                        >
                          {s.loginsInPeriod}
                        </td>

                        <td style={{ padding: "10px", textAlign: "center", color: "#475569" }}>
                          {s.totalLifetimeLogins}
                        </td>

                        <td style={{ padding: "10px" }}>
                          {s.isActive ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: "rgba(16,185,129,0.1)",
                                color: "#10b981",
                                padding: "2px 7px",
                                borderRadius: 50,
                                fontSize: 10.5,
                                fontWeight: 700,
                              }}
                            >
                              <CheckCircle2 size={11} /> Active
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: "#f1f5f9",
                                color: "#94a3b8",
                                padding: "2px 7px",
                                borderRadius: 50,
                                fontSize: 10.5,
                                fontWeight: 600,
                              }}
                            >
                              <XCircle size={11} /> Inactive
                            </span>
                          )}
                        </td>

                        <td style={{ padding: "10px", color: "#475569" }}>
                          {s.lastLogin ? (
                            <div>
                              <div style={{ fontWeight: 600, color: "#0f172a" }}>{timeAgo(s.lastLogin)}</div>
                              <div style={{ fontSize: 10, color: "#94a3b8" }}>{fmtDate(s.lastLogin)}</div>
                            </div>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>Never</span>
                          )}
                        </td>

                        <td style={{ padding: "10px", textAlign: "right" }}>
                          <button
                            onClick={() => {
                              handleSelectMentee(s.studentId);
                              setViewMode("student");
                            }}
                            style={{
                              border: "none",
                              borderRadius: 6,
                              padding: "5px 10px",
                              background: `${ACCENT}15`,
                              color: ACCENT,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            View Telemetry →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
