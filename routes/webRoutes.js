const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Route Halaman Utama (Read All)
router.get('/', ProductController.index);

// Route Halaman Detail Produk (Read Detail)
router.get('/produk/:id', ProductController.detail);

// Route Halaman Form Tambah Produk
router.get('/tambah-produk', ProductController.renderCreateForm);

// Route Proses Simpan Produk Baru (Create)
router.post('/tambah-produk', ProductController.create);

// Route Halaman Form Edit Produk
router.get('/edit-produk/:id', ProductController.renderEditForm);

// Route Proses Simpan Perubahan Produk (Update)
router.post('/edit-produk/:id', ProductController.update);

// Route Proses Hapus Produk (Delete)
router.post('/hapus-produk/:id', ProductController.delete);

module.exports = router;