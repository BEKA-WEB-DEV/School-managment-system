import express from 'express';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import {
  getChildrenDetails,
  updateChildInfo
} from '../../controllers/parent/children.controller.js';

const router = express.Router();

router.use(authenticate, restrictTo('parent'));

router.route('/')
  .get(getChildrenDetails);

router.route('/:studentId')
  .patch(updateChildInfo);

export default router;