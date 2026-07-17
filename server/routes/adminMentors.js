import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Mentor from "../models/Mentor.js";
import Enrollment from "../models/Enrollment.js";
import MentorAccessLog from "../models/MentorAccessLog.js";
import { requireAdmin } from "../middleware/admin.js";

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
// and the mentor is forced to replace it on first sign-in.
function generatePassword() {
  return crypto.randomBytes(9).toString("base64url").slice(0, 12);
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
    const password = String(req.body?.password || "") || generatePassword();
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

export default router;
