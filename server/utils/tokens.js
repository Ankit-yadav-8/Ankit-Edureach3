import jwt from "jsonwebtoken";

// Student session tokens.
//
// Two properties matter here, and the old `{ id }` / 30-day token had neither:
//
//  1. TYPE. Admin, mentor and student tokens are all signed with the same
//     JWT_SECRET, so a valid signature proves only that we issued the token —
//     not who for. `typ` is what lets requireAuth refuse a mentor token.
//
//  2. REVOCATION. A JWT is valid until it expires; there is no way to take one
//     back. `v` pins the token to User.tokenVersion, so bumping that field
//     invalidates every token already issued for that account — which is what
//     makes "log out everywhere" and "password changed" actually mean something.
//
// The TTL is deliberately shorter than the old 30 days: a stolen token is a
// bearer credential, and a month is a long time to hand someone. Active users
// don't notice, because the client silently swaps a nearly-expired token for a
// fresh one via POST /api/auth/refresh.
export const STUDENT_TTL = "7d";

export function signStudentToken(user) {
  return jwt.sign(
    { typ: "student", id: String(user._id), v: user.tokenVersion || 0 },
    process.env.JWT_SECRET,
    { expiresIn: STUDENT_TTL }
  );
}
