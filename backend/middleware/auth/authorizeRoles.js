export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.type)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};