/* eslint-disable no-unused-vars */
module.exports = (err, req, res, next) => {
  if (err?.status && typeof err.status === "number") {
    return res
      .status(err.status)
      .json({ success: false, message: err.message });
  }

  if (err?.code?.startsWith?.("P")) {
    const map = {
      P2002: { status: 409, message: "Unique constraint violation" },
      P2003: { status: 409, message: "Foreign key constraint failed" },
      P2025: { status: 404, message: "Record not found" },
    };
    const hit = map[err.code];
    return res.status(hit?.status || 400).json({
      success: false,
      message: hit?.message || "Prisma error",
      code: err.code,
      meta: err.meta,
    });
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
};
