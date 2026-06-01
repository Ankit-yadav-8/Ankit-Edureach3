export async function sendOtpEmail(email, code) {
  const devMode = process.env.OTP_DEV_MODE !== "false";
  if (devMode || !process.env.BREVO_API_KEY) {
    console.log(`\n[DEV EMAIL] to ${email}\n  Code: ${code}\n`);
    return { dev: true };
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "CollegeParichay", email: process.env.SMTP_FROM_EMAIL },
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
      throw new Error(`Brevo API error: ${err}`);
    }
    return { dev: false };
  } catch (e) {
    console.error("Email send failed:", e.message);
    console.log(`\n[EMAIL FALLBACK] to ${email}: code ${code}\n`);
    return { dev: true, error: true };
  }
}