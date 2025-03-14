import express from 'express';
import {
  createPayment,
  getPaymentHistory,
  getPaymentDetails,
  updatePaymentStatus
} from '../../controllers/parent/payments.controller.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import  {validate}  from '../../middleware/validator.js';
import { validatePayment } from '../../middleware/validator.js';

const router = express.Router();

// Parent routes
router.route('/')
  .post(
    authenticate,
    restrictTo('parent'),
    validate(validatePayment),
    createPayment
  )
  .get(
    authenticate,
    restrictTo('parent'),
    getPaymentHistory
  );

router.get('/:payment_id',
  authenticate,
  restrictTo('parent'),
  getPaymentDetails
);

// Admin routes for status updates
router.patch('/:payment_id/status',
  authenticate,
  restrictTo('admin'),
  updatePaymentStatus
);

export default router;