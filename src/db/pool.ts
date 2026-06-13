import { Pool } from 'pg';

// Single shared connection pool — reused across all queries in the process.
// pg automatically manages idle/active connections within the pool.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Verify connectivity on startup so we fail fast if the DB is unreachable
export async function connectDB() {
  const client = await pool.connect();
  client.release();
  console.log('[db] Connected to PostgreSQL');
}
