const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const Admin = require("../models/admin");
const Currency = require("../models/currency");
const onBoardings = require("../models/onboarding.model");
const e = require("express");
const Role = require("../models/roles");

const logOnboardingDb = require("../utils/onboardingLogger");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

exports.register = async (req, res) => {
  try {
    const { email, password, roleid, status } = req.body;

    if (!email || !password || !roleid) {
      return res.status(400).json({ message: 'email, password and roleid are required' });
    }

    const dup = await Admin.findOne({ email });
    if (dup) return res.status(409).json({ message: 'Email already in use' });

    const role = await Role.findById(roleid);
    if (!role) return res.status(400).json({ message: 'Invalid roleid' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
      role: role._id,
      status: status !== undefined ? !!status : true
    });

    const { password: _p, secret: _s, ...safe } = admin.toObject();
    res.status(201).json({ message: 'Admin registered successfully', admin: safe });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Email already in use' });
    console.error('Register admin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  if (admin.mfaEnabled) {
    return res.json({ mfaRequired: true, email });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
};

// ENABLE MFA (Generate QR)
exports.enableMFA = async (req, res) => {
  const { email } = req.body;
  console.log("sd", email);
  const admin = await Admin.findOne({ email });
  console.log(admin);

  if (!admin) return res.status(400).json({ message: "Admin not found" });

  const secret = speakeasy.generateSecret({ length: 20 });
  admin.secret = secret.base32;
  await admin.save();

  const otpauthUrl = speakeasy.otpauthURL({
    secret: admin.secret,
    label: `MyApp (${email})`,
    issuer: "MyApp",
    encoding: "base32",
  });

  qrcode.toDataURL(otpauthUrl, (err, dataURL) => {
    if (err) return res.status(500).json({ message: "Failed to generate QR" });
    res.json({ qrCode: dataURL });
  });
};

// VERIFY MFA

exports.verifyMFA = async (req, res) => {
  const { email, token } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ message: "Admin not found" });

  const verified = speakeasy.totp.verify({
    secret: admin.secret,
    encoding: "base32",
    token,
  });

  if (!verified) return res.status(400).json({ message: "Invalid token" });

  admin.mfaEnabled = true;
  await admin.save();

  res.json({ message: "MFA verified successfully" });
};

exports.addRole = async (req, res) => {
  try {
    const { role_name, permissions, status } = req.body;

    const existingRole = await Role.findOne({ role_name, is_deleted: false });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = new Role({
      role_name,
      permissions,
      status: status !== undefined ? status : true
    });

    await role.save();
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Roles (excluding deleted)
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ is_deleted: false });
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update Role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, permissions, status } = req.body;

    const role = await Role.findByIdAndUpdate(
      id,
      { role_name, permissions, status },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role updated successfully", role });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find by ID and ensure not soft-deleted
    const role = await Role.findOne({ _id: id, is_deleted: false }).lean();

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error('Error fetching role by id:', error);
    // Handle invalid ObjectId too
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Soft Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// GET ALL ADMINS
exports.getAllAdmins = async (req, res) => {
  try {
const admins = await Admin.find({}, { password: 0, secret: 0 })
  .populate('role', 'role_name')   // run populate on the query
  .exec();
    // Excluding password and secret from the response for security
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// GET ADMIN BY ID
exports.getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findById(adminId, { password: 0, secret: 0 }).populate('role', 'role_name').exec();

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin by ID:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
exports.getAllIndividualUsers = async (req, res) => {
  try {
    // Base condition
    const query = { requirements: "personal" };

    // Fetch data
    const users = await onBoardings.find(query).lean(); // lean() for faster response

    // Handle no data case
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No personal onboarding data found" });
    }

    res.status(200).json({
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("getAllIndividualUsers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllBusinessUsers = async (req, res) => {
  try {
    // Base condition
    const query = { requirements: "business" };

    // Fetch data
    const users = await onBoardings.find(query).lean(); // lean() for faster response

    // Handle no data case
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No business onboarding data found" });
    }

    res.status(200).json({
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("getAllBusinessUsers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params; // admin ID from URL

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    let { email, password, roleid, status, ...rest } = req.body;

    const update = { ...rest };

    // Email change → must be unique
    if (email) {
      email = String(email).trim().toLowerCase();
      const exists = await Admin.findOne({ email, _id: { $ne: id } });
      if (exists) return res.status(409).json({ message: 'Email already in use' });
      update.email = email;
    }

    // Password change → hash
    if (password) {
      if (String(password).length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
      }
      update.password = await bcrypt.hash(password, 10);
    }

    // Role change → validate roleid
    if (roleid) {
      const role = await Role.findById(roleid);
      if (!role) return res.status(400).json({ message: 'Invalid roleid' });
      update.role = role._id;
    }

    // Status change → normalize to boolean
    if (typeof status !== 'undefined') {
      if (typeof status === 'string') status = status.toLowerCase() === 'true';
      update.status = !!status;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const admin = await Admin.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).populate('role', 'role_name');

    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const { password: _p, secret: _s, ...safe } = admin.toObject();
    res.status(200).json({ message: 'Admin updated successfully', admin: safe });
  } catch (err) {
    console.error('Error updating admin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.status(200).json({
      success: true,
      data: currencies
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch currencies",
      error: err.message
    });
  }
};

// CREATE new currency
exports.createCurrency = async (req, res) => {
  try {
    const { name, code, isActive, auth, scale } = req.body;

    // Optional: Prevent duplicate codes
    const existing = await Currency.findOne({ code });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Currency code already exists"
      });
    }

    const currency = new Currency({
      name,
      code,
      isActive,
      auth,
      scale
    });

    await currency.save();

    res.status(201).json({
      success: true,
      message: "Currency created successfully",
      data: currency
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create currency",
      error: err.message
    });
  }
};