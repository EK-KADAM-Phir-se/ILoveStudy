const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Route for PDF upload to Utho server (/var/www/ilovestudy/uploads/test-pdfs/)
router.post('/pdf', uploadController.uploadPdf);

// Route for Image upload to Utho server (/var/www/ilovestudy/uploads/QuestionBank/)
router.post('/image', uploadController.uploadImage);

module.exports = router;
