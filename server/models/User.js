import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name:         { type: String, trim: true, default: "" },
    email:        { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    phone:        { type: String, trim: true, unique: true, sparse: true },
    coaching:        { type: String, trim: true, default: "" },
    homeState:       { type: String, trim: true, default: "" },
    jeeMainsRank:    { type: Number, default: null },
    jeeAdvancedRank: { type: Number, default: null },
    passwordHash: { type: String },
    resetTokenHash: { type: String },
    resetExpires:   { type: Date },
    lastLogin:    { type: Date },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);