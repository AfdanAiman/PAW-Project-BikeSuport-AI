const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');

// Route API Status
router.get('/status', ApiController.getStatus);

// Route CRUD API Produk
router.get('/produk', ApiController.getProduk);
router.get('/produk/:id', ApiController.getProdukById);
router.post('/produk', ApiController.createProduk);
router.put('/produk/:id', ApiController.updateProduk);
router.delete('/produk/:id', ApiController.deleteProduk);

module.exports = router;