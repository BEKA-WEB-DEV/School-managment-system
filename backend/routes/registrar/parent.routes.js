import express from 'express';
import {
  createParent,
  getParentById,
  getParentChildren,
  updateParent
} from '../../controllers/registrar/parents.controller.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { validate } from '../../middleware/validator.js';
import { validateParent } from '../../middleware/validator.js';

const router = express.Router();

// Create parent (registrar only)
router.post(
  '/',
  authenticate,
  restrictTo('registrar'),
  validate(validateParent),
  createParent
);

// Get parent details (parent themselves or admin)
router.get(
  '/:parentId',
  authenticate,
  restrictTo('parent', 'admin'),
  getParentById
);

// Get parent's children
router.get(
  '/:parentId/children',
  authenticate,
  restrictTo('parent', 'admin'),
  getParentChildren
);

// Update parent info (parent themselves or admin)
router.patch(
  '/:parentId',
  authenticate,
  restrictTo('parent', 'admin'),
  validate(validateParent),
  updateParent
);

export default router;