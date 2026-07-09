import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: "Invalid or expired token" }); }
}

// Attaches req.user when a valid token is present, but never blocks the request
// if it's missing or invalid. Used on routes that work logged-out (e.g. an
// enrolment can be paid without an account) yet want to link the account when
// one is signed in.
export function optionalAuth(req, _res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (token) { try { req.user = jwt.verify(token, process.env.JWT_SECRET); } catch { /* ignore */ } }
  next();
}
