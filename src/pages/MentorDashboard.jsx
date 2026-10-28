import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, LogOut, Lock, Loader2, ShieldCheck, AlertCircle, Zap,
  Activity, BookOpen, Trophy, ClipboardList, CheckCircle2, Menu,
  X, ArrowRight, Eye, EyeOff, Mail, RefreshCw, ChevronRight,
  Sparkles, UserCheck, Flame, Target, Award,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import StudentReport from "../components/mentor/StudentReport.jsx";
import StudentLoginTracking from "../components/mentor/StudentLoginTracking.jsx";
import AllMenteesMatrix from "../components/mentor/AllMenteesMatrix.jsx";
import ChapterQuizModal from "../components/quiz/ChapterQuizModal.jsx";
import {
  apiMentorLogin, apiMentorMe, apiMentorSetPassword, apiMentorStudents,
  apiMentorStudentProgress, apiMentorStudentTests, apiMentorStudentTasks,
  apiMentorSetStudentTasks,
} from "../auth/api.js";

const ACCENT = "#FF693D";
const SORA = "Sora, system-ui, sans-serif";

const TOKEN_KEY = "cp:mentorToken";
const readToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; } };
const writeToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ } };

/* ── Modern Premium Mentor Login Page (Matches Admin Login) ─── */
function Login({ onDone }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const { token, mentor } = await apiMentorLogin({ email, password });
      writeToken(token);
      onDone(token, mentor);
    } catch (e2) {
      setErr(e2.message || "Invalid mentor credentials. Please check your email and password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at top, #fff5f1 0%, #f8fafc 50%, #f1f5f9 100%)",
        padding: "120px 16px 60px",
        boxSizing: "border-box",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#ffffff",
          borderRadius: 20,
          border: "1.5px solid rgba(255,105,61,0.2)",
          padding: "36px 32px",
          boxShadow: "0 24px 60px -15px rgba(15,23,42,0.08), 0 0 0 1px rgba(255,105,61,0.06)",
          boxSizing: "border-box",
        }}
      >
        {/* Floating Brand Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 24px -6px rgba(255,105,61,0.45)",
              color: "#fff",
            }}
          >
            <ShieldCheck size={28} />
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: ACCENT,
              background: "rgba(255,105,61,0.1)",
              padding: "3px 10px",
              borderRadius: 50,
              marginBottom: 8,
            }}
          >
            <Sparkles size={12} /> Campus Point Mentorship
          </div>
          <h1
            style={{
              fontFamily: SORA,
              fontWeight: 800,
              fontSize: 22,
              color: "#0f172a",
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            Mentor Console
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "6px 0 0", lineHeight: 1.5 }}>
            Sign in with your verified mentor credentials to monitor mentee logins, test analytics, and assignments.
          </p>
        </div>

        {err && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 12,
              padding: "11px 13px",
              fontSize: 12.5,
              color: "#b91c1c",
              marginBottom: 18,
              lineHeight: 1.45,
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              Mentor Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="email"
                required
                autoComplete="username"
                placeholder="mentor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 14px 0 42px",
                  borderRadius: 12,
                  border: "1.5px solid #e2e8f0",
                  fontSize: 14,
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#fff",
                  transition: "all .15s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = ACCENT;
                  e.target.style.boxShadow = "0 0 0 3px rgba(255,105,61,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 44px 0 42px",
                  borderRadius: 12,
                  border: "1.5px solid #e2e8f0",
                  fontSize: 14,
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#fff",
                  transition: "all .15s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = ACCENT;
                  e.target.style.boxShadow = "0 0 0 3px rgba(255,105,61,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy || !email || !password}
            style={{
              height: 48,
              borderRadius: 12,
              border: "none",
              background: busy
                ? `${ACCENT}99`
                : "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)",
              color: "#fff",
              fontFamily: SORA,
              fontWeight: 800,
              fontSize: 14,
              cursor: busy ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 8px 20px -6px rgba(255,105,61,0.45)",
              marginTop: 6,
            }}
          >
            {busy ? (
              <>
                <Loader2 size={16} className="cp-spin" /> Verifying Credentials...
              </>
            ) : (
              <>
                Sign In to Console <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #f1f5f9",
            textAlign: "center",
            fontSize: 11.5,
            color: "#94a3b8",
          }}
        >
          Protected portal · Students sign in from the{" "}
          <a href="/mentorship" style={{ color: ACCENT, textDecoration: "none", fontWeight: 700 }}>
            Mentorship Dashboard
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Forced Password Change Screen ────────────────────────────── */
function SetPassword({ token, onDone }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (next !== confirm) return setErr("The two new passwords do not match.");
    if (next.length < 8) return setErr("Use at least 8 characters.");
    setErr("");
    setBusy(true);
    try {
      const r = await apiMentorSetPassword(token, { currentPassword: current, newPassword: next });
      writeToken(r.token);
      onDone(r.token, r.mentor);
    } catch (e2) {
      setErr(e2.message || "Could not update password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at top, #fff5f1 0%, #f8fafc 50%, #f1f5f9 100%)",
        padding: "120px 16px 60px",
        boxSizing: "border-box",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid rgba(255,105,61,0.2)",
          padding: "36px 32px",
          boxShadow: "0 24px 60px -15px rgba(15,23,42,0.08)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: `${ACCENT}15`,
              color: ACCENT,
              display: "grid",
              placeItems: "center",
              margin: "0 auto 12px",
            }}
          >
            <Lock size={24} />
          </div>
          <h2 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 20, color: "#0f172a", margin: 0 }}>
            Set Your Permanent Password
          </h2>
          <p style={{ fontSize: 12.5, color: "#64748b", margin: "6px 0 0" }}>
            Replace the temporary password set by your administrator to activate your workspace.
          </p>
        </div>

        {err && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 12.5,
              color: "#b91c1c",
              marginBottom: 16,
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0 }} /> {err}
          </div>
        )}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5 }}>
              Temporary Admin Password
            </label>
            <input
              type="password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              style={{
                width: "100%",
                height: 44,
                padding: "0 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 13.5,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5 }}>
              New Permanent Password (min 8 chars)
            </label>
            <input
              type="password"
              required
              value={next}
              onChange={(e) => setNext(e.target.value)}
              style={{
                width: "100%",
                height: 44,
                padding: "0 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 13.5,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5 }}>
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{
                width: "100%",
                height: 44,
                padding: "0 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 13.5,
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            style={{
              height: 46,
              borderRadius: 11,
              border: "none",
              background: ACCENT,
              color: "#fff",
              fontFamily: SORA,
              fontWeight: 800,
              fontSize: 14,
              cursor: busy ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 6,
            }}
          >
            {busy ? <Loader2 size={16} className="cp-spin" /> : "Save & Access Dashboard"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ── Main Redesigned Mentor Dashboard ─────────────────────────── */
export default function MentorDashboard() {
  const [token, setToken] = useState(readToken);
  const [mentor, setMentor] = useState(null);
  const [booting, setBooting] = useState(!!readToken());

  // Navigation tab: "workspace" | "logins" | "assign" | "matrix"
  const [activeTab, setActiveTab] = useState("workspace");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Student caseload data
  const [students, setStudents] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [report, setReport] = useState({ progress: null, tests: [], tasks: [], updatedAt: null });
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [err, setErr] = useState("");
  const [quizOpen, setQuizOpen] = useState(false);

  const signOut = useCallback(() => {
    writeToken("");
    setToken("");
    setMentor(null);
    setStudents([]);
    setActiveId("");
    setReport({ progress: null, tests: [], tasks: [], updatedAt: null });
  }, []);

  // Resume stored mentor session
  useEffect(() => {
    if (!token) {
      setBooting(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { mentor: m } = await apiMentorMe(token);
        if (!cancelled) setMentor(m);
      } catch {
        if (!cancelled) signOut();
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, signOut]);

  // Load assigned students list
  useEffect(() => {
    if (!token || !mentor || mentor.mustChangePassword) return;
    let cancelled = false;
    (async () => {
      try {
        const { students: list } = await apiMentorStudents(token);
        if (cancelled) return;
        setStudents(list);
        setActiveId((cur) => cur || list[0]?.studentId || "");
      } catch (e) {
        if (!cancelled) setErr(e.message || "Could not load assigned students");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, mentor]);

  // Load single student data
  useEffect(() => {
    if (!token || !activeId) return;
    let cancelled = false;
    setLoadingStudent(true);
    setErr("");
    (async () => {
      try {
        const [p, t, k] = await Promise.all([
          apiMentorStudentProgress(token, activeId),
          apiMentorStudentTests(token, activeId).catch(() => ({ attempts: [] })),
          apiMentorStudentTasks(token, activeId).catch(() => ({ tasks: [] })),
        ]);
        if (cancelled) return;
        setReport({
          progress: p.data,
          tests: t.attempts || [],
          tasks: k.tasks || [],
          updatedAt: p.updatedAt,
        });
      } catch (e) {
        if (!cancelled) setErr(e.message || "Could not load this student's data");
      } finally {
        if (!cancelled) setLoadingStudent(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, activeId]);

  const saveTasks = useCallback(
    async (texts) => {
      if (!token || !activeId) return;
      const { tasks } = await apiMentorSetStudentTasks(token, activeId, texts);
      setReport((r) => ({ ...r, tasks }));
      return tasks;
    },
    [token, activeId]
  );

  const activeStudent = students.find((s) => s.studentId === activeId) || students[0];

  if (booting) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
        <Loader2 size={32} className="cp-spin" color={ACCENT} />
      </div>
    );
  }

  if (!token || !mentor) {
    return (
      <>
        <Seo title="Mentor sign in · Campus Point" robots="noindex, nofollow" />
        <Login onDone={(t, m) => { setToken(t); setMentor(m); }} />
      </>
    );
  }

  if (mentor.mustChangePassword) {
    return (
      <>
        <Seo title="Set your password · Campus Point" robots="noindex, nofollow" />
        <SetPassword token={token} onDone={(t, m) => { setToken(t); setMentor(m); }} />
      </>
    );
  }

  const NAV_ITEMS = [
    { id: "workspace", label: "Student Workspace", icon: UserCheck, desc: "Study log, tests, backlog" },
    { id: "logins", label: "Student Login Telemetry", icon: Activity, desc: "Authentication events & pie chart" },
    { id: "assign", label: "Exam & Task Studio", icon: Zap, desc: "Question bank generator & task assigner" },
    { id: "matrix", label: "All Mentees Matrix", icon: Trophy, desc: "Complete scores & comparative overview" },
  ];

  return (
    <>
      <Seo title="Mentor Console · Campus Point" robots="noindex, nofollow" />

      <div
        className="mentor-console-root"
        style={{
          display: "flex",
          minHeight: "calc(100vh - 98px)",
          paddingTop: 98,
          background: "#f8fafc",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#0f172a",
          boxSizing: "border-box",
        }}
      >
        {/* Mobile Navigation Drawer Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 998,
              background: "rgba(15, 23, 42, 0.45)",
              backdropFilter: "blur(4px)",
            }}
          />
        )}

        {/* ── Sleek Modern Sidebar (Desktop & Mobile Drawer) ── */}
        <aside
          style={{
            width: 270,
            background: "#ffffff",
            borderRight: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            zIndex: mobileMenuOpen ? 999 : 95,
            position: mobileMenuOpen ? "fixed" : "sticky",
            top: mobileMenuOpen ? 0 : 98,
            left: 0,
            bottom: 0,
            height: mobileMenuOpen ? "100vh" : "calc(100vh - 98px)",
            overflowY: "auto",
            transform: mobileMenuOpen ? "translateX(0)" : "translateX(0)",
            boxShadow: mobileMenuOpen ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
            transition: "transform 0.25s ease",
          }}
          className={mobileMenuOpen ? "sidebar-mobile-open" : "sidebar-desktop"}
        >
          {/* Sidebar Header / Brand */}
          <div
            style={{
              padding: "20px 20px 18px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 16,
                  fontFamily: SORA,
                  boxShadow: "0 6px 16px -4px rgba(255,105,61,0.4)",
                }}
              >
                CP
              </div>
              <div>
                <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 15, color: "#0f172a", lineHeight: 1.2 }}>
                  Campus Point
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: ACCENT, letterSpacing: 0.8, textTransform: "uppercase" }}>
                  Mentor Console
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-only-btn"
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Mentor Profile Pill */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#f8fafc",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #eef2f7",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: `${ACCENT}15`,
                  color: ACCENT,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                {mentor.name?.charAt(0) || "M"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {mentor.name}
                </div>
                <div style={{ fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {mentor.college || mentor.email}
                </div>
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: "#16a34a",
                  background: "#ecfdf5",
                  padding: "2px 6px",
                  borderRadius: 6,
                }}
              >
                {students.length} mentees
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div style={{ padding: "14px 12px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, padding: "0 10px 6px" }}>
              Main Navigation
            </div>

            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    background: active ? `${ACCENT}12` : "transparent",
                    color: active ? ACCENT : "#475569",
                    fontWeight: active ? 800 : 600,
                    fontSize: 12.5,
                    transition: "all .15s ease",
                  }}
                >
                  <Icon size={16} color={active ? ACCENT : "#64748b"} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ lineHeight: 1.2 }}>{item.label}</div>
                  </div>
                  {active && <ChevronRight size={14} color={ACCENT} />}
                </button>
              );
            })}

            {/* Quick Mentee Switcher in Sidebar */}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px 8px" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Assigned Students ({students.length})
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 180, overflowY: "auto" }}>
                {students.map((s) => {
                  const isCurrent = s.studentId === activeId;
                  return (
                    <button
                      key={s.studentId}
                      onClick={() => {
                        setActiveId(s.studentId);
                        if (activeTab === "matrix") setActiveTab("workspace");
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 10px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        background: isCurrent ? "#f1f5f9" : "transparent",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: isCurrent ? ACCENT : "#cbd5e1",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: isCurrent ? 800 : 500,
                          color: isCurrent ? "#0f172a" : "#475569",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.name}
                      </span>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>{s.studentId}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div style={{ padding: "14px 16px", borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={signOut}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                width: "100%",
                padding: "9px 12px",
                borderRadius: 9,
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#64748b",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all .15s ease",
              }}
            >
              <LogOut size={13} /> Sign Out of Console
            </button>
          </div>
        </aside>

        {/* ── Main Content Area with Sticky Header ── */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          {/* Top Sticky Navigation Bar */}
          <header
            style={{
              position: "sticky",
              top: 98,
              zIndex: 90,
              background: "#ffffff",
              borderBottom: "1px solid #e2e8f0",
              height: 52,
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="mobile-hamburger-btn"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  color: "#0f172a",
                }}
              >
                <Menu size={18} />
              </button>

              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b" }}>
                <span>Mentor</span>
                <span>/</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>
                  {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
                </span>
                {activeStudent && activeTab === "workspace" && (
                  <>
                    <span>/</span>
                    <span style={{ color: ACCENT, fontWeight: 700 }}>{activeStudent.name}</span>
                  </>
                )}
              </div>
            </div>

            {/* Right Header Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Student Switcher Dropdown */}
              {students.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600 }} className="desktop-only-txt">
                    Mentee:
                  </span>
                  <select
                    value={activeId}
                    onChange={(e) => setActiveId(e.target.value)}
                    style={{
                      height: 34,
                      padding: "0 10px",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#0f172a",
                      outline: "none",
                      cursor: "pointer",
                      maxWidth: 160,
                    }}
                  >
                    {students.map((s) => (
                      <option key={s.studentId} value={s.studentId}>
                        {s.name} ({s.studentId})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Live Atlas Sync Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#16a34a",
                  background: "#f0fdf4",
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid #bbf7d0",
                }}
                className="desktop-only-txt"
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#16a34a",
                    boxShadow: "0 0 0 2px rgba(22,163,74,0.2)",
                  }}
                />
                Live
              </div>
            </div>
          </header>

          {/* Main Body Content Container */}
          <main style={{ padding: "24px 28px 80px", flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
            {err && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                  padding: "11px 13px",
                  fontSize: 12.5,
                  color: "#b91c1c",
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} /> {err}
              </div>
            )}

            {/* TAB 1: Student Workspace (Individual Mentee Study Log, Allen Test Analysis, Backlog, Tasks) */}
            {activeTab === "workspace" && (
              <div>
                {students.length === 0 ? (
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 16,
                      textAlign: "center",
                      padding: "50px 20px",
                    }}
                  >
                    <Users size={32} color={ACCENT} style={{ opacity: 0.7 }} />
                    <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 16, color: "#0f172a", margin: "12px 0 5px" }}>
                      No Students Assigned Yet
                    </h3>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0, maxWidth: 420, marginInline: "auto" }}>
                      Your administrator assigns students by CP ID. Once assigned, their study logs, CBT tests, and fix-lists will populate here.
                    </p>
                  </div>
                ) : loadingStudent ? (
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 16,
                      minHeight: 380,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Loader2 size={24} className="cp-spin" color={ACCENT} />
                  </div>
                ) : (
                  <StudentReport
                    progress={report.progress}
                    tests={report.tests}
                    tasks={report.tasks}
                    updatedAt={report.updatedAt}
                    onSaveTasks={saveTasks}
                  />
                )}
              </div>
            )}

            {/* TAB 2: Student Login Telemetry & Interactive Pie Chart */}
            {activeTab === "logins" && (
              <StudentLoginTracking
                token={token}
                onSelectStudent={(sid) => {
                  setActiveId(sid);
                  setActiveTab("workspace");
                }}
              />
            )}

            {/* TAB 3: Redesigned Examination & Task Studio */}
            {activeTab === "assign" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Header Strip */}
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
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Zap size={18} color={ACCENT} />
                    <div>
                      <h3 style={{ fontFamily: SORA, fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        Examination &amp; Task Studio
                      </h3>
                      <p style={{ fontSize: 11.5, color: "#64748b", margin: 0 }}>
                        Create interactive chapter quiz papers and assign targeted weekly tasks
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setQuizOpen(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "9px 18px",
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)",
                      color: "#fff",
                      border: "none",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: "pointer",
                      boxShadow: "0 4px 14px -3px rgba(255,105,61,0.4)",
                    }}
                  >
                    <Zap size={15} /> Launch Test Generator
                  </button>
                </div>

                {/* Dual Studio Panes */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: 18,
                  }}
                >
                  {/* Left Pane: Curated Question Banks */}
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 16,
                      padding: "20px",
                      boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <BookOpen size={16} color={ACCENT} />
                      <h4 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 14.5, color: "#0f172a", margin: 0 }}>
                        Question Banks &amp; Exam Papers
                      </h4>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1.5px solid #e2e8f0",
                          borderRadius: 12,
                          padding: "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "#2563eb", background: "#eff6ff", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>
                            Physics · Class 11
                          </span>
                          <div style={{ fontWeight: 800, fontSize: 13.5, color: "#0f172a", marginTop: 4 }}>
                            Units &amp; Measurements Question Bank
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                            47 Verified NTA-pattern questions · Single &amp; Numerical type
                          </div>
                        </div>

                        <button
                          onClick={() => setQuizOpen(true)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "none",
                            background: ACCENT,
                            color: "#fff",
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Generate
                        </button>
                      </div>

                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1.5px solid #e2e8f0",
                          borderRadius: 12,
                          padding: "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "#059669", background: "#ecfdf5", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>
                            Chemistry · Physical
                          </span>
                          <div style={{ fontWeight: 800, fontSize: 13.5, color: "#0f172a", marginTop: 4 }}>
                            Mole Concept &amp; Stoichiometry Bank
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                            35 Verified questions · Balanced equations &amp; yield
                          </div>
                        </div>

                        <button
                          onClick={() => setQuizOpen(true)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "none",
                            background: ACCENT,
                            color: "#fff",
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Generate
                        </button>
                      </div>

                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1.5px solid #e2e8f0",
                          borderRadius: 12,
                          padding: "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "#7c3aed", background: "#f5f3ff", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>
                            Mathematics · Calculus
                          </span>
                          <div style={{ fontWeight: 800, fontSize: 13.5, color: "#0f172a", marginTop: 4 }}>
                            Limits, Continuity &amp; Differentiability
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                            42 Verified questions · L'Hôpital &amp; standard forms
                          </div>
                        </div>

                        <button
                          onClick={() => setQuizOpen(true)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "none",
                            background: ACCENT,
                            color: "#fff",
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Pane: Direct Task Assignment Studio */}
                  <div
                    style={{
                      background: "#fff",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 16,
                      padding: "20px",
                      boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <ClipboardList size={16} color={ACCENT} />
                        <h4 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 14.5, color: "#0f172a", margin: 0 }}>
                          Task Manager for {activeStudent?.name || "Mentee"}
                        </h4>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                        {report.tasks?.length || 0} active
                      </span>
                    </div>

                    <p style={{ fontSize: 11.5, color: "#64748b", margin: "0 0 14px", lineHeight: 1.45 }}>
                      Tasks assigned here immediately sync to {activeStudent?.name}'s mandatory "From your mentor" fix-list on their dashboard.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {report.tasks && report.tasks.length > 0 ? (
                        report.tasks.map((t, idx) => (
                          <div
                            key={t.id || idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              background: t.completed ? "#f0fdf4" : "#f8fafc",
                              border: `1px solid ${t.completed ? "#bbf7d0" : "#e2e8f0"}`,
                              borderRadius: 10,
                              padding: "10px 12px",
                              fontSize: 12.5,
                            }}
                          >
                            <span
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                display: "grid",
                                placeItems: "center",
                                background: t.completed ? "#16a34a" : "#fff",
                                border: `1.5px solid ${t.completed ? "#16a34a" : "#cbd5e1"}`,
                                color: "#fff",
                                fontSize: 10,
                                flexShrink: 0,
                              }}
                            >
                              {t.completed && "✓"}
                            </span>
                            <span
                              style={{
                                flex: 1,
                                color: t.completed ? "#166534" : "#0f172a",
                                textDecoration: t.completed ? "line-through" : "none",
                                fontWeight: 500,
                              }}
                            >
                              {t.text}
                            </span>
                            {t.completed && (
                              <span style={{ fontSize: 10, fontWeight: 800, color: "#16a34a", background: "#dcfce7", padding: "1px 6px", borderRadius: 4 }}>
                                Completed
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "30px 10px", textAlign: "center", color: "#94a3b8", fontSize: 12.5 }}>
                          No tasks assigned to {activeStudent?.name} yet. Switch to Workspace to add tasks.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: All Mentees Matrix (Complete scores for all students) */}
            {activeTab === "matrix" && (
              <AllMenteesMatrix
                token={token}
                onSelectStudent={(sid) => {
                  setActiveId(sid);
                  setActiveTab("workspace");
                }}
              />
            )}
          </main>
        </div>

        {/* Chapter Quiz Creator Modal */}
        <ChapterQuizModal
          isOpen={quizOpen}
          onClose={() => setQuizOpen(false)}
          chapterName="Units and Measurements"
        />
      </div>

      <style>{`
        .cp-spin { animation: cp-spin 0.9s linear infinite; }
        @keyframes cp-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .cp-spin { animation-duration: 2.4s; } }
        
        .mobile-hamburger-btn { display: none; }
        .mobile-only-btn { display: none; }
        
        @media (max-width: 900px) {
          .mobile-hamburger-btn { display: grid !important; }
          .mobile-only-btn { display: block !important; }
          .desktop-only-txt { display: none !important; }
          .sidebar-desktop {
            position: fixed !important;
            transform: translateX(-100%) !important;
          }
          .sidebar-mobile-open {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}
