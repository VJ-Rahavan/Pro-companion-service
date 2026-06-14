import 'reflect-metadata';
import 'dotenv/config';
import { AppDataSource } from '../data-source';
import { Stage } from '../entities/Stage';
import { Topic } from '../entities/Topic';
import { Problem } from '../entities/Problem';
import { roadmap } from './roadmap.seed';

async function seed() {
  await AppDataSource.initialize();
  console.log('[seed] Starting roadmap seed...');

  const stageRepo = AppDataSource.getRepository(Stage);
  const topicRepo = AppDataSource.getRepository(Topic);
  const problemRepo = AppDataSource.getRepository(Problem);

  let stageCount = 0, topicCount = 0, problemCount = 0;

  for (const stageData of roadmap) {
    let stage = await stageRepo.findOne({ where: { number: stageData.stage } });
    if (!stage) {
      stage = await stageRepo.save(stageRepo.create({ number: stageData.stage, title: stageData.title }));
      stageCount++;
    }

    for (const topicData of stageData.topics) {
      let topic = await topicRepo.findOne({ where: { stageId: stage.id, name: topicData.name } });
      if (!topic) {
        topic = await topicRepo.save(topicRepo.create({ stageId: stage.id, name: topicData.name }));
        topicCount++;
      }

      for (const p of topicData.problems) {
        const exists = await problemRepo.findOne({ where: { topicId: topic.id, title: p.title } });
        if (!exists) {
          await problemRepo.save(problemRepo.create({ topicId: topic.id, ...p }));
          problemCount++;
        }
      }
    }
  }

  console.log(`[seed] Done — ${stageCount} stages, ${topicCount} topics, ${problemCount} problems inserted`);
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
