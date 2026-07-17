import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Admin, mentor and student tokens are all signed with the same JWT_SECRET, so
// verifying the signature proves only that WE issued the token — not who for.
// Anything that isn't a student token is refused here: without this a mentor
// token (which carries an `id`, like a student's) would satisfy requireAuth and
// be handed straight to the student routes.
//
// Student tokens issued before token typing exist as a bare { id } and stay
// valid — they're identified by the absence of a foreign type, not by `typ`.
function isStudentToken(p) {
  return !!p && !!p.id && p.admin !== true && (p.typ === undefined || p.typ === "student");
}

function bearer(req) {
  const h = req.headers.authorization || "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
}

/* Verify signature + shape. Returns the payload or null. */
function readToken(token) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return isStudentToken(payload) ? payload : null;
  } catch { return null; }
}

/**
 * Confirms the token hasn't been revoked.
 *
 * A JWT is valid until it expires and cannot be recalled, so signature alone
 * can't answer "is this session still allowed?". User.tokenVersion is bumped on
 * password reset and log-out-everywhere; a token minted before that no longer
 * matches and dies here rather than living out its TTL in an attacker's hands.
 *
 * Legacy bare { id } tokens carry no `v`. They're treated as version 0 so the
 * existing userbase isn't logged out — but the moment such an account bumps its
 * version (reset/logout-all), those old tokens stop working too.
 */
async function notRevoked(payload) {
  const user = await User.findById(payload.id).select("tokenVersion").lean();
  if (!user) return false;
  return (user.tokenVersion || 0) === (payload.v || 0);
}

export async function requireAuth(req, res, next) {
  const payload = readToken(bearer(req));
  if (!payload) {
    const raw = bearer(req);
    if (!raw) return res.status(401).json({ error: "Not authenticated" });
    // Signature-valid but wrong audience (admin/mentor) vs. simply bad/expired.
    try {
      jwt.verify(raw, process.env.JWT_SECRET);
      return res.status(403).json({ error: "Not a student session" });
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }
  try {
    if (!(await notRevoked(payload))) {
      return res.status(401).json({ error: "Session ended, please sign in again" });
    }
  } catch (e) {
    console.error("[auth/revocation-check]", e.message);
    return res.status(503).json({ error: "Could not verify session, try again" });
  }
  req.user = payload;
  next();
}

// Attaches req.user when a valid token is present, but never blocks the request
// if it's missing or invalid. Used on routes that work logged-out (e.g. an
// enrolment can be paid without an account) yet want to link the account when
// one is signed in.
export async function optionalAuth(req, _res, next) {
  const payload = readToken(bearer(req));
  if (payload) {
    try { if (await notRevoked(payload)) req.user = payload; }
    catch { /* a revocation lookup failure must not break a logged-out-capable route */ }
  }
  next();
}
