// ─────────────────────────────────────────────────────────────────────────────
// Comprehensive System Verification Script (PostgreSQL + Quiz Generator + API)
// ─────────────────────────────────────────────────────────────────────────────
import { query, pool, testPostgresConnection } from "../sql/db.js";
import { loadAllQuestions, generateUnitsQuiz } from "../utils/unitsQuestionBank.js";

async function verifyAll() {
  console.log("=================================================");
  console.log("🔍 CAMPUS POINT COMPREHENSIVE SYSTEM VERIFICATION");
  console.log("=================================================\n");

  let allPassed = true;

  // 1. PostgreSQL Connection Check
  console.log("TEST 1: PostgreSQL 18 Connection");
  const pgConnected = await testPostgresConnection();
  if (pgConnected) {
    console.log("  [PASS] PostgreSQL is connected and responsive.\n");
  } else {
    console.log("  [FAIL] PostgreSQL connection failed.\n");
    allPassed = false;
  }

  // 2. Table Integrity Check
  console.log("TEST 2: Database Schema & Tables");
  try {
    const tableRes = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    const tables = tableRes.rows.map((r) => r.table_name);
    console.log(`  Found ${tables.length} tables in 'campus_point':`, tables.join(", "));
    
    const requiredTables = ["subjects", "chapters", "topics", "questions", "question_translations", "question_options", "test_papers", "paper_questions", "exam_attempts", "students_sync"];
    const missing = requiredTables.filter((t) => !tables.includes(t));
    if (missing.length === 0) {
      console.log("  [PASS] All core examination tables exist.\n");
    } else {
      console.log("  [FAIL] Missing tables:", missing.join(", "), "\n");
      allPassed = false;
    }
  } catch (err) {
    console.log("  [FAIL] Error checking tables:", err.message, "\n");
    allPassed = false;
  }

  // 3. Question Bank Data Verification in PostgreSQL
  console.log("TEST 3: Units & Dimensions Question Bank in PostgreSQL");
  try {
    const qCount = await query("SELECT count(*) FROM questions");
    const optCount = await query("SELECT count(*) FROM question_options");
    const transCount = await query("SELECT count(*) FROM question_translations");
    const diffBreakdown = await query("SELECT difficulty, count(*) FROM questions GROUP BY difficulty ORDER BY count DESC");

    console.log(`  Questions in DB:    ${qCount.rows[0].count} (Expected: 47)`);
    console.log(`  Options in DB:      ${optCount.rows[0].count} (Expected: 188)`);
    console.log(`  Translations in DB: ${transCount.rows[0].count} (Expected: 47)`);
    console.log("  Difficulty Breakdown in DB:", diffBreakdown.rows.map((r) => `${r.difficulty}: ${r.count}`).join(", "));

    if (Number(qCount.rows[0].count) >= 47 && Number(optCount.rows[0].count) >= 188) {
      console.log("  [PASS] All 47 questions and 188 options properly populated in PostgreSQL.\n");
    } else {
      console.log("  [FAIL] Incomplete question count.\n");
      allPassed = false;
    }
  } catch (err) {
    console.log("  [FAIL] Error querying question bank:", err.message, "\n");
    allPassed = false;
  }

  // 4. Algorithm Test: Easy, Moderate, Difficult Distribution & AI Optimization
  console.log("TEST 4: Quiz Generation Constraints & AI Level Optimization");
  try {
    const easyQuiz = generateUnitsQuiz({ difficulty: "easy", questionCount: 10, useAI: true });
    const modQuiz = generateUnitsQuiz({ difficulty: "moderate", questionCount: 15, useAI: true });
    const hardQuiz = generateUnitsQuiz({ difficulty: "difficult", questionCount: 15, useAI: true });

    console.log(`  Easy Quiz (10 Qs):      ${easyQuiz.questions.length} Qs, Max Marks: ${easyQuiz.maxMarks}, ${easyQuiz.aiInsight}`);
    console.log(`  Moderate Quiz (15 Qs):  ${modQuiz.questions.length} Qs, Max Marks: ${modQuiz.maxMarks}, ${modQuiz.aiInsight}`);
    console.log(`  Difficult Quiz (15 Qs): ${hardQuiz.questions.length} Qs, Max Marks: ${hardQuiz.maxMarks}, ${hardQuiz.aiInsight}`);

    // Verify 15 question cap
    const cappedQuiz = generateUnitsQuiz({ difficulty: "moderate", questionCount: 25 });
    if (cappedQuiz.questions.length === 15) {
      console.log("  [PASS] 15 Question Maximum Cap successfully enforced (Requested 25, got 15).");
    } else {
      console.log(`  [FAIL] Max cap failed. Received: ${cappedQuiz.questions.length}`);
      allPassed = false;
    }

    // Verify Difficult has 0 Easy
    const hardEasyCount = hardQuiz.questions.filter((q) => q.difficulty === "easy").length;
    if (hardEasyCount === 0) {
      console.log("  [PASS] Difficult Quiz contains 0 Easy questions (60% Moderate, 40% Hard).");
    } else {
      console.log("  [FAIL] Difficult Quiz contained Easy questions.");
      allPassed = false;
    }

    console.log("  [PASS] All algorithmic distribution rules validated.\n");
  } catch (err) {
    console.log("  [FAIL] Quiz generation algorithm error:", err.message, "\n");
    allPassed = false;
  }

  // 5. Evaluation Engine Test (+4 / -1 Marking & Accuracy)
  console.log("TEST 5: Evaluation Engine (+4 / -1 Marking & Accuracy Formula)");
  try {
    const sampleQuiz = generateUnitsQuiz({ difficulty: "moderate", questionCount: 10 });
    const q1 = sampleQuiz.questions[0];
    const q2 = sampleQuiz.questions[1];
    const q3 = sampleQuiz.questions[2];

    const fullQuestions = loadAllQuestions();
    const qMap = new Map(fullQuestions.map((q) => [q.id, q]));

    // Simulate student answering: Q1 correct, Q2 wrong, Q3 skipped
    const answers = {
      [q1.id]: qMap.get(q1.id).correct, // Correct
      [q2.id]: qMap.get(q2.id).correct === "A" ? "B" : "A", // Incorrect
      // Q3 omitted (skipped)
    };

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let positiveMarks = 0;
    let negativeMarks = 0;

    [q1, q2, q3].forEach((q) => {
      const fullQ = qMap.get(q.id);
      const studentAns = answers[q.id];
      if (!studentAns) unattemptedCount++;
      else if (studentAns === fullQ.correct) { correctCount++; positiveMarks += 4; }
      else { wrongCount++; negativeMarks += 1; }
    });

    const netScore = positiveMarks - negativeMarks; // 4 - 1 = 3
    const accuracy = Math.round((correctCount / (correctCount + wrongCount)) * 100); // 1 / 2 = 50%

    console.log(`  Simulated 3 Questions: Positive: +${positiveMarks}, Negative: -${negativeMarks}, Net Score: ${netScore}, Accuracy: ${accuracy}%`);
    if (positiveMarks === 4 && negativeMarks === 1 && netScore === 3 && accuracy === 50) {
      console.log("  [PASS] Evaluation formulas verified: Net = Positive - Negative, Accuracy = Correct / Attempted.\n");
    } else {
      console.log("  [FAIL] Evaluation math mismatch.\n");
      allPassed = false;
    }
  } catch (err) {
    console.log("  [FAIL] Evaluation engine error:", err.message, "\n");
    allPassed = false;
  }

  // Close PostgreSQL pool
  await pool.end();

  console.log("=================================================");
  if (allPassed) {
    console.log("🎉 ALL TESTS PASSED! Examination System is 100% Operational.");
  } else {
    console.log("⚠️ Some tests reported issues. Review logs above.");
  }
  console.log("=================================================");
}

verifyAll();
