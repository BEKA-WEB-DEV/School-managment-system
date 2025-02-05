const { Sequelize } = require("sequelize");
const { logger } = require("../utils/logger");
const path = require("path");
const fs = require("fs");

// Ensure required environment variables are set
const requiredEnvVars = ["DB_NAME", "DB_USER", "DB_PASSWORD", "DB_HOST"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging:
      process.env.NODE_ENV === "development"
        ? (msg) => logger.debug(`Sequelize: ${msg}`)
        : false,
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    pool: {
      max: 10, // Increased max connections for better scalability
      min: 2, // Ensuring at least 2 connections stay open
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ESOCKETTIMEDOUT/,
        /EHOSTDOWN/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
      ],
      max: 5, // Increased retry attempts for better fault tolerance
    },
  }
);

// Load models dynamically
const models = {};
const modelsPath = path.join(__dirname, "../models");

fs.readdirSync(modelsPath)
  .filter((file) => file.endsWith(".js") && file !== "index.js")
  .forEach((file) => {
    const model = require(path.join(modelsPath, file))(
      sequelize,
      Sequelize.DataTypes
    );
    models[model.name] = model;
  });

// Set up associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

// Database connection test with exponential backoff
const testConnection = async (retries = 5, delay = 5000) => {
  try {
    await sequelize.authenticate();
    logger.info("✅ Database connection established successfully.");

    // Sync models based on environment
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      logger.warn("⚠️ Database schema synchronized (alter mode).");
    } else {
      await sequelize.sync();
      logger.info("✅ Database schema synchronized.");
    }
  } catch (error) {
    if (retries > 0) {
      logger.warn(
        `🔄 Connection failed, retrying in ${
          delay / 1000
        } seconds... (${retries} attempts left)`
      );
      await new Promise((res) => setTimeout(res, delay));
      return testConnection(retries - 1, delay * 2); // Exponential backoff
    }
    logger.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

// Export the database connection and models
module.exports = {
  sequelize,
  testConnection,
  ...models,
};
