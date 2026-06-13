import 'dotenv/config';
import app from './app';
import { connectDB } from './db/pool';
import { startReminderJob } from './jobs/reminder';

const PORT = process.env.PORT ?? 3001;

async function start() {
  // Verify DB connection before accepting traffic
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[server] Running on http://localhost:${PORT}`);
    startReminderJob();
  });
}

start().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
