const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const authenticatedPolicy = require('../middlewares/Authentication');
const PermissionPolicy = require('../middlewares/Permission')
const Product = require('../../db/models/Product');

// Get All Products 
router.get('/', authenticatedPolicy(), PermissionPolicy(['READ_P_SP_C']), asyncHandler(async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['name', 'p_id']
    });

    const productnames = products.map(product => ({
      p_id: product.p_id,
      name: product.name
    }));

    res.json({
      data:productnames,
      status:200
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
}));


// Create a new product
router.post('/add', authenticatedPolicy(), PermissionPolicy(['CREATE_P_SP_C']), asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        msg: "No Name sent",
        status: 400
      })
    }

    // Check if the product already exists
    const productRecord = await Product.findOne({ where: { name } });
    if (productRecord) {
      return res.status(400).json({ msg: 'Product already exists', status: 400 });
    }

    // Create the product
    const product = await Product.create({
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ data: product, status: 201 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, msg: 'Internal server error' });
  }
}));


// Update the product name by ID
router.put('/edit/:p_id', authenticatedPolicy(), PermissionPolicy(['UPDATE_P_SP_C']), asyncHandler(async (req, res) => {
  try {
    const { p_id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        msg: "No New Name of the product sent",
        status: 400
      })
    }

    // Find the product by ID
    const product = await Product.findByPk(p_id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found', status: 404 });
    }

    // if(product.name == name){
    //   return res.status(400).json({
    //     msg:"Product Name is same as updated product name",
    //     status:400
    //   })
    // }

    // Update the product name
    product.name = name;
    product.updatedAt = new Date();
    await product.save();

    res.status(200).json({ 
      status: 200, 
      msg: 'Product name edited successfully' ,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, msg: 'Internal server error' });
  }
}));

module.exports = router;
