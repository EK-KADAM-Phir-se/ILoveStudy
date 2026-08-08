const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const protect = require("../middleware/authMiddleware");

router.post("/sync", profileController.syncFirebaseUser);
router.get("/", protect, profileController.getProfile);
router.patch("/", protect, profileController.updateProfile);
router.get("/attempts", protect, profileController.getTestAttempts);

module.exports = router;
