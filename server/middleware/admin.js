import crypto from "crypto";
import jwt from "jsonwebtoken";

// Constant-time comparison so response timing can't be used to guess the key
// byte-by-byte. timingSafeEqual throws on length mismatch, so we hash both
// sides to a fixed length first.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || !a || !b) return false;
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// Step 1 of admin 2FA — constant-time check of the raw admin key. Used only by
// the OTP routes; on its own the key does NOT grant access to any data.
export function verifyAdminKey(key) {
  return safeEqual(key, process.env.ADMIN_KEY);
}

// Step 2 — short-lived session token, issued only after the OTP is verified.
export function signAdminToken() {
  return jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: "8h" });
}

// Gate for admin-only data endpoints. Requires the OTP-issued session token
// (sent as the `x-admin-token` header) — the raw admin key alone is NOT
// sufficient, which is what makes the login genuinely two-step.
export function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (token) {
    try {
      const payload = jwt.verify(String(token), process.env.JWT_SECRET);
      if (payload?.admin === true) return next();
    } catch { /* invalid/expired token falls through to 403 */ }
  }
  return res.status(403).json({ error: "Admin authentication required" });
}
