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
  (process.env.CLIENT_ORIGIN || "").split(",")[0].trim() || "https://campuspoint.in";

const esc = (s) => String(s ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

// CP logo badge — crisp white square with website coral "CP" text inside.
// Bulletproof in all email clients: white-space:nowrap, word-break:keep-all,
// letter-spacing:-0.5px. Never wraps or drops 'P' to become 'C'.
const CP_LOGO_HTML = `
<table role="presentation" width="30" height="30" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:7px;text-align:center;table-layout:fixed;width:30px;height:30px;min-width:30px;min-height:30px;border-collapse:separate;box-shadow:0 1px 3px rgba(0,0,0,0.12)">
  <tr><td width="30" height="30" align="center" valign="middle" style="color:#FF693D;font-size:12px;font-weight:900;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:30px;mso-line-height-rule:exactly;padding:0;margin:0;white-space:nowrap !important;word-break:keep-all;letter-spacing:-0.5px">CP</td></tr>
</table>
`;

// Shared branded shell — 560px card, coral alert header (#FF693D), white CP badge, DM Sans fonts.
const shell = (inner, { preheader = "", eyebrow = "Weekly check-in" } = {}) => `<div style="margin:0;padding:0;background:#f1f5f9;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f1f5f9;font-size:1px;line-height:1px">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:20px 10px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
        <!-- Coral Alert Header -->
        <tr><td style="background:#FF693D;background-image:linear-gradient(135deg,#FF693D 0%,#EE5326 100%);padding:14px 20px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="30" style="padding-right:10px;vertical-align:middle">${CP_LOGO_HTML}</td>
            <td width="100%" style="font-size:15px;font-weight:800;color:#ffffff;letter-spacing:-0.2px;vertical-align:middle">Campus Point</td>
            <td align="right" style="white-space:nowrap;vertical-align:middle">
              <span style="display:inline-block;background:rgba(255,255,255,0.22);border:1px solid rgba(255,255,255,0.35);color:#ffffff;font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;padding:3px 9px;border-radius:20px">${esc(eyebrow)}</span>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:18px 22px 10px">${inner}</td></tr>
        <tr><td style="padding:12px 22px 20px">
          <div style="border-top:1px solid #f1f5f9;padding-top:14px;color:#94a3b8;font-size:11px;line-height:1.5">
            You're receiving this weekly progress check-in from Campus Point.<br>
            <span style="color:#cbd5e1">Campus Point · Personalised JEE &amp; NEET Mentorship · <a href="https://campuspoint.in" style="color:#FF693D;text-decoration:none">campuspoint.in</a></span>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;

const button = (label, link) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:14px 0 4px"><tr><td style="border-radius:8px;background:#FF693D">
  <a href="${esc(link)}" style="display:inline-block;padding:9px 20px;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12.5px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px">${esc(label)} &nbsp;→</a>
</td></tr></table>`;

const parentHtml = (name, link) => shell(`
  <p style="margin:0 0 6px;font-size:12.5px;color:#475569;line-height:1.55">Namaste — here's your weekly check-in for <b style="color:#0f172a">${esc(name)}</b>'s mentorship.</p>
  <p style="font-size:12px;color:#64748b;line-height:1.55;margin:6px 0 0">Open the dashboard to see this week's <b>study hours</b>, <b>day streak</b>, <b>tasks completed</b> and the <b>latest test analysis</b> — all in one place.</p>
  ${button("View weekly progress", link)}
  <p style="font-size:11px;color:#94a3b8;margin:8px 0 0">👨‍🏫 Your child's mentor reviews this same report every week.</p>`,
  { preheader: `Your weekly mentorship check-in for ${name}`, eyebrow: "Weekly check-in" });

const studentHtml = (name, link) => shell(`
  <p style="margin:0 0 6px;font-size:12.5px;color:#475569;line-height:1.55">Hi <b style="color:#0f172a">${esc(name || "there")}</b> — it's your weekly update time.</p>
  <p style="font-size:12px;color:#64748b;line-height:1.55;margin:6px 0 0">Log this week's <b>study hours</b>, <b>tasks</b> and any <b>test results</b> so your dashboard — and your parents' report — stays accurate and up to date.</p>
  ${button("Update my dashboard", link)}`,
  { preheader: "Log this week's hours, tasks and test results", eyebrow: "Action needed" });

async function runOnce() {
  // Weekly cadence is anchored to Sunday in Indian Standard Time (Asia/Kolkata):
  const istDay = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "short" }).format(new Date());
  if (istDay !== "Sun") return;
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
