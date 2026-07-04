const {body, validationResult, processValidation} = require('./baseValidator');

const validateRolePermission = [
  // role
  body("role")
    .notEmpty().bail().withMessage("role is required")
    .isIn(["superadmin", "admin", "merchant", "user"])
    .withMessage("Invalid role"),

  // merchant_id
  body("merchant_id")
    .notEmpty().bail().withMessage("merchant_id is required")
    .isMongoId().withMessage("merchant_id must be a valid ObjectId"),

  // user_id
  body("user_id")
    .notEmpty().bail().withMessage("user_id is required")
    .isMongoId().withMessage("user_id must be a valid ObjectId"),

  // menus must be an array
  body("menus")
    .isArray({ min: 1 }).withMessage("menus must be a non-empty array"),

  // Validate each menu object
  body("menus.*.key")
    .notEmpty().withMessage("Menu key is required"),

  body("menus.*.order")
    .isInt({ min: 1 }).withMessage("order must be >= 1"),

  body("menus.*.permissions.view").optional().isBoolean(),
  body("menus.*.permissions.add").optional().isBoolean(),
  body("menus.*.permissions.edit").optional().isBoolean(),
  body("menus.*.permissions.delete").optional().isBoolean(),

  // Validate children array
  body("menus.*.children")
    .optional()
    .isArray().withMessage("children must be an array"),

  // Custom: validate that menu children follow required structure
  body("menus").custom((menus) => {
    function validateChildren(children) {
      for (const child of children) {
        if (!child.key) throw new Error("Child menu key is required");
        if (!child.order || child.order < 1)
          throw new Error("Child menu order must be >= 1");

        if (child.children && Array.isArray(child.children)) {
          validateChildren(child.children);
        }
      }
      return true;
    }
    menus.forEach(menu => {
      if (menu.children) validateChildren(menu.children);
    });
    return true;
  }),
       (req, res, next) => {
        processValidation(req, res, next);
    }

];

module.exports = { validateRolePermission };