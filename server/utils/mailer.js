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

// ── Parent test-report email ────────────────────────────────────────────────
// Sent to a student's parent when they submit a daily/weekly test, so parents
// get a plain-language progress snapshot without logging in.
export async function sendParentTestReport({ to, studentName, testTitle, examLabel, result, subjects = [] }) {
  const { score, maxMarks, percent, accuracy, correctCount, wrongCount, skippedCount, totalQuestions, rank } = result;
  const grade = percent >= 75 ? "Excellent" : percent >= 50 ? "Good" : percent >= 30 ? "Needs improvement" : "Needs serious attention";
  const gradeColor = percent >= 75 ? "#15a06e" : percent >= 50 ? "#6366f1" : percent >= 30 ? "#f59e0b" : "#ef4444";

  const subjRows = subjects
    .filter((s) => s.total)
    .map(
      (s) => `<tr>
        <td style="padding:7px 10px;border-bottom:1px solid #eef0f5;color:#0d1b3e;font-weight:600">${s.name}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eef0f5;text-align:center;color:#374151">${s.score}/${s.maxMarks}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eef0f5;text-align:center;color:#374151">${s.accuracy}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eef0f5;text-align:center;color:#374151">${s.correct}/${s.total}</td>
      </tr>`
    )
    .join("");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#0d1b3e">
    <h2 style="color:#F47B20;margin:0 0 4px">CollegeParichay</h2>
    <p style="color:#6b7280;font-size:13px;margin:0 0 16px">Test report for your ward${examLabel ? ` · ${examLabel}` : ""}</p>
    <p style="font-size:15px;margin:0 0 14px"><b>${studentName}</b> just completed <b>${testTitle}</b>. Here's how they did:</p>
    <div style="background:#0d1b3e;border-radius:14px;padding:18px;text-align:center;color:#fff;margin-bottom:14px">
      <div style="font-size:12px;opacity:.7">Score</div>
      <div style="font-size:34px;font-weight:800;line-height:1.1">${score}<span style="font-size:16px;opacity:.6">/${maxMarks}</span></div>
      <div style="font-size:13px;opacity:.9">${percent}% · ${accuracy}% accuracy</div>
      <div style="display:inline-block;margin-top:10px;background:${gradeColor};color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:50px">${grade}</div>
      ${rank ? `<div style="font-size:12px;opacity:.85;margin-top:10px">Estimated All-India Rank: <b>~${rank}</b></div>` : ""}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:14px">
      <tr style="background:#f4f6fb">
        <td style="padding:8px 10px;text-align:center;border-radius:8px 0 0 8px"><div style="font-size:20px;font-weight:800;color:#15a06e">${correctCount}</div><div style="font-size:11px;color:#6b7280">Correct</div></td>
        <td style="padding:8px 10px;text-align:center"><div style="font-size:20px;font-weight:800;color:#ef4444">${wrongCount}</div><div style="font-size:11px;color:#6b7280">Wrong</div></td>
        <td style="padding:8px 10px;text-align:center;border-radius:0 8px 8px 0"><div style="font-size:20px;font-weight:800;color:#94a3b8">${skippedCount}</div><div style="font-size:11px;color:#6b7280">Unattempted</div></td>
      </tr>
    </table>
    ${subjRows ? `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">
      <thead><tr style="text-align:left;color:#6b7280;font-size:11px">
        <th style="padding:6px 10px">Subject</th><th style="padding:6px 10px;text-align:center">Marks</th><th style="padding:6px 10px;text-align:center">Accuracy</th><th style="padding:6px 10px;text-align:center">Correct</th>
      </tr></thead><tbody>${subjRows}</tbody></table>` : ""}
    <p style="font-size:12.5px;color:#6b7280;line-height:1.6;margin:0 0 6px">Out of ${totalQuestions} questions, your ward attempted ${correctCount + wrongCount}. Encouraging consistent daily practice helps the most.</p>
    <p style="font-size:11.5px;color:#9ca3af;margin-top:16px">You're receiving this because your email was given as the parent contact for ${studentName}'s mentorship enrolment.</p>
  </div>`;

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
