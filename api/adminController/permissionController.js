const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const authenticatedPolicy = require('../middlewares/Authentication');
const permissionPolicy = require('../middlewares/Permission')
const Permission = require('../../db/models/Permission');

// Get all role names
router.get('/', authenticatedPolicy(), permissionPolicy(['READ_PERMISSION']), asyncHandler(async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      attributes: ['name', 'permission_id']
    });

    const permissionnames = permissions.map(permission => ({
      permission_id: permission.permission_id,
      name: permission.name
    }));

    res.json({
      data: permissionnames,
      status: 200
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
}));


// Create a new Permission
router.post('/add', authenticatedPolicy(), permissionPolicy(['CREATE_PERMISSION']), asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        msg: "Name is Missing",
        status: 400,
      })
    }

    // Check if the Permission already exists
    const permissionRecord = await Permission.findOne({ where: { name } });
    if (permissionRecord) {
      return res.status(400).json({ message: 'Permission already exists', status:400 });
    }

    // Create the Permission
    const permission = await Permission.create({
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ data: permission, status: 201 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
}));

// Edit the permission with the id
router.put('/edit/:permission_id', authenticatedPolicy(), permissionPolicy(['UPDATE_PERMISSION']), asyncHandler(async (req, res) => {
  try {
    const { permission_id } = req.params;
    const { name } = req.body;

    if(!name){
      return res.status(400).json({
        msg:"No Name sent",
        status:400,
      })
    }

    // Find the product by ID
    const permission = await Permission.findByPk(permission_id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    const permissionRecord = await Permission.findOne({
      where: { name }
    });

    if(permissionRecord){
      return res.status(400).json({
        msg:"Permission Name Already Exists!",
        status:400,
      })
    }

    // Update the product name
    permission.name = name;
    permission.updatedAt = new Date();
    const updatedpermissionRecord = await permission.save();

    res.status(200).json({ message: 'Permission name edited successfully', status:200 , data:updatedpermissionRecord});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}));

module.exports = router;
