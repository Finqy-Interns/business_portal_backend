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
const { Op } = require('sequelize')
const ProductActuals = require('../../db/models/ProductActuals');
const SubProductActuals = require('../../db/models/SubProductActuals');
const ChannelActuals = require('../../db/models/ChannlelActuals');

router.put('/target/:product_id/', authenticatedPolicy(), permissionPolicy(['UPDATE_BUSINESS_TARGET', 'UPDATE_NUMBERS']), asyncHandler(async (req, res) => {

    try {

        const { product_id, status, action } = req.params;
        const { username, role } = req.user;
        const { data } = req.body;

        var productModel = ProductBusinessTarget;

        if (!data) {
            return res.status(400).json({
                msg: "No Data Sent to update",
                status: 400,
            })
        }

        const productRecord = await Product.findOne({
            where: {
                p_id: product_id,
            }
        })

        if (!productRecord) {
            return res.status(400).json({
                msg: "No Product found with the Id",
                status: 400,
            })
        }

        


        const { status: newStatus, product, subProduct, channels, year } = data

        if (!year) {
            return res.status(400).json({
                msg: "year is missing",
                status: 400,
            })
        }

        const treeStructure = await fetchData(product_id, year, () => { })

        const productTreeStructure = treeStructure['product'];
        const subproductTreeStructure = treeStructure['subproducts'];
        const channelTreeStructure = treeStructure['channels']

        // console.log('year',year)
        const productBT = await productModel.findOne({
            where: { product_id: product_id, year: year, status: "publish" }
        })
        // console.log('bt',productBT)
        if (productBT) {
            return res.status(400).json({
                msg: "action is add! please Edit the target dont add other for the same year",
                status: 3400,
            })
        }

        if (!newStatus) {
            return res.status(400).json({
                msg: "Save or Publish ? No Status sent",
                status: 400
            })
        }

        if (!product || !(productTreeStructure.p_id == product?.product_id)) {
            return res.status(400).json({
                msg: "Product data sent is not same as product id data",
                status: 400
            })
        }

        delete product['name'];

        if (!subProduct?.length == subproductTreeStructure.length) {
            return res.status(400).json({
                msg: "Not all Subproducts data is sent",
                status: 400
            })
        }

        if (subProduct?.length > 0) {
            delete subProduct['name'];
        }

        if (!channelTreeStructure.length == channels?.length) {
            return res.status(400).json({
                msg: "Not all Channel data is sent",
                status: 400
            })
        }

        if (channels?.length > 0) {
            delete channels['name'];
        }

        if (newStatus == "publish") {
            // Fetch all rows with the latest version for the product business targets or actuals
            var productTarget = await productModel.findOne({
                where: {
                    product_id: product_id,
                    year: year,
                    version: 1,
                    status: "publish"
                }
            });

            if (productTarget) {
                return res.status(400).json({
                    msg: `publish status for version 1 already exists`,
                    status: 400,
                })
            }
        }

        var newVersion = 1

        const productRecordInsertFormat = {
            ...product,
            userId: username,
            status: newStatus,
            year: year,
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        // console.log('pr', productRecordInsertFormat)
        monthConversionToJson(productRecordInsertFormat)
        // console.log('pr', productRecordInsertFormat)

        var channelRecordsFormat = [];
        var subProductRecordsFormat = [];

        if (subProduct?.length > 0) {
            subProductRecordsFormat = subProduct.map((sp) => {
                if (sp.channels?.length > 0) {
                    sp.channels = sp.channels.map(c => {
                        delete c['name'];
                        monthConversionToJson(c)
                        return {
                            ...c,
                            userId: username,
                            status: newStatus,
                            year: year,
                            version: newVersion,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }
                    })
                    channelRecordsFormat = [...channelRecordsFormat, ...sp.channels];
                }
                delete sp['channels'];
                delete sp['name'];
                monthConversionToJson(sp)
                return {
                    ...sp,
                    userId: username,
                    status: newStatus,
                    year: year,
                    version: newVersion,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            })
        }
        else if ((!subProduct || subProduct?.length === 0) && channels?.length > 0) {
            channelRecordsFormat = channels.map(c => {
                delete c['name'];
                monthConversionToJson(c)
                return {
                    ...c,
                    userId: username,
                    status: newStatus,
                    year: year,
                    version: newVersion,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            })
            // console.log('chrf',channelRecordsFormat)
        }

        // Creating the records

        await ProductBusinessTarget.create(productRecordInsertFormat)
        await SubProductBusinessTarget.bulkCreate(subProductRecordsFormat)
        await ChannelBusinessTarget.bulkCreate(channelRecordsFormat)

        return res.status(200).json({
            msg: 'sucess',
            status: 200,
            productRecordInsertFormat,
            subProductRecordsFormat,
            channelRecordsFormat
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error', status: 500 });
    }
}));

router.put('/actual/:product_id/:month', authenticatedPolicy(), permissionPolicy(['UPDATE_BUSINESS_TARGET', 'UPDATE_NUMBERS']), asyncHandler(async (req, res) => {

    try {

        const { product_id, month } = req.params;
        const { username, role } = req.user;
        const { data } = req.body;


        const monthArray = ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march']

        if (month !== "all" && !monthArray.includes(month)) {
            return res.status(400).json({
                msg: "month can be 'all' or name of month in small case",
                status: 400,
            })
        }

        var productModel = ProductActuals;

        if (!data) {
            return res.status(400).json({
                msg: "No Data Sent to update",
                status: 400,
            })
        }

        const productRecord = await Product.findOne({
            where: {
                p_id: product_id,
            }
        })

        if (!productRecord) {
            return res.status(400).json({
                msg: "No Product found with the Id",
                status: 400,
            })
        }

        const treeStructure = await fetchData(product_id, year, () => { })

        const productTreeStructure = treeStructure['product'];
        const subproductTreeStructure = treeStructure['subproducts'];
        const channelTreeStructure = treeStructure['channels']


        const { status: newStatus, product, subProduct, channels, year } = data

        if (!year) {
            return res.status(400).json({
                msg: "year is missing",
                status: 400,
            })
        }

        // console.log('year',year)
        const productActual = await productModel.findOne({
            where: {
                product_id: product_id,
                year: year,
                [month]: {
                    [Op.not]: null
                },
                version: 1,
                status: "publish"
            }
        })

        if (productActual) {
            return res.status(400).json({
                msg: "action is add! please Edit the target dont add other for the same year",
                status: 3400,
            })
        }

        // if (!newStatus) {
        //     return res.status(400).json({
        //         msg: "Save or Publish ? No Status sent",
        //         status: 400
        //     })
        // }

        if (!product || !(productTreeStructure.p_id == product?.product_id)) {
            return res.status(400).json({
                msg: "Product data sent is not same as product id data",
                status: 400
            })
        }

        delete product['name'];

        if (!subProduct?.length == subproductTreeStructure.length) {
            return res.status(400).json({
                msg: "Not all Subproducts data is sent",
                status: 400
            })
        }

        if (subProduct?.length > 0) {
            delete subProduct['name'];
        }

        if (!channelTreeStructure.length == channels?.length) {
            return res.status(400).json({
                msg: "Not all Channel data is sent",
                status: 400
            })
        }

        if (channels?.length > 0) {
            delete channels['name'];
        }

        if (newStatus == "publish") {
            // Fetch all rows with the latest version for the product business targets or actuals
            const productActual = await productModel.findOne({
                where: {
                    product_id: product_id,
                    year: year,
                    version: 1,
                    [month]: {
                        [Op.not]: null
                    },
                    status: "publish"
                }
            });
            if (productActual) {
                return res.status(400).json({
                    msg: `publish status for version 1 and month ${month} already exists `,
                    status: 400,
                })
            }
        }

        var newVersion = 1

        const productRecordInsertFormat = {
            ...product,
            userId: username,
            status: newStatus,
            year: year,
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        // console.log('pr', productRecordInsertFormat)
        monthConversionToJson(productRecordInsertFormat)
        // console.log('pr', productRecordInsertFormat)

        var channelRecordsFormat = [];
        var subProductRecordsFormat = [];

        if (subProduct?.length > 0) {
            subProductRecordsFormat = subProduct.map((sp) => {
                if (sp.channels?.length > 0) {
                    sp.channels = sp.channels.map(c => {
                        delete c['name'];
                        monthConversionToJson(c)
                        return {
                            ...c,
                            userId: username,
                            status: newStatus,
                            year: year,
                            version: newVersion,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }
                    })
                    channelRecordsFormat = [...channelRecordsFormat, ...sp.channels];
                }
                delete sp['channels'];
                delete sp['name'];
                monthConversionToJson(sp)
                return {
                    ...sp,
                    userId: username,
                    status: newStatus,
                    year: year,
                    version: newVersion,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            })
        }
        else if ((!subProduct || subProduct?.length === 0) && channels?.length > 0) {
            channelRecordsFormat = channels.map(c => {
                delete c['name'];
                monthConversionToJson(c)
                return {
                    ...c,
                    userId: username,
                    status: newStatus,
                    year: year,
                    version: newVersion,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            })
            // console.log('chrf',channelRecordsFormat)
        }

        // Creating the records

        await ProductActuals.create(productRecordInsertFormat)
        await SubProductActuals.bulkCreate(subProductRecordsFormat)
        await ChannelActuals.bulkCreate(channelRecordsFormat)

        return res.status(200).json({
            msg: 'sucess',
            status: 200,
            productRecordInsertFormat,
            subProductRecordsFormat,
            channelRecordsFormat
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error', status: 500 });
    }
}));




module.exports = router;
