const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// @desc    Lấy danh sách sản phẩm của seller
// @route   GET /api/seller/products
// @access  Private (chỉ seller)
router.get('/products', authMiddleware(['seller']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Danh sách sản phẩm của seller',
    data: {
      seller: {
        _id: req.user._id,
        name: req.user.name,
        status: req.user.status
      },
      products: []
    }
  });
});

// @desc    Thêm sản phẩm mới
// @route   POST /api/seller/products
// @access  Private (chỉ seller)
router.post('/products', authMiddleware(['seller']), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Đã tạo sản phẩm mới',
    data: {
      product: {
        name: req.body.name || 'Sản phẩm mẫu',
        seller: req.user._id
      }
    }
  });
});

// @desc    Cập nhật sản phẩm
// @route   PUT /api/seller/products/:id
// @access  Private (chỉ seller)
router.put('/products/:id', authMiddleware(['seller']), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Đã cập nhật sản phẩm ${req.params.id}`,
    data: {}
  });
});

// @desc    Xóa sản phẩm
// @route   DELETE /api/seller/products/:id
// @access  Private (chỉ seller)
router.delete('/products/:id', authMiddleware(['seller']), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Đã xóa sản phẩm ${req.params.id}`
  });
});

// @desc    Thống kê doanh thu
// @route   GET /api/seller/dashboard
// @access  Private (chỉ seller)
router.get('/dashboard', authMiddleware(['seller']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Thống kê dashboard seller',
    data: {
      revenue: 0,
      orders: 0,
      products: 0
    }
  });
});

module.exports = router;
