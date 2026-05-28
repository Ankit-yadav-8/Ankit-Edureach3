export async function sendOtpEmail(email, code) {
  const devMode = process.env.OTP_DEV_MODE !== "false";
  if (devMode || !process.env.SMTP_HOST) {
    console.log(`\n[DEV EMAIL] to ${email}\n  Code: ${code}\n`);
    return { dev: true };
  }
  try {
    const { default: nodemailer } = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,   // ← always false for Brevo port 587
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transport.sendMail({
      from: process.env.SMTP_FROM || `EduReach <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your EduReach verification code",
      text: `Your EduReach verification code is ${code}. Valid for 5 minutes.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#F47B20;margin:0 0 8px">EduReach</h2>
        <p style="color:#333;font-size:15px">Your verification code is:</p>
        <div style="font-size:32px;font-weight:800;letter-spacing:8px;color:#1c1c28;margin:12px 0">${code}</div>
        <p style="color:#888;font-size:13px">Valid for 5 minutes. If you didn't request this, ignore this email.</p>
      </div>`,
    });
    return { dev: false };
  } catch (e) {
    console.error("Email send failed:", e.message);
    console.log(`\n[EMAIL FALLBACK] to ${email}: code ${code}\n`);
    return { dev: true, error: true };
  }
}