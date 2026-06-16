import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // Clean, global, never-repeating student ID (CP-2026-00042). Assigned on
    // first paid mentorship enrolment; back-filled for older enrolments on read.
    studentId: { type: String, default: null, index: true },

    // Plan
    plan: {
      type: String,
      enum: [
        "josaa", "all-colleges",
        "mentor-jee-2027", "mentor-neet-2027",
        "mentor-jee-2028", "mentor-neet-2028",
        "mentor-foundation",
      ],
      required: true,
    },
    amount: { type: Number, required: true }, // in rupees

    // Student details
    name:      { type: String, trim: true, required: true },
    email:     { type: String, lowercase: true, trim: true, default: "" },
    phone:     { type: String, trim: true, default: "" },
    homeState: { type: String, trim: true, default: "" },

    // Parent contact — weekly progress report is emailed here (mentorship).
    parentEmail:        { type: String, lowercase: true, trim: true, default: "" },
    lastParentReportAt: { type: Date, default: null },

    // Mentorship context (optional)
    currentClass: { type: String, trim: true, default: "" },
    targetExam:   { type: String, trim: true, default: "" },

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
