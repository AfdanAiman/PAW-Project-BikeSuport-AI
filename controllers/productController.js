const ProductModel = require('../models/productModel');

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

class ProductController {
    static index(req, res) {
        const products = ProductModel.getAll();
        res.render('index', {
            title: 'BikeSupport — Katalog Sparepart & E-Bike',
            products: products,
            formatRupiah: formatRupiah
        });
    }

    static detail(req, res) {
        const productId = req.params.id;
        const product = ProductModel.getById(productId);

        if (!product) {
            return res.status(404).send('Produk tidak ditemukan');
        }

        res.render('detail', {
            title: `${product.name} — BikeSupport`,
            product: product,
            formatRupiah: formatRupiah
        });
    }
}

module.exports = ProductController;