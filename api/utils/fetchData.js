const Product = require('../../db/models/Product');
const SubProduct = require('../../db/models/SubProduct');
const Channel = require('../../db/models/Channel');
const Hierarchy = require('../../db/models/Hierarchy');
const getCurrentFY = require('./getCurrentFY');

async function fetchData(productId, callback) {
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    var data = {
      product: {
        p_id: product.p_id,
        name: product.name,
      },
      subproducts: [],
      channels: [],
    }

    var hierarchyRecords = await Hierarchy.findAll({
      where: {
        product_id: productId,
        year: getCurrentFY(),
      },
      include: [
        {
          model: SubProduct,
          attributes: ['sp_id', 'sp_name']
        },
        {
          model: Channel,
          attributes: ['c_id', 'c_name']
        }
      ]
    });

    // removing unnecessary things
    hierarchyRecords = hierarchyRecords.map(hr => {
      delete hr.dataValues.createdAt;
      delete hr.dataValues.updatedAt;
      hr.dataValues.SubProduct = hr.dataValues.SubProduct?.dataValues || null;
      hr.dataValues.Channel = hr.dataValues.Channel?.dataValues || null;
      return { ...hr.dataValues }
    })

    // If only product and channels exists
    if (!hierarchyRecords[0].subProduct_id && hierarchyRecords[0].channel_id) {
      var channels = []
      hierarchyRecords.map(hr => {
        channels.push(hr.Channel)
      })
      data = {
        ...data,
        channels: channels,
      }
    }
    // for two cases
    // 1. If Product and Only subproduct exists
    // 2. If product, subproduct and channels exists
    else if (hierarchyRecords[0].subProduct_id) {
      var sp = [];

      hierarchyRecords.map(record => {
        // For Product subproduct and channels
        if (record.SubProduct && record.Channel) {
          const existingEntry = sp.find(entry => entry.sp_id === record.SubProduct.sp_id);
      
          if (existingEntry) {
            existingEntry.channels.push(record.Channel);
          } else {
            sp.push({
              sp_id: record.SubProduct.sp_id,
              sp_name: record.SubProduct.sp_name,
              channels: [record.Channel]
            });
          }
        }

        // If Product and Only SubProduct
        else if (!record.Channel) {
          sp.push(
            {
              ...record.SubProduct,
              channels: []
            }
          )
        }
      });
      data = {
        ...data,
        subproducts: sp,
      }
    }

    callback(null, data);
    return data;
  } catch (error) {
    if (error.message === 'Product not found') {
      console.log(error);
      callback(new Error('Product not found'), null);
    } else if (error.message === 'Failed to fetch channels') {
      callback(new Error('Failed to fetch channels'), null);
    } else if (error.message === 'Failed to fetch subproducts') {
      callback(new Error('Failed to fetch subproducts'), null);
    } else {
      console.log(error);
      callback(new Error('Failed to fetch product'), null);
    }
  }
};

module.exports = fetchData;
