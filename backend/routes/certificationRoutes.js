import express from 'express';
import { 
  createCertification, 
  approveCertification, 
  verifyCertification 
} from '../controllers/certificationController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { certificationSchema } from '../middleware/validation/certificationSchema.js';

const router = express.Router();
router.post('/', authenticate, authorizeRoles('teacher', 'academic'), certificationSchema, createCertification);
router.patch('/:cert_id/approve', authenticate, authorizeRoles('admin', 'registrar'), approveCertification);
router.get('/:cert_id/verify', verifyCertification);
export default router;