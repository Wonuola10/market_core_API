const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect and authorize guard this route completely!
router.route('/')
.get(getProducts) // Public route to get all products
.post(protect, authorize('seller', 'admin'), createProduct); // Protected route for creating products   

module.exports = router;
