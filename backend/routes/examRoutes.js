const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const { validateExam } = require("../middleware/validationMiddleware");

// Schedule exam
router.post(
  "/exams",
  authenticate,
  checkRole(["4", "5", "6", "teacher"]), // Teacher, Registrar, Admin, Super Admin
  validateExam,
  examController.createExam
);

// Get exams
router.get(
  "/exams",
  authenticate,
  checkRole(["4", "5", "6", "teacher"]),
  examController.getExams
);

// Get exam results
router.get(
  "/exams/:id/results",
  authenticate,
  checkRole(["4", "5", "6", "teacher"]),
  examController.calculateResults
);

// Generate report
router.get(
  "/exams/:id/report",
  authenticate,
  checkRole(["5", "6"]),
  examController.generateReport
);

// Update exam
router.put(
  "/exams/:id",
  authenticate,
  checkRole(["4", "5", "6"]),
  examController.updateExam
);

// Cancel exam
router.delete(
  "/exams/:id",
  authenticate,
  checkRole(["5", "6"]),
  examController.cancelExam
);

module.exports = router;
