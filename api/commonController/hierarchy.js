// Get all products, subproducts, and channels
const express = require('express');
const router = express.Router();

// Importing Models required
const ProductBusinessTarget = require('../../db/models/ProductBusinessTarget');
const SubProductBusinessTarget = require('../../db/models/SubProductBusinessTarget');
const ChannelBusinessTarget = require('../../db/models/ChannelBusinessTarget');
const ProductActuals = require('../../db/models/ProductActuals');
const { Op } = require('sequelize');
// Importing Utils
const fetchData = require('../utils/fetchData')

// Importing services like checking for Authentication and Permission
const authenticatedPolicy = require('../middlewares/Authentication');
const UserProduct = require('../../db/models/UserProduct');
const permissionPolicy = require('../middlewares/Permission');
const asyncHandler = require('express-async-handler');
const { latestRecords } = require('../utils/getLatestBTAndActuals');
const SubProductActuals = require('../../db/models/SubProductActuals');
const ChannelActuals = require('../../db/models/ChannlelActuals');
/* 
API is used to fetch all product,subproduct and channel for current financial Year

input: none;

output: Hierarchy of the Product, SubProduct and Channels

This can be done directly by executing a single query using sequelize (Present in Fetch Products Function)

*/

router.get('/', authenticatedPolicy(), permissionPolicy(['READ_HIERARCHY']), asyncHandler(async (req, res) => {

  try {
    console.log("hellow");

    const { username } = req.user;

    const userProductRecords = await UserProduct.findAll({
      where: { user_id: username },
      attributes: ['product_id']
    })

    if (userProductRecords.length > 0) {
      const userProductIds = userProductRecords.map(up => {
        return up.dataValues.product_id
      })

      var products = []

      for (var i = 0; i < userProductIds.length; i++) {
        const hierarchy = await fetchData(userProductIds[i], () => { })
        products.push(hierarchy)
      }

      return res.status(200).json({
        data: products,
        status: 200,
      })
    }
    else {
      return res.status(400).json({
        msg: `No Products Found for the user => ${username}`,
        status: 400
      })
    }
  }
  catch (err) {
    console.log('error', err);
    return res.status(500).json({
      msg: "Internal server error occured",
      status: 500
    })
  }

}))


/* 
API is used to fetch business targets for all products subproducts and channels 

input: Product Id;

output: Business targets for product, subproduct and channel attached

Process:
1.Tree structure is fetched from fetchData Function
2. we get all the subproduct ids and channel ids (If there are no subproducts there will be no channels linked to subproduct) that are directly linked to the product
3. Next we get the channel ids that are linked directly to the product if Subproduct does not exists

*/

// router.get('/targetAndActuals/:product_id/:status/:year/:status2/:month', authenticatedPolicy(), permissionPolicy(['READ_BUSINESS_TARGET', 'READ_NUMBERS']), async (req, res) => {

//   try {

//     const { product_id, status, year, status2, month } = req.params

//     if (status2 !== 'save' && status2 !== "publish") {
//       return res.status(400).json({
//         msg: "save or publish",
//         status: 400,
//       })
//     }

//     const { username, role } = req.user;

//     const monthArray = ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march']

//     // console.log('asdasd',monthArray.includes(month))

//     if (month !== "all" && !monthArray.includes(month)) {
//       return res.status(400).json({
//         msg: "month can be 'all' or name of month in small case",
//         status: 400,
//       })
//     }

//     var productModel;
//     var subProductModel;
//     var channelModel;

//     if (status == "actual") {
//       productModel = ProductActuals;
//       subProductModel = subProductActuals;
//       channelModel = channelActuals;
//     }
//     else if (status == "target") {
//       productModel = ProductBusinessTarget;
//       subProductModel = SubProductBusinessTarget;
//       channelModel = ChannelBusinessTarget;
//     }
//     // query to fetch the product's subproduct or channels 
//     var treeStructure = await fetchData(product_id, () => { })

//     // console.log('treesr',JSON.stringify(treeStructure))

//     if (!treeStructure) {
//       return res.status(400).json({
//         msg: "No Product Hierarchy Found with the Id",
//         status: 400,
//       })
//     }

//     // The Sub Product Ids which are linked to products
//     const spIds = treeStructure['subproducts'].map(subproduct => {
//       return { id: subproduct.sp_id, name: subproduct.sp_name }
//     });

//     // The channel ids which are directly linked to product 
//     var allChannelIds = [];

//     // If there are no subproducts then only channels will be checked under products
//     if (spIds.length == 0) {
//       allChannelIds = treeStructure['channels'].map(channel => {
//         return { id: channel.c_id, name: channel.c_name }
//       });
//     }

//     const subProductChannels = {};

//     // The Channel ids which are linked to subproduct and the subproduct is linked to current product
//     treeStructure['subproducts'].map((subproduct) => {
//       if (subproduct['channels'].length > 0) {
//         const channels = subproduct['channels'];
//         var subProductId = subproduct.sp_id;
//         const array = [];
//         channels.map((channel) => {
//           array.push({
//             id: channel.c_id,
//             name: channel.c_name,
//           });
//           allChannelIds.push({
//             id: channel.c_id,
//             name: channel.c_name,
//           })
//         })
//         subProductChannels[subProductId] = array
//       }
//     })

//     var productTarget, subProductTarget, channelTargets;

//     try {
//       [productTarget, subProductTarget, channelTargets] = await latestRecords({
//         productModel,
//         subProductModel,
//         channelModel,
//         product_id,
//         year,
//         treeStructure,
//         spIds,
//         allChannelIds,
//         status,
//         status2,
//         monthArray,
//         month
//       })
//     }
//     catch (err) {
//       console.log('err', err)
//       if (err.message === "No Product Business Target or Actual Found") {
//         return res.status(400).json({
//           msg: "No Product Business Target or Actual Found",
//           status: 3401
//         })
//       }
//     }

//     // Adding channel names in the respective channel Targets that are fetched
//     for (var j = 0; j < channelTargets?.length; j++) {
//       for (var i = 0; i < allChannelIds.length; i++) {
//         if (channelTargets[j].dataValues.channel_id == allChannelIds[i].id) {
//           channelTargets[j].dataValues['name'] = allChannelIds[i].name;
//           break
//         }
//       }
//     }

//     // For All Product, SubProducts and Channel Business Targets fetched, the month data is converting from String to JSON by using JSON.parse

//     // console.log('target',subProductTarget)
//     for (let i = 1; i <= 12; i++) {
//       const column = monthArray[i - 1];
//       if (productTarget.dataValues[column]) {
//         productTarget.dataValues[column] = JSON.parse(productTarget[column]);
//         delete productTarget.dataValues['createdAt'];
//         delete productTarget.dataValues['updatedAt'];
//         delete productTarget.dataValues['target_month_id'];
//         delete productTarget.dataValues['monthlyDataId'];
//         // delete productTarget.dataValues['version'];
//         // delete productTarget.dataValues['status'];
//         delete productTarget.dataValues['userId'];
//       }
//       for (let j = 0; j < subProductTarget?.length; j++) {
//         for (var k = 0; k < spIds.length; k++) {
//           if (subProductTarget[j].dataValues['subProduct_id'] == spIds[k].id) {
//             subProductTarget[j].dataValues['name'] = spIds[k].name;
//             delete subProductTarget[j].dataValues['createdAt'];
//             delete subProductTarget[j].dataValues['updatedAt'];
//             delete subProductTarget[j].dataValues['target_month_id'];
//             delete subProductTarget[j].dataValues['sp_data_id'];
//             // delete subProductTarget[j].dataValues['version'];
//             // delete subProductTarget[j].dataValues['status'];
//             delete subProductTarget[j].dataValues['userId'];

//             break
//           }
//         }
//         var record = subProductTarget[j].dataValues[column];
//         if (record) {
//           subProductTarget[j].dataValues[column] = JSON.parse(record);
//         }
//       }
//       for (let j = 0; j < channelTargets?.length; j++) {
//         var record = channelTargets[j].dataValues[column];
//         if (record) {
//           channelTargets[j].dataValues[column] = JSON.parse(record);
//           delete channelTargets[j].dataValues['createdAt'];
//           delete channelTargets[j].dataValues['updatedAt'];
//           delete channelTargets[j].dataValues['target_month_id'];
//           delete channelTargets[j].dataValues['channel_data_id'];
//           // delete channelTargets[j].dataValues['version'];
//           // delete channelTargets[j].dataValues['status'];
//           delete channelTargets[j].dataValues['userId'];
//         }
//       }
//     }

//     // If there are subproduct channels It will be added under subproduct with property name "channels"
//     for (var k = 0; k < subProductTarget?.length; k++) {
//       var currentSP = subProductTarget[k].dataValues;
//       currentSP['channels'] = [];

//       const id = currentSP.subProduct_id
//       var channelsList = subProductChannels[id.toString()]
//       if (channelsList?.length > 0) {
//         var channelsListIds = channelsList.map(item => item.id);
//         for (var h = 0; h < channelTargets.length; h++) {
//           if (channelsListIds.includes(channelTargets[h].dataValues.channel_id)) {
//             currentSP['channels'].push(channelTargets[h].dataValues)
//           }
//         }
//       }
//       subProductTarget[k] = currentSP;
//     }


//     // This logic is just to filter out the channels which are already given in subproduct. In case there is no subproducts we can get the channels that are linked directly to the product
//     var excludedChannel = Object.values(subProductChannels).flat();

//     var excludedChannelIds = excludedChannel.map(ec => ec.id);

//     var filteredData = []

//     for (var i = 0; i < channelTargets?.length; i++) {
//       const id = channelTargets[i].dataValues.channel_id;
//       if (!excludedChannelIds.includes(id)) {
//         filteredData.push(channelTargets[i])
//       }
//     }

//     // Data Format
//     var finalData = {
//       product: productTarget,
//       subProduct: subProductTarget,
//       channels: filteredData,
//     }

//     // Response JSON
//     return res.status(200).json({
//       data: finalData,
//       status: 200
//     })
//   }
//   catch (err) {
//     console.log('error', err)
//     return res.status(500).json({
//       msg: "Internal Server Error occured",
//       status: 500
//     })
//   }
// });


router.get('/target/:product_id/:year/:status', authenticatedPolicy(), permissionPolicy(['READ_BUSINESS_TARGET']), async (req, res) => {

  try {

    const { product_id, year, status } = req.params

    if (status !== 'save' && status !== "publish") {
      return res.status(400).json({
        msg: "save or publish",
        status: 400,
      })
    }

    const { username, role } = req.user;

    const monthArray = ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march']

    var productModel, subProductModel, channelModel;

    productModel = ProductBusinessTarget;
    subProductModel = SubProductBusinessTarget;
    channelModel = ChannelBusinessTarget;

    // query to fetch the product's subproduct or channels 
    var treeStructure = await fetchData(product_id, () => { })

    // console.log('treesr',JSON.stringify(treeStructure))

    if (!treeStructure) {
      return res.status(400).json({
        msg: "No Product Hierarchy Found with the Id",
        status: 400,
      })
    }

    // The Sub Product Ids which are linked to products
    const spIds = treeStructure['subproducts'].map(subproduct => {
      return { id: subproduct.sp_id, name: subproduct.sp_name }
    });

    // The channel ids which are directly linked to product 
    var allChannelIds = [];

    // If there are no subproducts then only channels will be checked under products
    if (spIds.length == 0) {
      allChannelIds = treeStructure['channels'].map(channel => {
        return { id: channel.c_id, name: channel.c_name }
      });
    }

    const subProductChannels = {};

    // The Channel ids which are linked to subproduct and the subproduct is linked to current product
    treeStructure['subproducts'].map((subproduct) => {
      if (subproduct['channels'].length > 0) {
        const channels = subproduct['channels'];
        var subProductId = subproduct.sp_id;
        const array = [];
        channels.map((channel) => {
          array.push({
            id: channel.c_id,
            name: channel.c_name,
          });
          allChannelIds.push({
            id: channel.c_id,
            name: channel.c_name,
          })
        })
        subProductChannels[subProductId] = array
      }
    })

    var productTarget, subProductTarget, channelTargets;

    try {
      [productTarget, subProductTarget, channelTargets] = await latestRecords({
        productModel,
        subProductModel,
        channelModel,
        product_id,
        year,
        treeStructure,
        spIds,
        allChannelIds,
        status,
      })
    }
    catch (err) {
      console.log('err', err)
      if (err.message === "No Product Business Target or Actual Found") {
        return res.status(400).json({
          msg: "No Product Business Target or Actual Found",
          status: 3401
        })
      }
    }

    // Adding channel names in the respective channel Targets that are fetched
    for (var j = 0; j < channelTargets?.length; j++) {
      for (var i = 0; i < allChannelIds.length; i++) {
        if (channelTargets[j].dataValues.channel_id == allChannelIds[i].id) {
          channelTargets[j].dataValues['name'] = allChannelIds[i].name;
          break
        }
      }
    }

    // For All Product, SubProducts and Channel Business Targets fetched, the month data is converting from String to JSON by using JSON.parse

    // console.log('target',subProductTarget)
    for (let i = 1; i <= 12; i++) {
      const column = monthArray[i - 1];
      if (productTarget?.dataValues[column]) {
        productTarget.dataValues[column] = JSON.parse(productTarget[column]);
        delete productTarget.dataValues['createdAt'];
        delete productTarget.dataValues['updatedAt'];
        delete productTarget.dataValues['target_month_id'];
        // delete productTarget.dataValues['version'];
        // delete productTarget.dataValues['status'];
        delete productTarget.dataValues['userId'];
      }
      for (let j = 0; j < subProductTarget?.length; j++) {
        for (var k = 0; k < spIds.length; k++) {
          if (subProductTarget[j].dataValues['subProduct_id'] == spIds[k].id) {
            subProductTarget[j].dataValues['name'] = spIds[k].name;
            delete subProductTarget[j].dataValues['createdAt'];
            delete subProductTarget[j].dataValues['updatedAt'];
            delete subProductTarget[j].dataValues['target_month_id'];
            // delete subProductTarget[j].dataValues['version'];
            // delete subProductTarget[j].dataValues['status'];
            delete subProductTarget[j].dataValues['userId'];

            break
          }
        }
        var record = subProductTarget[j].dataValues[column];
        if (record) {
          subProductTarget[j].dataValues[column] = JSON.parse(record);
        }
      }
      for (let j = 0; j < channelTargets?.length; j++) {
        var record = channelTargets[j].dataValues[column];
        if (record) {
          channelTargets[j].dataValues[column] = JSON.parse(record);
          delete channelTargets[j].dataValues['createdAt'];
          delete channelTargets[j].dataValues['updatedAt'];
          delete channelTargets[j].dataValues['target_month_id'];
          // delete channelTargets[j].dataValues['version'];
          // delete channelTargets[j].dataValues['status'];
          delete channelTargets[j].dataValues['userId'];
        }
      }
    }

    // If there are subproduct channels It will be added under subproduct with property name "channels"
    for (var k = 0; k < subProductTarget?.length; k++) {
      var currentSP = subProductTarget[k].dataValues;
      currentSP['channels'] = [];

      const id = currentSP.subProduct_id
      var channelsList = subProductChannels[id.toString()]
      if (channelsList?.length > 0) {
        var channelsListIds = channelsList.map(item => item.id);
        for (var h = 0; h < channelTargets.length; h++) {
          if (channelsListIds.includes(channelTargets[h].dataValues.channel_id)) {
            currentSP['channels'].push(channelTargets[h].dataValues)
          }
        }
      }
      subProductTarget[k] = currentSP;
    }


    // This logic is just to filter out the channels which are already given in subproduct. In case there is no subproducts we can get the channels that are linked directly to the product
    var excludedChannel = Object.values(subProductChannels).flat();

    var excludedChannelIds = excludedChannel.map(ec => ec.id);

    var filteredData = []

    for (var i = 0; i < channelTargets?.length; i++) {
      const id = channelTargets[i].dataValues.channel_id;
      if (!excludedChannelIds.includes(id)) {
        filteredData.push(channelTargets[i])
      }
    }

    // Data Format
    var finalData = {
      product: productTarget,
      subProduct: subProductTarget,
      channels: filteredData,
    }

    // Response JSON
    return res.status(200).json({
      data: finalData,
      status: 200
    })
  }
  catch (err) {
    console.log('error', err)
    return res.status(500).json({
      msg: "Internal Server Error occured",
      status: 500
    })
  }
});


router.get('/actual/:product_id/:year/:status/:month', authenticatedPolicy(), permissionPolicy(['READ_NUMBERS']), async (req, res) => {

  try {

    const { product_id, year, status, month } = req.params

    if (status !== 'save' && status !== "publish") {
      return res.status(400).json({
        msg: "save or publish",
        status: 400,
      })
    }


    const monthArray = ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march']

    if (month !== "all" && !monthArray.includes(month)) {
      return res.status(400).json({
        msg: "month can be 'all' or name of month in small case",
        status: 400,
      })
    }

    const { username, role } = req.user;

    productModel = ProductActuals;
    subProductModel = SubProductActuals;
    channelModel = ChannelActuals;

    // query to fetch the product's subproduct or channels 
    var treeStructure = await fetchData(product_id, () => { })

    if (!treeStructure) {
      return res.status(400).json({
        msg: "No Product Hierarchy Found with the Id",
        status: 400,
      })
    }

    // The Sub Product Ids which are linked to products
    const spIds = treeStructure['subproducts'].map(subproduct => {
      return { id: subproduct.sp_id, name: subproduct.sp_name }
    });

    // The channel ids which are directly linked to product 
    var allChannelIds = [];

    // If there are no subproducts then only channels will be checked under products
    if (spIds.length == 0) {
      allChannelIds = treeStructure['channels'].map(channel => {
        return { id: channel.c_id, name: channel.c_name }
      });
    }

    const subProductChannels = {};

    // The Channel ids which are linked to subproduct and the subproduct is linked to current product
    treeStructure['subproducts'].map((subproduct) => {
      if (subproduct['channels'].length > 0) {
        const channels = subproduct['channels'];
        var subProductId = subproduct.sp_id;
        const array = [];
        channels.map((channel) => {
          array.push({
            id: channel.c_id,
            name: channel.c_name,
          });
          allChannelIds.push({
            id: channel.c_id,
            name: channel.c_name,
          })
        })
        subProductChannels[subProductId] = array
      }
    })

    var latestProductVersion;
    var productActuals;
    if (status === "save" && month !== "all") {
      latestProductVersion = await productModel.max('version', {
        where: {
          product_id: product_id,
          year: year,
          [month]: {
            [Op.not]: null
          }
        },
      });

      if (latestProductVersion) {
        productActuals = await productModel.findAll({
          where: {
            product_id: product_id,
            year: year,
            version: latestProductVersion,
            [month]: {
              [Op.not]: null
            }
          },
          order: [['createdAt', 'DESC']],
        })

        var findStatus;
        var filteredRecords = productActuals.filter((record) => record?.dataValues?.status === 'publish');

        if (filteredRecords.length === 0) {
          // If Publish records does not exists take the first record since it has latest createdAt !
          findStatus = "save"
          filteredRecords = productActuals[0]
        }
        else {
          findStatus = "publish"
          filteredRecords = filteredRecords[0]
        }
        // console.log('fr',filteredRecords)
        filteredRecords.dataValues['name'] = treeStructure['product']?.name;
        // query to fetch sub product (only those which are linked to product) business targets
        var subProductActuals;
        if (spIds.length !== 0) {
          subProductActuals = await subProductModel.findAll({
            where: {
              subProduct_id: {
                [Op.in]: spIds.map(spid => spid.id)
              },
              year: year,
              [month]: {
                [Op.not]: null
              },
              version: latestProductVersion,
              status: findStatus
            }
          })
        }
        // console.log('sp', subProductActuals)
        // query to fetch all channel business targets
        var channelActuals;
        // console.log('asd',latestProductVersion)
        if (allChannelIds.length !== 0) {
          // console.log('asdasd',channelModel)
          channelActuals = await channelModel.findAll({
            where: {
              channel_id: {
                [Op.in]: allChannelIds.map(c => c.id)
              },
              year: year,
              [month]: {
                [Op.not]: null
              },
              version: latestProductVersion,
              status: findStatus
            }
          })
        }

        // Adding channel names in the respective channel Targets that are fetched
        for (var j = 0; j < channelActuals?.length; j++) {
          for (var i = 0; i < allChannelIds.length; i++) {
            if (channelActuals[j].dataValues.channel_id == allChannelIds[i].id) {
              channelActuals[j].dataValues['name'] = allChannelIds[i].name;
              break
            }
          }
        }

        // for (let i = 1; i <= 12; i++) {
        // const column = monthArray[i - 1];
        if (filteredRecords?.dataValues[month]) {
          filteredRecords.dataValues[month] = JSON.parse(filteredRecords[month]);
          delete filteredRecords.dataValues['createdAt'];
          delete filteredRecords.dataValues['updatedAt'];
          delete filteredRecords.dataValues['monthlyDataId'];
          // delete filteredRecords.dataValues['version'];
          // delete filteredRecords.dataValues['status'];
          delete filteredRecords.dataValues['userId'];
        }

        for (let j = 0; j < subProductActuals?.length; j++) {
          for (var k = 0; k < spIds.length; k++) {
            if (subProductActuals[j].dataValues['subProduct_id'] == spIds[k].id) {
              subProductActuals[j].dataValues['name'] = spIds[k].name;
              delete subProductActuals[j].dataValues['createdAt'];
              delete subProductActuals[j].dataValues['updatedAt'];
              delete subProductActuals[j].dataValues['sp_data_id'];
              // delete subProductActuals[j].dataValues['version'];
              // delete subProductActuals[j].dataValues['status'];
              delete subProductActuals[j].dataValues['userId'];
              break
            }
          }
          var record = subProductActuals[j].dataValues[month];
          if (record) {
            subProductActuals[j].dataValues[month] = JSON.parse(record);
          }
        }

        for (let j = 0; j < channelActuals?.length; j++) {
          var record = channelActuals[j].dataValues[month];
          if (record) {
            channelActuals[j].dataValues[month] = JSON.parse(record);
            delete channelActuals[j].dataValues['createdAt'];
            delete channelActuals[j].dataValues['updatedAt'];
            delete channelActuals[j].dataValues['channel_data_id'];
            // delete channelActuals[j].dataValues['version'];
            // delete channelActuals[j].dataValues['status'];
            delete channelActuals[j].dataValues['userId'];
          }
        }

        // If there are subproduct channels It will be added under subproduct with property name "channels"
        for (var k = 0; k < subProductActuals?.length; k++) {
          var currentSP = subProductActuals[k].dataValues;
          currentSP['channels'] = [];

          const id = currentSP.subProduct_id
          var channelsList = subProductChannels[id.toString()]
          if (channelsList?.length > 0) {
            var channelsListIds = channelsList.map(item => item.id);
            for (var h = 0; h < channelActuals.length; h++) {
              if (channelsListIds.includes(channelActuals[h].dataValues.channel_id)) {
                currentSP['channels'].push(channelActuals[h].dataValues)
              }
            }
          }
          subProductActuals[k] = currentSP;
        }


        var excludedChannel = Object.values(subProductChannels).flat();

        var excludedChannelIds = excludedChannel.map(ec => ec.id);

        var filteredData = []

        for (var i = 0; i < channelActuals?.length; i++) {
          const id = channelActuals[i].dataValues.channel_id;
          if (!excludedChannelIds.includes(id)) {
            filteredData.push(channelActuals[i])
          }
        }

      }
      return res.status(200).json({
        data: {
          product: filteredRecords || {},
          subProduct: subProductActuals || [],
          channels: filteredData || [],
        },
        status: 200,
      })
    }

    else if (status === "publish" && month === "all") {
      // const productArray = [];
      var finalData = {
        product: {
          product_id,
          year,
        },
        subProduct: [],
        channels: [],
      }
      for (var i = 0; i < monthArray.length; i++) {
        const currentMonth = monthArray[i];
        latestProductVersion = await productModel.max('version', {
          where: {
            product_id: product_id,
            year: year,
            [currentMonth]: {
              [Op.not]: null
            },
            status: "publish"
          },
        });
        // console.log(latestProductVersion)
        if (latestProductVersion) {
          productActuals = await productModel.findAll({
            where: {
              product_id: product_id,
              year: year,
              version: latestProductVersion,
              [currentMonth]: {
                [Op.not]: null
              },
              status: "publish"
            },
            order: [['createdAt', 'DESC']],
          })
          // console.log('pt',latestProductVersion,productActuals)
          var findStatus = 'publish';
          productActuals[0].dataValues['name'] = treeStructure['product']?.name;
          // query to fetch sub product (only those which are linked to product) business targets
          // productArray.push(productActuals[0].dataValues)
          var subProductActuals;
          if (spIds.length !== 0) {
            subProductActuals = await subProductModel.findAll({
              where: {
                subProduct_id: {
                  [Op.in]: spIds.map(spid => spid.id)
                },
                year: year,
                [currentMonth]: {
                  [Op.not]: null
                },
                version: latestProductVersion,
                status: findStatus
              }
            })
          }
          // console.log(subProductActuals)
          // console.log('sp', subProductActuals)
          // query to fetch all channel business targets
          var channelActuals;
          // console.log('asd',latestProductVersion)
          if (allChannelIds.length !== 0) {
            // console.log('asdasd',channelModel)
            channelActuals = await channelModel.findAll({
              where: {
                channel_id: {
                  [Op.in]: allChannelIds.map(c => c.id)
                },
                year: year,
                [currentMonth]: {
                  [Op.not]: null
                },
                version: latestProductVersion,
                status: findStatus
              }
            })
          }
          // Adding channel names in the respective channel Targets that are fetched
          for (var t = 0; t < channelActuals?.length; t++) {
            for (var y = 0; y < allChannelIds.length; y++) {
              if (channelActuals[t].dataValues.channel_id == allChannelIds[y].id) {
                channelActuals[t].dataValues.name = allChannelIds[y].name;
                break
              }
            }
          }
          // console.log('ca', i, channelActuals)
          // for (let i = 1; i <= 12; i++) {
          // const column = monthArray[i - 1];
          if (productActuals[0]?.dataValues[currentMonth]) {
            productActuals[0].dataValues[currentMonth] = JSON.parse(productActuals[0][currentMonth]);
            delete productActuals[0].dataValues['createdAt'];
            delete productActuals[0].dataValues['updatedAt'];
            delete productActuals[0].dataValues['target_month_id'];
            // delete productActuals[0].dataValues['version'];
            // delete productActuals[0].dataValues['status'];
            delete productActuals[0].dataValues['userId'];
          }

          for (let j = 0; j < subProductActuals?.length; j++) {
            for (var k = 0; k < spIds.length; k++) {
              if (subProductActuals[j].dataValues['subProduct_id'] == spIds[k].id) {
                subProductActuals[j].dataValues['name'] = spIds[k].name;
                delete subProductActuals[j].dataValues['createdAt'];
                delete subProductActuals[j].dataValues['updatedAt'];
                delete subProductActuals[j].dataValues['target_month_id'];
                // delete subProductActuals[j].dataValues['version'];
                // delete subProductActuals[j].dataValues['status'];
                delete subProductActuals[j].dataValues['userId'];

                break
              }
            }
            var record = subProductActuals[j].dataValues[currentMonth];
            if (record) {
              subProductActuals[j].dataValues[currentMonth] = JSON.parse(record);
            }
          }


          for (let j = 0; j < channelActuals?.length; j++) {
            var record = channelActuals[j].dataValues[currentMonth];
            if (record) {
              channelActuals[j].dataValues[currentMonth] = JSON.parse(record);
              delete channelActuals[j].dataValues['createdAt'];
              delete channelActuals[j].dataValues['updatedAt'];
              delete channelActuals[j].dataValues['target_month_id'];
              // delete channelActuals[j].dataValues['version'];
              // delete channelActuals[j].dataValues['status'];
              delete channelActuals[j].dataValues['userId'];
            }
          }

          // If there are subproduct channels It will be added under subproduct with property name "channels"
          for (var k = 0; k < subProductActuals?.length; k++) {
            var currentSP = subProductActuals[k].dataValues;
            currentSP['channels'] = [];

            const id = currentSP.subProduct_id
            var channelsList = subProductChannels[id.toString()]
            if (channelsList?.length > 0) {
              var channelsListIds = channelsList.map(item => item.id);
              for (var h = 0; h < channelActuals.length; h++) {
                if (channelsListIds.includes(channelActuals[h].dataValues.channel_id)) {
                  currentSP['channels'].push(channelActuals[h].dataValues)
                }
              }
            }
            subProductActuals[k] = currentSP;
          }

          var excludedChannel = Object.values(subProductChannels).flat();

          var excludedChannelIds = excludedChannel.map(ec => ec.id);

          var filteredData = []
          // console.log('channelActuals')
          for (var h = 0; h < channelActuals?.length; h++) {
            const id = channelActuals[h].dataValues.channel_id;
            if (!excludedChannelIds.includes(id)) {
              filteredData.push(channelActuals[h].dataValues)
            }
          }

          finalData = {
            product: {
              ...finalData.product,
              [currentMonth]: productActuals[0].dataValues[`${currentMonth}`]
            },
            subProduct: subProductActuals?.map((spa, index) => {
              return {
                ...finalData.subProduct[index],
                channels: spa['channels'],
                name: spa['name'],
                subProduct_id: spa.subProduct_id,
                year: spa.year,
                [currentMonth]: spa[currentMonth],

              }
            }),
            channels: filteredData.map((ca, index) => {
              return {
                ...finalData.channels[index],
                channel_id: ca.channel_id,
                name: ca.name,
                year: ca.year,
                [currentMonth]: ca[currentMonth]
              }
            })
          }
        }
      }
      // console.log('coming here')
      return res.status(200).json({
        data: finalData,
        status: 200,
      })
    }


    //   // For All Product, SubProducts and Channel Business Targets fetched, the month data is converting from String to JSON by using JSON.parse


    //   // This logic is just to filter out the channels which are already given in subproduct. In case there is no subproducts we can get the channels that are linked directly to the product
    //   var excludedChannel = Object.values(subProductChannels).flat();


  }
  catch (err) {
    console.log('error', err)
    return res.status(500).json({
      msg: "Internal Server Error occured",
      status: 500
    })
  }
});

module.exports = router;
