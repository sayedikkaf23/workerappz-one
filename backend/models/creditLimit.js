// models/creditLimit.js

const mongoose = require('mongoose');

const creditLimitSchema = new mongoose.Schema({
  limit: { type: Number, required: true }
});

module.exports = mongoose.model('CreditLimit', creditLimitSchema);
