import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { rateLimit } from "express-rate-limit";
import User from "../models/User.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import { requireAuth } from "../middleware/auth.js";
import { signStudentToken } from "../utils/tokens.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 forgot password requests per windowMs
  message: { error: "Too many reset requests from this IP, please try again after an hour" },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 reset attempts per windowMs
  message: { error: "Too many reset attempts from this IP, please try again after an hour" },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();
const sign = signStudentToken;
// Email must be a valid address ending in "@gmail.com" or ".in"
const isEmail = (e) => {
  const s = String(e || "").toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return false;
  return s.endsWith("@gmail.com") || s.endsWith(".in");
};
const pub = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, coaching: u.coaching, homeState: u.homeState, studentClass: u.studentClass });

router.post("/signup", async (req, res) => {
  try {
    let { name, email, phone, coaching, homeState, password, studentClass } = req.body || {};
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
      studentClass:    studentClass ? String(studentClass).trim() : "",
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

// Swap a still-valid token for a fresh one. This is what lets the session TTL be
// short without logging active people out: the client renews in the background
// rather than the user being bounced to the login screen mid-task.
//
// It is NOT a way to extend a dead or revoked token — requireAuth has already
// rejected those, so a stolen token that's been revoked cannot renew itself.
router.post("/refresh", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("tokenVersion");
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json({ token: sign(user) });
  } catch (e) {
    console.error("[auth/refresh]", e.message);
    res.status(500).json({ error: "Could not refresh session" });
  }
});

// "Log out everywhere" — the only way to evict a session from a device the user
// no longer holds (lost phone, shared computer, a token they think was stolen).
// Bumping tokenVersion kills every token for the account, this one included.
router.post("/logout-all", requireAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id, { $inc: { tokenVersion: 1 } }, { new: true }
    ).select("tokenVersion");
    if (!user) return res.status(404).json({ error: "Not found" });
    // Hand back a working token so the current device stays signed in; every
    // other device is now holding a dead one.
    res.json({ ok: true, token: sign(user) });
  } catch (e) {
    console.error("[auth/logout-all]", e.message);
    res.status(500).json({ error: "Could not sign out other devices" });
  }
});

// Update the logged-in user's own profile. Only the fields present in the body
// are touched, so the client can send a partial patch. Email/phone keep their
// unique constraint, so we guard against collisions with another account.
router.patch("/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Not found" });

    let { name, email, phone, coaching, homeState, studentClass, neetRank } = req.body || {};

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
    if (studentClass !== undefined) user.studentClass = String(studentClass).trim();

    await user.save();
    res.json({ user: pub(user) });
  } catch (e) { console.error("[auth/profile]", e.message); res.status(500).json({ error: "Could not update profile. Please try again." }); }
});

router.post("/forgot", forgotLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email || "").toLowerCase().trim();
    if (!isEmail(email)) return res.json({ ok: true }); // generic response

    const user = await User.findOne({ email });
    if (!user) {
      // generic response: do not reveal if email exists
      return res.json({ ok: true });
    }

    // Invalidate any previously unused tokens for this user
    await PasswordResetToken.updateMany(
      { userId: user._id, used: false },
      { $set: { used: true } }
    );

    const token = crypto.randomInt(100000, 999999).toString();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      used: false,
    });

    const devLink = `${(process.env.CLIENT_ORIGIN || "").split(",")[0]}/?reset=${token}`;
    
    // Send email using Brevo
    await sendPasswordResetEmail(email, devLink, token);

    res.json({ ok: true, ...(process.env.OTP_DEV_MODE !== "false" ? { devToken: token, devLink } : {}) });
  } catch (e) {
    console.error("[auth/forgot]", e.message);
    res.status(500).json({ error: "Could not process the request. Please try again." });
  }
});

router.post("/reset", resetLimiter, async (req, res) => {
  try {
    const { token, password } = req.body || {};
    
    // Require minimum 8 characters for new password policy
    if (!token || String(password || "").length < 8) {
      return res.status(400).json({ error: "Invalid token or password must be at least 8 characters" });
    }
    
    const hash = crypto.createHash("sha256").update(String(token)).digest("hex");
    
    // Explicitly check expiresAt since TTL deletion runs periodically (approx 60s)
    const resetToken = await PasswordResetToken.findOne({
      tokenHash: hash,
      used: false,
      createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) } // valid for 15 mins
    });
    
    if (!resetToken) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    // Cost 12 to match signup
    user.passwordHash = await bcrypt.hash(String(password), 12);
    
    // Retire every token already issued for it, so the reset actually evicts them.
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    // Mark token as used
    resetToken.used = true;
    await resetToken.save();

    // Sign a fresh token and respond
    res.json({ ok: true, token: sign(user), user: pub(user) });
  } catch (e) {
    console.error("[auth/reset]", e.message);
    res.status(500).json({ error: "Could not reset password. Please try again." });
  }
});

export default router;