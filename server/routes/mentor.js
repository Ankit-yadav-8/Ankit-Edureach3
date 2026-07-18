import express from "express";
import bcrypt from "bcryptjs";
import Mentor from "../models/Mentor.js";
import MentorProgress from "../models/MentorProgress.js";
import MentorTask from "../models/MentorTask.js";
import TestAttempt from "../models/TestAttempt.js";
import MentorAccessLog from "../models/MentorAccessLog.js";
import {
  signMentorToken, requireMentor, requirePasswordChanged, resolveAssignedStudent,
} from "../middleware/mentor.js";

const router = express.Router();

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

// Normalise a submitted task list: accept strings or {text} objects, trim, drop
// blanks, cap at 20, and give each a stable id. Mirrors the student-facing shape
// in mentorship.js so the student's dashboard renders them unchanged.
const sanitizeTasks = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .map((t) => (typeof t === "string" ? t : t?.text))
    .map((s) => String(s || "").trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((text, i) => ({ id: `mt-${Date.now()}-${i}`, text }));

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

/* ── One student's test attempts — READ ONLY ─────────────────────────────── */
router.get("/students/:studentId/tests", requireMentor, requirePasswordChanged, async (req, res) => {
  try {
    const enr = await resolveAndAudit(req, "tests");
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
    const doc = await MentorTask.findOneAndUpdate(
      { studentId: enr.studentId },
      { studentId: enr.studentId, tasks, assignedByMentorId: req.mentor._id, assignedByName: req.mentor.name },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    res.json({ ok: true, tasks: doc.tasks });
  } catch (e) {
    console.error("[mentor/tasks PUT]", e.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
