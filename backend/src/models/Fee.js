/**
 * @file Fee.js
 * @description Defines the Sequelize model for student fee records.
 *
 * Responsibilities:
 * - Declare fee amounts, due dates, statuses, and related identifiers.
 */
import { DataTypes } from "sequelize";

import { sequelize } from "../config/database.js";

const Fee = sequelize.define(
  "Fee",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    schoolId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    feeType: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: { notEmpty: true },
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },

    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "paid", "overdue"),
      allowNull: false,
      defaultValue: "pending",
    },

    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        name: "fees_status_paid_at_idx",
        fields: ["status", "paidAt"],
      },
      {
        name: "fees_school_status_paid_at_idx",
        fields: ["schoolId", "status", "paidAt"],
      },
    ],
  }
);

export default Fee;