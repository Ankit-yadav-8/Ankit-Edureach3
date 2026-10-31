import { sendMail } from "../utils/mailer.js";
import { checkAndSendMentorInactivityAlerts } from "../jobs/mentorInactivityJob.js";
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Mentor from "../models/Mentor.js";
import Enrollment from "../models/Enrollment.js";
import MentorTask from "../models/MentorTask.js";
import MentorAccessLog from "../models/MentorAccessLog.js";
import MentorActivityLog from "../models/MentorActivityLog.js";
import { requireAdmin } from "../middleware/admin.js";
import { parseDateRange, MENTOR_PALETTE } from "./adminAnalytics.js";

// Admin-only management of mentor accounts. Every route here sits behind
// requireAdmin (the OTP-issued session token), mounted under /api/admin/mentors.
const router = express.Router();

router.use(requireAdmin);

const publicMentor = (m) => ({
  id: String(m._id), name: m.name, email: m.email, phone: m.phone,
  college: m.college, students: m.students || [], active: m.active,
  mustChangePassword: !!m.mustChangePassword, lastLogin: m.lastLogin, createdAt: m.createdAt,
});

// Readable but unguessable — the admin passes this to the mentor out of band,
// and the mentor is forced to replace it on first sign-in. Drawn from a
// deliberately unambiguous alphabet: no 0/O/o, 1/l/I, and no +/-/_ that get
// dropped or mangled when a one-time password is read aloud, retyped, or copied
// by hand. That handoff — not the crypto — is where these passwords actually
// fail, so the format is chosen to survive it. 12 chars over 54 symbols ≈ 71
// bits of entropy, on par with the base64url tokens this replaces.
const PW_ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generatePassword(len = 12) {
  let out = "";
  for (let i = 0; i < len; i++) out += PW_ALPHABET[crypto.randomInt(PW_ALPHABET.length)];
  return out;
}

/* ── Access log ──────────────────────────────────────────────────────────────
   Who read which student, and when. A log nobody can read is only half a
   control, so it's surfaced here rather than living only in the database.
   `?denied=1` filters to refused attempts — a burst of those is someone probing
   for CP IDs they weren't given. */
router.get("/access-log", async (req, res) => {
  try {
    const q = {};
    if (req.query.mentorId) q.mentorId = req.query.mentorId;
    if (req.query.studentId) q.studentId = String(req.query.studentId).toUpperCase();
    if (req.query.denied === "1") q.allowed = false;

    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const [entries, deniedCount] = await Promise.all([
      MentorAccessLog.find(q).sort({ createdAt: -1 }).limit(limit).lean(),
      MentorAccessLog.countDocuments({ ...q, allowed: false }),
    ]);
    res.json({ entries, deniedCount });
  } catch (e) {
    console.error("[admin/mentors access-log]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Mentor Analytics & Tracking (Comparison Charts, Table & KPIs) ────────────
   Aggregates authentic login events, task operations, and assigned student logins
   for all mentors across selectable reporting date ranges. */
router.get("/tracking-analytics", async (req, res) => {
  try {
    const { from, to, range } = parseDateRange(req.query);
    const filterMentorId = req.query.mentorId ? String(req.query.mentorId) : null;
    const now = new Date();

    const mentorQuery = filterMentorId ? { _id: filterMentorId } : {};
    const [mentors, allTasksDocs, allLogs, enrollments] = await Promise.all([
      Mentor.find(mentorQuery).select("-passwordHash").sort({ createdAt: -1 }).lean(),
      MentorTask.find().lean(),
      MentorActivityLog.find({ createdAt: { $gte: from, $lte: to } }).lean(),
      Enrollment.find({ status: "paid" }).select("studentId name email createdAt").lean(),
    ]);

    // Index tasks by studentId
    const tasksByStudent = new Map();
    allTasksDocs.forEach((doc) => {
      tasksByStudent.set(String(doc.studentId).toUpperCase(), doc.tasks || []);
    });

    // Also get all-time login counts per mentor for extra context
    const allTimeLoginLogs = await MentorActivityLog.aggregate([
      { $match: { action: "mentor_login" } },
      { $group: { _id: "$mentorId", count: { $sum: 1 } } },
    ]);
    const allTimeLoginMap = new Map();
    allTimeLoginLogs.forEach((item) => {
      if (item._id) allTimeLoginMap.set(String(item._id), item.count);
    });

    // Build unique global students set to prevent double counting in totals
    const platformUniqueStudentsLoggedIn = new Set();
    const platformUniqueStudentsAssigned = new Set();

    const mentorStats = mentors.map((m, index) => {
      const mId = String(m._id);
      const mColor = MENTOR_PALETTE[index % MENTOR_PALETTE.length];

      // Logs specifically for this mentor in the selected period
      const mLogs = allLogs.filter((l) => String(l.mentorId) === mId);
      const loginLogs = mLogs.filter((l) => l.action === "mentor_login");
      const failedLoginLogs = mLogs.filter((l) => l.action === "mentor_login_failed");
      const taskUpdateLogs = mLogs.filter((l) => l.action === "task_update");
      const studentLoginLogs = mLogs.filter((l) => l.action === "student_login");

      // Total logins in period: count of login logs, fallback to 1 if lastLogin falls in period
      let totalLogins = loginLogs.length;
      if (totalLogins === 0 && m.lastLogin && new Date(m.lastLogin) >= from && new Date(m.lastLogin) <= to) {
        totalLogins = 1;
      }

      // First and most recent login in range
      const sortedLogins = [...loginLogs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const firstLoginInRange = sortedLogins.length > 0 ? sortedLogins[0].createdAt : null;
      const mostRecentLoginInRange = sortedLogins.length > 0
        ? sortedLogins[sortedLogins.length - 1].createdAt
        : (m.lastLogin || null);

      // Active sessions (estimated based on login within 24h & active account)
      const isActiveSession = m.active && m.lastLogin && (now.getTime() - new Date(m.lastLogin).getTime() < 24 * 60 * 60 * 1000) ? 1 : 0;

      // Assigned students
      const assignedStudents = (m.students || []).map((s) => String(s).toUpperCase());
      assignedStudents.forEach((sid) => platformUniqueStudentsAssigned.add(sid));

      // Students who logged in
      const studentsLoggedInSet = new Set();
      studentLoginLogs.forEach((l) => {
        if (l.studentId && assignedStudents.includes(String(l.studentId).toUpperCase())) {
          studentsLoggedInSet.add(String(l.studentId).toUpperCase());
          platformUniqueStudentsLoggedIn.add(String(l.studentId).toUpperCase());
        }
      });

      // Tasks assigned, completed, updated, pending for this mentor's students
      let tasksAssigned = 0;
      let tasksCompleted = 0;
      let tasksOverdue = 0;
      const tasksByStudentList = [];
      const mentorAssignedTasks = [];

      assignedStudents.forEach((sid) => {
        const enr = enrollments.find((e) => String(e.studentId || "").toUpperCase() === sid);
        const sName = enr?.name || sid;
        const studentTasks = tasksByStudent.get(sid) || [];
        let sCompleted = 0;

        studentTasks.forEach((t) => {
          tasksAssigned++;
          if (t.completed) {
            tasksCompleted++;
            sCompleted++;
          } else {
            const created = t.createdAt ? new Date(t.createdAt).getTime() : 0;
            if (created && (now.getTime() - created > 7 * 24 * 60 * 60 * 1000)) {
              tasksOverdue++;
            }
          }
          mentorAssignedTasks.push({
            id: t.id || t._id,
            text: t.text,
            studentId: sid,
            studentName: sName,
            mentorId: mId,
            mentorName: m.name,
            completed: !!t.completed,
            completedAt: t.completedAt || null,
            createdAt: t.createdAt || null,
          });
        });

        tasksByStudentList.push({
          studentId: sid,
          studentName: sName,
          studentEmail: enr?.email || "",
          tasksAssigned: studentTasks.length,
          tasksCompleted: sCompleted,
          completionRate: studentTasks.length > 0 ? Math.round((sCompleted / studentTasks.length) * 100) : 0,
          tasks: studentTasks.map((t) => ({
            id: t.id || t._id,
            text: t.text,
            completed: !!t.completed,
            completedAt: t.completedAt,
            createdAt: t.createdAt,
          })),
        });
      });

      const tasksUpdated = taskUpdateLogs.length;
      const tasksPending = Math.max(0, tasksAssigned - tasksCompleted);
      const completionRate = tasksAssigned > 0 ? Math.round((tasksCompleted / tasksAssigned) * 100) : 0;

      // Last recorded mentor activity
      const allMLogs = mLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const lastActivity = allMLogs.length > 0
        ? {
            action: allMLogs[0].action,
            time: allMLogs[0].createdAt,
            details: allMLogs[0].details,
          }
        : m.lastLogin
          ? { action: "mentor_login", time: m.lastLogin, details: {} }
          : null;

      // Activity status
      let activityStatus = "Active";
      const lastActionTime = lastActivity?.time ? new Date(lastActivity.time).getTime() : 0;
      if (!m.active) {
        activityStatus = "Disabled";
      } else if (!lastActionTime || (now.getTime() - lastActionTime > 7 * 24 * 60 * 60 * 1000)) {
        activityStatus = "Inactive";
      }

      return {
        id: mId,
        name: m.name,
        email: m.email,
        phone: m.phone || "",
        college: m.college || "",
        active: m.active,
        color: mColor,
        totalLogins,
        allTimeLogins: (allTimeLoginMap.get(mId) || 0) + (m.lastLogin ? 1 : 0),
        failedLoginsCount: failedLoginLogs.length,
        lastLogin: m.lastLogin,
        firstLoginInRange,
        mostRecentLoginInRange,
        activeSessions: isActiveSession,
        assignedStudentsCount: assignedStudents.length,
        assignedStudents,
        studentsLoggedIn: studentsLoggedInSet.size,
        studentsLoggedInList: Array.from(studentsLoggedInSet),
        activeStudentsInRange: studentsLoggedInSet.size,
        tasksAssigned,
        tasksCompleted,
        tasksUpdated,
        tasksPending,
        tasksOverdue,
        completionRate,
        tasksByStudentList,
        assignedTasksList: mentorAssignedTasks,
        lastActivity,
        activityStatus,
      };
    });

    // Summary calculation
    const totalLoginsSum = mentorStats.reduce((s, m) => s + m.totalLogins, 0);
    const totalTasksAssignedSum = mentorStats.reduce((s, m) => s + m.tasksAssigned, 0);
    const totalTasksCompletedSum = mentorStats.reduce((s, m) => s + m.tasksCompleted, 0);
    const totalTasksUpdatedSum = mentorStats.reduce((s, m) => s + m.tasksUpdated, 0);
    const totalTasksPendingSum = mentorStats.reduce((s, m) => s + m.tasksPending, 0);
    const mentorsWithTasks = mentorStats.filter((m) => m.tasksAssigned > 0);
    const avgCompletionRate = mentorsWithTasks.length > 0
      ? Math.round(mentorsWithTasks.reduce((s, m) => s + m.completionRate, 0) / mentorsWithTasks.length)
      : 0;

    res.json({
      period: { range, from, to },
      summary: {
        totalMentors: mentors.length,
        activeMentorsCount: mentors.filter((m) => m.active).length,
        inactiveMentorsCount: mentors.filter((m) => !m.active).length,
        totalLoginsSum,
        totalAssignedStudentsSum: platformUniqueStudentsAssigned.size,
        totalUniqueStudentsLoggedIn: platformUniqueStudentsLoggedIn.size,
        totalTasksAssignedSum,
        totalTasksCompletedSum,
        totalTasksUpdatedSum,
        totalTasksPendingSum,
        avgCompletionRate,
      },
      mentors: mentorStats,
    });
  } catch (e) {
    console.error("[admin/mentors tracking-analytics]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Individual Mentor Detail Deep-Dive ───────────────────────────────────────
   Full profile with login history, activity timeline, daily login trend,
   assigned student status, and task history. */
router.get("/:id/tracking-detail", async (req, res) => {
  try {
    const { from, to, range } = parseDateRange(req.query);
    const mentorId = req.params.id;

    const mentor = await Mentor.findById(mentorId).select("-passwordHash").lean();
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    // Fetch logs, student enrollments, and mentor tasks
    const [allLogs, allTasksDocs, enrollments] = await Promise.all([
      MentorActivityLog.find({
        $or: [{ mentorId }, { studentId: { $in: mentor.students || [] } }],
        createdAt: { $gte: from, $lte: to },
      }).sort({ createdAt: -1 }).limit(100).lean(),
      MentorTask.find({ studentId: { $in: mentor.students || [] } }).lean(),
      Enrollment.find({ studentId: { $in: mentor.students || [] }, status: "paid" })
        .select("studentId name email phone plan createdAt")
        .lean(),
    ]);

    // Map tasks by student ID
    const tasksByStudent = new Map();
    allTasksDocs.forEach((d) => tasksByStudent.set(String(d.studentId).toUpperCase(), d.tasks || []));

    // Map enrollments
    const enrMap = new Map();
    enrollments.forEach((e) => enrMap.set(String(e.studentId).toUpperCase(), e));

    // Daily breakdown for this mentor
    const dailyTrend = [];
    const diffDays = Math.min(31, Math.max(1, Math.ceil((to - from) / (24 * 60 * 60 * 1000))));
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = 0; i < diffDays; i++) {
      const dStart = new Date(from.getTime() + i * dayMs);
      dStart.setHours(0, 0, 0, 0);
      const dEnd = new Date(dStart.getTime() + dayMs - 1);

      const dLogins = allLogs.filter((l) => {
        const t = new Date(l.createdAt).getTime();
        return String(l.mentorId) === mentorId && l.action === "mentor_login" && t >= dStart.getTime() && t <= dEnd.getTime();
      }).length;

      const dStudentLogins = allLogs.filter((l) => {
        const t = new Date(l.createdAt).getTime();
        return l.action === "student_login" && t >= dStart.getTime() && t <= dEnd.getTime();
      }).length;

      const dTaskUpdates = allLogs.filter((l) => {
        const t = new Date(l.createdAt).getTime();
        return (l.action === "task_update" || l.action === "task_assign") && t >= dStart.getTime() && t <= dEnd.getTime();
      }).length;

      dailyTrend.push({
        date: dStart.toISOString().split("T")[0],
        label: dStart.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        mentorLogins: dLogins,
        studentLogins: dStudentLogins,
        taskUpdates: dTaskUpdates,
      });
    }

    // Detailed student list
    const studentLoginLogs = allLogs.filter((l) => l.action === "student_login");
    const studentList = (mentor.students || []).map((sid) => {
      const sIdUpper = String(sid).toUpperCase();
      const enr = enrMap.get(sIdUpper);
      const tasks = tasksByStudent.get(sIdUpper) || [];
      const sLogs = studentLoginLogs.filter((l) => String(l.studentId).toUpperCase() === sIdUpper);

      const completedCount = tasks.filter((t) => t.completed).length;

      return {
        studentId: sIdUpper,
        name: enr?.name || sIdUpper,
        email: enr?.email || "",
        phone: enr?.phone || "",
        plan: enr?.plan || "",
        enrolledAt: enr?.createdAt || null,
        loginsCount: sLogs.length,
        hasLoggedInInRange: sLogs.length > 0,
        lastLogin: sLogs.length > 0 ? sLogs[0].createdAt : null,
        tasksCount: tasks.length,
        tasksCompleted: completedCount,
        tasksPending: Math.max(0, tasks.length - completedCount),
        tasks,
      };
    });

    res.json({
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        phone: mentor.phone,
        college: mentor.college,
        active: mentor.active,
        lastLogin: mentor.lastLogin,
        createdAt: mentor.createdAt,
      },
      period: { range, from, to },
      dailyTrend,
      students: studentList,
            logs: allLogs.map((l) => {
        const sUpper = String(l.studentId || "").toUpperCase();
        const enrName = enrMap.get(sUpper)?.name;
        return {
          id: l._id,
          action: l.action,
          studentId: l.studentId || "",
          studentName: enrName || l.studentName || "",
          details: l.details || {},
          createdAt: l.createdAt,
        };
      }),
    });
  } catch (e) {
    console.error("[admin/mentors tracking-detail]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── List / create ───────────────────────────────────────────────────────── */
router.get("/", async (_req, res) => {
  const mentors = await Mentor.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
  res.json({ mentors: mentors.map(publicMentor) });
});

router.post("/", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").toLowerCase().trim();
    const phone = String(req.body?.phone || "").trim();
    const college = String(req.body?.college || "").trim();
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });
    if (await Mentor.exists({ email })) return res.status(409).json({ error: "A mentor with that email already exists" });

    // The admin may supply a password, else we mint one and return it ONCE.
    // Trim it so a stray space pasted into the form doesn't become part of the
    // hash — the same normalisation the login endpoint applies to what's typed.
    const password = String(req.body?.password || "").trim() || generatePassword();
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

    const mentor = await Mentor.create({
      name, email, phone, college,
      passwordHash: await bcrypt.hash(password, 12),
      students: [], mustChangePassword: true,
    });

    // The only time the plaintext password is ever exposed. It is not stored
    // and cannot be read back — a lost password must be reset, not recovered.
    res.status(201).json({ mentor: publicMentor(mentor), password });
  } catch (e) {
    console.error("[admin/mentors POST]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Assign / unassign a student by CP ID ────────────────────────────────── */
router.post("/:id/students", async (req, res) => {
  try {
    const studentId = String(req.body?.studentId || "").trim().toUpperCase();
    if (!studentId) return res.status(400).json({ error: "studentId required" });

    // Only ever assign a CP ID that maps to a real paid enrolment — otherwise a
    // typo would create an assignment that silently never resolves.
    const enr = await Enrollment.findOne({ studentId, status: "paid" }).select("name email").lean();
    if (!enr) return res.status(404).json({ error: `No paid enrolment found for ${studentId}` });
    if (!enr.email) return res.status(422).json({ error: `${studentId} has no account email, so their data cannot be scoped to a mentor` });

    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: studentId } }, // idempotent: re-assigning is a no-op
      { new: true }
    ).select("-passwordHash").lean();
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    res.json({ mentor: publicMentor(mentor), student: { studentId, name: enr.name } });
  } catch (e) {
    console.error("[admin/mentors assign]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id/students/:studentId", async (req, res) => {
  const studentId = String(req.params.studentId || "").trim().toUpperCase();
  const mentor = await Mentor.findByIdAndUpdate(
    req.params.id, { $pull: { students: studentId } }, { new: true }
  ).select("-passwordHash").lean();
  if (!mentor) return res.status(404).json({ error: "Mentor not found" });
  res.json({ mentor: publicMentor(mentor) });
});

/* ── Deactivate / reactivate / reset password ────────────────────────────── */
router.patch("/:id", async (req, res) => {
  try {
    const update = {};
    for (const k of ["name", "phone", "college"]) {
      if (typeof req.body?.[k] === "string") update[k] = req.body[k].trim();
    }
    if (typeof req.body?.active === "boolean") {
      update.active = req.body.active;
      // Revoking must take effect now, not whenever the token happens to expire.
      if (!req.body.active) update.$inc = { tokenVersion: 1 };
    }
    const { $inc, ...set } = update;
    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id, { $set: set, ...($inc ? { $inc } : {}) }, { new: true }
    ).select("-passwordHash").lean();
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });
    res.json({ mentor: publicMentor(mentor) });
  } catch (e) {
    console.error("[admin/mentors PATCH]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/reset-password", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });
    const password = generatePassword();
    mentor.passwordHash = await bcrypt.hash(password, 12);
    mentor.mustChangePassword = true;
    mentor.tokenVersion = (mentor.tokenVersion || 0) + 1; // kill existing sessions
    mentor.failedLogins = 0;
    mentor.lockedUntil = null;
    await mentor.save();
    res.json({ password });
  } catch (e) {
    console.error("[admin/mentors reset]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Delete a mentor ──────────────────────────────────────────────────────── */
router.delete("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });
    res.json({ ok: true, deletedId: req.params.id, name: mentor.name });
  } catch (e) {
    console.error("[admin/mentors DELETE]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Eligible paid students directory for assignment & lookup ──────────────── */
router.get("/eligible-students", async (_req, res) => {
  try {
    const enrollments = await Enrollment.find({ status: "paid" })
      .select("studentId name email phone currentClass targetExam studentGroup plan createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const mentors = await Mentor.find().select("name email students").lean();
    const mentorByStudent = new Map();
    mentors.forEach((m) => {
      (m.students || []).forEach((sid) => {
        mentorByStudent.set(String(sid).toUpperCase(), { id: String(m._id), name: m.name, email: m.email });
      });
    });

    const list = enrollments
      .filter((e) => e.studentId)
      .map((e) => {
        const sid = String(e.studentId).toUpperCase();
        return {
          studentId: sid,
          name: e.name || "Student",
          email: e.email || "",
          phone: e.phone || "",
          currentClass: e.currentClass || "",
          targetExam: e.targetExam || "",
          studentGroup: e.studentGroup || "",
          plan: e.plan || "",
          assignedMentor: mentorByStudent.get(sid) || null,
          createdAt: e.createdAt,
        };
      });

    res.json({ students: list });
  } catch (e) {
    console.error("[admin/mentors eligible-students]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Assign/update student group like Campus-Point-Number ───────────────────── */
router.post("/student-group", async (req, res) => {
  try {
    const studentId = String(req.body?.studentId || "").trim().toUpperCase();
    const studentGroup = String(req.body?.studentGroup || "").trim();
    if (!studentId) return res.status(400).json({ error: "studentId is required" });

    await Enrollment.updateMany(
      { studentId },
      { $set: { studentGroup } }
    );
    res.json({ ok: true, studentId, studentGroup });
  } catch (e) {
    console.error("[admin/mentors student-group]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── All students overview: grouped by common mentor + group tags + tasks ──── */
router.get("/all-students-overview", async (_req, res) => {
  try {
    const [mentors, enrollments, allTasksDocs] = await Promise.all([
      Mentor.find().select("-passwordHash").lean(),
      Enrollment.find({ status: "paid" })
        .select("studentId name email phone currentClass targetExam studentGroup plan createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      MentorTask.find().lean(),
    ]);

    const tasksByStudent = new Map();
    allTasksDocs.forEach((doc) => {
      tasksByStudent.set(String(doc.studentId).toUpperCase(), doc.tasks || []);
    });

    const enrByStudentId = new Map();
    enrollments.forEach((e) => {
      if (e.studentId) enrByStudentId.set(String(e.studentId).toUpperCase(), e);
    });

    const assignedStudentIds = new Set();
    const mentorGroups = mentors.map((m, idx) => {
      const assignedIds = (m.students || []).map((s) => String(s).toUpperCase());
      const studentsList = assignedIds.map((sid) => {
        assignedStudentIds.add(sid);
        const enr = enrByStudentId.get(sid);
        const tasks = tasksByStudent.get(sid) || [];
        const completedTasks = tasks.filter((t) => t.completed);
        return {
          studentId: sid,
          name: enr?.name || "Student",
          email: enr?.email || "",
          phone: enr?.phone || "",
          currentClass: enr?.currentClass || "",
          targetExam: enr?.targetExam || "",
          studentGroup: enr?.studentGroup || `Campus-Point-${idx + 1}`,
          plan: enr?.plan || "",
          tasksAssigned: tasks.length,
          tasksCompleted: completedTasks.length,
          tasks,
          createdAt: enr?.createdAt || null,
        };
      });

      return {
        mentorId: String(m._id),
        mentorName: m.name,
        mentorEmail: m.email,
        mentorCollege: m.college || "",
        mentorPhone: m.phone || "",
        active: m.active,
        defaultGroupLabel: `Campus-Point-${idx + 1}`,
        studentCount: studentsList.length,
        students: studentsList,
      };
    });

    // Unassigned students
    const unassignedStudents = [];
    enrollments.forEach((e) => {
      if (e.studentId && !assignedStudentIds.has(String(e.studentId).toUpperCase())) {
        const sid = String(e.studentId).toUpperCase();
        const tasks = tasksByStudent.get(sid) || [];
        unassignedStudents.push({
          studentId: sid,
          name: e.name || "Student",
          email: e.email || "",
          phone: e.phone || "",
          currentClass: e.currentClass || "",
          targetExam: e.targetExam || "",
          studentGroup: e.studentGroup || "Unassigned",
          plan: e.plan || "",
          tasksAssigned: tasks.length,
          tasksCompleted: tasks.filter((t) => t.completed).length,
          tasks,
          createdAt: e.createdAt,
        });
      }
    });

    res.json({
      mentorGroups,
      unassigned: {
        studentCount: unassignedStudents.length,
        students: unassignedStudents,
      },
      totalPaidStudents: enrollments.filter((e) => e.studentId).length,
    });
  } catch (e) {
    console.error("[admin/mentors all-students-overview]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

const esc = (s) => String(s ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));


/* ── Admin sends custom email to mentors ─────────────────────────────────────
   targetType: "all" | "inactive_today" | "single"
   mentorId: optional string if targetType === "single"
   subject: string
   message: string
   includeDashboardLink: boolean
   includeStudentsList: boolean
*/
router.post("/send-email", async (req, res) => {
  try {
    const targetType = req.body?.targetType || req.body?.target || "all";
    const mentorId = req.body?.mentorId || null;
    const {
      subject,
      message,
      includeDashboardLink = true,
      includeStudentsList = true,
    } = req.body || {};

    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    let mentors = [];
    if (targetType === "single" && mentorId) {
      const m = await Mentor.findById(mentorId);
      if (m) {
        mentors = [m];
      } else {
        return res.status(404).json({ error: "Selected mentor was not found in the database." });
      }
    } else if (targetType === "inactive_today") {
      const todayIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
      const allActive = await Mentor.find({ active: true });
      mentors = allActive.filter((m) => {
        if (!m.lastLogin) return true;
        const lastLoginIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(m.lastLogin));
        return lastLoginIST !== todayIST;
      });
    } else {
      mentors = await Mentor.find({ active: true });
    }

    if (mentors.length === 0) {
      return res.status(404).json({ error: "No matching active mentors found to email." });
    }

    const results = [];
    const clientBase = (process.env.CLIENT_ORIGIN || "").split(",")[0].trim() || "https://campuspoint.in";
    const dashboardLink = `${clientBase}/mentor`;

    for (const m of mentors) {
      try {
        let studentsList = [];
        if (m.students && m.students.length > 0) {
          studentsList = await Enrollment.find({ studentId: { $in: m.students } })
            .select("studentId name targetExam plan region")
            .lean();
        }

        const studentRows = studentsList.length > 0
          ? studentsList.map((s) => `<tr>
              <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a;font-size:12px">${esc(s.name || s.studentId)}</td>
              <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-family:monospace;font-size:11px;color:#64748b">${esc(s.studentId)}</td>
              <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:11.5px;color:#059669;font-weight:600">${esc(s.targetExam || s.plan || "")}</td>
              <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:11px;color:#64748b">${esc(s.region || "Indian")}</td>
            </tr>`).join("")
          : `<tr><td colspan="4" style="padding:8px 10px;color:#94a3b8;font-size:11.5px">No students currently assigned</td></tr>`;

        const emailContent = `
          <div style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;max-width:580px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06)">
            <div style="background:#FF693D;background-image:linear-gradient(135deg,#FF693D 0%,#EE5326 100%);padding:16px 20px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30" style="padding-right:10px;vertical-align:middle">
                    <table role="presentation" width="30" height="30" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:7px;text-align:center">
                      <tr><td style="color:#FF693D;font-size:12px;font-weight:900;line-height:30px">CP</td></tr>
                    </table>
                  </td>
                  <td style="font-size:15px;font-weight:800;color:#ffffff;vertical-align:middle">Campus Point · Mentor Notification</td>
                </tr>
              </table>
            </div>

            <div style="padding:22px 24px">
              <h3 style="margin:0 0 10px;font-size:16px;color:#0f172a;font-weight:800">
                Namaste ${esc(m.name)},
              </h3>

              <div style="font-size:13px;color:#475569;line-height:1.6;margin-bottom:18px">
                ${esc(message).replace(/\n/g, "<br>")}
              </div>

              ${includeStudentsList && studentsList.length > 0 ? `
                <div style="margin:16px 0 10px">
                  <span style="font-size:10.5px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.8px">Your Assigned Students (${studentsList.length})</span>
                </div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:16px">
                  <thead><tr style="background:#f8fafc;color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:0.5px">
                    <th style="padding:7px 10px;text-align:left">Student</th>
                    <th style="padding:7px 10px;text-align:left">ID</th>
                    <th style="padding:7px 10px;text-align:left">Track</th>
                    <th style="padding:7px 10px;text-align:left">Region</th>
                  </tr></thead>
                  <tbody>${studentRows}</tbody>
                </table>
              ` : ""}

              ${includeDashboardLink ? `
                <div style="text-align:center;margin:22px 0 14px">
                  <a href="${dashboardLink}" style="display:inline-block;padding:12px 28px;background:#FF693D;color:#ffffff;text-decoration:none;font-weight:700;font-size:13.5px;border-radius:10px;box-shadow:0 4px 14px rgba(255,105,61,0.3)">Open Mentor Console &nbsp;→</a>
                </div>
              ` : ""}

              <div style="border-top:1px solid #f1f5f9;padding-top:14px;color:#94a3b8;font-size:11px;line-height:1.5;text-align:center;margin-top:16px">
                Official message sent by Campus Point Administration to ${esc(m.email)}.<br>
                <a href="https://campuspoint.in" style="color:#FF693D;text-decoration:none">campuspoint.in</a>
              </div>
            </div>
          </div>
        `;

        const text = `Namaste ${m.name},\n\n${message}\n\nOpen Mentor Console: ${dashboardLink}`;

        const sendRes = await sendMail({
          to: m.email,
          subject: `${subject} · Campus Point`,
          html: emailContent,
          text,
          tags: ["admin-mentor-broadcast"],
        });

        results.push({ mentorId: m._id, name: m.name, email: m.email, sent: sendRes.ok });

        MentorActivityLog.create({
          mentorId: m._id,
          mentorName: m.name,
          mentorEmail: m.email,
          action: "admin_email_to_mentor",
          details: {
            subject,
            targetType,
            sentBy: "Admin",
          },
          ip: req.ip || "",
          userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
        }).catch(() => {});
      } catch (err) {
        console.error(`[adminMentors/send-email] Failed for ${m.email}:`, err.message);
        results.push({ mentorId: m._id, name: m.name, email: m.email, sent: false, error: err.message });
      }
    }

    res.json({
      ok: true,
      sentCount: results.filter((r) => r.sent).length,
      totalTargeted: mentors.length,
      results,
    });
  } catch (e) {
    console.error("[adminMentors/send-email]", e.message);
    res.status(500).json({ error: "Could not send emails to mentors." });
  }
});

/* ── Admin manually triggers 9 PM inactivity check on demand ─────────────── */
router.post("/trigger-inactivity-alerts", async (req, res) => {
  try {
    const out = await checkAndSendMentorInactivityAlerts({ force: true });
    res.json(out);
  } catch (e) {
    console.error("[adminMentors/trigger-inactivity-alerts]", e.message);
    res.status(500).json({ error: "Failed to trigger inactivity check" });
  }
});

export default router;
