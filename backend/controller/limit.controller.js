const TransactionLimit = require('../models/transactionLimit');
const CreditLimit = require('../models/creditLimit');

// Get Global Transaction Limit
exports.getTransactionLimit = async (req, res) => {
  try {
    const limit = await TransactionLimit.findOne();
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

// Get Global Credit Limit
exports.getCreditLimit = async (req, res) => {
  try {
    const limit = await CreditLimit.findOne();
    res.status(200).json(limit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching credit limit', error: error.message });
  }
};

// Update Global Credit Limit
exports.updateCreditLimit = async (req, res) => {
  try {
    const { limit } = req.body;

    let creditLimit = await CreditLimit.findOne();
    if (creditLimit) {
      creditLimit.limit = limit;
      await creditLimit.save();
    } else {
      creditLimit = new CreditLimit({ limit });
      await creditLimit.save();
    }

    res.status(200).json({ message: 'Credit limit updated successfully', creditLimit });
  } catch (error) {
    res.status(500).json({ message: 'Error updating credit limit', error: error.message });
  }
};
