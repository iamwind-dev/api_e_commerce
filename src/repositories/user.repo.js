const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function genId(len, prefix = "") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let core = "";
  for (let i = 0; i < len - prefix.length; i++) {
    core += chars[Math.floor(Math.random() * chars.length)];
  }
  return prefix + core;
}

async function createUserWithRole(payload) {
  const {
    ten_dang_nhap,
    mat_khau,
    ten_nguoi_dung,
    gioi_tinh,
    so_tai_khoan,
    ngan_hang,
    sdt,
    dia_chi,
    role,
    bien_so_xe,
    phuong_tien,
    ten_gian_hang,
    ma_cho,
    ma_quan_ly,
    vi_tri,
  } = payload;
  return prisma.$transaction(async (tx) => {
    const ma_nguoi_dung = await genId(6, "ND");

    const user = await tx.nguoi_dung.create({
      data: {
        ma_nguoi_dung,
        ten_dang_nhap,
        ten_nguoi_dung,
        mat_khau,
        vai_tro: role,
        gioi_tinh: gioi_tinh || "M",
        so_tai_khoan: so_tai_khoan || "",
        ngan_hang: ngan_hang || "",
        sdt: sdt || "",
        dia_chi: dia_chi || "",
        tinh_trang: false,
      },
    });

    if (role === "nguoi_mua") {
      await tx.nguoi_mua.create({
        data: {
          ma_nguoi_mua: await genId(8, "NM"),
          ma_nguoi_dung: user.ma_nguoi_dung,
          can_nang: null,
          chieu_cao: null,
        },
      });
    } else if (role === "shipper") {
      if (!bien_so_xe) throw new Error("Thiếu bien_so_xe cho shipper");
      await tx.shipper.create({
        data: {
          ma_shipper: await genId(8, "SP"),
          ma_nguoi_dung: user.ma_nguoi_dung,
          bien_so_xe,
          phuong_tien: phuong_tien || null,
        },
      });
    } else if (role === "gian_hang") {
      if (!ten_gian_hang || !ma_cho || !vi_tri) {
        const e = new Error(
          "Thiếu thông tin bắt buộc cho gian_hang (ten_gian_hang, ma_cho, vi_tri)"
        );
        e.status = 400;
        throw e;
      }

      const cho = await tx.cho_table.findFirst({ where: { ma_cho } });
      if (!cho) {
        const e = new Error("ma_cho không tồn tại");
        e.status = 400;
        throw e;
      }

      if (
        typeof ma_quan_ly !== "undefined" &&
        ma_quan_ly !== null &&
        ma_quan_ly !== ""
      ) {
        const ql = await tx.quan_ly_cho.findFirst({ where: { ma_quan_ly } });
        if (!ql) {
          const e = new Error("ma_quan_ly không tồn tại");
          e.status = 400;
          throw e;
        }
      }

      const maGH = await genId(8, "GH");

      await tx.gian_hang.create({
        data: {
          ma_gian_hang: maGH,
          ten_gian_hang,
          vi_tri,
          hinh_anh: null,
          danh_gia_tb: null,
          ngay_dang_ky: new Date(),
          nguoi_dung: { connect: { ma_nguoi_dung: user.ma_nguoi_dung } },
          cho_table: { connect: { ma_cho } },
          quan_ly_cho: { connect: { ma_quan_ly } },
        },
      });
    }

    return {
      ma_nguoi_dung: user.ma_nguoi_dung,
      ten_dang_nhap: user.ten_dang_nhap,
      role,
    };
  });
}

async function findUserByUsername(ten_dang_nhap) {
  return prisma.nguoi_dung.findFirst({
    where: { ten_dang_nhap },
    select: {
      ma_nguoi_dung: true,
      mat_khau: true,
      ten_nguoi_dung: true,
      vai_tro: true,
      ten_dang_nhap: true,
    },
  });
}

async function getUserById(ma_nguoi_dung) {
  return prisma.nguoi_dung.findUnique({
    where: { ma_nguoi_dung },
    select: {
      ma_nguoi_dung: true,
      ten_dang_nhap: true,
      ten_nguoi_dung: true,
      vai_tro: true,
      gioi_tinh: true,
      sdt: true,
      dia_chi: true,
    },
  });
}

module.exports = {
  prisma,
  genId,
  createUserWithRole,
  findUserByUsername,
  getUserById,
};
