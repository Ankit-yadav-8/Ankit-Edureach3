import express from "express";
import User from "../models/User.js";
import { requireAdmin } from "../middleware/admin.js";
const router = express.Router();

// Admin data must always be live — never let the browser/proxy serve a stale list.
router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  next();
});

router.get("/count", requireAdmin, async (_req, res) => {
  try {
    res.json({ total: await User.countDocuments() });
  } catch (e) { console.error("[users/count]", e.message); res.status(500).json({ error: "Server error" }); }
});

router.get("/", requireAdmin, async (_req, res) => {
  try {
    // No cap — must return every user so the portal matches the CSV export exactly.
    // (A limit here silently dropped the oldest signups from the table while they
    //  still appeared in the full CSV, making old records look "missing".)
    const users = await User.find().select("-passwordHash -resetTokenHash").sort({ createdAt: -1 }).lean();
    res.json({ total: users.length, users });
  } catch (e) { console.error("[users/list]", e.message); res.status(500).json({ error: "Server error" }); }
});

router.get("/export.csv", requireAdmin, async (_req, res) => {
  try {
    const users = await User.find().select("-passwordHash -resetTokenHash").sort({ createdAt: -1 }).lean();
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = "Name,Email,Phone,Coaching,Class,NEET Rank,Joined,Last Login\n";
    const rows = users.map((u) => [
      u.name, u.email, u.phone, u.coaching,
      u.studentClass, u.neetRank,
      u.createdAt?.toISOString(), u.lastLogin?.toISOString(),
    ].map(esc).join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=collegeparichay-users.csv");
    res.send(head + rows);
  } catch (e) { console.error("[users/export]", e.message); res.status(500).json({ error: "Server error" }); }
});

export default router;
