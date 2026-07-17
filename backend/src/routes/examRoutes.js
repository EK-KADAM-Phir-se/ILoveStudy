const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const protect = require('../middleware/authMiddleware'); // Protect sensitive endpoints!

// 1. Get all exams and their shifts (Public or Protected, depending on your app)
// Let's make it public so users can see what exams are available to choose from.
router.get('/', examController.getExams);

// 2. Get details for a specific shift, including all questions
// This requires a valid JWT because we don't want anyone unauthorized scraping your question bank!
router.get('/shifts/:shiftId', protect, examController.getShiftDetails);

module.exports = router;