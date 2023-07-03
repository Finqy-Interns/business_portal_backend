// Importing all Models (Tables) here
const Channel = require('./db/models/Channel');
const ChannelMonthlyData = require('./db/models/ChannlelActuals')

const Product = require('./db/models/Product');
const ProductMonthlyData = require('./db/models/ProductActuals')

const SubProduct = require('./db/models/SubProduct');
const SubProductMonthlyData = require('./db/models/SubProductActuals');

const Role = require('./db/models/Role');
const Permission = require('./db/models/Permission')
const RolePermission = require('./db/models/RolePermission')

// const Month = require('./db/models/Month')

const User = require('./db/models/User');
const UserProduct = require('./db/models/UserProduct')
const UserRole = require('./db/models/UserRole');
const { Op } = require('sequelize');
// const VersionControl = require('./db/models/VersionControl');
// const ProductVersion = require('./db/models/ProductVersion')

const ProductBusinessTarget = require('./db/models/ProductBusinessTarget');
const SubProductBusinessTarget = require('./db/models/SubProductBusinessTarget')
const ChannelBusinessTarget = require('./db/models/ChannelBusinessTarget');
const SubProductActuals = require('./db/models/SubProductActuals');
const ChannelActuals = require('./db/models/ChannlelActuals');
const ProductActuals = require('./db/models/ProductActuals');

const Hierarchy = require('./db/models/Hierarchy')

// const { Op } = require('sequelize');
// const UserRole = require('./db/models/UserRole');

async function test() {

    // await Hierarchy.create({ product_id: 1, year: 2024, createdAt: new Date(), updatedAt: new Date() });
    // await Hierarchy.create({ product_id: 2, year: 2024, createdAt: new Date(), updatedAt: new Date() });
    // await Hierarchy.create({ product_id: 3, subProduct_id: 1, year: 2024, createdAt: new Date(), updatedAt: new Date() });
    // await Hierarchy.create({ product_id: 3, subProduct_id: 2, year: 2024, createdAt: new Date(), updatedAt: new Date() });
    // await Hierarchy.create({ product_id: 4, channel_id: 1, year: 2024, createdAt: new Date(), updatedAt: new Date() });
    // await Hierarchy.create({ product_id: 4, channel_id: 2, year: 2024, createdAt: new Date(), updatedAt: new Date() });
    // await Hierarchy.create({ product_id: 5, subProduct_id: 3, year: 2024, createdAt: new Date(), updatedAt: new Date() });
    // await Hierarchy.create({ product_id: 5, subProduct_id: 4, year: 2024, createdAt: new Date(), updatedAt: new Date() });
    // await Hierarchy.create({ product_id: 5, subProduct_id: 5, year: 2024, createdAt: new Date(), updatedAt: new Date() });
    // await Hierarchy.create({ product_id: 5, subProduct_id: 6, year: 2024, createdAt: new Date(), updatedAt: new Date() });
    // await Hierarchy.create({ product_id: 6, year: 2024, createdAt: new Date(), updatedAt: new Date() });


    // const user = [
    //     "kushagra@finqy.ai",
    //     "sanket@finqy.ai",
    //     "vridhi@finqy.ai",
    //     "arushi@finqy.ai",
    //     "mokshit@finqy.ai"
    // ]

    // for(var i=1;i<=12;i++){
    //     await RolePermission.create({
    //         role_id:1,
    //         permission_id:i,
    //         createdAt: new Date(),
    //         updatedAt: new Date()
    //     })
    // }

    // for(var i=1;i<=7;i++){
        // const response = await UserRole.create(
        //     {
        //         user_id:"mokshit@finqy.ai",
        //         role_id:1,
        //         createdAt: new Date(),
        //         updatedAt: new Date()
    
        //     }
        // )
        // console.log('Done', i)
    // }

    const response = await ProductActuals.create({
        userId:"kushagra@finqy.ai",
        version:1,
        status:"publish",
        year:2023,
        "product_id": 4,
        "april": `{
            "count": "401",
            "volume": "",
            "payIn": "1078285",
            "payOut": "707598",
            "retention": "370687"
        }`,
        "may": `{
            "count": "364",
            "volume": "",
            "payIn": "947124",
            "payOut": "642069",
            "retention": "305055"
        }`,
        "june": `{
            "count": "420",
            "volume": "",
            "payIn": "1082556",
            "payOut": "638516",
            "retention": "444040"
        }`,
        "july": `{
            "count": "479",
            "volume": "",
            "payIn": "1205626",
            "payOut": "714994",
            "retention": "490632"
        }`,
        "august": `{
            "count": "488",
            "volume": "",
            "payIn": "1190311",
            "payOut": "813337",
            "retention": "376974"
        }`,
        "september": `{
            "count": "527",
            "volume": "",
            "payIn": "1305784",
            "payOut": "850533",
            "retention": "455251"
        }`,
        "october": `{
            "count": "635",
            "volume": "",
            "payIn": "1532691",
            "payOut": "1159655",
            "retention": "373036"
        }`,
        "november": `{
            "count": "713",
            "volume": "",
            "payIn": "1669323",
            "payOut": "1242665",
            "retention": "426658"
        }`,
        "december": `{
            "count": "879",
            "volume": "",
            "payIn": "2060128",
            "payOut": "1747936",
            "retention": "312192"
        }`,
        "january": `{
            "count": "1077",
            "volume": "",
            "payIn": "2503297",
            "payOut": "2111226",
            "retention": "392071"
        }`,
        "february": `{
            "count": "964",
            "volume": "",
            "payIn": "2210463",
            "payOut": "1743229",
            "retention": "467234"
        }`,
        "march": `{
            "count": "870",
            "volume": "",
            "payIn": "1809979",
            "payOut": "1281167",
            "retention": "528812"
        }`,
        createdAt:new Date(),
        updatedAt:new Date(),
    })

    console.log('completed', response)
    // User Creation
    // const name = [
    //     "kushagra@finqy.ai",
    //     "kushi@finqy.ai",
    //     "mokshit@finqy.ai",
    //     "arushi@finqy.ai",
    //     "sanket@finqy.ai",
    //     "vridhi@finqy.ai",
    //     "parth@finqy.ai",
    //     "anurag@finqy.ai",
    // ]

    // var array = [];

    // for (var i = 0; i < name.length; i++) ``{
    //     array.push({
    //         username: name[i],
    //         password: 'test@1234',
    //         jwt: "",
    //         updatedByUser: "",
    //         createdAt: new Date()``,
    //         updatedAt: new Date(),
    //     })
    // }

    // await User.bulkCreate(array)

    // // Role Creation
    // const roles = [
    //     "finance_admin",
    //     "finance_user",
    //     "business_user",
    // ]

    // array = [];

    // for (var i = 0; i < roles.length; i++) {
    //     array.push({
    //         name:roles[i],
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     })
    // }

    // await Role.bulkCreate(array)

    // UserRole Creation
    // const  user_Role= [
    //     {
    //         user_id:"kushi@finqy.ai",
    //         role_id:2,
    //         createdAt:new Date(),
    //         updatedAt:new Date()
    //     },
    // {
    //     user_id:"anurag@finqy.ai",
    //     role_id:3,
    //     createdAt:new Date(),
    //     updatedAt:new Date()
    // },
    // {
    //     user_id:"parth@finqy.ai",
    //     role_id:3,
    //     createdAt:new Date(),
    //     updatedAt:new Date()
    // },
    // {
    //     user_id:"kushagra@finqy.ai",
    //     role_id:1,
    //     createdAt:new Date(),
    //     updatedAt:new Date()
    // },
    // {
    //     user_id:"mokshit@finqy.ai",
    //     role_id:1,
    //     createdAt:new Date(),
    //     updatedAt:new Date()
    // },
    // {
    //     user_id:"arushi@finqy.ai",
    //     role_id:1,
    //     createdAt:new Date(),
    //     updatedAt:new Date()
    // },
    // {
    //     user_id:"vridhi@finqy.ai",
    //     role_id:1,
    //     createdAt:new Date(),
    //     updatedAt:new Date()
    // },
    // {
    //     user_id:"sanket@finqy.ai",
    //     role_id:1,
    //     createdAt:new Date(),
    //     updatedAt:new Date()
    // },
    // ]

    // array = [];

    // for (var i = 0; i < user_Role.length; i++) {
    //     array.push({
    //         userRole_id:i,
    //         ...user_Role[i]
    //     })
    // }

    // await UserRole.bulkCreate(array)

    // Product creation
    // const products = [
    //     {
    //         name:"business_loan",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"auto_loan",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"secured_loan",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"credit_card",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"insurance",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"personal_loan",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"test_product",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    // ]

    // array = [];

    // for (var i = 0; i < products.length; i++) {
    //     array.push(
    //         {
    //             ...products[i]
    //         }
    //     )
    // }

    // await Product.bulkCreate(array)

    // // Sub Product creation
    // const subProducts = [
    //     {
    //         sp_name:"home_loan",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         sp_name:"loan_against_property",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         sp_name:"health",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         sp_name:"life",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         sp_name:"term",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         sp_name:"motor",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    // ]

    // array = [];

    // for (var i = 0; i < subProducts.length; i++) {
    //     array.push(
    //         {
    //             ...subProducts[i]
    //         }
    //     )
    // }

    // await SubProduct.bulkCreate(array)

    // //     Channel creation
    // const channels = [
    //     {
    //         c_name:'In_house',
    //         createdAt:new Date(),
    //         updatedAt:new Date()
    //     },
    //     {
    //         c_name:'call_center',
    //         createdAt:new Date(),
    //         updatedAt:new Date()
    //     }
    // ]

    // array = [];

    // for (var i = 0; i < channels.length; i++) {
    //     array.push(
    //         {
    //             ...channels[i]
    //         }
    //     )
    // }

    // await Channel.bulkCreate(array)

    // // Permission creation
    // const permissions = [
    //     {
    //         name:"CREATE_BUSINESS_TARGET",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"READ_BUSINESS_TARGET",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"UPDATE_BUSINESS_TARGET",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"DELETE_BUSINESS_TARGET",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     // Numbers
    //     {
    //         name:"CREATE_NUMBERS",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"READ_NUMBERS",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"UPDATE_NUMBERS",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"DELETE_NUMBERS",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     // Target History
    //     {
    //         name:"CREATE_TARGET_HISTORY",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"READ_TARGET_HISTORY",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"UPDATE_TARGET_HISTORY",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"DELETE_TARGET_HISTORY",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },

    //     // USER CREATION

    //     {
    //         name:"CREATE_USER",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"READ_USER",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"UPDATE_USER",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"DELETE_USER",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },

    //     // ROLE CREATION

    //     {
    //         name:"CREATE_ROLE",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"READ_ROLE",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"UPDATE_ROLE",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"DELETE_ROLE",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },

    //     // HIERARCHY CREATION

    //     {
    //         name:"CREATE_HIERARCHY",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"READ_HIERARCHY",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"UPDATE_HIERARCHY",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"DELETE_HIERARCHY",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },

    //     // PRODUCT, SUBPRODUCT and CHANNEL

    //     {
    //         name:"CREATE_P_SP_C",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"READ_P_SP_C",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"UPDATE_P_SP_C",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    //     {
    //         name:"DELETE_P_SP_C",
    //         createdAt:new Date(),
    //         updatedAt:new Date(),
    //     },
    // ]

    // array = [];

    // for (var i = 0; i < permissions.length; i++) {
    //     array.push(
    //         {
    //             ...permissions[i]
    //         }
    //     )
    // }

    // await Permission.bulkCreate(array)

    // // Business User
    // array = [];

    // for (var i = 5; i <=12; i++) {
    //     if (!i % 4 == 0) {
    //         array.push(
    //             {
    //                 role_id: 3,
    //                 permission_id:i,
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //             },
    //         )
    //     }
    // }

    // await RolePermission.bulkCreate(array)

    // // // Finance User
    // array = [];

    // for (var i = 1; i <=12; i++) {
    //     if (!i % 4 == 0) {
    //         array.push(
    //             {
    //                 role_id: 2,
    //                 permission_id:i,
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //             },
    //         )
    //     }
    // }

    // await RolePermission.bulkCreate(array)

    // // // Finance Admin

    // array = [];

    // for (var i = 13; i <=28; i++) {
    //     if (!i % 4 == 0) {
    //         array.push(
    //             {
    //                 role_id: 1,
    //                 permission_id:i,
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //             },
    //         )
    //     }
    // }

    // await RolePermission.bulkCreate(array)

    // const months = [
    //     "april",
    //     "may",
    //     "june",
    //     "july",
    //     "august",
    //     "september",
    //     "october",
    //     "november",
    //     "december",
    //     "january",
    //     "february",
    //     "march"
    // ]

    // array = [];

    // for (var i = 0; i < months.length; i++) {
    //     array.push({
    //         month_name: months[i],
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //     })
    // }

    // await Month.bulkCreate(array)

}

module.exports = test


    
    // exit(1)
    // await User.create({
    //     username: 'kushagra@finqy.ai',
    //     password: 'test@1234',
    //     role: 1,
    //     jwt: "",
    //     updatedByUser: "",
    //     createdAt: "",
    //     updatedAt: ""
    // })

    // UserProduct.create({
    //     user_id:"kushagra@finqy.ai",
    //     product_id:2,
    //     createdAt: "",
    //     updatedAt: ""
    // })

    // await Product.create({
    //    name:"Auto Loans",
    //    year: 2024,
    //    createdAt:"",
    //    updatedAt:"", 
    // })