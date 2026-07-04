const express = require('express');
const router = express.Router();
const {
    signup,
    signin,
    passwordReset,
    verifyPassword
} = require(process.env.VERSION_PATH + 'controllers/'+process.env.CURRENT_VERSION+'/authController');
const {signupValidator} = require(process.env.VERSION_PATH +'validators/signupValidator.js');
const {signinValidator} = require(process.env.VERSION_PATH +'validators/signinValidator.js');
const {forgotPasswordValidator} = require(process.env.VERSION_PATH +'validators/forgotPasswordValidator.js');
const {resetPasswordValidator} = require(process.env.VERSION_PATH +'validators/resetPasswordValidator.js');

// Routes
router.post('/signup', signupValidator, signup);
router.post('/signin', signinValidator, signin);
router.post('/forgot-password', forgotPasswordValidator, passwordReset);
router.post('/reset-password', resetPasswordValidator, verifyPassword);

module.exports = router;