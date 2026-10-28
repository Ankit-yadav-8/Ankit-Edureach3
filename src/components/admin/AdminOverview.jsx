import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users, UserCheck, UserX, CheckCircle2, Clock, AlertTriangle, ArrowUpRight,
  TrendingUp, Calendar, RefreshCw, Activity, ShieldCheck, ChevronRight,
  Sparkles, Filter, Award, Target, BookOpen, Layers
} from "lucide-react";
import { apiAdminAnalyticsOverview } from "../../auth/api.js";

const ORANGE = "#FF693D";

export default function AdminOverview({ adminToken, dateRange = "30d", onNavigateTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedRange, setSelectedRange] = useState(dateRange);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [mentorFilter, setMentorFilter] = useState("all");

  const loadData = useCallback(async (r, start, end) => {
    setLoading(true);
    setErr("");
    try {
      const res = await apiAdminAnalyticsOverview(adminToken, r, start, end);
      setData(res);
    } catch (e) {
      setErr(e.message || "Could not load overview analytics");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    loadData(selectedRange, customStart, customEnd);
  }, [loadData, selectedRange, customStart, customEnd]);

  const metrics = data?.metrics || {};
  const dailyTrend = data?.dailyTrend || [];
  const recentActivity = data?.recentActivity || [];

  // Filtered activity feed if mentor is selected
  const filteredActivity = useMemo(() => {
    if (mentorFilter === "all") return recentActivity;
    return recentActivity.filter((a) => a.mentorName?.toLowerCase().includes(mentorFilter.toLowerCase()));
  }, [recentActivity, mentorFilter]);

  // Max value for daily trend sparkline
  const maxTrend = useMemo(() => {
    if (!dailyTrend.length) return 10;
    return Math.max(...dailyTrend.map((d) => Math.max(d.studentLogins || 0, d.mentorLogins || 0)), 5);
  }, [dailyTrend]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Top Filter Bar */}
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
            width: 34, height: 34, borderRadius: 10,
            background: `${ORANGE}15`, display: "grid", placeItems: "center",
          }}>
            <Activity size={17} color={ORANGE} />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
              Mentorship Platform Pulse
            </h2>
            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
              Real-time business telemetry and mentor engagement tracking
            </p>
          </div>
        </div>

        {/* Date Range Selector Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
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
                style={{
                  height: 32, padding: "0 8px", borderRadius: 8,
                  border: "1px solid #e2e8f0", fontSize: 11.5,
                }}
              />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                style={{
                  height: 32, padding: "0 8px", borderRadius: 8,
                  border: "1px solid #e2e8f0", fontSize: 11.5,
                }}
              />
            </div>
          )}

          <button
            onClick={() => loadData(selectedRange, customStart, customEnd)}
            disabled={loading}
            title="Refresh analytics"
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
            <span>{loading ? "Syncing..." : "Sync"}</span>
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

      {/* KPI Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap: 16,
      }}>
        {/* Total Registered Students */}
        <div style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: "18px 20px",
          border: "1px solid #f0e9e0",
          boxShadow: "0 2px 12px rgba(15,23,42,0.03)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Total Students
              </span>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 28, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                {metrics.totalRegisteredStudents ?? "—"}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(59,130,246,0.1)", display: "grid", placeItems: "center" }}>
              <Users size={20} color="#2563eb" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 11.5, color: "#64748b" }}>
            <span style={{ color: "#16a34a", fontWeight: 700, display: "inline-flex", alignItems: "center" }}>
              {metrics.totalPaidStudents ?? 0} paid enrollments
            </span>
            <span>·</span>
            <span>{metrics.unassignedStudents ?? 0} unassigned</span>
          </div>
        </div>

        {/* Active Mentors */}
        <div style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: "18px 20px",
          border: "1px solid #f0e9e0",
          boxShadow: "0 2px 12px rgba(15,23,42,0.03)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Active Mentors
              </span>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 28, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                {metrics.activeMentors ?? "—"}
                <span style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", marginLeft: 4 }}>
                  / {metrics.totalMentors ?? "—"}
                </span>
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(16,185,129,0.1)", display: "grid", placeItems: "center" }}>
              <UserCheck size={20} color="#059669" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 11.5, color: "#64748b" }}>
            <span style={{ color: metrics.inactiveMentors > 0 ? "#f59e0b" : "#64748b", fontWeight: 700 }}>
              {metrics.inactiveMentors ?? 0} inactive
            </span>
            <span>·</span>
            <span>{metrics.mentorEngagementRate ?? 0}% engagement</span>
          </div>
        </div>

        {/* Assigned Students */}
        <div style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: "18px 20px",
          border: "1px solid #f0e9e0",
          boxShadow: "0 2px 12px rgba(15,23,42,0.03)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Assigned Students
              </span>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 28, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                {metrics.assignedStudents ?? "—"}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${ORANGE}15`, display: "grid", placeItems: "center" }}>
              <Layers size={20} color={ORANGE} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 11.5, color: "#64748b" }}>
            <span style={{ color: "#2563eb", fontWeight: 700 }}>
              {metrics.activeStudentUsers ?? 0} active logins
            </span>
            <span>·</span>
            <span>{metrics.studentEngagementRate ?? 0}% active</span>
          </div>
        </div>

        {/* Task Completion Rate */}
        <div style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: "18px 20px",
          border: "1px solid #f0e9e0",
          boxShadow: "0 2px 12px rgba(15,23,42,0.03)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Tasks Completed
              </span>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 28, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                {metrics.totalTasksCompleted ?? 0}
                <span style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", marginLeft: 4 }}>
                  / {metrics.totalTasksAssigned ?? 0}
                </span>
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(139,92,246,0.1)", display: "grid", placeItems: "center" }}>
              <CheckCircle2 size={20} color="#7c3aed" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 11.5, color: "#64748b" }}>
            <span style={{ color: "#16a34a", fontWeight: 700 }}>
              {metrics.overallTaskCompletionRate ?? 0}% completed
            </span>
            <span>·</span>
            <span style={{ color: metrics.totalTasksOverdue > 0 ? "#dc2626" : "#64748b" }}>
              {metrics.totalTasksOverdue ?? 0} overdue
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Login Chart + Quick Action Banner */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 20,
      }}>
        {/* Interactive Login Activity Chart */}
        <div style={{
          background: "#ffffff",
          borderRadius: 18,
          padding: "22px 24px",
          border: "1px solid #f0e9e0",
          boxShadow: "0 2px 12px rgba(15,23,42,0.03)",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
                Daily Login Activity & Sessions
              </h3>
              <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
                Student vs Mentor logins over selected period
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, fontWeight: 600 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#2563eb" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} /> Student
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: ORANGE }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE }} /> Mentor
              </span>
            </div>
          </div>

          {dailyTrend.length === 0 ? (
            <div style={{ height: 180, display: "grid", placeItems: "center", color: "#94a3b8", fontSize: 13 }}>
              No login logs recorded for this period yet
            </div>
          ) : (
            <div style={{ position: "relative", width: "100%", height: 190, paddingTop: 10 }}>
              {/* SVG Sparkline / Bar Chart */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 150, width: "100%", paddingBottom: 20 }}>
                {dailyTrend.map((d, i) => {
                  const sHeight = Math.max(4, Math.round(((d.studentLogins || 0) / maxTrend) * 120));
                  const mHeight = Math.max(4, Math.round(((d.mentorLogins || 0) / maxTrend) * 120));
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "flex-end",
                        position: "relative",
                      }}
                      title={`${d.label}: ${d.studentLogins || 0} students, ${d.mentorLogins || 0} mentors`}
                    >
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, width: "100%", justifyContent: "center" }}>
                        <div
                          style={{
                            width: "45%",
                            maxWidth: 10,
                            height: sHeight,
                            background: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
                            borderRadius: "3px 3px 0 0",
                            transition: "height 0.3s ease",
                          }}
                        />
                        <div
                          style={{
                            width: "45%",
                            maxWidth: 10,
                            height: mHeight,
                            background: "linear-gradient(180deg, #ff8c69, #ff5722)",
                            borderRadius: "3px 3px 0 0",
                            transition: "height 0.3s ease",
                          }}
                        />
                      </div>
                      {/* Label every few items or on mobile */}
                      {(i === 0 || i === Math.floor(dailyTrend.length / 2) || i === dailyTrend.length - 1) && (
                        <span style={{ position: "absolute", bottom: 0, fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>
                          {d.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            paddingTop: 12,
            borderTop: "1px solid #f1f5f9",
            fontSize: 12,
            color: "#64748b",
          }}>
            <span>Total student logins in range: <strong>{metrics.totalStudentLogins ?? 0}</strong></span>
            <span>Total mentor logins: <strong>{metrics.totalMentorLogins ?? 0}</strong></span>
          </div>
        </div>

        {/* Mentor Tracking CTA Card */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: 18,
          padding: "24px 26px",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 10px 30px rgba(15,23,42,0.14)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            right: -20,
            bottom: -20,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,105,61,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,105,61,0.2)",
              color: "#ff8c69",
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 14,
            }}>
              <Sparkles size={12} /> Live Mentor Telemetry
            </div>

            <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>
              Mentor Tracking & Comparisons
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, margin: 0 }}>
              Deep-dive into mentor login histories, assigned student progress, task completions, and interactive multi-color comparative pie charts.
            </p>
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => onNavigateTab && onNavigateTab("mentor-tracking")}
              style={{
                background: ORANGE,
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(255,105,61,0.35)",
              }}
            >
              Open Mentor Analytics <ArrowUpRight size={15} />
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab("mentors")}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Manage Mentors
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Feed */}
      <div style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: "20px 24px",
        border: "1px solid #f0e9e0",
        boxShadow: "0 2px 12px rgba(15,23,42,0.03)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#f1f5f9", display: "grid", placeItems: "center" }}>
              <Clock size={16} color="#475569" />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
                Recent Platform & Mentor Activity
              </h3>
              <span style={{ fontSize: 11.5, color: "#64748b" }}>
                Chronological event stream from verified database logs
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={13} color="#94a3b8" />
            <input
              type="text"
              placeholder="Filter by mentor..."
              value={mentorFilter === "all" ? "" : mentorFilter}
              onChange={(e) => setMentorFilter(e.target.value || "all")}
              style={{
                height: 30,
                padding: "0 10px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                outline: "none",
                width: 150,
              }}
            />
          </div>
        </div>

        {filteredActivity.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
            No activity events recorded yet. Logins and task actions will appear here in real-time.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredActivity.slice(0, 10).map((act) => {
              const date = new Date(act.createdAt);
              const timeStr = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
              const dateStr = date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

              let label = "Activity recorded";
              let badgeColor = "#64748b";
              let badgeBg = "#f1f5f9";

              if (act.action === "mentor_login") {
                label = `Mentor ${act.mentorName || "Account"} logged in successfully`;
                badgeColor = "#059669";
                badgeBg = "#ecfdf5";
              } else if (act.action === "mentor_login_failed") {
                label = `Failed mentor login attempt (${act.details?.reason || "Credentials"})`;
                badgeColor = "#dc2626";
                badgeBg = "#fef2f2";
              } else if (act.action === "task_assign") {
                label = `Mentor ${act.mentorName || ""} assigned ${act.details?.taskCount || "new"} tasks to ${act.studentName || act.studentId}`;
                badgeColor = "#2563eb";
                badgeBg = "#eff6ff";
              } else if (act.action === "task_update") {
                label = `Mentor ${act.mentorName || ""} updated tasks for student ${act.studentName || act.studentId}`;
                badgeColor = "#7c3aed";
                badgeBg = "#f5f3ff";
              } else if (act.action === "task_complete") {
                label = `Tasks completed for student ${act.studentName || act.studentId}`;
                badgeColor = "#16a34a";
                badgeBg = "#f0fdf4";
              } else if (act.action === "student_login") {
                label = `Student ${act.studentName || act.studentId || "User"} signed in`;
                badgeColor = "#0284c7";
                badgeBg = "#f0f9ff";
              }

              return (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    fontSize: 12.5,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      background: badgeBg,
                      color: badgeColor,
                    }}>
                      {act.action.replace("_", " ").toUpperCase()}
                    </span>
                    <span style={{ color: "#1e293b", fontWeight: 500 }}>
                      {label}
                    </span>
                  </div>
                  <span style={{ fontSize: 11.5, color: "#94a3b8", whiteSpace: "nowrap" }}>
                    {dateStr}, {timeStr}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
