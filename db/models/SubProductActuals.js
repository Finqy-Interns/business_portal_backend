const { DataTypes } = require("sequelize");
const sequelize = require('../connection');

// Importing Modules required
const Product = require('./Product')
const SubProduct = require('./SubProduct')
const User = require('./User')

const SubProductActuals = sequelize.define("SubProductActuals", {
  sp_data_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'username'
    }
  },
  subProduct_id: {
    type: DataTypes.INTEGER,
    references: {
      model: SubProduct,
      key: 'sp_id'
    },
    allowNull: false,
  },
  // product_id: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: Product,
  //     key: 'p_id'
  //   }
  // },
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

module.exports = SubProductActuals;
