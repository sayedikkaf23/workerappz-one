const mongoose = require("mongoose");

const nationalitySchema = new mongoose.Schema({
  country: { type: String, required: true, unique: true },
  RiskRating: { type: Number, required: true },
  Code: { type: String, unique: true },
  iscode3digit: { type: String, unique: true },
  Override: { type: Number },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Nationality", nationalitySchema);
