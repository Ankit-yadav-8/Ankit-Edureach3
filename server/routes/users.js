import express from "express";
import User from "../models/User.js";
import { requireAdmin } from "../middleware/admin.js";
const router = express.Router();

router.get("/count", requireAdmin, async (_req, res) => {
  res.json({ total: await User.countDocuments() });
});
router.get("/", requireAdmin, async (_req, res) => {
  const users = await User.find().select("-passwordHash -resetTokenHash").sort({ createdAt: -1 }).limit(5000).lean();
  res.json({ total: users.length, users });
});
router.get("/export.csv", requireAdmin, async (_req, res) => {
  const users = await User.find().select("-passwordHash -resetTokenHash").sort({ createdAt: -1 }).lean();
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = "Name,Email,Phone,Joined,Last Login\n";
  const rows = users.map((u) => [u.name, u.email, u.phone, u.createdAt?.toISOString(), u.lastLogin?.toISOString()].map(esc).join(",")).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=edureach-users.csv");
  res.send(head + rows);
});
export default router;
