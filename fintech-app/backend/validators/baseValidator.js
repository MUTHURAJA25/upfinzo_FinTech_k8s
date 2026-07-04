const {body, validationResult} = require('express-validator');

/**
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function processValidation(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formatErrors = {};
        errors.array().forEach(error => {
            if (!formatErrors[error.path]) {
                formatErrors[error.path] = [];
            }
            formatErrors[error.path].push(error.msg);
        })

        return res.status(400).json({errors: formatErrors});
    }
    next();
}

module.exports = {processValidation, body, validationResult}