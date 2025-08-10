// models/admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    email:   { type: String, unique: true, required: true, lowercase: true, trim: true },
    password:{ type: String, required: true },
    role:    { type: mongoose.Schema.Types.ObjectId, ref: 'Role',  }, // <— role ref
    status:  { type: Boolean, default: true }, // <— active/inactive
    secret:  { type: String },
    mfaEnabled: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
