const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { logger } = require("../utils/logger");

const Employee = sequelize.define(
  "Employee",
  {
    employee_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "Registrar", "Academic", "Teacher"),
      defaultValue: "Teacher",
    },
    level: {
      type: DataTypes.ENUM("5", "4", "3", "2"),
      defaultValue: "2",
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, // Enable soft deletes
    hooks: {
      afterCreate: (employee) => {
        logger.info(`Employee created: ${employee.employee_id}`);
      },
    },
  }
);

// Association with EmployeeInfo
Employee.associate = (models) => {
  Employee.hasOne(models.EmployeeInfo, {
    foreignKey: "employee_id",
    as: "details",
    onDelete: "CASCADE",
  });
};

module.exports = Employee;
