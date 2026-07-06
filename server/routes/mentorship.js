// ─────────────────────────────────────────────────────────────────────────────
// Mentorship routes — student-triggered DAILY and WEEKLY parent reports.
//
// The live tracking / test / backlog data lives in the student's browser
// (localStorage), so this endpoint lets the logged-in student push a composed
// report to the parent email on their mentorship enrolment:
//   • kind "weekly" — study hours, tests, weak/medium/strong chapters, weekly
//     task list (auto-sent every Sunday from the client, or any time on demand)
//   • kind "daily"  — today's per-subject hours & tasks, routine and any test
//     (sent on demand, or auto-sent daily if the student enables it)
// It's best-effort and dev-safe: in OTP_DEV_MODE the mailer only logs.
// ─────────────────────────────────────────────────────────────────────────────
import express from "express";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import MentorTask from "../models/MentorTask.js";
import MentorProgress from "../models/MentorProgress.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

const esc = (s) => String(s ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
const cap = (arr, n = 40) => (Array.isArray(arr) ? arr.slice(0, n) : []);

const shell = (inner) => `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1c1c28">
  <h2 style="color:#F47B20;margin:0 0 6px">CollegeParichay Mentorship</h2>${inner}
  <p style="color:#9aa0aa;font-size:12px;margin-top:18px">You're receiving this because of a mentorship enrolment on CollegeParichay.</p>
</div>`;

const row = (l, v) => `<tr><td style="padding:7px 0;color:#374151;font-size:14px">${esc(l)}</td><td style="padding:7px 0;text-align:right;font-weight:700;color:#0d1b3e;font-size:14px">${esc(v)}</td></tr>`;

const chapterBlock = (title, color, items) => {
  const list = cap(items);
  if (!list.length) return "";
  return `<div style="margin:10px 0">
    <div style="font-size:13px;font-weight:700;color:${color};margin-bottom:6px">${esc(title)} (${list.length})</div>
    <div>${list.map((c) => `<span style="display:inline-block;background:${color}14;border:1px solid ${color}40;color:${color};border-radius:20px;padding:3px 10px;font-size:12px;margin:0 6px 6px 0">${esc(c)}</span>`).join("")}</div>
  </div>`;
};

// Predicted JEE rank block — included in both daily & weekly reports when the
// student has logged a JEE Main/Advanced test (so parents see the live standing).
const rankBlock = (rank) => {
  if (!rank) return "";
  const rows = [
    ["Marks scored", rank.marks],
    [rank.exam === "JEE Advanced" ? "Predicted CRL range" : "Predicted All-India CRL", rank.crl],
    rank.band ? ["Likely rank band", rank.band] : null,
    rank.percentile != null ? ["Percentile", rank.percentile] : null,
    rank.categoryRank ? ["Category rank", rank.categoryRank] : null,
  ].filter(Boolean);
  return `<div style="margin-top:14px;border-top:1px solid #eee;padding-top:10px">
    <div style="font-size:14px;font-weight:800;color:#6d28d9;margin-bottom:4px">🏆 Predicted ${esc(rank.exam)} 2026 rank${rank.testName ? ` · ${esc(rank.testName)}` : ""}</div>
    <table style="width:100%;border-collapse:collapse">${rows.map(([l, v]) => row(l, v)).join("")}</table>
    <div style="font-size:11px;color:#9aa0aa;margin-top:4px">Estimate only — actual rank depends on official normalisation & shift difficulty.</div>
  </div>`;
};

function buildWeeklyHtml(studentName, r, link) {
  const s = r.stats || {};
  const ch = r.chapters || {};
  const tasks = cap(r.weeklyTasks, 30);
  const taskHtml = tasks.length
    ? `<div style="margin-top:14px"><div style="font-size:13px;font-weight:700;color:#1c1c28;margin-bottom:6px">This week's task list</div>${tasks.map((t) => `<div style="font-size:13px;color:#374151;padding:3px 0">${t.done ? "✅" : "⬜"} ${esc(t.text)}</div>`).join("")}</div>`
    : "";
  return shell(`
    <p style="font-size:15px;color:#374151;line-height:1.6">Namaste, here is this week's progress report for <b>${esc(studentName)}</b>.</p>
    <table style="width:100%;border-collapse:collapse;margin:8px 0 4px">
      ${row("Study hours this week", `${s.hours ?? "—"} h`)}
      ${row("Day streak", `${s.streak ?? "—"} days`)}
      ${row("Routine kept", `${s.routinePct ?? "—"}%`)}
      ${row("Tasks", s.tasks ?? "—")}
      ${row("Latest test", s.latestTest ?? "—")}
      ${row("Change vs last test", s.improvement ?? "—")}
      ${row("Backlog cleared", s.backlog ?? "—")}
    </table>
    <div style="margin-top:14px;border-top:1px solid #eee;padding-top:10px">
      <div style="font-size:14px;font-weight:800;color:#1c1c28;margin-bottom:4px">Chapter strength report</div>
      ${chapterBlock("Weak chapters", "#dc2626", ch.weak)}
      ${chapterBlock("Medium chapters", "#d97706", ch.medium)}
      ${chapterBlock("Strong chapters", "#16a34a", ch.strong)}
      ${(!cap(ch.weak).length && !cap(ch.medium).length && !cap(ch.strong).length) ? `<div style="font-size:13px;color:#6b7280">No chapters logged yet.</div>` : ""}
    </div>
    ${rankBlock(r.rank)}
    ${taskHtml}
    ${link ? `<a href="${esc(link)}" style="display:inline-block;margin:18px 0 4px;background:#F47B20;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:10px">Open the dashboard</a>` : ""}`);
}

function buildDailyHtml(studentName, r, link) {
  const d = r.daily || {};
  const subs = cap(d.subjects, 12);
  const subHtml = subs.length
    ? `<div style="margin-top:6px">${subs.map((x) => `<div style="display:flex;justify-content:space-between;font-size:13px;color:#374151;padding:4px 0;border-bottom:1px solid #f1f1f1"><span>${esc(x.name)}</span><span style="font-weight:700;color:#0d1b3e">${esc(x.h)}h · ${esc(x.t)} tasks</span></div>`).join("")}</div>`
    : `<div style="font-size:13px;color:#6b7280">No subjects logged today.</div>`;
  return shell(`
    <p style="font-size:15px;color:#374151;line-height:1.6">Namaste, here is today's report (${esc(r.date || "")}) for <b>${esc(studentName)}</b>.</p>
    <table style="width:100%;border-collapse:collapse;margin:8px 0 4px">
      ${row("Total hours today", `${d.hours ?? 0} h`)}
      ${row("Tasks completed", `${d.tasksDone ?? 0} / ${d.tasksTotal ?? 0}`)}
      ${row("Routine", d.routine ? "Followed ✓" : "Missed")}
      ${d.todayTest ? row("Test today", d.todayTest) : ""}
    </table>
    <div style="margin-top:12px;border-top:1px solid #eee;padding-top:10px">
      <div style="font-size:14px;font-weight:800;color:#1c1c28;margin-bottom:2px">Subject-wise study today</div>
      ${subHtml}
    </div>
    ${rankBlock(r.rank)}
    ${link ? `<a href="${esc(link)}" style="display:inline-block;margin:18px 0 4px;background:#F47B20;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:10px">Open the dashboard</a>` : ""}`);
}

// Backlog alert — sent when chapters pass their target date unfinished or study
// is irregular, so the parent knows their child is falling behind.
function buildBacklogHtml(studentName, r, link) {
  const b = r.backlog || {};
  const overdue = cap(b.overdue, 20);
  const overdueHtml = overdue.length
    ? `<div style="margin-top:8px">${overdue.map((x) => `<div style="font-size:13px;color:#374151;padding:5px 0;border-bottom:1px solid #f1f1f1"><span style="color:#dc2626;font-weight:700">⏰ ${esc(x.topic)}</span> <span style="color:#9aa0aa">(${esc(x.subject)}${x.date ? ` · target ${esc(x.date)}` : ""})</span></div>`).join("")}</div>`
    : "";
  const reasons = [];
  if (overdue.length) reasons.push(`${overdue.length} chapter${overdue.length === 1 ? "" : "s"} past the planned target date`);
  if (b.irregular) reasons.push(`irregular study (current streak ${b.streak ?? 0} day${b.streak === 1 ? "" : "s"}, routine kept ${b.routinePct ?? 0}%)`);
  const reasonLine = reasons.length ? reasons.join(" and ") : "the backlog is not being cleared on schedule";
  return shell(`
    <p style="font-size:15px;color:#374151;line-height:1.6">Namaste, this is a heads-up about <b>${esc(studentName)}</b>'s preparation.</p>
    <div style="background:#fff7ed;border:1px solid #fdba74;border-radius:10px;padding:12px 14px;margin:10px 0">
      <div style="font-size:14px;font-weight:800;color:#c2410c;margin-bottom:4px">⚠️ Falling behind on the backlog</div>
      <div style="font-size:13.5px;color:#7c2d12;line-height:1.6">${esc(studentName)} could not complete the planned backlog and is not keeping a regular study routine — ${esc(reasonLine)}. A little nudge from you will help them get back on track.</div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:8px 0 4px">
      ${row("Backlog cleared", `${b.cleared ?? 0} / ${b.total ?? 0} (${b.pct ?? 0}%)`)}
      ${row("Overdue chapters", overdue.length)}
      ${row("Day streak", `${b.streak ?? 0} days`)}
      ${row("Routine kept", `${b.routinePct ?? 0}%`)}
      ${row("Study hours this week", `${b.hoursThisWeek ?? 0} h`)}
    </table>
    ${overdue.length ? `<div style="margin-top:12px"><div style="font-size:14px;font-weight:800;color:#1c1c28;margin-bottom:2px">Overdue chapters</div>${overdueHtml}</div>` : ""}
    ${link ? `<a href="${esc(link)}" style="display:inline-block;margin:18px 0 4px;background:#F47B20;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:10px">See full progress</a>` : ""}`);
}

const siteOrigin = () =>
  (process.env.CLIENT_ORIGIN || "").split(",")[0].trim() || "https://collegeparichay.in";

const KINDS = new Set(["daily", "weekly", "backlog"]);

router.post("/parent-report", requireAuth, async (req, res) => {
  try {
    const kind = KINDS.has(req.body?.kind) ? req.body.kind : "weekly";
    const user = await User.findById(req.user.id).select("email name").lean();
    if (!user?.email) return res.status(400).json({ error: "No account email found." });
    const email = user.email.toLowerCase();

    // A student in more than one batch can target a specific plan; only honour
    // it when they actually own it, else fall back to the most recent batch.
    const requested = String(req.body?.plan || "").trim();
    let enr = null;
    if (/^mentor-/.test(requested)) {
      enr = await Enrollment.findOne({ status: "paid", email, plan: requested }).sort({ createdAt: -1 }).lean();
    }
    if (!enr) {
      enr = await Enrollment.findOne({
        status: "paid",
        email,
        plan: { $regex: /^mentor-/ },
      }).sort({ createdAt: -1 }).lean();
    }

    if (!enr) return res.status(404).json({ error: "No active mentorship enrolment found." });
    if (!enr.parentEmail) return res.status(400).json({ error: "No parent email is on file for your enrolment yet — please contact us to add one." });

    const report = req.body?.report || {};
    const studentName = enr.name || user.name || "your child";
    const link = `${siteOrigin()}/mentorship-dashboard`;

    const html = kind === "daily" ? buildDailyHtml(studentName, report, link)
      : kind === "backlog" ? buildBacklogHtml(studentName, report, link)
      : buildWeeklyHtml(studentName, report, link);
    const subject = kind === "daily" ? `Daily mentorship update — ${studentName}`
      : kind === "backlog" ? `Action needed — ${studentName} is behind on their backlog`
      : `Weekly mentorship report — ${studentName}`;

    // Respond immediately and send in the background so the dashboard isn't
    // blocked on Brevo (which can take several seconds). dev flag mirrors mailer.
    const dev = process.env.OTP_DEV_MODE !== "false" || !process.env.BREVO_API_KEY;
    res.json({ sent: true, queued: true, dev, to: enr.parentEmail, kind });

    sendMail({ to: enr.parentEmail, subject, html, text: `${subject}. Open the dashboard: ${link}` })
      .then((out) => {
        if (!out.ok) { console.error("[mentorship/parent-report] send failed:", out.error); return; }
        // Weekly + backlog alerts advance the cron cadence stamp.
        if (kind === "weekly" || kind === "backlog") {
          Enrollment.updateOne({ _id: enr._id }, { $set: { lastParentReportAt: new Date() } }).catch(() => {});
        }
      })
      .catch((e) => console.error("[mentorship/parent-report] send error:", e?.message || e));
  } catch (e) {
    console.error("[mentorship/parent-report]", e?.message || e);
    if (!res.headersSent) res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Mentor-assigned weekly tasks — the admin sets a short task list against a
// student ID (CP-2026-00042); the student's dashboard shows them as suggested
// fix-list items and rolls them into the weekly parent report.
// ─────────────────────────────────────────────────────────────────────────────

// Accept either plain strings or {text} objects; trim, drop blanks, cap at 20.
const sanitizeTasks = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .map((t) => (typeof t === "string" ? t : t?.text))
    .map((s) => String(s || "").trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((text, i) => ({ id: `mt-${Date.now()}-${i}`, text }));

// Admin — look up a student by ID and fetch their current mentor task list.
router.get("/admin/tasks/:studentId", requireAdmin, async (req, res) => {
  try {
    const studentId = String(req.params.studentId || "").trim().toUpperCase();
    if (!studentId) return res.status(400).json({ error: "Student ID required" });
    const enr = await Enrollment.findOne({ studentId, plan: { $regex: /^mentor-/ } }).sort({ createdAt: -1 }).lean();
    const doc = await MentorTask.findOne({ studentId }).lean();
    res.json({
      studentId,
      found: !!enr,
      student: enr ? { name: enr.name, plan: enr.plan, email: enr.email, targetExam: enr.targetExam } : null,
      tasks: doc?.tasks || [],
    });
  } catch (e) {
    console.error("[mentorship/admin/tasks GET]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin — replace a student's mentor task list (upsert).
router.put("/admin/tasks/:studentId", requireAdmin, async (req, res) => {
  try {
    const studentId = String(req.params.studentId || "").trim().toUpperCase();
    if (!studentId) return res.status(400).json({ error: "Student ID required" });
    const tasks = sanitizeTasks(req.body?.tasks);
    const doc = await MentorTask.findOneAndUpdate(
      { studentId },
      { studentId, tasks },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    res.json({ ok: true, studentId, tasks: doc.tasks });
  } catch (e) {
    console.error("[mentorship/admin/tasks PUT]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Student — their mentor-assigned tasks for the batch they're viewing. Only
// served for a student ID the caller actually owns (a paid enrolment on their
// account), so tasks never leak across students.
router.get("/my-tasks", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email").lean();
    const email = (user?.email || "").toLowerCase();
    const studentId = String(req.query.studentId || "").trim().toUpperCase();
    if (!email || !studentId) return res.json({ tasks: [] });
    const owns = await Enrollment.exists({ studentId, email, status: "paid" });
    if (!owns) return res.json({ tasks: [] });
    const doc = await MentorTask.findOne({ studentId }).lean();
    res.json({ tasks: doc?.tasks || [] });
  } catch (e) {
    console.error("[mentorship/my-tasks]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Cross-device dashboard sync — the student's study data (daily logs, tests,
// backlog, weekly tasks, prefs) is stored per account + plan so every device
// they sign in from shows the same thing (localStorage alone is per-browser).
// ─────────────────────────────────────────────────────────────────────────────

router.get("/progress", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email").lean();
    const email = (user?.email || "").toLowerCase();
    const plan = String(req.query.plan || "default").trim();
    if (!email) return res.json({ data: null });
    const doc = await MentorProgress.findOne({ email, plan }).lean();
    res.json({ data: doc?.data ?? null, updatedAt: doc?.updatedAt || null });
  } catch (e) {
    console.error("[mentorship/progress GET]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/progress", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email").lean();
    const email = (user?.email || "").toLowerCase();
    const plan = String(req.query.plan || "default").trim();
    if (!email) return res.status(400).json({ error: "No account email" });
    const data = req.body?.data;
    if (data == null || typeof data !== "object") return res.status(400).json({ error: "Invalid data" });
    const doc = await MentorProgress.findOneAndUpdate(
      { email, plan },
      { email, plan, data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    res.json({ ok: true, updatedAt: doc.updatedAt });
  } catch (e) {
    console.error("[mentorship/progress PUT]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
