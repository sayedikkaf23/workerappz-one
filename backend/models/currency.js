const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema(
  {
    
    name:{ type: String, required: true },
    code:{ type: String, required: true },// <— role ref
    isActive:  { type: Boolean, default: true }, // <— active/inactive
    auth:  { type: Boolean},
    scale: { type: String, default: false }
  },
  { timestamps: true }
);


module.exports = mongoose.model('Currency', currencySchema);