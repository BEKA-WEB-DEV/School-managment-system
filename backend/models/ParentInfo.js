const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ParentInfo = sequelize.define(
  "ParentInfo",
  {
    parent_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      references: {
        model: "parents",
        key: "parent_id",
      },
    },
    father_first_name: DataTypes.STRING(255),
    father_middle_name: DataTypes.STRING(255),
    father_last_name: DataTypes.STRING(255),
    mother_first_name: DataTypes.STRING(255),
    mother_middle_name: DataTypes.STRING(255),
    mother_last_name: DataTypes.STRING(255),
    email: {
      type: DataTypes.STRING(255),
      validate: { isEmail: true },
    },
    phone: DataTypes.STRING(20),
    address: DataTypes.STRING(255),
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = ParentInfo;
