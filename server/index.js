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
import aiRoutes from "./routes/ai.js";
import { startWeeklyReportJob } from "./jobs/weeklyReport.js";

dotenv.config();
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
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  next();
});

// The AI proxy carries chat history (and optionally uploaded note text), so it
// needs a roomier body than the rest of the API — parse it first, then the
// strict 16kb parser below becomes a no-op for these requests.
app.use("/api/ai", express.json({ limit: "2mb" }));

// Reject oversized payloads early — these endpoints only ever take small JSON.
app.use(express.json({ limit: "16kb" }));

// Build allowed origins list: always include localhost for development
const envOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
const DEV_ORIGINS = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];
const allowedOrigins = [...new Set([...envOrigins, ...DEV_ORIGINS])];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, mobile apps, same-origin server calls)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin) || envOrigins.includes("*") || envOrigins.length === 0)
      return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

const rl = (opts) => rateLimit({
  standardHeaders: true,   // emit RateLimit-* + Retry-After headers
  legacyHeaders: false,
  message: { error: "Too many requests — please wait a moment and try again." },
  ...opts,
});

// Tight limit on credential/code endpoints to blunt brute-force & abuse.
const authLimiter    = rl({ windowMs: 15 * 60 * 1000, max: 30 });
// Generous per-minute limit for read/payment traffic — enough for normal use,
// low enough to stop scraping or admin-key guessing.
const apiLimiter     = rl({ windowMs: 60 * 1000, max: 120 });

app.get("/", (_req, res) => res.send("EduReach API ✅"));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/otp", authLimiter, otpRoutes);
app.use("/api/admin", authLimiter, adminRoutes);
app.use("/api/users", apiLimiter, userRoutes);
app.use("/api/cutoffs", apiLimiter, cutoffRoutes);
app.use("/api/payment", apiLimiter, paymentRoutes);
app.use("/api/mentorship", apiLimiter, mentorshipRoutes);
app.use("/api/community", apiLimiter, communityRoutes);
app.use("/api/public-community", apiLimiter, publicCommunityRoutes);
app.use("/api/reviews", apiLimiter, reviewRoutes);
// AI assistant — moderate per-minute cap (streaming replies are expensive).
const aiLimiter = rl({ windowMs: 60 * 1000, max: 30 });
app.use("/api/ai", aiLimiter, aiRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
    startWeeklyReportJob(); // weekly parent progress emails (best-effort, dev-safe)
  })
  .catch((e) => { console.error("❌ DB error:", e.message); process.exit(1); });