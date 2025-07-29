// controllers/onboarding.controller.js
const Onboarding = require("../models/onboarding.model");
const transporter = require('../_config/email');

// Step 1: create or update basic details, **return full doc**

exports.saveOrUpdateOnboardingDetails = async (req, res) => {
  const { firstName, lastName, mobileNumber, email, nationality, dob } = req.body;

  try {
    let user = await Onboarding.findOne({ email });

    if (user) {
      Object.assign(user, { firstName, lastName, mobileNumber, nationality, dob, updatedAt: Date.now() });
      await user.save();
    } else {
      user = new Onboarding({ firstName, lastName, mobileNumber, email, nationality, dob });
      await user.save();
    }

    // Send email only when new onboarding details are added or updated
    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email, 
      cc: process.env.BUSINESS_TEAM_EMAIL, // optional: notify business team
      subject: "Your Onboarding Details",
      text: `Hello ${firstName},\n\nYour onboarding details have been successfully submitted.\n\nThank you!`,
    });

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Step 2: update only `requirements`, return updated doc
exports.saveOnboardingRequirements = async (req, res) => {
  const { _id, email, requirements } = req.body;
  if (!requirements) {
    return res.status(400).json({ success: false, error: "requirements required" });
  }
  try {
    const query   = _id ? { _id } : { email };
    const updated = await Onboarding.findOneAndUpdate(
      query,
      { requirements, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, error: "Record not found" });
    }
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
