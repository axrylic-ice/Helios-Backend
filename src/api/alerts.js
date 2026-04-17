import express from 'express';
import alertsService from '../services/alertsService.js';
import protect from '../middleware/protect.js'; // ← add JWT guard
import AppError from '../middleware/AppError.js';

const router = express.Router();

// protect ALL alert routes
router.use(protect);

// GET /alerts  ← user_id comes from token, not query param anymore
router.get('/', async (req, res, next) => {
    try {
        const user_id = req.user.id; // ← from protect middleware
        const alerts = await alertsService.getAlerts(user_id);
        res.status(200).json(alerts);
    } catch (err) {
        next(err);
    }
});

// POST /alerts/read
router.post('/read', async (req, res, next) => {
    try {
        const { alert_id } = req.body;
        const user_id = req.user.id; // ← from protect middleware

        if (!alert_id) return next(new AppError('alert_id is required', 400));

        const updated = await alertsService.markAsRead(alert_id, user_id);
        if (!updated) return next(new AppError('Alert not found', 404));

        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
});

export default router;