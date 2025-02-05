const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { logger } = require("../utils/logger");

const Payment = sequelize.define(
  "Payment",
  {
    payment_id: {
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    payment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("Cash", "Credit Card", "Bank Transfer", "Online"),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("Pending", "Completed", "Failed", "Refunded"),
      defaultValue: "Pending",
    },
    description: DataTypes.TEXT,
    payment_purpose: DataTypes.STRING(255),
    transaction_id: DataTypes.STRING(255),
    receipt_url: DataTypes.TEXT,
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["student_id"] },
      { fields: ["payment_date"] },
      { fields: ["payment_status"] },
    ],
    hooks: {
      afterUpdate: (payment) => {
        if (payment.payment_status === "Completed") {
          logger.info(`Payment completed: ${payment.payment_id}`);
        }
      },
    },
  }
);

// Association with Student
Payment.associate = (models) => {
  Payment.belongsTo(models.Student, {
    foreignKey: "student_id",
    as: "student",
  });
};

module.exports = Payment;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { logger } = require("../utils/logger");

const Payment = sequelize.define(
  "Payment",
  {
    payment_id: {
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    payment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("Cash", "Credit Card", "Bank Transfer", "Online"),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("Pending", "Completed", "Failed", "Refunded"),
      defaultValue: "Pending",
    },
    description: DataTypes.TEXT,
    payment_purpose: DataTypes.STRING(255),
    transaction_id: DataTypes.STRING(255),
    receipt_url: DataTypes.TEXT,
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["student_id"] },
      { fields: ["payment_date"] },
      { fields: ["payment_status"] },
    ],
    hooks: {
      afterUpdate: (payment) => {
        if (payment.payment_status === "Completed") {
          logger.info(`Payment completed: ${payment.payment_id}`);
        }
      },
    },
  }
);

// Association with Student
Payment.associate = (models) => {
  Payment.belongsTo(models.Student, {
    foreignKey: "student_id",
    as: "student",
  });
};

module.exports = Payment;
