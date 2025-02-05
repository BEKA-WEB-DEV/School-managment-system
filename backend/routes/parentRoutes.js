const express = require("express");
const router = express.Router();
const parentController = require("../controllers/parentController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const { validateParent } = require("../middleware/validationMiddleware");

// Get parent profile
router.get(
  "/parents/:id",
  authenticate,
  checkRole(["parent", "5", "6"]), // Parent self or Admin+
  parentController.getParentProfile
);

// Update parent profile
router.put(
  "/parents/:id",
  authenticate,
  checkRole(["parent", "5", "6"]),
  validateParent,
  parentController.updateParentProfile
);

// Student associations
router.get(
  "/parents/:id/students",
  authenticate,
  checkRole(["parent", "5", "6"]),
  parentController.getLinkedStudents
);

router.post(
  "/parents/:id/students",
  authenticate,
  checkRole(["5", "6"]), // Admin only
  parentController.addStudentToParent
);

router.delete(
  "/parents/:id/students/:studentId",
  authenticate,
  checkRole(["5", "6"]), // Admin only
  parentController.removeStudentFromParent
);

module.exports = router;
