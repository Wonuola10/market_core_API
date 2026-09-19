const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Apply the protect middleware to all routes in this router

router.post('/', createOrder); // Create a new order
router.get('/myorders', getMyOrders); // Get all orders for the logged-in user
router.get('/:id', getOrderById); // Get a single order by ID

module.exports = router;