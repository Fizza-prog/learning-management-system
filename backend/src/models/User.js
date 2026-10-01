/**
 * @file User.js
 * @description Defines the Sequelize model for authenticated system users.
 *
 * Responsibilities:
 * - Declare account, role, school, and verification fields.
 * - Define user-related database indexes.
 */
import { DataTypes } from "sequelize";

import { sequelize } from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    schoolId: {
      type: DataTypes.UUID,
      allowNull: true,
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

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    emailVerificationExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    lastVerificationEmailSent: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    lastEmailChangeRequest: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    pendingEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    emailChangeToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    emailChangeExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        name: "users_role_school_id_idx",
        fields: ["role", "schoolId"],
      },
      {
        name: "users_school_id_idx",
        fields: ["schoolId"],
      },
    ],
  }
);

export default User;