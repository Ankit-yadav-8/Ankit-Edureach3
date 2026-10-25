// ─────────────────────────────────────────────────────────────────────────────
// Units and Measurements Question Bank Loader & AI-Optimized Quiz Solver
// ─────────────────────────────────────────────────────────────────────────────
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_PATH = path.resolve(__dirname, "../../public/data/JEE_Units_Measurements_Complete_Readable.xlsx");
const JSON_CACHE_PATH = path.resolve(__dirname, "../../src/data/unitsAndMeasurementsQuestions.json");

/**
 * Normalizes and extracts all 47 questions from the Excel workbook.
 * @returns {Array} List of standardized question objects.
 */
export function loadAllQuestions() {
  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(`Excel question bank not found at: ${EXCEL_PATH}`);
  }

  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames.includes("All Questions")
    ? "All Questions"
    : workbook.SheetNames[0];

  const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const questions = rawRows.map((row, idx) => {
    const qno = row["Question No."] || idx + 1;
    const diffRaw = String(row["Difficulty"] || "Moderate").trim().toLowerCase();
    const difficulty = diffRaw.includes("easy") ? "easy" : diffRaw.includes("hard") ? "hard" : "moderate";

    const options = [];
    ["A", "B", "C", "D"].forEach((key) => {
      const optVal = row[`Option ${key}`];
      if (optVal !== undefined && optVal !== null && String(optVal).trim() !== "") {
        options.push({
          key,
          text: String(optVal).trim(),
        });
      }
    });

    const correct = String(row["Answer (source workbook)"] || "A").trim().toUpperCase();
    const rationale = row["Difficulty rationale"] ? String(row["Difficulty rationale"]).trim() : "";
    const mathNote = row["Math / answer review note"] ? String(row["Math / answer review note"]).trim() : "";
    const explanation = [rationale, mathNote].filter(Boolean).join("\n\n");

    return {
      id: `units-q-${String(qno).padStart(3, "0")}`,
      qno,
      statement: String(row["Question (readable math)"] || "").trim(),
      options,
      correct,
      type: "single",
      subject: "Physics",
      chapter: "Units and Measurements",
      topic: String(row["Topic"] || "Units and Dimensions").trim(),
      difficulty, // 'easy' | 'moderate' | 'hard'
      difficultyRationale: rationale,
      explanation: explanation || `Correct answer is Option (${correct}).`,
      source: "JEE Units & Measurements Question Bank",
    };
  });

  return questions;
}

/**
 * Ensures the JSON cache file in src/data is up to date for frontend consumption.
 */
export function syncJsonCache() {
  const questions = loadAllQuestions();
  const dir = path.dirname(JSON_CACHE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(JSON_CACHE_PATH, JSON.stringify(questions, null, 2), "utf8");
  return questions;
}

/**
 * AI-Optimized Quiz Generation Algorithm.
 * 
 * Rules:
 * - Max questions: 15 (default 10)
 * - Easy: Easy + remaining Moderate
 * - Moderate: 40% Easy, 40% Moderate, 20% Hard (with smart relaxation for pool size)
 * - Difficult: 60% Moderate, 40% Hard (0 Easy)
 * 
 * @param {Object} options
 * @param {'easy'|'moderate'|'difficult'} [options.difficulty='moderate']
 * @param {number} [options.questionCount=10]
 * @param {boolean} [options.useAI=true]
 * @param {Array<string>} [options.selectedTopics]
 * @returns {Object} { paperId, title, questions, metadata, aiInsight }
 */
export function generateUnitsQuiz({
  difficulty = "moderate",
  questionCount = 10,
  useAI = true,
  selectedTopics = null,
} = {}) {
  const allQuestions = loadAllQuestions();
  const totalLimit = Math.min(Math.max(Number(questionCount) || 10, 3), 15); // Capped at 15 max

  // Filter by topics if provided
  let pool = allQuestions;
  if (Array.isArray(selectedTopics) && selectedTopics.length > 0) {
    const topicSet = new Set(selectedTopics.map((t) => t.trim().toLowerCase()));
    pool = allQuestions.filter((q) => topicSet.has(q.topic.trim().toLowerCase()));
    if (pool.length < totalLimit) {
      pool = allQuestions; // fallback if topic filter is too narrow
    }
  }

  const easyPool = pool.filter((q) => q.difficulty === "easy");
  const modPool = pool.filter((q) => q.difficulty === "moderate");
  const hardPool = pool.filter((q) => q.difficulty === "hard");

  let targetEasy = 0;
  let targetMod = 0;
  let targetHard = 0;

  if (difficulty === "easy") {
    // Easy + some medium questions
    targetEasy = Math.min(easyPool.length, Math.round(totalLimit * 0.4) || 2);
    targetMod = totalLimit - targetEasy;
    targetHard = 0;
  } else if (difficulty === "difficult") {
    // 60% moderate, 40% hard questions
    targetHard = Math.min(hardPool.length, Math.round(totalLimit * 0.40));
    targetMod = totalLimit - targetHard;
    targetEasy = 0;
  } else {
    // Moderate: 40% easy, 40% moderate, 20% hard
    const wantedEasy = Math.round(totalLimit * 0.40);
    targetEasy = Math.min(easyPool.length, wantedEasy);
    const remaining = totalLimit - targetEasy;
    targetHard = Math.min(hardPool.length, Math.round(remaining * 0.35));
    targetMod = totalLimit - targetEasy - targetHard;
  }

  // Shuffle arrays with a seeded or random permutation
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const pickedEasy = shuffle(easyPool).slice(0, targetEasy);
  const pickedMod = shuffle(modPool).slice(0, targetMod);
  const pickedHard = shuffle(hardPool).slice(0, targetHard);

  let selected = [...pickedEasy, ...pickedMod, ...pickedHard];

  // If still short of totalLimit, fill from any remaining questions in pool
  if (selected.length < totalLimit) {
    const chosenIds = new Set(selected.map((q) => q.id));
    const remainder = shuffle(pool.filter((q) => !chosenIds.has(q.id)));
    selected.push(...remainder.slice(0, totalLimit - selected.length));
  }

  // AI Cognitive Level Optimization & Progressive Topic Sequencing
  let aiInsight = "";
  if (useAI) {
    // Order questions to create a pedagogical cognitive flow:
    // 1. Definition / SI Units (Foundation)
    // 2. Dimensional Formulae & Constant derivations (Application)
    // 3. Measuring instruments & least count
    // 4. Multi-step Error Propagation & Advanced dimensional checks (Synthesis)
    const topicWeight = {
      "Units, unit systems and conversion": 1,
      "Significant figures and rounding": 2,
      "Dimensional formulae of physical quantities and constants": 3,
      "Dimensional analysis and units (inferred from question context)": 4,
      "Measuring instruments: least count, readings and zero correction": 5,
      "Dimensional analysis: dimensional formulae and checking equations": 6,
      "Errors and propagation of errors": 7,
    };

    selected.sort((a, b) => {
      const diffRank = { easy: 1, moderate: 2, hard: 3 };
      const diffDelta = diffRank[a.difficulty] - diffRank[b.difficulty];
      if (diffDelta !== 0) return diffDelta;
      const weightA = topicWeight[a.topic] || 5;
      const weightB = topicWeight[b.topic] || 5;
      return weightA - weightB;
    });

    aiInsight = `AI Test Optimizer: Balanced ${selected.length} questions across ${new Set(selected.map((q) => q.topic)).size} topics with progressive cognitive load (${pickedEasy.length} Easy, ${pickedMod.length} Moderate, ${pickedHard.length} Hard).`;
  } else {
    selected = shuffle(selected);
    aiInsight = `Standard Random Distribution: ${pickedEasy.length} Easy, ${pickedMod.length} Moderate, ${pickedHard.length} Hard.`;
  }

  const paperCode = `QUIZ-UM-${difficulty.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  return {
    paperId: paperCode,
    title: `Units & Dimensions — ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz`,
    chapter: "Units and Measurements",
    subject: "Physics",
    difficulty,
    totalQuestions: selected.length,
    durationMinutes: Math.round(selected.length * 2), // 2 mins per question standard JEE pace
    maxMarks: selected.length * 4,
    negativeMark: 1,
    aiInsight,
    questions: selected.map((q, idx) => ({
      ...q,
      displayNumber: idx + 1,
    })),
  };
}

export default {
  loadAllQuestions,
  syncJsonCache,
  generateUnitsQuiz,
};
