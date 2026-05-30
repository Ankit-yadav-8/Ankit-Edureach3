import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import otpRoutes from "./routes/otp.js";
import userRoutes from "./routes/users.js";
import cutoffRoutes from "./routes/cutoffs.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

app.use(express.json());

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

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false });

app.get("/", (_req, res) => res.send("EduReach API ✅"));
app.use("/api/auth", limiter, authRoutes);
app.use("/api/otp", limiter, otpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cutoffs", cutoffRoutes);

connectDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`)))
  .catch((e) => { console.error("❌ DB error:", e.message); process.exit(1); });