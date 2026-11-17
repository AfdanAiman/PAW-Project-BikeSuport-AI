const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { isAdmin } = require('../middlewares/authMiddleware');
const { getStatus, setStatus } = require('../services/storeStatus.service');
 
function pinValid(input) {
  const pin = process.env.STORE_ADMIN_PIN;
  if (!pin) return null; // belum dikonfigurasi
  const a = Buffer.from(String(input || ''));
  const b = Buffer.from(pin);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
 
// Status toko (publik, hanya-baca)
router.get('/api/toko/status', (req, res) => {
  res.json({ success: true, data: getStatus() });
});
 
// Buka / tutup toko (butuh PIN admin)
router.post('/toko/status', (req, res) => {
  const ok = pinValid(req.body.pin);
  if (ok === null) {
    return res.status(500).send('STORE_ADMIN_PIN belum diatur di file .env');
  }
  if (!ok) return res.redirect('/?toko=pin-salah');
 
  const open = req.body.action === 'open';
  setStatus({ open, message: req.body.message, reopenAt: req.body.reopenAt });
  res.redirect('/?toko=' + (open ? 'dibuka' : 'ditutup'));
});
// Jika ada rute untuk mengubah/mengatur status toko, amankan dengan isAdmin:
router.post('/toko/status', isAdmin, storeController.updateStatus); 
// atau rute halaman pengaturan toko:
router.get('/toko/pengaturan', isAdmin, storeController.renderSettings);
 
module.exports = router;