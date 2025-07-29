const mongoose = require("mongoose");

const onboardingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobileNumber: String,
  email: { type: String, unique: true, required: true },
  nationality: String,
  dob: Date,

  // Step 2 field
  requirements: {
    type: String,
    enum: ["personal", "business", "prepaid", "transfer"],
    default: "personal",
  },

  // Business Details
  companyName: String,
  companyWebsite: String,
  countryOfIncorporation: String,
  natureOfBusiness: String,
  numberOfShareholders: Number,

  // Shareholder details
  shareholders: [
    {
      fullName: String,
      nationality: String,
      dob: Date,
      shareholdingPercentage: Number,
    },
  ],

  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Onboarding", onboardingSchema);
