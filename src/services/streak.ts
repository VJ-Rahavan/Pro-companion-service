import { pool } from '../db/pool';

/**
 * Updates the streak for a user after they solve a problem.
 *
 * Rules:
 * - If last_active_date is today     → already counted, no change
 * - If last_active_date is yesterday → consecutive day, increment streak
 * - If last_active_date is older     → streak broken, reset to 1
 * - If no streak row exists          → create one with streak = 1
 */
export async function updateStreak(userId: string) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Check if a streak row already exists for this user
  const { rows } = await pool.query(
    'SELECT * FROM streaks WHERE user_id = $1',
    [userId],
  );

  if (rows.length === 0) {
    // First time solving — create the streak row
    await pool.query(
      `INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date)
       VALUES ($1, 1, 1, $2)`,
      [userId, today],
    );
    return;
  }

  const streak = rows[0];

  // Already solved something today — nothing to update
  if (streak.last_active_date === today) return;

  const isConsecutive = streak.last_active_date === yesterdayStr;
  const newCurrent = isConsecutive ? streak.current_streak + 1 : 1;
  const newLongest = Math.max(streak.longest_streak, newCurrent);

  await pool.query(
    `UPDATE streaks
     SET current_streak = $1, longest_streak = $2, last_active_date = $3
     WHERE user_id = $4`,
    [newCurrent, newLongest, today, userId],
  );
}
