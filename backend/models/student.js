const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// const { logger } = require("../utils/logger");
const bcrypt = require("bcryptjs");

const Student = sequelize.define(
  "Student",
  {
    student_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    student_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    grade_level: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: "grade_level",
        key: "grade_level",
      },
    },
    section: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: "sections",
        key: "section_name",
      },
    },
    school_year: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: "school_year",
        key: "school_year",
      },
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
    hooks: {
      beforeCreate: async (student) => {
        student.student_password = await bcrypt.hash(
          student.student_password,
          10
        );
      },
      beforeUpdate: async (student) => {
        if (student.changed("student_password")) {
          student.student_password = await bcrypt.hash(
            student.student_password,
            10
          );
        }
      },
    },
  }
);

// Association with StudentInfo
Student.associate = (models) => {
  Student.hasOne(models.StudentInfo, {
    foreignKey: "student_id",
    as: "details",
    onDelete: "CASCADE",
  });
};

module.exports = Student;
