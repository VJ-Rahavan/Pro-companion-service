import cron from 'node-cron';
import { AppDataSource } from '../data-source';
import { sendReminderEmail } from '../services/email';
import { sendPushReminder } from '../services/push';

export function startReminderJob() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;
    const today = now.toISOString().split('T')[0];

    // Raw query: TO_CHAR on a TIME column requires native SQL
    const users: Array<{
      id: string; email: string; expo_push_token: string | null; current_streak: number;
    }> = await AppDataSource.query(
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
      const name = user.email.split('@')[0];

      try {
        await sendReminderEmail({ to: user.email, name, currentStreak: user.current_streak });
      } catch (err) {
        console.error(`[reminder] Email failed for ${user.email}:`, err);
      }

      if (user.expo_push_token) {
        try {
          await sendPushReminder({ token: user.expo_push_token, name, currentStreak: user.current_streak });
        } catch (err) {
          console.error(`[reminder] Push failed for ${user.email}:`, err);
        }
      }
    }
  });

  console.log('[reminder] Job scheduled (runs every minute)');
}
