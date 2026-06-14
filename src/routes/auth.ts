import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Streak } from '../entities/Streak';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function signToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;
  const userRepo = AppDataSource.getRepository(User);

  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = userRepo.create({ email, passwordHash });
  await userRepo.save(user);

  // Create an empty streak row for the new user
  const streakRepo = AppDataSource.getRepository(Streak);
  await streakRepo.save(streakRepo.create({ userId: user.id }));

  res.status(201).json({
    data: {
      user: { id: user.id, email: user.email },
      token: signToken(user.id),
    },
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;
  const user = await AppDataSource.getRepository(User).findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  res.json({
    data: {
      user: { id: user.id, email: user.email },
      token: signToken(user.id),
    },
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await AppDataSource.getRepository(User).findOne({ where: { id: req.userId } });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ data: { id: user.id, email: user.email, reminderTime: user.reminderTime } });
});

export default router;
