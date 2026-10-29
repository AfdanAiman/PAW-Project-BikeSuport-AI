const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');
const ProductController = require('../controllers/productController');

// Route API Status
router.get('/status', ApiController.getStatus);

// Route API Produk
router.get('/produk', ProductController.getApiProducts);

module.exports = router;