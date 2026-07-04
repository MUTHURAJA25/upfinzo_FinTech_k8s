const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        first_name: { type: String, trim: true, minLength: 2 },
        last_name: { type: String, trim: true, minLength: 2 },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        role: {
            type: String,
            enum: {
                values: ['superadmin', 'admin', 'merchant'],
                message: '{VALUE} is not a valid role'
            },
            default: 'merchant',
            validate: {
                validator: function(v) {
                    return ['superadmin', 'admin', 'merchant'].includes(v);
                },
                message: 'Role must be superadmin, admin, or merchant'
            }
        },
        phone_number: { type: String, trim: true, unique: true, sparse: true },
        address: { type: String, trim: true },
        avatar: { type: String },
        status: {
            type: String,
            enum: ['0', '1'],
            default: '0',
        },
        passwordResetTokenHash: String,
        passwordResetExpires: Date,
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Manually set password
userSchema.methods.setPassword = async function (plain) {
    const saltRounds = 12;
    this.password = await bcrypt.hash(plain, saltRounds);
};

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);