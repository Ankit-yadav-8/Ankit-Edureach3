import express from "express";
import bcrypt from "bcryptjs";
import Mentor from "../models/Mentor.js";
import MentorProgress from "../models/MentorProgress.js";
import MentorTask from "../models/MentorTask.js";
import TestAttempt from "../models/TestAttempt.js";
import MentorAccessLog from "../models/MentorAccessLog.js";
import MentorActivityLog from "../models/MentorActivityLog.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import { normalizeTestScore } from "../utils/testScoring.js";
import { sendMail } from "../utils/mailer.js";
import {
  signMentorToken, requireMentor, requirePasswordChanged, resolveAssignedStudent,
} from "../middleware/mentor.js";

const router = express.Router();

const siteOrigin = () =>
  (process.env.CLIENT_ORIGIN || "").split(",")[0].trim() || "https://campuspoint.in";

/**
 * Record that a mentor read (or tried to read) a student.
 *
 * Fire-and-forget on purpose: an audit write must never fail the request or add
 * latency to it. The trade-off is explicit — a dropped write loses one log line,
 * whereas awaiting it would let a slow log take the feature down. Denied
 * attempts are logged too; those are the ones worth looking at.
 */
function audit(req, { studentId, resource, allowed }) {
  MentorAccessLog.create({
    mentorId: req.mentor._id,
    mentorEmail: req.mentor.email,
    studentId: String(studentId || "").toUpperCase(),
    resource,
    allowed,
    ip: req.ip || "",
    userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
  }).catch((e) => console.error("[mentor/audit]", e.message));
}

/** Resolve + log in one step, so no read path can forget to record itself. */
async function resolveAndAudit(req, resource) {
  const enr = await resolveAssignedStudent(req.mentor, req.params.studentId);
  audit(req, { studentId: req.params.studentId, resource, allowed: !!enr });
  return enr;
}

// Mentors are read-only over student DATA by design. This router exposes GETs
// only for anything student-owned; the writes it allows are to the mentor's own
// credentials and to the tasks it assigns a student. Anything a mentor authors
// FOR a student (tasks, guidance, chat) lands in mentor-owned collections, never
// inside the student's own progress blob.

const MAX_FAILED = 5;
const LOCK_MS = 15 * 60 * 1000;

// Normalise a submitted task list: accept strings or {text, completed, ...} objects, trim, drop
// blanks, cap at 20, and preserve / assign stable ids and completion status.
const sanitizeTasks = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .map((t) => (typeof t === "string" ? { text: t } : t))
    .filter((t) => t && String(t.text || "").trim())
    .slice(0, 20)
    .map((t, i) => ({
      id: t.id || `mt-${Date.now()}-${i}`,
      text: String(t.text).trim(),
      completed: !!t.completed,
      completedAt: t.completed ? (t.completedAt || new Date()) : null,
      createdAt: t.createdAt || new Date(),
    }));

const publicMentor = (m) => ({
  id: String(m._id), name: m.name, email: m.email,
  college: m.college, phone: m.phone,
  students: m.students || [], mustChangePassword: !!m.mustChangePassword,
});

/* ── Login — email + the password the admin issued ───────────────────────── */
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").toLowerCase().trim();
    // Trim: a one-time password copied from the admin handoff often carries a
    // trailing space or newline, which would otherwise fail the hash compare and
    // surface as a bogus "invalid email or password". Generated passwords never
    // contain spaces, so this only ever removes accidental whitespace.
    const password = String(req.body?.password || "").trim();
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const mentor = await Mentor.findOne({ email });

    // Same generic message and roughly the same work whether or not the account
    // exists, so this endpoint can't be used to enumerate mentor emails.
    const deny = () => {
      MentorActivityLog.create({
        mentorEmail: email,
        action: "mentor_login_failed",
        details: { reason: "Invalid credentials" },
        ip: req.ip || "",
        userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
      }).catch(() => {});
      return res.status(401).json({ error: "Invalid email or password" });
    };
    if (!mentor) { await bcrypt.compare(password, "$2a$12$" + "x".repeat(53)).catch(() => {}); return deny(); }
    if (!mentor.active) {
      MentorActivityLog.create({
        mentorId: mentor._id,
        mentorEmail: mentor.email,
        mentorName: mentor.name,
        action: "mentor_login_failed",
        details: { reason: "Deactivated account" },
        ip: req.ip || "",
        userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
      }).catch(() => {});
      return res.status(403).json({ error: "This mentor account has been deactivated" });
    }

    if (mentor.lockedUntil && mentor.lockedUntil > new Date()) {
      const mins = Math.ceil((mentor.lockedUntil - Date.now()) / 60000);
      return res.status(429).json({ error: `Too many requests. Please wait ${mins} min and try again.` });
    }

    const ok = await bcrypt.compare(password, mentor.passwordHash);
    if (!ok) {
      mentor.failedLogins = (mentor.failedLogins || 0) + 1;
      if (mentor.failedLogins >= MAX_FAILED) {
        mentor.lockedUntil = new Date(Date.now() + LOCK_MS);
        mentor.failedLogins = 0;
      }
      await mentor.save();
      return deny();
    }

    mentor.failedLogins = 0;
    mentor.lockedUntil = null;
    mentor.lastLogin = new Date();
    await mentor.save();

    // Authenticated login event tracked in real database
    MentorActivityLog.create({
      mentorId: mentor._id,
      mentorEmail: mentor.email,
      mentorName: mentor.name,
      action: "mentor_login",
      region: "Indian",
      details: { role: "mentor", college: mentor.college || "", region: "Indian", studentsCount: (mentor.students || []).length },
      ip: req.ip || "",
      userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
    }).catch((e) => console.error("[mentor/login-log]", e.message));

    res.json({ token: signMentorToken(mentor), mentor: publicMentor(mentor) });
  } catch (e) {
    console.error("[mentor/login]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", requireMentor, (req, res) => res.json({ mentor: publicMentor(req.mentor) }));

/* ── Password change — mandatory after an admin issues credentials ───────── */
router.post("/password", requireMentor, async (req, res) => {
  try {
    // Trim both sides so the temporary password (often pasted with a trailing
    // space) matches, and so the new password is stored exactly as it will be
    // trimmed at login — otherwise a stray space here would lock the mentor out
    // on their very next sign-in.
    const current = String(req.body?.currentPassword || "").trim();
    const next = String(req.body?.newPassword || "").trim();
    if (next.length < 8) return res.status(400).json({ error: "New password must be at least 8 characters" });

    const mentor = await Mentor.findById(req.mentor._id);
    if (!mentor) return res.status(404).json({ error: "Not found" });
    if (!(await bcrypt.compare(current, mentor.passwordHash))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    mentor.passwordHash = await bcrypt.hash(next, 12);
    mentor.mustChangePassword = false;
    // Retire every token minted against the old password, including this one.
    mentor.tokenVersion = (mentor.tokenVersion || 0) + 1;
    await mentor.save();

    res.json({ ok: true, token: signMentorToken(mentor), mentor: publicMentor(mentor) });
  } catch (e) {
    console.error("[mentor/password]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── The mentor's assigned students (the dashboard's student switcher) ───── */
router.get("/students", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const out = [];
    for (const sid of req.mentor.students || []) {
      const enr = await resolveAssignedStudent(req.mentor, sid);
      if (enr) out.push({
        studentId: enr.studentId,
        name: enr.name,
        email: enr.email,
        parentEmail: enr.parentEmail || "",
        phone: enr.phone || "",
        plan: enr.plan,
        since: enr.createdAt,
      });
    }
    res.json({ students: out });
  } catch (e) {
    console.error("[mentor/students]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── One student's dashboard data — READ ONLY ────────────────────────────── */
router.get("/students/:studentId/progress", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const enr = await resolveAndAudit(req, "progress");
    // Same 404 for "not assigned" and "doesn't exist" — a mentor must not be
    // able to probe which CP IDs are real by diffing the responses.
    if (!enr) return res.status(404).json({ error: "Student not found" });

    const doc = await MentorProgress.findOne({ email: enr.email, plan: enr.plan }).lean();
    res.json({
      student: { studentId: enr.studentId, name: enr.name, plan: enr.plan },
      data: doc?.data ?? null,
      updatedAt: doc?.updatedAt || null,
    });
  } catch (e) {
    console.error("[mentor/progress]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── One student's test attempts — normalized with unified scoring ───────── */
router.get("/students/:studentId/tests", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const enr = await resolveAndAudit(req, "tests");
    if (!enr) return res.status(404).json({ error: "Student not found" });

    // 1. Fetch CBT attempts from TestAttempt
    const rawAttempts = await TestAttempt.find({ email: enr.email, plan: enr.plan })
      .select("-answers")
      .sort({ createdAt: -1 }).limit(50).lean();

    // 2. Fetch manual tests logged by student in MentorProgress
    const progressDoc = await MentorProgress.findOne({ email: enr.email, plan: enr.plan }).lean();
    const manualTests = Array.isArray(progressDoc?.data?.tests) ? progressDoc.data.tests : [];

    // Normalize CBT attempts
    const normalizedAttempts = rawAttempts.map((a) => {
      const norm = normalizeTestScore({
        score: a.score,
        maxMarks: a.maxMarks,
        totalQuestions: a.totalQuestions,
        correctCount: a.correctCount,
        wrongCount: a.wrongCount,
        skippedCount: a.skippedCount,
      });
      return {
        _id: a._id,
        title: a.title,
        name: a.title,
        category: a.category,
        type: a.category,
        createdAt: a.createdAt,
        submittedAt: a.submittedAt || a.createdAt,
        score: norm.score,
        maxMarks: norm.maxMarks,
        percent: norm.percent,
        accuracy: norm.accuracy,
        correctCount: norm.correctCount,
        wrongCount: norm.wrongCount,
        skippedCount: norm.skippedCount,
        totalQuestions: norm.totalQuestions,
        source: "cbt",
      };
    });

    // Normalize manual tests
    const normalizedManual = manualTests.map((t, idx) => {
      const norm = normalizeTestScore({
        score: t.scored ?? t.score,
        maxMarks: t.total ?? t.maxMarks,
        totalQuestions: (Number(t.correct) || 0) + (Number(t.wrong) || 0) + (Number(t.skipped) || 0),
        examType: t.type,
        correctCount: t.correct,
        wrongCount: t.wrong,
        skippedCount: t.skipped,
      });
      return {
        _id: t.id || `manual-${idx}`,
        title: t.name || `Mock Test ${idx + 1}`,
        name: t.name || `Mock Test ${idx + 1}`,
        category: t.type || "test",
        type: t.type || "test",
        createdAt: t.date ? new Date(t.date) : new Date(),
        submittedAt: t.date ? new Date(t.date) : new Date(),
        score: norm.score,
        maxMarks: norm.maxMarks,
        percent: norm.percent,
        accuracy: norm.accuracy,
        correctCount: norm.correctCount,
        wrongCount: norm.wrongCount,
        skippedCount: norm.skippedCount,
        totalQuestions: norm.totalQuestions,
        silly: Number(t.silly) || 0,
        sillyTopic: t.sillyTopic || "",
        overspent: t.overspent || "",
        weak: Array.isArray(t.weak) ? t.weak : [],
        rank: t.rank || null,
        source: "manual",
      };
    });

    // Combine and sort by date descending
    const allTests = [...normalizedAttempts, ...normalizedManual].sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
    );

    res.json({ attempts: allTests });
  } catch (e) {
    console.error("[mentor/tests]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── The tasks this student sees — the mentor reads and sets them ─────────── */
router.get("/students/:studentId/tasks", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const enr = await resolveAndAudit(req, "tasks");
    if (!enr) return res.status(404).json({ error: "Student not found" });
    const doc = await MentorTask.findOne({ studentId: enr.studentId }).lean();
    res.json({ tasks: doc?.tasks || [] });
  } catch (e) {
    console.error("[mentor/tasks]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Assign / replace this student's task list ────────────────────────────────
   The one write a mentor has over what a student sees. It targets the
   mentor-owned MentorTask collection (keyed by the CP ID), so it flows straight
   into the student's "From your mentor" fix-list without touching their own
   progress blob. Scoped to the mentor's assigned students by resolveAndAudit. */
router.put("/students/:studentId/tasks", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const enr = await resolveAndAudit(req, "tasks:write");
    if (!enr) return res.status(404).json({ error: "Student not found" });
    const tasks = sanitizeTasks(req.body?.tasks);

    // Retrieve previous state to distinguish assignment vs update vs completion
    const prevDoc = await MentorTask.findOne({ studentId: enr.studentId }).lean();
    const prevTasks = prevDoc?.tasks || [];
    const prevCount = prevTasks.length;
    const prevCompletedIds = new Set(prevTasks.filter((t) => t.completed).map((t) => t.id));

    const doc = await MentorTask.findOneAndUpdate(
      { studentId: enr.studentId },
      { studentId: enr.studentId, tasks, assignedByMentorId: req.mentor._id, assignedByName: req.mentor.name },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    const isFirstAssign = prevCount === 0;
    const completedTasks = tasks.filter((t) => t.completed);
    const newlyCompletedCount = tasks.filter((t) => t.completed && !prevCompletedIds.has(t.id)).length;

    // Track task operation
    const action = isFirstAssign ? "task_assign" : "task_update";
    MentorActivityLog.create({
      mentorId: req.mentor._id,
      mentorName: req.mentor.name,
      mentorEmail: req.mentor.email,
      studentId: enr.studentId,
      studentName: enr.name,
      region: enr.region || "Indian",
      action,
      details: {
        taskCount: tasks.length,
        completedCount: completedTasks.length,
        isUpdate: !isFirstAssign,
        region: enr.region || "Indian",
        studentName: enr.name,
        plan: enr.plan || "",
      },
      ip: req.ip || "",
      userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
    }).catch((e) => console.error("[mentor/task-log]", e.message));

    // If tasks were newly completed, record completion log
    if (newlyCompletedCount > 0) {
      MentorActivityLog.create({
        mentorId: req.mentor._id,
        mentorName: req.mentor.name,
        mentorEmail: req.mentor.email,
        studentId: enr.studentId,
        studentName: enr.name,
        region: enr.region || "Indian",
        action: "task_complete",
        details: { newlyCompleted: newlyCompletedCount, totalCompleted: completedTasks.length, region: enr.region || "Indian", studentName: enr.name },
        ip: req.ip || "",
        userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
      }).catch((e) => console.error("[mentor/task-complete-log]", e.message));
    }

    res.json({ ok: true, tasks: doc.tasks });
  } catch (e) {
    console.error("[mentor/tasks PUT]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── The 1-on-1 session & meet link this student sees ─────────────────────── */
router.get("/students/:studentId/session", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const enr = await resolveAndAudit(req, "session");
    if (!enr) return res.status(404).json({ error: "Student not found" });
    const doc = await MentorTask.findOne({ studentId: enr.studentId }).lean();
    res.json({ session: doc?.session || null });
  } catch (e) {
    console.error("[mentor/session GET]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Schedule or update this student's 1-on-1 session & meet link ─────────── */
router.put("/students/:studentId/session", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const enr = await resolveAndAudit(req, "session:write");
    if (!enr) return res.status(404).json({ error: "Student not found" });
    const { meetLink, topic, time, dateLabel } = req.body || {};
    const sessionData = {
      meetLink: String(meetLink || "").trim(),
      topic: String(topic || "Physics Strategy & Mock Test Analysis").trim(),
      time: String(time || "6:00 PM – 6:45 PM").trim(),
      dateLabel: String(dateLabel || "Tomorrow").trim(),
      updatedAt: new Date(),
    };

    const doc = await MentorTask.findOneAndUpdate(
      { studentId: enr.studentId },
      {
        studentId: enr.studentId,
        session: sessionData,
        assignedByMentorId: req.mentor._id,
        assignedByName: req.mentor.name,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    MentorActivityLog.create({
      mentorId: req.mentor._id,
      mentorName: req.mentor.name,
      mentorEmail: req.mentor.email,
      studentId: enr.studentId,
      studentName: enr.name,
      region: enr.region || "Indian",
      action: "session_update",
      details: {
        ...sessionData,
        studentName: enr.name,
        studentId: enr.studentId,
        region: enr.region || "Indian",
        plan: enr.plan || "",
      },
      ip: req.ip || "",
      userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
    }).catch((e) => console.error("[mentor/session-log]", e.message));

    res.json({ ok: true, session: doc.session });
  } catch (e) {
    console.error("[mentor/session PUT]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Student Login Tracking & Analytics for this Mentor ──────────────────── */
router.get("/student-logins", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const range = String(req.query?.range || "7d").toLowerCase();
    const now = new Date();
    let startDate = new Date();
    if (range === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === "30d") {
      startDate.setDate(now.getDate() - 30);
    } else if (range === "all") {
      startDate = new Date(0);
    } else {
      // default: 7d
      startDate.setDate(now.getDate() - 7);
    }

    const assignedIds = (req.mentor.students || []).map((s) => String(s).toUpperCase());
    if (assignedIds.length === 0) {
      return res.json({
        range,
        summary: {
          totalLoginsInPeriod: 0,
          activeStudentsCount: 0,
          inactiveStudentsCount: 0,
          totalAssigned: 0,
          activeDefinition: "Logged in at least once during the selected time period",
        },
        students: [],
        chartData: [],
        historyTimeline: [],
      });
    }

    // Resolve all assigned students' enrollments
    const enrollments = await Enrollment.find({
      studentId: { $in: assignedIds },
      status: "paid",
    }).select("studentId name email plan createdAt").lean();

    const enrMap = new Map(enrollments.map((e) => [e.studentId.toUpperCase(), e]));
    const emails = enrollments.map((e) => e.email).filter(Boolean);
    const users = await User.find({ email: { $in: emails } }).select("email lastLogin").lean();
    const userMap = new Map(users.map((u) => [u.email.toLowerCase(), u]));

    // Query login activity logs for assigned students
    const logs = await MentorActivityLog.find({
      studentId: { $in: assignedIds },
      action: "student_login",
    }).sort({ createdAt: -1 }).limit(1000).lean();

    // Palette of distinct, harmonious colors for the interactive pie chart
    const PALETTE = [
      "#FF693D", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B",
      "#EC4899", "#06B6D4", "#6366F1", "#14B8A6", "#E11D48",
      "#84CC16", "#D97706", "#0284C7", "#9333EA", "#059669",
    ];

    let totalLoginsInPeriod = 0;
    const studentStats = [];
    const historyTimeline = [];

    assignedIds.forEach((sid, idx) => {
      const enr = enrMap.get(sid);
      if (!enr) return;
      const user = userMap.get(enr.email?.toLowerCase());

      const studentLogs = logs.filter((l) => l.studentId?.toUpperCase() === sid);
      const periodLogs = studentLogs.filter((l) => new Date(l.createdAt) >= startDate);
      
      let lastLoginDate = studentLogs[0]?.createdAt || user?.lastLogin || null;
      let firstLoginInPeriod = periodLogs.length ? periodLogs[periodLogs.length - 1]?.createdAt : null;

      // Graceful fallback: If no activity logs exist yet but user.lastLogin is within range
      let periodCount = periodLogs.length;
      let totalCount = studentLogs.length;
      if (totalCount === 0 && user?.lastLogin) {
        totalCount = 1;
        if (new Date(user.lastLogin) >= startDate) {
          periodCount = 1;
          firstLoginInPeriod = user.lastLogin;
        }
      }

      totalLoginsInPeriod += periodCount;
      const isActive = periodCount > 0;
      const color = PALETTE[idx % PALETTE.length];

      studentStats.push({
        studentId: sid,
        name: enr.name,
        email: enr.email,
        plan: enr.plan,
        color,
        loginsInPeriod: periodCount,
        totalLifetimeLogins: totalCount,
        lastLogin: lastLoginDate,
        firstLoginInPeriod,
        isActive,
        recentEvents: studentLogs.slice(0, 10).map((l) => ({
          id: String(l._id),
          timestamp: l.createdAt,
          ip: l.ip || "Direct",
          userAgent: l.userAgent || "Web Session",
          plan: l.details?.plan || enr.plan,
        })),
      });

      // Add period events to chronological history timeline
      periodLogs.forEach((l) => {
        historyTimeline.push({
          id: String(l._id),
          studentId: sid,
          studentName: enr.name,
          color,
          timestamp: l.createdAt,
          ip: l.ip || "Direct",
          userAgent: l.userAgent || "Web Session",
          plan: l.details?.plan || enr.plan,
        });
      });
    });

    historyTimeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const activeStudentsCount = studentStats.filter((s) => s.isActive).length;
    const inactiveStudentsCount = studentStats.length - activeStudentsCount;

    // Build chart data for interactive doughnut chart
    const chartData = studentStats.map((s) => {
      const percentage = totalLoginsInPeriod > 0 ? (s.loginsInPeriod / totalLoginsInPeriod) * 100 : 0;
      return {
        studentId: s.studentId,
        name: s.name,
        color: s.color,
        val: s.loginsInPeriod,
        logins: s.loginsInPeriod,
        totalLifetime: s.totalLifetimeLogins,
        percentage: Math.round(percentage * 10) / 10,
        lastLogin: s.lastLogin,
        isActive: s.isActive,
      };
    });

    res.json({
      range,
      startDate,
      summary: {
        totalLoginsInPeriod,
        activeStudentsCount,
        inactiveStudentsCount,
        totalAssigned: studentStats.length,
        activeDefinition: "Logged in at least once during the selected time period",
      },
      students: studentStats,
      chartData,
      historyTimeline: historyTimeline.slice(0, 50),
    });
  } catch (e) {
    console.error("[mentor/student-logins]", e.message);
    res.status(500).json({ error: "Server error loading student logins" });
  }
});

/* ── All Assigned Students High-Level Overview with Complete Scores ──────── */
router.get("/students-overview", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const assignedIds = (req.mentor.students || []).map((s) => String(s).toUpperCase());
    if (assignedIds.length === 0) return res.json({ students: [] });

    const enrollments = await Enrollment.find({
      studentId: { $in: assignedIds },
      status: "paid",
    }).select("studentId name email phone plan studentGroup createdAt").lean();

    const enrMap = new Map(enrollments.map((e) => [e.studentId.toUpperCase(), e]));
    const emails = enrollments.map((e) => e.email).filter(Boolean);

    // Fetch progress docs, task docs, attempts, and users in parallel
    const [progressDocs, taskDocs, attemptDocs, userDocs] = await Promise.all([
      MentorProgress.find({ email: { $in: emails } }).lean(),
      MentorTask.find({ studentId: { $in: assignedIds } }).lean(),
      TestAttempt.find({ email: { $in: emails } }).select("-answers").sort({ createdAt: -1 }).lean(),
      User.find({ email: { $in: emails } }).select("email lastLogin").lean(),
    ]);

    const progressByEmail = new Map(progressDocs.map((p) => [`${p.email}|${p.plan}`, p]));
    const taskByStudent = new Map(taskDocs.map((t) => [t.studentId.toUpperCase(), t]));
    const userByEmail = new Map(userDocs.map((u) => [u.email.toLowerCase(), u]));

    const out = [];

    assignedIds.forEach((sid) => {
      const enr = enrMap.get(sid);
      if (!enr) return;

      const pDoc = progressByEmail.get(`${enr.email}|${enr.plan}`);
      const tDoc = taskByStudent.get(sid);
      const user = userByEmail.get(enr.email.toLowerCase());
      const pData = pDoc?.data || {};

      // Student tasks
      const allTasks = tDoc?.tasks || [];
      const completedTasks = allTasks.filter((t) => t.completed);

      // Student tests - combine CBT and manual
      const cbtTests = attemptDocs.filter((a) => a.email === enr.email && a.plan === enr.plan);
      const manualTests = Array.isArray(pData.tests) ? pData.tests : [];

      const normalizedTests = [
        ...cbtTests.map((a) => normalizeTestScore({
          score: a.score, maxMarks: a.maxMarks, totalQuestions: a.totalQuestions,
          correctCount: a.correctCount, wrongCount: a.wrongCount, skippedCount: a.skippedCount,
        })),
        ...manualTests.map((t) => normalizeTestScore({
          score: t.scored ?? t.score, maxMarks: t.total ?? t.maxMarks,
          totalQuestions: (Number(t.correct) || 0) + (Number(t.wrong) || 0) + (Number(t.skipped) || 0),
          examType: t.type, correctCount: t.correct, wrongCount: t.wrong, skippedCount: t.skipped,
        })),
      ];

      // Calculate complete average score
      const testCount = normalizedTests.length;
      let totalScored = 0, totalMax = 0, sumPct = 0;
      normalizedTests.forEach((t) => {
        totalScored += t.score;
        totalMax += t.maxMarks;
        sumPct += t.percent;
      });
      const avgPercent = testCount ? Math.round((sumPct / testCount) * 10) / 10 : 0;
      const latestTest = normalizedTests[0] || null;

      // Study hours this week & streak
      const entries = Array.isArray(pData.entries) ? pData.entries : [];
      const now = new Date();
      const cut7 = new Date(); cut7.setDate(now.getDate() - 7);
      const recentEntries = entries.filter((e) => new Date(e.date) >= cut7);
      const weekHours = Math.round(recentEntries.reduce((s, e) => s + (Number(e.hours) || 0), 0) * 10) / 10;

      out.push({
        studentId: sid,
        name: enr.name,
        email: enr.email,
        phone: enr.phone || "",
        plan: enr.plan,
        studentGroup: enr.studentGroup || "Campus-Point-1",
        enrolledSince: enr.createdAt,
        lastLogin: user?.lastLogin || null,
        testStats: {
          testCount,
          totalScored,
          totalMax,
          avgPercent,
          latestTest: latestTest ? {
            score: latestTest.score,
            maxMarks: latestTest.maxMarks,
            percent: latestTest.percent,
            accuracy: latestTest.accuracy,
          } : null,
        },
        taskStats: {
          assigned: allTasks.length,
          completed: completedTasks.length,
          pending: allTasks.length - completedTasks.length,
          tasks: allTasks.map((t) => ({
            id: t.id || t._id,
            text: t.text,
            completed: !!t.completed,
            completedAt: t.completedAt || null,
            createdAt: t.createdAt || null,
          })),
        },
        studyStats: {
          weekHours,
          totalDaysLogged: entries.length,
        },
      });
    });

    res.json({ students: out });
  } catch (e) {
    console.error("[mentor/students-overview]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// Mentor Direct Email Dispatcher
//
// Allows an authenticated mentor to send official guidance, announcements,
// study check-ins, or schedule updates to their allotted students (and
// optionally CC parents).
// ─────────────────────────────────────────────────────────────────────────────

function buildMentorEmailHtml({
  mentorName,
  mentorCollege,
  studentName,
  studentId,
  plan,
  category,
  subject,
  message,
  link,
  isParentCopy = false,
}) {
  const esc = (s) =>
    String(s ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

  // Auto-format paragraphs and convert URLs into clickable buttons/links
  const formattedMsg = esc(message)
    .split(/\r?\n\r?\n/)
    .map((p) => {
      const withLinks = p.replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" style="color:#FF693D;font-weight:700;text-decoration:underline" target="_blank">$1</a>'
      );
      return `<p style="margin:0 0 14px;font-size:14.5px;line-height:1.7;color:#334155">${withLinks.replace(/\r?\n/g, "<br>")}</p>`;
    })
    .join("");

  const planLabel = plan ? plan.replace(/^mentor-/, "").toUpperCase() : "MENTORSHIP";

  return `
<div style="margin:0;padding:0;background:#f8fafc;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f8fafc;font-size:1px;line-height:1px">
    Message from your mentor ${esc(mentorName)}: ${esc(subject)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:26px 12px">
    <tr><td align="center">
      <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="width:100%;max-width:580px;background:#ffffff;border-radius:18px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.06)">
        
        <!-- Top Branded Navy Bar -->
        <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:18px 24px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="36" style="vertical-align:middle;padding-right:12px">
                <table role="presentation" width="34" height="34" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;text-align:center">
                  <tr><td align="center" valign="middle" style="color:#FF693D;font-size:13px;font-weight:900;line-height:34px;padding:0">CP</td></tr>
                </table>
              </td>
              <td style="vertical-align:middle">
                <div style="color:#ffffff;font-size:15px;font-weight:800;letter-spacing:-0.2px">Campus Point Mentorship</div>
                <div style="color:#94a3b8;font-size:11px;font-weight:600">Personal IITian / NEET Mentorship Console</div>
              </td>
              <td align="right" style="vertical-align:middle">
                <span style="display:inline-block;background:rgba(255,105,61,0.22);border:1px solid rgba(255,105,61,0.45);color:#ff8a65;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;padding:4px 10px;border-radius:20px">
                  ${esc(category || "MENTOR GUIDANCE")}
                </span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Sender / Recipient Sub-Bar -->
        <tr><td style="background:#fff7ed;border-bottom:1px solid #fed7aa;padding:12px 24px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="font-size:9.5px;text-transform:uppercase;font-weight:800;color:#c2410c;letter-spacing:0.7px">Mentor</div>
                <div style="font-size:13.5px;font-weight:800;color:#0f172a;margin-top:1px">
                  ${esc(mentorName)} <span style="font-size:11.5px;font-weight:600;color:#64748b">(${esc(mentorCollege || "Senior Mentor")})</span>
                </div>
              </td>
              <td align="right">
                <div style="font-size:9.5px;text-transform:uppercase;font-weight:800;color:#94a3b8;letter-spacing:0.7px">${isParentCopy ? "Parent Copy" : "Student"}</div>
                <div style="font-size:12.5px;font-weight:700;color:#0f172a;margin-top:1px">
                  ${esc(studentName)} <span style="font-size:10.5px;color:#94a3b8">(${esc(studentId)} · ${esc(planLabel)})</span>
                </div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Main Content Area -->
        <tr><td style="padding:28px 24px 20px">
          <div style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;margin-bottom:18px;line-height:1.3">
            ${esc(subject)}
          </div>
          
          <div style="margin-bottom:20px">
            <div style="font-size:14.5px;font-weight:700;color:#0f172a;margin-bottom:12px">
              Dear ${esc(studentName)},
            </div>
            ${formattedMsg}
          </div>

          <!-- CTA Button -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 14px">
            <tr><td align="center">
              <a href="${esc(link)}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#FF693D 0%,#EE5326 100%);color:#ffffff;text-decoration:none;font-weight:800;font-size:14px;padding:12px 28px;border-radius:10px;box-shadow:0 6px 18px rgba(255,105,61,0.35);letter-spacing:0.2px">
                Open Mentorship Dashboard &rarr;
              </a>
            </td></tr>
          </table>

          <!-- Mentor follow-up note -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-top:20px">
            <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;color:#475569;letter-spacing:0.6px;margin-bottom:3px">
              💬 Need to discuss this?
            </div>
            <div style="font-size:12px;color:#64748b;line-height:1.5">
              Discuss this during your next scheduled 1-on-1 session with ${esc(mentorName)}, or post a doubt in the Community section of your dashboard.
            </div>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;border-top:1px solid #f1f5f9;padding:16px 24px">
          <div style="color:#94a3b8;font-size:11px;line-height:1.55;text-align:center">
            This message was authored and sent directly by your mentor <b>${esc(mentorName)}</b> via CampusPoint.<br>
            <span style="color:#cbd5e1">CampusPoint · Personalised JEE &amp; NEET Mentorship · <a href="https://campuspoint.in" style="color:#FF693D;text-decoration:none">campuspoint.in</a></span>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</div>
`;
}

router.post("/send-email", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const {
      recipientType = "all",
      studentIds = [],
      subject,
      message,
      includeParent = false,
      category = "Mentor Guidance",
    } = req.body || {};

    if (!subject || !String(subject).trim()) {
      return res.status(400).json({ error: "Email subject is required" });
    }
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: "Email message body is required" });
    }

    const assignedIds = (req.mentor.students || []).map((s) => String(s).toUpperCase());
    if (assignedIds.length === 0) {
      return res.status(400).json({ error: "You currently have no allotted students" });
    }

    // Determine target student IDs - mentor can ONLY email their own assigned students
    let targetStudentIds = [];
    if (recipientType === "all") {
      targetStudentIds = assignedIds;
    } else {
      const requested = (Array.isArray(studentIds) ? studentIds : [studentIds])
        .map((s) => String(s).trim().toUpperCase())
        .filter(Boolean);
      targetStudentIds = requested.filter((sid) => assignedIds.includes(sid));
    }

    if (targetStudentIds.length === 0) {
      return res.status(400).json({ error: "No valid allotted students selected" });
    }

    const enrollments = await Enrollment.find({
      studentId: { $in: targetStudentIds },
      status: "paid",
    }).select("studentId name email parentEmail plan").lean();

    if (enrollments.length === 0) {
      return res.status(404).json({ error: "No active paid enrollments found for the selected students" });
    }

    const mentorName = req.mentor.name || "Your Mentor";
    const mentorCollege = req.mentor.college || "CampusPoint Senior Mentor";
    const cleanSubject = String(subject).trim();
    const cleanMessage = String(message).trim();
    const link = `${siteOrigin()}/mentorship-dashboard`;

    let sentCount = 0;
    const recipientLogs = [];

    for (const enr of enrollments) {
      if (!enr.email) continue;
      const studentName = enr.name || "Student";
      const emailSubject = `[CampusPoint Mentorship] ${cleanSubject} — from ${mentorName}`;

      const html = buildMentorEmailHtml({
        mentorName,
        mentorCollege,
        studentName,
        studentId: enr.studentId,
        plan: enr.plan,
        category,
        subject: cleanSubject,
        message: cleanMessage,
        link,
      });

      const text = `Hi ${studentName},\n\nA message from your mentor ${mentorName} (${mentorCollege}):\n\n${cleanMessage}\n\nOpen your dashboard: ${link}`;

      const out = await sendMail({
        to: enr.email,
        subject: emailSubject,
        html,
        text,
      });

      if (out.ok) {
        sentCount++;
        recipientLogs.push({ studentId: enr.studentId, name: studentName, email: enr.email, status: "sent" });
      } else {
        recipientLogs.push({ studentId: enr.studentId, name: studentName, email: enr.email, status: "failed", error: out.error });
      }

      // If mentor selected to include parents
      if (includeParent && enr.parentEmail && enr.parentEmail.toLowerCase() !== enr.email.toLowerCase()) {
        sendMail({
          to: enr.parentEmail,
          subject: `[Parent Notice · CampusPoint] ${cleanSubject} (for ${studentName})`,
          html: buildMentorEmailHtml({
            mentorName,
            mentorCollege,
            studentName,
            studentId: enr.studentId,
            plan: enr.plan,
            category: `${category} (Parent Copy)`,
            subject: cleanSubject,
            message: cleanMessage,
            link,
            isParentCopy: true,
          }),
          text,
        }).catch((err) => console.error(`[mentor/send-email] parent copy error for ${enr.parentEmail}:`, err.message));
      }
    }

    // Audit activity log
    MentorActivityLog.create({
      mentorId: req.mentor._id,
      mentorEmail: req.mentor.email,
      action: "mentor_email_sent",
      details: {
        recipientType,
        targetCount: enrollments.length,
        sentCount,
        subject: cleanSubject,
        category,
        includeParent,
      },
      ip: req.ip || "",
      userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
    }).catch(() => {});

    return res.json({
      ok: true,
      sentCount,
      totalRequested: enrollments.length,
      recipients: recipientLogs,
    });
  } catch (e) {
    console.error("[mentor/send-email]", e);
    return res.status(500).json({ error: "Failed to send email. " + (e.message || "") });
  }
});

export default router;
