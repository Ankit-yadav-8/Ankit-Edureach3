// ─────────────────────────────────────────────────────────────────────────────
// PostgreSQL Migration & Seeding Runner for Campus Point
// ─────────────────────────────────────────────────────────────────────────────
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query, pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log("🚀 Starting PostgreSQL migration...");
  
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    await query(schemaSql);
    console.log("✅ Schema tables, types, and indexes created successfully!");

    // Seed Core Subjects
    await query(`
      INSERT INTO subjects (name, code, display_order)
      VALUES 
        ('Physics', 'PHY', 1),
        ('Chemistry', 'CHE', 2),
        ('Mathematics', 'MAT', 3),
        ('Biology', 'BIO', 4)
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log("✅ Core subjects seeded.");

    // Seed 'Units and Measurements' Chapter under Physics
    const phyRes = await query("SELECT subject_id FROM subjects WHERE code = 'PHY'");
    if (phyRes.rows.length > 0) {
      const phyId = phyRes.rows[0].subject_id;
      
      const chapRes = await query(`
        INSERT INTO chapters (subject_id, name, code, display_order)
        VALUES ($1, 'Units and Measurements', 'units-and-measurements', 1)
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
        RETURNING chapter_id;
      `, [phyId]);

      const chapterId = chapRes.rows[0]?.chapter_id || (
        await query("SELECT chapter_id FROM chapters WHERE code = 'units-and-measurements'")
      ).rows[0].chapter_id;

      // Seed standard topics from the Excel workbook
      const topics = [
        { name: "Units, unit systems and conversion", code: "units-conversion" },
        { name: "Dimensional formulae of physical quantities and constants", code: "dim-formulae-constants" },
        { name: "Errors and propagation of errors", code: "error-propagation" },
        { name: "Measuring instruments: least count, readings and zero correction", code: "measuring-instruments" },
        { name: "Dimensional analysis: dimensional formulae and checking equations", code: "dim-analysis-equations" },
        { name: "Dimensional analysis and units (inferred from question context)", code: "dim-analysis-units" },
        { name: "Significant figures and rounding", code: "sig-figures-rounding" }
      ];

      for (const t of topics) {
        await query(`
          INSERT INTO topics (chapter_id, name, code)
          VALUES ($1, $2, $3)
          ON CONFLICT (code) DO NOTHING;
        `, [chapterId, t.name, t.code]);
      }
      console.log(`✅ 'Units and Measurements' chapter & ${topics.length} topics seeded.`);
    }

    return true;
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    return false;
  }
}

// Run directly if invoked from command line
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations().then(() => pool.end());
}
