const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

// Importing Models that is connected to the table
const Product = require('./Product')
const User = require('./User')


const ProductActuals = sequelize.define('ProductActuals', {
  monthlyDataId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'username'
    }
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    valmonth_idate: {
      isIn: [['save', 'publish']],
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'p_id'
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  april: {
    type: DataTypes.STRING,
  },
  may: {
    type: DataTypes.STRING,
  },
  june: {
    type: DataTypes.STRING,
  },
  july: {
    type: DataTypes.STRING,
  },
  august: {
    type: DataTypes.STRING,
  },
  september: {
    type: DataTypes.STRING,
  },
  october : {
    type: DataTypes.STRING,
  },
  november: {
    type: DataTypes.STRING,
  },
  december: {
    type: DataTypes.STRING,
  },
  january: {
    type: DataTypes.STRING,
  },
  february: {
    type: DataTypes.STRING,
  },
  march: {
    type: DataTypes.STRING,
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

module.exports = ProductActuals;