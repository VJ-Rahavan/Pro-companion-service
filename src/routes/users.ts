import { Router } from 'express';
import { z } from 'zod';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const pushTokenSchema = z.object({
  expo_push_token: z.string().min(1),
});

const reminderSchema = z.object({
  reminder_time: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format'),
});

// PATCH /api/users/push-token
router.patch('/push-token', requireAuth, async (req: AuthRequest, res) => {
  const parsed = pushTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  await AppDataSource.getRepository(User).update(req.userId!, {
    expoPushToken: parsed.data.expo_push_token,
  });

  res.json({ data: { message: 'Push token saved' } });
});

// PATCH /api/users/reminder-time
router.patch('/reminder-time', requireAuth, async (req: AuthRequest, res) => {
  const parsed = reminderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  await AppDataSource.getRepository(User).update(req.userId!, {
    reminderTime: parsed.data.reminder_time,
  });

  res.json({ data: { message: 'Reminder time updated' } });
});

export default router;
