const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ParentStudent = sequelize.define(
  "ParentStudent",
  {
    student_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      references: {
        model: "students",
        key: "student_id",
      },
      onDelete: "CASCADE",
    },
    parent_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      references: {
        model: "parents",
        key: "parent_id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: false, // No created_at/updated_at
    tableName: "parent_student_association", // Match SQL table name
    indexes: [
      {
        fields: ["student_id"],
        name: "idx_parent_student_student",
      },
      {
        fields: ["parent_id"],
        name: "idx_parent_student_parent",
      },
    ],
  }
);

// No need for associations here - handled through Parent/Student models
module.exports = ParentStudent;
