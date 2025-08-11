const express = require('express');
const router = express.Router();
const limitController = require('../controller/limit.controller');  

// Global Transaction Limit routes
router.get('/transaction-limit', limitController.getTransactionLimit);        // Get transaction limit
router.put('/transaction-limit', limitController.updateTransactionLimit);    // Update transaction limit

// Global Credit Limit routes
router.get('/credit-limit', limitController.getCreditLimit);                // Get credit limit
router.put('/credit-limit', limitController.updateCreditLimit);             // Update credit limit

module.exports = router;
