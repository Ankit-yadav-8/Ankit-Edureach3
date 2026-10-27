import express from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import Otp from "../models/Otp.js";
import { sendOtpEmail, sendMail } from "../utils/mailer.js";
import { verifyAdminKey, signAdminToken } from "../middleware/admin.js";

const router = express.Router();

// ── Hardened Rate Limiters for Admin Authentication ────────────────────────
// Strict penalty: 5 failed attempts locks the IP out for 30 minutes.
// Legitimate attempts with the correct key are NOT penalized (skipSuccessfulRequests: true).
const adminKeyLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30-minute lockout window
  max: 5,                   // Maximum 5 failed attempts per IP
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.error(`[SECURITY LOCKOUT] 🚨 IP ${req.ip || "unknown"} exceeded 5 failed admin key attempts. Access locked for 30m.`);
    res.status(429).json({
      error: "Access Denied: Too many failed admin key attempts. For security, your IP address has been locked out for 30 minutes.",
    });
  },
});

// Maximum 5 failed OTP attempts per IP every 15 minutes
const adminOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute lockout window
  max: 5,                   // Maximum 5 failed attempts per IP
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.error(`[SECURITY LOCKOUT] 🚨 IP ${req.ip || "unknown"} exceeded 5 failed admin OTP attempts.`);
    res.status(429).json({
      error: "Too many incorrect OTP attempts. Admin verification is temporarily locked for 15 minutes.",
    });
  },
});

// Single verified admin email destination for 2FA OTP codes
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ||
  process.env.ADMIN_EMAIL ||
  "ankityadav08022008@gmail.com")
  .split(",").map((s) => s.toLowerCase().trim()).filter(Boolean);

// Clean up any stale admin OTP records from legacy inboxes
Otp.deleteMany({ email: { $ne: ADMIN_EMAILS[0] }, name: "admin" }).catch(() => {});

// Sends an immediate high-priority security alert email to the admin when an unauthorized key is attempted
async function sendFailedKeyAlertEmail({ ip, userAgent }) {
  const adminRecipient = ADMIN_EMAILS[0];
  const when = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  
  const subject = `🚨 SECURITY ALERT: Unauthorized Admin Key Attempt on CampusPoint`;
  const text = `SECURITY ALERT\n\nSomeone entered an incorrect Admin Key on CampusPoint.\n\nTime: ${when} IST\nIP Address: ${ip}\nUser-Agent: ${userAgent}\n\nIf this was not you, someone may be attempting to access your dashboard. The client's IP is being rate-limited.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(220,38,38,0.08);">
      <div style="background: #dc2626; color: #ffffff; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800;">🚨 Unauthorized Admin Key Attempt</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">CampusPoint Security Alert System</p>
      </div>
      <div style="padding: 24px; color: #1f2937; line-height: 1.6;">
        <p style="font-size: 15px; margin-top: 0;">
          An unauthorized user attempted to access the <strong>CampusPoint Admin Panel</strong> using an invalid secret key.
        </p>
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 4px 0; font-size: 14px;"><strong>⏰ Time:</strong> ${when} IST</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>🌐 IP Address:</strong> <code style="background: #fee2e2; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${ip}</code></p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>💻 Device:</strong> <span style="font-size: 12px; color: #4b5563;">${userAgent}</span></p>
        </div>
        <p style="font-size: 13px; color: #6b7280;">
          🛡️ <em>Defense Status:</em> Access was blocked instantly and the 5-strike IP rate limiter has recorded this failure.
        </p>
        <p style="font-size: 13px; color: #991b1b; background: #fff1f2; padding: 10px 14px; border-radius: 8px;">
          ⚠️ <strong>Action Required:</strong> If this attempt was not made by you, please verify your network security.
        </p>
      </div>
      <div style="background: #f9fafb; padding: 14px 24px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
        CampusPoint Automated Security Monitor
      </div>
    </div>
  `;

  try {
    await sendMail({ to: adminRecipient, subject, text, html });
    console.log(`[SECURITY ALERT] 📧 Alert email successfully sent to ${adminRecipient}`);
  } catch (err) {
    console.error("[SECURITY ALERT EMAIL FAILED]", err.message);
  }
}

function resolveAdminEmail(_rawIndex) {
  return ADMIN_EMAILS[0];
}

// Hide most of the address so the UI can say where the code went without
// exposing the full inbox on a public page.
function maskEmail(e) {
  const [user, domain] = String(e).split("@");
  if (!domain) return "the admin email";
  const head = user.slice(0, 2);
  return `${head}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

// Step 1 — verify the admin key, then email a 6-digit code to ADMIN_EMAIL.
// Guarded with adminKeyLimiter: 5 wrong attempts = 30-minute lockout.
router.post("/request-otp", adminKeyLimiter, async (req, res) => {
  const clientIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";

  try {
    if (!verifyAdminKey(req.body?.key)) {
      console.warn(`[SECURITY ALERT] 🚨 Unauthorized admin key attempt from IP: ${clientIp} | UA: ${userAgent}`);
      
      // Send security alert email immediately to the admin
      sendFailedKeyAlertEmail({ ip: clientIp, userAgent }).catch(() => {});

      return res.status(403).json({ error: "Invalid admin key" });
    }

    const ADMIN_EMAIL = ADMIN_EMAILS[0];
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 8);

    // Fire the email and persist the code together (single upsert) so the code
    // arrives as fast as possible. Stale OTPs auto-expire via the TTL index.
    const sendP = sendOtpEmail(ADMIN_EMAIL, code);
    const persistP = Otp.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      { codeHash, name: "admin", attempts: 0, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const [r] = await Promise.all([sendP, persistP]);
    if (!r.ok) {
      await Otp.deleteMany({ email: ADMIN_EMAIL });
      console.error(`[ADMIN OTP] send failed: ${r.error}`);
      return res.status(502).json({ error: "We couldn't send the code right now. Please try again in a moment." });
    }
    console.log(`[ADMIN OTP] sent to ${ADMIN_EMAIL} | dev=${r.dev}`);

    res.json({
      sent: true,
      sentTo: maskEmail(ADMIN_EMAIL),
      email: ADMIN_EMAIL,
      ...(r.dev ? { devCode: code } : {}),
    });
  } catch (e) {
    console.error("[admin/request-otp]", e.message);
    res.status(500).json({ error: "Could not send the code. Please try again." });
  }
});

// Step 2 — verify key + OTP, then issue a short-lived admin session token.
// Guarded with adminOtpLimiter: 5 wrong attempts = 15-minute lockout.
router.post("/verify-otp", adminOtpLimiter, async (req, res) => {
  const clientIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";

  try {
    if (!verifyAdminKey(req.body?.key)) {
      console.warn(`[SECURITY ALERT] 🚨 Unauthorized admin key in /verify-otp from IP: ${clientIp}`);
      
      // Send security alert email
      sendFailedKeyAlertEmail({ ip: clientIp, userAgent }).catch(() => {});

      return res.status(403).json({ error: "Invalid admin key" });
    }

    const ADMIN_EMAIL = ADMIN_EMAILS[0];
    const code = String(req.body?.code || "");

    // Scoped to the inbox the code was sent to, so one owner's live code can't
    // be redeemed by naming the other owner's inbox.
    const otp = await Otp.findOne({ email: ADMIN_EMAIL }).sort({ _id: -1 });
    if (!otp) return res.status(400).json({ error: "Request a new code" });
    if (otp.expiresAt < new Date()) {
      await otp.deleteOne();
      return res.status(400).json({ error: "Code expired — request a new one" });
    }
    if (otp.attempts >= 5) {
      await otp.deleteOne();
      console.warn(`[SECURITY ALERT] 🚨 Excessive OTP guess attempts for ${ADMIN_EMAIL} from IP: ${clientIp}. Token destroyed.`);
      return res.status(429).json({ error: "Too many attempts — request a new code" });
    }
    const ok = await bcrypt.compare(code, otp.codeHash);
    if (!ok) {
      otp.attempts++;
      await otp.save();
      console.warn(`[SECURITY WARNING] Failed OTP guess (${otp.attempts}/5) for ${ADMIN_EMAIL} from IP: ${clientIp}`);
      return res.status(400).json({ error: `Incorrect code (${5 - otp.attempts} attempts left)` });
    }

    await otp.deleteOne();
    console.log(`[ADMIN LOGIN SUCCESS] ✅ Admin logged in successfully to ${ADMIN_EMAIL} from IP: ${clientIp}`);
    res.json({ token: signAdminToken() });
  } catch (e) {
    console.error("[admin/verify-otp]", e.message);
    res.status(500).json({ error: "Could not verify the code. Please try again." });
  }
});

// The authorized admin destination for 2FA verification.
router.get("/inboxes", (_req, res) => {
  res.json({ inboxes: ADMIN_EMAILS.map((e, i) => ({ id: i, label: maskEmail(e), email: e })) });
});

export default router;
