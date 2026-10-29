const ProductModel = require('../models/productModel');
const { formatRupiah } = require('../utils/helpers');

class ProductController {
    // Render Halaman Frontend EJS
    static renderFrontend(req, res) {
        const products = ProductModel.getAll();
        res.render('index', {
            title: 'BikeSupport — Katalog Sparepart & E-Bike',
            products: products,
            formatRupiah: formatRupiah
        });
    }

    // Endpoint API /api/produk
    static getApiProducts(req, res) {
        const products = ProductModel.getAll();
        res.json({
            status: "success",
            statusCode: 200,
            message: "Data produk berhasil diambil dari server BikeSupport",
            count: products.length,
            data: products
        });
    }
}

module.exports = ProductController;