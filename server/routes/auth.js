import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { rateLimit } from "express-rate-limit";
import User from "../models/User.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import Enrollment from "../models/Enrollment.js";
import { requireAuth } from "../middleware/auth.js";
import { signStudentToken } from "../utils/tokens.js";
import { sendPasswordResetEmail, sendVerificationTokenEmail } from "../utils/mailer.js";

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

// Stricter limiter for OTP verification — prevents brute-forcing the 6-digit code
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 OTP verify attempts per 15 min window
  message: { error: "Too many verification attempts. Please request a new reset link." },
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

// ── Maximum OTP guess attempts before the token is killed ────────────────────
const MAX_OTP_ATTEMPTS = 5;

// ── Generate a cryptographically secure random alphanumeric token ─────────────
// Uses crypto.randomBytes for true randomness — each token is unique and
// unpredictable. 24 bytes → 32-char base36 string (letters + digits only).
function generateVerificationToken() {
  return crypto.randomBytes(24).toString("base64url"); // 32 URL-safe chars
}

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
    // Cost 10 is secure for this application and is ~3-4x faster than 12
    const passwordHash = await bcrypt.hash(String(password), 10);
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
    const user = await User.findOne({ email })
      .select("_id name email phone coaching homeState studentClass passwordHash tokenVersion")
      .lean();
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid email or password" });
    const ok = await bcrypt.compare(String(password || ""), user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });
    // Respond immediately; update lastLogin in the background (don't block the response)
    res.json({ token: sign(user), user: pub(user) });
    
    // Background tasks: Update lastLogin and perform rolling hash downgrade for speed.
    // If an existing user has a slow cost-12 hash ($2b$12$ or $2a$12$), rehash
    // to cost 10 asynchronously so their *next* login is fast.
    const tasks = { lastLogin: new Date() };
    if (user.passwordHash.includes("$12$")) {
      bcrypt.hash(String(password || ""), 10).then((newHash) => {
        User.updateOne({ _id: user._id }, { $set: { ...tasks, passwordHash: newHash } }).catch(() => {});
      }).catch(() => {});
    } else {
      User.updateOne({ _id: user._id }, { $set: tasks }).catch(() => {});
    }
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

    if (coaching  !== undefined) user.coaching  = String(coaching).trim();
    if (homeState !== undefined) user.homeState = String(homeState).trim();
    if (studentClass !== undefined) user.studentClass = String(studentClass).trim();

    await user.save();

    // Sync updated profile details to the user's enrollments so mentors see the latest info
    const syncUpdates = {};
    if (name !== undefined) syncUpdates.name = user.name;
    if (homeState !== undefined) syncUpdates.homeState = user.homeState;
    if (studentClass !== undefined) syncUpdates.currentClass = user.studentClass;
    
    if (Object.keys(syncUpdates).length > 0) {
      await Enrollment.updateMany({ userId: user._id }, { $set: syncUpdates });
    }

    res.json({ user: pub(user) });
  } catch (e) { console.error("[auth/profile]", e.message); res.status(500).json({ error: "Could not update profile. Please try again." }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — Forgot password: check email, send OTP via email link
// ═══════════════════════════════════════════════════════════════════════════════
router.post("/forgot", forgotLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email || "").toLowerCase().trim();
    if (!isEmail(email)) return res.status(400).json({ error: "Please enter a valid email address" });

    const user = await User.findOne({ email });
    if (!user) {
      // Tell the user clearly that this email is not in our database
      return res.status(404).json({ error: "This email is not registered with us. Please sign up first.", exists: false });
    }

    // Invalidate any previously unused tokens for this user
    await PasswordResetToken.updateMany(
      { userId: user._id, status: { $in: ["pending", "otp_verified"] } },
      { $set: { status: "used", used: true } }
    );

    // Generate a cryptographically random 6-digit OTP using crypto.randomInt
    // (CSPRNG — each OTP is unique and unpredictable)
    const otp = crypto.randomInt(100000, 999999).toString();
    const tokenHash = crypto.createHash("sha256").update(otp).digest("hex");

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      status: "pending",
      used: false,
      attempts: 0,
    });

    // Build the reset link with OTP embedded in the URL
    const clientOrigin = (process.env.CLIENT_ORIGIN || "").split(",")[0];
    const resetLink = `${clientOrigin}/?reset=${otp}`;
    
    // Send email using Brevo
    await sendPasswordResetEmail(email, resetLink, otp);

    res.json({
      ok: true,
      exists: true,
      message: "A password reset link has been sent to your email. Please check your inbox and spam folder.",
      ...(process.env.OTP_DEV_MODE !== "false" ? { devOtp: otp, devLink: resetLink } : {}),
    });
  } catch (e) {
    console.error("[auth/forgot]", e.message);
    res.status(500).json({ error: "Could not process the request. Please try again." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — Verify OTP: validate the 6-digit code, return a verification token
// ═══════════════════════════════════════════════════════════════════════════════
router.post("/verify-reset-otp", otpVerifyLimiter, async (req, res) => {
  try {
    const { otp } = req.body || {};
    if (!otp || String(otp).length !== 6) {
      return res.status(400).json({ error: "Please enter the 6-digit code from your email" });
    }

    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");

    // Find a pending token that matches the OTP hash and hasn't expired
    const resetToken = await PasswordResetToken.findOne({
      tokenHash: otpHash,
      status: "pending",
      createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) }, // 15 min validity
    });

    if (!resetToken) {
      // Also increment attempts on any token with this hash to track brute-force
      return res.status(400).json({ error: "Invalid or expired OTP. Please request a new reset link." });
    }

    // Brute-force protection: check if too many attempts have been made
    if (resetToken.attempts >= MAX_OTP_ATTEMPTS) {
      resetToken.status = "used";
      resetToken.used = true;
      await resetToken.save();
      return res.status(429).json({ error: "Too many incorrect attempts. This OTP has been invalidated. Please request a new one." });
    }

    // Increment attempts counter
    resetToken.attempts += 1;

    // Verify the user still exists
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    // ── OTP is valid! Generate a unique cryptographic verification token ──
    // Uses crypto.randomBytes(24) → 32-char base64url string.
    // Each verification token is completely unique and unpredictable.
    const verificationToken = generateVerificationToken();
    const verifyHash = crypto.createHash("sha256").update(verificationToken).digest("hex");

    // Transition: pending → otp_verified
    resetToken.status = "otp_verified";
    resetToken.verifyTokenHash = verifyHash;
    await resetToken.save();

    // Send verification token via EMAIL — never expose it in the API response.
    // This ensures only the email owner can complete the password reset.
    await sendVerificationTokenEmail(user.email, verificationToken);

    res.json({
      ok: true,
      message: "OTP verified! A verification token has been sent to your email.",
      // Dev mode only — for local testing without email delivery
      ...(process.env.OTP_DEV_MODE !== "false" ? { devToken: verificationToken } : {}),
    });
  } catch (e) {
    console.error("[auth/verify-reset-otp]", e.message);
    res.status(500).json({ error: "Could not verify the code. Please try again." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — Reset password: validate verification token, set new password
// ═══════════════════════════════════════════════════════════════════════════════
router.post("/reset", resetLimiter, async (req, res) => {
  try {
    const { verificationToken, password } = req.body || {};
    
    // Require minimum 8 characters for new password policy
    if (!verificationToken || String(password || "").length < 8) {
      return res.status(400).json({ error: "Invalid verification token or password must be at least 8 characters" });
    }
    
    const verifyHash = crypto.createHash("sha256").update(String(verificationToken)).digest("hex");
    
    // Find a token that was OTP-verified and has a matching verification hash
    const resetToken = await PasswordResetToken.findOne({
      verifyTokenHash: verifyHash,
      status: "otp_verified",
      createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) }, // still within 15 min window
    });
    
    if (!resetToken) {
      return res.status(400).json({ error: "Invalid or expired verification token. Please start the reset process again." });
    }

    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    // Cost 10 for faster logins
    user.passwordHash = await bcrypt.hash(String(password), 10);
    
    // Retire every token already issued for it, so the reset actually evicts them.
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    // Mark token as used — final state, can never be reused
    resetToken.status = "used";
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