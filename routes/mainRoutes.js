const express = require('express');
const multer = require('multer');
const { handleResume } = require('../controllers/mainController');
const { startConversation, sendMessage } = require('../controllers/assistant');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /resumes route for handling multiple resume uploads
router.post('/resumes', upload.array('resumes'), handleResume);
router.post('/assistant', startConversation);
router.post('/assistant/chat', sendMessage);

module.exports = router;