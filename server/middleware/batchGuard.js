import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import { ensureStudentId } from "../utils/studentId.js";

// ─────────────────────────────────────────────────────────────────────────────
// Batch guard — the heart of community access control.
// A student may belong to MORE THAN ONE mentorship batch (e.g. JEE 2027 +
// Foundation). The client can ask for a specific batch via ?plan=…, but the
// plan is never trusted blindly: we only honour it when the user actually owns
// a PAID enrolment for that exact plan. Otherwise we fall back to their most
// recent paid mentorship enrolment. Either way req.batch.plan is the single
// source of truth, so a student can never spoof their way into another batch.
// ─────────────────────────────────────────────────────────────────────────────
export async function requireBatch(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("email name").lean();
    if (!user?.email) return res.status(403).json({ error: "No account found." });
    const email = user.email.toLowerCase();

    // A batch the caller explicitly asked for (?plan= or x-batch-plan header).
    const requested = String(req.query.plan || req.headers["x-batch-plan"] || "").trim();

    let enr = null;
    if (/^mentor-/.test(requested)) {
      // Only resolves if THIS user paid for THIS plan — ownership is verified.
      enr = await Enrollment.findOne({ status: "paid", email, plan: requested })
        .sort({ createdAt: -1 })
        .lean();
    }
    // No (or unowned) plan requested → their most recent mentorship batch.
    if (!enr) {
      enr = await Enrollment.findOne({
        status: "paid",
        email,
        plan: { $regex: /^mentor-/ },
      })
        .sort({ createdAt: -1 })
        .lean();
    }

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
      parentEmail: (enr.parentEmail || "").toLowerCase(),
      createdAt: enr.createdAt,
    };
    next();
  } catch (e) {
    console.error("[requireBatch]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
}
