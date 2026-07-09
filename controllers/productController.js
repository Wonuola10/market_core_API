const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private (only authenticated users can create products)
const createProduct = async (req, res) => {
    try {
        // Automatically add the logged in user's ID as the seller
        req.body.seller = req.user._id;

        const product = await Product.create(req.body);

        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        console.error(`Error creating product: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Server error while creating product' });
    }
};

//@desc    Get all products
//@route   GET /api/v1/products
//@access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email'); // Populate seller details
        
        res.status(200).json({
            status: 'success',
            message: 'Products fetched successfully',
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error(`Error fetching products: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Server error while fetching products' });
    }
};

module.exports = {
    createProduct,
    getProducts,
};