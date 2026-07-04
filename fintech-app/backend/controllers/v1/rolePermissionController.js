const RolePermission = require(process.env.VERSION_PATH + 'models/rolePermissionModel');
const rolePermissionService = require(process.env.VERSION_PATH + 'services/rolePermissionService');

// CREATE
exports.createRolePermission = async (req, res) => {
  try {

    // Create new role permission
    const result = await rolePermissionService.createRolePermission(req.body);

    return res.status(201).json({
      success: true,
      message: "Role permission created successfully",
      data: result
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateRolePermission = async (req, res) => {
  try {
    const result = await rolePermissionService.updateRolePermission(req.params.id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getRolePermissions = async (req, res) => {
  try {
    const userId = req.params.id; 
    const loggedInUser = req.user;
 
    // If a specific user ID is passed → return that user's permissions
    if (userId) {
      const rolePermission = await RolePermission.findOne({ user_id: userId });

      if (!rolePermission) {
        return res.status(404).json({
          success: false,
          message: "No permissions found for this user"
        });
      }

      return res.json({
        success: true,
        data: rolePermission
      });
    }

    // No userId: ONLY superadmin is allowed to get all
    if (loggedInUser.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only superadmin can view all users' permissions."
      });
    }

    // If superadmin → return all
    const rolePermissionLists = await RolePermission.find();

    return res.json({
      success: true,
      data: rolePermissionLists
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// DELETE
exports.deleteRolePermission = async (req, res) => {
  try {
    const isDeleted = await RolePermission.findByIdAndDelete(req.params.id);

    if (!isDeleted)
      return res.status(404).json({ success: false, message: "Role permission not found." });

    res.json({ success: true, message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};