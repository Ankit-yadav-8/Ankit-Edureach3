// ─────────────────────────────────────────────────────────────────────────────
// Test-series routes — admin uploads PDFs, students take them in CBT mode.
//
// Admin (x-admin-token):
//   POST   /api/tests/admin/sign-upload   → Cloudinary signature for a PDF
//   POST   /api/tests/admin/parse         → fetch + auto-parse the two PDFs
//   POST   /api/tests/admin               → create/publish a test (reviewed Qs)
//   GET    /api/tests/admin?plan=&category= → list tests for moderation
//   DELETE /api/tests/admin/:id           → remove a test
//
// Student (Bearer + requireBatch — scoped to their paid mentorship plan):
//   GET  /api/tests?category=             → tests for my batch (+ my attempt)
//   GET  /api/tests/:id                   → full paper (no answers) to take
//   POST /api/tests/:id/submit            → auto-grade against the key
//   GET  /api/tests/:id/result            → my attempt + answer key (solutions)
//   GET  /api/tests/performance           → aggregate stats for the dashboard
// ─────────────────────────────────────────────────────────────────────────────
import express from "express";
import mongoose from "mongoose";
import Test from "../models/Test.js";
import TestAttempt from "../models/TestAttempt.js";
import { requireAuth } from "../middleware/auth.js";
import { requireBatch } from "../middleware/batchGuard.js";
import { requireAdmin } from "../middleware/admin.js";
import { signUpload, cloudinaryReady, isOurCloudinaryUrl } from "../utils/cloudinary.js";
import { buildTestFromPdfs, normalizeAnswer } from "../utils/testParser.js";
import { planLabel, batchLabelFor } from "../utils/plans.js";

const router = express.Router();
const isId = (v) => mongoose.Types.ObjectId.isValid(v);

const CATEGORIES = new Set(["daily", "weekly", "full"]);
const PLANS = new Set([
  "mentor-jee-2027", "mentor-neet-2027",
  "mentor-jee-2028", "mentor-neet-2028",
  "mentor-foundation",
]);
const CAT_LABEL = { daily: "Daily Test", weekly: "Weekly Test", full: "Full / Major Test" };
const EXAM_LABEL = { mains: "JEE Mains", advanced: "JEE Advanced", neet: "NEET", standard: "Standard" };

// Never let a proxy cache test data — attempts & listings must be live.
router.use((_req, res, next) => { res.set("Cache-Control", "no-store"); next(); });

// Coerce a client-supplied question list into the stored shape (cap sizes so a
// crafted payload can't blow up the document).
function cleanQuestions(arr) {
  if (!Array.isArray(arr)) return [];
  const img = (u) => (isOurCloudinaryUrl(u) ? String(u) : "");
  return arr.slice(0, 400).map((q, i) => {
    const type = q?.type === "integer" ? "integer" : "single";
    const options = Array.isArray(q?.options)
      ? q.options.slice(0, 4).map((o, j) => ({
          key: String(o?.key || j + 1).slice(0, 2),
          text: String(o?.text || "").slice(0, 1000),
          image: img(o?.image),
        }))
      : [];
    return {
      qno: Number(q?.qno) || i + 1,
      text: String(q?.text || "").slice(0, 4000),
      image: img(q?.image),
      options: type === "single" ? options : [],
      type,
      subject: String(q?.subject || "").slice(0, 40),
      correct: normalizeAnswer(q?.correct),
      explanation: String(q?.explanation || "").slice(0, 2000),
    };
  });
}

// Marking for one question: JEE Advanced uses the section covering its qno;
// everything else (and uncovered Advanced questions) uses the flat scheme.
// Unattempted is always 0 — handled at grade time, not here.
function markingForQ(test, qno) {
  if (test.examType === "advanced" && Array.isArray(test.sections) && test.sections.length) {
    const s = test.sections.find((x) => qno >= x.fromQ && qno <= x.toQ);
    if (s) return { correct: Number(s.correct) || 0, wrong: Number(s.wrong) || 0 };
  }
  const pos = Number(test.marking?.correct) || 4;
  const neg = test.marking?.wrong === undefined ? -1 : Number(test.marking.wrong);
  return { correct: pos, wrong: neg };
}

const maxMarksOf = (test) =>
  (test.questions || []).reduce((sum, q) => sum + markingForQ(test, q.qno).correct, 0);

// JEE plans split into mains/advanced; NEET → neet; everything else standard.
// Derived from the plan so a JEE test can never be saved as a NEET pattern.
function examTypeFor(plan, requested) {
  if (/neet/.test(plan)) return "neet";
  if (/foundation/.test(plan)) return "standard";
  return requested === "advanced" ? "advanced" : "mains";
}

// Mains & NEET are fixed at the NTA scheme; Advanced/standard keep what's sent.
function markingFor(examType, body) {
  if (examType === "mains" || examType === "neet") return { correct: 4, wrong: -1 };
  return {
    correct: Number(body?.marking?.correct) || 4,
    wrong: body?.marking?.wrong === undefined ? -1 : Number(body.marking.wrong),
  };
}

function cleanSections(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .slice(0, 12)
    .map((s) => ({
      name: String(s?.name || "").slice(0, 40),
      fromQ: Math.max(1, Number(s?.fromQ) || 1),
      toQ: Math.max(1, Number(s?.toQ) || 1),
      correct: Number(s?.correct) || 0,
      wrong: Number(s?.wrong) || 0,
    }))
    .filter((s) => s.toQ >= s.fromQ);
}

// ── ADMIN: Cloudinary signature for a PDF upload (folder per plan) ───────────
router.post("/admin/sign-upload", requireAdmin, (req, res) => {
  if (!cloudinaryReady()) return res.status(503).json({ error: "Uploads are not configured on the server." });
  const plan = PLANS.has(req.body?.plan) ? req.body.plan : "misc";
  res.json(signUpload({ folder: `tests/${plan}` }));
});

// ── ADMIN: auto-parse the uploaded PDFs into questions + answer key ──────────
router.post("/admin/parse", requireAdmin, async (req, res) => {
  try {
    const testPdfUrl = String(req.body?.testPdfUrl || "");
    const keyPdfUrl = String(req.body?.keyPdfUrl || "");
    if (!isOurCloudinaryUrl(testPdfUrl)) return res.status(400).json({ error: "Upload the question paper PDF first." });
    if (keyPdfUrl && !isOurCloudinaryUrl(keyPdfUrl)) return res.status(400).json({ error: "Answer-key URL looks invalid." });

    const { questions, matched, note } = await buildTestFromPdfs(testPdfUrl, keyPdfUrl);
    res.json({ questions, matched, note, totalQuestions: questions.length });
  } catch (e) {
    // Don't 500 — return an empty set + the real reason so the admin lands on the
    // manual grid with an accurate message (delivery blocked vs scanned PDF).
    console.error("[tests/admin/parse]", e?.code || "", e?.message || e);
    res.json({
      questions: [],
      matched: 0,
      totalQuestions: 0,
      reason: e?.code || "ERROR",
      note: e?.message || "Could not read the PDF — add questions manually below.",
    });
  }
});

// ── ADMIN: create & publish a test (with the reviewed/edited questions) ──────
router.post("/admin", requireAdmin, async (req, res) => {
  try {
    const plan = req.body?.plan;
    const category = req.body?.category;
    if (!PLANS.has(plan)) return res.status(400).json({ error: "Choose a mentorship plan." });
    if (!CATEGORIES.has(category)) return res.status(400).json({ error: "Choose a test section." });

    const title = String(req.body?.title || "").trim().slice(0, 160);
    if (!title) return res.status(400).json({ error: "Give the test a title." });

    // The question paper PDF is optional — a test can be built entirely from
    // manually-typed questions (students then read them from the CBT pane). If a
    // PDF is provided it must be one of ours.
    const testPdfUrl = String(req.body?.testPdfUrl || "");
    if (testPdfUrl && !isOurCloudinaryUrl(testPdfUrl)) return res.status(400).json({ error: "The question paper PDF link looks invalid — re-upload it." });
    const keyPdfUrl = String(req.body?.keyPdfUrl || "");

    const questions = cleanQuestions(req.body?.questions);
    if (!questions.length) return res.status(400).json({ error: "Add at least one question (parse a PDF or add questions manually)." });

    // With no PDF, the questions themselves must carry the content students see.
    const hasContent = questions.some((q) => q.text || q.image || (q.options || []).some((o) => o.text || o.image));
    if (!isOurCloudinaryUrl(testPdfUrl) && !hasContent) {
      return res.status(400).json({ error: "Upload the question paper PDF, or give the questions some text / options." });
    }

    const examType = examTypeFor(plan, req.body?.examType);
    const marking = markingFor(examType, req.body);
    const sections = examType === "advanced" ? cleanSections(req.body?.sections) : [];

    const draft = {
      plan,
      category,
      title,
      subject: String(req.body?.subject || "").slice(0, 40),
      durationMin: Math.min(600, Math.max(1, Number(req.body?.durationMin) || 60)),
      examType,
      testPdfUrl: isOurCloudinaryUrl(testPdfUrl) ? testPdfUrl : "",
      keyPdfUrl: isOurCloudinaryUrl(keyPdfUrl) ? keyPdfUrl : "",
      marking,
      sections,
      questions,
      totalQuestions: questions.length,
      status: "published",
      parseNote: String(req.body?.parseNote || "").slice(0, 300),
    };
    draft.maxMarks = maxMarksOf(draft);
    const doc = await Test.create(draft);
    res.status(201).json({ ok: true, id: String(doc._id) });
  } catch (e) {
    console.error("[tests/admin:create]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── ADMIN: list tests (optional plan/category filter) ───────────────────────
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const q = {};
    if (PLANS.has(req.query.plan)) q.plan = req.query.plan;
    if (CATEGORIES.has(req.query.category)) q.category = req.query.category;
    const docs = await Test.find(q).sort({ createdAt: -1 }).limit(300)
      .select("plan category title totalQuestions maxMarks durationMin status createdAt testPdfUrl keyPdfUrl parseNote examType")
      .lean();
    const tests = await Promise.all(docs.map(async (t) => ({
      id: String(t._id),
      plan: t.plan,
      planLabel: planLabel(t.plan),
      batchLabel: batchLabelFor(t.plan),
      category: t.category,
      categoryLabel: CAT_LABEL[t.category],
      examType: t.examType,
      examTypeLabel: EXAM_LABEL[t.examType] || "",
      title: t.title,
      totalQuestions: t.totalQuestions,
      maxMarks: t.maxMarks,
      durationMin: t.durationMin,
      status: t.status,
      parseNote: t.parseNote,
      testPdfUrl: t.testPdfUrl,
      keyPdfUrl: t.keyPdfUrl,
      attempts: await TestAttempt.countDocuments({ test: t._id }),
      createdAt: t.createdAt,
    })));
    res.json({ tests, total: tests.length });
  } catch (e) {
    console.error("[tests/admin:list]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── ADMIN: delete a test (and its attempts) ─────────────────────────────────
router.delete("/admin/:id", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    await Test.deleteOne({ _id: req.params.id });
    await TestAttempt.deleteMany({ test: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    console.error("[tests/admin:delete]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── STUDENT: tests for my batch, with my attempt status ─────────────────────
router.get("/", requireAuth, requireBatch, async (req, res) => {
  try {
    const q = { plan: req.batch.plan, status: "published" };
    if (CATEGORIES.has(req.query.category)) q.category = req.query.category;
    const docs = await Test.find(q).sort({ createdAt: -1 }).limit(200)
      .select("plan category title totalQuestions maxMarks durationMin createdAt subject examType")
      .lean();
    const ids = docs.map((d) => d._id);
    const mine = await TestAttempt.find({ test: { $in: ids }, userId: req.batch.userId })
      .select("test score maxMarks percent accuracy correctCount submittedAt").lean();
    const byTest = new Map(mine.map((a) => [String(a.test), a]));

    const tests = docs.map((t) => {
      const a = byTest.get(String(t._id));
      return {
        id: String(t._id),
        category: t.category,
        categoryLabel: CAT_LABEL[t.category],
        examType: t.examType,
        examTypeLabel: EXAM_LABEL[t.examType] || "",
        title: t.title,
        subject: t.subject,
        totalQuestions: t.totalQuestions,
        maxMarks: t.maxMarks,
        durationMin: t.durationMin,
        createdAt: t.createdAt,
        attempted: !!a,
        result: a ? { score: a.score, maxMarks: a.maxMarks, percent: a.percent, accuracy: a.accuracy, correctCount: a.correctCount, submittedAt: a.submittedAt } : null,
      };
    });
    res.json({ plan: req.batch.plan, batchLabel: batchLabelFor(req.batch.plan), tests });
  } catch (e) {
    console.error("[tests:list]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── STUDENT: aggregate performance for the dashboard widgets ────────────────
// (Defined before "/:id" so it isn't captured by the id param route.)
router.get("/performance", requireAuth, requireBatch, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ userId: req.batch.userId, plan: req.batch.plan })
      .sort({ submittedAt: 1 })
      .select("title category score maxMarks percent accuracy correctCount wrongCount skippedCount totalQuestions submittedAt")
      .lean();

    const n = attempts.length;
    const avg = (sel) => (n ? Math.round(attempts.reduce((s, a) => s + (sel(a) || 0), 0) / n) : 0);
    // `year` is the X-axis key the shared Trend chart reads.
    const trend = attempts.slice(-12).map((a) => ({
      year: new Date(a.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      name: a.title?.slice(0, 18) || "Test",
      score: a.percent,
      acc: a.accuracy,
    }));

    res.json({
      testsAttempted: n,
      avgPercent: avg((a) => a.percent),
      avgAccuracy: avg((a) => a.accuracy),
      bestPercent: n ? Math.max(...attempts.map((a) => a.percent)) : 0,
      totalCorrect: attempts.reduce((s, a) => s + (a.correctCount || 0), 0),
      trend,
      recent: attempts.slice(-6).reverse().map((a) => ({
        title: a.title, category: a.category, score: a.score, maxMarks: a.maxMarks,
        percent: a.percent, accuracy: a.accuracy, submittedAt: a.submittedAt,
      })),
    });
  } catch (e) {
    console.error("[tests:performance]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── STUDENT: full paper to take (answers stripped) ──────────────────────────
router.get("/:id", requireAuth, requireBatch, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const t = await Test.findOne({ _id: req.params.id, plan: req.batch.plan, status: "published" }).lean();
    if (!t) return res.status(404).json({ error: "Test not found for your batch." });
    const existing = await TestAttempt.findOne({ test: t._id, userId: req.batch.userId }).lean();
    res.json({
      id: String(t._id),
      title: t.title,
      category: t.category,
      categoryLabel: CAT_LABEL[t.category],
      subject: t.subject,
      durationMin: t.durationMin,
      examType: t.examType,
      examTypeLabel: EXAM_LABEL[t.examType] || "",
      marking: t.marking,
      sections: t.sections || [],
      testPdfUrl: t.testPdfUrl,
      totalQuestions: t.totalQuestions,
      maxMarks: t.maxMarks,
      // Strip the correct answer — never sent to the client before submission.
      // `marks` lets the player show +x / −y / 0 for the current question.
      questions: t.questions.map((q) => {
        const mk = markingForQ(t, q.qno);
        return {
          qno: q.qno, text: q.text, image: q.image || "",
          options: (q.options || []).map((o) => ({ key: o.key, text: o.text, image: o.image || "" })),
          type: q.type, subject: q.subject, marks: { correct: mk.correct, wrong: mk.wrong },
        };
      }),
      alreadyAttempted: !!existing,
    });
  } catch (e) {
    console.error("[tests:get]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── STUDENT: submit answers → auto-grade against the key → store attempt ─────
router.post("/:id/submit", requireAuth, requireBatch, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const t = await Test.findOne({ _id: req.params.id, plan: req.batch.plan, status: "published" }).lean();
    if (!t) return res.status(404).json({ error: "Test not found for your batch." });

    // Client sends { answers: { "<qno>": "<choice>" } }.
    const submitted = req.body?.answers && typeof req.body.answers === "object" ? req.body.answers : {};
    const durationSec = Math.max(0, Math.min(60 * 600, Number(req.body?.durationSec) || 0));

    let score = 0, correctCount = 0, wrongCount = 0, skippedCount = 0;
    const answers = t.questions.map((q) => {
      const { correct: pos, wrong: neg } = markingForQ(t, q.qno);
      const stud = normalizeAnswer(submitted[String(q.qno)]);
      const key = normalizeAnswer(q.correct);
      let status = "skipped", marks = 0;
      if (!stud) { skippedCount++; }                                  // 0 for skipped
      else if (key && stud === key) { status = "correct"; marks = pos; correctCount++; }
      else { status = "wrong"; marks = neg; wrongCount++; }
      score += marks;
      return { qno: q.qno, answer: stud, correct: key, status, marks };
    });

    const totalQuestions = t.questions.length;
    const maxMarks = maxMarksOf(t);
    const attempted = correctCount + wrongCount;
    const accuracy = attempted ? Math.round((correctCount / attempted) * 100) : 0;
    const percent = maxMarks ? Math.round((score / maxMarks) * 100) : 0;

    const payload = {
      test: t._id, userId: req.batch.userId, email: req.batch.email,
      plan: t.plan, category: t.category, title: t.title,
      answers, score, maxMarks, correctCount, wrongCount, skippedCount,
      totalQuestions, accuracy, percent, durationSec, submittedAt: new Date(),
    };
    // One canonical attempt per (test, student) — re-submitting overwrites.
    await TestAttempt.findOneAndUpdate(
      { test: t._id, userId: req.batch.userId },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      ok: true,
      result: { score, maxMarks, percent, accuracy, correctCount, wrongCount, skippedCount, totalQuestions },
    });
  } catch (e) {
    console.error("[tests:submit]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── STUDENT: my graded attempt + answer key + solutions PDF ─────────────────
router.get("/:id/result", requireAuth, requireBatch, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(400).json({ error: "Bad id" });
    const t = await Test.findOne({ _id: req.params.id, plan: req.batch.plan }).lean();
    if (!t) return res.status(404).json({ error: "Test not found." });
    const a = await TestAttempt.findOne({ test: t._id, userId: req.batch.userId }).lean();
    if (!a) return res.status(404).json({ error: "You haven't attempted this test yet." });

    // Merge the question text/options/solution into each graded answer so the
    // review screen can show the full question + worked solution, not just keys.
    const byQno = new Map((t.questions || []).map((q) => [q.qno, q]));
    const answers = (a.answers || []).map((ans) => {
      const q = byQno.get(ans.qno);
      return {
        ...ans,
        text: q?.text || "",
        type: q?.type || "single",
        options: (q?.options || []).map((o) => ({ key: o.key, text: o.text, image: o.image || "" })),
        explanation: q?.explanation || "",
      };
    });

    res.json({
      title: t.title,
      keyPdfUrl: t.keyPdfUrl,
      marking: t.marking,
      result: {
        score: a.score, maxMarks: a.maxMarks, percent: a.percent, accuracy: a.accuracy,
        correctCount: a.correctCount, wrongCount: a.wrongCount, skippedCount: a.skippedCount,
        totalQuestions: a.totalQuestions, submittedAt: a.submittedAt,
      },
      answers,
    });
  } catch (e) {
    console.error("[tests:result]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
