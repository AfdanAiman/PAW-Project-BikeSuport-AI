// config/gemini.js
// Konfigurasi Google Gemini. API Key HANYA dibaca dari environment variable (.env).
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
 
const apiKey = process.env.GEMINI_API_KEY;
 
if (!apiKey) {
  console.warn('[Gemini] GEMINI_API_KEY belum diisi di file .env — fitur chatbot tidak akan berfungsi.');
}
 
const geminiConfig = {
  model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  maxMessageLength: 500,      // batas panjang pesan pengguna
  maxProductsInContext: 100,  // batas jumlah produk yang dikirim sebagai context
  generation: {
    temperature: 0.3,         // rendah = lebih konsisten & tidak mengarang
    maxOutputTokens: 800,
  },
};
 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
 
module.exports = { ai, geminiConfig };