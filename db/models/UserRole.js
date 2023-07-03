const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const User = require('./User');
const Role = require('./Role');

const UserRole = sequelize.define('UserRole', {
  userRole_id: {
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
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: 'role_id',
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

UserRole.belongsTo(User, { foreignKey: 'user_id' });
UserRole.belongsTo(Role, { foreignKey: 'role_id' });
User.hasMany(UserRole, { foreignKey: 'user_id' });
Role.hasMany(UserRole, { foreignKey: 'role_id' });

module.exports = UserRole;
