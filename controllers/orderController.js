const Order = require('../models/Order');
const Product = require('../models/Product');

//@desc    Create a new order
//@route   POST /api/v1/orders
//@access  Private (only authenticated users can create orders)
const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Order must contain at least one item' });
        }

        const buyerId = req.user._id ? req.user._id : req.user.id; // Get the logged-in user's ID

        let calculatedTotalPrice = 0;
        const verifiedOrderItems = [];

        //Verify products and snapshot DB prices
        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ 
                    status: 'error', 
                    message: `Product with ID ${item.product} not found` 
                });
            }

            const itemPrice = product.price; // Get the price from the database
            calculatedTotalPrice += itemPrice * item.quantity;
            
            verifiedOrderItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: itemPrice,
            });
        }

        const order = await Order.create({
            buyer: buyerId,
            orderItems: verifiedOrderItems,
            shippingAddress,
            paymentMethod,
            totalPrice: calculatedTotalPrice,
        });

        const createdOrder = await Order.create();
        
        res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: createdOrder,
        });
    } catch (error) {
        console.error(`Error creating order: ${error.stack}`);
        res.status(500).json({ status: 'error', message: 'Server error while creating order' });
    }
};

//@desc    Get all orders for the logged-in user
//@route   GET /api/v1/orders
//@access  Private (only authenticated users can view their orders)
const getMyOrders = async (req, res) => {
    try {
        const buyerId = req.user._id ? req.user._id : req.user.id; // Get the logged-in user's ID
        const orders = await Order.find({ buyer: buyerId }).sort('createdAt');
        res.status(200).json({
            status: 'success',
            count: orders.length,
            message: 'Orders retrieved successfully',
            data: orders,
        });
    } catch (error) {
        console.error(`Error fetching orders: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Server error while fetching orders' });
    }
};

//desc Get a single order by ID
//route GET /api/v1/orders/:id
//access Private (only authenticated users can view their orders)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('buyer', 'name email');

        if (!order) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Order not found',
            });
        }

        const loggedInUserId = (req.user._id || req.user.id).toString();
        const orderBuyerId = order.buyer._id ? order.buyer._id.toString() : order.buyer.toString();

        // Ensure the logged-in user is the owner of the order
        if (orderBuyerId !== loggedInUserId && req.user.role !== 'admin') {
            return res.status(403).json({ 
                status: 'error', 
                message: 'You are not authorized to view this order', 
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Order retrieved successfully',
            data: order,
        });
    } catch (error) {
        console.error(`Error fetching order: ${error.message}`);

        // Handle invalid MongoDB ObjectId format in req.params.id
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid order ID format',
            });
        }

        res.status(500).json({ 
            status: 'error', 
            message: 'Server error while fetching order', 
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
};