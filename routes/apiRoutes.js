const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');

// Route API Status
router.get('/status', ApiController.getStatus);

// Route API Produk (Ubah ke ApiController.getProduk)
router.get('/produk', ApiController.getProduk);

module.exports = router;