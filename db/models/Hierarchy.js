// Initialize Sequelize
const { DataTypes } = require("sequelize");
const sequelize = require("../connection");


const Product = require('./Product')
const SubProduct = require('./SubProduct')
const Channel = require('./Channel');



// Define the Hierarchy model
const Hierarchy = sequelize.define('Hierarchy', {
  hierarchy_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'p_id'
    }
  },
  subProduct_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: SubProduct,
      key: 'sp_id'
    }
  },
  channel_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Channel,
      key: 'c_id'
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },

});
// Define the associations between tables
Hierarchy.belongsTo(Product, { foreignKey: 'product_id' });
Hierarchy.belongsTo(SubProduct, { foreignKey: 'subProduct_id' });
Hierarchy.belongsTo(Channel, { foreignKey: 'channel_id' });

// Define associations in Product model
Product.hasMany(Hierarchy, { foreignKey: 'product_id' });

// Define associations in SubProduct model
SubProduct.hasMany(Hierarchy, { foreignKey: 'subProduct_id' });

// Define associations in Channel model
Channel.hasMany(Hierarchy, { foreignKey: 'channel_id' });

module.exports = Hierarchy;
