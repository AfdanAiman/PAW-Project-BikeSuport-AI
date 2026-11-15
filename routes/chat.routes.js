// routes/chat.routes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const validateChatInput = require('../middlewares/validateChatInput');
 
// POST /api/chat  (jika dipasang dengan app.use('/api/chat', ...) ganti '/' ini)
router.post('/', validateChatInput, chatController.chat);
 
module.exports = router;