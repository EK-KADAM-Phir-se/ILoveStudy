
const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const verifyToken = require('../config/authMiddleware');

// Lock down both endpoints behind our secure token check middleware
router.post('/save-answer', verifyToken, testController.saveAnswerToCache);
router.get('/snapshot/:shiftId', verifyToken, testController.getTestSnapshot);
router.post('/submit', verifyToken, testController.submitTest);
router.post('/generate', verifyToken, testController.generateTest);
router.get('/review/:attemptId', verifyToken, testController.getAttemptReview);

module.exports = router;