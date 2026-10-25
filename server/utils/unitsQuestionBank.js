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

// ── Dimensional Formula Cleaner ──────────────────────────────────────────────
function cleanDimensionString(raw) {
  let s = String(raw).trim();
  s = s.replace(/\^\(([^)]+)\)/g, "^{$1}");
  if (s.startsWith("[") && s.endsWith("]")) s = s.slice(1, -1).trim();

  // Normalize braces
  s = s.replace(/\{M\s*L\s*T\}/g, "M L T");
  s = s.replace(/\{M\s*L\}/g, "M L");
  s = s.replace(/\{L\s*T\}/g, "L T");
  s = s.replace(/\{([A-Za-z])\}/g, "$1");

  // Separate adjacent letters: MLT -> M L T, hTLM -> h T L M
  s = s.replace(/([hMLTKA])(?=[hMLTKA])/g, "$1 ");
  s = s.replace(/(\}[hMLTKA])/g, (m) => m[0] + " " + m[1]);

  const tokens = s.split(/\s+/).filter(Boolean);
  const formattedTokens = tokens.map((t) => {
    const m = t.match(/^([hMLTKA])(?:\^\{?([^}]+)\}?)?$/);
    if (m) {
      const base = m[1];
      const exp = m[2];
      if (!exp || exp === "1") return base;
      return `${base}^{${exp}}`;
    }
    return t;
  });

  return `$[${formattedTokens.join("\\ ")}]$`;
}

function formatDimensionCell(raw) {
  let s = String(raw).trim();
  // Q7 List II has roots like √{((hc) / (G))}
  if (s.includes("√") || s.includes("((hc)")) {
    s = s.replace(/√\{\(\(hc\)\s*\/\s*\(G\)\)\}/g, "$\\sqrt{\\frac{h c}{G}}$");
    s = s.replace(/√\{\(\(Gh\)\s*\/\s*\(c\^\(?5\)?\)\)\}/g, "$\\sqrt{\\frac{G h}{c^5}}$");
    s = s.replace(/√\{\(\(hc\^\(?5\)?\)\s*\/\s*\(Gk\^\(?2\)?\)\)\}/g, "$\\sqrt{\\frac{h c^5}{G k^2}}$");
    s = s.replace(/√\{\(\(Gh\)\s*\/\s*\(c\^\(?3\)?\)\)\}/g, "$\\sqrt{\\frac{G h}{c^3}}$");
    return s;
  }
  return cleanDimensionString(s);
}

function cleanTextFormulas(raw) {
  let s = String(raw).trim();
  s = s.replace(/____+\s*\(m\)\s*m/g, "____ mm");
  s = s.replace(/____+\s*\(m\)\s*\/\s*s/g, "____ m/s");
  s = s.replace(/____+\s*\(r\)espectively/g, "____, respectively");
  s = s.replace(/\\\s*\{g\}/g, " g");
  s = s.replace(/\\\s*\{cm\}/g, " cm");
  s = s.replace(/\\\s*\{mm\}/g, " mm");
  s = s.replace(/(\d+)\s*\\%/g, "$1%");
  s = s.replace(/(\d+)\^\(\s*(st|nd|rd|th)\s*\)/gi, "$1$2");
  s = s.replace(/(\d+)\^\{\s*(st|nd|rd|th)\s*\}/gi, "$1$2");
  s = s.replace(/\{N\/m\}/g, "\\text{ N/m}");
  s = s.replace(/\{N\/m\^\(?2\)?\}/g, "\\text{ N/m}^2");
  s = s.replace(/\{A\/m\}/g, "\\text{A/m}");
  s = s.replace(/\{A\/m\^\(?2\)?\}/g, "\\text{A/m}^2");
  s = s.replace(/\{Am\^\(?2\)?\}/g, "\\text{A}\\cdot\\text{m}^2");
  return s;
}

// ── Match List Formatter (Markdown Table) ───────────────────────────────────
function formatMatchListTable(text) {
  const introMatch = text.match(/^(?:Match\s+(?:the\s+)?List\s*[-–]?\s*I\s+with\s+List\s*[-–]?\s*II\s*[:.]?\s*)/i);
  const body = introMatch ? text.slice(introMatch[0].length) : text;

  const list1Match = body.match(/List\s*[-–]?\s*I\s*[:.]?\s*([\s\S]+?)\s*List\s*[-–]?\s*II/i);
  const list2Match = body.match(/List\s*[-–]?\s*II\s*[:.]?\s*([\s\S]+?)(?:\s*(?:where\b|Choose the correct answer|\bwhere\s+h|\n|$))/i);

  if (!list1Match || !list2Match) return text;

  const rawList1 = list1Match[1].trim();
  const rawList2 = list2Match[1].trim();

  const l1Items = [];
  const l1Regex = /(?:^|\s+)(?:\(?([A-D])\)?\.?|\b([A-D])\.)\s+([\s\S]+?)(?=(?:\s+(?:\(?([A-D])\)?\.?|\b([A-D])\.)\s+)|$)/g;
  let m1;
  while ((m1 = l1Regex.exec(rawList1)) !== null) {
    l1Items.push({ letter: m1[1] || m1[2], val: m1[3].trim() });
  }

  const l2Items = [];
  const l2Regex = /(?:^|\s+)(?:\(?([IVX]+)\)?\.?|\b([IVX]+)\.)\s+([\s\S]+?)(?=(?:\s+(?:\(?([IVX]+)\)?\.?|\b([IVX]+)\.)\s+)|$)/g;
  let m2;
  while ((m2 = l2Regex.exec(rawList2)) !== null) {
    l2Items.push({ roman: m2[1] || m2[2], val: m2[3].trim() });
  }

  if (l1Items.length === 4 && l2Items.length === 4) {
    const header = "| List - I | List - II |\n| :--- | :--- |";
    const rows = l1Items.map((item, idx) => {
      const it2 = l2Items[idx];
      return `| **(${item.letter})** ${cleanTextFormulas(item.val)} | **(${it2.roman})** ${formatDimensionCell(it2.val)} |`;
    });

    let trailing = "";
    const trailMatch = body.match(/List\s*[-–]?\s*II\s*[:.]?[\s\S]+?((?:where\s+h|Choose the correct answer)[\s\S]*)$/i);
    if (trailMatch) {
      trailing = "\n\n" + trailMatch[1].trim();
    } else {
      trailing = "\n\nChoose the correct answer from the options given below:";
    }

    return `Match List - I with List - II:\n\n${header}\n${rows.join("\n")}${trailing}`;
  }

  return text;
}

// ── Question Statement Math Formatter ────────────────────────────────────────
function formatStatementMath(stmt) {
  let s = cleanTextFormulas(stmt);

  // Match List Table check
  if (/Match\s+(?:the\s+)?List\s*[-–]?\s*I\s+with\s+List\s*[-–]?\s*II/i.test(s)) {
    s = formatMatchListTable(s);
  }

  // Specific question statements formatting:
  s = s.replace(/H=\(\(x\^\(?p\)?ε\^\(?q\)?E\^\(?r\)?\)\s*\/\s*\(t\^\(?s\)?\)\)/g, "$H = \\frac{x^p \\varepsilon^q E^r}{t^s}$");
  s = s.replace(/V=\(\(A√\{x\}\)\s*\/\s*\(x\+B\)\)/g, "$V = \\frac{A\\sqrt{x}}{x + B}$");
  s = s.replace(/\{ML\}\^\(?2\)?\{T\}\^\(?-4\)?\{A\}\^\(?-2\)?/g, "$[M\\ L^2\\ T^{-4}\\ A^{-2}]$");
  s = s.replace(/\(\(1\)\s*\/\s*\(2\)\)ε₀E\^\(?2\)?/g, "$\\frac{1}{2}\\varepsilon_0 E^2$");
  s = s.replace(/M\^\(?a\)?L\^\(?b\)?T\^\(?c\)?/g, "$[M^a L^b T^c]$");
  s = s.replace(/2a-b\+c=\s*_{3,}/g, "$2a - b + c =$ ________");
  s = s.replace(/α×10\^\(?9\)?\s*\\?text\{\s*N\/m\^2\s*\}/g, "$\\alpha \\times 10^9\\text{ N/m}^2$");
  s = s.replace(/α×10\^\(?9\)?\s*\{N\/m\^\(?2\)?\}/g, "$\\alpha \\times 10^9\\text{ N/m}^2$");
  s = s.replace(/T=2π√\{\(\(m\)\s*\/\s*\(k\)\)\}/g, "$T = 2\\pi\\sqrt{\\frac{m}{k}}$");
  s = s.replace(/\(\(ε\s*E\)\s*\/\s*\(t\)\)/g, "$\\frac{\\varepsilon E}{t}$");
  s = s.replace(/k_\(1\)=\(10±0\.2\)(?:\\text\{\s*N\/m\s*\}|\{N\/m\})/g, "$k_1 = (10 \\pm 0.2)\\text{ N/m}$");
  s = s.replace(/k_\(2\)=\(20±0\.3\)(?:\\text\{\s*N\/m\s*\}|\{N\/m\})/g, "$k_2 = (20 \\pm 0.3)\\text{ N/m}$");
  s = s.replace(/\(\{P\}\s*\+\s*\(\(A\)\s*\/\s*\(Bt\^\(?2\)?\)\)\)\s*\+\s*ρ\s*g\(h\s*\+\s*Bt\)\s*\+\s*\(\(1\)\s*\/\s*\(2\)\)ρ\s*V\^\(?2\)?\s*=\s*constant/g,
    "$\\left(P + \\frac{A}{B t^2}\\right) + \\rho g(h + B t) + \\frac{1}{2}\\rho V^2 = \\text{constant}$");
  s = s.replace(/X\^\(-2\)\s*Y\^\(\+\(\(3\)\s*\/\s*\(2\)\)\)\s*Z\^\(-\(\(2\)\s*\/\s*\(5\)\)\)/g,
    "$X^{-2} Y^{3/2} Z^{-2/5}$");
  s = s.replace(/√\{\(\(μ₀\)\s*\/\s*\(ε₀\)\)\}/g, "$\\sqrt{\\frac{\\mu_0}{\\varepsilon_0}}$");
  s = s.replace(/\[\{M\}\^\(?P\)?\{L\}\^\(?Q\)?\{T\}\^\(?R\)?A\^\(?S\)?\]/g, "$[M^P\\ L^Q\\ T^R\\ A^S]$");
  s = s.replace(/M\^\(?P\)?L\^\(?Q\)?T\^\(?R\)?A\^\(?S\)?/g, "$[M^P\\ L^Q\\ T^R\\ A^S]$");
  s = s.replace(/\(\(\(1\)\s*\/\s*\(μ₀ε₀\)\)\)/g, "$\\frac{1}{\\mu_0 \\varepsilon_0}$");
  s = s.replace(/\(\{P\}\s*\+\s*\(\(\{a\}\)\s*\/\s*\(\{V\}\^\(?2\)?\)\)\)\s*\(\{V\}\s*-\s*\{b\}\)\s*=\s*\{RT\}/g,
    "$\\left(P + \\frac{a}{V^2}\\right)(V - b) = RT$");
  s = s.replace(/\{ab\}\^\(?-2\)?/g, "$a b^{-2}$");
  s = s.replace(/v=\{At\}\^\(?2\)?\s*\+\s*\(\(\{Bt\}\)\s*\/\s*\(\{C\}\s*\+\s*\{t\}\)\)/g,
    "$v = A t^2 + \\frac{B t}{C + t}$");

  s = s.replace(/\(μ₀\s*=/g, "($\\mu_0$ =");
  s = s.replace(/and\s*ε₀\s*=/g, "and $\\varepsilon_0$ =");
  s = s.replace(/\bμ₀\s+and\s+ε₀\b/g, "$\\mu_0$ and $\\varepsilon_0$");

  return s;
}

// ── Option Math Formatter ────────────────────────────────────────────────────
function formatOptionMath(optText) {
  let s = cleanTextFormulas(optText);

  // Q10 options (inductance, capacitance, resistance):
  s = s.replace(/^\(\(R\)\s*\/\s*\(√\{LC\}\)\)$/, "$\\frac{R}{\\sqrt{LC}}$");
  s = s.replace(/^\(\(R\)\s*\/\s*\(LC\)\)$/, "$\\frac{R}{LC}$");
  s = s.replace(/^\(\(C\)\s*\/\s*\(√\{LR\}\)\)$/, "$\\frac{C}{\\sqrt{LR}}$");
  s = s.replace(/^\(\(1\)\s*\/\s*\(R\)\)√\{\(\(L\)\s*\/\s*\(C\)\)\}$/, "$\\frac{1}{R}\\sqrt{\\frac{L}{C}}$");

  // Q28 options (viscosity error):
  s = s.replace(/^2\[\(\(Δ\s*r\)\s*\/\s*\(r\)\)-\(\(Δ\s*v_\(0\)\)\s*\/\s*\(v_\(0\)\)\)\]$/,
    "$2\\left[\\frac{\\Delta r}{r} - \\frac{\\Delta v_0}{v_0}\\right]$");
  s = s.replace(/^2\[\(\(Δ\s*r\)\s*\/\s*\(r\)\)\+\(\(Δ\s*v_\(0\)\)\s*\/\s*\(v_\(0\)\)\)\]$/,
    "$2\\left[\\frac{\\Delta r}{r} + \\frac{\\Delta v_0}{v_0}\\right]$");
  s = s.replace(/^\(\(2Δ\s*r\)\s*\/\s*\(r\)\)\+\(\(Δ\s*v_\(0\)\)\s*\/\s*\(v_\(0\)\)\)$/,
    "$\\frac{2\\Delta r}{r} + \\frac{\\Delta v_0}{v_0}$");
  s = s.replace(/^2\(\(Δ\s*r\)\s*\/\s*\(r\)\)-\(\(Δ\s*v_\(0\)\)\s*\/\s*\(v_\(0\)\)\)$/,
    "$2\\left(\\frac{\\Delta r}{r}\\right) - \\frac{\\Delta v_0}{v_0}$");

  // Q41 options:
  s = s.replace(/^\{?T\}?\^\(?2\)?\s*\/\s*\{?L\}?$/, "$\\frac{T^2}{L}$");
  s = s.replace(/^\{?L\}?\^\(?2\)?\s*\/\s*\{?T\}?\^\(?2\)?$/, "$\\frac{L^2}{T^2}$");
  s = s.replace(/^\{?T\}?\^\(?2\)?\s*\/\s*\{?L\}?\^\(?2\)?$/, "$\\frac{T^2}{L^2}$");
  s = s.replace(/^\{?L\}?\s*\/\s*\{?T\}?\^\(?2\)?$/, "$\\frac{L}{T^2}$");

  // Q42 options:
  s = s.replace(/^qI\/μ₀$/, "$\\frac{q I}{\\mu_0}$");
  s = s.replace(/^q\^\(?2\)?μ₀I$/, "$q^2 \\mu_0 I$");
  s = s.replace(/^qμ₀\/I$/, "$\\frac{q \\mu_0}{I}$");
  s = s.replace(/^\{?q\}?μ₀\{?I\}?$/, "$q \\mu_0 I$");

  // Generic dimensional options e.g. [{ML}^(0){T}^(-1)] and [{M}^(0){LT}]
  s = s.replace(/\[\s*\{?[hMLTKA][^\]]+\]/g, (m) => cleanDimensionString(m));

  // Scientific notation options: e.g. 1×10^(-2) -> $1 \times 10^{-2}$
  s = s.replace(/^(\d+)\s*×\s*10\^\(?(-?\d+)\)?$/, "$$1 \\times 10^{$2}$");

  // Alpha options: 200α -> $200\alpha$
  s = s.replace(/^(\d+)α$/, "$$1\\alpha$");

  return s;
}

/**
 * Normalizes and extracts all 47 questions from the Excel workbook with clean math formatting.
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
        const rawOptText = String(optVal).trim();
        options.push({
          key,
          text: formatOptionMath(rawOptText),
        });
      }
    });

    const correct = String(row["Answer (source workbook)"] || "A").trim().toUpperCase();
    const rationale = row["Difficulty rationale"] ? String(row["Difficulty rationale"]).trim() : "";
    const mathNote = row["Math / answer review note"] ? String(row["Math / answer review note"]).trim() : "";
    const rawExplanation = [rationale, mathNote].filter(Boolean).join("\n\n");
    const explanation = rawExplanation
      ? formatStatementMath(rawExplanation)
      : `Correct answer is Option (${correct}).`;

    const rawStatement = String(row["Question (readable math)"] || "").trim();
    const statement = formatStatementMath(rawStatement);

    return {
      id: `units-q-${String(qno).padStart(3, "0")}`,
      qno,
      statement,
      options,
      correct,
      type: "single",
      subject: "Physics",
      chapter: "Units and Measurements",
      topic: String(row["Topic"] || "Units and Dimensions").trim(),
      difficulty, // 'easy' | 'moderate' | 'hard'
      difficultyRationale: rationale,
      explanation,
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
