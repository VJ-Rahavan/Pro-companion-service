import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { updateStreak } from '../services/streak';

const router = Router();

const progressSchema = z.object({
  problem_id: z.string().uuid(),
  status: z.enum(['solved', 'failed', 'skipped']),
  time_taken_seconds: z.number().int().positive().optional(),
});

// ─── POST /api/progress ───────────────────────────────────────────────────────
//
// Logs a problem attempt (solve / fail / skip).
// If the user has already attempted this problem, the record is updated (upsert).
// Solving a problem also triggers the streak update logic.

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  // Step 1: validate request body
  const parsed = progressSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { problem_id, status, time_taken_seconds } = parsed.data;

  // Step 2: upsert the progress record
  // ON CONFLICT updates if the user re-attempts the same problem
  const { rows } = await pool.query(
    `INSERT INTO user_progress (user_id, problem_id, status, time_taken_seconds)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, problem_id)
     DO UPDATE SET status = $3, time_taken_seconds = $4, solved_at = NOW()
     RETURNING *`,
    [req.userId, problem_id, status, time_taken_seconds ?? null],
  );

  // Step 3: if they solved it, update their daily streak
  if (status === 'solved') {
    await updateStreak(req.userId!);
  }

  res.status(201).json({ data: rows[0] });
});

// ─── GET /api/progress ────────────────────────────────────────────────────────
//
// Returns all progress records for the authenticated user.

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { rows } = await pool.query(
    `SELECT up.*, p.title, p.difficulty, p.pattern
     FROM user_progress up
     JOIN problems p ON p.id = up.problem_id
     WHERE up.user_id = $1
     ORDER BY up.solved_at DESC`,
    [req.userId],
  );

  res.json({ data: rows });
});

export default router;
