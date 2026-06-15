import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, GraduationCap, LayoutDashboard, LineChart as LineIcon, Mail, Activity,
  Flame, Clock, CheckCircle2, Target, TrendingUp, TrendingDown, Plus, Sparkles,
  ShieldCheck, ArrowRight, Users, BarChart3,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiMyEnrollments } from "../auth/api.js";
import { Trend, Gauge, PieWithLegend } from "../components/Charts.jsx";

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

/* ── demo seed (used until the student logs their own data) ───────── */
function seedTracking() {
  const today = new Date();
  const hrs = [4.5, 6, 5, 7, 6, 8, 2.5];
  const td = [16, 18, 15, 20, 18, 21, 12];
  const tt = [21, 21, 20, 21, 21, 21, 18];
  return hrs.map((h, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (6 - i));
    return { date: isoDay(d), hours: h, tasksDone: td[i], tasksTotal: tt[i] };
  });
}
function seedTests() {
  const today = new Date();
  const mk = (n, back, total, scored, correct, wrong, skipped) => {
    const d = new Date(today); d.setDate(today.getDate() - back);
    return { id: `${n}-${back}`, name: n, date: isoDay(d), total, scored, correct, wrong, skipped };
  };
  return [
    mk("Mock 1", 21, 300, 126, 48, 22, 20),
    mk("Mock 2", 14, 300, 150, 56, 18, 16),
    mk("Mock 3", 7,  300, 178, 64, 14, 12),
  ];
}

/* trailing consecutive-day streak ending today/yesterday */
function streakOf(entries) {
  const set = new Set(entries.map((e) => e.date));
  let streak = 0;
  const d = new Date();
  // allow today to be missing (count from yesterday)
  if (!set.has(isoDay(d))) d.setDate(d.getDate() - 1);
  while (set.has(isoDay(d))) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

const WEEK_TARGET_HRS = 40;

export default function MentorshipDashboard() {
  const { user, token, isLoggedIn, openLogin } = useAuth();
  const navigate = useNavigate();

  const emailKey = (user?.email || "guest").toLowerCase();
  const TRACK_KEY = `mdash:tracking:${emailKey}`;
  const TEST_KEY = `mdash:tests:${emailKey}`;

  const [entries, setEntries] = useState(() => load(TRACK_KEY, null) || seedTracking());
  const [tests, setTests] = useState(() => load(TEST_KEY, null) || seedTests());
  const [planLabel, setPlanLabel] = useState("Mentorship Program");
  const [planExam, setPlanExam] = useState("JEE / NEET");

  const [logForm, setLogForm] = useState({ hours: "", tasksDone: "", tasksTotal: "" });
  const [testForm, setTestForm] = useState({ name: "", total: "300", scored: "", correct: "", wrong: "", skipped: "" });

  useEffect(() => {
    const prev = document.title;
    document.title = "Mentorship Dashboard · College Parichay";
    return () => { document.title = prev; };
  }, []);

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

  /* ── derived tracking metrics ── */
  const sorted = useMemo(() => [...entries].sort((a, b) => a.date.localeCompare(b.date)), [entries]);
  const last7 = sorted.slice(-7);
  const todayIso = isoDay(new Date());
  const todayEntry = sorted.find((e) => e.date === todayIso);
  const weekHours = last7.reduce((s, e) => s + Number(e.hours || 0), 0);
  const latestTrack = sorted[sorted.length - 1];
  const tasksLabel = latestTrack ? `${latestTrack.tasksDone} / ${latestTrack.tasksTotal}` : "—";
  const streak = streakOf(sorted);
  const goalPct = Math.min(100, Math.round((weekHours / WEEK_TARGET_HRS) * 100));
  const maxH = Math.max(1, ...last7.map((e) => Number(e.hours || 0)));

  /* ── derived test metrics ── */
  const testsSorted = useMemo(() => [...tests].sort((a, b) => a.date.localeCompare(b.date)), [tests]);
  const latest = testsSorted[testsSorted.length - 1];
  const prev = testsSorted[testsSorted.length - 2];
  const acc = (t) => {
    const att = Number(t.correct) + Number(t.wrong);
    return att ? Math.round((Number(t.correct) / att) * 100) : 0;
  };
  const improvement = latest && prev && Number(prev.scored) > 0
    ? Math.round(((Number(latest.scored) - Number(prev.scored)) / Number(prev.scored)) * 100)
    : null;
  const scoreTrend = testsSorted.map((t, i) => ({ year: t.name || `T${i + 1}`, you: Number(t.scored), target: Math.round(Number(t.total) * 0.75) }));
  const latestBreakdown = latest
    ? [
        { name: "Correct", value: Number(latest.correct) },
        { name: "Wrong", value: Number(latest.wrong) },
        { name: "Skipped", value: Number(latest.skipped) },
      ]
    : [];

  function addLog(e) {
    e.preventDefault();
    const hours = Number(logForm.hours);
    if (!Number.isFinite(hours) || hours <= 0) return;
    const entry = {
      date: todayIso,
      hours,
      tasksDone: Number(logForm.tasksDone) || 0,
      tasksTotal: Number(logForm.tasksTotal) || Number(logForm.tasksDone) || 0,
    };
    setEntries((prevE) => [...prevE.filter((x) => x.date !== todayIso), entry]);
    setLogForm({ hours: "", tasksDone: "", tasksTotal: "" });
  }

  function addTest(e) {
    e.preventDefault();
    const total = Number(testForm.total) || 0;
    const scored = Number(testForm.scored);
    if (!testForm.name.trim() || !Number.isFinite(scored)) return;
    const t = {
      id: `${Date.now()}`,
      name: testForm.name.trim(),
      date: todayIso,
      total,
      scored,
      correct: Number(testForm.correct) || 0,
      wrong: Number(testForm.wrong) || 0,
      skipped: Number(testForm.skipped) || 0,
    };
    setTests((prevT) => [...prevT, t]);
    setTestForm({ name: "", total: "300", scored: "", correct: "", wrong: "", skipped: "" });
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  const NAV_LINKS = [
    { id: "personalised",  label: "Personalised dashboard", desc: "Your complete 1-on-1 overview",  icon: LayoutDashboard, color: ORANGE },
    { id: "test-analysis", label: "Test analysis",          desc: "Marks → AI-analysed charts",      icon: LineIcon,        color: "#6366f1" },
    { id: "parent-report", label: "Weekly report to parents", desc: "Auto-emailed every week",       icon: Mail,            color: GREEN },
    { id: "live-tracking", label: "Live student tracking",  desc: "Daily hours, streak & tasks",     icon: Activity,        color: "#ef4444" },
  ];

  return (
    <section style={{ background: "#f8f7f5", minHeight: "100vh", paddingBottom: 70 }}>
      {/* ── Title strip just below navbar ── */}
      <div style={{ paddingTop: 104, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 12, fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: ORANGE, marginBottom: 8 }}>
          1-on-1 · Personalised
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }}
          style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.6rem)", color: NAVY, margin: 0, letterSpacing: "-0.5px" }}>
          Mentorship Dashboard
        </motion.h1>
      </div>

      {/* ══ HERO — light, animated, 3 columns (left card / mid text / right links) ══ */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 0" }}>
        <div style={{
          position: "relative", overflow: "hidden", borderRadius: 26,
          background: "linear-gradient(160deg,#fffaf5 0%,#ffffff 55%,#f3faf6 100%)",
          border: "1px solid rgba(244,123,32,.16)", padding: "10px",
          boxShadow: "0 30px 70px -40px rgba(13,27,62,.4)",
        }}>
          {/* ambient orbs */}
          <motion.div aria-hidden animate={{ opacity: [.5, .85, .5] }} transition={{ duration: 5, repeat: Infinity }}
            style={{ position: "absolute", top: -60, left: "4%", width: 320, height: 260, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,123,32,.18),transparent 65%)", pointerEvents: "none" }} />
          <motion.div aria-hidden animate={{ opacity: [.4, .7, .4] }} transition={{ duration: 6, repeat: Infinity }}
            style={{ position: "absolute", bottom: -50, right: "6%", width: 280, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(21,160,110,.16),transparent 65%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.05fr) minmax(0,1fr)", gap: 18, padding: "16px" }} className="md-hero-grid">

            {/* LEFT — user / plan card (specific padding, Home button, no edit) */}
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
                This dashboard is fully personalised and 1-on-1. Log your daily study hours and tasks,
                enter every test result, and our system analyses it automatically — turning your numbers
                into clear charts, streaks and week-on-week improvement. Your parents get a clean weekly
                report by email, so everyone stays on the same page.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                <button onClick={() => scrollTo("live-tracking")} style={{ background: `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", border: "none", padding: "12px 20px", borderRadius: 12, fontFamily: "Sora", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: `0 12px 26px -10px ${ORANGE}` }}>
                  Start tracking <ArrowRight size={16} />
                </button>
                <button onClick={() => scrollTo("test-analysis")} style={{ background: "#fff", color: NAVY, border: "1.5px solid #e5e7eb", padding: "12px 20px", borderRadius: 12, fontFamily: "Sora", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                  Add a test
                </button>
              </div>
            </motion.div>

            {/* RIGHT — links to every section on this page */}
            <motion.div initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: .12 }}
              style={{ background: "#fff", borderRadius: 20, border: "1px solid #eee", padding: "20px", boxShadow: "0 18px 40px -28px rgba(13,27,62,.4)" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".06em", margin: "2px 4px 12px" }}>Jump to</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {NAV_LINKS.map(({ id, label, desc, icon: Icon, color }) => (
                  <button key={id} onClick={() => scrollTo(id)}
                    style={{ textAlign: "left", background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "13px 14px", cursor: "pointer", display: "flex", gap: 12, alignItems: "center", transition: "box-shadow .15s, transform .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 12px 26px -14px ${color}99`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                    <span style={{ width: 40, height: 40, borderRadius: 11, background: `${color}14`, border: `1px solid ${color}30`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon size={19} color={color} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "Sora", fontWeight: 700, fontSize: 14, color: NAVY }}>{label}</span>
                      <span style={{ display: "block", fontSize: 12, color: "#9ca3af", marginTop: 1 }}>{desc}</span>
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

        {/* ── LIVE STUDENT TRACKING ── */}
        <Section id="live-tracking" kicker="Always on" title="Live Student Tracking" tColor="#ef4444"
          sub="Log your effort daily — the charts update instantly so nothing slips through the cracks.">
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, marginBottom: 20 }}>
              {[
                { icon: Clock, c: ORANGE, v: todayEntry ? `${todayEntry.hours}h` : "0h", l: "Today" },
                { icon: Activity, c: "#6366f1", v: `${Math.round(weekHours * 10) / 10}h`, l: "This week" },
                { icon: Flame, c: "#ef4444", v: `${streak} day${streak === 1 ? "" : "s"}`, l: "Streak" },
                { icon: CheckCircle2, c: "#22c55e", v: tasksLabel, l: "Tasks done" },
              ].map(({ icon: Icon, c, v, l }) => (
                <div key={l} style={{ background: "#fff", border: "1px solid rgba(244,123,32,.16)", borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
                  <Icon size={18} color={c} style={{ marginBottom: 6 }} />
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, color: INK }}>{v}</div>
                  <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* log today's effort */}
            <form onSubmit={addLog} style={{ background: "#fffaf5", border: "1px solid rgba(244,123,32,.22)", borderRadius: 14, padding: "14px 16px", marginBottom: 22, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#9a3412", width: "100%" }}>Log today ({fmtDay(todayIso)})</div>
              <NumField label="Study hours" value={logForm.hours} onChange={(v) => setLogForm((s) => ({ ...s, hours: v }))} placeholder="e.g. 6" />
              <NumField label="Tasks done" value={logForm.tasksDone} onChange={(v) => setLogForm((s) => ({ ...s, tasksDone: v }))} placeholder="e.g. 18" />
              <NumField label="Tasks planned" value={logForm.tasksTotal} onChange={(v) => setLogForm((s) => ({ ...s, tasksTotal: v }))} placeholder="e.g. 21" />
              <button type="submit" style={{ padding: "11px 18px", borderRadius: 11, border: "none", background: `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}>
                <Plus size={15} /> Save
              </button>
            </form>

            {/* weekly hours bars + goal gauge */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: 22, alignItems: "center" }} className="md-track-grid">
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: MUTE, marginBottom: 10 }}>Study hours · last 7 days</div>
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

        {/* ── TEST ANALYSIS ── */}
        <Section id="test-analysis" kicker="Every test counts" title="Test Analysis" tColor="#6366f1"
          sub="Enter your marks and question split — we analyse accuracy, score and week-on-week change automatically.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
            {/* left — input + improvement */}
            <div style={{ background: "#fff", border: "1px solid rgba(99,102,241,.18)", borderRadius: 20, padding: "22px 22px 20px", boxShadow: "0 18px 44px -28px rgba(26,26,46,.4)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#6366f1,#22c55e)" }} />
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.1rem", color: INK, margin: "0 0 14px" }}>Add a test result</h3>
              <form onSubmit={addTest} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <TextField label="Test name" value={testForm.name} onChange={(v) => setTestForm((s) => ({ ...s, name: v }))} placeholder="e.g. Mock 4" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <NumField label="Total marks" value={testForm.total} onChange={(v) => setTestForm((s) => ({ ...s, total: v }))} placeholder="300" full />
                  <NumField label="Marks scored" value={testForm.scored} onChange={(v) => setTestForm((s) => ({ ...s, scored: v }))} placeholder="178" full />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <NumField label="Correct" value={testForm.correct} onChange={(v) => setTestForm((s) => ({ ...s, correct: v }))} placeholder="64" full />
                  <NumField label="Wrong" value={testForm.wrong} onChange={(v) => setTestForm((s) => ({ ...s, wrong: v }))} placeholder="14" full />
                  <NumField label="Skipped" value={testForm.skipped} onChange={(v) => setTestForm((s) => ({ ...s, skipped: v }))} placeholder="12" full />
                </div>
                <button type="submit" style={{ marginTop: 4, padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Plus size={16} /> Analyse this test
                </button>
              </form>

              {/* AI insight */}
              {latest && (
                <div style={{ marginTop: 16, background: improvement == null ? "#f8fafc" : improvement >= 0 ? "#f0faf4" : "#fef2f2", border: `1px solid ${improvement == null ? "#e5e7eb" : improvement >= 0 ? "#bbf7d0" : "#fecaca"}`, borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    {improvement == null ? <BarChart3 size={16} color="#64748b" />
                      : improvement >= 0 ? <TrendingUp size={16} color="#16a34a" /> : <TrendingDown size={16} color="#dc2626" />}
                    <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, color: INK }}>
                      {latest.name} · {Math.round((Number(latest.scored) / Math.max(1, Number(latest.total))) * 100)}% · {acc(latest)}% accuracy
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
            </div>

            {/* right — charts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <ChartCard title="Score trend" hint="Your marks across every test" accent="#6366f1">
                <Trend data={scoreTrend} lines={[{ key: "you", label: "You", color: ORANGE }, { key: "target", label: "Target (75%)", color: "#6366f1" }]} height={210} />
              </ChartCard>
              <ChartCard title={`Latest test split — ${latest ? latest.name : "—"}`} hint="Correct · Wrong · Skipped" accent="#22c55e">
                {latestBreakdown.length
                  ? <PieWithLegend data={latestBreakdown} colors={["#22c55e", "#ef4444", "#9ca3af"]} height={200} />
                  : <div style={{ color: "#9ca3af", fontSize: 13, padding: "30px 0", textAlign: "center" }}>Add a test to see the breakdown.</div>}
              </ChartCard>
            </div>
          </div>
        </Section>

        {/* ── PERSONALISED DASHBOARD (overview) ── */}
        <Section id="personalised" kicker="Proof, not promises" title="Personalised Dashboard" tColor={ORANGE}
          sub="A single overview your mentor and parents can see — updated from your own data.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
            {[
              { v: latest ? `${latest.scored}/${latest.total}` : "—", l: "Latest score", c: ORANGE },
              { v: latest ? `${acc(latest)}%` : "—", l: "Accuracy", c: "#22c55e" },
              { v: improvement == null ? "—" : `${improvement >= 0 ? "+" : ""}${improvement}%`, l: "Since last test", c: improvement != null && improvement < 0 ? "#ef4444" : "#6366f1" },
              { v: `${streak}`, l: "Day study streak", c: "#ef4444" },
            ].map((s) => (
              <motion.div key={s.l} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "20px", borderTop: `3px solid ${s.c}`, boxShadow: "0 14px 36px -28px rgba(13,27,62,.4)" }}>
                <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 26, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 13, color: MUTE, fontWeight: 600, marginTop: 2 }}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── WEEKLY REPORT TO PARENTS ── */}
        <Section id="parent-report" kicker="Parents stay in the loop" title="Weekly Report to Parents" tColor={GREEN}
          sub="Every week, a clean summary of your effort and test results is emailed to your parent automatically.">
          <div style={{ background: "#fff", border: `1px solid ${GREEN}33`, borderRadius: 20, padding: "26px 24px", boxShadow: `0 20px 46px -30px ${GREEN}99`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${GREEN},#22c55e)` }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22, alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, color: "#15803d", background: "#dcfce7", padding: "6px 13px", borderRadius: 50, marginBottom: 14 }}>
                  <Mail size={14} /> Auto-emailed every week
                </div>
                <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.2rem", color: INK, margin: "0 0 8px" }}>Your parents never miss a week</h3>
                <p style={{ color: MUTE, fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                  We send a simple, jargon-free report — study hours, streak, tasks completed, latest test
                  score and improvement — to the parent email you gave at enrolment. You’ll also get a weekly
                  nudge to keep your numbers up to date.
                </p>
              </div>
              <div style={{ background: "#f0faf4", border: `1px solid ${GREEN}33`, borderRadius: 16, padding: "18px 20px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: MUTE, marginBottom: 10 }}>This week’s summary</div>
                {[
                  { l: "Study hours", v: `${Math.round(weekHours * 10) / 10} h` },
                  { l: "Day streak", v: `${streak} days` },
                  { l: "Tasks", v: tasksLabel },
                  { l: "Latest test", v: latest ? `${latest.scored}/${latest.total} (${acc(latest)}%)` : "—" },
                  { l: "Change vs last test", v: improvement == null ? "—" : `${improvement >= 0 ? "+" : ""}${improvement}%` },
                ].map((r) => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
                    <span style={{ fontSize: 13, color: "#374151" }}>{r.l}</span>
                    <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: NAVY }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .md-hero-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .md-track-grid { grid-template-columns: 1fr !important; }
        }
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
    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280" }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box" }}
        onFocus={(e) => { e.target.style.borderColor = ORANGE; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
    </label>
  );
}
