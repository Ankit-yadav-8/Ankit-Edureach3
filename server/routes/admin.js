import express from "express";
import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../utils/mailer.js";
import { verifyAdminKey, signAdminToken } from "../middleware/admin.js";

const router = express.Router();

// The admin one-time code is ALWAYS sent to this single inbox and nowhere else.
// Override with ADMIN_EMAIL only if the owner's address ever changes.
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "ankityadav08022008@gmail.com").toLowerCase().trim();

// Hide most of the address so the UI can say where the code went without
// exposing the full inbox on a public page.
function maskEmail(e) {
  const [user, domain] = String(e).split("@");
  if (!domain) return "the admin email";
  const head = user.slice(0, 2);
  return `${head}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

// Step 1 — verify the admin key, then email a 6-digit code to ADMIN_EMAIL.
// We only ever send the code if the key is correct.
router.post("/request-otp", async (req, res) => {
  try {
    if (!verifyAdminKey(req.body?.key)) return res.status(403).json({ error: "Invalid admin key" });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 8);
    await Otp.deleteMany({ email: ADMIN_EMAIL });
    await Otp.create({ email: ADMIN_EMAIL, codeHash, name: "admin", expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

    const r = await sendOtpEmail(ADMIN_EMAIL, code);
    if (!r.ok) {
      await Otp.deleteMany({ email: ADMIN_EMAIL });
      console.error(`[ADMIN OTP] send failed: ${r.error}`);
      return res.status(502).json({ error: "We couldn't send the code right now. Please try again in a moment." });
    }
    console.log(`[ADMIN OTP] sent to ${ADMIN_EMAIL} | dev=${r.dev}`);
    res.json({ sent: true, sentTo: maskEmail(ADMIN_EMAIL), ...(r.dev ? { devCode: code } : {}) });
  } catch (e) {
    console.error("[admin/request-otp]", e.message);
    res.status(500).json({ error: "Could not send the code. Please try again." });
  }
});

// Step 2 — verify key + OTP, then issue a short-lived admin session token.
router.post("/verify-otp", async (req, res) => {
  try {
    if (!verifyAdminKey(req.body?.key)) return res.status(403).json({ error: "Invalid admin key" });
    const code = String(req.body?.code || "");

    const otp = await Otp.findOne({ email: ADMIN_EMAIL }).sort({ _id: -1 });
    if (!otp) return res.status(400).json({ error: "Request a new code" });
    if (otp.expiresAt < new Date()) {
      await otp.deleteOne();
      return res.status(400).json({ error: "Code expired — request a new one" });
    }
    if (otp.attempts >= 5) {
      await otp.deleteOne();
      return res.status(429).json({ error: "Too many attempts — request a new code" });
    }
    const ok = await bcrypt.compare(code, otp.codeHash);
    if (!ok) {
      otp.attempts++;
      await otp.save();
      return res.status(400).json({ error: `Incorrect code (${5 - otp.attempts} attempts left)` });
    }

    await otp.deleteOne();
    res.json({ token: signAdminToken() });
  } catch (e) {
    console.error("[admin/verify-otp]", e.message);
    res.status(500).json({ error: "Could not verify the code. Please try again." });
  }
});

export default router;
