const ProductModel = require('../models/productModel');
const { Op } = require('sequelize');

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

class ProductController {
    // 1. Tampilkan Semua Produk + Fitur Pencarian (Search)
    static async index(req, res) {
        try {
            const searchQuery = req.query.search || '';
            
            let condition = {};
            if (searchQuery) {
                condition = {
                    name: {
                        [Op.iLike]: `%${searchQuery}%` // Mencari nama produk di PostgreSQL (case-insensitive)
                    }
                };
            }

            const products = await ProductModel.findAll({
                where: condition,
                order: [['id', 'ASC']]
            });

            res.render('index', {
                title: 'BikeSupport — Katalog Sparepart & E-Bike',
                products: products,
                searchQuery: searchQuery, // Mengirim keyword ke EJS agar input tidak terkuras
                formatRupiah: formatRupiah
            });
        } catch (error) {
            res.status(500).send("Gagal memuat data produk: " + error.message);
        }
    }

    // 2. Detail Produk
    static async detail(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) return res.status(404).send('Produk tidak ditemukan');

            res.render('detail', {
                title: `${product.name} — BikeSupport`,
                product: product,
                formatRupiah: formatRupiah
            });
        } catch (error) {
            res.status(500).send("Gagal memuat detail produk: " + error.message);
        }
    }

    // 3. Render Form Tambah Produk
    static renderCreateForm(req, res) {
        res.render('create', { title: 'Tambah Produk Baru — BikeSupport' });
    }

    // 4. Proses Tambah Produk (Create)
    static async create(req, res) {
        try {
            const { name, price, category, description } = req.body;
            await ProductModel.create({ name, price, category, description });
            res.redirect('/'); // Kembali ke halaman utama setelah berhasil
        } catch (error) {
            res.status(500).send("Gagal menambah produk: " + error.message);
        }
    }

    // 5. Render Form Edit Produk
    static async renderEditForm(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) return res.status(404).send('Produk tidak ditemukan');

            res.render('edit', {
                title: `Edit ${product.name} — BikeSupport`,
                product: product
            });
        } catch (error) {
            res.status(500).send("Gagal memuat form edit: " + error.message);
        }
    }

    // 6. Proses Update Produk (Update)
    static async update(req, res) {
        try {
            const { name, price, category, description } = req.body;
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) return res.status(404).send('Produk tidak ditemukan');

            await product.update({ name, price, category, description });
            res.redirect('/'); // Kembali ke halaman utama
        } catch (error) {
            res.status(500).send("Gagal memperbarui produk: " + error.message);
        }
    }

    // 7. Proses Hapus Produk (Delete)
    static async delete(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) return res.status(404).send('Produk tidak ditemukan');

            await product.destroy();
            res.redirect('/'); // Kembali ke halaman utama
        } catch (error) {
            res.status(500).send("Gagal menghapus produk: " + error.message);
        }
    }
}

module.exports = ProductController;