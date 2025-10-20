require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const buyerRoutes = require('./routes/buyer');
const sellerRoutes = require('./routes/seller');
const managerRoutes = require('./routes/manager');
const foodRoutes = require('./routes/food');
const ingredientRoutes = require('./routes/ingredient');
const categoryRoutes = require('./routes/category');

const app = express();
// Google Cloud sử dụng PORT 8080 mặc định
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body
app.use(express.static(require('path').join(__dirname, 'public'))); // Serve static homepage

// Health check endpoint (for Cloud Run/App Engine)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Simple homepage (served statically); keep machine-readable list at /api/endpoints
app.get('/', (req, res) => {
  res.sendFile(require('path').join(__dirname, 'public', 'index.html'));
});

app.get('/api/endpoints', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Online Market API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      buyer: '/api/buyer',
      seller: '/api/seller',
      manager: '/api/manager',
      foods: '/api/foods',
      ingredients: '/api/ingredients',
      categories: '/api/categories',
      search: {
        foods: '/api/foods/search?keyword=bánh',
        ingredients: '/api/ingredients/search?keyword=thịt',
        categories: '/api/categories/search?keyword=ăn vặt'
      },
      health: '/health'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/categories', categoryRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint không tồn tại'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi server'
  });
});

// Khởi động server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 Ready to accept connections`);
});
