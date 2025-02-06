import express from 'express';
import { 
  getStudents, 
  createStudent, 
  getStudentCertifications 
} from '../controllers/studentController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { validateStudent } from '../middleware/validation/studentSchema.js';

const router = express.Router();
router.get('/', getStudents);
router.post('/', authenticate, authorizeRoles('admin'), validateStudent, createStudent);
router.get('/:student_id/certifications', getStudentCertifications);
export default router;