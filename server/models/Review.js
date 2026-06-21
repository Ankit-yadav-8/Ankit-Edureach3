import mongoose from "mongoose";

// One side of a campus review — hostel or mess.
const blockSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 0, max: 5, default: 0 },
    tags: { type: [String], default: [] },
    text: { type: String, default: "", maxlength: 2000 },
  },
  { _id: false }
);

// A student's review of a college's hostel & mess. Public to read; writing
// requires a logged-in user (authorId), though the displayed name is whatever
// the reviewer typed.
const reviewSchema = new mongoose.Schema(
  {
    college: { type: String, required: true, index: true, trim: true, maxlength: 200 },
    name: { type: String, default: "Anonymous", maxlength: 80 },
    authorId: { type: String, default: "" }, // user _id of the submitter

    overall: { type: Number, min: 0, max: 5, default: 0 },
    comment: { type: String, default: "", maxlength: 2000 },

    hostel: { type: blockSchema, default: () => ({}) },
    mess: { type: blockSchema, default: () => ({}) },

    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ college: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);
