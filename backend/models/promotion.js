const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { logger } = require("../utils/logger");

const Promotion = sequelize.define(
  "Promotion",
  {
    promotion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    current_grade: {
      type: DataTypes.ENUM(
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "6th Grade",
        "7th Grade",
        "8th Grade",
        "9th Grade",
        "10th Grade",
        "11th Grade",
        "12th Grade"
      ),
      allowNull: false,
    },
    requested_grade: {
      type: DataTypes.ENUM(
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "6th Grade",
        "7th Grade",
        "8th Grade",
        "9th Grade",
        "10th Grade",
        "11th Grade",
        "12th Grade"
      ),
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM("Passed", "Failed"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },
    comments: DataTypes.TEXT,
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    paranoid: true,
    hooks: {
      afterUpdate: async (promotion, options) => {
        if (promotion.status === "Approved") {
          logger.info(`Promotion approved: ${promotion.promotion_id}`);
        }
      },
    },
  }
);

// Associations
Promotion.associate = (models) => {
  Promotion.belongsTo(models.Student, {
    foreignKey: "student_id",
    as: "student",
  });
  Promotion.belongsTo(models.Employee, {
    foreignKey: "requested_by",
    as: "requester",
  });
  Promotion.belongsTo(models.Employee, {
    foreignKey: "approved_by",
    as: "approver",
  });
};

module.exports = Promotion;
