const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAdmin } = require('../middlewares/authMiddleware');

// Halaman Manajemen Pesanan (Wajib Login Admin)
router.get('/admin/pesanan', isAdmin, orderController.listOrders);

// Endpoint untuk Menerima Data Formulir Pesanan dari User (Publik / Tanpa Login)
router.post('/admin/pesanan/tambah', orderController.createOrder);

// Ubah Status Pesanan (Wajib Login Admin)
router.post('/admin/pesanan/status/:id', isAdmin, orderController.updateStatus);

// Hapus Pesanan (Wajib Login Admin)
router.post('/admin/pesanan/hapus/:id', isAdmin, orderController.deleteOrder);

module.exports = router;