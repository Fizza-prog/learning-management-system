const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM(
      "super_admin",
      "admin",
      "teacher",
      "student"
    ),
    defaultValue: "student",
  },

  refreshToken: {
  type: DataTypes.TEXT,
  allowNull: true,
},

resetPasswordToken: {
  type: DataTypes.TEXT,
  allowNull: true,
},

resetPasswordExpiry: {
  type: DataTypes.DATE,
  allowNull: true,
},

});

module.exports = User;