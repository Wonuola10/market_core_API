const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Order item must reference a product'],
    },
    name: {
        type: String,
        required: [true, 'Order item must have a name'],
    },
    quantity: {
        type: Number,
        required: [true, 'Please specify a quantity'],
        min: [1, 'Quantity must be at least 1'],
    },
    price: {
        type: Number,
        required: [true, 'Please specify a price at purchase'],
    },
});

const orderSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Order must belong to buyer'],
        },
        orderItems: {
            type: [orderItemSchema],
            validate: {
                validator: function (items) {
                    return items && items.length > 0;
                },
                message: 'Order must contain at least one item',
            },
        },
        shippingAddress: {
            street: { type: String, required: [true, 'Shipping address must include street'] },
            city: { type: String, required: [true, 'Shipping address must include city'] },
            state: { type: String, required: [true, 'Shipping address must include state'] },
            zipCode: { type: String, required: [true, 'Shipping address must include zip code'] },
            country: { type: String, required: [true, 'Shipping address must include country'] },
        },
        paymentMethod: {
            type: String,
            required: [true, 'Please specify a payment method'],
            enum: ['Card', 'PayPal', 'Bank Transfer'],
            default: 'Card',
        },
        paymentStatus: {
            id: { type: String },
            status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
            updateTime: { type: Date },
            emailAddress: { type: String },
        },
        totalPrice: {
            type: Number,
            required: [true, 'Please specify the total price'],
            min: [0, 'Total price cannot be negative'],
        },
        isPaid: {
            type: Boolean,
            required: [true, 'Please specify if the order is paid'],
            default: false,
        },
        paidAt: {
            type: Date,
        },
        orderStatus: {
            type: String,
            required: [true, 'Please specify the order status'],
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', orderSchema);