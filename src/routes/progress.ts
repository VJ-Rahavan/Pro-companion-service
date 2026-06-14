import { Router } from 'express';
import { z } from 'zod';
import { AppDataSource } from '../data-source';
import { UserProgress } from '../entities/UserProgress';
import { updateStreak } from '../services/streak';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const progressSchema = z.object({
  problem_id: z.string().uuid(),
  status: z.enum(['solved', 'failed', 'skipped']),
  time_taken_seconds: z.number().int().positive().optional(),
});

// POST /api/progress — log a problem attempt (upsert: re-attempting updates the existing record)
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const parsed = progressSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { problem_id, status, time_taken_seconds } = parsed.data;
  const repo = AppDataSource.getRepository(UserProgress);

  let record = await repo.findOne({ where: { userId: req.userId!, problemId: problem_id } });

  if (record) {
    record.status = status;
    record.timeTakenSeconds = time_taken_seconds ?? null;
    record.solvedAt = new Date();
  } else {
    record = repo.create({
      userId: req.userId!,
      problemId: problem_id,
      status,
      timeTakenSeconds: time_taken_seconds ?? null,
    });
  }

  await repo.save(record);

  if (status === 'solved') {
    await updateStreak(req.userId!);
  }

  res.status(201).json({ data: record });
});

// GET /api/progress — all attempts for the authenticated user
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const records = await AppDataSource.getRepository(UserProgress).find({
    where: { userId: req.userId },
    relations: { problem: true },
    order: { solvedAt: 'DESC' },
  });

  res.json({ data: records });
});

export default router;
