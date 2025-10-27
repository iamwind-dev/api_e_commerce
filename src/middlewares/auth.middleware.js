const jwt = require("jsonwebtoken");
const http = require("../utils/http");
const { prisma } = require("../repositories/user.repo");

exports.auth = async (req, res, next) => {
  try {
    const raw = req.headers.authorization || "";
    const token = raw.startsWith("Bearer ") ? raw.slice(7) : null;

    if (!token) return http.unauthorized(res, "Vui lòng đăng nhập để truy cập");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return http.unauthorized(res, "Token không hợp lệ hoặc đã hết hạn");
    }

    const ma_nguoi_dung = decoded?.ma_nguoi_dung || decoded?.sub;
    if (!ma_nguoi_dung)
      return http.unauthorized(res, "Token thiếu thông tin người dùng");

    const user = await prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung },
      select: {
        ma_nguoi_dung: true,
        ten_dang_nhap: true,
        ten_nguoi_dung: true,
        vai_tro: true,
      },
    });

    if (!user) return http.unauthorized(res, "User không tồn tại");

    req.user = {
      ma_nguoi_dung: user.ma_nguoi_dung,
      ten_dang_nhap: user.ten_dang_nhap,
      ten_nguoi_dung: user.ten_nguoi_dung,
      role: user.vai_tro,
    };

    return next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(500).json({ success: false, message: "Lỗi xác thực" });
  }
};

exports.allow =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) return http.unauthorized(res);
    if (roles.length === 0 || roles.includes(req.user.role)) return next();
    return http.forbidden(res, "Bạn không có quyền truy cập tài nguyên này");
  };
