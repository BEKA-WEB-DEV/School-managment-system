const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { AuthLog } = require("../models");
const { logger } = require("../utils/logger");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const requestId = req.headers["x-request-id"] || require("uuid").v4();

  if (!token) {
    await AuthLog.create({
      user_id: "unknown",
      user_type: "unknown",
      action: "authentication",
      success: false,
      metadata: { error: "No token provided" },
    });
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Authentication required",
      requestId,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    await AuthLog.create({
      user_id: decoded.id,
      user_type: decoded.role,
      action: "authentication",
      success: true,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
    });

    next();
  } catch (error) {
    logger.error(`Authentication failed: ${error.message}`);

    await AuthLog.create({
      user_id: "unknown",
      user_type: "unknown",
      action: "authentication",
      success: false,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      metadata: { error: error.message },
    });

    res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Invalid or expired token",
      requestId,
    });
  }
};

module.exports = { authenticate };
