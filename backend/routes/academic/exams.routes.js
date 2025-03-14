import express from 'express';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import {
  scheduleExam,
  publishExamResults,
  getExamDetails
} from '../../controllers/academic/exams.controller.js';

const academicRouter = express.Router();

// Apply academic middleware globally for all academic routes.
academicRouter.use(authenticate, restrictTo('academic'));

// Define routes for academic users.
academicRouter.post('/exams', scheduleExam);
academicRouter.post('/exams/publish', publishExamResults);
academicRouter.get('/exams/:exam_id', getExamDetails);

export default academicRouter;
