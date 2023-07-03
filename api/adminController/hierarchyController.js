// Assuming you have set up Sequelize models and established a connection to the database

// Import necessary Sequelize models
const router = require('express').Router();
const Hierarchy = require('../../db/models/Hierarchy');
const SubProduct = require('../../db/models/SubProduct');
const Channel = require('../../db/models/Channel');
const Product = require('../../db/models/Product');
const authenticatedPolicy = require('../../db/models/Hierarchy')
// POST endpoint to add hierarchy
// Assuming you have set up Sequelize models and established a connection to the database

// Import necessary Sequelize models

// POST endpoint to add hierarchy

// router.post('/hierarchy',async (req, res) => {
//     try {
//         console.log("inside");

//         const data = req.body;
//         console.log(data);

//         data.map(async (object) => {
//             if (object) {
//                 var product_id = object.product.p_id;
//                 // var name = object.product.name;
//                 if (object.subproducts.length > 0) {
//                     console.log('inside condition')
//                     var myArray = [];
//                     object.subproducts.map((sp) => {

//                         if (sp.channels.length == 0) {

//                             myArray.push({
//                                 product_id: product_id,
//                                 subProduct_id: sp.sp_id,
//                                 year: 2025,
//                                 createdAt: new Date(),
//                                 updatedAt: new Date(),
//                             })
//                         }
//                         else {

//                            sp.channels.map((c) => {

//                                 myArray.push({
//                                     product_id: product_id,
//                                     subProduct_id: sp.sp_id,
//                                     channel_id: c.c_id,
//                                     year: 2025,
//                                     createdAt: new Date(),
//                                     updatedAt: new Date(),
//                                 })
//                             })
//                         }
//                     })
//                     await Hierarchy.bulkCreate(myArray);
//                 }
//                 else if (object.channels.length > 0) {
//                     let myArray = [];
//                     object.channels.map(c => {
//                         myArray.push({
//                             product_id: product_id,
//                             channel_id: c.c_id,
//                             year: 2025,
//                             createdAt: new Date(),
//                             updatedAt: new Date(),
//                         })
//                     })
//                     await Hierarchy.bulkCreate(myArray);

//                 }
//                 else {
//                     await Hierarchy.create({
//                         product_id: product_id,
//                         year: 2025,
//                         createdAt: new Date(),
//                         updatedAt: new Date(),
//                     });

//                 }
//             }
//         })

//         res.status(200).json({ message: 'Hierarchy added successfully' });
//     } catch (error) {
//         console.error('Error adding hierarchy:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

module.exports = router;