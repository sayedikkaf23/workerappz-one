const express = require('express');
const router = express.Router();
const limitController = require('../controller/limit.controller');  

// Global Transaction Limit routes
router.post('/transaction-limit', limitController.globalTransactionLimit);    // Update transaction limit
router.post('/credit-limit', limitController.updateCreditLimit); // Update credit limit


router.get('/credit-limit', limitController.getCreditLimit);  // Get current credit limi
router.put('/transaction-limit', limitController.updateTransactionLimit);    // Update transaction limit

module.exports = router;
