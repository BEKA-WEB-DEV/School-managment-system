const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// const { logger } = require("../utils/logger");

const Parent = sequelize.define(
  "Parent",
  {
    parent_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    parent_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    relationship: {
      type: DataTypes.ENUM("Parent", "Guardian"),
      defaultValue: "Parent",
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
      beforeCreate: async (parent) => {
        parent.parent_password = await bcrypt.hash(parent.parent_password, 10);
      },
    },
  }
);

// Association with ParentInfo
Parent.associate = (models) => {
  Parent.hasOne(models.ParentInfo, {
    foreignKey: "parent_id",
    as: "details",
    onDelete: "CASCADE",
  });
  Parent.belongsToMany(models.Student, {
    through: "ParentStudent",
    foreignKey: "parent_id",
    as: "students",
  });
};

module.exports = Parent;
