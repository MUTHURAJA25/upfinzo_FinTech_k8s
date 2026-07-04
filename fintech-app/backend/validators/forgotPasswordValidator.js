const {body, validationResult, processValidation} = require('./baseValidator');

exports.forgotPasswordValidator = [
     body("email")
        .notEmpty().bail().withMessage("Please enter a email address")
        .isEmail().withMessage("Please enter a valid email address"),
    (req, res, next) => {
        processValidation(req, res, next);
    }
];

