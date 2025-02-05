const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmployeeInfo = sequelize.define(
  "EmployeeInfo",
  {
    employee_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      references: {
        model: "employees",
        key: "employee_id",
      },
    },
    first_name: DataTypes.STRING(255),
    middle_name: DataTypes.STRING(255),
    last_name: DataTypes.STRING(255),
    gender: DataTypes.ENUM("Male", "Female"),
    date_of_birth: DataTypes.DATEONLY,
    place_of_birth: DataTypes.STRING(255),
    blood_type: DataTypes.ENUM(
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
      "Unknown"
    ),
    address: DataTypes.STRING(255),
    religion: DataTypes.STRING(50),
    initial_salary: DataTypes.DECIMAL(10, 2),
    current_salary: DataTypes.DECIMAL(10, 2),
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = EmployeeInfo;
