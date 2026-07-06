import mongoose from "mongoose";

// Mentor-assigned weekly tasks for a single student. The admin sets a short
// list against a global student ID (e.g. CP-2026-00042); the student sees them
// in their dashboard's "suggested" fix-list. One document per student ID.
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
  },
  { timestamps: true }
);

export default mongoose.model("MentorTask", mentorTaskSchema);
