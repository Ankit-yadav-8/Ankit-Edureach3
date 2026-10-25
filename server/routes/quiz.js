// ─────────────────────────────────────────────────────────────────────────────
// Quiz & Exam Paper Generator API — Units and Measurements Chapter
// ─────────────────────────────────────────────────────────────────────────────
import express from "express";
import { loadAllQuestions, generateUnitsQuiz } from "../utils/unitsQuestionBank.js";

const router = express.Router();

/**
 * GET /api/quiz/units-measurements/stats
 * Overview of available questions by difficulty and topic.
 */
router.get("/units-measurements/stats", (_req, res) => {
  try {
    const questions = loadAllQuestions();
    const stats = {
      total: questions.length,
      easy: questions.filter((q) => q.difficulty === "easy").length,
      moderate: questions.filter((q) => q.difficulty === "moderate").length,
      hard: questions.filter((q) => q.difficulty === "hard").length,
      topics: [...new Set(questions.map((q) => q.topic))],
    };
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/quiz/units-measurements/generate
 * Generates a tailored quiz (max 15 questions) using configured difficulty ratios:
 * - easy: Easy + some Moderate
 * - moderate: 40% Easy, 40% Moderate, 20% Hard
 * - difficult: 60% Moderate, 40% Hard
 * - useAI: AI cognitive progression across topics
 */
router.post("/units-measurements/generate", (req, res) => {
  try {
    const {
      difficulty = "moderate",
      questionCount = 10,
      useAI = true,
      selectedTopics = null,
      mode = "student_quiz", // 'student_quiz' (no answers) | 'mentor_paper' (with keys)
    } = req.body || {};

    const count = Math.min(Math.max(parseInt(questionCount, 10) || 10, 3), 15);
    const quiz = generateUnitsQuiz({
      difficulty: String(difficulty).toLowerCase(),
      questionCount: count,
      useAI: Boolean(useAI),
      selectedTopics,
    });

    // If student mode, hide correct answers and explanations until submission
    if (mode === "student_quiz") {
      const sanitizedQuestions = quiz.questions.map((q) => {
        const { correct, explanation, difficultyRationale, ...rest } = q;
        return rest;
      });
      return res.json({
        success: true,
        quiz: {
          ...quiz,
          questions: sanitizedQuestions,
        },
      });
    }

    // Mentor / Admin paper mode: full paper with answers and solutions
    return res.json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/quiz/units-measurements/submit
 * Instant evaluation of a quiz attempt.
 */
router.post("/units-measurements/submit", (req, res) => {
  try {
    const { answers = {}, paperId, questions = [] } = req.body || {};
    const allQuestions = loadAllQuestions();
    const qMap = new Map(allQuestions.map((q) => [q.id, q]));

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let positiveMarks = 0;
    let negativeMarks = 0;

    const evaluatedQuestions = questions.map((q) => {
      const fullQ = qMap.get(q.id) || q;
      const studentAns = (answers[q.id] || "").trim().toUpperCase();
      const isCorrect = studentAns === fullQ.correct;
      const isAttempted = studentAns !== "";

      let status = "unattempted";
      let marksAwarded = 0;

      if (!isAttempted) {
        unattemptedCount++;
        status = "unattempted";
      } else if (isCorrect) {
        correctCount++;
        positiveMarks += 4;
        marksAwarded = 4;
        status = "correct";
      } else {
        wrongCount++;
        negativeMarks += 1;
        marksAwarded = -1;
        status = "wrong";
      }

      return {
        ...fullQ,
        studentAnswer: studentAns,
        isCorrect,
        status,
        marksAwarded,
      };
    });

    const netScore = positiveMarks - negativeMarks;
    const totalAttempted = correctCount + wrongCount;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const percentage = Math.round((netScore / (questions.length * 4)) * 100);

    res.json({
      success: true,
      result: {
        paperId,
        totalQuestions: questions.length,
        attempted: totalAttempted,
        correctCount,
        wrongCount,
        unattemptedCount,
        positiveMarks,
        negativeMarks,
        netScore,
        maxMarks: questions.length * 4,
        accuracy,
        percentage,
        evaluatedQuestions,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
