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
import { randomUUID } from "node:crypto";
import Test from "../models/Test.js";
import TestAttempt from "../models/TestAttempt.js";
import { requireAuth } from "../middleware/auth.js";
import { requireBatch } from "../middleware/batchGuard.js";
import { requireAdmin } from "../middleware/admin.js";
import { signUpload, cloudinaryReady, isOurCloudinaryUrl } from "../utils/cloudinary.js";
import { buildTestFromPdfs, normalizeAnswer } from "../utils/testParser.js";
import { normalizeSubject, orderSubjects, recoverSubjects } from "../utils/subjects.js";
import { planLabel, batchLabelFor } from "../utils/plans.js";
import { sendParentTestReport } from "../utils/mailer.js";

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
      subject: normalizeSubject(q?.subject),
      topic: String(q?.topic || "").slice(0, 60),
      correct: normalizeAnswer(q?.correct),
      explanation: String(q?.explanation || "").slice(0, 2000),
    };
  });
}

// Group questions into ordered subject sections, each numbered 1..k for display
// (the global qno stays the stable id used for answers/grading).
function buildSections(questions) {
  const subs = orderSubjects(questions.map((q) => q.subject));
  if (!subs.length) return [];
  return subs.map((name) => {
    const qs = questions.filter((q) => normalizeSubject(q.subject) === name);
    return { name, count: qs.length, qnos: qs.map((q) => q.qno) };
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
// Vision conversion of a big math paper can take a few minutes (the free Groq
// tier is token-rate-limited), which would blow past proxy/CDN request timeouts.
// So parsing runs as a background job: POST starts it and returns a jobId; the
// client polls GET /admin/parse/:jobId until it's done. Jobs live in memory and
// expire after a while — fine for a single-instance admin tool.
const parseJobs = new Map(); // jobId -> { status, startedAt, result }
const PARSE_JOB_TTL = 20 * 60 * 1000;
function gcParseJobs() {
  const now = Date.now();
  for (const [id, j] of parseJobs) if (now - j.startedAt > PARSE_JOB_TTL) parseJobs.delete(id);
}

router.post("/admin/parse", requireAdmin, (req, res) => {
  const testPdfUrl = String(req.body?.testPdfUrl || "");
  const keyPdfUrl = String(req.body?.keyPdfUrl || "");
  // Drives the fixed-pattern section safety net (JEE Mains/NEET); harmless if absent.
  const examType = ["mains", "advanced", "neet", "standard"].includes(req.body?.examType) ? req.body.examType : "";
  if (!isOurCloudinaryUrl(testPdfUrl)) return res.status(400).json({ error: "Upload the question paper PDF first." });
  if (keyPdfUrl && !isOurCloudinaryUrl(keyPdfUrl)) return res.status(400).json({ error: "Answer-key URL looks invalid." });

  gcParseJobs();
  const jobId = randomUUID();
  parseJobs.set(jobId, { status: "running", startedAt: Date.now() });

  buildTestFromPdfs(testPdfUrl, keyPdfUrl, examType)
    .then(({ questions, matched, note }) => {
      parseJobs.set(jobId, { status: "done", startedAt: Date.now(), result: { questions, matched, note, totalQuestions: questions.length } });
    })
    .catch((e) => {
      // Don't fail the job hard — hand back an empty set + the real reason so the
      // admin lands on the manual grid with an accurate message.
      console.error("[tests/admin/parse]", e?.code || "", e?.message || e);
      parseJobs.set(jobId, {
        status: "done", startedAt: Date.now(),
        result: { questions: [], matched: 0, totalQuestions: 0, reason: e?.code || "ERROR", note: e?.message || "Could not read the PDF — add questions manually below." },
      });
    });

  res.status(202).json({ jobId });
});

// ── ADMIN: poll a parse job ─────────────────────────────────────────────────
router.get("/admin/parse/:jobId", requireAdmin, (req, res) => {
  const job = parseJobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Parse job expired — please convert again." });
  if (job.status === "running") return res.json({ status: "running" });
  res.json({ status: "done", ...job.result });
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

    let questions = cleanQuestions(req.body?.questions);
    if (!questions.length) return res.status(400).json({ error: "Add at least one question (parse a PDF or add questions manually)." });

    // With no PDF, the questions themselves must carry the content students see.
    const hasContent = questions.some((q) => q.text || q.image || (q.options || []).some((o) => o.text || o.image));
    if (!isOurCloudinaryUrl(testPdfUrl) && !hasContent) {
      return res.status(400).json({ error: "Upload the question paper PDF, or give the questions some text / options." });
    }

    const examType = examTypeFor(plan, req.body?.examType);
    // Fill any missing subject tags so the test shows section tabs (P/C/M · P/C/B)
    // — covers manual/section-wise builds where some questions were left untagged.
    questions = recoverSubjects(questions, examType);
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
      sections: t.sections || [],                  // per-section MARKING (Advanced)
      subjectSections: buildSections(t.questions),  // P/C/M · P/C/B navigation tabs
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
          type: q.type, subject: normalizeSubject(q.subject), topic: q.topic || "",
          marks: { correct: mk.correct, wrong: mk.wrong },
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

    // Client sends { answers: { "<qno>": "<choice>" }, sectionTimes: { Physics: 1200, … } }.
    const submitted = req.body?.answers && typeof req.body.answers === "object" ? req.body.answers : {};
    const durationSec = Math.max(0, Math.min(60 * 600, Number(req.body?.durationSec) || 0));
    const rawTimes = req.body?.sectionTimes && typeof req.body.sectionTimes === "object" ? req.body.sectionTimes : {};
    const sectionTimes = {};
    for (const k of Object.keys(rawTimes).slice(0, 8)) {
      const s = normalizeSubject(k);
      if (s) sectionTimes[s] = Math.max(0, Math.min(60 * 600, Number(rawTimes[k]) || 0));
    }

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
      totalQuestions, accuracy, percent, durationSec, sectionTimes, submittedAt: new Date(),
    };
    // Email the parent only the FIRST time this test is submitted, so re-attempts
    // don't spam them. Check before the upsert creates/overwrites the attempt.
    const isFirstSubmit = !(await TestAttempt.exists({ test: t._id, userId: req.batch.userId }));
    // One canonical attempt per (test, student) — re-submitting overwrites.
    await TestAttempt.findOneAndUpdate(
      { test: t._id, userId: req.batch.userId },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const parentNotified = Boolean(isFirstSubmit && req.batch.parentEmail);
    res.json({
      ok: true,
      result: { score, maxMarks, percent, accuracy, correctCount, wrongCount, skippedCount, totalQuestions, parentNotified },
    });

    // ── Parent progress email (fire-and-forget, after responding) ─────────────
    if (isFirstSubmit && req.batch.parentEmail) {
      // Per-subject breakdown for the email table (joins answers back to questions).
      const qByQno = new Map(t.questions.map((q) => [q.qno, q]));
      const bySubj = new Map();
      for (const ans of answers) {
        const name = normalizeSubject(qByQno.get(ans.qno)?.subject) || "General";
        const e = bySubj.get(name) || { name, total: 0, correct: 0, score: 0, maxMarks: 0 };
        e.total++;
        if (ans.status === "correct") e.correct++;
        e.score += ans.marks || 0;
        e.maxMarks += Math.max(0, markingForQ(t, ans.qno).correct);
        bySubj.set(name, e);
      }
      const subjects = orderSubjects([...bySubj.keys()]).map((name) => {
        const e = bySubj.get(name);
        const attempted = answers.filter((a) => normalizeSubject(qByQno.get(a.qno)?.subject) === name && a.status !== "skipped").length;
        return { ...e, accuracy: attempted ? Math.round((e.correct / attempted) * 100) : 0 };
      });
      sendParentTestReport({
        to: req.batch.parentEmail,
        studentName: req.batch.name,
        testTitle: t.title,
        examLabel: EXAM_LABEL[t.examType] || "",
        result: { score, maxMarks, percent, accuracy, correctCount, wrongCount, skippedCount, totalQuestions },
        subjects,
      }).catch((e) => console.error("[tests:submit] parent email failed", e?.message || e));
    }
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
        image: q?.image || "",
        type: q?.type || "single",
        subject: normalizeSubject(q?.subject),
        topic: q?.topic || "",
        options: (q?.options || []).map((o) => ({ key: o.key, text: o.text, image: o.image || "" })),
        explanation: q?.explanation || "",
      };
    });

    // Per-subject breakdown (Subject Proficiency / Time Allocation in the report).
    const subjOrder = orderSubjects(answers.map((x) => x.subject));
    const subjects = subjOrder.map((name) => {
      const qs = answers.filter((x) => x.subject === name);
      const correct = qs.filter((x) => x.status === "correct").length;
      const wrong = qs.filter((x) => x.status === "wrong").length;
      const skipped = qs.filter((x) => x.status === "skipped").length;
      const score = qs.reduce((s, x) => s + (x.marks || 0), 0);
      const maxMarks = qs.reduce((s, x) => s + Math.max(0, markingForQ(t, x.qno).correct), 0);
      const attempted = correct + wrong;
      return {
        name, total: qs.length, correct, wrong, skipped, score, maxMarks,
        accuracy: attempted ? Math.round((correct / attempted) * 100) : 0,
        percent: maxMarks ? Math.round((score / maxMarks) * 100) : 0,
        timeSec: Math.round(Number(a.sectionTimes?.[name]) || 0),
      };
    });

    // Topic accuracy heatmap (only when topics were tagged).
    const topicMap = new Map();
    for (const x of answers) {
      if (!x.topic) continue;
      const key = `${x.subject}|${x.topic}`;
      const e = topicMap.get(key) || { subject: x.subject, topic: x.topic, total: 0, correct: 0 };
      e.total++; if (x.status === "correct") e.correct++;
      topicMap.set(key, e);
    }
    const topics = [...topicMap.values()].map((e) => ({ ...e, accuracy: e.total ? Math.round((e.correct / e.total) * 100) : 0 }));

    res.json({
      title: t.title,
      examType: t.examType,
      examTypeLabel: EXAM_LABEL[t.examType] || "",
      keyPdfUrl: t.keyPdfUrl,
      marking: t.marking,
      result: {
        score: a.score, maxMarks: a.maxMarks, percent: a.percent, accuracy: a.accuracy,
        correctCount: a.correctCount, wrongCount: a.wrongCount, skippedCount: a.skippedCount,
        totalQuestions: a.totalQuestions, durationSec: a.durationSec, submittedAt: a.submittedAt,
      },
      subjects,
      topics,
      answers,
    });
  } catch (e) {
    console.error("[tests:result]", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
