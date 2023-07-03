/* 
API's Needed for Login 

For All Users
1. Login API
2. Getting Products against the user
*/

// Importing Modules
const router = require('express').Router()
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../utils/jwt')

// Importing required DB Models
const User = require('../../db/models/User');
// const Product = require('../../db/models/Product')
// const UserProduct = require('../../db/models/UserProduct');
const Role = require('../../db/models/Role');
const UserRole = require('../../db/models/UserRole');

/*
Login/Authentication API

Input
1. username
2. Password
3. Product

Output:
1. JWT

process for the same
1. find the username from the User Model (If not found return 404)
2. check the password for that username
3. If password right send jwt and status 200
4. If password not right send status 401 (Unauthorized)

Models Used
1. User
2. Role
3. RolePermission
4. Permission

*/

router.post('/', asyncHandler(async (req, res) => {
  try {

    // Prod
    const { username, password } = req.body

    // If Username or Password not provided send 400
    if (!username || !password) {
      return res.status(400).json({ msg: "Username or Password is missing ", status: 400 })
    }

    // Fetching from the database
    const UserRecord = await User.findByPk(username,)

    const UserRoleRecord = await UserRole.findOne({
      where: {
        user_id: username
      }
    })

    if(!UserRoleRecord){
      return res.status(400).json({ msg: "Role for the user not Found", status: 400 })
    }

    const role_of_user = UserRoleRecord.dataValues?.role_id;

    const RoleRecord = await Role.findOne({
      where: {
        role_id: role_of_user,
      },
      attributes:['name']
    })

    const roleName = RoleRecord.dataValues?.name;

    // If not exists send 400
    if (!UserRecord) {
      return res.status(400).json({ msg: "User Not Found", status: 400 })
    }

    updatedUserRecord = UserRecord.dataValues;
    const userPassword = updatedUserRecord?.password;

    // If the password sent is equal to the password in the database
    if (userPassword == password) {
      // Create JWT Token
      const tokenGenerated = generateToken({
        username: username,
        role: roleName,
      })

      await User.update(
        {
          jwt: tokenGenerated,
        },
        {
          where: {
            username: username,
          }
        })

      // Send JWT token and role
      res.status(200).json({
        jwt: tokenGenerated,
        role: roleName,
        msg: "SuccessFull request",
        status: 200
      })
    }

    // If password is not equal
    else {
      res.status(401).json({
        msg: "password is wrong",
        status: 401
      })
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Internal server error', status: 500 });
  }
}))



/*
Getting Products Against the user API

Input
1. username

Output:
1. All the products related to the user

process for the same
1. find the username from the User Model (If not found return 404)
2. Fetch all the product Id from the UserProduct Table
3. Fetch all the product names from the product table
4. Return JSON for the products 

Models Used
1. User
2. UserProduct
3. Product
*/

// router.get('/getproducts/:username', asyncHandler(async (req, res) => {
//   try {
//     const { username } = req.params;

//     if (!username) {
//       return res.status(400).json({ msg: "username not provided", status: 400 })
//     }

//     // Find the user by username
//     const user = await User.findOne({
//       where: { username }
//     });

//     if (!user) {
//       return res.status(404).json({ msg: 'User not found', status: 404 });
//     }

//     // Fetch all product IDs associated with the user
//     const userProducts = await UserProduct.findAll({
//       where: { user_id: username },
//       attributes: ['product_id']
//     });

//     // Extracting the current year and based on that products will be returned
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();

//     if (currentMonth >= 4) {
//       financialYear = currentYear + 1;
//     }

//     // Extract the product IDs from the userProducts array
//     const productIds = userProducts.map((userProduct) => userProduct?.dataValues?.product_id);

//     // Fetch all product names based on the product IDs
//     const products = await Product.findAll({
//       where: { p_id: [...productIds], year: 2024 },
//       attributes: ['name']
//     });

//     // Return the products as JSON
//     res.json({ products: products, status: 200 });

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ msg: 'Internal server error', status: 500 });
//   }
// }))



// Exportig the router
module.exports = router


