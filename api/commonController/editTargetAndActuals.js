// Get all products, subproducts, and channels
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { monthConversionToJson } = require('../utils/business-target-utils')

// Including Models 

const authenticatedPolicy = require('../middlewares/Authentication')
const permissionPolicy = require('../middlewares/Permission');
const Product = require('../../db/models/Product');
const fetchData = require('../utils/fetchData');
const ChannelBusinessTarget = require('../../db/models/ChannelBusinessTarget');
const ProductBusinessTarget = require('../../db/models/ProductBusinessTarget');
const SubProductBusinessTarget = require('../../db/models/SubProductBusinessTarget');
const ProductActuals = require('../../db/models/ProductActuals');
const SubProductActuals = require('../../db/models/SubProductActuals');
const ChannelActuals = require('../../db/models/ChannlelActuals');

// Including Utils

const getCurrentFY = require('../utils/getCurrentFY')

// router.put('/:product_id/:status/:action', authenticatedPolicy(), permissionPolicy(['UPDATE_BUSINESS_TARGET', 'UPDATE_NUMBERS']), asyncHandler(async (req, res) => {

//     try {

//         const { product_id, status, action } = req.params;
//         const { username, role } = req.user;
//         const { data } = req.body;

//         var productModel;

//         if (status == "target") {
//             productModel = ProductBusinessTarget;
//         }
//         else if (status == "actual") {
//             productModel = ProductActuals;
//         }

//         if (!data) {
//             return res.status(400).json({
//                 msg: "No Data Sent to update",
//                 status: 400,
//             })
//         }

//         const productRecord = await Product.findOne({
//             where: {
//                 p_id: product_id,
//             }
//         })

//         if (!productRecord) {
//             return res.status(400).json({
//                 msg: "No Product found with the Id",
//                 status: 400,
//             })
//         }

//         const treeStructure = await fetchData(product_id, () => { })

//         // console.log('tree', treeStructure)

//         const productTreeStructure = treeStructure['product'];
//         const subproductTreeStructure = treeStructure['subproducts'];
//         const channelTreeStructure = treeStructure['channels']


//         const { status: newStatus, product, subProduct, channels, year } = data

//         if (!year) {
//             return res.status(400).json({
//                 msg: "year is missing",
//                 status: 400,
//             })
//         }

//         // if (action == "add" && status == "target" && !year) {
//         //     return res.status(400).json({
//         //         msg: "Year is missing for the target to be added",
//         //         status: 400,
//         //     })
//         // }

//         if (action == "add" && status == "target" && year) {
//             // console.log('year',year)
//             const productBT = await productModel.findOne({
//                 where: { product_id: product_id, year: year, status: "publish" }
//             })
//             // console.log('bt',productBT)
//             if (productBT) {
//                 return res.status(400).json({
//                     msg: "action is add! please Edit the target dont add other for the same year",
//                     status: 3400,
//                 })
//             }
//         }

//         if (!newStatus) {
//             return res.status(400).json({
//                 msg: "Save or Publish ? No Status sent",
//                 status: 400
//             })
//         }

//         if (!product || !(productTreeStructure.p_id == product?.product_id)) {
//             return res.status(400).json({
//                 msg: "Product data sent is not same as product id data",
//                 status: 400
//             })
//         }

//         delete product['name'];

//         if (!subProduct?.length == subproductTreeStructure.length) {
//             return res.status(400).json({
//                 msg: "Not all Subproducts data is sent",
//                 status: 400
//             })
//         }

//         if (subProduct?.length > 0) {
//             delete subProduct['name'];
//         }

//         if (!channelTreeStructure.length == channels?.length) {
//             return res.status(400).json({
//                 msg: "Not all Channel data is sent",
//                 status: 400
//             })
//         }

//         if (channels?.length > 0) {
//             delete channels['name'];
//         }
//         // TODO:This info we will not get while adding
//         //  receivedVersion, receivedStatus;
//         // if (action == "edit") {
//         var receivedVersion = product['version'];
//         var receivedStatus = product['status'];
//         // }

//         // TODO:This info we will not get while adding
//         var newVersion;
//         if (action == "edit") {
//             newVersion = receivedVersion
//         }
//         else if (action == "add") {
//             newVersion = 1
//         }

//         if (newStatus == "publish" && status !== "actual") {
//             const latestProductVersion = await productModel.max('version', {
//                 where: {
//                     product_id: product_id,
//                     year: year,
//                 },
//             });

//             // Fetch all rows with the latest version for the product business targets or actuals
//             var productTarget = await productModel.findOne({
//                 where: {
//                     product_id: product_id,
//                     year: year,
//                     version: latestProductVersion,
//                     status: "publish"
//                 }
//             });

//             if (productTarget) {
//                 return res.status(400).json({
//                     msg: `publish status for version ${receivedVersion} already exists`,
//                     status: 400,
//                 })
//             }
//         }

//         if (action == "add" && status == "actual") {
//             const latestProductVersion = await productModel.max('version', {
//                 where: {
//                     product_id: product_id,
//                     year: year,
//                 },
//             });

//             if (newStatus === "publish") {
//                 newVersion = latestProductVersion + 1;
//             }
//             else if (newStatus === "save") {
//                 newVersion = latestProductVersion;
//             }
//         }


//         // TODO:This info we will not get while adding
//         if (receivedStatus == "publish" && action == "edit") {
//             newVersion = receivedVersion + 1;
//         }

//         const productRecordInsertFormat = {
//             ...product,
//             userId: username,
//             status: newStatus,
//             year: year,
//             version: newVersion,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         }
//         console.log('pr', productRecordInsertFormat)
//         monthConversionToJson(productRecordInsertFormat)
//         console.log('pr', productRecordInsertFormat)

//         var channelRecordsFormat = [];
//         var subProductRecordsFormat = [];

//         if (subProduct?.length > 0) {
//             subProductRecordsFormat = subProduct.map((sp) => {
//                 if (sp.channels?.length > 0) {
//                     sp.channels = sp.channels.map(c => {
//                         delete c['name'];
//                         monthConversionToJson(c)
//                         return {
//                             ...c,
//                             userId: username,
//                             status: newStatus,
//                             year: year,
//                             version: newVersion,
//                             createdAt: new Date(),
//                             updatedAt: new Date(),
//                         }
//                     })
//                     channelRecordsFormat = [...channelRecordsFormat, ...sp.channels];
//                 }
//                 delete sp['channels'];
//                 delete sp['name'];
//                 monthConversionToJson(sp)
//                 return {
//                     ...sp,
//                     userId: username,
//                     status: newStatus,
//                     year: year,
//                     version: newVersion,
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                 }
//             })
//         }
//         else if (!subProduct && channels?.length > 0) {
//             channelRecordsFormat = channels.map(c => {
//                 delete c['name'];
//                 monthConversionToJson(c)
//                 return {
//                     ...c,
//                     userId: username,
//                     status: newStatus,
//                     year: year,
//                     version: newVersion,
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                 }
//             })
//             // console.log('chrf',channelRecordsFormat)
//         }

//         // Creating the records
//         if (status == "target") {
//             await ProductBusinessTarget.create(productRecordInsertFormat)
//             await SubProductBusinessTarget.bulkCreate(subProductRecordsFormat)
//             await ChannelBusinessTarget.bulkCreate(channelRecordsFormat)
//         }
//         else if (status == "actual") {
//             await ProductActuals.create(productRecordInsertFormat)
//             await SubProductActuals.bulkCreate(subProductRecordsFormat)
//             await ChannelActuals.bulkCreate(channelRecordsFormat)
//         }

//         return res.status(200).json({
//             msg: 'sucess',
//             status: 200,
//             productRecordInsertFormat,
//             subProductRecordsFormat,
//             channelRecordsFormat
//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ error: 'Internal server error', status: 500 });
//     }
// }));




module.exports = router;
