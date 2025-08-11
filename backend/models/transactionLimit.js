const mongoose = require('mongoose');

const transactionLimitSchema = new mongoose.Schema({
  cashLimit: { type: Number, required: true },
  bankLimit: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TransactionLimit', transactionLimitSchema);
