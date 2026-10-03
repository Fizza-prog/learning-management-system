/**
 * @file Announcement.js
 * @description Defines the Sequelize model for school announcements.
 *
 * Responsibilities:
 * - Declare announcement fields and persistence constraints.
 */
import { DataTypes } from "sequelize";

import { sequelize } from "../config/database.js";

const Announcement = sequelize.define("Announcement", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default Announcement;