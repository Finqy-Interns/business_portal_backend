const express = require('express');
const ExcelJS = require('exceljs');
const fetchData = require('../utils/fetchData');
const asyncHandler = require('express-async-handler');
const Product = require('../../db/models/Product');
const router = express.Router();
const multer = require('multer');


const upload = multer();


const authenticatedPolicy = require('../middlewares/Authentication')
const permissionPolicy = require('../middlewares/Permission')
//const app = express();

router.put('/excel/:product_id/:year', authenticatedPolicy(), permissionPolicy(['CREATE_BUSINESS_TARGET', 'CREATE_NUMBERS']), upload.single('file'), asyncHandler(async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        const { product_id, year } = req.params;
        const buffer = req.file.buffer;
        await workbook.xlsx.load(buffer);
        // await workbook.xlsx.readFile('./api/commonController/Insurance.xlsx');

        const data = {};
        var productName;
        workbook.eachSheet((worksheet) => {
            const columnCount = worksheet.columns.length;
            const rowCount = worksheet.rowCount;
            const worksheetName = worksheet.name;
            var sheetDataObject = {
                'Product': {
                    incrementCount: 6,
                    number: 1,
                    startRow: 1,
                },
                'Subproducts': {
                    incrementCount: 8,
                    number: Math.ceil(rowCount / 8),
                    startRow: 2,
                },
                'Channels': {
                    incrementCount: 8,
                    number: Math.ceil(rowCount / 8),
                    startRow: 2,
                }
            };

            var sheetData = {};
            const rowHeaders = ['count', 'volume', 'payIn', 'payOut', 'retention'];
            var rowHeaderCount = 0;
            var startRow = sheetDataObject[worksheetName]['startRow'];
            for (var i = 0; i < sheetDataObject[worksheetName]['number']; i++) {
                const name = worksheet.getCell(startRow, 1).value;
                if (worksheetName === "Product") {
                    productName = name;
                }
                sheetData[name] = {};
                for (let col = 2; col <= columnCount; col++) {
                    const month = worksheet.getCell(startRow, col).value;
                    sheetData[name][month] = {};
                    for (var j = startRow + 1; j <= startRow + 5; j++) {
                        const rowHeaderName = rowHeaders[rowHeaderCount];
                        // console.log(worksheet.getCell(j, col).value)
                        if (worksheet.getCell(j, col).value?.result) {
                            sheetData[name][month][rowHeaderName] = worksheet.getCell(j, col).value?.result.toString();
                        } else if (worksheet.getCell(j, col).value) {
                            if (typeof worksheet.getCell(j, col).value === 'object') {
                                sheetData[name][month][rowHeaderName] = "0";
                            }
                            else {
                                sheetData[name][month][rowHeaderName] = worksheet.getCell(j, col).value.toString();
                            }
                        } else {
                            sheetData[name][month][rowHeaderName] = "0";
                        }
                        rowHeaderCount += 1;
                    }
                    rowHeaderCount = 0;
                }
                startRow += sheetDataObject[worksheetName]['incrementCount'];
            }
            data[worksheet.name] = sheetData;
        });
        // console.log('data', data)
        const productRecord = await Product.findOne({
            where: { name: productName },
            attributes: ['p_id']
        });

        if (!productRecord) {
            return res.status(400).json({
                msg: "Product Name not right in the excel sheet",
                status: 400,
            });
        }

        // const productId = productRecord.dataValues?.p_id;
        var hierarchyObject = await fetchData(product_id, year, () => { });
        // console.log(productRecord)
        if (hierarchyObject) {
            var finalDataObject = {};
            // console.log(data['Product'])
            finalDataObject['product'] = {
                product_id: Number(product_id),
                name: productName,
                ...data['Product'][productName]
            };

            // console.log('data',data)
            // return res.status(200).json(data)
            // console.log('hb', JSON.stringify(finalDataObject.product['april']['volume']))
            if (hierarchyObject.subproducts == 0 && hierarchyObject.channels == 0) {
                // console.log('asdas')
                return res.status(200).json({
                    msg: "successful",
                    data: finalDataObject,
                });
            }
            else if (hierarchyObject.subproducts.length == 0 && hierarchyObject.channels.length > 0) {
                var channels = {};
                channels = hierarchyObject.channels.map(c => {
                    return {
                        channel_id: c.c_id,
                        name: c.c_name,
                        ...data['Channels'][c.c_name]
                    };
                });
                finalDataObject = {
                    ...finalDataObject,
                    channels: channels,
                };
                return res.status(200).json({
                    msg: "successful",
                    data: finalDataObject
                });
            }
            else {
                var dataChannelNameArray;
                if (data?.Channels) {
                    dataChannelNameArray = Object.keys(data.Channels);
                }
                var subProducts = hierarchyObject.subproducts.map(sp => {
                    if (sp.channels.length > 0) {
                        var channels = sp.channels;
                        channels = channels.map(c => {
                            if (dataChannelNameArray?.includes(c.c_name)) {
                                return {
                                    channel_id: c.c_id,
                                    name: c.c_name,
                                    ...data.Channels[c.c_name]
                                };
                            }
                        });
                        return {
                            subProduct_id: sp.sp_id,
                            name: sp.sp_name,
                            ...data['Subproducts'][sp.sp_name],
                            channels: channels,
                        };
                    }
                    else {
                        return {
                            subProduct_id: sp.sp_id,
                            name: sp.sp_name,
                            ...data['Subproducts'][sp.sp_name],
                            channels: [],
                        };
                    }
                });
                finalDataObject = {
                    ...finalDataObject,
                    subProduct: subProducts
                };
                return res.status(200).json({
                    msg: "successful",
                    data: finalDataObject
                });
            }
            // else if (hierarchyObject.subproducts?.length > 0 && hierarchyObject.channels.length == 0) {
            //     var subproduct = {};
            //     subproduct = hierarchyObject.subproducts.map(sp => {
            //         return {
            //             subProduct_id: sp.sp_id,
            //             name:sp.sp_name,
            //             channels:[],
            //             ...data['Subproducts'][sp.sp_name]
            //         };
            //     });
            //     finalDataObject = {
            //         ...finalDataObject,
            //         subProduct: subproduct,
            //     };
            //     return res.status(200).json({
            //         msg: "successful",
            //         data: finalDataObject
            //     });
            // }  
        }
    } catch (error) {
        console.log('An error occurred:', error);
        res.status(500).json({
            msg: 'Internal server error',
            status: 500,
        });
    }
}));


module.exports = router;