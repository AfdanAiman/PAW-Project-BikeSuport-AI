const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductModel = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // TAMBAHKAN KOLOM IMAGE DI SINI AGAR TERDAFTAR DI DATABASE
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'products',
    timestamps: true // Otomatis membuat createdAt dan updatedAt
});

module.exports = ProductModel;