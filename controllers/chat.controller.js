
const { generateReply } = require('../services/gemini.service');

exports.chat = async (req, res) => {
  try {
    const reply = await generateReply(req.body.message);

    return res.json({
      success: true,
      data: { reply },
    });

  } catch (error) {
    console.error('[Chat] Error:', {
      code: error.code,
      status: error.status,
      message: error.message,
    });

    if (error.code === 'NO_API_KEY') {
      return res.status(500).json({
        success: false,
        error: 'Layanan AI belum dikonfigurasi.',
      });
    }

    if (error.code === 'EMPTY_RESPONSE') {
      return res.status(502).json({
        success: false,
        error: 'AI tidak memberikan jawaban. Silakan coba lagi.',
      });
    }

    if (error.code === 'GEMINI_API_ERROR') {
      if (error.status === 503) {
        return res.status(503).json({
          success: false,
          error: 'Server Gemini sedang sibuk. Silakan coba beberapa saat lagi.',
        });
      }

      if (error.status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Batas penggunaan Gemini tercapai. Periksa kuota API kamu.',
        });
      }

      if ([400, 401, 403].includes(error.status)) {
        return res.status(502).json({
          success: false,
          error: 'Permintaan Gemini gagal. Periksa API Key, model, dan konfigurasi API.',
        });
      }

      return res.status(502).json({
        success: false,
        error: 'Terjadi kesalahan saat menghubungi layanan Gemini.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan internal pada server.',
    });
  }
};
