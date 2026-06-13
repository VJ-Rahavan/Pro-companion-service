import cron from 'node-cron';
import { pool } from '../db/pool';
import { sendReminderEmail } from '../services/email';
import { sendPushReminder } from '../services/push';

/**
 * Daily reminder job — runs every minute and checks if any user's reminder_time
 * matches the current HH:MM. For matching users who haven't solved today,
 * sends both an email and a push notification.
 *
 * Why every minute?
 * Each user can set a different reminder_time, so we can't schedule a single
 * fixed-time cron. Checking every minute is lightweight — the query is indexed
 * and returns quickly when no users match.
 */
export function startReminderJob() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();

    // Format current time as HH:MM to match the TIME column in PostgreSQL
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;

    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Find users whose reminder fires right now AND haven't solved anything today
    const { rows: users } = await pool.query(
      `SELECT u.id, u.email, u.expo_push_token, COALESCE(s.current_streak, 0) AS current_streak
       FROM users u
       LEFT JOIN streaks s ON s.user_id = u.id
       WHERE TO_CHAR(u.reminder_time, 'HH24:MI') = $1
         AND u.id NOT IN (
           SELECT DISTINCT user_id FROM user_progress
           WHERE DATE(solved_at) = $2 AND status = 'solved'
         )`,
      [currentTime, today],
    );

    if (users.length === 0) return;

    console.log(`[reminder] Sending to ${users.length} user(s) at ${currentTime}`);

    for (const user of users) {
      // Send email reminder
      try {
        await sendReminderEmail({
          to: user.email,
          name: user.email.split('@')[0], // fallback name until we store name in DB
          currentStreak: user.current_streak,
        });
      } catch (err) {
        console.error(`[reminder] Email failed for ${user.email}:`, err);
      }

      // Send push notification if the user has registered a device
      if (user.expo_push_token) {
        try {
          await sendPushReminder({
            token: user.expo_push_token,
            name: user.email,
            currentStreak: user.current_streak,
          });
        } catch (err) {
          console.error(`[reminder] Push failed for ${user.email}:`, err);
        }
      }
    }
  });

  console.log('[reminder] Job scheduled (runs every minute)');
}
