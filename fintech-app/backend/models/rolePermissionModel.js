const mongoose = require("mongoose");

// Validate unique order numbers at the same level
function validateUniqueOrder(value) {
  if (!Array.isArray(value)) return true;

  const orders = value.map(item => item.order);
  const unique = new Set(orders);

  return unique.size === orders.length; // no duplicates
}

// Max depth validator (prevents infinite nesting)
function validateMaxDepth(menus, maxDepth = 10) {
  const checkDepth = (items, depth) => {
    if (depth > maxDepth) return false;

    for (let item of items) {
      if (item.children && item.children.length > 0) {
        if (!checkDepth(item.children, depth + 1)) {
          return false;
        }
      }
    }
    return true;
  };

  return checkDepth(menus, 1);
}

// ---------------- Menu Schema ----------------
const MenuSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, "Menu is required"],
    trim: true
  },

  order: {
    type: Number,
    required: [true, "Order is required"],
    min: [1, "Order must be >= 1"]
  },

  permissions: {
    view: { type: Boolean, default: false },
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },

  children: {
    type: Array,
    default: [],
    validate: [
      {
        validator: validateUniqueOrder,
        message: "Duplicate 'order' values found inside children."
      }
    ]
  }
}, { _id: false });

// Recursive children support
MenuSchema.add({
  children: [MenuSchema]
});

// ---------------- Role Permission Schema ----------------
const RolePermissionSchema = new mongoose.Schema({

  role: {
    type: String,
    required: true,
    enum: ["superadmin", "admin", "merchant", "user"],
  },

  menus: {
    type: [MenuSchema],
    validate: [
      {
        validator: validateUniqueOrder,
        message: "Duplicate 'order' values found in menus."
      },
      {
        validator: function (menus) {
          return validateMaxDepth(menus, 5); // set your max depth here
        },
        message: "Max menu depth exceeded (limit = 5)."
      }
    ]
  },

merchant_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }

}, { timestamps: true });

module.exports = mongoose.model("RolePermission", RolePermissionSchema);