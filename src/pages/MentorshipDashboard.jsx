import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, LineChart as LineIcon, Mail, Activity,
  Flame, Clock, CheckCircle2, Target, TrendingUp, TrendingDown, Plus, Sparkles,
  ShieldCheck, ArrowRight, Users, BarChart3, Rocket, Zap, Crosshair, Timer,
  ListChecks, Lock, Loader2, RotateCw, Pencil, Trash2, CalendarDays, Brain,
  BookOpen, Minus, Trophy, Send, Lightbulb, Hourglass, AlertCircle,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiMyEnrollments, apiSendOtp, apiVerifyOtp, apiLogin, apiSendParentReport, apiMyMentorTasks, apiMyMentor, apiGetProgress, apiSaveProgress } from "../auth/api.js";
import Community from "../components/mentorship/Community.jsx";
import TestSeries from "../components/mentorship/TestSeries.jsx";
import { Trend, Gauge, CenterDonut, DonutLegend, Bars } from "../components/Charts.jsx";
import { predictRank, maxPerSubject, maxTotal } from "../utils/rankPredictor.js";

const ORANGE = "#FF693D";
const GOLD = "#FF693D";
const GREEN = "#15a06e";
const NAVY = "#0d1b3e";
const INK = "#1a1a2e";
const MUTE = "#5b6472";

/* ── tiny localStorage helpers (per-user persistence) ─────────────── */
const load = (key, fallback) => {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
  catch { return fallback; }
};
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// Local calendar day (YYYY-MM-DD). Deliberately NOT toISOString(), which is
// UTC — past midnight in IST (UTC+5:30) that rolls the date back a day, so
// "today" showed yesterday and the log/streak landed on the wrong date.
const isoDay = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
// `iso` is a local YYYY-MM-DD from isoDay — parse its parts as a local date so
// the label matches the day exactly, never off by one from a UTC re-parse.
const fmtDay = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};
const fmtFull = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const round1 = (n) => Math.round(Number(n || 0) * 10) / 10;
const inr = (n) => Number(n || 0).toLocaleString("en-IN");

/* ── subjects per exam track (JEE/NEET split Chemistry into 3) ─────── */
function subjectsFor(exam) {
  const e = String(exam || "").toLowerCase();
  if (e.includes("foundation")) return ["Maths", "Science"];
  if (e.includes("neet") && !e.includes("jee")) return ["Physics", "Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Biology"];
  return ["Physics", "Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Maths"]; // JEE / generic
}
const SUBJECT_COLORS = {
  Physics: "#6366f1",
  "Physical Chemistry": "#14b8a6",
  "Organic Chemistry": "#15a06e",
  "Inorganic Chemistry": "#84cc16",
  Chemistry: "#15a06e",
  Maths: "#FF693D",
  Biology: "#ec4899",
  Science: "#06b6d4",
};
const subColor = (s) => SUBJECT_COLORS[s] || "#6366f1";
const SHORT = {
  Physics: "Phy", "Physical Chemistry": "P.Chem", "Organic Chemistry": "O.Chem",
  "Inorganic Chemistry": "I.Chem", Chemistry: "Chem", Maths: "Math", Biology: "Bio", Science: "Sci",
};
const shortName = (s) => SHORT[s] || s;
// Recharts treats dots in a dataKey as a nested path, so chart keys must be
// alphanumeric — labels can still be the pretty short names.
const keyOf = (s) => String(s).replace(/[^a-zA-Z0-9]/g, "");

/* subject hours/tasks for one day — tolerant of the old number-only shape */
const subVal = (entry, s) => {
  const v = entry?.subjects?.[s];
  if (v == null) return { h: 0, t: 0 };
  if (typeof v === "number") return { h: v, t: 0 };
  return { h: Number(v.h) || 0, t: Number(v.t) || 0 };
};

const STRENGTHS = {
  weak:   { label: "Weak",   color: "#ef4444" },
  medium: { label: "Medium", color: "#f59e0b" },
  strong: { label: "Strong", color: "#22c55e" },
};
const CATEGORIES = ["General", "OBC-NCL", "EWS", "SC", "ST"];

const WEEK_TARGET_HRS = 40;
const MAX_LOGS_PER_DAY = 3; // student may add/update today's log up to 3× a day

// JEE Advanced runs as TWO 3-hour papers (P1 + P2), logged together in one
// place. Each paper carries ~60 marks/subject (180/paper · 360 combined) and
// runs 180 minutes — so the full exam is 6 hours (3h + 3h).
const isAdv = (type) => type === "adv";
const ADV_PAPER_SUB_MAX = 60;    // marks per subject in one Advanced paper
const ADV_PAPER_TOTAL   = 180;   // marks per Advanced paper
const ADV_FULL_TOTAL    = 360;   // both papers combined (indicative — varies by year)
const ADV_FULL_QUESTIONS = 102;  // typical total questions across both papers (varies by year)
const ADV_PAPER_MINUTES = 180;   // each Advanced paper is 3 hours (6h total)

/* No demo/seed data: an enrolled student's dashboard starts empty and fills in
   only as they log real work. (Earlier builds seeded the last 7 days, which then
   got persisted to the server and showed as fake hours/tests — see the
   pre-enrolment purge in the body.) */

function streakOf(entries) {
  const set = new Set(entries.map((e) => e.date));
  let streak = 0;
  const d = new Date();
  if (!set.has(isoDay(d))) d.setDate(d.getDate() - 1);
  while (set.has(isoDay(d))) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

function weekKey(d = new Date()) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const yStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const wk = Math.ceil((((dt - yStart) / 86400000) + 1) / 7);
  return `${dt.getUTCFullYear()}-W${wk}`;
}

/* ════════════════════════════════════════════════════════════════
   DEFAULT EXPORT — auth + OTP security gate, then the dashboard
   ════════════════════════════════════════════════════════════════ */
export default function MentorshipDashboard() {
  const { user, isLoggedIn, openLogin } = useAuth();
  const [searchParams] = useSearchParams();
  // Which batch's dashboard to open (a student may own several). Drives both the
  // per-plan localStorage namespace and the batch the community is scoped to.
  const urlPlan = searchParams.get("plan") || "";
  const emailKey = (user?.email || "guest").toLowerCase();
  const OTP_OK_KEY = `mdash:otpok:${emailKey}`;

  const [otpOk, setOtpOk] = useState(() => {
    try { return sessionStorage.getItem(OTP_OK_KEY) === "1"; } catch { return false; }
  });

  useEffect(() => {
    const prev = document.title;
    document.title = "Mentorship Dashboard · College Parichay";
    return () => { document.title = prev; };
  }, []);

  if (!isLoggedIn) {
    return (
      <section style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "120px 16px 60px" }}>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `${ORANGE}15`, display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <ShieldCheck size={30} color={ORANGE} />
          </div>
          <h2 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: "1.5rem", margin: "0 0 8px" }}>Please log in</h2>
          <p style={{ color: "#6b7280", marginBottom: 18 }}>Log in to open your personal mentorship dashboard.</p>
          <button onClick={openLogin} style={{ background: ORANGE, color: "#fff", border: "none", padding: "12px 22px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Sora" }}>Log in</button>
        </div>
      </section>
    );
  }

  if (!otpOk) {
    return (
      <OtpGate
        email={user.email}
        name={user.name}
        onVerified={() => { try { sessionStorage.setItem(OTP_OK_KEY, "1"); } catch {} setOtpOk(true); }}
      />
    );
  }

  // Remount the body when the selected batch changes so every per-plan piece
  // (localStorage namespace, study data, community) re-initialises cleanly.
  return <DashboardBody key={urlPlan || "default"} urlPlan={urlPlan} />;
}

/* ════════════════════════════════════════════════════════════════
   OTP SECURITY GATE
   ════════════════════════════════════════════════════════════════ */
function OtpGate({ email, name, onVerified }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("intro"); // intro | code | password
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const masked = (() => {
    const [u, d] = String(email || "").split("@");
    if (!d) return email;
    const head = u.length <= 2 ? u : u.slice(0, 2) + "•".repeat(Math.max(1, u.length - 2));
    return `${head}@${d}`;
  })();

  const send = async () => {
    setBusy(true); setMsg({ type: "", text: "" });
    try {
      const r = await apiSendOtp({ email, name });
      setMsg({ type: "ok", text: r.devCode ? `Dev OTP: ${r.devCode}` : "Code sent — check your inbox & spam folder." });
      setStep("code");
    } catch (e) {
      setMsg({ type: "err", text: e.message || "Couldn't send the code. Try again." });
    } finally { setBusy(false); }
  };

  const verify = async () => {
    if (code.length < 6) return;
    setBusy(true); setMsg({ type: "", text: "" });
    try {
      await apiVerifyOtp({ email, code });
      onVerified();
    } catch (e) {
      setMsg({ type: "err", text: e.message || "Incorrect code. Try again." });
    } finally { setBusy(false); }
  };

  // Password is a second way to prove the same thing the OTP proves: that the
  // person at the keyboard is this account's owner, not just someone on a
  // logged-in device. It re-checks the sign-up password server-side against this
  // account's own email — so it can't be used to open anyone else's dashboard.
  const verifyPassword = async () => {
    if (!password) return;
    setBusy(true); setMsg({ type: "", text: "" });
    try {
      await apiLogin({ email, password });
      onVerified();
    } catch (e) {
      setMsg({ type: "err", text: e.message || "Incorrect password. Try again." });
    } finally { setBusy(false); }
  };

  // The card is centred, so top padding only shifts it by half of what you add —
  // 120px sat it too close under the fixed header on short, wide viewports.
  // minHeight drops to 88vh so the extra headroom actually moves the card down
  // rather than just making the section taller than the screen.
  return (
    <section style={{ background: "var(--page-bg)", minHeight: "88vh", display: "grid", placeItems: "center", padding: "180px 16px 72px" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 440, background: "var(--page-bg)", borderRadius: 24, border: "1px solid rgba(255, 105, 61,.18)", padding: "34px 30px", boxShadow: "0 30px 70px -40px rgba(13,27,62,.5)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${ORANGE},${GREEN})` }} />

        <div style={{ width: 62, height: 62, borderRadius: 18, background: `linear-gradient(135deg,${ORANGE}1a,${GREEN}1a)`, border: `1px solid ${ORANGE}33`, display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
          <Lock size={28} color={ORANGE} />
        </div>
        <h2 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: "1.45rem", margin: 0, textAlign: "center", letterSpacing: "-0.4px" }}>
          Verify it's you
        </h2>
        <p style={{ color: MUTE, fontSize: 14, lineHeight: 1.6, textAlign: "center", margin: "10px 0 22px" }}>
          Your mentorship dashboard is private. {step === "intro"
            ? <>We'll email a 6-digit code to <strong style={{ color: NAVY }}>{masked}</strong> — or just use your password.</>
            : step === "password"
              ? <>Enter the password you use to sign in to <strong style={{ color: NAVY }}>{masked}</strong>.</>
              : <>Enter the 6-digit code we sent to <strong style={{ color: NAVY }}>{masked}</strong>.</>}
        </p>

        {step === "intro" ? (
          <>
            <button onClick={send} disabled={busy}
              style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: busy ? `${ORANGE}99` : `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 15, cursor: busy ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: `0 12px 26px -10px ${ORANGE}` }}>
              {busy ? <><Loader2 size={18} style={{ animation: "spin .8s linear infinite" }} /> Sending code…</> : <><Mail size={18} /> Send code to my email</>}
            </button>

            {/* Waiting on an email every time is the slow path when you already
                know your password. Same proof, less friction. */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
              <span style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8" }}>OR</span>
              <span style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>
            <button onClick={() => { setStep("password"); setMsg({ type: "", text: "" }); }} disabled={busy}
              style={{ width: "100%", height: 48, borderRadius: 14, background: "transparent", border: `1.5px solid ${ORANGE}40`, color: ORANGE, fontFamily: "Sora", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Lock size={16} /> Use my password instead
            </button>
          </>
        ) : step === "password" ? (
          <>
            <input
              type="password" placeholder="Your account password" value={password} autoFocus
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
              style={{ width: "100%", fontSize: 15, color: "#1e293b", height: 54, padding: "0 16px", border: `2px solid ${password ? ORANGE : "#e2e8f0"}`, borderRadius: 14, background: password ? `${ORANGE}08` : "#f8fafc", outline: "none", boxSizing: "border-box", marginBottom: 14, fontFamily: "inherit" }}
            />
            <button onClick={verifyPassword} disabled={busy || !password}
              style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: busy || !password ? `${ORANGE}99` : `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 15, cursor: busy || !password ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: `0 12px 26px -10px ${ORANGE}` }}>
              {busy ? <><Loader2 size={18} style={{ animation: "spin .8s linear infinite" }} /> Checking…</> : <><ShieldCheck size={18} /> Verify &amp; open dashboard</>}
            </button>
            <button onClick={() => { setStep("intro"); setPassword(""); setMsg({ type: "", text: "" }); }} disabled={busy}
              style={{ width: "100%", height: 44, marginTop: 10, borderRadius: 12, background: "transparent", border: `1.5px solid ${ORANGE}30`, color: ORANGE, fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <Mail size={14} /> Email me a code instead
            </button>
          </>
        ) : (
          <>
            <input
              inputMode="numeric" maxLength={6} placeholder="——————" value={code} autoFocus
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              style={{ width: "100%", textAlign: "center", letterSpacing: "0.9em", fontSize: 32, fontWeight: 900, color: "#1e293b", height: 70, border: `2px solid ${code.length === 6 ? ORANGE : "#e2e8f0"}`, borderRadius: 16, background: code.length === 6 ? `${ORANGE}08` : "#f8fafc", outline: "none", fontFamily: "Sora, monospace", boxSizing: "border-box", marginBottom: 16 }}
            />
            <button onClick={verify} disabled={busy || code.length < 6}
              style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: busy || code.length < 6 ? `${ORANGE}99` : `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 15, cursor: busy || code.length < 6 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: `0 12px 26px -10px ${ORANGE}` }}>
              {busy ? <><Loader2 size={18} style={{ animation: "spin .8s linear infinite" }} /> Verifying…</> : <><ShieldCheck size={18} /> Verify & open dashboard</>}
            </button>
            <button onClick={send} disabled={busy}
              style={{ width: "100%", height: 44, marginTop: 10, borderRadius: 12, background: "transparent", border: `1.5px solid ${ORANGE}30`, color: ORANGE, fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <RotateCw size={14} /> Resend code
            </button>
          </>
        )}

        <AnimatePresence>
          {msg.text && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 14, borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 700, lineHeight: 1.5, background: msg.type === "ok" ? "#f0fdf4" : "#fff1f2", border: `1.5px solid ${msg.type === "ok" ? "#86efac" : "#fca5a5"}`, color: msg.type === "ok" ? "#166534" : "#991b1b" }}>
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#94a3b8" }}>
            <ShieldCheck size={13} color={GREEN} /> Extra security for your data
          </span>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 12.5, fontWeight: 600, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted" }}>
            Back to account
          </button>
        </div>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   DASHBOARD BODY
   ════════════════════════════════════════════════════════════════ */
function DashboardBody({ urlPlan = "" }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const emailKey = (user?.email || "guest").toLowerCase();
  // Per-batch namespace so a student in more than one plan keeps separate study
  // data, tests and backlog for each. Falls back to a shared "default" slot when
  // no plan is specified (e.g. the email-link entry point).
  const planNs = urlPlan || "default";
  const TRACK_KEY = `mdash:tracking:${emailKey}:${planNs}`;
  const TEST_KEY = `mdash:tests:${emailKey}:${planNs}`;
  const BACKLOG_KEY = `mdash:backlog:${emailKey}:${planNs}`;
  const FIX_KEY = `mdash:fixdone:${emailKey}:${planNs}`;
  const WTASK_KEY = `mdash:weeklytasks:${emailKey}:${planNs}`;
  const PREFS_KEY = `mdash:reportprefs:${emailKey}:${planNs}`;
  const AUTO_KEY = `mdash:autosent:${emailKey}:${planNs}`;
  const TREM_KEY = `mdash:testremind:${emailKey}:${planNs}`; // day the test nudge was dismissed
  const CHAP_KEY = `mdash:chapters:${emailKey}:${planNs}`; // mentor chapter-strength + weekly coverage

  // One-time migration: older single-plan students stored data without the batch
  // suffix. Inherit it into this batch's slot the first time it's opened so no
  // logged history is lost. `legacy` is the pre-multi-batch key.
  const loadScoped = (scopedKey, legacyKey, fallback) => {
    const scoped = load(scopedKey, null);
    if (scoped != null) return scoped;
    const legacy = load(legacyKey, null);
    if (legacy != null) { save(scopedKey, legacy); return legacy; }
    return fallback;
  };
  const L_TRACK = `mdash:tracking:${emailKey}`;
  const L_TEST = `mdash:tests:${emailKey}`;
  const L_BACKLOG = `mdash:backlog:${emailKey}`;
  const L_FIX = `mdash:fixdone:${emailKey}`;
  const L_WTASK = `mdash:weeklytasks:${emailKey}`;
  const L_PREFS = `mdash:reportprefs:${emailKey}`;
  const L_AUTO = `mdash:autosent:${emailKey}`;

  // The batch this dashboard is scoped to (resolved from the user's enrolments).
  const [selectedPlan, setSelectedPlan] = useState(urlPlan || "");
  const [myBatches, setMyBatches] = useState([]); // [{ plan, label }]

  const [planLabel, setPlanLabel] = useState("Mentorship Program");
  const [planExam, setPlanExam] = useState("JEE / NEET");
  // Identity shown in the left ID card (student ID, batch, validity window).
  const [identity, setIdentity] = useState({ studentId: "", batchLabel: "", enrolledOn: null, validUntil: null, status: "" });
  const subjects = useMemo(() => subjectsFor(planExam), [planExam]);
  const isFoundation = /foundation/i.test(planExam);
  const isNEET = /neet/i.test(planExam) && !/jee/i.test(planExam);
  const rankEnabled = /jee/i.test(planExam) && !isFoundation;

  const [entries, setEntries] = useState(() => loadScoped(TRACK_KEY, L_TRACK, []) || []);
  const [tests, setTests] = useState(() => loadScoped(TEST_KEY, L_TEST, []) || []);
  const [backlog, setBacklog] = useState(() => loadScoped(BACKLOG_KEY, L_BACKLOG, []) || []);
  const [fixDone, setFixDone] = useState(() => loadScoped(FIX_KEY, L_FIX, {}));
  const [weeklyTasks, setWeeklyTasks] = useState(() => loadScoped(WTASK_KEY, L_WTASK, []));
  // Chapter strength + this-week coverage — [{ id, subject, topic, strength, coverage }]
  const [chapterLog, setChapterLog] = useState(() => load(CHAP_KEY, []));
  const [chapForm, setChapForm] = useState({ subject: "", topic: "", strength: "weak", coverage: "" });

  const todayIso = isoDay(new Date());
  const todayEntry = entries.find((e) => e.date === todayIso);

  const [logForm, setLogForm] = useState({ subjects: {}, tasksTotal: "", routine: true });
  const [editingLog, setEditingLog] = useState(false); // re-open today's log to update it
  const [testForm, setTestForm] = useState({ name: "", type: "main", total: "300", scored: "", correct: "", wrong: "", skipped: "", silly: "", sillyTopic: "", overspent: "", weak: "", mp: "", mc: "", mm: "", mp2: "", mc2: "", mm2: "", advTotal: String(ADV_FULL_TOTAL), advQuestions: String(ADV_FULL_QUESTIONS), category: "General", times: {} });
  const [blForm, setBlForm] = useState({ subject: "", topic: "", strength: "weak", targetDate: "" });
  const [wtInput, setWtInput] = useState("");
  const [wtEdit, setWtEdit] = useState({ id: null, text: "" });
  const [parentEmail, setParentEmail] = useState("");
  const [weeklyState, setWeeklyState] = useState({ sending: false, msg: { type: "", text: "" } });
  const [dailyState, setDailyState] = useState({ sending: false, msg: { type: "", text: "" } });
  const [alertState, setAlertState] = useState({ sending: false, msg: { type: "", text: "" } });
  const [reportPrefs, setReportPrefs] = useState(() => loadScoped(PREFS_KEY, L_PREFS, { autoWeekly: true, autoDaily: true, autoBacklogAlert: true }));
  const [lastAuto, setLastAuto] = useState(() => loadScoped(AUTO_KEY, L_AUTO, { weekly: "", daily: "", backlog: "" }));
  // "Did you take a test?" nudge: which day it was snoozed, and the Yes/No stage.
  const [testRemindSnooze, setTestRemindSnooze] = useState(() => load(TREM_KEY, ""));
  const [testAskStage, setTestAskStage] = useState("ask"); // "ask" → "confirm"
  // Weekly tasks the mentor/admin assigned for this student (shown as suggested).
  const [mentorTasks, setMentorTasks] = useState([]);
  // The mentor assigned to this student ID — { name, college } — for the header.
  const [mentor, setMentor] = useState(null);
  // True once this batch's data has been pulled from the server, so the save
  // effect won't overwrite the server with local seed data before it loads.
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Resolve the real plan for THIS dashboard. A student can own several
  // mentorship batches — pick the one named in ?plan= (if they own it),
  // otherwise their most recent one. Also collect the full list for the switcher.
  useEffect(() => {
    if (!token) return;
    let alive = true;
    apiMyEnrollments(token)
      .then((d) => {
        if (!alive) return;
        const mentors = (d.enrollments || []).filter((e) => String(e.plan).startsWith("mentor-"));
        setMyBatches(mentors.map((e) => ({ plan: e.plan, label: e.batchLabel || e.planLabel || e.plan })));
        // Honour the requested batch only if the student actually owns it.
        const m = mentors.find((e) => e.plan === urlPlan) || mentors[0];
        if (m) {
          setSelectedPlan(m.plan);
          setPlanLabel(m.planLabel || m.plan);
          setPlanExam(m.targetExam || (String(m.plan).includes("neet") ? "NEET" : String(m.plan).includes("foundation") ? "Foundation" : "JEE"));
          setParentEmail(m.parentEmail || "");
          setIdentity({
            studentId: m.studentId || "",
            batchLabel: m.batchLabel || m.planLabel || m.plan,
            enrolledOn: m.createdAt || null,
            validUntil: m.validUntil || null,
            status: (m.validUntil && new Date(m.validUntil) < new Date()) ? "expired" : "active",
          });
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [token, urlPlan]);

  // Pull the mentor-assigned weekly tasks for this student ID (set by the mentor).
  useEffect(() => {
    if (!token || !identity.studentId) { setMentorTasks([]); return; }
    let alive = true;
    apiMyMentorTasks(token, identity.studentId)
      .then((d) => { if (alive) setMentorTasks(Array.isArray(d.tasks) ? d.tasks : []); })
      .catch(() => { if (alive) setMentorTasks([]); });
    return () => { alive = false; };
  }, [token, identity.studentId]);

  // Who's mentoring this student ID — name + college for the tracking header.
  useEffect(() => {
    if (!token || !identity.studentId) { setMentor(null); return; }
    let alive = true;
    apiMyMentor(token, identity.studentId)
      .then((d) => { if (alive) setMentor(d.mentor || null); })
      .catch(() => { if (alive) setMentor(null); });
    return () => { alive = false; };
  }, [token, identity.studentId]);

  // Cross-device sync — LOAD this batch's saved study data from the server so
  // every device shows the same logs/tests/backlog/tasks. The server copy wins
  // over local when present; if the server has none yet, the save effect below
  // seeds it from this device.
  useEffect(() => {
    if (!token || !selectedPlan) return;
    let alive = true;
    setProgressLoaded(false);
    apiGetProgress(token, selectedPlan)
      .then((r) => {
        if (!alive) return;
        const d = r?.data;
        if (d && typeof d === "object") {
          if (Array.isArray(d.entries)) setEntries(d.entries);
          if (Array.isArray(d.tests)) setTests(d.tests);
          if (Array.isArray(d.backlog)) setBacklog(d.backlog);
          if (Array.isArray(d.weeklyTasks)) setWeeklyTasks(d.weeklyTasks);
          if (Array.isArray(d.chapterLog)) setChapterLog(d.chapterLog);
          if (d.fixDone && typeof d.fixDone === "object") setFixDone(d.fixDone);
          if (d.reportPrefs && typeof d.reportPrefs === "object") setReportPrefs(d.reportPrefs);
          if (d.lastAuto && typeof d.lastAuto === "object") setLastAuto(d.lastAuto);
        }
        setProgressLoaded(true);
      })
      .catch(() => { if (alive) setProgressLoaded(true); });
    return () => { alive = false; };
  }, [token, selectedPlan]);

  // Cross-device sync — SAVE the study data back to the server (debounced) on
  // any change, but only after the initial load so we never clobber the server
  // copy with seed data. localStorage still acts as an offline cache.
  useEffect(() => {
    if (!token || !selectedPlan || !progressLoaded) return;
    const data = { entries, tests, backlog, weeklyTasks, chapterLog, fixDone, reportPrefs, lastAuto };
    const t = setTimeout(() => { apiSaveProgress(token, selectedPlan, data).catch(() => {}); }, 900);
    return () => clearTimeout(t);
  }, [token, selectedPlan, progressLoaded, entries, tests, backlog, weeklyTasks, chapterLog, fixDone, reportPrefs, lastAuto]);

  // Purge any pre-enrolment demo residue. Earlier builds seeded the last 7 days
  // and persisted it, so a student who joined on (say) Thursday could show fake
  // Mon–Wed hours and old mock tests. You can't have logged study for a batch
  // before you enrolled in it, so anything dated before the enrolment day is not
  // real — drop it. The debounced save above then writes the cleaned copy back.
  useEffect(() => {
    if (!progressLoaded || !identity.enrolledOn) return;
    const enrollDay = isoDay(identity.enrolledOn);
    setEntries((prev) => {
      const clean = prev.filter((e) => e.date && e.date >= enrollDay);
      return clean.length === prev.length ? prev : clean;
    });
    setTests((prev) => {
      const clean = prev.filter((t) => !t.date || t.date >= enrollDay);
      return clean.length === prev.length ? prev : clean;
    });
  }, [progressLoaded, identity.enrolledOn]);

  // Switch to another of the student's batches — re-points the URL, which
  // remounts the body against that batch's data + community.
  const switchBatch = (plan) => {
    if (!plan || plan === selectedPlan) return;
    navigate(`/mentorship-dashboard?plan=${encodeURIComponent(plan)}`);
  };

  useEffect(() => { save(TRACK_KEY, entries); }, [TRACK_KEY, entries]);
  useEffect(() => { save(TEST_KEY, tests); }, [TEST_KEY, tests]);
  useEffect(() => { save(BACKLOG_KEY, backlog); }, [BACKLOG_KEY, backlog]);
  useEffect(() => { save(FIX_KEY, fixDone); }, [FIX_KEY, fixDone]);
  useEffect(() => { save(WTASK_KEY, weeklyTasks); }, [WTASK_KEY, weeklyTasks]);
  useEffect(() => { save(PREFS_KEY, reportPrefs); }, [PREFS_KEY, reportPrefs]);
  useEffect(() => { save(AUTO_KEY, lastAuto); }, [AUTO_KEY, lastAuto]);
  useEffect(() => { save(TREM_KEY, testRemindSnooze); }, [TREM_KEY, testRemindSnooze]);
  useEffect(() => { save(CHAP_KEY, chapterLog); }, [CHAP_KEY, chapterLog]);

  /* ── derived tracking metrics ── */
  const sorted = useMemo(() => [...entries].sort((a, b) => a.date.localeCompare(b.date)), [entries]);

  // Build a CONTINUOUS run of the last N calendar days rather than the last N
  // *records*. If a day was never logged (student missed an update), it surfaces
  // as a real 0-hour slot instead of being skipped — so the graph never drops a
  // day, and week totals count the miss as 0h (not "6 days only"). These
  // placeholders are display-only; we never write them back to `entries`, so a
  // missed day still correctly breaks the streak in streakOf().
  const zeroDay = (iso) => ({ date: iso, hours: 0, subjects: {}, tasksDone: 0, tasksTotal: 0, routine: false, missed: true });
  const lastNDays = (n, offsetDays = 0) => {
    const byDate = new Map(entries.map((e) => [e.date, e]));
    const base = new Date();
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i - offsetDays);
      const iso = isoDay(d);
      out.push(byDate.get(iso) || zeroDay(iso));
    }
    return out;
  };
  const last7 = useMemo(() => lastNDays(7), [entries]);        // today-6 … today
  const prevWeek = useMemo(() => lastNDays(7, 7), [entries]);  // today-13 … today-7
  const weekHours = last7.reduce((s, e) => s + Number(e.hours || 0), 0);
  const prevWeekHours = prevWeek.reduce((s, e) => s + Number(e.hours || 0), 0);
  const latestTrack = sorted[sorted.length - 1];
  const tasksLabel = latestTrack ? `${latestTrack.tasksDone} / ${latestTrack.tasksTotal}` : "—";
  const streak = streakOf(sorted);
  const goalPct = Math.min(100, Math.round((weekHours / WEEK_TARGET_HRS) * 100));
  const maxH = Math.max(1, ...last7.map((e) => Number(e.hours || 0)));
  const routineDays = last7.filter((e) => e.routine).length;
  const routinePct = last7.length ? Math.round((routineDays / last7.length) * 100) : 0;

  const subjAgg = (es, key) => {
    const m = Object.fromEntries(subjects.map((s) => [s, 0]));
    es.forEach((e) => subjects.forEach((s) => { m[s] += subVal(e, s)[key]; }));
    return m;
  };
  const thisWkH = useMemo(() => subjAgg(last7, "h"), [last7, subjects]);
  const lastWkH = useMemo(() => subjAgg(prevWeek, "h"), [prevWeek, subjects]);
  const thisWkT = useMemo(() => subjAgg(last7, "t"), [last7, subjects]);
  const subjectPie = subjects.map((s) => ({ name: shortName(s), value: round1(thisWkH[s]) })).filter((x) => x.value > 0);
  // Colours must follow the SAME filter as subjectPie (skip 0-hour subjects) so
  // each donut slice / legend row keeps its subject colour once early-week
  // subjects drop out.
  const subjectPieColors = subjects.filter((s) => round1(thisWkH[s]) > 0).map(subColor);
  const subjectPieTotal = subjectPie.reduce((sum, x) => sum + x.value, 0);
  const subjectLines = subjects.map((s) => ({ key: keyOf(s), label: shortName(s), color: subColor(s) }));
  const subjectHourTrend = last7.map((e) => {
    const row = { year: DOW[new Date(e.date).getDay()] };
    subjects.forEach((s) => { row[keyOf(s)] = subVal(e, s).h; });
    return row;
  });
  const subjectTaskTrend = last7.map((e) => {
    const row = { year: DOW[new Date(e.date).getDay()] };
    subjects.forEach((s) => { row[keyOf(s)] = subVal(e, s).t; });
    return row;
  });
  const lowestSubject = subjects.length ? subjects.reduce((lo, s) => (thisWkH[s] < thisWkH[lo] ? s : lo), subjects[0]) : null;

  /* ── derived test metrics ── */
  const testsSorted = useMemo(() => [...tests].sort((a, b) => a.date.localeCompare(b.date)), [tests]);
  const latest = testsSorted[testsSorted.length - 1];
  const prev = testsSorted[testsSorted.length - 2];

  // "Have you taken a test lately?" nudge — shows when no test has been logged
  // in a week (or ever), unless it was already dismissed today.
  const daysSinceLastTest = latest ? Math.round((new Date(todayIso) - new Date(latest.date)) / 86400000) : Infinity;
  const showTestReminder = daysSinceLastTest >= 7 && testRemindSnooze !== todayIso;
  // Reset the Yes/No stage once the nudge is gone (e.g. a test was logged) so a
  // future reminder always starts from the question, not the follow-up.
  useEffect(() => { if (!showTestReminder) setTestAskStage("ask"); }, [showTestReminder]);
  const acc = (t) => {
    const att = Number(t.correct) + Number(t.wrong);
    return att ? Math.round((Number(t.correct) / att) * 100) : 0;
  };
  const pct = (t) => Math.round((Number(t.scored) / Math.max(1, Number(t.total))) * 100);
  const improvement = latest && prev && Number(prev.scored) > 0
    ? Math.round(((Number(latest.scored) - Number(prev.scored)) / Number(prev.scored)) * 100)
    : null;
  const scoreTrend = testsSorted.map((t, i) => ({ year: t.name || `T${i + 1}`, you: Number(t.scored), target: Math.round(Number(t.total) * 0.75) }));
  const accTrend = testsSorted.map((t, i) => ({ year: t.name || `T${i + 1}`, accuracy: acc(t) }));
  // Keep x-labels short so the silly-mistake bars don't collide (long test
  // names like "JEE Advanced Paper (P1+P2)" are truncated; angled on render).
  const sillyTrend = testsSorted.map((t, i) => {
    const nm = t.name || `T${i + 1}`;
    return { name: nm.length > 9 ? `${nm.slice(0, 8)}…` : nm, silly: Number(t.silly || 0) };
  });
  const avgSkipped = testsSorted.length ? Math.round(testsSorted.reduce((s, t) => s + Number(t.skipped || 0), 0) / testsSorted.length) : 0;
  const latestRankTest = [...testsSorted].reverse().find((t) => t.rank);

  /* ── weak-chapter heatmap (tests + open backlog + silly topics) ── */
  const weakRanked = useMemo(() => {
    const freq = {};
    testsSorted.forEach((t) => {
      (t.weak || []).forEach((c) => { freq[c] = (freq[c] || 0) + 1; });
      if (t.sillyTopic) freq[t.sillyTopic] = (freq[t.sillyTopic] || 0) + 1;
    });
    backlog.filter((b) => !b.done && b.strength !== "strong").forEach((b) => {
      if (!b.topic) return;
      freq[b.topic] = (freq[b.topic] || 0) + (b.strength === "weak" ? 2 : 1);
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  }, [testsSorted, backlog]);
  const maxWeak = Math.max(1, ...weakRanked.map(([, n]) => n));

  /* ── silly-mistake topics ── */
  const sillyTopics = useMemo(() => {
    const freq = {};
    testsSorted.forEach((t) => { if (t.sillyTopic) freq[t.sillyTopic] = (freq[t.sillyTopic] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  }, [testsSorted]);

  /* ── time-management review ── */
  // The paper's sections + the ideal minutes for each (all add up to a 180-min paper).
  const examSections = useMemo(() =>
    isFoundation ? ["Maths", "Science"]
    : isNEET ? ["Physics", "Chemistry", "Biology"]
    : ["Physics", "Chemistry", "Maths"], [isFoundation, isNEET]);
  const idealPace = useMemo(() =>
    isFoundation ? { Maths: 90, Science: 90 }
    : isNEET ? { Physics: 45, Chemistry: 45, Biology: 90 }
    : { Physics: 60, Chemistry: 60, Maths: 60 }, [isFoundation, isNEET]);
  const examTotalMin = useMemo(() => examSections.reduce((s, k) => s + (idealPace[k] || 0), 0), [examSections, idealPace]);

  const timeRanked = useMemo(() => {
    const freq = {};
    testsSorted.forEach((t) => { if (t.overspent) freq[t.overspent] = (freq[t.overspent] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  }, [testsSorted]);

  // Average minutes ACTUALLY spent per section, from tests where the student
  // logged their per-section time. null ⇒ no timed tests yet.
  const timedTests = useMemo(
    () => testsSorted.filter((t) => t.times && examSections.some((sec) => Number(t.times[sec]) > 0)),
    [testsSorted, examSections]);
  const avgTimePer = useMemo(() => {
    if (!timedTests.length) return null;
    const m = Object.fromEntries(examSections.map((sec) => [sec, 0]));
    timedTests.forEach((t) => examSections.forEach((sec) => { m[sec] += Number(t.times?.[sec]) || 0; }));
    examSections.forEach((sec) => { m[sec] = Math.round(m[sec] / timedTests.length); });
    return m;
  }, [timedTests, examSections]);

  // Bars: real "you vs target" minutes when we have timed tests; else the old
  // over-spend frequency so the card is never empty.
  const timeBars = useMemo(() =>
    avgTimePer
      ? examSections.map((sec) => ({ name: shortName(sec), you: avgTimePer[sec], target: idealPace[sec] }))
      : timeRanked.map(([s, n]) => ({ name: shortName(s), over: n })),
    [avgTimePer, examSections, idealPace, timeRanked]);
  const timeBarSeries = avgTimePer
    ? [{ key: "you", label: "You (avg)", color: "#06b6d4" }, { key: "target", label: "Target", color: "#22c55e" }]
    : [{ key: "over", label: "Over-spent (tests)", color: "#06b6d4" }];

  /* suggested pacing for the next paper — REAL data: target each section to its
     ideal time; flag (CAP) the ones where the student's logged average over-runs. */
  const pacing = useMemo(() => examSections.map((sec) => {
    const ideal = idealPace[sec];
    const spent = avgTimePer ? avgTimePer[sec] : null;
    const over = spent != null ? Math.max(0, spent - ideal) : 0;
    return { s: sec, min: ideal, base: ideal, spent, over, cap: over > 0 };
  }), [examSections, idealPace, avgTimePer]);

  // "Better timings → better paper" — what reclaiming the over-run time buys you.
  const timeInsight = useMemo(() => {
    if (!avgTimePer) return null;
    const overrun = examSections.reduce((s, sec) => s + Math.max(0, avgTimePer[sec] - idealPace[sec]), 0);
    const worst = examSections
      .map((sec) => [sec, avgTimePer[sec] - idealPace[sec]])
      .sort((a, b) => b[1] - a[1])[0];
    const minPerQ = isNEET ? 1 : 2; // ~2 min/q (JEE), ~1 min/q (NEET)
    const extraQ = Math.round(overrun / minPerQ);
    const sillyAvg = testsSorted.length
      ? Math.round(testsSorted.reduce((s, t) => s + Number(t.silly || 0), 0) / testsSorted.length) : 0;
    const totalSpent = examSections.reduce((s, sec) => s + avgTimePer[sec], 0);
    return { overrun, worst: worst && worst[1] > 0 ? worst[0] : null, extraQ, sillyAvg, totalSpent };
  }, [avgTimePer, examSections, idealPace, isNEET, testsSorted]);

  /* ── weekly fix-list completion (mentor-assigned tasks only) ── */
  const wk = weekKey();
  const fixDoneSet = fixDone[wk] || [];
  const toggleFix = (label) => setFixDone((prev) => {
    const cur = new Set(prev[wk] || []);
    cur.has(label) ? cur.delete(label) : cur.add(label);
    return { ...prev, [wk]: [...cur] };
  });

  /* ── chapters by strength + weekly coverage (for the parent report) ── */
  const chaptersByStrength = useMemo(() => {
    const fmt = (c) => `${c.topic} (${shortName(c.subject)})${c.coverage ? ` · ${c.coverage}% covered` : ""}`;
    return {
      weak: chapterLog.filter((c) => c.strength === "weak").map(fmt),
      medium: chapterLog.filter((c) => c.strength === "medium").map(fmt),
      strong: chapterLog.filter((c) => c.strength === "strong").map(fmt),
    };
  }, [chapterLog]);

  /* ── AI insights (rule-based) ── */
  const insights = useMemo(() => {
    const out = [];
    if (latest && prev) {
      const dS = Number(latest.scored) - Number(prev.scored);
      const pctTxt = improvement == null ? "" : ` (${improvement >= 0 ? "+" : ""}${improvement}%)`;
      out.push({ tone: dS >= 0 ? "up" : "down", text: dS >= 0
        ? `Score up ${dS} marks${pctTxt} — ${latest.name} beat ${prev.name}. Momentum is building.`
        : `Score dropped ${Math.abs(dS)} marks${pctTxt} vs ${prev.name}. Flag the weak chapters below with your mentor this week.` });
      const dA = acc(latest) - acc(prev);
      if (dA !== 0) out.push({ tone: dA > 0 ? "up" : "down", text: `${dA > 0 ? "Accuracy improved" : "Accuracy slipped"} ${Math.abs(dA)}% (${acc(prev)}% → ${acc(latest)}%).` });
      const dM = Number(prev.silly) - Number(latest.silly);
      if (Number(prev.silly) || Number(latest.silly)) out.push({ tone: dM >= 0 ? "up" : "down", text: dM >= 0
        ? `Silly mistakes down from ${prev.silly} to ${latest.silly} — careful checking is paying off.`
        : `Silly mistakes rose from ${prev.silly} to ${latest.silly}. Slow down on the last 10 minutes of every paper.` });
    }
    if (weekHours && prevWeekHours) {
      const d = round1(weekHours - prevWeekHours);
      out.push({ tone: d >= 0 ? "up" : "down", text: `${d >= 0 ? "Study time up" : "Study time down"} ${Math.abs(d)}h vs last week (${round1(prevWeekHours)}h → ${round1(weekHours)}h).` });
    }
    if (weakRanked[0]) out.push({ tone: "down", text: `${weakRanked[0][0]} is your #1 recurring weak area (${weakRanked[0][1]}× flagged). Prioritise it this week.` });
    if (lowestSubject) out.push({ tone: "flat", text: `${shortName(lowestSubject)} got the least time this week (${round1(thisWkH[lowestSubject])}h). Balance it before the next test.` });
    return out;
  }, [latest, prev, improvement, weekHours, prevWeekHours, weakRanked, lowestSubject, thisWkH]);

  /* ── strategies (fills the white space under the test form) ── */
  const strategies = useMemo(() => {
    const out = [];
    if (lowestSubject) out.push({ icon: Target, color: subColor(lowestSubject), text: `Balance your effort: add ~1 hr/day to ${shortName(lowestSubject)} — it's your least-studied subject this week.` });
    if (weakRanked[0]) out.push({ icon: Zap, color: "#FF693D", text: `Attack ${weakRanked[0][0]} first — your most recurring weak chapter. Aim for 30 PYQs this week.` });
    if (latest && Number(latest.silly) >= 3) out.push({ icon: Crosshair, color: "#ef4444", text: `Reserve the last 10 min of every paper to recheck — you lost ~${latest.silly} marks to silly errors.` });
    if (latest && acc(latest) < 80) out.push({ icon: ShieldCheck, color: "#0891b2", text: `Accuracy is ${acc(latest)}% — skip low-confidence questions to dodge negative marking.` });
    out.push({ icon: RotateCw, color: GREEN, text: "Revise within 24 hrs, then again at 7 days — spaced revision beats re-reading." });
    out.push({ icon: Hourglass, color: ORANGE, text: "Sit one full-length timed paper every week to build exam-day stamina & pacing." });
    return out.slice(0, 5);
  }, [lowestSubject, weakRanked, latest, thisWkH]);

  /* ── daily-log edit budget (up to 3 saves a day) ── */
  // A legacy entry saved before this feature has no `edits` field → counts as 1.
  const editsUsed = todayEntry ? (todayEntry.edits ?? 1) : 0;
  const editsLeft = Math.max(0, MAX_LOGS_PER_DAY - editsUsed);
  const canLogMore = editsLeft > 0;

  /* ── actions ── */
  function addLog(e) {
    e.preventDefault();
    if (todayEntry && !canLogMore) return; // budget exhausted for today
    const subj = {};
    let totalH = 0, totalT = 0;
    subjects.forEach((s) => {
      const h = Number(logForm.subjects?.[s]?.h) || 0;
      const t = Number(logForm.subjects?.[s]?.t) || 0;
      subj[s] = { h, t }; totalH += h; totalT += t;
    });
    if (totalH <= 0) return;
    const entry = {
      date: todayIso, hours: round1(totalH), subjects: subj,
      tasksDone: totalT,
      tasksTotal: Number(logForm.tasksTotal) || totalT,
      routine: !!logForm.routine,
      edits: editsUsed + 1, // 1 on first save, up to MAX_LOGS_PER_DAY
    };
    setEntries((prevE) => [...prevE.filter((x) => x.date !== todayIso), entry]);
    setLogForm({ subjects: {}, tasksTotal: "", routine: true });
    setEditingLog(false);
  }

  // Re-open today's log pre-filled so the student can update it.
  function startEditLog() {
    if (!todayEntry || !canLogMore) return;
    const subs = {};
    subjects.forEach((s) => { const v = subVal(todayEntry, s); subs[s] = { h: v.h || "", t: v.t || "" }; });
    setLogForm({ subjects: subs, tasksTotal: todayEntry.tasksTotal ?? "", routine: !!todayEntry.routine });
    setEditingLog(true);
  }

  // Every field is required — a test is only analysed once all details are in.
  const testFormComplete = () => {
    const has = (v) => String(v ?? "").trim() !== "";
    if (!has(testForm.name)) return false;
    if (!has(testForm.correct) || !has(testForm.wrong) || !has(testForm.skipped)) return false;
    if (!has(testForm.silly) || !has(testForm.sillyTopic) || !has(testForm.overspent)) return false;
    if (rankEnabled && isAdv(testForm.type)) return ["mp", "mc", "mm", "mp2", "mc2", "mm2", "advTotal", "advQuestions"].every((k) => has(testForm[k]));
    if (rankEnabled && testForm.type === "main") return ["mp", "mc", "mm"].every((k) => has(testForm[k]));
    return has(testForm.total) && has(testForm.scored);
  };

  const getLiveRank = () => {
    if (!rankEnabled) return null;
    const has = (v) => String(v ?? "").trim() !== "";
    
    if (testForm.type === "main" && (has(testForm.mp) || has(testForm.mc) || has(testForm.mm))) {
      const p = Number(testForm.mp) || 0, c = Number(testForm.mc) || 0, m = Number(testForm.mm) || 0;
      const r = predictRank({ physics: p, chemistry: c, maths: m, category: testForm.category || "General", advanced: false });
      return { name: testForm.name || "Live preview", rank: { ...r, type: "main", total: p + c + m } };
    }
    if (isAdv(testForm.type) && (has(testForm.mp) || has(testForm.mp2))) {
      const p = Number(testForm.mp) || 0, c = Number(testForm.mc) || 0, m = Number(testForm.mm) || 0;
      const p2 = Number(testForm.mp2) || 0, c2 = Number(testForm.mc2) || 0, m2 = Number(testForm.mm2) || 0;
      const total = p + p2 + c + c2 + m + m2;
      const r = predictRank({ physics: p + p2, chemistry: c + c2, maths: m + m2, category: testForm.category || "General", advanced: true });
      return { name: testForm.name || "Live preview", rank: { ...r, type: testForm.type, total, examMax: Number(testForm.advTotal) || ADV_FULL_TOTAL, paper1: p+c+m, paper2: p2+c2+m2 } };
    }
    return null;
  };

  function addTest(e) {
    e.preventDefault();
    if (!testFormComplete()) return; // block until every field is filled
    const advPaper = isAdv(testForm.type);
    let total, scored, rank = null;

    if (rankEnabled && (testForm.type === "main" || advPaper)) {
      const p = Number(testForm.mp) || 0, c = Number(testForm.mc) || 0, m = Number(testForm.mm) || 0;
      const aggregate = p + c + m;
      if (advPaper) {
        const p2 = Number(testForm.mp2) || 0, c2 = Number(testForm.mc2) || 0, m2 = Number(testForm.mm2) || 0;
        const combPhy = p + p2, combChem = c + c2, combMath = m + m2;
        const combTotal = combPhy + combChem + combMath;
        total = Number(testForm.advTotal) || ADV_FULL_TOTAL;
        scored = combTotal;
        const r = predictRank({ physics: combPhy, chemistry: combChem, maths: combMath, category: testForm.category || "General", advanced: true });
        rank = {
          type: testForm.type, advanced: true,
          questions: Number(testForm.advQuestions) || null, examMax: total,
          paper1: aggregate, paper2: p2 + c2 + m2,
          category: testForm.category || "General", total: combTotal,
          ranked: r.ranked, crl: r.crl, crlLo: r.crlLo ?? null, crlHi: r.crlHi ?? null,
          rank: r.rank, low: r.low, high: r.high,
          percentile: r.percentile, categoryRank: r.categoryRank, isGeneral: r.isGeneral,
          branches: (r.branches || []).slice(0, 3), advice: r.advice || "",
          cutoffNeeded: r.cutoffNeeded != null ? r.cutoffNeeded : null,
        };
      } else {
        total = maxTotal(false); // 300 — JEE Main
        scored = aggregate;
        const r = predictRank({ physics: p, chemistry: c, maths: m, category: testForm.category || "General", advanced: false });
        rank = {
          type: testForm.type, advanced: false, category: testForm.category || "General", total: aggregate,
          ranked: r.ranked, crl: r.crl, crlLo: r.crlLo ?? null, crlHi: r.crlHi ?? null,
          rank: r.rank, low: r.low, high: r.high,
          percentile: r.percentile, categoryRank: r.categoryRank, isGeneral: r.isGeneral,
          branches: (r.branches || []).slice(0, 3), advice: r.advice || "",
          cutoffNeeded: r.cutoffNeeded ?? null,
        };
      }
    } else {
      total = Number(testForm.total) || 0;
      scored = Number(testForm.scored);
      if (!Number.isFinite(scored)) return;
    }
    if (!testForm.name.trim()) return;
    // per-section minutes spent (0 when the student didn't log it)
    const times = Object.fromEntries(examSections.map((sec) => [sec, Number(testForm.times?.[sec]) || 0]));
    const timeTotal = Object.values(times).reduce((s, v) => s + v, 0);
    const t = {
      id: `${Date.now()}`, name: testForm.name.trim(), type: testForm.type, date: todayIso, total, scored,
      correct: Number(testForm.correct) || 0,
      wrong: Number(testForm.wrong) || 0,
      skipped: Number(testForm.skipped) || 0,
      silly: Number(testForm.silly) || 0,
      sillyTopic: testForm.sillyTopic.trim(),
      overspent: testForm.overspent.trim(),
      weak: testForm.weak.split(",").map((x) => x.trim()).filter(Boolean),
      times, timeTotal,
      rank,
    };
    setTests((prevT) => [...prevT, t]);
    setTestForm({ name: "", type: "main", total: "300", scored: "", correct: "", wrong: "", skipped: "", silly: "", sillyTopic: "", overspent: "", weak: "", mp: "", mc: "", mm: "", mp2: "", mc2: "", mm2: "", advTotal: String(ADV_FULL_TOTAL), advQuestions: String(ADV_FULL_QUESTIONS), category: "General", times: {} });
  }
  function setTestType(type) {
    const autoName = { main: "JEE Mains", adv: "JEE Advanced (Paper 1 + 2)" };
    const wasAuto = (s) => s.name === "JEE Mains" || /^JEE Advanced/.test(s.name);
    setTestForm((s) => ({
      ...s, type,
      name: autoName[type] ? autoName[type] : wasAuto(s) ? "" : s.name,
      total: isAdv(type) ? String(ADV_FULL_TOTAL) : "300",
    }));
  }

  function addBacklog(e) {
    e.preventDefault();
    if (!blForm.topic.trim()) return;
    const item = {
      id: `${Date.now()}`,
      subject: blForm.subject || subjects[0] || "General",
      topic: blForm.topic.trim(),
      strength: blForm.strength,
      targetDate: blForm.targetDate || "",
      done: false,
    };
    setBacklog((prev) => [item, ...prev]);
    setBlForm({ subject: "", topic: "", strength: "weak", targetDate: "" });
  }
  const toggleBacklog = (id) => setBacklog((prev) => prev.map((b) => (b.id === id ? { ...b, done: !b.done } : b)));
  const removeBacklog = (id) => setBacklog((prev) => prev.filter((b) => b.id !== id));
  const backlogDone = backlog.filter((b) => b.done).length;
  const backlogPct = backlog.length ? Math.round((backlogDone / backlog.length) * 100) : 0;
  // target date (back-compat with older items that used planDate) + overdue detection
  const blDate = (b) => b.targetDate || b.planDate || "";
  const overdueBacklog = backlog.filter((b) => !b.done && blDate(b) && blDate(b) < todayIso);
  const studyIrregular = streak < 2 || routinePct < 50;

  /* ── weekly tasks (add + complete only · no delete) ── */
  function addWeeklyTask(e) {
    e.preventDefault();
    const text = wtInput.trim();
    if (!text) return;
    setWeeklyTasks((prev) => [...prev, { id: `${Date.now()}`, text, done: false, week: wk, createdAt: todayIso }]);
    setWtInput("");
  }
  const toggleWeeklyTask = (id) => setWeeklyTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  /* ── chapter strength + weekly coverage (feeds the parent chapter report) ── */
  function addChapter(e) {
    e?.preventDefault();
    const subject = chapForm.subject || subjects[0];
    const topic = chapForm.topic.trim();
    if (!subject || !topic) return;
    const coverage = Math.max(0, Math.min(100, Number(chapForm.coverage) || 0));
    setChapterLog((prev) => [
      // replace an existing entry for the same subject+topic, else add
      ...prev.filter((c) => !(c.subject === subject && c.topic.toLowerCase() === topic.toLowerCase())),
      { id: `${Date.now()}`, subject, topic, strength: chapForm.strength, coverage },
    ]);
    setChapForm({ subject: "", topic: "", strength: "weak", coverage: "" });
  }
  const removeChapter = (id) => setChapterLog((prev) => prev.filter((c) => c.id !== id));
  const saveWeeklyEdit = () => {
    const text = wtEdit.text.trim();
    if (text) setWeeklyTasks((prev) => prev.map((t) => (t.id === wtEdit.id ? { ...t, text } : t)));
    setWtEdit({ id: null, text: "" });
  };
  const weeklyDone = weeklyTasks.filter((t) => t.done).length;

  /* ── parent report builders + send (daily & weekly) ── */
  const todayTest = tests.find((t) => t.date === todayIso);
  // Predicted JEE rank (latest Main/Advanced test) — shared by both reports so
  // parents always see where their child currently stands.
  function buildRankSummary() {
    const r = latestRankTest?.rank;
    if (!rankEnabled || !r || !r.ranked) return null;
    return {
      exam: r.advanced ? "JEE Advanced" : "JEE Main",
      testName: latestRankTest.name || null,
      marks: r.total,
      crl: r.advanced ? `${inr(r.crlLo ?? r.low)} – ${inr(r.crlHi ?? r.high)}` : inr(r.crl),
      band: r.advanced ? null : `${inr(r.low)} – ${inr(r.high)}`,
      percentile: !r.advanced && r.percentile != null ? r.percentile : null,
      categoryRank: !r.isGeneral && r.categoryRank ? `${r.category}: ${inr(r.categoryRank)}` : null,
    };
  }
  function buildWeeklyReport() {
    return {
      week: wk,
      stats: {
        hours: round1(weekHours), streak, routinePct, tasks: tasksLabel,
        weeklyTasksDone: `${weeklyDone}/${weeklyTasks.length}`,
        latestTest: latest ? `${latest.name}: ${latest.scored}/${latest.total} (${pct(latest)}%)` : "—",
        improvement: improvement == null ? "—" : `${improvement >= 0 ? "+" : ""}${improvement}%`,
        backlog: `${backlogDone}/${backlog.length}`,
      },
      chapters: chaptersByStrength,
      weeklyTasks: weeklyTasks.map((t) => ({ text: t.text, done: t.done })),
      rank: buildRankSummary(),
    };
  }
  function buildDailyReport() {
    const latestTestData = latest ? {
      name: latest.name || "Test", scored: Number(latest.scored) || 0, total: Number(latest.total) || 0,
      pct: pct(latest), accuracy: acc(latest), date: fmtDay(latest.date),
      correct: Number(latest.correct || 0), wrong: Number(latest.wrong || 0), skipped: Number(latest.skipped || 0),
    } : null;
    const prevTestData = prev ? {
      name: prev.name || "Test", scored: Number(prev.scored) || 0, total: Number(prev.total) || 0,
      pct: pct(prev), accuracy: acc(prev),
    } : null;
    return {
      date: fmtDay(todayIso),
      daily: {
        hours: todayEntry?.hours ?? 0,
        subjects: subjects.map((s) => ({ name: shortName(s), h: subVal(todayEntry, s).h, t: subVal(todayEntry, s).t })),
        tasksDone: todayEntry?.tasksDone ?? 0,
        tasksTotal: todayEntry?.tasksTotal ?? 0,
        routine: !!todayEntry?.routine,
        todayTest: todayTest ? `${todayTest.name}: ${todayTest.scored}/${todayTest.total}` : null,
      },
      latestTest: latestTestData,
      prevTest: prevTestData,
      improvement,
      rank: buildRankSummary(),
    };
  }
  // Alert report — sent to the parent when backlog is falling behind / study is irregular.
  function buildBacklogReport() {
    return {
      backlog: {
        cleared: backlogDone, total: backlog.length, pct: backlogPct,
        overdue: overdueBacklog.map((b) => ({ topic: b.topic, subject: shortName(b.subject), date: fmtDay(blDate(b)) })),
        pending: backlog.filter((b) => !b.done).map((b) => `${b.topic} (${shortName(b.subject)})`),
        streak, routinePct, irregular: studyIrregular,
        hoursThisWeek: round1(weekHours),
      },
    };
  }

  async function sendReport(kind, isAuto = false) {
    if (!token) return;
    const setState = kind === "daily" ? setDailyState : kind === "backlog" ? setAlertState : setWeeklyState;
    if (isAuto) setLastAuto((p) => ({ ...p, [kind]: kind === "daily" ? todayIso : wk }));
    if (!isAuto) setState({ sending: true, msg: { type: "", text: "" } });
    const report = kind === "daily" ? buildDailyReport() : kind === "backlog" ? buildBacklogReport() : buildWeeklyReport();
    try {
      const r = await apiSendParentReport(token, { kind, report, plan: selectedPlan || undefined });
      const label = kind === "daily" ? "Daily report" : kind === "backlog" ? "Backlog alert" : "Weekly report";
      const text = r.dev
        ? `${label} queued (dev mode — logged on the server).`
        : `${label} ${isAuto ? "auto-sent" : "on its way"} to your parent (${r.to}) — arrives in a few seconds.`;
      setState({ sending: false, msg: { type: "ok", text } });
    } catch (e) {
      if (!isAuto) setState({ sending: false, msg: { type: "err", text: e.message || "Couldn't send the report. Try again." } });
    }
  }

  // Auto-send: weekly every Sunday. Plus a backlog alert (≤ once/week) when chapters are overdue
  // or study is irregular. Each fires once per period, when the dashboard opens.
  // Daily auto-send is handled entirely by the server cron job at 11 PM.
  useEffect(() => {
    if (!token) return;
    const isSunday = new Date().getDay() === 0;
    if (isSunday && lastAuto.weekly !== wk) sendReport("weekly", true);
    if (reportPrefs.autoBacklogAlert && lastAuto.backlog !== wk && (overdueBacklog.length > 0 || (backlogPct < 100 && studyIrregular))) sendReport("backlog", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reportPrefs.autoBacklogAlert, lastAuto.weekly, lastAuto.backlog, overdueBacklog.length, backlogPct, studyIrregular]);

  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  const FEATURES = [
    { id: "live-tracking",    label: "Live student tracking",       desc: "Subject-wise daily log and streak, updated as you study.", icon: Activity },
    { id: "subject-analysis", label: "Subject-wise analysis",       desc: "Hours, tasks and day-by-day comparison across subjects.", icon: BarChart3 },
    { id: "test-analysis",    label: "Test analysis",               desc: rankEnabled ? "Marks turned into charts, trends and rank prediction." : "Marks turned into charts and trend analysis.", icon: LineIcon },
    { id: "mentor-tools",     label: "What your mentor breaks down", desc: "Silly-mistake audit and weak-chapter heatmap, explained plainly.", icon: Brain },
    { id: "backlog",          label: "Backlog clearing sprints",    desc: "A running list of pending topics, cleared one sprint at a time.", icon: Rocket },
    { id: "parent-report",    label: "Weekly report and tasks",     desc: "Tasks for the week, with an auto email sent to your parents.", icon: Mail },
  ];

  return (
    <section style={{ background: "var(--page-bg)", minHeight: "100vh", paddingBottom: 70 }}>
      {/* ── Title strip ── */}
      {/* The fixed header is 98px tall (34px announcement + 64px nav); this
          top padding clears it with real breathing room so the eyebrow doesn't
          sit flush against the navbar. */}
      <div style={{ paddingTop: 138, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "inline-block", fontSize: 12, fontWeight: 800, letterSpacing: ".02em", color: ORANGE, background: "rgba(255,105,61,.1)", borderRadius: 50, padding: "6px 16px", marginBottom: 16 }}>
          1-on-1 · personalised · verified
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }}
          style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.7rem,3.6vw,2.4rem)", color: NAVY, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
          Mentorship dashboard
        </motion.h1>
      </div>

      {/* ══ HERO — centered welcome ══ */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* decorative rising "trajectory" — faint dashed line + dots, top-right */}
        <svg className="md-hero-line" width="380" height="170" viewBox="0 0 380 170" fill="none" aria-hidden="true"
          style={{ position: "absolute", top: 6, right: 0, pointerEvents: "none" }}>
          <path d="M8 150 C 100 140, 150 100, 215 78 S 320 26, 360 12" stroke={ORANGE} strokeWidth="2" strokeDasharray="4 7" strokeLinecap="round" opacity=".45" />
          <circle cx="150" cy="102" r="4" fill={ORANGE} opacity=".4" />
          <circle cx="256" cy="52" r="4.5" fill={ORANGE} opacity=".65" />
          <circle cx="360" cy="12" r="5.5" fill={ORANGE} />
        </svg>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .06 }}
          style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: "48px 24px 8px", textAlign: "center" }}>

          {/* status + student ID pill */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 800, borderRadius: 50, padding: "6px 15px",
            color: identity.status === "expired" ? "#dc2626" : ORANGE,
            background: identity.status === "expired" ? "rgba(220,38,38,.08)" : "rgba(255,105,61,.1)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: identity.status === "expired" ? "#dc2626" : ORANGE, display: "block" }} />
            <span style={{ textTransform: "capitalize" }}>{identity.status || "Active"}</span>
            {identity.studentId && <span style={{ opacity: .55 }}>·</span>}
            {identity.studentId && <span style={{ fontFamily: "monospace", letterSpacing: ".02em" }}>{identity.studentId}</span>}
          </span>

          {/* welcome heading with hand-drawn coral underline on the name */}
          <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "clamp(1.5rem,3.6vw,2.1rem)", color: NAVY, lineHeight: 1.15, letterSpacing: "-0.5px", margin: "16px 0 0" }}>
            Welcome back,<br />
            <span style={{ position: "relative", display: "inline-block", color: ORANGE }}>
              {(user?.name || "there").trim().split(/\s+/)[0]}.
              <svg width="100%" height="12" viewBox="0 0 200 12" preserveAspectRatio="none" fill="none"
                style={{ position: "absolute", left: 0, bottom: -5, width: "100%" }} aria-hidden="true">
                <path d="M3 8 C 45 3, 100 3, 150 6 S 190 9, 197 5" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" opacity=".8" />
              </svg>
            </span>
          </h2>

          <p style={{ color: MUTE, fontSize: 15.5, lineHeight: 1.7, margin: "22px auto 0", maxWidth: 500 }}>
            Log your day, track every test, and get a clean weekly report — everything to turn your prep into a real rank.
          </p>

          {/* actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 26 }}>
            <button onClick={() => scrollTo("live-tracking")} style={{ background: ORANGE, color: "#fff", border: "none", padding: "13px 24px", borderRadius: 50, fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: `0 12px 26px -12px ${ORANGE}` }}>
              Log today <ArrowRight size={16} />
            </button>
            <button onClick={() => scrollTo("test-analysis")} style={{ background: "#fff", color: NAVY, border: "1px solid #ececec", padding: "13px 24px", borderRadius: 50, fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, cursor: "pointer" }}>
              Add a test
            </button>
          </div>

          {/* meta pills — batch, enrolment, validity, streak */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 26 }}>
            {[
              { icon: GraduationCap, text: identity.batchLabel || planLabel },
              { icon: CalendarDays,  text: identity.enrolledOn ? `Enrolled ${fmtFull(identity.enrolledOn)}` : null },
              { icon: ShieldCheck,   text: identity.validUntil ? `Valid until ${fmtFull(identity.validUntil)}` : null },
              { icon: Flame,         text: `${streak} day${streak === 1 ? "" : "s"} streak` },
            ].filter((p) => p.text).map(({ icon: Icon, text }) => (
              <span key={text} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: MUTE, background: "#fff", border: "1px solid #ececec", borderRadius: 50, padding: "7px 14px" }}>
                <Icon size={14} color={ORANGE} /> {text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══ FEATURE GRID — what the dashboard gives you ══ */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 0" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .12 }}
          className="md-feature-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#ececec", border: "1px solid #ececec", borderRadius: 18, overflow: "hidden" }}>
          {FEATURES.map(({ id, label, desc, icon: Icon }) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ textAlign: "left", background: "var(--page-bg)", border: "none", padding: "24px 22px 26px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 14, transition: "background .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,105,61,.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--page-bg)"; }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,105,61,.1)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon size={19} color={ORANGE} />
              </span>
              <div>
                <div style={{ fontFamily: "Sora", fontWeight: 600, fontSize: 15, color: NAVY, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 12.5, color: MUTE, lineHeight: 1.55 }}>{desc}</div>
              </div>
            </button>
          ))}
        </motion.div>
      </div>

      {/* ══ STICKY SECTION NAV ══ */}
      {/* ══ BODY ══ */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px" }}>

        {/* ── PERSONALISED OVERVIEW ── */}
        {/* ── LIVE STUDENT TRACKING ── */}
        <Section id="live-tracking" kicker={`Always on · up to ${MAX_LOGS_PER_DAY}× a day`} title="Live Student Tracking" tColor="#ef4444"
          sub={`Log each subject's study hours and tasks — and update them up to ${MAX_LOGS_PER_DAY} times a day. The charts refresh instantly so nothing slips through the cracks.`}>
          <div style={{ background: "var(--page-bg)", border: "1px solid rgba(255, 105, 61,.18)", borderRadius: 20, padding: "24px", boxShadow: "0 20px 46px -28px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${GREEN},${ORANGE})` }} />

            {/* header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 18 }}>{initial}</div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", color: INK }}>{user?.name || "Student"} · {planExam}</div>
                <div style={{ fontSize: 12.5, color: MUTE }}>
                  {mentor?.name
                    ? <>Mentor: <strong style={{ color: NAVY, fontWeight: 700 }}>{mentor.name}</strong>{mentor.college ? ` · ${mentor.college}` : ""}</>
                    : "Mentor: Assigned · 1-on-1"}
                </div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, color: "#16a34a", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", padding: "6px 13px", borderRadius: 50 }}>
                <motion.span animate={{ opacity: [1, .3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "block" }} />
                LIVE · Active now
              </span>
            </div>

            {/* stat tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(120px, 100%), 1fr))", gap: 12, marginBottom: 20 }}>
              {[
                { icon: Clock, c: ORANGE, v: todayEntry ? `${todayEntry.hours}h` : "0h", l: "Today" },
                { icon: Activity, c: "#6366f1", v: `${round1(weekHours)}h`, l: "This week" },
                { icon: Flame, c: "#ef4444", v: `${streak} day${streak === 1 ? "" : "s"}`, l: "Streak" },
                { icon: CheckCircle2, c: "#22c55e", v: tasksLabel, l: "Tasks done" },
                { icon: Target, c: "#FF693D", v: `${routinePct}%`, l: "Routine kept" },
              ].map(({ icon: Icon, c, v, l }) => (
                <div key={l} style={{ background: "var(--page-bg)", border: "1px solid rgba(255, 105, 61,.16)", borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
                  <Icon size={18} color={c} style={{ marginBottom: 6 }} />
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, color: INK }}>{v}</div>
                  <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* log today — up to 3 updates a day, then locked till tomorrow */}
            {todayEntry && !editingLog ? (
              <div style={{ background: "#f0faf4", border: "1px solid rgba(34,197,94,.3)", borderRadius: 14, padding: "16px 18px", marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 800, color: "#15803d" }}>
                    <CheckCircle2 size={17} /> Logged for today ({fmtDay(todayIso)})
                    {/* updates-used pips */}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginLeft: 2 }}>
                      {Array.from({ length: MAX_LOGS_PER_DAY }).map((_, i) => (
                        <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i < editsUsed ? "#15803d" : "#bbf7d0" }} />
                      ))}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>{editsUsed}/{MAX_LOGS_PER_DAY}</span>
                  </span>
                  {canLogMore ? (
                    <button type="button" onClick={startEditLog}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg,${ORANGE},${GOLD})`, border: "none", borderRadius: 9, padding: "9px 15px", fontSize: 12.5, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "Sora", boxShadow: `0 8px 18px -10px ${ORANGE}` }}>
                      <Pencil size={13} /> Edit / update hours · {editsLeft} left
                    </button>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--page-bg)", border: "1px solid #cbd5e1", borderRadius: 9, padding: "7px 12px", fontSize: 12, fontWeight: 700, color: MUTE }}>
                      <Lock size={13} /> All {MAX_LOGS_PER_DAY} updates used · locked till tomorrow
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {subjects.map((s) => (
                    <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--page-bg)", border: `1px solid ${subColor(s)}33`, borderRadius: 9, padding: "6px 11px", fontSize: 12.5, fontWeight: 700, color: NAVY }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: subColor(s) }} /> {shortName(s)}: {subVal(todayEntry, s).h}h · {subVal(todayEntry, s).t}✓
                    </span>
                  ))}
                  <span style={{ background: "var(--page-bg)", border: "1px solid #e5e7eb", borderRadius: 9, padding: "6px 11px", fontSize: 12.5, fontWeight: 700, color: NAVY }}>Tasks: {todayEntry.tasksDone}/{todayEntry.tasksTotal}</span>
                  <span style={{ background: "var(--page-bg)", border: "1px solid #e5e7eb", borderRadius: 9, padding: "6px 11px", fontSize: 12.5, fontWeight: 700, color: todayEntry.routine ? "#15803d" : "#b91c1c" }}>Routine: {todayEntry.routine ? "Followed ✓" : "Missed"}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={addLog} style={{ background: "#fffaf5", border: "1px solid rgba(255, 105, 61,.22)", borderRadius: 14, padding: "16px 18px", marginBottom: 22 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: "#9a3412", marginBottom: 12 }}>
                  {editingLog ? "Update today" : "Log today"} ({fmtDay(todayIso)}) · hours & tasks completed per subject
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(150px, 100%), 1fr))", gap: 10, marginBottom: 12 }}>
                  {subjects.map((s) => (
                    <SubjectDualField key={s} subject={s}
                      hours={logForm.subjects?.[s]?.h ?? ""} tasks={logForm.subjects?.[s]?.t ?? ""}
                      onHours={(v) => setLogForm((st) => ({ ...st, subjects: { ...st.subjects, [s]: { ...st.subjects?.[s], h: v } } }))}
                      onTasks={(v) => setLogForm((st) => ({ ...st, subjects: { ...st.subjects, [s]: { ...st.subjects?.[s], t: v } } }))} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <NumField label="Tasks planned (total)" value={logForm.tasksTotal} onChange={(v) => setLogForm((s) => ({ ...s, tasksTotal: v }))} placeholder="e.g. 21" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280" }}>Followed routine?</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[["Yes", true], ["No", false]].map(([lbl, val]) => (
                        <button type="button" key={lbl} onClick={() => setLogForm((s) => ({ ...s, routine: val }))}
                          style={{ padding: "10px 16px", borderRadius: 10, border: `1.5px solid ${logForm.routine === val ? ORANGE : "#e5e7eb"}`, background: logForm.routine === val ? `${ORANGE}10` : "#fff", color: logForm.routine === val ? "#9a3412" : "#6b7280", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" style={{ padding: "11px 18px", borderRadius: 11, border: "none", background: `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <Plus size={15} /> {editingLog ? "Save changes" : "Save today's log"}
                  </button>
                  {editingLog && (
                    <button type="button" onClick={() => { setEditingLog(false); setLogForm({ subjects: {}, tasksTotal: "", routine: true }); }}
                      style={{ padding: "11px 18px", borderRadius: 11, border: "1.5px solid #e5e7eb", background: "var(--page-bg)", color: MUTE, fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
                      Cancel
                    </button>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: MUTE, marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <RotateCw size={12} /> You can update today's log up to {MAX_LOGS_PER_DAY} times a day{editingLog ? ` — ${editsLeft} update${editsLeft === 1 ? "" : "s"} left after this` : ""}. It locks till tomorrow once used up.
                </div>
              </form>
            )}

            {/* weekly hours bars + goal gauge */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: 22, alignItems: "center" }} className="md-track-grid">
              {/* weekly-hours bar chart — premium card with gridlines */}
              <div style={{ background: "var(--page-bg)", border: "1px solid rgba(255, 105, 61,.18)", borderRadius: 16, padding: "16px 16px 14px", boxShadow: "0 16px 40px -30px rgba(255, 105, 61,.8)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: NAVY }}>Total study hours · last 7 days</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: ORANGE, background: `${ORANGE}12`, borderRadius: 50, padding: "3px 9px" }}>{round1(weekHours)}h total</span>
                </div>
                {/* plot: gridlines layer + bars layer share the same box.
                    Gridlines are bottom-anchored on the SAME scale as the bars
                    (bar max = 132px) so labels line up with the bar tops. */}
                <div style={{ position: "relative", height: 168 }}>
                  {/* horizontal gridlines + scale labels */}
                  {[0, 1, 2, 3].map((g) => {
                    const val = round1((maxH * g) / 3);
                    return (
                      <div key={g} style={{ position: "absolute", left: 0, right: 0, bottom: `${(g / 3) * 132}px`, display: "flex", alignItems: "center", gap: 6, pointerEvents: "none" }}>
                        <span style={{ fontSize: 9, color: "#b6bdc7", fontWeight: 700, width: 22, flexShrink: 0, textAlign: "right", transform: "translateY(50%)" }}>{val}h</span>
                        <span style={{ flex: 1, borderTop: g === 0 ? "2px solid #e7ebf0" : "1px dashed #eef1f5" }} />
                      </div>
                    );
                  })}
                  {/* bars */}
                  <div style={{ position: "absolute", inset: "0 0 0 28px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 7 }}>
                    {last7.map((e, i) => {
                      const h = Number(e.hours) || 0;
                      const isToday = i === last7.length - 1;
                      // A past calendar day with no log → a genuine 0h (NOT a
                      // fabricated average). Today with no log yet is just pending.
                      const isMissing = h === 0 && !isToday;
                      const dow = DOW[new Date(e.date).getDay()];
                      // 0h days still get a tiny 3px stub so the day reads as
                      // "present but empty" rather than a blank gap.
                      const barPx = h > 0 ? Math.max(5, Math.round((h / maxH) * 132)) : 3;

                      return (
                        <div key={e.date} title={isMissing ? `No study log for ${dow} — recorded as 0h` : `${h}h on ${dow}`}
                          style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 5 }}>

                          <span style={{ fontSize: 11, fontWeight: 800, color: isMissing ? "#9aa0aa" : (isToday ? ORANGE : INK) }}>
                            {h}h
                          </span>

                          <motion.div initial={{ height: 0 }} animate={{ height: barPx }} transition={{ type: "spring", stiffness: 120, damping: 18, delay: i * 0.06 }}
                            style={{ width: "100%", maxWidth: 30, borderRadius: "8px 8px 2px 2px",
                              background: isMissing ? "#e7ebf0" : (isToday ? `linear-gradient(180deg,${ORANGE},${GOLD})` : "linear-gradient(180deg,rgba(255, 105, 61,.6),rgba(255, 105, 61,.26))"),
                              boxShadow: isToday ? `0 8px 18px -8px ${ORANGE}` : "none" }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* day labels row (aligned under the bars) */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: 7, marginTop: 9, paddingLeft: 28 }}>
                  {last7.map((e, i) => (
                    <span key={e.date} style={{ flex: 1, minWidth: 0, textAlign: "center", fontSize: 10.5, fontWeight: 700, color: i === last7.length - 1 ? ORANGE : MUTE }}>
                      {DOW[new Date(e.date).getDay()]}
                    </span>
                  ))}
                </div>
                {/* subtle note so a 0h bar reads as "missed update", not a bug */}
                {last7.some((e, i) => Number(e.hours) === 0 && i !== last7.length - 1) && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 10.5, fontWeight: 600, color: "#9aa0aa" }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: "#e7ebf0", flexShrink: 0 }} />
                    Days with no log are counted as 0h.
                  </div>
                )}
              </div>
              <div style={{ background: "var(--page-bg)", border: "1px solid rgba(34,197,94,.22)", borderRadius: 16, padding: "16px 14px 12px", boxShadow: "0 16px 40px -30px rgba(34,197,94,.9)", textAlign: "center" }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: NAVY, marginBottom: 2 }}>Weekly goal ({WEEK_TARGET_HRS}h)</div>
                <Gauge value={goalPct} label="of target" color="#22c55e" height={170} />
                <div style={{ fontSize: 11.5, color: MUTE, fontWeight: 600, marginTop: -2 }}>
                  {round1(weekHours)}h of {WEEK_TARGET_HRS}h · {Math.max(0, round1(WEEK_TARGET_HRS - weekHours))}h to go
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── SUBJECT-WISE ANALYSIS ── */}
        <Section id="subject-analysis" kicker="Every subject counts" title="Subject-wise Analysis" tColor={ORANGE}
          sub="See exactly where your hours and tasks go, compare day-by-day, and check this week against last week.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px, 100%), 1fr))", gap: 18, marginBottom: 18 }}>
            <ChartCard title="Study hours per subject · last 7 days" hint="Compare each subject day by day" accent={ORANGE}>
              <Trend data={subjectHourTrend} lines={subjectLines} height={230} fmt={(v) => `${v}h`} />
            </ChartCard>
            <ChartCard title="Tasks completed per subject · last 7 days" hint="How many tasks you cleared, by subject" accent={ORANGE}>
              <Trend data={subjectTaskTrend} lines={subjectLines} height={230} />
            </ChartCard>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px, 100%), 1fr))", gap: 18, alignItems: "start" }} className="md-track-grid">
            <ChartCard title="Time split this week" hint="Share of study hours per subject" accent={ORANGE}>
              {subjectPie.length ? (
                <div className="md-donut-row" style={{ display: "grid", gridTemplateColumns: "minmax(150px,auto) minmax(0,1fr)", gap: 16, alignItems: "center" }}>
                  <CenterDonut
                    data={subjectPie}
                    colors={subjectPieColors}
                    centerLabel={`${round1(subjectPieTotal)}h`}
                    centerSub="total"
                    height={200}
                    fmt={(v) => `${v}h`}
                  />
                  <DonutLegend data={subjectPie} colors={subjectPieColors} fmt={(v) => `${v}h`} />
                </div>
              ) : <ChartHint text="Log today's subject hours to see your split." />}
            </ChartCard>

            <ChartCard title="Subject breakdown" hint="Hours, tasks and weekly change per subject" accent={ORANGE}>
              <motion.div
                className="md-subject-grid"
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(140px, 100%), 1fr))", gap: 10 }}
                initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              >
                {subjects.map((s) => {
                  const now = round1(thisWkH[s]); const was = round1(lastWkH[s]);
                  const d = round1(now - was);
                  const c = subColor(s);
                  const tasks = Math.round(thisWkT[s]);
                  return (
                    // Clean, compact card: neutral surface with a single subject-coloured
                    // accent (the dot + the number), so the grid reads calm, not rainbow.
                    <motion.div key={s}
                      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                      whileHover={{ y: -3 }}
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                      style={{ background: "var(--page-bg)", border: "1px solid #eef2f7", borderRadius: 14, padding: "12px 13px", boxShadow: "0 10px 26px -22px rgba(26,26,46,.5)", display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: c, boxShadow: `0 0 0 3px ${c}1f`, flexShrink: 0 }} />
                        <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 12.5, color: NAVY }}>{shortName(s)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                        <span style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 23, color: c, lineHeight: 1 }}>{now}</span>
                        <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, color: MUTE }}>hrs</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 11px", marginTop: 8 }}>
                        <span style={{ fontSize: 11, color: MUTE, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <CheckCircle2 size={11} color={c} /> {tasks} task{tasks === 1 ? "" : "s"}
                        </span>
                        <span style={{ fontSize: 11, color: MUTE, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} color={c} /> {round1(now / 7)}h/day
                        </span>
                      </div>
                      <DeltaPill d={d} unit="h" subtext="vs last week" />
                    </motion.div>
                  );
                })}
              </motion.div>
            </ChartCard>
          </div>
        </Section>

        {/* ── TEST ANALYSIS ── */}
        <Section id="test-analysis" kicker="Every test counts" title="Test Analysis" tColor="#FF693D"
          sub={rankEnabled
            ? "Enter your marks, silly mistakes and weak chapters. Pick JEE Mains/Advanced to get a predicted rank — everything else is analysed automatically."
            : "Enter your marks, silly mistakes and weak chapters — we analyse accuracy, score and week-on-week change automatically."}>
          {/* Nudge: no test logged in a week → ask if one was taken, then guide
              them to log it. "No" simply snoozes it for the day. */}
          {showTestReminder && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: "linear-gradient(135deg,#fff5f1,#fff4ef)", border: "1px solid rgba(255,105,61,.28)", borderRadius: 14, padding: "13px 16px", marginBottom: 16 }}>
              {testAskStage === "ask" ? (
                <>
                  <AlertCircle size={18} color="#FF693D" style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, minWidth: 180, fontSize: 13.5, fontWeight: 700, color: NAVY }}>
                    Have you taken a test since your last update? Keep your analysis up to date.
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => setTestAskStage("confirm")}
                      style={{ background: "#FF693D", color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontFamily: "Sora", fontWeight: 800, fontSize: 12.5, cursor: "pointer", boxShadow: "0 8px 18px -10px #FF693D" }}>
                      Yes, I did
                    </button>
                    <button type="button" onClick={() => { setTestRemindSnooze(todayIso); setTestAskStage("ask"); }}
                      style={{ background: "var(--page-bg)", color: MUTE, border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "8px 16px", fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                      No, not yet
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Sparkles size={18} color="#FF693D" style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, minWidth: 180, fontSize: 13.5, fontWeight: 700, color: NAVY }}>
                    Great — add its marks below and we'll refresh your score, accuracy{rankEnabled ? " and rank" : ""} instantly.
                  </span>
                  <button type="button" onClick={() => scrollTo("add-test-form")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#FF693D", color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontFamily: "Sora", fontWeight: 800, fontSize: 12.5, cursor: "pointer", boxShadow: "0 8px 18px -10px #FF693D" }}>
                    <Plus size={14} /> Update the test
                  </button>
                </>
              )}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(330px, 100%), 1fr))", gap: 18 }}>
            {/* left — input + reports + strategies */}
            <div id="add-test-form" style={{ background: "var(--page-bg)", border: "1px solid rgba(255,105,61,.18)", borderRadius: 20, padding: "22px 22px 20px", boxShadow: "0 18px 44px -28px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${ORANGE},${GOLD})` }} />
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.1rem", color: INK, margin: "0 0 14px" }}>Add a test result</h3>

              {/* JEE-only test type toggle — Advanced logs both papers together */}
              {rankEnabled && (
                <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
                  {[["main", "JEE Mains"], ["adv", "JEE Advanced"]].map(([val, lbl]) => (
                    <button type="button" key={val} onClick={() => setTestType(val)}
                      style={{ flex: "1 1 96px", padding: "9px 8px", borderRadius: 10, border: `1.5px solid ${testForm.type === val ? "#FF693D" : "#e5e7eb"}`, background: testForm.type === val ? "#FF693D10" : "#fff", color: testForm.type === val ? "#E0421F" : "#6b7280", fontWeight: 800, fontSize: 12.5, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <Trophy size={13} /> {lbl}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={addTest} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <TextField label="Test name" value={testForm.name} onChange={(v) => setTestForm((s) => ({ ...s, name: v }))} placeholder="e.g. Mock 4" />

                {rankEnabled && isAdv(testForm.type) ? (
                  <>
                    {/* both papers logged together — full exam is 6 hours (3h + 3h) */}
                    <div style={{ background: "#fff5f1", border: "1px solid #fecfbf", borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <Timer size={14} color="#E0421F" />
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: "#E0421F" }}>Full exam · 6 hours total</span>
                      <span style={{ fontSize: 11, color: "#FF693D" }}>Paper 1 · 3h + Paper 2 · 3h — enter both papers below</span>
                    </div>

                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#E0421F" }}>Paper 1 · marks per section (out of {ADV_PAPER_SUB_MAX} each · {ADV_PAPER_TOTAL} total)</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      <NumField label="Physics" value={testForm.mp} onChange={(v) => setTestForm((s) => ({ ...s, mp: v }))} placeholder="0" full />
                      <NumField label="Chemistry" value={testForm.mc} onChange={(v) => setTestForm((s) => ({ ...s, mc: v }))} placeholder="0" full />
                      <NumField label="Maths" value={testForm.mm} onChange={(v) => setTestForm((s) => ({ ...s, mm: v }))} placeholder="0" full />
                    </div>

                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#E0421F" }}>Paper 2 · marks per section (out of {ADV_PAPER_SUB_MAX} each · {ADV_PAPER_TOTAL} total)</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      <NumField label="Physics" value={testForm.mp2} onChange={(v) => setTestForm((s) => ({ ...s, mp2: v }))} placeholder="0" full />
                      <NumField label="Chemistry" value={testForm.mc2} onChange={(v) => setTestForm((s) => ({ ...s, mc2: v }))} placeholder="0" full />
                      <NumField label="Maths" value={testForm.mm2} onChange={(v) => setTestForm((s) => ({ ...s, mm2: v }))} placeholder="0" full />
                    </div>

                    {/* exam totals — editable because JEE Advanced's pattern changes every year */}
                    <div style={{ fontSize: 11, color: MUTE, lineHeight: 1.45 }}>JEE Advanced's total marks &amp; question count change every year — confirm yours below.</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <NumField label="Total marks of exam" value={testForm.advTotal} onChange={(v) => setTestForm((s) => ({ ...s, advTotal: v }))} placeholder={String(ADV_FULL_TOTAL)} full />
                      <NumField label="Total questions in exam" value={testForm.advQuestions} onChange={(v) => setTestForm((s) => ({ ...s, advQuestions: v }))} placeholder={String(ADV_FULL_QUESTIONS)} full />
                    </div>
                    <SelectField label="Category" value={testForm.category} onChange={(v) => setTestForm((s) => ({ ...s, category: v }))} options={CATEGORIES} />
                  </>
                ) : rankEnabled && testForm.type === "main" ? (
                  <>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#E0421F", marginTop: -2 }}>
                      Marks per section (out of {maxPerSubject(false)} each · total {maxTotal(false)})
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      <NumField label="Physics" value={testForm.mp} onChange={(v) => setTestForm((s) => ({ ...s, mp: v }))} placeholder="0" full />
                      <NumField label="Chemistry" value={testForm.mc} onChange={(v) => setTestForm((s) => ({ ...s, mc: v }))} placeholder="0" full />
                      <NumField label="Maths" value={testForm.mm} onChange={(v) => setTestForm((s) => ({ ...s, mm: v }))} placeholder="0" full />
                    </div>
                    <SelectField label="Category" value={testForm.category} onChange={(v) => setTestForm((s) => ({ ...s, category: v }))} options={CATEGORIES} />
                  </>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <NumField label="Total marks" value={testForm.total} onChange={(v) => setTestForm((s) => ({ ...s, total: v }))} placeholder="300" full />
                    <NumField label="Marks scored" value={testForm.scored} onChange={(v) => setTestForm((s) => ({ ...s, scored: v }))} placeholder="178" full />
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <NumField label="Correct" value={testForm.correct} onChange={(v) => setTestForm((s) => ({ ...s, correct: v }))} placeholder="64" full />
                  <NumField label="Wrong" value={testForm.wrong} onChange={(v) => setTestForm((s) => ({ ...s, wrong: v }))} placeholder="14" full />
                  <NumField label="Skipped" value={testForm.skipped} onChange={(v) => setTestForm((s) => ({ ...s, skipped: v }))} placeholder="12" full />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <NumField label="Silly mistakes" value={testForm.silly} onChange={(v) => setTestForm((s) => ({ ...s, silly: v }))} placeholder="e.g. 4" full />
                  <TextField label="Silly mistake topic" value={testForm.sillyTopic} onChange={(v) => setTestForm((s) => ({ ...s, sillyTopic: v }))} placeholder="e.g. Sign errors" />
                </div>

                <SelectField label="Over-spent time on (quick pick)" value={testForm.overspent} onChange={(v) => setTestForm((s) => ({ ...s, overspent: v }))} options={["", ...subjects]} placeholders={{ "": "Select subject" }} labels={Object.fromEntries(subjects.map((s) => [s, shortName(s)]))} />
                <button type="submit" disabled={!testFormComplete()}
                  style={{ marginTop: 4, padding: "13px", borderRadius: 12, border: "none", background: testFormComplete() ? "linear-gradient(135deg,#FF693D,#E0421F)" : "#ffc2b0", color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, cursor: testFormComplete() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Plus size={16} /> {rankEnabled && (testForm.type === "main" || isAdv(testForm.type)) ? "Analyse & predict rank" : "Analyse this test"}
                </button>
                {!testFormComplete() && (
                  <div style={{ fontSize: 12, color: "#9a3412", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 7, lineHeight: 1.45 }}>
                    <AlertCircle size={14} color="#ea580c" style={{ flexShrink: 0 }} /> Fill in every field above — a test is only analysed once all details are entered.
                  </div>
                )}
              </form>

              {/* improvement / decline report */}
              {latest && (
                <div style={{ marginTop: 16, background: improvement == null ? "#f8fafc" : improvement >= 0 ? "#f0faf4" : "#fef2f2", border: `1px solid ${improvement == null ? "#e5e7eb" : improvement >= 0 ? "#bbf7d0" : "#fecaca"}`, borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    {improvement == null ? <BarChart3 size={16} color="#64748b" />
                      : improvement >= 0 ? <TrendingUp size={16} color="#16a34a" /> : <TrendingDown size={16} color="#dc2626" />}
                    <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, color: INK }}>
                      {latest.name} · {pct(latest)}% · {acc(latest)}% accuracy
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                    {improvement == null
                      ? "Add one more test and we'll show your improvement automatically."
                      : improvement >= 0
                        ? `Great work — your score is up ${improvement}% vs ${prev.name}. Keep the momentum going.`
                        : `Your score dropped ${Math.abs(improvement)}% vs ${prev.name}. Review your weak topics with your mentor this week.`}
                  </div>
                </div>
              )}

              {/* rank prediction (JEE only) */}
              {rankEnabled && (() => {
                const live = getLiveRank();
                if (live && testForm.name) {
                  return <RankCard r={live.rank} name={live.name} />;
                }
                return latestRankTest?.rank ? <RankCard r={latestRankTest.rank} name={latestRankTest.name} /> : null;
              })()}
            </div>

            {/* right — charts + strategies */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <ChartCard title="Score trend" hint="Your marks across every test (vs 75% target)" accent="#FF693D">
                <Trend data={scoreTrend} lines={[{ key: "you", label: "You", color: ORANGE }, { key: "target", label: "Target (75%)", color: "#94a3b8" }]} height={200} />
              </ChartCard>
              <ChartCard title="Accuracy trend" hint="Correct ÷ attempted, test over test" accent="#22c55e">
                <Trend data={accTrend} lines={[{ key: "accuracy", label: "Accuracy %", color: "#22c55e" }]} height={180} fmt={(v) => `${v}%`} />
              </ChartCard>
              {/* strategies — grows to fill the column so the left (form + rank
                  card) and right side finish at the same height */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "linear-gradient(135deg,#fffaf0,#fff)", border: `1px solid ${GOLD}44`, borderRadius: 18, padding: "18px 20px", boxShadow: "0 16px 40px -30px rgba(245,166,35,.8)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Lightbulb size={18} color={GOLD} />
                  <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15, color: INK }}>Strategies to do better</span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around", gap: 12 }}>
                  {strategies.map((st, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 9, background: `${st.color}14`, border: `1px solid ${st.color}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <st.icon size={16} color={st.color} />
                      </span>
                      <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, paddingTop: 4 }}>{st.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── MENTOR TOOLS ── */}
        <Section id="mentor-tools" kicker="Proof, not guesswork" title="What Your Mentor Breaks Down" tColor={GOLD}
          sub="Every number you enter is automatically turned into the exact breakdowns your mentor reviews — and an action list for the week.">

          {/* AI insights banner */}
          <div style={{ background: "linear-gradient(135deg,#fffaf0,#fff)", border: `1px solid ${GOLD}44`, borderRadius: 18, padding: "20px 22px", marginBottom: 18, boxShadow: "0 16px 40px -30px rgba(245,166,35,.8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 11, background: `${GOLD}1a`, border: `1px solid ${GOLD}44`, display: "grid", placeItems: "center" }}><Brain size={18} color={GOLD} /></span>
              <div>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", color: INK }}>AI auto-analysis</div>
                <div style={{ fontSize: 12, color: MUTE }}>Improvement & decline report, updated from your latest log & test</div>
              </div>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {insights.length ? insights.map((ins, i) => (
                <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: "var(--page-bg)", border: "1px solid #f1f5f9", borderRadius: 12, padding: "10px 13px" }}>
                  {ins.tone === "up" ? <TrendingUp size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                    : ins.tone === "down" ? <TrendingDown size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                    : <Minus size={16} color="#64748b" style={{ flexShrink: 0, marginTop: 1 }} />}
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{ins.text}</span>
                </div>
              )) : <span style={{ fontSize: 13, color: MUTE }}>Add a couple of tests and daily logs to unlock your improvement & decline report.</span>}
            </div>
          </div>

          <div className="md-tools-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16 }}>
            {/* Silly-mistake audit */}
            <ToolCard icon={Crosshair} color="#ef4444" title="Silly-mistake audit" desc="Marks lost to silly errors — tracked, by topic, and killed.">
              {sillyTrend.length ? (
                <>
                  <Bars data={sillyTrend} bars={[{ key: "silly", label: "Silly mistakes", color: "#ef4444" }]} height={170} angle={-32} />
                  {latest && prev && (
                    <DeltaPill d={Number(latest.silly) - Number(prev.silly)} lowerIsBetter subtext={`${prev.silly} → ${latest.silly} this test`} />
                  )}
                  {sillyTopics.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: MUTE, marginBottom: 6 }}>Where silly mistakes happen</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {sillyTopics.slice(0, 5).map(([c, n]) => (
                          <span key={c} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 50, padding: "4px 10px", fontSize: 11.5, fontWeight: 700 }}>{c}{n > 1 ? ` ×${n}` : ""}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : <ChartHint text="Add tests with silly-mistake counts & topics." />}
            </ToolCard>

            {/* Chapter strength & weekly coverage — feeds the parent chapter report */}
            <ToolCard icon={BookOpen} color="#FF693D" title="Add a chapter" desc="Tag each chapter weak / medium / strong and how much you covered this week — it appears in your Chapter-strength report.">
              <form onSubmit={addChapter} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <SelectField label="Subject" value={chapForm.subject || subjects[0]} onChange={(v) => setChapForm((s) => ({ ...s, subject: v }))} options={subjects} labels={Object.fromEntries(subjects.map((s) => [s, shortName(s)]))} />
                  <NumField label="Covered this week (%)" value={chapForm.coverage} onChange={(v) => setChapForm((s) => ({ ...s, coverage: v }))} placeholder="e.g. 60" full />
                </div>
                <TextField label="Chapter" value={chapForm.topic} onChange={(v) => setChapForm((s) => ({ ...s, topic: v }))} placeholder="e.g. Rotational Motion" />
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280" }}>Strength</span>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    {["weak", "medium", "strong"].map((k) => {
                      const st = STRENGTHS[k]; const on = chapForm.strength === k;
                      return (
                        <button type="button" key={k} onClick={() => setChapForm((s) => ({ ...s, strength: k }))}
                          style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1.5px solid ${on ? st.color : "#e5e7eb"}`, background: on ? `${st.color}12` : "#fff", color: on ? st.color : "#6b7280", fontWeight: 800, fontSize: 12.5, cursor: "pointer" }}>
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button type="submit" style={{ padding: "11px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#FF693D,#E0421F)", color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  <Plus size={15} /> Add chapter
                </button>
              </form>
              <div style={{ marginTop: 12, fontSize: 12, color: MUTE, lineHeight: 1.5, background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 10, padding: "9px 12px" }}>
                Added chapters {chapterLog.length ? <><strong style={{ color: NAVY }}>({chapterLog.length})</strong> </> : ""}appear in your <strong style={{ color: "#E0421F" }}>Chapter-strength report</strong> — where you can review and remove them.
              </div>
            </ToolCard>


            {/* Weekly fix-list — the mentor's assigned tasks + the student's own
                tasks (both roll up into the weekly parent report). */}
            <ToolCard icon={ListChecks} color={GREEN} title="Your weekly fix-list" desc="Your mentor's tasks plus your own — all summarised in the weekly parent report.">
              {/* tasks your mentor assigned for this student */}
              {mentorTasks.length > 0 ? (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "#E0421F", background: "#fff5f1", border: "1px solid #ffe0d4", borderRadius: 50, padding: "3px 10px", marginBottom: 8 }}>
                    <Brain size={12} /> From your mentor
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {mentorTasks.map((t) => {
                      const label = t.text;
                      const done = fixDoneSet.includes(label);
                      return (
                        <button key={t.id || label} onClick={() => toggleFix(label)}
                          style={{ display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left", background: done ? "#fff5f1" : "#fff", border: `1px solid ${done ? "#fecfbf" : "#eef2f7"}`, borderRadius: 11, padding: "10px 12px", cursor: "pointer" }}>
                          <span style={{ width: 19, height: 19, borderRadius: 6, border: `1.5px solid ${done ? "#FF693D" : "#cbd5e1"}`, background: done ? "#FF693D" : "#fff", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                            {done && <CheckCircle2 size={14} color="#fff" />}
                          </span>
                          <span style={{ fontSize: 13, color: done ? "#E0421F" : "#374151", lineHeight: 1.45, textDecoration: done ? "line-through" : "none" }}>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 11.5, color: MUTE, marginTop: 8, lineHeight: 1.5 }}>
                    Tick these off as you finish them — your mentor sees your progress live. They reset each week.
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: 16, padding: "14px 14px", background: "#fff7f3", border: "1px dashed #fecfbf", borderRadius: 11, fontSize: 12.5, color: "#E0421F", lineHeight: 1.5 }}>
                  <strong>No mentor tasks yet.</strong> When your mentor assigns tasks, they'll appear here as your must-do list.
                </div>
              )}

              {/* the student's own weekly tasks — add + edit + complete (no delete) */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: MUTE, textTransform: "uppercase", letterSpacing: ".05em" }}>Your tasks</div>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: GREEN, background: "#dcfce7", borderRadius: 50, padding: "3px 10px" }}>{weeklyDone}/{weeklyTasks.length} done</span>
                </div>
                <form onSubmit={addWeeklyTask} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input value={wtInput} onChange={(e) => setWtInput(e.target.value)} placeholder="Add your own task — e.g. Finish Rotational Motion DPP"
                    style={{ flex: 1, minWidth: 0, padding: "10px 12px", borderRadius: 11, border: "1.5px solid #e5e7eb", fontSize: 13.5, color: NAVY, outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => { e.target.style.borderColor = GREEN; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
                  <button type="submit" style={{ flexShrink: 0, padding: "10px 15px", borderRadius: 11, border: "none", background: `linear-gradient(135deg,${GREEN},#22c55e)`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Plus size={15} /> Add
                  </button>
                </form>
                {weeklyTasks.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {weeklyTasks.map((t) => (
                      <div key={t.id} style={{ display: "flex", gap: 10, alignItems: "center", background: t.done ? "#f0faf4" : "#fff", border: `1px solid ${t.done ? "#bbf7d0" : "#eef2f7"}`, borderRadius: 11, padding: "10px 12px" }}>
                        <button onClick={() => toggleWeeklyTask(t.id)} title={t.done ? "Mark incomplete" : "Mark complete"}
                          style={{ width: 21, height: 21, borderRadius: 6, border: `1.5px solid ${t.done ? GREEN : "#cbd5e1"}`, background: t.done ? GREEN : "#fff", display: "grid", placeItems: "center", flexShrink: 0, cursor: "pointer" }}>
                          {t.done && <CheckCircle2 size={14} color="#fff" />}
                        </button>
                        {wtEdit.id === t.id ? (
                          <>
                            <input value={wtEdit.text} autoFocus onChange={(e) => setWtEdit((s) => ({ ...s, text: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && saveWeeklyEdit()}
                              style={{ flex: 1, padding: "7px 10px", borderRadius: 8, border: `1.5px solid ${GREEN}`, fontSize: 13, color: NAVY, outline: "none", minWidth: 0 }} />
                            <button onClick={saveWeeklyEdit} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "7px 11px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>Save</button>
                          </>
                        ) : (
                          <>
                            <span style={{ flex: 1, fontSize: 13, color: t.done ? "#15803d" : "#374151", lineHeight: 1.4, textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                            {!t.done && (
                              <button onClick={() => setWtEdit({ id: t.id, text: t.text })} title="Edit" style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #e5e7eb", background: "var(--page-bg)", color: "#6b7280", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                                <Pencil size={13} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12.5, color: "#9ca3af", lineHeight: 1.5 }}>No tasks yet — add your first one above. Tasks stay for accountability and can't be deleted.</div>
                )}
              </div>
            </ToolCard>

            {/* Chapter-strength report — the live chapter list (add via the card
                above); this is exactly what goes into the weekly parent email. */}
            <ToolCard icon={BarChart3} color="#f59e0b" title="Chapter-strength report" desc="Your weak / medium / strong chapters and weekly coverage — this list is included in the weekly parent email.">
              {chapterLog.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {["weak", "medium", "strong"].map((k) => {
                    const st = STRENGTHS[k];
                    const items = chapterLog.filter((c) => c.strength === k);
                    return (
                      <div key={k}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                          <span style={{ width: 9, height: 9, borderRadius: "50%", background: st.color }} />
                          <span style={{ fontSize: 12.5, fontWeight: 800, color: st.color }}>{st.label}</span>
                          <span style={{ fontSize: 10.5, fontWeight: 800, color: st.color, background: `${st.color}14`, borderRadius: 50, padding: "1px 8px" }}>{items.length}</span>
                        </div>
                        {items.length ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {items.map((c) => (
                              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, background: `${st.color}0d`, border: `1px solid ${st.color}2e`, borderRadius: 11, padding: "9px 11px" }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.topic} <span style={{ color: MUTE, fontWeight: 600 }}>· {shortName(c.subject)}</span></div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}>
                                    <div style={{ flex: 1, height: 6, borderRadius: 4, background: "#eef2f7", overflow: "hidden" }}>
                                      <div style={{ width: `${c.coverage || 0}%`, height: "100%", background: st.color, borderRadius: 4 }} />
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: st.color, width: 34, textAlign: "right" }}>{c.coverage || 0}%</span>
                                  </div>
                                </div>
                                <button onClick={() => removeChapter(c.id)} title="Remove chapter" style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #fee2e2", background: "#fff5f5", color: "#ef4444", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : <div style={{ fontSize: 12, color: "#9ca3af", paddingLeft: 16 }}>None yet.</div>}
                      </div>
                    );
                  })}
                </div>
              ) : <ChartHint text="Add a chapter on the left to build your strength report." />}
            </ToolCard>
          </div>
        </Section>

        {/* ── BACKLOG ── */}
        <Section id="backlog" kicker="Catch up without burning out" title="Backlog Clearing Sprints" tColor="#FF693D"
          sub="A structured catch-up system that clears months of pending chapters — list them, rate your strength, and set a plan date.">
          <div style={{ background: "var(--page-bg)", border: "1px solid rgba(255,105,61,.18)", borderRadius: 20, padding: "24px", boxShadow: "0 20px 46px -28px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#FF693D,#E0421F)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
              <span style={{ width: 46, height: 46, borderRadius: 13, background: "#fff5f1", border: "1px solid #fecfbf", display: "grid", placeItems: "center" }}><Rocket size={22} color="#FF693D" /></span>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", color: INK }}>Your backlog · {backlogDone}/{backlog.length} cleared</div>
                <div style={{ height: 9, borderRadius: 6, background: "#f1f5f9", overflow: "hidden", marginTop: 8, maxWidth: 320 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${backlogPct}%` }} style={{ height: "100%", borderRadius: 6, background: "linear-gradient(90deg,#FF693D,#E0421F)" }} />
                </div>
              </div>
              <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 26, color: "#FF693D" }}>{backlogPct}%</div>
            </div>

            <form onSubmit={addBacklog} style={{ background: "#fff8f4", border: "1px solid #ffe0d4", borderRadius: 14, padding: "16px 18px", marginBottom: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(140px, 100%), 1fr))", gap: 10, alignItems: "flex-end" }}>
              <SelectField label="Subject" value={blForm.subject} onChange={(v) => setBlForm((s) => ({ ...s, subject: v }))} options={subjects} labels={Object.fromEntries(subjects.map((s) => [s, s]))} />
              <TextField label="Topic / chapter" value={blForm.topic} onChange={(v) => setBlForm((s) => ({ ...s, topic: v }))} placeholder="e.g. Rotational Motion" />
              <SelectField label="How strong are you?" value={blForm.strength} onChange={(v) => setBlForm((s) => ({ ...s, strength: v }))} options={["weak", "medium", "strong"]} labels={{ weak: "Weak", medium: "Medium", strong: "Strong" }} />
              <DateField label="Target date" value={blForm.targetDate} onChange={(v) => setBlForm((s) => ({ ...s, targetDate: v }))} />
              <button type="submit" style={{ padding: "12px 16px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#FF693D,#E0421F)", color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, height: 42 }}>
                <Plus size={15} /> Add
              </button>
            </form>

            {backlog.length ? (
              <motion.div style={{ display: "flex", flexDirection: "column", gap: 10 }}
                initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
                <AnimatePresence initial={false}>
                {backlog.map((b) => {
                  const st = STRENGTHS[b.strength] || STRENGTHS.weak;
                  const date = blDate(b);
                  const overdue = !b.done && date && date < todayIso;
                  return (
                    <motion.div key={b.id} layout
                      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                      exit={{ opacity: 0, x: -14, transition: { duration: 0.18 } }}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: b.done ? "#f8fafc" : overdue ? "#fff5f5" : "#fff", border: `1px solid ${overdue ? "#fecaca" : "#eef2f7"}`, borderRadius: 13, padding: "13px 15px", opacity: b.done ? 0.72 : 1 }}>
                      <button onClick={() => toggleBacklog(b.id)} title={b.done ? "Mark as pending" : "Mark cleared"}
                        style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${b.done ? GREEN : "#cbd5e1"}`, background: b.done ? GREEN : "#fff", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                        {b.done && <CheckCircle2 size={16} color="#fff" />}
                      </button>
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: subColor(b.subject), flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 150 }}>
                        <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 14, color: NAVY, textDecoration: b.done ? "line-through" : "none" }}>{b.topic}</div>
                        <div style={{ fontSize: 12, color: MUTE }}>{shortName(b.subject)}</div>
                      </div>
                      <span style={{ background: `${st.color}14`, border: `1px solid ${st.color}40`, color: st.color, borderRadius: 50, padding: "4px 11px", fontSize: 11.5, fontWeight: 800 }}>{st.label}</span>
                      {date && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: overdue ? "#dc2626" : "#6b7280", fontWeight: overdue ? 800 : 600 }}>
                          <CalendarDays size={13} /> {overdue ? "Overdue · " : "Target "}{fmtDay(date)}
                        </span>
                      )}
                      <button onClick={() => removeBacklog(b.id)} title="Remove" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #fee2e2", background: "var(--page-bg)", color: "#ef4444", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div style={{ textAlign: "center", padding: "26px 0", color: "#9ca3af", fontSize: 13.5 }}>
                <BookOpen size={26} style={{ marginBottom: 8, opacity: .6 }} /><br />No backlog yet — add your pending chapters above.
              </div>
            )}
          </div>
        </Section>

        {/* ── CBT TEST SERIES ── */}
        <Section id="test-series" kicker="Daily · Weekly · Full tests" title="CBT Test Series" tColor="#0ea5a4"
          sub="Attempt your mentor's uploaded tests in NTA-style CBT mode. They're auto-graded against the answer key the moment you submit, and your score flows into the performance stats below.">
          <TestSeries plan={selectedPlan || urlPlan || undefined} />
        </Section>

        {/* ── BATCH COMMUNITY ── */}
        <Section id="community" kicker="Your batch, in one room" title="Batch Community" tColor="#FF693D"
          sub="Meet your batchmates and post doubts with photos & videos — peers and mentors reply, and the best ones get highlighted.">
          <Community plan={selectedPlan || urlPlan || undefined} onSwitchBatch={switchBatch} />
        </Section>

        {/* ── DAILY & WEEKLY REPORTS ── */}
        <Section id="parent-report" kicker="Parents stay in the loop" title="Daily & Weekly Reports" tColor={GREEN}
          sub="A weekly report is auto-emailed to your parent every Sunday and a daily report every day — automatically, whether or not you log anything. You can also send either one now if you want an update in between.">

          {/* ── WEEKLY PROGRESS BOOKLET ── */}
          <ProgressBooklet
            title="Weekly Progress Booklet"
            subtitle="A clear, jargon-free summary of your child's week — effort, tests, improvement and what's next."
            studentName={user?.name || "Student"}
            studentSub={`${planExam} · CollegeParichay Mentorship`}
            heroPoints={["Study hours, streak & routine", "Test scores & predicted rank", "Weak / medium / strong chapters", "Weekly task progress"]}
            heroNote="Auto-emailed to your parent every Sunday — and any time you press send. No jargon, just this week's real progress."
            rows={[
              { icon: Clock, color: ORANGE, label: "Study hours", sub: `${round1(weekHours - prevWeekHours) >= 0 ? "+" : ""}${round1(weekHours - prevWeekHours)}h vs last week`, value: `${round1(weekHours)} h` },
              { icon: Flame, color: "#ef4444", label: "Day streak", sub: `Active ${last7.filter((e) => Number(e.hours) > 0).length} of 7 days`, value: `${streak} day${streak === 1 ? "" : "s"}` },
              { icon: Target, color: "#FF693D", label: "Routine kept", sub: "Followed the plan", value: `${routinePct}%` },
              { icon: CheckCircle2, color: "#0891b2", label: "Tasks (latest day)", sub: "Done vs planned", value: tasksLabel },
              { icon: ListChecks, color: "#14b8a6", label: "Weekly tasks done", sub: `${weeklyTasks.length ? Math.round((weeklyDone / weeklyTasks.length) * 100) : 0}% complete`, value: `${weeklyDone} / ${weeklyTasks.length}` },
              { icon: LineIcon, color: "#6366f1", label: "Latest test", sub: latest ? "Most recent result" : "None logged yet", value: latest ? `${latest.scored}/${latest.total} (${pct(latest)}%)` : "—" },
              { icon: improvement != null && improvement < 0 ? TrendingDown : TrendingUp, color: improvement != null && improvement < 0 ? "#ef4444" : "#22c55e", label: "Change vs last test", sub: latest && prev ? `${prev.name} → ${latest.name}` : "Add another test", value: improvement == null ? "—" : `${improvement >= 0 ? "+" : ""}${improvement}%` },
              ...(rankEnabled && latestRankTest?.rank?.ranked ? [{
                icon: Trophy, color: "#E0421F", label: "Predicted rank",
                sub: `${latestRankTest.name} · included in report`,
                value: latestRankTest.rank.advanced
                  ? `CRL ${inr(latestRankTest.rank.crlLo ?? latestRankTest.rank.low)}–${inr(latestRankTest.rank.crlHi ?? latestRankTest.rank.high)}`
                  : `CRL ${inr(latestRankTest.rank.crl)}`,
              }] : []),
              { icon: Rocket, color: "#FF693D", label: "Backlog cleared", sub: "Chapters done", value: `${backlogDone} / ${backlog.length}` },
            ]}
            remark={insights[0]?.text || "Log your daily hours and tests through the week — this booklet fills in automatically and is emailed to your parent every Sunday."}
            remarkTitle="This week's highlight"
            footer={<SendControls color={GREEN} state={weeklyState} onSend={() => sendReport("weekly")} sendLabel="Send weekly report now"
              autoLocked autoLabel="Auto-emailed every Sunday" parentEmail={parentEmail} />}
          />
          <p style={{ fontSize: 12, color: MUTE, margin: "-6px 0 18px", textAlign: "center" }}>
            Includes your <strong style={{ color: NAVY }}>weak / medium / strong chapter list</strong> (shown below) — auto-emailed every <strong style={{ color: NAVY }}>Sunday</strong>.
          </p>

          {/* ── BACKLOG ALERT strip — auto-emails the parent when chapters fall behind ── */}
          <div style={{ background: overdueBacklog.length || studyIrregular ? "#fff7ed" : "#fff", border: `1px solid ${overdueBacklog.length || studyIrregular ? "#fdba74" : "#fde68a"}`, borderRadius: 20, padding: "22px 24px", boxShadow: "0 20px 46px -30px rgba(234,88,12,.6)", position: "relative", overflow: "hidden", marginBottom: 18 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#f59e0b,#ef4444)" }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <span style={{ width: 46, height: 46, borderRadius: 13, background: "#ffedd5", display: "grid", placeItems: "center", flexShrink: 0 }}><AlertCircle size={22} color="#E0421F" /></span>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.1rem", color: INK, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  Backlog alert to parent
                  {overdueBacklog.length > 0 && <span style={{ fontSize: 11, fontWeight: 800, color: "#b91c1c", background: "#fee2e2", borderRadius: 50, padding: "3px 10px" }}>{overdueBacklog.length} overdue</span>}
                </div>
                <p style={{ color: MUTE, fontSize: 13.5, lineHeight: 1.6, margin: "4px 0 14px" }}>
                  If chapters pass their <strong style={{ color: NAVY }}>target date</strong> unfinished or study turns irregular (low streak / routine), your parent is automatically emailed that the backlog isn't being cleared — so they can step in early.{" "}
                  {overdueBacklog.length || studyIrregular
                    ? <strong style={{ color: "#c2410c" }}>Currently flagged: {overdueBacklog.length ? `${overdueBacklog.length} overdue chapter${overdueBacklog.length === 1 ? "" : "s"}` : "irregular study"}.</strong>
                    : <span style={{ color: "#15803d", fontWeight: 700 }}>All on track right now — nothing to flag.</span>}
                </p>
                <SendControls color="#E0421F" state={alertState} onSend={() => sendReport("backlog")} sendLabel="Send backlog alert now"
                  auto={reportPrefs.autoBacklogAlert} onToggle={() => setReportPrefs((p) => ({ ...p, autoBacklogAlert: !p.autoBacklogAlert }))}
                  autoLabel="Auto-alert when behind" parentEmail={parentEmail} />
              </div>
            </div>
          </div>

          {/* ── DAILY PROGRESS BOOKLET ── */}
          {todayEntry ? (
            <ProgressBooklet
              title="Daily Progress Booklet"
              subtitle="Today's effort at a glance — hours, tasks, routine and any test, auto-built from the daily log."
              studentName={user?.name || "Student"}
              studentSub={`${fmtFull(new Date())} · CollegeParichay Mentorship`}
              heroPoints={["Hours studied per subject", "Tasks completed & routine", "Any test taken today", "Predicted rank (if tested)"]}
              heroNote="Auto-emailed to your parent every day — a quick daily snapshot so they always know how today went."
              rows={[
                { icon: Clock, color: ORANGE, label: "Study hours today", sub: `${subjects.length} subjects logged`, value: `${todayEntry.hours} h` },
                { icon: CheckCircle2, color: "#14b8a6", label: "Tasks completed", sub: todayEntry.routine ? "Routine followed" : "Routine missed", value: `${todayEntry.tasksDone} / ${todayEntry.tasksTotal}` },
                { icon: Target, color: todayEntry.routine ? "#22c55e" : "#ef4444", label: "Routine kept", sub: "Planned vs done", value: todayEntry.routine ? "Followed" : "Missed" },
                ...(todayTest ? [{ icon: LineIcon, color: "#6366f1", label: "Test today", sub: todayTest.name, value: `${todayTest.scored}/${todayTest.total}` }] : []),
                ...(rankEnabled && latestRankTest?.rank?.ranked ? [{
                  icon: Trophy, color: "#E0421F", label: "Predicted rank",
                  sub: `${latestRankTest.name} · included in report`,
                  value: latestRankTest.rank.advanced
                    ? `CRL ${inr(latestRankTest.rank.crlLo ?? latestRankTest.rank.low)}–${inr(latestRankTest.rank.crlHi ?? latestRankTest.rank.high)}`
                    : `CRL ${inr(latestRankTest.rank.crl)}`,
                }] : []),
              ]}
              extra={
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {subjects.map((s) => (
                    <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--page-bg)", border: `1px solid ${subColor(s)}33`, borderRadius: 9, padding: "5px 10px", fontSize: 12, fontWeight: 700, color: NAVY }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: subColor(s) }} /> {shortName(s)}: {subVal(todayEntry, s).h}h · {subVal(todayEntry, s).t}✓
                    </span>
                  ))}
                </div>
              }
              footer={<SendControls color="#0891b2" state={dailyState} onSend={() => sendReport("daily")} sendLabel="Send today's report"
                autoLocked autoLabel="Auto-emailed every day" parentEmail={parentEmail} />}
            />
          ) : (
            <div style={{ background: "var(--page-bg)", border: "1px solid rgba(8,145,178,.22)", borderRadius: 20, padding: "22px", boxShadow: "0 18px 44px -30px rgba(26,26,46,.4)", marginBottom: 18 }}>
              <div style={{ textAlign: "center", padding: "18px 0", color: "#9ca3af", fontSize: 13 }}>
                <CalendarDays size={24} style={{ marginBottom: 6, opacity: .6 }} /><br />Nothing logged yet today — your parent still gets today's report (shown as 0h) automatically. Fill today's log to make it count.
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
                <SendControls color="#0891b2" state={dailyState} onSend={() => sendReport("daily")} sendLabel="Send today's report"
                  autoLocked autoLabel="Auto-emailed every day" parentEmail={parentEmail} />
              </div>
            </div>
          )}

        </Section>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .md-feature-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .md-hero-line { display: none !important; }
        }
        @media (max-width: 900px) {
          .md-booklet { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 760px) {
          .md-feature-grid { grid-template-columns: 1fr !important; }
          .md-track-grid { grid-template-columns: 1fr !important; }
          .md-tools-grid { grid-template-columns: 1fr !important; }
        }
        .md-sticky-nav { scrollbar-width: none; -ms-overflow-style: none; }
        .md-sticky-nav::-webkit-scrollbar { display: none; }
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </section>
  );
}

/* ── building blocks ─────────────────────────────────────────────── */
function Section({ id, kicker, title, sub, tColor = ORANGE, children }) {
  return (
    <section id={id} style={{ scrollMarginTop: 140, paddingTop: 44 }}>
      <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 26px" }}>
        <span style={{ display: "inline-block", fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: tColor, marginBottom: 10 }}>{kicker}</span>
        <h2 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.5rem,3.4vw,2.1rem)", color: INK, margin: 0, letterSpacing: "-0.5px" }}>{title}</h2>
        {sub && <p style={{ color: MUTE, fontSize: 14.5, lineHeight: 1.6, marginTop: 12 }}>{sub}</p>}
      </div>
      {children}
    </section>
  );
}

/* Parent-facing "Progress Booklet" — orange hero panel + a clean stat readout.
   Used for both the weekly and daily reports (same look, different data). */
function ProgressBooklet({ title, subtitle, studentName, studentSub, rows, extra, remark, remarkTitle = "Highlight", heroPoints, heroNote, footer }) {
  const dark = "#E0421F";
  return (
    <div className="md-booklet" style={{ display: "grid", gridTemplateColumns: "minmax(0,0.92fr) minmax(0,1.08fr)", borderRadius: 22, overflow: "hidden", border: "1px solid #f0e9e0", boxShadow: "0 24px 54px -34px rgba(26,26,46,.5)", background: "var(--page-bg)", marginBottom: 18 }}>
      {/* LEFT — hero */}
      <div style={{ position: "relative", padding: "28px 28px 26px", color: "#fff", background: `linear-gradient(155deg, ${ORANGE} 0%, ${dark} 100%)`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize: "26px 26px", opacity: .55, pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, letterSpacing: ".08em", background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.3)", borderRadius: 50, padding: "5px 12px" }}>
            <BookOpen size={12} /> PARENT REPORT
          </span>
          <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.7rem", lineHeight: 1.15, margin: "16px 0 10px", letterSpacing: "-.5px" }}>{title}</h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,.9)", margin: 0, maxWidth: 320 }}>{subtitle}</p>
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.25)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.72)", textTransform: "uppercase", letterSpacing: ".06em" }}>Student</div>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", marginTop: 4 }}>{studentName}</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.82)", marginTop: 3 }}>{studentSub}</div>
          </div>
        </div>
        {/* fills the lower half of the hero so it doesn't read as empty */}
        {heroPoints?.length > 0 && (
          <div style={{ position: "relative", marginTop: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.72)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>What's inside</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {heroPoints.map((p) => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "rgba(255,255,255,.95)", fontWeight: 600 }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,.22)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <CheckCircle2 size={12} color="#fff" />
                  </span>
                  {p}
                </div>
              ))}
            </div>
          </div>
        )}
        {heroNote && (
          <div style={{ position: "relative", marginTop: "auto", paddingTop: 20 }}>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,.82)", margin: 0 }}>{heroNote}</p>
          </div>
        )}
      </div>
      {/* RIGHT — stats */}
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column" }}>
        {rows.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 0", borderBottom: i < rows.length - 1 ? "1px solid #f1f5f9" : "none" }}>
              <span style={{ width: 38, height: 38, borderRadius: 11, background: `${r.color}14`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon size={18} color={r.color} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 14, color: INK }}>{r.label}</div>
                {r.sub && <div style={{ fontSize: 12, color: MUTE, marginTop: 1 }}>{r.sub}</div>}
              </div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", color: r.valueColor || r.color, flexShrink: 0, whiteSpace: "nowrap" }}>{r.value}</div>
            </div>
          );
        })}
        {extra && <div style={{ marginTop: 12 }}>{extra}</div>}
        {remark && (
          <div style={{ marginTop: 14, background: "#fff7f3", border: `1px solid ${ORANGE}26`, borderRadius: 14, padding: "13px 15px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 800, color: dark, marginBottom: 5 }}>
              <Sparkles size={13} /> {remarkTitle}
            </div>
            <div style={{ fontSize: 13, color: "#7c2d12", lineHeight: 1.55 }}>{remark}</div>
          </div>
        )}
        {footer && <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>{footer}</div>}
      </div>
    </div>
  );
}

function ChartCard({ title, hint, accent = ORANGE, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: "var(--page-bg)", border: `1px solid ${accent}28`, borderRadius: 18, padding: "20px 20px 16px", boxShadow: "0 16px 40px -28px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${accent},${GOLD})` }} />
      <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1rem", color: INK, margin: "0 0 2px" }}>{title}</h3>
      {hint && <p style={{ fontSize: 12.5, color: MUTE, margin: "0 0 12px" }}>{hint}</p>}
      {children}
    </motion.div>
  );
}

function ToolCard({ icon: Icon, color, title, desc, children }) {
  return (
    <div style={{ background: "var(--page-bg)", border: `1px solid ${color}28`, borderRadius: 18, padding: "20px", boxShadow: "0 16px 40px -28px rgba(26,26,46,.4)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 4 }}>
        <span style={{ width: 38, height: 38, borderRadius: 11, background: `${color}14`, border: `1px solid ${color}30`, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={18} color={color} /></span>
        <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1rem", color: INK, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ fontSize: 12.5, color: MUTE, margin: "4px 0 14px", lineHeight: 1.5 }}>{desc}</p>
      <div style={{ marginTop: "auto" }}>{children}</div>
    </div>
  );
}

const rankTileVar = { hidden: { opacity: 0, y: 12, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 } };

function RankCard({ r, name }) {
  const accent = "#E0421F";
  if (!r.ranked) {
    return (
      <div style={{ marginTop: 16, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 14, padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <Trophy size={16} color="#c2410c" />
          <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, color: INK }}>{name} · {r.total} marks</span>
        </div>
        <div style={{ fontSize: 13, color: "#9a3412", lineHeight: 1.5 }}>
          Below the qualifying cutoff{r.cutoffNeeded ? ` (need ~${r.cutoffNeeded} aggregate)` : ""}. Focus on clearing each subject's minimum first.
        </div>
      </div>
    );
  }
  const rng = (lo, hi) => `${inr(lo)} – ${inr(hi)}`;
  return (
    <div style={{ marginTop: 16, background: "linear-gradient(135deg,#fff5f1,#fff)", border: `1px solid ${accent}33`, borderRadius: 14, padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: (r.projected || (r.advanced && r.paper1 != null)) ? 4 : 10, flexWrap: "wrap" }}>
        <Trophy size={17} color={accent} />
        <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: INK }}>
          Predicted {r.advanced ? "JEE Advanced" : "JEE Main"} 2026 rank · {r.total}{r.examMax ? `/${r.examMax}` : ""} marks
        </span>
        {r.paper && (
          <span style={{ fontSize: 10.5, fontWeight: 800, color: accent, background: `${accent}14`, borderRadius: 50, padding: "2px 8px" }}>Paper {r.paper}</span>
        )}
      </div>
      {r.advanced && r.paper1 != null && (
        <div style={{ fontSize: 11, color: MUTE, lineHeight: 1.5, marginBottom: 10 }}>
          Both papers combined — Paper 1: {r.paper1}/{ADV_PAPER_TOTAL} · Paper 2: {r.paper2}/{ADV_PAPER_TOTAL}{r.questions ? ` · ${r.questions} questions` : ""} · 6-hour exam (3h + 3h).
        </div>
      )}
      {r.projected && (
        <div style={{ fontSize: 11, color: MUTE, lineHeight: 1.5, marginBottom: 10 }}>
          Projected full-test rank from Paper {r.paper} ({r.paperMarks}/{ADV_PAPER_TOTAL}) — assumes a similar Paper {r.paper === 1 ? 2 : 1}. Log both papers for a sharper estimate.
        </div>
      )}
      <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(110px, 100%), 1fr))", gap: 10, marginBottom: 10 }}
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
        <motion.div variants={rankTileVar} style={{ background: "var(--page-bg)", border: `1px solid ${accent}22`, borderRadius: 11, padding: "11px 12px" }}>
          <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 17, color: accent }}>{r.advanced ? rng(r.crlLo ?? r.low, r.crlHi ?? r.high) : inr(r.crl)}</div>
          <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{r.advanced ? "CRL range" : "All-India CRL"}</div>
        </motion.div>
        {!r.isGeneral && r.categoryRank && (
          <motion.div variants={rankTileVar} style={{ background: "var(--page-bg)", border: `1px solid ${accent}22`, borderRadius: 11, padding: "11px 12px" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 17, color: accent }}>{inr(r.categoryRank)}</div>
            <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{r.category} rank</div>
          </motion.div>
        )}
        {r.percentile != null && !r.advanced && (
          <motion.div variants={rankTileVar} style={{ background: "var(--page-bg)", border: `1px solid ${accent}22`, borderRadius: 11, padding: "11px 12px" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 17, color: accent }}>{r.percentile}</div>
            <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>percentile</div>
          </motion.div>
        )}
        {!r.advanced && (
          <motion.div variants={rankTileVar} style={{ background: "var(--page-bg)", border: `1px solid ${accent}22`, borderRadius: 11, padding: "11px 12px" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 17, color: accent }}>{rng(r.low, r.high)}</div>
            <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>likely band</div>
          </motion.div>
        )}
      </motion.div>
      {r.advanced && r.branches?.length > 0 && (
        <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.55 }}>
          <strong style={{ color: NAVY }}>Possible:</strong> {r.branches.join(" · ")}
        </div>
      )}
      {r.advice && <div style={{ fontSize: 12, color: MUTE, lineHeight: 1.5, marginTop: 6 }}>{r.advice}</div>}
      <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 8 }}>Estimate only — actual rank depends on the official normalisation & shift difficulty.</div>
    </div>
  );
}

function ChartHint({ text }) {
  return <div style={{ color: "#9ca3af", fontSize: 13, padding: "28px 0", textAlign: "center" }}>{text}</div>;
}

function ToggleSwitch({ on, onClick, color = GREEN }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onClick}
      style={{ width: 40, height: 22, borderRadius: 50, border: "none", cursor: "pointer", background: on ? color : "#cbd5e1", position: "relative", transition: "background .2s", flexShrink: 0, padding: 0 }}>
      <span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "var(--page-bg)", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
    </button>
  );
}

function SendControls({ color, state, onSend, sendLabel, disabled, auto, onToggle, autoLabel, autoLocked, parentEmail }) {
  const off = state.sending || disabled;
  return (
    <div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={onSend} disabled={off}
          style={{ padding: "11px 18px", borderRadius: 12, border: "none", background: off ? `${color}99` : color, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, cursor: off ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: off ? "none" : `0 12px 26px -12px ${color}` }}>
          {state.sending ? <><Loader2 size={16} style={{ animation: "spin .8s linear infinite" }} /> Sending…</> : <><Send size={15} /> {sendLabel}</>}
        </button>
        {autoLocked ? (
          // Auto-send is always on and can't be turned off — just show the cadence.
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: "#16a34a", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 50, padding: "6px 13px" }}>
            <CheckCircle2 size={14} /> {autoLabel}
          </span>
        ) : (
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: NAVY, cursor: "pointer" }}>
            <ToggleSwitch on={auto} onClick={onToggle} color={color} /> {autoLabel}
          </label>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: parentEmail ? "#94a3b8" : "#b45309", marginTop: 8 }}>
        {parentEmail
          ? <>Sends to parent: <strong style={{ color: "#64748b" }}>{parentEmail}</strong></>
          : "Add a parent email at enrolment to receive these reports."}
      </div>
      <AnimatePresence>
        {state.msg.text && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ marginTop: 10, borderRadius: 12, padding: "9px 13px", fontSize: 12.5, fontWeight: 700, background: state.msg.type === "ok" ? "#f0fdf4" : "#fff1f2", border: `1.5px solid ${state.msg.type === "ok" ? "#86efac" : "#fca5a5"}`, color: state.msg.type === "ok" ? "#166534" : "#991b1b" }}>
            {state.msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeltaPill({ d, unit = "", subtext, lowerIsBetter = false }) {
  const good = d === 0 ? null : lowerIsBetter ? d < 0 : d > 0;
  const color = d === 0 ? "#64748b" : good ? "#16a34a" : "#dc2626";
  const Icon = d === 0 ? Minus : d > 0 ? TrendingUp : TrendingDown;
  const word = d === 0 ? "no change" : `${d > 0 ? "+" : ""}${d}${unit}`;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 50, padding: "4px 11px" }}>
      <Icon size={13} color={color} />
      <span style={{ fontSize: 11.5, fontWeight: 800, color }}>{word}</span>
      {subtext && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>· {subtext}</span>}
    </div>
  );
}

function SubjectDualField({ subject, hours, tasks, onHours, onTasks }) {
  const c = subColor(subject);
  const inp = {
    width: "100%", padding: "9px 10px", borderRadius: 9, border: "1.5px solid #e5e7eb",
    fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box",
  };
  return (
    <div style={{ border: `1px solid ${c}26`, borderRadius: 12, padding: "11px 12px", background: "var(--page-bg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12, fontWeight: 800, color: NAVY }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} /> {subject}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af" }}>Hours</span>
          <input value={hours} onChange={(e) => onHours(e.target.value)} placeholder="2" inputMode="decimal" style={inp}
            onFocus={(e) => { e.target.style.borderColor = c; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af" }}>Tasks ✓</span>
          <input value={tasks} onChange={(e) => onTasks(e.target.value)} placeholder="4" inputMode="numeric" style={inp}
            onFocus={(e) => { e.target.style.borderColor = c; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
        </label>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange, placeholder, full }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, flex: full ? "none" : "1 1 110px", minWidth: 0 }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280" }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode="decimal"
        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box" }}
        onFocus={(e) => { e.target.style.borderColor = ORANGE; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
    </label>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280" }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box" }}
        onFocus={(e) => { e.target.style.borderColor = ORANGE; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
    </label>
  );
}

function SelectField({ label, value, onChange, options, labels, placeholders }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280" }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box", background: "var(--page-bg)", cursor: "pointer" }}
        onFocus={(e) => { e.target.style.borderColor = ORANGE; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}>
        {options.map((o) => (
          <option key={o} value={o}>{(placeholders && placeholders[o]) || (labels && labels[o]) || o}</option>
        ))}
      </select>
    </label>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280" }}>{label}</span>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box" }}
        onFocus={(e) => { e.target.style.borderColor = ORANGE; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
    </label>
  );
}
