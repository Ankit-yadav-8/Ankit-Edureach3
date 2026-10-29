import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, LogOut, Lock, Loader2, ShieldCheck, AlertCircle, Zap,
  Activity, BookOpen, Trophy, ClipboardList, CheckCircle2, Menu,
  X, ArrowRight, Eye, EyeOff, Mail, RefreshCw, ChevronRight, ChevronLeft,
  Sparkles, UserCheck, Flame, Target, Award, Trash2, Plus, Tag, Search,
  Video, Calendar, Clock, TrendingUp, MoreVertical, Building2, ExternalLink,
  Lightbulb, Check, Percent, Hash, Layers, Home, GraduationCap,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import StudentReport from "../components/mentor/StudentReport.jsx";
import StudentLoginTracking from "../components/mentor/StudentLoginTracking.jsx";
import AllMenteesMatrix from "../components/mentor/AllMenteesMatrix.jsx";
import ChapterQuizModal from "../components/quiz/ChapterQuizModal.jsx";
import {
  apiMentorLogin, apiMentorMe, apiMentorSetPassword, apiMentorStudents,
  apiMentorStudentProgress, apiMentorStudentTests, apiMentorStudentTasks,
  apiMentorSetStudentTasks, apiMentorStudentsOverview, apiMentorSetStudentSession,
} from "../auth/api.js";

const ACCENT = "#ff5e36";
const ACCENT_DARK = "#e04924";
const ACCENT_LIGHT = "#fff5f2";

const TOKEN_KEY = "cp:mentorToken";
const readToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; } };
const writeToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ } };

function freshness(updatedAt) {
  if (!updatedAt) return "2h ago";
  const mins = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

/* ── Modern Premium Mentor Login ─── */
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
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4 font-inter text-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-floating p-8"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            CP
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mentor Workspace Console</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in with your verified mentor credentials</p>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0" /> {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mentor@campuspoint.in"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 cp-focus-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 cp-focus-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy || !email || !password}
            className="w-full py-2.5 mt-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="cp-spin" /> Verifying...
              </>
            ) : (
              <>
                Sign In to Console <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Protected mentor gateway · Students sign in via{" "}
          <a href="/mentorship" className="text-brand-600 font-bold hover:underline">
            Mentorship Portal
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Forced Password Change Screen ─── */
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
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4 font-inter text-slate-800">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-floating p-8">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Set Permanent Password</h3>
        <p className="text-xs text-slate-500 mb-4">Please set a secure permanent password for your mentor account.</p>

        {err && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">{err}</div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password</label>
            <input
              type="password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm cp-focus-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Password (min 8 chars)</label>
            <input
              type="password"
              required
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm cp-focus-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm cp-focus-ring"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-lg shadow-sm transition-all"
          >
            {busy ? <Loader2 size={16} className="cp-spin mx-auto" /> : "Save & Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MASTER MENTOR DASHBOARD
══════════════════════════════════════════════════════════════════════ */
export default function MentorDashboard() {
  const [token, setToken] = useState(readToken);
  const [mentor, setMentor] = useState(null);
  const [booting, setBooting] = useState(!!readToken());

  // Navigation tab: "dashboard" | "workspace" | "logins" | "assign" | "matrix"
  const [activeTab, setActiveTab] = useState("workspace");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mentorDropdownOpen, setMentorDropdownOpen] = useState(false);

  // Student caseload data
  const [students, setStudents] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [report, setReport] = useState({ progress: null, tests: [], tasks: [], updatedAt: null });
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [err, setErr] = useState("");
  const [quizOpen, setQuizOpen] = useState(false);

  // Task Studio state (for Tab 4)
  const [taskStudioTab, setTaskStudioTab] = useState("mentee");
  const [newTaskInput, setNewTaskInput] = useState("");
  const [taskSaving, setTaskSaving] = useState(false);
  const [allMenteesTasks, setAllMenteesTasks] = useState([]);
  const [loadingAllTasks, setLoadingAllTasks] = useState(false);
  const [rosterSearch, setRosterSearch] = useState("");
  const [rosterStatusFilter, setRosterStatusFilter] = useState("all");

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
    return () => { cancelled = true; };
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
    return () => { cancelled = true; };
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
    return () => { cancelled = true; };
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

  const saveSession = useCallback(
    async (sessionData) => {
      if (!token || !activeId) return;
      try {
        await apiMentorSetStudentSession(token, activeId, sessionData);
      } catch (e) {
        console.warn("apiMentorSetStudentSession fallback to local", e?.message);
      }
      try {
        localStorage.setItem(`cp:mentorSession:${activeId.toUpperCase()}`, JSON.stringify(sessionData));
        window.dispatchEvent(new CustomEvent("cp:sessionUpdated", { detail: { studentId: activeId, session: sessionData } }));
      } catch {}
      return sessionData;
    },
    [token, activeId]
  );

  const fetchAllMenteesTasks = useCallback(async () => {
    if (!token) return;
    setLoadingAllTasks(true);
    try {
      const res = await apiMentorStudentsOverview(token);
      const roster = [];
      (res.students || []).forEach((st) => {
        (st.taskStats?.tasks || []).forEach((t) => {
          roster.push({
            ...t,
            studentId: st.studentId,
            studentName: st.name,
            studentEmail: st.email,
            studentGroup: st.studentGroup || "Campus-Point-1",
            plan: st.plan,
          });
        });
      });
      setAllMenteesTasks(roster);
    } catch (e) {
      console.error("Failed to fetch all mentees tasks:", e);
    } finally {
      setLoadingAllTasks(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "assign") {
      fetchAllMenteesTasks();
    }
  }, [activeTab, fetchAllMenteesTasks]);

  const activeStudentIndex = useMemo(() => {
    const idx = students.findIndex((s) => s.studentId === activeId);
    return idx >= 0 ? idx : 0;
  }, [students, activeId]);

  const activeStudent = students[activeStudentIndex] || students[0];

  const handlePrevStudent = () => {
    if (students.length <= 1) return;
    const prevIdx = (activeStudentIndex - 1 + students.length) % students.length;
    setActiveId(students[prevIdx].studentId);
  };

  const handleNextStudent = () => {
    if (students.length <= 1) return;
    const nextIdx = (activeStudentIndex + 1) % students.length;
    setActiveId(students[nextIdx].studentId);
  };

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Loader2 size={32} className="cp-spin text-brand-500" />
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

  const PRIMARY_NAV = [
    { id: "dashboard", label: "Dashboard", fa: "fa-solid fa-house", icon: Home },
    { id: "workspace", label: "Student Workspace", fa: "fa-solid fa-user-graduate", icon: UserCheck },
    { id: "logins", label: "Login Telemetry", fa: "fa-solid fa-chart-line", icon: Activity },
    { id: "assign", label: "Exam & Task Studio", fa: "fa-solid fa-clipboard-list", icon: Zap },
    { id: "matrix", label: "All Mentees Matrix", fa: "fa-solid fa-users", icon: Trophy },
  ];

  return (
    <>
      <Seo title="Mentor Console · Campus Point" robots="noindex, nofollow" />

      <div className="h-screen flex overflow-hidden text-slate-800 antialiased font-inter bg-surface-50">
        
        {/* Mobile Navigation Drawer Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          />
        )}

        {/* ── LEFT SIDEBAR (Desktop Fixed & Mobile Slide Drawer) ── */}
        <aside
          className={`w-64 bg-white border-r border-slate-200/80 flex flex-col h-full flex-shrink-0 z-50 transition-transform duration-200 ease-in-out fixed lg:static inset-y-0 left-0 ${
            mobileMenuOpen ? "translate-x-0 shadow-floating" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-brand-500 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
                CP
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-[15px]">Campus Point</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Sidebar Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar py-6 px-4 space-y-7">
            {/* Mentor Profile snippet */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm border border-brand-100/50 flex-shrink-0">
                {mentor.name?.charAt(0) || "M"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                  {mentor.name || "Mentor"}
                </span>
                <span className="text-[11px] text-slate-500 font-medium truncate">
                  {mentor.college || mentor.email}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 w-fit px-1.5 rounded mt-0.5">
                  {students.length} mentees
                </span>
              </div>
            </div>

            {/* Primary Navigation */}
            <nav className="space-y-1">
              {PRIMARY_NAV.map((item) => {
                const active = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left relative cursor-pointer ${
                      active
                        ? "font-semibold text-brand-600 bg-brand-50/50"
                        : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-500 rounded-r-full" />
                    )}
                    <i className={`${item.fa} w-4 ${active ? "text-brand-500" : "text-slate-400"}`}></i>
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Assigned Students */}
            <div>
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Assigned Students ({students.length})
              </h3>
              <nav className="space-y-0.5 max-h-56 overflow-y-auto hide-scrollbar">
                {students.map((s) => {
                  const isCurrent = s.studentId === activeId;
                  return (
                    <button
                      key={s.studentId}
                      onClick={() => {
                        setActiveId(s.studentId);
                        if (activeTab === "matrix" || activeTab === "dashboard") {
                          setActiveTab("workspace");
                        }
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer border ${
                        isCurrent
                          ? "font-medium text-slate-900 bg-slate-100/50 border-slate-200/50"
                          : "font-medium text-slate-500 hover:bg-slate-50 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            isCurrent ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                        <span className="truncate">{s.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 ml-1">
                        {s.studentId?.replace("CP-", "") || ""}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100 flex-shrink-0">
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 px-2 py-1.5 transition-colors w-full rounded-lg cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i> Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN DASHBOARD AREA ── */}
        <main className="flex-1 flex flex-col min-w-0 bg-surface-50 overflow-hidden">
          
          {/* TOP NAVBAR */}
          <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0">
            {/* Breadcrumbs & Hamburger */}
            <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 mr-1"
                title="Open menu"
              >
                <Menu size={16} />
              </button>

              <i className="fa-solid fa-house text-slate-400 text-xs hidden sm:inline"></i>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span
                onClick={() => setActiveTab("dashboard")}
                className="hover:text-slate-800 cursor-pointer transition-colors truncate"
              >
                Mentor
              </span>
              <span className="text-slate-300">/</span>
              <span className="hover:text-slate-800 cursor-pointer transition-colors truncate">
                {PRIMARY_NAV.find((p) => p.id === activeTab)?.label}
              </span>
              {activeStudent && (activeTab === "workspace" || activeTab === "logins") && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="font-semibold text-slate-800 truncate">{activeStudent.name}</span>
                </>
              )}
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              {/* Live Indicator */}
              <div className="flex items-center gap-2 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-emerald-700">Live</span>
              </div>

              <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

              {/* Mentee Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMentorDropdownOpen(!mentorDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 shadow-sm rounded-lg px-2.5 sm:px-3 py-1.5 transition-all hover:border-slate-300 cursor-pointer"
                >
                  <span className="text-slate-500 font-normal hidden md:inline">Mentee:</span>
                  <span className="font-semibold truncate max-w-[120px] sm:max-w-[160px]">
                    {activeStudent?.name || mentor.name}
                  </span>
                  <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 ml-0.5"></i>
                </button>

                {mentorDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-floating py-1.5 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Switch Mentee Workspace
                    </div>
                    <div className="max-h-60 overflow-y-auto cp-custom-scroll">
                      {students.map((s) => (
                        <button
                          key={s.studentId}
                          onClick={() => {
                            setActiveId(s.studentId);
                            setMentorDropdownOpen(false);
                            if (activeTab === "matrix") setActiveTab("workspace");
                          }}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                            s.studentId === activeId ? "bg-brand-50 text-brand-600 font-bold" : "text-slate-700"
                          }`}
                        >
                          <span className="truncate">{s.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">{s.studentId}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setQuizOpen(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                title="Launch Question Bank / Test Generator"
              >
                <Zap size={14} className="text-brand-500" />
              </button>
            </div>
          </header>

          {/* ── TWO-COLUMN WORKSPACE BODY ── */}
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            
            {/* CENTER CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 hide-scrollbar">
              
              {/* TAB 1: Dashboard Overview Hub */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Top Welcome Strip */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-tight">
                        Welcome back, {mentor.name} 👋
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Here is your mentorship overview across all {students.length} assigned JEE &amp; NEET aspirants.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("workspace")}
                      className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer w-fit"
                    >
                      <i className="fa-solid fa-user-graduate text-xs"></i> Open Student Workspace
                    </button>
                  </div>

                  {/* 4 KPI Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Total Mentees</span>
                        <span className="w-7 h-7 rounded-lg bg-orange-50 text-brand-500 flex items-center justify-center">
                          <Users size={14} />
                        </span>
                      </div>
                      <div className="text-xl font-bold text-slate-900">{students.length}</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Assigned</div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Live 1-on-1 Rooms</span>
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Video size={14} />
                        </span>
                      </div>
                      <div className="text-xl font-bold text-slate-900">Active</div>
                      <div className="text-[11px] text-slate-500 mt-1">Ready for connecting</div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Question Banks</span>
                        <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <BookOpen size={14} />
                        </span>
                      </div>
                      <div className="text-xl font-bold text-slate-900">3 Verified</div>
                      <div className="text-[11px] text-slate-500 mt-1">Phy, Chem, Calculus</div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">All Mentees Matrix</span>
                        <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Trophy size={14} />
                        </span>
                      </div>
                      <div className="text-xl font-bold text-slate-900">{students.length} Ranked</div>
                      <div className="text-[11px] text-slate-500 mt-1">Comparative metrics</div>
                    </div>
                  </div>

                  {/* Assigned Students Caseload Table */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl shadow-subtle overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">Your Student Caseload</h3>
                        <p className="text-xs text-slate-500">Click any student to view their 1-on-1 room, study log, and test scores</p>
                      </div>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {students.length} Aspirants
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {students.map((s, idx) => (
                        <div
                          key={s.studentId}
                          onClick={() => {
                            setActiveId(s.studentId);
                            setActiveTab("workspace");
                          }}
                          className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer flex-wrap gap-3"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm border border-brand-100/60 flex-shrink-0">
                              {s.name?.charAt(0) || "S"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">{s.name}</span>
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {s.studentId}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                Goal: <span className="text-slate-700 font-medium">{s.targetCollege || "IIT Roorkee"}</span> · {s.plan || "JEE Mentorship"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                              Active Mentee
                            </span>
                            <button
                              type="button"
                              className="text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
                            >
                              Open Workspace →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Student Workspace (1-on-1 Meet, Study Log, Test Analysis, Assign Tasks) */}
              {activeTab === "workspace" && (
                <div>
                  {students.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl text-center py-16 px-4 shadow-subtle">
                      <Users size={36} className="text-brand-500 mx-auto mb-3 opacity-70" />
                      <h3 className="text-base font-bold text-slate-900 mb-1">No Students Assigned Yet</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Once an administrator assigns mentees to your CP ID, their workspaces will populate here.
                      </p>
                    </div>
                  ) : loadingStudent ? (
                    <div className="bg-white border border-slate-200 rounded-2xl min-h-[380px] flex items-center justify-center shadow-subtle">
                      <Loader2 size={28} className="cp-spin text-brand-500" />
                    </div>
                  ) : (
                    <StudentReport
                      progress={report.progress}
                      tests={report.tests}
                      tasks={report.tasks}
                      updatedAt={report.updatedAt}
                      onSaveTasks={saveTasks}
                      studentId={activeId}
                      student={activeStudent}
                      token={token}
                      onSaveSession={saveSession}
                      onPrevStudent={handlePrevStudent}
                      onNextStudent={handleNextStudent}
                      studentIndex={activeStudentIndex}
                      totalStudents={students.length}
                    />
                  )}
                </div>
              )}

              {/* TAB 3: Student Login Telemetry */}
              {activeTab === "logins" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-subtle">
                  <StudentLoginTracking
                    token={token}
                    activeStudentId={activeId}
                    students={students}
                    onSelectStudent={(sid) => setActiveId(sid)}
                    onOpenReport={(sid) => {
                      setActiveId(sid);
                      setActiveTab("workspace");
                    }}
                  />
                </div>
              )}

              {/* TAB 4: Exam & Task Studio */}
              {activeTab === "assign" && (
                <div className="space-y-6">
                  {/* Header Strip */}
                  <div className="flex items-center justify-between flex-wrap gap-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center border border-brand-100 flex-shrink-0">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          Examination &amp; Task Studio
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Create targeted chapter mock quiz papers and assign weekly goals
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setQuizOpen(true)}
                      className="px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Zap size={14} /> Launch Test Generator
                    </button>
                  </div>

                  {/* Dual Panes */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Pane: Curated Question Banks */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={16} className="text-brand-500" />
                        <h4 className="text-xs font-bold text-slate-900">Curated Question Banks</h4>
                      </div>

                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                              Physics · Class 11
                            </span>
                            <div className="text-xs font-bold text-slate-900 mt-1">
                              Units &amp; Measurements Question Bank
                            </div>
                            <div className="text-[11px] text-slate-500">
                              47 Verified NTA-pattern questions · Single &amp; Numerical type
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setQuizOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-colors cursor-pointer"
                          >
                            Generate
                          </button>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                              Chemistry · Physical
                            </span>
                            <div className="text-xs font-bold text-slate-900 mt-1">
                              Mole Concept &amp; Stoichiometry Bank
                            </div>
                            <div className="text-[11px] text-slate-500">
                              35 Verified questions · Balanced equations &amp; yield
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setQuizOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-colors cursor-pointer"
                          >
                            Generate
                          </button>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase">
                              Mathematics · Calculus
                            </span>
                            <div className="text-xs font-bold text-slate-900 mt-1">
                              Limits, Continuity &amp; Differentiability
                            </div>
                            <div className="text-[11px] text-slate-500">
                              42 Verified questions · L'Hôpital &amp; standard forms
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setQuizOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-colors cursor-pointer"
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Pane: All Mentees Assigned Tasks Roster */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <ClipboardList size={16} className="text-brand-500" />
                          <h4 className="text-xs font-bold text-slate-900">All Mentees Assigned Tasks</h4>
                        </div>
                        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                          {allMenteesTasks.length} Total
                        </span>
                      </div>

                      {/* Filter Bar */}
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Filter by name, ID, or task..."
                            value={rosterSearch}
                            onChange={(e) => setRosterSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none cp-focus-ring"
                          />
                        </div>
                        <select
                          value={rosterStatusFilter}
                          onChange={(e) => setRosterStatusFilter(e.target.value)}
                          className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none bg-white cursor-pointer"
                        >
                          <option value="all">All</option>
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>

                      {/* Tasks Roster List */}
                      <div className="space-y-2 max-h-72 overflow-y-auto cp-custom-scroll">
                        {loadingAllTasks ? (
                          <div className="py-12 text-center text-xs text-slate-400">
                            <Loader2 size={16} className="cp-spin mx-auto mb-2 text-brand-500" /> Loading all mentees tasks...
                          </div>
                        ) : allMenteesTasks.length === 0 ? (
                          <div className="py-12 text-center text-xs text-slate-400">
                            No assigned tasks found across your student caseload.
                          </div>
                        ) : (
                          allMenteesTasks
                            .filter((t) => {
                              if (rosterStatusFilter === "completed" && !t.completed) return false;
                              if (rosterStatusFilter === "pending" && t.completed) return false;
                              if (rosterSearch.trim()) {
                                const q = rosterSearch.toLowerCase().trim();
                                return (
                                  t.studentName?.toLowerCase().includes(q) ||
                                  t.studentId?.toLowerCase().includes(q) ||
                                  t.text?.toLowerCase().includes(q)
                                );
                              }
                              return true;
                            })
                            .map((t, idx) => (
                              <div
                                key={t.id || idx}
                                className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className="font-bold text-slate-900">{t.studentName}</span>
                                    <span className="font-mono text-[10px] text-slate-400">({t.studentId})</span>
                                  </div>
                                  <p className="text-slate-700 truncate">{t.text}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    t.completed ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-brand-600"
                                  }`}>
                                    {t.completed ? "Completed" : "Pending"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveId(t.studentId);
                                      setActiveTab("workspace");
                                    }}
                                    className="px-2 py-1 bg-white border border-slate-200 rounded text-brand-600 font-bold hover:bg-slate-50 cursor-pointer text-[10px]"
                                  >
                                    Open →
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: All Mentees Matrix */}
              {activeTab === "matrix" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-subtle">
                  <AllMenteesMatrix
                    token={token}
                    onSelectStudent={(sid) => {
                      setActiveId(sid);
                      setActiveTab("workspace");
                    }}
                  />
                </div>
              )}

            </div>

            {/* ── RIGHT SIDEBAR (Quick Details - Exact Template Layout) ── */}
            <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200/80 p-6 overflow-y-auto hide-scrollbar flex-shrink-0 space-y-6">
              
              {/* Student Overview Card */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-regular fa-id-badge text-slate-400"></i> Student Overview
                </h3>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-brand-600 flex items-center justify-center font-bold border border-orange-200">
                        {activeStudent?.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {activeStudent?.name || "Assigned Student"}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                          {activeStudent?.studentId || "CP-2026-00001"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                      Active
                    </span>
                  </div>
                  
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2.5 text-xs text-slate-600">
                      <i className="fa-solid fa-building-columns w-4 text-center text-slate-400"></i>
                      <span className="font-medium">
                        {activeStudent?.targetCollege || "IIT Roorkee Goal"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-600">
                      <i className="fa-regular fa-calendar w-4 text-center text-slate-400"></i>
                      <span className="font-medium">
                        Batch: <span className="text-slate-800 font-semibold">{activeStudent?.batch || "CP-2026"}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-600">
                      <i className="fa-solid fa-arrows-rotate w-4 text-center text-slate-400"></i>
                      <span className="font-medium">
                        Last Sync: {freshness(report.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-chart-pie text-slate-400"></i> Quick Stats
                </h3>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-500 text-[10px]">
                        <i className="fa-solid fa-hashtag"></i>
                      </div>
                      <span className="text-xs font-medium text-slate-600">Total Sessions</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {(report.tests?.length || 0) + (report.tasks?.length || 0) || 12}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-emerald-50 flex items-center justify-center text-emerald-500 text-[10px]">
                        <i className="fa-solid fa-check"></i>
                      </div>
                      <span className="text-xs font-medium text-slate-600">Completed</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {report.tasks?.filter((t) => t.completed)?.length || 10}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-purple-50 flex items-center justify-center text-purple-500 text-[10px]">
                        <i className="fa-solid fa-clock-rotate-left"></i>
                      </div>
                      <span className="text-xs font-medium text-slate-600">Pending</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {report.tasks?.filter((t) => !t.completed)?.length || 2}
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-end mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-orange-50 flex items-center justify-center text-brand-500 text-[10px]">
                          <i className="fa-solid fa-percent"></i>
                        </div>
                        <span className="text-xs font-medium text-slate-600">Attendance</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">83%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: "83%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-clock-rotate-left text-slate-400"></i> Recent Activity
                </h3>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle relative">
                  <div className="absolute left-[23px] top-6 bottom-6 w-px bg-slate-200"></div>
                  <ul className="space-y-4 relative">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 ring-4 ring-white relative z-10 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800">Student logged in</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{freshness(report.updatedAt)}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-brand-500 ring-4 ring-white relative z-10 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800">Task updated</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Completed 15 PYQs</p>
                        <p className="text-[10px] text-slate-400">4h ago</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-500 ring-4 ring-white relative z-10 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800">Test analysis ready</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">1d ago</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex gap-3">
                <i className="fa-regular fa-lightbulb text-amber-500 mt-0.5"></i>
                <div>
                  <h4 className="text-xs font-bold text-amber-800 mb-1">Pro Tip</h4>
                  <p className="text-[11px] text-amber-700/80 leading-relaxed">
                    Keep session topics focused and update the meet link at least 1 hour before the session starts for a smoother experience.
                  </p>
                </div>
              </div>

            </aside>
          </div>
        </main>

        {/* Chapter Quiz Creator Modal */}
        <ChapterQuizModal
          isOpen={quizOpen}
          onClose={() => setQuizOpen(false)}
          chapterName="Units and Measurements"
        />
      </div>
    </>
  );
}
