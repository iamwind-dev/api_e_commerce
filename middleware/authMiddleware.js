const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: Verify JWT và gắn user vào req.user
const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Lấy token từ header
      let token;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      // Kiểm tra token có tồn tại
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập để truy cập'
        });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Token không hợp lệ hoặc đã hết hạn'
        });
      }

      // Tìm user từ token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User không tồn tại'
        });
      }

      // Kiểm tra status của user
      if (user.status !== 'approved') {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản của bạn chưa được phê duyệt. Vui lòng liên hệ quản trị viên.'
        });
      }

      // Kiểm tra role nếu có yêu cầu
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền truy cập tài nguyên này'
        });
      }

      // Gắn user vào request
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi xác thực'
      });
    }
  };
};

module.exports = authMiddleware;
