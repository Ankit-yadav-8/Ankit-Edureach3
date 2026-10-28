import express from "express";
import Mentor from "../models/Mentor.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import MentorTask from "../models/MentorTask.js";
import MentorActivityLog from "../models/MentorActivityLog.js";
import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

// Protect all analytics endpoints with OTP-verified admin session token
router.use(requireAdmin);

export const MENTOR_PALETTE = [
  "#FF693D", // Campus Point Coral
  "#3B82F6", // Royal Blue
  "#10B981", // Emerald Green
  "#8B5CF6", // Purple
  "#F59E0B", // Amber / Golden
  "#EC4899", // Magenta Pink
  "#06B6D4", // Electric Cyan
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F97316", // Tangerine
  "#84CC16", // Lime
  "#A855F7", // Bright Violet
  "#E11D48", // Crimson Rose
  "#0EA5E9", // Sky Blue
  "#D97706", // Dark Amber
  "#4F46E5", // Deep Indigo
];

export function parseDateRange(query = {}) {
  const range = String(query.range || "30d").toLowerCase();
  const now = new Date();
  let from;
  let to = new Date();

  if (range === "today") {
    from = new Date(now);
    from.setHours(0, 0, 0, 0);
  } else if (range === "7d") {
    from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (range === "30d") {
    from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (range === "custom") {
    if (query.startDate) {
      from = new Date(query.startDate);
      from.setHours(0, 0, 0, 0);
    } else {
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    if (query.endDate) {
      to = new Date(query.endDate);
      to.setHours(23, 59, 59, 999);
    }
  } else {
    from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { from, to, range };
}

/* ── 1. Platform-wide Overview Business Analytics ─────────────────────────────
   Returns KPI metrics, registration numbers, active users, engagement rates,
   daily trend charts, and recent activity feed. */
router.get("/overview", async (req, res) => {
  try {
    const { from, to, range } = parseDateRange(req.query);
    const now = new Date();

    const [
      totalStudents,
      paidEnrollments,
      mentors,
      allTasksDocs,
      studentLoginLogs,
      mentorLoginLogs,
      recentLogs,
    ] = await Promise.all([
      User.countDocuments(),
      Enrollment.find({ status: "paid" }).select("studentId email createdAt").lean(),
      Mentor.find().select("name email college students active lastLogin createdAt").lean(),
      MentorTask.find().lean(),
      MentorActivityLog.find({
        action: "student_login",
        createdAt: { $gte: from, $lte: to },
      }).lean(),
      MentorActivityLog.find({
        action: "mentor_login",
        createdAt: { $gte: from, $lte: to },
      }).lean(),
      MentorActivityLog.find().sort({ createdAt: -1 }).limit(25).lean(),
    ]);

    const activeMentors = mentors.filter((m) => m.active);
    const inactiveMentors = mentors.filter((m) => !m.active);

    // Unique students assigned across all mentors (no double counting)
    const assignedStudentIds = new Set();
    mentors.forEach((m) => {
      (m.students || []).forEach((sid) => assignedStudentIds.add(String(sid).toUpperCase()));
    });
    const assignedStudentsCount = assignedStudentIds.size;
    const paidStudentsCount = paidEnrollments.length;
    const unassignedStudentsCount = Math.max(0, paidStudentsCount - assignedStudentsCount);

    // Active student users in range (unique logins)
    const uniqueStudentsLoggedIn = new Set();
    studentLoginLogs.forEach((l) => {
      if (l.studentId) uniqueStudentsLoggedIn.add(String(l.studentId).toUpperCase());
      else if (l.userId) uniqueStudentsLoggedIn.add(String(l.userId));
    });
    const activeStudentUsers = uniqueStudentsLoggedIn.size;

    // Active mentors logged in in range
    const uniqueMentorsLoggedIn = new Set();
    mentorLoginLogs.forEach((l) => {
      if (l.mentorId) uniqueMentorsLoggedIn.add(String(l.mentorId));
    });
    // Fallback: check lastLogin timestamp if logs are sparse
    mentors.forEach((m) => {
      if (m.lastLogin && new Date(m.lastLogin) >= from && new Date(m.lastLogin) <= to) {
        uniqueMentorsLoggedIn.add(String(m._id));
      }
    });

    // Task aggregations
    let totalTasksAssigned = 0;
    let totalTasksCompleted = 0;
    let totalTasksOverdue = 0;

    allTasksDocs.forEach((doc) => {
      (doc.tasks || []).forEach((t) => {
        totalTasksAssigned++;
        if (t.completed) {
          totalTasksCompleted++;
        } else {
          // Check overdue if pending and older than 7 days
          const created = t.createdAt ? new Date(t.createdAt).getTime() : doc.createdAt ? new Date(doc.createdAt).getTime() : 0;
          if (created && (now.getTime() - created > 7 * 24 * 60 * 60 * 1000)) {
            totalTasksOverdue++;
          }
        }
      });
    });

    const totalTasksPending = Math.max(0, totalTasksAssigned - totalTasksCompleted);
    const overallTaskCompletionRate = totalTasksAssigned > 0
      ? Math.round((totalTasksCompleted / totalTasksAssigned) * 100)
      : 0;

    // Engagement rates
    const mentorEngagementRate = activeMentors.length > 0
      ? Math.round((uniqueMentorsLoggedIn.size / activeMentors.length) * 100)
      : 0;

    const studentEngagementRate = assignedStudentsCount > 0
      ? Math.round((activeStudentUsers / assignedStudentsCount) * 100)
      : 0;

    const mentorProductivity = activeMentors.length > 0
      ? Number((totalTasksAssigned / activeMentors.length).toFixed(1))
      : 0;

    // Daily historical trend (days between from and to, capped at 31 points)
    const dailyTrend = [];
    const diffDays = Math.min(31, Math.max(1, Math.ceil((to - from) / (24 * 60 * 60 * 1000))));
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = 0; i < diffDays; i++) {
      const dStart = new Date(from.getTime() + i * dayMs);
      dStart.setHours(0, 0, 0, 0);
      const dEnd = new Date(dStart.getTime() + dayMs - 1);

      const dStudentLogins = studentLoginLogs.filter((l) => {
        const t = new Date(l.createdAt).getTime();
        return t >= dStart.getTime() && t <= dEnd.getTime();
      }).length;

      const dMentorLogins = mentorLoginLogs.filter((l) => {
        const t = new Date(l.createdAt).getTime();
        return t >= dStart.getTime() && t <= dEnd.getTime();
      }).length;

      const label = dStart.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      dailyTrend.push({
        date: dStart.toISOString().split("T")[0],
        label,
        studentLogins: dStudentLogins,
        mentorLogins: dMentorLogins,
        totalLogins: dStudentLogins + dMentorLogins,
      });
    }

    res.json({
      period: { range, from, to },
      metrics: {
        totalRegisteredStudents: totalStudents,
        totalPaidStudents: paidStudentsCount,
        totalMentors: mentors.length,
        activeMentors: activeMentors.length,
        inactiveMentors: inactiveMentors.length,
        assignedStudents: assignedStudentsCount,
        unassignedStudents: unassignedStudentsCount,
        totalStudentLogins: studentLoginLogs.length,
        activeStudentUsers,
        totalMentorLogins: mentorLoginLogs.length,
        activeMentorLogins: uniqueMentorsLoggedIn.size,
        totalTasksAssigned,
        totalTasksCompleted,
        totalTasksPending,
        totalTasksOverdue,
        overallTaskCompletionRate,
        mentorEngagementRate,
        studentEngagementRate,
        mentorProductivity,
      },
      dailyTrend,
      recentActivity: recentLogs.map((l) => ({
        id: l._id,
        action: l.action,
        mentorName: l.mentorName || "",
        studentName: l.studentName || "",
        studentId: l.studentId || "",
        details: l.details || {},
        createdAt: l.createdAt,
      })),
    });
  } catch (e) {
    console.error("[admin/analytics/overview]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
