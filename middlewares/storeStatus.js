// middlewares/storeStatus.js
const { getStatus, setStatus } = require('../services/storeStatus.service');

module.exports = (req, res, next) => {
  // Tangkap query URL untuk mengubah status toko secara instan saat diuji
  if (req.query.toko === 'ditutup') {
    setStatus({ open: false, message: 'Toko ditutup sementara waktu.', reopenAt: 'Besok' });
  } else if (req.query.toko === 'dibuka') {
    setStatus({ open: true, message: '', reopenAt: '' });
  }

  res.locals.store = getStatus();
  const allowed = ['dibuka', 'ditutup', 'pin-salah'];
  res.locals.flash = allowed.includes(req.query.toko) ? req.query.toko : '';
  next();
};