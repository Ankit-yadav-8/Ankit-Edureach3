import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // Plan
    plan:   { type: String, enum: ["josaa", "all-colleges"], required: true },
    amount: { type: Number, required: true }, // in rupees (249 / 499)

    // Student details
    name:      { type: String, trim: true, required: true },
    email:     { type: String, lowercase: true, trim: true, default: "" },
    phone:     { type: String, trim: true, default: "" },
    homeState: { type: String, trim: true, default: "" },

    // Ranks
    jeeMainCrlRank:      { type: Number, default: null },
    jeeMainCategoryRank: { type: Number, default: null },
    jeeAdvCrlRank:       { type: Number, default: null },
    jeeAdvCategoryRank:  { type: Number, default: null },

    // Razorpay
    razorpayOrderId:   { type: String, index: true },
    razorpayPaymentId: { type: String, default: "" },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  },
  { timestamps: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);
