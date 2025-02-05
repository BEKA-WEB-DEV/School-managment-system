const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { logger } = require("../utils/logger");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    user_type: {
      type: DataTypes.ENUM("student", "employee"),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Excused", "Late", "On Leave"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      // Composite unique constraint: Same user can't have duplicate dates
      {
        unique: true,
        fields: ["user_id", "user_type", "date"],
      },
    ],
    hooks: {
      afterCreate: (record) => {
        logger.info(
          `${record.user_type} attendance created: ${record.user_id} - ${record.date}`
        );
      },
    },
  }
);

// Virtual fields (not stored in DB)
Attendance.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password; // Remove sensitive fields if any
  return values;
};

module.exports = Attendance;
