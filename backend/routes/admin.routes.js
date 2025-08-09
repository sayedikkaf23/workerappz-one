/* routes/authRoutes.js */
const express = require("express");
const router = express.Router();
const admin = require("../controller/adminController");

// Public Routes
router.post("/register", admin.register); // Admin registration
router.post("/login", admin.login);       // Admin login

// MFA Routes (Protected)
router.post("/mfa/enable", admin.enableMFA); // Generate QR & enable MFA
router.post("/mfa/verify", admin.verifyMFA); // Verify MFA token
router.get("/getAllIndividualUsers", admin.getAllIndividualUsers);
router.get("/getAllBusinessUsers", admin.getAllIndividualUsers);
module.exports = router;
