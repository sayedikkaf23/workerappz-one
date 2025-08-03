/* controllers/authController.js */
const bcrypt    = require("bcryptjs");
const speakeasy = require("speakeasy");
const qrcode    = require("qrcode");
const Admin     = require("../models/admin");

// ───────────────────────────────────────────────────────────
// GET /auth/mfa/setup  – generate a TOTP secret + QR for the
//                       currently logged-in admin
// ───────────────────────────────────────────────────────────
exports.mfaSetup = async (req, res) => {
  const admin = req.user;                         // set by auth middleware
  if (admin.mfaEnabled) {
    return res.status(400).json({ msg: "MFA already enabled" });
  }

  const secret = speakeasy.generateSecret({
    name: `WorkerAppz ONE (${admin.email})`,
    length: 32
  });

  admin.totpSecret = secret.base32;
  await admin.save();

  const otpAuthUrl = secret.otpauth_url;
  const qr = await qrcode.toDataURL(otpAuthUrl);  // Base64 for <img src="...">

  res.json({ otpAuthUrl, qr });
};

// ───────────────────────────────────────────────────────────
// POST /auth/mfa/verify  – confirm the code shown in the app
// Body: { token }
// ───────────────────────────────────────────────────────────
exports.mfaVerify = async (req, res) => {
  const { token } = req.body;
  const admin = req.user;

  const ok = speakeasy.totp.verify({
    secret: admin.totpSecret,
    encoding: "base32",
    token,
    window: 1
  });

  if (!ok) return res.status(401).json({ msg: "Invalid TOTP code" });

  admin.mfaEnabled = true;
  await admin.save();
  res.json({ msg: "MFA successfully enabled" });
};

// ───────────────────────────────────────────────────────────
// POST /auth/login
// Body: { email, password, token }
// ───────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password, token } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() }).populate("role");

  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const okPw = await bcrypt.compare(password, admin.password);
  if (!okPw) return res.status(401).json({ message: "Invalid password" });

  // If MFA not configured yet, tell front-end to start setup
  if (!admin.mfaEnabled) {
    return res.status(403).json({ mfaSetupRequired: true });
  }

  if (!token) return res.status(400).json({ message: "TOTP token required" });

  const okTotp = speakeasy.totp.verify({
    secret: admin.totpSecret,
    encoding: "base32",
    token,
    window: 1
  });
  if (!okTotp) return res.status(401).json({ message: "Invalid TOTP token" });

  admin.lastLogin = new Date();
  await admin.save();

  // TODO: issue JWT / session here
  res.json({
    admin: {
      id:     admin._id,
      email:  admin.email,
      role:   admin.role || null
    }
  });
};
