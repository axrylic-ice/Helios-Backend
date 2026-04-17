import express from 'express';
import pool from '../config/db.js';
import decisionService from '../services/decisionService.js';

const router = express.Router();

// POST /decisions/analyze
router.post('/analyze', async (req, res, next) => {
    try {
        const { user_id, fx_pair, amount, time_horizon_days } = req.body;

        if (!user_id || !fx_pair || !amount || !time_horizon_days) {
            return res.status(400).json({ error: 'user_id, fx_pair, amount, and time_horizon_days are required' });
        }

        const result = await decisionService.analyzeDecision({ user_id, fx_pair, amount, time_horizon_days });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

// GET /decisions/user/:userId  ← must come BEFORE /:id to avoid route conflict
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
        if (!rows[0]) return res.status(404).json({ error: 'Decision not found' });
        res.status(200).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

export default router;