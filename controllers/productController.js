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

module.exports = {
    createProduct,
};