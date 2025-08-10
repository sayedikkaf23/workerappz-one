const mongoose = require("mongoose");
const schema = mongoose.Schema;

const roleSchema = new schema(
  {
    role_name: { type: String, default: "", required: true },
    status: { type: Boolean, default: true }, // To enable or disable the role
    permissions: [String], // Array of permission strings like ['view_users', 'edit_roles']
    is_deleted: { type: Boolean, default: false }, // Soft delete feature
  },
  {
    strict: true,
    timestamps: true, // To store createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model("Role", roleSchema);
