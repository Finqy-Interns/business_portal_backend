const { Op } = require('sequelize');

module.exports = {
    latestRecords: async ({
        productModel,
        subProductModel,
        channelModel,
        product_id,
        year,
        treeStructure,
        spIds,
        allChannelIds,
        status,
    }) => {
        // query to fetch product business targets
        var latestProductVersion

        if (status == "save") {
            latestProductVersion = await productModel.max('version', {
                where: {
                    product_id: product_id,
                    year: year,
                },
            });

        }
        else if (status == "publish") {
            latestProductVersion = await productModel.max('version', {
                where: {
                    product_id: product_id,
                    year: year,
                    status: "publish",
                },
            });
        }

        // Fetch all rows with the latest version for the product business targets
        var productTarget = await productModel.findAll({
            where: {
                product_id: product_id,
                year: year,
                version: latestProductVersion,
            },
            attributes: Object.keys(productModel.rawAttributes),
            order: [['createdAt', 'DESC']]
        });

        var publishedVersionPresent = false;
        // console.log('pt', productTarget)
        // console.log('pt',productTarget)
        if (productTarget.length > 0) {
            for (var i = 0; i < productTarget.length; i++) {
                if (productTarget[i].dataValues.status == "publish") {
                    publishedVersionPresent = true;
                    productTarget = productTarget[i];
                    break
                }
            }

            if (!publishedVersionPresent) {
                productTarget = productTarget[0];
            }
            // Add Name in the product object
            productTarget.dataValues['name'] = treeStructure['product']?.name;
            // query to fetch sub product (only those which are linked to product) business targets
            var subProductTarget;
            if (spIds.length !== 0) {
                subProductTarget = await subProductModel.findAll({
                    where: {
                        subProduct_id: {
                            [Op.in]: spIds.map(spid => spid.id)
                        },
                        year: year,
                        version: latestProductVersion,
                        status: publishedVersionPresent ? "publish" : "save"
                    },
                    attributes: Object.keys(subProductModel.rawAttributes),
                })
            }
            // console.log('sp', subProductTarget)
            // query to fetch all channel business targets
            var channelTargets;
            // console.log('asd',latestProductVersion)
            if (allChannelIds.length !== 0) {
                // console.log('asdasd',channelModel)
                channelTargets = await channelModel.findAll({
                    where: {
                        channel_id: {
                            [Op.in]: allChannelIds.map(c => c.id)
                        },
                        year: year,
                        version: latestProductVersion,
                        status: publishedVersionPresent ? "publish" : "save"
                    },
                    attributes: Object.keys(channelModel.rawAttributes),
                })
                // console.log('asd',channelTargets)
            }
            // console.log('asdadad',channelTargets)
            return [productTarget, subProductTarget, channelTargets]
        }
        else {
            throw new Error("No Product Business Target or Actual Found")
        }
        // }
    }
}