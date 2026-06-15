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
import { requireAuth } from "../middleware/auth.js";
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
    ${link ? `<a href="${esc(link)}" style="display:inline-block;margin:18px 0 4px;background:#F47B20;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:10px">Open the dashboard</a>` : ""}`);
}

const siteOrigin = () =>
  (process.env.CLIENT_ORIGIN || "").split(",")[0].trim() || "https://collegeparichay.in";

router.post("/parent-report", requireAuth, async (req, res) => {
  try {
    const kind = req.body?.kind === "daily" ? "daily" : "weekly";
    const user = await User.findById(req.user.id).select("email name").lean();
    if (!user?.email) return res.status(400).json({ error: "No account email found." });

    const enr = await Enrollment.findOne({
      status: "paid",
      email: user.email.toLowerCase(),
      plan: { $regex: /^mentor-/ },
    }).sort({ createdAt: -1 }).lean();

    if (!enr) return res.status(404).json({ error: "No active mentorship enrolment found." });
    if (!enr.parentEmail) return res.status(400).json({ error: "No parent email is on file for your enrolment yet — please contact us to add one." });

    const report = req.body?.report || {};
    const studentName = enr.name || user.name || "your child";
    const link = `${siteOrigin()}/mentorship-dashboard`;

    const html = kind === "daily" ? buildDailyHtml(studentName, report, link) : buildWeeklyHtml(studentName, report, link);
    const subject = kind === "daily"
      ? `Daily mentorship update — ${studentName}`
      : `Weekly mentorship report — ${studentName}`;

    const out = await sendMail({ to: enr.parentEmail, subject, html, text: `${subject}. Open the dashboard: ${link}` });
    if (!out.ok) return res.status(502).json({ error: "Couldn't send the email right now. Please try again shortly." });

    // The weekly report is what the cron-based cadence tracks.
    if (kind === "weekly") await Enrollment.updateOne({ _id: enr._id }, { $set: { lastParentReportAt: new Date() } });
    res.json({ sent: true, dev: !!out.dev, to: enr.parentEmail, kind });
  } catch (e) {
    console.error("[mentorship/parent-report]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
