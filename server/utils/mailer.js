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

// ── Shared branded email shell ──────────────────────────────────────────────
// Same look as the mentorship reports: 600px card on a tinted backdrop, navy
// gradient header with wordmark, hidden preheader for the inbox preview, and a
// consistent footer. Email-client-safe: table layouts + inline styles only.
const esc = (s) => String(s ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

function emailShell(inner, { preheader = "", eyebrow = "", accent = "#F47B20", footer = "" } = {}) {
  return `<div style="margin:0;padding:0;background:#eef1f7">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#eef1f7;font-size:1px;line-height:1px">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f7;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 40px rgba(13,27,62,.10);font-family:Arial,Helvetica,sans-serif">
        <tr><td style="background:#0d1b3e;background-image:linear-gradient(135deg,#0d1b3e 0%,#1a2f63 100%);padding:22px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-size:19px;font-weight:800;color:#ffffff;letter-spacing:.2px">College<span style="color:#F47B20">Parichay</span></td>
            ${eyebrow ? `<td align="right" style="font-size:11px;font-weight:700;color:#c8d0e4;text-transform:uppercase;letter-spacing:1.2px">${esc(eyebrow)}</td>` : ""}
          </tr></table>
          <div style="height:3px;width:54px;background:${accent};border-radius:3px;margin-top:12px"></div>
        </td></tr>
        <tr><td style="padding:26px 28px 8px">${inner}</td></tr>
        <tr><td style="padding:18px 28px 26px">
          <div style="border-top:1px solid #eceff5;padding-top:16px;color:#9aa0aa;font-size:11.5px;line-height:1.6">
            ${footer || "You're receiving this from CollegeParichay."}<br>
            <span style="color:#b6bcc8">CollegeParichay · Personalised JEE &amp; NEET mentorship · collegeparichay.in</span>
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
  const grade = percent >= 75 ? "Excellent" : percent >= 50 ? "Good" : percent >= 30 ? "Needs improvement" : "Needs serious attention";
  const gradeColor = percent >= 75 ? "#15a06e" : percent >= 50 ? "#6366f1" : percent >= 30 ? "#f59e0b" : "#ef4444";
  const pct = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));

  const subjRows = subjects
    .filter((s) => s.total)
    .map(
      (s) => `<tr>
        <td style="padding:9px 10px;border-bottom:1px solid #eef0f5;color:#0d1b3e;font-weight:700;font-size:13px">${esc(s.name)}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #eef0f5;text-align:center;color:#374151;font-size:13px;font-weight:600">${esc(s.score)}/${esc(s.maxMarks)}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #eef0f5;text-align:center;color:#374151;font-size:13px">${esc(s.accuracy)}%</td>
        <td style="padding:9px 10px;border-bottom:1px solid #eef0f5;text-align:center;color:#374151;font-size:13px">${esc(s.correct)}/${esc(s.total)}</td>
      </tr>`
    )
    .join("");

  const inner = `
    <p style="margin:0 0 6px;font-size:13px;color:#8a93a6;font-weight:700;text-transform:uppercase;letter-spacing:.6px">Test report${examLabel ? ` · ${esc(examLabel)}` : ""}</p>
    <p style="font-size:15px;color:#5b6472;line-height:1.6;margin:0 0 12px"><b style="color:#1c1c28">${esc(studentName)}</b> just completed <b style="color:#1c1c28">${esc(testTitle)}</b>. Here's the full breakdown:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0">
      <tr><td style="background:#0d1b3e;background-image:linear-gradient(135deg,#0d1b3e 0%,#1a2f63 200%);border-radius:16px;padding:22px" align="center">
        <div style="font-size:11px;color:#fff;opacity:.7;text-transform:uppercase;letter-spacing:1.4px">Total score</div>
        <div style="font-size:44px;font-weight:800;color:#fff;line-height:1.05;margin-top:4px">${esc(score)}<span style="font-size:18px;opacity:.55">/${esc(maxMarks)}</span></div>
        <div style="font-size:13px;color:#fff;opacity:.9;margin-top:4px">${esc(percent)}% score · ${esc(accuracy)}% accuracy</div>
        <div style="display:inline-block;margin-top:12px;background:${gradeColor};color:#fff;font-size:12px;font-weight:800;padding:5px 14px;border-radius:50px">${esc(grade)}</div>
        ${rank ? `<div style="font-size:12.5px;color:#fff;opacity:.9;margin-top:12px">🏆 Estimated All-India Rank: <b>~${esc(rank)}</b></div>` : ""}
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0 4px"><tr>
      <td width="33%" style="padding:4px"><div style="background:#15a06e12;border:1px solid #15a06e2e;border-radius:12px;padding:12px 8px;text-align:center"><div style="font-size:22px;font-weight:800;color:#15a06e">${esc(correctCount)}</div><div style="font-size:11px;color:#5b6472;font-weight:600">Correct</div></div></td>
      <td width="33%" style="padding:4px"><div style="background:#ef444412;border:1px solid #ef44442e;border-radius:12px;padding:12px 8px;text-align:center"><div style="font-size:22px;font-weight:800;color:#ef4444">${esc(wrongCount)}</div><div style="font-size:11px;color:#5b6472;font-weight:600">Wrong</div></div></td>
      <td width="33%" style="padding:4px"><div style="background:#94a3b812;border:1px solid #94a3b82e;border-radius:12px;padding:12px 8px;text-align:center"><div style="font-size:22px;font-weight:800;color:#94a3b8">${esc(skippedCount)}</div><div style="font-size:11px;color:#5b6472;font-weight:600">Unattempted</div></div></td>
    </tr></table>
    <div style="margin:14px 0 4px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:13px;font-weight:600;color:#5b6472">Overall score</td>
        <td align="right" style="font-size:13px;font-weight:800;color:#1c1c28">${pct}%</td>
      </tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:5px;background:#eef1f7;border-radius:8px"><tr>
        <td style="height:9px;background:${gradeColor};border-radius:8px;width:${pct}%;font-size:0;line-height:0">&nbsp;</td>
        ${pct < 100 ? `<td style="height:9px;font-size:0;line-height:0">&nbsp;</td>` : ""}
      </tr></table>
    </div>
    ${subjRows ? `<div style="margin:20px 0 8px"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#0d1b3e;vertical-align:middle;margin-right:8px"></span><span style="font-size:15px;font-weight:800;color:#1c1c28;vertical-align:middle">Subject-wise breakdown</span></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
      <thead><tr style="text-align:left;color:#8a93a6;font-size:11px;text-transform:uppercase;letter-spacing:.4px">
        <th style="padding:6px 10px">Subject</th><th style="padding:6px 10px;text-align:center">Marks</th><th style="padding:6px 10px;text-align:center">Accuracy</th><th style="padding:6px 10px;text-align:center">Correct</th>
      </tr></thead><tbody>${subjRows}</tbody></table>` : ""}
    <p style="font-size:12.5px;color:#5b6472;line-height:1.65;margin:16px 0 0">Out of <b>${esc(totalQuestions)}</b> questions, ${esc(studentName)} attempted <b>${correctCount + wrongCount}</b>. Encouraging consistent daily practice helps the most.</p>`;

  const html = emailShell(inner, {
    preheader: `${studentName} scored ${score}/${maxMarks} (${percent}%) on ${testTitle}`,
    eyebrow: "Test report",
    accent: gradeColor,
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
      htmlContent: emailShell(`
        <p style="margin:0 0 8px;font-size:15px;color:#5b6472;line-height:1.6">Use this code to verify your email and sign in to CollegeParichay:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0"><tr>
          <td align="center" style="background:#f4f6fb;border:1px dashed #cbd3e4;border-radius:14px;padding:22px">
            <div style="font-size:11px;color:#8a93a6;font-weight:700;text-transform:uppercase;letter-spacing:1.4px">Verification code</div>
            <div style="font-size:38px;font-weight:800;letter-spacing:10px;color:#0d1b3e;margin-top:6px">${esc(code)}</div>
          </td>
        </tr></table>
        <p style="color:#8a93a6;font-size:13px;line-height:1.6;margin:12px 0 0">⏱ Valid for <b>5 minutes</b>. If you didn't request this, you can safely ignore this email.</p>`,
        { preheader: `Your CollegeParichay code is ${code} — valid for 5 minutes`, eyebrow: "Verify email", footer: "You're receiving this because someone requested a sign-in code for this email." }),
    });
  } catch (e) {
    console.error("Email send failed:", e.message);
    return { ok: false, dev: false, error: e.message };
  }
}

export async function sendPasswordResetEmail(email, resetUrl, token) {
  if (isDevMode()) {
    console.log(`\n[DEV EMAIL] to ${email}\n  Reset Link: ${resetUrl}\n  Token: ${token}\n  (set BREVO_API_KEY to send for real; OTP_DEV_MODE=true forces this log-only mode)\n`);
    return { ok: true, dev: true };
  }

  const VERIFIED_SENDER = "hello@collegeparichay.in";
  let fromEmail   = String(process.env.SMTP_FROM_EMAIL || "").trim();
  const fromName  = (process.env.SMTP_FROM_NAME || "CollegeParichay").trim();
  const replyTo   = String(process.env.REPLY_TO_EMAIL || "collegeparichay@gmail.com").trim();

  if (!fromEmail || FREE_WEBMAIL.test(fromEmail)) {
    fromEmail = VERIFIED_SENDER;
  }

  try {
    return await postToBrevo({
      sender: { name: fromName, email: fromEmail },
      replyTo: { email: replyTo, name: fromName },
      to: [{ email }],
      subject: "Reset your CollegeParichay password",
      textContent: `Reset your CollegeParichay password using this link: ${resetUrl}\nOr enter this 6-digit code: ${token}\nValid for 15 minutes.`,
      htmlContent: emailShell(`
        <p style="margin:0 0 8px;font-size:15px;color:#5b6472;line-height:1.6">We received a request to reset your CollegeParichay password.</p>
        <div style="margin:20px 0;text-align:center;">
          <a href="${esc(resetUrl)}" style="display:inline-block;background:#0d1b3e;color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:8px;margin-bottom:16px;">Reset Password</a>
          <p style="font-size:14px;color:#5b6472;margin:0 0 8px;">Or enter this 6-digit code manually:</p>
          <div style="display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;padding:12px 24px;border-radius:8px;font-size:24px;font-weight:900;letter-spacing:6px;color:#0f172a;">${esc(token)}</div>
        </div>
        <p style="color:#8a93a6;font-size:13px;line-height:1.6;margin:12px 0 0">⏱ This code expires in <b>15 minutes</b>. If you didn't request a password reset, you can safely ignore this email.</p>`,
        { preheader: "Instructions to reset your CollegeParichay password", eyebrow: "Password Reset", footer: "You're receiving this because someone requested a password reset for this email." }),
    });
  } catch (e) {
    console.error("Password reset email send failed:", e.message);
    return { ok: false, dev: false, error: e.message };
  }
}
