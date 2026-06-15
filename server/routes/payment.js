import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import { requireAdmin } from "../middleware/admin.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/* Plan catalogue — amount is fixed on the server so it can't be tampered
   with from the client. Keep the keys in sync with the frontend. */
const PLANS = {
  "josaa":         { amount: 299,  label: "JoSAA + CSAB 2026 Counselling" },
  "all-colleges":  { amount: 499,  label: "All Colleges Counselling (Any Rank)" },
  // ── Mentorship plans (JEE & NEET) ──
  "mentor-jee-2027":   { amount: 1999, label: "JEE 2027 Mentorship Program" },
  "mentor-neet-2027":  { amount: 1999, label: "NEET 2027 Mentorship Program" },
  "mentor-jee-2028":   { amount: 3999, label: "JEE 2028 Mentorship Program (2-Year)" },
  "mentor-neet-2028":  { amount: 3999, label: "NEET 2028 Mentorship Program (2-Year)" },
  "mentor-foundation": { amount: 2999, label: "Foundation Mentorship (Class 9–10)" },
};

const KEY_ID     = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

let razorpay = null;
if (KEY_ID && KEY_SECRET) {
  razorpay = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
} else {
  console.warn("⚠️  RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set — payments disabled.");
}

// Parse a rank-like value ("12,345" / " 678 ") to a positive number, else null.
const num = (v) => {
  const n = Number(String(v ?? "").replace(/[, ]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

/* ── Create an order ──────────────────────────────────────────────
   Body: { plan, name, email, phone, homeState, jeeMainCrlRank, ... }
   Returns: { orderId, amount, currency, keyId, planLabel }                */
router.post("/order", async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ error: "Payments are not configured yet." });

    const { plan } = req.body || {};
    const planMeta = PLANS[plan];
    if (!planMeta) return res.status(400).json({ error: "Invalid plan selected." });

    const { name } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: "Name is required." });

    const amountPaise = planMeta.amount * 100;

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `enr_${Date.now()}`,
      notes: { plan, name: String(name).slice(0, 100) },
    });

    // Intentionally NOT persisted here. An enrolment document is written only
    // after the payment is verified as genuine (see /verify), so the
    // `enrollments` collection holds successful payments only — abandoned or
    // failed checkouts leave no trace in the database.
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: KEY_ID,
      planLabel: planMeta.label,
    });
  } catch (e) {
    console.error("payment/order error:", e?.message || e);
    res.status(500).json({ error: "Could not start payment. Please try again." });
  }
});

/* ── Verify the payment signature ─────────────────────────────────
   Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature,
           plan, name, email, phone, ... }                                 */
router.post("/verify", async (req, res) => {
  try {
    if (!KEY_SECRET) return res.status(503).json({ error: "Payments are not configured yet." });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return res.status(400).json({ error: "Missing payment details." });

    const expected = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const valid =
      expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

    // Couldn't verify → the payment isn't genuine, so we save NOTHING. The
    // enrolment collection only ever gains a row on a confirmed success.
    if (!valid) return res.status(400).json({ error: "Payment verification failed." });

    // Amount/label always come from the server catalogue, never the client.
    const planMeta = PLANS[plan];
    if (!planMeta) return res.status(400).json({ error: "Invalid plan selected." });

    // Signature is valid — the payment is genuine, so create the enrolment now.
    // Keyed on the order id + upsert so a retried verify can't duplicate it.
    // Best-effort: the money has already moved, so a DB hiccup must not fail
    // the response to the customer.
    try {
      await Enrollment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          plan,
          amount: planMeta.amount,
          name:      String(req.body.name || "").trim(),
          email:     String(req.body.email || "").trim().toLowerCase(),
          phone:     String(req.body.phone || "").trim(),
          homeState: String(req.body.homeState || "").trim(),
          currentClass: String(req.body.currentClass || "").trim(),
          targetExam:   String(req.body.targetExam || "").trim(),
          jeeMainCrlRank:      num(req.body.jeeMainCrlRank),
          jeeMainCategoryRank: num(req.body.jeeMainCategoryRank),
          jeeAdvCrlRank:       num(req.body.jeeAdvCrlRank),
          jeeAdvCategoryRank:  num(req.body.jeeAdvCategoryRank),
          razorpayOrderId:   razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          status: "paid",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (e) { console.error("enrollment persist (paid) error:", e?.message || e); }

    res.json({ ok: true, paymentId: razorpay_payment_id });
  } catch (e) {
    console.error("payment/verify error:", e?.message || e);
    res.status(500).json({ error: "Could not verify payment." });
  }
});

/* ── Logged-in user: their own successful purchases ──────────────── */
router.get("/my-enrollments", requireAuth, async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const user = await User.findById(req.user.id).select("email").lean();
    if (!user?.email) return res.json({ enrollments: [] });
    const items = await Enrollment.find({ status: "paid", email: user.email.toLowerCase() })
      .sort({ createdAt: -1 }).lean();
    const enrollments = items.map((e) => ({ ...e, planLabel: PLANS[e.plan]?.label || e.plan }));
    res.json({ enrollments });
  } catch (e) {
    console.error("[payment/my-enrollments]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Admin: list successful payments (paid enrolments only) ───────── */
router.get("/enrollments", requireAdmin, async (_req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  try {
    const items = await Enrollment.find({ status: "paid" }).sort({ createdAt: -1 }).lean();
    const enrollments = items.map((e) => ({ ...e, planLabel: PLANS[e.plan]?.label || e.plan }));
    res.json({ total: enrollments.length, enrollments });
  } catch (e) {
    console.error("[payment/enrollments]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/enrollments/export.csv", requireAdmin, async (_req, res) => {
  try {
    const items = await Enrollment.find({ status: "paid" }).sort({ createdAt: -1 }).lean();
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = "Name,Email,Phone,Plan,Amount,Home State,Class,Target Exam,Payment ID,Order ID,Paid On\n";
    const rows = items.map((e) => [
      e.name, e.email, e.phone, PLANS[e.plan]?.label || e.plan, e.amount,
      e.homeState, e.currentClass, e.targetExam,
      e.razorpayPaymentId, e.razorpayOrderId, e.createdAt?.toISOString(),
    ].map(esc).join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=collegeparichay-payments.csv");
    res.send(head + rows);
  } catch (e) {
    console.error("[payment/enrollments/export]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
