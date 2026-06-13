import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const pushTokenSchema = z.object({
  expo_push_token: z.string().min(1),
});

const reminderSchema = z.object({
  reminder_time: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format'),
});

// ─── PATCH /api/users/push-token ──────────────────────────────────────────────
//
// Saves the Expo push token for the authenticated user.
// Called by the mobile app after the user grants notification permission.

router.patch('/push-token', requireAuth, async (req: AuthRequest, res) => {
  const parsed = pushTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  await pool.query(
    'UPDATE users SET expo_push_token = $1 WHERE id = $2',
    [parsed.data.expo_push_token, req.userId],
  );

  res.json({ data: { message: 'Push token saved' } });
});

// ─── PATCH /api/users/reminder-time ──────────────────────────────────────────
//
// Updates the user's preferred daily reminder time (HH:MM, 24-hour format).

router.patch('/reminder-time', requireAuth, async (req: AuthRequest, res) => {
  const parsed = reminderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  await pool.query(
    'UPDATE users SET reminder_time = $1 WHERE id = $2',
    [parsed.data.reminder_time, req.userId],
  );

  res.json({ data: { message: 'Reminder time updated' } });
});

export default router;
