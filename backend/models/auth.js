const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AuthLog = sequelize.define(
  "AuthLog",
  {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    user_type: {
      type: DataTypes.ENUM("admin", "employee", "student", "parent"),
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM(
        "login",
        "logout",
        "token_refresh",
        "password_reset"
      ),
      allowNull: false,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    user_agent: DataTypes.TEXT,
    ip_address: DataTypes.STRING(45),
    metadata: DataTypes.JSON,
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = AuthLog;
