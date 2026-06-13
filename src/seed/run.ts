/**
 * Seed script — inserts the full 7-stage DSA roadmap into the database.
 *
 * Run with: npm run seed
 *
 * Safe to run multiple times — uses INSERT ... ON CONFLICT DO NOTHING
 * so existing rows are not duplicated or overwritten.
 */

import 'dotenv/config';
import { pool } from '../db/pool';
import { roadmap } from './roadmap.seed';

async function seed() {
  console.log('[seed] Starting roadmap seed...');

  let stageCount = 0;
  let topicCount = 0;
  let problemCount = 0;

  for (const stageData of roadmap) {
    // Insert stage (skip if already exists by stage number)
    const { rows: stageRows } = await pool.query(
      `INSERT INTO stages (number, title)
       VALUES ($1, $2)
       ON CONFLICT (number) DO NOTHING
       RETURNING id`,
      [stageData.stage, stageData.title],
    );

    // If this stage was already seeded, look up its existing id
    let stageId: string;
    if (stageRows.length > 0) {
      stageId = stageRows[0].id;
      stageCount++;
    } else {
      const { rows } = await pool.query(
        'SELECT id FROM stages WHERE number = $1',
        [stageData.stage],
      );
      stageId = rows[0].id;
    }

    for (const topicData of stageData.topics) {
      // Insert topic under this stage
      const { rows: topicRows } = await pool.query(
        `INSERT INTO topics (stage_id, name)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [stageId, topicData.name],
      );

      let topicId: string;
      if (topicRows.length > 0) {
        topicId = topicRows[0].id;
        topicCount++;
      } else {
        const { rows } = await pool.query(
          'SELECT id FROM topics WHERE stage_id = $1 AND name = $2',
          [stageId, topicData.name],
        );
        topicId = rows[0].id;
      }

      for (const problem of topicData.problems) {
        // Insert problem under this topic
        const { rows: pRows } = await pool.query(
          `INSERT INTO problems (topic_id, title, difficulty, pattern)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING
           RETURNING id`,
          [topicId, problem.title, problem.difficulty, problem.pattern],
        );
        if (pRows.length > 0) problemCount++;
      }
    }
  }

  console.log(`[seed] Done — ${stageCount} stages, ${topicCount} topics, ${problemCount} problems inserted`);
  await pool.end();
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
