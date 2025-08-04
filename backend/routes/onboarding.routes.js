const express = require("express");
const router = express.Router();
const controller = require("../controller/onboarding.controller");
const awsController = require("../controller/awsController");

// Step 1 endpoint
router.post("/onboarding", controller.saveOrUpdateOnboardingDetails);

router.get('/onboarding/getDetails',  controller.getOnboardingByEmail);


router.get("/onboarding", controller.getOnboardingByEmail);


// Step 2 endpoint
router.post("/onboarding/requirements", controller.saveOnboardingRequirements);

router.post('/onboarding/addFiles',  controller.addOrUpdateUploadedFiles);




// File upload endpoint
router.post('/upload-file',  awsController.uploadFileToS3);

module.exports = router;
