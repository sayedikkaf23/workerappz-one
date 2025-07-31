const Onboarding = require("../models/onboarding.model");
const transporter = require('../_config/email');
const logOnboardingDb = require("../utils/onboardingLogger");

exports.saveOrUpdateOnboardingDetails = async (req, res) => {
  const {
    email,
    firstName, lastName, mobileNumber, nationality, dob,
    companyName, companyWebsite, countryOfIncorporation,
    natureOfBusiness, numberOfShareholders, shareholders
  } = req.body;

  try {
    let user = await Onboarding.findOne({ email });

    if (user) {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (mobileNumber) user.mobileNumber = mobileNumber;
      if (nationality) user.nationality = nationality;
      if (dob) user.dob = dob;

      // Step 3 fields
      if (companyName) user.companyName = companyName;
      if (companyWebsite) user.companyWebsite = companyWebsite;
      if (countryOfIncorporation) user.countryOfIncorporation = countryOfIncorporation;
      if (natureOfBusiness) user.natureOfBusiness = natureOfBusiness;
      if (numberOfShareholders) user.numberOfShareholders = numberOfShareholders;
      if (shareholders) user.shareholders = shareholders;

      user.updatedAt = Date.now();
      await user.save();
    } else {
      user = new Onboarding({
        email,
        firstName, lastName, mobileNumber, nationality, dob,
        companyName, companyWebsite, countryOfIncorporation,
        natureOfBusiness, numberOfShareholders, shareholders
      });
      await user.save();
    }

    // Log onboarding action
    await logOnboardingDb({
      methodName: "saveOrUpdateOnboardingDetails",
      request: req.body,
      response: { success: true, data: user },
      requestedBy: email
    });

    // Send email notification
    if (email) {
      await transporter.sendMail({
        from: process.env.EMAIL_SENDER,
        to: email,
        cc: process.env.BUSINESS_TEAM_EMAIL,
        subject: "Your Onboarding Details",
        text: `Hello ${firstName || user.firstName || "User"},\n\nYour onboarding details have been successfully saved.\n\nThank you!`,
      });
    }

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);

    // Log error
    await logOnboardingDb({
      methodName: "saveOrUpdateOnboardingDetails",
      request: req.body,
      response: { success: false, error: err.message },
      requestedBy: email || "unknown"
    });

    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.saveOnboardingRequirements = async (req, res) => {
  const { _id, email, requirements } = req.body;

  if (!requirements) {
    return res.status(400).json({ success: false, error: "requirements required" });
  }

  try {
    const query = _id ? { _id } : { email };
    const updated = await Onboarding.findOneAndUpdate(
      query,
      { requirements, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) {
      await logOnboardingDb({
        methodName: "saveOnboardingRequirements",
        request: req.body,
        response: { success: false, error: "Record not found" },
        requestedBy: email || "unknown"
      });

      return res.status(404).json({ success: false, error: "Record not found" });
    }

    // Log success
    await logOnboardingDb({
      methodName: "saveOnboardingRequirements",
      request: req.body,
      response: { success: true, data: updated },
      requestedBy: email || "unknown"
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);

    // Log error
    await logOnboardingDb({
      methodName: "saveOnboardingRequirements",
      request: req.body,
      response: { success: false, error: err.message },
      requestedBy: email || "unknown"
    });

    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.addOrUpdateUploadedFiles = async (req, res) => {
  const { email } = req.body;
  const {
    uploadedTradeLicense,
    uploadedMoaAoa,
    uploadedPassport,
    uploadedNationalId,
    uploadedResidenceProof
  } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  try {
    let user = await Onboarding.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Only update fields provided in request
    if (uploadedTradeLicense) user.uploadedTradeLicense = uploadedTradeLicense;
    if (uploadedMoaAoa) user.uploadedMoaAoa = uploadedMoaAoa;
    if (uploadedPassport) user.uploadedPassport = uploadedPassport;
    if (uploadedNationalId) user.uploadedNationalId = uploadedNationalId;
    if (uploadedResidenceProof) user.uploadedResidenceProof = uploadedResidenceProof;

    user.updatedAt = Date.now();
    await user.save();

    // Log action
    await logOnboardingDb({
      methodName: "addOrUpdateUploadedFiles",
      request: req.body,
      response: { success: true, data: user },
      requestedBy: email
    });

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error("Error updating uploaded files:", err);

    await logOnboardingDb({
      methodName: "addOrUpdateUploadedFiles",
      request: req.body,
      response: { success: false, error: err.message },
      requestedBy: email
    });

    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOnboardingByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const user = await Onboarding.findOne({ email });

     if (!user) {
      const response = { success: false, error: "User not found" };
      await logOnboardingDb({
        methodName: "getOnboardingByEmail",
        request: req.query,
        response,
        requestedBy: email
      });
      return res.status(404).json(response);
    }

    const response = { success: true, data: user };

    // Log success
    await logOnboardingDb({
      methodName: "getOnboardingByEmail",
      request: req.query,
      response,
      requestedBy: email
    });

    return res.json(response);

  } catch (err) {
    console.error('Error fetching onboarding data:', err);

    const response = { success: false, error: err.message };

    // Log error
    await logOnboardingDb({
      methodName: "getOnboardingByEmail",
      request: req.query,
      response,
      requestedBy: email || "unknown"
    });

    return res.status(500).json(response);
  }
};
