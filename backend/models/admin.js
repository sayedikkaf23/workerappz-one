// models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email:        { type: String, required: true, unique: true },
    password:     { type: String, required: true },   // bcrypt hash
    totpSecret:   { type: String },                   // base32 secret for TOTP
    mfaEnabled:   { type: Boolean, default: false },  // flips to true after first verification
    lastLogin:    { type: Date, default: null },
    userHashedId: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
