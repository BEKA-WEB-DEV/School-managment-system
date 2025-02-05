const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const { validateEmployee } = require("../middleware/validationMiddleware");

// Create employee (Admin/Registrar only)
router.post(
  "/employees",
  authenticate,
  checkRole(["4", "5", "6"]),
  validateEmployee,
  employeeController.createEmployee
);

// Get all employees
router.get(
  "/employees",
  authenticate,
  checkRole(["4", "5", "6", "teacher"]),
  employeeController.getAllEmployees
);

// Get single employee
router.get(
  "/employees/:id",
  authenticate,
  checkRole(["4", "5", "6", "teacher"]),
  employeeController.getEmployeeById
);

// Update employee profile
router.put(
  "/employees/:id",
  authenticate,
  checkRole(["4", "5", "6"]),
  employeeController.updateEmployee
);

// Update salary
router.patch(
  "/employees/:id/salary",
  authenticate,
  checkRole(["5", "6"]),
  employeeController.updateSalary
);

// Deactivate employee
router.delete(
  "/employees/:id",
  authenticate,
  checkRole(["5", "6"]),
  employeeController.deactivateEmployee
);

module.exports = router;
