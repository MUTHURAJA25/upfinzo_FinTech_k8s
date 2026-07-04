const { body, processValidation } = require("./baseValidator");

exports.payInValidator = [
   body("merchant_id")
    .notEmpty().withMessage("Merchant is required"),

   body("created_by")
    .notEmpty().withMessage("Created by user is required"),

   body("amount")
    .notEmpty().withMessage("Amount is required")
    .isNumeric().withMessage("Amount must be a number"),

    body("customer_email")
    .notEmpty().withMessage("Customer email is required")
    .isEmail().withMessage("Invalid email format"),

  body("customer_phone")
    .optional()
    .isMobilePhone().withMessage("Invalid phone number"),

  body("description")
    .optional()
    .isString().withMessage("Description must be text"),

  body("expiry_date")
    .optional()
    .isISO8601().withMessage("Expiry date must be a valid date"),

  // Final validation processor (same as your style)
  (req, res, next) => {
    processValidation(req, res, next);
  }
];
