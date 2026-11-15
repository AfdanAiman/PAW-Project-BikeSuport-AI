// middlewares/validateChatInput.js
// Validasi di sisi backend: tidak hanya mengandalkan system prompt.
const { geminiConfig } = require('../config/gemini');
 
const REFUSAL =
  'Maaf, saya hanya dapat membantu informasi seputar produk dan inventori di aplikasi ini. ' +
  'Silakan tanyakan tentang produk, kategori, atau harga.';
 
// Pola prompt injection (Indonesia + Inggris)
const INJECTION_PATTERNS = [
  /(abaikan|lupakan|hiraukan|kesampingkan)\s+(semua\s+)?(instruksi|aturan|perintah|petunjuk)/i,
  /ignore\s+(all\s+|any\s+)?(previous|prior|above|earlier)\s+(instructions?|rules?|prompts?)/i,
  /disregard\s+(all\s+)?(previous|prior|the)?\s*(instructions?|rules?)/i,
  /(system\s*prompt|system\s*instruction|instruksi\s+sistem|prompt\s+sistem)/i,
  /(tampilkan|bocorkan|tunjukkan|reveal|show|print)\s+.*(instruksi|prompt|aturan|rules|instructions)/i,
  /(kamu|anda)\s+(sekarang|kini)\s+(adalah|menjadi)/i,
  /you\s+are\s+now\s+/i,
  /(pura-pura|berpura-pura|act\s+as|pretend\s+to\s+be|roleplay\s+as)/i,
  /(developer|dev|god|jailbreak|dan)\s*mode/i,
  /\bjailbreak\b/i,
  /override\s+(your|the)\s+(rules|instructions|system)/i,
];
 
// Permintaan jelas di luar konteks aplikasi
const OFF_TOPIC_PATTERNS = [
  /(buat(kan)?|tulis(kan)?|bikin(kan)?)\s+.{0,20}(kode|program|script|game|aplikasi|website|puisi|cerpen|esai|lagu)/i,
  /(write|create|generate)\s+.{0,20}(code|program|script|game|poem|essay|song)/i,
];
 
function validateChatInput(req, res, next) {
  const message = req.body && req.body.message;
 
  if (typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ success: false, error: 'Pesan tidak boleh kosong.' });
  }
 
  const trimmed = message.trim();
  const max = geminiConfig.maxMessageLength;
  if (trimmed.length > max) {
    return res
      .status(400)
      .json({ success: false, error: `Pesan terlalu panjang (maksimal ${max} karakter).` });
  }
 
  // Hapus karakter kontrol & normalisasi spasi
  const sanitized = trimmed.replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ');
 
  if (
    INJECTION_PATTERNS.some((re) => re.test(sanitized)) ||
    OFF_TOPIC_PATTERNS.some((re) => re.test(sanitized))
  ) {
    // Dijawab langsung tanpa memanggil Gemini (hemat kuota & aman)
    return res.json({ success: true, data: { reply: REFUSAL, blocked: true } });
  }
 
  req.body.message = sanitized;
  next();
}
 
module.exports = validateChatInput;