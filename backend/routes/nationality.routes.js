const express = require('express');
const router = express.Router();
const nationalityController = require('../controller/nationality.controller');

// Add multiple nationalities (seed data)
router.post('/nationalities', nationalityController.addNationalities);

// Get all nationalities
router.get('/nationalities', nationalityController.getNationalities);

// Get all countries
router.get('/countries', nationalityController.getCountries);

module.exports = router;
