const express = require("express");
const router = express.Router();
const nationalityController = require("../controller/nationality.controller");

router.post("/country-risk", nationalityController.addCountryRisk);
router.get("/country-risk", nationalityController.getAllCountryRisks);
router.put("/country-risk/:id", nationalityController.updateCountryRisk);
router.delete("/country-risk/:id", nationalityController.deleteCountryRisk);

module.exports = router;
