const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const { validateAttendance } = require("../middleware/validationMiddleware");

// Record attendance (Teachers/Admins)
router.post(
  "/attendance",
  authenticate,
  checkRole(["4", "5", "6", "teacher"]),
  validateAttendance,
  attendanceController.recordAttendance
);

// Get user attendance history
router.get(
  "/attendance/:userType(student|employee)/:userId",
  authenticate,
  checkRole(["4", "5", "6", "teacher", "parent"]),
  attendanceController.getAttendance
);

// Update attendance record
router.put(
  "/attendance/:userType(student|employee)/:userId/:date",
  authenticate,
  checkRole(["4", "5", "6", "teacher"]),
  attendanceController.updateAttendance
);

// Delete attendance record
router.delete(
  "/attendance/:userType(student|employee)/:userId/:date",
  authenticate,
  checkRole(["5", "6"]), // Admin+ only
  attendanceController.deleteAttendance
);

module.exports = router;
