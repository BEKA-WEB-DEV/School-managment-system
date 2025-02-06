import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import examRoutes from './routes/examRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Custom logging

// Routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/certifications', certificationRoutes);
app.use('/employees', employeeRoutes);
app.use('/exams', examRoutes);
app.use('/parents', parentRoutes);
app.use('/payments', paymentRoutes);

// Error handling
app.use(errorHandler);

export default app;