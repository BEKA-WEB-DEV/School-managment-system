const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const dbConfig = require("../config/db");
const { logger } = require("../utils/logger");

const sequelize = dbConfig.sequelize;
const db = {};

// Load all model files
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      !file.includes(".test.js")
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add Sequelize instance and types to exports
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Connection test
(async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");

    // Sync models based on environment
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      logger.warn("Database schema synchronized with alter mode");
    } else if (process.env.NODE_ENV === "test") {
      await sequelize.sync({ force: true });
      logger.warn(
        "Database schema synchronized with force mode (test environment)"
      );
    }
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    process.exit(1);
  }
})();

module.exports = db;
