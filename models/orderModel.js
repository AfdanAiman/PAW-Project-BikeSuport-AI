const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    buyerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    buyerPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    totalPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending' // Pilihan: Pending, Dikonfirmasi, Diproses, Selesai
    }
}, {
    tableName: 'orders',
    timestamps: true
});

module.exports = Order;