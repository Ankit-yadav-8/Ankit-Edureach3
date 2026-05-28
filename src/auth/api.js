export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function req(path, { method = "GET", body, token } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const res = await fetch(API_BASE + path, {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    clearTimeout(timeout);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
  } catch (e) {
    clearTimeout(timeout);
    if (e.name === "AbortError") throw new Error("Request timed out — server may be waking up, please try again");
    throw e;
  }
}

export const apiSignup    = (b) => req("/api/auth/signup", { method: "POST", body: b });
export const apiLogin     = (b) => req("/api/auth/login",  { method: "POST", body: b });
export const apiMe        = (token) => req("/api/auth/me", { token });
export const apiForgot    = (b) => req("/api/auth/forgot", { method: "POST", body: b });
export const apiReset     = (b) => req("/api/auth/reset",  { method: "POST", body: b });
export const apiSendOtp   = (b) => req("/api/otp/send",    { method: "POST", body: b });
export const apiVerifyOtp = (b) => req("/api/otp/verify",  { method: "POST", body: b });