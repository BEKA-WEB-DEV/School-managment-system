const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const { validatePromotion } = require("../middleware/validationMiddleware");

// Create promotion request
router.post(
  "/promotions",
  authenticate,
  checkRole(["4", "5", "6"]), // Registrar, Admin, Super Admin
  validatePromotion,
  promotionController.createPromotion
);

// Get promotions
router.get(
  "/promotions",
  authenticate,
  checkRole(["4", "5", "6", "teacher"]),
  promotionController.getAllPromotions
);

// Update promotion status
router.put(
  "/promotions/:id/status",
  authenticate,
  checkRole(["5", "6"]), // Admin+
  promotionController.updatePromotionStatus
);

// Student promotion history
router.get(
  "/students/:studentId/promotions",
  authenticate,
  checkRole(["4", "5", "6", "teacher", "parent"]),
  promotionController.getStudentPromotionHistory
);

module.exports = router;
