// Importing modules
const express = require('express')
const app = express();
// Only for development
// const cors = require('cors');
require('dotenv').config()

// Connection file
const sequelize = require('./db/connection');

// All models are required here
require('./db/index');

// const test = require('./test')
// test();

// Middleware
app.use(express.json());
// app.use(cors());

// Importing Login Route
const loginRoutes = require('./api/login/login')

// Login Route
app.use('/api/login',loginRoutes);

// Importing Common (Business and Finance) Routes
// const editCommonController = require('./api/commonController/editTargetAndActuals');
const addCommonController = require('./api/commonController/addTargetAndActuals')
const demoExcelCommonController = require('./api/commonController/demoExcelTargetAndActuals');
const hierarchyCommonController  = require('./api/commonController/hierarchy');
const uploadCommonController = require('./api/commonController/uploadExcel')
const addhierarchy = require('./api/adminController/hierarchyController')
// Common (Business and Finance) Routes
// app.use('/api/user/addOrEdit',editCommonController);
app.use('/api/user/add',addCommonController);
app.use('/api/user/demoExcel',demoExcelCommonController);
app.use('/api/user/hierarchy',hierarchyCommonController)
app.use('/api/user/upload',uploadCommonController)
app.use('/api/addhierarchy',addhierarchy);

// // Importing Admin Routes
const adminProductContoller = require('./api/adminController/productController');
const adminSubProductController = require('./api/adminController/subProductController');
const adminChannelController = require('./api/adminController/channelController');
const adminRoleController = require('./api/adminController/roleController');
const adminPermissionController = require('./api/adminController/permissionController');
const adminUserController = require('./api/adminController/userController');

// Admin Routes
app.use('/api/admin/product',adminProductContoller);
app.use('/api/admin/subProduct',adminSubProductController);
app.use('/api/admin/channel',adminChannelController);
app.use('/api/admin/role',adminRoleController);
app.use('/api/admin/permission',adminPermissionController);
app.use('/api/admin/user',adminUserController);

// Start the server
const port = process.env.SERVERPORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  // Synchronize the models with the database
  sequelize.sync()
    .then(() => {
      console.log('Tables created successfully.');
    })
    .catch((error) => {
      console.error('Error creating tables:', error);
    });

});
