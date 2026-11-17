const Order = require('../models/orderModel');

// Menampilkan daftar pesanan untuk admin
exports.listOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
        res.render('orders/index', {
            title: 'Kelola Pesanan Masuk — Admin BikeSupport',
            orders
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal memuat data pesanan.');
    }
};

// Proses simpan pesanan baru (bisa dipicu dari tombol/form pemesanan user)
exports.createOrder = async (req, res) => {
    try {
        const { buyerName, buyerPhone, productName, quantity, totalPrice } = req.body;
        await Order.create({ buyerName, buyerPhone, productName, quantity, totalPrice });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal membuat pesanan.');
    }
};

// Mengubah status pesanan (Sesuai Acceptance Criteria US-05: "Dikonfirmasi / Diproses")
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Order.update({ status }, { where: { id } });
        res.redirect('/admin/pesanan');
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal memperbarui status pesanan.');
    }
};

// Menghapus pesanan
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.destroy({ where: { id } });
        res.redirect('/admin/pesanan');
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal menghapus pesanan.');
    }
};