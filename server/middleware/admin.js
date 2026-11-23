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

// ── PRIMARY ADMIN KEY ────────────────────────────────────────────────────
// Step 1 of admin 4FA — constant-time check of the primary admin key.
export function verifyAdminKey(key) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    console.error("[auth/admin] ADMIN_KEY environment variable is not configured — access denied.");
    return false;
  }
  return safeEqual(key, adminKey);
}

// ── SECONDARY ADMIN KEY ─────────────────────────────────────────────────
// Step 3 of admin 4FA — constant-time check of the secondary (previous) admin key.
export function verifyAdminKeySecondary(key) {
  const secondaryKey = process.env.ADMIN_KEY_SECONDARY;
  if (!secondaryKey) {
    console.error("[auth/admin] ADMIN_KEY_SECONDARY environment variable is not configured — access denied.");
    return false;
  }
  return safeEqual(key, secondaryKey);
}

// ── CHALLENGE TOKENS (inter-step proof) ─────────────────────────────────
// Short-lived JWT that proves the holder completed a specific phase of login.
// These are NOT admin session tokens — they only gate the NEXT step.
export function signChallengeToken(phase) {
  return jwt.sign(
    { phase, admin: false, challenge: true },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );
}

export function verifyChallengeToken(token, expectedPhase) {
  if (!token) return false;
  try {
    const payload = jwt.verify(String(token), process.env.JWT_SECRET);
    return payload?.challenge === true && payload?.phase === expectedPhase;
  } catch {
    return false;
  }
}

// ── ADMIN SESSION TOKEN ─────────────────────────────────────────────────
// Final session token, issued only after ALL 4 steps are verified.
export function signAdminToken() {
  return jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: "8h" });
}

// Gate for admin-only data endpoints. Requires the OTP-issued session token
// (sent as the `x-admin-token` header) — the raw admin key alone is NOT
// sufficient, which is what makes the login genuinely multi-step.
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
