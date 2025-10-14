const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// @desc    Lấy danh sách seller đang chờ approve
// @route   GET /api/manager/pending-sellers
// @access  Private (chỉ manager)
router.get('/pending-sellers', authMiddleware(['manager']), async (req, res) => {
  try {
    const pendingSellers = await User.find({
      role: 'seller',
      status: 'pending'
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Danh sách seller chờ phê duyệt',
      data: {
        count: pendingSellers.length,
        sellers: pendingSellers
      }
    });
  } catch (error) {
    console.error('Get Pending Sellers Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách seller'
    });
  }
});

// @desc    Approve seller
// @route   POST /api/manager/approve-seller/:id
// @access  Private (chỉ manager)
router.post('/approve-seller/:id', authMiddleware(['manager']), async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm seller
    const seller = await User.findById(id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy seller'
      });
    }

    // Kiểm tra có phải seller không
    if (seller.role !== 'seller') {
      return res.status(400).json({
        success: false,
        message: 'User này không phải là seller'
      });
    }

    // Kiểm tra đã được approve chưa
    if (seller.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Seller đã được phê duyệt trước đó'
      });
    }

    // Approve seller
    seller.status = 'approved';
    await seller.save();

    res.status(200).json({
      success: true,
      message: 'Đã phê duyệt seller thành công',
      data: {
        seller: {
          _id: seller._id,
          name: seller.name,
          email: seller.email,
          username: seller.username,
          role: seller.role,
          status: seller.status
        }
      }
    });
  } catch (error) {
    console.error('Approve Seller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi phê duyệt seller'
    });
  }
});

// @desc    Reject seller
// @route   POST /api/manager/reject-seller/:id
// @access  Private (chỉ manager)
router.post('/reject-seller/:id', authMiddleware(['manager']), async (req, res) => {
  try {
    const { id } = req.params;

    // Có thể xóa hoặc đổi status (tùy yêu cầu)
    const seller = await User.findByIdAndDelete(id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy seller'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đã từ chối và xóa seller'
    });
  } catch (error) {
    console.error('Reject Seller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi từ chối seller'
    });
  }
});

// @desc    Lấy tất cả users
// @route   GET /api/manager/users
// @access  Private (chỉ manager)
router.get('/users', authMiddleware(['manager']), async (req, res) => {
  try {
    const { role, status } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter).select('-password');

    res.status(200).json({
      success: true,
      message: 'Danh sách users',
      data: {
        count: users.length,
        users
      }
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách users'
    });
  }
});

// @desc    Dashboard thống kê
// @route   GET /api/manager/dashboard
// @access  Private (chỉ manager)
router.get('/dashboard', authMiddleware(['manager']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const pendingSellers = await User.countDocuments({ role: 'seller', status: 'pending' });

    res.status(200).json({
      success: true,
      message: 'Thống kê hệ thống',
      data: {
        totalUsers,
        totalBuyers,
        totalSellers,
        pendingSellers
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê'
    });
  }
});

module.exports = router;
