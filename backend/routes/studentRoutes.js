const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const { validateStudent } = require("../middleware/validationMiddleware");

// Create student
router.post(
  "/students",
  authenticate,
  checkRole(["4", "5", "6"]), // Registrar, Admin, Super Admin
  validateStudent,
  studentController.createStudent
);

// Get all students
router.get(
  "/students",
  authenticate,
  checkRole(["4", "5", "6", "teacher", "parent"]),
  studentController.getAllStudents
);

// Get student profile
router.get(
  "/students/:id",
  authenticate,
  checkRole(["4", "5", "6", "student", "teacher", "parent"]),
  studentController.getStudentById
);

// Update student
router.put(
  "/students/:id",
  authenticate,
  checkRole(["4", "5", "6"]),
  validateStudent,
  studentController.updateStudent
);

// Deactivate student
router.delete(
  "/students/:id",
  authenticate,
  checkRole(["5", "6"]),
  studentController.deactivateStudent
);

module.exports = router;
