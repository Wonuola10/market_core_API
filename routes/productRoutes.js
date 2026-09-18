const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, } = require('../middleware/authMiddleware');

// Protect and authorize guard this route completely!
router.route('/')
    .get(getProducts) // Public route to get all products
    .post(protect, createProduct); // Protected route for creating products   

router.route('/:id')
    .get(getSingleProduct) // Public route to get a single product
    .put(protect, updateProduct) // Protected route for updating a product
    .delete(protect, deleteProduct); // Protected route for deleting a product

    module.exports = router;
