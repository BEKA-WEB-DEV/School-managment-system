import express from 'express';
import { login } from '../controllers/authController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { validateLogin } from '../middleware/validation/authSchema.js';

const router = express.Router();
router.post('/login', rateLimiter, validateLogin, login);
export default router;