/**
 * @file index.js
 * @description Registers Sequelize models and their application associations.
 *
 * Responsibilities:
 * - Connect schools, users, fees, audit logs, and announcements.
 * - Export registered models for controllers and services.
 */
import User from "./User.js";
import School from "./School.js";
import AuditLog from "./AuditLog.js";
import Fee from "./Fee.js";
import Announcement from "./Announcement.js";
// Relationships

School.hasMany(User, {
  foreignKey: "schoolId",
});

User.belongsTo(School, {
  foreignKey: "schoolId",
});

School.hasMany(Fee, { foreignKey: "schoolId" });
Fee.belongsTo(School, { foreignKey: "schoolId" });
User.hasMany(Fee, { as: "student", foreignKey: "studentId" });
Fee.belongsTo(User, { as: "student", foreignKey: "studentId" });
School.hasMany(Announcement, {
  foreignKey: "schoolId",
});

Announcement.belongsTo(School, {
  foreignKey: "schoolId",
});

User.hasMany(Announcement, {
  as: "createdAnnouncements",
  foreignKey: "createdBy",
});

Announcement.belongsTo(User, {
  as: "creator",
  foreignKey: "createdBy",
});

export {
  User,
  School,
  AuditLog,
  Fee,
  Announcement
};
  