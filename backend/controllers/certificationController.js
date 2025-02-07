// const Certification = require('../models/Certification.js');
import {issue, approve, verify} from '../models/Certification.js';
import { generateCertId } from '../utils/idGenerator.js';

// Issue certificate (Teacher/Academic role)
export const createCertification = async (req, res) => {
  try {
    const cert_id = generateCertId();
    const { student_id, cert_type, expiry_date } = req.body;

    // Validate student exists
    const [student] = await pool.query(
      'SELECT student_id FROM students WHERE student_id = ?',
      [student_id]
    );
    if (!student.length) return res.status(404).json({ error: 'Student not found' });

    await issue.issue({ cert_id, student_id, cert_type, expiry_date });
    res.status(201).json({ cert_id });
  } catch (error) {
    res.status(400).json({ error: 'Certification issuance failed' });
  }
};

// Approve certificate (Admin/Registrar only)
export const approveCertification = async (req, res) => {
  const { cert_id } = req.params;
  try {
    const success = await approve(cert_id, req.user.id);
    if (!success) return res.status(404).json({ error: 'Certificate not found' });
    res.json({ message: 'Certificate approved' });
  } catch (error) {
    res.status(400).json({ error: 'Approval failed' });
  }
};

// Verify certificate (Public endpoint)
export const verifyCertification = async (req, res) => {
  const { cert_id } = req.params;
  try {
    const certificate = await verify.verify(cert_id);
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
    res.json(certificate);
  } catch (error) {
    res.status(400).json({ error: 'Verification failed' });
  }
};