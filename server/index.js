import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import otpRoutes from "./routes/otp.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
const origins = (process.env.CLIENT_ORIGIN || "*").split(",").map((s) => s.trim());
app.use(cors({ origin: origins.includes("*") ? "*" : origins }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false });

app.get("/", (_req, res) => res.send("EduReach Auth API ✅"));
app.use("/api/auth", limiter, authRoutes);
app.use("/api/otp", limiter, otpRoutes);
app.use("/api/users", userRoutes);

connectDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`)))
  .catch((e) => { console.error("❌ DB error:", e.message); process.exit(1); });
