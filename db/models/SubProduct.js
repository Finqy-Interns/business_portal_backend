const { DataTypes } = require("sequelize");
const sequelize = require('../connection');

// Importing Models required
const Product = require('./Product')


const SubProduct = sequelize.define("SubProduct", {
  sp_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sp_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
});

module.exports = SubProduct;
