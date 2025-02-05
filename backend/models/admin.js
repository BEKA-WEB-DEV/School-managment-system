const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { logger } = require("../utils/logger");

const Admin = sequelize.define(
  "Admin",
  {
    admin_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: "employees",
        key: "employee_id",
      },
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM("6", "5", "4"),
      defaultValue: "4",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      afterCreate: (admin) => {
        logger.info(`Admin created: ${admin.admin_id}`);
      },
      afterDestroy: (admin) => {
        logger.warn(`Admin deleted: ${admin.admin_id}`);
      },
    },
  }
);

// Association with Employee
Admin.associate = (models) => {
  Admin.belongsTo(models.Employee, {
    foreignKey: "employee_id",
    as: "employee",
    onDelete: "CASCADE",
  });
};

module.exports = Admin;
