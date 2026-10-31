const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Route Halaman Utama
router.get('/', ProductController.index);

// Route Halaman Detail Produk (INI YANG KURANG SEHINGGA ERROR)
router.get('/produk/:id', ProductController.detail);

module.exports = router;