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
    neetRank:        { type: Number, default: null },
    passwordHash: { type: String },
    resetTokenHash: { type: String },
    resetExpires:   { type: Date },
    lastLogin:    { type: Date },

    // Bumped to invalidate every session token already issued for this account.
    // A JWT can't be taken back once signed, so this is the only way a password
    // reset or a "log out everywhere" can actually end a stolen session.
    // Tokens carry the value they were minted with; requireAuth rejects any
    // that no longer match.
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);