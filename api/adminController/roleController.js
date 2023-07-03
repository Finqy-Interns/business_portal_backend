const express = require('express');
const router = express.Router();
const RolePermission = require('../../db/models/RolePermission')
const Role = require('../../db/models/Role')
const authenticatedPolicy = require('../middlewares/Authentication');
const permissionPolicy = require('../middlewares/Permission')
const asyncHandler = require('express-async-handler');
const Permission = require('../../db/models/Permission');

// Get all role names
router.get('/', authenticatedPolicy(), permissionPolicy(['READ_ROLE']), asyncHandler(async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ['name', 'role_id'],
      include: [
        {
          model:RolePermission,
          attributes: ['role_id','permission_id'],
          include: [
            {
              model:Permission,
              attributes: ['name']
            }
          ]
        }
      ]
    });

    // console.log('roles',roles)

    const rolenames = roles.map(role => {
      return ({
        role_id: role.role_id,
        name: role.name,
        permissions:role.RolePermissions.map((rp)=>{
          // console.log
          return {
            permission_id:rp.dataValues.permission_id,
            name:rp.dataValues.Permission.dataValues.name
          }
        })
      })
    });

    res.json({
      status: 200,
      data: rolenames
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
}));


// Create a new role and map it to permissions
router.post('/add', authenticatedPolicy(), permissionPolicy(['CREATE_ROLE']), async (req, res) => {
  try {
    const body = req.body
    const { name, permissions } = req.body;
    console.log(name, permissions, body)
    if (!name || !permissions) {
      return res.status(400).json({ msg: "Name and permissions can't be null" })
    }

    const roleRecord = await Role.findOne({
      where: {
        name: name,
      }
    })

    if (roleRecord) {
      return res.status(400).json({
        msg: "Role Already Exists",
        status: 400,
      })
    }

    if (!(Array.isArray(permissions))) {
      return res.status(400).json({ msg: 'Permissions must be an array', status: 400 });
    }

    if (permissions.length == 0) {
      return res.status(400).json({ msg: 'Permission ID Array is Empty', status: 400 });
    }

    const allNumbers = permissions.every(value => Number.isInteger(value));

    if (!allNumbers) {
      return res.status(400).json({ msg: 'Permission ID contains invalid Values', status: 400 });
    }

    for (var i = 0; i < permissions.length; i++) {
      const permissionRecord = await Permission.findByPk(permissions[i])

      if (!permissionRecord) {
        return res.status(400).json({ msg: 'Invalid Permission ID Sent', status: 400 });
      }
    }

    // Create the role
    const role = await Role.create({ name });

    // Map the role to permissions
    const rolePermissions = permissions.map(permission => ({
      role_id: role.dataValues.role_id,
      permission_id: permission
    }));

    // Create role-permission mappings
    await RolePermission.bulkCreate(rolePermissions);

    // Retrieve the role along with its associated permissions
    const updatedRole = await Role.findByPk(role.dataValues.role_id, {
      include: [RolePermission]
    });

    res.status(201).json({ msg: 'Role created successfully', role: updatedRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error', status: 500 });
  }
});



// Edit role name and permissions
router.put('/edit/:role_id', authenticatedPolicy(), permissionPolicy(['UPDATE_ROLE']), async (req, res) => {
  try {
    const { role_id } = req.params;
    const { name, permissions } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "Name", status: 400 })
    }
    // Check if the role exists
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found', status: 404 });
    }

    const roleRecord = await Role.findOne({
      where: { name: name }
    })

    // if (roleRecord) {
    //   return res.status(400).json({
    //     msg: "Role Name already exists",
    //     status: 404,
    //   })
    // }
    // console.log(typeof (permissions))
    // console.log(Array.isArray(permissions))

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ msg: 'Permissions must be an array', status: 400 });
    }

    if (permissions.length == 0) {
      return res.status(400).json({ msg: 'Permission ID Array is Empty', status: 400 });
    }

    const allNumbers = permissions.every(value => Number.isInteger(value));

    if (!allNumbers) {
      return res.status(400).json({ msg: 'Permission ID contains invalid Values', status: 400 });
    }

    for (var i = 0; i < permissions.length; i++) {
      const permissionRecord = await Permission.findByPk(permissions[i])

      if (!permissionRecord) {
        return res.status(400).json({ msg: 'Invalid Permission ID Sent', status: 400 });
      }
    }

    // Update the role name
    role.name = name;
    await role.save();

    // Remove existing role permissions
    await RolePermission.destroy({ where: { role_id } });

    // Add new role permissions
    for (const permissionId of permissions) {
      await RolePermission.create({ role_id, permission_id: permissionId });
    }

    // Retrieve the updated role with its permissions
    const updatedRole = await Role.findByPk(role_id, { include: [RolePermission] });

    res.status(200).json({ message: 'Role updated successfully', role: updatedRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
