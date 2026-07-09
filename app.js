const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

//Middleware to parse JSON requests
app.use(express.json());

// Use auth routes
app.use('/api/v1/auth', authRoutes);

// Use product routes
app.use('/api/v1/products', productRoutes);

// General health check route
app.get('/', (req, res) => {
    res.status(200).send({ message: 'Market Core API is running smoothly!' });
});

module.exports = app;