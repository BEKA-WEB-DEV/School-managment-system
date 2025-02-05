const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Certificate = sequelize.define(
  "Certificate",
  {
    certificate_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: "students_info",
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
      type: DataTypes.STRING(10),
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
    score: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    verification_hash: {
      type: DataTypes.STRING(64),
      unique: true,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["student_id"] },
      { fields: ["exam_id"] },
      { fields: ["verification_hash"] },
    ],
  }
);

// Associations
Certificate.associate = (models) => {
  Certificate.belongsTo(models.Student, { foreignKey: "student_id" });
  Certificate.belongsTo(models.Exam, { foreignKey: "exam_id" });
  Certificate.belongsTo(models.Subject, { foreignKey: "subject_name" });
  Certificate.belongsTo(models.Section, { foreignKey: "section_name" });
  Certificate.belongsTo(models.GradeLevel, { foreignKey: "grade_level" });
};

module.exports = Certificate;
