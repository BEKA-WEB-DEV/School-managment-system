export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const response = {
    error: err.message || 'Internal Server Error',
    requestId: req.requestId,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };

  // Handle Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({ 
      ...response,
      error: 'Validation Error',
      details: err.details 
    });
  }

  // Handle database errors
  if (err.code?.startsWith('ER_')) {
    return res.status(400).json({
      ...response,
      error: 'Database Error',
      details: process.env.NODE_ENV === 'development' ? err.sqlMessage : undefined
    });
  }

  res.status(err.statusCode || 500).json(response);
};