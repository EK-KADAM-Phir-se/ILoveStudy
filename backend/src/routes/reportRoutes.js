const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

// All report routes require authentication
router.post('/', authMiddleware, reportController.createReport);
router.get('/my-reports', authMiddleware, reportController.getUserReports);

// Admin-only endpoints
router.get('/admin', authMiddleware, reportController.getAllReports);
router.patch('/admin/:id', authMiddleware, reportController.updateReportStatus);

module.exports = router;