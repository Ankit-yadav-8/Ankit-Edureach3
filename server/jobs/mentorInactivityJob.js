import Mentor from "../models/Mentor.js";
import Enrollment from "../models/Enrollment.js";
import MentorActivityLog from "../models/MentorActivityLog.js";
import { sendMail } from "../utils/mailer.js";

const esc = (s) => String(s ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

// Local calendar date and hour in Indian Standard Time (Asia/Kolkata)
function getISTDateParts() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
  const hour = parseInt(parts.hour, 10);
  const dateStr = `${parts.year}-${parts.month}-${parts.day}`;
  return { now, hour, dateStr };
}

/**
 * Checks active mentors who have assigned students. If a mentor has not logged
 * into their mentor console today, sends an email in the 9:00 PM – 10:00 PM IST
 * lobby window with their assigned students' names and a direct dashboard link.
 */
export async function checkAndSendMentorInactivityAlerts({ force = false } = {}) {
  const { hour, dateStr } = getISTDateParts();

  // Inactivity notification is scheduled for the 9:00 PM – 10:00 PM IST window (hour 21), unless forced
  if (!force && (hour < 21 || hour >= 22)) {
    return { ok: true, skipped: true, reason: `Outside 9:00 PM – 10:00 PM IST window (Current IST hour: ${hour})` };
  }

  // Find active mentors who have assigned students
  const mentors = await Mentor.find({
    active: true,
    students: { $exists: true, $not: { $size: 0 } },
  });

  const clientBase = (process.env.CLIENT_ORIGIN || "").split(",")[0].trim() || "https://campuspoint.in";
  const dashboardLink = `${clientBase}/mentor`;

  let sentCount = 0;

  for (const mentor of mentors) {
    try {
      // 1. Check if mentor has already logged in today (IST)
      if (mentor.lastLogin) {
        const lastLoginIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(mentor.lastLogin));
        if (lastLoginIST === dateStr && !force) {
          // Mentor was active today
          continue;
        }
      }

      // 2. Prevent sending multiple reminder emails on the same day
      if (mentor.lastInactivityEmailSentAt) {
        const lastSentIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(mentor.lastInactivityEmailSentAt));
        if (lastSentIST === dateStr && !force) {
          // Already sent today
          continue;
        }
      }

      // 3. Resolve assigned students' names and details
      const students = await Enrollment.find({ studentId: { $in: mentor.students } })
        .select("studentId name targetExam plan region")
        .lean();

      const studentNames = students.map((s) => s.name || s.studentId).join(", ") || "Your assigned students";
      const studentCount = students.length || mentor.students.length;

      const studentRows = students.map((s) => `<tr>
        <td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a;font-size:12px">${esc(s.name || s.studentId)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-family:monospace;font-size:11px;color:#64748b">${esc(s.studentId)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-size:11.5px;color:#059669;font-weight:600">${esc(s.targetExam || s.plan || "")}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-size:11px;color:#64748b">${esc(s.region || "Indian")}</td>
      </tr>`).join("");

      const subject = `Action Required: Please review daily study reports for ${studentNames} · Campus Point`;

      const html = `
        <div style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;max-width:580px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06)">
          <div style="background:#FF693D;background-image:linear-gradient(135deg,#FF693D 0%,#EE5326 100%);padding:16px 20px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="30" style="padding-right:10px;vertical-align:middle">
                  <table role="presentation" width="30" height="30" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:7px;text-align:center">
                    <tr><td style="color:#FF693D;font-size:12px;font-weight:900;line-height:30px">CP</td></tr>
                  </table>
                </td>
                <td style="font-size:15px;font-weight:800;color:#ffffff;vertical-align:middle">Campus Point · Mentor Daily Check-in</td>
                <td align="right" style="vertical-align:middle">
                  <span style="background:rgba(255,255,255,0.22);color:#ffffff;font-size:9.5px;font-weight:700;padding:3px 9px;border-radius:20px;text-transform:uppercase">9 PM Lobby Reminder</span>
                </td>
              </tr>
            </table>
          </div>

          <div style="padding:22px 24px">
            <h3 style="margin:0 0 10px;font-size:16px;color:#0f172a;font-weight:800">
              Namaste ${esc(mentor.name)},
            </h3>
            <p style="font-size:13px;color:#475569;line-height:1.6;margin:0 0 14px">
              We noticed you have not opened your Mentor Console yet today. Daily reviews by mentors are essential to keep students on track with their target exam goals.
            </p>

            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 16px;margin:14px 0">
              <div style="font-size:10.5px;font-weight:800;color:#c2410c;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px">
                Assigned Students Awaiting Your Daily Review (${studentCount})
              </div>
              <div style="font-size:13.5px;font-weight:700;color:#0f172a">
                ${esc(studentNames)}
              </div>
            </div>

            <p style="font-size:12.5px;color:#475569;line-height:1.6;margin:12px 0 16px">
              Please take 5 minutes this evening to open your mentor dashboard, review your students' daily study logs and test analyses, and assign this week's tasks or schedule upcoming 1-on-1 mentorship meetings.
            </p>

            ${studentRows ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:18px">
                <thead><tr style="background:#f8fafc;color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:0.5px">
                  <th style="padding:7px 10px;text-align:left">Student</th>
                  <th style="padding:7px 10px;text-align:left">ID</th>
                  <th style="padding:7px 10px;text-align:left">Target Exam</th>
                  <th style="padding:7px 10px;text-align:left">Region</th>
                </tr></thead>
                <tbody>${studentRows}</tbody>
              </table>
            ` : ""}

            <div style="text-align:center;margin:22px 0 12px">
              <a href="${dashboardLink}" style="display:inline-block;padding:12px 28px;background:#FF693D;color:#ffffff;text-decoration:none;font-weight:700;font-size:13.5px;border-radius:10px;box-shadow:0 4px 14px rgba(255,105,61,0.3)">
                Open Mentor Console &amp; Review Reports &nbsp;→
              </a>
            </div>

            <div style="border-top:1px solid #f1f5f9;padding-top:14px;color:#94a3b8;font-size:11px;line-height:1.5;text-align:center;margin-top:16px">
              Sent to ${esc(mentor.email)} as part of the Campus Point Mentor Quality &amp; Daily Engagement Program.<br>
              <a href="https://campuspoint.in" style="color:#FF693D;text-decoration:none">campuspoint.in</a>
            </div>
          </div>
        </div>
      `;

      const text = `Namaste ${mentor.name},\n\nYou have not logged into your mentor dashboard today. Please open your dashboard to review daily reports and growth for your assigned students: ${studentNames}.\n\nOpen Mentor Dashboard: ${dashboardLink}`;

      const res = await sendMail({
        to: mentor.email,
        subject,
        html,
        text,
        tags: ["mentor-reminder", "inactivity"],
      });

      if (res.ok) {
        mentor.lastInactivityEmailSentAt = new Date();
        await mentor.save();
        sentCount++;

        MentorActivityLog.create({
          mentorId: mentor._id,
          mentorName: mentor.name,
          mentorEmail: mentor.email,
          action: "mentor_inactivity_alert",
          details: {
            assignedStudents: mentor.students,
            studentNames,
            studentsCount: studentCount,
            timeWindow: "9:00 PM – 10:00 PM IST",
          },
        }).catch(() => {});
      }
    } catch (err) {
      console.error(`[mentorInactivityJob] Failed for mentor ${mentor.email}:`, err.message);
    }
  }

  if (sentCount > 0) {
    console.log(`[mentorInactivityJob] Sent ${sentCount} 9 PM inactivity reminder(s) to mentors.`);
  }

  return { ok: true, sentCount };
}

export function startMentorInactivityJob() {
  const tick = () => checkAndSendMentorInactivityAlerts().catch((e) => console.error("[mentorInactivityJob]", e.message));
  setTimeout(tick, 2 * 60 * 1000); // 2 minutes after startup
  setInterval(tick, 15 * 60 * 1000); // check every 15 minutes to accurately catch 9:00 PM – 10:00 PM IST window
}
