import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import { ensureStudentId } from "../utils/studentId.js";

// ─────────────────────────────────────────────────────────────────────────────
// Batch guard — the heart of community access control.
// Resolves the logged-in user's most recent PAID mentorship enrolment and pins
// every request to that plan's room (req.batch.plan). A student can therefore
// only ever read or post in their own batch — the plan is never taken from the
// client, so it can't be spoofed to peek into another batch.
// ─────────────────────────────────────────────────────────────────────────────
export async function requireBatch(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("email name").lean();
    if (!user?.email) return res.status(403).json({ error: "No account found." });

    const enr = await Enrollment.findOne({
      status: "paid",
      email: user.email.toLowerCase(),
      plan: { $regex: /^mentor-/ },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!enr) {
      return res.status(403).json({
        error: "The community is for enrolled mentorship students.",
        code: "NOT_ENROLLED",
      });
    }

    const studentId = await ensureStudentId(enr._id, enr.createdAt);

    req.batch = {
      enrollmentId: enr._id,
      userId: String(req.user.id),
      plan: enr.plan,
      studentId,
      name: enr.name || user.name || "Student",
      email: user.email.toLowerCase(),
      createdAt: enr.createdAt,
    };
    next();
  } catch (e) {
    console.error("[requireBatch]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
}
