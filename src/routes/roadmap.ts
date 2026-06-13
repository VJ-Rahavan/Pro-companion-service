import { Router } from 'express';
import { pool } from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// ─── GET /api/roadmap ─────────────────────────────────────────────────────────
//
// Returns all 7 stages with their topics and problems nested inside.
// Also includes the user's progress status on each problem.
//
// Response shape:
// [{ id, number, title, topics: [{ id, name, problems: [{ id, title, difficulty, pattern, status }] }] }]

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  // Step 1: fetch all stages ordered by their number
  const { rows: stages } = await pool.query(
    'SELECT id, number, title FROM stages ORDER BY number',
  );

  // Step 2: fetch all topics grouped by stage
  const { rows: topics } = await pool.query(
    'SELECT id, stage_id, name FROM topics ORDER BY name',
  );

  // Step 3: fetch all problems
  const { rows: problems } = await pool.query(
    'SELECT id, topic_id, title, difficulty, pattern FROM problems ORDER BY title',
  );

  // Step 4: fetch this user's progress to mark solved/failed/skipped
  const { rows: progress } = await pool.query(
    'SELECT problem_id, status FROM user_progress WHERE user_id = $1',
    [req.userId],
  );

  // Build a quick lookup map: problemId → status
  const progressMap = new Map(progress.map((p) => [p.problem_id, p.status]));

  // Step 5: assemble the nested structure in memory (faster than a recursive SQL query)
  const topicMap = new Map(topics.map((t) => ({ ...t, problems: [] as typeof problems }))
    .map((t) => [t.id, t]));

  for (const problem of problems) {
    const topic = topicMap.get(problem.topic_id);
    if (topic) {
      topic.problems.push({ ...problem, status: progressMap.get(problem.id) ?? null });
    }
  }

  const result = stages.map((stage) => ({
    ...stage,
    topics: topics
      .filter((t) => t.stage_id === stage.id)
      .map((t) => topicMap.get(t.id)),
  }));

  res.json({ data: result });
});

// ─── GET /api/roadmap/next ────────────────────────────────────────────────────
//
// Returns the next unsolved problem for the authenticated user,
// following the stage → topic → problem order.

router.get('/next', requireAuth, async (req: AuthRequest, res) => {
  // Find the first problem (by stage number, then problem title) that the user
  // hasn't solved yet
  const { rows } = await pool.query(
    `SELECT p.id, p.title, p.difficulty, p.pattern, t.name AS topic, s.number AS stage_number, s.title AS stage_title
     FROM problems p
     JOIN topics t ON t.id = p.topic_id
     JOIN stages s ON s.id = t.stage_id
     WHERE p.id NOT IN (
       SELECT problem_id FROM user_progress
       WHERE user_id = $1 AND status = 'solved'
     )
     ORDER BY s.number, p.title
     LIMIT 1`,
    [req.userId],
  );

  if (rows.length === 0) {
    // User has solved everything — congratulate them
    res.json({ data: null, message: 'All problems solved!' });
    return;
  }

  res.json({ data: rows[0] });
});

export default router;
