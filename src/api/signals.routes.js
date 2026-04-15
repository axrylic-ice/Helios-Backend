import express from 'express';

import { getLatestSignal } from './signals.controller.js';

// import protect middleware
import protect from '../middleware/protect.js';

const router = express.Router();

// GET /signals/latest?fx_pair=NGN/USD
router.get('/latest', protect, getLatestSignal);

export default router;