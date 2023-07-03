const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

// Importing supporting Models (Ones who act as foreign key here)
const Product = require('./Product')
const SubProduct = require('./SubProduct')


// Channel Schema
const Channel = sequelize.define("Channel", {
  c_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  c_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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


module.exports = Channel;
