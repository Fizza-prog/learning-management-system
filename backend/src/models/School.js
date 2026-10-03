/**
 * @file School.js
 * @description Defines the Sequelize model for schools.
 *
 * Responsibilities:
 * - Declare school identity, contact, and active-status fields.
 */
import { DataTypes } from "sequelize";

import { sequelize } from "../config/database.js";

const School = sequelize.define(
  "School",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    indexes: [
      {
        name: "schools_created_at_idx",
        fields: ["createdAt"],
      },
    ],
  }
);

export default School;