const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { logger } = require("../utils/logger");

const Result = sequelize.define(
  "Result",
  {
    result_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: "students",
        key: "student_id",
      },
    },
    exam_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: "exams",
        key: "exam_id",
      },
    },
    grade_level: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    subject_name: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    section_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    exam_type: {
      type: DataTypes.ENUM("Test", "Quiz", "Midterm", "Final", "Assessment"),
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["student_id"] },
      { fields: ["exam_id"] },
      { fields: ["subject_name"] },
    ],
    hooks: {
      beforeCreate: async (result) => {
        const existing = await Result.findOne({
          where: {
            student_id: result.student_id,
            exam_id: result.exam_id,
          },
        });
        if (existing) {
          throw new Error("Duplicate result entry");
        }
      },
    },
  }
);

// Associations
Result.associate = (models) => {
  Result.belongsTo(models.Student, {
    foreignKey: "student_id",
    as: "student",
  });
  Result.belongsTo(models.Exam, {
    foreignKey: "exam_id",
    as: "exam",
  });
  Result.belongsTo(models.Subject, {
    foreignKey: "subject_name",
    targetKey: "subject_name",
  });
};

module.exports = Result;
