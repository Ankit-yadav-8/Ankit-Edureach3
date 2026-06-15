// ─────────────────────────────────────────────────────────────────────────────
// Weekly parent-report job.
//
// Once a week (checked daily), every paid mentorship enrolment that has a parent
// email is sent a progress check-in, and the student is nudged to keep their
// dashboard up to date. It's best-effort and fully guarded: in dev mode
// (OTP_DEV_MODE !== "false") or without a Brevo key, sendMail only logs, so this
// never sends real mail locally. A DB/email hiccup is caught and skipped.
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

const shell = (inner) => `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1c1c28">
  <h2 style="color:#F47B20;margin:0 0 12px">CollegeParichay Mentorship</h2>${inner}
  <p style="color:#9aa0aa;font-size:12px;margin-top:22px">You're receiving this because of a mentorship enrolment on CollegeParichay.</p>
</div>`;

const parentHtml = (name, link) => shell(`
  <p style="font-size:15px">Namaste,</p>
  <p style="font-size:15px;color:#374151;line-height:1.6">Here's your weekly check-in for <b>${name}</b>'s mentorship.
  Open the dashboard to see this week's study hours, streak, tasks completed and latest test analysis.</p>
  <a href="${link}" style="display:inline-block;margin:14px 0;background:#F47B20;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:10px">View weekly progress</a>
  <p style="font-size:13px;color:#6b7280">Your child's mentor reviews this every week too.</p>`);

const studentHtml = (name, link) => shell(`
  <p style="font-size:15px">Hi ${name || "there"},</p>
  <p style="font-size:15px;color:#374151;line-height:1.6">It's your weekly update time. Log this week's study hours,
  tasks and any test results so your dashboard — and your parents' report — stays accurate.</p>
  <a href="${link}" style="display:inline-block;margin:14px 0;background:#F47B20;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:10px">Update my dashboard</a>`);

async function runOnce() {
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
