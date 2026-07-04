const {body, validationResult, processValidation} = require('./baseValidator');

exports.signinValidator = [
    body("email")
        .notEmpty().withMessage("Please enter a email address")
        .isEmail().withMessage("Please enter a valid email address"),
    body("password")
        .notEmpty().withMessage("Please enter a password")
        .isLength({min: 8}).withMessage("Password must be at least 8 characters long"),
    (req, res, next) => {
        processValidation(req, res, next);
    }
]

