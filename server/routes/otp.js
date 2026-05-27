import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../utils/mailer.js";

const router = express.Router();
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
const cleanEmail = (e) => String(e || "").trim().toLowerCase();
const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// send OTP to an email
router.post("/send", async (req, res) => {
  try {
    const email = cleanEmail(req.body?.email);
    const name = String(req.body?.name || "").trim();
    if (!isEmail(email)) return res.status(400).json({ error: "Enter a valid email address" });
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 8);
    await Otp.deleteMany({ email });
    await Otp.create({ email, codeHash, name, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
    const r = await sendOtpEmail(email, code);
    res.json({ sent: true, ...(r.dev ? { devCode: code } : {}) }); // devCode only in dev mode
  } catch { res.status(500).json({ error: "Server error" }); }
});

// verify OTP -> log in / create the user
router.post("/verify", async (req, res) => {
  try {
    const email = cleanEmail(req.body?.email);
    const code = String(req.body?.code || "");
    const otp = await Otp.findOne({ email }).sort({ _id: -1 });
    if (!otp) return res.status(400).json({ error: "Request a new code" });
    if (otp.expiresAt < new Date()) { await otp.deleteOne(); return res.status(400).json({ error: "Code expired" }); }
    if (otp.attempts >= 5) { await otp.deleteOne(); return res.status(429).json({ error: "Too many attempts" }); }
    const ok = await bcrypt.compare(code, otp.codeHash);
    if (!ok) { otp.attempts++; await otp.save(); return res.status(400).json({ error: "Incorrect code" }); }

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, name: otp.name, lastLogin: new Date() });
    else { user.lastLogin = new Date(); if (otp.name && !user.name) user.name = otp.name; await user.save(); }
    await otp.deleteOne();
    res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch { res.status(500).json({ error: "Server error" }); }
});

export default router;