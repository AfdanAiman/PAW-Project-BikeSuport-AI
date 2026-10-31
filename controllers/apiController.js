const ProductModel = require('../models/productModel');

class ApiController {
    static getStatus(req, res) {
        res.json({ status: "ok", message: "Server berjalan normal" });
    }

    static getProduk(req, res) {
        res.json(ProductModel.getAll());
    }
}

module.exports = ApiController; // PASTIKAN INI ADA