// models/globalLimit.js
const mongoose = require('mongoose');

const globalLimitSchema = new mongoose.Schema({
  id: Number,
  creditLimitInUSD: Number,
  transactionLimitInUSD: Number,
  transactionLimitInUSD_Bank: Number,
  wallet: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GlobalLimit', globalLimitSchema);
