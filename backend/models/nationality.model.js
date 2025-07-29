const mongoose = require('mongoose');

const nationalitySchema = new mongoose.Schema({
  Label: { type: String, required: true },
  Value: { type: String, required: true },
  Country: { type: String, required: true }
});

module.exports = mongoose.model('Nationality', nationalitySchema);
