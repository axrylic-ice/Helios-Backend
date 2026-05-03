// Import express
import express from 'express';
import cors from 'cors';

// import routes
import authRoutes from './auth/auth.routes.js';
import signalRoutes from './api/signals.routes.js'
import decisionsRouter from './api/decisions.js';
import alertsRouter from './api/alerts.js';

// import centralized error handler
import errorHandler from './middleware/errorHandler.js';

// TEMPORARY: Manual trigger for ML sync, delete after testing
import { syncMLSignal } from './services/mlSync.service.js';

const app = express();

// Only allow requests from the frontend URL
app.use(cors());

app.use(express.json());


app.get('/sync-now', async (req, res) => {
  const secret = req.headers['x-sync-secret'];
  if (secret !== 'helios-sync-2026') {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  const result = await syncMLSignal();
  res.status(200).json({ status: 'success', data: result });
});

// health check endpoint o confirm that the server is running
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Helios API is running' });
});

// mount routes
app.use('/auth', authRoutes);
app.use('/signals', signalRoutes);
app.use('/decisions', decisionsRouter);
app.use('/alerts', alertsRouter);

// centralized error handler
app.use(errorHandler)

export default app;