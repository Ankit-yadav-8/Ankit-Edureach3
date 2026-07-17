import express from "express";
import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";
import { sendOtpEmail, sendMail } from "../utils/mailer.js";
import { verifyAdminKey, signAdminToken } from "../middleware/admin.js";

const router = express.Router();

// The admin one-time code is only ever sent to one of THESE inboxes, and
// nowhere else. Whoever is signing in picks which one; a value that isn't on
// this list is refused rather than emailed, so the key alone can never redirect
// a code to an attacker's address.
//
// Two entries so both owners can get their own code without asking each other.
// Override with ADMIN_EMAILS (comma-separated) if the addresses ever change.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ||
  process.env.ADMIN_EMAIL ||
  "ankityadav08022008@gmail.com,ankit26august@gmail.com")
  .split(",").map((s) => s.toLowerCase().trim()).filter(Boolean);

// The client picks an inbox by INDEX, never by address: the addresses are never
// sent to the browser (the picker only ever sees masked labels), and an index
// can't be twisted into an arbitrary destination.
//
// Falls back to the first inbox when none is given, so a client that doesn't
// send one still works.
function resolveAdminEmail(rawIndex) {
  if (rawIndex === undefined || rawIndex === null || rawIndex === "") return ADMIN_EMAILS[0];
  const i = Number(rawIndex);
  return Number.isInteger(i) && i >= 0 && i < ADMIN_EMAILS.length ? ADMIN_EMAILS[i] : null;
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
// We only ever send the code if the key is correct.
router.post("/request-otp", async (req, res) => {
  try {
    if (!verifyAdminKey(req.body?.key)) return res.status(403).json({ error: "Invalid admin key" });

    const ADMIN_EMAIL = resolveAdminEmail(req.body?.inbox);
    if (!ADMIN_EMAIL) return res.status(400).json({ error: "Unknown admin inbox" });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 8);
    // Fire the email and persist the code together (single upsert) so the code
    // arrives as fast as possible. Stale OTPs auto-expire via the TTL index.
    const sendP = sendOtpEmail(ADMIN_EMAIL, code);
    const persistP = Otp.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      { codeHash, name: "admin", attempts: 0, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const [r] = await Promise.all([sendP, persistP]);
    if (!r.ok) {
      await Otp.deleteMany({ email: ADMIN_EMAIL });
      console.error(`[ADMIN OTP] send failed: ${r.error}`);
      return res.status(502).json({ error: "We couldn't send the code right now. Please try again in a moment." });
    }
    console.log(`[ADMIN OTP] sent to ${ADMIN_EMAIL} | dev=${r.dev}`);

    // Any sign-in through a NON-primary inbox tells the owner it happened.
    // The owner is the one who can act on a login they didn't expect, and the
    // second inbox exists precisely so they aren't in the loop for the code —
    // this keeps them informed without putting them back in the loop.
    //
    // Deliberately fire-and-forget and AFTER the response is sent: the notice
    // must never delay or fail the actual sign-in, and it carries no code.
    if (ADMIN_EMAIL !== ADMIN_EMAILS[0]) {
      const when = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      sendMail({
        to: ADMIN_EMAILS[0],
        subject: "Admin sign-in code requested (second inbox)",
        text: `An admin sign-in code was just sent to ${maskEmail(ADMIN_EMAIL)} at ${when} IST.\n\n`
            + `If that was your partner, nothing to do.\n`
            + `If it wasn't, change the admin key immediately — whoever asked already has it.`,
        html: `<p>An admin sign-in code was just sent to <strong>${maskEmail(ADMIN_EMAIL)}</strong> at ${when} IST.</p>`
            + `<p>If that was your partner, nothing to do.</p>`
            + `<p>If it wasn't, <strong>change the admin key immediately</strong> — whoever asked already has it.</p>`,
      }).catch((e) => console.error("[ADMIN OTP] owner notice failed:", e.message));
    }

    res.json({ sent: true, sentTo: maskEmail(ADMIN_EMAIL), ...(r.dev ? { devCode: code } : {}) });
  } catch (e) {
    console.error("[admin/request-otp]", e.message);
    res.status(500).json({ error: "Could not send the code. Please try again." });
  }
});

// Step 2 — verify key + OTP, then issue a short-lived admin session token.
router.post("/verify-otp", async (req, res) => {
  try {
    if (!verifyAdminKey(req.body?.key)) return res.status(403).json({ error: "Invalid admin key" });

    const ADMIN_EMAIL = resolveAdminEmail(req.body?.inbox);
    if (!ADMIN_EMAIL) return res.status(400).json({ error: "Unknown admin inbox" });
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
      return res.status(429).json({ error: "Too many attempts — request a new code" });
    }
    const ok = await bcrypt.compare(code, otp.codeHash);
    if (!ok) {
      otp.attempts++;
      await otp.save();
      return res.status(400).json({ error: `Incorrect code (${5 - otp.attempts} attempts left)` });
    }

    await otp.deleteOne();
    res.json({ token: signAdminToken() });
  } catch (e) {
    console.error("[admin/verify-otp]", e.message);
    res.status(500).json({ error: "Could not verify the code. Please try again." });
  }
});

// The inboxes a code may be sent to, masked. Public on purpose: it only reveals
// that two admin inboxes exist, which the login screen must show to let the
// right owner pick one. The addresses themselves stay hidden.
router.get("/inboxes", (_req, res) => {
  res.json({ inboxes: ADMIN_EMAILS.map((e, i) => ({ id: i, label: maskEmail(e) })) });
});

export default router;
