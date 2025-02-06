import express from 'express';
import { 
  getLinkedStudents,
  makePayment
} from '../controllers/parentController.js';
import { authenticate } from '../middleware/auth.js';
import { paymentSchema } from '../middleware/validation/paymentSchema.js';

const router = express.Router();

// GET /parents/students - Get linked students
router.get(
  '/students',
  authenticate('parent'),
  getLinkedStudents
);

// POST /parents/payments - Make payment for student
router.post(
  '/payments',
  authenticate('parent'),
  paymentSchema,
  makePayment
);

export default router;