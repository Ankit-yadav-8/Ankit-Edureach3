// ─────────────────────────────────────────────────────────────────────────────
// Weekly parent-report job.
//
// Once a week (checked daily), every paid mentorship enrolment that has a parent
// email is sent a progress check-in, and the student is nudged to keep their
// dashboard up to date. It's best-effort and fully guarded: without a Brevo key
// (or with OTP_DEV_MODE=true), sendMail only logs, so this never sends real mail
// locally. A DB/email hiccup is caught and skipped.
//
// NOTE: live tracking / test data currently lives in the browser (localStorage),
// so the email is a weekly nudge + link rather than a numeric report. Moving the
// tracking data server-side would let this embed the real figures.
// ─────────────────────────────────────────────────────────────────────────────
import Enrollment from "../models/Enrollment.js";
import { sendMail } from "../utils/mailer.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

const siteOrigin = () =>
  (process.env.CLIENT_ORIGIN || "").split(",")[0].trim() || "https://collegeparichay.in";

const esc = (s) => String(s ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

const CP_LOGO_HTML = `
<table role="presentation" width="36" height="36" cellpadding="0" cellspacing="0" style="background:#FF5A36;border-radius:50%;text-align:center;table-layout:fixed;min-width:36px;min-height:36px">
  <tr><td width="36" height="36" align="center" valign="middle" style="color:#ffffff;font-size:14px;font-weight:900;font-family:Arial,sans-serif;line-height:36px;padding:0;margin:0">CP</td></tr>
</table>
`;

// Shared branded shell (mirrors the report emails) — 600px card on a tinted
// backdrop, navy gradient header with CP logo, hidden preheader, consistent footer.
const shell = (inner, { preheader = "", eyebrow = "Weekly check-in" } = {}) => `<div style="margin:0;padding:0;background:#eef1f7">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#eef1f7;font-size:1px;line-height:1px">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f7;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 40px rgba(13,27,62,.10);font-family:Arial,Helvetica,sans-serif">
        <tr><td style="background:#0d1b3e;background-image:linear-gradient(135deg,#0d1b3e 0%,#1a2f63 100%);padding:22px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="36" style="padding-right:12px">${CP_LOGO_HTML}</td>
            <td width="100%" style="font-size:20px;font-weight:800;color:#FF5A36;letter-spacing:.3px">CollegeParichay</td>
            <td align="right" style="white-space:nowrap;font-size:11px;font-weight:700;color:#c8d0e4;text-transform:uppercase;letter-spacing:1.2px">${esc(eyebrow)}</td>
          </tr></table>
          <div style="height:3px;width:54px;background:#FF5A36;border-radius:3px;margin-top:12px"></div>
        </td></tr>
        <tr><td style="padding:26px 28px 8px">${inner}</td></tr>
        <tr><td style="padding:18px 28px 26px">
          <div style="border-top:1px solid #eceff5;padding-top:16px;color:#9aa0aa;font-size:11.5px;line-height:1.6">
            You're receiving this because of a mentorship enrolment on CollegeParichay.<br>
            <span style="color:#b6bcc8">CollegeParichay · Personalised JEE &amp; NEET mentorship · collegeparichay.in</span>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;

const button = (label, link) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 4px"><tr><td style="border-radius:12px;background:#FF5A36;box-shadow:0 6px 18px rgba(255,90,54,.32)">
  <a href="${esc(link)}" style="display:inline-block;padding:13px 26px;font-family:Arial,sans-serif;font-size:15px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:12px">${esc(label)} &nbsp;→</a>
</td></tr></table>`;

const parentHtml = (name, link) => shell(`
  <p style="margin:0 0 4px;font-size:15px;color:#5b6472;line-height:1.65">Namaste — here's your weekly check-in for <b style="color:#1c1c28">${esc(name)}</b>'s mentorship.</p>
  <p style="font-size:14px;color:#5b6472;line-height:1.65;margin:8px 0 0">Open the dashboard to see this week's <b>study hours</b>, <b>day streak</b>, <b>tasks completed</b> and the <b>latest test analysis</b> — all in one place.</p>
  ${button("View weekly progress", link)}
  <p style="font-size:13px;color:#8a93a6;margin:10px 0 0">👨‍🏫 Your child's mentor reviews this same report every week.</p>`,
  { preheader: `Your weekly mentorship check-in for ${name}`, eyebrow: "Weekly check-in" });

const studentHtml = (name, link) => shell(`
  <p style="margin:0 0 4px;font-size:15px;color:#5b6472;line-height:1.65">Hi <b style="color:#1c1c28">${esc(name || "there")}</b> — it's your weekly update time.</p>
  <p style="font-size:14px;color:#5b6472;line-height:1.65;margin:8px 0 0">Log this week's <b>study hours</b>, <b>tasks</b> and any <b>test results</b> so your dashboard — and your parents' report — stays accurate and up to date.</p>
  ${button("Update my dashboard", link)}`,
  { preheader: "Log this week's hours, tasks and test results", eyebrow: "Action needed" });

async function runOnce() {
  // Weekly cadence is anchored to Sunday: the job is checked daily but only
  // sends on Sundays. (If a student opens the dashboard on Sunday, the client
  // sends the real data report and stamps lastParentReportAt, so the nudge
  // below is skipped for them — no duplicate.)
  if (new Date().getDay() !== 0) return;
  const cutoff = new Date(Date.now() - WEEK_MS);
  const due = await Enrollment.find({
    status: "paid",
    plan: { $regex: /^mentor-/ },
    parentEmail: { $nin: ["", null] },
    $or: [{ lastParentReportAt: null }, { lastParentReportAt: { $lte: cutoff } }],
  }).limit(50);

  let sent = 0;
  for (const enr of due) {
    const link = `${siteOrigin()}/mentorship-dashboard`;
    try {
      await sendMail({
        to: enr.parentEmail,
        subject: `Weekly mentorship update — ${enr.name}`,
        html: parentHtml(enr.name, link),
        text: `Weekly mentorship check-in for ${enr.name}. View progress: ${link}`,
      });
      if (enr.email) {
        await sendMail({
          to: enr.email,
          subject: "Update your weekly mentorship progress",
          html: studentHtml(enr.name, link),
          text: `Log this week's hours, tasks and test results: ${link}`,
        });
      }
      enr.lastParentReportAt = new Date();
      await enr.save();
      sent++;
    } catch (e) {
      console.error(`[weeklyReport] ${enr._id}:`, e.message);
    }
  }
  if (sent) console.log(`[weeklyReport] sent weekly reports for ${sent} enrolment(s)`);
}

export function startWeeklyReportJob() {
  const tick = () => runOnce().catch((e) => console.error("[weeklyReport]", e.message));
  setTimeout(tick, 60 * 1000);   // first pass a minute after boot
  setInterval(tick, DAY_MS);     // then check daily; each enrolment fires ≤ once/week
}
