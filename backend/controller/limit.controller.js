const TransactionLimit = require('../models/transactionLimit');
const CreditLimit = require('../models/creditLimit');

// Get Global Transaction Limit
exports.getTransactionLimit = async (req, res) => {
  try {
    const limit = await TransactionLimit.findOne();  // Assumes only one document for limits
    if (!limit) {
      return res.status(404).json({ message: 'Transaction limit not found' });
    }
    res.status(200).json(limit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction limit', error: error.message });
  }
};

// Update Global Transaction Limit
exports.updateTransactionLimit = async (req, res) => {
  try {
    const { cashLimit, bankLimit } = req.body;

    let limit = await TransactionLimit.findOne();
    if (limit) {
      limit.cashLimit = cashLimit;
      limit.bankLimit = bankLimit;
      await limit.save();
    } else {
      limit = new TransactionLimit({ cashLimit, bankLimit });
      await limit.save();
    }

    res.status(200).json({ message: 'Transaction limit updated successfully', limit });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction limit', error: error.message });
  }
};

exports.getCreditLimit = async (req, res) => {
  try {
    const limit = await CreditLimit.findOne(); // Only one document should exist in the collection
    if (!limit) {
      return res.status(404).json({ message: 'Global credit limit not found' });
    }
    res.status(200).json(limit); // Send the limit as response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching credit limit', error: error.message });
  }
};

// Update Global Credit Limit
exports.updateCreditLimit = async (req, res) => {
  try {
    const { limit } = req.body; // Extract the new limit value from the request body

    let creditLimit = await CreditLimit.findOne();
    if (creditLimit) {
      // If a document exists, update it
      creditLimit.limit = limit;
      await creditLimit.save();
    } else {
      // If no document exists, create a new one
      creditLimit = new CreditLimit({ limit });
      await creditLimit.save();
    }

    res.status(200).json({ message: 'Credit limit updated successfully', creditLimit });
  } catch (error) {
    res.status(500).json({ message: 'Error updating credit limit', error: error.message });
  }
};
