const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Admin, Employee, Student, Parent, AuthLog } = require("../models");
const { logger } = require("../utils/logger");

const authController = {
  // Unified login for all user types
  login: async (req, res) => {
    try {
      const { userType, identifier, password } = req.body;

      // Validate user type
      const validTypes = ["admin", "employee", "student", "parent"];
      if (!validTypes.includes(userType)) {
        await AuthLog.create({
          user_id: identifier,
          user_type: userType,
          action: "login",
          success: false,
          metadata: { error: "Invalid user type" },
        });
        return res.status(400).json({ error: "Invalid user type" });
      }

      // Find user based on type
      let user;
      switch (userType) {
        case "admin":
          user = await Admin.findOne({ where: { username: identifier } });
          break;
        case "employee":
          user = await Employee.findByPk(identifier);
          break;
        case "student":
          user = await Student.findByPk(identifier);
          break;
        case "parent":
          user = await Parent.findByPk(identifier);
          break;
      }

      // Log failed attempt
      if (!user) {
        await AuthLog.create({
          user_id: identifier,
          user_type: userType,
          action: "login",
          success: false,
          user_agent: req.headers["user-agent"],
          ip_address: req.ip,
          metadata: { error: "User not found" },
        });
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        await AuthLog.create({
          user_id: identifier,
          user_type: userType,
          action: "login",
          success: false,
          user_agent: req.headers["user-agent"],
          ip_address: req.ip,
        });
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user[`${userType}_id`], role: userType },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: user[`${userType}_id`] },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // Log successful login
      await AuthLog.create({
        user_id: identifier,
        user_type: userType,
        action: "login",
        success: true,
        user_agent: req.headers["user-agent"],
        ip_address: req.ip,
      });

      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user[`${userType}_id`],
          type: userType,
          ...(userType === "admin" && { level: user.level }),
        },
      });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Refresh access token
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Find user in appropriate table
      const userTypes = ["admin", "employee", "student", "parent"];
      let user;
      for (const type of userTypes) {
        user = await eval(
          type.charAt(0).toUpperCase() + type.slice(1)
        ).findByPk(decoded.id);
        if (user) break;
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const newAccessToken = jwt.sign(
        { id: user.id, role: user.constructor.name.toLowerCase() },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      await AuthLog.create({
        user_id: user.id,
        user_type: user.constructor.name.toLowerCase(),
        action: "token_refresh",
        success: true,
        user_agent: req.headers["user-agent"],
        ip_address: req.ip,
      });

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      await AuthLog.create({
        user_id: "unknown",
        user_type: "unknown",
        action: "token_refresh",
        success: false,
        user_agent: req.headers["user-agent"],
        ip_address: req.ip,
        metadata: { error: error.message },
      });
      res.status(401).json({ error: "Invalid token" });
    }
  },

  // Password reset initialization
  forgotPassword: async (req, res) => {
    try {
      const { userType, identifier } = req.body;
      let user;

      switch (userType) {
        case "admin":
          user = await Admin.findOne({ where: { username: identifier } });
          break;
        case "employee":
          user = await Employee.findByPk(identifier);
          break;
        case "student":
          user = await Student.findByPk(identifier);
          break;
        case "parent":
          user = await Parent.findByPk(identifier);
          break;
        default:
          return res.status(400).json({ error: "Invalid user type" });
      }

      if (!user) return res.status(404).json({ error: "User not found" });

      // Generate reset token (valid for 1 hour)
      const resetToken = jwt.sign(
        { id: user.id, type: userType },
        process.env.JWT_RESET_SECRET,
        { expiresIn: "1h" }
      );

      // TODO: Send email/SMS with reset token
      logger.info(
        `Password reset token for ${userType} ${user.id}: ${resetToken}`
      );

      res.json({ message: "Reset instructions sent" });
    } catch (error) {
      logger.error(`Password reset error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Actual password reset
  resetPassword: async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      const decoded = jwt.verify(resetToken, process.env.JWT_RESET_SECRET);

      let user;
      switch (decoded.type) {
        case "admin":
          user = await Admin.findByPk(decoded.id);
          break;
        case "employee":
          user = await Employee.findByPk(decoded.id);
          break;
        case "student":
          user = await Student.findByPk(decoded.id);
          break;
        case "parent":
          user = await Parent.findByPk(decoded.id);
          break;
        default:
          return res.status(400).json({ error: "Invalid user type" });
      }

      if (!user) return res.status(404).json({ error: "User not found" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      await AuthLog.create({
        user_id: decoded.id,
        user_type: decoded.type,
        action: "password_reset",
        success: true,
        user_agent: req.headers["user-agent"],
        ip_address: req.ip,
      });

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      await AuthLog.create({
        user_id: decoded?.id || "unknown",
        user_type: decoded?.type || "unknown",
        action: "password_reset",
        success: false,
        user_agent: req.headers["user-agent"],
        ip_address: req.ip,
        metadata: { error: error.message },
      });
      res.status(400).json({ error: "Invalid or expired token" });
    }
  },
};

module.exports = authController;
