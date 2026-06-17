// ─────────────────────────────────────────────────────────────────────────────
// Community routes — per-batch doubt forum.
// Every route is gated by requireAuth + requireBatch, so the student is always
// scoped to their own paid mentorship batch (req.batch.plan). Posts/replies can
// carry text and Cloudinary-hosted images/videos; "highlights" surface pinned
// announcements and the most-engaged doubts.
// ─────────────────────────────────────────────────────────────────────────────
import express from "express";
import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";
import CommunityPost from "../models/CommunityPost.js";
import CommunityReply from "../models/CommunityReply.js";
import { requireAuth } from "../middleware/auth.js";
import { requireBatch } from "../middleware/batchGuard.js";
import { requireAdmin } from "../middleware/admin.js";
import { signUpload, cloudinaryReady, isOurCloudinaryUrl } from "../utils/cloudinary.js";
import { planLabel, batchLabelFor, validUntilFor, examFor } from "../utils/plans.js";

const router = express.Router();
const isId = (v) => mongoose.Types.ObjectId.isValid(v);

// Community data is always live — never let a proxy serve a stale feed.
router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// ── GET /health — public: does THIS running server have media uploads set up? ─
// Visit https://<your-api-host>/api/community/health to confirm the deployed
// process actually sees the CLOUDINARY_* env vars. No secrets are exposed.
router.get("/health", (_req, res) => {
  res.json({ ok: true, cloudinaryReady: cloudinaryReady() });
});

// ── shapers: strip internal fields, compute per-viewer flags ────────────────
const shapePost = (p, meId) => ({
  id: String(p._id),
  authorName: p.authorName,
  studentId: p.studentId,
  isMine: String(p.authorId) === String(meId),
  text: p.text || "",
  media: (p.media || []).map((m) => ({ url: m.url, type: m.type, width: m.width, height: m.height, poster: m.poster })),
  tag: p.tag,
  subject: p.subject || "",
  pinned: !!p.pinned,
  likeCount: (p.likes || []).length,
  likedByMe: (p.likes || []).map(String).includes(String(meId)),
  replyCount: p.replyCount || 0,
  createdAt: p.createdAt,
  lastReplyAt: p.lastReplyAt,
});

const shapeReply = (r, meId) => ({
  id: String(r._id),
  postId: String(r.postId),
  authorName: r.authorName,
  studentId: r.studentId,
  isMine: String(r.authorId) === String(meId),
  text: r.text || "",
  media: (r.media || []).map((m) => ({ url: m.url, type: m.type, width: m.width, height: m.height, poster: m.poster })),
  likeCount: (r.likes || []).length,
  likedByMe: (r.likes || []).map(String).includes(String(meId)),
  createdAt: r.createdAt,
});

// Keep only media that lives on our own Cloudinary account (cap at 6).
function cleanMedia(media) {
  if (!Array.isArray(media)) return [];
  return media
    .slice(0, 6)
    .map((m) => ({
      url: String(m?.url || ""),
      type: m?.type === "video" ? "video" : "image",
      width: Number(m?.width) || undefined,
      height: Number(m?.height) || undefined,
      poster: m?.poster ? String(m.poster) : undefined,
    }))
    .filter((m) => isOurCloudinaryUrl(m.url) && (!m.poster || isOurCloudinaryUrl(m.poster)));
}

// ── GET /me — the student's batch identity (also used by the ID card) ───────
router.get("/me", requireAuth, requireBatch, async (req, res) => {
  try {
    const { plan } = req.batch;
    const batchmateCount = await Enrollment.countDocuments({ status: "paid", plan });

    // Every mentorship batch this student belongs to — powers the in-community
    // batch switcher when they're enrolled in more than one plan.
    const mine = await Enrollment.find({
      status: "paid",
      email: req.batch.email,
      plan: { $regex: /^mentor-/ },
    }).select("plan").sort({ createdAt: -1 }).lean();
    const seen = new Set();
    const allBatches = [];
    for (const e of mine) {
      if (seen.has(e.plan)) continue;
      seen.add(e.plan);
      allBatches.push({ plan: e.plan, batchLabel: batchLabelFor(e.plan), exam: examFor(e.plan) });
    }

    res.json({
      studentId: req.batch.studentId,
      name: req.batch.name,
      plan,
      planLabel: planLabel(plan),
      batchLabel: batchLabelFor(plan),
      exam: examFor(plan),
      enrolledOn: req.batch.createdAt,
      validUntil: validUntilFor(plan, req.batch.createdAt),
      status: "active",
      batchmateCount,
      allBatches,
      cloudinaryReady: cloudinaryReady(),
    });
  } catch (e) {
    console.error("[community/me]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── GET /members — batchmates (privacy-safe: name + ID + join date only) ────
router.get("/members", requireAuth, requireBatch, async (req, res) => {
  try {
    const { plan } = req.batch;
    const rows = await Enrollment.find({ status: "paid", plan })
      .select("name studentId createdAt")
      .sort({ createdAt: 1 })
      .limit(500)
      .lean();
    const members = rows.map((r) => {
      const parts = String(r.name || "Student").trim().split(/\s+/);
      const display = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
      return { name: display, studentId: r.studentId || "", joinedOn: r.createdAt };
    });
    res.json({ batchLabel: batchLabelFor(plan), count: members.length, members });
  } catch (e) {
    console.error("[community/members]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── GET /feed?tab=all|highlights|unanswered&subject=… — the batch feed ──────
const FEED_TABS = new Set(["all", "highlights", "unanswered"]);
router.get("/feed", requireAuth, requireBatch, async (req, res) => {
  try {
    const tab = FEED_TABS.has(req.query.tab) ? req.query.tab : "all";
    const subject = String(req.query.subject || "").trim().slice(0, 40);

    const q = { plan: req.batch.plan, deleted: { $ne: true } };
    if (subject) q.subject = subject;

    const docs = await CommunityPost.find(q)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    let posts = docs.map((p) => shapePost(p, req.batch.userId));

    const score = (p) => p.likeCount * 2 + p.replyCount * 3;
    if (tab === "highlights") {
      posts = posts
        .filter((p) => p.pinned || p.likeCount > 0 || p.replyCount > 0)
        .sort((a, b) => Number(b.pinned) - Number(a.pinned) || score(b) - score(a) || new Date(b.createdAt) - new Date(a.createdAt));
    } else if (tab === "unanswered") {
      // Open doubts a mentor or peer can still pick up — no replies yet.
      posts = posts
        .filter((p) => p.tag === "doubt" && (p.replyCount || 0) === 0 && !p.pinned)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // pinned announcements float to the top, then newest-first.
      posts.sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ posts, tab, serverTime: Date.now() });
  } catch (e) {
    console.error("[community/feed]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /posts — create a post (doubt / discussion / resource) ─────────────
router.post("/posts", requireAuth, requireBatch, async (req, res) => {
  try {
    const text = String(req.body?.text || "").trim().slice(0, 4000);
    const media = cleanMedia(req.body?.media);
    if (!text && !media.length) return res.status(400).json({ error: "Write something or attach a photo / video." });

    const TAGS = ["doubt", "discussion", "resource"];
    const tag = TAGS.includes(req.body?.tag) ? req.body.tag : "doubt";
    const subject = String(req.body?.subject || "").trim().slice(0, 40);

    const doc = await CommunityPost.create({
      plan: req.batch.plan,
      authorId: req.batch.userId,
      authorName: req.batch.name,
      studentId: req.batch.studentId,
      text,
      media,
      tag,
      subject,
    });
    res.status(201).json({ post: shapePost(doc.toObject(), req.batch.userId) });
  } catch (e) {
    console.error("[community/posts:create]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── DELETE /posts/:id — author removes their own post (soft delete) ─────────
router.delete("/posts/:id", requireAuth, requireBatch, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const post = await CommunityPost.findOne({ _id: req.params.id, plan: req.batch.plan });
    if (!post || post.deleted) return res.status(404).json({ error: "Not found" });
    if (String(post.authorId) !== req.batch.userId) return res.status(403).json({ error: "You can only delete your own posts." });
    post.deleted = true;
    await post.save();
    res.json({ ok: true });
  } catch (e) {
    console.error("[community/posts:delete]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /posts/:id/like — toggle upvote ────────────────────────────────────
router.post("/posts/:id/like", requireAuth, requireBatch, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const post = await CommunityPost.findOne({ _id: req.params.id, plan: req.batch.plan });
    if (!post || post.deleted) return res.status(404).json({ error: "Not found" });
    const me = req.batch.userId;
    const i = post.likes.map(String).indexOf(me);
    if (i >= 0) post.likes.splice(i, 1);
    else post.likes.push(me);
    await post.save();
    res.json({ likeCount: post.likes.length, likedByMe: i < 0 });
  } catch (e) {
    console.error("[community/posts:like]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── GET /posts/:id/replies ──────────────────────────────────────────────────
router.get("/posts/:id/replies", requireAuth, requireBatch, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const replies = await CommunityReply.find({ postId: req.params.id, plan: req.batch.plan, deleted: { $ne: true } })
      .sort({ createdAt: 1 })
      .limit(300)
      .lean();
    res.json({ replies: replies.map((r) => shapeReply(r, req.batch.userId)) });
  } catch (e) {
    console.error("[community/replies:list]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /posts/:id/replies — answer a doubt ────────────────────────────────
router.post("/posts/:id/replies", requireAuth, requireBatch, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const post = await CommunityPost.findOne({ _id: req.params.id, plan: req.batch.plan });
    if (!post || post.deleted) return res.status(404).json({ error: "Not found" });

    const text = String(req.body?.text || "").trim().slice(0, 4000);
    const media = cleanMedia(req.body?.media);
    if (!text && !media.length) return res.status(400).json({ error: "Write a reply or attach a photo / video." });

    const doc = await CommunityReply.create({
      postId: post._id,
      plan: req.batch.plan,
      authorId: req.batch.userId,
      authorName: req.batch.name,
      studentId: req.batch.studentId,
      text,
      media,
    });
    post.replyCount = (post.replyCount || 0) + 1;
    post.lastReplyAt = new Date();
    await post.save();
    res.status(201).json({ reply: shapeReply(doc.toObject(), req.batch.userId), replyCount: post.replyCount });
  } catch (e) {
    console.error("[community/replies:create]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /replies/:id/like — toggle upvote on a reply ───────────────────────
router.post("/replies/:id/like", requireAuth, requireBatch, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const reply = await CommunityReply.findOne({ _id: req.params.id, plan: req.batch.plan });
    if (!reply || reply.deleted) return res.status(404).json({ error: "Not found" });
    const me = req.batch.userId;
    const i = reply.likes.map(String).indexOf(me);
    if (i >= 0) reply.likes.splice(i, 1);
    else reply.likes.push(me);
    await reply.save();
    res.json({ likeCount: reply.likes.length, likedByMe: i < 0 });
  } catch (e) {
    console.error("[community/replies:like]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /sign-upload — short-lived Cloudinary signature for direct upload ───
router.post("/sign-upload", requireAuth, requireBatch, (req, res) => {
  if (!cloudinaryReady()) return res.status(503).json({ error: "Media uploads are not configured yet." });
  res.json(signUpload({ folder: `community/${req.batch.plan}` }));
});

// ── POST /admin/posts/:id/pin — pin/unpin an announcement (admin 2FA only) ──
// Used to "highlight" official posts. Guarded by the admin session token, so a
// student can't pin their own posts to the top of everyone's feed.
router.post("/admin/posts/:id/pin", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const pinned = req.body?.pinned !== false;
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $set: { pinned, pinnedAt: pinned ? new Date() : null } },
      { new: true }
    ).lean();
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true, pinned: post.pinned });
  } catch (e) {
    console.error("[community/admin:pin]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── GET /admin/batches — batches that have posts, with counts (filter list) ──
router.get("/admin/batches", requireAdmin, async (_req, res) => {
  try {
    const agg = await CommunityPost.aggregate([
      { $match: { deleted: { $ne: true } } },
      { $group: { _id: "$plan", posts: { $sum: 1 } } },
      { $sort: { posts: -1 } },
    ]);
    const batches = agg.map((b) => ({ plan: b._id, batchLabel: batchLabelFor(b._id), planLabel: planLabel(b._id), posts: b.posts }));
    res.json({ batches });
  } catch (e) {
    console.error("[community/admin:batches]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── GET /admin/posts?plan=&includeDeleted= — moderation feed across batches ──
router.get("/admin/posts", requireAdmin, async (req, res) => {
  try {
    const q = {};
    if (req.query.plan) q.plan = String(req.query.plan);
    if (req.query.includeDeleted !== "true") q.deleted = { $ne: true };
    const docs = await CommunityPost.find(q).sort({ pinned: -1, createdAt: -1 }).limit(250).lean();
    const posts = docs.map((p) => ({
      id: String(p._id),
      plan: p.plan,
      batchLabel: batchLabelFor(p.plan),
      authorName: p.authorName,
      studentId: p.studentId,
      text: p.text || "",
      media: (p.media || []).map((m) => ({ url: m.url, type: m.type })),
      tag: p.tag,
      subject: p.subject || "",
      pinned: !!p.pinned,
      deleted: !!p.deleted,
      likeCount: (p.likes || []).length,
      replyCount: p.replyCount || 0,
      createdAt: p.createdAt,
    }));
    res.json({ posts, total: posts.length });
  } catch (e) {
    console.error("[community/admin:posts]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── DELETE /admin/posts/:id — remove any post (soft delete) ─────────────────
router.delete("/admin/posts/:id", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const post = await CommunityPost.findByIdAndUpdate(req.params.id, { $set: { deleted: true } }, { new: true }).lean();
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    console.error("[community/admin:delete]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /admin/announcement — post an official pinned announcement to a batch ─
router.post("/admin/announcement", requireAdmin, async (req, res) => {
  try {
    const plan = String(req.body?.plan || "").trim();
    const text = String(req.body?.text || "").trim().slice(0, 4000);
    if (!/^mentor-/.test(plan)) return res.status(400).json({ error: "Choose a mentorship batch." });
    if (!text) return res.status(400).json({ error: "Write the announcement." });
    const doc = await CommunityPost.create({
      plan,
      authorId: "admin",
      authorName: "College Parichay Team",
      studentId: "",
      text,
      tag: "announcement",
      pinned: true,
      pinnedAt: new Date(),
    });
    res.status(201).json({ ok: true, id: String(doc._id) });
  } catch (e) {
    console.error("[community/admin:announcement]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
