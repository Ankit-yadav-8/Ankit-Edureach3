import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import otpRoutes from "./routes/otp.js";
import userRoutes from "./routes/users.js";
import cutoffRoutes from "./routes/cutoffs.js";
import paymentRoutes from "./routes/payment.js";
import mentorshipRoutes from "./routes/mentorship.js";
import communityRoutes from "./routes/community.js";
import publicCommunityRoutes from "./routes/publicCommunity.js";
import reviewRoutes from "./routes/reviews.js";
import adminRoutes from "./routes/admin.js";
import adminMentorRoutes from "./routes/adminMentors.js";
import adminAnalyticsRoutes from "./routes/adminAnalytics.js";
import mentorRoutes from "./routes/mentor.js";
import aiRoutes from "./routes/ai.js";
import testRoutes from "./routes/tests.js";
import quizRoutes from "./routes/quiz.js";
import { testPostgresConnection } from "./sql/db.js";
import { startWeeklyReportJob } from "./jobs/weeklyReport.js";
import { startDailyReportJob } from "./jobs/dailyReport.js";
import { startMentorInactivityJob } from "./jobs/mentorInactivityJob.js";
import { backfillPhone10 } from "./jobs/backfillPhone10.js";
import { sanitizeNoSql } from "./middleware/sanitize.js";

dotenv.config();

// ── Startup Security Assertions ──────────────────────────────────────────
const REQUIRED_SECRETS = ["JWT_SECRET", "ADMIN_KEY"];
for (const secret of REQUIRED_SECRETS) {
  if (!process.env[secret]) {
    if (process.env.NODE_ENV === "production") {
      console.error(`❌ FATAL: Missing required security environment variable: ${secret}`);
      process.exit(1);
    } else {
      console.warn(`⚠️  SECURITY WARNING: Missing environment variable: ${secret}. Set this in server/.env`);
    }
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);
// Don't advertise the framework — one less hint for an attacker.
app.disable("x-powered-by");

// ── Security headers (helmet-equivalent, no extra dependency) ──────────────
// This is a JSON API: it never serves HTML or scripts, so the strictest CSP
// (`default-src 'none'`) is safe and ideal here.
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Origin-Agent-Cluster", "?1");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  next();
});

// The AI proxy carries chat history (and optionally uploaded note text), so it
// needs a roomier body than the rest of the API — parse it first, then the
// strict 16kb parser below becomes a no-op for these requests.
app.use("/api/ai", express.json({ limit: "2mb" }));

// Test papers carry many parsed questions, so they need a roomier body than the
// strict 16kb parser below (which then no-ops for these requests).
app.use("/api/tests", express.json({ limit: "2mb" }));

// The mentorship dashboard sync stores a whole study-data blob (logs, tests,
// backlog, tasks), which can exceed 16kb — parse it with a roomier limit first.
app.use("/api/mentorship", express.json({ limit: "512kb" }));

// Reject oversized payloads early — these endpoints only ever take small JSON.
app.use(express.json({ limit: "16kb" }));

// Sanitize all request payloads to prevent NoSQL query operator injection
app.use(sanitizeNoSql);

// Build allowed origins list: always include localhost for development
const envOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
const DEV_ORIGINS = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];
const allowedOrigins = [...new Set([...envOrigins, ...DEV_ORIGINS])];

// `credentials: true` means a permissive origin check lets ANY site make
// authenticated cross-origin calls with a logged-in user's token. Outside
// development, we explicitly allow known trusted production domains (CampusPoint,
// Vercel preview/production deployments) and origins configured in CLIENT_ORIGIN.
const IS_PROD = process.env.NODE_ENV === "production";
if (IS_PROD && envOrigins.length === 0) {
  console.log("[cors] CLIENT_ORIGIN not explicitly set — allowing trusted production domains (campuspoint.in, *.vercel.app).");
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  try {
    const parsed = new URL(origin);
    const host = parsed.hostname.toLowerCase();
    // Allow CampusPoint domains, Vercel deployments, Render hosts, and local dev
    if (
      host === "campuspoint.in" ||
      host.endsWith(".campuspoint.in") ||
      host === "vercel.app" ||
      host.endsWith(".vercel.app") ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".onrender.com")
    ) {
      return true;
    }
  } catch {
    return false;
  }

  if (!IS_PROD && (envOrigins.includes("*") || envOrigins.length === 0)) {
    return true;
  }

  return false;
}

app.use(cors({
  origin: (origin, cb) => {
    // No Origin header: curl, mobile apps, same-origin server calls. These
    // aren't browser cross-origin requests, so CORS isn't the control here.
    if (isOriginAllowed(origin)) {
      return cb(null, true);
    }
    console.warn(`[cors blocked] origin: ${origin}`);
    cb(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Real client IP resolver behind reverse proxies (Cloudflare, Render, Nginx, Vercel)
function getClientIp(req) {
  const cf = req.headers["cf-connecting-ip"];
  if (cf && typeof cf === "string") return cf.split(",")[0].trim();
  const real = req.headers["x-real-ip"];
  if (real && typeof real === "string") return real.split(",")[0].trim();
  const fwd = req.headers["x-forwarded-for"];
  if (fwd && typeof fwd === "string") {
    const first = fwd.split(",")[0].trim();
    if (first) return first;
  }
  return req.ip || req.socket?.remoteAddress || "127.0.0.1";
}

const rl = (opts) => rateLimit({
  standardHeaders: true,   // emit RateLimit-* + Retry-After headers
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a moment and try again." },
  keyGenerator: (req) => getClientIp(req),
  validate: { trustProxy: false, xForwardedForHeader: false },
  ...opts,
});

// Dedicated login rate limiter: evaluates per (IP + Account Email)
// - skipSuccessfulRequests: true means successful logins NEVER count against the quota!
// - Keyed per user account so students sharing the same hostel/coaching Wi-Fi never block each other!
const loginLimiter = rl({
  windowMs: 15 * 60 * 1000,
  max: 60,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `${getClientIp(req)}_${String(req.body?.email || "").toLowerCase().trim()}`,
  message: { error: "Too many login attempts for this account. Please wait a moment and try again." },
});

// Rate limiter for signup (30 per hour per IP)
const signupLimiter = rl({
  windowMs: 60 * 60 * 1000,
  max: 30,
  skipSuccessfulRequests: true,
  message: { error: "Too many accounts created. Please try again later." },
});

// Rate limiter for password resets (20 per 15 min per account)
const passwordResetLimiter = rl({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => `${getClientIp(req)}_${String(req.body?.email || "").toLowerCase().trim()}`,
  message: { error: "Too many password reset requests. Please wait a moment." },
});

// Rate limiter for OTP send (25 requests per 15 min per account)
const otpSendLimiter = rl({
  windowMs: 15 * 60 * 1000,
  max: 25,
  keyGenerator: (req) => `${getClientIp(req)}_${String(req.body?.email || "").toLowerCase().trim()}`,
  message: { error: "Too many OTP requests. Please wait a moment and try again." },
});

// Rate limiter for OTP verify (50 requests per 15 min per account, skips successful requests)
const otpVerifyLimiter = rl({
  windowMs: 15 * 60 * 1000,
  max: 50,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `${getClientIp(req)}_${String(req.body?.email || "").toLowerCase().trim()}`,
  message: { error: "Too many incorrect OTP attempts. Please wait a moment and try again." },
});

// Strict general gate for admin routes to stop automated scanning (100 per 15 min)
const adminGateLimiter = rl({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Admin access rate limit reached — please wait a moment." },
});

// Generous per-minute limit for authenticated traffic / browsing (300 requests/minute)
const apiLimiter = rl({
  windowMs: 60 * 1000,
  max: 300,
  message: { error: "Too many requests. Please wait a moment." },
});

app.get("/", (_req, res) => res.send("EduReach API ✅"));

// ── Health-check (used by Render keep-alive & external monitors) ─────────────
app.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// Specific credential action rate limiting:
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/signup", signupLimiter);
app.use("/api/auth/forgot", passwordResetLimiter);
app.use("/api/auth/verify-reset-otp", passwordResetLimiter);
app.use("/api/auth/reset", passwordResetLimiter);
app.use("/api/mentor/login", loginLimiter);
app.use("/api/otp/send", otpSendLimiter);
app.use("/api/otp/verify", otpVerifyLimiter);

// General auth & OTP endpoints take apiLimiter (300/min) so /me, /profile, /refresh are never choked
app.use("/api/auth", apiLimiter, authRoutes);
app.use("/api/otp", apiLimiter, otpRoutes);

// Mounted BEFORE /api/admin: Express matches prefixes in order, so the broader
// /api/admin mount would otherwise catch these first and subject mentor
// management (ordinary data traffic) to the strict login rate limit.
app.use("/api/admin/mentors", apiLimiter, adminMentorRoutes);
app.use("/api/admin/analytics", apiLimiter, adminAnalyticsRoutes);
app.use("/api/admin", adminGateLimiter, adminRoutes);

// Mentor portal routes take apiLimiter (300/min) so mentors are never blocked during normal workflow
app.use("/api/mentor", apiLimiter, mentorRoutes);
app.use("/api/users", apiLimiter, userRoutes);
app.use("/api/cutoffs", apiLimiter, cutoffRoutes);
app.use("/api/payment", apiLimiter, paymentRoutes);
app.use("/api/payments", apiLimiter, paymentRoutes);
app.use("/api/mentorship", apiLimiter, mentorshipRoutes);
app.use("/api/community", apiLimiter, communityRoutes);
app.use("/api/public-community", apiLimiter, publicCommunityRoutes);
app.use("/api/reviews", apiLimiter, reviewRoutes);
// AI assistant — moderate per-minute cap (streaming replies are expensive).
const aiLimiter = rl({ windowMs: 60 * 1000, max: 30 });
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/tests", apiLimiter, testRoutes);
app.use("/api/quiz", apiLimiter, quizRoutes);

// Centralized 404 handler for unmatched API routes
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Centralized production-safe error handler (no stack trace or internal leaks)
app.use((err, _req, res, _next) => {
  console.error("[server-error]", err?.message || err);
  const status = Number(err.status || err.statusCode || 500);
  const message = IS_PROD && status === 500
    ? "An internal server error occurred"
    : (err.message || "Something went wrong");
  res.status(status).json({ error: message });
});

connectDB()
  .then(() => {
    testPostgresConnection();
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server on http://0.0.0.0:${PORT}`));

    // Keep Render container warm to eliminate 30–50s cold-start delays for OTP and API calls
    const pingTarget = process.env.RENDER_EXTERNAL_URL || (IS_PROD ? "https://ankit-edureach3.onrender.com" : null);
    if (pingTarget) {
      setInterval(() => {
        fetch(`${pingTarget}/health`, { method: "GET" }).catch(() => {});
      }, 9 * 60 * 1000); // ping every 9 minutes
    }
    startWeeklyReportJob(); // weekly parent progress emails (best-effort, dev-safe)
    startDailyReportJob();  // daily parent progress emails from synced data (dev-safe)
    startMentorInactivityJob(); // automated 9 PM – 10 PM IST mentor daily check-in (dev-safe)
    backfillPhone10();      // one-time; no-op once every enrolment has the field
  })
  .catch((e) => { console.error("❌ DB error:", e.message); process.exit(1); });
