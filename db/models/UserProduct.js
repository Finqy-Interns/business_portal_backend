const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const User = require('./User');
const Product = require('./Product');

const UserProduct = sequelize.define('UserProduct', {
  userProduct_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'username',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'p_id',
    },
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

UserProduct.belongsTo(User, { foreignKey: 'user_id' });
UserProduct.belongsTo(Product, { foreignKey: 'product_id' });
User.hasMany(UserProduct, { foreignKey: 'user_id' });
module.exports = UserProduct;
Product.hasMany(UserProduct, { foreignKey: 'product_id' });
