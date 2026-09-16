import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Enrollment from "../models/Enrollment.js";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";
import { requireAdmin } from "../middleware/admin.js";
import { verifyAdminKey } from "../middleware/admin.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { ensureStudentId, nextStudentId } from "../utils/studentId.js";
import { batchLabelFor, validUntilFor } from "../utils/plans.js";

const router = express.Router();

/* Plan catalogue — amount is fixed on the server so it can't be tampered
   with from the client. Keep the keys in sync with the frontend.
   Indian students get 6-month and 1-year tiers; International gets 1-year. */
const PLANS = {
  "josaa":         { amount: 299,  label: "JoSAA + CSAB 2026 Counselling" },
  "all-colleges":  { amount: 499,  label: "All Colleges Counselling (Any Rank)" },

  // ── Indian · 6 months ──
  "mentor-jee-2027-6m":    { amount: 2599,  label: "JEE 2027 Mentorship (6 Months)" },
  "mentor-neet-2027-6m":   { amount: 2599,  label: "NEET 2027 Mentorship (6 Months)" },
  "mentor-jee-2028-6m":    { amount: 2599,  label: "JEE 2028 Mentorship (6 Months)" },
  "mentor-neet-2028-6m":   { amount: 2599,  label: "NEET 2028 Mentorship (6 Months)" },
  "mentor-foundation-6m":  { amount: 2599,  label: "Foundation Mentorship 6 Months (Class 9–10)" },

  // ── Indian · 1 year ──
  "mentor-jee-2027":       { amount: 4999,  label: "JEE 2027 Mentorship (1 Year)" },
  "mentor-neet-2027":      { amount: 4999,  label: "NEET 2027 Mentorship (1 Year)" },
  "mentor-jee-2028":       { amount: 4999,  label: "JEE 2028 Mentorship (1 Year, 2-Year Plan)" },
  "mentor-neet-2028":      { amount: 4999,  label: "NEET 2028 Mentorship (1 Year, 2-Year Plan)" },
  "mentor-foundation":     { amount: 4999,  label: "Foundation Mentorship 1 Year (Class 9–10)" },

  // ── International · 1 year ──
  "mentor-jee-2027-intl":      { amount: 14999, label: "JEE 2027 Mentorship – International (1 Year)" },
  "mentor-neet-2027-intl":     { amount: 14999, label: "NEET 2027 Mentorship – International (1 Year)" },
  "mentor-jee-2028-intl":      { amount: 14999, label: "JEE 2028 Mentorship – International (1 Year)" },
  "mentor-neet-2028-intl":     { amount: 14999, label: "NEET 2028 Mentorship – International (1 Year)" },
  "mentor-foundation-intl":    { amount: 14999, label: "Foundation Mentorship – International (1 Year)" },
};

/* Map any plan key to its "family" (base batch name) for coupon matching.
   e.g. "mentor-jee-2027-6m" → "mentor-jee-2027",
        "mentor-jee-2027-intl" → "mentor-jee-2027" */
function planFamily(planKey) {
  return planKey.replace(/-(6m|intl)$/, "");
}

/* Determine the region of a plan from its key */
function planRegion(planKey) {
  if (planKey.endsWith("-intl")) return "international";
  return "indian";
}

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
   Body: { plan, name, email, phone, homeState, couponCode?, ... }
   Returns: { orderId, amount, currency, keyId, planLabel,
              originalAmount, discount, couponCode }                */
router.post("/order", async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ error: "Payments are not configured yet." });

    const { plan, couponCode } = req.body || {};
    const planMeta = PLANS[plan];
    if (!planMeta) return res.status(400).json({ error: "Invalid plan selected." });

    const { name } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: "Name is required." });

    let finalAmount = planMeta.amount;
    let discount = 0;
    let appliedCoupon = "";

    // Server-side coupon validation — re-check even if the client already
    // validated, so a tampered request can't bypass the discount rules.
    if (couponCode && String(couponCode).trim()) {
      const code = String(couponCode).trim().toUpperCase();
      const coupon = await Coupon.findOne({ code, isActive: true });
      if (coupon) {
        const family = planFamily(plan);
        const region = planRegion(plan);
        const planMatch = coupon.applicablePlans.includes(family);
        const regionMatch = coupon.region === "both" || coupon.region === region;
        const usageOk = !coupon.maxUses || coupon.usageCount < coupon.maxUses;

        if (planMatch && regionMatch && usageOk) {
          discount = Math.min(coupon.discountAmount, finalAmount - 1); // never go below ₹1
          finalAmount = finalAmount - discount;
          appliedCoupon = code;
        }
      }
      // Silently ignore invalid coupons at order time — the client already
      // showed validation feedback; we just don't apply the discount.
    }

    const amountPaise = finalAmount * 100;

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `enr_${Date.now()}`,
      notes: { plan, name: String(name).slice(0, 100), couponCode: appliedCoupon },
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
      originalAmount: planMeta.amount,
      discount,
      couponCode: appliedCoupon,
    });
  } catch (e) {
    console.error("payment/order error:", e?.message || e);
    res.status(500).json({ error: "Could not start payment. Please try again." });
  }
});

/* ── Verify the payment signature ─────────────────────────────────
   Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature,
           plan, name, email, phone, couponCode?, region?, ... }         */
router.post("/verify", optionalAuth, async (req, res) => {
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

    // Re-compute the final amount with the same coupon logic as /order so we
    // can record the correct amounts in the enrollment.
    const couponCode = String(req.body.couponCode || "").trim().toUpperCase();
    let finalAmount = planMeta.amount;
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon) {
        const family = planFamily(plan);
        const region = planRegion(plan);
        const planMatch = coupon.applicablePlans.includes(family);
        const regionMatch = coupon.region === "both" || coupon.region === region;
        const usageOk = !coupon.maxUses || coupon.usageCount < coupon.maxUses;
        if (planMatch && regionMatch && usageOk) {
          discount = Math.min(coupon.discountAmount, finalAmount - 1);
          finalAmount = finalAmount - discount;
        }
      }
    }

    // Signature is valid — the payment is genuine, so create the enrolment now.
    // Keyed on the order id + upsert so a retried verify can't duplicate it.
    // Best-effort: the money has already moved, so a DB hiccup must not fail
    // the response to the customer.
    try {
      const enr = await Enrollment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          plan,
          amount: finalAmount,
          originalAmount: discount > 0 ? planMeta.amount : null,
          couponCode: couponCode || "",
          region: planRegion(plan),
          // Link to the signed-in account when present — the reliable owner key,
          // independent of the (editable) email/phone typed into the form.
          ...(req.user?.id ? { userId: req.user.id } : {}),
          name:      String(req.body.name || "").trim(),
          email:     String(req.body.email || "").trim().toLowerCase(),
          phone:     String(req.body.phone || "").trim(),
          homeState: String(req.body.homeState || "").trim(),
          parentEmail: String(req.body.parentEmail || "").trim().toLowerCase(),
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
      // Mentorship students get a clean global ID (CP-2026-00042) on enrolment.
      if (enr && /^mentor-/.test(enr.plan) && !enr.studentId) {
        const id = await nextStudentId(new Date(enr.createdAt || Date.now()).getFullYear());
        await Enrollment.updateOne(
          { _id: enr._id, $or: [{ studentId: null }, { studentId: "" }, { studentId: { $exists: false } }] },
          { $set: { studentId: id } }
        );
      }
      // Increment the coupon usage counter after a successful paid enrolment.
      if (couponCode && discount > 0) {
        await Coupon.updateOne({ code: couponCode }, { $inc: { usageCount: 1 } }).catch(() => {});
      }
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
    const user = await User.findById(req.user.id).select("email phone").lean();
    // Match a purchase to this account by ANY stable identifier: the account id
    // stored at checkout, the account email, or the account phone (matched on
    // the last 10 digits so formatting differences don't hide a paid enrolment).
    const or = [{ userId: req.user.id }];
    if (user?.email) or.push({ email: user.email.toLowerCase() });
    const phone10 = String(user?.phone || "").replace(/\D/g, "").slice(-10);
    // Equality against the stored phone10, not /\d{10}$/ against free-text
    // `phone`: a suffix regex can't use an index, so having it inside this $or
    // made the whole query a collection scan no matter what else matched.
    if (phone10.length === 10) or.push({ phone10 });
    const items = await Enrollment.find({ status: "paid", $or: or })
      .sort({ createdAt: -1 }).lean();

    // Auto-claim any enrollments that matched via email or phone but don't have a userId yet.
    // This permanently binds them to the user and prevents purchase hijacking.
    const unlinkedIds = items.filter((e) => !e.userId).map((e) => e._id);
    if (unlinkedIds.length > 0) {
      await Enrollment.updateMany(
        { _id: { $in: unlinkedIds } },
        { $set: { userId: req.user.id } }
      );
      items.forEach(e => {
        if (!e.userId) e.userId = req.user.id;
      });
    }
    // Mentorship enrolments carry a student ID, a batch label and a validity
    // window — back-fill the ID here so older students get one on first open.
    const enrollments = await Promise.all(items.map(async (e) => {
      const isMentor = /^mentor-/.test(e.plan);
      const studentId = isMentor ? (e.studentId || await ensureStudentId(e._id, e.createdAt)) : null;
      return {
        ...e,
        studentId,
        planLabel: PLANS[e.plan]?.label || e.plan,
        ...(isMentor ? { batchLabel: batchLabelFor(e.plan), validUntil: validUntilFor(e.plan, e.createdAt) } : {}),
      };
    }));
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

/* ═══════════════ COUPON ENDPOINTS ═══════════════ */

/* ── Public: validate a coupon code ────────────────────────────────
   Body: { code, plan, region }
   Returns: { valid, discountAmount, message }                        */
router.post("/validate-coupon", async (req, res) => {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();
    const plan = String(req.body.plan || "");
    const region = String(req.body.region || "indian");

    if (!code) return res.json({ valid: false, message: "Enter a coupon code." });

    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) return res.json({ valid: false, message: "Invalid or expired coupon code." });

    // Check plan family match
    const family = planFamily(plan);
    if (!coupon.applicablePlans.includes(family)) {
      return res.json({ valid: false, message: "This coupon is not valid for this batch." });
    }

    // Check region match
    if (coupon.region !== "both" && coupon.region !== region) {
      return res.json({ valid: false, message: `This coupon is only for ${coupon.region} students.` });
    }

    // Check usage cap
    if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
      return res.json({ valid: false, message: "This coupon has reached its usage limit." });
    }

    res.json({ valid: true, discountAmount: coupon.discountAmount, message: `₹${coupon.discountAmount} OFF applied!` });
  } catch (e) {
    console.error("[payment/validate-coupon]", e?.message || e);
    res.status(500).json({ valid: false, message: "Server error" });
  }
});

/* ── Admin: list all coupons ──────────────────────────────────────── */
router.get("/coupons", requireAdmin, async (_req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json({ coupons });
  } catch (e) {
    console.error("[payment/coupons]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Admin: create a coupon (requires admin key confirmation) ─────
   Body: { code, discountAmount, applicablePlans, region, maxUses, adminKey } */
router.post("/coupons", requireAdmin, async (req, res) => {
  try {
    const { code, discountAmount, applicablePlans, region, maxUses, adminKey } = req.body || {};

    // Require admin key for coupon creation as an extra safety gate.
    if (!verifyAdminKey(adminKey)) {
      return res.status(403).json({ error: "Invalid admin key. Coupon creation requires key confirmation." });
    }

    if (!code || !String(code).trim()) return res.status(400).json({ error: "Coupon code is required." });
    if (!discountAmount || Number(discountAmount) < 1) return res.status(400).json({ error: "Discount amount must be at least ₹1." });
    if (!Array.isArray(applicablePlans) || applicablePlans.length === 0) return res.status(400).json({ error: "Select at least one batch." });

    const existing = await Coupon.findOne({ code: String(code).trim().toUpperCase() });
    if (existing) return res.status(409).json({ error: "A coupon with this code already exists." });

    const coupon = await Coupon.create({
      code: String(code).trim().toUpperCase(),
      discountAmount: Number(discountAmount),
      applicablePlans,
      region: region || "both",
      maxUses: maxUses ? Number(maxUses) : null,
    });

    res.json({ ok: true, coupon });
  } catch (e) {
    console.error("[payment/coupons POST]", e?.message || e);
    res.status(500).json({ error: "Could not create coupon." });
  }
});

/* ── Admin: toggle active / edit a coupon ─────────────────────────── */
router.patch("/coupons/:id", requireAdmin, async (req, res) => {
  try {
    const update = {};
    if (req.body.isActive !== undefined) update.isActive = Boolean(req.body.isActive);
    if (req.body.discountAmount !== undefined) update.discountAmount = Number(req.body.discountAmount);
    if (req.body.maxUses !== undefined) update.maxUses = req.body.maxUses ? Number(req.body.maxUses) : null;
    if (req.body.region) update.region = req.body.region;
    if (Array.isArray(req.body.applicablePlans)) update.applicablePlans = req.body.applicablePlans;

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!coupon) return res.status(404).json({ error: "Coupon not found." });
    res.json({ ok: true, coupon });
  } catch (e) {
    console.error("[payment/coupons PATCH]", e?.message || e);
    res.status(500).json({ error: "Could not update coupon." });
  }
});

/* ── Admin: delete a coupon ───────────────────────────────────────── */
router.delete("/coupons/:id", requireAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ error: "Coupon not found." });
    res.json({ ok: true });
  } catch (e) {
    console.error("[payment/coupons DELETE]", e?.message || e);
    res.status(500).json({ error: "Could not delete coupon." });
  }
});

export default router;
