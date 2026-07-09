const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect and authorize guard this route completely!
router.post('/', protect, authorize('seller', 'admin'), createProduct);

module.exports = router;
