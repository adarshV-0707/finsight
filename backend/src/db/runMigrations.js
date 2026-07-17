import fs from "fs";
import path from "path";
import { pool } from "./pool.js";

const MIGRATIONS_DIR = path.join(process.cwd(), "src/db/migrations");

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations_log (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const executedResult = await client.query(
      `SELECT filename FROM migrations_log`,
    );

    const executed = new Set(
      executedResult.rows.map((row) => row.filename),
    );

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      if (executed.has(file)) {
        console.log(`Skipping (already run): ${file}`);
        continue;
      }

      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Running migration: ${file}`);

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          `INSERT INTO migrations_log (filename) VALUES ($1)`,
          [file],
        );

        await client.query("COMMIT");

        console.log(`Completed migration: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("All migrations up to date.");
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});