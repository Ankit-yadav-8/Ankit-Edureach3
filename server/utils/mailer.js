// ─────────────────────────────────────────────────────────────────────────────
// OTP email via Brevo (Sendinblue) transactional API.
//
// IMPORTANT — sender rules:
//   Brevo only sends from a VERIFIED sender. SMTP_FROM_EMAIL must be an address
//   on a domain you have authenticated in Brevo (SPF/DKIM), e.g.
//     SMTP_FROM_EMAIL=noreply@collegeparichay.in
//   Free webmail domains (gmail.com, yahoo.com, outlook.com, …) are REJECTED by
//   Brevo because of DMARC — they can NOT be used as the "from" address. Use a
//   gmail address only as the reply-to / contact (REPLY_TO_EMAIL) instead.
//
// Env vars used:
//   BREVO_API_KEY   — Brevo transactional API key (required to actually send)
//   SMTP_FROM_EMAIL — verified domain sender (the "from")
//   SMTP_FROM_NAME  — display name for the sender (default "CollegeParichay")
//   REPLY_TO_EMAIL  — where replies go (default collegeparichay@gmail.com)
//   OTP_DEV_MODE    — "false" to actually send; anything else only logs the code
// ─────────────────────────────────────────────────────────────────────────────

const FREE_WEBMAIL = /@(gmail|googlemail|yahoo|ymail|outlook|hotmail|live|msn|icloud|me|aol|proton|protonmail|zoho)\./i;

// Log-only ("dev") mode vs. real sending. We send for real whenever a Brevo key
// is configured; without a key there's nothing to send through, so we log. Set
// OTP_DEV_MODE=true to force log-only even when a key is present (useful in
// staging). The previous default required OTP_DEV_MODE=false to ever send, which
// silently swallowed mail in production when that var wasn't set.
function isDevMode() {
  if (String(process.env.OTP_DEV_MODE || "").toLowerCase() === "true") return true;
  return !process.env.BREVO_API_KEY;
}

// Resolve the Brevo "from" address, falling back to the verified domain sender
// when SMTP_FROM_EMAIL is missing or a free-webmail address Brevo won't send from.
function resolveSender() {
  const VERIFIED_SENDER = "hello@collegeparichay.in";
  let fromEmail  = String(process.env.SMTP_FROM_EMAIL || "").trim();
  const fromName = (process.env.SMTP_FROM_NAME || "CollegeParichay").trim();
  const replyTo  = String(process.env.REPLY_TO_EMAIL || "collegeparichay@gmail.com").trim();
  if (!fromEmail || FREE_WEBMAIL.test(fromEmail)) fromEmail = VERIFIED_SENDER;
  return { fromEmail, fromName, replyTo };
}

// Single place that POSTs to Brevo, with a hard timeout so a slow/hung Brevo
// request can't keep the user waiting (they get a fast "try again" instead).
async function postToBrevo(body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": process.env.BREVO_API_KEY },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Brevo API error (${res.status}): ${await res.text()}`);
    return { ok: true, dev: false };
  } catch (e) {
    if (e.name === "AbortError") throw new Error("Brevo timed out");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Generic transactional email. Without a Brevo key (or with OTP_DEV_MODE=true)
 * it only logs — so it never sends real mail during local dev. Returns { ok, dev }.
 */
export async function sendMail({ to, subject, html, text }) {
  if (isDevMode()) {
    console.log(`\n[DEV EMAIL] to ${to}\n  Subject: ${subject}\n  (set BREVO_API_KEY to send for real; OTP_DEV_MODE=true forces this log-only mode)\n`);
    return { ok: true, dev: true };
  }
  const { fromEmail, fromName, replyTo } = resolveSender();
  try {
    return await postToBrevo({
      sender: { name: fromName, email: fromEmail },
      replyTo: { email: replyTo, name: fromName },
      to: [{ email: to }],
      subject,
      textContent: text || subject,
      htmlContent: html || `<p>${text || subject}</p>`,
    });
  } catch (e) {
    console.error("sendMail failed:", e.message);
    return { ok: false, dev: false, error: e.message };
  }
}

export async function sendOtpEmail(email, code) {
  if (isDevMode()) {
    console.log(`\n[DEV EMAIL] to ${email}\n  Code: ${code}\n  (set BREVO_API_KEY to send for real; OTP_DEV_MODE=true forces this log-only mode)\n`);
    return { ok: true, dev: true };
  }

  // The verified Brevo sender to use when SMTP_FROM_EMAIL is missing or set to a
  // free-webmail address (gmail/yahoo/…) that Brevo refuses to send from. This
  // domain (collegeparichay.in) is authenticated in Brevo, so OTP delivery keeps
  // working even if SMTP_FROM_EMAIL on Render is misconfigured.
  const VERIFIED_SENDER = "hello@collegeparichay.in";

  let fromEmail   = String(process.env.SMTP_FROM_EMAIL || "").trim();
  const fromName  = (process.env.SMTP_FROM_NAME || "CollegeParichay").trim();
  const replyTo   = String(process.env.REPLY_TO_EMAIL || "collegeparichay@gmail.com").trim();

  // A free webmail "from" can never be sent through Brevo — fall back to the
  // verified domain sender (and keep the gmail as reply-to) instead of failing.
  if (!fromEmail || FREE_WEBMAIL.test(fromEmail)) {
    if (fromEmail) {
      console.error(
        `[MAILER] SMTP_FROM_EMAIL="${fromEmail}" is a free webmail address Brevo ` +
        `won't send from — using verified sender "${VERIFIED_SENDER}" instead. ` +
        `(Set SMTP_FROM_EMAIL to a verified domain address on Render to silence this.)`
      );
    } else {
      console.warn(`[MAILER] SMTP_FROM_EMAIL not set — using "${VERIFIED_SENDER}".`);
    }
    fromEmail = VERIFIED_SENDER;
  }

  try {
    return await postToBrevo({
      sender: { name: fromName, email: fromEmail },
      replyTo: { email: replyTo, name: fromName },
      to: [{ email }],
      subject: "Your CollegeParichay verification code",
      textContent: `Your CollegeParichay verification code is ${code}. Valid for 5 minutes.`,
      htmlContent: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#F47B20;margin:0 0 8px">CollegeParichay</h2>
        <p style="color:#333;font-size:15px">Your verification code is:</p>
        <div style="font-size:32px;font-weight:800;letter-spacing:8px;color:#1c1c28;margin:12px 0">${code}</div>
        <p style="color:#888;font-size:13px">Valid for 5 minutes. If you didn't request this, ignore this email.</p>
      </div>`,
    });
  } catch (e) {
    console.error("Email send failed:", e.message);
    return { ok: false, dev: false, error: e.message };
  }
}
