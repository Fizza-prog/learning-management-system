const User = require("./User");
const School = require("./School");

// Relationships

School.hasMany(User, {
  foreignKey: "schoolId",
});

User.belongsTo(School, {
  foreignKey: "schoolId",
});

module.exports = {
  User,
  School,
};