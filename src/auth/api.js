export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function req(path, { method = "GET", body, token } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60 s — Render free tier can take 30–50 s to cold-start

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
    if (!res.ok) {
      const err = new Error(data.error || "Something went wrong");
      err.status = res.status;
      err.data = data;
      throw err;
    }
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
export const apiUpdateProfile = (token, b) => req("/api/auth/profile", { method: "PATCH", body: b, token });
export const apiForgot    = (b) => req("/api/auth/forgot", { method: "POST", body: b });
export const apiReset     = (b) => req("/api/auth/reset",  { method: "POST", body: b });
export const apiSendOtp   = (b) => req("/api/otp/send",    { method: "POST", body: b });
export const apiVerifyOtp = (b) => req("/api/otp/verify",  { method: "POST", body: b });
export const apiMyEnrollments = (token) => req("/api/payment/my-enrollments", { token });
export const apiSendParentReport = (token, b) => req("/api/mentorship/parent-report", { method: "POST", body: b, token });

// ── Community (per-batch doubt forum) ───────────────────────────────────────
export const apiCommunityMe        = (token) => req("/api/community/me", { token });
export const apiCommunityMembers   = (token) => req("/api/community/members", { token });
export const apiCommunityFeed      = (token, tab = "all") => req(`/api/community/feed?tab=${tab}`, { token });
export const apiCommunityCreatePost = (token, b) => req("/api/community/posts", { method: "POST", body: b, token });
export const apiCommunityDeletePost = (token, id) => req(`/api/community/posts/${id}`, { method: "DELETE", token });
export const apiCommunityLikePost  = (token, id) => req(`/api/community/posts/${id}/like`, { method: "POST", token });
export const apiCommunityReplies   = (token, id) => req(`/api/community/posts/${id}/replies`, { token });
export const apiCommunityReply     = (token, id, b) => req(`/api/community/posts/${id}/replies`, { method: "POST", body: b, token });
export const apiCommunityLikeReply = (token, id) => req(`/api/community/replies/${id}/like`, { method: "POST", token });
export const apiCommunitySignUpload = (token) => req("/api/community/sign-upload", { method: "POST", body: {}, token });