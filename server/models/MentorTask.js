import mongoose from "mongoose";

// Mentor-assigned weekly tasks for a single student. The student's own mentor
// sets a short list against their global student ID (e.g. CP-2026-00042) from
// the mentor dashboard; the student sees them as mandatory "From your mentor"
// items in their fix-list. One document per student ID. This is mentor-authored
// content and lives here — never inside the student's own progress blob.
const mentorTaskSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, index: true, trim: true, uppercase: true },
    tasks: [
      {
        id: { type: String },
        text: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // Who last set this list — stamped so a student's report can name the mentor
    // and an admin can see which mentor is driving the plan. Optional: legacy
    // admin-set lists have neither.
    assignedByMentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
    assignedByName: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("MentorTask", mentorTaskSchema);
