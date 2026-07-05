import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// Email must be a valid address ending in "@gmail.com" or ".in"
const isEmail = (e) => {
  const s = String(e || "").toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return false;
  return s.endsWith("@gmail.com") || s.endsWith(".in");
};
const pub = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, coaching: u.coaching, homeState: u.homeState, jeeMainsRank: u.jeeMainsRank, jeeAdvancedRank: u.jeeAdvancedRank, neetRank: u.neetRank });

router.post("/signup", async (req, res) => {
  try {
    let { name, email, phone, coaching, homeState, password, jeeMainsRank, jeeAdvancedRank, neetRank } = req.body || {};
    if (!name || !email || !password || !phone) return res.status(400).json({ error: "Name, email, phone and password are required" });
    if (!String(coaching || "").trim()) return res.status(400).json({ error: "Coaching is required" });
    if (!String(homeState || "").trim()) return res.status(400).json({ error: "Home state is required" });
    email = String(email).toLowerCase().trim();
    if (!isEmail(email)) return res.status(400).json({ error: "Use a @gmail.com or .in email address" });
    if (String(password).length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
    if (!/^\d{10}$/.test(String(phone))) return res.status(400).json({ error: "Enter a valid 10-digit phone number" });
    // Single round-trip duplicate check (email + phone) instead of two sequential queries
    const dup = await User.findOne({ $or: [{ email }, { phone: String(phone) }] }).select("email phone");
    if (dup) return res.status(409).json({ error: dup.email === email ? "Email already registered" : "Phone number already registered" });
    const passwordHash = await bcrypt.hash(String(password), 12);
    const user = await User.create({
      name: String(name).trim(), email, phone: String(phone),
      coaching: String(coaching || "").trim(),
      homeState: String(homeState || "").trim(),
      jeeMainsRank:    jeeMainsRank    ? Number(jeeMainsRank)    : undefined,
      jeeAdvancedRank: jeeAdvancedRank ? Number(jeeAdvancedRank) : undefined,
      neetRank:        neetRank        ? Number(neetRank)        : undefined,
      passwordHash, lastLogin: new Date(),
    });
    res.status(201).json({ token: sign(user), user: pub(user) });
  } catch (e) { console.error("[auth/signup]", e.message); res.status(500).json({ error: "Could not create account. Please try again." }); }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body || {};
    email = String(email || "").toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid email or password" });
    const ok = await bcrypt.compare(String(password || ""), user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });
    // Respond immediately; update lastLogin in the background (don't block the response)
    res.json({ token: sign(user), user: pub(user) });
    User.updateOne({ _id: user._id }, { lastLogin: new Date() }).catch(() => {});
  } catch (e) { console.error("[auth/login]", e.message); res.status(500).json({ error: "Could not log in. Please try again." }); }
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash -resetTokenHash");
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({ user });
});

// Update the logged-in user's own profile. Only the fields present in the body
// are touched, so the client can send a partial patch. Email/phone keep their
// unique constraint, so we guard against collisions with another account.
router.patch("/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Not found" });

    let { name, email, phone, coaching, homeState, jeeMainsRank, jeeAdvancedRank, neetRank } = req.body || {};

    if (name !== undefined) {
      if (!String(name).trim()) return res.status(400).json({ error: "Name cannot be empty" });
      user.name = String(name).trim();
    }

    if (email !== undefined) {
      email = String(email).toLowerCase().trim();
      if (!isEmail(email)) return res.status(400).json({ error: "Use a @gmail.com or .in email address" });
      if (email !== user.email) {
        const dup = await User.findOne({ email, _id: { $ne: user._id } }).select("_id");
        if (dup) return res.status(409).json({ error: "Email already registered" });
        user.email = email;
      }
    }

    if (phone !== undefined) {
      phone = String(phone).trim();
      if (!/^\d{10}$/.test(phone)) return res.status(400).json({ error: "Enter a valid 10-digit phone number" });
      if (phone !== user.phone) {
        const dup = await User.findOne({ phone, _id: { $ne: user._id } }).select("_id");
        if (dup) return res.status(409).json({ error: "Phone number already registered" });
        user.phone = phone;
      }
    }

    if (coaching  !== undefined) user.coaching  = String(coaching).trim();
    if (homeState !== undefined) user.homeState = String(homeState).trim();
    if (jeeMainsRank    !== undefined) user.jeeMainsRank    = jeeMainsRank    === "" || jeeMainsRank    == null ? null : Number(jeeMainsRank);
    if (jeeAdvancedRank !== undefined) user.jeeAdvancedRank = jeeAdvancedRank === "" || jeeAdvancedRank == null ? null : Number(jeeAdvancedRank);
    if (neetRank        !== undefined) user.neetRank        = neetRank        === "" || neetRank        == null ? null : Number(neetRank);

    await user.save();
    res.json({ user: pub(user) });
  } catch (e) { console.error("[auth/profile]", e.message); res.status(500).json({ error: "Could not update profile. Please try again." }); }
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
  } catch (e) { console.error("[auth/forgot]", e.message); res.status(500).json({ error: "Could not process the request. Please try again." }); }
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
  } catch (e) { console.error("[auth/reset]", e.message); res.status(500).json({ error: "Could not reset password. Please try again." }); }
});

export default router;