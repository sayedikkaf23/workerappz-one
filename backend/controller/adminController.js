const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const Admin = require('../models/admin');
const e = require('express');

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

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

// ENABLE MFA (Generate QR)
exports.enableMFA = async (req, res) => {
    const { email } = req.body;
    console.log("sd",email)
    const admin = await Admin.findOne({ email });
        console.log(admin)

    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const secret = speakeasy.generateSecret({ length: 20 });
    admin.secret = secret.base32;
    await admin.save();

    const otpauthUrl = speakeasy.otpauthURL({
        secret: admin.secret,
        label: `MyApp (${email})`, // ✅ Fixed: label is now a string
        issuer: 'MyApp',
        encoding: 'base32'
    });

    qrcode.toDataURL(otpauthUrl, (err, dataURL) => {
        if (err) return res.status(500).json({ message: "Failed to generate QR" });
        res.json({ qrCode: dataURL });
    });
};

// VERIFY MFA
// VERIFY MFA
exports.verifyMFA = async (req, res) => {
    const { email, token } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const verified = speakeasy.totp.verify({
        secret: admin.secret,
        encoding: 'base32',
        token
    });

    if (!verified) return res.status(400).json({ message: "Invalid token" });

    admin.mfaEnabled = true;
    await admin.save();

    res.json({ message: "MFA verified successfully" });
};
