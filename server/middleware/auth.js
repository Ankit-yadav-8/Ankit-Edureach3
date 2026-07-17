import jwt from "jsonwebtoken";

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

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return res.status(401).json({ error: "Invalid or expired token" }); }
  if (!isStudentToken(payload)) return res.status(403).json({ error: "Not a student session" });
  req.user = payload;
  next();
}

// Attaches req.user when a valid token is present, but never blocks the request
// if it's missing or invalid. Used on routes that work logged-out (e.g. an
// enrolment can be paid without an account) yet want to link the account when
// one is signed in.
export function optionalAuth(req, _res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (isStudentToken(payload)) req.user = payload;
    } catch { /* ignore */ }
  }
  next();
}
