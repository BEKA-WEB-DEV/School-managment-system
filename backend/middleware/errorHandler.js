import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message}\nRequest ID: ${req.headers['x-request-id']}`);
  res.status(500).json({ error: 'Internal server error' });
};