import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    // Human-readable coupon code (e.g. "WELCOME500") — stored uppercase, unique.
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    // Flat ₹ discount applied when this coupon is redeemed.
    discountAmount: { type: Number, required: true, min: 1 },

    // Which mentorship plan *families* this coupon may be used on.
    // Values are base plan families: "mentor-jee-2027", "mentor-jee-2028",
    // "mentor-neet-2027", "mentor-neet-2028", "mentor-foundation".
    // The coupon applies to ALL sub-variants (6m, 1yr, intl) of each family.
    applicablePlans: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one applicable plan is required.",
      },
    },

    // Who can use this coupon.
    region: {
      type: String,
      enum: ["indian", "international", "both"],
      default: "both",
    },

    // Admin can deactivate without deleting.
    isActive: { type: Boolean, default: true },

    // How many times this coupon has been successfully redeemed.
    usageCount: { type: Number, default: 0 },

    // Optional cap on total redemptions (null/0 = unlimited).
    maxUses: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
