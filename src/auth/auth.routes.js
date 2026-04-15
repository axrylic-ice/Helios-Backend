import express from 'express';

// import the controller functions
import { signup, login, getMe } from './auth.controller.js';

// import the validation rules
import { signupValidation, loginValidation } from '../middleware/validate.js';

// import the protect middleware
import protect from '../middleware/protect.js';

const router = express.Router();

// POST /auth/signup
router.post('/signup',signupValidation, signup);

// POST /auth/login
router.post('/login',loginValidation, login);

// GET /auth/me
// protected route, token required
router.get('/me', protect, getMe);

export default router;