const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// @desc    Lấy thông tin profile buyer
// @route   GET /api/buyer/profile
// @access  Private (chỉ buyer)
router.get('/profile', authMiddleware(['buyer']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Đây là trang profile của Buyer',
    data: {
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    }
  });
});

// @desc    Danh sách đơn hàng của buyer
// @route   GET /api/buyer/orders
// @access  Private (chỉ buyer)
router.get('/orders', authMiddleware(['buyer']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Danh sách đơn hàng của buyer',
    data: {
      orders: []
    }
  });
});

// @desc    Thêm sản phẩm vào giỏ hàng
// @route   POST /api/buyer/cart
// @access  Private (chỉ buyer)
router.post('/cart', authMiddleware(['buyer']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Đã thêm sản phẩm vào giỏ hàng',
    data: {
      cart: []
    }
  });
});

module.exports = router;
