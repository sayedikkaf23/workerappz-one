const express = require("express");
const router = express.Router();
const controller = require("../controller/onboarding.controller");
const awsController = require("../controller/awsController");

// Step 1 endpoint
router.post("/onboarding", controller.saveOrUpdateOnboardingDetails);

// Step 2 endpoint
router.post("/onboarding/requirements", controller.saveOnboardingRequirements);

router.post('/onboarding/addFiles',  controller.addOrUpdateUploadedFiles);

router.get('/onboarding/getDetails',  controller.getOnboardingByEmail);

// File upload endpoint
router.post('/upload-file',  awsController.uploadFileToS3);

module.exports = router;
