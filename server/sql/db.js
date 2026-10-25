// ─────────────────────────────────────────────────────────────────────────────
// PostgreSQL Connection Pool & Query Bridge for Campus Point Examination System
// ─────────────────────────────────────────────────────────────────────────────
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load server/.env as well as current working directory .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const { Pool } = pg;

// Construct configuration from DATABASE_URL or discrete variables
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
    }
  : {
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT || 5432),
      database: process.env.PGDATABASE || "campus_point",
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "postgres",
      ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
    };

export const pool = new Pool({
  ...connectionConfig,
  max: Number(process.env.PG_POOL_MAX || 20),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("⚠️ Unexpected idle PostgreSQL client error:", err.message);
});

/**
 * Execute a parameterized query against PostgreSQL.
 * @param {string} text - SQL statement
 * @param {Array} [params] - Query parameters
 * @returns {Promise<pg.QueryResult>}
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL === "true") {
      console.log(`[SQL] (${duration}ms) ${text.slice(0, 80)}...`);
    }
    return res;
  } catch (err) {
    console.error("❌ SQL Query Error:", err.message);
    throw err;
  }
}

/**
 * Test PostgreSQL connectivity and log status.
 * @returns {Promise<boolean>}
 */
export async function testPostgresConnection() {
  try {
    const res = await query("SELECT NOW() as current_time, version() as version;");
    console.log("✅ PostgreSQL connected successfully!");
    console.log(`   Server Time: ${res.rows[0].current_time}`);
    return true;
  } catch (err) {
    console.warn("⚠️ PostgreSQL connection check failed:", err.message);
    console.warn("   (Verify DATABASE_URL or PGHOST/PGPORT in server/.env)");
    return false;
  }
}

export default {
  pool,
  query,
  testPostgresConnection,
};
