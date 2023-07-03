const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

// Importing Models required
const User = require('./User');
const Channel = require('./Channel')

const ChannelBusinessTarget = sequelize.define('ChannelBusinessTarget', {
    target_month_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    userId: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'username'
        }
    },
    channel_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Channel,
            key: 'c_id'
        }
    },
    version: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        valmonth_idate: {
            isIn: [['save', 'publish']],
        },
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    april: {
        type: DataTypes.STRING,
    },
    may: {
        type: DataTypes.STRING,
    },
    june: {
        type: DataTypes.STRING,
    },
    july: {
        type: DataTypes.STRING,
    },
    august: {
        type: DataTypes.STRING,
    },
    september: {
        type: DataTypes.STRING,
    },
    october: {
        type: DataTypes.STRING,
    },
    november: {
        type: DataTypes.STRING,
    },
    december: {
        type: DataTypes.STRING,
    },
    january: {
        type: DataTypes.STRING,
    },
    february: {
        type: DataTypes.STRING,
    },
    march: {
        type: DataTypes.STRING,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

module.exports = ChannelBusinessTarget;
