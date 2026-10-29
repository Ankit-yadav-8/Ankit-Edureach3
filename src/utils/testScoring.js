/**
 * Test Scoring & Percentage Normalization Utility (Frontend)
 * Standardizes calculation of test percentages, scores, and handles edge cases:
 * - Percentage = (Marks Obtained / Maximum Possible Marks) * 100
 * - Resolves question count vs max marks confusion (e.g. 75 entered instead of 300)
 * - Resolves JEE Advanced Paper 1 vs Paper 1+2 mismatch (180 vs 360)
 * - Handles negative marking and zero division
 * - Normalizes score objects for consistent display across Student & Mentor dashboards
 */

export function normalizeTestScore({
  score,
  scored,
  maxMarks,
  total,
  totalQuestions,
  examType = "standard",
  type = "",
  correctCount = 0,
  correct = 0,
  wrongCount = 0,
  wrong = 0,
  skippedCount = 0,
  skipped = 0,
} = {}) {
  const s = Number(score ?? scored) || 0;
  let max = Number(maxMarks ?? total) || 0;
  const cCount = Number(correctCount || correct) || 0;
  const wCount = Number(wrongCount || wrong) || 0;
  const skCount = Number(skippedCount || skipped) || 0;
  const qCount = Number(totalQuestions) || (cCount + wCount + skCount) || 0;
  const normExam = String(examType || type || "").toLowerCase();

  // 1. Detect if maxMarks was erroneously entered as question count
  if (normExam.includes("main") || normExam === "mains") {
    // JEE Main standard is 300 marks (75 questions to attempt * 4 marks)
    if (max <= 90) max = 300;
  } else if (normExam.includes("neet")) {
    // NEET standard is 720 marks (180 questions * 4 marks)
    if (max <= 200) max = 720;
  } else if (normExam.includes("adv") || normExam === "advanced") {
    // JEE Advanced: 360 marks for combined Paper 1 + 2
    if (max <= 180 && s > 180) {
      max = 360;
    } else if (max <= 0) {
      max = 360;
    }
  } else if (qCount > 0 && max <= qCount) {
    // If max marks was entered as <= question count, it was entered as questions count, not marks
    max = qCount * 4;
  }

  // 2. Fallback if max is still invalid or zero
  if (max <= 0) {
    if (qCount > 0) max = qCount * 4;
    else max = Math.max(100, Math.ceil(Math.max(s, 1) / 100) * 100);
  }

  // 3. Ensure max is at least as large as the score to prevent > 100% bugs
  if (s > max && max > 0) {
    if (s <= 300 && (normExam.includes("main") || normExam === "mains")) max = 300;
    else if (s <= 360 && (normExam.includes("adv") || normExam === "advanced")) max = 360;
    else if (s <= 720 && normExam.includes("neet")) max = 720;
    else max = Math.ceil(s / 10) * 10;
  }

  // 4. Calculate Percentage using official formula: (Marks Obtained / Maximum Possible Marks) * 100
  const rawPct = (s / max) * 100;
  const roundedPct = Math.round(rawPct * 10) / 10;
  const percent = Math.min(100, Math.max(0, roundedPct));

  const attempted = cCount + wCount;
  const accuracy =
    attempted > 0
      ? Math.min(100, Math.max(0, Math.round((cCount / attempted) * 100)))
      : 0;

  return {
    score: s,
    scored: s,
    maxMarks: max,
    total: max,
    percent,
    rawPercent: roundedPct,
    accuracy,
    totalQuestions: qCount,
    correctCount: cCount,
    wrongCount: wCount,
    skippedCount: skCount,
  };
}
