// Import express
import express from 'express';

// import auth routes
import authRoutes from './auth/auth.routes.js';

// import centralized error handler
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

// health check endpoint o confirm that the server is running
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Helios API is running' });
});

app.use(errorHandler)

export default app;