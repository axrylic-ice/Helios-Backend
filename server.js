// import the configured express app
import app from './src/app.js';

// import teh database connection
import './src/config/db.js';

// Import cron jobs
import { startCronJobs } from './src/services/cron.js';

const PORT = process.env.PORT || 3725;

// start the server
app.listen(PORT, () => {
    console.log(`Helios Server running on port ${PORT}`);

    // Start cron jobs after server is running
    startCronJobs();
});