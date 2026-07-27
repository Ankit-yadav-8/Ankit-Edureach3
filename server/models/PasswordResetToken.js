import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// TTL Index: automatically delete document 15 minutes (900 seconds) after creation
passwordResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

export default mongoose.model("PasswordResetToken", passwordResetTokenSchema);
