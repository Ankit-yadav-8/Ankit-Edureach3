import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const pub = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, coaching: u.coaching });

router.post("/signup", async (req, res) => {
  try {
    let { name, email, phone, coaching, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password are required" });
    email = String(email).toLowerCase().trim();
    if (!isEmail(email)) return res.status(400).json({ error: "Please enter a valid email" });
    if (String(password).length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
    if (await User.findOne({ email })) return res.status(409).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({ name: String(name).trim(), email, phone: phone || undefined, coaching: String(coaching || "").trim(), passwordHash, lastLogin: new Date() });
    res.status(201).json({ token: sign(user), user: pub(user) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body || {};
    email = String(email || "").toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid email or password" });
    const ok = await bcrypt.compare(String(password || ""), user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });
    user.lastLogin = new Date(); await user.save();
    res.json({ token: sign(user), user: pub(user) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash -resetTokenHash");
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({ user });
});

router.post("/forgot", async (req, res) => {
  try {
    const email = String(req.body?.email || "").toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: true });
    const token = crypto.randomBytes(24).toString("hex");
    user.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.resetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    const devLink = `${(process.env.CLIENT_ORIGIN || "").split(",")[0]}/?reset=${token}`;
    console.log(`\n[DEV RESET] for ${email}: token=${token}\n`);
    res.json({ ok: true, ...(process.env.OTP_DEV_MODE !== "false" ? { devToken: token, devLink } : {}) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/reset", async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || String(password || "").length < 6) return res.status(400).json({ error: "Invalid token or password too short" });
    const hash = crypto.createHash("sha256").update(String(token)).digest("hex");
    const user = await User.findOne({ resetTokenHash: hash, resetExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ error: "Reset link is invalid or expired" });
    user.passwordHash = await bcrypt.hash(String(password), 10);
    user.resetTokenHash = undefined; user.resetExpires = undefined;
    await user.save();
    res.json({ ok: true, token: sign(user), user: pub(user) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;