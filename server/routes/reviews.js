// ─────────────────────────────────────────────────────────────────────────────
// College reviews — student-written hostel & mess reviews for any college.
// Reading is public (anyone can browse reviews); writing requires a logged-in
// user (to blunt spam), though the shown name is whatever the reviewer typed.
// Powers the home "Campus Reviews" section and the 2-minute review popup.
// ─────────────────────────────────────────────────────────────────────────────
import express from "express";
import Review from "../models/Review.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Never let a proxy serve a stale review feed.
router.use((_req, res, next) => { res.set("Cache-Control", "no-store"); next(); });

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Sanitise one hostel/mess block from untrusted input.
function cleanBlock(b) {
  b = b || {};
  return {
    rating: clamp(Number(b.rating) || 0, 0, 5),
    tags: Array.isArray(b.tags)
      ? b.tags.filter((t) => typeof t === "string").slice(0, 12).map((t) => t.trim().slice(0, 40)).filter(Boolean)
      : [],
    text: String(b.text || "").trim().slice(0, 2000),
  };
}

const shape = (r) => ({
  id: String(r._id),
  name: r.name || "Anonymous",
  college: r.college,
  overall: r.overall || 0,
  comment: r.comment || "",
  hostel: { rating: r.hostel?.rating || 0, tags: r.hostel?.tags || [], text: r.hostel?.text || "" },
  mess: { rating: r.mess?.rating || 0, tags: r.mess?.tags || [], text: r.mess?.text || "" },
  at: r.createdAt,
});

// ── GET /api/reviews/colleges — colleges that have reviews, most first ───────
// Returns [{ college, count, avg }] for the browse default + section summary.
router.get("/colleges", async (_req, res) => {
  try {
    const rows = await Review.aggregate([
      { $match: { deleted: { $ne: true } } },
      { $group: {
          _id: "$college",
          count: { $sum: 1 },
          avg: { $avg: { $cond: [{ $gt: ["$overall", 0] }, "$overall", "$$REMOVE"] } },
        } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 500 },
    ]);
    res.json({ colleges: rows.map((r) => ({ college: r._id, count: r.count, avg: r.avg || 0 })) });
  } catch (e) {
    console.error("[reviews/colleges]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── GET /api/reviews?college=NAME — all reviews for one college ──────────────
router.get("/", async (req, res) => {
  try {
    const college = String(req.query.college || "").trim();
    if (!college) return res.json({ reviews: [], count: 0, avg: 0 });
    const docs = await Review.find({ college, deleted: { $ne: true } }).sort({ createdAt: -1 }).limit(200).lean();
    const reviews = docs.map(shape);
    const rated = reviews.map((r) => r.overall).filter(Boolean);
    const avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : 0;
    res.json({ reviews, count: reviews.length, avg });
  } catch (e) {
    console.error("[reviews/list]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /api/reviews — create a review (auth required) ──────────────────────
router.post("/", requireAuth, async (req, res) => {
  try {
    const college = String(req.body?.college || "").trim().slice(0, 200);
    if (!college) return res.status(400).json({ error: "Please choose a college." });

    const name = String(req.body?.name || "").trim().slice(0, 80) || "Anonymous";
    const comment = String(req.body?.comment || "").trim().slice(0, 2000);
    const hostel = cleanBlock(req.body?.hostel);
    const mess = cleanBlock(req.body?.mess);

    // Use the supplied overall, else the average of whatever ratings were given.
    let overall = clamp(Number(req.body?.overall) || 0, 0, 5);
    if (!overall) {
      const xs = [hostel.rating, mess.rating].filter((n) => n > 0);
      overall = xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : 0;
    }
    if (!overall && !hostel.rating && !mess.rating) {
      return res.status(400).json({ error: "Add at least one rating." });
    }

    const doc = await Review.create({
      college, name, authorId: String(req.user.id),
      overall, comment, hostel, mess,
    });
    res.status(201).json({ review: shape(doc.toObject()) });
  } catch (e) {
    console.error("[reviews/create]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
