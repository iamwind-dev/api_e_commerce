const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper: Tạo JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Đăng ký user mới
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { phone, email, username, name, password, role } = req.body;

    // Validate input
    if (!phone || !email || !username || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Check trùng phone, email, username
    const existingUser = await User.findOne({
      $or: [{ phone }, { email }, { username }]
    });

    if (existingUser) {
      let field = '';
      if (existingUser.phone === phone) field = 'Số điện thoại';
      else if (existingUser.email === email) field = 'Email';
      else if (existingUser.username === username) field = 'Username';

      return res.status(400).json({
        success: false,
        message: `${field} đã tồn tại trong hệ thống`
      });
    }

    // Xác định status dựa trên role
    let status = 'approved';
    if (role === 'seller') {
      status = 'pending'; // Seller cần được approve
    }

    // Tạo user mới
    const user = await User.create({
      phone,
      email,
      username,
      name,
      password,
      role: role || 'buyer',
      status
    });

    // Trả về thông tin user (password đã được ẩn qua toJSON)
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          _id: user._id,
          phone: user.phone,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Register Error:', error);

    // Xử lý lỗi validation từ mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Dữ liệu không hợp lệ'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký'
    });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Validate input
    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin đăng nhập'
      });
    }

    // Tìm user theo phone, email hoặc username
    // Cần select password vì mặc định nó bị exclude
    const user = await User.findOne({
      $or: [
        { phone: loginId },
        { email: loginId },
        { username: loginId }
      ]
    }).select('+password');

    // Nếu không tìm thấy user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin đăng nhập không chính xác'
      });
    }

    // So sánh password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin đăng nhập không chính xác'
      });
    }

    // Tạo JWT token
    const token = generateToken(user._id);

    // Trả về thông tin user + token
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          _id: user._id,
          phone: user.phone,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          status: user.status
        }
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập'
    });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin user'
    });
  }
};
