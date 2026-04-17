import express from 'express';
import alertsService from '../services/alertsService.js';

const router = express.Router();

// GET /alerts?user_id=...
router.get('/', async (req, res, next) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ error: 'user_id query param is required' });

        const alerts = await alertsService.getAlerts(user_id);
        res.status(200).json(alerts);
    } catch (err) {
        next(err);
    }
});

// POST /alerts/read
router.post('/read', async (req, res, next) => {
    try {
        const { alert_id, user_id } = req.body;
        if (!alert_id || !user_id) return res.status(400).json({ error: 'alert_id and user_id are required' });

        const updated = await alertsService.markAsRead(alert_id, user_id);
        if (!updated) return res.status(404).json({ error: 'Alert not found or already read' });

        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
});

export default router;