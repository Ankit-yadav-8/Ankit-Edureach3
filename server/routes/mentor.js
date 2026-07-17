import express from "express";
import bcrypt from "bcryptjs";
import Mentor from "../models/Mentor.js";
import MentorProgress from "../models/MentorProgress.js";
import MentorTask from "../models/MentorTask.js";
import TestAttempt from "../models/TestAttempt.js";
import {
  signMentorToken, requireMentor, requirePasswordChanged, resolveAssignedStudent,
} from "../middleware/mentor.js";

const router = express.Router();

// Mentors are read-only over student data by design. This router exposes GETs
// only for anything student-owned; the sole writes it allows are to the mentor's
// own credentials. Anything a mentor authors FOR a student (tasks, guidance,
// chat) lands in mentor-owned collections, never inside the student's own blob.

const MAX_FAILED = 5;
const LOCK_MS = 15 * 60 * 1000;

const publicMentor = (m) => ({
  id: String(m._id), name: m.name, email: m.email,
  college: m.college, phone: m.phone,
  students: m.students || [], mustChangePassword: !!m.mustChangePassword,
});

/* ── Login — email + the password the admin issued ───────────────────────── */
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").toLowerCase().trim();
    const password = String(req.body?.password || "");
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const mentor = await Mentor.findOne({ email });

    // Same generic message and roughly the same work whether or not the account
    // exists, so this endpoint can't be used to enumerate mentor emails.
    const deny = () => res.status(401).json({ error: "Invalid email or password" });
    if (!mentor) { await bcrypt.compare(password, "$2a$12$" + "x".repeat(53)).catch(() => {}); return deny(); }
    if (!mentor.active) return res.status(403).json({ error: "This mentor account has been deactivated" });

    if (mentor.lockedUntil && mentor.lockedUntil > new Date()) {
      const mins = Math.ceil((mentor.lockedUntil - Date.now()) / 60000);
      return res.status(429).json({ error: `Too many attempts. Try again in ${mins} min.` });
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
    const current = String(req.body?.currentPassword || "");
    const next = String(req.body?.newPassword || "");
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
      if (enr) out.push({ studentId: enr.studentId, name: enr.name, plan: enr.plan, since: enr.createdAt });
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
    const enr = await resolveAssignedStudent(req.mentor, req.params.studentId);
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

/* ── One student's test attempts — READ ONLY ─────────────────────────────── */
router.get("/students/:studentId/tests", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const enr = await resolveAssignedStudent(req.mentor, req.params.studentId);
    if (!enr) return res.status(404).json({ error: "Student not found" });

    // Scoped to the plan this mentor is assigned for, not the whole account —
    // a student on two plans only exposes the one the assignment covers.
    const attempts = await TestAttempt.find({ email: enr.email, plan: enr.plan })
      .select("-answers")
      .sort({ createdAt: -1 }).limit(50).lean();
    res.json({ attempts });
  } catch (e) {
    console.error("[mentor/tests]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── The tasks a student currently sees — READ ONLY in this phase ────────── */
router.get("/students/:studentId/tasks", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const enr = await resolveAssignedStudent(req.mentor, req.params.studentId);
    if (!enr) return res.status(404).json({ error: "Student not found" });
    const doc = await MentorTask.findOne({ studentId: enr.studentId }).lean();
    res.json({ tasks: doc?.tasks || [] });
  } catch (e) {
    console.error("[mentor/tasks]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
