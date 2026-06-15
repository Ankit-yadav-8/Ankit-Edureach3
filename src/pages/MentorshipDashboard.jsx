import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, GraduationCap, LineChart as LineIcon, Mail, Activity,
  Flame, Clock, CheckCircle2, Target, TrendingUp, TrendingDown, Plus, Sparkles,
  ShieldCheck, ArrowRight, Users, BarChart3, Rocket, Zap, Crosshair, Timer,
  ListChecks, Lock, Loader2, RotateCw, Pencil, Trash2, CalendarDays, Brain,
  BookOpen, Minus, Trophy, Send, Lightbulb, Hourglass,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiMyEnrollments, apiSendOtp, apiVerifyOtp, apiSendParentReport } from "../auth/api.js";
import { Trend, Gauge, PieWithLegend, Bars } from "../components/Charts.jsx";
import { predictRank, maxPerSubject, maxTotal } from "../utils/rankPredictor.js";

const ORANGE = "#F47B20";
const GOLD = "#f5a623";
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

const isoDay = (d) => new Date(d).toISOString().slice(0, 10);
const fmtDay = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
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
  Maths: "#F47B20",
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

/* ── demo seed (used until the student logs their own data) ───────── */
function seedSubjects(total, subjects) {
  const perH = round1(total / subjects.length);
  const m = {};
  subjects.forEach((s, j) => {
    const h = j === subjects.length - 1 ? round1(total - perH * (subjects.length - 1)) : perH;
    m[s] = { h, t: Math.max(0, Math.round(h * 2)) };
  });
  return m;
}
function seedTracking(subjects) {
  const today = new Date();
  const hrs = [4.5, 6, 5, 7, 6, 8, 2.5];
  return hrs.map((h, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (6 - i));
    const subs = seedSubjects(h, subjects);
    const tasksDone = subjects.reduce((s, k) => s + subs[k].t, 0);
    return { date: isoDay(d), hours: h, subjects: subs, tasksDone, tasksTotal: Math.round(tasksDone * 1.15), routine: i % 4 !== 0 };
  });
}
function seedTests() {
  const today = new Date();
  const mk = (n, back, total, scored, correct, wrong, skipped, silly, sillyTopic, overspent, weak) => {
    const d = new Date(today); d.setDate(today.getDate() - back);
    return { id: `${n}-${back}`, name: n, type: "mock", date: isoDay(d), total, scored, correct, wrong, skipped, silly, sillyTopic, overspent, weak };
  };
  return [
    mk("Mock 1", 21, 300, 126, 48, 22, 20, 8, "Units & Dimensions", "Physics", ["Rotational Motion", "Thermodynamics"]),
    mk("Mock 2", 14, 300, 150, 56, 18, 16, 6, "Mole Concept",       "Maths",   ["p-Block", "Probability"]),
    mk("Mock 3", 7,  300, 178, 64, 14, 12, 3, "Sign errors",        "Physics", ["Rotational Motion", "p-Block"]),
  ];
}
function seedBacklog() {
  const today = new Date();
  const plus = (days) => { const d = new Date(today); d.setDate(d.getDate() + days); return isoDay(d); };
  return [
    { id: "b1", subject: "Physics",            topic: "Rotational Motion", strength: "weak",   planDate: plus(5), week: "Week 1", done: false },
    { id: "b2", subject: "Organic Chemistry",  topic: "Aldehydes & Ketones", strength: "medium", planDate: plus(9), week: "Week 2", done: false },
    { id: "b3", subject: "Maths",              topic: "Probability",       strength: "weak",   planDate: plus(3), week: "Week 1", done: true  },
    { id: "b4", subject: "Inorganic Chemistry", topic: "Coordination Compounds", strength: "strong", planDate: plus(12), week: "Week 3", done: false },
  ];
}

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

  return <DashboardBody />;
}

/* ════════════════════════════════════════════════════════════════
   OTP SECURITY GATE
   ════════════════════════════════════════════════════════════════ */
function OtpGate({ email, name, onVerified }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("intro"); // intro | code
  const [code, setCode] = useState("");
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

  return (
    <section style={{ background: "#f8f7f5", minHeight: "100vh", display: "grid", placeItems: "center", padding: "120px 16px 60px" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 24, border: "1px solid rgba(244,123,32,.18)", padding: "34px 30px", boxShadow: "0 30px 70px -40px rgba(13,27,62,.5)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${ORANGE},${GREEN})` }} />

        <div style={{ width: 62, height: 62, borderRadius: 18, background: `linear-gradient(135deg,${ORANGE}1a,${GREEN}1a)`, border: `1px solid ${ORANGE}33`, display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
          <Lock size={28} color={ORANGE} />
        </div>
        <h2 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: "1.45rem", margin: 0, textAlign: "center", letterSpacing: "-0.4px" }}>
          Verify it's you
        </h2>
        <p style={{ color: MUTE, fontSize: 14, lineHeight: 1.6, textAlign: "center", margin: "10px 0 22px" }}>
          Your mentorship dashboard is private. {step === "intro"
            ? <>We'll email a 6-digit code to <strong style={{ color: NAVY }}>{masked}</strong> to confirm it's really you.</>
            : <>Enter the 6-digit code we sent to <strong style={{ color: NAVY }}>{masked}</strong>.</>}
        </p>

        {step === "intro" ? (
          <button onClick={send} disabled={busy}
            style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: busy ? `${ORANGE}99` : `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 15, cursor: busy ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: `0 12px 26px -10px ${ORANGE}` }}>
            {busy ? <><Loader2 size={18} style={{ animation: "spin .8s linear infinite" }} /> Sending code…</> : <><Mail size={18} /> Send code to my email</>}
          </button>
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
function DashboardBody() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const emailKey = (user?.email || "guest").toLowerCase();
  const TRACK_KEY = `mdash:tracking:${emailKey}`;
  const TEST_KEY = `mdash:tests:${emailKey}`;
  const BACKLOG_KEY = `mdash:backlog:${emailKey}`;
  const FIX_KEY = `mdash:fixdone:${emailKey}`;
  const WTASK_KEY = `mdash:weeklytasks:${emailKey}`;

  const [planLabel, setPlanLabel] = useState("Mentorship Program");
  const [planExam, setPlanExam] = useState("JEE / NEET");
  const subjects = useMemo(() => subjectsFor(planExam), [planExam]);
  const isFoundation = /foundation/i.test(planExam);
  const isNEET = /neet/i.test(planExam) && !/jee/i.test(planExam);
  const rankEnabled = /jee/i.test(planExam) && !isFoundation;

  const [entries, setEntries] = useState(() => load(TRACK_KEY, null) || seedTracking(subjectsFor("JEE / NEET")));
  const [tests, setTests] = useState(() => load(TEST_KEY, null) || seedTests());
  const [backlog, setBacklog] = useState(() => load(BACKLOG_KEY, null) || seedBacklog());
  const [fixDone, setFixDone] = useState(() => load(FIX_KEY, {}));
  const [weeklyTasks, setWeeklyTasks] = useState(() => load(WTASK_KEY, []));

  const todayIso = isoDay(new Date());
  const todayEntry = entries.find((e) => e.date === todayIso);

  const [editingLog, setEditingLog] = useState(false);
  const [logForm, setLogForm] = useState({ subjects: {}, tasksTotal: "", routine: true });
  const [testForm, setTestForm] = useState({ name: "", type: "mock", total: "300", scored: "", correct: "", wrong: "", skipped: "", silly: "", sillyTopic: "", overspent: "", weak: "", mp: "", mc: "", mm: "", category: "General" });
  const [blForm, setBlForm] = useState({ subject: "", topic: "", strength: "weak", planDate: "", week: "" });
  const [wtInput, setWtInput] = useState("");
  const [wtEdit, setWtEdit] = useState({ id: null, text: "" });
  const [parentState, setParentState] = useState({ sending: false, msg: { type: "", text: "" } });

  // Pull the real mentorship plan name (best-effort).
  useEffect(() => {
    if (!token) return;
    let alive = true;
    apiMyEnrollments(token)
      .then((d) => {
        if (!alive) return;
        const m = (d.enrollments || []).find((e) => String(e.plan).startsWith("mentor-"));
        if (m) {
          setPlanLabel(m.planLabel || m.plan);
          setPlanExam(m.targetExam || (String(m.plan).includes("neet") ? "NEET" : String(m.plan).includes("foundation") ? "Foundation" : "JEE"));
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [token]);

  useEffect(() => { save(TRACK_KEY, entries); }, [TRACK_KEY, entries]);
  useEffect(() => { save(TEST_KEY, tests); }, [TEST_KEY, tests]);
  useEffect(() => { save(BACKLOG_KEY, backlog); }, [BACKLOG_KEY, backlog]);
  useEffect(() => { save(FIX_KEY, fixDone); }, [FIX_KEY, fixDone]);
  useEffect(() => { save(WTASK_KEY, weeklyTasks); }, [WTASK_KEY, weeklyTasks]);

  /* ── derived tracking metrics ── */
  const sorted = useMemo(() => [...entries].sort((a, b) => a.date.localeCompare(b.date)), [entries]);
  const last7 = sorted.slice(-7);
  const prevWeek = sorted.slice(-14, -7);
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
  const sillyTrend = testsSorted.map((t, i) => ({ name: t.name || `T${i + 1}`, silly: Number(t.silly || 0) }));
  const avgSkipped = testsSorted.length ? Math.round(testsSorted.reduce((s, t) => s + Number(t.skipped || 0), 0) / testsSorted.length) : 0;
  const latestBreakdown = latest
    ? [
        { name: "Correct", value: Number(latest.correct) },
        { name: "Wrong", value: Number(latest.wrong) },
        { name: "Skipped", value: Number(latest.skipped) },
      ]
    : [];
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
  const timeRanked = useMemo(() => {
    const freq = {};
    testsSorted.forEach((t) => { if (t.overspent) freq[t.overspent] = (freq[t.overspent] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  }, [testsSorted]);
  const timeBars = timeRanked.map(([s, n]) => ({ name: shortName(s), over: n }));
  /* suggested pacing for next paper */
  const pacing = useMemo(() => {
    if (isFoundation) return [{ s: "Maths", min: 90 }, { s: "Science", min: 90 }];
    if (isNEET) return [{ s: "Physics", min: 45 }, { s: "Chemistry", min: 45 }, { s: "Biology", min: 90 }];
    return [{ s: "Physics", min: 60 }, { s: "Chemistry", min: 60 }, { s: "Maths", min: 60 }];
  }, [isFoundation, isNEET]);

  /* ── auto weekly fix-list ── */
  const wk = weekKey();
  const fixList = useMemo(() => {
    const list = [];
    if (weakRanked[0]) list.push(`Re-do ${weakRanked[0][0]} PYQs (2 hrs) — your most recurring weak chapter`);
    if (latest && Number(latest.silly) > 0) list.push(`Kill silly mistakes — re-attempt last test's ${latest.silly} silly errors slowly & carefully`);
    if (weakRanked[1]) list.push(`Revise ${weakRanked[1][0]} formula sheet daily`);
    if (lowestSubject && thisWkH[lowestSubject] < WEEK_TARGET_HRS / subjects.length) list.push(`Give ${shortName(lowestSubject)} an extra 1 hr/day — it's your least-studied subject this week`);
    if (timeRanked[0]) list.push(`Time-box ${shortName(timeRanked[0][0])} in the next paper — you keep over-spending there`);
    if (weakRanked[2]) list.push(`10 timed ${weakRanked[2][0]} questions before the next test`);
    return list.slice(0, 5);
  }, [weakRanked, latest, lowestSubject, timeRanked, thisWkH, subjects.length]);
  const fixDoneSet = fixDone[wk] || [];
  const toggleFix = (label) => setFixDone((prev) => {
    const cur = new Set(prev[wk] || []);
    cur.has(label) ? cur.delete(label) : cur.add(label);
    return { ...prev, [wk]: [...cur] };
  });

  /* ── chapters by strength (for parent report) ── */
  const chaptersByStrength = useMemo(() => ({
    weak: backlog.filter((b) => b.strength === "weak").map((b) => `${b.topic} (${shortName(b.subject)})`),
    medium: backlog.filter((b) => b.strength === "medium").map((b) => `${b.topic} (${shortName(b.subject)})`),
    strong: backlog.filter((b) => b.strength === "strong").map((b) => `${b.topic} (${shortName(b.subject)})`),
  }), [backlog]);

  /* ── AI insights (rule-based) ── */
  const insights = useMemo(() => {
    const out = [];
    if (latest && prev) {
      const dS = Number(latest.scored) - Number(prev.scored);
      out.push({ tone: dS >= 0 ? "up" : "down", text: dS >= 0
        ? `Score up ${dS} marks (${improvement >= 0 ? "+" : ""}${improvement}%) — ${latest.name} beat ${prev.name}. Momentum is building.`
        : `Score dropped ${Math.abs(dS)} marks (${improvement}%) vs ${prev.name}. Flag the weak chapters below with your mentor this week.` });
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
    if (weakRanked[0]) out.push({ tone: "down", text: `${weakRanked[0][0]} is your #1 recurring weak area (${weakRanked[0][1]}× flagged). It's in this week's fix-list.` });
    if (lowestSubject) out.push({ tone: "flat", text: `${shortName(lowestSubject)} got the least time this week (${round1(thisWkH[lowestSubject])}h). Balance it before the next test.` });
    return out;
  }, [latest, prev, improvement, weekHours, prevWeekHours, weakRanked, lowestSubject, thisWkH]);

  /* ── strategies (fills the white space under the test form) ── */
  const strategies = useMemo(() => {
    const out = [];
    if (lowestSubject) out.push({ icon: Target, color: subColor(lowestSubject), text: `Balance your effort: add ~1 hr/day to ${shortName(lowestSubject)} — it's your least-studied subject this week.` });
    if (weakRanked[0]) out.push({ icon: Zap, color: "#8b5cf6", text: `Attack ${weakRanked[0][0]} first — your most recurring weak chapter. Aim for 30 PYQs this week.` });
    if (latest && Number(latest.silly) >= 3) out.push({ icon: Crosshair, color: "#ef4444", text: `Reserve the last 10 min of every paper to recheck — you lost ~${latest.silly} marks to silly errors.` });
    if (latest && acc(latest) < 80) out.push({ icon: ShieldCheck, color: "#0891b2", text: `Accuracy is ${acc(latest)}% — skip low-confidence questions to dodge negative marking.` });
    out.push({ icon: RotateCw, color: GREEN, text: "Revise within 24 hrs, then again at 7 days — spaced revision beats re-reading." });
    out.push({ icon: Hourglass, color: ORANGE, text: "Sit one full-length timed paper every week to build exam-day stamina & pacing." });
    return out.slice(0, 5);
  }, [lowestSubject, weakRanked, latest, thisWkH]);

  /* ── actions ── */
  function startEditLog() {
    setLogForm({
      subjects: Object.fromEntries(subjects.map((s) => [s, { h: subVal(todayEntry, s).h || "", t: subVal(todayEntry, s).t || "" }])),
      tasksTotal: todayEntry?.tasksTotal ?? "",
      routine: todayEntry?.routine ?? true,
    });
    setEditingLog(true);
  }
  function addLog(e) {
    e.preventDefault();
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
    };
    setEntries((prevE) => [...prevE.filter((x) => x.date !== todayIso), entry]);
    setLogForm({ subjects: {}, tasksTotal: "", routine: true });
    setEditingLog(false);
  }

  function addTest(e) {
    e.preventDefault();
    const isRankTest = rankEnabled && (testForm.type === "main" || testForm.type === "adv");
    let total, scored, rank = null;
    if (isRankTest) {
      const advanced = testForm.type === "adv";
      const p = Number(testForm.mp) || 0, c = Number(testForm.mc) || 0, m = Number(testForm.mm) || 0;
      total = p + c + m; scored = total;
      const r = predictRank({ physics: p, chemistry: c, maths: m, category: testForm.category, advanced });
      rank = {
        type: testForm.type, advanced, category: testForm.category, total,
        ranked: r.ranked, crl: r.crl, crlLo: r.crlLo ?? null, crlHi: r.crlHi ?? null,
        rank: r.rank, low: r.low, high: r.high,
        percentile: r.percentile, categoryRank: r.categoryRank, isGeneral: r.isGeneral,
        branches: (r.branches || []).slice(0, 3), advice: r.advice || "",
        cutoffNeeded: r.cutoffNeeded ?? null,
      };
    } else {
      total = Number(testForm.total) || 0;
      scored = Number(testForm.scored);
      if (!Number.isFinite(scored)) return;
    }
    if (!testForm.name.trim()) return;
    const t = {
      id: `${Date.now()}`, name: testForm.name.trim(), type: testForm.type, date: todayIso, total, scored,
      correct: Number(testForm.correct) || 0,
      wrong: Number(testForm.wrong) || 0,
      skipped: Number(testForm.skipped) || 0,
      silly: Number(testForm.silly) || 0,
      sillyTopic: testForm.sillyTopic.trim(),
      overspent: testForm.overspent.trim(),
      weak: testForm.weak.split(",").map((x) => x.trim()).filter(Boolean),
      rank,
    };
    setTests((prevT) => [...prevT, t]);
    setTestForm({ name: "", type: "mock", total: "300", scored: "", correct: "", wrong: "", skipped: "", silly: "", sillyTopic: "", overspent: "", weak: "", mp: "", mc: "", mm: "", category: "General" });
  }
  function setTestType(type) {
    setTestForm((s) => ({
      ...s, type,
      name: type === "main" ? "JEE Mains" : type === "adv" ? "JEE Advanced" : s.name === "JEE Mains" || s.name === "JEE Advanced" ? "" : s.name,
      total: type === "adv" ? "360" : "300",
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
      planDate: blForm.planDate || "",
      week: blForm.week.trim() || "Week 1",
      done: false,
    };
    setBacklog((prev) => [item, ...prev]);
    setBlForm({ subject: "", topic: "", strength: "weak", planDate: "", week: "" });
  }
  const toggleBacklog = (id) => setBacklog((prev) => prev.map((b) => (b.id === id ? { ...b, done: !b.done } : b)));
  const removeBacklog = (id) => setBacklog((prev) => prev.filter((b) => b.id !== id));
  const backlogDone = backlog.filter((b) => b.done).length;
  const backlogPct = backlog.length ? Math.round((backlogDone / backlog.length) * 100) : 0;

  /* ── weekly tasks (add + complete only · no delete) ── */
  function addWeeklyTask(e) {
    e.preventDefault();
    const text = wtInput.trim();
    if (!text) return;
    setWeeklyTasks((prev) => [...prev, { id: `${Date.now()}`, text, done: false, week: wk, createdAt: todayIso }]);
    setWtInput("");
  }
  const toggleWeeklyTask = (id) => setWeeklyTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const saveWeeklyEdit = () => {
    const text = wtEdit.text.trim();
    if (text) setWeeklyTasks((prev) => prev.map((t) => (t.id === wtEdit.id ? { ...t, text } : t)));
    setWtEdit({ id: null, text: "" });
  };
  const weeklyDone = weeklyTasks.filter((t) => t.done).length;

  /* ── send weekly report to parent ── */
  async function sendParentReport() {
    if (!token) return;
    setParentState({ sending: true, msg: { type: "", text: "" } });
    const report = {
      week: wk,
      stats: {
        hours: round1(weekHours), streak, routinePct, tasks: tasksLabel,
        latestTest: latest ? `${latest.name}: ${latest.scored}/${latest.total} (${acc(latest)}%)` : "—",
        improvement: improvement == null ? "—" : `${improvement >= 0 ? "+" : ""}${improvement}%`,
        backlog: `${backlogDone}/${backlog.length}`,
      },
      chapters: chaptersByStrength,
      weeklyTasks: weeklyTasks.map((t) => ({ text: t.text, done: t.done })),
    };
    try {
      const r = await apiSendParentReport(token, { report });
      setParentState({ sending: false, msg: { type: "ok", text: r.dev ? "Report queued (dev mode — email is logged on the server)." : `Sent to your parent (${r.to}).` } });
    } catch (e) {
      setParentState({ sending: false, msg: { type: "err", text: e.message || "Couldn't send the report. Try again." } });
    }
  }

  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  const NAV_LINKS = [
    { id: "live-tracking",    label: "Live student tracking", desc: "Subject-wise daily log & streak", icon: Activity,        color: "#ef4444" },
    { id: "subject-analysis", label: "Subject-wise analysis", desc: "Hours, tasks & day comparison",   icon: BarChart3,       color: "#6366f1" },
    { id: "test-analysis",    label: "Test analysis",         desc: rankEnabled ? "Marks → charts + rank" : "Marks → AI charts", icon: LineIcon, color: "#8b5cf6" },
    { id: "mentor-tools",     label: "What your mentor breaks down", desc: "Silly mistakes · weak chapters", icon: Brain,      color: GOLD },
    { id: "backlog",          label: "Backlog clearing sprints", desc: "List & clear pending topics",  icon: Rocket,          color: "#7c3aed" },
    { id: "parent-report",    label: "Weekly report & tasks", desc: "Tasks + auto parent email",        icon: Mail,            color: GREEN },
  ];

  return (
    <section style={{ background: "#f8f7f5", minHeight: "100vh", paddingBottom: 70 }}>
      {/* ── Title strip ── */}
      <div style={{ paddingTop: 104, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 12, fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: ORANGE, marginBottom: 8 }}>
          1-on-1 · Personalised · Verified
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }}
          style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.6rem)", color: NAVY, margin: 0, letterSpacing: "-0.5px" }}>
          Mentorship Dashboard
        </motion.h1>
      </div>

      {/* ══ HERO ══ */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 0" }}>
        <div style={{
          position: "relative", overflow: "hidden", borderRadius: 26,
          background: "linear-gradient(160deg,#fffaf5 0%,#ffffff 55%,#f3faf6 100%)",
          border: "1px solid rgba(244,123,32,.16)", padding: "10px",
          boxShadow: "0 30px 70px -40px rgba(13,27,62,.4)",
        }}>
          <motion.div aria-hidden animate={{ opacity: [.5, .85, .5] }} transition={{ duration: 5, repeat: Infinity }}
            style={{ position: "absolute", top: -60, left: "4%", width: 320, height: 260, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,123,32,.18),transparent 65%)", pointerEvents: "none" }} />
          <motion.div aria-hidden animate={{ opacity: [.4, .7, .4] }} transition={{ duration: 6, repeat: Infinity }}
            style={{ position: "absolute", bottom: -50, right: "6%", width: 280, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(21,160,110,.16),transparent 65%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.05fr) minmax(0,1fr)", gap: 18, padding: "16px" }} className="md-hero-grid">

            {/* LEFT — user / plan card */}
            <motion.div initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5 }}
              style={{ background: "#fff", borderRadius: 20, border: "1px solid #eee", padding: "26px 24px", display: "flex", flexDirection: "column", boxShadow: "0 18px 40px -28px rgba(13,27,62,.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 800, fontFamily: "Sora", flexShrink: 0 }}>{initial}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.2rem", color: NAVY, lineHeight: 1.15 }}>{user?.name || "Student"}</div>
                  <div style={{ fontSize: 12.5, color: MUTE, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                {[
                  { icon: GraduationCap, c: ORANGE, l: "Plan", v: planLabel },
                  { icon: Target, c: "#6366f1", l: "Target exam", v: planExam },
                  { icon: Users, c: GREEN, l: "Mentor", v: "Assigned · 1-on-1" },
                  { icon: Flame, c: "#ef4444", l: "Current streak", v: `${streak} day${streak === 1 ? "" : "s"}` },
                ].map(({ icon: Icon, c, l, v }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: `${c}14`, border: `1px solid ${c}30`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon size={17} color={c} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{l}</div>
                      <div style={{ fontSize: 13.5, color: NAVY, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate("/")}
                style={{ marginTop: "auto", width: "100%", padding: "13px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: NAVY, fontFamily: "Sora", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Home size={16} /> Home
              </button>
            </motion.div>

            {/* MIDDLE — programme description */}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .08 }}
              style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "8px 6px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, color: "#c2410c", background: "rgba(244,123,32,.12)", border: "1px solid rgba(244,123,32,.35)", padding: "6px 14px", borderRadius: 50, alignSelf: "flex-start", marginBottom: 16 }}>
                <Sparkles size={13} /> Your private mentorship space
              </span>
              <h2 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.4rem,2.6vw,2rem)", color: INK, lineHeight: 1.2, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
                Everything about your journey, in one place.
              </h2>
              <p style={{ color: MUTE, fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                Log study hours & tasks <strong style={{ color: NAVY }}>subject by subject</strong> once a day, enter every test
                {rankEnabled && <> (with <strong style={{ color: NAVY }}>JEE rank prediction</strong>)</>}, and list your backlog.
                We turn it into charts, week-on-week comparisons, a silly-mistake audit, a weak-chapter heatmap, strategies and a
                fix-list — and email a clean weekly report to your parents.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                <button onClick={() => scrollTo("live-tracking")} style={{ background: `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", border: "none", padding: "12px 20px", borderRadius: 12, fontFamily: "Sora", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: `0 12px 26px -10px ${ORANGE}` }}>
                  Log today <ArrowRight size={16} />
                </button>
                <button onClick={() => scrollTo("test-analysis")} style={{ background: "#fff", color: NAVY, border: "1.5px solid #e5e7eb", padding: "12px 20px", borderRadius: 12, fontFamily: "Sora", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                  Add a test
                </button>
              </div>
            </motion.div>

            {/* RIGHT — jump links */}
            <motion.div initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: .12 }}
              style={{ background: "#fff", borderRadius: 20, border: "1px solid #eee", padding: "20px", boxShadow: "0 18px 40px -28px rgba(13,27,62,.4)" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".06em", margin: "2px 4px 12px" }}>Jump to</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {NAV_LINKS.map(({ id, label, desc, icon: Icon, color }) => (
                  <button key={id} onClick={() => scrollTo(id)}
                    style={{ textAlign: "left", background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "11px 13px", cursor: "pointer", display: "flex", gap: 12, alignItems: "center", transition: "box-shadow .15s, transform .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 12px 26px -14px ${color}99`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                    <span style={{ width: 38, height: 38, borderRadius: 11, background: `${color}14`, border: `1px solid ${color}30`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon size={18} color={color} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, color: NAVY }}>{label}</span>
                      <span style={{ display: "block", fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{desc}</span>
                    </span>
                    <ArrowRight size={15} color="#cbd5e1" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px" }}>

        {/* ── PERSONALISED OVERVIEW ── */}
        <Section id="personalised" kicker="Proof, not promises" title="Your snapshot" tColor={ORANGE}
          sub="A single overview your mentor and parents can see — built from your own data.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
            {[
              { v: latest ? `${latest.scored}/${latest.total}` : "—", l: "Latest score", c: ORANGE },
              { v: latest ? `${acc(latest)}%` : "—", l: "Accuracy", c: "#22c55e" },
              { v: improvement == null ? "—" : `${improvement >= 0 ? "+" : ""}${improvement}%`, l: "Since last test", c: improvement != null && improvement < 0 ? "#ef4444" : "#6366f1" },
              { v: `${streak}`, l: "Day streak", c: "#ef4444" },
              { v: `${routinePct}%`, l: "Routine kept", c: "#8b5cf6" },
              { v: `${backlogDone}/${backlog.length}`, l: "Backlog cleared", c: "#7c3aed" },
            ].map((s) => (
              <motion.div key={s.l} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "18px", borderTop: `3px solid ${s.c}`, boxShadow: "0 14px 36px -28px rgba(13,27,62,.4)" }}>
                <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 24, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 12.5, color: MUTE, fontWeight: 600, marginTop: 2 }}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── LIVE STUDENT TRACKING ── */}
        <Section id="live-tracking" kicker="Always on · once a day" title="Live Student Tracking" tColor="#ef4444"
          sub="Log each subject's study hours and tasks once per day — the charts update instantly so nothing slips through the cracks.">
          <div style={{ background: "#fff", border: "1px solid rgba(244,123,32,.18)", borderRadius: 20, padding: "24px", boxShadow: "0 20px 46px -28px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${GREEN},${ORANGE})` }} />

            {/* header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 18 }}>{initial}</div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", color: INK }}>{user?.name || "Student"} · {planExam}</div>
                <div style={{ fontSize: 12.5, color: MUTE }}>Mentor: Assigned · 1-on-1</div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, color: "#16a34a", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", padding: "6px 13px", borderRadius: 50 }}>
                <motion.span animate={{ opacity: [1, .3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "block" }} />
                LIVE · Active now
              </span>
            </div>

            {/* stat tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginBottom: 20 }}>
              {[
                { icon: Clock, c: ORANGE, v: todayEntry ? `${todayEntry.hours}h` : "0h", l: "Today" },
                { icon: Activity, c: "#6366f1", v: `${round1(weekHours)}h`, l: "This week" },
                { icon: Flame, c: "#ef4444", v: `${streak} day${streak === 1 ? "" : "s"}`, l: "Streak" },
                { icon: CheckCircle2, c: "#22c55e", v: tasksLabel, l: "Tasks done" },
                { icon: Target, c: "#8b5cf6", v: `${routinePct}%`, l: "Routine kept" },
              ].map(({ icon: Icon, c, v, l }) => (
                <div key={l} style={{ background: "#fff", border: "1px solid rgba(244,123,32,.16)", borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
                  <Icon size={18} color={c} style={{ marginBottom: 6 }} />
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, color: INK }}>{v}</div>
                  <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* log today — ONCE PER DAY */}
            {todayEntry && !editingLog ? (
              <div style={{ background: "#f0faf4", border: "1px solid rgba(34,197,94,.3)", borderRadius: 14, padding: "16px 18px", marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 800, color: "#15803d" }}>
                    <CheckCircle2 size={17} /> Logged for today ({fmtDay(todayIso)}) — one entry per day
                  </span>
                  <button onClick={startEditLog} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #cbd5e1", borderRadius: 9, padding: "7px 12px", fontSize: 12.5, fontWeight: 700, color: NAVY, cursor: "pointer" }}>
                    <Pencil size={13} /> Edit today's log
                  </button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {subjects.map((s) => (
                    <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${subColor(s)}33`, borderRadius: 9, padding: "6px 11px", fontSize: 12.5, fontWeight: 700, color: NAVY }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: subColor(s) }} /> {shortName(s)}: {subVal(todayEntry, s).h}h · {subVal(todayEntry, s).t}✓
                    </span>
                  ))}
                  <span style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 9, padding: "6px 11px", fontSize: 12.5, fontWeight: 700, color: NAVY }}>Tasks: {todayEntry.tasksDone}/{todayEntry.tasksTotal}</span>
                  <span style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 9, padding: "6px 11px", fontSize: 12.5, fontWeight: 700, color: todayEntry.routine ? "#15803d" : "#b91c1c" }}>Routine: {todayEntry.routine ? "Followed ✓" : "Missed"}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={addLog} style={{ background: "#fffaf5", border: "1px solid rgba(244,123,32,.22)", borderRadius: 14, padding: "16px 18px", marginBottom: 22 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: "#9a3412", marginBottom: 12 }}>Log today ({fmtDay(todayIso)}) · hours & tasks completed per subject</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 12 }}>
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
                    <Plus size={15} /> Save today's log
                  </button>
                  {editingLog && <button type="button" onClick={() => setEditingLog(false)} style={{ padding: "11px 16px", borderRadius: 11, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Cancel</button>}
                </div>
              </form>
            )}

            {/* weekly hours bars + goal gauge */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: 22, alignItems: "center" }} className="md-track-grid">
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: MUTE, marginBottom: 10 }}>Total study hours · last 7 days</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 150 }}>
                  {last7.map((e, i) => (
                    <div key={e.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: INK }}>{e.hours}h</span>
                      <motion.div initial={{ height: 0 }} animate={{ height: `${(Number(e.hours) / maxH) * 100}%` }} transition={{ duration: .5, delay: i * 0.05 }}
                        style={{ width: "100%", maxWidth: 28, borderRadius: "6px 6px 0 0", background: i === last7.length - 1 ? `linear-gradient(180deg,${ORANGE},${GOLD})` : "rgba(244,123,32,.4)" }} />
                      <span style={{ fontSize: 10.5, color: MUTE }}>{DOW[new Date(e.date).getDay()]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: MUTE, marginBottom: 4 }}>Weekly goal ({WEEK_TARGET_HRS}h)</div>
                <Gauge value={goalPct} label="of target" color="#22c55e" height={170} />
              </div>
            </div>
          </div>
        </Section>

        {/* ── SUBJECT-WISE ANALYSIS ── */}
        <Section id="subject-analysis" kicker="Every subject counts" title="Subject-wise Analysis" tColor="#6366f1"
          sub="See exactly where your hours and tasks go, compare day-by-day, and check this week against last week.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18, marginBottom: 18 }}>
            <ChartCard title="Study hours per subject · last 7 days" hint="Compare each subject day by day" accent="#6366f1">
              <Trend data={subjectHourTrend} lines={subjectLines} height={230} fmt={(v) => `${v}h`} />
            </ChartCard>
            <ChartCard title="Tasks completed per subject · last 7 days" hint="How many tasks you cleared, by subject" accent="#15a06e">
              <Trend data={subjectTaskTrend} lines={subjectLines} height={230} />
            </ChartCard>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: 18, alignItems: "start" }} className="md-track-grid">
            <ChartCard title="Time split this week" hint="Share of study hours per subject" accent="#8b5cf6">
              {subjectPie.length
                ? <PieWithLegend data={subjectPie} colors={subjects.map(subColor)} height={210} fmt={(v) => `${v}h`} />
                : <ChartHint text="Log today's subject hours to see your split." />}
            </ChartCard>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
              {subjects.map((s) => {
                const now = round1(thisWkH[s]); const was = round1(lastWkH[s]);
                const d = round1(now - was);
                return (
                  <div key={s} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "15px 16px", borderTop: `3px solid ${subColor(s)}`, boxShadow: "0 14px 36px -28px rgba(13,27,62,.4)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: subColor(s) }} />
                      <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: NAVY }}>{shortName(s)}</span>
                    </div>
                    <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 21, color: subColor(s) }}>{now}h</div>
                    <div style={{ fontSize: 11.5, color: MUTE, marginTop: 2 }}>{Math.round(thisWkT[s])} tasks · {round1(now / 7)}h/day</div>
                    <DeltaPill d={d} unit="h" subtext="vs last week" />
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ── TEST ANALYSIS ── */}
        <Section id="test-analysis" kicker="Every test counts" title="Test Analysis" tColor="#8b5cf6"
          sub={rankEnabled
            ? "Enter your marks, silly mistakes and weak chapters. Pick JEE Mains/Advanced to get a predicted rank — everything else is analysed automatically."
            : "Enter your marks, silly mistakes and weak chapters — we analyse accuracy, score and week-on-week change automatically."}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))", gap: 18 }}>
            {/* left — input + reports + strategies */}
            <div style={{ background: "#fff", border: "1px solid rgba(139,92,246,.18)", borderRadius: 20, padding: "22px 22px 20px", boxShadow: "0 18px 44px -28px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#8b5cf6,#22c55e)" }} />
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.1rem", color: INK, margin: "0 0 14px" }}>Add a test result</h3>

              {/* JEE-only test type toggle */}
              {rankEnabled && (
                <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
                  {[["mock", "Mock / Other"], ["main", "JEE Mains"], ["adv", "JEE Advanced"]].map(([val, lbl]) => (
                    <button type="button" key={val} onClick={() => setTestType(val)}
                      style={{ flex: "1 1 90px", padding: "9px 8px", borderRadius: 10, border: `1.5px solid ${testForm.type === val ? "#8b5cf6" : "#e5e7eb"}`, background: testForm.type === val ? "#8b5cf610" : "#fff", color: testForm.type === val ? "#6d28d9" : "#6b7280", fontWeight: 800, fontSize: 12.5, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      {val !== "mock" && <Trophy size={13} />}{lbl}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={addTest} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <TextField label="Test name" value={testForm.name} onChange={(v) => setTestForm((s) => ({ ...s, name: v }))} placeholder="e.g. Mock 4" />

                {rankEnabled && (testForm.type === "main" || testForm.type === "adv") ? (
                  <>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#6d28d9", marginTop: -2 }}>
                      Marks per section (out of {maxPerSubject(testForm.type === "adv")} each · total {maxTotal(testForm.type === "adv")})
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
                <SelectField label="Over-spent time on" value={testForm.overspent} onChange={(v) => setTestForm((s) => ({ ...s, overspent: v }))} options={["", ...subjects]} placeholders={{ "": "Select subject" }} labels={Object.fromEntries(subjects.map((s) => [s, shortName(s)]))} />
                <TextField label="Weak chapters (comma separated)" value={testForm.weak} onChange={(v) => setTestForm((s) => ({ ...s, weak: v }))} placeholder="e.g. Rotational Motion, p-Block" />
                <button type="submit" style={{ marginTop: 4, padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Plus size={16} /> {rankEnabled && (testForm.type === "main" || testForm.type === "adv") ? "Analyse & predict rank" : "Analyse this test"}
                </button>
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
              {rankEnabled && latestRankTest?.rank && <RankCard r={latestRankTest.rank} name={latestRankTest.name} />}

              {/* strategies — fills the white space */}
              <div style={{ marginTop: 16, background: "linear-gradient(135deg,#fffaf0,#fff)", border: `1px solid ${GOLD}44`, borderRadius: 14, padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Lightbulb size={17} color={GOLD} />
                  <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: INK }}>Strategies to do better</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {strategies.map((st, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <span style={{ width: 26, height: 26, borderRadius: 8, background: `${st.color}14`, border: `1px solid ${st.color}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <st.icon size={14} color={st.color} />
                      </span>
                      <span style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.5, paddingTop: 3 }}>{st.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* right — charts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <ChartCard title="Score trend" hint="Your marks across every test (vs 75% target)" accent="#8b5cf6">
                <Trend data={scoreTrend} lines={[{ key: "you", label: "You", color: ORANGE }, { key: "target", label: "Target (75%)", color: "#8b5cf6" }]} height={200} />
              </ChartCard>
              <ChartCard title="Accuracy trend" hint="Correct ÷ attempted, test over test" accent="#22c55e">
                <Trend data={accTrend} lines={[{ key: "accuracy", label: "Accuracy %", color: "#22c55e" }]} height={180} fmt={(v) => `${v}%`} />
              </ChartCard>
              <ChartCard title={`Latest test split — ${latest ? latest.name : "—"}`} hint="Correct · Wrong · Skipped" accent="#6366f1">
                {latestBreakdown.length
                  ? <PieWithLegend data={latestBreakdown} colors={["#22c55e", "#ef4444", "#9ca3af"]} height={190} />
                  : <ChartHint text="Add a test to see the breakdown." />}
              </ChartCard>
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
                <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: "10px 13px" }}>
                  {ins.tone === "up" ? <TrendingUp size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                    : ins.tone === "down" ? <TrendingDown size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                    : <Minus size={16} color="#64748b" style={{ flexShrink: 0, marginTop: 1 }} />}
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{ins.text}</span>
                </div>
              )) : <span style={{ fontSize: 13, color: MUTE }}>Add a couple of tests and daily logs to unlock your improvement & decline report.</span>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {/* Silly-mistake audit */}
            <ToolCard icon={Crosshair} color="#ef4444" title="Silly-mistake audit" desc="Marks lost to silly errors — tracked, by topic, and killed.">
              {sillyTrend.length ? (
                <>
                  <Bars data={sillyTrend} bars={[{ key: "silly", label: "Silly mistakes", color: "#ef4444" }]} height={140} />
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

            {/* Weak-chapter heatmap */}
            <ToolCard icon={Zap} color="#8b5cf6" title="Weak-chapter heatmap" desc="The exact topics dragging your score, ranked.">
              {weakRanked.length ? (
                <>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 }}>
                    {weakRanked.slice(0, 6).map(([c]) => (
                      <span key={c} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 50, padding: "5px 12px", fontSize: 12, fontWeight: 700 }}>{c}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {weakRanked.slice(0, 5).map(([c, n]) => (
                      <div key={c} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 12.5, color: NAVY, fontWeight: 600, width: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c}</span>
                        <div style={{ flex: 1, height: 9, borderRadius: 6, background: "#f1f5f9", overflow: "hidden" }}>
                          <div style={{ width: `${(n / maxWeak) * 100}%`, height: "100%", borderRadius: 6, background: "linear-gradient(90deg,#f59e0b,#ef4444)" }} />
                        </div>
                        <span style={{ fontSize: 11.5, color: "#ef4444", fontWeight: 800, width: 24, textAlign: "right" }}>×{n}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <ChartHint text="Tag weak chapters on tests or in your backlog." />}
            </ToolCard>

            {/* Time-management review — enhanced */}
            <ToolCard icon={Timer} color="#06b6d4" title="Time-management review" desc="Where you over-spend, plus a pacing plan for the next paper.">
              {timeBars.length > 0 && <Bars data={timeBars} bars={[{ key: "over", label: "Over-spent (tests)", color: "#06b6d4" }]} height={130} />}
              <div style={{ marginTop: timeBars.length ? 12 : 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: MUTE, marginBottom: 7 }}>Suggested pacing · next paper</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {pacing.map(({ s, min }) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ fontSize: 12.5, color: NAVY, fontWeight: 600, width: 80 }}>{s}</span>
                      <div style={{ flex: 1, height: 8, borderRadius: 5, background: "#f1f5f9", overflow: "hidden" }}>
                        <div style={{ width: `${(min / Math.max(...pacing.map((p) => p.min))) * 100}%`, height: "100%", borderRadius: 5, background: subColor(s) }} />
                      </div>
                      <span style={{ fontSize: 11.5, color: "#0891b2", fontWeight: 800, width: 48, textAlign: "right" }}>{min} min</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: MUTE, lineHeight: 1.5, marginTop: 10 }}>
                  {timeRanked[0]
                    ? <>Set a hard time-cap for <strong style={{ color: NAVY }}>{shortName(timeRanked[0][0])}</strong> — and you skip ~{avgSkipped} questions/paper, so do a confident first pass before returning to them.</>
                    : <>You skip ~{avgSkipped} questions/paper on average — do one confident pass first, then circle back.</>}
                </div>
              </div>
            </ToolCard>

            {/* Weekly fix-list */}
            <ToolCard icon={ListChecks} color={GREEN} title="Your weekly fix-list" desc="3–5 concrete actions before your next test.">
              {fixList.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {fixList.map((label) => {
                    const done = fixDoneSet.includes(label);
                    return (
                      <button key={label} onClick={() => toggleFix(label)}
                        style={{ display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left", background: done ? "#f0faf4" : "#fff", border: `1px solid ${done ? "#bbf7d0" : "#eef2f7"}`, borderRadius: 11, padding: "10px 12px", cursor: "pointer" }}>
                        <span style={{ width: 19, height: 19, borderRadius: 6, border: `1.5px solid ${done ? GREEN : "#cbd5e1"}`, background: done ? GREEN : "#fff", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                          {done && <CheckCircle2 size={14} color="#fff" />}
                        </span>
                        <span style={{ fontSize: 13, color: done ? "#15803d" : "#374151", lineHeight: 1.45, textDecoration: done ? "line-through" : "none" }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : <ChartHint text="Log a test & backlog to generate your fix-list." />}
            </ToolCard>
          </div>
        </Section>

        {/* ── BACKLOG ── */}
        <Section id="backlog" kicker="Catch up without burning out" title="Backlog Clearing Sprints" tColor="#7c3aed"
          sub="A structured catch-up system that clears months of pending chapters — list them, rate your strength, and set a plan date.">
          <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,.18)", borderRadius: 20, padding: "24px", boxShadow: "0 20px 46px -28px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#7c3aed,#a855f7)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
              <span style={{ width: 46, height: 46, borderRadius: 13, background: "#f5f3ff", border: "1px solid #ddd6fe", display: "grid", placeItems: "center" }}><Rocket size={22} color="#7c3aed" /></span>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", color: INK }}>Your backlog · {backlogDone}/{backlog.length} cleared</div>
                <div style={{ height: 9, borderRadius: 6, background: "#f1f5f9", overflow: "hidden", marginTop: 8, maxWidth: 320 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${backlogPct}%` }} style={{ height: "100%", borderRadius: 6, background: "linear-gradient(90deg,#7c3aed,#a855f7)" }} />
                </div>
              </div>
              <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 26, color: "#7c3aed" }}>{backlogPct}%</div>
            </div>

            <form onSubmit={addBacklog} style={{ background: "#faf8ff", border: "1px solid #ede9fe", borderRadius: 14, padding: "16px 18px", marginBottom: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, alignItems: "flex-end" }}>
              <SelectField label="Subject" value={blForm.subject} onChange={(v) => setBlForm((s) => ({ ...s, subject: v }))} options={subjects} labels={Object.fromEntries(subjects.map((s) => [s, s]))} />
              <TextField label="Topic / chapter" value={blForm.topic} onChange={(v) => setBlForm((s) => ({ ...s, topic: v }))} placeholder="e.g. Rotational Motion" />
              <SelectField label="How strong are you?" value={blForm.strength} onChange={(v) => setBlForm((s) => ({ ...s, strength: v }))} options={["weak", "medium", "strong"]} labels={{ weak: "Weak", medium: "Medium", strong: "Strong" }} />
              <DateField label="Plan date" value={blForm.planDate} onChange={(v) => setBlForm((s) => ({ ...s, planDate: v }))} />
              <TextField label="Target week" value={blForm.week} onChange={(v) => setBlForm((s) => ({ ...s, week: v }))} placeholder="e.g. Week 2" />
              <button type="submit" style={{ padding: "12px 16px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, height: 42 }}>
                <Plus size={15} /> Add
              </button>
            </form>

            {backlog.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {backlog.map((b) => {
                  const st = STRENGTHS[b.strength] || STRENGTHS.weak;
                  return (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: b.done ? "#f8fafc" : "#fff", border: "1px solid #eef2f7", borderRadius: 13, padding: "13px 15px", opacity: b.done ? 0.72 : 1 }}>
                      <button onClick={() => toggleBacklog(b.id)} title={b.done ? "Mark as pending" : "Mark cleared"}
                        style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${b.done ? GREEN : "#cbd5e1"}`, background: b.done ? GREEN : "#fff", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                        {b.done && <CheckCircle2 size={16} color="#fff" />}
                      </button>
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: subColor(b.subject), flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 150 }}>
                        <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 14, color: NAVY, textDecoration: b.done ? "line-through" : "none" }}>{b.topic}</div>
                        <div style={{ fontSize: 12, color: MUTE }}>{shortName(b.subject)}{b.week ? ` · ${b.week}` : ""}</div>
                      </div>
                      <span style={{ background: `${st.color}14`, border: `1px solid ${st.color}40`, color: st.color, borderRadius: 50, padding: "4px 11px", fontSize: 11.5, fontWeight: 800 }}>{st.label}</span>
                      {b.planDate && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
                          <CalendarDays size={13} /> {fmtDay(b.planDate)}
                        </span>
                      )}
                      <button onClick={() => removeBacklog(b.id)} title="Remove" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #fee2e2", background: "#fff", color: "#ef4444", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "26px 0", color: "#9ca3af", fontSize: 13.5 }}>
                <BookOpen size={26} style={{ marginBottom: 8, opacity: .6 }} /><br />No backlog yet — add your pending chapters above.
              </div>
            )}
          </div>
        </Section>

        {/* ── WEEKLY REPORT & TASKS ── */}
        <Section id="parent-report" kicker="Parents stay in the loop" title="Weekly Report & Task List" tColor={GREEN}
          sub="Add your weekly tasks (tick them off as you finish — they can't be deleted), and send a clean chapter-strength report to your parent.">

          {/* send strip */}
          <div style={{ background: "#fff", border: `1px solid ${GREEN}33`, borderRadius: 20, padding: "20px 22px", boxShadow: `0 20px 46px -30px ${GREEN}99`, position: "relative", overflow: "hidden", marginBottom: 18 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${GREEN},#22c55e)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span style={{ width: 46, height: 46, borderRadius: 13, background: "#dcfce7", display: "grid", placeItems: "center", flexShrink: 0 }}><Mail size={22} color={GREEN} /></span>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.1rem", color: INK }}>Send this week's report to your parent</div>
                <p style={{ color: MUTE, fontSize: 13.5, lineHeight: 1.6, margin: "4px 0 0" }}>
                  Includes study hours, streak, tasks, latest test and your <strong style={{ color: NAVY }}>weak / medium / strong chapter list</strong> — emailed to the parent address on your enrolment.
                </p>
              </div>
              <button onClick={sendParentReport} disabled={parentState.sending}
                style={{ padding: "13px 22px", borderRadius: 12, border: "none", background: parentState.sending ? `${GREEN}99` : `linear-gradient(135deg,${GREEN},#22c55e)`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 14, cursor: parentState.sending ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 9, boxShadow: `0 12px 26px -10px ${GREEN}` }}>
                {parentState.sending ? <><Loader2 size={17} style={{ animation: "spin .8s linear infinite" }} /> Sending…</> : <><Send size={16} /> Send to parent</>}
              </button>
            </div>
            <AnimatePresence>
              {parentState.msg.text && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginTop: 14, borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 700, background: parentState.msg.type === "ok" ? "#f0fdf4" : "#fff1f2", border: `1.5px solid ${parentState.msg.type === "ok" ? "#86efac" : "#fca5a5"}`, color: parentState.msg.type === "ok" ? "#166534" : "#991b1b" }}>
                  {parentState.msg.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 18 }}>
            {/* weekly task list */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: "22px", boxShadow: "0 18px 44px -30px rgba(26,26,46,.4)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", color: INK, margin: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <ListChecks size={18} color={GREEN} /> Weekly task list
                </h3>
                <span style={{ fontSize: 12, fontWeight: 800, color: GREEN, background: "#dcfce7", borderRadius: 50, padding: "4px 11px" }}>{weeklyDone}/{weeklyTasks.length} done</span>
              </div>
              <p style={{ fontSize: 12, color: MUTE, margin: "0 0 12px", lineHeight: 1.5 }}>Add tasks for the week. Once added a task stays for accountability — you can edit the text or tick it complete, but it can't be deleted.</p>

              <form onSubmit={addWeeklyTask} style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <input value={wtInput} onChange={(e) => setWtInput(e.target.value)} placeholder="e.g. Finish Rotational Motion DPP"
                  style={{ flex: 1, padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e5e7eb", fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => { e.target.style.borderColor = GREEN; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
                <button type="submit" style={{ padding: "11px 16px", borderRadius: 11, border: "none", background: `linear-gradient(135deg,${GREEN},#22c55e)`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
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
                            style={{ flex: 1, padding: "7px 10px", borderRadius: 8, border: `1.5px solid ${GREEN}`, fontSize: 13.5, color: NAVY, outline: "none" }} />
                          <button onClick={saveWeeklyEdit} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "7px 11px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Save</button>
                        </>
                      ) : (
                        <>
                          <span style={{ flex: 1, fontSize: 13.5, color: t.done ? "#15803d" : "#374151", lineHeight: 1.4, textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                          {!t.done && (
                            <button onClick={() => setWtEdit({ id: t.id, text: t.text })} title="Edit" style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                              <Pencil size={13} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#9ca3af", fontSize: 13 }}>No tasks yet — add your first weekly task above.</div>
              )}
            </div>

            {/* summary + chapter strength */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ background: "#f0faf4", border: `1px solid ${GREEN}33`, borderRadius: 16, padding: "18px 20px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: MUTE, marginBottom: 10 }}>This week's summary</div>
                {[
                  { l: "Study hours", v: `${round1(weekHours)} h` },
                  { l: "Day streak", v: `${streak} days` },
                  { l: "Routine kept", v: `${routinePct}%` },
                  { l: "Tasks (latest day)", v: tasksLabel },
                  { l: "Weekly tasks done", v: `${weeklyDone}/${weeklyTasks.length}` },
                  { l: "Latest test", v: latest ? `${latest.scored}/${latest.total} (${acc(latest)}%)` : "—" },
                  { l: "Change vs last test", v: improvement == null ? "—" : `${improvement >= 0 ? "+" : ""}${improvement}%` },
                  { l: "Backlog cleared", v: `${backlogDone}/${backlog.length}` },
                ].map((r) => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
                    <span style={{ fontSize: 13, color: "#374151" }}>{r.l}</span>
                    <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: NAVY }}>{r.v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "18px 20px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: MUTE, marginBottom: 12 }}>Chapter-strength report (sent to parent)</div>
                {["weak", "medium", "strong"].map((k) => {
                  const st = STRENGTHS[k];
                  const items = chaptersByStrength[k];
                  return (
                    <div key={k} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: st.color }} />
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: st.color }}>{st.label} ({items.length})</span>
                      </div>
                      {items.length ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {items.map((c) => (
                            <span key={c} style={{ background: `${st.color}12`, border: `1px solid ${st.color}33`, color: st.color, borderRadius: 50, padding: "3px 10px", fontSize: 11.5, fontWeight: 700 }}>{c}</span>
                          ))}
                        </div>
                      ) : <span style={{ fontSize: 12, color: "#9ca3af" }}>None yet — add chapters in your backlog.</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .md-hero-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 760px) {
          .md-track-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </section>
  );
}

/* ── building blocks ─────────────────────────────────────────────── */
function Section({ id, kicker, title, sub, tColor = ORANGE, children }) {
  return (
    <section id={id} style={{ scrollMarginTop: 90, paddingTop: 44 }}>
      <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 26px" }}>
        <span style={{ display: "inline-block", fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: tColor, marginBottom: 10 }}>{kicker}</span>
        <h2 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.5rem,3.4vw,2.1rem)", color: INK, margin: 0, letterSpacing: "-0.5px" }}>{title}</h2>
        {sub && <p style={{ color: MUTE, fontSize: 14.5, lineHeight: 1.6, marginTop: 12 }}>{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function ChartCard({ title, hint, accent = ORANGE, children }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${accent}28`, borderRadius: 18, padding: "20px 20px 16px", boxShadow: "0 16px 40px -28px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${accent},${GOLD})` }} />
      <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1rem", color: INK, margin: "0 0 2px" }}>{title}</h3>
      {hint && <p style={{ fontSize: 12.5, color: MUTE, margin: "0 0 12px" }}>{hint}</p>}
      {children}
    </div>
  );
}

function ToolCard({ icon: Icon, color, title, desc, children }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${color}28`, borderRadius: 18, padding: "20px", boxShadow: "0 16px 40px -28px rgba(26,26,46,.4)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 4 }}>
        <span style={{ width: 38, height: 38, borderRadius: 11, background: `${color}14`, border: `1px solid ${color}30`, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={18} color={color} /></span>
        <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1rem", color: INK, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ fontSize: 12.5, color: MUTE, margin: "4px 0 14px", lineHeight: 1.5 }}>{desc}</p>
      <div style={{ marginTop: "auto" }}>{children}</div>
    </div>
  );
}

function RankCard({ r, name }) {
  const purple = "#6d28d9";
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
    <div style={{ marginTop: 16, background: "linear-gradient(135deg,#f5f3ff,#fff)", border: `1px solid ${purple}33`, borderRadius: 14, padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Trophy size={17} color={purple} />
        <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: INK }}>
          Predicted {r.advanced ? "JEE Advanced" : "JEE Main"} 2026 rank · {r.total} marks
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10, marginBottom: 10 }}>
        <div style={{ background: "#fff", border: `1px solid ${purple}22`, borderRadius: 11, padding: "11px 12px" }}>
          <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 17, color: purple }}>{r.advanced ? rng(r.crlLo ?? r.low, r.crlHi ?? r.high) : inr(r.crl)}</div>
          <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{r.advanced ? "CRL range" : "All-India CRL"}</div>
        </div>
        {!r.isGeneral && r.categoryRank && (
          <div style={{ background: "#fff", border: `1px solid ${purple}22`, borderRadius: 11, padding: "11px 12px" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 17, color: purple }}>{inr(r.categoryRank)}</div>
            <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{r.category} rank</div>
          </div>
        )}
        {r.percentile != null && !r.advanced && (
          <div style={{ background: "#fff", border: `1px solid ${purple}22`, borderRadius: 11, padding: "11px 12px" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 17, color: purple }}>{r.percentile}</div>
            <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>percentile</div>
          </div>
        )}
        {!r.advanced && (
          <div style={{ background: "#fff", border: `1px solid ${purple}22`, borderRadius: 11, padding: "11px 12px" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 17, color: purple }}>{rng(r.low, r.high)}</div>
            <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>likely band</div>
          </div>
        )}
      </div>
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
    <div style={{ border: `1px solid ${c}26`, borderRadius: 12, padding: "11px 12px", background: "#fff" }}>
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
        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box", background: "#fff", cursor: "pointer" }}
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
