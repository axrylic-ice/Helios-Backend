// Import node-cron for scheduling
import cron from 'node-cron';

// Import the sync service
import { syncMLSignal } from './mlSync.service.js';

// Run every hour at the top of the hour
// Cron syntax: minute hour day month weekday
// '0 * * * *' means: at minute 0 of every hour
export const startCronJobs = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly ML signal sync...');
    await syncMLSignal();
  });

  console.log('Cron jobs started');
};