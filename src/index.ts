import 'reflect-metadata';
import 'dotenv/config';
import app from './app';
import { AppDataSource } from './data-source';
import { startReminderJob } from './jobs/reminder';

const PORT = process.env.PORT ?? 3001;

AppDataSource.initialize()
  .then(() => {
    console.log('[db] Connected to PostgreSQL');
    app.listen(PORT, () => {
      console.log(`[server] Running on http://localhost:${PORT}`);
    });
    startReminderJob();
  })
  .catch((err) => {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  });
