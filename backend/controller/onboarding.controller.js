const Onboarding = require("../models/onboarding.model");
const transporter = require("../_config/email");
const logOnboardingDb = require("../utils/onboardingLogger");
const BusinessCategory = require('../models/BusinessCategory'); // adjust path if needed

exports.saveOrUpdateOnboardingDetails = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    mobileNumber,
    nationality,
    dob,
    resident,
    working,
    salary,
    Bank,
    Companylicensed,
    Turnover,
    companylocation,
    companyactivity,
    companyname,
    companyWebsite,
    countryOfIncorporation,
    natureOfBusiness,
    numberOfShareholders,
    shareholders,
  } = req.body;

  try {
    // Step 1: Check if the email is being updated
    if (req.body._id) {
      // Fetch the existing user to compare the emails
      const existingUser = await Onboarding.findById(req.body._id);

      // If the email is being changed, check for duplicates
      if (existingUser && existingUser.email !== email) {
        const emailExists = await Onboarding.findOne({ email });
        if (emailExists) {
          return res.status(400).json({
            success: false,
            error:
              "Email already exists. Please use a different email address.",
          });
        }
      }
    } else {
      // Step 2: Check if the user is trying to create a new account with an existing email
      const existingUser = await Onboarding.findOne({ email });
      if (existingUser) {
        // If user already exists, throw an error
        return res.status(400).json({
          success: false,
          error: "Email already exists. Please use a different email address.",
        });
      }
    }
    // Step 1: Check if the email is being updated
    let user = await Onboarding.findOne({ email });

    if (user) {
      // If the user already exists, update the fields
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.mobileNumber = mobileNumber || user.mobileNumber;
      user.nationality = nationality || user.nationality;
      user.dob = dob || user.dob;
      user.resident = resident || user.resident;
      user.working = working || user.working;
      user.salary = salary || user.salary;
      user.Bank = Bank || user.Bank;
      user.companyName = companyname || user.companyName;
      user.companyWebsite = companyWebsite || user.companyWebsite;
      user.countryOfIncorporation =
        countryOfIncorporation || user.countryOfIncorporation;
      user.natureOfBusiness = natureOfBusiness || user.natureOfBusiness;
      user.numberOfShareholders =
        numberOfShareholders || user.numberOfShareholders;
      user.shareholders = shareholders || user.shareholders;
user.personalBank = req.body.personalBank || user.personalBank;

      user.Companylicensed = Companylicensed || user.Companylicensed;
      user.Turnover = Turnover || user.Turnover;
      user.companylocation = companylocation || user.companylocation;
      user.companyactivity = companyactivity || user.companyactivity;

      user.updatedAt = Date.now();
      if (working == "Self Employed") {
        user.salary = " ";
      }
      await user.save();
    } else {
      // If the user does not exist, create a new user
      const formattedDob = new Date(dob).toISOString().split("T")[0];

      user = new Onboarding({
        email,
        firstName,
        lastName,
        mobileNumber,
        nationality,
        personalBank,
        dob: formattedDob,
        resident,
        working,
        salary,
        Bank,
        companyname,
        companyWebsite,
        countryOfIncorporation,
        natureOfBusiness,
        
        numberOfShareholders,
        shareholders,
        Companylicensed,
        Turnover,
        companylocation,
        companyactivity,
      });

      await user.save();
    }

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOnboardingByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required" });
    }

    const user = await Onboarding.findOne({ email });

    if (!user) {
      const response = { success: false, error: "User not found" };
      await logOnboardingDb({
        methodName: "getOnboardingByEmail",
        request: req.query,
        response,
        requestedBy: email,
      });
      return res.status(404).json(response);
    }

    const response = { success: true, data: user };

    // Log success
    await logOnboardingDb({
      methodName: "getOnboardingByEmail",
      request: req.query,
      response,
      requestedBy: email,
    });

    return res.json(response);
  } catch (err) {
    console.error("Error fetching onboarding data:", err);

    const response = { success: false, error: err.message };

    // Log error
    await logOnboardingDb({
      methodName: "getOnboardingByEmail",
      request: req.query,
      response,
      requestedBy: email || "unknown",
    });

    return res.status(500).json(response);
  }
};

exports.saveOnboardingRequirements = async (req, res) => {
  const { _id, email, requirements } = req.body;

  if (!requirements) {
    return res
      .status(400)
      .json({ success: false, error: "requirements required" });
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
        requestedBy: email || "unknown",
      });

      return res
        .status(404)
        .json({ success: false, error: "Record not found" });
    }

    // Log success
    await logOnboardingDb({
      methodName: "saveOnboardingRequirements",
      request: req.body,
      response: { success: true, data: updated },
      requestedBy: email || "unknown",
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);

    // Log error
    await logOnboardingDb({
      methodName: "saveOnboardingRequirements",
      request: req.body,
      response: { success: false, error: err.message },
      requestedBy: email || "unknown",
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
    uploadedResidenceProof,
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
    if (uploadedResidenceProof)
      user.uploadedResidenceProof = uploadedResidenceProof;

    user.updatedAt = Date.now();
    await user.save();

    // Log action
    await logOnboardingDb({
      methodName: "addOrUpdateUploadedFiles",
      request: req.body,
      response: { success: true, data: user },
      requestedBy: email,
    });

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error("Error updating uploaded files:", err);

    await logOnboardingDb({
      methodName: "addOrUpdateUploadedFiles",
      request: req.body,
      response: { success: false, error: err.message },
      requestedBy: email,
    });

    return res.status(500).json({ success: false, error: err.message });
  }

  
};

 exports.getAllBusinessCategories = async (req, res) => {
    try {
      const categories = await BusinessCategory.find({  }); 
  
      res.status(200).json({
        message: `${categories.length} active categories found`,
        data: categories
      });
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ message: 'Server error while fetching categories' });
    }
  };
