const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const protect = require("../middleware/authMiddleware");

router.post("/sync", profileController.syncFirebaseUser);
router.get("/", protect, profileController.getProfile);
router.patch("/", protect, profileController.updateProfile);

module.exports = router;
