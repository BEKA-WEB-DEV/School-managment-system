import express from 'express';
import { createPayment } from '../controllers/paymentController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { validatePayment } from '../middleware/validation/paymentSchema.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /payments (Admin only)
router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  authRateLimiter,
  validatePayment,
  createPayment
);

router.post(
  '/:parent_id/payments',
  authenticate,
  authorizeRoles('parent'),
  createPayment 
);

export default router;