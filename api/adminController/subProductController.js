const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const authenticatedPolicy = require('../middlewares/Authentication');
const PermissionPolicy = require('../middlewares/Permission')
const SubProduct = require('../../db/models/SubProduct');

// Get all SubProduct  names
router.get('/', authenticatedPolicy(),PermissionPolicy(['READ_P_SP_C']), asyncHandler(async (req, res) => {
  try {
    const subproducts = await SubProduct.findAll({
      attributes: ['sp_name','sp_id']
    });

    const subproductnames = subproducts.map(subproduct => ({
      sp_id: subproduct.sp_id,
      sp_name: subproduct.sp_name,
    }));

    res.json({
      data:subproductnames,
      status:200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msgd: 'Internal server error' , status:500 });
  }
}));

// Create a new sub product
router.post('/add', authenticatedPolicy(), PermissionPolicy(['CREATE_P_SP_C']),asyncHandler(async (req, res) => {
  try {
    const { sp_name } = req.body;

    if(!sp_name){
      return res.status(400).json({
        msg:"No Name sent for the subproduct",
        status:400,
      })
    }

    // Check if the product already exists
    const subProductRecord = await SubProduct.findOne({ where: { sp_name } });

    if (subProductRecord) {
      return res.status(400).json({ msg: 'SubProduct already exists' });
    }

    // Create the product
    const subproduct = await SubProduct.create({
      sp_name,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({data : subproduct, status:201 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status:500, msg: 'Internal server error' });
  }
}));

// Update a Sub Product by ID
router.put('/edit/:sp_id', authenticatedPolicy(), PermissionPolicy(['UPDATE_P_SP_C']),asyncHandler(async (req, res) => {
    try {
      const { sp_id } = req.params;
      const { sp_name } = req.body;

      if(!sp_name){
        return res.status(400).json({
          msg:"No Name Sent",
          status:400,
        })
      }

      // Find the product by ID
      const subproduct = await SubProduct.findByPk(sp_id);
      if (!subproduct) {
        return res.status(404).json({ msg: 'SubProduct not found' });
      }

      // if(subproduct.name == sp_name){
      //   return res.status(400).json({
      //     msg:"subproduct Name is same as name sent",
      //     status:400
      //   })
      // }

      // Update the product name
      subproduct.sp_name = sp_name;
      subproduct.updatedAt = new Date();
      
      const updatedSPproduct = await subproduct.save();
  
      res.status(200).json({
        msg: 'SubProduct name edited successfully', 
        status:200,
        data: updatedSPproduct 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Internal server error' });
    }
  }));
  


module.exports = router;