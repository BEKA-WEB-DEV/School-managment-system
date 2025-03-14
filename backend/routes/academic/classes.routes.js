import express from 'express';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import {
  createClass,
  updateClass,
  assignTeacher
} from '../../controllers/academic/classes.controller.js';

const router = express.Router();

router.use(authenticate, restrictTo('academic'));

router.route('/')
  .post(createClass)
  .patch(updateClass);

router.patch('/:classId/teacher', assignTeacher);

export default router;