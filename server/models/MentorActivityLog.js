import mongoose from "mongoose";

/**
 * Audit and analytics log for mentor and student interactions:
 * - Mentor logins (success and failures)
 * - Mentor task operations (assign, update, complete)
 * - Assigned student logins attributed to mentors
 * - Administrative tracking events
 */
const mentorActivityLogSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", index: true },
    mentorEmail: { type: String, lowercase: true, trim: true },
    mentorName: { type: String, trim: true },
    studentId: { type: String, uppercase: true, trim: true, index: true },
    studentName: { type: String, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    action: {
      type: String,
      required: true,
      enum: [
        "mentor_login",
        "mentor_login_failed",
        "task_assign",
        "task_update",
        "task_complete",
        "student_login",
        "admin_action",
      ],
      index: true,
    },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

// Optimized compound indexes for fast date-range queries & aggregation
mentorActivityLogSchema.index({ mentorId: 1, action: 1, createdAt: -1 });
mentorActivityLogSchema.index({ studentId: 1, action: 1, createdAt: -1 });
mentorActivityLogSchema.index({ createdAt: -1, action: 1 });
mentorActivityLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model("MentorActivityLog", mentorActivityLogSchema);
