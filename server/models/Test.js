import mongoose from "mongoose";

// One MCQ / integer question parsed out of the uploaded test PDF.
// `correct` holds the answer key entry: an option key ("A".."D"/"1".."4") for
// single-correct, or a numeric string for integer-type questions.
const questionSchema = new mongoose.Schema(
  {
    qno: { type: Number, required: true },
    text: { type: String, default: "" },
    image: { type: String, default: "" }, // optional question image (Cloudinary)
    // option text and/or image; empty for integer type
    options: [{ key: String, text: String, image: { type: String, default: "" } }],
    type: { type: String, enum: ["single", "integer"], default: "single" },
    subject: { type: String, default: "" }, // Physics / Chemistry / Maths / Biology — drives section tabs
    topic: { type: String, default: "" },   // chapter, for the result heatmap (best-effort)
    correct: { type: String, default: "" }, // from the answer-key PDF
    explanation: { type: String, default: "" }, // worked solution shown after submit
  },
  { _id: false }
);

// A marking section — used for JEE Advanced, whose marks differ per section
// (e.g. Q1–6 single-correct +3/−1, Q7–12 integer +4/0). Questions in [fromQ,toQ]
// are graded with this scheme; anything outside falls back to the flat marking.
const sectionSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    fromQ: { type: Number, required: true },
    toQ: { type: Number, required: true },
    correct: { type: Number, default: 4 },
    wrong: { type: Number, default: 0 },
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

    // Exam pattern. JEE plans split into "mains" / "advanced"; NEET → "neet";
    // everything else "standard". Mains/NEET use fixed +4/−1/0; Advanced uses
    // the per-section schemes below.
    examType: { type: String, enum: ["mains", "advanced", "neet", "standard"], default: "standard", index: true },

    // Source documents (Cloudinary). The question PDF is shown in the CBT pane;
    // the key PDF is parsed for grading and shown to the student as solutions.
    testPdfUrl: { type: String, default: "" },
    keyPdfUrl: { type: String, default: "" },

    // Flat marking scheme (NTA default +4 / −1; unattempted is always 0). Used
    // for mains/neet/standard, and as the fallback for any Advanced question
    // not covered by a section below.
    marking: {
      correct: { type: Number, default: 4 },
      wrong: { type: Number, default: -1 },
    },

    // Per-section marking — JEE Advanced only.
    sections: { type: [sectionSchema], default: [] },

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
