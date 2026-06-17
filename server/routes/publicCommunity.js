// ─────────────────────────────────────────────────────────────────────────────
// Public community — the OPEN room every logged-in user can join: free members,
// enrolled mentorship students and not-yet-enrolled visitors all discuss doubts
// together here. Unlike the per-batch forum (routes/community.js) there is no
// batch gate — only requireAuth — and every post lives in the single "public"
// room (plan === PUBLIC_ROOM). Authors are badged by standing (mentorship
// student vs free member) so trust is still visible.
// ─────────────────────────────────────────────────────────────────────────────
import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import CommunityPost from "../models/CommunityPost.js";
import CommunityReply from "../models/CommunityReply.js";
import { requireAuth } from "../middleware/auth.js";
import { ensureStudentId } from "../utils/studentId.js";
import { signUpload, cloudinaryReady, isOurCloudinaryUrl } from "../utils/cloudinary.js";
import { PUBLIC_ROOM } from "../utils/plans.js";

const router = express.Router();
const isId = (v) => mongoose.Types.ObjectId.isValid(v);

// Always live — never let a proxy serve a stale public feed.
router.use((_req, res, next) => { res.set("Cache-Control", "no-store"); next(); });

// Resolve the caller's public identity: their display name + standing badge.
// Enrolled mentorship students keep their global student ID; free users post as
// "Member". The result is attached to req.viewer for every gated route.
async function resolveViewer(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("email name").lean();
    if (!user?.email) return res.status(403).json({ error: "No account found." });
    const email = user.email.toLowerCase();

    const enr = await Enrollment.findOne({
      status: "paid",
      email,
      plan: { $regex: /^mentor-/ },
    }).sort({ createdAt: -1 }).lean();

    let studentId = "";
    if (enr) studentId = enr.studentId || (await ensureStudentId(enr._id, enr.createdAt)) || "";

    req.viewer = {
      userId: String(req.user.id),
      name: enr?.name || user.name || "Member",
      email,
      role: enr ? "student" : "member",
      studentId,
    };
    next();
  } catch (e) {
    console.error("[public/resolveViewer]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
}

const shapePost = (p, meId) => ({
  id: String(p._id),
  authorName: p.authorName,
  studentId: p.studentId,
  role: p.role || "member",
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
  role: r.role || "member",
  isMine: String(r.authorId) === String(meId),
  text: r.text || "",
  media: (r.media || []).map((m) => ({ url: m.url, type: m.type, width: m.width, height: m.height, poster: m.poster })),
  likeCount: (r.likes || []).length,
  likedByMe: (r.likes || []).map(String).includes(String(meId)),
  createdAt: r.createdAt,
});

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

// ── GET /health — does this server have media uploads configured? ───────────
router.get("/health", (_req, res) => res.json({ ok: true, cloudinaryReady: cloudinaryReady() }));

// ── GET /me — the caller's public identity + room stats ─────────────────────
router.get("/me", requireAuth, resolveViewer, async (req, res) => {
  try {
    const [memberCount, postCount] = await Promise.all([
      CommunityPost.distinct("authorId", { plan: PUBLIC_ROOM, deleted: { $ne: true } }).then((a) => a.length),
      CommunityPost.countDocuments({ plan: PUBLIC_ROOM, deleted: { $ne: true } }),
    ]);
    res.json({
      name: req.viewer.name,
      role: req.viewer.role,
      studentId: req.viewer.studentId,
      memberCount,
      postCount,
      cloudinaryReady: cloudinaryReady(),
    });
  } catch (e) {
    console.error("[public/me]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── GET /feed?tab=all|highlights|unanswered&subject=… ───────────────────────
const FEED_TABS = new Set(["all", "highlights", "unanswered"]);
router.get("/feed", requireAuth, resolveViewer, async (req, res) => {
  try {
    const tab = FEED_TABS.has(req.query.tab) ? req.query.tab : "all";
    const subject = String(req.query.subject || "").trim().slice(0, 40);

    const q = { plan: PUBLIC_ROOM, deleted: { $ne: true } };
    if (subject) q.subject = subject;

    const docs = await CommunityPost.find(q).sort({ createdAt: -1 }).limit(200).lean();
    let posts = docs.map((p) => shapePost(p, req.viewer.userId));

    const score = (p) => p.likeCount * 2 + p.replyCount * 3;
    if (tab === "highlights") {
      posts = posts
        .filter((p) => p.pinned || p.likeCount > 0 || p.replyCount > 0)
        .sort((a, b) => Number(b.pinned) - Number(a.pinned) || score(b) - score(a) || new Date(b.createdAt) - new Date(a.createdAt));
    } else if (tab === "unanswered") {
      posts = posts
        .filter((p) => p.tag === "doubt" && (p.replyCount || 0) === 0 && !p.pinned)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      posts.sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ posts, tab, serverTime: Date.now() });
  } catch (e) {
    console.error("[public/feed]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /posts — create a post ─────────────────────────────────────────────
router.post("/posts", requireAuth, resolveViewer, async (req, res) => {
  try {
    const text = String(req.body?.text || "").trim().slice(0, 4000);
    const media = cleanMedia(req.body?.media);
    if (!text && !media.length) return res.status(400).json({ error: "Write something or attach a photo / video." });

    const TAGS = ["doubt", "discussion", "resource"];
    const tag = TAGS.includes(req.body?.tag) ? req.body.tag : "doubt";
    const subject = String(req.body?.subject || "").trim().slice(0, 40);

    const doc = await CommunityPost.create({
      plan: PUBLIC_ROOM,
      authorId: req.viewer.userId,
      authorName: req.viewer.name,
      studentId: req.viewer.studentId,
      role: req.viewer.role,
      text,
      media,
      tag,
      subject,
    });
    res.status(201).json({ post: shapePost(doc.toObject(), req.viewer.userId) });
  } catch (e) {
    console.error("[public/posts:create]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── DELETE /posts/:id — author removes their own post ───────────────────────
router.delete("/posts/:id", requireAuth, resolveViewer, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const post = await CommunityPost.findOne({ _id: req.params.id, plan: PUBLIC_ROOM });
    if (!post || post.deleted) return res.status(404).json({ error: "Not found" });
    if (String(post.authorId) !== req.viewer.userId) return res.status(403).json({ error: "You can only delete your own posts." });
    post.deleted = true;
    await post.save();
    res.json({ ok: true });
  } catch (e) {
    console.error("[public/posts:delete]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /posts/:id/like ────────────────────────────────────────────────────
router.post("/posts/:id/like", requireAuth, resolveViewer, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const post = await CommunityPost.findOne({ _id: req.params.id, plan: PUBLIC_ROOM });
    if (!post || post.deleted) return res.status(404).json({ error: "Not found" });
    const me = req.viewer.userId;
    const i = post.likes.map(String).indexOf(me);
    if (i >= 0) post.likes.splice(i, 1); else post.likes.push(me);
    await post.save();
    res.json({ likeCount: post.likes.length, likedByMe: i < 0 });
  } catch (e) {
    console.error("[public/posts:like]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── GET /posts/:id/replies ──────────────────────────────────────────────────
router.get("/posts/:id/replies", requireAuth, resolveViewer, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const replies = await CommunityReply.find({ postId: req.params.id, plan: PUBLIC_ROOM, deleted: { $ne: true } })
      .sort({ createdAt: 1 }).limit(300).lean();
    res.json({ replies: replies.map((r) => shapeReply(r, req.viewer.userId)) });
  } catch (e) {
    console.error("[public/replies:list]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /posts/:id/replies — answer ────────────────────────────────────────
router.post("/posts/:id/replies", requireAuth, resolveViewer, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const post = await CommunityPost.findOne({ _id: req.params.id, plan: PUBLIC_ROOM });
    if (!post || post.deleted) return res.status(404).json({ error: "Not found" });

    const text = String(req.body?.text || "").trim().slice(0, 4000);
    const media = cleanMedia(req.body?.media);
    if (!text && !media.length) return res.status(400).json({ error: "Write a reply or attach a photo / video." });

    const doc = await CommunityReply.create({
      postId: post._id,
      plan: PUBLIC_ROOM,
      authorId: req.viewer.userId,
      authorName: req.viewer.name,
      studentId: req.viewer.studentId,
      role: req.viewer.role,
      text,
      media,
    });
    post.replyCount = (post.replyCount || 0) + 1;
    post.lastReplyAt = new Date();
    await post.save();
    res.status(201).json({ reply: shapeReply(doc.toObject(), req.viewer.userId), replyCount: post.replyCount });
  } catch (e) {
    console.error("[public/replies:create]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /replies/:id/like ──────────────────────────────────────────────────
router.post("/replies/:id/like", requireAuth, resolveViewer, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const reply = await CommunityReply.findOne({ _id: req.params.id, plan: PUBLIC_ROOM });
    if (!reply || reply.deleted) return res.status(404).json({ error: "Not found" });
    const me = req.viewer.userId;
    const i = reply.likes.map(String).indexOf(me);
    if (i >= 0) reply.likes.splice(i, 1); else reply.likes.push(me);
    await reply.save();
    res.json({ likeCount: reply.likes.length, likedByMe: i < 0 });
  } catch (e) {
    console.error("[public/replies:like]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST /sign-upload — Cloudinary signature for direct upload (auth only) ───
router.post("/sign-upload", requireAuth, (req, res) => {
  if (!cloudinaryReady()) return res.status(503).json({ error: "Media uploads are not configured yet." });
  res.json(signUpload({ folder: `community/${PUBLIC_ROOM}` }));
});

export default router;
