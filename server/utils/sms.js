// Sends an SMS. In dev mode it just logs to the server console.
// For real SMS in India, set MSG91_AUTHKEY (and OTP_DEV_MODE=false).
export async function sendSMS(phone, message) {
  if (process.env.OTP_DEV_MODE !== "false" || !process.env.MSG91_AUTHKEY) {
    console.log(`\n[DEV SMS] to +91${phone}: ${message}\n`);
    return { dev: true };
  }
  try {
    const url = `https://api.msg91.com/api/sendhttp.php?authkey=${process.env.MSG91_AUTHKEY}` +
      `&mobiles=91${phone}&message=${encodeURIComponent(message)}&sender=${process.env.MSG91_SENDER || "EDUREA"}&route=4&country=91`;
    await fetch(url);
    return { dev: false };
  } catch (e) {
    console.error("SMS send failed:", e.message);
    return { dev: false, error: true };
  }
}
