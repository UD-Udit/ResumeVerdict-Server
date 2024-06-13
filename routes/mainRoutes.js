const express = require('express');
const multer = require('multer');
const { handleResume } = require('../controllers/mainController');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /resumes route for handling multiple resume uploads
router.post('/resumes', upload.array('resumes'), handleResume);

module.exports = router;
