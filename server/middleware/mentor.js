import jwt from "jsonwebtoken";
import Mentor from "../models/Mentor.js";
import Enrollment from "../models/Enrollment.js";

// Every token this app issues is signed with the same JWT_SECRET, so the claim
// set is the ONLY thing separating a student token from an admin or mentor one.
// Mentor tokens are therefore stamped with an explicit type and are rejected by
// requireAuth (see middleware/auth.js) — a mentor token must never be usable to
// act as a student.
export const MENTOR_TYP = "mentor";

// Short TTL: this token reads other people's study data, so it should not be a
// long-lived bearer credential the way the 30-day student token is.
export function signMentorToken(mentor) {
  return jwt.sign(
    { typ: MENTOR_TYP, id: String(mentor._id), v: mentor.tokenVersion || 0 },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
}

// Gate for mentor-only endpoints. Re-reads the mentor on every request rather
// than trusting the token body, so an admin revoking access (active:false) or
// rotating tokenVersion takes effect immediately instead of at token expiry.
export async function requireMentor(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return res.status(401).json({ error: "Invalid or expired token" }); }

  if (payload?.typ !== MENTOR_TYP || !payload.id) {
    return res.status(403).json({ error: "Mentor authentication required" });
  }

  const mentor = await Mentor.findById(payload.id).select("-passwordHash").lean();
  if (!mentor || !mentor.active) return res.status(403).json({ error: "Mentor access revoked" });
  if ((mentor.tokenVersion || 0) !== (payload.v || 0)) {
    return res.status(401).json({ error: "Session expired, sign in again" });
  }

  req.mentor = mentor;
  next();
}

// Blocks every data route until the admin-issued password has been replaced.
export function requirePasswordChanged(req, res, next) {
  if (req.mentor?.mustChangePassword) {
    return res.status(403).json({ error: "Set a new password before continuing", mustChangePassword: true });
  }
  next();
}

// The single chokepoint for "may this mentor see this student?".
//
// Answering from the mentor's own `students` array alone is not enough: an
// admin could assign a CP ID that was never a real paid enrolment, so we also
// confirm the enrolment exists. Returns the enrolment (which carries the email
// + plan the student's data is actually keyed by) or null.
export async function resolveAssignedStudent(mentor, rawStudentId) {
  const studentId = String(rawStudentId || "").trim().toUpperCase();
  if (!studentId) return null;

  const assigned = (mentor.students || []).map((s) => String(s).toUpperCase());
  if (!assigned.includes(studentId)) return null;

  const enr = await Enrollment.findOne({ studentId, status: "paid" })
    .select("studentId name email plan createdAt")
    .lean();
  if (!enr) return null;

  // Enrollment.email defaults to "". A student's data is keyed by email, so an
  // empty one would turn every scoped lookup into `{ email: "" }` — a query
  // that silently matches every other emailless record. Refuse instead.
  if (!enr.email) return null;

  return enr;
}
