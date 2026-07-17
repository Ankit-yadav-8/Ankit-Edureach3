import mongoose from "mongoose";

// A mentor account. Created by an admin, never self-registered — the admin sets
// the initial password and hands it over out of band.
//
// Mentors are deliberately a separate collection from User rather than a role
// flag on it: a mentor must never be resolvable by the student-facing lookups
// (which all go through User), so keeping the identities in different
// collections means a mentor id simply does not exist as a student.
const mentorSchema = new mongoose.Schema(
  {
    name:    { type: String, trim: true, required: true },
    email:   { type: String, lowercase: true, trim: true, required: true, unique: true, index: true },
    phone:   { type: String, trim: true, default: "" },
    college: { type: String, trim: true, default: "" },

    passwordHash: { type: String, required: true },

    // Student IDs (CP-2026-00042) this mentor may read. This array is the ONLY
    // thing that grants access to a student's data — every mentor-facing read is
    // scoped through it, so an empty array means the mentor sees nothing.
    students: [{ type: String, trim: true, uppercase: true, index: true }],

    // Admins can revoke access without deleting the account (and its history).
    active: { type: Boolean, default: true },

    // Set when the admin creates or resets the account; the mentor is forced
    // through a password change before any student data is served.
    mustChangePassword: { type: Boolean, default: true },

    // Bumped on password change / revoke to invalidate already-issued tokens.
    // A token carrying a stale value is rejected even if it hasn't expired.
    tokenVersion: { type: Number, default: 0 },

    failedLogins: { type: Number, default: 0 },
    lockedUntil:  { type: Date, default: null },
    lastLogin:    { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Mentor", mentorSchema);
