import mongoose from "mongoose";

const CutoffSchema = new mongoose.Schema({
  institute:    String,
  program:      String,
  quota:        String,
  seat_type:    String,
  gender:       String,
  round:        Number,
  opening_rank: Number,
  closing_rank: Number,
  exam:         String,   // "JEE_ADVANCED" (IITs) | "JEE_MAIN" (NIT/IIIT/GFTI)
  year:         Number,
});

// Indexes that match how the API + frontend query the data
CutoffSchema.index({ year: 1, exam: 1, seat_type: 1, closing_rank: 1 });
CutoffSchema.index({ year: 1, round: 1 });
CutoffSchema.index({ institute: 1, year: 1 });

export default mongoose.model("Cutoff", CutoffSchema);