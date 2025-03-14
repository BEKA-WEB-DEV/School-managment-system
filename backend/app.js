import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from 'dotenv';
import pool from './config/db.js';
import { apiLimiter, authLimiter } from './config/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// Routes
import installRoutes from './routes/install.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminUsersRoutes from './routes/admin/users.routes.js';
import SystemRoutes from './routes/admin/system.routes.js';
import academicClassesRoutes from './routes/academic/classes.routes.js';
import academicExamsRoutes from './routes/academic/exams.routes.js';
import registrarStudentsRoutes from './routes/registrar/students.routes.js';
import parentRoutes from './routes/registrar/parent.routes.js';
import registrarTeachersRoutes from './routes/registrar/teachers.routes.js';
import teacherAttendanceRoutes from './routes/teacher/attendance.routes.js';
import teacherExamsRoutes from './routes/teacher/exams.routes.js';
import studentScheduleRoutes from './routes/student/schedule.routes.js';
import studentResultsRoutes from './routes/student/results.routes.js';
import parentPaymentsRoutes from './routes/parent/payments.routes.js';
import parentChildrenRoutes from './routes/parent/children.routes.js';
import { body } from 'express-validator';
import bodyParser from 'body-parser';

// Load environment variables
config();

// Create Express app
const app = express();


// Database connection check
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
})();

// Utility functions for database operations
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    console.error('❌ Query Error:', err.message);
    throw err;
  }
}

async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (err) {
    console.error('❌ Failed to get database connection:', err.message);
    throw err;
  }
}

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow requests from the frontend
    credentials: true, // Allow cookies and credentials
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev'));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// API Documentation
const swaggerDocument = YAML.load('./public/docs/api-docs.yml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API authentication routes
app.use('/api/auth', authRoutes);

// Routes
app.use('/api/install', installRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/system', SystemRoutes);
app.use('/api/academic/classes', academicClassesRoutes);
app.use('/api/academic/exams', academicExamsRoutes);
app.use('/api/registrar/students', registrarStudentsRoutes);
app.use('/api/registrar/parents', parentRoutes);
app.use('/api/registrar/teachers', registrarTeachersRoutes);
app.use('/api/teacher/attendance', teacherAttendanceRoutes);
app.use('/api/teacher/exams', teacherExamsRoutes);
app.use('/api/student/schedule', studentScheduleRoutes);
app.use('/api/student/results', studentResultsRoutes);
app.use('/api/parent/payments', parentPaymentsRoutes);
app.use('/api/parent/children', parentChildrenRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected',
  });
});

// Error handling
app.use((err, req, res, next) => {
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Handle other errors
  return errorHandler(err, req, res, next);
});

// Server configuration
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API docs available at http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  server.close(async () => {
    console.log('🔴 Server terminated');
    await pool.end();
    process.exit(0);
  });
});