import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import Mentor from "../models/Mentor.js";
import MentorActivityLog from "../models/MentorActivityLog.js";

/**
 * Extracts real client IP behind reverse proxies (Cloudflare, Render, Nginx).
 */
export function getClientIpFromReq(req) {
  if (!req) return "";
  const cf = req.headers?.["cf-connecting-ip"];
  if (cf && typeof cf === "string") return cf.split(",")[0].trim();
  const real = req.headers?.["x-real-ip"];
  if (real && typeof real === "string") return real.split(",")[0].trim();
  const fwd = req.headers?.["x-forwarded-for"];
  if (fwd && typeof fwd === "string") {
    const first = fwd.split(",")[0].trim();
    if (first) return first;
  }
  return req.ip || req.socket?.remoteAddress || "";
}

/**
 * Record an authenticated active student session in real-time.
 * Invoked on:
 * 1. Password login
 * 2. OTP login
 * 3. Study log / progress update (PUT /api/mentorship/progress)
 * 4. Periodic active dashboard sync (GET /api/mentorship/progress)
 */
export async function trackStudentActiveSession({
  userId,
  email,
  studentId,
  activityType = "portal_activity",
  details = {},
  req = null,
}) {
  try {
    const now = new Date();
    const cleanEmail = String(email || "").toLowerCase().trim();

    // 1. Touch User.lastLogin
    if (userId) {
      User.updateOne({ _id: userId }, { $set: { lastLogin: now } }).catch(() => {});
    } else if (cleanEmail) {
      User.updateOne({ email: cleanEmail }, { $set: { lastLogin: now } }).catch(() => {});
    }

    // 2. Resolve enrollment for plan and studentId
    let enrs = [];
    if (studentId) {
      enrs = await Enrollment.find({
        studentId: String(studentId).toUpperCase(),
        status: "paid",
      }).select("studentId plan name email region").lean();
    }
    if ((!enrs || enrs.length === 0) && cleanEmail) {
      enrs = await Enrollment.find({
        email: cleanEmail,
        status: "paid",
      }).select("studentId plan name email region").lean();
    }

    const clientIp = getClientIpFromReq(req);
    const clientUa = req ? String(req.headers?.["user-agent"] || "").slice(0, 300) : "Portal Web Access";

    if (!enrs || enrs.length === 0) {
      // Unenrolled or generic student
      if (studentId) {
        // De-duplicate within 3 minutes
        const recent = await MentorActivityLog.findOne({
          action: "student_login",
          studentId: String(studentId).toUpperCase(),
          createdAt: { $gte: new Date(Date.now() - 3 * 60 * 1000) },
        });
        if (!recent) {
          await MentorActivityLog.create({
            studentId: String(studentId).toUpperCase(),
            action: "student_login",
            details: { activity: activityType, ...details },
            ip: clientIp || "Portal Web Access",
            userAgent: clientUa,
          });
        }
      }
      return;
    }

    // 3. For each paid enrollment, record and attribute to assigned mentors
    for (const enr of enrs) {
      const sid = String(enr.studentId || "").toUpperCase();
      if (!sid) continue;

      // De-duplicate within 3 minutes for identical studentId & plan
      const recentLog = await MentorActivityLog.findOne({
        action: "student_login",
        studentId: sid,
        createdAt: { $gte: new Date(Date.now() - 3 * 60 * 1000) },
      });

      if (recentLog) {
        // Just touch the timestamp and update details if newer
        await MentorActivityLog.updateOne(
          { _id: recentLog._id },
          {
            $set: {
              updatedAt: now,
              details: { ...(recentLog.details || {}), ...details, activity: activityType, lastActive: now },
            },
          }
        ).catch(() => {});
        continue;
      }

      const studentName = enr.name || "Student";
      const studentRegion = enr.region || "Indian";

      // Find assigned mentors
      const mentors = await Mentor.find({ students: sid, active: true })
        .select("_id name email")
        .lean();

      if (mentors && mentors.length > 0) {
        for (const m of mentors) {
          await MentorActivityLog.create({
            mentorId: m._id,
            mentorName: m.name,
            mentorEmail: m.email,
            studentId: sid,
            studentName,
            userId: userId || undefined,
            region: studentRegion,
            action: "student_login",
            details: { plan: enr.plan, region: studentRegion, activity: activityType, ...details },
            ip: clientIp || "Portal Web Access",
            userAgent: clientUa,
          });
        }
      } else {
        // Record even if mentor assignment is pending
        await MentorActivityLog.create({
          studentId: sid,
          studentName,
          userId: userId || undefined,
          region: studentRegion,
          action: "student_login",
          details: { plan: enr.plan, region: studentRegion, activity: activityType, unassigned: true, ...details },
          ip: clientIp || "Portal Web Access",
          userAgent: clientUa,
        });
      }
    }
  } catch (err) {
    console.error("[trackStudentActiveSession]", err.message);
  }
}
