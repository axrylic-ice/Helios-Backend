import express from 'express';
import pool from '../config/db.js';
import decisionService from '../services/decisionService.js';
import protect from '../middleware/protect.js'; // ← add JWT guard
import AppError from '../middleware/AppError.js';

const router = express.Router();

// protect ALL decision routes — user must be logged in
router.use(protect);

// POST /decisions/analyze
router.post('/analyze', async (req, res, next) => {
    try {
        const { fx_pair, amount, time_horizon_days } = req.body;
        const user_id = req.user.id; // ← comes from protect middleware, not body

        if (!fx_pair || !amount || !time_horizon_days) {
            return next(new AppError('fx_pair, amount, and time_horizon_days are required', 400));
        }

        const result = await decisionService.analyzeDecision({
            user_id,
            fx_pair,
            amount,
            time_horizon_days
        });

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

// GET /decisions/user/:userId  ← must stay above /:id
router.get('/user/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { rows } = await pool.query(
            `SELECT * FROM decisions WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /decisions/:id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            `SELECT * FROM decisions WHERE id = $1`,
            [id]
        );
        if (!rows[0]) return next(new AppError('Decision not found', 404));
        res.status(200).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

export default router;