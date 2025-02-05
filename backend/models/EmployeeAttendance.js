const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Employee = require("./employee");

const EmployeeAttendance = sequelize.define(
  "EmployeeAttendance",
  {
    employee_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      references: {
        model: Employee,
        key: "employee_id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Excused", "On Leave", "Late"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

EmployeeAttendance.belongsTo(Employee, { foreignKey: "employee_id" });
module.exports = EmployeeAttendance;
