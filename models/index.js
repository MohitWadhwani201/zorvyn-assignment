const sequelize = require("../config/db");
const User = require("./User");
const Record = require("./Record");

User.hasMany(Record, { foreignKey: "userId" });
Record.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Record
};