import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, Trophy, Target, ClipboardList, Clock, Search,
  ArrowUpDown, ExternalLink, CheckCircle2, AlertCircle, RefreshCw,
  Flame, Award, BookOpen,
} from "lucide-react";
import { apiMentorStudentsOverview } from "../../auth/api.js";

const ACCENT = "#FF693D";
const SORA = "Sora, system-ui, sans-serif";

function timeAgo(iso) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AllMenteesMatrix({ token, onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score"); // score | name | tests | hours
  const [sortAsc, setSortAsc] = useState(false);

  const fetchOverview = async () => {
    if (!token) return;
    setLoading(true);
    setErr("");
    try {
      const res = await apiMentorStudentsOverview(token);
      setStudents(res.students || []);
    } catch (e) {
      setErr(e.message || "Could not load mentees overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [token]);

  const filtered = useMemo(() => {
    let list = [...students];
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.studentId?.toLowerCase().includes(q) ||
          s.plan?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let diff = 0;
      if (sortBy === "name") {
        diff = (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "score") {
        diff = (a.testStats?.avgPercent || 0) - (b.testStats?.avgPercent || 0);
      } else if (sortBy === "tests") {
        diff = (a.testStats?.testCount || 0) - (b.testStats?.testCount || 0);
      } else if (sortBy === "hours") {
        diff = (a.studyStats?.weekHours || 0) - (b.studyStats?.weekHours || 0);
      }
      return sortAsc ? diff : -diff;
    });

    return list;
  }, [students, search, sortBy, sortAsc]);

  // Cohort aggregations
  const totalStudents = students.length;
  const avgCohortPercent = totalStudents
    ? Math.round(
        students.reduce((s, x) => s + (x.testStats?.avgPercent || 0), 0) / totalStudents
      )
    : 0;
  const totalTestsTaken = students.reduce((s, x) => s + (x.testStats?.testCount || 0), 0);
  const totalTasksDone = students.reduce((s, x) => s + (x.taskStats?.completed || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Overview Banner */}
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
          <Trophy size={18} color={ACCENT} />
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
              All Mentees Academic Matrix
            </h3>
            <p style={{ fontSize: 11.5, color: "#64748b", margin: 0 }}>
              Complete scores, exam performance, task completion &amp; study velocity across all assigned students
            </p>
          </div>
        </div>

        <button
          onClick={fetchOverview}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#64748b",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={13} className={loading ? "cp-spin" : ""} /> Refresh Matrix
        </button>
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

      {/* Cohort Stats Strip */}
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
                background: `${ACCENT}15`,
                color: ACCENT,
                display: "grid",
                placeItems: "center",
              }}
            >
              <Users size={15} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
              Total Mentees
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
            {totalStudents}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Assigned student accounts
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
              <Target size={15} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
              Cohort Avg Score
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
            {avgCohortPercent}%
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Across all evaluated mock tests
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
                background: "rgba(99,102,241,0.12)",
                color: "#6366f1",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Award size={15} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
              Tests Completed
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
            {totalTestsTaken}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Total papers graded
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
                background: "rgba(245,158,11,0.12)",
                color: "#f59e0b",
                display: "grid",
                placeItems: "center",
              }}
            >
              <ClipboardList size={15} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
              Tasks Cleared
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
            {totalTasksDone}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Mentor fix-list items completed
          </div>
        </div>
      </div>

      {/* Main Comparison Table */}
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
          <div style={{ position: "relative", minWidth: 220 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search mentee name, CP ID or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px 8px 30px",
                borderRadius: 9,
                border: "1px solid #e2e8f0",
                fontSize: 12.5,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
            <span>Sort by:</span>
            {[
              { key: "score", label: "Avg Score" },
              { key: "tests", label: "Tests" },
              { key: "hours", label: "Study Time" },
              { key: "name", label: "Name" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => {
                  if (sortBy === btn.key) setSortAsc(!sortAsc);
                  else {
                    setSortBy(btn.key);
                    setSortAsc(false);
                  }
                }}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 7,
                  padding: "4px 8px",
                  fontSize: 11.5,
                  fontWeight: sortBy === btn.key ? 700 : 500,
                  cursor: "pointer",
                  background: sortBy === btn.key ? "#f8fafc" : "#fff",
                  color: sortBy === btn.key ? ACCENT : "#475569",
                }}
              >
                {btn.label} {sortBy === btn.key && (sortAsc ? "↑" : "↓")}
              </button>
            ))}
          </div>
        </div>

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
                <th style={{ padding: "10px 12px" }}>Student &amp; CP ID</th>
                <th style={{ padding: "10px 12px" }}>Latest Test Score</th>
                <th style={{ padding: "10px 12px", textAlign: "center" }}>Average Score</th>
                <th style={{ padding: "10px 12px", textAlign: "center" }}>Tests Taken</th>
                <th style={{ padding: "10px 12px" }}>Tasks Progress</th>
                <th style={{ padding: "10px 12px", textAlign: "center" }}>Hours (7d)</th>
                <th style={{ padding: "10px 12px" }}>Last Login</th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "36px 12px",
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    No mentee records found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const latest = s.testStats?.latestTest;
                  const avgPct = s.testStats?.avgPercent || 0;
                  const avgTone = avgPct >= 65 ? "#16a34a" : avgPct >= 40 ? "#f59e0b" : ACCENT;

                  const taskAssigned = s.taskStats?.assigned || 0;
                  const taskDone = s.taskStats?.completed || 0;
                  const taskPct = taskAssigned ? Math.round((taskDone / taskAssigned) * 100) : 0;

                  return (
                    <tr
                      key={s.studentId}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background .15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Name & ID */}
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 800, color: "#0f172a" }}>{s.name}</span>
                          {s.studentGroup && (
                            <span style={{
                              fontSize: 9.5, fontWeight: 700, color: "#2563eb", background: "#eff6ff",
                              border: "1px solid #dbeafe", padding: "1px 5px", borderRadius: 4,
                            }}>
                              {s.studentGroup}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          {s.studentId} · <span style={{ textTransform: "capitalize" }}>{s.plan?.replace("mentor-", "")}</span>
                        </div>
                      </td>

                      {/* Complete Latest Test Score */}
                      <td style={{ padding: "12px" }}>
                        {latest ? (
                          <div>
                            <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 13.5, color: "#0f172a" }}>
                              {latest.score}{" "}
                              <span style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600 }}>
                                / {latest.maxMarks}
                              </span>{" "}
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 800,
                                  color: latest.percent >= 60 ? "#16a34a" : "#ea580c",
                                  background: latest.percent >= 60 ? "#ecfdf5" : "#fff7ed",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  marginLeft: 4,
                                }}
                              >
                                {latest.percent}%
                              </span>
                            </div>
                            <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 2 }}>
                              Accuracy: {latest.accuracy}%
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: 11.5 }}>No tests yet</span>
                        )}
                      </td>

                      {/* Complete Average Score */}
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        {s.testStats?.testCount > 0 ? (
                          <div>
                            <span
                              style={{
                                fontFamily: SORA,
                                fontWeight: 800,
                                fontSize: 14,
                                color: avgTone,
                              }}
                            >
                              {avgPct}%
                            </span>
                            <div style={{ fontSize: 10.5, color: "#64748b" }}>
                              ~{Math.round(s.testStats.totalScored / s.testStats.testCount)} /{" "}
                              {Math.round(s.testStats.totalMax / s.testStats.testCount)}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>—</span>
                        )}
                      </td>

                      {/* Tests Taken */}
                      <td style={{ padding: "12px", textAlign: "center", fontWeight: 700, color: "#334155" }}>
                        {s.testStats?.testCount || 0}
                      </td>

                      {/* Tasks Progress */}
                      <td style={{ padding: "12px", minWidth: 120 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>
                            {taskDone}/{taskAssigned} done
                          </span>
                          <span style={{ color: "#64748b", fontWeight: 700 }}>{taskPct}%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 3, background: "#e2e8f0", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${taskPct}%`, background: taskPct >= 80 ? "#16a34a" : ACCENT }} />
                        </div>
                      </td>

                      {/* Study Hours */}
                      <td style={{ padding: "12px", textAlign: "center", fontWeight: 700, color: ACCENT }}>
                        {s.studyStats?.weekHours ? `${s.studyStats.weekHours}h` : "—"}
                      </td>

                      {/* Last Login */}
                      <td style={{ padding: "12px", fontSize: 11.5, color: "#64748b" }}>
                        {timeAgo(s.lastLogin)}
                      </td>

                      {/* Action */}
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <button
                          onClick={() => onSelectStudent && onSelectStudent(s.studentId)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "none",
                            background: ACCENT,
                            color: "#fff",
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(255,105,61,0.25)",
                          }}
                        >
                          Workspace →
                        </button>
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
