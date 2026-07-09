const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // 2. Create a new user in MongoDB
        const newUser = await User.create({ 
            name, 
            email, 
            password, 
            role // can be 'buyer', 'seller', or 'admin' from Postman
        });
        
        //3. Return a success response
        res.status(201).json({
            message: 'User registered successfully',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error(`Error registering user: ${error.message}`);
        res.status(500).json({ message: 'Server error while registering user' });
    }
};  


//@desc    Login a user
//@route   POST /api/v1/auth/login
//@access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

        // 1. Check if the user exists
        const user = await User.findOne({ email
         }).select('+password'); // Explicitly select the password field since it's excluded by default

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. Compare the provided password with the hashed password in the database
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
const token = user.getSignedJwtToken(); // Generate a JWT token for the authenticated user
        // 3. Return a success response (you can also generate a JWT token here)
        res.status(200).json({
            message: 'Login successful',
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                
            },
        });
    } catch (error) {
        console.error(`Error logging in user: ${error.message}`);
        res.status(500).json({ message: 'Server error while logging in user' });
    }
};

module.exports = {  
    register,
    login,
};