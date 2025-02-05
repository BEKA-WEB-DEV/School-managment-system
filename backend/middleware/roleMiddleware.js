const { StatusCodes } = require("http-status-codes");
const { logger } = require("../utils/logger");

const roles = {
  SUPER_ADMIN: "6",
  ADMIN: "5",
  REGISTRAR: "4",
  TEACHER: "2",
  PARENT: "parent",
  STUDENT: "student",
};

const checkRole =
  (...allowedRoles) =>
  (req, res, next) => {
    const requestId = req.headers["x-request-id"];

    if (!req.user?.level && !req.user?.role) {
      logger.warn(
        `Role check failed - No role information | Request ID: ${requestId}`
      );
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Access denied",
        requestId,
      });
    }

    const userRole = req.user.level || req.user.role;
    const hasAccess = allowedRoles.some(
      (role) => role === userRole || roles[role] === userRole
    );

    if (!hasAccess) {
      logger.warn(
        `Forbidden access attempt by ${userRole} | Request ID: ${requestId}`
      );
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Insufficient privileges",
        requiredRoles: allowedRoles,
        requestId,
      });
    }

    next();
  };

module.exports = { checkRole, roles };
