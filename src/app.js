import decisionsRouter from './api/decisions.js';
import alertsRouter from './api/alerts.js';
import errorHandler from './middleware/errorHandler.js';

// Import express
import express from 'express';


// import auth routes
import authRoutes from './auth/auth.routes.js';

// import centralized error handler
import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/decisions', decisionsRouter);
app.use('/alerts', alertsRouter);

// health check endpoint o confirm that the server is running
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Helios API is running' });
});

app.use(errorHandler)

export default app;