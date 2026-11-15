const fs = require('fs');
const path = require('path');
 
const FILE = path.join(__dirname, '..', 'data', 'store-status.json');
 
const defaults = () => ({
  open: process.env.STORE_OPEN !== 'false', // default buka, kecuali STORE_OPEN=false di .env
  message: '',
  reopenAt: '',
  updatedAt: null,
});
 
let state = null;
 
function load() {
  if (state) return state;
  try {
    state = { ...defaults(), ...JSON.parse(fs.readFileSync(FILE, 'utf8')) };
  } catch (e) {
    state = defaults();
  }
  return state;
}
 
function getStatus() {
  return { ...load() };
}
 
function setStatus({ open, message, reopenAt }) {
  const isOpen = !!open;
  state = {
    open: isOpen,
    message: isOpen ? '' : String(message || '').trim().slice(0, 200),
    reopenAt: isOpen ? '' : String(reopenAt || '').trim().slice(0, 20),
    updatedAt: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(state, null, 2));
  return getStatus();
}
 
// Teks ringkas untuk konteks chatbot AI
function getStatusText() {
  const s = getStatus();
  if (s.open) return 'Toko sedang BUKA dan menerima pesanan.';
  return (
    'Toko sedang TUTUP dan TIDAK menerima pesanan.' +
    (s.message ? ` Keterangan: ${s.message}.` : '') +
    (s.reopenAt ? ` Rencana buka kembali: ${s.reopenAt}.` : ' Tanggal buka kembali belum ditentukan.')
  );
}
 
module.exports = { getStatus, setStatus, getStatusText };
 