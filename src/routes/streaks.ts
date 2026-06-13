import { Router } from 'express';
import { pool } from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// ─── GET /api/streaks ─────────────────────────────────────────────────────────
//
// Returns the current and longest streak for the authenticated user.

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { rows } = await pool.query(
    `SELECT current_streak, longest_streak, last_active_date
     FROM streaks WHERE user_id = $1`,
    [req.userId],
  );

  if (rows.length === 0) {
    // Streak row should always exist (created at registration), but handle gracefully
    res.json({ data: { current_streak: 0, longest_streak: 0, last_active_date: null } });
    return;
  }

  res.json({ data: rows[0] });
});

export default router;
