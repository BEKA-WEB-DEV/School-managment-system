const { StatusCodes } = require("http-status-codes");
const { logger } = require("../utils/logger");
const { validationResult } = require("express-validator");

const errorHandler = (err, req, res, next) => {
  const requestId = req.headers["x-request-id"];
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal server error";

  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Validation failed",
      details: errors.array(),
      requestId,
    });
  }

  // Sequelize database errors
  if (err.name?.includes("Sequelize")) {
    logger.error(`Database error: ${err.message} | Request ID: ${requestId}`);
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Database operation failed",
      details: err.errors?.map((e) => e.message),
      requestId,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Invalid authentication token",
      requestId,
    });
  }

  logger.error(`${statusCode} - ${message} | Request ID: ${requestId}`);

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    requestId,
  });
};

module.exports = errorHandler;
