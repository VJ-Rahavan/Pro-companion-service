/**
 * Migration runner — reads SQL files from /migrations and applies them in order.
 *
 * How it works:
 * 1. Creates a _migrations table to track which files have already been applied.
 * 2. Reads all *.sql files from the migrations/ directory, sorted by filename.
 * 3. For each file not yet recorded in _migrations, runs the SQL and records it.
 *
 * Run with: npm run migrate
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from './pool';

async function runMigrations() {
  // Step 1: ensure the tracking table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         SERIAL      PRIMARY KEY,
      filename   TEXT        UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Step 2: read all SQL files sorted alphabetically (001_, 002_, etc.)
  const migrationsDir = path.join(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  // Step 3: apply each file that hasn't been run yet
  for (const file of files) {
    const { rows } = await pool.query(
      'SELECT 1 FROM _migrations WHERE filename = $1',
      [file],
    );

    if (rows.length > 0) {
      console.log(`[migrate] Already applied: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await pool.query(sql);
    await pool.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
    console.log(`[migrate] Applied: ${file}`);
  }

  console.log('[migrate] All migrations up to date');
  await pool.end();
}

runMigrations().catch((err) => {
  console.error('[migrate] Failed:', err);
  process.exit(1);
});
