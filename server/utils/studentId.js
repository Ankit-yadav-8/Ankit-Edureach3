import Counter from "../models/Counter.js";
import Enrollment from "../models/Enrollment.js";

// ─────────────────────────────────────────────────────────────────────────────
// Student IDs — clean, sequential, global: CP-2026-00042
//   • "2026"  = the year the student enrolled (display only)
//   • "00042" = a single global counter that never resets or repeats
// The counter is incremented atomically ($inc) so two simultaneous enrolments
// can never collide on the same number.
// ─────────────────────────────────────────────────────────────────────────────
const PAD = 5;

export async function nextStudentId(year = new Date().getFullYear()) {
  const doc = await Counter.findByIdAndUpdate(
    "studentId",
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return `CP-${year}-${String(doc.seq).padStart(PAD, "0")}`;
}

// Make sure an enrolment has a student ID, assigning one only if it's missing.
// Race-safe: the conditional update sets the ID only while it's still blank, so
// a second concurrent caller falls through and reads back whoever won.
export async function ensureStudentId(enrId, createdAt) {
  const existing = await Enrollment.findById(enrId).select("studentId createdAt").lean();
  if (existing?.studentId) return existing.studentId;

  const year = new Date(existing?.createdAt || createdAt || Date.now()).getFullYear();
  const id = await nextStudentId(year);

  const won = await Enrollment.findOneAndUpdate(
    { _id: enrId, $or: [{ studentId: null }, { studentId: "" }, { studentId: { $exists: false } }] },
    { $set: { studentId: id } },
    { new: true }
  ).select("studentId").lean();

  if (won?.studentId) return won.studentId;
  const after = await Enrollment.findById(enrId).select("studentId").lean();
  return after?.studentId || id;
}
