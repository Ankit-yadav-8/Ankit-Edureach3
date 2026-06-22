import mongoose from "mongoose";

// One MCQ / integer question parsed out of the uploaded test PDF.
// `correct` holds the answer key entry: an option key ("A".."D"/"1".."4") for
// single-correct, or a numeric string for integer-type questions.
const questionSchema = new mongoose.Schema(
  {
    qno: { type: Number, required: true },
    text: { type: String, default: "" },
    options: [{ key: String, text: String }], // empty for integer type
    type: { type: String, enum: ["single", "integer"], default: "single" },
    subject: { type: String, default: "" },
    correct: { type: String, default: "" }, // from the answer-key PDF
  },
  { _id: false }
);

// A test paper uploaded by the admin and pinned to ONE mentorship plan.
// category mirrors the three admin sections (daily / weekly / full).
const testSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      enum: [
        "mentor-jee-2027", "mentor-neet-2027",
        "mentor-jee-2028", "mentor-neet-2028",
        "mentor-foundation",
      ],
      required: true,
      index: true,
    },
    category: { type: String, enum: ["daily", "weekly", "full"], required: true, index: true },

    title: { type: String, trim: true, required: true },
    subject: { type: String, trim: true, default: "" }, // optional umbrella subject
    durationMin: { type: Number, default: 60 },

    // Source documents (Cloudinary). The question PDF is shown in the CBT pane;
    // the key PDF is parsed for grading and shown to the student as solutions.
    testPdfUrl: { type: String, default: "" },
    keyPdfUrl: { type: String, default: "" },

    // Marking scheme (NTA default +4 / −1).
    marking: {
      correct: { type: Number, default: 4 },
      wrong: { type: Number, default: -1 },
    },

    questions: { type: [questionSchema], default: [] },
    totalQuestions: { type: Number, default: 0 },
    maxMarks: { type: Number, default: 0 },

    // "draft" = parsed, awaiting admin confirm; "published" = visible to students.
    status: { type: String, enum: ["draft", "published"], default: "published", index: true },

    // Parser diagnostics surfaced to the admin (e.g. "answer key matched 28/30").
    parseNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);
