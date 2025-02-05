const express = require("express");
const router = express.Router();
const CertificateController = require("../controllers/certificateController");
const {
  authenticate,
  authorizeLevel,
} = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { certificateSchema } =
  require("../middleware/validationMiddleware").schemas;

// Create Certificate (Academic Officers Level 3+)
router.post(
  "/",
  validateRequest(certificateSchema),
  authenticate,
  authorizeLevel(3),
  CertificateController.createCertificate
);

// Get Student Certificates (Student/Parent Level 1+)
router.get(
  "/student/:studentId",
  authenticate,
  authorizeLevel(1),
  CertificateController.getStudentCertificates
);

// Get Exam Certificates (Teachers Level 2+)
router.get(
  "/exam/:examId",
  authenticate,
  authorizeLevel(2),
  CertificateController.getExamCertificates
);

// Verify Certificate (Public access with auth)
router.get(
  "/verify/:certificateId",
  authenticate,
  authorizeLevel(0), // Allow inactive users
  CertificateController.verifyCertificate
);

module.exports = router;
