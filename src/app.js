// Import express
import express from 'express';

const app = express();

app.use(express.json());

// health check endpoint o confirm that the server is running
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Helios API is running' });
});

export default app;