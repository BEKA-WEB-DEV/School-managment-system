const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");

// Create Admin (Super Admin only)
router.post(
  "/admins",
  authenticate,
  checkRole(["6"]), // Only Super Admin
  adminController.createAdmin
);

// Get Admin by ID
router.get(
  "/admins/:id",
  authenticate,
  checkRole(["4", "5", "6"]), // Registrar, Admin, Super Admin
  adminController.getAdminById
);

// Update Admin
router.put(
  "/admins/:id",
  authenticate,
  checkRole(["4", "5", "6"]),
  adminController.updateAdmin
);

// Delete Admin (Super Admin only)
router.delete(
  "/admins/:id",
  authenticate,
  checkRole(["6"]),
  adminController.deleteAdmin
);

// Get All Admins
router.get(
  "/admins",
  authenticate,
  checkRole(["5", "6"]), // Admin & Super Admin
  adminController.getAllAdmins
);

module.exports = router;
