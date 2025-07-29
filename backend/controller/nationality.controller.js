const CountryRisk = require("../models/nationality.model");
const logOnboardingDb = require("../utils/onboardingLogger");

exports.addCountryRisk = async (req, res) => {
  try {
    const { country, riskRating } = req.body;

    const exists = await CountryRisk.findOne({ country });
    if (exists) {
      await logOnboardingDb({
        methodName: "addCountryRisk",
        request: req.body,
        response: { success: false, message: "Country already exists" },
        requestedBy: req.user?.email || "unknown"
      });
      return res.status(400).json({ message: "Country already exists" });
    }

    const newCountry = await CountryRisk.create({ country, riskRating });

    await logOnboardingDb({
      methodName: "addCountryRisk",
      request: req.body,
      response: { success: true, data: newCountry },
      requestedBy: req.user?.email || "unknown"
    });

    res.status(201).json(newCountry);
  } catch (err) {
    console.error("Error adding country risk:", err);

    await logOnboardingDb({
      methodName: "addCountryRisk",
      request: req.body,
      response: { success: false, error: err.message },
      requestedBy: req.user?.email || "unknown"
    });

    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllCountryRisks = async (_, res) => {
  try {
    const countries = await CountryRisk.find();

    await logOnboardingDb({
      methodName: "getAllCountryRisks",
      request: {},
      response: { success: true, data: countries },
      requestedBy: "system"
    });

    res.json(countries);
  } catch (err) {
    await logOnboardingDb({
      methodName: "getAllCountryRisks",
      request: {},
      response: { success: false, error: err.message },
      requestedBy: "system"
    });

    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateCountryRisk = async (req, res) => {
  try {
    const { id } = req.params;
    const { country, riskRating } = req.body;

    const exists = await CountryRisk.findOne({ country, _id: { $ne: id } });
    if (exists) {
      await logOnboardingDb({
        methodName: "updateCountryRisk",
        request: req.body,
        response: { success: false, message: "Country already exists" },
        requestedBy: req.user?.email || "unknown"
      });
      return res.status(400).json({ message: "Country already exists" });
    }

    const updated = await CountryRisk.findByIdAndUpdate(
      id,
      { country, riskRating },
      { new: true }
    );

    await logOnboardingDb({
      methodName: "updateCountryRisk",
      request: req.body,
      response: { success: true, data: updated },
      requestedBy: req.user?.email || "unknown"
    });

    res.json(updated);
  } catch (err) {
    await logOnboardingDb({
      methodName: "updateCountryRisk",
      request: req.body,
      response: { success: false, error: err.message },
      requestedBy: req.user?.email || "unknown"
    });

    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteCountryRisk = async (req, res) => {
  try {
    await CountryRisk.findByIdAndDelete(req.params.id);

    await logOnboardingDb({
      methodName: "deleteCountryRisk",
      request: { id: req.params.id },
      response: { success: true, message: "Deleted successfully" },
      requestedBy: req.user?.email || "unknown"
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    await logOnboardingDb({
      methodName: "deleteCountryRisk",
      request: { id: req.params.id },
      response: { success: false, error: err.message },
      requestedBy: req.user?.email || "unknown"
    });

    res.status(500).json({ message: "Server error", error: err.message });
  }
};
