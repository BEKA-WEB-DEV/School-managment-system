import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
// const { fileURLToPath } = require('url');


// Load environment variables
config();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
// const authRoutes = require('./routes/authRoutes.js');
// const studentRoutes = require('./routes/studentRoutes.js');
// const employeeRoutes = require('./routes/employeeRoutes.js');
// const examRoutes = require('./routes/examRoutes.js');
// const paymentRoutes = require('./routes/paymentRoutes.js');
// const parentRoutes = require('./routes/parentRoutes.js');
// const certificationRoutes = require('./routes/certificationRoutes.js');

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import examRoutes from './routes/examRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';

// Import middleware
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
// const requestLogger = require('./middleware/logger.js');
// const errorHandler = require('./middleware/errorHandler.js');

// Load OpenAPI spec
const apiDocsPath = path.join(__dirname, 'public/docs/api-docs.yml');
const swaggerDocument = YAML.load(apiDocsPath)

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', express.static(path.dirname(apiDocsPath)));
app.get('/', (req, res) => res.redirect('/docs'));

// Routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/employees', employeeRoutes);
app.use('/exams', examRoutes);
app.use('/payments', paymentRoutes);
app.use('/parents', parentRoutes);
app.use('/certifications', certificationRoutes);

// Error handling (must be last middleware)
app.use(errorHandler);

export default app;