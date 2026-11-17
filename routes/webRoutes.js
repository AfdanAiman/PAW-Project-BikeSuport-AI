const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { isAdmin } = require('../middleware/authMiddleware');

// Route Halaman Utama (Read All)
router.get('/', ProductController.index);

// Route Halaman Detail Produk (Read Detail)
router.get('/produk/:id', ProductController.detail);

// Route Halaman Form Tambah Produk (DILINDUNGI ADMIN)
router.get('/tambah-produk', isAdmin, ProductController.renderCreateForm);

// Route Proses Simpan Produk Baru (Create - DILINDUNGI ADMIN)
router.post('/tambah-produk', isAdmin, ProductController.create);

// Route Halaman Form Edit Produk (DILINDUNGI ADMIN)
router.get('/edit-produk/:id', isAdmin, ProductController.renderEditForm);

// Route Proses Simpan Perubahan Produk (Update - DILINDUNGI ADMIN)
router.post('/edit-produk/:id', isAdmin, ProductController.update);

// Route Proses Hapus Produk (Delete - DILINDUNGI ADMIN)
router.post('/hapus-produk/:id', isAdmin, ProductController.delete);

module.exports = router;