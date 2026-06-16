import mongoose from "mongoose";

// Tiny atomic-counter collection. One document per named sequence; we use it to
// hand out the global, never-repeating student-ID number (CP-2026-00042).
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "studentId"
  seq: { type: Number, default: 0 },
});

export default mongoose.model("Counter", counterSchema);
