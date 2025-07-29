// models/onboarding.model.js
const mongoose = require("mongoose");

const onboardingSchema = new mongoose.Schema({
  firstName:    String,
  lastName:     String,
  mobileNumber: String,
  email:        { type: String, unique: true, required: true },
  nationality:  String,
  dob:          Date,

  // Step 2 field
  requirements: {
    type: String,
    enum: ["personal","business","prepaid","transfer"],
    default: "personal"
  },

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Onboarding", onboardingSchema);
