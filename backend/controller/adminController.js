const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const Admin = require("../models/admin");
const e = require("express");
const Role = require("../models/roles");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new Admin({ email, password: hashedPassword });
  await admin.save();

  res.json({ message: "Admin registered successfully" });
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

exports.createRole = async (req, res) => {
  try {
    // Extract data from request body and headers
    const { role_name, permissions, status } = req.body;
    const requestedBy = req.headers["x-auth-user-id"] || "Unknown";

    // Check if role already exists in the database
    let role = await Role.findOne({ role_name });

    if (role) {
      // If role exists, update the permissions and status
      role.permissions = permissions;
      role.status = status !== undefined ? status : role.status;

      // Save the updated role
      await role.save();

      const response = {
        message: "Role updated successfully",
        role,
      };

      // ✅ Log success for role update
      await logCommonDb({
        methodName: "createRole",
        request: req.body,
        response,
        requestedBy,
        partnerName: "", // Pass partner information if applicable
      });

      return res.status(200).json(response);
    } else {
      // If role does not exist, create a new role
      role = new Role({
        role_name,
        permissions,
        status: status !== undefined ? status : true, // Default status is true if not provided
      });

      // Save the new role
      await role.save();

      const response = {
        message: "Role created successfully",
        role,
      };

      return res.status(201).json(response);
    }
  } catch (error) {
    console.error("Error creating/updating role:", error);

    return res.status(500).json({ message: "Internal server error", error });
  }
};

// 2. Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ is_deleted: false });

    return res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);

    // ❌ Log error

    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const roleId = req.params.id;
    const role = await Role.findById(roleId);

    if (!role || role.is_deleted) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.error("Error fetching role by ID:", error);

    res.status(500).json({ message: "Internal server error", error });
  }
};

// 4. Update a role
exports.updateRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const { role_name, permissions, status } = req.body;
    const requestedBy = req.headers["x-auth-user-id"] || "Unknown";

    // Find the role by its ID
    const role = await Role.findById(roleId);

    if (!role || role.is_deleted) {
      const errorResponse = { message: "Role not found" };

      return res.status(404).json(errorResponse);
    }

    // Update role fields
    role.role_name = role_name || role.role_name;
    role.permissions = permissions || role.permissions;

    // Ensure status is a boolean
    if (status !== undefined) {
      role.status = typeof status === "boolean" ? status : role.status;
    }

    // Save the updated role
    await role.save();

    const response = {
      message: "Role updated successfully",
      role,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// 5. Soft delete a role
exports. deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const role = await Role.findById(roleId);

    if (!role || role.is_deleted) {
    

      return res.status(404).json({ message: "Role not found" });
    }

    role.is_deleted = true;
    await role.save();

    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);

    res.status(500).json({ message: "Internal server error", error });
  }
};


// GET ALL ADMINS
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0, secret: 0 }); 
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
    const admin = await Admin.findById(adminId, { password: 0, secret: 0 });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin by ID:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
