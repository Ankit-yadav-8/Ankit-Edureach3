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
// Modern alert-style email design: 560px card, website coral header (#FF693D),
// white CP logo badge (guaranteed nowrap so 'CP' never truncates to 'C'),
// clean DM Sans / Inter system typography, and compact, readable font sizes.
const BRAND = {
  coral: "#FF693D",
  coralDark: "#EE5326",
  coralSoft: "#fff8f6",
  coralBorder: "#fed7aa",
  navy: "#1a1a2e",
  ink: "#0f172a",
  body: "#334155",
  sub: "#64748b",
  line: "#e2e8f0",
  faint: "#94a3b8",
  orange: "#FF693D",
};

// CP logo badge — crisp white square with website coral "CP" text inside.
// Bulletproof in all email clients: white-space:nowrap, word-break:keep-all,
// letter-spacing:-0.5px. Never wraps or drops 'P' to become 'C'.
const CP_LOGO_HTML = `
<table role="presentation" width="30" height="30" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:7px;text-align:center;table-layout:fixed;width:30px;height:30px;min-width:30px;min-height:30px;border-collapse:separate;box-shadow:0 1px 3px rgba(0,0,0,0.12)">
  <tr><td width="30" height="30" align="center" valign="middle" style="color:#FF693D;font-size:12px;font-weight:900;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:30px;mso-line-height-rule:exactly;padding:0;margin:0;white-space:nowrap !important;word-break:keep-all;letter-spacing:-0.5px">CP</td></tr>
</table>
`;

// Bulletproof CTA button (renders cleanly in all clients with compact font and padding).
const button = (label, link) =>
  !link ? "" : `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 4px"><tr><td style="border-radius:8px;background:${BRAND.coral}">
    <a href="${esc(link)}" style="display:inline-block;padding:9px 20px;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12.5px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px">${esc(label)} &nbsp;→</a>
  </td></tr></table>`;

// Full alert email shell — coral brand bar, white CP badge, alert strip, compact card.
const shell = (inner, { preheader = "", eyebrow = "Daily update", alertStrip = "" } = {}) => `<div style="margin:0;padding:0;background:#f1f5f9;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f1f5f9;font-size:1px;line-height:1px">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:20px 10px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
        <!-- Coral Alert Header (replaces old blue banner) -->
        <tr><td style="background:${BRAND.coral};background-image:linear-gradient(135deg,#FF693D 0%,#EE5326 100%);padding:14px 20px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="30" style="padding-right:10px;vertical-align:middle">${CP_LOGO_HTML}</td>
            <td width="100%" style="font-size:15px;font-weight:800;color:#ffffff;letter-spacing:-0.2px;vertical-align:middle">Campus Point</td>
            <td align="right" style="white-space:nowrap;vertical-align:middle">
              <span style="display:inline-block;background:rgba(255,255,255,0.22);border:1px solid rgba(255,255,255,0.35);color:#ffffff;font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;padding:3px 9px;border-radius:20px">${esc(eyebrow)}</span>
            </td>
          </tr></table>
        </td></tr>
        ${alertStrip ? `<tr><td>${alertStrip}</td></tr>` : ""}
        <tr><td style="padding:18px 22px 10px">${inner}</td></tr>
        <tr><td style="padding:12px 22px 20px">
          <div style="border-top:1px solid #f1f5f9;padding-top:14px;color:#94a3b8;font-size:11px;line-height:1.5">
            You're receiving this report because your email is registered as the parent contact for this mentorship enrolment.<br>
            <span style="color:#cbd5e1">Campus Point · Personalised JEE &amp; NEET Mentorship · <a href="https://campuspoint.in" style="color:${BRAND.coral};text-decoration:none">campuspoint.in</a></span>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;

// Friendly greeting/intro line under the header.
const intro = (html) => `<p style="margin:0 0 10px;font-size:12.5px;color:${BRAND.body};line-height:1.5">${html}</p>`;

// Section heading with compact tracking and small font.
const heading = (title, color = BRAND.navy) =>
  `<div style="margin:16px 0 8px;font-size:11px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.8px">${esc(title)}</div>`;

// A compact alert hero number card (clean 24px metric instead of oversized 40px).
const hero = (label, value, unit, sub, color = BRAND.coral) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0">
  <tr><td style="background:#fff8f6;border:1px solid #ffdecb;border-radius:10px;padding:12px 16px;text-align:center">
    <div style="font-size:10px;font-weight:700;color:#c2410c;text-transform:uppercase;letter-spacing:0.8px">${esc(label)}</div>
    <div style="font-size:24px;font-weight:800;color:${color};line-height:1.1;margin-top:2px">${esc(value)}${unit ? `<span style="font-size:13px;font-weight:600"> ${esc(unit)}</span>` : ""}</div>
    ${sub ? `<div style="font-size:11px;color:#9a3412;margin-top:2px">${esc(sub)}</div>` : ""}
  </td></tr>
</table>`;

// A compact responsive row of highlighted stat tiles (2 or 3 across).
const tiles = (items) => {
  const cells = items.filter(Boolean).map((t) => `<td width="${Math.floor(100 / items.length)}%" valign="top" style="padding:3px">
      <div style="background:${t.color}10;border:1px solid ${t.color}25;border-radius:8px;padding:9px 8px;text-align:center">
        <div style="font-size:18px;font-weight:800;color:${t.color};line-height:1.1">${esc(t.value)}</div>
        <div style="font-size:10px;font-weight:600;color:${BRAND.sub};margin-top:3px">${esc(t.label)}</div>
      </div></td>`).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;table-layout:fixed;margin:4px 0"><tr>${cells}</tr></table>`;
};

// A slim, modern progress bar with compact typography.
const bar = (label, pct, color = BRAND.orange, valueText) => {
  const p = clampPct(pct);
  return `<div style="margin:8px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;"><tr>
      <td style="font-size:11.5px;font-weight:600;color:${BRAND.sub};padding-right:8px">${esc(label)}</td>
      <td align="right" style="font-size:11.5px;font-weight:800;color:${BRAND.ink};white-space:nowrap">${esc(valueText ?? `${p}%`)}</td>
    </tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin-top:4px;background:#f1f5f9;border-radius:6px"><tr>
      <td style="height:6px;background:${color};border-radius:6px;width:${p}%;font-size:0;line-height:0">&nbsp;</td>
      ${p < 100 ? `<td style="height:6px;font-size:0;line-height:0">&nbsp;</td>` : ""}
    </tr></table>
  </div>`;
};

// Compact key/value row for detail tables.
const row = (l, v, color = BRAND.ink) => `<tr>
  <td style="padding:7px 0;border-bottom:1px solid ${BRAND.line};color:${BRAND.sub};font-size:12px">${esc(l)}</td>
  <td style="padding:7px 0;border-bottom:1px solid ${BRAND.line};text-align:right;font-weight:700;color:${color};font-size:12px">${esc(v)}</td>
</tr>`;

const chapterBlock = (title, color, items) => {
  const list = cap(items);
  if (!list.length) return "";
  return `<div style="margin:10px 0">
    <div style="font-size:11px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px">${esc(title)} <span style="background:${color}18;border-radius:12px;padding:1px 6px;font-size:10px">${list.length}</span></div>
    <div>${list.map((c) => `<span style="display:inline-block;background:${color}10;border:1px solid ${color}30;color:${color};border-radius:14px;padding:3px 9px;font-size:11px;font-weight:600;margin:0 4px 4px 0">${esc(c)}</span>`).join("")}</div>
  </div>`;
};

// Reusable card container for report sections with compact alert styling.
const cardWrap = (title, content, icon = "") => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:12px;background:#ffffff;border-radius:10px;border:1px solid #e2e8f0;overflow:hidden">
    ${title ? `<tr><td style="background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:8px 14px;font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.6px">${icon} ${title}</td></tr>` : ""}
    <tr><td style="padding:12px 14px">${content}</td></tr>
  </table>
`;

// Predicted JEE rank block with compact alert layout.
const rankBlock = (rank) => {
  if (!rank) return "";
  const rows = [
    ["Marks scored", rank.marks],
    [rank.exam === "JEE Advanced" ? "Predicted CRL range" : "Predicted All-India CRL", rank.crl],
    rank.band ? ["Likely rank band", rank.band] : null,
    rank.percentile != null ? ["Percentile", rank.percentile] : null,
    rank.categoryRank ? ["Category rank", rank.categoryRank] : null,
  ].filter(Boolean);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 4px">
    <tr><td style="background:#faf5ff;border:1px solid #e6d8fb;border-radius:10px;padding:12px 14px">
      <div style="font-size:12px;font-weight:800;color:#6d28d9;margin-bottom:4px">🏆 Predicted ${esc(rank.exam)} 2026 rank${rank.testName ? ` · ${esc(rank.testName)}` : ""}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows.map(([l, v]) => row(l, v, "#6d28d9")).join("")}</table>
      <div style="font-size:10px;color:#a78bce;margin-top:6px">Estimate only — actual rank depends on official normalisation &amp; shift difficulty.</div>
    </td></tr>
  </table>`;
};

function buildWeeklyHtml(studentName, r, link) {
  const s = r.stats || {};
  const ch = r.chapters || {};
  const tasks = cap(r.weeklyTasks, 30);
  const doneTasks = tasks.filter((t) => t.done).length;
  
  const taskHtml = tasks.length
    ? `<div style="margin-bottom:10px">${bar("Tasks completed", (doneTasks / tasks.length) * 100, BRAND.coral, `${doneTasks} / ${tasks.length}`)}</div>
       <div>${tasks.map((t) => `<div style="font-size:12px;color:${t.done ? "#94a3b8" : BRAND.ink};padding:5px 0;border-bottom:1px solid ${BRAND.line};${t.done ? "text-decoration:line-through" : ""}">${t.done ? "✅" : "⬜"} ${esc(t.text)}</div>`).join("")}</div>`
    : `<div style="font-size:12px;color:${BRAND.sub};text-align:center">No weekly tasks assigned.</div>`;
    
  const hasChapters = cap(ch.weak).length || cap(ch.medium).length || cap(ch.strong).length;
  
  const overviewHtml = `
    ${intro(`Namaste — here is this week's progress snapshot for <b style="color:${BRAND.ink}">${esc(studentName)}</b>.`)}
    <div style="margin-top:10px;margin-bottom:10px">${hero("Study hours this week", s.hours ?? "—", "h", s.streak != null ? `🔥 ${esc(s.streak)}-day streak` : null, BRAND.coral)}</div>
    ${tiles([
      { label: "Routine kept", value: `${s.routinePct ?? "—"}%`, color: "#16a34a" },
      { label: "Weekly tasks", value: s.weeklyTasksDone ?? "—", color: BRAND.coral },
      { label: "Backlog cleared", value: s.backlog ?? "—", color: "#0ea5e9" },
    ])}
    <div style="margin-top:12px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row("Study hours this week", `${s.hours ?? "—"} h`)}
        ${row("Day streak", `${s.streak ?? "—"} days`)}
        ${row("Routine kept", `${s.routinePct ?? "—"}%`)}
        ${row("Tasks (latest day)", s.tasks ?? "—")}
        ${row("Latest test", s.latestTest ?? "—")}
        ${row("Change vs last test", s.improvement ?? "—", /^-|down|drop/i.test(String(s.improvement)) ? "#dc2626" : "#16a34a")}
      </table>
    </div>
  `;

  const chapterHtml = `
    ${chapterBlock("Needs work", "#dc2626", ch.weak)}
    ${chapterBlock("Getting there", "#d97706", ch.medium)}
    ${chapterBlock("Strong", "#16a34a", ch.strong)}
    ${hasChapters ? "" : `<div style="font-size:12px;color:${BRAND.sub};text-align:center">No chapters logged yet.</div>`}
  `;

  const alertStrip = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:8px 20px">
    <tr><td><span style="font-size:11px;font-weight:700;color:#166534;letter-spacing:0.3px">📈 WEEKLY PERFORMANCE DIGEST</span></td></tr>
  </table>`;

  return shell(`
    ${cardWrap("Weekly Overview", overviewHtml, "📈")}
    ${cardWrap("Chapter Strength", chapterHtml, "📖")}
    ${cardWrap("Task Completion", taskHtml, "🎯")}
    ${rankBlock(r.rank)}
    ${button("Open the dashboard", link)}`,
    {
      preheader: `${studentName}: ${s.hours ?? "—"}h studied this week, ${s.routinePct ?? "—"}% routine kept`,
      eyebrow: "Weekly report",
      alertStrip,
    });
}

export function buildDailyHtml(studentName, r, link) {
  const d = r.daily || {};
  const subs = cap(d.subjects, 12);
  const maxH = Math.max(1, ...subs.map((x) => Number(x.h) || 0));
  const taskPct = d.tasksTotal ? (Number(d.tasksDone) || 0) / Number(d.tasksTotal) * 100 : 0;
  const notUpdated = r.notUpdated || ((d.hours ?? 0) === 0 && subs.length === 0 && (d.tasksDone ?? 0) === 0);

  // ── Alert Notification Ticker ─────────────────────────────────────────────
  const alertStrip = notUpdated
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-bottom:1px solid #fecaca;padding:8px 20px">
        <tr>
          <td><span style="font-size:11px;font-weight:700;color:#dc2626;letter-spacing:0.3px">⚠️ ACTION REQUIRED · STUDY PROGRESS NOT UPDATED</span></td>
          <td align="right"><span style="font-size:10.5px;color:#991b1b;font-weight:600">${esc(r.date || "Today")}</span></td>
        </tr>
      </table>`
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-bottom:1px solid #fed7aa;padding:8px 20px">
        <tr>
          <td><span style="font-size:11px;font-weight:700;color:#c2410c;letter-spacing:0.3px">⚡ DAILY STUDY ACTIVITY REPORT</span></td>
          <td align="right"><span style="font-size:10.5px;color:#9a3412;font-weight:600">${esc(r.date || "Today")}</span></td>
        </tr>
      </table>`;

  // ── Compact Student Info Grid (Sleek 3-column micro card) ─────────────────
  const infoBar = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;background:#f8fafc;border-radius:9px;border:1px solid #e2e8f0;table-layout:fixed">
    <tr>
      <td style="padding:9px 12px;border-right:1px solid #e2e8f0;vertical-align:top">
        <div style="font-size:9.5px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.6px">Student</div>
        <div style="font-size:12.5px;font-weight:700;color:#0f172a;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(studentName)}</div>
      </td>
      <td style="padding:9px 12px;border-right:1px solid #e2e8f0;vertical-align:top">
        <div style="font-size:9.5px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.6px">Date</div>
        <div style="font-size:12.5px;font-weight:700;color:#0f172a;margin-top:1px">${esc(r.date || "Today")}</div>
      </td>
      <td style="padding:9px 12px;vertical-align:top">
        <div style="font-size:9.5px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.6px">Status</div>
        <div style="font-size:12px;font-weight:700;color:${notUpdated ? "#dc2626" : "#16a34a"};margin-top:1px">${notUpdated ? "⚠️ Irregular" : "✅ Logged"}</div>
      </td>
    </tr>
  </table>`;

  // ── Not-updated / irregularity alert callout ──────────────────────────────
  if (notUpdated) {
    const warningBlock = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px">
        <tr><td style="background:#fff7f7;border:1px solid #fca5a5;border-radius:10px;padding:14px 16px">
          <div style="font-size:13px;font-weight:800;color:#dc2626;margin-bottom:4px">⚠️ Study Progress Not Updated Today</div>
          <div style="font-size:12px;color:#7c2d12;line-height:1.6">
            <b style="color:#991b1b">${esc(studentName)}</b> did not log their study hours or tasks today. This indicates irregularity in their daily preparation routine.
          </div>
          <div style="margin-top:10px;background:#ffffff;border:1px solid #fed7aa;border-radius:8px;padding:10px 12px">
            <div style="font-size:10.5px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px">👨‍👩‍👧 What parents can do</div>
            <div style="font-size:11.5px;color:#78350f;line-height:1.6">
              • Ask your child about today's study — they may have studied but forgotten to log it<br>
              • Encourage them to open the dashboard daily to keep their streak alive<br>
              • Consistent tracking builds discipline and keeps the mentor updated
            </div>
          </div>
        </td></tr>
      </table>`;

    return shell(`
      ${intro(`Namaste — here is today's daily report for <b style="color:${BRAND.ink}">${esc(studentName)}</b>.`)}
      ${infoBar}
      ${warningBlock}
      ${rankBlock(r.rank)}
      ${button("Open the dashboard", link)}
      <div style="margin-top:12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 12px">
        <div style="font-size:11.5px;color:#166534;line-height:1.55">
          💡 <b>Tip:</b> Regular daily logging — even if just 30 minutes — builds accountability and gives you a clear picture of their JEE/NEET preparation.
        </div>
      </div>`,
      {
        preheader: `⚠️ ${studentName} did not update study progress today — irregularity detected`,
        eyebrow: "Daily alert",
        alertStrip,
      });
  }

  // ── Normal daily report (student updated) ─────────────────────────────────

  // Subject breakdown table
  const subTableRows = subs.map((x) => `<tr>
    <td style="padding:7px 10px;border-bottom:1px solid ${BRAND.line};font-size:12px;font-weight:700;color:${BRAND.ink}">${esc(x.name)}</td>
    <td style="padding:7px 10px;border-bottom:1px solid ${BRAND.line};text-align:center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="background:#f1f5f9;border-radius:4px;height:6px"><div style="background:${BRAND.coral};border-radius:4px;height:6px;width:${clampPct((Number(x.h) || 0) / maxH * 100)}%"></div></td>
      </tr></table>
    </td>
    <td style="padding:7px 10px;border-bottom:1px solid ${BRAND.line};text-align:right;font-size:12px;font-weight:800;color:${BRAND.coral}">${esc(x.h)}h</td>
    <td style="padding:7px 10px;border-bottom:1px solid ${BRAND.line};text-align:right;font-size:11px;color:${BRAND.sub}">${esc(x.t)} tasks</td>
  </tr>`).join("");

  const subHtml = subs.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <thead><tr style="text-align:left;color:${BRAND.faint};font-size:10px;text-transform:uppercase;letter-spacing:.5px">
          <th style="padding:6px 10px">Subject</th><th style="padding:6px 10px;text-align:center">Progress</th><th style="padding:6px 10px;text-align:right">Hours</th><th style="padding:6px 10px;text-align:right">Tasks</th>
        </tr></thead><tbody>${subTableRows}</tbody></table>`
    : `<div style="font-size:12px;color:${BRAND.sub};text-align:center;padding:12px">No individual subjects logged today.</div>`;

  // ── Test Analysis & Improvement section ────────────────────────────────────
  const lt = r.latestTest;
  const pt = r.prevTest;
  const imp = r.improvement;
  let testAnalysisHtml = "";

  if (lt) {
    const scorePct = lt.pct != null ? lt.pct : 0;
    const scoreColor = scorePct >= 75 ? "#16a34a" : scorePct >= 50 ? "#6366f1" : scorePct >= 30 ? "#f59e0b" : "#dc2626";
    const scoreGrade = scorePct >= 75 ? "Excellent" : scorePct >= 50 ? "Good" : scorePct >= 30 ? "Needs Work" : "Needs Attention";

    let improvementBadge = "";
    if (imp != null) {
      const isUp = imp >= 0;
      improvementBadge = `<div style="text-align:center;margin:8px 0">
        <div style="display:inline-block;background:${isUp ? "#dcfce7" : "#fef2f2"};border:1px solid ${isUp ? "#86efac" : "#fca5a5"};border-radius:20px;padding:4px 14px">
          <span style="font-size:13px;font-weight:800;color:${isUp ? "#16a34a" : "#dc2626"}">${isUp ? "📈 +" : "📉 "}${imp}%</span>
          <span style="font-size:11px;color:${isUp ? "#166534" : "#991b1b"};margin-left:4px;font-weight:600">${isUp ? "Improvement" : "Decline"} vs ${esc(pt?.name || "previous test")}</span>
        </div>
      </div>`;
    }

    const testHero = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:2px 0">
      <tr><td style="background:#fff8f6;border:1px solid #ffdecb;border-radius:10px;padding:14px" align="center">
        <div style="font-size:10px;font-weight:700;color:#c2410c;text-transform:uppercase;letter-spacing:1px">Latest test · ${esc(lt.name)}</div>
        <div style="font-size:24px;font-weight:800;color:#0f172a;line-height:1.1;margin-top:2px">${esc(lt.scored)}<span style="font-size:14px;font-weight:600;color:#64748b"> / ${esc(lt.total)}</span></div>
        <div style="font-size:11.5px;color:#64748b;margin-top:2px">${esc(scorePct)}% score${lt.accuracy != null ? ` · ${esc(lt.accuracy)}% accuracy` : ""}</div>
        <div style="display:inline-block;margin-top:6px;background:${scoreColor};color:#fff;font-size:10px;font-weight:800;padding:3px 10px;border-radius:20px">${esc(scoreGrade)}</div>
      </td></tr>
    </table>`;

    const scoreBar = `<div style="margin:8px 0 4px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:11px;font-weight:600;color:${BRAND.sub}">Score</td>
        <td align="right" style="font-size:11.5px;font-weight:800;color:${BRAND.ink}">${scorePct}%</td>
      </tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:3px;background:#f1f5f9;border-radius:6px"><tr>
        <td style="height:6px;background:${scoreColor};border-radius:6px;width:${clampPct(scorePct)}%;font-size:0;line-height:0">&nbsp;</td>
        ${scorePct < 100 ? `<td style="height:6px;font-size:0;line-height:0">&nbsp;</td>` : ""}
      </tr></table>
    </div>`;

    const testTiles = tiles([
      { label: "Correct", value: lt.correct, color: "#16a34a" },
      { label: "Wrong", value: lt.wrong, color: "#dc2626" },
      { label: "Skipped", value: lt.skipped, color: "#94a3b8" },
    ]);

    testAnalysisHtml = cardWrap("Test Analysis", `
      ${testHero}
      ${improvementBadge}
      ${scoreBar}
      ${testTiles}
    `, "🏆");
  }

  const overviewCard = cardWrap("Daily Activity", `
    ${tiles([
      { label: "Study hours", value: `${d.hours ?? 0}h`, color: BRAND.coral },
      { label: "Tasks done", value: `${d.tasksDone ?? 0}/${d.tasksTotal ?? 0}`, color: "#16a34a" },
      { label: "Routine", value: d.routine ? "✓ Kept" : "✗ Missed", color: d.routine ? "#16a34a" : "#dc2626" },
    ])}
  `, "📊");

  const tasksCard = d.tasksTotal ? cardWrap("Task Progress", bar("Tasks Completed", taskPct, BRAND.coral, `${d.tasksDone ?? 0} / ${d.tasksTotal}`), "📋") : "";
  const testCard = d.todayTest ? cardWrap("Test Taken Today", `<div style="background:#faf5ff;border:1px solid #e6d8fb;border-radius:8px;padding:10px 12px;font-size:12.5px;font-weight:700;color:#6d28d9;text-align:center">${esc(d.todayTest)}</div>`, "✍️") : "";
  const subjectsCard = cardWrap("Subject Breakdown", subHtml, "📚");
  const rankCard = r.rank ? rankBlock(r.rank) : "";

  return shell(`
    ${intro(`Namaste — here is today's daily study report for <b style="color:${BRAND.ink}">${esc(studentName)}</b>.`)}
    ${infoBar}
    ${overviewCard}
    ${tasksCard}
    ${testCard}
    ${subjectsCard}
    ${testAnalysisHtml}
    ${rankCard}
    <div style="margin:14px 0 12px;background:#f8fafc;border-left:3px solid ${BRAND.coral};border-radius:0 8px 8px 0;padding:10px 14px">
      <div style="font-size:10.5px;font-weight:700;color:${BRAND.coral};text-transform:uppercase;letter-spacing:.6px;margin-bottom:2px">💡 For parents</div>
      <div style="font-size:12px;color:#475569;line-height:1.55">
        ${Number(d.hours) >= 6 ? "Your child is putting in great effort today! Encourage them to keep up this consistency." : Number(d.hours) >= 3 ? "A decent study day. Encourage them to aim for 6+ hours for competitive exam readiness." : "Study hours are on the lower side today. A gentle nudge can help maintain the routine."}
      </div>
    </div>
    ${button("Open the dashboard", link)}`,
    {
      preheader: `${studentName} studied ${d.hours ?? 0}h today · ${d.tasksDone ?? 0}/${d.tasksTotal ?? 0} tasks done${lt ? ` · Latest test: ${lt.scored}/${lt.total}` : ""}`,
      eyebrow: "Daily update",
      alertStrip,
    });
}

// Backlog alert — sent when chapters pass their target date unfinished or study
// is irregular, so the parent knows their child is falling behind.
function buildBacklogHtml(studentName, r, link) {
  const b = r.backlog || {};
  const overdue = cap(b.overdue, 20);
  const overdueHtml = overdue.length
    ? `<div style="margin-top:6px">${overdue.map((x) => `<div style="font-size:11.5px;color:${BRAND.sub};padding:5px 0;border-bottom:1px solid ${BRAND.line}"><span style="color:#dc2626;font-weight:700">⏰ ${esc(x.topic)}</span> <span style="color:${BRAND.faint}">(${esc(x.subject)}${x.date ? ` · target ${esc(x.date)}` : ""})</span></div>`).join("")}</div>`
    : "";
  const reasons = [];
  if (overdue.length) reasons.push(`${overdue.length} chapter${overdue.length === 1 ? "" : "s"} past the planned target date`);
  if (b.irregular) reasons.push(`irregular study (current streak ${b.streak ?? 0} day${b.streak === 1 ? "" : "s"}, routine kept ${b.routinePct ?? 0}%)`);
  const reasonLine = reasons.length ? reasons.join(" and ") : "the backlog is not being cleared on schedule";

  const alertStrip = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-bottom:1px solid #fecaca;padding:8px 20px">
    <tr><td><span style="font-size:11px;font-weight:700;color:#dc2626;letter-spacing:0.3px">⚠️ BACKLOG ALERT · ATTENTION NEEDED</span></td></tr>
  </table>`;

  return shell(`
    ${intro(`Namaste — this is a heads-up about <b style="color:${BRAND.ink}">${esc(studentName)}</b>'s preparation.`)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 10px">
      <tr><td style="background:#fff7f7;border:1px solid #fca5a5;border-radius:10px;padding:12px 14px">
        <div style="font-size:13px;font-weight:800;color:#dc2626;margin-bottom:3px">⚠️ Falling behind on the backlog</div>
        <div style="font-size:12px;color:#7c2d12;line-height:1.6">${esc(studentName)} could not complete the planned backlog and is not keeping a regular study routine — ${esc(reasonLine)}. A little nudge from you will help them get back on track.</div>
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
    { preheader: `Action needed — ${studentName} is behind on their backlog`, eyebrow: "Backlog alert", alertStrip });
}

const siteOrigin = () =>
  (process.env.CLIENT_ORIGIN || "").split(",")[0].trim() || "https://campuspoint.in";

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
      enr = await Enrollment.findOne({ status: "paid", email, plan: requested }).sort({ createdAt: -1 });
    }
    if (!enr) {
      enr = await Enrollment.findOne({
        status: "paid",
        email,
        plan: { $regex: /^mentor-/ },
      }).sort({ createdAt: -1 });
    }

    if (!enr) return res.status(404).json({ error: "No active mentorship enrolment found." });
    if (!enr.parentEmail) return res.status(400).json({ error: "No parent email is on file for your enrolment yet — please contact us to add one." });

    // ── SERVER-SIDE DEDUPLICATION REMOVED ──
    // Manual clicks from the dashboard should always successfully send the report.
    // The automatic 11 PM cron job has its own deduplication to ensure it only
    // sends if a report hasn't already been sent today.

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

// Student — the 1-on-1 session and meeting link scheduled by their mentor.
// Rendered directly inside the student's 3D Mobile phone button in their Mentorship Dashboard.
router.get("/my-session", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email").lean();
    const email = (user?.email || "").toLowerCase();
    const studentId = String(req.query.studentId || "").trim().toUpperCase();
    if (!email || !studentId) return res.json({ session: null });
    const owns = await Enrollment.exists({ studentId, email, status: "paid" });
    if (!owns) return res.json({ session: null });
    const doc = await MentorTask.findOne({ studentId }).lean();
    res.json({ session: doc?.session || null });
  } catch (e) {
    console.error("[mentorship/my-session]", e.message);
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
