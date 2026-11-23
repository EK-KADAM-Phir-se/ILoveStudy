const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

// Public Authentication Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Google Sync (Existing Firebase Integration - Preserved)
router.post('/google-sync', authController.googleSync);

// Protected Route (Verified with JWT)
router.get('/me', protect, (req, res) => {
  res.json({
    message: "Welcome to your secure profile dashboard!",
    user: req.user,
  });
});

module.exports = router;
