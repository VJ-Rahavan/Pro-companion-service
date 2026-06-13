import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// ─── Validation schemas ───────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Signs a JWT that expires in 7 days
function signToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post('/register', async (req, res) => {
  // Step 1: validate request body
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { name, email, password } = parsed.data;

  // Step 2: check if email is already in use
  const { rows: existing } = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email],
  );
  if (existing.length > 0) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  // Step 3: hash the password (salt rounds = 10 is a good default)
  const passwordHash = await bcrypt.hash(password, 10);

  // Step 4: insert the new user
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, created_at`,
    [email, passwordHash],
  );
  const user = rows[0];

  // Step 5: create an empty streak row for the user
  await pool.query(
    'INSERT INTO streaks (user_id) VALUES ($1)',
    [user.id],
  );

  // Step 6: return user data + token
  res.status(201).json({
    data: {
      user: { id: user.id, email: user.email, name, createdAt: user.created_at },
      token: signToken(user.id),
    },
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  // Step 1: validate request body
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;

  // Step 2: look up the user by email
  const { rows } = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email],
  );
  const user = rows[0];

  // Step 3: compare password — use bcrypt.compare, never compare hashes directly
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
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

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  // requireAuth already verified the token — just fetch the user record
  const { rows } = await pool.query(
    'SELECT id, email, reminder_time, created_at FROM users WHERE id = $1',
    [req.userId],
  );

  if (rows.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ data: rows[0] });
});

export default router;
