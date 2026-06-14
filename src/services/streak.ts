import { AppDataSource } from '../data-source';
import { Streak } from '../entities/Streak';

export async function updateStreak(userId: string): Promise<void> {
  const repo = AppDataSource.getRepository(Streak);
  const streak = await repo.findOne({ where: { userId } });
  if (!streak) return;

  const today = new Date().toISOString().split('T')[0];

  if (streak.lastActiveDate === today) return; // already counted today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const isConsecutive = streak.lastActiveDate === yesterdayStr;
  streak.currentStreak = isConsecutive ? streak.currentStreak + 1 : 1;
  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.lastActiveDate = today;

  await repo.save(streak);
}
