// ─────────────────────────────────────────────────────────────────────────────
// Ensure Database 'campus_point' exists in PostgreSQL
// ─────────────────────────────────────────────────────────────────────────────
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

async function init() {
  const password = process.env.PGPASSWORD;
  if (!password) {
    throw new Error("PGPASSWORD environment variable is missing.");
  }
  const client = new Client({
    host: process.env.PGHOST || "127.0.0.1",
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || "postgres",
    password: password,
    database: "postgres", // Connect to default database first
  });

  try {
    await client.connect();
    console.log("✅ Authenticated with PostgreSQL superuser successfully!");

    const checkRes = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'campus_point'"
    );

    if (checkRes.rows.length === 0) {
      console.log("Creating database 'campus_point'...");
      await client.query('CREATE DATABASE "campus_point"');
      console.log("✅ Database 'campus_point' created successfully!");
    } else {
      console.log("✅ Database 'campus_point' already exists.");
    }

    await client.end();
    return true;
  } catch (err) {
    console.error("❌ PostgreSQL Initialization Error:", err.message);
    await client.end();
    return false;
  }
}

init();
