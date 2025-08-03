/* routes/authRoutes.js */
const express = require("express");
const router  = express.Router();
const admin = require("../controllers/authController");
const authMiddleware = require("../middleware/auth"); // verifies existing JWT

// Public
router.post("/login", admin.login);

// Protected – require valid session/JWT first
router.get ("/mfa/setup",  authMiddleware, admin.mfaSetup);
router.post("/mfa/verify", authMiddleware, admin.mfaVerify);

module.exports = router;
