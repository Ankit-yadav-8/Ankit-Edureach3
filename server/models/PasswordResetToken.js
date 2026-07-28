import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true },
    // Hash of the cryptographic verification token issued after OTP confirmation
    verifyTokenHash: { type: String, default: "" },
    // Flow status: pending → otp_verified → used
    status: { type: String, enum: ["pending", "otp_verified", "used"], default: "pending" },
    // Brute-force protection: limit OTP guess attempts
    attempts: { type: Number, default: 0 },
    // Legacy compat — kept so old docs don't break queries during migration
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// TTL Index: automatically delete document 15 minutes (900 seconds) after creation
passwordResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

export default mongoose.model("PasswordResetToken", passwordResetTokenSchema);
