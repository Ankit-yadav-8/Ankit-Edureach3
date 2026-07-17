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
import Mentor from "../models/Mentor.js";
import { requireAuth } from "../middleware/auth.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

const esc = (s) => String(s ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
const cap = (arr, n = 40) => (Array.isArray(arr) ? arr.slice(0, n) : []);
const clampPct = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

// ── Shared email design system ──────────────────────────────────────────────
// Every mentorship email is built from these primitives so parents get one
// consistent, strongly-branded look. Rules kept email-client-safe: table
// layouts (no flexbox), all styling inline, a 600px card on a tinted backdrop,
// and a hidden preheader that controls the inbox preview line.
const BRAND = { orange: "#F47B20", navy: "#0d1b3e", ink: "#1c1c28", sub: "#5b6472", line: "#eceff5", faint: "#9aa0aa" };

// Bulletproof CTA button (renders in Outlook via padded anchor + line-height).
const button = (label, link) =>
  !link ? "" : `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 4px"><tr><td style="border-radius:12px;background:${BRAND.orange};box-shadow:0 6px 18px rgba(244,123,32,.32)">
    <a href="${esc(link)}" style="display:inline-block;padding:13px 26px;font-family:Arial,sans-serif;font-size:15px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:12px">${esc(label)} &nbsp;→</a>
  </td></tr></table>`;

// Full email document — branded header band, body card, footer. `preheader`
// is the (hidden) inbox preview text; `accent`/`eyebrow` tune the header strip.
const shell = (inner, { preheader = "", eyebrow = "Mentorship report", accent = BRAND.orange } = {}) => `<div style="margin:0;padding:0;background:#eef1f7">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#eef1f7;font-size:1px;line-height:1px">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f7;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 40px rgba(13,27,62,.10);font-family:Arial,Helvetica,sans-serif">
        <tr><td style="background:${BRAND.navy};background-image:linear-gradient(135deg,#0d1b3e 0%,#1a2f63 100%);padding:22px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-size:19px;font-weight:800;color:#ffffff;letter-spacing:.2px">College<span style="color:${BRAND.orange}">Parichay</span></td>
            <td align="right" style="font-size:11px;font-weight:700;color:#c8d0e4;text-transform:uppercase;letter-spacing:1.2px">${esc(eyebrow)}</td>
          </tr></table>
          <div style="height:3px;width:54px;background:${accent};border-radius:3px;margin-top:12px"></div>
        </td></tr>
        <tr><td style="padding:26px 28px 8px">${inner}</td></tr>
        <tr><td style="padding:18px 28px 26px">
          <div style="border-top:1px solid ${BRAND.line};padding-top:16px;color:${BRAND.faint};font-size:11.5px;line-height:1.6">
            You're receiving this because of a mentorship enrolment on CollegeParichay.<br>
            <span style="color:#b6bcc8">CollegeParichay · Personalised JEE &amp; NEET mentorship · collegeparichay.in</span>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;

// Friendly greeting/intro line under the header.
const intro = (html) => `<p style="margin:0 0 4px;font-size:15px;color:${BRAND.sub};line-height:1.65">${html}</p>`;

// Section heading with a small colored tick bar.
const heading = (title, color = BRAND.navy) =>
  `<div style="margin:22px 0 10px"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${color};vertical-align:middle;margin-right:8px"></span><span style="font-size:15px;font-weight:800;color:${BRAND.ink};vertical-align:middle">${esc(title)}</span></div>`;

// A single big highlighted hero number (the headline metric of the email).
const hero = (label, value, unit, sub, color = BRAND.navy) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 4px">
  <tr><td style="background:${color};background-image:linear-gradient(135deg,${color} 0%,rgba(0,0,0,.14) 220%);border-radius:14px;padding:20px 22px" align="center">
    <div style="font-size:11px;font-weight:700;color:#ffffff;opacity:.72;text-transform:uppercase;letter-spacing:1.4px">${esc(label)}</div>
    <div style="font-size:40px;font-weight:800;color:#ffffff;line-height:1.1;margin-top:4px">${esc(value)}${unit ? `<span style="font-size:17px;font-weight:700;opacity:.6"> ${esc(unit)}</span>` : ""}</div>
    ${sub ? `<div style="font-size:13px;color:#ffffff;opacity:.9;margin-top:4px">${esc(sub)}</div>` : ""}
  </td></tr>
</table>`;

// A responsive row of highlighted stat tiles (2 or 3 across).
const tiles = (items) => {
  const cells = items.filter(Boolean).map((t) => `<td width="${Math.floor(100 / items.length)}%" valign="top" style="padding:4px">
      <div style="background:${t.color}12;border:1px solid ${t.color}2e;border-radius:12px;padding:12px 10px;text-align:center">
        <div style="font-size:22px;font-weight:800;color:${t.color};line-height:1.15">${esc(t.value)}</div>
        <div style="font-size:11px;font-weight:600;color:${BRAND.sub};margin-top:3px">${esc(t.label)}</div>
      </div></td>`).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0"><tr>${cells}</tr></table>`;
};

// A labelled progress bar (table-based so it renders everywhere).
const bar = (label, pct, color = BRAND.orange, valueText) => {
  const p = clampPct(pct);
  return `<div style="margin:11px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:13px;font-weight:600;color:${BRAND.sub}">${esc(label)}</td>
      <td align="right" style="font-size:13px;font-weight:800;color:${BRAND.ink}">${esc(valueText ?? `${p}%`)}</td>
    </tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:5px;background:#eef1f7;border-radius:8px"><tr>
      <td style="height:9px;background:${color};border-radius:8px;width:${p}%;font-size:0;line-height:0">&nbsp;</td>
      ${p < 100 ? `<td style="height:9px;font-size:0;line-height:0">&nbsp;</td>` : ""}
    </tr></table>
  </div>`;
};

// Definition-style key/value row for detail tables.
const row = (l, v, color = BRAND.navy) => `<tr>
  <td style="padding:9px 0;border-bottom:1px solid ${BRAND.line};color:${BRAND.sub};font-size:14px">${esc(l)}</td>
  <td style="padding:9px 0;border-bottom:1px solid ${BRAND.line};text-align:right;font-weight:800;color:${color};font-size:14px">${esc(v)}</td>
</tr>`;

const chapterBlock = (title, color, items) => {
  const list = cap(items);
  if (!list.length) return "";
  return `<div style="margin:12px 0">
    <div style="font-size:13px;font-weight:700;color:${color};margin-bottom:7px">${esc(title)} <span style="background:${color}1c;border-radius:20px;padding:1px 8px;font-size:11px">${list.length}</span></div>
    <div>${list.map((c) => `<span style="display:inline-block;background:${color}12;border:1px solid ${color}3a;color:${color};border-radius:20px;padding:4px 11px;font-size:12px;font-weight:600;margin:0 6px 6px 0">${esc(c)}</span>`).join("")}</div>
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
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 4px">
    <tr><td style="background:#faf5ff;border:1px solid #e6d8fb;border-radius:14px;padding:16px 18px">
      <div style="font-size:14px;font-weight:800;color:#6d28d9;margin-bottom:6px">🏆 Predicted ${esc(rank.exam)} 2026 rank${rank.testName ? ` · ${esc(rank.testName)}` : ""}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows.map(([l, v]) => row(l, v, "#6d28d9")).join("")}</table>
      <div style="font-size:11px;color:#a78bce;margin-top:8px">Estimate only — actual rank depends on official normalisation &amp; shift difficulty.</div>
    </td></tr>
  </table>`;
};

function buildWeeklyHtml(studentName, r, link) {
  const s = r.stats || {};
  const ch = r.chapters || {};
  const tasks = cap(r.weeklyTasks, 30);
  const doneTasks = tasks.filter((t) => t.done).length;
  const taskHtml = tasks.length
    ? `${heading("This week's task list", BRAND.orange)}${bar("Tasks completed", (doneTasks / tasks.length) * 100, BRAND.orange, `${doneTasks} / ${tasks.length}`)}
       <div style="margin-top:6px">${tasks.map((t) => `<div style="font-size:13.5px;color:${t.done ? "#94a3b8" : BRAND.ink};padding:5px 0;border-bottom:1px solid ${BRAND.line};${t.done ? "text-decoration:line-through" : ""}">${t.done ? "✅" : "⬜"} ${esc(t.text)}</div>`).join("")}</div>`
    : "";
  const hasChapters = cap(ch.weak).length || cap(ch.medium).length || cap(ch.strong).length;
  return shell(`
    ${intro(`Namaste — here is this week's complete progress report for <b style="color:${BRAND.ink}">${esc(studentName)}</b>.`)}
    ${hero("Study hours this week", s.hours ?? "—", "h", s.streak != null ? `🔥 ${esc(s.streak)}-day streak` : null, BRAND.navy)}
    ${tiles([
      { label: "Routine kept", value: `${s.routinePct ?? "—"}%`, color: "#16a34a" },
      { label: "Weekly tasks", value: s.weeklyTasksDone ?? "—", color: BRAND.orange },
      { label: "Backlog cleared", value: s.backlog ?? "—", color: "#0ea5e9" },
    ])}
    ${heading("Performance summary")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Study hours this week", `${s.hours ?? "—"} h`)}
      ${row("Day streak", `${s.streak ?? "—"} days`)}
      ${row("Routine kept", `${s.routinePct ?? "—"}%`)}
      ${row("Tasks (latest day)", s.tasks ?? "—")}
      ${row("Latest test", s.latestTest ?? "—")}
      ${row("Change vs last test", s.improvement ?? "—", /^-|down|drop/i.test(String(s.improvement)) ? "#dc2626" : "#16a34a")}
    </table>
    ${heading("Chapter strength report")}
    ${chapterBlock("Needs work", "#dc2626", ch.weak)}
    ${chapterBlock("Getting there", "#d97706", ch.medium)}
    ${chapterBlock("Strong", "#16a34a", ch.strong)}
    ${hasChapters ? "" : `<div style="font-size:13px;color:${BRAND.sub}">No chapters logged yet.</div>`}
    ${rankBlock(r.rank)}
    ${taskHtml}
    ${button("Open the dashboard", link)}`,
    { preheader: `${studentName}: ${s.hours ?? "—"}h studied this week, ${s.routinePct ?? "—"}% routine kept`, eyebrow: "Weekly report" });
}

export function buildDailyHtml(studentName, r, link) {
  const d = r.daily || {};
  const subs = cap(d.subjects, 12);
  const maxH = Math.max(1, ...subs.map((x) => Number(x.h) || 0));
  const subHtml = subs.length
    ? subs.map((x) => bar(`${esc(x.name)}`, (Number(x.h) || 0) / maxH * 100, BRAND.navy, `${esc(x.h)}h · ${esc(x.t)} tasks`)).join("")
    : `<div style="font-size:13px;color:${BRAND.sub}">No subjects logged today.</div>`;
  const taskPct = d.tasksTotal ? (Number(d.tasksDone) || 0) / Number(d.tasksTotal) * 100 : 0;
  return shell(`
    ${intro(`Namaste — here is today's report (${esc(r.date || "")}) for <b style="color:${BRAND.ink}">${esc(studentName)}</b>.`)}
    ${hero("Total hours studied today", d.hours ?? 0, "h", d.routine ? "Daily routine followed ✓" : "Routine missed today", BRAND.navy)}
    ${tiles([
      { label: "Tasks done", value: `${d.tasksDone ?? 0}/${d.tasksTotal ?? 0}`, color: BRAND.orange },
      { label: "Routine", value: d.routine ? "✓" : "✗", color: d.routine ? "#16a34a" : "#dc2626" },
      d.todayTest ? { label: "Test today", value: "Yes", color: "#6d28d9" } : { label: "Subjects", value: subs.length, color: "#0ea5e9" },
    ])}
    ${d.tasksTotal ? bar("Task completion", taskPct, BRAND.orange, `${d.tasksDone ?? 0} / ${d.tasksTotal}`) : ""}
    ${d.todayTest ? `${heading("Test taken today", "#6d28d9")}<div style="background:#faf5ff;border:1px solid #e6d8fb;border-radius:12px;padding:12px 14px;font-size:14px;font-weight:700;color:#6d28d9">${esc(d.todayTest)}</div>` : ""}
    ${heading("Subject-wise study today")}
    ${subHtml}
    ${rankBlock(r.rank)}
    ${button("Open the dashboard", link)}`,
    { preheader: `${studentName} studied ${d.hours ?? 0}h today · ${d.tasksDone ?? 0}/${d.tasksTotal ?? 0} tasks done`, eyebrow: "Daily update" });
}

// Backlog alert — sent when chapters pass their target date unfinished or study
// is irregular, so the parent knows their child is falling behind.
function buildBacklogHtml(studentName, r, link) {
  const b = r.backlog || {};
  const overdue = cap(b.overdue, 20);
  const overdueHtml = overdue.length
    ? `<div style="margin-top:8px">${overdue.map((x) => `<div style="font-size:13px;color:${BRAND.sub};padding:7px 0;border-bottom:1px solid ${BRAND.line}"><span style="color:#dc2626;font-weight:700">⏰ ${esc(x.topic)}</span> <span style="color:${BRAND.faint}">(${esc(x.subject)}${x.date ? ` · target ${esc(x.date)}` : ""})</span></div>`).join("")}</div>`
    : "";
  const reasons = [];
  if (overdue.length) reasons.push(`${overdue.length} chapter${overdue.length === 1 ? "" : "s"} past the planned target date`);
  if (b.irregular) reasons.push(`irregular study (current streak ${b.streak ?? 0} day${b.streak === 1 ? "" : "s"}, routine kept ${b.routinePct ?? 0}%)`);
  const reasonLine = reasons.length ? reasons.join(" and ") : "the backlog is not being cleared on schedule";
  return shell(`
    ${intro(`Namaste — this is a heads-up about <b style="color:${BRAND.ink}">${esc(studentName)}</b>'s preparation.`)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0">
      <tr><td style="background:#fff7ed;border:1px solid #fdba74;border-radius:14px;padding:15px 16px">
        <div style="font-size:15px;font-weight:800;color:#c2410c;margin-bottom:4px">⚠️ Falling behind on the backlog</div>
        <div style="font-size:13.5px;color:#7c2d12;line-height:1.65">${esc(studentName)} could not complete the planned backlog and is not keeping a regular study routine — ${esc(reasonLine)}. A little nudge from you will help them get back on track.</div>
      </td></tr>
    </table>
    ${tiles([
      { label: "Backlog cleared", value: `${b.pct ?? 0}%`, color: "#0ea5e9" },
      { label: "Overdue", value: overdue.length, color: "#dc2626" },
      { label: "Routine kept", value: `${b.routinePct ?? 0}%`, color: b.routinePct >= 70 ? "#16a34a" : "#d97706" },
    ])}
    ${bar("Backlog cleared", b.pct ?? 0, "#0ea5e9", `${b.cleared ?? 0} / ${b.total ?? 0}`)}
    ${heading("The numbers")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Backlog cleared", `${b.cleared ?? 0} / ${b.total ?? 0} (${b.pct ?? 0}%)`)}
      ${row("Overdue chapters", overdue.length, overdue.length ? "#dc2626" : BRAND.navy)}
      ${row("Day streak", `${b.streak ?? 0} days`)}
      ${row("Routine kept", `${b.routinePct ?? 0}%`)}
      ${row("Study hours this week", `${b.hoursThisWeek ?? 0} h`)}
    </table>
    ${overdue.length ? `${heading("Overdue chapters", "#dc2626")}${overdueHtml}` : ""}
    ${button("See full progress", link)}`,
    { preheader: `Action needed — ${studentName} is behind on their backlog`, eyebrow: "Action needed", accent: "#dc2626" });
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
        // Advance the matching cadence stamp so the cron doesn't double-send.
        if (kind === "weekly" || kind === "backlog") {
          Enrollment.updateOne({ _id: enr._id }, { $set: { lastParentReportAt: new Date() } }).catch(() => {});
        } else if (kind === "daily") {
          Enrollment.updateOne({ _id: enr._id }, { $set: { lastDailyReportAt: new Date() } }).catch(() => {});
        }
      })
      .catch((e) => console.error("[mentorship/parent-report] send error:", e?.message || e));
  } catch (e) {
    console.error("[mentorship/parent-report]", e?.message || e);
    if (!res.headersSent) res.status(500).json({ error: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Mentor-assigned weekly tasks — a student's own mentor sets a short task list
// against their student ID (CP-2026-00042) from the mentor dashboard (see
// routes/mentor.js). Here we only serve them to the student who owns the ID; the
// dashboard shows them as mandatory "From your mentor" fix-list items and rolls
// them into the weekly parent report.
// ─────────────────────────────────────────────────────────────────────────────

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

// Student — the mentor assigned to their student ID (shown in live tracking).
// Only the mentor's public-facing name + college is returned, and only to a
// student who actually owns the ID — never their email, phone or internal id.
router.get("/my-mentor", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email").lean();
    const email = (user?.email || "").toLowerCase();
    const studentId = String(req.query.studentId || "").trim().toUpperCase();
    if (!email || !studentId) return res.json({ mentor: null });
    const owns = await Enrollment.exists({ studentId, email, status: "paid" });
    if (!owns) return res.json({ mentor: null });
    const mentor = await Mentor.findOne({ students: studentId, active: true })
      .select("name college").lean();
    res.json({ mentor: mentor ? { name: mentor.name, college: mentor.college || "" } : null });
  } catch (e) {
    console.error("[mentorship/my-mentor]", e.message);
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
