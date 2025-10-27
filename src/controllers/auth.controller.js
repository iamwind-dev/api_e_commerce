const { hashPassword, comparePassword } = require("@utils/password");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("@utils/jwt");
const { setRefreshCookie, clearRefreshCookie } = require("@utils/cookie");
const {
  createUserWithRole,
  findUserByUsername,
  getUserById,
} = require("@repositories/user.repo");

// REGISTER
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

    const hashed = await hashPassword(mat_khau);

    const created = await createUserWithRole({
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

    const payload = {
      sub: created.ma_nguoi_dung,
      ma_nguoi_dung: created.ma_nguoi_dung,
      vai_tro: created.role,
      ten_dang_nhap: created.ten_dang_nhap,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({
      sub: payload.sub,
      ten_dang_nhap: payload.ten_dang_nhap,
    });
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({ data: payload, token: accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Lỗi hệ thống" });
  }
};

// LOGIN
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

    const ok = await comparePassword(mat_khau, user.mat_khau);
    if (!ok)
      return res.status(401).json({ message: "Sai thông tin đăng nhập" });

    const payload = {
      sub: user.ma_nguoi_dung,
      ma_nguoi_dung: user.ma_nguoi_dung,
      vai_tro: user.vai_tro,
      ten_dang_nhap,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({
      sub: payload.sub,
      ten_dang_nhap: payload.ten_dang_nhap,
    });
    setRefreshCookie(res, refreshToken);

    return res.json({ data: payload, token: accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// ME
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

// REFRESH ACCESS TOKEN
exports.refresh = async (req, res) => {
  try {
    const rt = req.cookies?.rt;
    if (!rt) return res.status(401).json({ message: "Missing refresh token" });

    let decoded;
    try {
      decoded = verifyRefreshToken(rt);
    } catch {
      return res.status(401).json({ message: "Invalid/expired refresh token" });
    }

    const me = await getUserById(decoded.sub);
    if (!me) return res.status(401).json({ message: "User not found" });

    const payload = {
      sub: me.ma_nguoi_dung,
      ma_nguoi_dung: me.ma_nguoi_dung,
      vai_tro: me.vai_tro,
      ten_dang_nhap: me.ten_dang_nhap,
    };

    const newAT = signAccessToken(payload);
    const newRT = signRefreshToken({
      sub: payload.sub,
      ten_dang_nhap: payload.ten_dang_nhap,
    });
    setRefreshCookie(res, newRT);

    return res.json({ token: newAT });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// LOGOUT
exports.logout = async (_req, res) => {
  clearRefreshCookie(res);
  return res.json({ message: "Đã đăng xuất" });
};
