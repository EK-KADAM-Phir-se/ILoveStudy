const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware'); // Import your new middleware

// Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTPAndLogin);

// Protected Route (Only accessible with a valid JWT!)
router.get('/me', protect, (req, res) => {
  // Because the middleware succeeded, req.user contains the decoded token data!
  res.json({ 
    message: "Welcome to your secure profile dashboard!", 
    user: req.user 
  });
});

module.exports = router;