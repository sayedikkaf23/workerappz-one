/* routes/authRoutes.js */
const express = require("express");
const router = express.Router();
const admin = require("../controller/adminController");

// Public Routes
router.post("/register", admin.register); // Admin registration
router.post("/login", admin.login);       // Admin login

// MFA Routes (Protected)
router.post("/mfa/enable", admin.enableMFA); // Generate QR & enable MFA
router.post("/mfa/verify", admin.verifyMFA); 


router.get("/roles/details/:id", admin.getRoleById);
router.put("/roles/update/:id", admin.updateRole);
router.delete("/roles/remove/:id", admin.deleteRole);

router.get("/admins", admin.getAllAdmins);
router.get("/admins/:id", admin.getAdminById);
router.post("/roles/create", admin.createRole);   // ✅ Create or update role by role_name



module.exports = router;
