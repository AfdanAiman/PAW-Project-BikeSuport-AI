const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Route halaman utama web
router.get('/', ProductController.renderFrontend);

module.exports = router;