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

export async function sendOtpEmail(email, code) {
  const devMode = process.env.OTP_DEV_MODE !== "false";
  if (devMode || !process.env.BREVO_API_KEY) {
    console.log(`\n[DEV EMAIL] to ${email}\n  Code: ${code}\n`);
    return { ok: true, dev: true };
  }

  const fromEmail = String(process.env.SMTP_FROM_EMAIL || "").trim();
  const fromName  = (process.env.SMTP_FROM_NAME || "CollegeParichay").trim();
  const replyTo   = String(process.env.REPLY_TO_EMAIL || "collegeparichay@gmail.com").trim();

  // Catch the most common misconfiguration loudly instead of failing silently.
  if (!fromEmail) {
    console.error("[MAILER] SMTP_FROM_EMAIL is not set — Brevo cannot send.");
    return { ok: false, dev: false, error: "Sender email not configured" };
  }
  if (FREE_WEBMAIL.test(fromEmail)) {
    console.error(
      `[MAILER] SMTP_FROM_EMAIL="${fromEmail}" is a free webmail address. Brevo ` +
      `rejects these as senders. Set SMTP_FROM_EMAIL to a verified domain address ` +
      `(e.g. noreply@collegeparichay.in) and keep the gmail as REPLY_TO_EMAIL.`
    );
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
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
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Brevo API error (${res.status}): ${err}`);
    }
    return { ok: true, dev: false };
  } catch (e) {
    console.error("Email send failed:", e.message);
    return { ok: false, dev: false, error: e.message };
  }
}
