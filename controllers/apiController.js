const ProductModel = require('../models/productModel');

class ApiController {
    static getStatus(req, res) {
        res.json({ status: "ok", message: "Server berjalan normal" });
    }

    // 1. GET /api/produk (Read All)
    static async getProduk(req, res) {
        try {
            const products = await ProductModel.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // 2. GET /api/produk/:id (Read Detail)
    static async getProdukById(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Produk tidak ditemukan" });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // 3. POST /api/produk (Create)
    static async createProduk(req, res) {
        try {
            const { name, price, category, description } = req.body;
            const newProduct = await ProductModel.create({
                name,
                price,
                category,
                description
            });
            res.status(201).json({
                message: "Produk berhasil ditambahkan",
                data: newProduct
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // 4. PUT /api/produk/:id (Update)
    static async updateProduk(req, res) {
        try {
            const { name, price, category, description } = req.body;
            const product = await ProductModel.findByPk(req.params.id);
            
            if (!product) {
                return res.status(404).json({ message: "Produk tidak ditemukan" });
            }

            await product.update({
                name,
                price,
                category,
                description
            });

            res.json({
                message: "Produk berhasil diperbarui",
                data: product
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // 5. DELETE /api/produk/:id (Delete)
    static async deleteProduk(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Produk tidak ditemukan" });
            }

            await product.destroy();
            res.json({ message: "Produk berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ApiController;