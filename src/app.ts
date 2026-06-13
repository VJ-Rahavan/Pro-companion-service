import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth';
import roadmapRouter from './routes/roadmap';
import progressRouter from './routes/progress';
import streaksRouter from './routes/streaks';
import usersRouter from './routes/users';

const app = express();

// ─── Security middleware ───────────────────────────────────────────────────────
app.use(helmet());                                      // sets secure HTTP headers
app.use(cors({ origin: process.env.WEB_URL ?? 'http://localhost:3000' }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 req / 15 min per IP

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/roadmap', roadmapRouter);
app.use('/api/progress', progressRouter);
app.use('/api/streaks', streaksRouter);
app.use('/api/users', usersRouter);

// Health check — useful for Docker / deployment readiness probes
app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
