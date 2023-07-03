const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

// Importing Models required
const User = require('./User');
const SubProduct = require('./SubProduct')

const SubProductBusinessTarget = sequelize.define('SubProductBusinessTarget', {
    target_month_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'username'
        }
    },
    subProduct_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SubProduct,
            key: 'sp_id'
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

module.exports = SubProductBusinessTarget;
