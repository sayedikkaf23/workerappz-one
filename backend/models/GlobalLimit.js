// models/globalLimit.js
const mongoose = require('mongoose');

const globalLimitSchema = new mongoose.Schema({
  id: Number,
  creditLimitInUSD: Number,
  transactionLimitInUSD: Number,
  transactionLimitInUSD_Bank: Number,
  wallet: Number,
  source: { type: String, enum: ['get', 'update'] }, // where it came from
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GlobalLimit', globalLimitSchema);
