const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');

// -------------------------------------------------------------
// Admin Endpoints
// -------------------------------------------------------------

// Organizations management
router.post('/admin/organizations', orgController.createOrganization);
router.get('/admin/organizations', orgController.listOrganizations);

// Test creation & listing
router.post('/admin/tests', orgController.createOrgTest);
router.post('/admin/tests/validate-json', orgController.validateOrgTestJSON);
router.post('/admin/tests/import-json', orgController.importOrgTestFromJSON);
router.post('/admin/tests/:testId/duplicate', orgController.duplicateOrgTest);
router.patch('/admin/tests/:testId/status', orgController.updateOrgTestStatus);
router.get('/admin/tests', orgController.listOrgTests);
router.get('/admin/tests/:testId', orgController.getOrgTestDetails);

// Marks and results export for colleges / schools
router.get('/admin/tests/:testId/results', orgController.getOrgTestResults);
router.get('/admin/tests/:testId/export-csv', orgController.exportOrgTestCSV);

// Admin Whitelist & Access Checking
router.get('/admin/check-access', orgController.checkAdminAccess);
router.get('/admin/admins', orgController.listAdminEmails);
router.post('/admin/admins', orgController.addAdminEmail);
router.delete('/admin/admins/:id', orgController.removeAdminEmail);

// Test Request & PDF Workflow (Organiser & Admin)
router.post('/organiser/requests', orgController.createOrgTestRequest);
router.get('/organiser/requests', orgController.listOrganiserTestRequests);
router.get('/admin/requests', orgController.listAdminTestRequests);
router.delete('/requests/:requestId', orgController.deleteOrgTestRequest);

// -------------------------------------------------------------
// Student Endpoints (Code-based exam access)
// -------------------------------------------------------------

// Code verification before exam
router.post('/student/verify-code', orgController.verifyStudentAccessCode);

// Fetch questions for active examination
router.get('/student/test/:accessCode', orgController.getStudentTestQuestions);

// Submit student test
router.post('/student/submit', orgController.submitStudentTest);

// View student scorecard & solution review
router.get('/student/attempt/:attemptId', orgController.getStudentAttemptResult);

module.exports = router;
