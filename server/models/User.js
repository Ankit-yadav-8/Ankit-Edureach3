import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name:         { type: String, trim: true, default: "" },
    email:        { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    phone:        { type: String, trim: true, unique: true, sparse: true },
    passwordHash: { type: String },          // only for email/password accounts
    resetTokenHash: { type: String },
    resetExpires:   { type: Date },
    lastLogin:    { type: Date },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
