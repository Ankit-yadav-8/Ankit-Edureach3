// ─────────────────────────────────────────────────────────────────────────────
// Daily parent-report job.
//
// Sends a real numeric daily report to the parent every day — even if the
// student never opens the dashboard that day (it just shows 0h). Now that the
// student's tracking data is synced server-side (MentorProgress), this builds
// the same daily email the client sends, straight from that data.
//
// Coordination with the client: the client's own daily auto-send stamps
// `lastDailyReportAt` on the enrolment, and this job only sends when that stamp
// is older than the start of today — so a student who already opened the app
// (and triggered the client send) is skipped, avoiding duplicate emails.
//
// Best-effort & dev-safe: without a Brevo key (or with OTP_DEV_MODE=true),
// sendMail only logs, so nothing real is sent locally.
// ─────────────────────────────────────────────────────────────────────────────
import Enrollment from "../models/Enrollment.js";
import MentorProgress from "../models/MentorProgress.js";
import { sendMail } from "../utils/mailer.js";
import { buildDailyHtml } from "../routes/mentorship.js";

const siteOrigin = () =>
  (process.env.CLIENT_ORIGIN || "").split(",")[0].trim() || "https://collegeparichay.in";

// Match the client's isoDay (UTC date) so the "today" lookup and the dedupe
// stamp line up across the browser and this job.
const todayIsoUTC = () => new Date().toISOString().slice(0, 10);
const fmtDay = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const inr = (n) => Number(n || 0).toLocaleString("en-IN");

const SHORT = {
  Physics: "Phy", "Physical Chemistry": "P.Chem", "Organic Chemistry": "O.Chem",
  "Inorganic Chemistry": "I.Chem", Chemistry: "Chem", Maths: "Math", Biology: "Bio", Science: "Sci",
};
const shortName = (s) => SHORT[s] || s;

// today's per-subject hours/tasks — tolerant of the old number-only shape
function subVal(entry, name) {
  const v = entry?.subjects?.[name];
  if (v == null) return { h: 0, t: 0 };
  if (typeof v === "number") return { h: v, t: 0 };
  return { h: Number(v.h) || 0, t: Number(v.t) || 0 };
}

// Latest ranked test → the compact rank block shape buildDailyHtml expects.
function buildRankSummary(tests) {
  const ranked = [...(tests || [])].reverse().find((t) => t?.rank?.ranked);
  if (!ranked) return null;
  const r = ranked.rank;
  return {
    exam: r.advanced ? "JEE Advanced" : "JEE Main",
    testName: ranked.name || null,
    marks: r.total,
    crl: r.advanced ? `${inr(r.crlLo ?? r.low)} – ${inr(r.crlHi ?? r.high)}` : inr(r.crl),
    band: r.advanced ? null : `${inr(r.low)} – ${inr(r.high)}`,
    percentile: !r.advanced && r.percentile != null ? r.percentile : null,
    categoryRank: !r.isGeneral && r.categoryRank ? `${r.category}: ${inr(r.categoryRank)}` : null,
  };
}

// Build the daily report object from a MentorProgress data blob — mirrors the
// client's buildDailyReport() so the emailed report is identical.
function buildDailyR(data) {
  const iso = todayIsoUTC();
  const entries = Array.isArray(data?.entries) ? data.entries : [];
  const tests = Array.isArray(data?.tests) ? data.tests : [];
  const today = entries.find((e) => e.date === iso);
  const names = today?.subjects ? Object.keys(today.subjects) : [];
  const subjects = names.map((name) => {
    const { h, t } = subVal(today, name);
    return { name: shortName(name), h, t };
  });
  const todayTest = tests.find((t) => t.date === iso);

  // If the student has no entry for today, or hours=0 with no subjects/tasks,
  // mark the report as "not updated" so the email shows an irregularity warning.
  const notUpdated = !today || ((today.hours ?? 0) === 0 && names.length === 0 && (today.tasksDone ?? 0) === 0);

  // ── Latest test analysis with improvement vs previous test ──────────────
  const sortedTests = [...tests].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const latestT = sortedTests[sortedTests.length - 1] || null;
  const prevT = sortedTests[sortedTests.length - 2] || null;
  const pctOf = (t) => t && Number(t.total) > 0 ? Math.round((Number(t.scored) / Number(t.total)) * 100) : null;
  const accOf = (t) => { const att = Number(t?.correct || 0) + Number(t?.wrong || 0); return att ? Math.round((Number(t.correct) / att) * 100) : null; };
  const improvementPct = latestT && prevT && Number(prevT.scored) > 0
    ? Math.round(((Number(latestT.scored) - Number(prevT.scored)) / Number(prevT.scored)) * 100)
    : null;

  const latestTest = latestT ? {
    name: latestT.name || "Test", scored: Number(latestT.scored) || 0, total: Number(latestT.total) || 0,
    pct: pctOf(latestT), accuracy: accOf(latestT), date: fmtDay(latestT.date),
    correct: Number(latestT.correct || 0), wrong: Number(latestT.wrong || 0), skipped: Number(latestT.skipped || 0),
  } : null;
  const prevTest = prevT ? {
    name: prevT.name || "Test", scored: Number(prevT.scored) || 0, total: Number(prevT.total) || 0,
    pct: pctOf(prevT), accuracy: accOf(prevT),
  } : null;

  return {
    date: fmtDay(iso),
    notUpdated,
    daily: {
      hours: today?.hours ?? 0,
      subjects,
      tasksDone: today?.tasksDone ?? 0,
      tasksTotal: today?.tasksTotal ?? 0,
      routine: !!today?.routine,
      todayTest: todayTest ? `${todayTest.name}: ${todayTest.scored}/${todayTest.total}` : null,
    },
    latestTest,
    prevTest,
    improvement: improvementPct,
    rank: buildRankSummary(tests),
  };
}

async function runOnce() {
  // Send late at night so the report reflects the full day. The server clock
  // is UTC; 17:00 UTC ≈ 22:30 IST (10:30 PM). Reports send between ~10:30 PM
  // and ~12:30 AM IST. (Runs are cheap before then — they just return early.)
  if (new Date().getUTCHours() < 17) return;

  const startOfDay = new Date(`${todayIsoUTC()}T00:00:00.000Z`);
  const due = await Enrollment.find({
    status: "paid",
    plan: { $regex: /^mentor-/ },
    parentEmail: { $nin: ["", null] },
    $or: [{ lastDailyReportAt: null }, { lastDailyReportAt: { $lt: startOfDay } }],
  }).limit(200);

  let sent = 0;
  const link = `${siteOrigin()}/mentorship-dashboard`;
  for (const enr of due) {
    try {
      // Only report for students who have actually used the dashboard — don't
      // email parents of enrolments that never synced any data.
      const prog = await MentorProgress.findOne({ email: (enr.email || "").toLowerCase(), plan: enr.plan }).lean();
      if (!prog) continue;

      const r = buildDailyR(prog.data || {});
      const out = await sendMail({
        to: enr.parentEmail,
        subject: `Daily mentorship update — ${enr.name}`,
        html: buildDailyHtml(enr.name || "your child", r, link),
        text: `Daily mentorship update for ${enr.name}. Open the dashboard: ${link}`,
      });
      if (out.ok) {
        enr.lastDailyReportAt = new Date();
        await enr.save();
        sent++;
      }
    } catch (e) {
      console.error(`[dailyReport] ${enr._id}:`, e.message);
    }
  }
  if (sent) console.log(`[dailyReport] sent daily reports for ${sent} enrolment(s)`);
}

export function startDailyReportJob() {
  const tick = () => runOnce().catch((e) => console.error("[dailyReport]", e.message));
  setTimeout(tick, 90 * 1000);            // first pass ~1.5 min after boot
  setInterval(tick, 60 * 60 * 1000);      // then every hour for precise 11 PM IST window; each enrolment fires ≤ once/day
}
