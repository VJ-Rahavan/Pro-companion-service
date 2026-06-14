import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Stage } from '../entities/Stage';
import { UserProgress } from '../entities/UserProgress';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/roadmap
// Returns all stages → topics → problems, with the user's progress status on each problem.
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const stages = await AppDataSource.getRepository(Stage).find({
    order: { number: 'ASC' },
    relations: { topics: { problems: true } },
  });

  const progress = await AppDataSource.getRepository(UserProgress).find({
    where: { userId: req.userId },
  });

  const progressMap = new Map(progress.map((p) => [p.problemId, p.status]));

  const result = stages.map((stage) => ({
    id: stage.id,
    number: stage.number,
    title: stage.title,
    topics: stage.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      problems: topic.problems.map((problem) => ({
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        pattern: problem.pattern,
        status: progressMap.get(problem.id) ?? null,
      })),
    })),
  }));

  res.json({ data: result });
});

// GET /api/roadmap/next
// Returns the first unsolved problem in stage order.
router.get('/next', requireAuth, async (req: AuthRequest, res) => {
  const stages = await AppDataSource.getRepository(Stage).find({
    order: { number: 'ASC' },
    relations: { topics: { problems: true } },
  });

  const progress = await AppDataSource.getRepository(UserProgress).find({
    where: { userId: req.userId },
  });

  const solvedIds = new Set(
    progress.filter((p) => p.status === 'solved').map((p) => p.problemId),
  );

  for (const stage of stages) {
    for (const topic of stage.topics) {
      for (const problem of topic.problems) {
        if (!solvedIds.has(problem.id)) {
          return res.json({
            data: {
              id: problem.id,
              title: problem.title,
              difficulty: problem.difficulty,
              pattern: problem.pattern,
              topicName: topic.name,
              stageTitle: stage.title,
              stageNumber: stage.number,
            },
          });
        }
      }
    }
  }

  res.json({ data: null, message: 'All problems solved!' });
});

export default router;
