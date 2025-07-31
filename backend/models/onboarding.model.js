const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  url: String,
}, { _id: false });

const onboardingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
 mobileNumber: {
    number: String,
    internationalNumber: String,
    nationalNumber: String,
    e164Number: String,
    countryCode: String,
    dialCode: String
  },  email: { type: String, unique: true, required: true },
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

    // File uploads
  uploadedTradeLicense: [fileSchema],
  uploadedMoaAoa: [fileSchema],
  uploadedPassport: [fileSchema],
  uploadedNationalId: [fileSchema],
  uploadedResidenceProof: [fileSchema],

  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Onboarding", onboardingSchema);
