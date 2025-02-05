require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("./utils/logger");
const { sequelize, testConnection } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./api-docs.yml");

const app = express();

// =====================
//  Middleware Setup
// =====================

// Request ID middleware
app.use((req, res, next) => {
  req.headers["x-request-id"] = req.headers["x-request-id"] || uuidv4();
  res.setHeader("X-Request-ID", req.headers["x-request-id"]);
  next();
});

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.example.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "cdn.example.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        connectSrc: ["'self'", "api.example.com"],
      },
    },
    crossOriginResourcePolicy: { policy: "same-site" },
  })
);

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: "Too many requests from this IP, please try again later",
  headers: true,
});
app.use(limiter);

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") ?? "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    credentials: true,
    maxAge: 600,
    preflightContinue: false,
  })
);

// Compression
app.use(compression());

// Request logging
app.use(
  morgan(process.env.NODE_ENV === "development" ? "dev" : "combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// =====================
//  Database Connection
// =====================
testConnection().catch((error) => {
  logger.error(`Database connection failed: ${error}`);
  process.exit(1);
});

// =====================
//  Route Registration
// =====================
const routes = [
  require("./routes/authRoutes"),
  require("./routes/studentRoutes"),
  require("./routes/employeeRoutes"),
  require("./routes/parentRoutes"),
  require("./routes/examRoutes"),
  require("./routes/paymentRoutes"),
  require("./routes/promotionRoutes"),
  require("./routes/resultRoutes"),
  require("./routes/certificateRoutes"),
  require("./routes/attendanceRoutes"),
];

routes.forEach((route) => app.use("/api/v1", route));

// =====================
//  Error Handling
// =====================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    requestId: req.headers["x-request-id"],
  });
});

// Global error handler
app.use(errorHandler);

// =====================
//  Server Startup
// =====================
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// =====================
//  Graceful Shutdown
// =====================
const shutdown = async (signal) => {
  logger.warn(`Received ${signal}, shutting down...`);

  try {
    // Close HTTP server
    await new Promise((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );

    // Close database connection
    await sequelize.close();
    logger.info("Database connection closed");
    process.exit(0);
  } catch (err) {
    logger.error("Error during shutdown:", err);
    process.exit(1);
  }

  // Force exit if shutdown takes too long
  setTimeout(() => {
    logger.error("Shutdown timeout, forcing exit");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  shutdown("uncaughtException");
});

module.exports = app;

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const { logger } = require("./utils/logger");
// const errorHandler = require("./middleware/errorHandler");
// const db = require("./config/db");

// // Import routes
// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const studentRoutes = require("./routes/studentRoutes");
// const parentRoutes = require("./routes/parentRoutes");
// const examRoutes = require("./routes/examRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const promotionRoutes = require("./routes/promotionRoutes");
// const resultRoutes = require("./routes/resultRoutes");
// const certificateRoutes = require("./routes/certificateRoutes");
// const attendanceRoutes = require("./routes/attendanceRoutes");
// const employeeRoutes = require("./routes/employeeRoutes");
// // Import other routes...

// const app = express();
// const port = process.env.PORT || 5000;

// // Database connection
// db.sequelize
//   .authenticate()
//   .then(() => logger.info("Database connected"))
//   .catch((err) => logger.error("Database connection error:", err));

// // Middleware
// app.use((req, res, next) => {
//   req.headers["x-request-id"] =
//     req.headers["x-request-id"] || require("uuid").v4();
//   next();
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.use(helmet());

// // Request logging
// app.use((req, res, next) => {
//   logger.info(`${req.method} ${req.originalUrl}`);
//   next();
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/admins", adminRoutes);
// app.use("/api/students", studentRoutes);
// app.use("/api/parents", parentRoutes);
// app.use("/api/exams", examRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/promotions", promotionRoutes);
// app.use("/api/results", resultRoutes);
// app.use("/api/certificates", certificateRoutes);
// app.use("/api/attendances", attendanceRoutes);
// app.use("/api/employees", employeeRoutes);

// // Health check endpoint
// app.get("/health", (req, res) => res.json({ status: "OK" }));

// // Error handling
// app.use(errorHandler);

// // Database sync (for development only)
// if (process.env.NODE_ENV === "development") {
//   db.sequelize
//     .sync({ force: false })
//     .then(() => logger.info("Database synced"))
//     .catch((err) => logger.error("Database sync error:", err));
// }

// app.listen(port, () => {
//   logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
// });

// process.on("uncaughtException", (error) => {
//   logger.error(`Uncaught Exception: ${error.message}`);
//   process.exit(1);
// });
