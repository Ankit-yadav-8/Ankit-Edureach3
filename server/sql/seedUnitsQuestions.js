// ─────────────────────────────────────────────────────────────────────────────
// Seed 47 Questions from Excel directly into PostgreSQL Database
// ─────────────────────────────────────────────────────────────────────────────
import { query, pool } from "./db.js";
import { loadAllQuestions } from "../utils/unitsQuestionBank.js";

export async function seedUnitsQuestionsIntoSQL() {
  console.log("📦 Ingesting 47 Units and Measurements questions into PostgreSQL...");

  try {
    // 1. Get or create Subject: Physics
    let subRes = await query("SELECT subject_id FROM subjects WHERE code = 'PHY'");
    let subjectId = subRes.rows[0]?.subject_id;
    if (!subjectId) {
      const insSub = await query(
        "INSERT INTO subjects (name, code, display_order) VALUES ('Physics', 'PHY', 1) RETURNING subject_id"
      );
      subjectId = insSub.rows[0].subject_id;
    }

    // 2. Get or create Chapter: Units and Measurements
    let chapRes = await query("SELECT chapter_id FROM chapters WHERE code = 'units-and-measurements'");
    let chapterId = chapRes.rows[0]?.chapter_id;
    if (!chapterId) {
      const insChap = await query(
        "INSERT INTO chapters (subject_id, name, code, display_order) VALUES ($1, 'Units and Measurements', 'units-and-measurements', 1) RETURNING chapter_id",
        [subjectId]
      );
      chapterId = insChap.rows[0].chapter_id;
    }

    // 3. Load all 47 questions from the Excel workbook
    const questions = loadAllQuestions();
    console.log(`Loaded ${questions.length} questions from Excel. Seeding into SQL...`);

    let insertedCount = 0;

    // Ensure 'moderate' is a valid enum value in PostgreSQL
    await query("ALTER TYPE difficulty_level_enum ADD VALUE IF NOT EXISTS 'moderate'").catch(() => {});

    for (const q of questions) {
      const difficultyVal = q.difficulty === "moderate" ? "medium" : q.difficulty;

      // Find or create topic
      let topicId = null;
      if (q.topic) {
        const topicCode = q.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
        const topRes = await query("SELECT topic_id FROM topics WHERE code = $1", [topicCode]);
        if (topRes.rows.length > 0) {
          topicId = topRes.rows[0].topic_id;
        } else {
          const insTop = await query(
            "INSERT INTO topics (chapter_id, name, code) VALUES ($1, $2, $3) RETURNING topic_id",
            [chapterId, q.topic, topicCode]
          );
          topicId = insTop.rows[0].topic_id;
        }
      }

      // Check if question already exists by source_reference
      const existingQ = await query(
        "SELECT question_id FROM questions WHERE source_reference = $1",
        [q.id]
      );

      let questionId;
      if (existingQ.rows.length > 0) {
        questionId = existingQ.rows[0].question_id;
      } else {
        const insQ = await query(
          `INSERT INTO questions 
            (source_reference, exam_category, subject_id, chapter_id, topic_id, question_type, difficulty, default_positive_marks, default_negative_marks, verification_status)
           VALUES 
            ($1, 'both', $2, $3, $4, 'single_mcq', $5, 4.00, 1.00, 'verified')
           RETURNING question_id`,
          [q.id, subjectId, chapterId, topicId, difficultyVal]
        );
        questionId = insQ.rows[0].question_id;
        insertedCount++;
      }

      // Insert English Translation
      await query(
        `INSERT INTO question_translations (question_id, language_code, statement_latex, solution_latex)
         VALUES ($1, 'en', $2, $3)
         ON CONFLICT (question_id, language_code) 
         DO UPDATE SET statement_latex = EXCLUDED.statement_latex, solution_latex = EXCLUDED.solution_latex`,
        [questionId, q.statement, q.explanation]
      );

      // Insert Options
      for (const opt of q.options) {
        const isCorrect = opt.key === q.correct;
        await query(
          `INSERT INTO question_options (question_id, option_key, option_text, is_correct)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (question_id, option_key)
           DO UPDATE SET option_text = EXCLUDED.option_text, is_correct = EXCLUDED.is_correct`,
          [questionId, opt.key, opt.text, isCorrect]
        );
      }
    }

    console.log(`✅ Success! Seeded/verified ${questions.length} questions into PostgreSQL.`);
    return true;
  } catch (err) {
    console.error("❌ Seeding questions into PostgreSQL failed:", err.message);
    return false;
  }
}

// Run directly if invoked from command line
if (process.argv[1].endsWith("seedUnitsQuestions.js")) {
  seedUnitsQuestionsIntoSQL().then(() => pool.end());
}
