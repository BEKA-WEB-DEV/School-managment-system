import { env } from './config/env.js';
import app from './app.js';
// const pool = require('./config/db.js');
import  pool  from './config/db.js';

const PORT = env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing server');
  server.close(async () => {
    await pool.end();
    console.log('Database pool closed');
  });
});