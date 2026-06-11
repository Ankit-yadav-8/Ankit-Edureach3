import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Enrollment from "../models/Enrollment.js";

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

/* ── Create an order ──────────────────────────────────────────────
   Body: { plan, name, email, phone, homeState, jeeMainCrlRank, ... }
   Returns: { orderId, amount, currency, keyId, enrollmentId }            */
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

    // Persist the enrollment as "created" so we keep the lead even if
    // the student abandons the payment.
    const num = (v) => {
      const n = Number(String(v ?? "").replace(/[, ]/g, ""));
      return Number.isFinite(n) && n > 0 ? n : null;
    };
    const enr = await Enrollment.create({
      plan,
      amount: planMeta.amount,
      name: String(name).trim(),
      email: (req.body.email || "").trim(),
      phone: (req.body.phone || "").trim(),
      homeState: (req.body.homeState || "").trim(),
      currentClass: (req.body.currentClass || "").trim(),
      targetExam:   (req.body.targetExam || "").trim(),
      jeeMainCrlRank:      num(req.body.jeeMainCrlRank),
      jeeMainCategoryRank: num(req.body.jeeMainCategoryRank),
      jeeAdvCrlRank:       num(req.body.jeeAdvCrlRank),
      jeeAdvCategoryRank:  num(req.body.jeeAdvCategoryRank),
      razorpayOrderId: order.id,
      status: "created",
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: KEY_ID,
      enrollmentId: enr._id,
      planLabel: planMeta.label,
    });
  } catch (e) {
    console.error("payment/order error:", e?.message || e);
    res.status(500).json({ error: "Could not start payment. Please try again." });
  }
});

/* ── Verify the payment signature ─────────────────────────────────
   Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }  */
router.post("/verify", async (req, res) => {
  try {
    if (!KEY_SECRET) return res.status(503).json({ error: "Payments are not configured yet." });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return res.status(400).json({ error: "Missing payment details." });

    const expected = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const valid =
      expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

    if (!valid) {
      await Enrollment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );
      return res.status(400).json({ error: "Payment verification failed." });
    }

    await Enrollment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: "paid", razorpayPaymentId: razorpay_payment_id }
    );

    res.json({ ok: true, paymentId: razorpay_payment_id });
  } catch (e) {
    console.error("payment/verify error:", e?.message || e);
    res.status(500).json({ error: "Could not verify payment." });
  }
});

export default router;
