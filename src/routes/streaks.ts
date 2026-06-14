import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Streak } from '../entities/Streak';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/streaks
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const streak = await AppDataSource.getRepository(Streak).findOne({
    where: { userId: req.userId },
  });

  res.json({
    data: streak ?? { currentStreak: 0, longestStreak: 0, lastActiveDate: null },
  });
});

export default router;
