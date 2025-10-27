const Joi = require("joi");

const strongPassword = Joi.string()
  .min(8)
  .max(128)
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  .message("mat_khau cần tối thiểu 8 ký tự và có cả chữ lẫn số");

const register = Joi.object({
  ten_dang_nhap: Joi.string().min(3).max(50).required(),
  mat_khau: strongPassword.required(),
  ten_nguoi_dung: Joi.string().min(1).max(100).required(),
  role: Joi.string().valid("nguoi_mua", "shipper", "gian_hang").required(),

  gioi_tinh: Joi.string().valid("M", "F").optional(),
  so_tai_khoan: Joi.when("role", {
    is: Joi.valid("shipper", "gian_hang"),
    then: Joi.string().min(6).required(),
    otherwise: Joi.string().allow("", null),
  }),
  ngan_hang: Joi.when("role", {
    is: Joi.valid("shipper", "gian_hang"),
    then: Joi.string().min(2).required(),
    otherwise: Joi.string().allow("", null),
  }),
  sdt: Joi.string().allow("", null),
  dia_chi: Joi.string().allow("", null),

  bien_so_xe: Joi.when("role", {
    is: "shipper",
    then: Joi.string().min(5).max(12).required(),
    otherwise: Joi.forbidden(),
  }),
  phuong_tien: Joi.when("role", {
    is: "shipper",
    then: Joi.string().allow("", null),
    otherwise: Joi.forbidden(),
  }),

  ten_gian_hang: Joi.when("role", {
    is: "gian_hang",
    then: Joi.string().min(2).required(),
    otherwise: Joi.forbidden(),
  }),
  ma_cho: Joi.when("role", {
    is: "gian_hang",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  ma_quan_ly: Joi.when("role", {
    is: "gian_hang",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),

  vi_tri: Joi.when("role", {
    is: "gian_hang",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
});

const login = Joi.object({
  ten_dang_nhap: Joi.string().required(),
  mat_khau: Joi.string().required(),
});

module.exports = { register, login };
