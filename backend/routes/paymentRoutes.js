const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const { validatePayment } = require("../middleware/validationMiddleware");

// Create payment record
router.post(
  "/payments",
  authenticate,
  checkRole(["4", "5", "6"]), // Registrar, Admin, Super Admin
  validatePayment,
  paymentController.createPayment
);

// Process payment
router.post(
  "/payments/:id/process",
  authenticate,
  checkRole(["student", "parent", "4", "5", "6"]),
  paymentController.processPayment
);

// Get payments
router.get(
  "/payments",
  authenticate,
  checkRole(["4", "5", "6", "teacher", "parent"]),
  paymentController.getPayments
);

// Update payment status
router.patch(
  "/payments/:id/status",
  authenticate,
  checkRole(["5", "6"]), // Admin+
  paymentController.updatePaymentStatus
);

// Financial reports
router.get(
  "/payments/report",
  authenticate,
  checkRole(["5", "6"]),
  paymentController.generateFinancialReport
);

// Reminders
router.post(
  "/payments/reminders",
  authenticate,
  checkRole(["5", "6"]),
  paymentController.sendPaymentReminder
);

module.exports = router;
