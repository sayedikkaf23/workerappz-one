const mongoose = require('mongoose');

const creditLimitSchema = new mongoose.Schema({
  limit: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CreditLimit', creditLimitSchema);
