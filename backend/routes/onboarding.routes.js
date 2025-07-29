const express = require("express");
const router = express.Router();
const controller = require("../controller/onboarding.controller");

// Step 1 endpoint
router.post("/onboarding", controller.saveOrUpdateOnboardingDetails);

// Step 2 endpoint
router.post("/onboarding/requirements", controller.saveOnboardingRequirements);

module.exports = router;
