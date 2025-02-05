const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StudentInfo = sequelize.define(
  "StudentInfo",
  {
    student_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      references: {
        model: "students",
        key: "student_id",
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
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = StudentInfo;
