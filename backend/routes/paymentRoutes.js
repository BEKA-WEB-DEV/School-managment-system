import express from 'express';
import { createPayment } from '../controllers/paymentController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { paymentSchema } from '../middleware/validation/paymentSchema.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /payments (Admin only)
router.post(
  '/',
  authenticate(),
  authorizeRoles('admin'),
  rateLimiter,
  paymentSchema,
  createPayment
);

router.post(
  '/:parent_id/payments',
  authenticate(),
  authorizeRoles('parent'),
  validateParentPayment,
  createParentPayment
);

export default router;