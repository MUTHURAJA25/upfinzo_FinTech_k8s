const userModel = require(process.env.VERSION_PATH + 'models/userModel');
const jwt = require('jsonwebtoken');
const {generateResetToken} = require(process.env.VERSION_PATH + 'utils/resetToken');
const {sendResetPassword} = require(process.env.VERSION_PATH + "utils/mailer");
const crypto = require('crypto');
const express = require('express');
const app = express();

const RESET_TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour

const generateToken = (userId,role) => {
    return jwt.sign({userId,role}, process.env.JWT_SECRET, {expiresIn: '7d'});
};

// Signup
const signup = async (req, res) => {
    try {
        const {name, email, password, confirmPassword} = req.body;
        const existingUser = await userModel.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        const user = await userModel.create({first_name: name, email, password, confirmPassword});
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.first_name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Signin
const signin = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});

        if (!user) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        if (user.isActive === 0) {
            return res
                .status(403)
                .json({message: 'Account is inactive. Please contact support.'});
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = generateToken(user._id, user.role);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Password Reset
const passwordReset = async (req, res) => {
    try {

        const {email} = req.body;
        if (!email) return res.status(400).json({message: 'Email required'});

        const user = await userModel.findOne({email: email.toLowerCase()});
        if (!user) {
            return res.status(400).json({message: 'This email address doesn\'t exist.'});
        }

        const {rawToken, tokenHash} = generateResetToken();
        user.passwordResetTokenHash = tokenHash;
        user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
        const subject = 'Reset Password';
        const userDetails = {
            firstname: user.first_name,
            lastname: user.last_name ?? '',
            email: user.email,
            resetUrl: resetUrl
        }

        const emailResponse = await sendResetPassword(user.email, 'Password Reset - ' + process.env.COMPANY_NAME, userDetails);
        if (!emailResponse) {
            return res.status(200).json({message: 'A password reset link has been sent to your email address.'});
        } else {
            return res.status(400).json({message: 'Email not sending.'});

        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Verify Password
const verifyPassword = async (req, res) => {
    try {
        const {email, token, password} = req.body;
        if (!email || !token || !password) return res.status(400).json({message: 'email, token and password required'});
        if (password.length < 8) return res.status(400).json({message: 'Password must be at least 8 characters'});
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await userModel.findOne({
            email: email.toLowerCase(),
            passwordResetTokenHash: tokenHash,
            passwordResetExpires: {$gt: new Date()},
        });
        if (!user) {
            return res.status(400).json({message: 'Token invalid or expired'});
        }
        
        user.passwordResetTokenHash = undefined;
        user.passwordResetExpires = undefined;
        user.password = password;
        await user.save();

        return res.json({message: 'Password successfully updated'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    signup,
    signin,
    passwordReset,
    verifyPassword
};