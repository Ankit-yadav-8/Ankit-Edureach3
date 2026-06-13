import crypto from "crypto";

// Constant-time comparison so response timing can't be used to guess the key
// byte-by-byte. timingSafeEqual throws on length mismatch, so we hash both
// sides to a fixed length first.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || !a || !b) return false;
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function requireAdmin(req, res, next) {
  if (!safeEqual(req.headers["x-admin-key"], process.env.ADMIN_KEY))
    return res.status(403).json({ error: "Invalid admin key" });
  next();
}
