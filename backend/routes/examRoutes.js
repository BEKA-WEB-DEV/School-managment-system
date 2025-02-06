import express from 'express';
import { createExam } from '../controllers/examController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { examSchema } from '../middleware/validation/examSchema.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /exams (Admin only)
router.post(
  '/',
  authenticate(),
  authorizeRoles('admin'),
  rateLimiter,
  examSchema,
  createExam
);

export default router;