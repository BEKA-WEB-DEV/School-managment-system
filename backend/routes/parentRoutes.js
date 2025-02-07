import express from 'express';
import { 
  createParent, 
  linkStudentToParent, 
  getParentStudents, 
  makePayment 
} from '../controllers/parentController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {parentPaymentSchema} from '../middleware/validation/parentSchema.js';
import { authRateLimiter, globalRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
// Admin/Registrar-only endpoints
router.post('/', authenticate, authorizeRoles('admin', 'registrar'),authRateLimiter, globalRateLimiter , parentPaymentSchema, createParent);
router.post('/:parent_id/link', authenticate, authorizeRoles('admin', 'registrar'), authRateLimiter, globalRateLimiter, linkStudentToParent);

// Parent-specific endpoints
router.get('/students', authenticate, authorizeRoles('parent'), getParentStudents);
router.post('/payments', authenticate, authorizeRoles('parent'), authRateLimiter, globalRateLimiter, parentPaymentSchema, makePayment);

export default router;