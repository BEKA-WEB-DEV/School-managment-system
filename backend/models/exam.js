const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { logger } = require("../utils/logger");

const Exam = sequelize.define(
  "Exam",
  {
    exam_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
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
    subject_name: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: "subjects",
        key: "subject_name",
      },
    },
    section_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: "sections",
        key: "section_name",
      },
    },
    exam_type: {
      type: DataTypes.ENUM("Test", "Quiz", "Midterm", "Final", "Assessment"),
      allowNull: false,
    },
    exam_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false,
    },
    school_year_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "school_year",
        key: "school_year_id",
      },
    },
    semester: {
      type: DataTypes.ENUM(
        "1st Semester",
        "2nd Semester",
        "3rd Semester",
        "4th Semester"
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Scheduled", "Ongoing", "Completed", "Cancelled"),
      defaultValue: "Scheduled",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    hooks: {
      afterCreate: (exam) => {
        logger.info(`Exam scheduled: ${exam.exam_id}`);
      },
    },
    indexes: [
      { fields: ["exam_datetime"] },
      { fields: ["grade_level"] },
      { fields: ["subject_name"] },
    ],
  }
);

// Associations
Exam.associate = (models) => {
  Exam.belongsTo(models.Employee, {
    foreignKey: "employee_id",
    as: "teacher",
  });
  Exam.belongsTo(models.SchoolYear, {
    foreignKey: "school_year_id",
  });
  Exam.hasMany(models.Result, {
    foreignKey: "exam_id",
  });
};

// Scopes
Exam.addScope("active", {
  where: {
    status: ["Scheduled", "Ongoing"],
  },
});

module.exports = Exam;
