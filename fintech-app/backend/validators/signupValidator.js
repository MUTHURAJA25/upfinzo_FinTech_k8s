const {body, validationResult, processValidation} = require('./baseValidator');

exports.signupValidator = [
    body("name")
        .notEmpty().withMessage("Please enter a name")
        .isLength({min: 3}).withMessage("Name must be at least 3 characters long"),
    body("email")
        .notEmpty().withMessage("Please enter a email address")
        .isEmail().withMessage("Please enter a valid email address"),
    body("password")
        .notEmpty().withMessage("Please enter a password")
        .isLength({min: 8}).withMessage("Password must be at least 8 characters long"),
    body("confirmPassword")
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
        .notEmpty().withMessage("Please enter a confirm password")
        .isLength({min: 8}).withMessage("Confirm Password must be at least 8 characters long"),
    (req, res, next) => {
        processValidation(req, res, next);
    }
];

