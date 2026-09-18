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

// @desc    Get a single product
// @route   GET /api/v1/products/:id
// @access  Public
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.status(200).json({
            status: 'success',
            data: product,
        });
    } catch (error) {
        console.error(`Error fetching product: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Server error while fetching product' });
    }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private (only the seller can update their product)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
         
        const userId = req.user._id ? req.user._id.toString() : req.user._id; // Ensure userId is a string
        
        // Ownership check:Check if the logged-in user is the seller of the product
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ 
                status: 'error', 
                message: 'You are not authorized to update this product',
            });
        }
        
        // Apply updates directly to the Mongoose document and save
        Object.assign(product, req.body);
        await product.save({ runValidators: true });

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        console.error(`Error updating product: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Server error while updating product' });
    }
};

    //@desc    Delete a product
    //@route   DELETE /api/v1/products/:id
    //@access  Private (only the seller can delete their product)
    const deleteProduct = async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ status: 'error', message: 'Product not found' });
            }

            // Ownership check: Check if the logged-in user is the seller of the product
            const userId = req.user._id ? req.user._id.toString() : req.user._id; // Ensure userId is a string

            if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'You are not authorized to delete this product',
                });
            }

            await product.deleteOne();

            res.status(200).json({
                status: 'success',
                message: 'Product deleted successfully',
            });
        } catch (error) {
            console.error(`Error deleting product: ${error.message}`);
            res.status(500).json({ status: 'error', message: 'Server error while deleting product' });
        }
    };

module.exports = {
    createProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};