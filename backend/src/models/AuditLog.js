/**
 * @file AuditLog.js
 * @description Defines the Sequelize model for recorded administrative activity.
 *
 * Responsibilities:
 * - Declare audit action, entity, actor, and request metadata fields.
 */

import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    schoolId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    entity: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    entityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },

    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "AuditLogs",
    timestamps: true,
    updatedAt: false,

    indexes: [
      {
        name: "audit_logs_user_id_idx",
        fields: ["userId"],
      },
      {
        name: "audit_logs_school_id_idx",
        fields: ["schoolId"],
      },
      {
        name: "audit_logs_created_at_idx",
        fields: ["createdAt"],
      },
    ],
  }
);

export default AuditLog;

