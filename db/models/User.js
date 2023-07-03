const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

// Importing Models required

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jwt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updatedByUser:{
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

module.exports = User;
