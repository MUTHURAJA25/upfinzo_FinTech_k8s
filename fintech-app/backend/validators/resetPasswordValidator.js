const {body, validationResult, processValidation} = require('./baseValidator');

exports.resetPasswordValidator = [
     body("email")
        .notEmpty().bail().withMessage("Please enter a email address")
        .isEmail().withMessage("Please enter a valid email address"),
     body('token').notEmpty().withMessage('Token is required'),
     body('password')
        .notEmpty().bail().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
     (req, res, next) => {
        processValidation(req, res, next);
    }
];

