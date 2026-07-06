import mongoose from "mongoose";

// A student's mentorship dashboard state (daily logs, tests, backlog, weekly
// tasks, report prefs) persisted server-side so every device they log in from
// shows the same data. One document per account email + batch plan.
const mentorProgressSchema = new mongoose.Schema(
  {
    email: { type: String, lowercase: true, trim: true, required: true, index: true },
    plan: { type: String, trim: true, required: true, index: true },
    // The whole dashboard blob { entries, tests, backlog, weeklyTasks, fixDone,
    // reportPrefs, lastAuto }. Kept opaque so the client owns the shape.
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

mentorProgressSchema.index({ email: 1, plan: 1 }, { unique: true });

export default mongoose.model("MentorProgress", mentorProgressSchema);
