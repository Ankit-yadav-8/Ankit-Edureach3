import mongoose from "mongoose";

// One student's submitted answer for one question, with the grading outcome.
const answerSchema = new mongoose.Schema(
  {
    qno: { type: Number, required: true },
    answer: { type: String, default: "" }, // what the student chose ("" = unattempted)
    correct: { type: String, default: "" }, // the key answer, snapshotted at grade time
    status: { type: String, enum: ["correct", "wrong", "skipped"], default: "skipped" },
    marks: { type: Number, default: 0 },
  },
  { _id: false }
);

// A graded CBT attempt. One per (test, user) — re-submitting overwrites, so the
// student always has a single canonical score that feeds the performance stats.
const attemptSchema = new mongoose.Schema(
  {
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true, index: true },
    userId: { type: String, required: true, index: true },
    email: { type: String, lowercase: true, trim: true, default: "" },
    plan: { type: String, required: true, index: true },
    category: { type: String, default: "" },
    title: { type: String, default: "" },

    answers: { type: [answerSchema], default: [] },

    // Score breakdown
    score: { type: Number, default: 0 },
    maxMarks: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }, // % of attempted that were correct
    percent: { type: Number, default: 0 }, // score / maxMarks
    durationSec: { type: Number, default: 0 },

    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

attemptSchema.index({ test: 1, userId: 1 }, { unique: true });

export default mongoose.model("TestAttempt", attemptSchema);
