const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./student");

const StudentAttendance = sequelize.define(
  "StudentAttendance",
  {
    student_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      references: {
        model: Student,
        key: "student_id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Excused", "Late"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

StudentAttendance.belongsTo(Student, { foreignKey: "student_id" });
module.exports = StudentAttendance;
