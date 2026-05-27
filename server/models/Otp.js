import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true, trim: true, index: true },
  codeHash:  { type: String, required: true },
  name:      { type: String, default: "" },
  attempts:  { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});
// auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model("Otp", otpSchema);