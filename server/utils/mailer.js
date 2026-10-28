// ─────────────────────────────────────────────────────────────────────────────
// OTP email via Brevo (Sendinblue) transactional API.
//
// IMPORTANT — sender rules:
//   Brevo only sends from a VERIFIED sender. SMTP_FROM_EMAIL must be an address
//   on a domain you have authenticated in Brevo (SPF/DKIM), e.g.
//     SMTP_FROM_EMAIL=noreply@campuspoint.in
//   Free webmail domains (gmail.com, yahoo.com, outlook.com, …) are REJECTED by
//   Brevo because of DMARC — they can NOT be used as the "from" address. Use a
//   gmail address only as the reply-to / contact (REPLY_TO_EMAIL) instead.
//
// Env vars used:
//   BREVO_API_KEY   — Brevo transactional API key (required to actually send)
//   SMTP_FROM_EMAIL — verified domain sender (the "from")
//   SMTP_FROM_NAME  — display name for the sender (default "CampusPoint")
//   REPLY_TO_EMAIL  — where replies go (default campuspath6@gmail.com)
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
  const VERIFIED_SENDER = "hello@campuspoint.in";
  let fromEmail  = String(process.env.SMTP_FROM_EMAIL || "").trim();
  const fromName = (process.env.SMTP_FROM_NAME || "CampusPoint").trim();
  const replyTo  = String(process.env.REPLY_TO_EMAIL || "campuspath6@gmail.com").trim();
  if (!fromEmail || FREE_WEBMAIL.test(fromEmail)) fromEmail = VERIFIED_SENDER;
  return { fromEmail, fromName, replyTo };
}

// Single place that POSTs to Brevo, with a hard timeout so a slow/hung Brevo
// request can't keep the user waiting (they get a fast "try again" instead).
async function postToBrevo(body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
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

// ── Shared branded email shell ──────────────────────────────────────────────
// Same look as the mentorship reports: 600px card on a tinted backdrop, navy
// gradient header with CP logo + wordmark (Parichay in coral), hidden
// preheader for the inbox preview, and a consistent footer. Email-client-safe:
// table layouts + inline styles only.
const esc = (s) => String(s ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

// CP logo badge — crisp white square with website coral "CP" text inside.
// Bulletproof in all email clients: white-space:nowrap, word-break:keep-all,
// letter-spacing:-0.5px. Never wraps or drops 'P' to become 'C'.
const CP_LOGO_HTML = `
<table role="presentation" width="30" height="30" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:7px;text-align:center;table-layout:fixed;width:30px;height:30px;min-width:30px;min-height:30px;border-collapse:separate;box-shadow:0 1px 3px rgba(0,0,0,0.12)">
  <tr><td width="30" height="30" align="center" valign="middle" style="color:#FF693D;font-size:12px;font-weight:900;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:30px;mso-line-height-rule:exactly;padding:0;margin:0;white-space:nowrap !important;word-break:keep-all;letter-spacing:-0.5px">CP</td></tr>
</table>
`;

function emailShell(inner, { preheader = "", eyebrow = "", footer = "" } = {}) {
  return `<div style="margin:0;padding:0;background:#f1f5f9;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f1f5f9;font-size:1px;line-height:1px">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:20px 10px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
        <!-- Coral Alert Header -->
        <tr><td style="background:#FF693D;background-image:linear-gradient(135deg,#FF693D 0%,#EE5326 100%);padding:14px 20px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="30" style="padding-right:10px;vertical-align:middle">${CP_LOGO_HTML}</td>
            <td width="100%" style="font-size:15px;font-weight:800;color:#ffffff;letter-spacing:-0.2px;vertical-align:middle">Campus Point</td>
            ${eyebrow ? `<td align="right" style="white-space:nowrap;vertical-align:middle">
              <span style="display:inline-block;background:rgba(255,255,255,0.22);border:1px solid rgba(255,255,255,0.35);color:#ffffff;font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;padding:3px 9px;border-radius:20px">${esc(eyebrow)}</span>
            </td>` : ""}
          </tr></table>
        </td></tr>
        <tr><td style="padding:18px 22px 10px">${inner}</td></tr>
        <tr><td style="padding:12px 22px 20px">
          <div style="border-top:1px solid #f1f5f9;padding-top:14px;color:#94a3b8;font-size:11px;line-height:1.5">
            ${footer || "You're receiving this official notification from Campus Point."}<br>
            <span style="color:#cbd5e1">Campus Point · Personalised JEE &amp; NEET Mentorship · <a href="https://campuspoint.in" style="color:#FF693D;text-decoration:none">campuspoint.in</a></span>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;
}

// ── Parent test-report email ────────────────────────────────────────────────
// Sent to a student's parent when they submit a daily/weekly test, so parents
// get a plain-language progress snapshot without logging in.
export async function sendParentTestReport({ to, studentName, testTitle, examLabel, result, subjects = [] }) {
  const { score, maxMarks, percent, accuracy, correctCount, wrongCount, skippedCount, totalQuestions, rank } = result;
  const grade = percent >= 75 ? "Excellent" : percent >= 50 ? "Good" : percent >= 30 ? "Needs Improvement" : "Needs Attention";
  const gradeColor = percent >= 75 ? "#15a06e" : percent >= 50 ? "#6366f1" : percent >= 30 ? "#f59e0b" : "#ef4444";
  const pct = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));

  const subjRows = subjects
    .filter((s) => s.total)
    .map(
      (s) => `<tr>
        <td style="padding:7px 10px;border-bottom:1px solid #eef0f5;color:#0f172a;font-weight:700;font-size:12px">${esc(s.name)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eef0f5;text-align:center;color:#334155;font-size:12px;font-weight:600">${esc(s.score)}/${esc(s.maxMarks)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eef0f5;text-align:center;color:#334155;font-size:12px">${esc(s.accuracy)}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eef0f5;text-align:center;color:#334155;font-size:12px">${esc(s.correct)}/${esc(s.total)}</td>
      </tr>`
    )
    .join("");

  const inner = `
    <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px">Test Alert${examLabel ? ` · ${esc(examLabel)}` : ""}</div>
    <p style="font-size:12.5px;color:#475569;line-height:1.55;margin:0 0 12px"><b style="color:#0f172a">${esc(studentName)}</b> just completed <b style="color:#0f172a">${esc(testTitle)}</b>. Here is the full summary:</p>
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0">
      <tr><td style="background:#fff8f6;border:1px solid #ffdecb;border-radius:10px;padding:14px" align="center">
        <div style="font-size:10px;color:#c2410c;font-weight:700;text-transform:uppercase;letter-spacing:1px">Total Score</div>
        <div style="font-size:26px;font-weight:800;color:#0f172a;line-height:1.1;margin-top:2px">${esc(score)}<span style="font-size:14px;font-weight:600;color:#64748b">/${esc(maxMarks)}</span></div>
        <div style="font-size:11.5px;color:#64748b;margin-top:2px">${esc(percent)}% score · ${esc(accuracy)}% accuracy</div>
        <div style="display:inline-block;margin-top:6px;background:${gradeColor};color:#fff;font-size:10px;font-weight:800;padding:3px 10px;border-radius:20px">${esc(grade)}</div>
        ${rank ? `<div style="font-size:11.5px;color:#0f172a;margin-top:8px;font-weight:700">🏆 Estimated AIR: <b>~${esc(rank)}</b></div>` : ""}
      </td></tr>
    </table>
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:10px 0 4px;table-layout:fixed"><tr>
      <td width="33%" style="padding:2px"><div style="background:#15a06e10;border:1px solid #15a06e25;border-radius:8px;padding:8px 6px;text-align:center"><div style="font-size:18px;font-weight:800;color:#15a06e">${esc(correctCount)}</div><div style="font-size:10px;color:#64748b;font-weight:600">Correct</div></div></td>
      <td width="33%" style="padding:2px"><div style="background:#ef444410;border:1px solid #ef444425;border-radius:8px;padding:8px 6px;text-align:center"><div style="font-size:18px;font-weight:800;color:#ef4444">${esc(wrongCount)}</div><div style="font-size:10px;color:#64748b;font-weight:600">Wrong</div></div></td>
      <td width="33%" style="padding:2px"><div style="background:#94a3b810;border:1px solid #94a3b825;border-radius:8px;padding:8px 6px;text-align:center"><div style="font-size:18px;font-weight:800;color:#94a3b8">${esc(skippedCount)}</div><div style="font-size:10px;color:#64748b;font-weight:600">Unattempted</div></div></td>
    </tr></table>
    
    <div style="margin:10px 0 4px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:11.5px;font-weight:600;color:#64748b">Overall Score</td>
        <td align="right" style="font-size:11.5px;font-weight:800;color:#0f172a">${pct}%</td>
      </tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:3px;background:#f1f5f9;border-radius:6px"><tr>
        <td style="height:6px;background:${gradeColor};border-radius:6px;width:${pct}%;font-size:0;line-height:0">&nbsp;</td>
        ${pct < 100 ? `<td style="height:6px;font-size:0;line-height:0">&nbsp;</td>` : ""}
      </tr></table>
    </div>
    
    ${subjRows ? `<div style="margin:14px 0 6px"><span style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.6px">Subject-wise breakdown</span></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
      <thead><tr style="text-align:left;background:#f8fafc;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:.4px">
        <th style="padding:6px 10px">Subject</th><th style="padding:6px 10px;text-align:center">Marks</th><th style="padding:6px 10px;text-align:center">Accuracy</th><th style="padding:6px 10px;text-align:center">Correct</th>
      </tr></thead><tbody>${subjRows}</tbody></table>` : ""}
    
    <p style="font-size:11.5px;color:#64748b;line-height:1.55;margin:12px 0 0">Out of <b>${esc(totalQuestions)}</b> questions, ${esc(studentName)} attempted <b>${correctCount + wrongCount}</b>. Consistent daily testing builds high exam accuracy.</p>`;

  const html = emailShell(inner, {
    preheader: `${studentName} scored ${score}/${maxMarks} (${percent}%) on ${testTitle}`,
    eyebrow: "Test report",
    footer: `You're receiving this because your email is the parent contact for ${esc(studentName)}'s mentorship enrolment.`,
  });

  const text = `${studentName} completed ${testTitle}. Score: ${score}/${maxMarks} (${percent}%), accuracy ${accuracy}%. Correct ${correctCount}, wrong ${wrongCount}, unattempted ${skippedCount} of ${totalQuestions}.${rank ? ` Estimated AIR ~${rank}.` : ""}`;

  return sendMail({ to, subject: `${studentName}'s test report — ${testTitle}`, html, text });
}

export async function sendOtpEmail(email, code) {
  if (isDevMode()) {
    console.log(`\n[DEV EMAIL] to ${email}\n  Code: ${code}\n  (set BREVO_API_KEY to send for real; OTP_DEV_MODE=true forces this log-only mode)\n`);
    return { ok: true, dev: true };
  }

  const VERIFIED_SENDER = "hello@campuspoint.in";
  let fromEmail   = String(process.env.SMTP_FROM_EMAIL || "").trim();
  const fromName  = (process.env.SMTP_FROM_NAME || "CampusPoint").trim();
  const replyTo   = String(process.env.REPLY_TO_EMAIL || "campuspath6@gmail.com").trim();

  if (!fromEmail || FREE_WEBMAIL.test(fromEmail)) {
    fromEmail = VERIFIED_SENDER;
  }

  try {
    return await postToBrevo({
      sender: { name: fromName, email: fromEmail },
      replyTo: { email: replyTo, name: fromName },
      to: [{ email }],
      subject: "Your CampusPoint verification code",
      textContent: `Your CampusPoint verification code is ${code}. Valid for 10 minutes.`,
      htmlContent: emailShell(`
        <p style="margin:0 0 10px;font-size:12.5px;color:#475569;line-height:1.55">Use this security verification code to confirm your email on CampusPoint:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0"><tr>
          <td align="center" style="background:#fff8f6;border:1.5px dashed #ffdecb;border-radius:10px;padding:16px">
            <div style="font-size:10px;color:#c2410c;font-weight:700;text-transform:uppercase;letter-spacing:1px">Verification Code</div>
            <div style="font-size:28px;font-weight:800;letter-spacing:6px;color:#FF693D;margin-top:4px">${esc(code)}</div>
          </td>
        </tr></table>
        <p style="color:#94a3b8;font-size:11.5px;line-height:1.5;margin:10px 0 0">⏱ Valid for <b>10 minutes</b>. If you didn't request this code, you can safely disregard this email.</p>`,
        { preheader: `Your CampusPoint code is ${code} — valid for 10 minutes`, eyebrow: "Verify email", footer: "You're receiving this because someone requested a sign-in verification code for this email." }),
    });
  } catch (e) {
    console.error("Email send failed:", e.message);
    return { ok: false, dev: false, error: e.message };
  }
}

export async function sendPasswordResetEmail(email, resetUrl, otp) {
  if (isDevMode()) {
    console.log(`\n[DEV EMAIL] to ${email}\n  Reset Link: ${resetUrl}\n  OTP: ${otp}\n  (set BREVO_API_KEY to send for real; OTP_DEV_MODE=true forces this log-only mode)\n`);
    return { ok: true, dev: true };
  }

  const VERIFIED_SENDER = "hello@campuspoint.in";
  let fromEmail   = String(process.env.SMTP_FROM_EMAIL || "").trim();
  const fromName  = (process.env.SMTP_FROM_NAME || "CampusPoint").trim();
  const replyTo   = String(process.env.REPLY_TO_EMAIL || "campuspath6@gmail.com").trim();

  if (!fromEmail || FREE_WEBMAIL.test(fromEmail)) {
    fromEmail = VERIFIED_SENDER;
  }

  try {
    return await postToBrevo({
      sender: { name: fromName, email: fromEmail },
      replyTo: { email: replyTo, name: fromName },
      to: [{ email }],
      subject: "Reset your CampusPoint password",
      textContent: `Reset your CampusPoint password.\n\nClick this link to auto-fill your code: ${resetUrl}\n\nOr enter this 6-digit OTP manually: ${otp}\n\nThis code is unique and expires in 15 minutes. After entering the OTP, you'll receive a verification token to confirm your identity before setting a new password.\n\nIf you didn't request this, ignore this email.`,
      htmlContent: emailShell(`
        <p style="margin:0 0 10px;font-size:12.5px;color:#475569;line-height:1.55">We received a request to reset your CampusPoint account password. Follow the quick steps below:</p>
        
        <div style="margin:14px 0;text-align:center;">
          <p style="font-size:10.5px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 8px">Option 1 — Direct Link</p>
          <a href="${esc(resetUrl)}" style="display:inline-block;background:#FF693D;color:#fff;font-size:12.5px;font-weight:700;text-decoration:none;padding:10px 22px;border-radius:8px;">🔐 Reset Password &nbsp;→</a>
        </div>
        
        <div style="margin:14px 0;text-align:center;">
          <p style="font-size:10.5px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 8px">Option 2 — Manual Code Entry</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 auto"><tr>
            <td align="center" style="background:#fff8f6;border:1.5px dashed #ffdecb;border-radius:10px;padding:14px">
              <div style="font-size:10px;color:#c2410c;font-weight:700;text-transform:uppercase;letter-spacing:1px">Your 6-Digit OTP</div>
              <div style="font-size:26px;font-weight:800;letter-spacing:6px;color:#FF693D;margin-top:2px">${esc(otp)}</div>
            </td>
          </tr></table>
        </div>
        
        <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:10px 14px;margin:12px 0">
          <p style="margin:0;font-size:11.5px;color:#92400e;line-height:1.55;font-weight:600">
            🔒 <b>Security:</b> This OTP will expire in 15 minutes. If you did not make this request, please ignore this email.
          </p>
        </div>`,
        { preheader: `Your CampusPoint password reset code is ${otp} — valid for 15 minutes`, eyebrow: "Password reset", footer: "You're receiving this because a password reset was requested for your CampusPoint account." }),
    });
  } catch (e) {
    console.error("Password reset email send failed:", e.message);
    return { ok: false, dev: false, error: e.message };
  }
}

// ── Verification token email (Step 2 of password reset) ─────────────────────
// Sent AFTER the user's OTP is confirmed. The token is never returned in an
// API response — it only ever travels through email, so only the inbox owner
// can complete the reset. This prevents screen-shoulder or network interception.
export async function sendVerificationTokenEmail(email, verificationToken) {
  if (isDevMode()) {
    console.log(`\n[DEV EMAIL] Verification token to ${email}\n  Token: ${verificationToken}\n  (set BREVO_API_KEY to send for real; OTP_DEV_MODE=true forces this log-only mode)\n`);
    return { ok: true, dev: true };
  }

  const { fromEmail, fromName, replyTo } = resolveSender();

  try {
    return await postToBrevo({
      sender: { name: fromName, email: fromEmail },
      replyTo: { email: replyTo, name: fromName },
      to: [{ email }],
      subject: "Your CampusPoint verification token",
      textContent: `Your CampusPoint verification token is: ${verificationToken}\n\nCopy and paste this token into the password reset form to set your new password.\n\nThis token is unique and expires in 15 minutes. If you didn't request this, you can safely ignore this email.`,
      htmlContent: emailShell(`
        <p style="margin:0 0 10px;font-size:12.5px;color:#475569;line-height:1.55">Your OTP has been verified. Use the token below to complete your password reset:</p>
        
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:10px 0"><tr>
          <td align="center" style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px">
            <div style="font-size:10px;color:#16a34a;font-weight:700;text-transform:uppercase;letter-spacing:1px">Verification Token</div>
            <div style="font-size:14px;font-weight:800;color:#166534;margin-top:4px;word-break:break-all;letter-spacing:0.5px;font-family:monospace">${esc(verificationToken)}</div>
          </td>
        </tr></table>
        
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 14px;margin:10px 0">
          <p style="margin:0;font-size:11.5px;color:#1e40af;line-height:1.55;font-weight:600">
            📋 Copy and paste the token above into the password reset form to set your new password.
          </p>
        </div>
        
        <p style="color:#94a3b8;font-size:11.5px;line-height:1.5;margin:10px 0 0">⏱ This token expires in <b>15 minutes</b>. If you didn't request a password reset, you can safely ignore this email.</p>`,
        { preheader: "Your CampusPoint verification token for password reset", eyebrow: "Step 2 · Token", footer: "You're receiving this because you verified your OTP for a password reset." }),
    });
  } catch (e) {
    console.error("Verification token email send failed:", e.message);
    return { ok: false, dev: false, error: e.message };
  }
}

// ── Payment Receipt & Enrollment Welcome Email ─────────────────────────────
export async function sendPaymentReceiptEmail({ to, name, planLabel, amount, orderId, paymentId, studentId, dateStr }) {
  if (isDevMode()) {
    console.log(`\n[DEV EMAIL] Payment receipt to ${to}\n  Plan: ${planLabel}, Amount: ₹${amount}, PaymentID: ${paymentId}\n`);
    return { ok: true, dev: true };
  }
  const { fromEmail, fromName, replyTo } = resolveSender();
  const dateFormatted = dateStr || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST";
  
  const inner = `
    <div style="text-align:center;margin:0 0 16px">
      <div style="display:inline-block;width:44px;height:44px;background:#dcfce7;border:1px solid #86efac;border-radius:50%;line-height:44px;font-size:22px;color:#16a34a;margin-bottom:6px">✓</div>
      <div style="font-size:17px;font-weight:800;color:#0f172a;letter-spacing:-.2px">Payment Confirmed</div>
      <div style="font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:.8px;margin-top:2px">Enrollment Active</div>
    </div>
    
    <p style="font-size:12.5px;color:#475569;line-height:1.55;margin:0 0 14px">
      Dear <b style="color:#0f172a">${esc(name)}</b>, thank you for enrolling in <b style="color:#0f172a">${esc(planLabel)}</b>. Your payment has been successfully verified.
    </p>
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 14px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
      <tr><td colspan="2" style="background:#f8fafc;padding:10px 14px;border-bottom:1px solid #e2e8f0">
        <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">Enrollment Details</span>
      </td></tr>
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600">Plan</td>
        <td align="right" style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:12.5px;color:#0f172a;font-weight:700">${esc(planLabel)}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600">Amount Paid</td>
        <td align="right" style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:15px;color:#16a34a;font-weight:800">₹${Number(amount).toLocaleString("en-IN")}</td>
      </tr>
      ${studentId ? `<tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600">Student ID</td>
        <td align="right" style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-family:monospace;font-size:12px;color:#0f172a;font-weight:700">${esc(studentId)}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600">Payment ID</td>
        <td align="right" style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-family:monospace;font-size:11.5px;color:#475569">${esc(paymentId)}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;font-weight:600">Order ID</td>
        <td align="right" style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-family:monospace;font-size:11.5px;color:#475569">${esc(orderId)}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">Date &amp; Time</td>
        <td align="right" style="padding:10px 14px;font-size:12px;color:#475569">${esc(dateFormatted)}</td>
      </tr>
    </table>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 14px;margin:0 0 14px;text-align:center">
      <p style="margin:0;font-size:12px;color:#166534;line-height:1.55;font-weight:600">
        🎉 Your mentorship journey begins now! Log in to your dashboard to get started with your personalized study plan.
      </p>
    </div>

    <div style="margin:0 0 10px;text-align:center">
      <a href="https://campuspoint.in/mentorship-dashboard" style="display:inline-block;padding:10px 24px;background:#FF693D;color:#ffffff;text-decoration:none;font-weight:700;font-size:12.5px;border-radius:8px">Open Mentorship Dashboard &nbsp;→</a>
    </div>
    <p style="font-size:11px;color:#94a3b8;line-height:1.5;margin:12px 0 0;text-align:center">
      Need help? Reply directly to this email or contact us at <a href="mailto:campuspath6@gmail.com" style="color:#FF693D;font-weight:600;text-decoration:none">campuspath6@gmail.com</a>
    </p>
  `;

  const html = emailShell(inner, {
    preheader: `Payment confirmation for ${planLabel} — ₹${amount}`,
    eyebrow: "Receipt",
    footer: "You're receiving this because you completed a payment on Campus Point.",
  });

  const text = `Payment Confirmed!\nPlan: ${planLabel}\nAmount: ₹${amount}\nPayment ID: ${paymentId}\nOrder ID: ${orderId}\n${studentId ? `Student ID: ${studentId}\n` : ""}Date: ${dateFormatted}\n\nAccess dashboard: https://campuspoint.in/mentorship-dashboard`;

  try {
    return await postToBrevo({
      sender: { name: fromName, email: fromEmail },
      replyTo: { email: replyTo, name: fromName },
      to: [{ email: to }],
      subject: `Payment Successful: ${planLabel} — Campus Point`,
      textContent: text,
      htmlContent: html,
    });
  } catch (e) {
    console.error("Payment receipt email send failed:", e.message);
    return { ok: false, dev: false, error: e.message };
  }
}

// ── Admin Payment Notification & Email Approval ───────────────────────────
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ||
  process.env.ADMIN_EMAIL ||
  "ankityadav08022008@gmail.com")
  .split(",").map((s) => s.toLowerCase().trim()).filter(Boolean);

export async function sendAdminPaymentApprovalEmail({
  enrollmentId,
  approvalToken,
  name,
  email,
  phone,
  planLabel,
  amount,
  orderId,
  paymentId,
  studentId,
  dateStr,
}) {
  if (isDevMode()) {
    console.log(`\n[DEV EMAIL] Admin Payment Approval Notification:\n  Student: ${name} (${email}), Plan: ${planLabel}, Amount: ₹${amount}\n  Approval Token: ${approvalToken}\n`);
    return { ok: true, dev: true };
  }

  const { fromEmail, fromName, replyTo } = resolveSender();
  const dateFormatted = dateStr || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST";
  const approvalLink = `https://ankit-edureach3.onrender.com/api/payment/approve-email?id=${enrollmentId}&token=${approvalToken}`;

  const inner = `
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px 14px;margin-bottom:12px">
      <div style="font-size:11px;font-weight:800;color:#c2410c;text-transform:uppercase;letter-spacing:.5px">⚠️ Admin Approval Required</div>
      <div style="font-size:12px;color:#9a3412;margin-top:3px;font-weight:600">
        A new payment was received. Please review the details below and click <strong>Approve</strong> to dispatch confirmation to the student.
      </div>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
      <tr><td style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600">Student Name</td><td align="right" style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12.5px;color:#0f172a;font-weight:700">${esc(name)}</td></tr>
      <tr><td style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600">Student Email</td><td align="right" style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#0f172a;font-weight:600">${esc(email)}</td></tr>
      <tr><td style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600">Student Phone</td><td align="right" style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#0f172a;font-weight:600">${esc(phone || "-")}</td></tr>
      <tr><td style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600">Enrolled Plan</td><td align="right" style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12.5px;color:#0f172a;font-weight:700">${esc(planLabel)}</td></tr>
      <tr><td style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600">Amount Paid</td><td align="right" style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:15px;color:#16a34a;font-weight:800">₹${Number(amount).toLocaleString("en-IN")}</td></tr>
      ${studentId ? `<tr><td style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600">Assigned Student ID</td><td align="right" style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#0f172a;font-weight:700;font-family:monospace">${esc(studentId)}</td></tr>` : ""}
      <tr><td style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600">Razorpay Payment ID</td><td align="right" style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:11.5px;color:#334155;font-family:monospace">${esc(paymentId)}</td></tr>
      <tr><td style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600">Razorpay Order ID</td><td align="right" style="padding:9px 14px;border-bottom:1px solid #e2e8f0;font-size:11.5px;color:#334155;font-family:monospace">${esc(orderId)}</td></tr>
      <tr><td style="padding:9px 14px;font-size:12px;color:#64748b;font-weight:600">Timestamp</td><td align="right" style="padding:9px 14px;font-size:12px;color:#334155">${esc(dateFormatted)}</td></tr>
    </table>

    <div style="margin:20px 0 12px;text-align:center">
      <a href="${esc(approvalLink)}" style="display:inline-block;padding:12px 26px;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;border-radius:8px">
        ✓ Approve &amp; Send Confirmation Email
      </a>
    </div>

    <p style="font-size:11px;color:#64748b;line-height:1.5;margin:10px 0 0;text-align:center">
      Or manage from the web dashboard: <a href="https://campuspoint.in/admin" style="color:#FF693D;font-weight:600">campuspoint.in/admin</a>
    </p>
  `;

  const html = emailShell(inner, {
    preheader: `[ACTION REQUIRED] New payment from ${name} for ${planLabel} (₹${amount})`,
    eyebrow: "Admin Review",
    footer: "You're receiving this administrative alert because you are a CampusPoint project owner.",
  });

  const text = `New Payment Received!\nStudent: ${name} (${email})\nPhone: ${phone}\nPlan: ${planLabel}\nAmount: ₹${amount}\nPayment ID: ${paymentId}\nOrder ID: ${orderId}\n\nCLICK TO APPROVE AND SEND USER EMAIL:\n${approvalLink}\n\nAdmin Portal: https://campuspoint.in/admin`;

  const promises = ADMIN_EMAILS.map((adminEmail) =>
    postToBrevo({
      sender: { name: fromName, email: fromEmail },
      replyTo: { email: replyTo, name: fromName },
      to: [{ email: adminEmail }],
      subject: `[Payment Alert] ₹${amount} received from ${name} — Approval Needed`,
      textContent: text,
      htmlContent: html,
    }).catch((err) => console.error(`[ADMIN APPROVAL EMAIL ERROR to ${adminEmail}]`, err?.message || err))
  );

  return Promise.all(promises);
}
