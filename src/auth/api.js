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
// `plan` scopes the call to ONE of the student's batches (they may belong to
// several). It's optional — the server falls back to the most recent batch —
// and is always re-verified server-side against what the user actually owns.
const batchQ = (plan, extra = "") => {
  const parts = [];
  if (plan) parts.push(`plan=${encodeURIComponent(plan)}`);
  if (extra) parts.push(extra);
  return parts.length ? `?${parts.join("&")}` : "";
};

export const apiCommunityMe        = (token, plan) => req(`/api/community/me${batchQ(plan)}`, { token });
export const apiCommunityMembers   = (token, plan) => req(`/api/community/members${batchQ(plan)}`, { token });
export const apiCommunityFeed      = (token, tab = "all", plan, subject) =>
  req(`/api/community/feed${batchQ(plan, `tab=${tab}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`)}`, { token });
export const apiCommunityCreatePost = (token, b, plan) => req(`/api/community/posts${batchQ(plan)}`, { method: "POST", body: b, token });
export const apiCommunityDeletePost = (token, id, plan) => req(`/api/community/posts/${id}${batchQ(plan)}`, { method: "DELETE", token });
export const apiCommunityLikePost  = (token, id, plan) => req(`/api/community/posts/${id}/like${batchQ(plan)}`, { method: "POST", token });
export const apiCommunityReplies   = (token, id, plan) => req(`/api/community/posts/${id}/replies${batchQ(plan)}`, { token });
export const apiCommunityReply     = (token, id, b, plan) => req(`/api/community/posts/${id}/replies${batchQ(plan)}`, { method: "POST", body: b, token });
export const apiCommunityLikeReply = (token, id, plan) => req(`/api/community/replies/${id}/like${batchQ(plan)}`, { method: "POST", token });
export const apiCommunitySignUpload = (token, plan) => req(`/api/community/sign-upload${batchQ(plan)}`, { method: "POST", body: {}, token });

// ── Public community (open to free, enrolled & not-enrolled users) ──────────
export const apiPublicMe          = (token) => req("/api/public-community/me", { token });
export const apiPublicFeed        = (token, tab = "all", subject, category) =>
  req(`/api/public-community/feed?tab=${tab}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}${category ? `&category=${encodeURIComponent(category)}` : ""}`, { token });
export const apiPublicCreatePost  = (token, b) => req("/api/public-community/posts", { method: "POST", body: b, token });
export const apiPublicDeletePost  = (token, id) => req(`/api/public-community/posts/${id}`, { method: "DELETE", token });
export const apiPublicLikePost    = (token, id) => req(`/api/public-community/posts/${id}/like`, { method: "POST", token });
export const apiPublicReplies     = (token, id) => req(`/api/public-community/posts/${id}/replies`, { token });
export const apiPublicReply       = (token, id, b) => req(`/api/public-community/posts/${id}/replies`, { method: "POST", body: b, token });
export const apiPublicLikeReply   = (token, id) => req(`/api/public-community/replies/${id}/like`, { method: "POST", token });
export const apiPublicSignUpload  = (token) => req("/api/public-community/sign-upload", { method: "POST", body: {}, token });

// ── Test series (CBT) ───────────────────────────────────────────────────────
// Admin endpoints use the x-admin-token header (passed via `adminToken`); the
// student endpoints use the normal Bearer token and are scoped to the batch.
function adminReq(path, adminToken, { method = "GET", body } = {}) {
  return fetch(API_BASE + path, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
    cache: "no-store",
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { const e = new Error(data.error || `Server error ${res.status}`); e.status = res.status; throw e; }
    return data;
  });
}

export const apiAdminTestSignUpload = (adminToken, plan) => adminReq("/api/tests/admin/sign-upload", adminToken, { method: "POST", body: { plan } });
export const apiAdminTestParse      = (adminToken, b) => adminReq("/api/tests/admin/parse", adminToken, { method: "POST", body: b });
export const apiAdminTestCreate     = (adminToken, b) => adminReq("/api/tests/admin", adminToken, { method: "POST", body: b });
export const apiAdminTestList       = (adminToken, plan, category) => adminReq(`/api/tests/admin${batchQ(plan, category ? `category=${category}` : "")}`, adminToken);
export const apiAdminTestDelete     = (adminToken, id) => adminReq(`/api/tests/admin/${id}`, adminToken, { method: "DELETE" });

export const apiTestList        = (token, plan, category) => req(`/api/tests${batchQ(plan, category ? `category=${category}` : "")}`, { token });
export const apiTestGet         = (token, id, plan) => req(`/api/tests/${id}${batchQ(plan)}`, { token });
export const apiTestSubmit      = (token, id, b, plan) => req(`/api/tests/${id}/submit${batchQ(plan)}`, { method: "POST", body: b, token });
export const apiTestResult      = (token, id, plan) => req(`/api/tests/${id}/result${batchQ(plan)}`, { token });
export const apiTestPerformance = (token, plan) => req(`/api/tests/performance${batchQ(plan)}`, { token });

// ── College reviews (hostel & mess) — reading is public, writing needs auth ──
export const apiReviewColleges   = () => req("/api/reviews/colleges");
export const apiReviewsForCollege = (college) => req(`/api/reviews?college=${encodeURIComponent(college)}`);
export const apiCreateReview     = (token, b) => req("/api/reviews", { method: "POST", body: b, token });