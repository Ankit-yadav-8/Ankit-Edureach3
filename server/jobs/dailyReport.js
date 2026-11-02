// ─────────────────────────────────────────────────────────────────────────────
// Daily parent-report job.
//
// Sends a complete daily study report to the parent every morning between
// 10:00 AM and 10:30 AM IST for the PREVIOUS calendar day (e.g. on 2 Nov at
// 10:00 AM, it compiles 1 Nov's full-day study hours, tasks, routine and tests).
//
// This gives students the entire day until midnight to update their dashboard,
// allowing parents to comfortably review their child's completed previous-day
// progress every morning with breakfast.
//
// Coordination: stamps `lastDailyReportAt` on the enrolment for today, ensuring
// exactly one automated daily email per enrolment per morning.
//
// Best-effort & dev-safe: without a Brevo key (or with OTP_DEV_MODE=true),
// sendMail only logs, so nothing real is sent locally.
// ─────────────────────────────────────────────────────────────────────────────
import Enrollment from "../models/Enrollment.js";
import MentorProgress from "../models/MentorProgress.js";
import { sendMail } from "../utils/mailer.js";
import { buildDailyHtml } from "../routes/mentorship.js";

const siteOrigin = () =>
  (process.env.CLIENT_ORIGIN || "").split(",")[0].trim() || "https://campuspoint.in";

// Calendar date in Indian Standard Time (YYYY-MM-DD)
export const todayIsoIST = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

export const todayIsoUTC = todayIsoIST; // Backward compatibility alias

// Previous calendar date in Indian Standard Time (YYYY-MM-DD)
export function yesterdayIsoIST() {
  const istStr = todayIsoIST();
  const [y, m, d] = istStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
}

// Format YYYY-MM-DD as e.g. "01 Nov 2026"
export function fmtDay(iso) {
  if (!iso) return "";
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(d).padStart(2, "0")} ${months[m - 1]} ${y}`;
}

const inr = (n) => Number(n || 0).toLocaleString("en-IN");

const SHORT = {
  Physics: "Phy", "Physical Chemistry": "P.Chem", "Organic Chemistry": "O.Chem",
  "Inorganic Chemistry": "I.Chem", Chemistry: "Chem", Maths: "Math", Biology: "Bio", Science: "Sci",
};
const shortName = (s) => SHORT[s] || s;

function subVal(entry, name) {
  const v = entry?.subjects?.[name];
  if (v == null) return { h: 0, t: 0 };
  if (typeof v === "number") return { h: v, t: 0 };
  return { h: Number(v.h) || 0, t: Number(v.t) || 0 };
}

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

// Build the daily report object from a MentorProgress data blob for a target date
export function buildDailyR(data, targetIso) {
  const iso = targetIso || yesterdayIsoIST();
  const entries = Array.isArray(data?.entries) ? data.entries : [];
  const tests = Array.isArray(data?.tests) ? data.tests : [];
  const dayEntry = entries.find((e) => e.date === iso);
  const names = dayEntry?.subjects ? Object.keys(dayEntry.subjects) : [];
  const subjects = names.map((name) => {
    const { h, t } = subVal(dayEntry, name);
    return { name: shortName(name), h, t };
  });
  const dayTest = tests.find((t) => t.date === iso);

  // If the student has no entry for that day, or hours=0 with no subjects/tasks,
  // mark the report as "not updated" so the email alerts the parent of irregularity.
  const notUpdated = !dayEntry || ((dayEntry.hours ?? 0) === 0 && names.length === 0 && (dayEntry.tasksDone ?? 0) === 0);

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
    targetIso: iso,
    notUpdated,
    daily: {
      hours: dayEntry?.hours ?? 0,
      subjects,
      tasksDone: dayEntry?.tasksDone ?? 0,
      tasksTotal: dayEntry?.tasksTotal ?? 0,
      routine: !!dayEntry?.routine,
      todayTest: dayTest ? `${dayTest.name}: ${dayTest.scored}/${dayTest.total}` : null,
    },
    latestTest,
    prevTest,
    improvement: improvementPct,
    rank: buildRankSummary(tests),
  };
}

export function isDailyReportWindowIST() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value || 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value || 0);
  // Send every morning between 10:00 AM and 10:30 AM IST (window extends to 10:35 for interval tick coverage)
  return hour === 10 && minute <= 35;
}

export async function runOnce(force = false) {
  // Check if current time is within the morning 10:00 AM to 10:30 AM IST window
  if (!force && process.env.FORCE_DAILY_REPORT !== "true" && !isDailyReportWindowIST()) {
    return;
  }

  const todayIso = todayIsoIST();
  const yesterdayIso = yesterdayIsoIST();
  const formattedDay = fmtDay(yesterdayIso);
  const startOfDay = new Date(`${todayIso}T00:00:00+05:30`);

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
      // Only report for students who have actually used the dashboard
      const prog = await MentorProgress.findOne({ email: (enr.email || "").toLowerCase(), plan: enr.plan }).lean();
      if (!prog) continue;

      const r = buildDailyR(prog.data || {}, yesterdayIso);
      const studentName = enr.name || "Student";
      const subject = `Daily mentorship report (${formattedDay}) — ${studentName}`;

      const out = await sendMail({
        to: enr.parentEmail,
        subject,
        html: buildDailyHtml(studentName, r, link),
        text: `Daily mentorship report (${formattedDay}) for ${studentName}. Open the dashboard: ${link}`,
      });

      if (out.ok) {
        // Also send copy to student if different from parent email
        if (enr.email && enr.email.toLowerCase() !== (enr.parentEmail || "").toLowerCase()) {
          sendMail({
            to: enr.email,
            subject: `Your daily mentorship report (${formattedDay}) — CampusPoint`,
            html: buildDailyHtml(studentName, r, link),
            text: `Daily mentorship report (${formattedDay}) for ${studentName}. Open the dashboard: ${link}`,
          }).catch((err) => console.error(`[dailyReport] student copy ${enr.email}:`, err.message));
        }

        enr.lastDailyReportAt = new Date();
        await enr.save();
        sent++;
      }
    } catch (e) {
      console.error(`[dailyReport] ${enr._id}:`, e.message);
    }
  }
  if (sent) console.log(`[dailyReport] sent previous day (${formattedDay}) daily reports for ${sent} enrolment(s)`);
}

export function startDailyReportJob() {
  const tick = () => runOnce().catch((e) => console.error("[dailyReport]", e.message));
  setTimeout(tick, 90 * 1000);        // first pass ~1.5 min after boot
  setInterval(tick, 5 * 60 * 1000);   // check every 5 min; reliably catches the 10:00–10:30 AM IST window
}
