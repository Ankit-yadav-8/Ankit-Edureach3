import mongoose from "mongoose";

// A record of every time a mentor read a student's data.
//
// This prevents nothing. Its whole job is to answer "who looked at what, and
// when" after the fact — the question you cannot answer retroactively if you
// weren't already writing it down. Without it, a mentor account quietly reading
// its students every night, or a stolen mentor token being used, would leave no
// trace whatsoever.
//
// Deliberately records only WHO / WHAT / WHEN — never the student data itself.
// A log that copies the data it guards just doubles the places that data leaks
// from.
const mentorAccessLogSchema = new mongoose.Schema(
  {
    mentorId:    { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true, index: true },
    mentorEmail: { type: String, lowercase: true, trim: true, default: "" },
    studentId:   { type: String, uppercase: true, trim: true, required: true, index: true },
    // Which surface was read: "progress" | "tests" | "tasks" | "list".
    resource:    { type: String, trim: true, required: true },
    ip:          { type: String, trim: true, default: "" },
    userAgent:   { type: String, trim: true, default: "" },
    // false when the mentor asked for a student they aren't assigned. These are
    // the interesting rows: a burst of them is someone probing.
    allowed:     { type: Boolean, default: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Keep 180 days. Long enough to investigate an incident found weeks late, short
// enough that the log doesn't become its own liability.
mentorAccessLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });
mentorAccessLogSchema.index({ mentorId: 1, createdAt: -1 });

export default mongoose.model("MentorAccessLog", mentorAccessLogSchema);
