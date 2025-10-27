// src/controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  createUserWithRole,
  findUserByUsername,
  getUserById,
} = require("../repositories/user.repo");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.register = async (req, res) => {
  try {
    const {
      ten_dang_nhap,
      mat_khau,
      ten_nguoi_dung,
      role,
      gioi_tinh,
      so_tai_khoan,
      ngan_hang,
      sdt,
      dia_chi,
      bien_so_xe,
      phuong_tien,
      ten_gian_hang,
      ma_cho,
      ma_quan_ly,
      vi_tri,
    } = req.body || {};

    if (!ten_dang_nhap || !mat_khau || !ten_nguoi_dung) {
      return res
        .status(400)
        .json({ message: "thiếu ten_dang_nhap / mat_khau / ten_nguoi_dung" });
    }
    if (!["nguoi_mua", "shipper", "gian_hang"].includes(role)) {
      return res.status(400).json({ message: "role không hợp lệ" });
    }

    const existed = await findUserByUsername(ten_dang_nhap);
    if (existed)
      return res.status(409).json({ message: "ten_dang_nhap đã tồn tại" });

    const hashed = await bcrypt.hash(mat_khau, 10);

    const data = await createUserWithRole({
      ten_dang_nhap,
      mat_khau: hashed,
      ten_nguoi_dung,
      role,
      gioi_tinh,
      so_tai_khoan,
      ngan_hang,
      sdt,
      dia_chi,
      bien_so_xe,
      phuong_tien,
      ten_gian_hang,
      ma_cho,
      ma_quan_ly,
      vi_tri,
    });

    const token = signToken({
      sub: data.ma_nguoi_dung,
      ma_nguoi_dung: data.ma_nguoi_dung,
      vai_tro: data.role,
      ten_dang_nhap: data.ten_dang_nhap,
    });

    return res.status(201).json({ data, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Lỗi hệ thống" });
  }
};

exports.login = async (req, res) => {
  try {
    const { ten_dang_nhap, mat_khau } = req.body || {};
    if (!ten_dang_nhap || !mat_khau) {
      return res
        .status(400)
        .json({ message: "thiếu ten_dang_nhap / mat_khau" });
    }

    const user = await findUserByUsername(ten_dang_nhap);
    if (!user)
      return res.status(401).json({ message: "Sai thông tin đăng nhập" });

    const ok = await bcrypt.compare(mat_khau, user.mat_khau);
    if (!ok)
      return res.status(401).json({ message: "Sai thông tin đăng nhập" });

    const token = signToken({
      sub: user.ma_nguoi_dung,
      ma_nguoi_dung: user.ma_nguoi_dung,
      vai_tro: user.vai_tro,
      ten_dang_nhap,
    });

    return res.json({
      data: {
        ma_nguoi_dung: user.ma_nguoi_dung,
        ten_dang_nhap,
        vai_tro: user.vai_tro,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

exports.me = async (req, res) => {
  try {
    const me = await getUserById(req.user.ma_nguoi_dung);
    if (!me)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    return res.json({ data: me });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
