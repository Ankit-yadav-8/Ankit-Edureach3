import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // Clean, global, never-repeating student ID (CP-2026-00042). Assigned on
    // first paid mentorship enrolment; back-filled for older enrolments on read.
    studentId: { type: String, default: null, index: true },

    // The logged-in account that made this purchase (when authenticated at
    // checkout). This is the reliable link to the user — the `email`/`phone`
    // below are editable in the form and may not match the account.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },

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
    email:     { type: String, lowercase: true, trim: true, default: "", index: true },
    phone:     { type: String, trim: true, default: "" },
    // The last 10 digits of `phone`, stored separately so "my plans" can find an
    // enrolment by phone with an indexed equality match. `phone` itself is free
    // text (spacing, +91, dashes), and the old lookup used /\d{10}$/ against it —
    // a suffix regex can never use an index, so every dashboard load scanned the
    // whole collection. Written on save; back-filled lazily on read for old rows.
    phone10:   { type: String, trim: true, default: "", index: true },
    homeState: { type: String, trim: true, default: "" },

    // Parent contact — weekly progress report is emailed here (mentorship).
    parentEmail:        { type: String, lowercase: true, trim: true, default: "" },
    lastParentReportAt: { type: Date, default: null }, // weekly / backlog cadence
    lastDailyReportAt:  { type: Date, default: null }, // daily-report cadence (cron + client)

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

// "My plans" always filters on status:"paid" and sorts newest-first. Without
// this, that read scanned every enrolment in the collection on each dashboard
// open — which only gets slower as enrolments grow.
enrollmentSchema.index({ status: 1, createdAt: -1 });

// Keep phone10 in step with phone automatically, so nothing has to remember to
// set it at each of the places an enrolment is written.
enrollmentSchema.pre("save", function (next) {
  if (this.isModified("phone")) {
    const d = String(this.phone || "").replace(/\D/g, "");
    this.phone10 = d.length >= 10 ? d.slice(-10) : "";
  }
  next();
});

export default mongoose.model("Enrollment", enrollmentSchema);
