const CommonDbLog = require("../models/commonDbLog");

const logOnboardingDb = async ({ methodName, request, response, requestedBy }) => {
  try {
    const latestLog = await CommonDbLog.findOne().sort({ serialNumber: -1 });
    const serialNumber = latestLog ? latestLog.serialNumber + 1 : 1;

    console.log(`[OnboardingLog] Logging ${methodName} as serial: ${serialNumber}`);

    await CommonDbLog.create({
      serialNumber,
      methodName,
      request,
      response,
      requestedBy,
      dateTime: new Date()
    });
  } catch (error) {
    console.error("Failed to log CommonDbLog:", error.message);
  }
};

module.exports = logOnboardingDb;
