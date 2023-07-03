const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Role = require('./Role')
const Permission = require('./Permission')

const RolePermission = sequelize.define('RolePermission', {
  rolePermission_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'role_id',
    },
  },
  permission_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Permission,
      key: 'permission_id',
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

Role.hasMany(RolePermission, { foreignKey: 'role_id' });
RolePermission.belongsTo(Role, { foreignKey: 'role_id' });

Permission.hasMany(RolePermission, { foreignKey: 'permission_id' });
RolePermission.belongsTo(Permission, { foreignKey: 'permission_id' });

module.exports = RolePermission;