const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // 1. Import bcryptjs for password hashing
const jwt = require('jsonwebtoken'); // 2. Import jsonwebtoken for JWT handling

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true, //Prevents duplicate accounts with same emails
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer', // Default new accounts to 'buyer' role, can be changed later by admin
    },
}, { timestamps: true }); //Automatically adds createdAt and updatedAt fields

// 2. Pre-save middleware to hash the password before saving to the database
UserSchema.pre('save', async function (next) {
    // Only run this password hashing if the password field has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt);
});

// 3. Instance method to match the provided password with the hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Instance method to generate a JWT token
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' } // Token expires in 30 days
    );
};

module.exports = mongoose.model('User', UserSchema);
