const ProductModel = require('../models/productModel');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');


// Konfigurasi Penyimpanan Multer untuk File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Pastikan folder public/uploads ada
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Penamaan unik
    }
});
const upload = multer({ storage: storage });

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
                        [Op.iLike]: `%${searchQuery}%`
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
                searchQuery: searchQuery,
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

    // 4. Proses Tambah Produk (Create) - Mendukung Upload Foto
    static create = [
        upload.single('image'),
        async (req, res) => {
            try {
                const { name, price, category, description } = req.body;
                let imagePath = null;

                if (req.file) {
                    imagePath = `/uploads/${req.file.filename}`;
                }

                await ProductModel.create({ 
                    name, 
                    price, 
                    category, 
                    description, 
                    image: imagePath 
                });
                res.redirect('/');
            } catch (error) {
                res.status(500).send("Gagal menambah produk: " + error.message);
            }
        }
    ];

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

    // 6. Proses Update Produk (Update) - Mendukung Upload Foto Baru
    static update = [
        upload.single('image'), // Middleware multer untuk menangkap file input name="image"
        async (req, res) => {
            try {
                const { name, price, category, description } = req.body;
                const product = await ProductModel.findByPk(req.params.id);
                if (!product) return res.status(404).send('Produk tidak ditemukan');

                const updateData = { name, price, category, description };

                // Jika admin mengunggah file foto baru, perbarui path gambarnya
                if (req.file) {
                    updateData.image = `/uploads/${req.file.filename}`;
                }

                await product.update(updateData);
                res.redirect('/');
            } catch (error) {
                res.status(500).send("Gagal memperbarui produk: " + error.message);
            }
        }
    ];

    // 7. Proses Hapus Produk (Delete)
    static async delete(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) return res.status(404).send('Produk tidak ditemukan');

            await product.destroy();
            res.redirect('/');
        } catch (error) {
            res.status(500).send("Gagal menghapus produk: " + error.message);
        }
    }
}

module.exports = ProductController;