const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const orderRoutes = require('./routes/orderRoutes');

app.use('/api/v1/orders', orderRoutes);

// Load environment variables from .env file    
dotenv.config();

// Connect to MongoDB Atlas Database
connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;