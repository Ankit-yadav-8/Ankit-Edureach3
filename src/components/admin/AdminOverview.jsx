import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users, UserCheck, CheckCircle2, Clock, Calendar, RefreshCw,
  Activity, ArrowUpRight, TrendingUp, Sparkles, Filter, ChevronRight,
  Layers, CreditCard, GraduationCap, Trophy, ChevronDown, CheckSquare,
  Zap, ArrowRight, UserPlus, FileText, Check, ShieldCheck, Mail, Phone, Video, Award
} from "lucide-react";
import { apiAdminAnalyticsOverview, apiAdminMentorTracking } from "../../auth/api.js";

const ORANGE = "#FF693D";

// Vibrant, accessible palette matching the SaaS analytics reference design
const DONUT_COLORS = [
  "#FF693D", // Orange (Campus Point primary)
  "#3B82F6", // Royal Blue
  "#10B981", // Emerald Green
  "#8B5CF6", // Purple
  "#EC4899", // Magenta Pink
  "#F59E0B", // Amber Gold
  "#06B6D4", // Electric Cyan
  "#94A3B8", // Slate Gray (Others)
];

export default function AdminOverview({ adminToken, dateRange = "30d", onNavigateTab }) {
  const [data, setData] = useState(null);
  const [mentorData, setMentorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedRange, setSelectedRange] = useState(dateRange);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Middle panel controls
  const [mentorMetric, setMentorMetric] = useState("logins"); // "logins" | "tasks" | "students"
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);
  const [chartRange, setChartRange] = useState("30d"); // "7d" | "30d" | "custom"

  // Fast single-roundtrip analytics fetch
  const loadData = useCallback(async (r, start, end) => {
    setLoading(true);
    setErr("");
    try {
      const overviewRes = await apiAdminAnalyticsOverview(adminToken, r, start, end);
      setData(overviewRes);
      if (overviewRes?.mentorsSummary) {
        setMentorData(overviewRes.mentorsSummary);
      } else {
        const trackingRes = await apiAdminMentorTracking(adminToken, r, start, end).catch(() => ({ mentors: [] }));
        setMentorData(trackingRes?.mentors || []);
      }
    } catch (e) {
      setErr(e.message || "Could not load overview analytics");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    loadData(selectedRange, customStart, customEnd);
  }, [loadData, selectedRange, customStart, customEnd]);

  // Sync prop changes
  useEffect(() => {
    if (dateRange && dateRange !== selectedRange) {
      setSelectedRange(dateRange);
    }
  }, [dateRange]);

  const metrics = data?.metrics || {};
  const todayStats = data?.todayStats || {};
  const rawDailyTrend = data?.dailyTrend || [];
  const recentActivity = data?.recentActivity || [];

  // Filter daily trend based on chartRange toggle ("7d", "30d", "custom")
  const filteredDailyTrend = useMemo(() => {
    if (!rawDailyTrend.length) {
      // Clean zero baseline if no events logged yet
      const days = chartRange === "7d" ? 7 : 30;
      const res = [];
      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        res.push({
          date: d.toISOString().split("T")[0],
          label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          studentLogins: 0,
          mentorLogins: 0,
          totalLogins: 0,
        });
      }
      return res;
    }
    if (chartRange === "7d") {
      return rawDailyTrend.slice(-7);
    }
    return rawDailyTrend;
  }, [rawDailyTrend, chartRange]);

  // Max value for SVG area chart scaling
  const maxChartValue = useMemo(() => {
    if (!filteredDailyTrend.length) return 200;
    const maxVal = Math.max(
      ...filteredDailyTrend.map((d) => Math.max(d.studentLogins || 0, d.mentorLogins || 0)),
      1
    );
    return Math.max(Math.ceil((maxVal * 1.3) / 10) * 10, 20);
  }, [filteredDailyTrend]);

  // Prepare Mentor Analytics Donut Data with real mentors only
  const donutBreakdown = useMemo(() => {
    let list = [];
    if (mentorData && mentorData.length > 0) {
      list = mentorData.map((m) => {
        let val = 0;
        if (mentorMetric === "logins") val = m.totalLogins || m.allTimeLogins || m.logins || 0;
        else if (mentorMetric === "tasks") val = m.tasksCompleted || 0;
        else if (mentorMetric === "students") val = m.assignedStudentsCount || m.assignedStudents?.length || 0;
        return {
          name: m.name || "Mentor",
          value: val,
        };
      });
      // Sort descending
      list.sort((a, b) => b.value - a.value);
    }

    if (!list.length) return [];

    // Keep top 7 mentors and group the rest into "Others"
    let top = list.slice(0, 7);
    if (list.length > 7) {
      const othersVal = list.slice(7).reduce((acc, curr) => acc + curr.value, 0);
      top.push({ name: "Others", value: othersVal });
    }

    const sum = top.reduce((acc, it) => acc + (it.value || 0), 0);
    let accumulatedAngle = 0;

    return top.map((item, idx) => {
      const percentage = sum > 0 ? Math.round((item.value / sum) * 100) : Math.round(100 / top.length);
      const color = DONUT_COLORS[idx % DONUT_COLORS.length];
      const startAngle = accumulatedAngle;
      accumulatedAngle += sum > 0 ? (item.value / sum) * 360 : (360 / top.length);

      return {
        ...item,
        percentage,
        color,
        startAngle,
        endAngle: accumulatedAngle,
      };
    });
  }, [mentorData, mentorMetric]);

  const totalDonutValue = useMemo(() => {
    return donutBreakdown.reduce((s, i) => s + i.value, 0);
  }, [donutBreakdown]);

  // Real mentors count
  const mentorCount = loading ? "..." : (metrics.activeMentors ?? (mentorData.length || 0));

  // Recent activity list formatted matching real database activity
  const formattedActivities = useMemo(() => {
    if (recentActivity && recentActivity.length > 0) {
      return recentActivity.slice(0, 7).map((act, index) => {
        const d = new Date(act.createdAt || Date.now());
        const timeFormatted = d.toLocaleString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit"
        });

        let type = "Platform Event";
        let typeIcon = Activity;
        let typeColor = "#64748b";
        let typeBg = "#f1f5f9";
        let name = act.mentorName || act.studentName || "Administrator";
        let details = "Activity logged in system";
        let status = "Success";
        let statusColor = "#16a34a";
        let statusBg = "#ecfdf5";

        const region = act.region || act.details?.region || "";
        const regionTag = region ? ` · ${region}` : "";

        if (act.action === "mentor_login") {
          type = "Mentor Login";
          typeIcon = Users;
          typeColor = "#2563eb";
          typeBg = "#eff6ff";
          details = `Logged in to mentor dashboard${regionTag}`;
        } else if (act.action === "student_login") {
          type = "Student Login";
          typeIcon = UserCheck;
          typeColor = "#059669";
          typeBg = "#ecfdf5";
          const planTag = act.details?.plan ? ` (${act.details.plan})` : "";
          details = `Logged in to student portal${planTag}${regionTag}`;
        } else if (act.action === "task_update" || act.action === "task_assign") {
          type = act.action === "task_assign" ? "Task Assigned" : "Task Updated";
          typeIcon = CheckSquare;
          typeColor = "#ea580c";
          typeBg = "#fff7ed";
          const target = act.studentName || act.studentId || "Student";
          details = act.details?.taskTitle || `Updated task for student ${target}${regionTag}`;
          status = "Completed";
          statusColor = "#2563eb";
          statusBg = "#eff6ff";
        } else if (act.action === "task_complete") {
          type = "Task Completed";
          typeIcon = CheckCircle2;
          typeColor = "#16a34a";
          typeBg = "#f0fdf4";
          const target = act.studentName || act.studentId || "Student";
          details = `Completed tasks for student ${target}${regionTag}`;
          status = "Verified";
          statusColor = "#16a34a";
          statusBg = "#ecfdf5";
        } else if (act.action === "session_update") {
          type = "Meeting Link Updated";
          typeIcon = Video;
          typeColor = "#0284c7";
          typeBg = "#e0f2fe";
          const target = act.studentName || act.studentId || "Student";
          const topic = act.details?.topic || "1-on-1 Session";
          const time = act.details?.time ? ` at ${act.details.time}` : "";
          details = `Updated 1-on-1 meet link for ${target} (${topic}${time}${regionTag})`;
          status = "Active";
          statusColor = "#0284c7";
          statusBg = "#e0f2fe";
        } else if (act.action === "test_submit") {
          type = "Test Submitted";
          typeIcon = Award;
          typeColor = "#8b5cf6";
          typeBg = "#f5f3ff";
          const target = act.studentName || act.studentId || "Student";
          const testTitle = act.details?.testTitle || "Mock Test";
          const score = act.details?.score !== undefined ? `${act.details.score}/${act.details.maxMarks || 0} marks` : "";
          const acc = act.details?.accuracy !== undefined ? ` · ${act.details.accuracy}% acc` : "";
          details = `${target} submitted ${testTitle} (${score}${acc}${regionTag})`;
          status = "Graded";
          statusColor = "#8b5cf6";
          statusBg = "#f5f3ff";
        } else if (act.action === "test_update") {
          type = "Test Updated";
          typeIcon = FileText;
          typeColor = "#6366f1";
          typeBg = "#eef2ff";
          const testTitle = act.details?.testTitle || "Test Paper";
          details = `Published/updated test ${testTitle} (${act.details?.category || "CBT"}${regionTag})`;
          status = "Published";
          statusColor = "#6366f1";
          statusBg = "#eef2ff";
        } else if (act.action === "mentor_inactivity_alert") {
          type = "Inactivity Reminder";
          typeIcon = Clock;
          typeColor = "#f59e0b";
          typeBg = "#fffbeb";
          details = `9 PM lobby notice to review student reports sent to ${act.mentorName || "mentor"}`;
          status = "Sent";
          statusColor = "#f59e0b";
          statusBg = "#fffbeb";
        } else if (act.action === "admin_email_to_mentor") {
          type = "Admin Email";
          typeIcon = Mail;
          typeColor = "#0d9488";
          typeBg = "#f0fdfa";
          details = `Email sent to ${act.mentorName || act.details?.target || "mentor"}: "${act.details?.subject || "Update"}"`;
          status = "Delivered";
          statusColor = "#0d9488";
          statusBg = "#f0fdfa";
        } else if (act.action === "mentor_create") {
          type = "New Mentor";
          typeIcon = GraduationCap;
          typeColor = "#7c3aed";
          typeBg = "#f5f3ff";
          details = `Registered as new mentor${regionTag}`;
        } else if (act.action === "payment_received" || act.action === "enrollment") {
          type = "Payment Received";
          typeIcon = CreditCard;
          typeColor = "#db2777";
          typeBg = "#fdf2f8";
          details = act.details?.amount ? `₹ ${act.details.amount} - Mentorship enrollment${regionTag}` : `Mentorship enrollment completed${regionTag}`;
        }

        const initials = (name || "U")
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return {
          id: act.id || index,
          time: timeFormatted,
          type,
          typeIcon,
          typeColor,
          typeBg,
          name,
          initials,
          details,
          status,
          statusColor,
          statusBg,
        };
      });
    }

    return [];
  }, [recentActivity]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      {/* ── Page Greeting & Live Pulse Bar ── */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <span>Welcome back, Admin</span>
            <span role="img" aria-label="wave">👋</span>
          </div>
          <h1 style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: "#0f172a",
            margin: "4px 0 0",
            letterSpacing: -0.3,
          }}>
            Here&apos;s what&apos;s happening with Campus Point
          </h1>
          <p style={{ fontSize: 11.5, color: "#64748b", margin: "3px 0 0" }}>
            Track mentors, students, tasks and overall platform activity in one place.
          </p>
        </div>

        {/* Live Status indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          padding: "5px 12px",
          borderRadius: 20,
          boxShadow: "0 1px 3px rgba(15,23,42,0.03)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#16a34a",
              boxShadow: "0 0 8px rgba(22,163,74,0.6)",
              display: "inline-block",
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#166534" }}>Live</span>
          </div>
          <span style={{ color: "#cbd5e1" }}>|</span>
          <span style={{ fontSize: 10.5, color: "#64748b" }}>
            Last updated: {new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {err && (
        <div style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          padding: "10px 14px",
          borderRadius: 10,
          color: "#991b1b",
          fontSize: 12,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span>{err}</span>
        </div>
      )}

      {/* ── KPI Metrics Cards (4 in a row, fully responsive, compact typography) ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
        gap: 14,
      }}>
        {/* KPI 1: Total Students */}
        <div style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: "16px 18px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#fff7ed",
              color: "#ea580c",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}>
              <Users size={19} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Total Students</div>
              <div style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.15,
                marginTop: 2,
              }}>
                {loading ? "..." : (metrics.totalRegisteredStudents ?? 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            <span style={{
              color: "#16a34a",
              fontWeight: 700,
              background: "#f0fdf4",
              padding: "1px 6px",
              borderRadius: 5,
              fontSize: 10.5,
            }}>
              Registered
            </span>
            <span style={{ color: "#94a3b8" }}>All time accounts</span>
          </div>
        </div>

        {/* KPI 2: Active Mentors */}
        <div style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: "16px 18px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#eff6ff",
              color: "#2563eb",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}>
              <UserCheck size={19} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Active Mentors</div>
              <div style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.15,
                marginTop: 2,
              }}>
                {loading ? "..." : (metrics.activeMentors ?? 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            <span style={{
              color: "#2563eb",
              fontWeight: 700,
              background: "#eff6ff",
              padding: "1px 6px",
              borderRadius: 5,
              fontSize: 10.5,
            }}>
              Verified
            </span>
            <span style={{ color: "#94a3b8" }}>Active on platform</span>
          </div>
        </div>

        {/* KPI 3: Assigned Students */}
        <div style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: "16px 18px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#ecfdf5",
              color: "#059669",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}>
              <Layers size={19} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Assigned Students</div>
              <div style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.15,
                marginTop: 2,
              }}>
                {loading ? "..." : (metrics.assignedStudents ?? 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            <span style={{
              color: "#059669",
              fontWeight: 700,
              background: "#ecfdf5",
              padding: "1px 6px",
              borderRadius: 5,
              fontSize: 10.5,
            }}>
              Assigned
            </span>
            <span style={{ color: "#94a3b8" }}>Under active mentors</span>
          </div>
        </div>

        {/* KPI 4: Tasks Completed */}
        <div style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: "16px 18px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#f3e8ff",
              color: "#7c3aed",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}>
              <CheckCircle2 size={19} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Tasks Completed</div>
              <div style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.15,
                marginTop: 2,
              }}>
                {loading ? "..." : (metrics.totalTasksCompleted ?? 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            <span style={{
              color: "#7c3aed",
              fontWeight: 700,
              background: "#f5f3ff",
              padding: "1px 6px",
              borderRadius: 5,
              fontSize: 10.5,
            }}>
              Completed
            </span>
            <span style={{ color: "#94a3b8" }}>Student milestones</span>
          </div>
        </div>
      </div>

      {/* ── Two-Column Analytics Layout (Mentor Doughnut + Login Trend) ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))",
        gap: 16,
      }}>
        {/* ── LEFT PANEL: Mentor Analytics Doughnut Chart ── */}
        <div style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: "18px 20px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 360,
        }}>
          {/* Header & Metric Picker */}
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "#fff7ed",
                color: "#ea580c",
                display: "grid",
                placeItems: "center",
              }}>
                <FileText size={15} />
              </div>
              <div>
                <h3 style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: 0,
                }}>
                  Mentor Analytics
                </h3>
                <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>
                  Compare mentors by {mentorMetric === "logins" ? "total logins" : mentorMetric === "tasks" ? "tasks completed" : "assigned students"}
                </p>
              </div>
            </div>

            {/* Metric Dropdown selector */}
            <div style={{ position: "relative" }}>
              <select
                value={mentorMetric}
                onChange={(e) => setMentorMetric(e.target.value)}
                style={{
                  height: 28,
                  padding: "0 22px 0 8px",
                  borderRadius: 6,
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#475569",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                }}
              >
                <option value="logins">Total Logins</option>
                <option value="tasks">Tasks Completed</option>
                <option value="students">Assigned Students</option>
              </select>
              <ChevronDown
                size={13}
                style={{
                  position: "absolute",
                  right: 6,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#94a3b8",
                }}
              />
            </div>
          </div>

          {/* Donut Chart & Ranked List Area */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 16,
            alignItems: "center",
            padding: "4px 0",
          }}>
            {/* SVG Donut Chart with Interactive Segments & Center Label */}
            <div style={{
              position: "relative",
              width: 175,
              height: 175,
              margin: "0 auto",
              display: "grid",
              placeItems: "center",
            }}>
              <svg width="175" height="175" viewBox="0 0 200 200">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#f8fafc"
                  strokeWidth="22"
                />

                {/* Slices */}
                {donutBreakdown.length > 0 ? (
                  donutBreakdown.map((slice, i) => {
                    const circumference = 2 * Math.PI * 70; // ~439.82
                    const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -((slice.startAngle / 360) * circumference);
                    const isHovered = hoveredSlice === slice.name;

                    return (
                      <circle
                        key={i}
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke={slice.color}
                        strokeWidth={isHovered ? "26" : "22"}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                          transition: "all 0.25s ease",
                          cursor: "pointer",
                          transform: "rotate(-90deg)",
                          transformOrigin: "center",
                        }}
                        onMouseEnter={() => setHoveredSlice(slice.name)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      />
                    );
                  })
                ) : (
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    strokeDasharray="4 4"
                  />
                )}
              </svg>

              {/* Center Donut Label */}
              <div style={{
                position: "absolute",
                textAlign: "center",
                pointerEvents: "none",
              }}>
                <div style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1,
                }}>
                  {hoveredSlice ? donutBreakdown.find((d) => d.name === hoveredSlice)?.value : mentorCount}
                </div>
                <div style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "#64748b",
                  marginTop: 3,
                }}>
                  {hoveredSlice ? `${hoveredSlice.slice(0, 10)}` : "Mentors"}
                </div>
              </div>
            </div>

            {/* Ranked Mentor List with Counts */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 200,
              overflowY: "auto",
              paddingRight: 4,
            }} className="cp-custom-scroll">
              {donutBreakdown.length > 0 ? (
                donutBreakdown.map((item, idx) => {
                  const isHovered = hoveredSlice === item.name;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredSlice(item.name)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "3px 6px",
                        borderRadius: 6,
                        background: isHovered ? "#f8fafc" : "transparent",
                        transition: "background 0.15s ease",
                        cursor: "pointer",
                        fontSize: 11.5,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: item.color,
                          flexShrink: 0,
                        }} />
                        <span style={{
                          fontWeight: isHovered ? 700 : 500,
                          color: isHovered ? "#0f172a" : "#334155",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{
                        fontWeight: 700,
                        color: "#0f172a",
                        fontFamily: "monospace",
                        fontSize: 11,
                        marginLeft: 10,
                      }}>
                        {item.value}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", padding: "16px 0" }}>
                  {loading ? "Loading mentors..." : "No mentors registered yet"}
                </div>
              )}
            </div>
          </div>

          {/* Footer Navigation Link */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 10,
            borderTop: "1px solid #f1f5f9",
          }}>
            <button
              onClick={() => onNavigateTab && onNavigateTab("mentors")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11.5,
                fontWeight: 700,
                color: "#2563eb",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "3px 6px",
                borderRadius: 6,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = ORANGE}
              onMouseLeave={(e) => e.currentTarget.style.color = "#2563eb"}
            >
              View All Mentors →
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL: Login Activity Trend Chart ── */}
        <div style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: "18px 20px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 360,
        }}>
          {/* Header & Range Selector Pills */}
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "#fff7ed",
                color: "#ea580c",
                display: "grid",
                placeItems: "center",
              }}>
                <TrendingUp size={15} />
              </div>
              <div>
                <h3 style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: 0,
                }}>
                  Login Activity
                </h3>
                <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>
                  Platform login trends (Students + Mentors)
                </p>
              </div>
            </div>

            {/* Range Toggle (7D / 30D / Custom) */}
            <div style={{
              display: "inline-flex",
              background: "#f8fafc",
              borderRadius: 7,
              padding: 2,
              border: "1px solid #e2e8f0",
            }}>
              {[
                { id: "7d", label: "7D" },
                { id: "30d", label: "30D" },
                { id: "custom", label: "Custom" },
              ].map((p) => {
                const active = chartRange === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setChartRange(p.id)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 5,
                      border: "none",
                      background: active ? "#ffffff" : "transparent",
                      color: active ? ORANGE : "#64748b",
                      fontWeight: active ? 800 : 500,
                      fontSize: 10.5,
                      cursor: "pointer",
                      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today's Logins Banner */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderRadius: 10,
            background: "#f8fafc",
            border: "1px solid #f1f5f9",
            marginBottom: 8,
            flexWrap: "wrap",
            gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 9.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: "#059669",
                background: "#ecfdf5",
                padding: "2px 6px",
                borderRadius: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
                Today
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#334155" }}>Logins:</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Students logged in today */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: "#475569",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF693D" }} />
                <span>Students:</span>
                <span style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 800,
                  fontSize: 12.5,
                  color: "#ea580c",
                  background: "#fff7ed",
                  padding: "1px 7px",
                  borderRadius: 5,
                  border: "1px solid #fed7aa",
                }}>
                  {loading ? "..." : (todayStats.studentsToday ?? todayStats.studentLoginsToday ?? 0)}
                </span>
              </div>

              {/* Mentors logged in today */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: "#475569",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6" }} />
                <span>Mentors:</span>
                <span style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 800,
                  fontSize: 12.5,
                  color: "#2563eb",
                  background: "#eff6ff",
                  padding: "1px 7px",
                  borderRadius: 5,
                  border: "1px solid #bfdbfe",
                }}>
                  {loading ? "..." : (todayStats.mentorsToday ?? todayStats.mentorLoginsToday ?? 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Legend Strip */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 14,
            fontSize: 11,
            fontWeight: 600,
            marginBottom: 6,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF693D" }} />
              <span>Students</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B82F6" }} />
              <span>Mentors</span>
            </div>
          </div>

          {/* SVG Area & Smooth Line Chart */}
          <div style={{ position: "relative", width: "100%", height: 195 }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 540 210"
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF693D" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#FF693D" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="mentorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {(() => {
                const step = maxChartValue / 4;
                const levels = [0, Math.round(step), Math.round(step * 2), Math.round(step * 3), maxChartValue];
                return levels.map((level, i) => {
                  const y = 175 - (level / maxChartValue) * 145;
                  return (
                    <g key={i}>
                      <line
                        x1="35"
                        y1={y}
                        x2="530"
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        strokeDasharray={level === 0 ? "none" : "3,3"}
                      />
                      <text
                        x="25"
                        y={y + 3.5}
                        fontSize="9.5"
                        fill="#94a3b8"
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        {level}
                      </text>
                    </g>
                  );
                });
              })()}

              {/* Data Curves Calculation */}
              {(() => {
                const points = filteredDailyTrend;
                if (!points.length) return null;

                const stepX = (530 - 35) / Math.max(1, points.length - 1);
                const getCoords = (pt, idx, key) => {
                  const x = 35 + idx * stepX;
                  const val = pt[key] || 0;
                  const y = 175 - (Math.min(val, maxChartValue) / maxChartValue) * 145;
                  return { x, y, val };
                };

                const studentCoords = points.map((p, i) => getCoords(p, i, "studentLogins"));
                const mentorCoords = points.map((p, i) => getCoords(p, i, "mentorLogins"));

                // Smooth Bezier path generator
                const makePath = (coords) => {
                  let d = `M ${coords[0].x} ${coords[0].y}`;
                  for (let i = 0; i < coords.length - 1; i++) {
                    const curr = coords[i];
                    const next = coords[i + 1];
                    const cpX1 = curr.x + (next.x - curr.x) / 2;
                    const cpY1 = curr.y;
                    const cpX2 = curr.x + (next.x - curr.x) / 2;
                    const cpY2 = next.y;
                    d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
                  }
                  return d;
                };

                const sPath = makePath(studentCoords);
                const mPath = makePath(mentorCoords);

                const sArea = `${sPath} L ${studentCoords[studentCoords.length - 1].x} 175 L ${studentCoords[0].x} 175 Z`;
                const mArea = `${mPath} L ${mentorCoords[mentorCoords.length - 1].x} 175 L ${mentorCoords[0].x} 175 Z`;

                return (
                  <>
                    {/* Area fills */}
                    <path d={sArea} fill="url(#studentGrad)" />
                    <path d={mArea} fill="url(#mentorGrad)" />

                    {/* Smooth curve lines */}
                    <path d={sPath} fill="none" stroke="#FF693D" strokeWidth="2.5" strokeLinecap="round" />
                    <path d={mPath} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Data dots */}
                    {studentCoords.map((pt, i) => (
                      <circle
                        key={`s-${i}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={hoveredChartPoint?.idx === i ? "5.5" : "3.5"}
                        fill="#FF693D"
                        stroke="#ffffff"
                        strokeWidth="2"
                        style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                        onMouseEnter={() => setHoveredChartPoint({ idx: i, pt: points[i], x: pt.x, y: pt.y })}
                      />
                    ))}

                    {mentorCoords.map((pt, i) => (
                      <circle
                        key={`m-${i}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={hoveredChartPoint?.idx === i ? "5.5" : "3.5"}
                        fill="#3B82F6"
                        stroke="#ffffff"
                        strokeWidth="2"
                        style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                        onMouseEnter={() => setHoveredChartPoint({ idx: i, pt: points[i], x: pt.x, y: pt.y })}
                      />
                    ))}

                    {/* X-axis date labels */}
                    {points.map((pt, i) => {
                      // show every Nth label to prevent clutter on mobile
                      const showLabel = points.length <= 8 || i % Math.ceil(points.length / 7) === 0 || i === points.length - 1;
                      if (!showLabel) return null;
                      const x = 35 + i * stepX;
                      return (
                        <text
                          key={`lbl-${i}`}
                          x={x}
                          y="198"
                          fontSize="10"
                          fill="#94a3b8"
                          textAnchor="middle"
                        >
                          {pt.label}
                        </text>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* Interactive Tooltip on Chart Hover */}
            {hoveredChartPoint && (
              <div
                style={{
                  position: "absolute",
                  left: `${(hoveredChartPoint.x / 540) * 100}%`,
                  top: Math.max(0, hoveredChartPoint.y - 70),
                  transform: "translateX(-50%)",
                  background: "#0f172a",
                  color: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: 10,
                  fontSize: 11.5,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                  pointerEvents: "none",
                  zIndex: 20,
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4, color: "#e2e8f0", fontSize: 11 }}>
                  {hoveredChartPoint.pt.label}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#ff8c69" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF693D" }} />
                  <span>Students: <strong>{hoveredChartPoint.pt.studentLogins || 0}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#93c5fd" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
                  <span>Mentors: <strong>{hoveredChartPoint.pt.mentorLogins || 0}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Full-Width Recent Activity Table ── */}
      <div style={{
        background: "#ffffff",
        borderRadius: 16,
        border: "1px solid #f1f5f9",
        boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
        overflow: "hidden",
      }}>
        {/* Table Title Bar */}
        <div style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f1f5f9",
          flexWrap: "wrap",
          gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "#fff7ed",
              color: "#ea580c",
              display: "grid",
              placeItems: "center",
            }}>
              <Clock size={15} />
            </div>
            <div>
              <h3 style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 13.5,
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
              }}>
                Recent Activity
              </h3>
              <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>
                Latest platform activity across mentors, students and admins
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab("mentor-tracking")}
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: "#2563eb",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = ORANGE}
            onMouseLeave={(e) => e.currentTarget.style.color = "#2563eb"}
          >
            View All →
          </button>
        </div>

        {/* Responsive Table Container */}
        <div className="cp-custom-scroll" style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            minWidth: 800,
            borderCollapse: "collapse",
            fontSize: 11.5,
            textAlign: "left",
          }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "10px 18px", fontWeight: 700, color: "#64748b", fontSize: 10.5, textTransform: "uppercase" }}>Time</th>
                <th style={{ padding: "10px 16px", fontWeight: 700, color: "#64748b", fontSize: 10.5, textTransform: "uppercase" }}>Type</th>
                <th style={{ padding: "10px 16px", fontWeight: 700, color: "#64748b", fontSize: 10.5, textTransform: "uppercase" }}>Name</th>
                <th style={{ padding: "10px 16px", fontWeight: 700, color: "#64748b", fontSize: 10.5, textTransform: "uppercase" }}>Details</th>
                <th style={{ padding: "10px 18px", fontWeight: 700, color: "#64748b", fontSize: 10.5, textTransform: "uppercase", textAlign: "right" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {formattedActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "28px 18px", textAlign: "center", color: "#94a3b8", fontSize: 11.5 }}>
                    {loading ? "Loading platform activity..." : "No recent activity recorded yet in this period."}
                  </td>
                </tr>
              ) : (
                formattedActivities.map((row, idx) => {
                  const Icon = row.typeIcon;
                  return (
                    <tr
                      key={row.id || idx}
                      style={{
                        borderBottom: "1px solid #f8fafc",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      {/* Timestamp */}
                      <td style={{ padding: "11px 18px", color: "#64748b", fontSize: 11, whiteSpace: "nowrap" }}>
                        {row.time}
                      </td>

                      {/* Event Type with Icon */}
                      <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          color: row.typeColor,
                          fontWeight: 600,
                          fontSize: 11,
                        }}>
                          <Icon size={13} />
                          {row.type}
                        </span>
                      </td>

                      {/* Name with Round Initials Avatar */}
                      <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: row.typeBg,
                            color: row.typeColor,
                            display: "grid",
                            placeItems: "center",
                            fontSize: 10,
                            fontWeight: 800,
                          }}>
                            {row.initials}
                          </div>
                          <span style={{ fontWeight: 700, color: "#0f172a" }}>
                            {row.name}
                          </span>
                        </div>
                      </td>

                      {/* Action Details */}
                      <td style={{ padding: "11px 16px", color: "#475569", fontSize: 11.5 }}>
                        {row.details}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: "11px 18px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontSize: 10.5,
                          fontWeight: 700,
                          background: row.statusBg,
                          color: row.statusColor,
                          display: "inline-block",
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
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
