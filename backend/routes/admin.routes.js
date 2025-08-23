/* routes/authRoutes.js */
const express = require("express");
const router = express.Router();
const admin = require("../controller/admin.controller");

router.post("/register", admin.register); // Admin registration
router.post("/login", admin.login); // Admin login

router.post("/mfa/enable", admin.enableMFA); // Generate QR & enable MFA
router.post("/mfa/verify", admin.verifyMFA);


router.post("/roles/create", admin.addRole);
router.get("/roles", admin.getRoles);
router.get("/roles/details/:id", admin.getRoleById);
router.put("/roles/update/:id", admin.updateRole);
router.delete("/roles/remove/:id", admin.deleteRole);

router.get("/admins", admin.getAllAdmins);
router.get("/admins/:id", admin.getAdminById);
router.put("/admin/:id", admin.updateAdmin);
router.delete("/admin/:id", admin.deleteAdmin);


router.get("/getAllIndividualUsers", admin.getAllIndividualUsers);
router.get("/getAllBusinessUsers", admin.getAllBusinessUsers);
router.get("/get-currencies", admin.getAllCurrencies);
router.get("/get-country", admin.getCountryById);

router.post("/add-currency", admin.createCurrency);


// agent
router.get("/getAgentList", admin.getAgentList);
// routes/admin.js
router.patch("/updateAgent", admin.updateAgent);








module.exports = router;
