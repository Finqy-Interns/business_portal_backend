const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const authenticatedPolicy = require('../middlewares/Authentication');
const permissionPolicy = require('../middlewares/Permission')
const Channel = require('../../db/models/Channel');

// Get All Channels
router.get('/', authenticatedPolicy(), permissionPolicy(['READ_P_SP_C']), asyncHandler(async (req, res) => {
  try {
    const channels = await Channel.findAll({
      attributes: ['c_name', 'c_id']
    });

    const channelnames = channels.map(channel => ({
      c_id: channel.c_id,
      c_name: channel.c_name
    }));

    res.json({
      data: channelnames,
      status: 200
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error', status: 500 });
  }
}));

// Create a new channel
router.post('/add', authenticatedPolicy(), permissionPolicy(['CREATE_P_SP_C']), asyncHandler(async (req, res) => {
  try {
    const { c_name } = req.body;

    if (!c_name) {
      return res.status(400).json({
        msg: "No Name sent",
        status: 400
      })
    }

    // Check if the product already exists
    const channelExists = await Channel.findOne({ where: { c_name } });
    if (channelExists) {
      return res.status(400).json({ message: 'Channel already exists' });
    }

    // Create the product
    const channel = await Channel.create({
      c_name,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ data: channel, status: 201 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
}));


// Update a channel by ID
router.put('/edit/:c_id', authenticatedPolicy(), permissionPolicy(['UPDATE_P_SP_C']), asyncHandler(async (req, res) => {
  try {
    const { c_id } = req.params;
    const { c_name } = req.body;

    if (!c_name) {
      return res.status(400).json({
        msg: "No Name sent",
        status: 400
      })
    }

    // Find the product by ID
    const channel = await Channel.findByPk(c_id);
    if (!channel) {
      return res.status(404).json({ msg: 'Channel not found', status:404 });
    }

    // Update the product name
    channel.c_name = c_name;
    channel.updatedAt = new Date();
    const updatedChannel = await channel.save();

    res.status(200).json({ msg: 'Channel name edited successfully', status: 200, data:updatedChannel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error', status: 500 });
  }
}));

module.exports = router;