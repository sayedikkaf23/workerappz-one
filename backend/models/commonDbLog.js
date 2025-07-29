const mongoose = require("mongoose");

const commonDbLogSchema = new mongoose.Schema({
  serialNumber: { type: Number, required: true },
  methodName: { type: String, required: true },
  request: { type: Object, required: true },
  response: { type: Object, required: true },
  requestedBy: { type: String, required: true },
  dateTime: { type: Date, default: Date.now }
}, { collection: "onboarding_db_log" }); 

module.exports = mongoose.model("CommonDbLog", commonDbLogSchema);
