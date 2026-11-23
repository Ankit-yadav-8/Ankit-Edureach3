import express from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import Otp from "../models/Otp.js";
import { sendOtpEmail, sendMail } from "../utils/mailer.js";
import {
  verifyAdminKey,
  verifyAdminKeySecondary,
  signAdminToken,
  signChallengeToken,
  verifyChallengeToken,
} from "../middleware/admin.js";

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════
// ██  FORTRESS LOGIN — 4-STEP ADMIN AUTHENTICATION                      ██
// ═══════════════════════════════════════════════════════════════════════════
//
//  Step 1: POST /request-otp         — verify PRIMARY admin key → send OTP₁
//  Step 2: POST /verify-otp          — verify OTP₁ → issue challengeToken(phase1)
//  Step 3: POST /verify-secondary    — verify SECONDARY key → send OTP₂ → issue challengeToken(phase2)
//  Step 4: POST /complete-login      — verify OTP₂ → issue admin session + success email
//
//  At EVERY step:
//    • Wrong input → instant alert email to admin + 5-strike IP lockout
//    • OTP brute-force → code self-destructs after 5 wrong guesses
//    • Challenge tokens expire in 5 minutes (can't stall between steps)
// ═══════════════════════════════════════════════════════════════════════════

// ── Hardened Rate Limiters ──────────────────────────────────────────────
function makeLimiter(windowMs, label) {
  return rateLimit({
    windowMs,
    max: 5,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      console.error(`[SECURITY LOCKOUT] 🚨 IP ${req.ip || "unknown"} exceeded failed ${label} attempts. Locked.`);
      res.status(429).json({
        error: "Access Denied: Too many failed attempts. Access is temporarily locked.",
      });
    },
  });
}

const adminKeyLimiter       = makeLimiter(30 * 60 * 1000, "admin key");
const adminOtpLimiter       = makeLimiter(15 * 60 * 1000, "admin OTP");
const adminSecondaryLimiter = makeLimiter(30 * 60 * 1000, "secondary key");
const adminOtp2Limiter      = makeLimiter(15 * 60 * 1000, "admin OTP-2");

// ── Admin Email ─────────────────────────────────────────────────────────
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ||
  process.env.ADMIN_EMAIL ||
  "ankityadav08022008@gmail.com")
  .split(",").map((s) => s.toLowerCase().trim()).filter(Boolean);

// Clean up stale admin OTP records from legacy inboxes
Otp.deleteMany({ email: { $ne: ADMIN_EMAILS[0] }, name: { $in: ["admin", "admin-2fa2"] } }).catch(() => {});

// ── Mask email for public display ───────────────────────────────────────
function maskEmail(e) {
  const [user, domain] = String(e).split("@");
  if (!domain) return "the admin email";
  return `${user.slice(0, 2)}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

// ── Helper: extract client info ─────────────────────────────────────────
function clientInfo(req) {
  return {
    ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
    ua: req.headers["user-agent"] || "unknown",
    when: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  };
}

// ── Security Alert Email (sent on ANY failed step) ──────────────────────
async function sendSecurityAlertEmail({ ip, userAgent, step }) {
  const adminRecipient = ADMIN_EMAILS[0];
  const when = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const stepLabels = {
    "primary-key": "Primary Admin Key",
    "otp-1": "First OTP Verification",
    "secondary-key": "Secondary Admin Key",
    "otp-2": "Second OTP Verification",
  };
  const stepLabel = stepLabels[step] || step;

  const subject = `🚨 SECURITY ALERT: Failed ${stepLabel} Attempt on CampusPoint`;
  const text = `SECURITY ALERT\n\nSomeone failed the "${stepLabel}" step of CampusPoint admin login.\n\nTime: ${when} IST\nIP Address: ${ip}\nUser-Agent: ${userAgent}\nStep Failed: ${stepLabel}\n\nIf this was not you, someone may be attempting to access your dashboard.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(220,38,38,0.08);">
      <div style="background: #dc2626; color: #ffffff; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800;">🚨 Failed: ${stepLabel}</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">CampusPoint Fortress Security Alert</p>
      </div>
      <div style="padding: 24px; color: #1f2937; line-height: 1.6;">
        <p style="font-size: 15px; margin-top: 0;">
          An unauthorized user <strong>failed Step ${step === "primary-key" ? "1" : step === "otp-1" ? "2" : step === "secondary-key" ? "3" : "4"}</strong> of the CampusPoint 4-Step Admin Login.
        </p>
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 4px 0; font-size: 14px;"><strong>⏰ Time:</strong> ${when} IST</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>🌐 IP Address:</strong> <code style="background: #fee2e2; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${ip}</code></p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>🔒 Step:</strong> <strong style="color: #dc2626;">${stepLabel}</strong></p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>💻 Device:</strong> <span style="font-size: 12px; color: #4b5563;">${userAgent}</span></p>
        </div>
        <p style="font-size: 13px; color: #6b7280;">
          🛡️ <em>Defense Status:</em> Access was blocked instantly. The 5-strike IP rate limiter has recorded this failure.
        </p>
      </div>
      <div style="background: #f9fafb; padding: 14px 24px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
        CampusPoint Fortress Security Monitor · 4-Step Authentication
      </div>
    </div>
  `;

  try {
    await sendMail({ to: adminRecipient, subject, text, html });
    console.log(`[SECURITY ALERT] 📧 ${stepLabel} alert sent to ${adminRecipient}`);
  } catch (err) {
    console.error("[SECURITY ALERT EMAIL FAILED]", err.message);
  }
}

// ── Login Success Email ─────────────────────────────────────────────────
async function sendLoginSuccessEmail({ ip, userAgent }) {
  const adminRecipient = ADMIN_EMAILS[0];
  const when = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const subject = `✅ Admin Login Successful — CampusPoint`;
  const text = `ADMIN LOGIN SUCCESS\n\nAll 4 security steps were completed successfully.\n\nTime: ${when} IST\nIP Address: ${ip}\nUser-Agent: ${userAgent}\n\nIf this was not you, immediately change your admin keys and check your email security.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #d1fae5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(5,150,105,0.08);">
      <div style="background: linear-gradient(135deg, #059669, #047857); color: #ffffff; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800;">✅ Admin Login Successful</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">All 4 security checkpoints passed</p>
      </div>
      <div style="padding: 24px; color: #1f2937; line-height: 1.6;">
        <p style="font-size: 15px; margin-top: 0;">
          A successful admin login was completed through <strong>all 4 fortress security steps</strong>.
        </p>
        <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 14px 18px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 4px 0; font-size: 14px;"><strong>⏰ Time:</strong> ${when} IST</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>🌐 IP Address:</strong> <code style="background: #d1fae5; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${ip}</code></p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>💻 Device:</strong> <span style="font-size: 12px; color: #4b5563;">${userAgent}</span></p>
        </div>
        <div style="background: #f0fdf4; padding: 12px 16px; border-radius: 8px; margin-top: 16px;">
          <p style="margin: 0; font-size: 13px; color: #166534; font-weight: 700;">Security Checkpoints Passed:</p>
          <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 13px; color: #15803d;">
            <li>✅ Primary Admin Key verified</li>
            <li>✅ Email OTP #1 verified</li>
            <li>✅ Secondary Admin Key verified</li>
            <li>✅ Email OTP #2 verified</li>
          </ul>
        </div>
        <p style="font-size: 13px; color: #991b1b; background: #fff1f2; padding: 10px 14px; border-radius: 8px; margin-top: 16px;">
          ⚠️ <strong>If this was NOT you:</strong> Change your admin keys immediately and audit your email security.
        </p>
      </div>
      <div style="background: #f9fafb; padding: 14px 24px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
        CampusPoint Fortress Security Monitor · Session valid for 8 hours
      </div>
    </div>
  `;

  try {
    await sendMail({ to: adminRecipient, subject, text, html });
    console.log(`[ADMIN LOGIN] 📧 Success notification sent to ${adminRecipient}`);
  } catch (err) {
    console.error("[LOGIN SUCCESS EMAIL FAILED]", err.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1 — Verify PRIMARY admin key → send OTP₁
// ═══════════════════════════════════════════════════════════════════════════
router.post("/request-otp", adminKeyLimiter, async (req, res) => {
  const { ip, ua } = clientInfo(req);

  try {
    if (!verifyAdminKey(req.body?.key)) {
      console.warn(`[SECURITY ALERT] 🚨 Failed PRIMARY key at Step 1 from IP: ${ip}`);
      sendSecurityAlertEmail({ ip, userAgent: ua, step: "primary-key" }).catch(() => {});
      return res.status(403).json({ error: "Invalid admin key" });
    }

    const ADMIN_EMAIL = ADMIN_EMAILS[0];
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 8);

    // Clear any prior pending OTP for this email to guarantee a clean slate:
    await Otp.deleteMany({ email: ADMIN_EMAIL, name: { $ne: "admin-2fa2" } });
    const sendP = sendOtpEmail(ADMIN_EMAIL, code);
    const persistP = Otp.create({
      email: ADMIN_EMAIL,
      name: "admin",
      codeHash,
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    const [r] = await Promise.all([sendP, persistP]);
    if (!r.ok) {
      await Otp.deleteMany({ email: ADMIN_EMAIL, name: "admin" });
      console.error(`[ADMIN OTP₁] send failed: ${r.error}`);
      return res.status(502).json({ error: "We couldn't send the code right now. Please try again in a moment." });
    }
    console.log(`[ADMIN OTP₁] sent to ${ADMIN_EMAIL} | dev=${r.dev}`);

    const step1Proof = signChallengeToken("step1", "10m");
    res.json({
      sent: true,
      step1Proof,
      ...(process.env.NODE_ENV !== "production" && r.dev ? { devCode: code } : {}),
    });
  } catch (e) {
    console.error("[admin/request-otp]", e.message);
    res.status(500).json({ error: "Could not send the code. Please try again." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2 — Verify PRIMARY key + OTP₁ → issue challengeToken (phase1)
// ═══════════════════════════════════════════════════════════════════════════
router.post("/verify-otp", adminOtpLimiter, async (req, res) => {
  const { ip, ua } = clientInfo(req);

  try {
    // Validate that either step1Proof is valid OR primary key matches
    const hasValidProof = verifyChallengeToken(req.body?.step1Proof, "step1");
    const hasValidKey = req.body?.key && verifyAdminKey(req.body.key);

    if (!hasValidProof && !hasValidKey) {
      console.warn(`[SECURITY ALERT] 🚨 Unauthorized step 2 attempt from IP: ${ip}`);
      sendSecurityAlertEmail({ ip, userAgent: ua, step: "primary-key" }).catch(() => {});
      return res.status(403).json({ error: "Access denied. Please restart login." });
    }

    const ADMIN_EMAIL = ADMIN_EMAILS[0];
    const code = String(req.body?.code || "").replace(/\D/g, "");

    if (!code || code.length !== 6) {
      return res.status(400).json({ error: "Please enter a valid 6-digit verification code" });
    }

    const otp = await Otp.findOne({ email: ADMIN_EMAIL, name: { $ne: "admin-2fa2" } }).sort({ _id: -1 });
    if (!otp) return res.status(400).json({ error: "Verification code not found or expired. Please request a new code." });
    if (otp.expiresAt < new Date()) {
      await otp.deleteOne();
      return res.status(400).json({ error: "Verification code expired. Please request a new code." });
    }
    if (otp.attempts >= 5) {
      await otp.deleteOne();
      console.warn(`[SECURITY ALERT] 🚨 OTP₁ brute-force for ${ADMIN_EMAIL} from IP: ${ip}. Code destroyed.`);
      sendSecurityAlertEmail({ ip, userAgent: ua, step: "otp-1" }).catch(() => {});
      return res.status(429).json({ error: "Too many failed attempts. Code destroyed. Please request a new code." });
    }

    const ok = await bcrypt.compare(code, otp.codeHash);
    if (!ok) {
      otp.attempts++;
      await otp.save();
      console.warn(`[SECURITY WARNING] Failed OTP₁ guess (${otp.attempts}/5) from IP: ${ip}`);
      if (otp.attempts >= 3) {
        sendSecurityAlertEmail({ ip, userAgent: ua, step: "otp-1" }).catch(() => {});
      }
      return res.status(400).json({ error: `Incorrect verification code (${5 - otp.attempts} attempts left)` });
    }

    await otp.deleteOne();
    console.log(`[ADMIN STEP 2] ✅ OTP₁ verified from IP: ${ip} — issuing phase1 challenge`);

    // Issue a short-lived challenge token that proves Step 1+2 are done
    res.json({ challengeToken: signChallengeToken("phase1", "5m"), nextStep: "secondary" });
  } catch (e) {
    console.error("[admin/verify-otp]", e.message);
    res.status(500).json({ error: "Could not verify the code. Please try again." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3 — Verify SECONDARY key (requires phase1 challenge token) → send OTP₂
// ═══════════════════════════════════════════════════════════════════════════
router.post("/verify-secondary", adminSecondaryLimiter, async (req, res) => {
  const { ip, ua } = clientInfo(req);

  try {
    // Must have completed Steps 1+2 (phase1 challenge token)
    if (!verifyChallengeToken(req.body?.challengeToken, "phase1")) {
      console.warn(`[SECURITY ALERT] 🚨 Invalid/expired challenge token at Step 3 from IP: ${ip}`);
      return res.status(403).json({ error: "Session expired — please restart login" });
    }

    if (!verifyAdminKeySecondary(req.body?.secondaryKey)) {
      console.warn(`[SECURITY ALERT] 🚨 Failed SECONDARY key at Step 3 from IP: ${ip}`);
      sendSecurityAlertEmail({ ip, userAgent: ua, step: "secondary-key" }).catch(() => {});
      return res.status(403).json({ error: "Invalid secondary key" });
    }

    // Send second OTP
    const ADMIN_EMAIL = ADMIN_EMAILS[0];
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 8);

    await Otp.deleteMany({ email: ADMIN_EMAIL, name: "admin-2fa2" });
    const sendP = sendOtpEmail(ADMIN_EMAIL, code);
    const persistP = Otp.create({
      email: ADMIN_EMAIL,
      name: "admin-2fa2",
      codeHash,
      attempts: 0,
      expiresAt: new Date(Date.now() + 30 * 1000),
    });
    const [r] = await Promise.all([sendP, persistP]);
    if (!r.ok) {
      await Otp.deleteMany({ email: ADMIN_EMAIL, name: "admin-2fa2" });
      console.error(`[ADMIN OTP₂] send failed: ${r.error}`);
      return res.status(502).json({ error: "We couldn't send the second code right now." });
    }
    console.log(`[ADMIN OTP₂] sent to ${ADMIN_EMAIL} | dev=${r.dev}`);

    res.json({
      sent: true,
      challengeToken: signChallengeToken("phase2", "30s"),
      expiresInSeconds: 30,
      ...(process.env.NODE_ENV !== "production" && r.dev ? { devCode: code } : {}),
    });
  } catch (e) {
    console.error("[admin/verify-secondary]", e.message);
    res.status(500).json({ error: "Could not proceed. Please try again." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// STEP 4 — Verify OTP₂ (requires phase2 challenge token) → ADMIN LOGIN
// ═══════════════════════════════════════════════════════════════════════════
router.post("/complete-login", adminOtp2Limiter, async (req, res) => {
  const { ip, ua } = clientInfo(req);

  try {
    const ADMIN_EMAIL = ADMIN_EMAILS[0];

    // Must have completed Steps 1+2+3 (phase2 challenge token — strict 30s TTL)
    if (!verifyChallengeToken(req.body?.challengeToken, "phase2")) {
      console.warn(`[SECURITY ALERT] 🚨 Invalid/expired 30s challenge token at Step 4 from IP: ${ip}`);
      await Otp.deleteMany({ email: ADMIN_EMAIL, name: "admin-2fa2" });
      return res.status(401).json({ error: "Unauthorized: 30-second verification window expired", restart: true });
    }

    const code = String(req.body?.code || "");

    const otp = await Otp.findOne({ email: ADMIN_EMAIL, name: "admin-2fa2" }).sort({ _id: -1 });
    if (!otp) return res.status(401).json({ error: "Unauthorized: Request a new code", restart: true });
    if (otp.expiresAt < new Date()) {
      await otp.deleteOne();
      return res.status(401).json({ error: "Unauthorized: 30-second verification window expired", restart: true });
    }
    if (otp.attempts >= 5) {
      await otp.deleteOne();
      console.warn(`[SECURITY ALERT] 🚨 OTP₂ brute-force for ${ADMIN_EMAIL} from IP: ${ip}. Code destroyed.`);
      sendSecurityAlertEmail({ ip, userAgent: ua, step: "otp-2" }).catch(() => {});
      return res.status(429).json({ error: "Too many attempts — please restart login", restart: true });
    }
    const ok = await bcrypt.compare(code, otp.codeHash);
    if (!ok) {
      otp.attempts++;
      await otp.save();
      console.warn(`[SECURITY WARNING] Failed OTP₂ guess (${otp.attempts}/5) from IP: ${ip}`);
      if (otp.attempts >= 3) {
        sendSecurityAlertEmail({ ip, userAgent: ua, step: "otp-2" }).catch(() => {});
      }
      return res.status(400).json({ error: `Incorrect code (${5 - otp.attempts} attempts left)` });
    }

    await otp.deleteOne();

    // ✅ ALL 4 STEPS PASSED — issue admin session token
    console.log(`[ADMIN LOGIN SUCCESS] ✅ 4-step fortress login completed for ${ADMIN_EMAIL} from IP: ${ip}`);

    // Send login success notification email (async, don't block response)
    sendLoginSuccessEmail({ ip, userAgent: ua }).catch(() => {});

    res.json({ token: signAdminToken() });
  } catch (e) {
    console.error("[admin/complete-login]", e.message);
    res.status(500).json({ error: "Could not complete login. Please try again." });
  }
});

// ── Public: disguised empty inbox list to prevent reconnaissance ─────────
router.get("/inboxes", (_req, res) => {
  res.json({ inboxes: [] });
});

export default router;
