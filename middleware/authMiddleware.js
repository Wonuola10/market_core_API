const jwt =require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect Routes: Verifies the JWT token and attaches the user to the request object
const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header is present and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract the token from the header
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object (excluding password)
        req.user = await User.findById(decoded.id).select('-password');

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(`Token verification failed: ${error.message}`);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// 2. Authorize Middleware: Checks if the authenticated user has the required role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                 message: 'Not authorized for this route' });
        }
        next();
    };
};

module.exports = { protect, 
    authorize 
};