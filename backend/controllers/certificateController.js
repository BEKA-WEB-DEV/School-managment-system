const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const { validateCertificate } = require("../middleware/validationMiddleware");

// Create certificate
router.post(
  "/certificates",
  authenticate,
  checkRole(["4", "5", "6"]), // Registrar, Admin, Super Admin
  validateCertificate,
  certificateController.createCertificate
);

// Get certificate
router.get(
  "/certificates/:id",
  authenticate,
  checkRole(["4", "5", "6", "student", "teacher", "parent"]),
  certificateController.getCertificate
);

// Generate PDF
router.get(
  "/certificates/:id/pdf",
  certificateController.generateCertificatePDF
);

// Verify certificate
router.get("/certificates/verify", certificateController.verifyCertificate);

// Delete certificate
router.delete(
  "/certificates/:id",
  authenticate,
  checkRole(["5", "6"]), // Admin+ only
  certificateController.deleteCertificate
);

module.exports = router;
