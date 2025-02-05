const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const { validateResult } = require("../middleware/validationMiddleware");

// Record result
router.post(
  "/results",
  authenticate,
  checkRole(["4", "5", "6"]), // Registrar, Admin, Super Admin
  validateResult,
  resultController.createResult
);

// Get result details
router.get(
  "/results/:id",
  authenticate,
  checkRole(["4", "5", "6", "teacher", "parent"]),
  resultController.getResultById
);

// Update result
router.put(
  "/results/:id",
  authenticate,
  checkRole(["4", "5", "6"]),
  resultController.updateResult
);

// Student results
router.get(
  "/students/:student_id/results",
  authenticate,
  checkRole(["4", "5", "6", "teacher", "parent"]),
  resultController.getStudentResults
);

// Class performance report
router.get(
  "/results/performance",
  authenticate,
  checkRole(["4", "5", "6", "teacher"]),
  resultController.getClassPerformance
);

// Approve result
router.patch(
  "/results/:id/approve",
  authenticate,
  checkRole(["5", "6"]),
  resultController.approveResult
);

module.exports = router;
