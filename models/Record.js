const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Record = sequelize.define("Record", {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  type: {
    type: DataTypes.ENUM("income", "expense"),
    allowNull: false
  },
  category: DataTypes.STRING,
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  note: DataTypes.STRING
}, {
  paranoid: true
});

module.exports = Record;