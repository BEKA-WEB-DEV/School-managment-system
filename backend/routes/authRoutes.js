import express from 'express';
import { login } from '../controllers/authController.js';
import { authRateLimiter, globalRateLimiter } from '../middleware/rateLimiter.js';
import { validateLogin } from '../middleware/validation/authSchema.js';

const router = express.Router();
router.post('/login', authRateLimiter, globalRateLimiter, validateLogin, login);
export default router;