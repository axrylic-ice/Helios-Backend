// Import express
import express from 'express';

// import routes
import authRoutes from './auth/auth.routes.js';
import signalRoutes from './api/signals.routes.js'

// import centralized error handler
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

// mount routes
app.use('/auth', authRoutes);
app.use('/signals', signalRoutes);

// health check endpoint o confirm that the server is running
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Helios API is running' });
});

// centralized error handler
app.use(errorHandler)

export default app;