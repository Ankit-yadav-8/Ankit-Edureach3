import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../utils/mailer.js";

const router = express.Router();
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
const cleanEmail = (e) => String(e || "").trim().toLowerCase();
// Email must be a valid address ending in "@gmail.com" or ".in"
const isEmail = (e) => {
  const s = String(e || "").toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return false;
  return s.endsWith("@gmail.com") || s.endsWith(".in");
};

// send OTP to an email
router.post("/send", async (req, res) => {
  try {
    const email = cleanEmail(req.body?.email);
    const name = String(req.body?.name || "").trim();
    if (!isEmail(email)) return res.status(400).json({ error: "Use a @gmail.com or .in email address" });
    const code = String(Math.floor(100000 + Math.random() * 900000));
    // OTP login is only for already-registered emails. The registration check
    // and the (slow-ish) bcrypt hash don't depend on each other — run together.
    const [exists, codeHash] = await Promise.all([
      User.findOne({ email }).select("_id").lean(),
      bcrypt.hash(code, 8),
    ]);
    if (!exists) return res.status(404).json({ error: "This email isn't registered yet. Please sign up first, then log in with OTP.", notRegistered: true });

    // Fire the email and store the code at the same time, in a single DB
    // round-trip (upsert resets attempts), so delivery isn't held up behind the
    // writes. Stale OTPs auto-expire via the TTL index.
    const sendP = sendOtpEmail(email, code);
    const persistP = Otp.findOneAndUpdate(
      { email },
      { codeHash, name, attempts: 0, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const [r] = await Promise.all([sendP, persistP]);
    // If a real send was attempted and failed, tell the user — don't pretend it
    // worked (and never leak the code in the response outside dev mode).
    if (!r.ok) {
      await Otp.deleteMany({ email });
      console.error(`[OTP] Send failed for ${email}: ${r.error}`);
      return res.status(502).json({ error: "We couldn't send the code right now. Please try again in a moment." });
    }
    console.log(`[OTP] Sent to ${email} | dev=${r.dev}`);
    res.json({ sent: true, ...(r.dev ? { devCode: code } : {}) });
  } catch (e) {
    console.error("[OTP SEND ERROR]", e.message);
    res.status(500).json({ error: "Could not send the code. Please try again." });
  }
});

// verify OTP -> log in / create the user
router.post("/verify", async (req, res) => {
  try {
    const email = cleanEmail(req.body?.email);
    const code = String(req.body?.code || "");
    const otp = await Otp.findOne({ email }).sort({ _id: -1 });
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
    const user = await User.findOne({ email });
    if (!user) {
      await otp.deleteOne();
      return res.status(404).json({ error: "This email isn't registered yet. Please sign up first, then log in with OTP.", notRegistered: true });
    }
    user.lastLogin = new Date();
    if (otp.name && !user.name) user.name = otp.name;
    await user.save();
    await otp.deleteOne();
    res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (e) {
    console.error("[OTP VERIFY ERROR]", e.message);
    res.status(500).json({ error: "Could not verify the code. Please try again." });
  }
});

export default router;