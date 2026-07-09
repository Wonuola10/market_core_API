const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters'],
    }, 
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
        maxlength: [1000, 'Product description cannot exceed 1000 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a product category'],
        enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Beauty', 'Sports', 'Other'], // Example categories
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a seller for this product'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Product', productSchema);