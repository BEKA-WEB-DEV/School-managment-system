const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  validateLogin,
  validateReset,
} = require("../middleware/validationMiddleware");

// Login
router.post("/login", validateLogin, authController.login);

// Refresh token
router.post("/refresh-token", authController.refreshToken);

// Password reset flow
router.post("/forgot-password", validateReset, authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
