const express = require('express');
const router = express.Router();
const User = require('../../db/models/User');
const UserProduct = require('../../db/models/UserProduct')
const Role = require('../../db/models/Role');
const Product = require('../../db/models/Product');

const asyncHandler = require('express-async-handler');
const authenticatedPolicy = require('../middlewares/Authentication')
const permissionPolicy = require('../middlewares/Permission');
const UserRole = require('../../db/models/UserRole');

// Get all usernames and passwords
router.get('/', authenticatedPolicy(), permissionPolicy(['READ_USER']),asyncHandler(async (req, res) => {
  try {
    var users = await User.findAll({
      attributes: ['username', 'password'],
      include: [
        {
          model: UserProduct,
          attributes: ['product_id'],
          include: [
            {
              model: Product,
              attributes: ['name']
            }
          ]
        },
        {
          model: UserRole,
          attributes: ['role_id'],
          include: [
            {
              model:Role,
              attributes:['name']
            }
          ]
        }
      ]
    });

    users = users.map(u=>{
      const { UserProducts, UserRoles, ...rest } = u.dataValues;
      return {
        ...rest,
        products: UserProducts.map(up=>{
          const { Product, ...productRest  } = up.dataValues;
          return {
            ...productRest,
            name:Product.dataValues.name
          }
        }),
        roles: UserRoles.map(ur=>{
          const { Role, ...roleRest  } = ur.dataValues;
          return {
            ...roleRest ,
            name: Role.dataValues.name
          };
        }),
      }
    })

    res.json({
      data:users,
      status:200,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
}));

// Create a new user
// Multiple Roles cannot be added as of now to user
// It can be added in DB but we have not handled that

router.post('/add', authenticatedPolicy(), permissionPolicy(['CREATE_USER']),asyncHandler(async (req, res) => {
    try {

      const { username: requestAdminUser } = req.user

      const { username, password, products, role_id } = req.body;

      if(!username || !password || !products || !role_id){
        return res.status(400).json({
          msg:"Username or passowrd or products or role is missing",
          status:400,
        })
      }

      const roleRecord = await Role.findByPk(role_id);

      if(!roleRecord){
        return res.status(400).json({
          msg:"Invalid Role ID",
          status:400,
        })
      }

      if (!(Array.isArray(products))) {
        return res.status(400).json({ msg: 'products must be an array',status:400 });
      }
  
      if(products.length == 0){
        return res.status(400).json({ msg: 'products Array is Empty',status:400 });
      }
  
      const allNumbers = products.every(value => Number.isInteger(value));

      if(!allNumbers){
        return res.status(400).json({ msg: 'products Array contains invalid Values',status:400 });
      }

      var productRecords = []
      for(var i=0;i<products.length;i++){
        const productRecord = await Product.findByPk(products[i], {
          attributes: ['p_id','name']
        })
        
        if(!productRecord){
          return res.status(400).json({ msg: 'Invalid Product ID Sent',status:400 });
        }
        else{
          productRecords.push(productRecord)
        }
      }
  
      // Check if the user already exists
      const userRecord = await User.findOne({ where: { username } });
      if (userRecord) {
        return res.status(400).json({ msg: 'User already exists', status:400 });
      }

      console.log(productRecords)
      // Create the user
      const user = await User.create({
        username,
        password,
        jwt:"",
        updatedByUser:requestAdminUser,
        createdAt:new Date(),
        updatedAt:new Date(),
      });

      // Create a Array of User Product records to be inserted 
      var userProductRecordsInsert = [];
      for(var i=0;i<products.length;i++){
        userProductRecordsInsert.push({
          user_id:username,
          product_id:products[i],
          createdAt:new Date(),
          updatedAt:new Date(),
        })
      }

      // Add the user products 
      const userProductRecords = await UserProduct.bulkCreate(userProductRecordsInsert)

      // Add the user role
      const userRoleRecord = await UserRole.create({
        user_id:username,
        role_id:role_id,
        createdAt:new Date(),
        updatedAt:new Date(),
      })

      const dataToSend = {}

      dataToSend['username'] = user.dataValues.username;
      dataToSend['password'] = user.dataValues.password;
      dataToSend['products'] = userProductRecords.map(up=>{
        delete up.dataValues.userProduct_id;
        delete up.dataValues.createdAt;
        delete up.dataValues.updatedAt;

        return {
          ...up.dataValues,
          product_id:Number(up?.dataValues?.product_id)
        }
      })

      delete userRoleRecord?.dataValues?.createdAt;
      delete userRoleRecord?.dataValues?.updatedAt;
      userRoleRecord.dataValues.role_id = Number(userRoleRecord.dataValues.role_id)
      dataToSend['roles'] = [userRoleRecord] 
      // console.log('pir',productRecords)

      res.status(201).json({ msg: 'User created successfully', data:dataToSend, status:200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Internal server error', status:500 });
    }
  }));
  

// API endpoint for updating a user's roles and products based on username


router.put('/edit/:userId', authenticatedPolicy(), async (req, res) => {
  const { userId } = req.params;
  const { productId, roleId } = req.body;

  // Check if user exists
  const user = await User.findOne({ where: { userId: user_id } });

  if (!user) {
    return res.status(404).json({ msg: 'User not found', status: 404 });
  }

  // Update the role
  if (roleId) {
    const existingRole = await Role.findOne({ where: { roleId: role_id } });

    if (!existingRole) {
      return res.status(400).json({ msg: 'Invalid role', status: 400 });
    }

    await UserRole.update(
      { role_id: existingRole.role_id },
      { where: { user_id: user.user_id } }
    );
  }

  // Update the product
  if (productId) {
    const existingProduct = await Product.findOne({ where: { product_id: productId } });

    if (!existingProduct) {
      return res.status(400).json({ msg: 'Invalid product' });
    }

    await UserProduct.update(
      { product_id: existingProduct.product_id },
      { where: { user_id: user.user_id } }
    );
  }
  
router.put('/edit/:user_id', authenticatedPolicy(), permissionPolicy(['UPDATE_USER']),async (req, res) =>{

const {user_id} = req.params;

const {products, role_id} = req.body;

if(!products || !role_id){
  return res.status(400).json({
    msg:"Either products or role is missing to update",
    status:400,
  })
}

const user = await User.findByPk(user_id);

if (!user){
  return res.status(404).json({msg:"User not found", status:404})
}

if (!(Array.isArray(products))) {
  return res.status(400).json({ msg: 'products must be an array',status:400 });
}

if(products.length == 0){
  return res.status(400).json({ msg: 'products Array is Empty',status:400 });
}

const allNumbers = products.every(value => Number.isInteger(value));

if(!allNumbers){
  return res.status(400).json({ msg: 'products Array contains invalid Values',status:400 });
}

var productRecords = []
for(var i=0;i<products.length;i++){
  const productRecord = await Product.findByPk(products[i], {
    attributes: ['p_id','name']
  })
  
  if(!productRecord){
    return res.status(400).json({ msg: 'Invalid Product ID Sent',status:400 });
  }
  else{
    productRecords.push(productRecord)
  }
}

  // Return success response
  return res.status(200).json({ msg: 'User updated successfully' });
});
});

// Export the router
module.exports = router;
